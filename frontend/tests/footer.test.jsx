import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '../src/components/Footer.jsx'

/**
 * 页脚测试只覆盖**页脚自己的内容**，不要断言具体某条友链。
 *
 * 原来这里写死了「页脚渲染友链：懒羊羊大佬」，2026-10-09 主人清空友链后直接红掉 ——
 * 友链属于会变的数据，它的渲染由 tests/friendlinks.test.jsx 统一覆盖。
 */
test('页脚渲染基本内容', () => {
  render(<Footer />)
  expect(screen.getByText(/CTF WriteUp/)).toBeTruthy()
  expect(screen.getByText(/SYSTEM_ONLINE/)).toBeTruthy()
  expect(screen.getByText(/别放过任何细节/)).toBeTruthy()
})
