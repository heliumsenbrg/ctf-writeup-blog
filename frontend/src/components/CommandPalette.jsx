import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FileText, Library, Flag, CornerDownLeft } from 'lucide-react'

const TYPE_META = {
  writeup: { label: '题解', Icon: FileText, tone: 'text-cyber-cyan' },
  note: { label: '知识库', Icon: Library, tone: 'text-cyber-purple' },
  challenge: { label: '挑战', Icon: Flag, tone: 'text-amber-400' },
}
const ORDER = ['writeup', 'note', 'challenge']

function normalize(value) {
  return String(value || '').normalize('NFKC').toLowerCase()
}

function gramsOf(value) {
  const grams = new Set()
  for (const token of normalize(value).match(/[\u3400-\u9fff]+|[a-z0-9_]+/g) || []) {
    for (const character of token) grams.add(character)
    for (let i = 0; i + 1 < token.length; i++) grams.add(token.slice(i, i + 2))
  }
  return [...grams]
}

function scoreOf(item, id, postings, q) {
  const title = normalize(item.title)
  const sub = normalize(item.sub)
  const tags = normalize((item.tags || []).join(' '))
  const terms = q.split(/\s+/).flatMap((part) => normalize(part).match(/[\u3400-\u9fff]+|[a-z0-9_]+/g) || [])
  if (!terms.length) return 0

  let total = 0
  for (const term of terms) {
    let s = 0
    if (title === term) s = 120
    else if (title.startsWith(term)) s = 80
    else if (title.includes(term)) s = 55
    else if (sub.includes(term)) s = 25
    else if (tags.includes(term)) s = 10
    else if (gramsOf(term).every((gram) => postings[gram]?.includes(id))) s = 10
    if (!s) return 0
    total += s
  }
  return total
}

