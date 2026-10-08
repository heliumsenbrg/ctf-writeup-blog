import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react'
import Layout from './components/Layout'
import Home from './components/Home'

// 知识库页面路由级懒加载：不进主包，只在访问 /kb 时下载
const KbLazy = lazy(() => import('./components/Kb'))
// 以下页面原先都是静态导入 —— 导致云服务 SDK / markdown / KaTeX 等大依赖全被打进
// 入口包（实测 853KB → gzip 263KB），首屏在慢网上要等很久。改成懒加载后
// 只有真正进入该页才下载，落地页 Home 仍保持即时加载。
const ArticleLazy = lazy(() => import('./components/Article'))
const ChallengesLazy = lazy(() => import('./components/Challenges'))
const HiddenQuestLazy = lazy(() => import('./components/HiddenQuest'))
const NotFoundLazy = lazy(() => import('./components/NotFound'))
const AboutLazy = lazy(() => import('./components/About'))
const GuestbookLazy = lazy(() => import('./components/Guestbook'))
const StatsLazy = lazy(() => import('./components/Stats'))
const KbNoteLazy = lazy(() => import('./components/KbNote'))

// ===== Cursor Trail =====
function CursorTrail() {
  const canvasRef = useRef(null)
  const points = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    let paused = false

    const onMove = (e) => {
      points.current.push({ x: e.clientX, y: e.clientY, age: 0 })
      if (points.current.length > 40) points.current.shift()
    }
    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    const onVisibility = () => { paused = document.hidden }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)

    const draw = () => {
      if (paused) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }
      ctx.clearRect(0, 0, w, h)
      points.current.forEach((p, i) => {
        p.age++
        const alpha = Math.max(0, 1 - p.age / 35)
        const size = (1 - p.age / 35) * 6 + 1
        const colors = ['#00f5ff', '#a78bfa', '#f472b6', '#60a5fa']
        const color = colors[i % colors.length]
        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()
      })
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} id="cursor-trail-canvas" />
}

// ===== Boot Screen =====
const BOOT_LINES = [
  '> SYSTEM INITIALIZING...',
  '> Loading kernel modules.............. [OK]',
  '> Mounting cyber-grid filesystem...... [OK]',
  '> Starting neon-daemon................ [OK]',
  '> Connecting to CTF network............ [OK]',
  '> Authenticating user: guest.......... [OK]',
  '> Decrypting challenge database...... [OK]',
  '> Mounting /writeups.................. [OK]',
  '> All systems nominal.',
  '',
  '> Welcome to CTF WriteUp Blog.',
  '> Scanning vulnerabilities............',
]

// 检查是否应该显示 boot 动画
function shouldShowBoot() {
  // 如果用户偏好减少动画，跳过
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false
  }
  // 如果今天已经播放过，跳过
  const lastBoot = localStorage.getItem('ctf-blog-boot-date')
  const today = new Date().toDateString()
  if (lastBoot === today) {
    return false
  }
  return true
}

function BootScreen({ onDone }) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  // 记录播放日期
  useEffect(() => {
    localStorage.setItem('ctf-blog-boot-date', new Date().toDateString())
  }, [])

  useEffect(() => {
    if (visibleLines < BOOT_LINES.length) {
      const t = setTimeout(() => setVisibleLines(v => v + 1), 160)
      return () => clearTimeout(t)
    } else if (!done) {
      setDone(true)
      setTimeout(onDone, 800)
    }
  }, [visibleLines, done, onDone])

  useEffect(() => {
    const total = BOOT_LINES.length
    const pct = Math.min(100, (visibleLines / total) * 100)
    setProgress(pct)
  }, [visibleLines])

  // 跳过按钮
  const handleSkip = useCallback(() => {
    setDone(true)
    setTimeout(onDone, 100)
  }, [onDone])

  return (
    <div className={`boot-screen ${done ? 'fade-out' : ''}`}>
      <div style={{ maxWidth: 520, width: '100%', padding: '0 1rem' }}>
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className="boot-line"
            style={{
              opacity: 1,
              animationDelay: `${i * 0.05}s`,
              color: line.includes('[OK]') ? '#00f5ff'
                : line.includes('WARNING') ? '#fbbf24'
                : line.includes('FAIL') ? '#f87171'
                : '#e0e8f0',
              fontSize: '12px',
              lineHeight: '1.7',
            }}
          >
            {line || ' '}
          </div>
        ))}
        <div className="boot-progress-bar">
          <div className="boot-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <button
            onClick={handleSkip}
            style={{
              background: 'none',
              border: '1px solid #5a7090',
              color: '#5a7090',
              padding: '4px 12px',
              fontSize: '11px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.color = '#00f5ff'; e.target.style.borderColor = '#00f5ff' }}
            onMouseLeave={(e) => { e.target.style.color = '#5a7090'; e.target.style.borderColor = '#5a7090' }}
          >
            SKIP ▸
          </button>
          <span style={{ color: '#5a7090', fontSize: '12px' }}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  )
}

