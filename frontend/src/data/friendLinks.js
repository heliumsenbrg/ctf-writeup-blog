import tsvmvIcon from '../assets/friends/tsvmv.png'
import cd835Icon from '../assets/friends/cd835-128.png'
import yangleduoIcon from '../assets/friends/yangleduo.svg'
import ss0tIcon from '../assets/friends/ss0t-128.png'
import poachedeggIcon from '../assets/friends/poachedegg.svg'

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
// avatar：站点图标（2026-10-21 抓下来自托管）—— 之前组件只会猜 `${host}/favicon.ico`，
// 这五个站都没有 .ico，于是全退回「名字首字」。
export const friendLinks = [
  { name: '初中申', url: 'https://tsvmv.github.io/', avatar: tsvmvIcon },
  { name: '累了', url: 'https://cd835.github.io/ZS/', avatar: cd835Icon },
  { name: '懒羊羊大佬', url: 'https://yangleduo0629-cloud.github.io/-/#/', avatar: yangleduoIcon },
  { name: 'ss0t-HACKED', url: 'https://blog.ss0t-hacked.top', avatar: ss0tIcon },
  { name: '青岑黑奴', url: 'https://poachedegg.cn/', avatar: poachedeggIcon },
]
