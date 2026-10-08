#!/usr/bin/env node
/**
 * 静态检查：JSX / JS 里「引用了但从未定义」的裸标识符。
 *
 * 为什么需要它：
 *   Home.jsx 曾写 `platformNames[platform].label` 却忘了 import，
 *   打包器不会因此报错（它当成全局变量），本地又恰好和 Challenges 同作用域而"能跑"，
 *   直到分包边界一变，线上直接 ReferenceError → 首页对所有人白屏。
 *   这类 bug 的代价极高、发生时又极隐蔽，所以用静态检查在前面拦住。
 *
 * 做法：esbuild 把 JSX 转成普通 JS（不打包，保留裸标识符）→ acorn 解析成 AST
 *      → 收集「全文件已声明的名字」→ 找出所有真正是"引用"的 Identifier
 *      → 差集里不在白名单中的，即为疑似未定义。
 *
 * 退出码非 0 表示发现问题（可直接挂进 CI）。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { transform } from 'esbuild'
import { parse } from 'acorn'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const SRC = join(ROOT, 'src')

// 浏览器 / Node / JS 内置 —— 引用它们是正常的
const GLOBALS = new Set([
  // JS 内置
  'undefined', 'NaN', 'Infinity', 'globalThis', 'eval',
  'Object', 'Function', 'Boolean', 'Symbol', 'Error', 'EvalError', 'RangeError',
  'ReferenceError', 'SyntaxError', 'TypeError', 'URIError', 'AggregateError',
  'Number', 'BigInt', 'Math', 'Date', 'String', 'RegExp', 'Array', 'Int8Array',
  'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array',
  'Uint32Array', 'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array',
  'Map', 'Set', 'WeakMap', 'WeakSet', 'WeakRef', 'ArrayBuffer', 'SharedArrayBuffer',
  'Atomics', 'DataView', 'JSON', 'Promise', 'Reflect', 'Proxy', 'Intl',
  'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'decodeURI', 'decodeURIComponent',
  'encodeURI', 'encodeURIComponent', 'escape', 'unescape',
  'Iterator', 'AsyncFunction', 'GeneratorFunction', 'FinalizationRegistry',
  // 定时器 / 调度
  'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'queueMicrotask',
  'requestAnimationFrame', 'cancelAnimationFrame', 'requestIdleCallback',
  'cancelIdleCallback', 'setImmediate', 'clearImmediate', 'structuredClone',
  // 浏览器
  'window', 'self', 'document', 'navigator', 'location', 'history', 'screen',
  'frames', 'parent', 'top', 'opener', 'closed', 'name', 'status',
  'localStorage', 'sessionStorage', 'indexedDB', 'caches', 'cookieStore',
  'console', 'performance', 'crypto', 'fetch', 'Request', 'Response', 'Headers',
  'XMLHttpRequest', 'WebSocket', 'EventSource', 'Worker', 'SharedWorker',
  'URL', 'URLSearchParams', 'Blob', 'File', 'FileReader', 'FileList',
  'FormData', 'TextEncoder', 'TextDecoder', 'AbortController', 'AbortSignal',
  'Image', 'Audio', 'Video', 'Option', 'HTMLElement', 'Node', 'Element',
  'Event', 'CustomEvent', 'MouseEvent', 'KeyboardEvent', 'PointerEvent',
  'TouchEvent', 'WheelEvent', 'InputEvent', 'DragEvent', 'ClipboardEvent',
  'MutationObserver', 'IntersectionObserver', 'ResizeObserver', 'PerformanceObserver',
  'getComputedStyle', 'matchMedia', 'scrollTo', 'scrollBy', 'open', 'close',
  'alert', 'confirm', 'prompt', 'print', 'focus', 'blur', 'atob', 'btoa',
  'requestAnimationFrame', 'CSS', 'DOMParser', 'NodeFilter', 'Range',
  'Notification', 'Geolocation', 'speechSynthesis', 'visualViewport',
  'addEventListener', 'removeEventListener', 'dispatchEvent', 'postMessage',
  'devicePixelRatio', 'innerWidth', 'innerHeight', 'outerWidth', 'outerHeight',
  'pageXOffset', 'pageYOffset', 'scrollX', 'scrollY', 'isSecureContext',
  'structuredClone', 'reportError', 'atob', 'btoa',
  // Node / 构建时
  'process', 'global', 'Buffer', 'require', 'module', 'exports', '__dirname',
  '__filename', 'URL', 'TextEncoder', 'TextDecoder', 'fetch',
  'importMeta', 'React',
])

const SKIP_DIR = new Set(['node_modules', 'dist', '.git', '__snapshots__'])
const EXTS = ['.js', '.jsx']

function walkFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR.has(name)) continue
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walkFiles(p, out)
    else if (EXTS.some(e => name.endsWith(e))) out.push(p)
  }
  return out
}

/** 通用 AST 遍历，回调拿到 (node, parent, key) */
function walk(node, parent, key, visit) {
  if (!node || typeof node.type !== 'string') return
  visit(node, parent, key)
  for (const k of Object.keys(node)) {
    if (k === '__parent') continue
    const v = node[k]
    if (Array.isArray(v)) {
      for (const c of v) {
        if (c && typeof c === 'object' && typeof c.type === 'string') walk(c, node, k, visit)
      }
    } else if (v && typeof v === 'object' && typeof v.type === 'string') {
      walk(v, node, k, visit)
    }
  }
}

