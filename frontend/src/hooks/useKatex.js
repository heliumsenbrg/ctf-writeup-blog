import { useEffect, useState } from 'react'

/**
 * KaTeX 按需加载。
 *
 * 为什么值得单独做：`remark-math` + `rehype-katex` 会把整个 KaTeX 拖进渲染链，
 * 2026-11-09 实测那一坨被打进一个 549KB（gzip 171KB）的共享 chunk —— **每个笔记页/题解页
 * 都得先下它才出正文**。本站链路实测约 12KB/s，于是「打开笔记一直转圈」。
 * 绝大多数页面其实没有公式，所以改成：**内容里真的出现 `$…$` / `$$…$$` 才加载**。
 *
 * 注意两个坑：
 * 1. 这里**不能**配 `manualChunks` —— 那会让它回到入口图被预加载，首屏反而变胖
 *    （vite.config.js 里 2026-10-25 已经踩过并写明）。
 * 2. 识别必须**先剥掉代码片段**：反序列化笔记里 `_$$ND_FUNC$$_` 这种字面量会被
 *    `$$...$$` 规则误判成公式（2026-11-09 实测），于是又白下 171KB。
 *    剥离后仍可能漏判个别写法，代价只是公式按原文显示，不会渲染错。
 */
const MATH_RE = /\$\$[\s\S]{1,2000}?\$\$|(^|[^\\$])\$[^$\n]{1,200}\$/

/** 去掉围栏代码块与行内代码：`_$$ND_FUNC$$_` 这类字面量不该算公式 */
function stripCode(content) {
  return String(content || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
}

export function containsMath(content) {
  return MATH_RE.test(stripCode(content))
}

let cached = null
let inflight = null

function loadKatex() {
  if (cached) return Promise.resolve(cached)
  if (!inflight) {
    inflight = Promise.all([import('remark-math'), import('rehype-katex')])
      .then(([m, k]) => {
        cached = { remarkMath: m.default, rehypeKatex: k.default }
        return cached
      })
      .catch(() => null)
  }
  return inflight
}

/**
 * @returns {{ remarkMath: Function, rehypeKatex: Function } | null}
 *   null = 本文没有公式（或还没加载好），调用方据此决定要不要挂这两个插件。
 */
export function useKatex(content) {
  const need = containsMath(content)
  const [plugins, setPlugins] = useState(cached)

  useEffect(() => {
    if (!need || cached) return undefined
    let alive = true
    loadKatex().then((p) => {
      if (alive && p) setPlugins(p)
    })
    return () => {
      alive = false
    }
  }, [need])

  return need ? plugins : null
}
