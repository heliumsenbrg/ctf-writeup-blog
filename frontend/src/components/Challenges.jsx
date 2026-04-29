import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Flag, CheckCircle, Clock, Zap, Filter, Layers, Terminal, Volume2 } from 'lucide-react'

export const allChallenges = [
  // 信息泄露 - CTFShow
  { id: 177, name: 'basic', category: 'infoleak', points: 50, solved: true, method: 'HTML注释Base64', platform: 'ctfshow' },
  { id: 178, name: 'basic_1', category: 'infoleak', points: 60, solved: true, method: 'HTML注释Base64', platform: 'ctfshow' },
  { id: 179, name: 'basic_2', category: 'infoleak', points: 72, solved: true, method: '参数篡改', platform: 'ctfshow' },
  { id: 180, name: 'basic_3', category: 'infoleak', points: 78, solved: true, method: 'JSFuck解码', platform: 'ctfshow' },
  { id: 181, name: 'basic_4', category: 'infoleak', points: 81, solved: true, method: 'ASCII数组', platform: 'ctfshow' },
  { id: 182, name: 'basic_5', category: 'infoleak', points: 90, solved: true, method: '客户端伪造', platform: 'ctfshow' },
  { id: 183, name: 'basic_6', category: 'infoleak', points: 90, solved: true, method: '响应头泄露', platform: 'ctfshow' },
  { id: 186, name: 'basic_8', category: 'infoleak', points: 144, solved: true, method: '.phps源码泄露', platform: 'ctfshow' },
  { id: 187, name: 'basic_9', category: 'infoleak', points: 111, solved: true, method: 'robots.txt', platform: 'ctfshow' },
  { id: 188, name: 'basic_10', category: 'infoleak', points: 300, solved: true, method: 'Cookie IDOR', platform: 'ctfshow' },
  { id: 192, name: 'basic_14', category: 'infoleak', points: 181, solved: true, method: '/proc/self/fd', platform: 'ctfshow' },
  { id: 643, name: 'basic_7', category: 'infoleak', points: 238, solved: true, method: '302响应体', platform: 'ctfshow' },
  { id: 190, name: 'basic_12', category: 'infoleak', points: 120, solved: true, method: '隐藏文件', platform: 'ctfshow' },
  // PHP弱类型 - QC
  { id: 201, name: 'ezphp', category: 'php', points: 158, solved: true, method: '弱类型绕过', platform: 'qc' },
  { id: 202, name: 'ezphp_1', category: 'php', points: 162, solved: true, method: 'array_search', platform: 'qc' },
  { id: 203, name: 'ezphp_2', category: 'php', points: 171, solved: true, method: '嵌套弱类型', platform: 'qc' },
  { id: 204, name: 'ezmd5', category: 'php', points: 165, solved: true, method: '0e MD5', platform: 'qc' },
  { id: 205, name: 'ezmd5_1', category: 'php', points: 184, solved: true, method: '双0e MD5', platform: 'qc' },
  { id: 206, name: 'ezmd5_2', category: 'php', points: 175, solved: true, method: 'md5数组', platform: 'qc' },
  { id: 207, name: 'ezmd5_3', category: 'php', points: 172, solved: true, method: 'md5数组', platform: 'qc' },
  { id: 208, name: 'ezmd5_4', category: 'php', points: 186, solved: true, method: 'MD5爆破', platform: 'qc' },
  // 命令注入 - QC
  { id: 225, name: 'ezcmd', category: 'cmd', points: 204, solved: true, method: '直接执行', platform: 'qc' },
  { id: 226, name: 'ezcmd_1', category: 'cmd', points: 200, solved: true, method: '分号注入', platform: 'qc' },
  { id: 227, name: 'ezcmd_2', category: 'cmd', points: 208, solved: true, method: '注释截断', platform: 'qc' },
  { id: 228, name: 'ezcmd_3', category: 'cmd', points: 222, solved: true, method: 'IFS绕过', platform: 'qc' },
  { id: 230, name: 'ezcmd_5', category: 'cmd', points: 357, solved: true, method: '无字母RCE ★', firstBlood: true, platform: 'qc' },
  { id: 231, name: 'ezcmd_6', category: 'cmd', points: 263, solved: true, method: 'eval执行', platform: 'qc' },
  { id: 232, name: 'ezcmd_7', category: 'cmd', points: 256, solved: true, method: '字符串拼接', platform: 'qc' },
  { id: 233, name: 'ezcmd_8', category: 'cmd', points: 263, solved: true, method: 'passthru', platform: 'qc' },
  { id: 234, name: 'ezcmd_9', category: 'cmd', points: 270, solved: true, method: 'tab绕过', platform: 'qc' },
  { id: 235, name: 'ezcmd_10', category: 'cmd', points: 357, solved: true, method: '源码泄露 ★', firstBlood: true, platform: 'qc' },
  { id: 236, name: 'ezcmd_11', category: 'cmd', points: 333, solved: true, method: '源码泄露 ★', firstBlood: true, platform: 'qc' },
  // PWN - QC
  { id: 5, name: 'X0r', category: 'pwn', points: 200, solved: true, method: 'XOR解密', platform: 'qc' },
  { id: 151, name: "Pwn's Door", category: 'pwn', points: 150, solved: true, method: '逆向密码', platform: 'qc' },
  { id: 999, name: 'input_function', category: 'pwn', points: 500, solved: true, method: 'Shellcode ★', firstBlood: true, platform: 'qc' },
]

