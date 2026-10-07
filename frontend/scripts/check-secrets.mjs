#!/usr/bin/env node
/**
 * 敏感内容扫描（安全类，进 CI）：
 *   node scripts/check-secrets.mjs   —— 命中硬规则就 exit 1
 *
 * 这个仓库是**公开**的，而且经历过"线上明文密码 + 占位 flag 被发上线"。
 * 所以把这类东西固化成断言，推之前就拦住。
 *
 * 两类规则：
 *   FAIL  硬规则 —— 凭据特征、真实密钥格式、占位 flag。命中即失败。
 *   WARN  软提示 —— 只在输出里提示，不拦（避免误报把 CI 卡死）。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCAN_DIRS = ['src', 'public', 'scripts']
const SCAN_FILES = ['index.html', 'vite.config.js', 'package.json']

// 硬规则：命中即失败
const HARD = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, '私钥内容'],
  [/\bghp_[A-Za-z0-9]{20,}/, 'GitHub 个人访问令牌'],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}/, 'GitHub 细粒度令牌'],
  [/\bsk-[A-Za-z0-9]{20,}/, '通用 API Key（sk- 前缀）'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS Access Key ID'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack Token'],
  [/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/, 'JWT'],
  // 明文密码赋值：password = "xxxxxx"（长度 ≥6，且不是明显占位）
  [/\b(?:pass(?:word|wd)?|secret|token|api[_-]?key)\s*[:=]\s*['"][^'"\s]{6,}['"]/i, '明文凭据赋值'],
  // 占位 flag：真的 flag 会打码保留（见 .spoiler-flag），但占位符必须拦掉
  [/flag\{\s*(?:test|xxx+|xxx*|example|placeholder|your[_-]?flag|todo|fixme|123+|flag|abc+|改变我|占位)[^}]*\}/i, '占位 flag'],
]

// 软提示：只报告
const SOFT = [
  [/\bTODO\b|\bFIXME\b/, 'TODO/FIXME 标记'],
  [/\b(?:localhost|127\.0\.0\.1):\d{4,5}\b/, '本地地址（上线前确认是否需要）'],
]

/** 收集要扫的文件（跳过 node_modules / dist / 图片等二进制） */
function collect(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (['node_modules', 'dist', '.git', 'assets'].includes(e.name)) continue
      collect(p, acc)
    } else if (/\.(js|jsx|ts|tsx|json|html|css|md|mjs|txt|yml|yaml)$/.test(e.name)) {
      acc.push(p)
    } else if (/\.(png|jpg|jpeg|svg|ico|woff2?|ttf)$/.test(e.name)) {
      acc.push(p)
    }
  }
  return acc
}

const files = [
  ...SCAN_DIRS.flatMap((d) => {
    const p = path.join(ROOT, d)
    return fs.existsSync(p) ? collect(p) : []
  }),
  ...SCAN_FILES.map((f) => path.join(ROOT, f)).filter((f) => fs.existsSync(f)),
]

const fails = []
const warns = []

for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  // 扫描器自己的规则里就有凭据/占位 flag 的示例正则，跳过自身避免自我匹配
  if (rel === 'scripts/check-secrets.mjs') continue
  let text
  try {
    text = fs.readFileSync(file, 'utf8')
  } catch {
    continue
  }
  const lines = text.split('\n')
  lines.forEach((line, i) => {
    for (const [re, label] of HARD) {
      if (re.test(line)) fails.push(`${rel}:${i + 1}  ${label}  →  ${line.trim().slice(0, 100)}`)
    }
    for (const [re, label] of SOFT) {
      if (re.test(line)) warns.push(`${rel}:${i + 1}  ${label}`)
    }
  })
}

console.log(`✓ 已扫描 ${files.length} 个文件`)
if (warns.length) {
  console.log(`  ℹ️ ${warns.length} 条软提示（不拦截）：`)
  for (const w of warns.slice(0, 8)) console.log('    ' + w)
  if (warns.length > 8) console.log(`    …另有 ${warns.length - 8} 条`)
}
if (fails.length) {
  console.error('✗ 敏感内容扫描失败：')
  for (const f of fails) console.error('  - ' + f)
  process.exit(1)
}
console.log('✓ 敏感内容扫描通过（无凭据 / 无占位 flag）')
