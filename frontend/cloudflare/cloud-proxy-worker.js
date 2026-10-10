/**
 * Cloudflare Worker：给云数据库做「同源中转」，解决 GitHub Pages 上的 CORS 死结。
 *
 * ── 为什么需要它（实测结论，2026-10-10）──────────────────────────────────
 * 云服务对 **Origin 有白名单**，且只认它自己的保留域。实测三种情况：
 *     不带 Origin（服务端调用）        → OK
 *     Origin = ctf-writeup-blog.app.workbuddy.host → OK
 *     Origin = heliumsenbrg.github.io  → access_denied
 *                                        "the request origin is not allowed for this client"
 * 所以站点放在 GitHub Pages 上时，浏览器发的跨域请求必被拒。
 *
 * 这个 Worker 的做法是：
 *     浏览器 ──(同源/带 CORS 头)──> Worker ──(去掉 Origin，服务端调用)──> 云数据库
 * Worker 自己加回 `Access-Control-Allow-Origin`，只放行白名单里的站点。
 *
 * ── 它比直连好在哪 ────────────────────────────────────────────────────
 *   ① 直接解决 CORS，GitHub Pages 不用搬家；
 *   ② 可以**收紧**来源：只有 ALLOWED_ORIGINS 里的站点能用这个接口
 *      （后端自己的白名单管不到 GitHub Pages，这里补上）；
 *   ③ 只放行 `/.cloud/` 路径，不会变成任意网站代理被别人白嫖；
 *   ④ 以后要加 Turnstile 人机校验、限流，都在这一层加，不用动前端代码结构。
 *
 * ── 部署（三步，都需要你的 Cloudflare 账号，免费额度足够）───────────────
 *   1) 装并登录：  npm i -g wrangler   &&   wrangler login
 *   2) 在本目录（frontend/cloudflare/）发布：  wrangler deploy
 *      发布后会得到一个 https://ctf-blog-cloud-proxy.<你的子域>.workers.dev
 *   3) 把前端指过去：构建时设环境变量
 *        VITE_CLOUD_ENDPOINT=https://ctf-blog-cloud-proxy.<你的子域>.workers.dev
 *      （cloud.js 会优先用这个变量；不设则回落到直连地址，行为不变）
 *
 * 放在 frontend/ 里而不是仓库根，是为了让 vitest 能直接 import 它跑单测
 * （Vite 不允许解析项目根之外的文件）。单测见 tests/cloud-proxy.test.jsx。
 *
 * 另外记得在 Workers 的「Settings → Variables」里把 ALLOWED_ORIGINS 想改就改；
 * 现在默认已经写了博客的两个域名。
 *
 * ── 想再加一层反垃圾？──────────────────────────────────────────────────
 * 可以在下面 `verifyHuman()` 里接 Cloudflare Turnstile（免费）：
 * 前端挂上 widget 拿到 token，Worker 调
 *   https://challenges.cloudflare.com/turnstile/v0/siteverify
 * 校验通过才转发。这比关键词过滤强得多 —— 关键词只能挡已知词，CAPTCHA 挡的是机器人本身。
 */

// 后端数据面（用云服务 publicConfig 里的 endpoint，不要改）
const BACKEND = 'https://ctf-writeup-blog.app.workbuddy.host'

// 允许调用这个中转的站点（Origin 必须精确匹配，带协议、不带尾斜杠）
const ALLOWED_ORIGINS = [
  'https://heliumsenbrg.github.io',           // GitHub Pages
  'https://ctf-writeup-blog-omega.vercel.app', // Vercel 镜像
  // 若以后用 WorkBuddy 发布站点，这里还要加上发布域
]

// 允许透传的请求头（其余一律丢掉，避免把浏览器的隐私头带给后端）
//
// ⚠️ `x-wb-webapp-access-key` 是**必须的** —— SDK 就是用这个自定义头带 publishableKey 的
//    （不是 `apikey`）。实测：
//      只发 apikey             → 401 invalid_client
//      发 x-wb-webapp-access-key → 200
//    漏了它，Worker 会把这个头剃掉，后端必然 401。
//    它同时必须出现在 Access-Control-Allow-Headers 里，否则浏览器预检直接失败。
const FORWARD_HEADERS = [
  'x-wb-webapp-access-key',
  'apikey',
  'authorization',
  'content-type',
  'accept',
  'prefer',
  'x-client-info',
  'range',
]

// Turnstile 的 token 由一个**只在浏览器↔Worker 之间使用**的头传递：
// 它必须出现在 Allow-Headers 里（否则预检失败），但**不能转发给后端** ——
// 后端不需要它，没必要让它多经一手。
const TURNSTILE_HEADER = 'x-turnstile-token'

const ALLOW_HEADERS = [...FORWARD_HEADERS, TURNSTILE_HEADER]

// 需要让前端读到的响应头。PostgREST 把总数放在 Content-Range 里，
// 不 expose 的话浏览器拿不到（之前 {count:'exact'} 取不到数就是这个原因）。
const EXPOSE_HEADERS = 'Content-Range, Content-Location, X-Total-Count'

