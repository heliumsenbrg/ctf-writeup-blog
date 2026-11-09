import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, KeyRound, Loader2, LogIn, LogOut, Mail, ShieldCheck, Smartphone, User,
} from 'lucide-react'
import { getAuthCloud, setTurnstileToken, friendlyAuthError } from '../utils/cloud.js'
import { useAuthUser } from '../hooks/useAuthUser.js'
import TurnstileBox, { turnstileEnabled } from './TurnstileBox.jsx'

const PHONE_RE = /^1\d{10}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('phone')
  const [recipient, setRecipient] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('form')
  const [pending, setPending] = useState(null)
  const [cooldown, setCooldown] = useState(0)
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  // 登录态统一走 useAuthUser：它会向服务端验一次，避免"本地有旧 token 就显示已登录"。
  // 之前这里自己抄了一份 getSession()（只读存储、不校验），所以旧会话能一直装成已登录。
  const { user: verifiedUser, loading: checking } = useAuthUser()
  // 本地仍保留一份可写状态：验证码通过后要立刻显示账号，退出也要立刻清空，
  // 不必等下一次校验。以 hook 的结果为基准同步过来。
  const [user, setUser] = useState(null)
  useEffect(() => { setUser(verifiedUser || null) }, [verifiedUser])
  const [tsToken, setTsToken] = useState('')
  const [msg, setMsg] = useState(null)
  const tsRef = useRef(null)

  useEffect(() => {
    if (cooldown <= 0) return undefined
    const timer = setInterval(() => setCooldown((n) => Math.max(0, n - 1)), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const valid = mode === 'phone' ? PHONE_RE.test(recipient) : EMAIL_RE.test(recipient)
  const account = user?.name || user?.email || user?.phone || '已登录访客'

  function switchMode(next) {
    setMode(next)
    setRecipient('')
    setCode('')
    setStep('form')
    setPending(null)
    setMsg(null)
    setCooldown(0)
  }

  function onRecipient(value) {
    setRecipient(value)
    if (step === 'code') {
      setStep('form')
      setPending(null)
      setCode('')
      setCooldown(0)
      setMsg(null)
    }
  }

  async function sendCode(e) {
    e?.preventDefault?.()
    if (!turnstileEnabled) {
      setMsg({ type: 'err', text: '站点尚未配置 Cloudflare Turnstile，暂时无法登录。' })
      return
    }
    if (!valid) {
      setMsg({ type: 'err', text: mode === 'phone' ? '请输入正确的 11 位手机号' : '请输入正确的邮箱地址' })
      return
    }
    if (!tsToken) {
      setMsg({ type: 'err', text: '请先完成下方的人机校验' })
      return
    }
    setSending(true)
    setMsg(null)
    setTurnstileToken(tsToken)
    try {
      const { data, error } = await getAuthCloud().auth.sendOtp({
        [mode]: recipient,
      })
      if (error) throw error
      setPending({
        mode,
        recipient,
        verificationId: data.verificationId,
        isExistingUser: data.isExistingUser,
      })
      setStep('code')
      setCooldown(60)
      setCode('')
      setMsg({ type: 'ok', text: '验证码已发送。新账号会在验证后自动创建。' })
    } catch (err) {
      setMsg({ type: 'err', text: friendlyAuthError(err) || '验证码发送失败，请稍后再试' })
    } finally {
      setSending(false)
      setTsToken('')
      setTurnstileToken('')
      tsRef.current?.reset()
    }
  }

  async function verify(e) {
    e?.preventDefault?.()
    if (!pending || pending.recipient !== recipient) {
      setMsg({ type: 'err', text: '请先获取当前账号的验证码' })
      return
    }
    if (!/^\d{4,8}$/.test(code.trim())) {
      setMsg({ type: 'err', text: '请输入验证码' })
      return
    }
    setVerifying(true)
    setMsg(null)
    try {
      const { data, error } = await getAuthCloud().auth.verifyOtp({
        [pending.mode]: pending.recipient,
        verificationId: pending.verificationId,
        isExistingUser: pending.isExistingUser,
        token: code.trim(),
      })
      if (error) throw error
      setUser(data?.user || data?.session?.user || null)
      setStep('done')
      setMsg({ type: 'ok', text: '登录成功' })
    } catch (err) {
      setMsg({ type: 'err', text: friendlyAuthError(err) || '验证码不正确，请重试' })
    } finally {
      setVerifying(false)
    }
  }

  async function signOut() {
    try { await getAuthCloud().auth.signOut() } catch { /* 本地会话仍应清掉 */ }
    setUser(null)
    setStep('form')
    setPending(null)
    setRecipient('')
    setCode('')
    setMsg(null)
  }

  const back = location.state?.from || '/'

  return (
    <section className="mx-auto max-w-xl px-4 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="border-b border-cyber-cyan/15 bg-cyber-darker/60 px-5 py-4 font-mono text-xs text-cyber-grid sm:px-7">
          <span className="text-cyber-cyan">$</span> auth --session
          <span className="ml-2 text-cyber-cyan/40">/login</span>
        </div>

        <div className="px-5 py-7 sm:px-7 sm:py-9">
          <div className="mb-7 flex items-start gap-3">
            <div className="rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/10 p-2 text-cyber-cyan">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">访客登录 / 注册</h1>
              <p className="mt-1 text-xs leading-5 text-cyber-grid">
                验证码通过后自动登录；未注册的账号会自动创建，不设置密码。
              </p>
            </div>
          </div>

          {checking ? (
            <div className="flex items-center gap-2 py-10 font-mono text-xs text-cyber-grid">
              <Loader2 className="h-4 w-4 animate-spin text-cyber-cyan" />
              正在恢复会话…
            </div>
          ) : user ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-cyber-cyan/20 bg-cyber-darker/60 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{account}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-cyber-grid">身份已验证</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={back}
                  className="inline-flex items-center gap-2 rounded-lg border border-cyber-cyan/40 bg-cyber-cyan/10 px-4 py-2 text-sm font-mono text-cyber-cyan transition-colors hover:bg-cyber-cyan/20"
                >
                  <ArrowLeft className="h-4 w-4" />
                  返回
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="inline-flex items-center gap-2 rounded-lg border border-cyber-grid/30 px-4 py-2 text-sm font-mono text-cyber-grid transition-colors hover:border-cyber-pink/40 hover:text-cyber-pink"
                >
                  <LogOut className="h-4 w-4" />
                  退出登录
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg border border-cyber-grid/20 bg-cyber-darker/50 p-1">
                <button
                  type="button"
                  onClick={() => switchMode('phone')}
                  className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-mono transition-colors ${mode === 'phone' ? 'bg-cyber-cyan/15 text-cyber-cyan' : 'text-cyber-grid hover:text-white'}`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  手机号
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('email')}
                  className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-mono transition-colors ${mode === 'email' ? 'bg-cyber-cyan/15 text-cyber-cyan' : 'text-cyber-grid hover:text-white'}`}
                >
                  <Mail className="h-3.5 w-3.5" />
                  邮箱
                </button>
              </div>

              <form onSubmit={step === 'form' ? sendCode : verify} className="space-y-4">
                <div>
                  <label htmlFor="login-recipient" className="mb-1.5 block font-mono text-[11px] text-cyber-grid">
                    {mode === 'phone' ? '手机号' : '邮箱地址'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="login-recipient"
                      value={recipient}
                      onChange={(e) => onRecipient(e.target.value.trim())}
                      inputMode={mode === 'phone' ? 'tel' : 'email'}
                      autoComplete={mode === 'phone' ? 'tel' : 'email'}
                      placeholder={mode === 'phone' ? '11 位手机号' : 'name@example.com'}
                      className="min-w-0 flex-1 rounded-lg border border-cyber-grid/30 bg-cyber-darker/60 px-3 py-2.5 text-sm text-cyber-cyan outline-none placeholder:text-cyber-grid/50 focus:border-cyber-cyan/50"
                    />
                    <button
                      type="button"
                      onClick={sendCode}
                      disabled={sending || cooldown > 0 || !turnstileEnabled}
                      className="shrink-0 rounded-lg border border-cyber-cyan/40 bg-cyber-cyan/10 px-3 py-2 text-xs font-mono text-cyber-cyan transition-colors hover:bg-cyber-cyan/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : cooldown > 0 ? `${cooldown}s` : '获取验证码'}
                    </button>
                  </div>
                </div>

                {step === 'code' && (
                  <div>
                    <label htmlFor="login-code" className="mb-1.5 block font-mono text-[11px] text-cyber-grid">
                      验证码
                    </label>
                    <div className="relative">
                      <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyber-grid/60" />
                      <input
                        id="login-code"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\s/g, ''))}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={8}
                        placeholder="输入收到的验证码"
                        className="w-full rounded-lg border border-cyber-grid/30 bg-cyber-darker/60 py-2.5 pl-10 pr-3 text-sm tracking-[0.2em] text-cyber-cyan outline-none placeholder:tracking-normal placeholder:text-cyber-grid/50 focus:border-cyber-cyan/50"
                      />
                    </div>
                  </div>
                )}

                <TurnstileBox ref={tsRef} onToken={setTsToken} />

                {!turnstileEnabled && (
                  <p className="rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2 font-mono text-[11px] leading-5 text-amber-200/80">
                    Cloudflare Turnstile 尚未配置：请设置 <code>VITE_TURNSTILE_SITE_KEY</code>，并在中转设置 <code>TURNSTILE_SECRET</code> 后再登录。
                  </p>
                )}

                {step === 'code' && (
                  <button
                    type="submit"
                    disabled={verifying || sending || !turnstileEnabled}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-cyber-cyan/50 bg-cyber-cyan/10 px-4 py-2.5 text-sm font-mono text-cyber-cyan transition-colors hover:bg-cyber-cyan/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                    {verifying ? '验证中…' : '验证并登录 / 注册'}
                  </button>
                )}
              </form>

              {msg && (
                <div
                  role={msg.type === 'ok' ? 'status' : 'alert'}
                  aria-live={msg.type === 'ok' ? 'polite' : 'assertive'}
                  className={`mt-4 rounded-lg border px-3 py-2 text-xs font-mono ${msg.type === 'ok' ? 'border-emerald-400/25 bg-emerald-400/5 text-emerald-200' : 'border-cyber-pink/25 bg-cyber-pink/5 text-cyber-pink'}`}
                >
                  {msg.text}
                </div>
              )}

              <p className="mt-5 text-center font-mono text-[10px] leading-5 text-cyber-grid/50">
                登录即表示同意本站的公开留言规则 · 不收集密码
              </p>
            </>
          )}

          <div className="mt-7 flex items-center justify-between border-t border-cyber-grid/10 pt-4">
            <button
              type="button"
              onClick={() => navigate(back)}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cyber-grid transition-colors hover:text-cyber-cyan"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              返回上一页
            </button>
            <Link to="/" className="font-mono text-[11px] text-cyber-grid transition-colors hover:text-cyber-cyan">
              回到首页
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
