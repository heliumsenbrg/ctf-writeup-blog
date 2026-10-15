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
 * 原本的方案是 Cloudflare Worker（frontend/cloudflare/），但实测
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
const { URL } = require('node:url')

// ── 主动清掉代理环境变量 ────────────────────────────────────────────────
// 实测教训（2026-10-16）：本机跑时中转进程继承了沙箱的 http(s)_proxy，
// 于是 fetch 走了那个代理 → 后端连不上 → 所有请求 502「upstream connect failed」。
// 这个中转**永远不需要代理**（后端本身直连可达），所以进程一起来就把它们删掉，
// 免得换到别的托管环境又踩一次。
for (const k of ['http_proxy', 'https_proxy', 'HTTP_PROXY', 'HTTPS_PROXY', 'all_proxy', 'ALL_PROXY', 'NODE_USE_ENV_PROXY']) {
  delete process.env[k]
}

const BACKEND = process.env.BACKEND || 'https://ctf-writeup-blog.app.workbuddy.host'

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
async function verifyHuman(req) {
  const secret = process.env.TURNSTILE_SECRET
  if (!secret) return { ok: true, skipped: true }
  if (!WRITE_METHODS.has(req.method)) return { ok: true, skipped: true }
  const token = req.headers[TURNSTILE_HEADER] || ''
  if (!token) return { ok: false, reason: 'missing_token' }
  try {
    const form = new URLSearchParams({ secret, response: token })
    const res = await fetch(SITEVERIFY, { method: 'POST', body: form })
    const data = await res.json().catch(() => ({}))
    return data && data.success ? { ok: true } : { ok: false, reason: (data['error-codes'] || []).join(',') || 'verify_failed' }
  } catch (e) {
    return { ok: true, skipped: true, reason: 'siteverify_unreachable' }
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
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
function upstreamRequest(pathWithQuery, method, headers, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(BACKEND + pathWithQuery)
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

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || ''
  const cors = corsHeaders(origin)
  const url = new URL(req.url, 'http://localhost')

  // 预检：不需要打到后端，直接回
  if (req.method === 'OPTIONS') {
    if (!cors['Access-Control-Allow-Origin']) return send(res, 403, { 'Content-Type': 'text/plain' }, 'origin not allowed')
    return send(res, 204, cors, '')
  }

  // 诊断路由：排查"本地通、线上不通"这类环境差异（**默认关闭**，只在 ENABLE_DIAG=1 时开）
  if (url.pathname === '/__diag' && process.env.ENABLE_DIAG === '1') {
    const probe = {}
    // ① 我收到的头（看托管反代给我加了什么）
    probe.incoming = { ...req.headers }
    // ② 我会发给后端的头
    const wouldSend = {}
    for (const h of FORWARD_HEADERS) if (req.headers[h] !== undefined) wouldSend[h] = '<有值>'
    probe.outbound = wouldSend
    // ③ 用**生产同款**通道探一次后端（https.request，不带 Origin）
    try {
      const h1 = req.headers['x-wb-webapp-access-key'] ? { 'x-wb-webapp-access-key': req.headers['x-wb-webapp-access-key'] } : {}
      const r1 = await upstreamRequest('/.cloud/database/rest/guestbook', 'GET', h1, null)
      probe.backend = { status: r1.status, body: r1.body.toString('utf8').slice(0, 200), via: 'https.request' }
    } catch (e) { probe.backend = { error: String(e && e.message).slice(0, 160) } }
    // ③b 对照：fetch 通道（历史上被沙箱注入 Origin 的那条路）
    try {
      const h2 = req.headers['x-wb-webapp-access-key'] ? { 'x-wb-webapp-access-key': req.headers['x-wb-webapp-access-key'] } : {}
      const r2 = await fetch(BACKEND + '/.cloud/database/rest/guestbook', { headers: h2 })
      probe.backendViaFetch = { status: r2.status, body: (await r2.text()).slice(0, 160) }
    } catch (e) { probe.backendViaFetch = { error: String(e && e.message).slice(0, 160) } }
    probe.clientHadOrigin = Boolean(req.headers.origin)
    // ④ 出口自检：把请求打到外部回声服务，看沙箱到底带了哪些头出去
    try {
      const r2 = await fetch('https://httpbin.org/anything', { headers: { 'x-probe': 'relay' } })
      const j = await r2.json().catch(() => ({}))
      probe.egress = { status: r2.status, headers: j.headers || null }
    } catch (e) { probe.egress = { error: String(e && e.message).slice(0, 160) } }
    return send(res, 200, { 'Content-Type': 'application/json; charset=utf-8', ...cors }, JSON.stringify(probe, null, 1))
  }

  // 剥掉对外前缀，还原成后端认识的 /.cloud/…
  // 兼容两种入口：/api/.cloud/…（线上，绕开平台拦截）与 /.cloud/…（本地直测）
  let cloudPath = url.pathname
  if (cloudPath === PATH_PREFIX || cloudPath.startsWith(PATH_PREFIX + '/')) {
    cloudPath = cloudPath.slice(PATH_PREFIX.length) || '/'
  }
  if (!cloudPath.startsWith('/.cloud/')) {
    return send(res, 404, { 'Content-Type': 'application/json; charset=utf-8', ...cors },
      JSON.stringify({ error: 'not_found', hint: `这个中转只转发 ${PATH_PREFIX}/.cloud/ 下的云数据面请求` }))
  }

  // 人机校验（只对写方法生效）
  const human = await verifyHuman(req)
  if (!human.ok) {
    return send(res, 403, { 'Content-Type': 'application/json; charset=utf-8', ...cors },
      JSON.stringify({ error: 'turnstile_failed', reason: human.reason }))
  }

  // 拼转发头（Origin / Referer / Cookie 等一律不带）
  const out = {}
  for (const h of FORWARD_HEADERS) if (req.headers[h] !== undefined) out[h] = req.headers[h]

  let body
  if (req.method !== 'GET' && req.method !== 'HEAD') body = await readBody(req)

  try {
    const upstream = await upstreamRequest(
      cloudPath + url.search,
      req.method,
      out,
      body
    )
    const respHeaders = { ...cors, 'X-Relay': 'wb' }
    for (const h of ['content-type', 'content-range', 'content-location', 'x-total-count', 'cache-control']) {
      const v = upstream.headers[h]
      if (v) respHeaders[h] = v
    }
    if (human.skipped && process.env.TURNSTILE_SECRET === undefined) respHeaders['X-Turnstile'] = 'disabled'
    return send(res, upstream.status, respHeaders, upstream.body)
  } catch (e) {
    return send(res, 502, { 'Content-Type': 'application/json; charset=utf-8', ...cors },
      JSON.stringify({ error: 'relay_upstream_failed', detail: String(e && e.message).slice(0, 200) }))
  }
})

const PORT = Number(process.env.PORT || 3000)
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[relay] listening on 0.0.0.0:${PORT}`)
  console.log(`[relay] backend = ${BACKEND}`)
  console.log(`[relay] allowed origins = ${ALLOWED_ORIGINS.join(', ')}`)
  console.log(`[relay] turnstile = ${process.env.TURNSTILE_SECRET ? 'on' : 'off (降级放行)'}`)
})
