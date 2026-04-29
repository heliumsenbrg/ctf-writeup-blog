/**
 * 动态 Flag 配置
 * 每个条目是一个隐藏挑战，支持独立 flag、密钥、提示和跳转目标
 */
const FLAGS = [
  {
    id: 'genshin',
    name: '原神冲击',
    flag: 'flag{53cr3t_und3r_7h3_m00n!}',
    key: 'genshin',
    clues: [
      '密文由 XOR 加密，密钥隐藏在页面中...',
      '检查页面源代码，有一个隐藏的提示...',
      'CSS 中藏着一个看不见的"钥匙"',
      '密钥 = 一款热门游戏的英文名（7个字母）',
    ],
    redirectUrl: 'https://genshin.hoyoverse.com/en/download',
    redirectText: '正在下载原神...',
    consoleMsg: [
      '[SECRET QUEST]',
      'Encryption: XOR with hidden key',
      'Key length: 7 characters',
      'Look closely at the page elements...',
    ],
  },
  {
    id: 'starrail',
    name: '星穹铁道',
    flag: 'flag{7r41n_70_7h3_s74r5!}',
    key: 'starrail',
    clues: [
      '挑战来自星辰大海...',
      '密钥藏在某列车的名字中',
      '提示：星历 2156 年',
      '密钥 = 一款科幻 RPG（8个字母）',
    ],
    redirectUrl: 'https://hsr.hoyoverse.com/',
    redirectText: '正在登录星穹列车...',
    consoleMsg: [
      '[SECRET QUEST: STARRAIL]',
      'Encryption: XOR - cipher of the stars',
      'Key length: 8 characters',
      'The answer is written among the constellations...',
    ],
  },
  {
    id: 'zelda',
    name: '塞尔达传说',
    flag: 'flag{hyrul3_4w4k3n5!}',
    key: 'zelda',
    clues: [
      '海拉鲁王国有一个古老的传说...',
      '密钥与公主有关',
      '金币之上，勇者之名',
      '密钥 = 任天堂公主之名（5个字母）',
    ],
    redirectUrl: 'https://www.zelda.com/',
    redirectText: '正在前往海拉鲁...',
    consoleMsg: [
      '[SECRET QUEST: ZELDA]',
      'Encryption: XOR - ancient Hylian cipher',
      'Key length: 5 characters',
      'Courage, Wisdom, Power... find the missing piece...',
    ],
  },
  {
    id: 'hacker',
    name: '黑客帝国',
    flag: 'flag{r3d_p1ll_0r_blu3_p1ll}',
    key: 'matrix',
    clues: [
      '你选择红色药丸还是蓝色药丸？',
      '密钥隐藏在一个流行的电影三部曲中',
      '提醒：这不是科幻，这是现实',
      '密钥 = 电影宇宙名（6个字母）',
    ],
    redirectUrl: 'https://www.warnerbros.com/movies/matrix',
    redirectText: '正在脱离矩阵...',
    consoleMsg: [
      '[SECRET QUEST: MATRIX]',
      'Wake up, Neo...',
      'Encryption: XOR - the construct',
      'Key length: 6 characters',
      'Follow the white rabbit...',
    ],
  },
  {
    id: 'moon',
    name: '月球探秘',
    flag: 'flag{0n3_5m411_5t3p}',
    key: 'moon',
    clues: [
      '阿姆斯特朗留下了什么？',
      '密钥藏在那个著名的脚印里',
      '1969 年 7 月 20 日',
      '密钥 = 地球的卫星（4个字母）',
    ],
    redirectUrl: 'https://www.nasa.gov/moon/',
    redirectText: '正在登录月球...',
    consoleMsg: [
      '[SECRET QUEST: MOON]',
      'That\'s one small step...',
      'Encryption: XOR - lunar cipher',
      'Key length: 4 characters',
      'Look to the stars...',
    ],
  },
  {
    id: 'custom',
    name: '自定义挑战',
    flag: 'flag{cu570m_ch4113n63!}',
    key: 'custom',
    clues: [
      '这是一个自定义挑战入口',
      '你可以在 config/flags.js 中修改 flag 和密钥',
      '密钥就在你自己手中',
      '用你的智慧解密吧！',
    ],
    redirectUrl: 'https://ctf-writeup-blog-omega.vercel.app/',
    redirectText: '挑战成功！',
    consoleMsg: [
      '[SECRET QUEST: CUSTOM]',
      'Custom challenge unlocked',
      'Encryption: XOR - user defined',
      'The key is in your hands...',
    ],
  },
]

/**
 * 根据 flag ID 获取配置
 */
export function getFlagConfig(id) {
  return FLAGS.find(f => f.id === id) || FLAGS[0]
}

/**
 * 计算 XOR 密文（hex）
 */
export function computeCipherHex(flag, key) {
  let h = ''
  for (let i = 0; i < flag.length; i++) {
    h += (flag.charCodeAt(i) ^ key.charCodeAt(i % key.length))
      .toString(16).padStart(2, '0')
  }
  return h
}

export default FLAGS
