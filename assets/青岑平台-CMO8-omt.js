const n="青岑平台",t="青岑平台",e='主人打 CTF 的主力平台（ctf.qingcen.net）：用"题集 + 容器靶机"的模式托管比赛与练习。这页记平台怎么用、有哪些坑。**自动化脚本优先走 API，容器与附件才用浏览器。**',i=`# 青岑平台

> 主人打 CTF 的主力平台（ctf.qingcen.net）：用"题集 + 容器靶机"的模式托管比赛与练习。这页记平台怎么用、有哪些坑。**自动化脚本优先走 API，容器与附件才用浏览器。**

## 一、平台结构

- **Web 端**：\`ctf.qingcen.net\`（首页导航 → 题集 → 题目详情）
- **API 端**：\`https://api.qingcen.net/api/v1\`
- **靶机**：容器开出后是 \`docker.qingcen.net:<端口>\`（HTTP 直连，端口每次重建都会变）
- 账号与凭据**不写入知识库**（约定见 〖内部笔记〗）；脚本运行时会自取
- 题集编号：70 / 71 / 72 / 80 ……（0xGame2025、MoeCTF2025、SRC 复现等内容都托管在这几个题集里）
- 主人的战绩：2026-05 完成"青岑 120 题全通关"（一血相关记录见 [[青岑与CTFShow-题解履历]]）

## 二、API 速查

\`\`\`http
# 1. 登录拿 JWT（token 存 ~/qingcen_token.txt，脚本直接读）
POST /api/v1/auth/login          {"username": "...", "password": "..."}
→ data.token

# 2. 容器
POST   /api/v1/containers         {"challenge_id": N}        # 开容器
GET    /api/v1/containers         → 404（平台未开放列表接口）
DELETE /api/v1/containers/{db_id}                            # 销毁

# 3. 提交 flag
POST /api/v1/problemsets/{ps_id}/submit  {"flag": "...", "challenge_id": N}

# 4. 题目列表
GET /api/v1/problemsets/{ps}/challenges?limit=...
\`\`\`

## 三、亲测的坑（按痛感排序）

1. **容器上限 1 个**：第 2 个必回 \`42001 实例数量超限\`。旧容器不销毁就开不了新的；而 API 列不出容器 → **只能去浏览器手动销毁**。做题前先看有没有残留容器。
2. **容器有寿命（约 1 小时）**：过期即失效；重建后**端口会变**，exploit 里的 URL 要跟着改。
3. **题目列表在 \`data.list\`**（不是 \`data\` 本身）；\`limit\` 最大 100，超了报 \`40000 参数解析失败\`。
4. **附件只能浏览器下载**：API 没有附件端点；点"下载"后文件以 **UUID 名字**落进 \`~/Downloads/\`，再归到 \`~/ctf_downloads/{id}/\` 使用。有的题必须打开详情页才有下载按钮。
5. **题面 URL 不能猜**：直接拼题集详情页 URL 会被拒，必须从首页导航点进去（早期自动化踩过）。
6. **flag 格式多样**：\`flag{...}\`、\`0xGame{...}\`、动态 UUID 都有；0xGame 系列实测最终统一为 \`flag{...}\`（529/684/545 验证）。提交前核对，别想当然。
7. **判题偶发异常**：出现过"本地 SHA-256 全部验证通过、平台仍拒收"的案例（题目 706），疑似平台侧问题——遇到时先留档、换题，别死磕。

## 四、浏览器 vs API 分工

| 动作 | 用哪个 | 原因 |
|---|---|---|
| 提交 flag | API | 最快，脚本一条 |
| 拉题目列表/详情 | API | 结构化，好过滤 |
| 开/销毁容器 | API 开，浏览器销毁 | API 能开不能列；销毁在 Web 端 |
| 下载附件 | 浏览器 | 无 API 端点 |
| 看题面/公告 | 浏览器 | 详情页有渲染内容 |

## 关联

- [[青岑与CTFShow-题解履历]] —— 在这个平台解过的题与手法
- [[0xGame2025-征战记录]] —— 在青岑上打的完整比赛
- [[本机环境与CTF工具链]] —— 配套脚本在 \`~/CTF/scripts/qingcen/\`
- [[CTF-竞赛总览与解题流程]] —— 拿到题的标准流程

## 存疑 / 矛盾

- 容器上限：早期记录写"同时 2 个"，后来实测只有 1 个（42001 更频繁）。以实测为准。
- 题集编号与比赛对应：PS72 与 0xGame2025 强相关（记录 34/95），PS70 里既有 0xGame 系题、也有 MoeCTF 的题（870 在 PS70）——归属以题面为准，别按编号硬背。

## 来源

- 与主人的历次做题会话整理（2026-06 ～ 2026-09）· 2026-10-03
- 脚本与工具：\`~/CTF/scripts/qingcen/\`、\`~/CTF/scripts/ctf_util/\`、\`~/qingcen_token.txt\`
`,a="entity",s="entity",o={internal:["0xGame2025-征战记录","CTF-竞赛总览与解题流程","本机环境与CTF工具链","青岑与CTFShow-题解履历"],unresolvedCount:1},c={name:n,title:t,summary:e,content:i,section:a,group:s,links:o};export{i as content,c as default,s as group,o as links,n as name,a as section,e as summary,t as title};
