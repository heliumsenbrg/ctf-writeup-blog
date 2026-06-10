// 阅读时间估算：中文约 400 字/分钟，英文约 200 词/分钟
export function getReadingTime(content) {
  if (!content) return 1
  // 统计中文字符数
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length
  // 统计英文单词数（连续字母序列）
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length
  // 去除代码块后的纯文本字数（代码不计入阅读时间）
  const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).join('')
  const codeChineseChars = (codeBlocks.match(/[\u4e00-\u9fa5]/g) || []).length
  const codeEnglishWords = (codeBlocks.match(/[a-zA-Z]+/g) || []).length
  const pureChinese = chineseChars - codeChineseChars
  const pureEnglish = englishWords - codeEnglishWords
  // 中文 400 字/分钟，英文 200 词/分钟
  const minutes = Math.ceil(pureChinese / 400 + pureEnglish / 200)
  return Math.max(1, minutes)
}
