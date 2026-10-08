import { motion } from 'framer-motion'
import FriendLinks from './FriendLinks'
import { friendLinks } from '../data/friendLinks.js'


export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-cyber-cyan/10 bg-cyber-darker/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="text-cyber-cyan/70 text-sm font-mono">
              &lt;CTF WriteUp /&gt; <span className="text-cyber-purple">v1.0.0</span>
            </div>
            <div className="text-cyber-grid text-xs mt-1">
              记录 Web / 逆向 / 密码学 / Pwn / 杂项 方向的学习与解题过程
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
        
        {/* 友情链接（头像 + 名称，组件与「关于」页共用）
            没有友链时整块隐藏 —— 连带这圈 border-t 一起去掉，
            否则会剩一道没有内容的分隔线。 */}
        {friendLinks.length > 0 && (
          <div className="mt-6 pt-6 border-t border-cyber-grid/30">
            <FriendLinks variant="footer" />
          </div>
        )}

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
