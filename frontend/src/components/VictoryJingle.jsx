import { motion } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Volume2 } from 'lucide-react'

// ===== Victory Jingle =====
// Web Audio API 合成旋律，无需外部音频文件。
// 三段式结构：希望 → 坚持 → 凯旋。
// 挑战页（/challenges）与隐藏任务页（/secret-quest）共用这一份。

export function useVictoryJingle({ replayable = false } = {}) {
  const ctxRef = useRef(null)
  const playedRef = useRef(false)
  const [canPlay, setCanPlay] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)

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
    if (playedRef.current && !replayable) return
    const ctx = ctxRef.current
    if (!ctx) return
    playedRef.current = true
    setHasPlayed(true)

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
  }, [replayable])

  return { play, canPlay, hasPlayed }
}

/**
 * 右下角悬浮的「♪ NEVER GIVE UP」按钮
 * @param autoPlay  首次交互后自动播放（挑战页用）
 * @param replayable 允许反复播放（隐藏任务页用来给自己打气）
 */
export default function VictoryJingle({ autoPlay = false, replayable = false, autoPlayDelay = 600 }) {
  const { play, canPlay, hasPlayed } = useVictoryJingle({ replayable })

  useEffect(() => {
    if (autoPlay && canPlay && !hasPlayed) {
      const t = setTimeout(() => play(), autoPlayDelay)
      return () => clearTimeout(t)
    }
  }, [autoPlay, canPlay, hasPlayed, play, autoPlayDelay])

  const locked = hasPlayed && !replayable
  const armed = canPlay && !locked

  const label = !canPlay ? '点击激活' : locked ? '♪ DONE' : '♪ NEVER GIVE UP'
  const title = locked ? '已播放 ✓' : canPlay ? '播放「永不放弃」旋律!' : '点击页面以激活音乐'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5 }}
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => play()}
        disabled={locked}
        title={title}
        aria-label="Never Give Up"
        className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg
          ${armed
            ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple animate-pulse cursor-pointer'
            : locked
              ? 'bg-cyber-grid/30 cursor-default'
              : 'bg-cyber-grid/20 border border-cyber-grid/30 cursor-pointer'
          }
          transition-all duration-300`}
      >
        <Volume2 className={`w-6 h-6 ${locked ? 'text-cyber-grid' : 'text-white'}`} />
      </motion.button>
      {/* 右对齐而非居中：标签贴右侧边缘时不会被视口裁掉 */}
      <span className={`absolute -top-8 right-0 text-right text-xs font-mono whitespace-nowrap ${armed ? 'text-cyber-cyan' : 'text-cyber-grid'}`}>
        {label}
      </span>
    </motion.div>
  )
}
