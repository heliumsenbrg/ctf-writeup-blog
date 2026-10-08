// Shared constants used across components

export const SAKURA_COLORS = [
  'rgba(255, 183, 197, 0.75)',
  'rgba(255, 212, 221, 0.7)',
  'rgba(248, 180, 195, 0.8)',
  'rgba(255, 220, 228, 0.65)',
]

/**
 * 平台 / 分类的显示名与配色 —— **唯一来源**，Challenges、Home、Stats 都从这里导入。
 *
 * 血泪教训：这些映射此前散落在组件里，还出现过"组件里用、但没导入"的裸标识符
 * （Home.jsx 用了 platformNames 却没 import），本地因为打包恰好把两个模块
 * 放进同一作用域而"看起来能跑"，一旦改变分包边界就立刻 ReferenceError → 整页崩。
 * 所以：映射只留一份，且放在 data/ 里，谁都可以安全导入。
 */
export const platformNames = {
  all: { name: '全部靶场', color: 'cyan' },
  ctfshow: { name: 'CTFShow', color: 'blue' },
  qingcen: { name: '青岑 QC', color: 'purple' },
  moectf: { name: 'MoeCTF', color: 'pink' },
  other: { name: '其他', color: 'cyan' },
}

export const categoryNames = {
  infoleak: { name: '信息收集与泄露', color: 'cyan' },
  php: { name: 'PHP 弱类型', color: 'purple' },
  cmd: { name: '命令注入', color: 'pink' },
  pwn: { name: 'PWN 与逆向', color: 'blue' },
  web: { name: 'Web 练习', color: 'cyan' },
  reverse: { name: '逆向工程', color: 'purple' },
  crypto: { name: '密码学', color: 'pink' },
  stego: { name: '隐写术', color: 'cyan' },
  misc: { name: '杂项', color: 'blue' },
  tools: { name: '工具', color: 'cyan' },
  'moectf-emoji': { name: '编码与进制', color: 'cyan' },
  'moectf-zipcrypto': { name: '压缩包密码学', color: 'purple' },
}
