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
  const code = err?.code
  if (code === '23514' || code === '23502') return '内容不符合要求（昵称 1-20 字、留言 1-500 字）'
  if (code === '42501') return '服务器拒绝了这次操作（权限不足）'
  if (code === '42P01') return '留言表不存在，请稍后再试'
  if (err?.message && /fetch|network|Failed to fetch/i.test(err.message)) return '网络连接失败，请检查网络后重试'
  if (err?.status === 401) return '服务暂时不可用（凭据未通过），请稍后再试'
  return err?.message || '写入失败，请稍后再试'
}
