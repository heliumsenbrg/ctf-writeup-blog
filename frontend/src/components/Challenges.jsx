import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Flag, CheckCircle, Clock, Zap, Filter } from 'lucide-react'
import { allChallenges } from '../data/challenges.js'
import { platformKey, PLATFORM_BADGE } from '../utils/platform.js'

const CYBER_COLORS = {
  cyan: '#00f5ff',
  blue: '#60a5fa',
  purple: '#a78bfa',
  pink: '#f472b6',
}

export const platformNames = {
  all: { name: '全部靶场', color: 'cyan' },
  ctfshow: { name: 'CTFShow', color: 'blue' },
  qingcen: { name: '青岑 QC', color: 'purple' },
  moectf: { name: 'MoeCTF', color: 'pink' },
  other: { name: '其他', color: 'cyan' }
}

export const categoryNames = {
  infoleak: { name: '信息收集与泄露', color: 'cyan' },
  php: { name: 'PHP 弱类型', color: 'purple' },
  cmd: { name: '命令注入', color: 'pink' },
  pwn: { name: 'PWN 与逆向', color: 'blue' },
  web: { name: 'Web 练习', color: 'cyan' },
  reverse: { name: '逆向工程', color: 'purple' },
  crypto: { name: '密码学', color: 'pink' },
  stego: { name: '隐写术', color: 'cyan' },
  misc: { name: '杂项', color: 'blue' },
  tools: { name: '工具', color: 'cyan' },
  'moectf-emoji': { name: '编码与进制', color: 'cyan' },
  'moectf-zipcrypto': { name: '压缩包密码学', color: 'purple' },
}

// 兜底：未知分类不应让整页崩掉
const catMeta = (cat) => categoryNames[cat] || { name: cat, color: 'cyan' }

// 难度等级 - 基于分数
function getDifficulty(points) {
  if (points < 100) return { label: 'Easy', color: 'green', bg: 'bg-green-900/40', text: 'text-green-400' }
  if (points <= 200) return { label: 'Medium', color: 'yellow', bg: 'bg-yellow-900/40', text: 'text-yellow-400' }
  return { label: 'Hard', color: 'red', bg: 'bg-red-900/40', text: 'text-red-400' }
}