// 需要人机校验的方法：读请求放行（读本来就没有滥用价值，且公开数据）
const WRITE_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE'])

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * 人机校验（Cloudflare Turnstile）。
 *
 * 密钥通过 `wrangler secret put TURNSTILE_SECRET` 配置；**没配时会降级放行**，
 * 并在响应头里标 `X-Turnstile: disabled`、在 Worker 日志里警告。
 * 之所以选"降级放行"而不是"直接拒绝"：这样你可以先把中转跑起来
 * （此时评论已经能用了），之后再补 Turnstile，不会中途把发帖功能锁死。
 * 配了密钥就**强制校验**，没有 token 一律拒。
 *
 * @returns {Promise<{ok: boolean, skipped?: boolean, reason?: string}>}
 */
async function verifyHuman(request, env) {
  const secret = env && env.TURNSTILE_SECRET
  if (!secret) return { ok: true, skipped: true }
  if (!WRITE_METHODS.has(request.method)) return { ok: true, skipped: true }

  const token = request.headers.get(TURNSTILE_HEADER) || ''
  if (!token) return { ok: false, reason: 'missing_token' }

  try {
    const form = new FormData()
    form.append('secret', secret)
    form.append('response', token)
    const ip = request.headers.get('CF-Connecting-IP')
    if (ip) form.append('remoteip', ip)

    const res = await fetch(SITEVERIFY, { method: 'POST', body: form })
    const data = await res.json().catch(() => ({}))
    if (data && data.success) return { ok: true }
    const codes = (data && data['error-codes']) || []
    return { ok: false, reason: codes.join(',') || 'verify_failed' }
  } catch (e) {
    // 连不上 Cloudflare 校验端点：宁可放行也不要把发帖能力整体掐死
    // （数据面上还有服务端反垃圾兜着，见 db/moderation.sql）
    return { ok: true, skipped: true, reason: 'siteverify_unreachable:' + String(e && e.message) }
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const origin = request.headers.get('Origin') || ''
    const originAllowed = ALLOWED_ORIGINS.includes(origin)

    // 命中白名单才回 CORS 头；不在白名单就不给 ACAO，浏览器自然读不到响应
    const cors = originAllowed
      ? {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
          // 必须包含 TURNSTILE_HEADER，否则浏览器预检会拒掉这个自定义头
          'Access-Control-Allow-Headers': ALLOW_HEADERS.join(', '),
          'Access-Control-Expose-Headers': EXPOSE_HEADERS,
          'Access-Control-Max-Age': '86400',
          'Vary': 'Origin',
        }
      : { 'Vary': 'Origin' }

    // 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: originAllowed ? 204 : 403, headers: cors })
    }

    if (!originAllowed) {
      return new Response(JSON.stringify({ error: 'origin_not_allowed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...cors },
      })
    }

    // 只当数据面代理，别的路径一律 404 —— 避免被当成开放代理白嫖
    if (!url.pathname.startsWith('/.cloud/')) {
      return new Response(JSON.stringify({ error: 'not_found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...cors },
      })
    }

    // 人机校验：写操作要 token（具体行为见 verifyHuman 的注释）
    const human = await verifyHuman(request, env)
    const guardHeaders = human.skipped ? { ...cors, 'X-Turnstile': 'disabled' } : cors
    if (!human.ok) {
      return new Response(JSON.stringify({ error: 'human_verification_failed', detail: human.reason }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...guardHeaders },
      })
    }

    // 构造转发请求：只保留必要头，**并且去掉 Origin / Referer**
    // 这是整个方案的关键 —— 去掉之后后端看到的是一个"服务端调用"，才放行。
    // TURNSTILE_HEADER 也不在 FORWARD_HEADERS 里，所以不会带给后端。
    const fwd = new Headers()
    for (const name of FORWARD_HEADERS) {
      const v = request.headers.get(name)
      if (v) fwd.set(name, v)
    }

    const target = BACKEND + url.pathname + url.search
    const hasBody = !['GET', 'HEAD'].includes(request.method)

    // 把请求体**缓冲下来**再转发，而不是直接透传 request.body 流。
    // 原因：把 ReadableStream 作为 body 传给 fetch 时，Node/undici 强制要求
    // `duplex: 'half'`，而 Cloudflare Workers 不认这个选项 —— 想同时支持
    // "本地能跑起来验证" 和 "线上能用"，缓冲是最省事且最不容易出岔子的做法。
    // 留言/评论都只有几百字节，缓冲没有代价。
    let body
    if (hasBody) {
      try {
        body = await request.arrayBuffer()
      } catch {
        body = undefined
      }
    }

    let upstream
    try {
      upstream = await fetch(target, {
        method: request.method,
        headers: fwd,
        body,
      })
    } catch (e) {
      return new Response(JSON.stringify({ error: 'upstream_unreachable', detail: String(e && e.message) }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...cors },
      })
    }

    const out = new Headers(upstream.headers)
    // 清掉上游可能带回来的 CORS 头，统一由这里决定
    for (const k of ['Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Credentials']) {
      out.delete(k)
    }
    for (const [k, v] of Object.entries(cors)) out.set(k, v)
    // 降级放行时在成功响应上也要标出来 —— 否则"Turnstile 到底生效没有"
    // 只能靠翻 Worker 日志，加了这个头看一眼 Network 就清楚。
    if (human.skipped) out.set('X-Turnstile', 'disabled')

    return new Response(upstream.body, { status: upstream.status, headers: out })
  },
}
