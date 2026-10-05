import { motion } from 'framer-motion'
import { Mail, Github, ExternalLink } from 'lucide-react'
import { friendLinks } from '../data/friendLinks.js'

export default function About() {
  return (
    <div className="min-h-screen relative px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 sm:p-8 neon-border"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-4">关于本站</h1>
          <p className="text-cyber-grid text-sm sm:text-base leading-relaxed">
            这是我的 CTF writeup 博客，用于沉淀 Web、PWN、逆向、隐写、杂项等方向的解题思路与踩坑记录。
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="https://github.com/heliumsenbrg/ctf-writeup-blog"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-cyber-cyan hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://heliumsenbrg.github.io/ctf-writeup-blog/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-cyber-cyan hover:text-white transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              站点链接
            </a>
          </div>
          <p className="mt-4 text-xs text-cyber-grid/70">
            Blog by heliumsenbrg / qiuyida
          </p>
        </motion.div>

        {/* 友链区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 sm:p-8 mt-6"
        >
          <h2 className="text-xl font-bold text-gradient mb-4">友情链接</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {friendLinks.map(f => (
              <a
                key={f.url}
                href={f.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-cyber-grid/20 hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5 transition-colors group"
              >
                <ExternalLink className="w-4 h-4 text-cyber-purple shrink-0" />
                <span className="text-sm text-cyber-cyan group-hover:text-white transition-colors">{f.name}</span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
