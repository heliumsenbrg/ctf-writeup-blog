import { test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import MusicPlayer from '../src/components/MusicPlayer.jsx'
import { musicTracks } from '../src/data/music.js'

/**
 * 背景音乐播放器的契约：
 *   · 默认**不自动播放**（突发声音很冒犯访客，浏览器也拦）
 *   · preload="none" —— 不点就不下载那几百 KB
 *   · 曲目路径必须由 BASE_URL 拼（站点三种部署形态 base 不同，写死会 404）
 */

beforeEach(() => {
  localStorage.clear()
  // jsdom 没实现 HTMLMediaElement.play / pause，会直接抛 "Not implemented"
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
  window.HTMLMediaElement.prototype.pause = vi.fn()
})

test('默认不自动播放、不预加载，且循环', () => {
  const { container } = render(<MusicPlayer />)
  const audio = container.querySelector('audio')

  expect(audio).toBeTruthy()
  expect(audio.hasAttribute('autoplay')).toBe(false)
  expect(audio.getAttribute('preload')).toBe('none')
  expect(audio.loop).toBe(true)

  // 初始按钮语义是"播放"，不是"暂停"
  expect(screen.getByRole('button', { name: '播放背景音乐' })).toBeTruthy()
})

test('曲目路径用 BASE_URL 拼，不能写死根路径', () => {
  // 站点在 GitHub Pages 上是 /ctf-writeup-blog/，在 Vercel / WorkBuddy 发布域是 /
  // 写死 '/music/...' 会让其中两种部署直接 404
  expect(musicTracks.length).toBeGreaterThan(0)
  for (const t of musicTracks) {
    expect(t.src.startsWith(import.meta.env.BASE_URL)).toBe(true)
    expect(t.src).toMatch(/music\/.+\.mp3$/)
  }
})

test('有点击手势才播放，并把开关记进 localStorage', async () => {
  render(<MusicPlayer />)
  const btn = screen.getByRole('button', { name: '播放背景音乐' })
  btn.click()

  // 点击后应调用 play()（真实浏览器里这才会出声）
  await vi.waitFor(() => {
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled()
  })
  await vi.waitFor(() => {
    expect(localStorage.getItem('bgm:enabled')).toBe('1')
  })
})
