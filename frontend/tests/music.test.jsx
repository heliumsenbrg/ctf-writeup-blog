import { test, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import MusicPlayer from '../src/components/MusicPlayer.jsx'
import { musicTracks } from '../src/data/music.js'

/**
 * 背景音乐播放器的契约（2026-10-13 按主人要求从"默认静音"改成"自动放"）。
 *
 * 浏览器不允许**零交互就出声**，所以"自动放"的实际实现是：
 *   挂载先直接试一次 play() → 被拦就把播放挂到第一次真实交互上。
 * 下面这几条正是这个策略的骨架，改坏了就是"打开没音乐"：
 *   · 默认会尝试播放（不再等用户点按钮）
 *   · 被拦下后，第一次交互（点击/滚动/按键…）能接上
 *   · 使用者**明确关掉过**就不该再自动放（尊重选择）
 *   · 首次响起来时弹一次提示，告诉使用者按钮在哪
 *   · 曲目路径必须由 BASE_URL 拼（三种部署形态 base 不同，写死会 404）
 */

let playMock
let pauseMock

beforeEach(() => {
  localStorage.clear()
  // jsdom 没实现 HTMLMediaElement.play/pause，会直接抛 "Not implemented"
  playMock = vi.fn().mockResolvedValue(undefined)
  pauseMock = vi.fn()
  window.HTMLMediaElement.prototype.play = playMock
  window.HTMLMediaElement.prototype.pause = pauseMock
})

test('audio 元素：不预加载、循环、且不依赖浏览器原生 autoplay 属性', () => {
  const { container } = render(<MusicPlayer />)
  const audio = container.querySelector('audio')

  expect(audio).toBeTruthy()
  expect(audio.getAttribute('preload')).toBe('none')   // 没开始放之前不下那 430KB
  expect(audio.loop).toBe(true)
  // 靠 JS 在手势里调 play()，不用原生 autoplay（它几乎必被拦）
  expect(audio.hasAttribute('autoplay')).toBe(false)
})

test('默认就会尝试播放（不再需要先点按钮）', async () => {
  render(<MusicPlayer />)
  await vi.waitFor(() => expect(playMock).toHaveBeenCalled())
})

/**
 * 等到"等待手势"的监听真的挂上再派发事件。
 *
 * 不能只 waitFor(play 被调用过) —— 那次 play() 被拒后，挂监听的 .catch()
 * 是在**下一个微任务**里跑的，waitFor 可能先返回，事件就派发到空气上了（我踩过）。
 * 所以这里直接观察 addEventListener 的调用，确定监听已就位。
 */
async function waitGestureArmed(addSpy, name) {
  await vi.waitFor(() => {
    expect(addSpy.mock.calls.some((c) => c[0] === name)).toBe(true)
  })
}

test('被自动播放策略拦下时，第一次交互能接上播放', async () => {
  const addSpy = vi.spyOn(window, 'addEventListener')
  playMock.mockRejectedValue(new Error('NotAllowedError'))   // 浏览器拦了
  render(<MusicPlayer />)

  await vi.waitFor(() => expect(playMock).toHaveBeenCalledTimes(1))
  await waitGestureArmed(addSpy, 'pointerdown')

  // 现在模拟"用户动了一下"
  playMock.mockResolvedValue(undefined)
  await act(async () => { window.dispatchEvent(new Event('pointerdown')) })

  await vi.waitFor(() => expect(playMock.mock.calls.length).toBeGreaterThan(1))
  addSpy.mockRestore()
})

test('滚动也能触发接上（不只点击一种手势）', async () => {
  const addSpy = vi.spyOn(window, 'addEventListener')
  playMock.mockRejectedValue(new Error('NotAllowedError'))
  render(<MusicPlayer />)

  await vi.waitFor(() => expect(playMock).toHaveBeenCalledTimes(1))
  await waitGestureArmed(addSpy, 'scroll')

  playMock.mockResolvedValue(undefined)
  await act(async () => { window.dispatchEvent(new Event('scroll')) })
  await vi.waitFor(() => expect(playMock.mock.calls.length).toBeGreaterThan(1))
  addSpy.mockRestore()
})

test('使用者明确关掉过（bgm:enabled=0）就不再自动播放', async () => {
  localStorage.setItem('bgm:enabled', '0')
  render(<MusicPlayer />)
  // 给 effect 足够时间跑完
  await act(async () => { await new Promise((r) => setTimeout(r, 60)) })
  expect(playMock).not.toHaveBeenCalled()
})

test('首次响起来时弹一次提示气泡', async () => {
  render(<MusicPlayer />)
  await vi.waitFor(() => {
    expect(screen.queryByText(/背景音乐已开启/)).toBeTruthy()
  })
  // 只弹一次：记进 localStorage
  expect(localStorage.getItem('bgm:hint-shown')).toBe('1')
})

test('点击按钮能暂停，并把"关掉"记进 localStorage', async () => {
  render(<MusicPlayer />)
  const btn = await screen.findByRole('button', { name: '暂停背景音乐' })

  await act(async () => { btn.click() })
  await vi.waitFor(() => {
    expect(pauseMock).toHaveBeenCalled()
    expect(localStorage.getItem('bgm:enabled')).toBe('0')
  })
  expect(screen.getByRole('button', { name: '播放背景音乐' })).toBeTruthy()
})

test('曲目路径用 BASE_URL 拼，不能写死根路径', () => {
  // Pages 是 /ctf-writeup-blog/，Vercel 与 WorkBuddy 发布域是 /
  expect(musicTracks.length).toBeGreaterThan(0)
  for (const t of musicTracks) {
    expect(t.src.startsWith(import.meta.env.BASE_URL)).toBe(true)
    expect(t.src).toMatch(/music\/.+\.mp3$/)
  }
})
