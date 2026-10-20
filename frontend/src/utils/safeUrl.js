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

/** 展示用的短域名（去掉协议与末尾斜杠，超长截断）
 *
 * 用 URL 解析出真正的 hostname，而不是对原字符串做截断：
 * `https://heliumsenbrg.github.io@evil.example/` 的 hostname 是 evil.example，
 * 直接截断会把 `heliumsenbrg.github.io` 显示成"看起来可信"的前缀。
 */
export function displayHost(url, max = 40) {
  const s = safeHref(url)
  if (!s) return ''
  try {
    const u = new URL(s)
    const host = u.hostname + (u.port ? ':' + u.port : '')
    const rest = u.pathname === '/' ? '' : u.pathname
    return (host + rest).slice(0, max)
  } catch {
    return ''
  }
}
