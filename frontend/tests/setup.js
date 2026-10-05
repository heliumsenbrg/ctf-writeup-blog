// jsdom 缺失的浏览器 API 垫片（framer-motion 等按需探测）
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// vitest 未开启 globals，RTL 自动清理不生效 —— 显式清理，避免用例间 DOM 残留
afterEach(() => { cleanup() })

if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = (query) => ({
      matches: false, media: query, onchange: null,
      addListener() {}, removeListener() {},
      addEventListener() {}, removeEventListener() {},
      dispatchEvent() { return false },
    })
  }
  if (!window.IntersectionObserver) {
    window.IntersectionObserver = class {
      observe() {} unobserve() {} disconnect() {}
    }
  }
}
