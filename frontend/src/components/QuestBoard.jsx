import { useCallback, useEffect, useState } from 'react'
import { Trophy, Send, Loader2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getCloud, unwrap, friendlyDbError } from '../utils/cloud.js'
import { timeAgo } from '../utils/timeAgo.js'

const TABLE = 'quest_board'
const NAME_KEY = 'quest:nickname'

/**
 * 隐藏彩蛋通关榜。
 * ⚠️ 诚实说明：彩蛋的 flag 每次加载动态生成，**服务端无法校验**，
 *    所以这里只是「自助留名」—— 谁都能提交自己的成绩。UI 上也标注了。
 */
export default function QuestBoard() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setErr('')
    try {
      const data = await unwrap(
        getCloud().database.from(TABLE).select('id, nickname, quest, created_at')
          .order('created_at', { ascending: false }).limit(60)
      )
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      setErr(friendlyDbError(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // 按题目归组
  const byQuest = rows.reduce((acc, r) => {
    const k = r.quest || '未知'
    ;(acc[k] = acc[k] || []).push(r)
    return acc
  }, {})

  return (
    <div className="mt-10 border-t border-white/10 pt-6">
      <div className="mb-3 flex items-center gap-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-cyber-cyan font-mono">
          <Trophy className="w-4 h-4" /> 通关榜
        </h3>
        <span className="text-[10px] font-mono text-cyber-grid/50">
          {rows.length} 条记录 · 自助留名（服务端不校验成绩）
        </span>
        <button onClick={load} disabled={loading}
          className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-mono text-cyber-grid transition-colors hover:text-cyber-cyan disabled:opacity-50">
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> 刷新
        </button>
      </div>

      {loading && !rows.length && (
        <div className="flex items-center gap-2 py-6 text-xs font-mono text-cyber-grid/50">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> 加载中…
        </div>
      )}
      {err && !loading && (
        <div className="flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-400/5 px-3 py-2 text-xs font-mono text-red-300">
          <AlertCircle className="mt-px w-3.5 h-3.5 shrink-0" /> {err}
        </div>
      )}
      {!err && !loading && !rows.length && (
        <div className="py-6 text-center text-xs font-mono text-cyber-grid/40">
          还没有人留名 —— 解出彩蛋后可以在这里记一笔
        </div>
      )}

      <div className="flex flex-col gap-3">
        {Object.entries(byQuest).map(([quest, list]) => (
          <div key={quest} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div className="mb-1 text-[11px] font-mono text-cyber-purple">
              {quest} <span className="text-cyber-grid/40">· {list.length} 人</span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {list.slice(0, 12).map((r) => (
                <span key={r.id} className="text-[11px] font-mono text-cyber-grid/80">
                  <span className="text-cyber-cyan">{r.nickname}</span>
                  <span className="ml-1 text-cyber-grid/35">{timeAgo(r.created_at)}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** 胜利弹窗里的「留名」表单 */
export function QuestSignIn({ quest }) {
  const [nickname, setNickname] = useState('')
  const [state, setState] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    try { setNickname(localStorage.getItem(NAME_KEY) || '') } catch { /* 隐私模式 */ }
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const n = nickname.trim()
    if (!n) return setState({ type: 'err', text: '先起个名字' })
    setBusy(true)
    try {
      await unwrap(getCloud().database.from(TABLE).insert({ nickname: n, quest }).select('id'))
      try { localStorage.setItem(NAME_KEY, n) } catch { /* 隐私模式 */ }
      setState({ type: 'ok', text: '已记录，谢谢！' })
    } catch (e2) {
      setState({ type: 'err', text: friendlyDbError(e2) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mb-3 w-full max-w-xs">
      <div className="flex items-center gap-2">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={20}
          placeholder="留个名进通关榜"
          className="min-w-0 flex-1 rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-xs text-cyber-cyan placeholder:text-cyber-grid/40 outline-none focus:border-cyber-cyan/50"
        />
        <button type="submit" disabled={busy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-cyber-cyan/40 bg-cyber-cyan/10 px-3 py-1.5 text-xs font-mono text-cyber-cyan transition-colors hover:bg-cyber-cyan/20 disabled:opacity-50">
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          记一笔
        </button>
      </div>
      {state && (
        <div className={`mt-1.5 flex items-center gap-1.5 text-[11px] font-mono ${state.type === 'ok' ? 'text-emerald-300' : 'text-red-300'}`}>
          {state.type === 'ok' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          {state.text}
        </div>
      )}
    </form>
  )
}
