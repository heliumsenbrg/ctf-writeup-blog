# 知识库板块（/kb）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把「hsb的第二大脑」vault 的 69 篇笔记（概念/项目/输出/实体，排除摘录）发布为博客的 `/kb` 知识库板块：分区目录 + 搜索 + 逐篇阅读 + `[[双链]]` 站内互跳。

**Architecture:** 本地生成器把 vault 转成 JSON/ESM 快照提交进仓库（CI 不依赖本机）；`Kb.jsx`（目录页，静态 import 元数据）+ `KbNote.jsx`（阅读页，`import.meta.glob` 懒加载每篇→独立 chunk）；`[[名]]` 由 remark 插件在 mdast 文本节点上转为 `kbnote:` 协议链接，渲染期分类为「站内跳 / 纯文本」。

**Tech Stack:** React 18 + Vite 5 + react-markdown（现有）；测试新增 vitest + jsdom + @testing-library/react（仅 devDependency，不进产物）；生成器为纯 Node ESM（零依赖）。

**Spec:** `docs/superpowers/specs/2026-10-05-kb-section-design.md`

**对 spec 的两处有意偏差（执行时按本计划为准）：**
1. 元数据文件名用 `src/data/kb/index.js`（`export default {...}`）而非 `index.json` —— Node ESM 直接 import JSON 需要 import attributes，生成 `.js` 让纯 node 校验脚本与 Vite 双侧都能无障碍导入；笔记正文仍是 `notes/*.json`（只在 Vite 内被 `import.meta.glob` 消费）。
2. 测试载体用 vitest（spec §5 写的是「node 断言脚本」）——vitest 直接复用 vite 的 JSX/`import.meta.glob` 转换，是同一思路的超集；数据/仓库级校验仍是独立 node 脚本 `check-kb.mjs`。

## Global Constraints

- **只读 vault**：`C:\Users\hwh\Desktop\知识库\hsb的第二大脑\02-笔记`（可用 `KB_VAULT` 环境变量覆盖）；**绝不写入 vault 任何文件**。
- 白名单目录：`概念`、`项目`、`输出`、`实体`；跳过 `index.md`、`log.md`；**不发布「摘录」**。
- 正文**忠实原文不改写**（保留「糯米/主人」称谓）；不做任何内容编辑。
- **不改 `src/components/Article.jsx`**。
- 生成物行尾用 LF（生成器直接 `\n`）；提交由 git 归一化处理。
- 每次发布前必须：`node scripts/build-kb.mjs && node scripts/check-kb.mjs && npm test && npm run build` 全绿。
- 部署 = push 到 `main`（GitHub Actions `deploy.yml` 自动构建并推 `gh-pages`）；**部署后必须线上复核**（构建通过 ≠ 线上更新）。
- commit 风格跟仓库现状：`feat: …` / `fix: …` / `test: …` / `docs: …`，无签名尾注。

## Review Focus

最可能伤到真实使用者的输入/条件（每条都在下方任务里有对应测试）：

1. **代码块/行内代码里的 `[[…]]`** 不能被转成链接（写 WP 时经常在代码里展示双链语法）→ Task 2 单测（合成 mdast，含 `code` 节点与链接内文本）。
2. **指向未发布页的双链**（说明 / log / 会话全记录×5 / 对话档案 / 对话纪要）与**库内相对路径链接**（「来源」栏）不得变成可点链接（会 404）→ Task 2 `resolveWikiLink` 单测 + Task 4 用真实笔记断言渲染为 `<span title="库内未发布页">`。
3. **中文名 URL 编码往返**：卡片链接、双链跳转、深链必须用 `encodeURIComponent` 且 `useParams` 能解回原名 → Task 2 往返断言 + Task 3/4 href 断言。
4. **摘要缺失 / 空文件 / 重名笔记**时生成器不得产出坏数据 → Task 1 `check-kb.mjs` 硬失败；摘要缺失退化为空串。
5. **快照漂移**（vault 被并行会话改过、或忘了重跑生成器）→ Task 1 校验脚本**重读 vault 做字节级比对**；Task 6 推送前整套重跑。

---

### Task 1: 快照生成器 + 数据校验脚本 + 生成快照

**Files:**
- Create: `frontend/scripts/build-kb.mjs`
- Create: `frontend/scripts/check-kb.mjs`
- Create（由生成器产出，需入库）: `frontend/src/data/kb/index.js`、`frontend/src/data/kb/notes/*.json`（69 个）

**Interfaces:**
- Consumes: vault 目录结构（见 Global Constraints）
- Produces: `index.js` 默认导出 `{ generatedAt, vault, total, sections: [{ id, title, groups: [{ id, title, notes: [{ name, title, summary }] }] }] }`；`notes/<name>.json` 为 `{ name, title, summary, content, section, group, links: { internal: string[], unresolved: string[] } }`。后续所有任务依赖这两个形状。

- [ ] **Step 1: 先写校验脚本（预期失败）**

创建 `frontend/scripts/check-kb.mjs`：

