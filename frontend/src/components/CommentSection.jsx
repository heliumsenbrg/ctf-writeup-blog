import { useCallback, useEffect, useState } from 'react'
import { MessageSquare, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getCloud, unwrap, friendlyDbError } from '../utils/cloud.js'
import { timeAgo } from '../utils/timeAgo.js'

const TABLE = 'comments'
const COOLDOWN_MS = 30 * 1000
const COOLDOWN_KEY = 'comment:last-post'

/**
 * 文章/笔记页的评论区 —— 复用云数据库（同一个 app），按 page 字段分区。
 * 访客**不需要 GitHub 账号**（这是它相对 giscus 的优势）。
 * 反刷：30 秒冷却 + 蜜罐字段 + 数据库侧长度约束。
 */
export default function CommentSection({ page }) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [posting, setPosting] = useState(false)
  const [msg, setMsg] = useState(null)

  const load = useCallback(async () => {
    if (!page) return
    setLoading(true)
    setErr('')
    try {
      const rows = await unwrap(
        getCloud()
          .database.from(TABLE)
          .select('id, nickname, content, created_at')
          .eq('page', page)
          .order('created_at', { ascending: false })
          .limit(50)
      )
      setList(Array.isArray(rows) ? rows : [])
    } catch (e) {
      setErr(friendlyDbError(e))
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { load() }, [load])

  const cooldownLeft = () => {
    try {
      const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0)
      return Math.max(0, COOLDOWN_MS - (Date.now() - last))
    } catch {
      return 0
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setMsg(null)
    const n = nickname.trim()
    const c = content.trim()
    if (!n || !c) return setMsg({ type: 'err', text: '昵称和内容都要填哦' })
    if (honeypot) { setMsg({ type: 'ok', text: '已发表' }); setNickname(''); setContent(''); return }
    const left = cooldownLeft()
    if (left > 0) return setMsg({ type: 'err', text: `发得太快了，请等 ${Math.ceil(left / 1000)} 秒` })

    setPosting(true)
    try {
      await unwrap(getCloud().database.from(TABLE).insert({ page, nickname: n, content: c }).select('id'))
      try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())) } catch { /* 隐私模式 */ }
      setNickname(''); setContent('')
      setMsg({ type: 'ok', text: '评论成功' })
      await load()
    } catch (e2) {
      setMsg({ type: 'err', text: friendlyDbError(e2) })
    } finally {
      setPosting(false)
    }
  }

  return (
    <section className="mt-10 border-t border-cyber-grid/20 pt-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-cyber-cyan anime-title">
        <MessageSquare className="h-4 w-4" /> 评论{list.length ? ` · ${list.length}` : ''}
      </h2>

      <form onSubmit={submit} className="mb-5 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            placeholder="昵称"
            className="w-32 shrink-0 rounded-lg border border-cyber-grid/30 bg-cyber-darker/60 px-3 py-1.5 text-xs text-cyber-cyan placeholder:text-cyber-grid/50 outline-none focus:border-cyber-cyan/50"
          />
          <input
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
            placeholder="说点什么…（最多 500 字，无需登录）"
            className="min-w-0 flex-1 rounded-lg border border-cyber-grid/30 bg-cyber-darker/60 px-3 py-1.5 text-xs text-cyber-cyan placeholder:text-cyber-grid/50 outline-none focus:border-cyber-cyan/50"
          />
          <button
            type="submit"
            disabled={posting}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-cyber-cyan/50 bg-cyber-cyan/10 px-3 py-1.5 text-xs font-mono text-cyber-cyan transition-colors hover:bg-cyber-cyan/20 disabled:opacity-50"
          >
            {posting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            发表
          </button>
        </div>

        {msg && (
          <div className={`flex items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-mono ${
            msg.type === 'ok'
              ? 'border-emerald-400/30 bg-emerald-400/5 text-emerald-300'
              : 'border-red-400/30 bg-red-400/5 text-red-300'
          }`}>
            {msg.type === 'ok' ? <CheckCircle2 className="mt-px h-3 w-3 shrink-0" /> : <AlertCircle className="mt-px h-3 w-3 shrink-0" />}
            {msg.text}
          </div>
        )}
      </form>

      {loading && !list.length && (
        <div className="flex items-center justify-center gap-2 py-6 text-xs font-mono text-cyber-grid/60">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> 加载评论…
        </div>
      )}
      {err && !loading && (
        <div className="flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-400/5 px-3 py-2 text-xs font-mono text-red-300">
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" /> 读取失败：{err}
        </div>
      )}
      {!err && !loading && !list.length && (
        <div className="py-6 text-center text-xs font-mono text-cyber-grid/55">还没有评论 —— 来抢沙发</div>
      )}

      <div className="flex flex-col gap-2">
        {list.map((m) => (
          <div key={m.id} className="rounded-lg border border-cyber-grid/15 bg-black/25 px-3 py-2">
            <div className="mb-1 flex items-center gap-3 text-[11px] font-mono">
              <span className="font-bold text-cyber-cyan">{m.nickname}</span>
              <span className="ml-auto text-cyber-grid/45">{timeAgo(m.created_at)}</span>
            </div>
            <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-cyber-grid">{m.content}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
