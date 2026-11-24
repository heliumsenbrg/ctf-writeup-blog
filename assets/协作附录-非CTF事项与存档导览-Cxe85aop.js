const n="协作附录-非CTF事项与存档导览",r="协作附录-非CTF事项与存档导览",t="两件在别处没收录的事：**① 我们除了 CTF 还一起做过什么；② 全部协作产物存在哪。** 规则与偏好见 〖内部笔记〗；逐会话历史见 〖内部笔记〗。",o=`# 协作附录-非CTF事项与存档导览\r
\r
> 两件在别处没收录的事：**① 我们除了 CTF 还一起做过什么；② 全部协作产物存在哪。** 规则与偏好见 〖内部笔记〗；逐会话历史见 〖内部笔记〗。\r
\r
## 一、非 CTF 协作线\r
\r
- **职教云（mosoteach）答题协助**：职业道德与法治课程测验（2026-06 检查过一轮，当时作答机会已用满）。\r
- **视频编辑（WorkBuddy）**：RVM 抠像 + LaMa 修复的视频管线（224 帧级；坑：模型输出是 0-255 而非 0-1）。\r
- **文档评审**：三号病区完整设计方案 v2（HTML）——逐节核对数字、变量与前后一致性。\r
- **数据标注插曲**（2026-05 底 ~ 06 初）：阿里 labelx 图片标注。\r
- **工具维护**：Codex 缺 \`win32-x64\` 依赖的修复、本知识库自身的配置与目录维护。\r
\r
## 二、存档导览（找东西用）\r
\r
| 内容 | 位置 |\r
|---|---|\r
| 解题脚本 | \`~/CTF/scripts/<类别>/\`（cyclens、qingcen、jwt、godox、firmware…） |\r
| 题目附件缓存 | \`~/ctf_downloads/\` |\r
| writeup 原稿 | \`~/CTF/writeups/\` |\r
| 博客（成品出口） | \`~/ctf-writeup-blog\` → [[CTF博客-建设与部署]] |\r
| 0xGame 战役资料 | \`~/CTF/0xGame2025/\`（计划书 / 留言板 / WP） → [[0xGame2025-征战记录]] |\r
| 知识库原料 | \`01-原料/收藏/\`（AI 协作记忆、CTF Writeup） |\r
| 技能 | \`~/.claude/skills/\`、\`~/skills/\`、Hermes skills（ctf-* 系列） |\r
\r
## 三、CTF 专题页速查（本库内）\r
\r
[[0xGame2025-征战记录]]｜[[青岑与CTFShow-题解履历]]｜[[其他赛事题解履历]]｜[[CTF-实战解题案例集]]｜[[青岑平台]]｜[[CTFShow平台]]｜[[本机环境与CTF工具链]]｜[[CTF-知识体系速查手册]]\r
\r
## 关键点\r
\r
- 找任何协作产物先看第二节的**存档导览表**，位置都在库外固定路径\r
- 非 CTF 的事项（课程作业、视频、游戏设计）也归本页，别散进笔记区\r
- 凭据类内容一律不入库，原始值留在库外\r
\r
## 关联\r
\r
- 〖内部笔记〗 —— 规则与偏好（本页是它的补集）\r
- 〖内部笔记〗 —— 逐会话清单\r
- 〖内部笔记〗 —— 实战历史（按时间）\r
- [[CTF-知识体系速查手册]] —— 全库导航\r
\r
## 存疑 / 矛盾\r
\r
- "非 CTF 协作线"的时间点来自会话与记忆摘要，细节以 〖内部笔记〗 为准。\r
\r
## 来源\r
\r
- 本机会话与 \`.workbuddy/\` 记忆整理 · 2026-10-03\r
`,e="output",s="output",C={internal:["0xGame2025-征战记录","CTF-实战解题案例集","CTF-知识体系速查手册","CTFShow平台","CTF博客-建设与部署","其他赛事题解履历","本机环境与CTF工具链","青岑与CTFShow-题解履历","青岑平台"],unresolvedCount:3},T={name:n,title:r,summary:t,content:o,section:e,group:s,links:C};export{o as content,T as default,s as group,C as links,n as name,e as section,t as summary,r as title};