```js
#!/usr/bin/env node
/**
 * 知识库快照校验（数据/仓库级，不依赖 Vite）：
 *   node scripts/check-kb.mjs   —— 任何断言失败 exit 1
 * 校验项：篇数 69 / 每篇 title 非空 / 与 vault 源文件字节级一致 /
 *         internal 链接闭包 / 无重名 / notes/ 无多余文件。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import kbIndex from '../src/data/kb/index.js'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const KB_DIR = path.join(HERE, '..', 'src', 'data', 'kb')
const NOTES_DIR = path.join(KB_DIR, 'notes')
const VAULT = process.env.KB_VAULT || 'C:\\Users\\hwh\\Desktop\\知识库\\hsb的第二大脑\\02-笔记'

const problems = []
const check = (ok, msg) => { if (!ok) problems.push(msg) }

const flat = kbIndex.sections.flatMap(s => s.groups.flatMap(g => g.notes))
check(kbIndex.total === flat.length, `index.total(${kbIndex.total}) ≠ 实际条目数(${flat.length})`)
check(flat.length === 69, `篇数应为 69，实际 ${flat.length}`)

const names = new Set()
for (const meta of flat) {
  check(!names.has(meta.name), `重复条目: ${meta.name}`)
  names.add(meta.name)
  check(!!meta.title, `${meta.name}: 缺 title`)
  check(typeof meta.summary === 'string', `${meta.name}: 缺 summary 字段`)
  const p = path.join(NOTES_DIR, `${meta.name}.json`)
  if (!fs.existsSync(p)) { problems.push(`${meta.name}: 缺 notes/${meta.name}.json`); continue }
  const note = JSON.parse(fs.readFileSync(p, 'utf8'))
  check(note.content?.trim().length > 0, `${meta.name}: 正文为空`)
  const src = findSource(meta.name)
  check(src !== null, `${meta.name}: vault 中找不到对应 md 文件`)
  if (src) check(fs.readFileSync(src, 'utf8') === note.content, `${meta.name}: 与 vault 源文件不一致（快照漂移？重跑 build-kb.mjs）`)
  for (const t of note.links?.internal ?? []) {
    check(names.has(t) || t === 'index', `${meta.name}: internal 链接「${t}」不在发布集`)
  }
}

const extra = fs.readdirSync(NOTES_DIR).filter(f => f.endsWith('.json') && !names.has(f.slice(0, -5)))
check(extra.length === 0, `notes/ 存在多余文件: ${extra.join(', ')}`)

function findSource(name) {
  for (const d of ['概念', '项目', '输出', '实体']) {
    const p = path.join(VAULT, d, name + '.md')
    if (fs.existsSync(p)) return p
  }
  return null
}

if (problems.length) {
  console.error('✗ kb check 失败:')
  for (const p of problems) console.error('  - ' + p)
  process.exit(1)
}
console.log(`✓ kb check ok — ${flat.length} 篇，链接闭包完整，与 vault 一致`)
```

- [ ] **Step 2: 运行校验，确认失败**

Run: `cd frontend && node scripts/check-kb.mjs`
Expected: 失败，`Cannot find module …/src/data/kb/index.js`（数据尚未生成）。

- [ ] **Step 3: 写生成器**

创建 `frontend/scripts/build-kb.mjs`：

```js
#!/usr/bin/env node
/**
 * 从「hsb的第二大脑」vault 生成知识库快照（只读，白名单目录）。
 *   node scripts/build-kb.mjs        （KB_VAULT 可覆盖 02-笔记 路径）
 * 全部校验通过后才落盘；重跑会整体重建 notes/（删除多余旧文件）。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(HERE, '..', 'src', 'data', 'kb')
const NOTES_DIR = path.join(OUT_DIR, 'notes')
const VAULT = process.env.KB_VAULT || 'C:\\Users\\hwh\\Desktop\\知识库\\hsb的第二大脑\\02-笔记'

const CONCEPT_GROUPS = [
  { id: 'web', title: 'Web', prefix: 'Web-' },
  { id: 'reverse', title: '逆向', prefix: '逆向-' },
  { id: 'crypto', title: '密码学', prefix: '密码学-' },
  { id: 'pwn', title: 'Pwn', prefix: 'Pwn-' },
  { id: 'misc', title: '杂项', prefix: '杂项-' },
  { id: 'other', title: '云 · 容器 · 其他', prefix: null },   // 兜底，必须最后
]
const SECTIONS = [
  { id: 'concept', title: '概念', dir: '概念', groups: CONCEPT_GROUPS },
  { id: 'project', title: '项目', dir: '项目', groups: [{ id: 'project', title: '项目', prefix: null }] },
  { id: 'output', title: '输出', dir: '输出', groups: [{ id: 'output', title: '输出', prefix: null }] },
  { id: 'entity', title: '实体', dir: '实体', groups: [{ id: 'entity', title: '实体', prefix: null }] },
]
const WIKILINK = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g

const fail = (msg) => { console.error('✗ ' + msg); process.exit(1) }

if (!fs.existsSync(VAULT)) fail(`vault 路径不存在: ${VAULT}`)

// ---------- 读取并解析（先全部进内存，校验后再写） ----------
const notes = new Map()
for (const sec of SECTIONS) {
  const dir = path.join(VAULT, sec.dir)
  if (!fs.existsSync(dir)) fail(`目录不存在: ${dir}`)
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && f !== 'index.md' && f !== 'log.md')
    .sort((a, b) => a.localeCompare(b, 'zh'))
  for (const file of files) {
    const name = file.slice(0, -3)
    if (notes.has(name)) fail(`重名笔记: ${name}`)
    const content = fs.readFileSync(path.join(dir, file), 'utf8')
    if (!content.trim()) fail(`空笔记: ${sec.dir}/${file}`)
    const title = content.match(/^#\s+(.+)$/m)?.[1]?.trim() || name
    const summary = content.match(/^>\s+(.+)$/m)?.[1]?.trim() || ''
    const group = sec.groups.find(g => g.prefix === null || name.startsWith(g.prefix))
    notes.set(name, { name, title, summary, content, section: sec.id, group: group.id, links: null })
  }
}

// ---------- 链接扫描（对账；正文不改写） ----------
const resolvable = new Set([...notes.keys(), 'index'])
for (const n of notes.values()) {
  const internal = new Set(), unresolved = new Set()
  for (const m of n.content.matchAll(WIKILINK)) {
    const t = m[1].trim()
    ;(resolvable.has(t) ? internal : unresolved).add(t)
  }
  n.links = { internal: [...internal].sort(), unresolved: [...unresolved].sort() }
}

// ---------- 组装 index ----------
const index = {
  generatedAt: new Date().toISOString(),
  vault: VAULT,
  total: notes.size,
  sections: SECTIONS.map(sec => ({
    id: sec.id,
    title: sec.title,
    groups: sec.groups
      .map(g => ({
        id: g.id,
        title: g.title,
        notes: [...notes.values()]
          .filter(n => n.section === sec.id && n.group === g.id)
          .map(n => ({ name: n.name, title: n.title, summary: n.summary })),
      }))
      .filter(g => g.notes.length > 0),
  })),
}

// ---------- 落盘（重建 notes/，删除陈旧文件） ----------
fs.rmSync(NOTES_DIR, { recursive: true, force: true })
fs.mkdirSync(NOTES_DIR, { recursive: true })
fs.writeFileSync(path.join(OUT_DIR, 'index.js'), 'export default ' + JSON.stringify(index, null, 1) + '\n')
for (const n of notes.values()) {
  fs.writeFileSync(path.join(NOTES_DIR, `${n.name}.json`), JSON.stringify(n, null, 1) + '\n')
}

// ---------- 对账输出 ----------
const unresolvedAll = [...new Set([...notes.values()].flatMap(n => n.links.unresolved))].sort()
console.log(`✓ 生成 ${notes.size} 篇 → src/data/kb/`)
for (const sec of index.sections) {
  console.log(`  ${sec.title}: ${sec.groups.reduce((a, g) => a + g.notes.length, 0)} 篇`)
}
console.log(`  未解析双链 (${unresolvedAll.length}): ${unresolvedAll.join(', ')}`)
```

