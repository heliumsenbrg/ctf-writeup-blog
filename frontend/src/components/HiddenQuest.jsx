import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Lock, KeyRound, ScanEye, ChevronDown, Sparkles, ExternalLink, X } from 'lucide-react'
import FLAGS, { getFlagConfig, computeCipherHex } from '../config/flags'

/* ---------- Particle / Confetti Engine ---------- */
const COLORS = ['#00f5ff', '#a78bfa', '#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#00ff41']

function createParticles(count, baseColor) {
  const p = []
  for (let i = 0; i < count; i++) {
    p.push({
      x: 50, y: 100,
      vx: (Math.random() - 0.5) * 16,
      vy: -(Math.random() * 16 + 4),
      r: Math.random() * 5 + 2,
      color: Math.random() > 0.5 ? baseColor : COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 0,
      maxLife: 60 + Math.random() * 40,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 10,
    })
  }
  return p
}

function ConfettiCanvas({ color, count = 80 }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef(null)

  useEffect(() => {
    if (!particlesRef.current) {
      particlesRef.current = createParticles(count, color)
    }
    const particles = particlesRef.current
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    function anim() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      for (const p of particles) {
        p.life++
        if (p.life >= p.maxLife) continue
        alive = true
        p.x += p.vx * 0.6
        p.vy += 0.25
        p.y += p.vy * 0.6
        p.rot += p.rotV
        const alpha = Math.max(0, 1 - p.life / p.maxLife)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rot * Math.PI) / 180)
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 2)
        ctx.restore()
      }
      if (alive) animId = requestAnimationFrame(anim)
    }
    anim()
    return () => cancelAnimationFrame(animId)
  }, [color, count])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
    />
  )
}

