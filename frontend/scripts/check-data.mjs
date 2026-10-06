#!/usr/bin/env node
/**
 * 数据完整性校验（仓库级，不依赖 vault / 不依赖 Vite）：
 *   node scripts/check-data.mjs   —— 任何一条不通过就 exit 1
 *
 * 校验的是"各处数据之间的引用关系"。这一类的坑已经踩过：
 *   · 首页卡片 id 指向不存在的文章（点进去 404 文章不存在）
 *   · 同一份映射被复制两份、其中一份过期（constants.js vs Challenges.jsx）
 * 所以这里把它固化成断言，CI 上拦住。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { articles } from '../src/data/articles.js'
import categories from '../src/data/categories.js'
import kb from '../src/data/kb/index.js'
import { allChallenges } from '../src/data/challenges.js'
import { friendLinks } from '../src/data/friendLinks.js'
import FLAGS from '../src/config/flags.js'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const NOTES_DIR = path.join(HERE, '..', 'src', 'data', 'kb', 'notes')

const problems = []
const info = []
const check = (ok, msg) => { if (!ok) problems.push(msg) }

/* ---------- 1. 首页卡片 ↔ 文章 ---------- */
const artKeys = Object.keys(articles)
const catIds = categories.map((c) => c.id)
for (const id of catIds) check(artKeys.includes(id), `首页卡片 id="${id}" 在 articles.js 里不存在（点进去会 404）`)
check(new Set(catIds).size === catIds.length, '首页卡片存在重复 id')
const notFeatured = artKeys.filter((k) => !catIds.includes(k))
if (notFeatured.length) info.push(`未上首页的文章 ${notFeatured.length} 篇（可能是有意为之）：${notFeatured.join(', ')}`)

/* ---------- 2. 知识库：索引 ↔ 文件 ---------- */
const files = fs.readdirSync(NOTES_DIR).filter((f) => f.endsWith('.json'))
const fileNames = new Set(files.map((f) => f.slice(0, -5)))
const notes = []
for (const s of kb.sections) for (const g of s.groups) for (const n of g.notes) notes.push(n)
const names = new Set()
for (const n of notes) {
  check(!names.has(n.name), `知识库索引重复条目：${n.name}`)
  names.add(n.name)
  check(!!n.title, `知识库 ${n.name}：缺 title`)
  check(typeof n.summary === 'string', `知识库 ${n.name}：缺 summary`)
  check(fileNames.has(n.name), `知识库索引里有 ${n.name}，但 notes/ 下没有对应文件`)
}
for (const f of fileNames) check(names.has(f), `notes/ 下有 ${f}.json，但索引里没有（孤儿笔记）`)
check(kb.total === notes.length, `kb.total(${kb.total}) ≠ 实际条目数(${notes.length})`)

for (const f of files) {
  const d = JSON.parse(fs.readFileSync(path.join(NOTES_DIR, f), 'utf8'))
  check(!!(d.content || '').trim(), `知识库 ${d.name}：正文为空`)
  for (const t of d.links?.internal ?? []) {
    check(names.has(t) || t === 'index', `知识库 ${d.name}：internal 链接「${t}」不在发布集`)
  }
}

/* ---------- 3. 挑战数据 ---------- */
const slugs = allChallenges.map((c) => c.slug)
check(new Set(slugs).size === slugs.length, 'challenges.js 存在重复 slug')
for (const c of allChallenges) {
  for (const k of ['id', 'title', 'slug', 'category', 'platform', 'points']) {
    check(c[k] !== undefined && c[k] !== '', `挑战 ${c.slug || c.id}：缺字段 ${k}`)
  }
  check(typeof c.points === 'number' && Number.isFinite(c.points), `挑战 ${c.slug}：points 不是数字`)
}
// category 必须在 Challenges.jsx 的映射表里有名字（否则界面上直接显示英文键）
const challengesSrc = fs.readFileSync(path.join(HERE, '..', 'src', 'components', 'Challenges.jsx'), 'utf8')
const mapBlock = challengesSrc.match(/const categoryNames = \{([\s\S]*?)\n\}/)
check(!!mapBlock, 'Challenges.jsx 里找不到 categoryNames 映射表')
if (mapBlock) {
  const mapped = new Set([...mapBlock[1].matchAll(/^\s*'?([\w-]+)'?\s*:/gm)].map((m) => m[1]))
  for (const k of new Set(allChallenges.map((c) => c.category))) {
    check(mapped.has(k), `挑战分类「${k}」在 categoryNames 里没有映射（界面会显示英文键名）`)
  }
}

/* ---------- 4. 友链 ---------- */
check(new Set(friendLinks.map((f) => f.url)).size === friendLinks.length, '友链存在重复 URL')
for (const f of friendLinks) {
  check(!!f.name, `友链缺 name：${f.url}`)
  check(/^https?:\/\//.test(f.url || ''), `友链 URL 非法：${f.name} → ${f.url}`)
}

/* ---------- 5. 隐藏彩蛋 ---------- */
const flagIds = FLAGS.map((f) => f.id)
check(new Set(flagIds).size === flagIds.length, 'flags.js 存在重复 id')
for (const f of FLAGS) {
  check(!!f.key, `挑战 ${f.name}：口令为空`)
  check(/^flag\{.+\}$/.test(f.flag), `挑战 ${f.name}：flag 格式不对`)
  check(!f.link || /^https?:\/\//.test(f.link), `挑战 ${f.name}：link 非法`)
  check(!f.reward || /^https?:\/\//.test(f.reward), `挑战 ${f.name}：reward 非法`)
  check((f.clues || []).length > 0, `挑战 ${f.name}：没有线索`)
}

/* ---------- 输出 ---------- */
if (problems.length) {
  console.error('✗ data check 失败：')
  for (const p of problems) console.error('  - ' + p)
  process.exit(1)
}
console.log(`✓ data check ok — 卡片 ${catIds.length} · 文章 ${artKeys.length} · 笔记 ${notes.length} · 挑战 ${allChallenges.length} · 友链 ${friendLinks.length} · 彩蛋 ${FLAGS.length}`)
for (const i of info) console.log('  ℹ️ ' + i)
