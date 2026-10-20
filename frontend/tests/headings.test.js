import { describe, it, expect } from 'vitest'
import { headingSlug, parseHeadings } from '../src/utils/headings.js'

describe('headings：目录锚点必须与正文 id 一致', () => {
  it('保留词内下划线（basic_1 / one_gadget）', () => {
    const [h] = parseHeadings('## basic_1 (178) - Base64 解码')
    expect(h.id).toBe(headingSlug('basic_1 (178) - Base64 解码'))
    expect(h.id).toContain('basic_1')
    expect(h.id).not.toContain('basic1')
  })

  it('去掉真正的强调标记', () => {
    expect(parseHeadings('## **Bold** title')[0].id).toBe('bold-title')
    expect(parseHeadings('## _italic_ title')[0].id).toBe('italic-title')
    expect(parseHeadings('## `code` title')[0].id).toBe('code-title')
  })

  it('忽略代码块里的 # 注释', () => {
    const md = ['## 真标题', '```bash', '# 这是注释', '```'].join('\n')
    const hs = parseHeadings(md)
    expect(hs).toHaveLength(1)
    expect(hs[0].text).toBe('真标题')
  })
})
