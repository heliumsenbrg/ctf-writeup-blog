import { useMemo, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { friendLinks } from '../data/friendLinks.js'
import { safeHref } from '../utils/safeUrl.js'

/**
 * 友链 —— 页脚与「关于」页共用一份（原先两处各写一遍 markup）。
 * 头像策略：先试对方站点的 /favicon.ico，取不到就退化成"首字渐变圆"，
 * 保证任何情况下都有视觉锚点、不会出现破图。
 */

const AVATAR_COLORS = [
  'from-cyber-cyan to-cyber-blue',
  'from-cyber-purple to-cyber-pink',
  'from-pink-400 to-rose-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-sky-400 to-indigo-500',
]

const hashOf = (s) => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997
  return h
}

export function FriendAvatar({ name = '', url = '', size = 'md' }) {
  const [broken, setBroken] = useState(false)
  const host = useMemo(() => {
    try { return new URL(url).host } catch { return '' }
  }, [url])

  const cls = size === 'sm' ? 'h-5 w-5 text-[10px]' : 'h-8 w-8 text-sm'
  const initial = (name.trim()[0] || '?').toUpperCase()
  const grad = AVATAR_COLORS[hashOf(name) % AVATAR_COLORS.length]

  // favicon 优先；失败（或没有 host）→ 首字渐变圆
  if (!broken && host) {
    return (
      <img
        src={`https://${host}/favicon.ico`}
        alt=""
        width={size === 'sm' ? 20 : 32}
        height={size === 'sm' ? 20 : 32}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className={`${cls} shrink-0 rounded-full border border-cyber-grid/25 bg-black/40 object-contain p-0.5`}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={`${cls} shrink-0 rounded-full bg-gradient-to-br ${grad} text-cyber-darker font-bold flex items-center justify-center border border-cyber-grid/25`}
    >
      {initial}
    </span>
  )
}

/** variant: 'footer' 一行 chips ｜ 'cards' 两列卡片 */
export default function FriendLinks({ variant = 'footer' }) {
  // 没有友链时整块不渲染 —— 否则会剩一个孤零零的 "FRIEND LINKS" 标题 / 空网格
  if (!friendLinks.length) return null

  if (variant === 'footer') {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
        <span className="text-cyber-grid/70 text-xs font-mono tracking-widest">FRIEND LINKS</span>
        {friendLinks.map((f) => (
          <a
            key={f.url}
            href={safeHref(f.url) || undefined}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 text-xs text-cyber-cyan transition-colors hover:text-white"
          >
            <FriendAvatar name={f.name} url={f.url} size="sm" />
            {f.name}
          </a>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {friendLinks.map((f) => {
        let host = ''
        try { host = new URL(f.url).host } catch { host = '' }
        return (
          <a
            key={f.url}
            href={safeHref(f.url) || undefined}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-lg border border-cyber-grid/20 p-3 transition-colors hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5"
          >
            <FriendAvatar name={f.name} url={f.url} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-cyber-cyan transition-colors group-hover:text-white">
                {f.name}
              </span>
              <span className="block truncate text-[10px] font-mono text-cyber-grid/55">{host}</span>
            </span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-cyber-grid/40 transition-colors group-hover:text-cyber-cyan" />
          </a>
        )
      })}
    </div>
  )
}
