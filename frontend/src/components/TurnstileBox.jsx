import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

/**
 * Cloudflare Turnstile 人机校验挂件（留言板 / 评论区共用）。
 *
 * 为什么需要它：关键词过滤只能挡"已知的词"，机器人换个写法就绕过去了；
 * CAPTCHA 挡的是**机器人本身**。两者叠加才是完整的防线
 * （服务端关键词+规则见 db/moderation.sql，这里挡的是自动化提交）。
 *
 * ── 配置 ────────────────────────────────────────────────────────────────
 * 需要一个 site key（公开的，放前端）：
 *   构建时设 VITE_TURNSTILE_SITE_KEY=<你的 site key>
 * 同时 Worker 那边要配对应的 secret：
 *   cd frontend/cloudflare && wrangler secret put TURNSTILE_SECRET
 * **两边必须一起配**：只配前端不配 Worker → 校验被跳过（不报错但不设防）；
 * 只配 Worker 不配前端 → 访客拿不到 token，写操作会全部 403。
 *
 * 没配 site key 时本组件**整体不渲染**，页面看起来和以前一模一样 ——
 * 这样站点不会因为"还没去注册 Cloudflare"就崩掉。
 *
 * ── 用法 ────────────────────────────────────────────────────────────────
 *   const tsRef = useRef(null)
 *   const [tsToken, setTsToken] = useState('')
 *   ...
 *   <TurnstileBox ref={tsRef} onToken={setTsToken} />
 *   提交时：turnstileEnabled && !tsToken → 提示用户先过校验
 *          把 token 通过 setHeader('x-turnstile-token', tsToken) 带给 Worker
 *   提交后：tsRef.current?.reset()（token 是一次性的，必须重置）
 */

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/** 是否启用了人机校验（前端侧）。没配就整个不渲染、也不发 token。 */
export const turnstileEnabled = !!SITE_KEY

let scriptPromise = null

function loadScript() {
  if (!SITE_KEY) return Promise.resolve(null)
  if (typeof window !== 'undefined' && window.turnstile) return Promise.resolve(window.turnstile)
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve(window.turnstile)
    s.onerror = () => reject(new Error('turnstile script load failed'))
    document.head.appendChild(s)
  })
  return scriptPromise
}

const TurnstileBox = forwardRef(function TurnstileBox({ onToken }, ref) {
  const boxRef = useRef(null)
  const widgetId = useRef(null)
  // 用 ref 存回调，避免父组件每次渲染传新函数导致 effect 重跑、挂件被重复渲染
  const cbRef = useRef(onToken)
  const [failed, setFailed] = useState(false)

  useEffect(() => { cbRef.current = onToken }, [onToken])

  useEffect(() => {
    if (!SITE_KEY) return
    let alive = true

    loadScript()
      .then((ts) => {
        if (!alive || !ts || !boxRef.current || widgetId.current !== null) return
        widgetId.current = ts.render(boxRef.current, {
          sitekey: SITE_KEY,
          theme: 'dark',
          size: 'flexible',
          callback: (token) => cbRef.current?.(token),
          'expired-callback': () => cbRef.current?.(''),
          'timeout-callback': () => cbRef.current?.(''),
          'error-callback': () => { setFailed(true); cbRef.current?.('') },
        })
      })
      .catch(() => {
        if (!alive) return
        setFailed(true)
        cbRef.current?.('')
      })

    return () => { alive = false }
  }, [])

  useImperativeHandle(ref, () => ({
    /** 重新校验并清空 token（token 一次性，提交后必须调用） */
    reset() {
      cbRef.current?.('')
      const ts = typeof window !== 'undefined' && window.turnstile
      if (ts && widgetId.current !== null) ts.reset(widgetId.current)
    },
  }), [])

  if (!SITE_KEY) return null

  return (
    <div>
      <div ref={boxRef} />
      {failed && (
        <p className="mt-1 text-[11px] font-mono text-cyber-pink/80">
          人机校验加载失败（可能被网络拦截）。刷新页面重试，或稍后再留言。
        </p>
      )}
    </div>
  )
})

export default TurnstileBox
