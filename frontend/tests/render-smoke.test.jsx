/**
 * 渲染冒烟测试：每个页面都必须能挂载成功。
 *
 * 这条测试是为一次真实的线上事故加的：
 *   Home.jsx 引用了未导入的 platformNames，打包器不报错、本地又恰好能跑，
 *   结果线上首页对所有人白屏（ReferenceError）。
 *   渲染期异常是"整页崩"而 ESLint 类工具没接进 CI，所以直接在这里兜住 ——
 *   任何页面挂载即抛错，测试就失败。
 */
import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import Home from '../src/components/Home.jsx'
import Challenges from '../src/components/Challenges.jsx'
import Stats from '../src/components/Stats.jsx'
import About from '../src/components/About.jsx'
import Article from '../src/components/Article.jsx'
import Kb from '../src/components/Kb.jsx'
import KbNote from '../src/components/KbNote.jsx'
import HiddenQuest from '../src/components/HiddenQuest.jsx'
import NotFound from '../src/components/NotFound.jsx'
import { articles } from '../src/data/articles.js'
import kb from '../src/data/kb/index.js'

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true }

const GlitchText = ({ text }) => <span>{text}</span>
const TypewriterText = ({ text }) => <span>{text}</span>

const firstArticleSlug = Object.keys(articles)[0]
const firstKbNote = kb.sections[0].groups[0].notes[0].name

const PAGES = [
  ['首页', '/', <Home GlitchText={GlitchText} TypewriterText={TypewriterText} />],
  ['题目列表', '/challenges', <Challenges />],
  ['战绩', '/stats', <Stats />],
  ['关于', '/about', <About />],
  ['文章详情', `/article/${firstArticleSlug}`, <Article />, 'article/:id'],
  ['知识库首页', '/kb', <Kb />],
  ['知识库笔记', `/kb/${firstKbNote}`, <KbNote />, 'kb/:name'],
  ['隐藏任务', '/secret-quest', <HiddenQuest />],
  ['404', '/this-route-does-not-exist', <NotFound />],
]

// 捕获 React 打到 console.error 的渲染错误（React 会吞掉后只留日志）
const realError = console.error
let consoleErrors = []
vi.spyOn(console, 'error').mockImplementation((...args) => {
  consoleErrors.push(args.map(String).join(' '))
  realError(...args)
})

test.each(PAGES)('%s 能正常渲染且不抛异常', (_label, path, element, routePath = path) => {
  consoleErrors = []
  let result
  expect(() => {
    result = render(
      <MemoryRouter initialEntries={[path]} future={routerFuture}>
        <Routes>
          <Route path={routePath} element={element} />
        </Routes>
      </MemoryRouter>
    )
  }).not.toThrow()

  // 挂载后应真的有节点产出
  expect(result.container.innerHTML.length).toBeGreaterThan(0)

  // React 的渲染错误不会 throw，而是走 console.error + 错误边界
  const fatal = consoleErrors.filter(
    (m) =>
      /is not defined|Cannot read propert|Cannot destructure|Element type is invalid|RenderingError|ReferenceError|TypeError/i.test(m)
  )
  expect(fatal, `渲染期出现错误日志:\n${fatal.join('\n')}`).toEqual([])

  result.unmount()
})

test('首页平台筛选按钮文案来自 constants（不是 undefined）', () => {
  render(
    <MemoryRouter future={routerFuture}>
      <Home GlitchText={GlitchText} TypewriterText={TypewriterText} />
    </MemoryRouter>
  )
  expect(screen.getAllByText('CTFShow').length).toBeGreaterThan(0)
  expect(screen.queryByText('undefined')).toBeNull()
})
