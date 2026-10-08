#!/usr/bin/env node
/**
 * 首屏体积预算（构建后自动跑，见 package.json 的 postbuild）：
 *   node scripts/check-size.mjs
 *
 * 为什么需要：这个站曾出现「入口包 853KB（gzip 263KB）」的回归 ——
 * 原因是几个页面写成静态导入，把云 SDK + markdown + KaTeX 全拽进了首屏，
 * 慢网手机打开就是长时间黑屏。数字一旦悄悄涨回去，光看构建日志发现不了。
 *
 * 只统计**首屏真正要下的**：入口 js + HTML 里 preload 的 chunk + 入口 css。
 * 阈值留了约 2 倍余量，只拦"结构性回归"，不拦正常波动。
 */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')

const LIMITS = {
  entryGzip: 120 * 1024, // 入口 js（gzip）
  firstPaintGzip: 220 * 1024, // 入口 js + preload chunk + css（gzip）
}

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.log('[size] 没有 dist/index.html，跳过（先构建）')
  process.exit(0)
}

const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
const grab = (re) => [...html.matchAll(re)].map((m) => m[1])
const entry = grab(/<script[^>]*src="[^"]*?(\/assets\/[^"]+\.js)"/g)
const preload = grab(/<link rel="modulepreload"[^>]*href="[^"]*?(\/assets\/[^"]+\.js)"/g)
const css = grab(/<link rel="stylesheet"[^>]*href="[^"]*?(\/assets\/[^"]+\.css)"/g)

const gz = (rel) => {
  const p = path.join(DIST, rel.replace(/^\//, ''))
  if (!fs.existsSync(p)) return 0
  return zlib.gzipSync(fs.readFileSync(p)).length
}

const entryBytes = entry.reduce((s, f) => s + gz(f), 0)
const firstPaintBytes = [...entry, ...preload, ...css].reduce((s, f) => s + gz(f), 0)
const kb = (n) => (n / 1024).toFixed(1) + ' KB'

const problems = []
if (entryBytes > LIMITS.entryGzip) {
  problems.push(`入口包 ${kb(entryBytes)} > 预算 ${kb(LIMITS.entryGzip)}（是不是又把页面写成静态导入了？）`)
}
if (firstPaintBytes > LIMITS.firstPaintGzip) {
  problems.push(`首屏合计 ${kb(firstPaintBytes)} > 预算 ${kb(LIMITS.firstPaintGzip)}`)
}

console.log(`[size] 入口包 ${kb(entryBytes)} · 首屏合计 ${kb(firstPaintBytes)}（gzip，含 ${entry.length + preload.length + css.length} 个文件）`)

if (problems.length) {
  console.error('[size] ✗ 超出预算：')
  for (const p of problems) console.error('  - ' + p)
  process.exit(1)
}
console.log('[size] ✓ 体积在预算内')
