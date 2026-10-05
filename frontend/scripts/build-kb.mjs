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
