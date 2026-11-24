/**
 * 云数据库「同源中转」—— 跑在 WorkBuddy 托管域上的版本（国内可达）
 *
 * ── 为什么需要它 ──────────────────────────────────────────────────────
 * 云服务对 **Origin 有白名单**，只认它自己的保留域：
 *     不带 Origin（服务端调用）                    → 200 OK
 *     Origin = ctf-writeup-blog.app.workbuddy.host → 200 OK
 *     Origin = heliumsenbrg.github.io              → 403 access_denied
 * 博客放在 GitHub Pages 上，浏览器发的跨域请求必被拒。
 *
 * 原本的方案是 Cloudflare Worker（已废弃，2026-11-23 删除该目录），但实测
 * **`*.workers.dev` 在国内被 DNS 污染 + SNI 阻断**，代理也救不回来 ——
 * 对国内访客等于没修。所以改把同样的逻辑跑在**国内可达**的托管域上。
 *
 *    浏览器 ──(本站返回 CORS 头)──> 本中转 ──(去掉 Origin，服务端调用)──> 云数据库
 *
 * ── 安全边界（重要）──────────────────────────────────────────────────
 *   ① 只放行 `/.cloud/` 开头的路径 —— 不会变成任意网站代理被白嫖
 *   ② 只对 ALLOWED_ORIGINS 里的站点回 CORS 头 —— 别的来源浏览器侧读不到
 *   ③ Origin 头**绝不转发**（这是能打通的前提），其余隐私头也一律剃掉
 *   ④ 可选：配了 TURNSTILE_SECRET 就强制人机校验（没配则降级放行）
 *
 * ── 运行 ──────────────────────────────────────────────────────────────
 *   监听 process.env.PORT（默认 3000），绑 0.0.0.0 —— 托管沙箱的要求。
 *   零依赖：只用 Node 内置模块 + 内置 fetch（Node 18+）。
 */

const http = require('node:http')
const https = require('node:https')
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const { URL } = require('node:url')

// 本地/部署环境的 .env（只放 TURNSTILE_SECRET 等运行态秘密，不提交仓库）。
// 平台发布不会自动注入环境变量，因此这里做最小加载器；已在环境里的值优先。
try {
  const lines = fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2]
  }
} catch { /* 没有 .env 时保持进程环境原样 */ }

// ── 主动清掉代理环境变量 ────────────────────────────────────────────────
// 实测教训（2026-10-16）：本机跑时中转进程继承了沙箱的 http(s)_proxy，
// 于是 fetch 走了那个代理 → 后端连不上 → 所有请求 502「upstream connect failed」。
// 这个中转**永远不需要代理**（后端本身直连可达），所以进程一起来就把它们删掉，
// 免得换到别的托管环境又踩一次。
for (const k of ['http_proxy', 'https_proxy', 'HTTP_PROXY', 'HTTPS_PROXY', 'all_proxy', 'ALL_PROXY', 'NODE_USE_ENV_PROXY']) {
  delete process.env[k]
}

// ── 数据面地址（兜底链）────────────────────────────────────────────────
// 2026-10-20 实测：平台是**按 `x-wb-webapp-access-key` 路由**到云服务的，**与域名无关** ——
// 在任意 WorkBuddy 应用域名上打 `/.cloud/`，只要带对 key 就能拿到数据（不带 key 才 401）。
// 所以这里给一串候选：主域名（博客应用）不可用时自动退化到中转自己的域名。
// 这样即使博客的旧镜像被下线，留言板也不会跟着死。
const BACKENDS = (process.env.BACKENDS || [
  'https://ctf-writeup-blog.app.workbuddy.host',
  'https://cloud-relay.app.workbuddy.host',
].join(',')).split(',').map((s) => s.trim()).filter(Boolean)

/** 允许调用这个中转的站点（Origin 必须精确匹配：带协议、不带尾斜杠） */
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || [
  'https://heliumsenbrg.github.io',
  'https://ctf-writeup-blog-omega.vercel.app',
].join(',')).split(',').map((s) => s.trim()).filter(Boolean)

