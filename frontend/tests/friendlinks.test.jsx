import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import About from '../src/components/About.jsx'
import Footer from '../src/components/Footer.jsx'
import { friendLinks } from '../src/data/friendLinks.js'

test('关于页渲染友链区，条目来自数据源', () => {
  render(<About />)
  expect(screen.getByText('友情链接')).toBeTruthy()
  for (const f of friendLinks) {
    const link = screen.getByRole('link', { name: new RegExp(f.name) })
    expect(link.getAttribute('href')).toBe(f.url)
  }
})

test('页脚友链与数据源一致', () => {
  render(<Footer />)
  for (const f of friendLinks) {
    const link = screen.getByRole('link', { name: new RegExp(f.name) })
    expect(link.getAttribute('href')).toBe(f.url)
  }
})
