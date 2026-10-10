import { test, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import KbNote from '../src/components/KbNote.jsx'
import kbIndex from '../src/data/kb/index.js'

// vitest 固定以 frontend/ 为工作目录（import.meta.url 在 vitest 下非 file: scheme）
const NOTES_DIR = path.resolve(process.cwd(), 'src/data/kb/notes')
const allNotes = kbIndex.sections.flatMap(s => s.groups.flatMap(g => g.notes))
const readNote = (name) => JSON.parse(fs.readFileSync(path.join(NOTES_DIR, name + '.json'), 'utf8'))

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
  await waitFor(() => expect(document.querySelector('#note-title')?.textContent).toBe(meta.title))
  expect(screen.getByText('知识库')).toBeTruthy()   // 面包屑
})

test('双链：站内目标渲染为链接', async () => {
  // 找一篇含站内链接的笔记（每篇都有，取第一篇即可）
  const target = allNotes.map(m => readNote(m.name)).find(n => Array.isArray(n.links.internal) && n.links.internal.length)
  expect(target).toBeTruthy()

  renderAt('/kb/' + encodeURIComponent(target.name))
  const internal = target.links.internal[0]
  await waitFor(() => {
    const links = screen.getAllByRole('link').map(a => a.getAttribute('href'))
    expect(links).toContain('/kb/' + encodeURIComponent(internal))
  })
})

/**
 * 未发布引用的**隐私保证**（2026-10-11 起，见 scripts/kb-mask.mjs）。
 *
 * 原先的断言是"找一篇含 unresolved 数组的笔记，看它渲染成 span"—— 但那套数据形状
 * 已经被有意改掉了：快照**故意不再外发 unresolved 数组**（数组里每一项就是私人页标题），
 * 正文里指向未发布页的双链也被掩码成 〖内部笔记〗。旧断言因此必挂，
 * 而它原本想保护的东西（私密内容不外泄）在新实现下应该换一种方式验。
 */
test('未发布引用不外泄：快照不带标题数组，正文以掩码呈现', async () => {
  // ① 数据层：不能有 unresolved 数组（那就是私人页标题本身），只保留条数
  const masked = []
  for (const meta of allNotes) {
    const note = readNote(meta.name)
    expect(note.links.unresolved).toBeUndefined()
    expect(typeof note.links.unresolvedCount).toBe('number')
    if (note.content.includes('〖内部笔记〗')) masked.push(note)
  }

  // ② 必须真的存在被掩码的笔记，否则上面那条断言只是空转、保护不到任何东西
  expect(masked.length).toBeGreaterThan(0)

  // ③ 渲染层：掩码文字照常显示，且**没有残留的双链语法**（说明该掩的都掩了）
  const sample = masked[0]
  renderAt('/kb/' + encodeURIComponent(sample.name))
  await waitFor(() => expect(document.querySelector('#note-title')?.textContent).toBe(sample.title))

  expect(screen.getAllByText(/〖内部笔记〗/).length).toBeGreaterThan(0)
  expect(document.body.innerHTML).not.toContain('[[')
})

test('index 重定向到 /kb，未知笔记给出未找到提示', async () => {
  renderAt('/kb/index')
  await waitFor(() => expect(screen.getByText('KB_HOME')).toBeTruthy())

  renderAt('/kb/' + encodeURIComponent('不存在的页面xyzzy'))
  await waitFor(() => expect(screen.getByText(/未找到/)).toBeTruthy())
})