/** 允许透传的请求头（其余一律丢掉）。`x-wb-webapp-access-key` 是必须的——SDK 用它带 publishableKey
 *
 * ⚠️ 刻意**不含 `authorization`**：托管平台的边缘层会给入站请求注入它自己的
 * `Authorization: Bearer <平台会话 JWT>`（诊断路由实测抓到），转发过去后端会回
 * 401 invalid_grant「the session is invalid, expired or issued for another client」。
 * 本站的留言板是匿名场景，只靠 `x-wb-webapp-access-key` 就够；若以后要接登录态，
 * 得先想清楚怎么把"用户的令牌"和"平台注入的令牌"区分开。
 */
const FORWARD_HEADERS = [
  'x-wb-webapp-access-key',
  'content-type',
  'accept',
  'prefer',
  'x-client-info',
  'range',
  // 用户令牌（自定义头，见下方 userToken()）。**刻意不转发 authorization**：
  // 托管平台的边缘层会给入站请求注入它自己的 Authorization，转发出去云认证会回
  // invalid_grant「issued for another client」（2026-11-09 实测复现）。
  'x-wb-user-token',
]

/** Turnstile token 只在浏览器↔中转之间用，不进后端 */
const TURNSTILE_HEADER = 'x-turnstile-token'
const ALLOW_HEADERS = [...FORWARD_HEADERS, TURNSTILE_HEADER]

/** 前端要读的响应头（PostgREST 把总数放 Content-Range 里） */
const EXPOSE_HEADERS = 'Content-Range, Content-Location, X-Total-Count'

// ── 路径前缀：为什么不是直接用 /.cloud/ ─────────────────────────────────
// 实测（2026-10-16，部署到托管域后才发现）：
//   托管平台**自己会拦截 `/.cloud/` 开头的路径**，直接转给云服务（带着客户端的 Origin）
//   → 浏览器一发（必带 Origin）就被云服务 403 access_denied，**我的应用根本没收到请求**。
//   证据：`/.cloud/xxx` 带 Origin → 云服务的 403；`/api/.cloud/xxx` 带 Origin → 我的应用答复。
// 所以对外统一用 `/api/.cloud/…`，应用内部再把 `/api` 剥掉，还原成 `/.cloud/…` 转给后端。
// 前端的 endpoint 要写成 `https://<中转域名>/api`，SDK 会拼成 `/api/.cloud/database/rest/...`。
const PATH_PREFIX = process.env.PATH_PREFIX || '/api'

/** 需要人机校验的方法（读请求放行） */
const WRITE_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE'])
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

const ALLOW_METHODS = 'GET, POST, PATCH, PUT, DELETE, OPTIONS'

// 只放行博客实际使用的三张表。原实现放行整个 /.cloud/，
// 等于把云应用的 OpenAPI、LLM 等端点也交给任何拿到公开 key 的人。
// 表接口只认精确路径（查询串不在 pathname 里，不受影响）；
// auth 只认 v1 —— SDK 里根本不存在 v2，放 v2 等于给未知路由开门（2026-11-24 审计）
const ALLOWED_REST = /^\/\.cloud\/(?:database\/rest\/(?:guestbook|comments|quest_board)$|auth\/v1(?:\/|$))/

// 请求体上限：防止超大 POST 把中转进程内存打满
const MAX_BODY = Number(process.env.MAX_BODY_BYTES || 64 * 1024)
// 写接口每 IP 每分钟上限（粗粒度，真正的反垃圾仍在数据库触发器里）
const WRITE_LIMIT = Number(process.env.WRITE_LIMIT_PER_MIN || 20)
const writeBuckets = new Map()

function clientIp(req) {
  const xff = req.headers['x-forwarded-for']
  const list = (Array.isArray(xff) ? xff.join(',') : String(xff || ''))
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  // 取**最右**一跳：最左那一段是客户端自己写的，随手就能伪造；最右是最近一层代理追加的。
  // 若平台是覆盖写（只有一个值），最右就是它，行为不变（2026-11-24 审计）。
  if (list.length) return list[list.length - 1]
  return req.socket.remoteAddress || 'unknown'
}

function writeRateLimited(ip) {
  const now = Date.now()
  const b = writeBuckets.get(ip)
  if (!b || now - b.start > 60_000) {
    writeBuckets.set(ip, { start: now, count: 1 })
    capBuckets(writeBuckets)
    return false
  }
  b.count++
  return b.count > WRITE_LIMIT
}

