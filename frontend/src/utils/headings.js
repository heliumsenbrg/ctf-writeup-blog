/**
 * 标题锚点的唯一实现 —— TOC 与正文渲染必须共用同一个函数，否则点不到。
 * （原先 TableOfContents 与 Article/KbNote 各写一套正则，规则不一致，
 *   而且 TOC 直接扫原文，把代码块里的 `# 注释` 也当成了标题。）
 */

/** React children（可能是元素树）→ 纯文本 */
export function toPlainText(node) {
  if (node == null || node === false || node === true) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(toPlainText).join('')
  if (typeof node === 'object' && node.props) return toPlainText(node.props.children)
  return ''
}

/** 标题文字 → 锚点 id */
export function headingSlug(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * 从 markdown 里提取标题。
 * ⚠️ 必须先把代码块剥掉 —— 否则代码里的 `# 注释`（bash/yaml/python）会被误当成标题，
 *    生成一堆点了不动的目录项。
 */
export function parseHeadings(content, maxLevel = 3) {
  const src = String(content || '')
    .replace(/```[\s\S]*?```/g, '') // 围栏代码块
    .replace(/^(?: {4,}|\t).*$/gm, '') // 缩进式代码块

  const out = []
  for (const line of src.split('\n')) {
    const m = line.match(/^(#{1,6})\s+(.+)$/)
    if (!m) continue
    const level = m[1].length
    if (level > maxLevel) continue
    // 去掉行内标记后再取 slug，保证与正文渲染（渲染时标记已消失）一致
    const text = m[2].replace(/[`*_~]+/g, '').trim()
    const id = headingSlug(text)
    if (text && id) out.push({ id, text, level })
  }
  return out
}
