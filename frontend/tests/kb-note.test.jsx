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