- [ ] **Step 4: 生成快照**

Run: `cd frontend && node scripts/build-kb.mjs`
Expected: `✓ 生成 69 篇 → src/data/kb/`，概念 55 / 项目 7 / 输出 3 / 实体 4；未解析双链 9 个（`log, 会话全记录-*（5 个）, 对话档案-历年题目与过程, 对话纪要-糯米与主人, 说明`，`index` 不算）。

- [ ] **Step 5: 运行校验，确认通过**

Run: `cd frontend && node scripts/check-kb.mjs`
Expected: `✓ kb check ok — 69 篇，链接闭包完整，与 vault 一致`

- [ ] **Step 6: 提交**

```bash
git add frontend/scripts/build-kb.mjs frontend/scripts/check-kb.mjs frontend/src/data/kb
git commit -m "feat(kb): add vault snapshot generator + data check (69 notes)"
```

---

### Task 2: 引入 vitest + 双链插件与链接工具（纯逻辑单测）

**Files:**
- Modify: `frontend/package.json`（scripts 加 `"test": "vitest run"`；devDependencies 由 npm 写入）
- Modify: `frontend/vite.config.js`（追加 `test` 段）
- Create: `frontend/tests/setup.js`
- Create: `frontend/src/utils/remarkWikilinks.js`
- Create: `frontend/src/utils/kbLinks.js`
- Create: `frontend/tests/wikilinks.test.js`

**Interfaces:**
- Consumes: 无（纯函数）
- Produces:
  - `remarkWikilinks`（默认导出；remark 插件工厂）→ 把 mdast 文本节点中的 `[[名]]`（含 `[[名|别名]]`）替换为 `{ type:'link', url:'kbnote:'+encodeURIComponent(名) }`，链接节点内部与代码节点不改写。
  - `kbLinks.js`：`WIKILINK_SCHEME`、`isWikiHref(href)`、`wikiTarget(href)`、`isExternal(href)`、`resolveWikiLink(target, publishedSet) → {kind:'kb', to} | {kind:'plain'}`（`index` → `{kind:'kb', to:'/kb'}`）。

- [ ] **Step 1: 安装测试依赖**

```bash
cd frontend
npm i -D vitest@^1.6.1 jsdom@^25 @testing-library/react@^16 @testing-library/dom@^10
```

Expected: 安装成功，`package.json` devDependencies 出现 4 个新包。

- [ ] **Step 2: 写测试（预期失败）**

创建 `frontend/tests/setup.js`：

```js
// jsdom 缺失的浏览器 API 垫片（framer-motion 等按需探测）
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
```

创建 `frontend/tests/wikilinks.test.js`：

```js
import { test, expect } from 'vitest'
import remarkWikilinks from '../src/utils/remarkWikilinks.js'
import { isWikiHref, wikiTarget, isExternal, resolveWikiLink } from '../src/utils/kbLinks.js'

function run(tree) { remarkWikilinks()(tree); return tree }

test('文本节点里的 [[名]] 转成 kbnote: 链接，其余文本保留', () => {
  const tree = run({
    type: 'root', children: [
      { type: 'paragraph', children: [{ type: 'text', value: '见 [[Web-SQL注入]] 与 [[index]]。' }] },
    ],
  })
  const types = tree.children[0].children.map(n => n.type)
  expect(types).toEqual(['text', 'link', 'text', 'link', 'text'])
  expect(tree.children[0].children[1].url).toBe('kbnote:' + encodeURIComponent('Web-SQL注入'))
  expect(tree.children[0].children[1].children[0].value).toBe('Web-SQL注入')
  expect(tree.children[0].children[3].url).toBe('kbnote:index')
})

test('别名 [[名|显示]] 保留别名做显示文本', () => {
  const tree = run({
    type: 'root', children: [
      { type: 'paragraph', children: [{ type: 'text', value: '看 [[Web-SQL注入|SQL 注入页]]' }] },
    ],
  })
  const link = tree.children[0].children.find(n => n.type === 'link')
  expect(link.children[0].value).toBe('SQL 注入页')
  expect(link.url).toBe('kbnote:' + encodeURIComponent('Web-SQL注入'))
})

test('代码节点里的 [[…]] 不被转换', () => {
  const tree = run({ type: 'root', children: [{ type: 'code', value: 'x = "[[不该被转换]]"' }] })
  expect(tree.children[0].type).toBe('code')
  expect(tree.children[0].value).toBe('x = "[[不该被转换]]"')
})

test('链接节点内部不再嵌套双链转换', () => {
  const tree = run({
    type: 'root', children: [
      { type: 'paragraph', children: [
        { type: 'link', url: 'https://x', children: [{ type: 'text', value: '含 [[Web-SQL注入]] 的链接' }] },
      ] },
    ],
  })
  const link = tree.children[0].children[0]
  expect(link.type).toBe('link')
  expect(link.children[0].value).toContain('[[Web-SQL注入]]')
})

test('kbLinks：协议识别 / 目标解码 / 外链判定 / 解析分类', () => {
  const href = 'kbnote:' + encodeURIComponent('密码学-格与LLL')
  expect(isWikiHref(href)).toBe(true)
  expect(isWikiHref('https://x')).toBe(false)
  expect(wikiTarget(href)).toBe('密码学-格与LLL')
  expect(isExternal('https://github.com')).toBe(true)
  expect(isExternal('../01-原料/x.md')).toBe(false)

  const published = new Set(['Web-SQL注入'])
  expect(resolveWikiLink('index', published)).toEqual({ kind: 'kb', to: '/kb' })
  expect(resolveWikiLink('Web-SQL注入', published))
    .toEqual({ kind: 'kb', to: '/kb/' + encodeURIComponent('Web-SQL注入') })
  expect(resolveWikiLink('说明', published)).toEqual({ kind: 'plain' })
  expect(wikiTarget('kbnote:' + encodeURIComponent('Web-SQL注入'))).toBe('Web-SQL注入')
})
```

