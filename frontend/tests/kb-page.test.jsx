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
