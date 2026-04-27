import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Lock, KeyRound, ScanEye, Download } from 'lucide-react'

// ===== Challenge Config =====
const REAL_FLAG = 'flag{53cr3t_und3r_7h3_m00n!}'
const XOR_KEY = 'genshin'

// Pre-compute ciphertext (XOR encrypt flag with key)
const cipherHex = (function() {
  let h = ''
  for (let i = 0; i < REAL_FLAG.length; i++) {
    h += (REAL_FLAG.charCodeAt(i) ^ XOR_KEY.charCodeAt(i % XOR_KEY.length))
      .toString(16).padStart(2, '0')
  }
  return h
})()

export default function HiddenQuest() {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState(null) // null | 'wrong' | 'correct'
  const [clueLevel, setClueLevel] = useState(0)
  const [showDownload, setShowDownload] = useState(false)

  useEffect(() => {
    console.log('%c[SECRET QUEST]', 'color: #f59e0b; font-size: 16px; font-weight: bold')
    console.log('%cEncryption: XOR with hidden key', 'color: #8b5cf6')
    console.log('%cKey length: ' + XOR_KEY.length + ' characters', 'color: #8b5cf6')
    console.log('%cLook closely at the page elements...', 'color: #10b981')

    const t1 = setTimeout(() => setClueLevel(1), 8000)
    const t2 = setTimeout(() => setClueLevel(2), 16000)
    const t3 = setTimeout(() => setClueLevel(3), 24000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() === REAL_FLAG) {
      setStatus('correct')
      setShowDownload(true)
      setTimeout(() => {
        window.open('https://genshin.hoyoverse.com/en/download', '_blank')
      }, 1500)
    } else {
      setStatus('wrong')
      setTimeout(() => setStatus(null), 2000)
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <span className="text-amber-400/70 text-sm font-mono tracking-widest">
            ▸ HIDDEN_QUEST
          </span>
          <h1 className="text-4xl font-bold mt-2 anime-title text-gradient">
            秘密任务
          </h1>
        </motion.div>

        {/* Ciphertext card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card p-6 mb-6 text-center"
        >
          <Lock className="w-6 h-6 text-amber-400 mx-auto mb-4" />
          <p className="text-xs text-cyber-grid font-mono mb-2">ENCRYPTED MESSAGE</p>
          <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-amber-400/80 break-all select-all">
            {cipherHex}
          </div>
          <p className="text-xs text-cyber-grid mt-3 font-mono">
            Length: {cipherHex.length} hex chars | Cipher: XOR
          </p>
        </motion.div>

        {/* Clues */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="cyber-card p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <ScanEye className="w-4 h-4 text-cyber-cyan" />
            <span className="text-cyber-cyan text-sm font-mono">CLUES</span>
          </div>
          <p className="text-cyber-grid text-sm font-mono mb-2">
            ▎密文由 XOR 加密，密钥隐藏在页面中...
          </p>
          {clueLevel >= 1 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-cyber-grid/80 text-sm font-mono mb-2">
              ▎检查页面源代码，有一个隐藏的提示...
            </motion.p>
          )}
          {clueLevel >= 2 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-cyber-grid/80 text-sm font-mono mb-2">
              ▎CSS 中藏着一个看不见的“钥匙”
            </motion.p>
          )}
          {clueLevel >= 3 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-amber-400/80 text-sm font-mono mb-2">
              ▎密钥 = 一款热门游戏的英文名（7个字母）
            </motion.p>
          )}
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="cyber-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-4 h-4 text-cyber-purple" />
            <span className="text-cyber-purple text-sm font-mono">SUBMIT FLAG</span>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="flag{...}"
              className="flex-1 bg-black/50 border border-cyber-grid/30 rounded-lg px-4 py-3 font-mono text-sm text-cyber-cyan focus:outline-none focus:border-cyber-cyan/50 transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-3 bg-cyber-cyan/20 border border-cyber-cyan/30 rounded-lg text-cyber-cyan font-mono text-sm hover:bg-cyber-cyan/30 transition-colors"
            >
              DECODE
            </motion.button>
          </form>

          <AnimatePresence>
            {status === 'wrong' && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-sm font-mono mt-3"
              >
                ✗ 解密失败，再试试！
              </motion.p>
            )}
          </AnimatePresence>

          {showDownload && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-center"
            >
              <Download className="w-8 h-8 text-green-400 mx-auto mb-2 animate-bounce" />
              <p className="text-green-400 font-mono text-sm">
                ✓ 解密成功！正在下载原神...
              </p>
              <p className="text-cyber-grid text-xs font-mono mt-1">
                （如果未自动下载，
                <a href="https://genshin.hoyoverse.com/en/download" target="_blank" className="text-cyber-cyan underline">
                  点此手动下载
                </a>）
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Invisible key element for inspection */}
        <div
          data-key="genshin"
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}