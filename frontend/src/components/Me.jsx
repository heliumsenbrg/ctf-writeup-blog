import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, LogOut, MessageSquare, Trophy, User } from 'lucide-react'
import { useAuthUser, displayName, maskAccount } from '../hooks/useAuthUser.js'
import { getAuthCloud } from '../utils/cloud.js'
import { readActivity } from '../utils/activity.js'

export default function Me() {
  const navigate = useNavigate()
  const { user, loading } = useAuthUser()

  if (loading) {
    return <section className="mx-auto max-w-2xl px-4 py-24 text-center font-mono text-sm text-cyber-grid">正在读取会话…</section>
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24">
        <div className="glass-card p-7 text-center">
          <p className="font-mono text-xs text-cyber-grid">$ whoami</p>
          <h1 className="mt-3 text-xl font-bold text-white">还没有登录</h1>
          <p className="mt-2 text-sm text-cyber-grid">登录后才能留言、评论和留下通关记录。</p>
          <Link
            to="/login"
            state={{ from: '/me' }}
            className="mt-5 inline-flex rounded-lg border border-cyber-cyan/40 bg-cyber-cyan/10 px-4 py-2 font-mono text-sm text-cyber-cyan hover:bg-cyber-cyan/20"
          >
            去登录
          </Link>
        </div>
      </section>
    )
  }

  const activity = readActivity(user.id)

  async function signOut() {
    try { await getAuthCloud().auth.signOut() } catch { /* 本地也清 */ }
    navigate('/')
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
        <div className="border-b border-cyber-cyan/15 bg-cyber-darker/60 px-5 py-4 font-mono text-xs text-cyber-grid">
          <span className="text-cyber-cyan">$</span> whoami
        </div>
        <div className="p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan">
              <User className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-white">{displayName(user)}</h1>
              <p className="mt-0.5 font-mono text-[11px] text-cyber-grid">{maskAccount(user) || '已验证身份'}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link to="/guestbook" className="rounded-lg border border-cyber-grid/20 bg-cyber-darker/50 px-3 py-3 text-sm text-cyber-grid hover:border-cyber-cyan/30 hover:text-cyber-cyan">
              <MessageSquare className="mb-1 h-4 w-4" /> 去留言板
            </Link>
            <Link to="/challenges" className="rounded-lg border border-cyber-grid/20 bg-cyber-darker/50 px-3 py-3 text-sm text-cyber-grid hover:border-cyber-cyan/30 hover:text-cyber-cyan">
              <Trophy className="mb-1 h-4 w-4" /> 去刷题
            </Link>
          </div>

          <div className="mt-7">
            <h2 className="font-mono text-xs text-cyber-cyan">本机发言记录</h2>
            {activity.length === 0 ? (
              <p className="mt-2 text-xs leading-5 text-cyber-grid/60">还没有记录。登录后发留言、评论或留名，会在这里留下本机摘要。</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {activity.slice(0, 8).map((item, i) => (
                  <li key={`${item.at}-${i}`} className="rounded-lg border border-cyber-grid/15 bg-cyber-darker/40 px-3 py-2 text-xs text-cyber-grid">
                    <span className="mr-2 font-mono text-cyber-cyan">{item.type}</span>
                    <span className="text-white/80">{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 font-mono text-[10px] text-cyber-grid/40">仅保存在当前浏览器；换设备不会同步。</p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3 border-t border-cyber-grid/10 pt-5">
            <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-lg border border-cyber-grid/30 px-4 py-2 font-mono text-xs text-cyber-grid hover:text-cyber-cyan">
              <ArrowLeft className="h-4 w-4" /> 返回
            </button>
            <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-lg border border-cyber-grid/30 px-4 py-2 font-mono text-xs text-cyber-grid hover:border-cyber-pink/40 hover:text-cyber-pink">
              <LogOut className="h-4 w-4" /> 退出登录
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
