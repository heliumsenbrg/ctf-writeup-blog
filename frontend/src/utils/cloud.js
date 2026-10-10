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
/**
 * 数据面地址。允许用**构建期环境变量**覆盖：
 *
 *   设了 VITE_CLOUD_ENDPOINT  → 指向自建中转（如 cloudflare/ 下那个 Worker），
 *                              由它去掉 Origin 再转发 → 绕开 CORS（GitHub Pages 上唯一可行的路）
 *   没设（默认）              → 直连云服务数据面
 *                              （在 WorkBuddy 发布域上没问题；在 GitHub Pages 上会被
 *                                Origin 白名单拒掉，见下面那段说明）
 *
 * 用环境变量而不是把地址写死在源码里，是为了「切过去 / 退回来」都只改构建参数，
 * 不用动这行代码、也不用担心忘了改回来。
 */
const DEFAULT_ENDPOINT = 'https://ctf-writeup-blog.app.workbuddy.host'

export const cloudConfig = {
  endpoint: import.meta.env.VITE_CLOUD_ENDPOINT || DEFAULT_ENDPOINT,
  publishableKey: 'wbpk_amJCk3tyxjtHbVB4JE3NNS_kZ4ZseaRE1oL556oz5mlibKyUME0Drsc',
}

/**
 * ⚠️ 已知问题（2026-10-10 复核定案）：评论 / 留言 / 通关榜在 **GitHub Pages 上不可用**，
 * 但在 WorkBuddy 发布域上是好的。根因是**服务的 Origin 白名单**，不是后端挂了、
 * 也不是凭据失效：
 *
 *   · 重新绑定云服务拿回的 publicConfig 与下面这两个值**完全一致**
 *     （endpoint / publishableKey 都没变）→ 凭据是当前有效的。
 *   · 该服务**要求 Origin 精确匹配它自己的保留域** `ctf-writeup-blog.app.workbuddy.host`。
 *   · 站点部署在 `heliumsenbrg.github.io`，Origin 不匹配 → 预检失败 →
 *     浏览器报 "No 'Access-Control-Allow-Origin' header is present"。
 *
 * 两条出路（都要站点所有者操作）：
 *   ① 用 WorkBuddy 发布站点并**复用同一个 applicationId**
 *      （appId 相同 → 保留域相同 → Origin 匹配 → 评论/留言直接可用）；
 *   ② 或改用 Giscus（GitHub Discussions，静态站零运维，没有跨域问题）。
 *
 * 另外：这三张表已经上了服务端反垃圾（屏蔽词 + 自动隐藏，见仓库 db/moderation.sql），
 * 前端只需在"内容被隐藏（待审核）"时如实提示，别让人以为发丢了。
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

/** 把任意错误对象转成字符串，用于在字段名不确定时做关键字匹配（不会因循环引用抛错） */
const safeStringify = (v) => {
  try { return JSON.stringify(v) ?? String(v) } catch { return String(v) }
}

/** 数据库错误 → 给用户看的话（不暴露原始细节） */
export function friendlyDbError(err) {
  // 给站点所有者留一条可诊断的原始日志（访客看不到，DevTools 里能看到）
  if (typeof console !== 'undefined') {
    console.warn('[cloud] 请求失败，原始错误：', err?.message || err, err)
  }

  // ⚠️ PostgREST 会把 SQLSTATE 包一层前缀（实测是 `DATABASE_23514`），
  //    所以不能直接拿 code 跟 '23514' 比 —— 那样判断**永远不成立**（这是个既有的哑 bug）。
  const code = String(err?.code || '').replace(/^DATABASE_/, '')
  const rawMsg = String(err?.message || '')

  // 23514 = CHECK 约束 / 反垃圾触发器拒绝。
  // 触发器抛的 message 本身就是写给人看的中文，直接透出；剩下的才是长度等结构性问题。
  if (code === '23514') {
    if (/未发布|请稍后再试/.test(rawMsg)) return rawMsg
    return '内容不符合要求：昵称 1-20 字、留言 1-500 字，且不能含不可见字符'
  }
  if (code === '23502') return '内容不符合要求：昵称 1-20 字、留言 1-500 字，且不能含不可见字符'
  if (code === '42501') return '服务器拒绝了这次操作（权限不足）'
  if (code === '42P01') return '留言表不存在，请稍后再试'

  // Cloudflare Worker 挡下的（见 frontend/cloudflare/cloud-proxy-worker.js）：
  // 人机校验没通过 / 来源不在白名单 / 上游连不上。
  // Worker 返回的是自造 JSON，字段名不固定，所以整条错误串起来匹配，别只认某个字段。
  const all = `${code} ${rawMsg} ${safeStringify(err)}`
  if (/human_verification_failed/.test(all)) return '人机校验未通过，请刷新页面重试'
  if (/origin_not_allowed/.test(all)) return '当前站点未被授权访问评论服务'
  if (/upstream_unreachable/.test(all)) return '评论服务暂时不可用，稍后再试'

  const msg = rawMsg
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