- [ ] **Step 3: 配置 vitest 并运行，确认失败**

`frontend/vite.config.js` 的 `defineConfig({...})` 内追加：

```js
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{js,jsx}'],
    setupFiles: ['./tests/setup.js'],
  },
```

`frontend/package.json` 的 `scripts` 追加：`"test": "vitest run"`。

Run: `cd frontend && npm test`
Expected: 失败 —— `Failed to resolve import "../src/utils/remarkWikilinks.js"`。

- [ ] **Step 4: 实现两个工具模块**

创建 `frontend/src/utils/remarkWikilinks.js`：

```js
// remark 插件：把普通文本节点里的 [[名]]（可带 |别名）转成链接节点，
// url 采用自定义协议 kbnote:<encodeURIComponent(名)>。
// 基于 mdast 遍历 ⇒ 代码块/行内代码（无 text 子节点）与链接内部（避免嵌套）不会被改。
const WIKILINK = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g
const SCHEME = 'kbnote:'

export default function remarkWikilinks() {
  return (tree) => { walkChildren(tree) }
}

function walkChildren(node) {
  if (!Array.isArray(node.children)) return
  const out = []
  for (const child of node.children) {
    if (child.type === 'text' && child.value.includes('[[')) {
      out.push(...splitText(child.value))
    } else {
      if (child.type !== 'link') walkChildren(child)
      out.push(child)
    }
  }
  node.children = out
}

function splitText(value) {
  const parts = []
  let last = 0
  for (const m of value.matchAll(WIKILINK)) {
    if (m.index > last) parts.push({ type: 'text', value: value.slice(last, m.index) })
    parts.push({
      type: 'link',
      url: SCHEME + encodeURIComponent(m[1].trim()),
      children: [{ type: 'text', value: (m[2] ?? m[1]).trim() }],
    })
    last = m.index + m[0].length
  }
  if (last < value.length) parts.push({ type: 'text', value: value.slice(last) })
  return parts
}
```

创建 `frontend/src/utils/kbLinks.js`：

```js
// 知识库链接工具：双链协议解析 + 渲染期分类
export const WIKILINK_SCHEME = 'kbnote:'

export function isWikiHref(href = '') {
  return href.startsWith(WIKILINK_SCHEME)
}

export function wikiTarget(href = '') {
  return decodeURIComponent(href.slice(WIKILINK_SCHEME.length))
}

export function isExternal(href = '') {
  return /^https?:\/\//i.test(href)
}

/**
 * 把双链目标解析为渲染指令：
 *   { kind: 'kb', to }  —— 站内跳转（index → /kb）
 *   { kind: 'plain' }   —— 库内未发布页 → 纯文本
 */
export function resolveWikiLink(target, published) {
  if (target === 'index') return { kind: 'kb', to: '/kb' }
  if (published.has(target)) return { kind: 'kb', to: '/kb/' + encodeURIComponent(target) }
  return { kind: 'plain' }
}
```

- [ ] **Step 5: 运行测试，确认通过**

Run: `cd frontend && npm test`
Expected: `Test Files 1 passed`，5 个用例全绿。

- [ ] **Step 6: 提交**

```bash
git add frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/tests frontend/src/utils/remarkWikilinks.js frontend/src/utils/kbLinks.js
git commit -m "feat(kb): wikilink remark plugin + link utils, with vitest harness"
```

---

### Task 3: `/kb` 目录页 + 路由

**Files:**
- Create: `frontend/src/components/Kb.jsx`
- Modify: `frontend/src/App.jsx`（import + 路由）
- Create: `frontend/tests/kb-page.test.jsx`

**Interfaces:**
- Consumes: `src/data/kb/index.js`（Task 1 的形状）；`kbLinks` 不需要
- Produces: `Kb` 默认导出组件；路由 `/kb`。卡片链接形如 `/kb/<encodeURIComponent(name)>`（Task 4 的路由依赖此约定）。

- [ ] **Step 1: 写失败测试**

创建 `frontend/tests/kb-page.test.jsx`：

