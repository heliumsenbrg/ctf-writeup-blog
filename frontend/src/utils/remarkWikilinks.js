// remark 插件：把普通文本节点里的 [[名]]（可带 |别名）转成链接节点，
// url 采用自定义协议 kbnote:<encodeURIComponent(名)>。
// 基于 mdast 遍历 ⇒ 代码块/行内代码（无 text 子节点）与链接内部（避免嵌套）不会被改。
const WIKILINK = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g
const SCHEME = 'kbnote:'

export default function remarkWikilinks() {
  return (tree) => { walkChildren(tree) }
}

function walkChildren(node) {
  if (!Array.isArray(node.children)) return
  const out = []
  for (const child of node.children) {
    if (child.type === 'text' && child.value.includes('[[')) {
      out.push(...splitText(child.value))
    } else {
      if (child.type !== 'link') walkChildren(child)
      out.push(child)
    }
  }
  node.children = out
}

function splitText(value) {
  const parts = []
  let last = 0
  for (const m of value.matchAll(WIKILINK)) {
    if (m.index > last) parts.push({ type: 'text', value: value.slice(last, m.index) })
    parts.push({
      type: 'link',
      url: SCHEME + encodeURIComponent(m[1].trim()),
      children: [{ type: 'text', value: (m[2] ?? m[1]).trim() }],
    })
    last = m.index + m[0].length
  }
  if (last < value.length) parts.push({ type: 'text', value: value.slice(last) })
  return parts
}
