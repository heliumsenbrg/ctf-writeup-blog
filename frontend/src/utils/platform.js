// 平台字段的写法不统一（CTFShow / QingCen / ctf.show / 多平台…），统一归一为筛选键
export function platformKey(p = '') {
  const s = String(p).toLowerCase()
  if (s.includes('ctfshow') || s.includes('ctf.show')) return 'ctfshow'
  if (s.includes('qingcen')) return 'qingcen'
  if (s.includes('moectf')) return 'moectf'
  return 'other'
}

// 平台徽标（label 为空则回退显示原始 platform 文本）
export const PLATFORM_BADGE = {
  ctfshow: { label: 'CTFShow', className: 'bg-blue-900/40 text-blue-400' },
  qingcen: { label: 'QC 青岑', className: 'bg-purple-900/40 text-purple-400' },
  moectf: { label: 'MoeCTF', className: 'bg-pink-900/40 text-pink-400' },
  other: { label: '', className: 'bg-cyber-grid/20 text-cyber-grid' },
}
