/**
 * 链接安全：只放行 http(s)。
 *
 * 为什么需要：这类链接的数据源是**访客可写**的（留言板的"站点"字段直接来自公开表），
 * 而 React 只会转义文本、**不会**校验 URL 的协议 ——
 * 把 `javascript:alert(document.cookie)` 塞进 href，点击就会执行 → 存储型 XSS。
 * `data:` 同理（可构造 data:text/html）。
 */
export function safeHref(url) {
  const s = String(url ?? '').trim()
  if (!s) return null
  // 只认 http/https；大小写与外层空白都先规范化
  return /^https?:\/\//i.test(s) ? s : null
}

/** 展示用的短域名（去掉协议与末尾斜杠，超长截断） */
export function displayHost(url, max = 40) {
  const s = safeHref(url)
  if (!s) return ''
  return s.replace(/^https?:\/\//i, '').replace(/\/+$/, '').slice(0, max)
}
