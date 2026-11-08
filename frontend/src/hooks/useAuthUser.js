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
    const client = getAuthCloud()
    client.auth.getSession()
      .then(({ data }) => { if (alive) setUser(data?.user || null) })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false) })
    const unsubscribe = client.auth.onAuthStateChange((_event, session) => {
      if (alive) setUser(session?.user || null)
    })
    return () => {
      alive = false
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  return { user, loading }
}
