import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, BookOpen, Share2, LayoutGrid } from 'lucide-react'
import KbGraph from './KbGraph'

export default function Kb() {
  const [query, setQuery] = useState('')
  const [view, setView] = useState('cards')
  const [kbIndex, setKbIndex] = useState(null)

  // 动态加载元数据 (独立 chunk) —— 主包不因知识库增大
  useEffect(() => {
    let alive = true
    import('../data/kb/index.js').then(m => { if (alive) setKbIndex(m.default) })
    return () => { alive = false }
  }, [])

  const q = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!kbIndex || !q) return null
    return kbIndex.sections
      .flatMap(s => s.groups.flatMap(g => g.notes))
      .filter(n => (n.name + n.title + n.summary).toLowerCase().includes(q))
  }, [q, kbIndex])

  if (!kbIndex) {
    return <div className="min-h-screen py-20 text-center text-cyber-grid font-mono text-sm">加载中…</div>
  }

  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-cyber-purple/70 text-sm font-mono tracking-widest">KNOWLEDGE BASE</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2 anime-title text-gradient">知识库 · 第二大脑</h1>
          <p className="text-cyber-grid mt-3 font-mono text-sm">
            {kbIndex.total} 篇笔记 · Web / 逆向 / 密码学 / Pwn / 杂项 / 云容器 …（快照 {kbIndex.generatedAt.slice(0, 10)}）
          </p>
        </motion.div>

        {/* 视图切换：卡片 / 关系图 */}
        <div className="mb-8 flex justify-center gap-2 font-mono text-xs">
          {[['cards', '卡片', LayoutGrid], ['graph', '关系图', Share2]].map(([k, label, Icon]) => (
            <button
              key={k}
              onClick={() => setView(k)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 transition-colors ${
                view === k
                  ? 'border-cyber-cyan/60 bg-cyber-cyan/10 text-cyber-cyan'
                  : 'border-cyber-grid/25 text-cyber-grid hover:border-cyber-cyan/40 hover:text-cyber-cyan'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {view === 'graph' ? (
          <KbGraph />
        ) : (
        <>
        <div className="max-w-xl mx-auto mb-10">
          <div className="glass-card flex items-center gap-3 px-4 py-3">
            <Search className="w-4 h-4 text-cyber-cyan shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="搜索标题 / 摘要…"
              className="bg-transparent outline-none w-full text-sm font-mono text-cyber-cyan placeholder:text-cyber-grid/60"
            />
          </div>
        </div>

        {results ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map(n => <NoteCard key={n.name} note={n} />)}
            {results.length === 0 && (
              <p className="text-cyber-grid font-mono text-sm col-span-full text-center py-10">没有匹配的笔记</p>
            )}
          </div>
        ) : (
          kbIndex.sections.map(sec => (
            <section key={sec.id} className="mb-14">
              <h2 className="text-2xl font-bold text-cyber-cyan anime-title mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> {sec.title}
              </h2>
              {sec.groups.map(group => (
                <div key={group.id} className="mb-8">
                  {sec.groups.length > 1 && (
                    <h3 className="text-lg font-bold text-cyber-purple mb-3 font-mono">
                      {group.title}
                      <span className="text-xs text-cyber-grid ml-2">{group.notes.length} 篇</span>
                    </h3>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.notes.map(n => <NoteCard key={n.name} note={n} />)}
                  </div>
                </div>
              ))}
            </section>
          ))
        )}
        </>
        )}
      </div>
    </div>
  )
}

function NoteCard({ note }) {
  return (
    <Link to={`/kb/${encodeURIComponent(note.name)}`} className="glass-card p-4 sm:p-5 neon-border-hover group block">
      <div className="font-bold text-cyber-cyan group-hover:text-white transition-colors mb-2">{note.title}</div>
      <p className="text-xs text-cyber-grid leading-relaxed line-clamp-3">{note.summary || '—'}</p>
    </Link>
  )
}
