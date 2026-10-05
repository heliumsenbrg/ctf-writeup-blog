import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../src/components/Navbar.jsx'

test('导航栏包含知识库入口（桌面与移动菜单均指向 /kb）', () => {
  render(<MemoryRouter><Navbar /></MemoryRouter>)
  const links = screen.getAllByRole('link', { name: /知识库/ })
  expect(links.length).toBeGreaterThan(0)
  for (const l of links) expect(l.getAttribute('href')).toBe('/kb')
})
