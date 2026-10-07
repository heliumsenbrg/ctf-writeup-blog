import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

/**
 * 分享按钮 —— 题解页与知识库笔记页共用。
 * 支持 Web Share API 就调系统分享（移动端体验好），否则退回"复制链接"。
 */
export default function ShareButton({ title = document.title, className = '' }) {
  const [done, setDone] = useState(false)

  const onShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setDone(true)
      setTimeout(() => setDone(false), 1800)
    } catch {
      /* 用户取消分享 / 无剪贴板权限 —— 静默即可 */
    }
  }

  return (
    <button
      onClick={onShare}
      title={done ? '链接已复制' : '分享这一页'}
      aria-label={done ? '链接已复制' : '分享这一页'}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-cyber-grid/25 px-2.5 py-1 text-xs font-mono text-cyber-grid transition-colors hover:border-cyber-cyan/50 hover:text-cyber-cyan ${className}`}
    >
      {done ? <Check className="h-3.5 w-3.5 text-cyber-cyan" /> : <Share2 className="h-3.5 w-3.5" />}
      {done ? '已复制' : '分享'}
    </button>
  )
}
