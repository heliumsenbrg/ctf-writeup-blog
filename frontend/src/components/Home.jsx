import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Flag, Terminal, Shield, Code, Zap, ArrowRight, ChevronDown, X, Layers } from 'lucide-react'
import { useState, useEffect } from 'react'

// Per-platform challenge counts by category
const platformData = {
  all: {
    label: '全部靶场',
    icon: Layers,
    color: 'cyan',
    solved: '42',
    firstBlood: '10',
    totalPoints: '8000+',
    stats: [
      { label: '总解题', value: '46', suffix: '' },
      { label: '一血', value: '10', suffix: '' },
      { label: '总得分', value: '8000+', suffix: 'pts' },
      { label: '通过率', value: '100', suffix: '%' }
    ],
    categories: [
      { id: 'infoleak', title: 'Information Leakage', subtitle: 'Information Gathering', count: 19, color: 'cyan', icon: Shield, desc: 'HTML comments, response headers, robots.txt, Cookie IDOR, JWT forging' },
      { id: 'request', title: 'HTTP Request', subtitle: 'Header Forgery', count: 2, color: 'green', icon: Zap, desc: 'GET+POST同请求, XFF+UA+Via+Cookie五层验证' },
      { id: 'php', title: 'PHP Weak Typing', subtitle: 'Type Juggling', count: 10, color: 'purple', icon: Code, desc: 'Array comparison bypass, loose MD5, numeric string bypass' },
      { id: 'cmd', title: 'Command Injection', subtitle: 'RCE Techniques', count: 12, color: 'pink', icon: Terminal, desc: 'IFS bypass, no-letter RCE, string concatenation, source disclosure' },
      { id: 'pwn', title: 'PWN & Reverse', subtitle: 'Binary Exploitation', count: 4, color: 'blue', icon: Flag, desc: 'XOR decryption, shellcode writing, algorithm reverse' }
    ]
  },
  ctfshow: {
    label: 'CTFShow',
    icon: Flag,
    color: 'cyan',
    solved: '18',
    firstBlood: '7',
    totalPoints: '3000+',
    stats: [
      { label: '总解题', value: '18', suffix: '' },
      { label: '一血', value: '7', suffix: '' },
      { label: '总得分', value: '3000+', suffix: 'pts' },
      { label: '通过率', value: '100', suffix: '%' }
    ],
    categories: [
      { id: 'infoleak', title: 'Information Leakage', subtitle: '基础信息收集', count: 18, color: 'cyan', icon: Shield, desc: 'HTML注释、响应头、robots.txt、Cookie IDOR、JWT伪造、/proc/self/fd' },
    ]
  },
  qc: {
    label: 'QC 靶场',
    icon: Terminal,
    color: 'purple',
    solved: '28',
    firstBlood: '3',
    totalPoints: '5000+',
    stats: [
      { label: '总解题', value: '28', suffix: '' },
      { label: '一血', value: '3', suffix: '' },
      { label: '总得分', value: '5000+', suffix: 'pts' },
      { label: '通过率', value: '100', suffix: '%' }
    ],
    categories: [
      { id: 'infoleak', title: 'Information Leakage', subtitle: '信息收集', count: 1, color: 'cyan', icon: Shield, desc: '目录扫描/备份文件' },
      { id: 'request', title: 'HTTP Request', subtitle: 'Header Forgery', count: 2, color: 'green', icon: Zap, desc: 'GET+POST同请求, XFF+UA+Via+Cookie五层验证' },
      { id: 'php', title: 'PHP Weak Typing', subtitle: 'Type Juggling', count: 10, color: 'purple', icon: Code, desc: 'Array comparison bypass, loose MD5, numeric string bypass' },
      { id: 'cmd', title: 'Command Injection', subtitle: 'RCE Techniques', count: 12, color: 'pink', icon: Terminal, desc: 'IFS bypass, no-letter RCE, string concatenation, source disclosure' },
      { id: 'pwn', title: 'PWN & Reverse', subtitle: 'Binary Exploitation', count: 4, color: 'blue', icon: Flag, desc: 'XOR decryption, shellcode writing, algorithm reverse' }
    ]
  }
}

