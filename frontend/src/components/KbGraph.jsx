import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 知识库关系图 —— 力导向 + Canvas，**不依赖任何图库**。
 * 数据：构建时生成的 kb-graph.json（节点=笔记，边=站内双链，已去重、去掉指向未发布笔记的边）。
 */

// 一组够用又互相区分的配色（按 section 顺序分配）
const PALETTE = ['#00f5ff', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#60a5fa', '#fb7185', '#c084fc']

/** 简易力导向布局：斥力 + 弹簧 + 向心，跑固定轮数后定格（69 个节点很快） */
function layout(nodes, edges, { iterations, width, height }) {
  const idx = new Map(nodes.map((n, i) => [n.id, i]))
  const N = nodes.length
  const px = new Float64Array(N)
  const py = new Float64Array(N)

  // 初始位置：按 section 分簇 + 抖动，避免全部重叠
  const groups = [...new Set(nodes.map((n) => n.section))]
  nodes.forEach((n, i) => {
    const gi = groups.indexOf(n.section)
    const ang = (gi / Math.max(1, groups.length)) * Math.PI * 2
    const r = Math.min(width, height) * 0.22
    px[i] = width / 2 + Math.cos(ang) * r + (Math.random() - 0.5) * 40
    py[i] = height / 2 + Math.sin(ang) * r + (Math.random() - 0.5) * 40
  })

  const rest = Math.max(38, Math.min(width, height) / 9)
  const pairs = []
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) pairs.push([i, j])

  for (let it = 0; it < iterations; it++) {
    const cool = 1 - it / iterations
    const fx = new Float64Array(N)
    const fy = new Float64Array(N)

    // 斥力（节点越多斥力越弱，避免整体炸开）
    for (const [i, j] of pairs) {
      let dx = px[i] - px[j]
      let dy = py[i] - py[j]
      let d2 = dx * dx + dy * dy
      if (d2 < 0.01) { dx = (Math.random() - 0.5) * 0.5; dy = (Math.random() - 0.5) * 0.5; d2 = 0.25 }
      const f = (2600 / d2) * cool
      const d = Math.sqrt(d2)
      const ux = (dx / d) * f
      const uy = (dy / d) * f
      fx[i] += ux; fy[i] += uy
      fx[j] -= ux; fy[j] -= uy
    }

    // 弹簧（有边相连的拉近）
    for (const [a, b] of edges) {
      const i = idx.get(a)
      const j = idx.get(b)
      if (i === undefined || j === undefined) continue
      const dx = px[j] - px[i]
      const dy = py[j] - py[i]
      const d = Math.max(0.01, Math.hypot(dx, dy))
      const f = (d - rest) * 0.045 * cool
      const ux = (dx / d) * f
      const uy = (dy / d) * f
      fx[i] += ux; fy[i] += uy
      fx[j] -= ux; fy[j] -= uy
    }

    // 向心 + 位移
    for (let i = 0; i < N; i++) {
      fx[i] += (width / 2 - px[i]) * 0.012 * cool
      fy[i] += (height / 2 - py[i]) * 0.012 * cool
      px[i] += Math.max(-12, Math.min(12, fx[i]))
      py[i] += Math.max(-12, Math.min(12, fy[i]))
    }
  }

  return nodes.map((n, i) => ({ ...n, x: px[i], y: py[i] }))
}

