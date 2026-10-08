import { Fragment, createElement, isValidElement, useCallback, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import Spoiler from './Spoiler'

/**
 * 代码块 / 行内代码 —— Article 与 KbNote 共用一份。
 *
 * ⚠️ 两个必须自己处理的点：
 *  1. react-markdown v9+ 移除了 `code` 组件的 `inline` 参数 → 见 isBlockCode()
 *  2. 接上 rehype-highlight 之后，块级代码的 children 会从「字符串」变成「元素树」
 *     → 复制按钮要递归取文本（extractText），flag 打码也要递归处理文本节点（spoilerize）
 */

/** 递归取出纯文本（高亮后 children 是元素树） */
export function extractText(node) {
  if (node == null || node === false || node === true) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (isValidElement(node)) return extractText(node.props?.children)
  return ''
}

/** 是否块级代码：带 language- 类，或内容含换行（围栏代码块的 children 一定以 \n 结尾） */
export function isBlockCode({ className, children } = {}) {
  if (/language-/.test(className || '')) return true
  return extractText(children).includes('\n')
}

/** flag{...} 打码：用首页同款黑幕遮挡（见 components/Spoiler.jsx） */
function SpoilerText({ text }) {
  const parts = String(text).split(/(flag\{[^}]+\})/g)
  if (parts.length === 1) return String(text)
  return parts.map((part, i) =>
    /^flag\{[^}]+\}$/.test(part) ? (
      <Spoiler key={i} tooltip={false}>{part}</Spoiler>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )
}

/** 递归给元素树里的文本节点套上 flag 打码（高亮后的 <span class="hljs-*"> 也能处理） */
function spoilerize(node, prefix = 'k') {
  if (typeof node === 'string') return <SpoilerText key={prefix} text={node} />
  if (Array.isArray(node)) return node.map((n, i) => spoilerize(n, prefix + i))
  if (isValidElement(node)) {
    if (node.props?.children == null) return node
    return createElement(
      node.type,
      { ...node.props, key: node.key ?? prefix },
      spoilerize(node.props.children, prefix + 'c')
    )
  }
  return node
}

export function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false)
  const code = extractText(children).replace(/\n$/, '')
  const lang = (className?.match(/language-([\w+#.-]+)/) || [])[1] || ''

  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(code) } catch { /* 忽略剪贴板权限错误 */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  // 未接高亮时 children 是纯字符串 → 逐行渲染（便于打码与行距）；
  // 接了高亮后 children 是元素树 → 直接递归打码渲染（换行由 <pre> 保留）
  const isPlain = typeof children === 'string' || (Array.isArray(children) && children.every((c) => typeof c === 'string'))

  return (
    <div className="group/code relative my-4">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2 opacity-60 transition-opacity group-hover/code:opacity-100">
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
          {isPlain
            ? code.split('\n').map((line, i) => (
                <div key={i}>
                  <SpoilerText text={line || ' '} />
                </div>
              ))
            : spoilerize(children)}
        </code>
      </pre>
    </div>
  )
}

export function InlineCode({ children }) {
  const text = extractText(children)
  if (/^flag\{[^}]+\}$/.test(text)) return <Spoiler>{text}</Spoiler>
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
