/**
 * 动态 Flag 配置 · 隐藏挑战
 *
 * 加密方案 v2（比 v1 的裸 XOR 难得多，全部自研无依赖）：
 *   明文 → XOR(xorshift32 密钥流) → 前置 6 字节随机盐 → 整体反转 → Base64URL
 *   密钥流种子 = FNV-1a(口令 + '::' + 盐的 hex)
 *
 * 难度提升点：
 *   1. 输出不再是 hex，而是「反序 + Base64URL」的载荷，看不出是 XOR；
 *   2. 每次渲染随机盐，密文不可复用、不可硬编码；
 *   3. 页面 DOM 里不再有明文口令，只有 Base64URL(反转(口令))；
 *   4. 页面与控制台均不再提示算法与口令长度。
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

/* ---------- 低层原语 ---------- */

/** FNV-1a 32 位散列，用于把口令派生为 PRNG 种子 */
function fnv1a(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

/** xorshift32 密钥流；逐字节取不同位段，避免只用低位 */
function keystream(seed, len) {
  let x = (seed >>> 0) || 0x9e3779b9
  const out = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    x ^= x << 13; x >>>= 0
    x ^= x >>> 17; x >>>= 0
    x ^= x << 5;  x >>>= 0
    out[i] = (x >>> ((i % 4) * 8)) & 0xff
  }
  return out
}

function bytesToB64(bytes) {
  let s = ''
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
  return btoa(s)
}

function b64ToBytes(str) {
  const s = atob(str)
  const out = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i)
  return out
}

/** Base64 → Base64URL（去掉填充与 +/） */
export function toB64Url(bytes) {
  return bytesToB64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Base64URL → 字节 */
export function fromB64Url(str) {
  const s = String(str).trim().replace(/-/g, '+').replace(/_/g, '/')
  const pad = s.length % 4 ? s + '='.repeat(4 - (s.length % 4)) : s
  return b64ToBytes(pad)
}

/* ---------- 对外：加密 / 解密 / 口令混淆 ---------- */

function makeNonce(n = 6) {
  const nonce = new Uint8Array(n)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(nonce)
  } else {
    for (let i = 0; i < n; i++) nonce[i] = Math.floor(Math.random() * 256)
  }
  return nonce
}

