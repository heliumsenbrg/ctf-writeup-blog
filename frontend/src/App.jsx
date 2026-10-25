import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { MotionConfig, useReducedMotion } from 'framer-motion'
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

let routeMetadataRequest

function setMeta(attribute, name, value) {
  const selector = `meta[${attribute}="${name}"]`
  let element = document.head.querySelector(selector)
  if (!value) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', value)
}

function setCanonical(value) {
  let element = document.head.querySelector('link[rel="canonical"]')
  if (!value) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', value)
}

function decodeHtml(value) {
  const textArea = document.createElement('textarea')
  textArea.innerHTML = value || ''
  return textArea.value
}

function RouteMetadata() {
  const { pathname } = useLocation()

  useEffect(() => {
    let active = true
    if (!routeMetadataRequest) {
      routeMetadataRequest = fetch(`${import.meta.env.BASE_URL}route-meta.json`)
        .then((response) => (response.ok ? response.json() : null))
        .catch(() => null)
    }

    let route = pathname.replace(/\/+$/, '') || '/'
    try {
      route = decodeURIComponent(route)
    } catch {
    }

    routeMetadataRequest.then((routes) => {
      if (!active) return
      const meta = routes?.[route]
      if (!meta) {
        document.title = '页面未找到 | heliumsenbrg 的 CTF Writeups'
        setMeta('name', 'description', '请求的页面不存在。')
        setMeta('name', 'robots', 'noindex, follow')
        setMeta('property', 'og:type', 'website')
        setMeta('property', 'og:title', document.title)
        setMeta('property', 'og:description', '请求的页面不存在。')
        setMeta('property', 'og:url', window.location.href.split(/[?#]/, 1)[0])
        setMeta('name', 'twitter:title', document.title)
        setMeta('name', 'twitter:description', '请求的页面不存在。')
        setMeta('name', 'twitter:url', window.location.href.split(/[?#]/, 1)[0])
        setCanonical(null)
        setMeta('property', 'article:published_time', null)
        return
      }

      document.title = decodeHtml(meta.title)
      setMeta('name', 'description', decodeHtml(meta.description))
      setCanonical(meta.canonical)
      setMeta('property', 'og:type', decodeHtml(meta.ogType))
      setMeta('property', 'og:title', decodeHtml(meta.ogTitle))
      setMeta('property', 'og:description', decodeHtml(meta.ogDescription))
      setMeta('property', 'og:url', meta.ogUrl)
      setMeta('name', 'twitter:title', decodeHtml(meta.twitterTitle))
      setMeta('name', 'twitter:description', decodeHtml(meta.twitterDescription))
      setMeta('name', 'twitter:url', meta.twitterUrl)
      setMeta('name', 'robots', decodeHtml(meta.robots))
      setMeta('property', 'article:published_time', meta.publishedTime)
    })

    return () => { active = false }
  }, [pathname])

  return null
}

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
  // ① 强制播放口子：`?boot=1`（或 #boot）。给"系统开了减少动态效果、但仍想看一眼"的情况用。
  try {
    if (new URLSearchParams(window.location.search).get('boot') === '1' || window.location.hash === '#boot') {
      return true
    }
  } catch {
    // URL 解析失败就按默认逻辑走
  }

  // ② 无障碍：系统开了「减少动态效果」就跳过。
  //    这条**不能被站点偏好覆盖** —— 那是使用者的明确诉求（可能出于晕动症等原因），
  //    不属于"每次打开都播"能决定的范围。想看就用上面的 ?boot=1。
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false
  }

  // ③ 2026-10-09 按主人要求：**每次打开都播**。
  //    原来是"每天只播一次"（读 localStorage['ctf-blog-boot-date'] 比对日期），已移除 ——
  //    想改回每天一次，在这里加回那段日期比对即可。
  return true
}

/**
 * 「页面真的可以看了」的信号。
 *
 * 之前开场只按行数计时（12 行 × 160ms ≈ 2.7s），跟资源到没到无关 —— 网慢的时候
 * 它淡出了，页面还是半残（字体没到、首屏资源还在路上），用户看到的就是
 * "这个没有、那个卡"（2026-10-21 主人反馈）。现在等三件事：
 *   ① window.load          首屏的样式/图片都到齐
 *   ② document.fonts.ready  字体（字体换掉会引起整页重排，最像"卡一下"）
 *   ③ 两次 rAF              首帧真的画完了
 * 但**必须有下限和上限**：下限 1.2s（开场别一闪而过），上限 12s。
 * 上限原来是 4.5s —— 2026-10-25 实测打脸：本机主包 3.5s、字体首次要 5s 才到，
 * 4.5s 的上限正好在字体到位前退场，看起来就是「没加载完就进来了」。
 * 12s 只在慢机器上生效（快的照样 1.2s 就走），真正的目的就是等字体。
 */
function useReadySignal(minMs = 1200, maxMs = 12000) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    const start = performance.now()

    const waitLoad = new Promise((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', () => resolve(), { once: true })
    })
    const waitFonts =
      document.fonts && document.fonts.ready ? document.fonts.ready.catch(() => {}) : Promise.resolve()
    const waitPaint = new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

    const trulyReady = Promise.all([waitLoad, waitFonts, waitPaint]).then(() => {
      const left = Math.max(0, minMs - (performance.now() - start))
      return new Promise((resolve) => setTimeout(resolve, left))
    })
    const cap = new Promise((resolve) => setTimeout(resolve, maxMs))

    Promise.race([trulyReady, cap]).then(() => {
      if (alive) setReady(true)
    })
    return () => {
      alive = false
    }
  }, [minMs, maxMs])

  return ready
}

function BootScreen({ onDone, ready }) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  // 注：原来这里会往 localStorage 写「今天已播过」的日期，用于"每天只播一次"。
  // 改成每次都播之后这个记录已无用处，故移除（想恢复每天一次时再加回来）。

  useEffect(() => {
    if (visibleLines < BOOT_LINES.length) {
      const t = setTimeout(() => setVisibleLines(v => v + 1), 160)
      return () => clearTimeout(t)
    }
  }, [visibleLines])

  // 退场条件：日志打完 **且** 页面真的就绪（不再只是"打完就走"）
  const linesDone = visibleLines >= BOOT_LINES.length

  // 等待期间给个秒数，避免「一直卡在同一行」的错觉
  const [waited, setWaited] = useState(0)
  useEffect(() => {
    if (!linesDone || ready) return undefined
    const t = setInterval(() => setWaited((v) => v + 1), 1000)
    return () => clearInterval(t)
  }, [linesDone, ready])
  useEffect(() => {
    if (!linesDone || !ready || done) return
    const t = setTimeout(() => {
      setDone(true)
      setTimeout(onDone, 400)
    }, 220)
    return () => clearTimeout(t)
  }, [linesDone, ready, done, onDone])

  useEffect(() => {
    const total = BOOT_LINES.length
    const base = Math.min(100, (visibleLines / total) * 100)
    // 日志打完后如果还在等资源，停在 96% 抖动一下，别假装 100%
    setProgress(visibleLines >= total ? (ready ? 100 : 96) : base)
  }, [visibleLines, ready])

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
        {/* 日志打完了但资源还没齐 —— 明确告诉用户在等什么，别让人以为卡死 */}
        {linesDone && !ready && (
          <div
            className="boot-line"
            style={{ color: '#fbbf24', fontSize: '12px', lineHeight: '1.7' }}
          >
            &gt; 等待字体与首屏资源… {waited}s
          </div>
        )}
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
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    // 系统开启「减少动态效果」时直接显示全文，不逐字动画
    if (reduceMotion) {
      setDisplayed(text)
      setDone(true)
      onDone?.()
      return
    }
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
  }, [text, speed, onDone, reduceMotion])

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
  // 只有要放开场时才需要等资源信号（省掉无谓的监听）
  const ready = useReadySignal()
  const reduceMotion = useReducedMotion()

  const handleBootDone = useCallback(() => {
    setBooted(true)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      {!isMobile && !reduceMotion && <CursorTrail />}
      {!booted && <BootScreen onDone={handleBootDone} ready={ready} />}
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
        <RouteMetadata />
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
    </MotionConfig>
  )
}

export { GlitchText, TypewriterText, shouldShowBoot }
export default AppInner