const platformNames = {
  all: { name: '全部靶场', color: 'cyan' },
  ctfshow: { name: 'CTFShow', color: 'blue' },
  qc: { name: 'QC 青岑', color: 'purple' }
}

const categoryNames = {
  infoleak: { name: '信息收集与泄露', color: 'cyan' },
  php: { name: 'PHP 弱类型', color: 'purple' },
  cmd: { name: '命令注入', color: 'pink' },
  pwn: { name: 'PWN 与逆向', color: 'blue' }
}

// ===== Victory Jingle =====
// Web Audio API 合成旋律, 无需外部音频文件
function useVictoryJingle() {
  const ctxRef = useRef(null)
  const playedRef = useRef(false)
  const [canPlay, setCanPlay] = useState(false)

  // 等待用户交互以初始化 AudioContext (浏览器自动播放策略)
  useEffect(() => {
    const handler = () => {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
        setCanPlay(true)
      }
      if (ctxRef.current.state === 'suspended') {
        ctxRef.current.resume()
      }
    }
    window.addEventListener('click', handler, { once: true })
    window.addEventListener('keydown', handler, { once: true })
    window.addEventListener('touchstart', handler, { once: true })
    return () => {
      window.removeEventListener('click', handler)
      window.removeEventListener('keydown', handler)
      window.removeEventListener('touchstart', handler)
    }
  }, [])

  const play = useCallback(() => {
    if (playedRef.current) return
    const ctx = ctxRef.current
    if (!ctx) return
    playedRef.current = true

    // ✨ "Never Give Up" 胜利旋律
    // 三段式结构: 希望 → 坚持 → 凯旋
    const notes = [
      { f: 523.25, t: 0.0, d: 0.35 },   // C5
      { f: 587.33, t: 0.35, d: 0.25 },  // D5
      { f: 659.25, t: 0.6, d: 0.35 },   // E5
      { f: 783.99, t: 0.95, d: 0.35 },  // G5
      { f: 1046.5, t: 1.3, d: 0.5 },    // C6
      { f: 880.0, t: 1.8, d: 0.2 },     // A5
      { f: 783.99, t: 2.0, d: 0.2 },    // G5
      { f: 659.25, t: 2.2, d: 0.25 },   // E5
      { f: 783.99, t: 2.45, d: 0.55 },  // G5
      { f: 587.33, t: 3.0, d: 0.2 },    // D5
      { f: 659.25, t: 3.2, d: 0.2 },    // E5
      { f: 783.99, t: 3.4, d: 0.2 },    // G5
      { f: 880.0, t: 3.6, d: 0.2 },     // A5
      { f: 1046.5, t: 3.8, d: 1.2 },    // C6 - 胜利长音
    ]

    const now = ctx.currentTime
    notes.forEach(({ f, t, d }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(f, now + t)
      gain.gain.setValueAtTime(0, now + t)
      gain.gain.linearRampToValueAtTime(0.18, now + t + 0.05)
      gain.gain.setValueAtTime(0.15, now + t + d - 0.12)
      gain.gain.linearRampToValueAtTime(0, now + t + d)
      // 微颤音
      const vib = ctx.createOscillator()
      vib.frequency.value = 5
      const vg = ctx.createGain()
      vg.gain.value = 2
      vib.connect(vg)
      vg.connect(osc.frequency)
      vib.start(now + t)
      vib.stop(now + t + d)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + t)
      osc.stop(now + t + d)
    })

    // 背景和弦
    const padNotes = [261.63, 329.63, 392.0, 523.25]
    padNotes.forEach(f => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      gain.gain.setValueAtTime(0.04, now + 0.1)
      gain.gain.setValueAtTime(0.04, now + 3.8)
      gain.gain.linearRampToValueAtTime(0, now + 5.0)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now + 0.1)
      osc.stop(now + 5.0)
    })
  }, [])

  return { play, canPlay, played: playedRef }
}

