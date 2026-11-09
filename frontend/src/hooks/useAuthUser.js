import { useEffect, useState } from 'react'
import { shouldClearCredentials } from '@tencent-ai/workbuddy-cloud-sdk'
import { getAuthCloud, clearStoredSession } from '../utils/cloud.js'

export function displayName(user) {
  const name = user?.name || user?.user_metadata?.name
  if (name) return name
  if (user?.email) return user.email.split('@')[0]
  if (user?.phone) return `访客${user.phone.slice(-4)}`
  return '已登录访客'
}

export function maskAccount(user) {
  if (user?.email) {
    const [local, domain] = user.email.split('@')
    return `${local.slice(0, 1)}***@${domain || ''}`
  }
  if (user?.phone) return `${user.phone.slice(0, 3)}****${user.phone.slice(-4)}`
  return ''
}

/**
 * 会话状态：登录页、导航、“我的”和写操作共用同一来源。
 *
 * 写法对齐官方文档（cloud-service → references/auth/code-generation.md · Session and Route Guard）：
 *   · `getSession()` 只读本地，接近过期才自动续期 —— 它**不代表 token 仍被服务端认可**
 *   · 需要「服务端认可」时用 `getUser()`（GET /.cloud/auth/v1/user/me）
 *   · 失效判定用官方 `shouldClearCredentials(error)`（kind==='unauthenticated' 或 code==='invalid_grant'），
 *     不要拿 message 文本猜；`network` / `backend-unavailable` **保留会话**，不能把人踢下线
 *
 * 之前这里只信 getSession()，于是本地一个过期/换过环境的 token 会让界面显示「已登录」，
 * 而每个请求都被后端拒成 invalid_grant（2026-11-09 实测踩到）。
 */
export function useAuthUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    // 校验完成前，SDK 的 INITIAL_SESSION 事件会带着**存储里的旧会话**回来；
    // 直接采信会把刚判定失效的登录态又塞回去（实测：/me 正确显示未登录、/login 又显示「身份已验证」）。
    let verified = false
    const client = getAuthCloud()

    const dropSession = async () => {
      clearStoredSession()
      try {
        await client.auth.signOut()
      } catch {
        /* 本地已清，网络失败不影响 */
      }
      if (!alive) return
      setUser(null)
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('wb-auth-invalid'))
    }

    const verify = async () => {
      let session = null
      try {
        const r = await client.auth.getSession()
        session = r?.data || null
      } catch {
        session = null
      }
      if (!alive) return

      if (!session?.user) {
        setUser(null)
        verified = true
        setLoading(false)
        return
      }

      try {
        const r = await client.auth.getUser()
        if (!alive) return
        const error = r?.error || null
        if (!error) {
          setUser(r?.data?.user || null)
        } else if (shouldClearCredentials(error)) {
          await dropSession()
        } else {
          // network / backend-unavailable / rate-limited：保留会话
          setUser(session.user)
        }
      } catch {
        // 抛异常多半是网络层，同样保留会话
        if (alive) setUser(session.user)
      } finally {
        if (alive) {
          verified = true
          setLoading(false)
        }
      }
    }
    verify()

    const unsubscribe = client.auth.onAuthStateChange((event, session) => {
      if (!alive || !verified) return
      if (event === 'SIGNED_OUT') setUser(null)
      else setUser(session?.user || null)
    })
    return () => {
      alive = false
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  return { user, loading }
}
