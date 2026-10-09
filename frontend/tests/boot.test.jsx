import { test, expect, afterEach, vi } from 'vitest'
import { shouldShowBoot } from '../src/App.jsx'

/**
 * 开场动画（boot screen）的播放规则 —— 2026-10-09 主人要求「每次打开都播」。
 *
 * 三道判定，优先级从高到低：
 *   ① ?boot=1 / #boot  → 强制播放（可覆盖无障碍设置，给"想看但系统关了动画"的情况）
 *   ② prefers-reduced-motion: reduce → 跳过（无障碍，不能被站点偏好覆盖）
 *   ③ 其余情况 → 播放
 *
 * 原来还有"每天只播一次"（localStorage 记日期），已按主人要求移除，
 * 这里补一条断言防止它被无意间加回来。
 */

const setUrl = (u) => window.history.replaceState({}, '', u)

const setReducedMotion = (reduce) => {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: reduce && /prefers-reduced-motion/.test(query),
    media: query,
    onchange: null,
    addListener() {}, removeListener() {},
    addEventListener() {}, removeEventListener() {},
    dispatchEvent() { return false },
  }))
}

afterEach(() => {
  setUrl('/')
  localStorage.clear()
})

test('默认每次打开都播（不再有"每天一次"的限制）', () => {
  setReducedMotion(false)
  setUrl('/')
  expect(shouldShowBoot()).toBe(true)

  // 连着判断两次、且中间夹一次"模拟今天已经播过"的写入，仍应为 true
  localStorage.setItem('ctf-blog-boot-date', new Date().toDateString())
  expect(shouldShowBoot()).toBe(true)
})

test('系统开了「减少动态效果」时跳过（无障碍优先）', () => {
  setReducedMotion(true)
  setUrl('/')
  expect(shouldShowBoot()).toBe(false)
})

test('?boot=1 可以强制播放，即使系统关了动画', () => {
  setReducedMotion(true)
  setUrl('/?boot=1')
  expect(shouldShowBoot()).toBe(true)
})
