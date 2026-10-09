import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import About from '../src/components/About.jsx'
import Footer from '../src/components/Footer.jsx'
import { friendLinks } from '../src/data/friendLinks.js'

/**
 * 友链的展示位置（2026-10-09 主人明确要求）：
 *   「关于」页 —— **保留**
 *   页脚「底部」 —— **删掉**
 * 这两条一起构成回归保护：以后谁把友链加回页脚，或者把关于页的删了，都会红。
 */

test('「关于」页展示友链，条目与数据源一致', () => {
  render(<About />)

  expect(screen.getByText('友情链接')).toBeTruthy()
  expect(friendLinks.length).toBeGreaterThan(0) // 空数据会让下面的循环变成空转，失去意义

  for (const f of friendLinks) {
    const link = screen.getByRole('link', { name: new RegExp(f.name) })
    expect(link.getAttribute('href')).toBe(f.url)
    expect(link.getAttribute('target')).toBe('_blank')
  }
})

test('页脚不再展示友链', () => {
  render(<Footer />)

  expect(screen.queryByText('FRIEND LINKS')).toBeNull()
  for (const f of friendLinks) {
    expect(screen.queryByRole('link', { name: new RegExp(f.name) })).toBeNull()
  }
})
