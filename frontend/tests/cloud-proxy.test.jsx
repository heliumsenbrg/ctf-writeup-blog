import { test, expect, vi, beforeEach, afterEach } from 'vitest'
import worker from '../cloudflare/cloud-proxy-worker.js'

/**
 * Cloudflare Worker（云数据库同源中转）的契约测试。
 *
 * 这几条是整条链路的关键，任何一条坏掉都表现为"评论发不出去"，且很难排查：
 *   ① 必须放行并转发 `x-wb-webapp-access-key` —— SDK 用它带 publishableKey，
 *      漏了就是 401 invalid_client（且必须出现在 Allow-Headers 里，否则预检先失败）
 *   ② 转发前必须**去掉 Origin** —— 后端对 Origin 有白名单，服务端调用才放行
 *   ③ 只给白名单来源回 CORS 头；非白名单来源一律 403
 *   ④ 只代理 /.cloud/ 路径，别变成开放代理
 */

const ALLOWED = 'https://heliumsenbrg.github.io'
const URL_UNDER_TEST = 'https://proxy.example.workers.dev/.cloud/database/rest/guestbook?select=id'

let calls

beforeEach(() => {
  calls = []
  vi.stubGlobal('fetch', vi.fn(async (url, init) => {
    calls.push({ url: String(url), headers: new Headers(init.headers || {}), method: init.method })
    return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }))
})

afterEach(() => vi.unstubAllGlobals())

test('预检放行自定义头 x-wb-webapp-access-key', async () => {
  const res = await worker.fetch(
    new Request(URL_UNDER_TEST, { method: 'OPTIONS', headers: { Origin: ALLOWED } })
  )
  expect(res.status).toBe(204)
  expect(res.headers.get('Access-Control-Allow-Origin')).toBe(ALLOWED)
  expect(res.headers.get('Access-Control-Allow-Headers')).toContain('x-wb-webapp-access-key')
})

test('转发时保留 access-key、去掉 Origin（这是绕过 CORS 的关键）', async () => {
  await worker.fetch(new Request(URL_UNDER_TEST, {
    method: 'GET',
    headers: { Origin: ALLOWED, 'x-wb-webapp-access-key': 'wbpk_test', Referer: ALLOWED + '/' },
  }))

  expect(calls).toHaveLength(1)
  const sent = calls[0].headers
  expect(sent.get('x-wb-webapp-access-key')).toBe('wbpk_test')
  expect(sent.get('Origin')).toBeNull()      // ★ 必须去掉，否则后端按跨域拒
  expect(sent.get('Referer')).toBeNull()
  expect(calls[0].url).toContain('ctf-writeup-blog.app.workbuddy.host/.cloud/database/rest/guestbook')
})

test('响应带回白名单来源的 CORS 头，并 expose 掉 Content-Range', async () => {
  const res = await worker.fetch(new Request(URL_UNDER_TEST, {
    method: 'GET', headers: { Origin: ALLOWED, 'x-wb-webapp-access-key': 'k' },
  }))
  expect(res.status).toBe(200)
  expect(res.headers.get('Access-Control-Allow-Origin')).toBe(ALLOWED)
  // 不 expose 的话浏览器读不到分页总数（之前 {count:'exact'} 取不到数就是这个）
  expect(res.headers.get('Access-Control-Expose-Headers')).toContain('Content-Range')
})

test('非白名单来源被拒，且不回 CORS 头', async () => {
  const res = await worker.fetch(new Request(URL_UNDER_TEST, {
    method: 'GET', headers: { Origin: 'https://evil.example.com', 'x-wb-webapp-access-key': 'k' },
  }))
  expect(res.status).toBe(403)
  expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull()
  expect(calls).toHaveLength(0)   // 不该转发出去
})

test('只代理 /.cloud/ 路径，避免被当成开放代理', async () => {
  const res = await worker.fetch(new Request('https://proxy.example.workers.dev/anything', {
    method: 'GET', headers: { Origin: ALLOWED },
  }))
  expect(res.status).toBe(404)
  expect(calls).toHaveLength(0)
})

test('POST 的 body 会被缓冲后转发（流式 body 在 Node 下会因缺 duplex 报错）', async () => {
  await worker.fetch(new Request(URL_UNDER_TEST, {
    method: 'POST',
    headers: { Origin: ALLOWED, 'x-wb-webapp-access-key': 'k', 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname: 'a', content: 'b' }),
  }))
  expect(calls).toHaveLength(1)
  expect(calls[0].method).toBe('POST')
})
