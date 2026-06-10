/**
 * 动态 Flag 配置
 * 每个条目是一个隐藏挑战，支持独立 flag、密钥、提示和胜利特效
 */
function randHex(n) {
  let s = ''
  for (let i = 0; i < n; i++) s += '0123456789abcdef'[Math.floor(Math.random() * 16)]
  return s
}

/** 生成动态 flag：基础部分 + 随机后缀 */
export function generateFlag(baseFlag) {
  return baseFlag.replace('}', '_' + randHex(4) + '}')
}

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
    victory: {
      emoji: '✨🌟⚡',
      title: '「原神，启动！」',
      message: '你感受到了七种元素的力量在体内涌动！',
      bgColor: 'linear-gradient(135deg, rgba(120,53,15,0.3), rgba(146,64,14,0.2))',
      particleColor: '#fbbf24',
      particleCount: 80,
    },
    reward: 'https://genshin.hoyoverse.com/en/download',
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
    victory: {
      emoji: '🚀🌠🌌',
      title: '「星穹列车，启程！」',
      message: '列车驶出空间站，群星在你脚下流淌...',
      bgColor: 'linear-gradient(135deg, rgba(30,58,138,0.3), rgba(88,28,135,0.2))',
      particleColor: '#60a5fa',
      particleCount: 100,
    },
    reward: 'https://hsr.hoyoverse.com/',
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
    victory: {
      emoji: '🗡️🛡️👑',
      title: '「勇气、智慧、力量」',
      message: '大师之剑发出耀眼光芒，海拉鲁的危机解除了！',
      bgColor: 'linear-gradient(135deg, rgba(20,83,45,0.3), rgba(6,78,59,0.2))',
      particleColor: '#34d399',
      particleCount: 60,
    },
    reward: 'https://www.zelda.com/',
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
    victory: {
      emoji: '💊🔮🕶️',
      title: '「你选择了红色药丸」',
      message: '代码之雨倾泻而下，你看到了真实的矩阵世界！',
      bgColor: 'linear-gradient(135deg, rgba(6,78,59,0.3), rgba(5,46,22,0.2))',
      particleColor: '#00ff41',
      particleCount: 120,
    },
    reward: 'https://www.warnerbros.com/movies/matrix',
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
    victory: {
      emoji: '🌙👨‍🚀🚩',
      title: '「这是我的一小步」',
      message: '月球表面留下你的足迹，人类探索永不止步！',
      bgColor: 'linear-gradient(135deg, rgba(15,23,42,0.3), rgba(17,24,39,0.2))',
      particleColor: '#cbd5e1',
      particleCount: 40,
    },
    reward: 'https://www.nasa.gov/moon/',
    consoleMsg: [
      '[SECRET QUEST: MOON]',
      "That's one small step...",
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
    victory: {
      emoji: '🎉🏆🎊',
      title: '「挑战完成！」',
      message: '自定义挑战已通关，你已经掌握了隐藏关卡的秘密！',
      bgColor: 'linear-gradient(135deg, rgba(136,19,55,0.3), rgba(131,24,67,0.2))',
      particleColor: '#f472b6',
      particleCount: 70,
    },
    reward: '',
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
 * 将 flag 和密钥编码为 UTF-8 字节再进行 XOR 运算
 */
export function computeCipherHex(flag, key) {
  const encoder = new TextEncoder()
  const flagBytes = encoder.encode(flag)
  const keyBytes = encoder.encode(key)
  let h = ''
  for (let i = 0; i < flagBytes.length; i++) {
    h += (flagBytes[i] ^ keyBytes[i % keyBytes.length])
      .toString(16).padStart(2, '0')
  }
  return h
}

export default FLAGS
