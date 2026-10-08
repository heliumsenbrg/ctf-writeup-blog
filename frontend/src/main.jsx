import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'katex/dist/katex.min.css'   // 数学公式（remark-math + rehype-katex 的配套样式）

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
