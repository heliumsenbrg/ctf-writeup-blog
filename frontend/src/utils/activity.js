const PREFIX = 'nuomi:activity:'

export function recordActivity(userId, item) {
  if (!userId) return
  try {
    const key = PREFIX + userId
    const list = JSON.parse(localStorage.getItem(key) || '[]')
    list.unshift({ ...item, at: Date.now() })
    localStorage.setItem(key, JSON.stringify(list.slice(0, 20)))
  } catch { /* 隐私模式忽略 */ }
}

export function readActivity(userId) {
  if (!userId) return []
  try {
    return JSON.parse(localStorage.getItem(PREFIX + userId) || '[]')
  } catch {
    return []
  }
}
