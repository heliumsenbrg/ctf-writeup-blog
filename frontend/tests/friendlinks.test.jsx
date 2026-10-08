import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import About from '../src/components/About.jsx'
import Footer from '../src/components/Footer.jsx'
import { friendLinks } from '../src/data/friendLinks.js'

/**
 * 友链区在两种状态下都要正确：
 *   有友链 → 标题 + 每个条目都能渲染、href 与数据源一致
 *   无友链 → **整块隐藏**，不留孤零零的 "FRIEND LINKS" 标题或空分隔线
 *            （2026-10-09 主人要求清空友链，这条是那次改动的回归保护）
 */
const hasLinks = friendLinks.length > 0

test('关于页友链区随数据源变化', () => {
  render(<About />)

  if (hasLinks) {
    expect(screen.getByText('友情链接')).toBeTruthy()
    for (const f of friendLinks) {
      const link = screen.getByRole('link', { name: new RegExp(f.name) })
      expect(link.getAttribute('href')).toBe(f.url)
    }
  } else {
    // 没有友链时不应出现空标题
    expect(screen.queryByText('友情链接')).toBeNull()
    // 但「申请友链」入口必须保留 —— 否则没人能申请加回来
    expect(screen.getByText(/申请友链/)).toBeTruthy()
  }
})

test('页脚友链与数据源一致，空数据时整块隐藏', () => {
  const { container } = render(<Footer />)

  if (hasLinks) {
    for (const f of friendLinks) {
      const link = screen.getByRole('link', { name: new RegExp(f.name) })
      expect(link.getAttribute('href')).toBe(f.url)
    }
  } else {
    expect(screen.queryByText('FRIEND LINKS')).toBeNull()
    // 友链那一圈 border-t 分隔线要一起消失。
    // 剩下 2 条：<footer> 自身的上边框 + 底部那句日文装饰的分隔线。
    // ⚠️ 页脚以后新增别的 border-t 分隔线时，这个数字要跟着改。
    expect(container.querySelectorAll('.border-t').length).toBe(2)
  }
})