/** 把命中的片段高亮出来 */
function Highlight({ text, query }) {
  const q = (query || '').trim().split(/\s+/).filter(Boolean)
  if (!q.length) return text
  const re = new RegExp(`(${q.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  return String(text)
    .split(re)
    .map((part, i) =>
      q.some((t) => part.toLowerCase() === t.toLowerCase()) ? (
        <mark key={i} className="bg-cyber-cyan/25 text-cyber-cyan rounded px-0.5">{part}</mark>
      ) : (
        part
      )
    )
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(null)
  const [q, setQ] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef(null)
  const dialogRef = useRef(null)
  const restoreFocusRef = useRef(null)
  const navigate = useNavigate()

  // 打开方式：⌘K / Ctrl+K，或任意处 dispatchEvent(new Event('open-command-palette'))
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-command-palette', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('open-command-palette', onOpen)
    }
  }, [])

  // 首次打开时才取轻量元数据与正文 gram 倒排表，不拖累首屏。
  useEffect(() => {
    if (!open || index) return
    let alive = true
    fetch(`${import.meta.env.BASE_URL}search-index.json`)
      .then((r) => (r.ok ? r.json() : { items: [], terms: {} }))
      .then((data) => alive && setIndex({ items: data.items || [], terms: data.terms || {} }))
      .catch(() => alive && setIndex({ items: [], terms: {} }))
    return () => { alive = false }
  }, [open, index])

  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement
      setQ('')
      setCursor(0)
      const timer = window.setTimeout(() => inputRef.current?.focus(), 30)
      return () => window.clearTimeout(timer)
    }

    restoreFocusRef.current?.focus?.()
    restoreFocusRef.current = null
  }, [open])

  const groups = useMemo(() => {
    if (!index) return []
    const items = index.items
    const query = q.trim()
    const scored = query
      ? items.map((item, id) => ({ i: item, s: scoreOf(item, id, index.terms, query) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s)
      : items.slice(0, 24).map((i) => ({ i, s: 0 }))
    const byType = ORDER.map((t) => ({
      type: t,
      rows: scored.filter((x) => x.i.type === t).slice(0, 6).map((x) => x.i),
    })).filter((g) => g.rows.length)
    return byType
  }, [index, q])

  const flat = useMemo(() => groups.flatMap((g) => g.rows), [groups])

  const go = useCallback(
    (item) => {
      if (!item) return
      setOpen(false)
      navigate(item.path)
    },
    [navigate]
  )

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(c + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(c - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(flat[cursor])
    }
  }

  const trapDialogFocus = (e) => {
    if (e.key !== 'Tab') return
    const focusable = dialogRef.current?.querySelectorAll(
      'input:not([disabled]), button:not([disabled]), a[href], select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable?.length) {
      e.preventDefault()
      inputRef.current?.focus()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  if (!open) return null

  let idx = -1
  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
      onKeyDown={trapDialogFocus}
      role="dialog"
      aria-modal="true"
      aria-label="全站搜索"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-cyber-cyan/25 bg-cyber-darker/95 shadow-[0_0_40px_rgba(0,245,255,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-cyber-grid/20 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-cyber-cyan" />
          <input
            ref={inputRef}
            aria-label="搜索题解、知识库和挑战"
            aria-controls="command-palette-results"
            aria-expanded={index !== null}
            aria-activedescendant={flat[cursor] ? `command-palette-option-${cursor}` : undefined}
            aria-autocomplete="list"
            role="combobox"
            value={q}
            onChange={(e) => { setQ(e.target.value); setCursor(0) }}
            onKeyDown={onKeyDown}
            placeholder="搜索题解 / 知识库 / 挑战…"
            className="w-full bg-transparent text-sm text-cyber-grid outline-none placeholder:text-cyber-grid/45"
          />
          <kbd className="shrink-0 rounded border border-cyber-grid/30 px-1.5 py-0.5 text-[10px] font-mono text-cyber-grid/60">
            ESC
          </kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto py-2">
          {index === null && <div role="status" className="px-4 py-6 text-center text-xs font-mono text-cyber-grid/60">加载索引…</div>}
          {index && !flat.length && (
            <div role="status" className="px-4 py-6 text-center text-xs font-mono text-cyber-grid/60">
              {q ? `没有匹配「${q}」的内容` : '输入关键词开始搜索'}
            </div>
          )}
          <div id="command-palette-results" role="listbox" aria-label="搜索结果">
            {groups.map((g) => {
              const meta = TYPE_META[g.type]
              return (
                <div key={g.type} role="group" aria-label={`${meta.label} · ${g.rows.length}`} className="mb-1">
                  <div aria-hidden="true" className="px-4 py-1 text-[10px] font-mono uppercase tracking-widest text-cyber-grid/45">
                    {meta.label} · {g.rows.length}
                  </div>
                  {g.rows.map((item) => {
                    idx += 1
                    const active = idx === cursor
                    return (
                      <button
                        key={item.path + item.title}
                        id={`command-palette-option-${idx}`}
                        role="option"
                        aria-selected={active}
                        onMouseEnter={() => setCursor(flat.indexOf(item))}
                        onClick={() => go(item)}
                        className={`flex w-full items-start gap-3 px-4 py-2 text-left transition-colors ${
                          active ? 'bg-cyber-cyan/10' : 'hover:bg-cyber-cyan/5'
                        }`}
                      >
                        <meta.Icon className={`mt-0.5 h-4 w-4 shrink-0 ${meta.tone}`} />
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-cyber-grid">
                            <Highlight text={item.title} query={q} />
                          </span>
                          {item.sub && (
                            <span className="mt-0.5 block truncate text-xs text-cyber-grid/55">
                              <Highlight text={item.sub} query={q} />
                            </span>
                          )}
                        </span>
                        {active && <CornerDownLeft className="ml-auto mt-1 h-3.5 w-3.5 shrink-0 text-cyber-cyan/60" />}
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-cyber-grid/20 px-4 py-2 text-[10px] font-mono text-cyber-grid/45">
          <span>↑↓ 选择</span>
          <span>↵ 打开</span>
          <span>⌘K 开关</span>
          <span className="ml-auto">{index ? `${index.items.length} 条索引` : ''}</span>
        </div>
      </div>
    </div>
  )
}
