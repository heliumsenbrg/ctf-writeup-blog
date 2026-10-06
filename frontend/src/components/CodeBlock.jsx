import { useCallback, useState } from 'react'
import { Check, Copy } from 'lucide-react'

/**
 * 代码块 / 行内代码 —— Article 与 KbNote 共用一份（原先两边各写一份副本，
 * 且副本里的样式已经漂移：Article 用的 .code-block 类在 CSS 里根本没定义）。
 *
 * ⚠️ react-markdown v9+ 移除了 `code` 组件的 `inline` 参数，
 *    所以判定"块级/行内"必须自己来 —— 见 isBlockCode()。
 */

/** 是否块级代码：带 language- 类，或内容含换行（围栏代码块的 children 一定以 \n 结尾） */
export function isBlockCode({ className, children } = {}) {
  if (/language-/.test(className || '')) return true
  return String(children ?? '').includes('\n')
}

/** flag{...} 打码：正文里的 flag 默认糊住，鼠标悬停/点击才显形（样式见 .spoiler-flag） */
function SpoilerText({ text }) {
  return String(text)
    .split(/(flag\{[^}]+\})/g)
    .map((part, i) =>
      /^flag\{[^}]+\}$/.test(part) ? (
        <span key={i} className="spoiler-flag">{part}</span>
      ) : (
        part
      )
    )
}

export function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false)
  const code = String(children).replace(/\n$/, '')
  const lang = className?.replace('language-', '') || ''

  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(code) } catch { /* 忽略剪贴板权限错误 */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="relative my-4">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        {lang && <span className="text-xs text-cyber-grid font-mono">{lang}</span>}
        <button
          onClick={handleCopy}
          aria-label={copied ? '已复制' : '复制代码'}
          title={copied ? '已复制' : '复制代码'}
          className="p-1 rounded transition-colors hover:bg-cyber-cyan/10"
        >
          {copied ? (
            <Check className="w-4 h-4 text-cyber-cyan" />
          ) : (
            <Copy className="w-4 h-4 text-cyber-grid" />
          )}
        </button>
      </div>
      <pre className="my-4 p-4 pr-16 rounded-lg bg-black/60 border border-cyber-grid/20 overflow-x-auto text-sm leading-relaxed">
        <code className="text-cyber-cyan/90 font-mono">
          {code.split('\n').map((line, i) => (
            <div key={i}>
              <SpoilerText text={line || ' '} />
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}

export function InlineCode({ children }) {
  const text = String(children)
  if (/^flag\{[^}]+\}$/.test(text)) return <span className="spoiler-flag">{text}</span>
  return (
    <code className="px-1 py-0.5 bg-cyber-darker rounded text-cyber-pink font-mono text-sm">
      {children}
    </code>
  )
}

/** 直接交给 ReactMarkdown 的 components.code —— 内部用 isBlockCode 分派 */
export function MarkdownCode({ className, children }) {
  return isBlockCode({ className, children }) ? (
    <CodeBlock className={className}>{children}</CodeBlock>
  ) : (
    <InlineCode>{children}</InlineCode>
  )
}
