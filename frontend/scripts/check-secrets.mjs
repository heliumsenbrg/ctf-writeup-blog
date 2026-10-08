#!/usr/bin/env node
/**
 * 敏感内容扫描（安全类，进 CI）：
 *   node scripts/check-secrets.mjs          —— 扫源码（npm run check 里跑）
 *   node scripts/check-secrets.mjs --dist   —— 额外扫构建产物 dist/（postbuild 里跑）
 *
 * 这个仓库是**公开**的，而且经历过两次真实的线上事故：
 *   ① `**账号**: someone@qq.com / （已清理）`（自由文本形式）随文章正文发上线，
 *      并且在 search-index.json 里可被全文检索 —— 当时的规则只认
 *      `password = "xxx"` 这种**赋值**格式，完全没覆盖「邮箱 / 口令」的自由文本。
 *   ② 0xGame2025 正文里 15 处 `**Flag**: `flag{...}`` 占位符当成真 flag 发上线。
 *
 * 更关键的教训（来自外部审计）：站点做了代码拆分后，正文从主包移到懒加载块
 * `Article-*.js` 和运行时 JSON `search-index.json`。**只扫主包会漏掉一切**，
 * 所以必须用 --dist 扫全部产物。重建后跑一次 --dist，等于给"发布"这道口子上锁。
 *
 * 三类规则：
 *   FAIL  硬规则 —— 凭据特征、真实密钥格式、Flag 字段里的占位符。命中即失败。
 *   WARN  软提示 —— 只在输出里提示，不拦（避免误报把 CI 卡死）。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCAN_DIST = process.argv.includes('--dist')
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
  // 【新增】自由文本形式的「邮箱 + 口令」：`账号: someone@x.com / （已清理）`
  // 这是事故①的真实形态 —— 不依赖任何关键字，只看"邮箱后面跟一个 ASCII 口令"。
  [/[\w.+-]+@[\w-]+\.[A-Za-z]{2,}\s*[\/|｜]\s*[A-Za-z0-9!@#$%^&*._+-]{6,}/, '邮箱+口令组合（明文凭据）'],
  // 占位 flag：真的 flag 会打码保留（见 .spoiler-flag），但占位符必须拦掉
  [/flag\{\s*(?:test|xxx+|example|placeholder|your[_-]?flag|todo|fixme|123+|abc+|改变我|占位)[^}]*\}/i, '占位 flag'],
  // 【新增】事故②的形态：`**Flag**: `flag{...}``
  // 注意**必须限定在 Flag 字段上**——正文里"flag 格式通常是 `flag{...}`"这类教学举例
  // （知识库里有 10+ 处）和 `<input placeholder="flag{...}">` 都是正当用法，
  // 全文广谱匹配会把它们全部误伤。这正是外部审计里说的「可区分」。
  //
  // 距离必须**有界**（{0,20} 而不是 *）：search-index.json / 压缩后的 JS 里
  // 换行是被转义的 `\n` 两个字符，不是真换行，`[^\n]*` 会横跨整个文件乱匹配。
  [/\*\*Flag\*\*[^\n]{0,20}?(?:flag\{\s*(?:\.{2,}|…+)\s*\}|待填|placeholder|占位)/i, 'Flag 字段是占位符（应写真实 flag 或标注「待补」）'],
  // 【新增】Flag 字段里直接写 `flag{xxx}` 这种假值
  [/\*\*Flag\*\*[^\n]{0,20}?flag\{\s*(?:x{2,}|X{2,}|test|example|your[_-]?flag)/i, 'Flag 字段是示例值'],
]

// 软提示：只报告
const SOFT = [
  [/\bTODO\b|\bFIXME\b/, 'TODO/FIXME 标记'],
  [/\b(?:localhost|127\.0\.0\.1):\d{4,5}\b/, '本地地址（上线前确认是否需要）'],
  // 「待补」是**诚实标注**，不拦；但要在输出里可见，避免长期挂着没人补
  [/\*\*Flag\*\*\s*:?\s*(?:待补|待填|未记录)/, 'Flag 标注为「待补」（记得回头补上真实 flag）'],
]

/** 收集要扫的文件（跳过 node_modules / 图片等二进制） */
function collect(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (['node_modules', '.git', 'assets'].includes(e.name)) continue
      collect(p, acc)
    } else if (/\.(js|jsx|ts|tsx|json|html|css|md|mjs|txt|yml|yaml|xml|webmanifest)$/.test(e.name)) {
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

// dist 里没有子目录层级问题：assets/ 也要扫（懒加载块就在那里）
if (SCAN_DIST) {
  const dist = path.join(ROOT, 'dist')
  if (fs.existsSync(dist)) files.push(...collect(dist))
  else console.warn('⚠ --dist 传了但 dist/ 不存在（是不是还没 build？）')
}

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

console.log(`✓ 已扫描 ${files.length} 个文件${SCAN_DIST ? '（含构建产物 dist/）' : ''}`)
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
