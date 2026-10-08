import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, CalendarDays, Tag, Trophy, Target, Flame } from 'lucide-react'
import { allChallenges } from '../data/challenges.js'
import { platformKey, PLATFORM_BADGE } from '../utils/platform.js'
import { categoryNames } from './Challenges.jsx'

/**
 * 战绩页 —— 全部基于 challenges.js 里已有的 date / tags / points / difficulty 派生，
 * 不引任何图表库（柱状、累计曲线、标签云都是手写 CSS/SVG）。
 */
export default function Stats() {
  const s = useMemo(() => {
    const byMonth = {}
    for (const c of allChallenges) {
      const m = (c.date || '').slice(0, 7)
      if (m) byMonth[m] = (byMonth[m] || 0) + 1
    }
    const months = Object.keys(byMonth).sort()

    const by = (fn) =>
      Object.entries(allChallenges.reduce((a, c) => { const k = fn(c); if (k) a[k] = (a[k] || 0) + 1; return a }, {}))
        .sort((x, y) => y[1] - x[1])

    const tags = Object.entries(
      allChallenges.reduce((a, c) => { for (const t of c.tags || []) a[t] = (a[t] || 0) + 1; return a }, {})
    ).sort((x, y) => y[1] - x[1])

    const totalPoints = allChallenges.reduce((a, c) => a + (c.points || 0), 0)
    const solved = allChallenges.filter((c) => c.solved).length

    // 累计曲线坐标
    let run = 0
    const cum = months.map((m) => (run += byMonth[m]))
    return { months, byMonth, cum, platforms: by((c) => c.platform), cats: by((c) => c.category), diffs: by((c) => c.difficulty), tags, totalPoints, solved }
  }, [])

  const maxMonth = Math.max(...s.months.map((m) => s.byMonth[m]), 1)
  const maxTag = Math.max(...s.tags.map(([, n]) => n), 1)
  const catName = (k) => (categoryNames[k] || { name: k }).name

  const W = 560
  const H = 120
  const pts = s.cum
    .map((v, i) => `${(i / Math.max(1, s.cum.length - 1)) * W},${H - (v / Math.max(1, s.cum[s.cum.length - 1])) * (H - 12)}`)
    .join(' ')

  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <span className="text-cyber-purple/70 text-sm font-mono tracking-widest">STATS</span>
          <h1 className="mt-2 text-3xl font-bold anime-title text-gradient sm:text-4xl">战绩统计</h1>
          <p className="mt-3 text-sm font-mono text-cyber-grid">全部数字由挑战数据实时派生 · 不写死</p>
        </motion.div>

        {/* 汇总 */}
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            [<Target key="a" className="h-4 w-4" />, allChallenges.length, '条挑战记录'],
            [<Trophy key="b" className="h-4 w-4" />, s.totalPoints, '总积分'],
            [<Flame key="c" className="h-4 w-4" />, `${s.solved}/${allChallenges.length}`, '已解'],
            [<CalendarDays key="d" className="h-4 w-4" />, `${s.months.length} 个月`, '有记录'],
          ].map(([icon, val, label], i) => (
            <div key={i} className="glass-card p-4 text-center">
              <div className="mb-1 flex justify-center text-cyber-cyan">{icon}</div>
              <div className="text-2xl font-bold text-cyber-cyan">{val}</div>
              <div className="mt-0.5 text-[11px] font-mono text-cyber-grid/60">{label}</div>
            </div>
          ))}
        </div>

        {/* 月度柱状 + 累计曲线 */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-cyber-cyan anime-title">
            <BarChart3 className="h-4 w-4" /> 解题时间线
          </h2>
          <div className="glass-card p-5">
            <div className="flex h-32 items-end gap-2">
              {s.months.map((m) => (
                <div key={m} className="group flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-mono text-cyber-cyan/80">{s.byMonth[m]}</span>
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-cyber-cyan/20 to-cyber-cyan/70 transition-all group-hover:to-cyber-cyan"
                    style={{ height: `${(s.byMonth[m] / maxMonth) * 88}px` }}
                    title={`${m}：${s.byMonth[m]} 条`}
                  />
                  <span className="text-[10px] font-mono text-cyber-grid/50">{m.slice(5)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="mb-1 text-[11px] font-mono text-cyber-grid/60">累计</div>
              <svg viewBox={`0 0 ${W} ${H}`} className="h-24 w-full">
                <polyline points={pts} fill="none" stroke="#00f5ff" strokeWidth="2" strokeLinejoin="round" />
                <polyline points={`0,${H} ${pts} ${W},${H}`} fill="rgba(0,245,255,0.08)" stroke="none" />
              </svg>
            </div>
          </div>
        </section>

        {/* 分布 */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          <section>
            <h3 className="mb-3 text-sm font-bold text-cyber-purple">平台分布</h3>
            <div className="glass-card flex flex-col gap-2 p-4">
              {s.platforms.slice(0, 8).map(([k, n]) => (
                <div key={k} className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-28 shrink-0 truncate text-cyber-grid">{PLATFORM_BADGE[platformKey(k)]?.label || k}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/40">
                    <div className="h-full rounded-full bg-cyber-cyan/60" style={{ width: `${(n / s.platforms[0][1]) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right text-cyber-cyan">{n}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold text-cyber-purple">方向分布</h3>
            <div className="glass-card flex flex-col gap-2 p-4">
              {s.cats.slice(0, 8).map(([k, n]) => (
                <div key={k} className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-28 shrink-0 truncate text-cyber-grid">{catName(k)}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/40">
                    <div className="h-full rounded-full bg-cyber-purple/60" style={{ width: `${(n / s.cats[0][1]) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right text-cyber-purple">{n}</span>
                </div>
              ))}
              <div className="mt-2 flex flex-wrap gap-2 border-t border-cyber-grid/20 pt-3 text-[11px] font-mono text-cyber-grid/70">
                {s.diffs.map(([d, n]) => (<span key={d}>{d} <span className="text-cyber-cyan">{n}</span></span>))}
              </div>
            </div>
          </section>
        </div>

        {/* 标签云 */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-cyber-cyan anime-title">
            <Tag className="h-4 w-4" /> 标签云
            <span className="text-xs font-mono text-cyber-grid/50">{s.tags.length} 个</span>
          </h2>
          <div className="glass-card flex flex-wrap items-baseline gap-x-3 gap-y-2 p-5">
            {s.tags.map(([t, n]) => {
              const size = 11 + Math.round((n / maxTag) * 11) // 11~22px
              const alpha = 0.45 + (n / maxTag) * 0.55
              return (
                <span key={t} title={`${n} 条挑战`} className="font-mono transition-colors hover:text-cyber-cyan"
                  style={{ fontSize: `${size}px`, color: `rgba(138,154,190,${alpha})` }}>
                  #{t}
                </span>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
