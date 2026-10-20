import { useCallback, useEffect, useRef, useState } from 'react'
import { Music, Pause, Volume2, VolumeX } from 'lucide-react'
import { musicTracks } from '../data/music.js'

/**
 * 背景音乐播放器（全站悬浮，左下角 —— 右下是看板娘、右侧是文章目录）。
 *
 * ── 播放策略（2026-10-13 按主人要求改）────────────────────────────────────
 * 之前是"默认静音、点了才响"，主人反馈「怎么没音乐」—— 按钮太不显眼，
 * 等于没有音乐。现在改成**打开页面就会放**：
 *
 *   1) 挂载后**先直接试一次 play()** —— 老访客（浏览器已判定允许）会立刻响；
 *   2) 被浏览器拦下（新访客必然如此，无手势不许出声）→ 把播放挂到**第一次真实交互**上：
 *      点击 / 滚动 / 按键 / 触摸任选其一，一有动作就开始放。这是"自动播放"在不被
 *      浏览器封杀的前提下能做到的最接近效果；
 *   3) 一旦某个手势成功，其余监听立即全部摘掉，不会重复触发；
 *   4) **关过一次就记住**（localStorage 'bgm:enabled' = '0'）—— 之后不再自动放，
 *      尊重使用者的选择，下次来也不会被突然出声打扰。
 *
 * ── 其它 ────────────────────────────────────────────────────────────────
 * · 首次成功播放时弹一次提示气泡，告诉使用者"音乐开着了、按钮在哪、怎么关"，
 *   只弹一次（localStorage 记）。这是上一版缺的"可发现性"。
 * · `preload="none"` —— 没开始放之前不下载（每首约 0.3–3.6 MB，10 首全下会很重）。
 * · 音量与开关记 localStorage；键盘可达；多曲目自动连播（放完一首接下一首，末尾回到第一首）。
 */

const LS_ENABLED = 'bgm:enabled'   // '0' = 使用者明确关掉了；未设置/其它 = 开着
// v2：第一版这个 key 存过一批被 bug 写坏的 0（见下面读回处的注释），换个 key 让脏值失效
const LS_VOLUME = 'bgm:volume:v2'
const LS_HINT = 'bgm:hint-shown'
const DEFAULT_VOLUME = 0.35

// 能被浏览器认可为"用户手势"的事件。capture + passive：
// capture 保证比页面其它处理器更早拿到；passive 保证不阻塞页面滚动。
const GESTURES = ['pointerdown', 'mousedown', 'keydown', 'wheel', 'touchstart', 'scroll']

