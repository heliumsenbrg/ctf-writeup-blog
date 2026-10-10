const n="本机环境与CTF工具链",t="本机环境与CTF工具链",e='主人这台 Windows 11 上的"打 CTF 家底"：两套 Python、一个 WSL、反编译三件套、整套 pwn 工具、以及多智能体 CLI。**新会话开工前先看这页，省得重复调研环境。**',s=`# 本机环境与CTF工具链

> 主人这台 Windows 11 上的"打 CTF 家底"：两套 Python、一个 WSL、反编译三件套、整套 pwn 工具、以及多智能体 CLI。**新会话开工前先看这页，省得重复调研环境。**

## 一、主机基础

- Windows 11；终端主用 **Git Bash（MSYS）**：命令用 POSIX 语法
- 主机名 \`DESKTOP-4AV70UN\`，20 核；**C 盘已用约 94%（余 ~20G）**，装大依赖前先掂量
- 装了 Chrome / Edge（可 headless 截图）；**未安装 PHP**（PHP 行为以靶机回显为准）
- **两套 Python**（关键坑）：
  - PowerShell 默认 \`python\` = 3.14（干净，只有标准库）
  - **Git Bash 的 \`python\` = 3.11.15，CTF 全套**：pwntools、pycryptodome、z3-solver、angr、unicorn、capstone、gmpy2、sympy、httpx、websockets、PIL、numpy/scipy/torch、py7zr/rarfile、scapy、volatility3、sqlmap
  - 需要第三方库的脚本**必须在 Git Bash 的 python 下跑**
- \`node\`/\`npm\` 可用（博客项目用）
- CTF CLI 工具（经 \`~/.bashrc\`）：nmap、7z、tshark、exiftool、upx、radare2、sqlmap

## 二、WSL（Linux 工具链，2026-09-01 修好）

\`\`\`bash
# 从 Git Bash 调用（注意 MSYS_NO_PATHCONV）
MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -- <cmd>
\`\`\`

- Ubuntu 26.04，默认用户 \`ctf\`（口令不落库，见本机设置），apt 走阿里云镜像，systemd 开启
- 已装：pwntools、gdb 17.1 + gdb-multiarch + GEF、qemu-user、one_gadget、ROPgadget、seccomp-tools、socat、nmap、**binwalk**、steghide/zsteg/foremost、pari/gp（**无 SageMath**，26.04 源里没有）、Docker（docker.io，registry 镜像已配好，能拉）
- **Windows 上没有 binwalk**（GitHub 被墙、PyPI 包损坏）——需要 binwalk 时走 WSL

## 三、图形/反编译三件套

| 工具 | 位置 | 备注 |
|---|---|---|
| Ghidra 12.1.3（headless 可用） | \`~/tools/ghidra/ghidra_12.1.3_PUBLIC/support/analyzeHeadless.bat\` | Java 21 OK |
| x64dbg | \`~/tools/x64dbg/release/x96dbg.exe\` | Windows 动态调试 |
| IDA Freeware 8.4 | 本机安装 | **无脚本/无 headless**，只能手点 |
| 010 Editor / Wireshark / Yakit | 本机安装 | 二进制编辑 / 流量 / 渗透 |

## 四、多智能体分工（说"多 agent 打比赛"时用）

- 已配置：**Claude Code v2.1.177、Codex v0.139、OpenCode v1.17.6**
- 经验分工（0xGame2025 计划书）：一个 agent 管容器+提交+分发（留言板协调），其余并行攻题；单题 40 分钟纪律
- 留言板文件：\`~/CTF/0xGame2025/留言板.md\`（格式：\`[时间] [Agent名] [题目ID] 内容\`）
- 技能：\`ctf-multi-agent\`（多智能体并行解题流程）

## 五、目录与文件约定

\`\`\`text
~/CTF/
├── scripts/<类别>/      # 解题脚本（cyclens、ctf_util、sqli、jwt、godox、firmware、license……）
├── 0xGame2025/          # 0xGame 战役（计划书、留言板、WP、附件）
├── writeups/            # 整理过的 writeup（md）
├── ctf_downloads/       # 题目附件缓存（按 id/类别）
├── temp/                # 临时输出、探测脚本、日志
└── projects/            # 项目级（ctf_iscc 等）
\`\`\`

- 技能分布：\`~/.claude/skills/\`（46 个，主力）、\`~/skills/\`（33 个）、\`~/.agents/skills/\`（3 个）、Hermes 自己的 skills（ctf-* 系列、qingcen-ctf、race-condition-points-mall 等；其中 **10 个 CTF 技能已于 2026-10-05 归档进 \`01-原料/收藏/技能文档/\`**）
- 脚本习惯：**新建文件而不是改旧的**（解题脚本是一次性的）

## 六、网络限制与绕法

- **GitHub 常被重置**：release/archive 下载用镜像前缀 \`https://ghfast.top/\` + 原 GitHub URL（UPX、radare2 都是这么装的）
- \`api.github.com\` 时好时坏；pip 直连 PyPI 正常
- 需要代理时本机有 \`127.0.0.1:7890\`（git 走它测过通）
- WSL 内 apt 走阿里云镜像；Docker registry 已配镜像源

## 关联

- [[CTF-常用工具清单]] —— 按方向列的工具怎么用
- [[青岑平台]] / [[CTFShow平台]] —— 平台侧的操作方式
- [[0xGame2025-征战记录]] —— 多智能体打法的实战记录
- [[密码学-格与椭圆曲线]] —— WSL 里没有 SageMath，这页第 2 节说明了现状

## 存疑 / 矛盾

- "Git Bash python = 3.11"与"PowerShell python = 3.14"容易记混：**判断标准是终端**，不是用户名。新建脚本先 \`which python\` 确认。
- Ghidra 版本号 12.1.3 是安装时的；升级后路径可能变，以 \`~/tools/ghidra/\` 下实际目录为准。
- ⚠️ 〖内部笔记〗 另记"Bash PATH 有残缺、需先 export"。本会话实测命令直接可用——可能为特定会话环境差异；遇到 \`command not found\` 先补 PATH 再排查。

## 来源

- 环境搭建会话与 2026-09/10 的验证记录 · 2026-10-03
- 配置要点同时写在项目根 \`AGENTS.md\`
`,o="entity",a="entity",i={internal:["0xGame2025-征战记录","CTF-常用工具清单","CTFShow平台","密码学-格与椭圆曲线","青岑平台"],unresolvedCount:1},r={name:n,title:t,summary:e,content:s,section:o,group:a,links:i};export{s as content,r as default,a as group,i as links,n as name,o as section,e as summary,t as title};
