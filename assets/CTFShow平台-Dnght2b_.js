const n="CTFShow平台",o="CTFShow平台",e="国内老牌练习平台（ctf.show）。特点是**浏览器几乎必须**（反自动化）、session 脆弱、题目分门别类刷。这页记怎么在这里少踩坑。",s=`# CTFShow平台

> 国内老牌练习平台（ctf.show）。特点是**浏览器几乎必须**（反自动化）、session 脆弱、题目分门别类刷。这页记怎么在这里少踩坑。

## 一、平台概况

- 网址：\`https://ctf.show\`（题目列表 \`/challenges\`）
- 账号与凭据**不写入知识库**（约定见 〖内部笔记〗）
- 题目类型里 **\`dynamic_docker\`** 需要"开启靶场环境"才会给一个 \`https://<uuid>.challenge.ctf.show/\` 的临时靶机，**寿命 3600 秒**，过期要重新开
- 已刷的范围：WEB 入门（8 章 × 5 题，第一章约 40 题做过一部分）、web1~web11 系列、若干红包题

## 二、反自动化现实（重要）

1. **Python requests 登不上**：登录接口对脚本返回 403，必须用浏览器登录后拿 cookie 再 curl。
2. **Session 极易丢**：页面跳转、开新标签都可能掉登录，要频繁重新登录（这是本站第一大成本）。
3. **浏览器 Console 多行 JS 常返回 null**：只能拆成单行表达式跑。
4. **容器要手动点**："启动靶场环境"按钮点击后弹窗，有时要点开题目详情再点。弹窗不打开时重试或刷新。
5. 定时任务（cron）自动化刷题尝试过：失败点主要在网络波动 + session 过期，**不适合无人值守长时间跑**。

## 三、走过的接口

\`\`\`http
# 登录（浏览器）
POST https://ctf.show/login      (form: name=邮箱&password=密码)

# 题目列表 / 提交
GET  /api/v1/challenges                                  # 拿未解列表
POST /api/v1/challenges/attempt  {"challenge_id": N, "submission": "flag{...}"}
\`\`\`

## 四、做题记录（要点）

- **web6 / web7**：SQL 注入（登录绕过 + 文章查询），flag \`ctfshow{...}\` 格式，已提交 Correct
- **web8**：PHP include 的 LFI/RFI，**注意该题 flag 是 \`CTF{...}\` 格式**（不是 ctfshow{}）——本站 flag 格式不统一，先看题面/回显
- **web9 / web10 / web11**：路径穿越 / WAF 绕过一类（web11 Cookie 伪造曾作为多智能体首战目标）
- **WEB 入门第一章**：Base64 编码隐藏（\`CTF{...}（已略）\`）、HTTP 头注入（改 User-Agent）、Cookie 伪造（\`role=guest\` → \`role=admin\`）3 题；多层 Base64 嵌套与 TLS 中间人题当时跳过
- 其他：Timing Attack、PHP 弱类型、源码泄露、HMAC 签名伪造等专题已写进博客（见 [[CTF博客-建设与部署]]）

## 五、效率建议

- 能用 curl 时用 curl（拿到 cookie 后）；不能用就老实用浏览器，别和反自动化硬刚
- 开容器后把 URL 立刻记到工作目录（去掉重开时的重复找）
- 卡住 1 小时换题，别在一题上磨（与 [[CTF-竞赛总览与解题流程]] 的纪律一致）

## 关联

- [[青岑与CTFShow-题解履历]] —— 两平台的题解索引
- [[CTF-竞赛总览与解题流程]] —— 通用解题流程
- [[本机环境与CTF工具链]] —— 相关脚本与技能（ctfshow-platform）
- [[Web-认证与会话漏洞]] —— Cookie 伪造类题的知识

## 存疑 / 矛盾

- 容器寿命：平台页写 3600 秒；实际遇到提前失效的情况（重建即可）。
- flag 格式：\`ctfshow{...}\` 与 \`CTF{...}\` 混用，且部分老题是 \`flag{...}\`——不要预设格式。

## 来源

- 与主人的做题会话与 cron 记录（2026-06）· 2026-10-03
- 技能：\`ctfshow-platform\`、\`ctfshow-web-sqli\`；工作目录 \`~/CTF/ctf_show_work/\`
`,t="entity",c="entity",l={internal:["CTF-竞赛总览与解题流程","CTF博客-建设与部署","Web-认证与会话漏洞","本机环境与CTF工具链","青岑与CTFShow-题解履历"],unresolvedCount:1},i={name:n,title:o,summary:e,content:s,section:t,group:c,links:l};export{s as content,i as default,c as group,l as links,n as name,t as section,e as summary,o as title};
