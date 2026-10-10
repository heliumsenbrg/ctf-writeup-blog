import { test, expect } from 'vitest'
import { render } from '@testing-library/react'
import TurnstileBox, { turnstileEnabled } from '../src/components/TurnstileBox.jsx'

/**
 * Turnstile 挂件在**未配置**时的行为至关重要：
 * 站点不能因为"所有者还没去注册 Cloudflare"就崩掉或让留言发不出去。
 * 所以没配 VITE_TURNSTILE_SITE_KEY 时：不渲染、不加载外部脚本、不要求 token。
 * （配好之后的真实校验链路在 tests/cloud-proxy.test.jsx 里覆盖。）
 */

test('未配置 site key 时不渲染任何东西，也不注入外部脚本', () => {
  expect(turnstileEnabled).toBe(false)

  const before = document.querySelectorAll('script').length
  const { container } = render(<TurnstileBox onToken={() => {}} />)

  expect(container.innerHTML).toBe('')
  expect(document.querySelectorAll('script').length).toBe(before)
})

test('未配置时 reset() 可安全调用（父组件无条件调用它）', () => {
  const ref = { current: null }
  render(<TurnstileBox ref={ref} onToken={() => {}} />)
  // 组件没渲染时 ref 为 null —— 父组件用的是 ref.current?.reset()，必须不抛
  expect(() => ref.current?.reset()).not.toThrow()
})
