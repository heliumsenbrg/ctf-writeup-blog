// 背景音乐曲目表。
//
// 音频文件放在 `frontend/public/music/` 下（public 里的东西会原样拷到产物根目录）。
// 路径**必须用 import.meta.env.BASE_URL 拼**，不能用写死的 '/music/...'：
// 站点有三种部署形态，base 各不相同 ——
//   GitHub Pages  `/ctf-writeup-blog/`
//   Vercel 镜像   `/`
//   WorkBuddy 发布 `/`
// 写死路径会让其中两种直接 404。
//
// 2026-10-20 按主人要求换成《崩坏：星穹铁道》原声（原来自产的
// `ambient-1.mp3` 仍留在目录里但不再入列表，`scripts/make-ambient.py` 也能重新生成）。
// 文件名用 ASCII slug，中文标题只在这里做展示，避免 URL 里出现需要转义的字符。
//
// ⚠️ 这些是商业作品的原声，放进公开仓库理论上存在版权/DMCA 风险（主人知情并要求）。
//    想退回自产曲目：把数组换回
//    `{ title: 'Ambient #1 · 赛博夜色', src: `${base}music/ambient-1.mp3` }` 即可。
//
// 想加曲子：把文件丢进 public/music/，在数组里追加一项。
const base = import.meta.env.BASE_URL

export const musicTracks = [
  { title: '不眠之夜', src: `${base}music/sleepless-night.m4a` },
  { title: '使一颗心免于哀伤', src: `${base}music/heart-free-from-grief.mp3` },
  { title: '在银河中孤独摇摆', src: `${base}music/galaxy-sway.mp3` },
  { title: '希望有羽毛和翅膀', src: `${base}music/hope-wings.mp3` },
  { title: '昔涟', src: `${base}music/xilian.m4a` },
  { title: '睡觉小猴', src: `${base}music/sleepy-monkey.m4a` },
  // 下面 4 首原本是桌面上的「下载.m4a」等无名文件。曲名是比对浏览器下载记录得出的：
  // 先按下载字节数把事件精确对上文件，再看同一时刻访问的汽水音乐曲目页标题。
  { title: 'ワールドイズマイン（世界第一公主殿下）', src: `${base}music/world-is-mine.m4a` },
  { title: '妄想感傷代償連盟 (0.9x)', src: `${base}music/mansou-sensou-09x.m4a` },
  { title: '视奸（术力口版）', src: `${base}music/shijian.m4a` },
  { title: "I Can't Wait", src: `${base}music/i-cant-wait.m4a` },
]