/** 收集解构 / 参数等绑定位置上的名字，并把它们标进 bound（这些 Identifier 不是"引用"） */
function collectPattern(node, bound, declared) {
  if (!node) return
  bound.add(node)
  switch (node.type) {
    case 'Identifier':
      declared.add(node.name)
      return
    case 'ObjectPattern':
      for (const p of node.properties) {
        if (p.type === 'RestElement') collectPattern(p.argument, bound, declared)
        else if (p.shorthand) { bound.add(p); bound.add(p.key); declared.add(p.key.name) }
        else collectPattern(p.value, bound, declared)
      }
      return
    case 'ArrayPattern':
      for (const el of node.elements) collectPattern(el, bound, declared)
      return
    case 'AssignmentPattern':
      collectPattern(node.left, bound, declared)   // 右侧默认值是真实引用，不标记
      return
    case 'RestElement':
      collectPattern(node.argument, bound, declared)
      return
    default:
      return
  }
}

function isNonReference(node, parent) {
  if (!parent) return true
  switch (parent.type) {
    case 'MemberExpression':
      return parent.property === node && !parent.computed
    case 'Property':
      return parent.key === node && !parent.computed && !parent.shorthand
    case 'MethodDefinition':
    case 'PropertyDefinition':
      return parent.key === node && !parent.computed
    case 'LabeledStatement':
      return parent.label === node
    case 'BreakStatement':
    case 'ContinueStatement':
      return parent.label === node
    case 'ImportDeclaration':
    case 'ImportSpecifier':
    case 'ImportDefaultSpecifier':
    case 'ImportNamespaceSpecifier':
      return true
    // import.meta → meta / property 都是语法关键字，不是引用
    case 'MetaProperty':
      return true
    default:
      return false
  }
}

async function checkFile(file) {
  const code = readFileSync(file, 'utf8')
  let js
  try {
    js = (await transform(code, { loader: 'jsx', jsx: 'automatic', format: 'esm', target: 'esnext' })).code
  } catch (e) {
    return { file, problems: [], skipped: `esbuild: ${e.message.split('\n')[0]}` }
  }
  let ast
  try {
    ast = parse(js, {
      ecmaVersion: 'latest',
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
      locations: true,
    })
  } catch (e) {
    return { file, problems: [], skipped: `acorn: ${e.message.split('\n')[0]}` }
  }

  const declared = new Set()
  const bound = new Set()

  // 第一遍：收集所有声明的名字
  walk(ast, null, null, (n) => {
    switch (n.type) {
      case 'VariableDeclarator': collectPattern(n.id, bound, declared); break
      case 'FunctionDeclaration':
      case 'FunctionExpression':
        if (n.id) { declared.add(n.id.name); bound.add(n.id) }
        for (const p of n.params) collectPattern(p, bound, declared)
        break
      case 'ArrowFunctionExpression':
        for (const p of n.params) collectPattern(p, bound, declared)
        break
      case 'ClassDeclaration':
      case 'ClassExpression':
        if (n.id) { declared.add(n.id.name); bound.add(n.id) }
        break
      case 'CatchClause':
        collectPattern(n.param, bound, declared)
        break
      case 'ImportDeclaration':
        for (const s of n.specifiers) { declared.add(s.local.name); bound.add(s.local) }
        break
      // export { x as y }：y（exported）永远只是"对外名字"，不是引用；
      // 只有存在 source 时 x（local）才是"再导出"、同样不是本地引用。
      case 'ExportNamedDeclaration':
      case 'ExportAllDeclaration':
        for (const s of n.specifiers || []) {
          if (s.exported) bound.add(s.exported)
          if (n.source && s.local) bound.add(s.local)
        }
        break
      default: break
    }
  })

  // 第二遍：找出所有"真正是引用"的标识符
  const problems = []
  const seen = new Map()
  walk(ast, null, null, (n, parent) => {
    if (n.type !== 'Identifier') return
    if (bound.has(n)) return
    if (isNonReference(n, parent)) return
    if (declared.has(n.name) || GLOBALS.has(n.name)) return
    if (!seen.has(n.name)) seen.set(n.name, n.loc?.start?.line ?? 0)
  })
  for (const [name, line] of seen) {
    const rel = relative(ROOT, file).replace(/\\/g, '/')
    problems.push({ name, line, where: `${rel}:${line}` })
  }
  return { file, problems }
}

const files = walkFiles(SRC)
const skipped = []
let total = 0
for (const f of files) {
  const { problems, skipped: s } = await checkFile(f)
  if (s) skipped.push(`${relative(ROOT, f).replace(/\\/g, '/')} (${s})`)
  for (const p of problems) {
    console.error(`\x1b[31m✗ ${p.where}\x1b[0m  未定义标识符: \x1b[33m${p.name}\x1b[0m`)
    total++
  }
}

if (skipped.length) {
  console.warn(`\x1b[33m⚠ 跳过了 ${skipped.length} 个无法解析的文件：\x1b[0m`)
  for (const s of skipped) console.warn(`   ${s}`)
}

if (total) {
  console.error(`\n\x1b[31mcheck-undef 失败：${total} 个疑似未定义的标识符\x1b[0m`)
  process.exit(1)
}
console.log(`\x1b[32m✓ check-undef 通过：扫描 ${files.length} 个源文件，未发现未定义标识符\x1b[0m`)
