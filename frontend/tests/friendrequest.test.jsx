import { test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import About from '../src/components/About.jsx'
import { buildFriendIssueUrl } from '../src/utils/friendRequest.js'

test('buildFriendIssueUrl 组装预填的 GitHub Issue 链接', () => {
  const u = buildFriendIssueUrl('懒羊羊大佬', 'https://yangleduo0629-cloud.github.io/-/#/')
  expect(u.startsWith('https://github.com/heliumsenbrg/ctf-writeup-blog/issues/new?')).toBe(true)
  expect(u).toContain('title=' + encodeURIComponent('友链申请：懒羊羊大佬'))
  const body = decodeURIComponent(u.split('body=')[1])
  expect(body).toContain('懒羊羊大佬')
  expect(body).toContain('https://yangleduo0629-cloud.github.io/-/#/')
})

test('buildFriendIssueUrl 对空值 / 非法协议返回 null', () => {
  expect(buildFriendIssueUrl('', 'https://x.com')).toBe(null)
  expect(buildFriendIssueUrl('名字', '')).toBe(null)
  expect(buildFriendIssueUrl('名字', 'javascript:alert(1)')).toBe(null)
  expect(buildFriendIssueUrl('名字', 'ftp://x')).toBe(null)
})

test('友链区表单：填写合法内容提交后打开预填 Issue', () => {
  const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
  render(<About />)
  fireEvent.change(screen.getByPlaceholderText('你的名称'), { target: { value: '测试朋友' } })
  fireEvent.change(screen.getByPlaceholderText(/你的链接/), { target: { value: 'https://example.com/' } })
  fireEvent.click(screen.getByRole('button', { name: /提交申请/ }))

  expect(openSpy).toHaveBeenCalledTimes(1)
  const calledUrl = openSpy.mock.calls[0][0]
  expect(calledUrl).toContain('/issues/new?')
  expect(decodeURIComponent(calledUrl)).toContain('测试朋友')
  expect(decodeURIComponent(calledUrl)).toContain('https://example.com/')
  expect(screen.getByText(/已打开 GitHub/)).toBeTruthy()
  openSpy.mockRestore()
})

test('友链区表单：非法链接给出提示且不打开窗口', () => {
  const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
  render(<About />)
  fireEvent.change(screen.getByPlaceholderText('你的名称'), { target: { value: 'x' } })
  fireEvent.change(screen.getByPlaceholderText(/你的链接/), { target: { value: '不是链接' } })
  fireEvent.click(screen.getByRole('button', { name: /提交申请/ }))

  expect(openSpy).not.toHaveBeenCalled()
  expect(screen.getByText(/链接需以 http/)).toBeTruthy()
  openSpy.mockRestore()
})
