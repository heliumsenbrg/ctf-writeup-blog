/**
 * 知识库快照的「未发布引用屏蔽」规则 —— build-kb.mjs 与 check-kb.mjs **共用**，
 * 保证"生成"与"校验"用的是同一套规则，不会互相打架。
 *
 * 背景：vault 笔记正文会引用不发布的页（「摘录」以及已迁出的对话存档，
 * 如 [[对话纪要-糯米与主人]]）。这些引用若原样发布：
 *   ① 站内渲染成空链接；② 私人页标题泄露到公开的 search-index 与首屏 index.js。
 *
 * 规则（只作用于**快照**，vault 原文一字不动）：
 *   [[目标]]        → 目标未发布 → 〖内部笔记〗
 *   [[目标|别名]]   → 目标未发布 → 保留别名（那是作者本来就要展示的文字）
 *   目标已发布      → 原样保留
 */
export const WIKILINK = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g
export const MASK = '〖内部笔记〗'

/** 把 text 里指向未发布目标的 [[双链]] 屏蔽掉（resolvable 为发布集，含 'index'） */
export function maskUnpublished(text, resolvable) {
  return String(text ?? '').replace(WIKILINK, (whole, target, alias) => {
    if (resolvable.has(String(target).trim())) return whole
    return alias || MASK
  })
}
