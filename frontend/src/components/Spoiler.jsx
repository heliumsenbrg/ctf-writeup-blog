import { useState } from 'react'

/**
 * 黑幕遮挡（萌娘百科风格）—— 从 Home.jsx 抽出来共用。
 * 默认鼠标悬停揭开并弹出「你知道的太多了」；在代码块这类紧凑场景传 tooltip={false}。
 */
export default function Spoiler({ children, className = '', tooltip = true }) {
  const [hovered, setHovered] = useState(false)
  // 点击 / Enter / 空格可以"钉住"揭示状态：只靠 hover 的话，
  // 键盘用户和触屏用户永远看不到被遮挡的 flag。
  const [revealed, setRevealed] = useState(false)
  const open = hovered || revealed

  const toggle = () => setRevealed((v) => !v)

  return (
    <span className="relative inline-block">
      <span
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggle()
          }
        }}
        className={`relative cursor-pointer select-none ${open ? 'text-yellow-400' : 'text-transparent'} ${className}`}
        style={{
          backgroundColor: open ? 'transparent' : '#000',
          borderRadius: '4px',
          padding: '2px 8px',
          minWidth: '40px',
          display: 'inline-block',
          transition: 'all 0.15s ease',
          boxShadow: open ? 'none' : 'inset 0 0 0 1px rgba(255,255,255,0.3)',
        }}
      >
        {!open && <span className="absolute inset-0 bg-[#0a0a0a]" style={{ borderRadius: '4px' }} />}
        <span className="relative z-10">{children}</span>
      </span>

      {tooltip && open && (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2">
          <span className="inline-block whitespace-nowrap rounded border border-red-500 bg-black px-3 py-1.5 text-xs font-bold text-red-500">
            你知道的太多了
          </span>
        </span>
      )}
    </span>
  )
}
