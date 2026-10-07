import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Link2 } from 'lucide-react'

/**
 * 知识库 ↔ 题解 的互挂区块（构建时用 n-gram 匹配生成 related.json）。
 * kind='note'   笔记页 → 显示「相关题解」
 * kind='article' 题解页 → 显示「相关笔记」
 */
let cache = null
function loadRelated() {
  if (!cache) {
    cache = fetch(`${import.meta.env.BASE_URL}related.json`)
      .then((r) => (r.ok ? r.json() : { articles: {}, notes: {} }))
      .catch(() => ({ articles: {}, notes: {} }))
  }
  return cache
}

export default function RelatedLinks({ kind, id }) {
  const [items, setItems] = useState(null)

  useEffect(() => {
    let alive = true
    loadRelated().then((d) => {
      if (!alive) return
      const rows = kind === 'article' ? d.articles?.[id] : d.notes?.[id]
      setItems(Array.isArray(rows) ? rows : [])
    })
    return () => { alive = false }
  }, [kind, id])

  if (!items || !items.length) return null

  return (
    <section className="mt-10 border-t border-cyber-grid/20 pt-6">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-cyber-purple anime-title">
        <Link2 className="h-4 w-4" />
        {kind === 'article' ? '相关笔记' : '相关题解'}
      </h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((it) =>
          kind === 'article' ? (
            <Link
              key={it.name}
              to={`/kb/${encodeURIComponent(it.name)}`}
              className="group rounded-lg border border-cyber-grid/20 p-3 transition-colors hover:border-cyber-purple/50 hover:bg-cyber-purple/5"
            >
              <div className="text-xs font-bold text-cyber-cyan group-hover:text-white">{it.title}</div>
              {it.summary && (
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-cyber-grid/60">{it.summary}</p>
              )}
            </Link>
          ) : (
            <Link
              key={it.id}
              to={`/article/${it.id}`}
              className="group rounded-lg border border-cyber-grid/20 p-3 transition-colors hover:border-cyber-purple/50 hover:bg-cyber-purple/5"
            >
              <div className="text-xs font-bold text-cyber-cyan group-hover:text-white">{it.title}</div>
              {it.subtitle && (
                <p className="mt-1 text-[11px] leading-relaxed text-cyber-grid/60">{it.subtitle}</p>
              )}
            </Link>
          )
        )}
      </div>
    </section>
  )
}
