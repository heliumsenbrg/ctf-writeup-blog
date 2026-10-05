import { test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '../src/components/Footer.jsx'

test('页脚渲染友链：懒羊羊大佬', () => {
  render(<Footer />)
  const link = screen.getByRole('link', { name: /懒羊羊大佬/ })
  expect(link.getAttribute('href')).toBe('https://yangleduo0629-cloud.github.io/-/#/')
  expect(link.getAttribute('target')).toBe('_blank')
})
