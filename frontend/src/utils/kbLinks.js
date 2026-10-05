// 知识库链接工具：双链协议解析 + 渲染期分类
export const WIKILINK_SCHEME = 'kbnote:'

export function isWikiHref(href = '') {
  return href.startsWith(WIKILINK_SCHEME)
}

export function wikiTarget(href = '') {
  return decodeURIComponent(href.slice(WIKILINK_SCHEME.length))
}

export function isExternal(href = '') {
  return /^https?:\/\//i.test(href)
}

/**
 * 把双链目标解析为渲染指令：
 *   { kind: 'kb', to }  —— 站内跳转（index → /kb）
 *   { kind: 'plain' }   —— 库内未发布页 → 纯文本
 */
export function resolveWikiLink(target, published) {
  if (target === 'index') return { kind: 'kb', to: '/kb' }
  if (published.has(target)) return { kind: 'kb', to: '/kb/' + encodeURIComponent(target) }
  return { kind: 'plain' }
}
