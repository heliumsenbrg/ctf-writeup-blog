import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Lock, KeyRound, ScanEye, Download, ChevronDown } from 'lucide-react'
import FLAGS, { getFlagConfig, computeCipherHex } from '../config/flags'

export default function HiddenQuest() {
  const [activeId, setActiveId] = useState(FLAGS[0].id)
  const [input, setInput] = useState('')
  const [status, setStatus] = useState(null) // null | 'wrong' | 'correct'
  const [clueLevel, setClueLevel] = useState(0)
  const [showDownload, setShowDownload] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const timersRef = useRef([])
  const pickerRef = useRef(null)

  const config = getFlagConfig(activeId)
  const cipherHex = computeCipherHex(config.flag, config.key)

  // Reset state when switching flag
  useEffect(() => {
    setInput('')
    setStatus(null)
    setClueLevel(0)
    setShowDownload(false)
    setShowPicker(false)
  }, [activeId])

  // Console & clue timers
  useEffect(() => {
    // Clear old timers
    timersRef.current.forEach(t => clearTimeout(t))
    timersRef.current = []

    console.log(
      '%c' + config.consoleMsg[0],
      'color: #f59e0b; font-size: 16px; font-weight: bold'
    )
    config.consoleMsg.slice(1).forEach(msg => {
      console.log('%c' + msg, 'color: #8b5cf6')
    })

    timersRef.current.push(setTimeout(() => setClueLevel(1), 8000))
    timersRef.current.push(setTimeout(() => setClueLevel(2), 16000))
    timersRef.current.push(setTimeout(() => setClueLevel(3), 24000))

    return () => timersRef.current.forEach(t => clearTimeout(t))
  }, [config]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() === config.flag) {
      setStatus('correct')
      setShowDownload(true)
      setTimeout(() => {
        window.open(config.redirectUrl, '_blank')
      }, 1500)
    } else {
      setStatus('wrong')
      setTimeout(() => setStatus(null), 2000)
    }
  }

  // Close picker on outside click
  useEffect(() => {
    function handleClick(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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

        {/* Challenge Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="cyber-card p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-cyber-grid font-mono">
              ACTIVE CHALLENGE
            </span>
            <div className="relative" ref={pickerRef}>
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="flex items-center gap-2 px-4 py-2 bg-cyber-darker border border-cyber-grid/30 rounded-lg text-cyber-cyan font-mono text-sm hover:border-cyber-cyan/50 transition-all"
              >
                <span className={`w-2 h-2 rounded-full ${
                  activeId === 'genshin' ? 'bg-amber-400' :
                  activeId === 'starrail' ? 'bg-blue-400' :
                  activeId === 'zelda' ? 'bg-green-400' :
                  activeId === 'hacker' ? 'bg-emerald-400' :
                  activeId === 'moon' ? 'bg-purple-400' :
                  'bg-rose-400'
                }`} />
                {config.name}
                <ChevronDown className={`w-3 h-3 transition-transform ${showPicker ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-cyber-darker border border-cyber-grid/30 rounded-lg overflow-hidden shadow-xl z-50"
                  >
                    {FLAGS.map(f => (
                      <button
                        key={f.id}
                        onClick={() => { setActiveId(f.id); setShowPicker(false) }}
                        className={`w-full text-left px-4 py-3 font-mono text-sm transition-colors flex items-center gap-3 ${
                          f.id === activeId
                            ? 'bg-cyber-cyan/10 text-cyber-cyan border-l-2 border-cyber-cyan'
                            : 'text-cyber-grid hover:bg-cyber-grid/10 hover:text-cyber-cyan'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${
                          f.id === 'genshin' ? 'bg-amber-400' :
                          f.id === 'starrail' ? 'bg-blue-400' :
                          f.id === 'zelda' ? 'bg-green-400' :
                          f.id === 'hacker' ? 'bg-emerald-400' :
                          f.id === 'moon' ? 'bg-purple-400' :
                          'bg-rose-400'
                        }`} />
                        {f.name}
                        {f.id === activeId && (
                          <span className="ml-auto text-xs text-cyber-cyan/50">✓</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Ciphertext card */}
        <motion.div
          key={activeId + '-cipher'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="cyber-card p-6 mb-6 text-center"
        >
          <Lock className="w-6 h-6 text-amber-400 mx-auto mb-4" />
          <p className="text-xs text-cyber-grid font-mono mb-2">ENCRYPTED MESSAGE</p>
          <div
            className="bg-black/50 rounded-lg p-4 font-mono text-sm text-amber-400/80 break-all select-all transition-all"
          >
            {cipherHex}
          </div>
          <p className="text-xs text-cyber-grid mt-3 font-mono">
            Length: {cipherHex.length} hex chars | Cipher: XOR | Target: {config.flag.length} chars
          </p>
        </motion.div>

        {/* Clues */}
        <motion.div
          key={activeId + '-clues'}
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
            ▎{config.clues[0]}
          </p>
          {clueLevel >= 1 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-cyber-grid/80 text-sm font-mono mb-2">
              ▎{config.clues[1]}
            </motion.p>
          )}
          {clueLevel >= 2 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-cyber-grid/80 text-sm font-mono mb-2">
              ▎{config.clues[2]}
            </motion.p>
          )}
          {clueLevel >= 3 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-amber-400/80 text-sm font-mono mb-2">
              ▎{config.clues[3]}
            </motion.p>
          )}
        </motion.div>

        {/* Submit */}
        <motion.div
          key={activeId + '-submit'}
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
                key={activeId + '-wrong'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-400 text-sm font-mono mt-3"
              >
                ✗ 解密失败，再试试！
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDownload && (
              <motion.div
                key={activeId + '-success'}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg text-center"
              >
                <Download className="w-8 h-8 text-green-400 mx-auto mb-2 animate-bounce" />
                <p className="text-green-400 font-mono text-sm">
                  ✓ 解密成功！{config.redirectText}
                </p>
                <p className="text-cyber-grid text-xs font-mono mt-1">
                  （如果未跳转，
                  <a href={config.redirectUrl} target="_blank" className="text-cyber-cyan underline">
                    点此手动前往
                  </a>）
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Invisible key element for inspection */}
        <div
          data-key={config.key}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
