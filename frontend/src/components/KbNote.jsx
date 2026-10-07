import { useEffect, useMemo, useState, useCallback } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import { ArrowLeft, ArrowRight, Copy, Check } from 'lucide-react'
import remarkWikilinks from '../utils/remarkWikilinks.js'
import { MarkdownCode } from './CodeBlock'
import { createPortal } from 'react-dom'
import { useRef } from 'react'
import ReadingProgress from './ReadingProgress'
import ShareButton from './ShareButton'
import CommentSection from './CommentSection'
import TableOfContents from './TableOfContents'
import { headingSlug, toPlainText } from '../utils/headings.js'
import { isWikiHref, wikiTarget, isExternal, resolveWikiLink } from '../utils/kbLinks.js'

// Vite 懒加载：每篇笔记一个 chunk（本文件不可在纯 node 中 import）
const modules = import.meta.glob('../data/kb/notes/*.json')
const NOTES = Object.fromEntries(
  Object.entries(modules).map(([p, load]) => [p.slice(p.lastIndexOf('/') + 1, -'.json'.length), load])
)
const PUBLISHED = new Set(Object.keys(NOTES))

/** gwern.net 式的双链悬停预览：hover [[wikilink]] 时浮动显示目标笔记的标题与摘要。
 *  用 NOTES[name]() 复用已有的按篇懒加载 chunk，不增加首屏体积。 */
function WikiPreviewLink({ to, name, children }) {
  const [open, setOpen] = useState(false)
  const [info, setInfo] = useState(null)
  const [pos, setPos] = useState({ x: 0, y: 0, flip: false })
  const anchorRef = useRef(null)
  const timer = useRef(null)

  const load = async () => {
    if (info || !NOTES[name]) return
    try {
      const mod = await NOTES[name]()
      const d = mod?.default ?? mod
      setInfo({ title: d?.title || name, summary: d?.summary || '' })
    } catch {
      setInfo({ title: name, summary: '' })
    }
  }

  const onEnter = () => {
    timer.current = setTimeout(() => {
      const r = anchorRef.current?.getBoundingClientRect()
      if (r) {
        const w = 320
        const x = Math.max(12, Math.min(r.left, window.innerWidth - w - 12))
        const flipUp = r.bottom > window.innerHeight - 220
        setPos({ x, y: flipUp ? r.top - 10 : r.bottom + 10, flip: flipUp })
      }
      setOpen(true)
      load()
    }, 150)
  }
  const onLeave = () => {
    clearTimeout(timer.current)
    setOpen(false)
  }

  return (
    <span className="relative inline" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <Link ref={anchorRef} to={to} className="text-cyber-purple hover:text-cyber-cyan underline decoration-dotted transition-colors">
        {children}
      </Link>
      {open &&
        createPortal(
          <div
            className={`pointer-events-none fixed z-[90] w-80 max-w-[calc(100vw-24px)] rounded-lg border border-cyber-purple/40 bg-cyber-darker/95 p-3 shadow-[0_0_24px_rgba(167,139,250,0.16)] ${pos.flip ? '-translate-y-full' : ''}`}
            style={{ left: pos.x, top: pos.y }}
          >
            <div className="mb-1 text-xs font-bold text-cyber-cyan">
              {info ? info.title : '加载中…'}
            </div>
            <p className="line-clamp-3 text-[11px] leading-relaxed text-cyber-grid/85">
              {info ? info.summary || '（无摘要）' : ''}
            </p>
            <div className="mt-1.5 text-[10px] font-mono text-cyber-purple/70">
              [[ {name} ]] · 点击跳转
            </div>
          </div>,
          document.body
        )}
    </span>
  )
}


function locate(kbIndex, name) {
  for (const sec of kbIndex.sections) {
    for (const g of sec.groups) {
      const i = g.notes.findIndex(n => n.name === name)
      if (i !== -1) return { section: sec, group: g, index: i }
    }
  }
  return null
}

// —— 与 Article.jsx 同款的代码块/行内代码（副本；不改动 Article.jsx） ——
const slug = (text) => String(text).toLowerCase().replace(/[^\w一-龥]+/g, '-').replace(/^-+|-+$/g, '')

