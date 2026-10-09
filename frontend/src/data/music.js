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
// 曲目由 `scripts/make-ambient.py` 合成（自产、无版权问题）。
// 想加曲子：把 mp3 丢进 public/music/，在下面数组里追加一项即可。
const base = import.meta.env.BASE_URL

export const musicTracks = [
  { title: 'Ambient #1 · 赛博夜色', src: `${base}music/ambient-1.mp3` },
]
