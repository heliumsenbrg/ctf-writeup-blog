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

// 需要让前端读到的响应头。PostgREST 把总数放在 Content-Range 里，
// 不 expose 的话浏览器拿不到（之前 {count:'exact'} 取不到数就是这个原因）。
const EXPOSE_HEADERS = 'Content-Range, Content-Location, X-Total-Count'

// 以后接入 Turnstile 时在这里校验；现在直接放行
async function verifyHuman(_request) {
  return true
}

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const origin = request.headers.get('Origin') || ''
    const originAllowed = ALLOWED_ORIGINS.includes(origin)

    // 命中白名单才回 CORS 头；不在白名单就不给 ACAO，浏览器自然读不到响应
    const cors = originAllowed
      ? {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': FORWARD_HEADERS.join(', '),
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

    if (!(await verifyHuman(request))) {
      return new Response(JSON.stringify({ error: 'human_verification_failed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...cors },
      })
    }

    // 构造转发请求：只保留必要头，**并且去掉 Origin / Referer**
    // 这是整个方案的关键 —— 去掉之后后端看到的是一个"服务端调用"，才放行。
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

    return new Response(upstream.body, { status: upstream.status, headers: out })
  },
}
