import { useState } from 'react'

/**
 * 黑幕遮挡（萌娘百科风格）—— 从 Home.jsx 抽出来共用。
 * 默认鼠标悬停揭开并弹出「你知道的太多了」；在代码块这类紧凑场景传 tooltip={false}。
 */
export default function Spoiler({ children, className = '', tooltip = true }) {
  const [hovered, setHovered] = useState(false)

  return (
    <span className="relative inline-block">
      <span
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative cursor-pointer select-none ${hovered ? 'text-yellow-400' : 'text-transparent'} ${className}`}
        style={{
          backgroundColor: hovered ? 'transparent' : '#000',
          borderRadius: '4px',
          padding: '2px 8px',
          minWidth: '40px',
          display: 'inline-block',
          transition: 'all 0.15s ease',
          boxShadow: hovered ? 'none' : 'inset 0 0 0 1px rgba(255,255,255,0.3)',
        }}
      >
        {!hovered && <span className="absolute inset-0 bg-[#0a0a0a]" style={{ borderRadius: '4px' }} />}
        <span className="relative z-10">{children}</span>
      </span>

      {tooltip && hovered && (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2">
          <span className="inline-block whitespace-nowrap rounded border border-red-500 bg-black px-3 py-1.5 text-xs font-bold text-red-500">
            你知道的太多了
          </span>
        </span>
      )}
    </span>
  )
}
