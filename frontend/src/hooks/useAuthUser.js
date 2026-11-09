import { useEffect, useState } from 'react'
import { getAuthCloud } from '../utils/cloud.js'

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

/** 会话状态：登录页、导航、“我的”和写操作共用同一来源 */
export function useAuthUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    // 校验完成前，SDK 的 INITIAL_SESSION 事件会带着**存储里的旧会话**回来，
    // 如果我们直接采信，就会把刚判定为失效的登录态又塞回去（2026-11-09 实测：
    // /me 已经正确显示未登录，/login 却又显示「身份已验证」）。
    // 所以：校验完成（verified=true）之前的 auth 事件一律不采信。
    let verified = false
    const client = getAuthCloud()

    // 关键：**不能只信本地会话**。SDK 的 getSession() 只读存储、不访问网络，
    // 于是一个过期/被吊销/换过环境的 token 会让界面显示「已登录」，
    // 但每个请求都被后端拒成 invalid_grant（用户看到那句英文，还以为站点坏了）。
    // 所以：本地有会话 → 必须再向服务端验一次 getUser()。
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
        const { data, error } = await client.auth.getUser()
        if (!alive) return
        setUser(error ? null : data?.user || null)
      } catch {
        if (alive) setUser(null)
      } finally {
        if (alive) {
          verified = true
          setLoading(false)
        }
      }
    }
    verify()

    const unsubscribe = client.auth.onAuthStateChange((_event, session) => {
      if (!alive || !verified) return
      setUser(session?.user || null)
    })
    // 令牌被后端判无效时（见 utils/cloud.js 的 authFetch），本地会话已被清掉，
    // 这里同步把界面切回未登录，避免"显示已登录、实际每个请求都 401"
    const onInvalid = () => { if (alive) setUser(null) }
    if (typeof window !== 'undefined') window.addEventListener('wb-auth-invalid', onInvalid)
    return () => {
      alive = false
      if (typeof unsubscribe === 'function') unsubscribe()
      if (typeof window !== 'undefined') window.removeEventListener('wb-auth-invalid', onInvalid)
    }
  }, [])

  return { user, loading }
}
