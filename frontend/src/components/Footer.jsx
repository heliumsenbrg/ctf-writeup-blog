import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-cyber-cyan/10 bg-cyber-darker/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="text-cyber-cyan/70 text-sm font-mono">
              &lt;CTF WriteUp /&gt; <span className="text-cyber-purple">v1.0.0</span>
            </div>
            <div className="text-cyber-grid text-xs mt-1">
              生成时间: 2026-04-26 | 全部题目均为一血解题
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.div 
              className="text-cyber-cyan/80 text-xs font-mono"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ▶ SYSTEM_ONLINE
            </motion.div>
            <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
          </div>
        </div>
        
        {/* Anime style decoration */}
        <div className="mt-6 pt-6 border-t border-cyber-grid/30 text-center">
          <span className="text-cyber-grid text-xs anime-title">
            「 細部まで見逃すな 」
          </span>
          <span className="text-cyber-cyan/70 text-xs ml-4">— 别放过任何细节</span>
        </div>
      </div>
    </footer>
  )
}
