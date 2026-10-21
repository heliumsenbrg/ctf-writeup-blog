// 友情链接数据源 —— 目前只在「关于」页展示（页脚的友链区已按主人要求移除）。
//
// ⚠️ **数组顺序就是展示顺序**。想调整排序，直接改这个数组即可，不用动组件。
//
// 2026-10-09 需求变更过程（避免以后反复）：
//   ① 最初页脚 + 关于页两处都展示
//   ② 主人先要求清空 → 数据置空、两处一起隐藏
//   ③ 随即澄清：**「关于」页保留，「底部」（页脚）删掉**
//      → 数据恢复；Footer.jsx 里的友链区整块移除，关于页照旧。
//      所以现在只有 About 页会出现友链，页脚不会有。
// avatar：站点图标（2026-10-21 抓下来自托管，放 public/friends/）。
// ⚠️ 这里只写**字符串路径**，不要 `import` 图片：scripts/check-data.mjs 会用 Node 直接
// import 本文件，Node 不认 .png/.svg，一旦 import 就让 check 与 CI 全挂（踩过一次）。
// 组件里用 import.meta.env.BASE_URL 拼前缀。
// 之前 FriendAvatar 只会猜 `${host}/favicon.ico`，这五个站都没 .ico → 全退回「名字首字」。
export const friendLinks = [
  { name: '初中申', url: 'https://tsvmv.github.io/', avatar: 'friends/tsvmv.png' },
  { name: '累了', url: 'https://cd835.github.io/ZS/', avatar: 'friends/cd835-128.png' },
  { name: '懒羊羊大佬', url: 'https://yangleduo0629-cloud.github.io/-/#/', avatar: 'friends/yangleduo.svg' },
  { name: 'ss0t-HACKED', url: 'https://blog.ss0t-hacked.top', avatar: 'friends/ss0t-128.png' },
  { name: '青岑黑奴', url: 'https://poachedegg.cn/', avatar: 'friends/poachedegg.svg' },
]
