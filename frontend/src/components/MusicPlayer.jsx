import { useCallback, useEffect, useRef, useState } from 'react'
import { Music, Pause, Volume2, VolumeX } from 'lucide-react'
import { musicTracks } from '../data/music.js'

/**
 * 背景音乐播放器（全站悬浮，位于**左下角** —— 右下角是 BackToTop、右侧是文章目录）。
 *
 * 几个刻意的设计：
 *  · **不自动播放**。浏览器本来就会拦截无用户手势的自动播放；更要紧的是，
 *    访客打开博客突然有声音是很冒犯的事（办公室/深夜）。默认关闭，点了才响。
 *  · `preload="none"` —— 不点就不下载那 430 KB，首屏零代价。
 *  · 开/关与音量记在 localStorage，下次来保持；但受上面的自动播放限制，
 *    "上次开着"的访客仍需再点一下才会响（这是浏览器的规矩，不是 bug）。
 *  · 循环播放，且音轨本身做了首尾交叉淡化，听不出接缝。
 *  · 键盘可达：按钮可 Tab 聚焦、Enter/Space 触发；音量条有 aria-label。
 */

const LS_ENABLED = 'bgm:enabled'
const LS_VOLUME = 'bgm:volume'
const DEFAULT_VOLUME = 0.35

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(DEFAULT_VOLUME)
  const [open, setOpen] = useState(false)   // 是否展开音量条
  const [failed, setFailed] = useState(false)

  // 初始化：读回音量；若上次是开着的，尝试恢复播放（被浏览器拦下就静默停在暂停态）
  useEffect(() => {
    try {
      const v = Number(localStorage.getItem(LS_VOLUME))
      if (Number.isFinite(v) && v >= 0 && v <= 1) setVolume(v)
    } catch { /* 隐私模式 */ }

    const el = audioRef.current
    if (el) el.volume = volume

    let wantOn = false
    try { wantOn = localStorage.getItem(LS_ENABLED) === '1' } catch { /* 隐私模式 */ }
    if (wantOn && el) {
      el.play().then(() => setPlaying(true)).catch(() => { /* 自动播放被拦，保持暂停 */ })
    }
    // 只在挂载时跑一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
    try { localStorage.setItem(LS_VOLUME, String(volume)) } catch { /* 隐私模式 */ }
  }, [volume])

  const toggle = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    if (playing) {
      el.pause()
      setPlaying(false)
      try { localStorage.setItem(LS_ENABLED, '0') } catch { /* 隐私模式 */ }
    } else {
      // 用户手势里调用，不会被自动播放策略拦
      el.play()
        .then(() => {
          setPlaying(true)
          setFailed(false)
          try { localStorage.setItem(LS_ENABLED, '1') } catch { /* 隐私模式 */ }
        })
        .catch(() => setFailed(true))
    }
  }, [playing])

  if (!musicTracks.length) return null

  const track = musicTracks[0]

  return (
    <div className="fixed bottom-6 left-6 z-50 print:hidden">
      {/* 音频元素常驻；preload=none → 不点不下载 */}
      <audio
        ref={audioRef}
        src={track.src}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
      />

      <div
        className="flex items-center gap-2"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? '暂停背景音乐' : '播放背景音乐'}
          title={failed ? '音频加载失败' : `${playing ? '暂停' : '播放'}：${track.title}`}
          className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-cyber-cyan/50 bg-black/60 text-cyber-cyan backdrop-blur transition-colors hover:bg-cyber-cyan/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyber-cyan/70"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Music className="h-4 w-4" />}
          {/* 播放时给一圈呼吸光，提示"正在响" */}
          {playing && (
            <span className="pointer-events-none absolute h-10 w-10 animate-ping rounded-full border border-cyber-cyan/30" />
          )}
        </button>

        {/* 音量条：hover 展开，键盘聚焦时也显示（focus-within）*/}
        <div
          className={`flex items-center gap-2 rounded-full border border-cyber-grid/25 bg-black/60 px-3 py-1.5 backdrop-blur transition-all duration-200 ${
            open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          } focus-within:pointer-events-auto focus-within:opacity-100`}
        >
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
            className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-cyber-grid/30 accent-cyber-cyan"
          />
          <span className="w-8 shrink-0 text-right text-[10px] font-mono text-cyber-grid/70">
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