// 验证码按收件人单独限流：避免同一手机号/邮箱被反复轰炸（前端 60s 可绕过）。
const OTP_LIMIT = Number(process.env.OTP_LIMIT_PER_10MIN || 5)
// 再加一道**全局配额**：平台侧不给限流配置（短信/邮件闸门不在我们的合同里），
// 光靠"按收件人"能被换号 + 换 IP 绕过，把短信费刷穿。全局配额把总量钉死，
// 代价只是极端情况下正常访客可能排队，个人站点这个值足够宽松。
const OTP_GLOBAL_LIMIT = Number(process.env.OTP_GLOBAL_LIMIT_PER_10MIN || 30)
const OTP_WINDOW_MS = 10 * 60 * 1000
const otpBuckets = new Map()
let otpGlobal = { start: 0, count: 0 }

/**
 * 收件人归一化：同一个收件人的不同写法必须落进同一个桶，否则限流等于没有。
 * 2026-11-24 审计：`Victim@qq.com`、`victim@qq.com `、`+86138…`、`138…` 各算一个人，
 * 每人 5 次额度，实际只剩全局配额兜底。
 * （+ 号别名、Gmail 点号这类仍能分出变体，属已知残余；不额外归一化是为了不把不同用户并成一个。）
 */
function normRecipient(raw) {
  let s = String(raw).trim().toLowerCase().replace(/[\s\-()]/g, '')
  if (!s.includes('@')) s = s.replace(/^(?:\+86|0086|86)(?=1[3-9]\d{9}$)/, '')
  return s
}

function otpKey(body) {
  try {
    const data = JSON.parse(body.toString('utf8'))
    const raw = normRecipient(data.email || data.phone || '')
    if (!raw) return ''
    // 只把哈希留在内存里，不在日志/内存桶里保存手机号或邮箱明文
    return crypto.createHash('sha256').update(raw).digest('hex')
  } catch {
    return ''
  }
}

/**
 * 桶表上限：超了按插入顺序丢最旧的一批（Map 保序，O(1) 摊销）。
 * 原来是 size>5000 时全表扫一遍找过期的 —— 攻击者用大量不同的 key 能让
 * 每个新 key 都触发一次 O(n) 扫描（2026-11-24 审计）。
 */
function capBuckets(map, max = 5000) {
  if (map.size <= max) return
  let drop = map.size - max
  for (const k of map.keys()) {
    map.delete(k)
    if (--drop <= 0) break
  }
}

/**
 * 返回 false = 放行；'global' / 'recipient' = 被哪一道配额挡住。
 * 只在 Turnstile 通过之后调用，所以这里的计数是"真人/已过验证"的发码量。
 */
function otpRateLimited(key) {
  const now = Date.now()
  if (now - otpGlobal.start > OTP_WINDOW_MS) otpGlobal = { start: now, count: 0 }
  otpGlobal.count++
  if (otpGlobal.count > OTP_GLOBAL_LIMIT) return 'global'

  const b = otpBuckets.get(key)
  if (!b || now - b.start > OTP_WINDOW_MS) {
    otpBuckets.set(key, { start: now, count: 1 })
    capBuckets(otpBuckets)
    return false
  }
  b.count++
  return b.count > OTP_LIMIT ? 'recipient' : false
}

/** 仅当来源在白名单内才回 CORS 头；不在则不给 —— 浏览器侧读不到内容 */
function corsHeaders(origin) {
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': ALLOW_METHODS,
    'Access-Control-Allow-Headers': ALLOW_HEADERS.join(', '),
    'Access-Control-Max-Age': '86400',
    'Access-Control-Expose-Headers': EXPOSE_HEADERS,
    Vary: 'Origin',
  }
}

