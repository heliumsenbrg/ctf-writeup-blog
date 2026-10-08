#!/usr/bin/env node
/**
 * 赛事合规盘查（**不拦截构建**，只出清单）：
 *   node scripts/audit-flags.mjs
 *
 * 背景：外部审计的 A-5 指出「真实 flag 与在役靶机地址公开」。
 * 这是真实存在的风险 —— 若对应赛事尚未归档，公开 flag 可能违反赛事规则、甚至被取消成绩。
 * 但"哪些赛事已经可以公开"只有作者本人知道，脚本无权替你决定，所以它**只盘查、不修改**。
 *
 * 每次 `npm run check` 都会跑它。清单变长了就说明你在往公开站点里加新的真实 flag，
 * 那时回来对着这张表过一遍"这个赛事归档了吗"即可。
 *
 * 想给某篇文章开绿灯（确认已归档、可以公开），在 `scripts/flags-allowlist.json`
 * 里写上文章 id 即可，它会从"待确认"里移出去。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { articles } from '../src/data/articles.js'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ALLOW_PATH = path.join(HERE, 'flags-allowlist.json')

let allow = {}
try {
  allow = JSON.parse(fs.readFileSync(ALLOW_PATH, 'utf8'))
} catch {
  /* 没有就是空名单 */
}
const allowed = new Set(Object.keys(allow).filter((k) => allow[k]))

// 真实 flag：形如 flag{...} / ctfshow{...} / ISCC{...}，且长度像真值（排除 flag{...} 这种教学占位）
const FLAG_RE = /(?:flag|ctfshow|ISCC|0xGame|MoeCTF|DASCTF|NewStar|CTF)\{[^}\n]{6,}\}/g
// 疑似密钥/口令明文：`JWT 密钥: xxx`、`secret = xxx`（允许中间夹 ** 与反引号）
// 值必须**含大写或数字**，否则会把 `jwt.encode` 这种函数名当成密钥（踩过）
const SECRET_RE = /(?:密钥|secret|SECRET|token|Token|api[_-]?key)\s*\*{0,2}\s*[:：=]\s*`?\s*((?=[A-Za-z0-9#!@_+./-]*[A-Z0-9])[A-Za-z0-9#!@_+./-]{8,})(?!\s*\()/g
// 公网地址（排除本机 / 内网 —— 注意排除项不能带尾随 \d，否则 127.0.0.1 反而漏过）
const IP_RE = /\b(?!127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?/g

const uniq = (a) => [...new Set(a)]
const rows = []

for (const [id, a] of Object.entries(articles)) {
  const c = a.content || ''
  const flags = uniq([...c.matchAll(FLAG_RE)].map((m) => m[0]))
  const secrets = uniq([...c.matchAll(SECRET_RE)].map((m) => m[1]))
  const ips = uniq([...c.matchAll(IP_RE)].map((m) => m[0]))
  if (flags.length || secrets.length || ips.length) {
    rows.push({ id, flags, secrets, ips, ok: allowed.has(id) })
  }
}

const pending = rows.filter((r) => !r.ok)
const nFlags = pending.reduce((s, r) => s + r.flags.length, 0)
const nSecrets = pending.reduce((s, r) => s + r.secrets.length, 0)
const nIps = pending.reduce((s, r) => s + r.ips.length, 0)

console.log(`✓ 赛事合规盘查：${rows.length} 篇文章含真实 flag / 密钥 / 公网地址`)
if (!rows.length) process.exit(0)

if (nFlags + nSecrets + nIps) {
  console.log(`  ⚠ 其中 ${pending.length} 篇**尚未确认赛事是否已归档**：`)
  for (const r of pending) {
    const parts = []
    if (r.flags.length) parts.push(`flag ×${r.flags.length}`)
    if (r.secrets.length) parts.push(`密钥 ×${r.secrets.length}`)
    if (r.ips.length) parts.push(`公网地址 ×${r.ips.length}`)
    console.log(`    · ${r.id.padEnd(26)} ${parts.join(' · ')}`)
    // 密钥明文风险最高：它不是"解出来的 flag"，而是题目本身的签名/校验密钥
    for (const s of r.secrets) console.log(`        ⚑ 密钥明文: ${s}`)
    for (const i of r.ips) console.log(`        ⚑ 靶机地址: ${i}`)
  }
  console.log(`    合计 待确认 flag ${nFlags} 个 · 密钥 ${nSecrets} 个 · 公网地址 ${nIps} 个`)
  console.log(`    确认某赛事已归档可公开 → 在 scripts/flags-allowlist.json 里加 "文章id": "赛事名+归档日期"`)
} else {
  console.log('  ✓ 全部已在 flags-allowlist.json 里确认过')
}
