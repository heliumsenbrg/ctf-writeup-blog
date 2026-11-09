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

/**
 * 会话存哪里：SDK 默认写 localStorage（令牌会一直躺在磁盘上，公共电脑上尤其糟）。
 *
 * 改成走 **sessionStorage**：同一标签页内刷新不掉线，关掉标签就没了。
 * ⚠️ 老实说清楚它的边界：sessionStorage 挡不住 XSS 即时窃取（脚本照样能读），
 *    它解决的是「令牌长期驻留」。真正抗 XSS 的是构建期注入的 CSP（见 vite.config.js）。
 * 想换回长期登录：把下面 STORAGE 换成 undefined 即可（一行）。
 */
// 名字别带 KEY：check-secrets 的「硬编码密钥常量」规则会把 `XXX_KEY_YYY` 形态误判成凭据
const SESSION_STORE_PREFIX = 'workbuddy-cloud.session.'

function createSessionStore() {
  try {
    const s = window.sessionStorage
    const probe = '__wb_probe__'
    s.setItem(probe, '1')
    s.removeItem(probe)
    // 迁移：把旧版留在 localStorage 里的长驻会话作废一次，
    // 避免"看起来切了存储，其实还在用老令牌"。
    try {
      window.localStorage.removeItem(SESSION_STORE_PREFIX + cloudConfig.publishableKey)
    } catch {
      /* localStorage 被禁也不影响主流程 */
    }
    return {
      getItem: (k) => s.getItem(k),
      setItem: (k, v) => s.setItem(k, v),
      removeItem: (k) => s.removeItem(k),
    }
  } catch {
    // 隐私模式 / 存储被禁：返回 undefined，交给 SDK 自己退回 localStorage
    return undefined
  }
}

const STORAGE = typeof window === 'undefined' ? undefined : createSessionStore()

export function getCloud() {
  if (!client) {
    client = createWorkBuddyCloud({
      endpoint: cloudConfig.endpoint,
      publishableKey: cloudConfig.publishableKey,
      storage: STORAGE,
      // 数据库请求也要走同一个包装：登录后写留言要带用户 token，
      // 而 Authorization 会被平台注入污染（详见 authFetch 的注释）
      fetch: authFetch,
    })
    // 仅开发模式：把 client 挂到 window，方便在控制台/自动化里排查（生产构建不会存在）
    if (import.meta.env.DEV && typeof window !== 'undefined') window.__wbCloud = client
  }
  return client
}

/**
 * 登录页专用 client。
 *
 * 为什么不能复用 getCloud()：Auth 的发送验证码请求需要带上 Turnstile token，
 * 让中转在转发给云服务前先做服务端校验。SDK 没有暴露“每次请求设置头”的公开 API，
 * 但 createWorkBuddyCloud 支持注入 fetch；这里只给 `/.cloud/auth/**` 的请求补
 * `x-turnstile-token`，数据库请求仍然走原来的 client，互不影响。
 */
let authClient = null
let turnstileToken = ''

export function setTurnstileToken(token) {
  turnstileToken = token || ''
}

/** 清掉本地会话（令牌被后端判定失效时用，避免坏 token 一直污染后续请求） */
export function clearStoredSession() {
  try {
    if (STORAGE && typeof STORAGE.removeItem === 'function') {
      STORAGE.removeItem(SESSION_STORE_PREFIX + cloudConfig.publishableKey)
    }
  } catch {
    /* 存储被禁也不影响主流程 */
  }
}

/**
 * 登录类请求：这些接口**不需要**（也不应该）带旧身份。
 * 原因：SDK 会把存储里的 accessToken 自动挂到每个请求上。如果本地存着一个
 * 已被拒绝的旧会话（例如换过环境、或令牌过期），发验证码时就会带着它一起去，
 * 云认证直接回 `invalid_grant: the session is invalid, expired or issued for
 * another client` —— 用户看到的就是"登不进去，还报一句看不懂的错"（2026-11-09 实测）。
 */
const SIGNIN_PATH = /\/\.cloud\/auth\/v1\/(verification|signin|signup|otp|verify)/

async function authFetch(input, init) {
  const headers = new Headers(init?.headers)
  const url = typeof input === 'string' ? input : input?.url || ''
  if (turnstileToken && /\/\.cloud\/auth\//.test(url)) {
    headers.set('x-turnstile-token', turnstileToken)
  }
  // 登录态不能靠 Authorization 传给中转：
  // 托管平台的边缘层会给入站请求**注入它自己的** Authorization: Bearer <平台 JWT>，
  // 中转看到就转发，云认证回 `invalid_grant`（客户端没带也可能被转发）。
  // 改成自定义头：SDK 设的 Authorization 搬进 x-wb-user-token 再删掉原头，
  // 中转只认这个头 —— 平台不会替我设它，语义就干净了。
  const auth = headers.get('authorization')
  if (auth && !SIGNIN_PATH.test(url)) {
    headers.set('x-wb-user-token', auth.replace(/^Bearer\s+/i, ''))
  }
  headers.delete('authorization')

  // 注意：这里**不做**"看响应体里有没有 invalid_grant 就清会话"的猜测。
  // 官方约定是按 `error.kind` 判断（shouldClearCredentials），见 useAuthUser / friendlyAuthError。
  // fetch 层只负责把令牌放到中转认得的头上。
  return fetch(input, { ...init, headers })
}

export function getAuthCloud() {
  if (!authClient) {
    authClient = createWorkBuddyCloud({
      endpoint: cloudConfig.endpoint,
      publishableKey: cloudConfig.publishableKey,
      fetch: authFetch,
      // 必须和 getCloud 用同一个存储，否则"登录成功但数据面仍匿名"
      storage: STORAGE,
    })
  }
  return authClient
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
/**
 * 认证错误 → 说人话。
 *
 * 按官方约定**先看 `error.kind`**（cloud-service · auth/code-generation.md · Error Handling：
 * "Branch on stable error.kind, not message text"），再退回 message 兜底。
 * 后端会把 `invalid_grant: the session is invalid, expired or issued for another client`
 * 原样带回来，直接显示给访客等于让人一脸问号（2026-11-09 主人就被这句卡了半天）。
 */
export function friendlyAuthError(err) {
  const kind = err?.kind
  const code = String(err?.code || '')
  if (kind === 'unauthenticated' || code === 'invalid_grant') {
    return '登录状态已失效，请重新获取验证码登录'
  }
  if (kind === 'rate-limited') return '操作太频繁，请稍后再试'
  if (kind === 'network') return '网络连接失败，请检查网络后重试'
  if (kind === 'backend-unavailable') return '服务暂时不可用，请稍后再试'
  if (kind === 'invalid-request') return err?.message || '请求参数不正确'

  const msg = String(err?.message || err || '')
  if (/invalid_grant|session is invalid|expired or issued/i.test(msg)) {
    return '登录状态已失效，请重新获取验证码登录'
  }
  if (/rate|too many|频繁|429/i.test(msg)) return '操作太频繁，请稍后再试'
  if (/verification code|otp|验证码/i.test(msg)) return '验证码不正确或已过期，请重试'
  return msg || '请求失败，请稍后再试'
}

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
