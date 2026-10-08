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

// ---------------------------------------------------------------------------
// canvas 2D 上下文垫片
// jsdom 不带 canvas 实现，getContext('2d') 返回 null，页面里的粒子/鼠标拖尾/关系图
// 一画就 TypeError → 渲染冒烟测试会假失败（真实浏览器里是好的）。
// 这里给一个"什么方法都能调、什么都不做"的替身。
if (typeof HTMLCanvasElement !== 'undefined') {
  const ctxCache = new WeakMap()
  const makeCtx2D = (canvas) => {
    const target = {
      canvas,
      measureText: () => ({ width: 0, actualBoundingBoxAscent: 0, actualBoundingBoxDescent: 0 }),
      createLinearGradient: () => ({ addColorStop() {} }),
      createRadialGradient: () => ({ addColorStop() {} }),
      createPattern: () => null,
      getImageData: () => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 }),
      putImageData() {},
      createImageData: () => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 }),
      isPointInPath: () => false,
      isPointInStroke: () => false,
    }
    return new Proxy(target, {
      get(t, k) {
        if (k in t) return t[k]
        if (typeof k === 'symbol') return undefined
        // 未知成员一律当成无副作用的绘图方法
        return () => undefined
      },
      set(t, k, v) { t[k] = v; return true },
    })
  }
  HTMLCanvasElement.prototype.getContext = function (type) {
    if (type !== '2d') return null
    if (!ctxCache.has(this)) ctxCache.set(this, makeCtx2D(this))
    return ctxCache.get(this)
  }
  HTMLCanvasElement.prototype.toDataURL = function () { return 'data:image/png;base64,' }
}

// 测试环境不应真发网络请求
if (typeof globalThis.fetch !== 'function' || !globalThis.fetch.__stubbed) {
  const stub = async () => ({ ok: true, status: 200, json: async () => ({}), text: async () => '', headers: new Map() })
  stub.__stubbed = true
  globalThis.fetch = stub
}