export default function KbGraph() {
  const [data, setData] = useState(null)
  const [hover, setHover] = useState(null) // 当前悬停的节点（含其邻居集合）
  const canvasRef = useRef(null)
  const boxRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true
    fetch(`${import.meta.env.BASE_URL}kb-graph.json`)
      .then((r) => (r.ok ? r.json() : { nodes: [], edges: [] }))
      .then((d) => alive && setData(d))
      .catch(() => alive && setData({ nodes: [], edges: [] }))
    return () => { alive = false }
  }, [])

  const sized = useRef({ w: 0, h: 0 })

  const sectionMeta = useMemo(() => {
    const list = []
    for (const n of data?.nodes || []) {
      if (!list.some((s) => s.id === n.section)) list.push({ id: n.section, title: n.sectionTitle, count: 0 })
    }
    for (const n of data?.nodes || []) {
      const s = list.find((x) => x.id === n.section)
      if (s) s.count += 1
    }
    return list.map((s, i) => ({ ...s, color: PALETTE[i % PALETTE.length] }))
  }, [data])

  const colorOf = (section) => sectionMeta.find((s) => s.id === section)?.color || '#8a9abe'

  // 计算布局（数据变了才重算）
  const placed = useMemo(() => {
    if (!data?.nodes?.length) return null
    const w = 900
    const h = 620
    return layout(data.nodes, data.edges, { iterations: 420, width: w, height: h })
  }, [data])

  const neighbors = useMemo(() => {
    const m = new Map()
    if (!data) return m
    for (const [a, b] of data.edges) {
      if (!m.has(a)) m.set(a, new Set())
      if (!m.has(b)) m.set(b, new Set())
      m.get(a).add(b)
      m.get(b).add(a)
    }
    return m
  }, [data])

  // 绘制
  useEffect(() => {
    const canvas = canvasRef.current
    const box = boxRef.current
    if (!canvas || !box || !placed) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const w = box.clientWidth
    const h = Math.max(420, Math.min(680, Math.round(w * 0.62)))
    if (sized.current.w !== w) {
      sized.current = { w, h }
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }

    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    // 自适应缩放
    const xs = placed.map((n) => n.x)
    const ys = placed.map((n) => n.y)
    const minX = Math.min(...xs), maxX = Math.max(...xs)
    const minY = Math.min(...ys), maxY = Math.max(...ys)
    const pad = 46
    const sx = (w - pad * 2) / Math.max(1, maxX - minX)
    const sy = (h - pad * 2) / Math.max(1, maxY - minY)
    const s = Math.min(sx, sy)
    const ox = pad - minX * s + (w - pad * 2 - (maxX - minX) * s) / 2
    const oy = pad - minY * s + (h - pad * 2 - (maxY - minY) * s) / 2
    const P = (n) => ({ x: n.x * s + ox, y: n.y * s + oy })

    const active = hover ? new Set([hover.id, ...(neighbors.get(hover.id) || [])]) : null
    const pos = new Map(placed.map((n) => [n.id, P(n)]))
    // 把屏幕坐标回写到节点上 —— 命中检测（onMove）要用
    for (const n of placed) {
      const p = pos.get(n.id)
      n.px = p.x
      n.py = p.y
    }

    // 边
    for (const [a, b] of data.edges) {
      const pa = pos.get(a)
      const pb = pos.get(b)
      if (!pa || !pb) continue
      const on = !active || (active.has(a) && active.has(b))
      ctx.strokeStyle = on ? 'rgba(0,245,255,0.22)' : 'rgba(138,154,190,0.07)'
      ctx.lineWidth = on ? 1 : 0.6
      ctx.beginPath()
      ctx.moveTo(pa.x, pa.y)
      ctx.lineTo(pb.x, pb.y)
      ctx.stroke()
    }

    // 节点
    for (const n of placed) {
      const p = pos.get(n.id)
      const r = 3.4 + Math.sqrt(n.degree) * 1.75
      const on = !active || active.has(n.id)
      const c = colorOf(n.section)

      if (n.id === hover?.id) {
        ctx.shadowColor = c
        ctx.shadowBlur = 18
      } else {
        ctx.shadowBlur = 0
      }
      ctx.beginPath()
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
      ctx.fillStyle = on ? c : 'rgba(138,154,190,0.25)'
      ctx.globalAlpha = on ? 0.95 : 0.5
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      // 只给最大的枢纽和悬停节点画标签，避免中间糊成一片
      if (on && (n.degree >= 10 || n.id === hover?.id)) {
        ctx.font = `${n.id === hover?.id ? '600 ' : ''}11px ui-monospace, monospace`
        ctx.fillStyle = n.id === hover?.id ? '#e0e8f0' : 'rgba(138,154,190,0.75)'
        ctx.textAlign = 'center'
        ctx.fillText(n.title.length > 14 ? `${n.title.slice(0, 13)}…` : n.title, p.x, p.y - r - 5)
      }
    }
  }, [placed, hover, data, neighbors, sectionMeta])

  // 交互：悬停 / 点击
  const onMove = (e) => {
    const canvas = canvasRef.current
    if (!canvas || !placed) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    let best = null
    let bestD = 16 * 16
    for (const n of placed) {
      const dx = n.px - mx
      const dy = n.py - my
      const d = dx * dx + dy * dy
      if (d < bestD) { bestD = d; best = n }
    }
    setHover(best)
  }

  const onClick = () => {
    if (hover) navigate(`/kb/${encodeURIComponent(hover.id)}`)
  }

  if (!data) return <div className="py-16 text-center text-xs font-mono text-cyber-grid/60">加载图谱…</div>
  if (!data.nodes.length) return <div className="py-16 text-center text-xs font-mono text-cyber-grid/60">没有可展示的笔记</div>

  return (
    <div ref={boxRef}>
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-cyber-grid/70">
        {sectionMeta.map((s) => (
          <span key={s.id} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.title} <span className="text-cyber-grid/40">{s.count}</span>
          </span>
        ))}
        <span className="ml-auto text-cyber-grid/45">
          {data.nodes.length} 篇笔记 · {data.edges.length} 条双链 · 圆点越大表示链接越多
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-cyber-grid/20 bg-black/40">
        <canvas
          ref={canvasRef}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          onClick={onClick}
          className={hover ? 'cursor-pointer' : 'cursor-default'}
        />
        {hover && (
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-cyber-cyan/30 bg-cyber-darker/90 px-3 py-2 text-xs">
            <div className="font-mono text-cyber-cyan">{hover.title}</div>
            <div className="mt-0.5 text-[10px] text-cyber-grid/60">
              {hover.sectionTitle} · {hover.group} · 链接 {hover.degree} 条 · 点击打开
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
