import { describe, it, expect } from 'vitest'
import { containsMath } from '../src/hooks/useKatex.js'

/**
 * 这套判定的意义：命中就代表"要多下 171KB gzip 的 KaTeX"。
 * 误判（把代码当公式）会让所有含 `_$$ND_FUNC$$_` 的笔记白白变慢，
 * 所以反例比正例更重要。
 */
describe('containsMath', () => {
  it('识别块级与行内公式', () => {
    expect(containsMath('求 $$a^2+b^2=c^2$$ 的值')).toBe(true)
    expect(containsMath('其中 $p$ 与 $q$ 为大素数')).toBe(true)
    expect(containsMath('$$\\frac{a}{b}$$')).toBe(true)
  })

  it('代码里的 $$ 不算公式（反序列化笔记的真实踩坑）', () => {
    expect(containsMath('`_$$ND_FUNC$$_` 是 node-serialize 的特征')).toBe(false)
    expect(containsMath('```bash\necho $$\nps aux | grep $$\n```')).toBe(false)
  })

  it('普通文本与空内容不误判', () => {
    expect(containsMath('')).toBe(false)
    expect(containsMath(undefined)).toBe(false)
    expect(containsMath('价格 100 元，没有公式')).toBe(false)
  })

  it('转义美元符号不当公式', () => {
    expect(containsMath('价格是 \\$5 和 \\$8')).toBe(false)
  })
})
