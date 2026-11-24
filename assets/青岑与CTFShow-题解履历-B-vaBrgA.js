const n="青岑与CTFShow-题解履历",e="青岑与CTFShow-题解履历",s='主人在两个主平台（青岑 / CTFShow）解过的题索引：**每题一行"是什么 + 怎么打"**，细节在对应 writeup / 博客里。时间跨度 2026-02 ～ 2026-09。',t=`# 青岑与CTFShow-题解履历

> 主人在两个主平台（青岑 / CTFShow）解过的题索引：**每题一行"是什么 + 怎么打"**，细节在对应 writeup / 博客里。时间跨度 2026-02 ～ 2026-09。

## 一、青岑（ctf.qingcen.net）

### 2026-05 里程碑

- **青岑 120 题全通关**（含一血记录）——当月综合 writeup 收录进博客（见 [[CTF博客-建设与部署]]）

### Web 经典单题

| 题 | 手法要点 |
|---|---|
| #733 Diary App | 时序 + SQLi + Pickle + XXE 的综合性题（多漏洞串联） |
| #734 Race Condition | 积分兑换竞态：并发请求绕过积分检查（→ [[Web-竞态条件攻击]]） |
| #747 PHP LFI Filter Bypass | 路径/关键字过滤绕过（\`%09\` 类打断子串匹配） |
| HTTP Request Smuggle | CL-TE 请求走私（→ [[Web-请求走私与协议层攻击]]） |
| 命令注入与 RCE 专题 | 分号注入、\`\${IFS}\` 绕空格、无字母 RCE、eval/passthru |
| 杂项与综合 | LFI、SSRF、变量覆盖等合集 |

### Pwn / Reverse

| 题 | 手法要点 |
|---|---|
| input_function（★一血） | 23 字节 execve("/bin/sh") shellcode |
| X0r | 双层 XOR 逆向 |
| Pwn's Door | 逆向密码常量（0x6b6579 → "key"） |

### 2026-07 ～ 09 新战果

| 日期 | 题 | 手法要点 | 备注 |
|---|---|---|---|
| 07-26 | 极光快递 Aurora Express | HTML 注释泄露路径 → \`tracking_no\` UNION SQLi → FILE 权限 + \`secure_file_priv\` 空 → sqlmap \`--os-cmd\` 写 webshell → \`cat /conquer_secret.txt\` | flag \`flag{...}（已略）\` |
| 08-07 | SRC-002 credit（征信平台） | 前端 bundle 提 API 路径 → 登录页 SQLi | 静态 flag \`flag{...}（已略）\` |
| 08-07 | SRC-003 mall（优选商城） | 优惠券码**重复叠加**（同码出现 N 次折 N 次）→ ¥699 打到 ¥0 → 数字权益 delivery 里出 flag | flag \`flag{...}（已略）\` |
| 08-23 | Brainfuck Neural Interface | BF 程序输出按会话 XOR key 加密、经过 eval 的 PHP 函数调用 → 生成 BF 打印 XOR 后的 \`system(...)\` → RCE 读 \`/flag.txt\` | 服务器 PHP 8.1 |
| 09± | License #871（授权管理系统） | 进行中：卡在第二容器（License 服务）的密钥与格式——**细节按教学约定不在库内展开** | 进度与引导见 [[青岑-License授权管理系统]] |

## 二、CTFShow（ctf.show）

| 题 | 手法要点 | flag（记录值） |
|---|---|---|
| web6 | SQL 注入登录绕过 | \`ctfshow{...}（已略）\` |
| web7 | SQL 注入文章查询 | \`ctfshow{...}（已略）\` |
| web8 | PHP include 的 LFI/RFI（**注意本平台存在 \`CTF{}\` 格式**） | \`CTF{...}\` |
| web9 ～ web11 | 路径穿越 / LFI / WAF 绕过 / Cookie 伪造一类 | 见博客 |
| Web 入门第一章 | Base64 编码隐藏（\`CTF{...}（已略）\`）、HTTP 头注入（改 User-Agent）、Cookie 伪造（\`role=guest→admin\`） | 3 题入手题 |

- 当时跳过的题：多层 Base64 嵌套（密码空间未知）、HTTPS 中间人（环境缺 tshark）——后来 WSL 补了 tshark，可回头清。
- 未解清单：6 月时拉过 **28 道 dynamic_docker 未解**（web8~web15、红包题等），可作为后续刷题清单（web9+ 动态容器）。
- 平台细节与坑见 [[CTFShow平台]]。

## 三、贯穿性经验

1. **先读源码/前端**：SRC-002 是"从 bundle 里捞 API"，Aurora 是"注释里给路径"——信息都在明面上。
2. **WAF 绕过三板斧**：\`%09\`/编码打断匹配、大小写、等价替换；\`\${IFS}\` 与通配符是命令注入常客。
3. **写文件是最后的可靠手段**：\`LOAD_FILE\` 不通就 \`INTO OUTFILE\` 写 webshell（sqlmap \`--os-cmd\` 自动化这条链）。
4. **动态 flag**：容器类题 flag 随实例轮换，提交前重新确认环境没重置。

## 关联

- [[青岑平台]] / [[CTFShow平台]] —— 两平台的操作手册
- [[0xGame2025-征战记录]] —— 同平台的最大战役
- [[CTF博客-建设与部署]] —— 以上题目的完整 writeup 存放处
- [[CTF-实战解题案例集]] —— 其中多道题目的"卡点→证据→payload"深度版
- [[Web-竞态条件攻击]] / [[Web-请求走私与协议层攻击]] —— 重点题目的知识页

## 存疑 / 矛盾

- flag 记录里有省略与前缀变体（\`ctfshow{}\` / \`CTF{}\`），以博客原文与实际提交为准。
- License #871 的最终结论未归档（属"进行中/待复核"），暂按脚本与日志记录，勿当成已解。

## 来源

- \`~/CTF/writeups/\`（aurora-express-sqli、qingcen-brainfuck-neural-interface、qingcen-src-002-credit、qingcen-src-003-mall、cyclens-litctf2026 附记）· 2026-10-03
- 与主人的做题会话（2026-05 ～ 2026-09）
`,c="project",o="project",a={internal:["0xGame2025-征战记录","CTF-实战解题案例集","CTFShow平台","CTF博客-建设与部署","Web-竞态条件攻击","Web-请求走私与协议层攻击","青岑-License授权管理系统","青岑平台"],unresolvedCount:0},r={name:n,title:e,summary:s,content:t,section:c,group:o,links:a};export{t as content,r as default,o as group,a as links,n as name,c as section,s as summary,e as title};
