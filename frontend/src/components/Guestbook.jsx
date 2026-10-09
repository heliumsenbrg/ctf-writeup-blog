import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, Loader2, RefreshCw, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react'
import { getCloud, unwrap, friendlyDbError } from '../utils/cloud.js'
import { timeAgo } from '../utils/timeAgo.js'
import { safeHref, displayHost } from '../utils/safeUrl.js'

const PAGE_SIZE = 10
const TABLE = 'guestbook'
const COOLDOWN_MS = 30 * 1000 // 发完一条后 30 秒内不能再发（配合数据库的长度约束做基本防刷）
const COOLDOWN_KEY = 'guestbook:last-post'

export default function Guestbook() {
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [site, setSite] = useState('')
  const [honeypot, setHoneypot] = useState('') // 机器人会填它，真人看不到
  const [posting, setPosting] = useState(false)
  const [msg, setMsg] = useState(null) // { type: 'ok' | 'err', text }
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadErr, setLoadErr] = useState('')
  const formRef = useRef(null)

  // ⚠️ 实测这个信封**不回 count**（`{count:'exact'}` 拿到的始终是 null），
  //    所以分页不依赖总数：多取一行来判断"还有没有下一页"。
  const load = useCallback(async (targetPage = 1) => {
    setLoading(true)
    setLoadErr('')
    try {
      const from = (targetPage - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE // 故意多取 1 行
      const rows = await unwrap(
        getCloud()
          .database.from(TABLE)
          .select('id, nickname, content, site, created_at')
          .order('created_at', { ascending: false })
          .range(from, to)
      )
      const arr = Array.isArray(rows) ? rows : []
      setHasNext(arr.length > PAGE_SIZE)
      setList(arr.slice(0, PAGE_SIZE))
      setPage(targetPage)

      // 总数单独轻量取（只取 id 列，上限 1000）
      try {
        const ids = await unwrap(getCloud().database.from(TABLE).select('id').limit(1000))
        setTotal(Array.isArray(ids) ? ids.length : 0)
      } catch {
        setTotal(0)
      }
    } catch (e) {
      setLoadErr(friendlyDbError(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(1) }, [load])


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
    const s = site.trim()
    if (!n || !c) return setMsg({ type: 'err', text: '昵称和留言内容都要填哦' })
    if (n.length > 20) return setMsg({ type: 'err', text: '昵称最多 20 个字' })
    if (c.length > 500) return setMsg({ type: 'err', text: '留言最多 500 个字' })
    if (s && !/^https?:\/\/\S+/i.test(s)) return setMsg({ type: 'err', text: '站点链接要以 http(s):// 开头' })

    // 蜜罐：真人看不见这个字段；填了的一律当成机器人，假装成功但不写入
    if (honeypot) {
      setMsg({ type: 'ok', text: '留言已提交' })
      setNickname(''); setContent(''); setSite('')
      return
    }

    const left = cooldownLeft()
    if (left > 0) return setMsg({ type: 'err', text: `发得太快了，请等 ${Math.ceil(left / 1000)} 秒` })

    setPosting(true)
    try {
      // 不传 owner_id —— 该表是公开留言表，没有归属列，写入由 RLS 的 INSERT 策略放行
      // 注意：返回**空数组**是有意义的 —— 行确实写进去了，但被服务端的审核触发器
      // 置成了 hidden=true，而读策略是 `hidden = false`，所以回读拿不到它。
      // 也就是"内容进入了待审核状态"。这里如实告诉访客，别让人以为发丢了。
      const rows = await unwrap(
        getCloud().database.from(TABLE).insert({ nickname: n, content: c, site: s || null }).select('id')
      )
      const pending = !Array.isArray(rows) || rows.length === 0
      try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())) } catch { /* 忽略隐私模式报错 */ }
      setNickname(''); setContent(''); setSite('')
      setMsg({
        type: 'ok',
        text: pending
          ? '已提交，站长审核通过后显示（含推广链接或疑似广告的内容会自动进入审核）'
          : '留言成功，谢谢！',
      })
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      await load(1)
    } catch (err) {
      setMsg({ type: 'err', text: friendlyDbError(err) })
    } finally {
      setPosting(false)
    }
  }


  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <span className="text-cyber-cyan/70 text-sm font-mono tracking-widest">GUESTBOOK</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2 anime-title text-gradient">留言板</h1>
          <p className="text-cyber-grid mt-3 font-mono text-sm">
            不用注册，直接说两句 · 已收到 {total}{total >= 1000 ? '+' : ''} 条
          </p>
        </motion.div>

        {/* 留言表单 */}
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-5 sm:p-6 mb-8 scroll-mt-24"
        >
          <form onSubmit={submit} className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                placeholder="昵称（最多 20 字）"
                className="flex-1 bg-cyber-darker/60 border border-cyber-grid/30 rounded-lg px-3 py-2 text-sm text-cyber-cyan placeholder:text-cyber-grid/50 outline-none focus:border-cyber-cyan/50"
              />
              <input
                value={site}
                onChange={(e) => setSite(e.target.value)}
                maxLength={100}
                placeholder="你的站点（选填）"
                className="flex-[2] bg-cyber-darker/60 border border-cyber-grid/30 rounded-lg px-3 py-2 text-sm text-cyber-cyan placeholder:text-cyber-grid/50 outline-none focus:border-cyber-cyan/50"
              />
            </div>

            {/* 蜜罐：用 CSS 藏起来，真人不会看到也不会填 */}
            <input
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="说点什么…（最多 500 字）"
              className="w-full resize-y bg-cyber-darker/60 border border-cyber-grid/30 rounded-lg px-3 py-2 text-sm text-cyber-cyan placeholder:text-cyber-grid/50 outline-none focus:border-cyber-cyan/50"
            />

            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-cyber-grid/50">
                {content.length}/500 · 友善发言，留言公开可见
              </span>
              <button
                type="submit"
                disabled={posting}
                className="inline-flex items-center gap-2 rounded-lg border border-cyber-cyan/50 bg-cyber-cyan/10 px-4 py-2 text-sm font-mono text-cyber-cyan transition-colors hover:bg-cyber-cyan/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {posting ? '发送中…' : '发送留言'}
              </button>
            </div>

            {msg && (
              <div
                className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs font-mono ${
                  msg.type === 'ok'
                    ? 'border-emerald-400/30 bg-emerald-400/5 text-emerald-300'
                    : 'border-red-400/30 bg-red-400/5 text-red-300'
                }`}
              >
                {msg.type === 'ok' ? <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0" /> : <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />}
                {msg.text}
              </div>
            )}
          </form>
        </motion.div>

        {/* 留言列表 */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-cyber-cyan anime-title">
            <MessageSquare className="h-4 w-4" /> 全部留言
          </h2>
          <button
            onClick={() => load(page)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-cyber-grid transition-colors hover:text-cyber-cyan disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> 刷新
          </button>
        </div>

        {loading && !list.length && (
          <div className="flex items-center justify-center gap-2 py-14 text-xs font-mono text-cyber-grid/60">
            <Loader2 className="h-4 w-4 animate-spin" /> 加载留言…
          </div>
        )}

        {loadErr && !loading && (
          <div className="flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-400/5 px-3 py-3 text-xs font-mono text-red-300">
            <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
            <span>读取失败：{loadErr}</span>
          </div>
        )}

        {!loadErr && !loading && !list.length && (
          <div className="py-14 text-center text-xs font-mono text-cyber-grid/60">
            还没有留言 —— 第一条就交给你了 ✍️
          </div>
        )}

        <div className="flex flex-col gap-3">
          {list.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-cyber-grid/20 bg-black/30 p-4"
            >
              <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-sm font-bold text-cyber-cyan">{m.nickname}</span>
                {m.site && (safeHref(m.site) ? (
                  <a
                    href={safeHref(m.site)}
                    target="_blank"
                    rel="noreferrer nofollow"
                    className="truncate text-[11px] font-mono text-cyber-purple hover:text-cyber-cyan"
                  >
                    {displayHost(m.site)}
                  </a>
                ) : (
                  // 非 http(s)（javascript: / data: 等）只当纯文本显示，绝不放进 href
                  <span className="truncate text-[11px] font-mono text-cyber-grid/50">
                    {String(m.site).slice(0, 40)}
                  </span>
                ))}
                <span className="ml-auto text-[11px] font-mono text-cyber-grid/50">{timeAgo(m.created_at)}</span>
              </div>
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-cyber-grid">
                {m.content}
              </p>
            </motion.div>
          ))}
        </div>

        {(page > 1 || hasNext) && (
          <div className="mt-6 flex items-center justify-center gap-4 text-xs font-mono text-cyber-grid">
            <button
              onClick={() => load(page - 1)}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-1 transition-colors hover:text-cyber-cyan disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> 上一页
            </button>
            <span>第 {page} 页</span>
            <button
              onClick={() => load(page + 1)}
              disabled={!hasNext || loading}
              className="inline-flex items-center gap-1 transition-colors hover:text-cyber-cyan disabled:opacity-40"
            >
              下一页 <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
