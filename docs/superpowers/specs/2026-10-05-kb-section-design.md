# 知识库板块（/kb）设计 Spec

日期：2026-10-05
仓库：`ctf-writeup-blog`（blog 侧改动；**不写 vault**）
状态：待审

---

## 1. 目标与范围

把「hsb的第二大脑」Obsidian 库（`C:\Users\hwh\Desktop\知识库\hsb的第二大脑\02-笔记`）中**圈定的 69 篇**笔记发布为博客网站的「知识库」板块：

| 分区 | 篇数 | 说明 |
|---|---|---|
| 概念 | 55 | CTF 知识主体（Web/逆向/密码学/Pwn/杂项/云容器等） |
| 项目 | 7 | 征战记录、题解履历等 |
| 输出 | 3 | 总索引、速查手册、协作附录 |
| 实体 | 4 | 工具清单、平台页、本机环境 |

**排除**：摘录（2 篇对话纪要/档案）、`index.md`、`log.md`、`说明.md`、`01-原料/` 一切内容。

### 成功标准

- 访客可按分区浏览 69 篇，按标题/摘要子串搜索，逐篇阅读
- 笔记内 `[[双链]]` 站内互跳；`[[index]]` 指向 `/kb`；指向未发布页的双链渲染为**纯文本**
- 库内相对路径链接（「来源」栏等）渲染为纯文本不可点；`http(s)` 外链保持可点
- 中文深链 `/kb/<名>` 可直达（复用既有 404.html SPA 回退）
- 主包体积不因知识库增大（笔记按需加载）
- 转换对账 69/69；每篇与源文件内容一致，无截断/转义损坏

### 非目标

- 不写入或修改 vault（只读，避免与并行会话冲突）
- 不做在线编辑/评论/全文搜索（仅标题+摘要子串过滤）
- 不发布任何 vault 内部记账（📖待学标记、来源相对路径的可点链接）

### 内容口径（已确认）

- **忠实原文，不重写**（保留「糯米/主人」称谓）
- 「来源」栏保留，但其相对路径不可点
- 快照是时间点副本；vault 更新后重跑生成器再发布（流程记录留待后续，本次不动 vault）

---

## 2. 架构与数据流

```
vault 02-笔记/{概念,项目,输出,实体}/*.md          （只读）
        │
        ▼  frontend/scripts/build-kb.mjs   （本地运行，白名单式，Node ESM、零依赖）
        │
        ├─ frontend/src/data/kb/index.json          分区 + 每篇元数据（小，随主包）
        └─ frontend/src/data/kb/notes/<名>.json     每篇正文（大，懒加载 chunk）
        │
        ▼  快照提交进 git —— GitHub Actions 只消费快照，不依赖本机 vault
        │
        ▼  Kb.jsx（/kb 目录页） ──► KbNote.jsx（/kb/:name 阅读页）
```

**为什么是快照**：CI 构建环境访问不到本机 vault；且白名单生成天然保证 `01-原料/`、会话存档不会外泄。JSON 作为中间格式，规避 `articles.js` 那类模板字面量转义坑。

### 数据形状

`index.json`：

```json
{
  "generatedAt": "2026-10-05T18:40:00+08:00",
  "total": 69,
  "sections": [
    { "id": "concept", "title": "概念", "groups": [
      { "id": "web", "title": "Web", "notes": [
        { "name": "Web-SQL注入", "title": "Web-SQL注入", "summary": "先找差异、再定类型、最后才谈利用" }
      ]}
    ]},
    { "id": "project", "title": "项目", "groups": [ … ] },
    { "id": "output",  "title": "输出", "groups": [ … ] },
    { "id": "entity",  "title": "实体", "groups": [ … ] }
  ]
}
```

`notes/<名>.json`：

```json
{ "name": "Web-SQL注入", "title": "Web-SQL注入", "summary": "…",
  "section": "concept", "group": "web",
  "content": "（原文 markdown，未改写）",
  "links": { "internal": ["Web-命令执行与SSTI"], "unresolved": ["说明"] } }
```

**分组规则**（概念区按文件名前缀映射，生成器内固定表）：

- `Web-` → Web；`逆向-` → 逆向；`密码学-` → 密码学；`Pwn-` → Pwn；`杂项-` → 杂项
- 其余（云安全-、容器逃逸、OSINT-、AI-ML安全、区块链-、Docker-Registry…、无线与射频安全、移动与IoT安全、CTF-*）→ 「云 · 容器 · 其他」
- 项目/输出/实体 各为独立一组

### 文件清单

| 动作 | 文件 |
|---|---|
| 新增 | `frontend/scripts/build-kb.mjs`（生成器） |
| 新增（生成物，入库） | `frontend/src/data/kb/index.json`、`frontend/src/data/kb/notes/*.json`（69 个） |
| 新增 | `frontend/src/utils/remarkWikilinks.js`（remark 插件）、`frontend/src/utils/kbLinks.js`（链接分类） |
| 新增 | `frontend/src/components/Kb.jsx`、`frontend/src/components/KbNote.jsx` |
| 修改 | `frontend/src/App.jsx`（两条路由）、`components/Navbar.jsx`（桌面+移动菜单）、`components/Home.jsx`（入口卡片） |
| 不改动 | `Article.jsx`（46KB 单体，避免回归；渲染配置在 KbNote 内独立实现） |