```jsx
import { test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Kb from '../src/components/Kb.jsx'
import kbIndex from '../src/data/kb/index.js'

test('目录页渲染分区、卡片链接与搜索过滤', () => {
  render(<MemoryRouter><Kb /></MemoryRouter>)

  expect(screen.getByText('知识库 · 第二大脑')).toBeTruthy()
  const first = kbIndex.sections[0].groups[0].notes[0]
  expect(screen.getByText(first.title)).toBeTruthy()
  const link = screen.getByText(first.title).closest('a')
  expect(link.getAttribute('href')).toBe('/kb/' + encodeURIComponent(first.name))
  for (const sec of kbIndex.sections) {
    expect(screen.getAllByText(new RegExp(sec.title)).length).toBeGreaterThan(0)
  }

  const input = screen.getByPlaceholderText('搜索标题 / 摘要…')
  fireEvent.change(input, { target: { value: first.name.slice(0, 4) } })
  expect(screen.getByText(first.title)).toBeTruthy()

  fireEvent.change(input, { target: { value: '绝不匹配的词xyzzy' } })
  expect(screen.getByText('没有匹配的笔记')).toBeTruthy()
})
```

- [ ] **Step 2: 运行，确认失败**

Run: `cd frontend && npm test -- tests/kb-page.test.jsx`
Expected: 失败 —— 无法解析 `../src/components/Kb.jsx`。

- [ ] **Step 3: 实现 Kb.jsx**

创建 `frontend/src/components/Kb.jsx`：

```jsx
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, BookOpen } from 'lucide-react'
import kbIndex from '../data/kb/index.js'

export default function Kb() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!q) return null
    return kbIndex.sections
      .flatMap(s => s.groups.flatMap(g => g.notes))
      .filter(n => (n.name + n.title + n.summary).toLowerCase().includes(q))
  }, [q])

  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-cyber-purple/70 text-sm font-mono tracking-widest">KNOWLEDGE BASE</span>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2 anime-title text-gradient">知识库 · 第二大脑</h1>
          <p className="text-cyber-grid mt-3 font-mono text-sm">
            {kbIndex.total} 篇笔记 · Web / 逆向 / 密码学 / Pwn / 杂项 / 云容器 …（快照 {kbIndex.generatedAt.slice(0, 10)}）
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto mb-10">
          <div className="glass-card flex items-center gap-3 px-4 py-3">
            <Search className="w-4 h-4 text-cyber-cyan shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="搜索标题 / 摘要…"
              className="bg-transparent outline-none w-full text-sm font-mono text-cyber-cyan placeholder:text-cyber-grid/60"
            />
          </div>
        </div>

        {results ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map(n => <NoteCard key={n.name} note={n} />)}
            {results.length === 0 && (
              <p className="text-cyber-grid font-mono text-sm col-span-full text-center py-10">没有匹配的笔记</p>
            )}
          </div>
        ) : (
          kbIndex.sections.map(sec => (
            <section key={sec.id} className="mb-14">
              <h2 className="text-2xl font-bold text-cyber-cyan anime-title mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> {sec.title}
              </h2>
              {sec.groups.map(group => (
                <div key={group.id} className="mb-8">
                  {sec.groups.length > 1 && (
                    <h3 className="text-lg font-bold text-cyber-purple mb-3 font-mono">
                      {group.title}
                      <span className="text-xs text-cyber-grid ml-2">{group.notes.length} 篇</span>
                    </h3>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.notes.map(n => <NoteCard key={n.name} note={n} />)}
                  </div>
                </div>
              ))}
            </section>
          ))
        )}
      </div>
    </div>
  )
}

function NoteCard({ note }) {
  return (
    <Link to={`/kb/${encodeURIComponent(note.name)}`} className="glass-card p-4 sm:p-5 neon-border-hover group block">
      <div className="font-bold text-cyber-cyan group-hover:text-white transition-colors mb-2">{note.title}</div>
      <p className="text-xs text-cyber-grid leading-relaxed line-clamp-3">{note.summary || '—'}</p>
    </Link>
  )
}
```

- [ ] **Step 4: 接路由**

`frontend/src/App.jsx`：
- import 区（第 9 行 `import About from './components/About'` 之后）加：`import Kb from './components/Kb'`
- 路由区（`<Route path="challenges" element={<Challenges />} />` 之后）加：`<Route path="kb" element={<Kb />} />`

- [ ] **Step 5: 运行测试，确认通过**

Run: `cd frontend && npm test -- tests/kb-page.test.jsx`
Expected: PASS。

- [ ] **Step 6: 提交**

```bash
git add frontend/src/components/Kb.jsx frontend/src/App.jsx frontend/tests/kb-page.test.jsx
git commit -m "feat(kb): add /kb index page with search + route"
```

---

### Task 4: `/kb/:name` 阅读页 + 路由

**Files:**
- Create: `frontend/src/components/KbNote.jsx`
- Modify: `frontend/src/App.jsx`（import + 路由）
- Create: `frontend/tests/kb-note.test.jsx`

**Interfaces:**
- Consumes: `notes/*.json` 形状（Task 1）；`remarkWikilinks`、`kbLinks`（Task 2）；`index.js` 的组内顺序（Task 1）
- Produces: `KbNote` 默认导出组件；路由 `/kb/:name`（`name` 为解码后的中文原名；`index` 重定向 `/kb`）。

- [ ] **Step 1: 写失败测试**

创建 `frontend/tests/kb-note.test.jsx`：

