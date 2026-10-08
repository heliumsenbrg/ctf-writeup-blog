import { createWorkBuddyCloud } from '@tencent-ai/workbuddy-cloud-sdk'

/**
 * 云服务客户端（留言板用）。
 *
 * 这两个值来自云服务开通时下发的 publicConfig：
 *   - endpoint      当前应用的数据面地址（**必须原样用这里的值**，不要改成 location / 环境变量）
 *   - publishableKey 只标识"哪个应用"，本身不含任何权限；鉴权由服务端 Origin 校验 + 数据库 RLS 负责
 *
 * 全应用只初始化一次，各模块复用同一个 client。
 */
export const cloudConfig = {
  endpoint: 'https://ctf-writeup-blog.app.workbuddy.host',
  publishableKey: 'wbpk_amJCk3tyxjtHbVB4JE3NNS_kZ4ZseaRE1oL556oz5mlibKyUME0Drsc',
}

/**
 * ⚠️ 已知问题（2026-10-09 无头浏览器实测取证）：评论 / 留言 / 通关榜在**线上不可用**。
 *
 * 真实请求地址是 `https://ctf-writeup-blog.app.workbuddy.host/.cloud/database/rest/...`，
 * 后端是活的，但浏览器报：
 *   Access to fetch ... from origin 'https://heliumsenbrg.github.io'
 *   has been blocked by CORS policy: Response to preflight request doesn't pass
 *   access control check: No 'Access-Control-Allow-Origin' header is present.
 *
 * 也就是：云服务的**允许来源（Origin）白名单里没有 GitHub Pages 这个域名**
 * —— 当初是给 WorkBuddy 发布域配的，站点搬到 Pages 后就跨域了。
 *
 * 两条出路（都需要站点所有者操作）：
 *   ① 在云服务侧把 `https://heliumsenbrg.github.io` 加进允许来源；
 *   ② 或改用 Giscus（GitHub Discussions，静态站零运维，天然无跨域问题）。
 * 在此之前，friendlyDbError 会给出明确文案，而不是让访客看到
 * "Failed to fetch" 或 "Unexpected token '<'" 这类天书。
 */

let client = null

export function getCloud() {
  if (!client) {
    client = createWorkBuddyCloud({
      endpoint: cloudConfig.endpoint,
      publishableKey: cloudConfig.publishableKey,
    })
    // 仅开发模式：把 client 挂到 window，方便在控制台/自动化里排查（生产构建不会存在）
    if (import.meta.env.DEV && typeof window !== 'undefined') window.__wbCloud = client
  }
  return client
}

/** 把 { data, error } 信封拍平成"要么拿数据、要么抛错"，让调用处干净一点 */
export async function unwrap(promise) {
  const { data, error } = await promise
  if (error) throw error
  return data
}

/** 数据库错误 → 给用户看的话（不暴露原始细节） */
export function friendlyDbError(err) {
  // 给站点所有者留一条可诊断的原始日志（访客看不到，DevTools 里能看到）
  if (typeof console !== 'undefined') {
    console.warn('[cloud] 请求失败，原始错误：', err?.message || err, err)
  }

  const code = err?.code
  if (code === '23514' || code === '23502') return '内容不符合要求（昵称 1-20 字、留言 1-500 字）'
  if (code === '42501') return '服务器拒绝了这次操作（权限不足）'
  if (code === '42P01') return '留言表不存在，请稍后再试'

  const msg = String(err?.message || '')
  // 后端没返回 JSON 而是返回了 HTML（SPA 兜底页 / 网关错误页）——
  // 浏览器抛的是 "Unexpected token '<'" 这类 JSON 解析错误，对访客毫无意义。
  if (/Unexpected token\s*'<'|not valid JSON|is not valid JSON|<!DOCTYPE/i.test(msg)) {
    return '评论服务暂时不可用，稍后再试'
  }
  // CORS / 网络层失败：浏览器只会给一句 "Failed to fetch"，看不出是被跨域拦了。
  // 这里是当前线上的实际故障（云服务未放行 GitHub Pages 域名），文案不该甩锅给访客的网络。
  if (/fetch|network|Failed to fetch|ERR_FAILED|ERR_NETWORK|CORS/i.test(msg)) {
    return '暂时连不上评论服务，稍后再试'
  }
  if (/timeout|timed out|AbortError/i.test(msg)) return '评论服务响应超时，请稍后再试'
  if (err?.status === 401) return '服务暂时不可用（凭据未通过），请稍后再试'
  if (err?.status >= 500) return '评论服务暂时不可用，稍后再试'
  return msg || '写入失败，请稍后再试'
}
