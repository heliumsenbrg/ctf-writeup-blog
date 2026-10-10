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
import { maskUnpublished } from './kb-mask.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const KB_DIR = path.join(HERE, '..', 'src', 'data', 'kb')
const NOTES_DIR = path.join(KB_DIR, 'notes')
const VAULT = process.env.KB_VAULT || 'C:\\Users\\hwh\\Desktop\\知识库\\hsb的第二大脑\\02-笔记'
// CI 或别人的机器上没有这个 vault → 跳过"与源文件字节一致"这一项，其余检查照跑
const HAS_VAULT = fs.existsSync(VAULT)

const problems = []
const check = (ok, msg) => { if (!ok) problems.push(msg) }

const flat = kbIndex.sections.flatMap(s => s.groups.flatMap(g => g.notes))
check(kbIndex.total === flat.length, `index.total(${kbIndex.total}) ≠ 实际条目数(${flat.length})`)
check(flat.length === 69, `篇数应为 69，实际 ${flat.length}`)

// 第一遍：收集全量 name 集（链接闭包校验必须对全集判断），顺带重名检测
const names = new Set()
for (const meta of flat) {
  check(!names.has(meta.name), `重复条目: ${meta.name}`)
  names.add(meta.name)
}

// 第二遍：逐篇校验
for (const meta of flat) {
  check(!!meta.title, `${meta.name}: 缺 title`)
  check(typeof meta.summary === 'string', `${meta.name}: 缺 summary 字段`)
  const p = path.join(NOTES_DIR, `${meta.name}.json`)
  if (!fs.existsSync(p)) { problems.push(`${meta.name}: 缺 notes/${meta.name}.json`); continue }
  const note = JSON.parse(fs.readFileSync(p, 'utf8'))
  check(note.content?.trim().length > 0, `${meta.name}: 正文为空`)
    if (HAS_VAULT) {
      const src = findSource(meta.name)
      check(src !== null, `${meta.name}: vault 中找不到对应 md 文件`)
      // 与 vault 比对时，也要套用与生成端**同一套**屏蔽规则（kb-mask.mjs），
      // 否则会把"未发布引用被屏蔽"误判成快照漂移
      if (src) {
        const expected = maskUnpublished(fs.readFileSync(src, 'utf8'), new Set([...names, 'index']))
        check(expected === note.content, `${meta.name}: 与 vault 源文件不一致（快照漂移？重跑 build-kb.mjs）`)
      }
    }
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
console.log(`✓ kb check ok — ${flat.length} 篇，链接闭包完整` + (HAS_VAULT ? '，与 vault 一致' : '（本机无 vault，已跳过源文件比对）'))