/** 人机校验：配了密钥就强制；没配/连不上校验端点则降级放行（数据面还有服务端反垃圾兜底） */
async function verifyHuman(req, cloudPath) {
  const secret = process.env.TURNSTILE_SECRET
  // 只认「发送验证码」这一条，末尾斜杠变体也纳入守卫（2026-11-24 审计）
  const isAuthVerify = /^\/\.cloud\/auth\/v1\/verification\/?$/.test(cloudPath)
  if (!secret) {
    // 登录的发码接口必须 fail-closed：没配 secret 就明确拒绝，不能静默放行。
    if (isAuthVerify) return { ok: false, reason: 'turnstile_not_configured' }
    return { ok: true, skipped: true }
  }
  if (!WRITE_METHODS.has(req.method)) return { ok: true, skipped: true }
  // 认证接口只在「发送验证码」时要求 Turnstile；后续验证/登录不再重复校验，
  // 因为 Turnstile token 是一次性的，重复用必然失败。
  if (cloudPath.startsWith('/.cloud/auth/') && !isAuthVerify) {
    return { ok: true, skipped: true }
  }
  const token = req.headers[TURNSTILE_HEADER] || ''
  if (!token) return { ok: false, reason: 'missing_token' }
  try {
    const form = new URLSearchParams({ secret, response: token })
    const res = await fetch(SITEVERIFY, { method: 'POST', body: form })
    const data = await res.json().catch(() => ({}))
    return data && data.success ? { ok: true } : { ok: false, reason: (data['error-codes'] || []).join(',') || 'verify_failed' }
  } catch (e) {
    // 连不上 Cloudflare 时**不能**放行发码：否则只要掐断到 siteverify 的网络就等于绕过人机验证。
    // 非发码的写操作仍放行（有登录门禁 + 触发器限流兜底）。
    if (isAuthVerify) return { ok: false, reason: 'siteverify_unreachable' }
    return { ok: true, skipped: true, reason: 'siteverify_unreachable' }
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let done = false
    req.on('data', (c) => {
      if (done) return
      size += c.length
      if (size > MAX_BODY) {
        done = true
        const err = new Error('body_too_large')
        err.code = 'BODY_TOO_LARGE'
        reject(err)
        // 不 destroy：否则响应 socket 也会被关掉，客户端收到的是连接重置而不是 413。
        // 继续消费（丢弃）剩余数据即可。
        return
      }
      chunks.push(c)
    })
    req.on('end', () => { if (!done) resolve(Buffer.concat(chunks)) })
    req.on('error', reject)
  })
}

/**
 * 调后端 —— **刻意用 node:https 而不是 fetch**。
 *
 * 实测（2026-10-16）：托管沙箱会包装 global fetch，把**客户端请求里的 Origin**
 * 一并带到出站请求上。于是浏览器（一定会带 Origin）经中转打后端时，后端看到的
 * 仍是一个不在白名单里的 Origin → 403 access_denied，白中转一场。
 * 用 https.request 自己发原始请求，Origin / Referer 由我们说了算（= 根本不发）。
 */
function upstreamRequest(base, pathWithQuery, method, headers, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(base + pathWithQuery)
    const req2 = https.request(
      {
        hostname: u.hostname,
        port: u.port || 443,
        path: u.pathname + u.search,
        method,
        headers: { ...headers, host: u.hostname },
      },
      (res2) => {
        const chunks = []
        res2.on('data', (c) => chunks.push(c))
        res2.on('end', () => resolve({ status: res2.statusCode, headers: res2.headers, body: Buffer.concat(chunks) }))
      }
    )
    req2.setTimeout(25000, () => req2.destroy(new Error('upstream timeout')))
    req2.on('error', reject)
    if (body && body.length) req2.write(body)
    req2.end()
  })
}

function send(res, status, headers, body) {
  res.writeHead(status, headers)
  res.end(body)
}

/**
 * 取"用户自己带来的"令牌。
 *
 * ⚠️ **不能用 req.headers.authorization**：托管平台的边缘层会给每个入站请求
 * 注入它自己的 `Authorization: Bearer <平台 JWT>`。转发出去云认证会回
 * `invalid_grant: the session is invalid, expired or issued for another client`
 * —— 2026-11-09 实测：客户端啥都没带，中转照样把它转给后端（并把匿名请求
 * 也变成了"令牌无效"，登录/发码跟着报错）。
 *
 * 所以前端把 SDK 设的 Authorization 搬进 `x-wb-user-token`（原始 token，不带 Bearer），
 * 这里再拼回标准形式；平台不会替客户端设这个头，语义就干净了。
 */
function userToken(req) {
  const raw = String(req.headers['x-wb-user-token'] || '').trim()
  if (!raw) return ''
  const bare = raw.replace(/^Bearer\s+/i, '')
  return /^\S+$/.test(bare) ? bare : ''
}

/** 数据面写操作要求真实登录：拿浏览器带来的用户 token 去 auth /user/me 验一次。
 *  不能只在前端藏表单 —— 直接 POST 中转仍然能绕过。 */
