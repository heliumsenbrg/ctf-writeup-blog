/** 相对时间：刚刚 / N 分钟前 / N 小时前 / N 天前 / 日期（留言板与评论共用） */
export function timeAgo(iso) {
  const t = new Date(iso).getTime()
  if (!Number.isFinite(t)) return ''
  const diff = Date.now() - t
  if (diff < 60_000) return '刚刚'
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} 小时前`
  if (diff < 30 * 86400_000) return `${Math.floor(diff / 86400_000)} 天前`
  return new Date(t).toLocaleDateString('zh-CN')
}