export default function Challenges() {
  const [platform, setPlatform] = useState('all')
  const { play, canPlay, played } = useVictoryJingle()

  // 用户首次交互时自动播放
  useEffect(() => {
    if (canPlay && !played.current) {
      const t = setTimeout(() => play(), 600)
      return () => clearTimeout(t)
    }
  }, [canPlay, play, played])
    ? allChallenges
    : allChallenges.filter(c => c.platform === platform)
  
  const grouped = challenges.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = []
    acc[c.category].push(c)
    return acc
  }, {})
  
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-cyber-purple/70 text-sm font-mono tracking-widest">
            ▶ CHALLENGE_LIST
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 anime-title text-gradient">
            题目列表
          </h1>
          <p className="text-cyber-grid mt-4 font-mono">
            共 <span className="text-cyber-cyan">{challenges.length}</span> 题 | 
            已解 <span className="text-cyber-cyan">{challenges.filter(c => c.solved).length}</span> 题 |
            总分 <span className="text-cyber-cyan">{challenges.reduce((sum, c) => sum + c.points, 0)}</span> pts
          </p>
        </motion.div>

        {/* Platform Filter */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <Filter className="w-4 h-4 text-cyber-grid" />
          {Object.entries(platformNames).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setPlatform(key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-mono transition-all ${
                platform === key
                  ? `bg-cyber-${val.color}/20 text-cyber-${val.color} border border-cyber-${val.color}/50`
                  : 'text-cyber-grid/60 hover:text-cyber-grid border border-transparent'
              }`}
            >
              {val.name}
            </button>
          ))}
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
              <div className={`w-8 h-8 rounded-lg bg-cyber-${categoryNames[cat].color}/20 flex items-center justify-center`}>
                <Flag className={`w-4 h-4 text-cyber-${categoryNames[cat].color}`} />
              </div>
              <h2 className="text-2xl font-bold text-cyber-cyan anime-title">
                {categoryNames[cat].name}
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
                      className="cyber-card p-4 flex items-center justify-between group cursor-pointer"
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
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-cyber-cyan group-hover:text-white transition-colors">
                              {challenge.name}
                            </span>
                            {challenge.firstBlood && (
                              <span className="px-2 py-0.5 text-xs bg-cyber-pink/20 text-cyber-pink rounded font-mono animate-pulse">
                                一血
                              </span>
                            )}
                            <span className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${
                              challenge.platform === 'ctfshow'
                                ? 'bg-blue-900/40 text-blue-400'
                                : 'bg-purple-900/40 text-purple-400'
                            }`}>
                              {challenge.platform === 'ctfshow' ? 'CTFShow' : 'QC'}
                            </span>
                          </div>
                          <span className="text-xs text-cyber-grid font-mono">
                            ID: {challenge.id}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <span className="text-sm text-cyber-grid">
                          {challenge.method}
                        </span>
                        <span className="text-lg font-bold text-cyber-cyan">
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
          className="cyber-card p-8 mt-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-cyber-cyan" />
            <span className="text-cyber-purple/70 text-sm font-mono">▶ SUMMARY</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-gradient">
                {challenges.filter(c => c.firstBlood).length > 0
                  ? Math.round(challenges.filter(c => c.firstBlood).length / challenges.length * 100)
                  : 0}%
              </div>
              <div className="text-xs text-cyber-grid">一血率</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">{challenges.filter(c => c.solved).length}</div>
              <div className="text-xs text-cyber-grid">已解题数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">{new Set(challenges.map(c => c.category)).size}</div>
              <div className="text-xs text-cyber-grid">分类数量</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">{challenges.filter(c => !c.solved).length}</div>
              <div className="text-xs text-cyber-grid">未解题数</div>
            </div>
          </div>
        </motion.div>

        {/* 🎵 Victory Jingle Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => play()}
            disabled={played.current}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg
              ${canPlay && !played.current
                ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple animate-pulse cursor-pointer'
                : played.current
                  ? 'bg-cyber-grid/30 cursor-default'
                  : 'bg-cyber-grid/20 border border-cyber-grid/30 cursor-pointer'
              }
              transition-all duration-300`}
            title={played.current ? '已播放 ✓' : canPlay ? '播放胜利旋律!' : '点击页面以激活音乐'}
          >
            <Volume2 className={`w-6 h-6 ${played.current ? 'text-cyber-grid' : 'text-white'}`} />
          </motion.button>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono whitespace-nowrap
            ${canPlay && !played.current ? 'text-cyber-cyan' : 'text-cyber-grid'}">
            {played.current ? '♪ DONE' : canPlay ? '♪ NEVER GIVE UP' : '点击激活'}
          </span>
        </motion.div>
      </div>
    </div>
  )
}