async function verifyUser(req) {
  const token = userToken(req)
  if (!token) return false
  const key = req.headers['x-wb-webapp-access-key']
  const headers = { authorization: 'Bearer ' + token }
  if (key) headers['x-wb-webapp-access-key'] = key
  try {
    const r = await upstreamRequest(BACKENDS[0], '/.cloud/auth/v1/user/me', 'GET', headers, null)
    return r.status === 200
  } catch {
    return false
  }
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || ''
  const cors = corsHeaders(origin)
  const url = new URL(req.url, 'http://localhost')

  // 预检：不需要打到后端，直接回
  if (req.method === 'OPTIONS') {
    if (!cors['Access-Control-Allow-Origin']) return send(res, 403, { 'Content-Type': 'text/plain' }, 'origin not allowed')
    return send(res, 204, cors, '')
  }

  // 非预检请求也要校验来源：只回 CORS 头只能挡住"跨站读取"，挡不住"跨站写入"——
  // 别的站点可以直接 POST 过来，拿不到响应也照样触发写入（2026-10-24 审计）。
  // ⚠️ Origin 是客户端自我声明，脚本可以不带它，所以这里是**提高门槛**不是鉴权。
  //    真正的护栏是下面的 verifyUser（写操作必须带有效用户令牌）+ 数据面 RLS。
  //    2026-11-23 实测三种情况：无 Origin → 401 login_required；伪造 Origin → 403；
  //    白名单 Origin 但未登录 → 401 login_required。即"绕过 Origin"本身拿不到任何东西。
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return send(res, 403, { 'Content-Type': 'application/json; charset=utf-8' },
      JSON.stringify({ error: 'origin_not_allowed' }))
  }

  // 2026-11-24：原 /__diag 诊断路由已删除 —— 它会把入站头（含平台注入的
  // Authorization 与用户令牌）原样回显，即便默认关闭也不该留在生产代码里。

  // 剥掉对外前缀，还原成后端认识的 /.cloud/…
  // 兼容两种入口：/api/.cloud/…（线上，绕开平台拦截）与 /.cloud/…（本地直测）
  let cloudPath = url.pathname
  if (cloudPath === PATH_PREFIX || cloudPath.startsWith(PATH_PREFIX + '/')) {
    cloudPath = cloudPath.slice(PATH_PREFIX.length) || '/'
  }
  // 路径变体一律拒（2026-11-24 审计）：网关若先解码 %2f/%5c，白名单会被绕出；
  // 重复斜杠、`.`/`..` 段也会被不同实现解读成别的路由。合法请求不会长这样。
  if (/%2f|%5c|%2e|%00|\/\/|;|\\/i.test(url.pathname) || url.pathname.split('/').includes('..')) {
    return send(res, 400, { 'Content-Type': 'application/json; charset=utf-8', ...cors },
      JSON.stringify({ error: 'bad_path' }))
  }

  if (!cloudPath.startsWith('/.cloud/')) {
    return send(res, 404, { 'Content-Type': 'application/json; charset=utf-8', ...cors },
      JSON.stringify({ error: 'not_found', hint: `这个中转只转发 ${PATH_PREFIX}/.cloud/ 下的云数据面请求` }))
  }
  if (!ALLOWED_REST.test(cloudPath)) {
    return send(res, 404, { 'Content-Type': 'application/json; charset=utf-8', ...cors },
      JSON.stringify({ error: 'not_found', hint: '只允许 guestbook / comments / quest_board 三张表与 auth 接口' }))
  }

  const isDbWrite = WRITE_METHODS.has(req.method) &&
    /^\/\.cloud\/database\/rest\/(guestbook|comments|quest_board)(?:\/|$)/.test(cloudPath)

  // 写操作必须登录；前端 LoginGate 只是 UX，这里才是服务端门禁。
  if (isDbWrite && !(await verifyUser(req))) {
    return send(res, 401, { 'Content-Type': 'application/json; charset=utf-8', ...cors },
      JSON.stringify({ error: 'login_required', message: '请先登录后再发言' }))
  }

  // 写接口按 IP 限流：超限直接 429，不打到后端
  if (WRITE_METHODS.has(req.method) && writeRateLimited(clientIp(req))) {
    return send(res, 429, { 'Content-Type': 'application/json; charset=utf-8', 'Retry-After': '60', ...cors },
      JSON.stringify({ error: 'rate_limited', retry_after: 60 }))
  }

  // 读请求体（后面既要转发，也要给 OTP 限流解析收件人）
  let body
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      body = await readBody(req)
    } catch (e) {
      if (e && e.code === 'BODY_TOO_LARGE') {
        return send(res, 413, { 'Content-Type': 'application/json; charset=utf-8', ...cors },
          JSON.stringify({ error: 'body_too_large', max_bytes: MAX_BODY }))
      }
      return send(res, 400, { 'Content-Type': 'application/json; charset=utf-8', ...cors },
        JSON.stringify({ error: 'bad_request' }))
    }
  }

  // 人机校验（只对数据库写接口和认证的发送验证码生效）
  const human = await verifyHuman(req, cloudPath)
  if (!human.ok) {
    return send(res, 403, { 'Content-Type': 'application/json; charset=utf-8', ...cors },
      JSON.stringify({ error: 'turnstile_failed', reason: human.reason }))
  }

  // 验证码按收件人限流：放在 Turnstile 之后，避免匿名请求拿别人手机号刷限流
  if (cloudPath.startsWith('/.cloud/auth/') && /\/v1\/verification$/.test(cloudPath)) {
    const key = otpKey(body) || ('ip:' + clientIp(req))
    const limited = otpRateLimited(key)
    if (limited) {
      return send(res, 429, { 'Content-Type': 'application/json; charset=utf-8', 'Retry-After': '600', ...cors },
        JSON.stringify({ error: 'otp_rate_limited', scope: limited, retry_after: 600, message: '验证码发送太频繁，请稍后再试' }))
    }
  }

  // 拼转发头（Origin / Referer / Cookie 等一律不带）
  const out = {}
  for (const h of FORWARD_HEADERS) if (req.headers[h] !== undefined) out[h] = req.headers[h]
  // Auth 和已登录的数据写入要带用户 token；匿名请求一律不带 ——
  // 绝不能回落到 req.headers.authorization（那是平台注入的，见 userToken()）
  const needsBearer = cloudPath.startsWith('/.cloud/auth/') || isDbWrite
  const token = needsBearer ? userToken(req) : ''
  if (token) out.authorization = 'Bearer ' + token

  try {
    // sharecode 只是平台发布站点的访问门槛（前端为了过门槛加的），
    // 不能原样转给云数据面 —— PostgREST 会把未知查询参数当错误。
    const fwdQuery = new URLSearchParams(url.search)
    fwdQuery.delete('sharecode')
    const qs = fwdQuery.toString()
    const upstreamPath = cloudPath + (qs ? '?' + qs : '')

    let lastErr = null
    let upstream = null
    for (const base of BACKENDS) {
      try {
        upstream = await upstreamRequest(base, upstreamPath, req.method, out, body)
        break
      } catch (e) {
        lastErr = e
        // 换下一个候选；全部失败才 502
      }
    }
    if (!upstream) throw lastErr || new Error('no backend available')
    const respHeaders = { ...cors, 'X-Relay': 'wb' }
    for (const h of ['content-type', 'content-range', 'content-location', 'x-total-count', 'cache-control']) {
      const v = upstream.headers[h]
      if (v) respHeaders[h] = v
    }
    if (human.skipped && process.env.TURNSTILE_SECRET === undefined) respHeaders['X-Turnstile'] = 'disabled'
    return send(res, upstream.status, respHeaders, upstream.body)
  } catch (e) {
    // 不回显 e.message：里面可能带后端主机名或内网地址，只写服务端日志（2026-11-24 审计）
    console.error('[relay] upstream failed:', String(e && e.message).slice(0, 300))
    return send(res, 502, { 'Content-Type': 'application/json; charset=utf-8', ...cors },
      JSON.stringify({ error: 'relay_upstream_failed' }))
  }
})

const PORT = Number(process.env.PORT || 3000)
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[relay] listening on 0.0.0.0:${PORT}`)
  console.log(`[relay] backends = ${BACKENDS.join(" → ")}`)
  console.log(`[relay] allowed origins = ${ALLOWED_ORIGINS.join(', ')}`)
  console.log(`[relay] turnstile = ${process.env.TURNSTILE_SECRET ? 'on' : 'off (降级放行)'}`)
})
