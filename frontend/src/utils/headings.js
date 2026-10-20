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
    // 去掉行内标记后再取 slug，保证与正文渲染（渲染时标记已消失）一致。
    // ⚠️ 不能无差别删除下划线：Markdown 不会把词内的 `basic_1`、`one_gadget`
    // 当成强调，渲染后的标题里下划线仍在；删掉就会让目录 id 与正文 id 对不上
    //（2026-10-20 审计实测 39 条目录项点不动，全部是这个原因）。
    const text = m[2]
      .replace(/`([^`]*)`/g, '$1')                    // 行内代码
      .replace(/(\*\*|__)(.+?)\1/g, '$2')             // 粗体
      .replace(/(^|[\s(])_([^_]+)_(?=[\s).,，。！？、]|$)/g, '$1$2') // 斜体（仅词边界）
      .replace(/(^|[\s(])\*([^*]+)\*(?=[\s).,，。！？、]|$)/g, '$1$2') // 斜体星号
      .replace(/~~(.+?)~~/g, '$1')                    // 删除线
      .replace(/[`*~]+/g, '')                         // 残留标记
      .trim()
    const id = headingSlug(text)
    if (text && id) out.push({ id, text, level })
  }
  return out
}
