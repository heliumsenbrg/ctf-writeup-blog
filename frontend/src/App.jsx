import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Layout from './components/Layout'
import Home from './components/Home'
import Article from './components/Article'
import Challenges from './components/Challenges'
import HiddenQuest from './components/HiddenQuest'

// ===== Cursor Trail =====
function CursorTrail() {
  const canvasRef = useRef(null)
  const points = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const onMove = (e) => {
      points.current.push({ x: e.clientX, y: e.clientY, age: 0 })
      if (points.current.length > 40) points.current.shift()
    }
    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', onResize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
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

function BootScreen({ onDone }) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

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

  return (
    <div className={`boot-screen ${done ? 'fade-out' : ''}`}>
      <div style={{ maxWidth: 520, width: '100%' }}>
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
              fontSize: '13px',
              lineHeight: '1.7',
            }}
          >
            {line || '\u00a0'}
          </div>
        ))}
        <div className="boot-progress-bar">
          <div className="boot-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ color: '#5a7090', fontSize: '12px', marginTop: '0.5rem', textAlign: 'right' }}>
          {Math.round(progress)}%
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

// ===== App =====
function AppInner() {
  const [booted, setBooted] = useState(false)

  const handleBootDone = () => {
    setBooted(true)
  }

  return (
    <>
      <CursorTrail />
      {!booted && <BootScreen onDone={handleBootDone} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home GlitchText={GlitchText} TypewriterText={TypewriterText} />} />
            <Route path="article/:id" element={<Article />} />
            <Route path="challenges" element={<Challenges />} />
            <Route path="secret-quest" element={<HiddenQuest />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export { GlitchText, TypewriterText }
export default AppInner
