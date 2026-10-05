import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Github, ExternalLink } from 'lucide-react'
import { friendLinks } from '../data/friendLinks.js'
import { buildFriendIssueUrl } from '../utils/friendRequest.js'

export default function About() {
  const [reqName, setReqName] = useState('')
  const [reqUrl, setReqUrl] = useState('')
  const [reqMsg, setReqMsg] = useState(null)

  const submitRequest = (e) => {
    e.preventDefault()
    const issueUrl = buildFriendIssueUrl(reqName, reqUrl)
    if (!issueUrl) {
      setReqMsg({ kind: 'err', text: '请填写名称，且链接需以 http:// 或 https:// 开头' })
      return
    }
    window.open(issueUrl, '_blank', 'noopener,noreferrer')
    setReqMsg({ kind: 'ok', text: '已打开 GitHub 新建 Issue 页面，提交后站长会尽快添加你的友链' })
    setReqName('')
    setReqUrl('')
  }

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

          <form onSubmit={submitRequest} className="mt-6 pt-5 border-t border-cyber-grid/20">
            <h3 className="text-sm font-mono text-cyber-grid mb-3 tracking-widest">申请友链 / APPLY</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={reqName}
                onChange={e => setReqName(e.target.value)}
                placeholder="你的名称"
                className="flex-1 bg-cyber-darker/60 border border-cyber-grid/30 rounded-lg px-3 py-2 text-sm text-cyber-cyan placeholder:text-cyber-grid/50 outline-none focus:border-cyber-cyan/50"
              />
              <input
                value={reqUrl}
                onChange={e => setReqUrl(e.target.value)}
                placeholder="你的链接 (https://…)"
                className="flex-[2] bg-cyber-darker/60 border border-cyber-grid/30 rounded-lg px-3 py-2 text-sm text-cyber-cyan placeholder:text-cyber-grid/50 outline-none focus:border-cyber-cyan/50"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg border border-cyber-cyan/50 text-cyber-cyan text-sm font-mono hover:bg-cyber-cyan/10 transition-colors"
              >
                提交申请
              </button>
            </div>
            <p className="text-xs text-cyber-grid/60 mt-2">
              提交会打开 GitHub 新建 Issue 页面（需登录 GitHub），站长审核合并后友链会上线。
            </p>
            {reqMsg && (
              <p className={`text-xs mt-2 ${reqMsg.kind === 'ok' ? 'text-cyber-cyan' : 'text-cyber-pink'}`}>{reqMsg.text}</p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  )
}
