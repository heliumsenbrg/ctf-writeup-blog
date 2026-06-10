import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Terminal, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { getReadingTime } from '../utils/readingTime.js'
import { articles } from '../data/articles.js'

export { getReadingTime, articles }

export default function Article() {
  const { id } = useParams()
  const article = articles[id]
  const [copiedSet, setCopiedSet] = useState(new Set())
  const readingTime = article ? getReadingTime(article.content) : 0
  
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyber-cyan mb-4">404</h1>
          <p className="text-cyber-grid">文章不存在</p>
          <Link to="/" className="text-cyber-purple hover:text-cyber-cyan mt-4 inline-block">
            返回首页
          </Link>
        </div>
      </div>
    )
  }
  
  const copyCode = async (code, blockIdx) => {
    await navigator.clipboard.writeText(code)
    setCopiedSet(prev => new Set(prev).add(blockIdx))
    setTimeout(() => setCopiedSet(prev => {
      const next = new Set(prev)
      next.delete(blockIdx)
      return next
    }), 2000)
  }
  
  // Simple markdown-like rendering
  const renderContent = (content) => {
    const lines = content.trim().split('\n')
    const elements = []
    let inCodeBlock = false
    let codeContent = []
    let codeLang = ''
    
    lines.forEach((line, i) => {
      // Code block start
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true
          codeLang = line.slice(3)
          codeContent = []
        } else {
          inCodeBlock = false
          elements.push(
            <div key={`code-${i}`} className="relative my-4">
              <div className="absolute top-2 right-2 flex items-center gap-2">
                <span className="text-xs text-cyber-grid font-mono">{codeLang}</span>
                <button
                  onClick={() => copyCode(codeContent.join('\n'), i)}
                  className="p-1 hover:bg-cyber-cyan/10 rounded transition-colors"
                >
                  {copiedSet.has(i) ? (
                    <Check className="w-4 h-4 text-cyber-cyan" />
                  ) : (
                    <Copy className="w-4 h-4 text-cyber-grid" />
                  )}
                </button>
              </div>
              <pre className="code-block">
                <code className="text-cyber-cyan/90">
                  {codeContent.map((c, j) => {
                    const parts = c.split(/(flag\{[^}]+\})/g)
                    if (parts.length === 1) {
                      return <div key={j}>{c || '\u00a0'}</div>
                    }
                    return (
                      <div key={j}>
                        {parts.map((part, k) =>
                          /^flag\{[^}]+\}$/.test(part)
                            ? <span key={k} className="spoiler-flag">{part}</span>
                            : part
                        )}
                      </div>
                    )
                  })}
                </code>
              </pre>
            </div>
          )
        }
        return
      }
      
      if (inCodeBlock) {
        codeContent.push(line)
        return
      }
      
      // Headers
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-2xl font-bold text-cyber-cyan mt-8 mb-4 anime-title">
            {line.slice(3)}
          </h2>
        )
        return
      }
      
      // Horizontal rule
      if (line === '---') {
        elements.push(
          <hr key={i} className="my-8 border-t border-cyber-grid/30" />
        )
        return
      }
      
      // Table (simple detection)
      if (line.startsWith('|')) {
        // Skip table rendering for simplicity, just show as text
        elements.push(
          <div key={i} className="text-sm text-cyber-grid font-mono pl-4 border-l-2 border-cyber-grid/30 my-1">
            {line}
          </div>
        )
        return
      }
      
      // Bold text
      let processedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-cyber-cyan font-bold">$1</strong>')
      
      // Inline code
      processedLine = processedLine.replace(/`(.+?)`/g, '<code class="px-1 py-0.5 bg-cyber-darker rounded text-cyber-pink font-mono text-sm">$1</code>')
      
      // Paragraph
      if (line.trim()) {
        // Auto-wrap flag{...} in spoiler
        const spoilerLine = processedLine.replace(/(flag\{[^}]+\})/g, '<span class="spoiler-flag">$1</span>')
        elements.push(
          <p 
            key={i} 
            className="text-cyber-grid leading-relaxed my-3"
            dangerouslySetInnerHTML={{ __html: spoilerLine }}
          />
        )
      }
    })
    
    return elements
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-20"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Back button */}
        <Link to="/">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-cyber-grid hover:text-cyber-cyan transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm">返回首页</span>
          </motion.button>
        </Link>
        
        {/* Article header */}
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-cyber-purple" />
            <span className="text-cyber-purple/70 text-sm font-mono tracking-widest">
              ▶ WRITEUP
            </span>
            <span className="text-cyber-grid/50 text-xs font-mono">•</span>
            <span className="text-cyber-grid/70 text-xs font-mono">
              {readingTime} min read
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient anime-title mb-2">
            {article.title}
          </h1>
          <p className="text-cyber-grid text-lg font-mono">{article.subtitle}</p>
        </motion.div>
        
        {/* Article content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="cyber-card p-8"
        >
          <div className="prose prose-invert max-w-none">
            {renderContent(article.content)}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