// ===== Glitch Text =====
function GlitchText({ text, className = '', as: Tag = 'span' }) {
  return (
    <span className="glitch-wrapper">
      <Tag className={`glitch-text ${className}`} data-text={text}>
        {text}
      </Tag>
    </span>
  )
}

// ===== Typewriter Text =====
function TypewriterText({ text, speed = 40, className = '', onDone }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
        onDone?.()
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, onDone])

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="typewriter-cursor" />}
    </span>
  )
}

// ===== useIsMobile hook =====
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches
  )
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [breakpoint])
  return isMobile
}

// ===== App =====
function AppInner() {
  const [booted, setBooted] = useState(!shouldShowBoot())
  const isMobile = useIsMobile()

  const handleBootDone = useCallback(() => {
    setBooted(true)
  }, [])

  return (
    <>
      {!isMobile && <CursorTrail />}
      {!booted && <BootScreen onDone={handleBootDone} />}
      <BrowserRouter basename="/ctf-writeup-blog">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home GlitchText={GlitchText} TypewriterText={TypewriterText} />} />
            <Route path="article/:id" element={<Suspense fallback={<div className="min-h-screen py-20 text-center text-cyber-grid font-mono text-sm">加载中…</div>}><ArticleLazy /></Suspense>} />
            <Route path="challenges" element={<Suspense fallback={<div className="min-h-screen py-20 text-center text-cyber-grid font-mono text-sm">加载中…</div>}><ChallengesLazy /></Suspense>} />
            <Route path="kb" element={<Suspense fallback={<div className="min-h-screen py-20 text-center text-cyber-grid font-mono text-sm">加载中…</div>}><KbLazy /></Suspense>} />
            <Route path="kb/:name" element={<Suspense fallback={<div className="min-h-screen py-20 text-center text-cyber-grid font-mono text-sm">加载中…</div>}><KbNoteLazy /></Suspense>} />
            <Route path="about" element={<Suspense fallback={<div className="min-h-screen py-20 text-center text-cyber-grid font-mono text-sm">加载中…</div>}><AboutLazy /></Suspense>} />
            <Route path="guestbook" element={<Suspense fallback={<div className="min-h-screen py-20 text-center text-cyber-grid font-mono text-sm">加载中…</div>}><GuestbookLazy /></Suspense>} />
            <Route path="stats" element={<Suspense fallback={<div className="min-h-screen py-20 text-center text-cyber-grid font-mono text-sm">加载中…</div>}><StatsLazy /></Suspense>} />
            <Route path="secret-quest" element={<Suspense fallback={<div className="min-h-screen py-20 text-center text-cyber-grid font-mono text-sm">加载中…</div>}><HiddenQuestLazy /></Suspense>} />
            <Route path="*" element={<Suspense fallback={<div className="min-h-screen py-20 text-center text-cyber-grid font-mono text-sm">加载中…</div>}><NotFoundLazy /></Suspense>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export { GlitchText, TypewriterText }
export default AppInner