function nonceHex(nonce) {
  return Array.from(nonce, b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * 加密：明文 + 口令 → Base64URL 载荷
 * 结构（反转前）：[6 字节盐][密文]
 */
export function computeCipher(plain, passphrase) {
  const data = new TextEncoder().encode(plain)
  const nonce = makeNonce(6)
  const ks = keystream(fnv1a(passphrase + '::' + nonceHex(nonce)), data.length)
  const ct = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) ct[i] = data[i] ^ ks[i]
  const buf = new Uint8Array(nonce.length + ct.length)
  buf.set(nonce, 0)
  buf.set(ct, nonce.length)
  return toB64Url(buf.reverse())
}

/** 解密：Base64URL 载荷 + 口令 → 明文（供自测与解题器复用） */
export function decryptCipher(payload, passphrase) {
  const raw = fromB64Url(payload).reverse()
  const nonce = raw.slice(0, 6)
  const ct = raw.slice(6)
  const ks = keystream(fnv1a(passphrase + '::' + nonceHex(nonce)), ct.length)
  const pt = new Uint8Array(ct.length)
  for (let i = 0; i < ct.length; i++) pt[i] = ct[i] ^ ks[i]
  return new TextDecoder().decode(pt)
}

/** 口令混淆：反转字节后再 Base64URL，挂在 DOM 上供玩家“剥壳” */
export function encodeKey(passphrase) {
  return toB64Url(new Uint8Array(Array.from(new TextEncoder().encode(passphrase)).reverse()))
}

/** 还原被混淆的口令 */
export function decodeKey(token) {
  return new TextDecoder().decode(fromB64Url(token).reverse())
}

/* ---------- 挑战数据 ---------- */

/** 「永不言败」的通关奖励：B 站官方 MV，想换视频只改这一行 */
export const NEVER_GIVE_UP_URL = 'https://www.bilibili.com/video/BV1GJ411x7h7'

const FLAGS = [
  {
    id: 'genshin',
    name: '原神，启动！',
    link: 'https://ys.mihoyo.com/',
    linkLabel: '官网 · 原神',
    flag: 'flag{53cr3t_und3r_7h3_m00n!}',
    key: 'genshin',
    clues: [
      '载荷被套了三层壳：反序、编码，还有一层你自己得猜。',
      '开头的 6 个字节是随机盐，不是密文本身。',
      '密钥流由「口令 + 盐」派生 —— 口令就藏在页面 DOM 的角落里。',
      'DOM 里的口令是「反转 + Base64」处理过的；内容是那款总被人喊「启动」的游戏（英文小写）。',
    ],
    victory: {
      emoji: '✨🌟⚡',
      title: '「原神，启动！」',
      message: '你感受到了七种元素的力量在体内涌动！',
      bgColor: 'linear-gradient(135deg, rgba(120,53,15,0.3), rgba(146,64,14,0.2))',
      particleColor: '#fbbf24',
      particleCount: 80,
    },
    reward: 'https://ys.mihoyo.com/main/download/',   // 国服，不用 hoyoverse（外服）
    consoleMsg: [
      '[SECRET QUEST]',
      'Cipher v2 · three layers, no manual',
      'Layers: keystream XOR -> random salt -> reversed base64url',
      'The passphrase is obfuscated, not hidden by luck...',
      'Read the DOM. Read the clues. Then write six lines of code.',
    ],
  },
  {
    id: 'starrail',
    name: '崩坏：星穹铁道',
    link: 'https://sr.mihoyo.com/',
    linkLabel: '官网 · 星穹铁道',
    flag: 'flag{7r41n_70_7h3_s74r5!}',
    key: 'starrail',
    clues: [
      '这一题的载荷同样反序 + Base64URL 了。',
      '盐是随机生成的，每次刷新密文都会变 —— 别想抄上一次的。',
      '密钥流不是固定密钥，而是由口令经 FNV-1a 派生后跑 xorshift32。',
      '口令 = 那趟列车的英文名，全小写连写（8 个字母）。',
    ],
    victory: {
      emoji: '🚀🌠🌌',
      title: '「星穹列车，启程！」',
      message: '列车驶出空间站，群星在你脚下流淌...',
      bgColor: 'linear-gradient(135deg, rgba(30,58,138,0.3), rgba(88,28,135,0.2))',
      particleColor: '#60a5fa',
      particleCount: 100,
    },
    reward: 'https://sr.mihoyo.com/download/',       // 国服，不用 hoyoverse（外服）
    consoleMsg: [
      '[SECRET QUEST: STARRAIL]',
      'Cipher v2 · the stars are salted',
      'Salt: 6 random bytes, prepended before reversal',
      'Keystream: FNV-1a(passphrase :: salt) -> xorshift32',
      'The answer is written among the constellations...',
    ],
  },
  {
    id: 'custom',
    name: '疯狂星期四',
    link: 'https://search.bilibili.com/all?keyword=%E7%96%AF%E7%8B%82%E6%98%9F%E6%9C%9F%E5%9B%9B',
    linkLabel: 'B站 · 疯狂星期四',
    flag: 'flag{cu570m_ch4113n63!}',
    key: 'custom',
    clues: [
      '自定义挑战：v2 全部三层壳，一个不少。',
      '你可以在 config/flags.js 里换掉 flag、口令和名称。',
      '口令同样被反转 + Base64 挂在 DOM 上。',
      'V 我 50，我就把口令告诉你。',
    ],
    victory: {
      emoji: '🎉🏆🎊',
      title: '「挑战完成！」',
      message: '自定义挑战已通关，你已经掌握了隐藏关卡的秘密！',
      bgColor: 'linear-gradient(135deg, rgba(136,19,55,0.3), rgba(131,24,67,0.2))',
      particleColor: '#f472b6',
      particleCount: 70,
    },
    reward: 'https://www.kfc.com.cn/',
    rewardLabel: 'V 我 50',
    consoleMsg: [
      '[SECRET QUEST: CUSTOM]',
      'Custom challenge unlocked',
      'Cipher v2 · user defined, still three layers',
      'The key is in your hands...',
    ],
  },
  {
    id: 'nevergiveup',
    name: '永不言败',
    // 刻意不给外部链接：那个 MV 是「做出来之后」的奖励，提前挂出来就没意思了
    link: '',
    linkLabel: '',
    flag: 'flag{n3v3r_g0nn4_g1v3_y0u_up}',
    key: 'rickroll',
    clues: [
      '这是一道永远不会放弃你的题。',
      '它的名字来自一首歌 —— 一首「绝不会放弃你」的歌。',
      '口令 = 那个「把人骗去看 MV」的经典梗名（英文，8 个字母，小写）。',
      '口令 = r______l。补全它，做出来就有彩蛋等着你。',
    ],
    victory: {
      emoji: '🎵🕺🔗',
      title: '「Never Gonna Give You Up」',
      message: '你被套路了 —— 而且你心甘情愿。',
      bgColor: 'linear-gradient(135deg, rgba(190,24,93,0.3), rgba(131,24,67,0.2))',
      particleColor: '#f472b6',
      particleCount: 90,
    },
    reward: NEVER_GIVE_UP_URL,
    rewardLabel: '去 B 站看 MV',
    consoleMsg: [
      '[SECRET QUEST: NEVER GIVE UP]',
      'Cipher v2 · three layers, same as the others',
      'This one will never give you up...',
      'No external link here — the name is the hint.',
    ],
  },
]

/**
 * 根据 flag ID 获取配置
 */
export function getFlagConfig(id) {
  return FLAGS.find(f => f.id === id) || FLAGS[0]
}

export default FLAGS
