import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'katex/dist/katex.min.css'   // 数学公式（remark-math + rehype-katex 的配套样式）

/**
 * 部署后自愈：GitHub Pages 的 HTML 有缓存，用户可能拿着**旧入口包**去加载**新部署的懒加载分包**，
 * 此时分包名（带哈希）已经变了 → 动态 import 404 → 页面被 ErrorBoundary 兜住显示"渲染出错"。
 * 这不是代码错，是"旧 HTML + 新哈希"的必然结果，硬刷新能好 —— 但访客不会知道要硬刷新。
 *
 * Vite 遇到模块预加载失败会派发官方事件 `vite:preloadError`，这里接住它并自动刷新一次；
 * 用 sessionStorage 记录，避免刷新风暴（同一会话只自动刷新一次）。
 */
window.addEventListener('vite:preloadError', () => {
  try {
    if (sessionStorage.getItem('preload-reloaded')) return
    sessionStorage.setItem('preload-reloaded', '1')
  } catch {
    // 隐私模式下 sessionStorage 不可用，那就只刷新不记状态
  }
  window.location.reload()
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

/**
 * 动画兜底：页面内容用 framer-motion 的 initial opacity:0 入场，
 * 一旦动画没跑起来（旧设备 / 系统开了"减弱动态效果" / 动画被拦截），
 * 内容会停在透明状态 —— 深色底上看起来就是**整页纯黑**，用户以为站点挂了。
 * 这里在 1.5 秒后检查一遍：仍然不可见的就强制显形。
 */
setTimeout(() => {
  document.querySelectorAll('#root [style*="opacity"]').forEach((el) => {
    if (getComputedStyle(el).opacity === '0') el.style.opacity = '1'
  })
}, 1500)