/* ---------- Victory Modal ---------- */
function VictoryModal({ config, onClose }) {
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (countdown <= 0) {
      if (config.reward) window.location.href = config.reward
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, config.reward])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        className={`relative mx-4 max-w-md w-full rounded-2xl border border-white/10 bg-gradient-to-br ${config.victory.bgColor} p-8 text-center overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-white/5 blur-3xl" />

        {/* Emoji */}
        <div className="text-5xl mb-4 animate-bounce">
          {config.victory.emoji.split('').map((e, i) => (
            <span key={i} className="inline-block" style={{ animationDelay: `${i * 0.15}s` }}>
              {e}
            </span>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 anime-title">
          {config.victory.title}
        </h2>

        <p className="text-cyber-grid font-mono text-sm mb-6">
          {config.victory.message}
        </p>

        {/* 倒计时自动跳转 */}
        <div className="mb-4">
          <div className="flex justify-center gap-2 mb-2">
            {[3,2,1].map(n => (
              <span key={n} className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm transition-all ${
                countdown >= n
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40'
                  : 'bg-white/5 text-cyber-grid/30 border border-white/5'
              }`}>
                {n}
              </span>
            ))}
          </div>
          <p className="text-xs text-cyber-grid/60 font-mono">
            正在跳转下载页...
          </p>
        </div>

        {/* 立即跳转按钮 */}
        {config.reward && (
          <a
            href={config.reward}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 border border-cyber-cyan/40 text-cyber-cyan text-sm font-mono hover:bg-cyber-cyan/20 transition-all mb-3"
          >
            <ExternalLink className="w-4 h-4" />
            立即下载
          </a>
        )}

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-white/5 text-cyber-grid text-xs font-mono hover:bg-white/10 transition-all"
          >
            <X className="w-3 h-3" />
            取消（留在本页）
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Main Component ---------- */
export default function HiddenQuest() {
  const [activeId, setActiveId] = useState(FLAGS[0].id)
  const [input, setInput] = useState('')
  const [status, setStatus] = useState(null) // null | 'wrong'
  const [clueLevel, setClueLevel] = useState(0)
  const [showVictory, setShowVictory] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [particleKey, setParticleKey] = useState(0)
  const timersRef = useRef([])
  const pickerRef = useRef(null)

  const config = getFlagConfig(activeId)
  const cipherHex = computeCipherHex(config.flag, config.key)

  // Reset state when switching flag
  useEffect(() => {
    setInput('')
    setStatus(null)
    setClueLevel(0)
    setShowVictory(false)
    setShowPicker(false)
  }, [activeId])

  // Console & clue timers
  useEffect(() => {
    timersRef.current.forEach(t => clearTimeout(t))
    timersRef.current = []

    console.log(
      '%c' + config.consoleMsg[0],
      'color: #f59e0b; font-size: 16px; font-weight: bold'
    )
    config.consoleMsg.slice(1).forEach(msg => {
      console.log('%c' + msg, 'color: #8b5cf6')
    })

    timersRef.current.push(setTimeout(() => setClueLevel(1), 8000))
    timersRef.current.push(setTimeout(() => setClueLevel(2), 16000))
    timersRef.current.push(setTimeout(() => setClueLevel(3), 24000))

    return () => timersRef.current.forEach(t => clearTimeout(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (input.trim() === config.flag) {
      setStatus(null)
      setShowVictory(true)
      setParticleKey((k) => k + 1)
    } else {
      setStatus('wrong')
      setTimeout(() => setStatus(null), 2000)
    }
  }, [input, config])

  // Close picker on outside click
  useEffect(() => {
    function handleClick(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <span className="text-amber-400/70 text-sm font-mono tracking-widest">
            ▸ HIDDEN_QUEST
          </span>
          <h1 className="text-4xl font-bold mt-2 anime-title text-gradient">
            秘密任务
          </h1>
        </motion.div>

        {/* Challenge Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="cyber-card p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-cyber-grid font-mono">ACTIVE CHALLENGE</span>
            <div className="relative" ref={pickerRef}>
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="flex items-center gap-2 px-4 py-2 bg-cyber-darker border border-cyber-grid/30 rounded-lg text-cyber-cyan font-mono text-sm hover:border-cyber-cyan/50 transition-all"
              >
                <span className={`w-2 h-2 rounded-full ${
                  activeId === 'genshin' ? 'bg-amber-400' :
                  activeId === 'starrail' ? 'bg-blue-400' :
                  activeId === 'zelda' ? 'bg-green-400' :
                  activeId === 'hacker' ? 'bg-emerald-400' :
                  activeId === 'moon' ? 'bg-purple-400' :
                  'bg-rose-400'
                }`} />
                {config.name}
                <ChevronDown className={`w-3 h-3 transition-transform ${showPicker ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-cyber-darker border border-cyber-grid/30 rounded-lg overflow-hidden shadow-xl z-50"
                  >
                    {FLAGS.map(f => (
                      <button
                        key={f.id}
                        onClick={() => { setActiveId(f.id); setShowPicker(false) }}
                        className={`w-full text-left px-4 py-3 font-mono text-sm transition-colors flex items-center gap-3 ${
                          f.id === activeId
                            ? 'bg-cyber-cyan/10 text-cyber-cyan border-l-2 border-cyber-cyan'
                            : 'text-cyber-grid hover:bg-cyber-grid/10 hover:text-cyber-cyan'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${
                          f.id === 'genshin' ? 'bg-amber-400' :
                          f.id === 'starrail' ? 'bg-blue-400' :
                          f.id === 'zelda' ? 'bg-green-400' :
                          f.id === 'hacker' ? 'bg-emerald-400' :
                          f.id === 'moon' ? 'bg-purple-400' :
                          'bg-rose-400'
                        }`} />
                        {f.name}
                        {f.id === activeId && (
                          <span className="ml-auto text-xs text-cyber-cyan/50">✓</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Ciphertext card */}
        <motion.div
          key={activeId + '-cipher'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card p-6 mb-6 text-center"
        >
          <Lock className="w-6 h-6 text-amber-400 mx-auto mb-4" />
          <p className="text-xs text-cyber-grid font-mono mb-2">ENCRYPTED MESSAGE</p>
          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-amber-400/80 break-all select-all transition-all">
            {cipherHex}
          </div>
          <p className="text-xs text-cyber-grid mt-3 font-mono">
            Length: {cipherHex.length} hex chars | Cipher: XOR | Target: {config.flag.length} chars
          </p>
        </motion.div>

        {/* Clues */}
        <motion.div
          key={activeId + '-clues'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="cyber-card p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <ScanEye className="w-4 h-4 text-cyber-cyan" />
            <span className="text-cyber-cyan text-sm font-mono">CLUES</span>
          </div>
          <p className="text-cyber-grid text-sm font-mono mb-2">
            ▎{config.clues[0]}
          </p>
          {clueLevel >= 1 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-cyber-grid/80 text-sm font-mono mb-2"
            >
              ▎{config.clues[1]}
            </motion.p>
          )}
          {clueLevel >= 2 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-cyber-grid/80 text-sm font-mono mb-2"
            >
              ▎{config.clues[2]}
            </motion.p>
          )}
          {clueLevel >= 3 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-amber-400/80 text-sm font-mono mb-2"
            >
              ▎{config.clues[3]}
            </motion.p>
          )}
        </motion.div>

        {/* Submit */}
        <motion.div
          key={activeId + '-submit'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="cyber-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-4 h-4 text-cyber-purple" />
            <span className="text-cyber-purple text-sm font-mono">SUBMIT FLAG</span>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="flag{...}"
              className="flex-1 bg-black/50 border border-cyber-grid/30 rounded-lg px-4 py-3 font-mono text-sm text-cyber-cyan focus:outline-none focus:border-cyber-cyan/50 transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-3 bg-cyber-cyan/20 border border-cyber-cyan/30 rounded-lg text-cyber-cyan font-mono text-sm hover:bg-cyber-cyan/30 transition-colors"
            >
              DECODE
            </motion.button>
          </form>

          <AnimatePresence>
            {status === 'wrong' && (
              <motion.p
                key={activeId + '-wrong'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-sm font-mono mt-3"
              >
                ✗ 解密失败，再试试！
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Hidden key element */}
        <div
          data-key={config.key}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      </div>

      {/* Victory celebration */}
      <AnimatePresence>
        {showVictory && (
          <>
            <ConfettiCanvas key={'p' + particleKey + activeId} color={config.victory.particleColor} count={config.victory.particleCount} />
            <VictoryModal config={config} onClose={() => setShowVictory(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
