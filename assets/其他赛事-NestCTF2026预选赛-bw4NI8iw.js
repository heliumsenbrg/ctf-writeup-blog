const e="其他赛事-NestCTF2026预选赛",r="其他赛事-NestCTF2026预选赛",n="第九届「强网」拟态防御国际精英挑战赛预选赛（2026-10-31 10:00 ~ 11-01 10:00，24h）：564 队、23 题三批；队伍「想想奶龙会怎么做」。已解 3 题；Premaster 止损、Crossed Signals 90%（11-01 01:38 快照，非终态）。",t=`# 其他赛事-NestCTF2026预选赛\r
\r
> 第九届「强网」拟态防御国际精英挑战赛预选赛（2026-10-31 10:00 ~ 11-01 10:00，24h）：564 队、23 题三批；队伍「想想奶龙会怎么做」。已解 3 题；Premaster 止损、Crossed Signals 90%（11-01 01:38 快照，非终态）。\r
\r
## 一、赛事与平台操作\r
\r
| 项 | 内容 |\r
|---|---|\r
| 平台 | \`https://nestctf.cyberpeace.cn:54443\` |\r
| 认证 | 登录后 cookie \`cr_jwttoken=<JWT>\`；**API 必须带 \`Authorization: JWT <token>\` 头**，只带 cookie 会 403 |\r
| 题目列表 | \`GET /api/ct/web/jeopardy_race/race/<race_id>/checkpoints/?direction=<Cat>\` |\r
| 题目详情 | \`GET .../checkpoints/<id>/\`（含运行中场景的 access_port / 映射） |\r
| 启动场景 | \`POST /api/ct/web/jeopardy_race/.../scenes/ {"checkpoint_id": ...}\`，**同时只能开 1 个** |\r
| 场景访问 | 点弹窗拓扑节点 → 显示「内网地址」+「访问环境 http <xxx>.nestctf.cyberpeace.cn <port>」；**子域每次启动会变**；新环境等 1~3 分钟才通（先 502） |\r
| 本地存档 | 凭据 \`CTF/nest2026/creds.txt\` + \`cookie.txt\`；附件 \`CTF/nest2026/attach/\`；总 WP \`CTF/writeups/nest2026-writeup.md\` |\r
\r
## 二、已解 3 题（约 1490 PT）\r
\r
| 题 | 分值 | 类型 | 解法 |\r
|---|---|---|---|\r
| **Causal Mosaic** | 446 | Reverse/Web | **纯拓扑排序**：\`POST /api/new\` → A/B/C 三编码合并成 DAG → Kahn 算法求序 → \`/api/submit\` |\r
| **Off the Curve** | 582→452（动态分） | Crypto | 16-bit 曲线 p=65519；admin JWT = **HS256 空 secret**；4 张 diag receipt 各泄露 \`K mod ord_j\`（3257/4079/3863/2843）→ **CRT** 出交付私钥 K=3403944425 → \`shared = K·Q_recv\` 解封 |\r
| **SilentWeights** | 480 | AI/ML | \`fc2.weight\` 的**每个 float32 取 1 bit LSB**，MSB-first 打包，前 2 字节大端长度前缀 |\r
\r
> ⚠️ 三条 flag 值均不落库（见 〖内部笔记〗 四.2），原文在 \`CTF/writeups/nest2026-writeup.md\`。\r
\r
## 三、进行中 / 卡点（快照，非终态）\r
\r
| 题 | 进度 | 卡点与续做路径 |\r
|---|---|---|\r
| **Crossed Signals** | 90%（11-01 01:38 快照） | 双通道越权同前 → **已拿到 \`release_state: pending\` + \`review_url\` + \`download_url\`**（此前 404 是探了裸路径）；notes 是死路；当前主攻**「信任客户端声明」**面（note + 伪造 author/role 字段），目标把 pending 翻成 approved。存档 \`CTF/writeups/nest2026-crossed-signals-progress.md\` |\r
| **Ghost-in-the-Queue** | 平台故障，转 HTTP 侧 | 58999 三实例均无 MQTT 响应（**平台故障**）；等 MQTT 期间已走 HTTP 侧：领 topup 凭证、试 job 提交；全链路脚本 \`CTF/nest2026/gitq/attack_gitq.py\`（key1=job role 伪造、key2=relay 转发走私、key5=telemetry boot token、key4=经济漏洞），MQTT 恢复即可开火 |\r
| **Premaster** | **已止损（11-01）** | Bleichenbacher：服务器直接给 s₀ + ok/bad oracle，支持并行（4 连接 600 查询 1.4s）。已修三坑（base 重算 / 流水线排干 / 区间挂 m₀=m·s₀）+ 新增两条：**step-2c 必须扫完整 r-band** \`[⌈(rᵢ·n+2B)/b⌉, ⌈(rᵢ·n+3B)/a⌉)\` 而非逐 r 试一个对齐点；单区间阶段逐 r 扫对齐候选。最终**数学证明 2048-bit 会陷入区间陷阱（估算磨 19 天）**→ 止损转快分模式，exploit 存 \`CTF/nest2026/premaster/bleichenbacher.py\` |\r
\r
## 四、第一批题目清单（23 题三批中的第一批）\r
\r
Off the Curve（152 解，Crypto）、Premaster（92）、LLM Pipeline（108）、Pickle-Me-Not（83）、Causal Mosaic（215 ✓）、SilGate（38，Pwn）、Smart Surveillance Camera PTZ（7，Pwn）、Wasmnesia（82，Rev）、Ghost-in-the-Queue（42，Web）、Crossed Signals（125，Web）。多数要开场景；Off the Curve / Crossed Signals / Wasmnesia 在题面里给了账号密码。\r
\r
## 五、平台坑与纪律\r
\r
- **场景限额 2**；DELETE / POST 有频率限制（AD-071004）\r
- 16:20 平台整站暂停（API/页面全返回「比赛已暂停」静态页），\`watch_resume.py\` 在轮询恢复；批次时间可能顺延\r
- 一次只开一个场景（API 约束），换题先删旧\r
- cookie 会过期：续做先查 \`cookie.txt\`，过期用 \`creds.txt\` 重新登录\r
- WP：前 30 名赛后 2h 内提交\r
\r
## 关键点\r
\r
- **拟态赛的平台操作比题目本身更耗时**：API 头、场景启动、子域变化、1~3 分钟冷启动，每一步都能卡住\r
- Off the Curve 的「4 张 receipt 各泄一个模数 + CRT」是标准的多方门限泄漏套路；admin JWT 空 secret 是送分口\r
- **float 数组 LSB 隐写是每元素 1 bit，不是每字节**——SilentWeights 的教训\r
- Bleichenbacher 的流水线实现有三个隐蔽坑（base 重算、回复排干、区间基准），命中率还含 0x00 因子\r
\r
## 关联\r
\r
- [[其他赛事题解履历]] —— 主平台之外的赛事总索引（本页是其中一场的完整版）\r
- [[密码学-RSA攻击]] —— Premaster 的 Bleichenbacher 与 Off the Curve 的 CRT\r
- [[AI-ML安全]] —— SilentWeights 的模型权重隐写\r
- [[逆向-算法识别与实战案例]] —— Causal Mosaic 的拓扑排序识别\r
\r
## 存疑 / 矛盾\r
\r
- 本页是 2026-10-31 晚的快照：3 题已解、Crossed Signals 80%、Ghost-in-the-Queue 被平台故障卡住；后续进展未归档。\r
- 「3 题 ≈1490PT」为动态分口径，与题面初始分（446+582+480）不一致，以后台结算为准。\r
- 平台在 16:20 整站暂停，批次时间是否顺延未确认。\r
\r
## 来源\r
\r
- ZCode 项目记忆 \`preliminary-ctf-2026-10-31.md\`（sess_8a77faca，2026-10-31）· 已归档于 \`01-原料/收藏/ZCode会话导出/项目记忆-青岑战役/\`（同目录）\r
- 库外原始材料：\`C:\\Users\\hwh\\CTF\\nest2026\\\`、\`CTF\\writeups\\nest2026-writeup.md\`\r
`,s="project",a="project",i={internal:["AI-ML安全","其他赛事题解履历","密码学-RSA攻击","逆向-算法识别与实战案例"],unresolvedCount:1},o={name:e,title:r,summary:n,content:t,section:s,group:a,links:i};export{t as content,o as default,a as group,i as links,e as name,s as section,n as summary,r as title};