const markdownComponents = {
  a({ href = '', children }) {
    if (isWikiHref(href)) {
      const name = wikiTarget(href)
      const r = resolveWikiLink(name, PUBLISHED)
      if (r.kind === 'kb') {
        return <WikiPreviewLink to={r.to} name={name}>{children}</WikiPreviewLink>
      }
      return <span title="库内未发布页" className="text-cyber-grid/70">{children}</span>
    }
    if (isExternal(href)) {
      return <a href={href} target="_blank" rel="noreferrer" className="text-cyber-purple hover:text-cyber-cyan underline">{children}</a>
    }
    return <span className="text-cyber-grid/70">{children}</span>
  },
  code: MarkdownCode,
  p: ({ children }) => <p className="text-cyber-grid leading-relaxed my-3">{children}</p>,
  h1: ({ children }) => (
    <h1 id="note-title" className="text-3xl font-bold mt-2 mb-4 anime-title text-gradient scroll-mt-20">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 id={headingSlug(toPlainText(children))} className="text-2xl font-bold text-cyber-cyan mt-8 mb-4 anime-title scroll-mt-20">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 id={headingSlug(toPlainText(children))} className="text-xl font-bold text-cyber-purple mt-6 mb-3 scroll-mt-20">{children}</h3>
  ),
  strong: ({ children }) => <strong className="text-cyber-cyan font-bold">{children}</strong>,
  ul: ({ children }) => <ul className="list-disc pl-6 my-3 space-y-1 text-cyber-grid">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 my-3 space-y-1 text-cyber-grid">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-cyber-purple/50 bg-cyber-purple/5 pl-4 py-1 my-4 text-cyber-grid/90">{children}</blockquote>
  ),
  hr: () => <hr className="my-8 border-t border-cyber-grid/30" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border border-cyber-grid/30">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-cyber-darker">{children}</thead>,
  th: ({ children }) => <th className="px-3 py-2 text-left text-cyber-cyan border-b border-cyber-grid/30 text-sm">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 text-sm text-cyber-grid border-b border-cyber-grid/20">{children}</td>,
}

export default function KbNote() {
  const { name = '' } = useParams()
  const [state, setState] = useState({ status: 'loading', note: null })
  const [attempt, setAttempt] = useState(0)
  const [kbIndex, setKbIndex] = useState(null)

  // 元数据动态加载 (独立 chunk) —— 主包不因知识库增大
  useEffect(() => {
    let alive = true
    import('../data/kb/index.js').then(m => { if (alive) setKbIndex(m.default) })
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (name === 'index') return
    const load = NOTES[name]
    if (!load) { setState({ status: 'missing', note: null }); return }
    let alive = true
    setState({ status: 'loading', note: null })
    load()
      .then(m => { if (alive) setState({ status: 'ready', note: m.default ?? m }) })
      .catch(() => { if (alive) setState({ status: 'error', note: null }) })
    return () => { alive = false }
  }, [name, attempt])

  const place = useMemo(() => (kbIndex ? locate(kbIndex, name) : null), [kbIndex, name])

  if (name === 'index') return <Navigate to="/kb" replace />

  if (!kbIndex || state.status === 'loading') {
    return <div className="min-h-screen py-20 text-center text-cyber-grid font-mono text-sm">加载中…</div>
  }
  if (state.status === 'missing') {
    return (
      <div className="min-h-screen py-20 text-center font-mono">
        <p className="text-cyber-pink mb-4">未找到该笔记：{name}</p>
        <Link to="/kb" className="text-cyber-cyan hover:text-cyber-purple underline">← 返回知识库</Link>
      </div>
    )
  }
  if (state.status === 'error') {
    return (
      <div className="min-h-screen py-20 text-center font-mono">
        <p className="text-cyber-pink mb-4">加载失败</p>
        <button onClick={() => setAttempt(a => a + 1)} className="px-4 py-2 rounded-lg border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10">
          点击重试
        </button>
      </div>
    )
  }

  const { note } = state
  const prev = place && place.index > 0 ? place.group.notes[place.index - 1] : null
  const next = place && place.index < place.group.notes.length - 1 ? place.group.notes[place.index + 1] : null

  return (
    <>
      <ReadingProgress />
      <TableOfContents content={note.content} />
    <div className="min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:pr-72">
        <nav className="mb-6 flex items-center justify-between gap-4 text-xs font-mono text-cyber-grid">
          <span className="min-w-0 truncate">
            <Link to="/kb" className="hover:text-cyber-cyan">知识库</Link>
            {place && (<><span className="mx-2">/</span><span>{place.section.title} · {place.group.title}</span></>)}
          </span>
          <ShareButton title={note.title} className="shrink-0" />
        </nav>

        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath, remarkWikilinks]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
          urlTransform={(url) => url}
          components={markdownComponents}
        >
          {note.content}
        </ReactMarkdown>

        <CommentSection page={'/kb/' + name} />

        <div className="flex justify-between gap-4 mt-12 pt-6 border-t border-cyber-grid/20">
          {prev ? (
            <Link to={`/kb/${encodeURIComponent(prev.name)}`} className="group flex items-center gap-2 text-sm font-mono text-cyber-grid hover:text-cyber-cyan">
              <ArrowLeft className="w-4 h-4" /> {prev.title}
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/kb/${encodeURIComponent(next.name)}`} className="group flex items-center gap-2 text-sm font-mono text-cyber-grid hover:text-cyber-cyan text-right">
              {next.title} <ArrowRight className="w-4 h-4" />
            </Link>
          ) : <span />}
        </div>
      </div>
    </div>
    </>
  )
}
