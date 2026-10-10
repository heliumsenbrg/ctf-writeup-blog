/**
 * 文章发布日期 —— RSS pubDate / sitemap lastmod / 按月归档 的数据源。
 *
 * 为什么单独一个文件：articles.js 里每条正文都很长，往里塞字段容易改坏；
 * 日期是"元数据"，跟 categories.js 一样做成 sidecar 更清楚。
 *
 * ⚠️ 证据等级（主人可据此校正）：
 *   [实] 有直接证据 —— 正文页脚「生成时间」或 subtitle 自带日期
 *   [挑] 由挑战数据推出 —— 该分类下挑战的最晚解题日期，约等于文章完成时间
 *   [推] 由挑战 slug 推断 —— 题号/主题与文章对应
 *   [史] 由 git 历史推出 —— 首次进入本仓的提交日期（≈写作完成日），见各条注释里的 commit
 *   [缺] 完全没线索 —— 留 null，RSS 与 sitemap 会跳过它（而不是拿构建时间冒充）
 */
export const articleDates = {
  // [实] 直接证据
  'may-2026': '2026-05-06', // 正文页脚「生成时间: 2026-05-06」
  'qingcen-web-2026-06-10': '2026-06-10', // subtitle「2026-06-10 | 17/20 题」
  '0xgame2025': '2026-06-16', // subtitle「2026-06-16 | 16/28 题」

  // [挑] 按挑战分类推出的最晚日期
  tools: '2026-01-05', // tools 分类（1 题）
  infoleak: '2026-01-15', // infoleak 分类 2026-01-10 ~ 01-15（14 题）
  php: '2026-02-05', // php 分类 02-01 ~ 02-05（9 题）
  cmd: '2026-02-16', // cmd 分类 02-10 ~ 02-16（12 题）
  stego: '2026-03-01', // stego 分类（1 题）
  pwn: '2026-04-10', // pwn 分类 02-22 ~ 04-10（3 题）
  misc: '2026-06-24', // misc 分类 03-05 ~ 06-24（2 题）
  'moectf-emoji': '2026-09-01', // moectf-emoji 分类（1 题）
  'moectf-zipcrypto': '2026-09-01', // moectf-zipcrypto 分类（1 题）

  // [推] 由挑战 slug 与主题推断
  're-plzdebugme': '2026-02-20', // reverse 分类 2 题均为 02-20
  timing: '2026-03-15', // 挑战 qingcen-733-diary（Flask 日记·时序攻击）日期
  qc733: '2026-03-16', // 挑战 http-smuggle 03-16 ／ pickle-rce 04-10，取较早者
  qc747: '2026-03-18', // 挑战 qingcen-747-lfi 日期
  qc734: '2026-03-20', // 挑战 qingcen-734-race 日期
  sigforge: '2026-04-02', // crypto 分类唯一题目描述含「JWT 伪造」

  // [史] 由 git 历史推出 —— 首次进入本仓的提交日期（≈写作完成日）
  //       取法：git log --format='%h %ad %s' --date=short -S'<id>:' -- frontend/src/data/articles.js | tail -1
  northbridge: '2026-06-11', // 8fd67ca add 4 CTF writeups (Northbridge/734/747/yaml)
  yaml: '2026-06-11', // 8fd67ca 同批提交
  typejuggling: '2026-06-11', // b195053 add 10 CTF writeups (…TypeJuggling/SourceLeak…)
  sourceleak: '2026-06-11', // b195053 同批提交
  notallmilk: '2026-07-17', // 3f9b149 add writeup: NewStar 2025 Not All Milk (TLS decrypt + QR)
  gift: '2026-10-05', // ea25392 publish pending writeups (0xGame2025 / gift / MoeCTF x2)
}

/** 取某篇文章的发布日期（没有就返回 null，调用方不要拿构建时间冒充） */
export function dateOf(articleId) {
  return articleDates[articleId] || null
}
