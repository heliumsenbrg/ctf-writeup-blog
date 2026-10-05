import { test, expect } from 'vitest'
import remarkWikilinks from '../src/utils/remarkWikilinks.js'
import { isWikiHref, wikiTarget, isExternal, resolveWikiLink } from '../src/utils/kbLinks.js'

function run(tree) { remarkWikilinks()(tree); return tree }

test('文本节点里的 [[名]] 转成 kbnote: 链接，其余文本保留', () => {
  const tree = run({
    type: 'root', children: [
      { type: 'paragraph', children: [{ type: 'text', value: '见 [[Web-SQL注入]] 与 [[index]]。' }] },
    ],
  })
  const types = tree.children[0].children.map(n => n.type)
  expect(types).toEqual(['text', 'link', 'text', 'link', 'text'])
  expect(tree.children[0].children[1].url).toBe('kbnote:' + encodeURIComponent('Web-SQL注入'))
  expect(tree.children[0].children[1].children[0].value).toBe('Web-SQL注入')
  expect(tree.children[0].children[3].url).toBe('kbnote:index')
})

test('别名 [[名|显示]] 保留别名做显示文本', () => {
  const tree = run({
    type: 'root', children: [
      { type: 'paragraph', children: [{ type: 'text', value: '看 [[Web-SQL注入|SQL 注入页]]' }] },
    ],
  })
  const link = tree.children[0].children.find(n => n.type === 'link')
  expect(link.children[0].value).toBe('SQL 注入页')
  expect(link.url).toBe('kbnote:' + encodeURIComponent('Web-SQL注入'))
})

test('代码节点里的 [[…]] 不被转换', () => {
  const tree = run({ type: 'root', children: [{ type: 'code', value: 'x = "[[不该被转换]]"' }] })
  expect(tree.children[0].type).toBe('code')
  expect(tree.children[0].value).toBe('x = "[[不该被转换]]"')
})

test('链接节点内部不再嵌套双链转换', () => {
  const tree = run({
    type: 'root', children: [
      { type: 'paragraph', children: [
        { type: 'link', url: 'https://x', children: [{ type: 'text', value: '含 [[Web-SQL注入]] 的链接' }] },
      ] },
    ],
  })
  const link = tree.children[0].children[0]
  expect(link.type).toBe('link')
  expect(link.children[0].value).toContain('[[Web-SQL注入]]')
})

test('kbLinks：协议识别 / 目标解码 / 外链判定 / 解析分类', () => {
  const href = 'kbnote:' + encodeURIComponent('密码学-格与LLL')
  expect(isWikiHref(href)).toBe(true)
  expect(isWikiHref('https://x')).toBe(false)
  expect(wikiTarget(href)).toBe('密码学-格与LLL')
  expect(isExternal('https://github.com')).toBe(true)
  expect(isExternal('../01-原料/x.md')).toBe(false)

  const published = new Set(['Web-SQL注入'])
  expect(resolveWikiLink('index', published)).toEqual({ kind: 'kb', to: '/kb' })
  expect(resolveWikiLink('Web-SQL注入', published))
    .toEqual({ kind: 'kb', to: '/kb/' + encodeURIComponent('Web-SQL注入') })
  expect(resolveWikiLink('说明', published)).toEqual({ kind: 'plain' })
  expect(wikiTarget('kbnote:' + encodeURIComponent('Web-SQL注入'))).toBe('Web-SQL注入')
})