---

## 3. 组件设计

### 3.1 生成器 `build-kb.mjs`

- 输入：`KB_VAULT` 环境变量，默认 `C:\Users\hwh\Desktop\知识库\hsb的第二大脑\02-笔记`
- 白名单目录：`概念`、`项目`、`输出`、`实体`；跳过 `index.md`、`log.md`
- 每篇解析：标题＝首个 `# ` 行；摘要＝首个 `> ` 行（去前缀）；`content`＝全文原文
- 扫描 `[[…]]` 生成 `links.internal` / `links.unresolved`（对账用；正文不改写）
- 全量校验后**一次性写出**（任何一步失败 → 退出且不落盘，避免半成品）
- 结束打印对账：篇数 / 每区篇数 / 未解析链接清单 / 生成体积

### 3.2 链接处理（渲染期，两段式）

1. **remark 插件** `remarkWikilinks.js`：遍历 mdast **text 节点**，把 `[[名]]` 重写为 link 节点，`url = "kbnote:" + encodeURIComponent(名)`。基于 mdast ⇒ **代码块/行内代码里的 `[[…]]` 不会被误改**。（不采用字符串替换：会破坏代码块。）
2. **`a` 渲染器**（KbNote 内）：
   - `kbnote:` 前缀 → 内部跳转：`名 === 'index'` 或不在发布集 → 纯文本（`<span>`）；否则 `<Link to={'/kb/' + encodeURIComponent(名)}>`
   - `http(s):` → 外链（`rel="noreferrer"`，新窗口）
   - 其余（相对路径）→ 纯文本

### 3.3 `Kb.jsx`（/kb 目录页）

- 顶部：标题 + 简介 + 搜索框（`useState` 过滤 name/title/summary 子串，实时）
- 分区渲染：概念（多组）/ 项目 / 输出 / 实体，组内卡片列表（标题 + 摘要）
- 卡片链接 `/kb/<encoded>`；沿用站点 glass-card / 霓虹风格
- 数据源：`index.json`（静态 import，体积小）

### 3.4 `KbNote.jsx`（/kb/:name 阅读页）

- 懒加载：`import.meta.glob('../data/kb/notes/*.json')` 得到 name→loader 映射；`useParams().name` 命中后动态 import
- 发布集 = 映射的 keys（无需额外数据）；`name === 'index'` 重定向到 `/kb`
- 渲染：react-markdown + remark-gfm + remarkWikilinks + rehype-highlight；代码块/标题/表格样式与文章页一致（KbNote 内独立配置）
- 头部：面包屑（知识库 / 分区 / 标题）+ 摘要引用块
- 底部：组内上/下一篇（按该组 notes 数组顺序）
- 未命中：友好提示 + 返回 `/kb` 入口；加载中显示骨架

### 3.5 入口

- `Navbar.jsx`：桌面与移动菜单各加一条「知识库」→ `/kb`（用现有 `BookOpen` 图标，已 import）
- `Home.jsx`：`categories` 数组末尾加 `{ id: 'kb', title: '知识库', … }`，并把卡片链接改为 `cat.id === 'kb' ? '/kb' : '/article/' + cat.id`（1 行改动；放末尾使其不进入「最新 Writeups」slice）

---

## 4. 错误处理

| 场景 | 行为 |
|---|---|
| vault 路径不存在 / 目录为空 | 生成器明确报错并退出，不产出半成品 |
| 笔记名未命中 | KbNote 显示「未找到该笔记」+ 返回 /kb |
| `[[…]]` 指向未发布页 | 渲染为纯文本，不报错、不加链接 |
| 深链刷新 | 依赖既有 `dist/404.html` SPA 回退（与 /article/* 同机制，已线上验证） |
| chunk 加载失败 | 显示「加载失败，点击重试」按钮 |

---

## 5. 测试与验证

**生成器自检（脚本内置断言）**
- 69/69 篇；每篇 `title`/`summary`/`content` 非空
- 内容对账：`content` 与源文件字节级一致（唯一允许差异：无——渲染期才做链接转换）
- 未解析链接清单打印（预期：index 之外 9 个：说明、log、会话全记录×5、对话档案、对话纪要）

**站点检查**
- `node` 断言：index.json 中每篇在 notes/ 有对应文件；无重复 name
- `npm run build` 通过；kb 笔记生成独立 chunk；主包体积与本次基线（index-BAx36s_6.js ≈ 296KB）相比不显著增长

**部署后线上复核**（用户规矩：构建通过 ≠ 线上更新）
- `/kb` 返回 200 且含分区标题
- 随机抽 2 篇笔记：内容含预期特征串
- 中文深链（percent-encoded）可打开

---

## 6. 已知取舍

- 快照非实时：vault 更新后需重跑 `build-kb.mjs` 并重新提交发布
- 内容忠实原文（保留「糯米/主人」称谓）——如需中性化改写，属后续单独决定
- `KbNote.jsx` 的 markdown 渲染配置与 `Article.jsx` 有少量重复（刻意不重构 Article.jsx，降低回归风险）
- URL 采用中文名（percent-encoded 呈现），保证与 vault 文件名一一对应、无重名映射问题