```jsx
import { test, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import KbNote from '../src/components/KbNote.jsx'
import kbIndex from '../src/data/kb/index.js'

const NOTES_DIR = fileURLToPath(new URL('../src/data/kb/notes/', import.meta.url))
const allNotes = kbIndex.sections.flatMap(s => s.groups.flatMap(g => g.notes))

function renderAt(url) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/kb" element={<div>KB_HOME</div>} />
        <Route path="/kb/:name" element={<KbNote />} />
      </Routes>
    </MemoryRouter>
  )
}

test('渲染笔记正文与摘要', async () => {
  const meta = allNotes[0]
  renderAt('/kb/' + encodeURIComponent(meta.name))
  await waitFor(() => expect(screen.getByText(new RegExp(meta.title.slice(0, 4)))).toBeTruthy())
  expect(screen.getByText('知识库')).toBeTruthy()   // 面包屑
})

test('双链：站内目标渲染为链接、未发布目标渲染为纯文本', async () => {
  // 找一篇同时含 internal 与 unresolved 链接的笔记
  let target = null
  for (const meta of allNotes) {
    const note = JSON.parse(fs.readFileSync(path.join(NOTES_DIR, meta.name + '.json'), 'utf8'))
    if (note.links.internal.length && note.links.unresolved.length) { target = { meta, note }; break }
  }
  expect(target).not.toBeNull()
  renderAt('/kb/' + encodeURIComponent(target.meta.name))

  const internal = target.note.links.internal[0]
  await waitFor(() => {
    const links = screen.getAllByRole('link').map(a => a.getAttribute('href'))
    expect(links).toContain('/kb/' + encodeURIComponent(internal))
  })
  // 未发布目标 → 无对应链接，且以 span[title=库内未发布页] 呈现
  const unresolved = target.note.links.unresolved[0]
  const hrefs = screen.getAllByRole('link').map(a => a.getAttribute('href'))
  expect(hrefs).not.toContain('/kb/' + encodeURIComponent(unresolved))
  expect(document.querySelector('span[title="库内未发布页"]')).toBeTruthy()
})

test('index 重定向到 /kb，未知笔记给出未找到提示', async () => {
  renderAt('/kb/index')
  await waitFor(() => expect(screen.getByText('KB_HOME')).toBeTruthy())

  renderAt('/kb/' + encodeURIComponent('不存在的页面xyzzy'))
  await waitFor(() => expect(screen.getByText(/未找到/)).toBeTruthy())
})
```

- [ ] **Step 2: 运行，确认失败**

Run: `cd frontend && npm test -- tests/kb-note.test.jsx`
Expected: 失败 —— 无法解析 `../src/components/KbNote.jsx`。

- [ ] **Step 3: 实现 KbNote.jsx**

创建 `frontend/src/components/KbNote.jsx`：

```jsx
import { useEffect, useMemo, useState, useCallback } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, ArrowRight, Copy, Check } from 'lucide-react'
import remarkWikilinks from '../utils/remarkWikilinks.js'
import { isWikiHref, wikiTarget, isExternal, resolveWikiLink } from '../utils/kbLinks.js'
import kbIndex from '../data/kb/index.js'

// Vite 懒加载：每篇笔记一个 chunk（本文件不可在纯 node 中 import）
const modules = import.meta.glob('../data/kb/notes/*.json')
const NOTES = Object.fromEntries(
  Object.entries(modules).map(([p, load]) => [p.slice(p.lastIndexOf('/') + 1, -'.json'.length), load])
)
const PUBLISHED = new Set(Object.keys(NOTES))

function locate(name) {
  for (const sec of kbIndex.sections) {
    for (const g of sec.groups) {
      const i = g.notes.findIndex(n => n.name === name)
      if (i !== -1) return { section: sec, group: g, index: i }
    }
  }
  return null
}

// —— 与 Article.jsx 同款的代码块/行内代码（副本；不改动 Article.jsx） ——
function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false)
  const code = String(children).replace(/\n$/, '')
  const lang = className?.replace('language-', '') || ''
  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(code) } catch { /* 忽略剪贴板权限错误 */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])
  const lines = code.split('\n')
  return (
    <div className="relative my-4">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        {lang && <span className="text-xs text-cyber-grid font-mono">{lang}</span>}
        <button onClick={handleCopy} className="p-1 hover:bg-cyber-cyan/10 rounded transition-colors">
          {copied ? <Check className="w-4 h-4 text-cyber-cyan" /> : <Copy className="w-4 h-4 text-cyber-grid" />}
        </button>
      </div>
      <pre className="my-4 p-4 pr-16 rounded-lg bg-black/60 border border-cyber-grid/20 overflow-x-auto text-sm leading-relaxed">
        <code className="text-cyber-cyan/90 font-mono">
          {lines.map((line, i) => (
            <div key={i}>
              {line.split(/(flag\{[^}]+\})/g).map((part, k) =>
                /^flag\{[^}]+\}$/.test(part)
                  ? <span key={k} className="spoiler-flag">{part}</span>
                  : (part || ' ')
              )}
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}

function InlineCode({ children }) {
  const text = String(children)
  if (/^flag\{[^}]+\}$/.test(text)) return <span className="spoiler-flag">{text}</span>
  return <code className="px-1 py-0.5 bg-cyber-darker rounded text-cyber-pink font-mono text-sm">{children}</code>
}

const slug = (text) => String(text).toLowerCase().replace(/[^\w一-龥]+/g, '-').replace(/^-+|-+$/g, '')

const markdownComponents = {
  a({ href = '', children }) {
    if (isWikiHref(href)) {
      const r = resolveWikiLink(wikiTarget(href), PUBLISHED)
      if (r.kind === 'kb') {
        return <Link to={r.to} className="text-cyber-purple hover:text-cyber-cyan underline decoration-dotted">{children}</Link>
      }
      return <span title="库内未发布页" className="text-cyber-grid/70">{children}</span>
    }
    if (isExternal(href)) {
      return <a href={href} target="_blank" rel="noreferrer" className="text-cyber-purple hover:text-cyber-cyan underline">{children}</a>
    }
    return <span className="text-cyber-grid/70">{children}</span>
  },
  code({ inline, className, children }) {
    if (inline) return <InlineCode>{children}</InlineCode>
    return <CodeBlock className={className}>{children}</CodeBlock>
  },
  p: ({ children }) => <p className="text-cyber-grid leading-relaxed my-3">{children}</p>,
  h1: ({ children }) => (
    <h1 id="note-title" className="text-3xl font-bold mt-2 mb-4 anime-title text-gradient scroll-mt-20">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 id={slug(children)} className="text-2xl font-bold text-cyber-cyan mt-8 mb-4 anime-title scroll-mt-20">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 id={slug(children)} className="text-xl font-bold text-cyber-purple mt-6 mb-3 scroll-mt-20">{children}</h3>
  ),
  strong: ({ children }) => <strong className="text-cyber-cyan font-bold">{children}</strong>,
  ul: ({ children }) => <ul className="list-disc pl-6 my-3 space-y-1 text-cyber-grid">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 my-3 space-y-1 text-cyber-grid">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-cyber-purple/50 bg-cyber-purple/5 pl-4 py-1 my-4 text-cyber-grid/90">{children}</blockquote>
  ),
  hr: () => <hr className="my-8 border-t border-cyber-grid/30" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border border-cyber-grid/30">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-cyber-darker">{children}</thead>,
  th: ({ children }) => <th className="px-3 py-2 text-left text-cyber-cyan border-b border-cyber-grid/30 text-sm">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 text-sm text-cyber-grid border-b border-cyber-grid/20">{children}</td>,
}

export default function KbNote() {
  const { name = '' } = useParams()
  const [state, setState] = useState({ status: 'loading', note: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (name === 'index') return
    const load = NOTES[name]
    if (!load) { setState({ status: 'missing', note: null }); return }
    let alive = true
    setState({ status: 'loading', note: null })
    load()
      .then(m => { if (alive) setState({ status: 'ready', note: m.default ?? m }) })
      .catch(() => { if (alive) setState({ status: 'error', note: null }) })
    return () => { alive = false }
  }, [name, attempt])

  const place = useMemo(() => locate(name), [name])

  if (name === 'index') return <Navigate to="/kb" replace />

  if (state.status === 'loading') {
    return <div className="min-h-screen py-20 text-center text-cyber-grid font-mono text-sm">加载中…</div>
  }
  if (state.status === 'missing') {
    return (
      <div className="min-h-screen py-20 text-center font-mono">
        <p className="text-cyber-pink mb-4">未找到该笔记：{name}</p>
        <Link to="/kb" className="text-cyber-cyan hover:text-cyber-purple underline">← 返回知识库</Link>
      </div>
    )
  }
  if (state.status === 'error') {
    return (
      <div className="min-h-screen py-20 text-center font-mono">
        <p className="text-cyber-pink mb-4">加载失败</p>
        <button onClick={() => setAttempt(a => a + 1)} className="px-4 py-2 rounded-lg border border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10">
          点击重试
        </button>
      </div>
    )
  }

  const { note } = state
  const prev = place && place.index > 0 ? place.group.notes[place.index - 1] : null
  const next = place && place.index < place.group.notes.length - 1 ? place.group.notes[place.index + 1] : null

  return (
    <div className="min-h-screen py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <nav className="text-xs font-mono text-cyber-grid mb-6">
          <Link to="/kb" className="hover:text-cyber-cyan">知识库</Link>
          {place && (<><span className="mx-2">/</span><span>{place.section.title} · {place.group.title}</span></>)}
        </nav>

        <ReactMarkdown remarkPlugins={[remarkGfm, remarkWikilinks]} components={markdownComponents}>
          {note.content}
        </ReactMarkdown>

        <div className="flex justify-between gap-4 mt-12 pt-6 border-t border-cyber-grid/20">
          {prev ? (
            <Link to={`/kb/${encodeURIComponent(prev.name)}`} className="group flex items-center gap-2 text-sm font-mono text-cyber-grid hover:text-cyber-cyan">
              <ArrowLeft className="w-4 h-4" /> {prev.title}
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/kb/${encodeURIComponent(next.name)}`} className="group flex items-center gap-2 text-sm font-mono text-cyber-grid hover:text-cyber-cyan text-right">
              {next.title} <ArrowRight className="w-4 h-4" />
            </Link>
          ) : <span />}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 接路由**

