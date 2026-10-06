import { useEffect, useState } from 'react'
import { parseHeadings } from '../utils/headings'

/** 目录里的 flag 也要打码（跟正文一致的剧透保护） */
function SpoilerText({ text }) {
  const parts = String(text).split(/(flag\{[^}]+\})/g)
  if (parts.length === 1) return parts[0]
  return parts.map((p, i) =>
    /^flag\{[^}]+\}$/.test(p) ? (
      <span key={i} className="spoiler-flag">{p}</span>
    ) : (
      p
    )
  )
}

export default function TableOfContents({ content }) {
  // 只收 h2/h3：h1 是文章/笔记标题（知识库笔记的 h1 id 是硬编码的 note-title，
  // 与 slug 规则不一致，且它在目录里本来也冗余）
  const headings = parseHeadings(content).filter((h) => h.level >= 2)
  const [active, setActive] = useState('')

  // 滚动时高亮"当前读到哪一节"
  useEffect(() => {
    if (!headings.length) return
    const onScroll = () => {
      let cur = headings[0].id
      for (const h of headings) {
        const el = document.getElementById(h.id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= 120) cur = h.id
        else break
      }
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [headings])

  if (!headings.length) return null

  // 用 window 滚动（原先对标题元素调 el.scrollTo()，它既不是滚动容器、也不会跳）
  const onSelect = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top, behavior: 'smooth' })
    setActive(id)
  }

  return (
    <nav className="hidden lg:block fixed right-6 top-32 w-56" aria-label="目录">
      <div className="mb-2 text-xs font-mono text-cyber-grid">目录</div>
      <div className="flex max-h-[70vh] flex-col overflow-y-auto border-l border-cyber-grid/20">
        {headings.slice(0, 40).map((h) => {
          const isActive = h.id === active
          return (
            <button
              key={h.id}
              onClick={() => onSelect(h.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`-ml-px block w-full border-l-2 py-1 pr-2 text-left text-xs transition-colors ${
                h.level === 1 ? 'pl-3 font-bold' : h.level === 3 ? 'pl-7' : 'pl-3'
              } ${
                isActive
                  ? 'border-cyber-cyan bg-cyber-cyan/5 text-cyber-cyan'
                  : 'border-transparent text-cyber-grid/80 hover:border-cyber-cyan/50 hover:text-cyber-cyan'
              }`}
            >
              <span className="line-clamp-2"><SpoilerText text={h.text} /></span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