export default function Challenges() {
  const [platform, setPlatform] = useState('all')
  const [category, setCategory] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [tag, setTag] = useState('all')
  const [q, setQ] = useState('')

  // 选项从数据里派生（不写死，新增挑战自动出现）
  const catOptions = [...new Set(allChallenges.map(c => c.category))]
  const diffOptions = [...new Set(allChallenges.map(c => c.difficulty).filter(Boolean))]
  const tagOptions = Object.entries(
    allChallenges.reduce((acc, c) => {
      for (const t of c.tags || []) acc[t] = (acc[t] || 0) + 1
      return acc
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t]) => t)

  const hasFilter = platform !== 'all' || category !== 'all' || difficulty !== 'all' || tag !== 'all' || q.trim() !== ''
  const clearAll = () => { setPlatform('all'); setCategory('all'); setDifficulty('all'); setTag('all'); setQ('') }

  const kw = q.trim().toLowerCase()
  const filtered = allChallenges.filter(c => {
    if (platform !== 'all' && platformKey(c.platform) !== platform) return false
    if (category !== 'all' && c.category !== category) return false
    if (difficulty !== 'all' && c.difficulty !== difficulty) return false
    if (tag !== 'all' && !(c.tags || []).includes(tag)) return false
    if (kw) {
      const hay = `${c.title || ''} ${c.slug || ''} ${c.description || ''} ${(c.tags || []).join(' ')}`.toLowerCase()
      if (!hay.includes(kw)) return false
    }
    return true
  })

  const grouped = filtered.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = []
    acc[c.category].push(c)
    return acc
  }, {})
  
  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-cyber-purple/70 text-sm font-mono tracking-widest">
            ▶ CHALLENGE_LIST
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 anime-title text-gradient">
            题目列表
          </h1>
          <p className="text-cyber-grid mt-4 font-mono">
            共 <span className="text-cyber-cyan">{filtered.length}</span> 题 | 
            已解 <span className="text-cyber-cyan">{filtered.filter(c => c.solved).length}</span> 题 |
            总分 <span className="text-cyber-cyan">{filtered.reduce((sum, c) => sum + c.points, 0)}</span> pts
          </p>
        </motion.div>

        {/* Platform Filter */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
        >
          <Filter className="w-4 h-4 text-cyber-grid" />
          {Object.entries(platformNames).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setPlatform(key)}
              className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg text-xs sm:text-sm font-mono transition-all border"
              style={platform === key
                ? { backgroundColor: CYBER_COLORS[val.color] + '33', color: CYBER_COLORS[val.color], borderColor: CYBER_COLORS[val.color] + '80' }
                : { color: 'rgba(138,154,190,0.6)', borderColor: 'transparent' }
              }
            >
              {val.name}
            </button>
          ))}
        </motion.div>

        {/* 多维筛选：分类 / 难度 / 标签 + 关键词 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10 flex flex-col gap-3"
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-mono text-cyber-grid/60">分类</span>
            {catOptions.map(c => (
              <button key={c} onClick={() => setCategory(category === c ? 'all' : c)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-mono transition-colors ${
                  category === c ? 'border-cyber-cyan/60 bg-cyber-cyan/10 text-cyber-cyan' : 'border-cyber-grid/25 text-cyber-grid hover:border-cyber-cyan/40 hover:text-cyber-cyan'
                }`}>
                {catMeta(c).name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-mono text-cyber-grid/60">难度</span>
            {diffOptions.map(d => (
              <button key={d} onClick={() => setDifficulty(difficulty === d ? 'all' : d)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-mono transition-colors ${
                  difficulty === d ? 'border-cyber-purple/60 bg-cyber-purple/10 text-cyber-purple' : 'border-cyber-grid/25 text-cyber-grid hover:border-cyber-purple/40 hover:text-cyber-purple'
                }`}>
                {d}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-mono text-cyber-grid/60">标签</span>
            {tagOptions.map(t => (
              <button key={t} onClick={() => setTag(tag === t ? 'all' : t)}
                className={`rounded border px-2 py-0.5 text-[11px] font-mono transition-colors ${
                  tag === t ? 'border-cyber-cyan/60 bg-cyber-cyan/10 text-cyber-cyan' : 'border-cyber-grid/20 text-cyber-grid/70 hover:text-cyber-cyan'
                }`}>
                #{t}
              </button>
            ))}
          </div>

          <div className="mx-auto flex w-full max-w-md items-center gap-2">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="搜标题 / 描述 / 标签…"
              className="w-full rounded-lg border border-cyber-grid/30 bg-cyber-darker/60 px-3 py-1.5 text-xs text-cyber-cyan placeholder:text-cyber-grid/50 outline-none focus:border-cyber-cyan/50"
            />
            {hasFilter && (
              <button onClick={clearAll}
                className="shrink-0 rounded-lg border border-cyber-grid/30 px-2.5 py-1.5 text-xs font-mono text-cyber-grid transition-colors hover:border-cyber-red/50 hover:text-cyber-red">
                清除
              </button>
            )}
          </div>
        </motion.div>

        {/* Challenge categories */}
        {Object.entries(grouped).map(([cat, items], catIndex) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: CYBER_COLORS[catMeta(cat).color] + '33' }}>
                <Flag className="w-4 h-4" style={{ color: CYBER_COLORS[catMeta(cat).color] }} />
              </div>
              <h2 className="text-2xl font-bold text-cyber-cyan anime-title">
                {catMeta(cat).name}
              </h2>
              <span className="text-sm text-cyber-grid font-mono">
                {items.length}题 | {items.reduce((sum, c) => sum + c.points, 0)}pts
              </span>
            </div>
            
            <div className="grid gap-3">
              {items.map((challenge, i) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: catIndex * 0.1 + i * 0.05 }}
                >
                  <Link to={`/article/${cat}`}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="cyber-card p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          challenge.solved 
                            ? 'bg-cyber-cyan/20 text-cyber-cyan' 
                            : 'bg-cyber-grid/20 text-cyber-grid'
                        }`}>
                          {challenge.solved ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-cyber-cyan group-hover:text-white transition-colors">
                              {challenge.name || challenge.title}
                            </span>
                            {challenge.firstBlood && (
                              <span className="px-2 py-0.5 text-xs bg-cyber-pink/20 text-cyber-pink rounded font-mono animate-pulse">
                                一血
                              </span>
                            )}
                            <span className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${PLATFORM_BADGE[platformKey(challenge.platform)].className}`}>
                              {PLATFORM_BADGE[platformKey(challenge.platform)].label || challenge.platform}
                            </span>
                            <span className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${getDifficulty(challenge.points).bg} ${getDifficulty(challenge.points).text}`}>
                              {getDifficulty(challenge.points).label}
                            </span>
                          </div>
                          <span className="text-xs text-cyber-grid font-mono">
                            ID: {challenge.id}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 sm:gap-6 pl-14 sm:pl-0">
                        <span className="text-xs sm:text-sm text-cyber-grid">
                          {challenge.method || challenge.description}
                        </span>
                        <span className="text-base sm:text-lg font-bold text-cyber-cyan">
                          {challenge.points}
                          <span className="text-xs text-cyber-grid ml-1">pts</span>
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
        
        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="cyber-card p-5 sm:p-8 mt-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-cyber-cyan" />
            <span className="text-cyber-purple/70 text-sm font-mono">▶ SUMMARY</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-gradient">
                {filtered.filter(c => c.firstBlood).length > 0
                  ? Math.round(filtered.filter(c => c.firstBlood).length / filtered.length * 100)
                  : 0}%
              </div>
              <div className="text-xs text-cyber-grid">一血率</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">{filtered.filter(c => c.solved).length}</div>
              <div className="text-xs text-cyber-grid">已解题数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">{new Set(filtered.map(c => c.category)).size}</div>
              <div className="text-xs text-cyber-grid">分类数量</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">{filtered.filter(c => !c.solved).length}</div>
              <div className="text-xs text-cyber-grid">未解题数</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