`frontend/src/App.jsx`：
- import 区加：`import Kb from './components/Kb'`（Task 3 已加）与 `import KbNote from './components/KbNote'`
- 路由区 `<Route path="kb" element={<Kb />} />` 之后加：`<Route path="kb/:name" element={<KbNote />} />`

- [ ] **Step 5: 运行测试，确认通过**

Run: `cd frontend && npm test`
Expected: 全部测试通过（wikilinks 5 + kb-page 1 + kb-note 3）。

- [ ] **Step 6: 构建验证（chunk 生成 + 主包不膨胀）**

Run: `cd frontend && npm run build`
Expected: 构建成功；`dist/assets/` 出现多个小 chunk（含笔记内容）；主包 `index-*.js` 体积与当前基线（≈296KB）相比增长 < 5%。用以下命令抽查：

```bash
grep -rl "先找差异" dist/assets/ | head -3          # 笔记内容在独立 chunk 中
ls -la dist/assets/ | wc -l                          # chunk 数量明显增多
```

- [ ] **Step 7: 提交**

```bash
git add frontend/src/components/KbNote.jsx frontend/src/App.jsx frontend/tests/kb-note.test.jsx
git commit -m "feat(kb): add /kb note reader (lazy per-note chunks, wikilink rendering)"
```

---

### Task 5: 入口（Navbar + 首页卡片）

**Files:**
- Modify: `frontend/src/components/Navbar.jsx`
- Modify: `frontend/src/components/Home.jsx`

**Interfaces:**
- Consumes: 路由 `/kb`（Task 3）
- Produces: 无（纯 UI 入口）

- [ ] **Step 1: Navbar 加入口**

`frontend/src/components/Navbar.jsx`：
- lucide import 行加 `Library`：`import { Terminal, Flag, BookOpen, ExternalLink, Menu, X, User, Circle } from 'lucide-react'` → `import { Terminal, Flag, BookOpen, ExternalLink, Menu, X, User, Circle, Library } from 'lucide-react'`
- 桌面导航：在 `<NavLink to="/challenges" …>…</NavLink>` 之后插入：

```jsx
            <NavLink to="/kb" active={location.pathname.startsWith('/kb')}>
              <Library className="w-4 h-4 mr-2" />
              知识库
            </NavLink>
```

- 移动菜单：在 `/challenges` 的 `<Link …>…</Link>` 块之后插入（照抄 About 块的结构）：

