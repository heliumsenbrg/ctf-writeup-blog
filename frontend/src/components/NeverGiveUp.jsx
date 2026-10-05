import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'

/**
 * ♪ NEVER GIVE UP
 *
 * 看起来像「播放音乐」，点下去直接跳到 B 站视频。
 * （挑战页那个是真的 Web Audio 旋律，这个不是 —— 别搞混。）
 *
 * 想换视频，只改下面这一行。
 */
export const NEVER_GIVE_UP_URL = 'https://www.bilibili.com/video/BV1GJ411x7h7'

export default function NeverGiveUp({ label = '♪ NEVER GIVE UP' }) {
  return (
    <motion.a
      href={NEVER_GIVE_UP_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="点我，永不放弃"
      aria-label="Never Give Up"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-r from-cyber-cyan to-cyber-purple animate-pulse transition-all duration-300"
    >
      <Volume2 className="w-6 h-6 text-white" />
      <span className="absolute -top-8 right-0 text-right text-xs font-mono whitespace-nowrap text-cyber-cyan">
        {label}
      </span>
    </motion.a>
  )
}