export default function MusicPlayer() {
  const audioRef = useRef(null)

  // 使用者是否"希望有音乐"。默认希望 —— 「自动放」是主人明确要的。
  const [wanted, setWanted] = useState(() => {
    try { return localStorage.getItem(LS_ENABLED) !== '0' } catch { return true }
  })
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(DEFAULT_VOLUME)
  const [trackIdx, setTrackIdx] = useState(0)   // 播放列表里的第几首
  const [showHint, setShowHint] = useState(false)
  const [hintDone, setHintDone] = useState(false)
  const [failed, setFailed] = useState(false)

  // 音量：读回记忆值
  // ⚠️ 必须判 `raw !== null` —— 之前直接 Number(getItem(...))，
  //    首次访问 getItem 返回 null、Number(null) === 0，于是音量被设成 0 并存回去，
  //    表现就是「按钮点了、图标也变了，但一点声都没有」（2026-10-20 实测抓到）
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_VOLUME)
      if (raw === null) return
      const v = Number(raw)
      if (Number.isFinite(v) && v >= 0 && v <= 1) setVolume(v)
    } catch { /* 隐私模式 */ }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
    try { localStorage.setItem(LS_VOLUME, String(volume)) } catch { /* 隐私模式 */ }
  }, [volume])

  // 把播放状态广播出去 —— index.html 里的看板娘监听它，放音乐时轻轻摇摆
  useEffect(() => {
    try {
      window.dispatchEvent(new CustomEvent('bgm:state', { detail: { playing } }))
    } catch { /* 老浏览器 */ }
  }, [playing])

  // ── 播放主逻辑：先直接试，被拦就等第一次交互 ──────────────────────────
  useEffect(() => {
    const el = audioRef.current
    if (!el || !wanted) return

    let cancelled = false
    let starting = false   // 一次交互还没落地时，别被下一个手势重复触发
    let armed = false

    function onGesture() { attempt() }

    const detach = () => {
      if (!armed) return
      armed = false
      for (const g of GESTURES) window.removeEventListener(g, onGesture, true)
    }

    function attempt() {
      if (cancelled || starting) return
      starting = true
      el.play()
        .then(() => {
          starting = false
          if (cancelled) return
          setPlaying(true)
          detach()          // 成功了就不再需要这些监听
        })
        .catch(() => {
          // 仍被自动播放策略拦着 —— 保持待命、等下一个手势。
          // 这里**不**置 failed：那不是错误，是浏览器的规矩。
          starting = false
        })
    }

    // ① 先直接试一次（老访客往往已被浏览器放行）
    el.play()
      .then(() => { if (!cancelled) setPlaying(true) })
      .catch(() => {
        if (cancelled) return
        // ② 被拦：等第一次真实交互
        armed = true
        for (const g of GESTURES) {
          window.addEventListener(g, onGesture, { capture: true, passive: true })
        }
      })

    return () => { cancelled = true; detach() }
  }, [wanted])

  // ── 首次真正响起来时弹一次提示（只弹一次）────────────────────────────
  useEffect(() => {
    if (!playing || hintDone) return
    let seen = ''
    try { seen = localStorage.getItem(LS_HINT) || '' } catch { /* 隐私模式 */ }
    setHintDone(true)
    if (seen) return
    setShowHint(true)
    try { localStorage.setItem(LS_HINT, '1') } catch { /* 隐私模式 */ }
    const t = setTimeout(() => setShowHint(false), 9000)
    return () => clearTimeout(t)
  }, [playing, hintDone])

  const toggle = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    setShowHint(false)
    if (playing) {
      el.pause()
      setPlaying(false)
      setWanted(false)
      try { localStorage.setItem(LS_ENABLED, '0') } catch { /* 隐私模式 */ }
    } else {
      try { localStorage.setItem(LS_ENABLED, '1') } catch { /* 隐私模式 */ }
      setWanted(true)
      // 显式点击里调用，不会被自动播放策略拦；真失败才是真出问题
      el.play().then(() => { setPlaying(true); setFailed(false) }).catch(() => setFailed(true))
    }
  }, [playing])

  if (!musicTracks.length) return null

  const track = musicTracks[trackIdx]

  // 换曲：<audio> 的 src 变了浏览器会重置播放状态，这里重新 load；
  // 原本在播就接着播，否则等用户手势（不依赖 playing，否则每次暂停/播放都会重置音轨）
  const firstTrack = useRef(true)
  useEffect(() => {
    if (firstTrack.current) { firstTrack.current = false; return }
    const el = audioRef.current
    if (!el) return
    const wasPlaying = playing
    el.load()
    if (wasPlaying) el.play().catch(() => { /* 交给下一次手势 */ })
  }, [trackIdx])

  return (
    <div className="fixed bottom-6 left-6 z-50 print:hidden">
      {/* preload=none → 没开始放之前不下载 */}
      <audio
        ref={audioRef}
        src={track.src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
        // 一首放完 → 下一首，放完最后一首回到第一首（替代原来的单曲 loop）
        onEnded={() => setTrackIdx((i) => (i + 1) % musicTracks.length)}
      />

      {/* 一次性提示气泡：首次响起来时出现，告诉使用者这是什么、怎么关 */}
      {showHint && (
        <div
          role="status"
          className="absolute bottom-12 left-0 whitespace-nowrap rounded-lg border border-cyber-cyan/40 bg-black/80 px-3 py-1.5 text-[11px] font-mono text-cyber-cyan backdrop-blur"
        >
          ♪ 背景音乐已开启 · 点左边按钮可关闭
        </div>
      )}

      <div className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? '暂停背景音乐' : '播放背景音乐'}
          title={failed ? '音频加载失败' : `${playing ? '暂停' : '播放'}：${track.title}`}
          className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-cyber-cyan/50 bg-black/60 text-cyber-cyan backdrop-blur transition-colors hover:bg-cyber-cyan/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyber-cyan/70"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Music className="h-4 w-4" />}
          {/* 播放时一圈呼吸光，提示"正在响" */}
          {playing && (
            <span className="pointer-events-none absolute h-10 w-10 animate-ping rounded-full border border-cyber-cyan/30" />
          )}
        </button>

        {/* 音量条：常驻显示（原来是 hover 才展开 —— 触屏上根本调不出来，
            而且窄到 80px 不好拖。样式见 index.css 的 .vol-range）*/}
        <div className="flex items-center gap-2 rounded-full border border-cyber-grid/25 bg-black/60 px-3 py-1.5 backdrop-blur">
          <button
            type="button"
            onClick={() => setVolume((v) => (v > 0 ? 0 : DEFAULT_VOLUME))}
            aria-label={volume > 0 ? '静音' : '取消静音'}
            className="text-cyber-grid transition-colors hover:text-cyber-cyan"
          >
            {volume > 0 ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="音量"
            title={`拖动调节音量：${Math.round(volume * 100)}%`}
            className="vol-range w-24 cursor-pointer sm:w-28"
          />
          <span className="w-8 shrink-0 text-right text-[10px] font-mono tabular-nums text-cyber-grid/70">
            {Math.round(volume * 100)}
          </span>
        </div>
      </div>

      {failed && (
        <p className="mt-2 max-w-[12rem] text-[10px] font-mono leading-snug text-cyber-pink/70">
          音频加载失败（可能被网络拦截）
        </p>
      )}
    </div>
  )
}