```jsx
            <Link
              to="/kb"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono transition-all ${
                location.pathname.startsWith('/kb')
                  ? 'text-cyber-cyan bg-cyber-cyan/10'
                  : 'text-cyber-grid hover:text-cyber-cyan hover:bg-cyber-cyan/5'
              }`}
            >
              <Library className="w-4 h-4" />
              知识库
            </Link>
```

- [ ] **Step 2: 首页卡片**

`frontend/src/components/Home.jsx`：
- lucide import 行加 `Library`
- `const categories = [` 数组**末尾**（`misc` 那条之后）加：

```jsx
  { id: 'kb', title: '知识库 · 第二大脑', subtitle: '69 篇 CTF 笔记', icon: Library, desc: 'Web / 逆向 / 密码学 / Pwn / 杂项 / 云容器…', color: 'purple' },
```

- 两处 `to={`/article/${cat.id}`}` （约 476 与 593 行）都改为：`to={cat.id === 'kb' ? '/kb' : `/article/${cat.id}`}`

- [ ] **Step 3: 构建并抽查**

Run: `cd frontend && npm run build && grep -c "知识库" dist/assets/index-*.js`
Expected: 构建成功，`知识库` 出现在主包（导航与卡片字符串）。

- [ ] **Step 4: 提交**

```bash
git add frontend/src/components/Navbar.jsx frontend/src/components/Home.jsx
git commit -m "feat(kb): nav + home entry for knowledge base"
```

---

### Task 6: 全量验证 + 推送部署 + 线上复核

**Files:**
- 无新文件（本任务只做验证与发布；`docs/superpowers/plans/2026-10-05-kb-section.md` 一并提交）

**Interfaces:**
- Consumes: 前五个任务的产物
- Produces: 线上 `/kb` 板块

- [ ] **Step 1: 全量重跑（推送前门槛）**

```bash
cd frontend
node scripts/build-kb.mjs        # 快照与 vault 对齐
node scripts/check-kb.mjs        # 69 篇 + 字节级一致
npm test                         # 全部测试
npm run build                    # 生产构建
```
Expected: 四步全绿。若 `check-kb` 报「与 vault 源文件不一致」——说明 vault 被并行会话改过，属正常，重新生成后再跑一遍即可（内容以最新快照为准）。

- [ ] **Step 2: 提交计划文档与任何残留变更**

```bash
cd /c/Users/hwh/blog
git add docs/superpowers/plans/2026-10-05-kb-section.md
git status --short          # 确认只剩预期文件
git commit -m "docs: add kb section implementation plan"
```

- [ ] **Step 3: 推送并等待部署**

```bash
git push origin main
OLD=$(git ls-remote origin gh-pages | cut -f1)
timeout 1500 bash -c "until [ \"\$(git ls-remote origin gh-pages 2>/dev/null | cut -f1)\" != \"$OLD\" ]; do sleep 20; done; echo deployed"
git fetch origin gh-pages
git log origin/gh-pages -1 --format='%h %s'   # 应显示 deploy: <本次提交 hash>
```
Expected: gh-pages 哈希变化，部署完成。

- [ ] **Step 4: 线上复核（必做）**

```bash
# 1) 首页 200 且 bundle 已更新
curl -s -o /tmp/kb_home.html -w "%{http_code}\n" https://heliumsenbrg.github.io/ctf-writeup-blog/
grep -o 'assets/index-[A-Za-z0-9_-]*\.js' /tmp/kb_home.html

# 2) 主包含知识库入口
curl -s https://heliumsenbrg.github.io/ctf-writeup-blog/assets/<index-哈希>.js -o /tmp/kb_main.js
grep -c "知识库" /tmp/kb_main.js          # ≥1

# 3) 笔记 chunk 可从线上取到（从主包中找出 notes 动态 import 的 chunk 文件名）
grep -o 'notes/[^"]*\.js' /tmp/kb_main.js | head -3
curl -s -o /tmp/note1.js -w "%{http_code}\n" "https://heliumsenbrg.github.io/ctf-writeup-blog/assets/<chunk名>"
grep -c "先找差异" /tmp/note1.js          # ≥1（Web-SQL注入 正文）

# 4) 深链返回 SPA 回退（与 /article/* 同机制：HTTP 404 + 应用壳）
curl -s -o /tmp/kb_deep.html -w "%{http_code}\n" "https://heliumsenbrg.github.io/ctf-writeup-blog/kb/Web-SQL%E6%B3%A8%E5%85%A5"
grep -c "heliumsenbrg" /tmp/kb_deep.html  # ≥1
```
Expected: 全部符合预期；任何一步不符 → 回到 Task 排查后重新发布。

---

## Self-Review 记录

- **Spec 覆盖**：数据管线→T1；链接两段式→T2/T4；`/kb` 目录+搜索→T3；`/kb/:name` 懒加载+面包屑+上下篇→T4；Navbar/Home 入口→T5；验证与线上复核→T6；错误处理（未找到/加载失败/重试/404 回退）→T4。spec §5 的「node 断言脚本」由 `check-kb.mjs`（T1）与 vitest 组件测试（T2-T4）共同落实（见文首偏差说明）。
- **占位符扫描**：无 TBD/TODO；所有代码步骤含完整代码。
- **类型一致性**：`resolveWikiLink` 返回 `{kind:'kb',to}|{kind:'plain'}`（T2 定义，T4 消费）；`NOTES`/`PUBLISHED` 命名仅 T4 使用；`index.js` 形状 T1 定义，T3/T4 消费字段 `sections/groups/notes/total/generatedAt`。
- **Review Focus 落实**：①→T2（合成 mdast 代码节点与链接内文本用例）；②→T2 单测 + T4 真实笔记断言；③→T2 往返 + T3/T4 href 断言；④→T1 check 硬失败 + title/summary 回退；⑤→T1 字节级比对 + T6 全量重跑。