// 黑幕遮挡组件 - 萌娘百科风格
export function Spoiler({ children, className = '' }) {
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    setShowTooltip(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setShowTooltip(false)
  }

  return (
    <span className="relative inline-block">
      <span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          relative cursor-pointer select-none
          ${isHovered ? 'text-yellow-400' : 'text-transparent'}
          ${className}
        `}
        style={{
          backgroundColor: isHovered ? 'transparent' : '#000',
          borderRadius: '4px',
          padding: '2px 8px',
          minWidth: '40px',
          display: 'inline-block',
          transition: 'all 0.15s ease',
          boxShadow: isHovered ? 'none' : 'inset 0 0 0 1px rgba(255,255,255,0.3)'
        }}
      >
        {/* 黑幕遮挡层 */}
        {!isHovered && (
          <span 
            className="absolute inset-0 bg-[#0a0a0a]"
            style={{ borderRadius: '4px' }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </span>
      
      {/* 提示框 */}
      <AnimatePresence>
        {showTooltip && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 pointer-events-none"
          >
            <span className="inline-block bg-black border border-red-500 rounded px-3 py-1.5 text-red-500 text-xs font-bold whitespace-nowrap">
              你知道的太多了
            </span>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

export default function Home() {
  const [platform, setPlatform] = useState('all')
  const data = platformData[platform]
  const categories = data.categories
  const stats = data.stats
  
  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-4">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-cyber-purple/70 text-sm font-mono tracking-widest"
              >
                MISSION_BRIEFING
              </motion.span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 anime-title">
              <span className="text-gradient cyber-glow">CTF WriteUp</span>
              <br />
              <span className="text-cyber-cyan/80 text-2xl md:text-3xl">Web Security Writeups</span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-cyber-grid text-lg md:text-xl max-w-2xl mx-auto mb-8 font-mono"
            >
              <span className="text-cyber-cyan/80">&lt;</span>
              <span className="text-cyber-cyan/80"> {data.solved} challenges solved </span>
              <span className="text-cyber-cyan/80">/&gt;</span>
            </motion.p>
            
            {/* Platform Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              {Object.entries(platformData).map(([key, p]) => {
                const Icon = p.icon
                const active = platform === key
                return (
                  <button
                    key={key}
                    onClick={() => setPlatform(key)}
                    className={`
                      px-5 py-2.5 rounded-lg font-mono text-sm flex items-center gap-2
                      transition-all duration-200 border
                      ${active 
                        ? `bg-cyber-${p.color}/20 border-cyber-${p.color}/60 text-cyber-${p.color} shadow-lg shadow-cyber-${p.color}/10`
                        : 'bg-transparent border-cyber-grid/20 text-cyber-grid/60 hover:border-cyber-grid/40 hover:text-cyber-grid'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 ${active ? '' : 'opacity-50'}`} />
                    {p.label}
                  </button>
                )
              })}
            </motion.div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="cyber-card p-4"
                >
                  <div className="text-2xl md:text-3xl font-bold text-gradient">
                    {stat.value}
                    <span className="text-sm text-cyber-cyan/80">{stat.suffix}</span>
                  </div>
                  <div className="text-xs text-cyber-grid mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to={`/challenges?platform=${platform}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-darker font-bold rounded-lg flex items-center gap-2 animate-glow"
                >
                  <Flag className="w-5 h-5" />
                  View Challenges
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-6 h-6 text-cyber-cyan/80" />
          </motion.div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-cyber-purple/70 text-sm font-mono tracking-widest">
              CATEGORIES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 anime-title text-gradient">
              Challenge Categories
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/article/${cat.id}?platform=${platform}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="cyber-card p-6 h-full cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-cyber-${cat.color}/10 flex items-center justify-center shrink-0 group-hover:bg-cyber-${cat.color}/20 transition-colors`}>
                        <cat.icon className={`w-6 h-6 text-cyber-${cat.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-cyber-cyan group-hover:text-white transition-colors anime-title">
                            {cat.title}
                          </h3>
                          <span className="text-xs text-cyber-grid font-mono">
                            {cat.count} challenges
                          </span>
                        </div>
                        <p className="text-sm text-cyber-grid mb-2">{cat.subtitle}</p>
                        <p className="text-xs text-cyber-cyan/80 line-clamp-2">{cat.desc}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-cyber-cyan/70 group-hover:text-cyber-cyan transition-colors" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Intro Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cyber-card p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-cyber-cyan" />
              <span className="text-cyber-purple/70 text-sm font-mono tracking-widest">
                INTRO
              </span>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-cyber-cyan/80 text-lg leading-relaxed mb-4">
                CTF is not as far as you think. When you first started in web security, you might have felt confused and overwhelmed. But the real journey begins when you actually start solving challenges — it is a skill that requires systematic training.
              </p>
              <p className="text-cyber-grid leading-relaxed mb-4">
                Why CTF? In short, it is the closest training method to real combat. Challenges are often simplifications and abstractions of real vulnerabilities. Through solving them, you experience the loop of "try &rarr; fail &rarr; think &rarr; break through", which is the best way to learn.
              </p>
              <p className="text-cyber-grid leading-relaxed mb-4">
                Why CTF? In short, it is the closest training method to real combat. Challenges are often simplifications and abstractions of real vulnerabilities. Through solving them, you experience the loop of "try &rarr; fail &rarr; think &rarr; break through", which is the best way to learn.
              </p>
              <p className="text-cyber-grid leading-relaxed mb-4">
                More importantly, WriteUp documents this journey as a tutorial: it helps you rethink your approach, clarify every step of why you do what you do, rather than relying on intuition to come up with answers. Only when you can clearly articulate the solving process can you truly understand it.
              </p>
              <p className="text-cyber-grid leading-relaxed text-sm">
                <span className="text-cyber-cyan/60">Tip: </span>
                试试把鼠标悬停在 <Spoiler>flag</Spoiler>、<Spoiler>一血</Spoiler>、<Spoiler>RCE</Spoiler>、<Spoiler>JWT伪造</Spoiler> 这些词上~
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
