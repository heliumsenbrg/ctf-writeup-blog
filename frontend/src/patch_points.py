import io

p = 'src/components/Challenges.jsx'
s = io.open(p, encoding='utf-8').read()

# ① state
old = "  const [tag, setTag] = useState('all')\n  const [q, setQ] = useState('')"
assert old in s, 'state 锚点未命中'
s = s.replace(old, old + "\n  const [points, setPoints] = useState('all')\n  const [sort, setSort] = useState('default')", 1)

# ② 筛选 + 排序
old2 = """    if (kw) {
      const hay = `${c.title || ''} ${c.slug || ''} ${c.description || ''} ${(c.tags || []).join(' ')}`.toLowerCase()
      if (!hay.includes(kw)) return false
    }
    return true
  })"""
assert old2 in s, 'filtered 锚点未命中'
new2 = """    if (kw) {
      const hay = `${c.title || ''} ${c.slug || ''} ${c.description || ''} ${(c.tags || []).join(' ')}`.toLowerCase()
      if (!hay.includes(kw)) return false
    }
    const pts = Number(c.points || 0)
    if (points === 'low' && pts > 100) return false
    if (points === 'mid' && (pts <= 100 || pts > 300)) return false
    if (points === 'high' && pts <= 300) return false
    return true
  }).sort((a, b) => {
    if (sort === 'points-desc') return (b.points || 0) - (a.points || 0)
    if (sort === 'points-asc') return (a.points || 0) - (b.points || 0)
    if (sort === 'date-desc') return String(b.date || '').localeCompare(String(a.date || ''))
    return 0
  })"""
s = s.replace(old2, new2, 1)

# ③ 清除按钮也要复位新增的两项
s = s.replace(
    "const hasFilter = platform !== 'all' || category !== 'all' || difficulty !== 'all' || tag !== 'all' || q.trim() !== ''",
    "const hasFilter = platform !== 'all' || category !== 'all' || difficulty !== 'all' || tag !== 'all' || points !== 'all' || sort !== 'default' || q.trim() !== ''",
    1,
)
s = s.replace(
    "const clearAll = () => { setPlatform('all'); setCategory('all'); setDifficulty('all'); setTag('all'); setQ('') }",
    "const clearAll = () => { setPlatform('all'); setCategory('all'); setDifficulty('all'); setTag('all'); setPoints('all'); setSort('default'); setQ('') }",
    1,
)

# ④ UI：在标签行之后、搜索框之前插入「分值 + 排序」
anchor = """          <div className="mx-auto flex w-full max-w-md items-center gap-2">
            <input
              value={q}"""
assert anchor in s, 'UI 锚点未命中'
ui = """          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-mono text-cyber-grid/60">分值</span>
            {[['low', '≤100'], ['mid', '101–300'], ['high', '>300']].map(([k, label]) => (
              <button key={k} onClick={() => setPoints(points === k ? 'all' : k)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-mono transition-colors ${
                  points === k ? 'border-cyber-cyan/60 bg-cyber-cyan/10 text-cyber-cyan' : 'border-cyber-grid/25 text-cyber-grid hover:border-cyber-cyan/40 hover:text-cyber-cyan'
                }`}>
                {label}
              </button>
            ))}
            <span className="ml-3 text-[11px] font-mono text-cyber-grid/60">排序</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-cyber-grid/30 bg-cyber-darker/60 px-2 py-1 text-xs font-mono text-cyber-cyan outline-none focus:border-cyber-cyan/50"
            >
              <option value="default">默认</option>
              <option value="points-desc">分值从高到低</option>
              <option value="points-asc">分值从低到高</option>
              <option value="date-desc">最新在前</option>
            </select>
          </div>

""" + anchor
s = s.replace(anchor, ui, 1)

io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('OK: 挑战页加了分值筛选 + 排序')
