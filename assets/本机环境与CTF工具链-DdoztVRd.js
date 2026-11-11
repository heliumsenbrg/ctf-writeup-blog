const n="本机环境与CTF工具链",r="本机环境与CTF工具链",t='主人这台 Windows 11 上的"打 CTF 家底"：两套 Python、一个 WSL、反编译三件套、整套 pwn 工具、以及多智能体 CLI。**新会话开工前先看这页，省得重复调研环境。**',e=`# 本机环境与CTF工具链\r
\r
> 主人这台 Windows 11 上的"打 CTF 家底"：两套 Python、一个 WSL、反编译三件套、整套 pwn 工具、以及多智能体 CLI。**新会话开工前先看这页，省得重复调研环境。**\r
\r
## 一、主机基础\r
\r
- Windows 11；终端主用 **Git Bash（MSYS）**：命令用 POSIX 语法\r
- 主机名 \`DESKTOP-4AV70UN\`，20 核；**C 盘已用约 94%（余 ~20G）**，装大依赖前先掂量\r
- 装了 Chrome / Edge（可 headless 截图）；**未安装 PHP**（PHP 行为以靶机回显为准）\r
- **两套 Python**（关键坑）：\r
  - PowerShell 默认 \`python\` = 3.14（干净，只有标准库）\r
  - **Git Bash 的 \`python\` = 3.11.15，CTF 全套**：pwntools、pycryptodome、z3-solver、angr、unicorn、capstone、gmpy2、sympy、httpx、websockets、PIL、numpy/scipy/torch、py7zr/rarfile、scapy、volatility3、sqlmap\r
  - 需要第三方库的脚本**必须在 Git Bash 的 python 下跑**\r
- \`node\`/\`npm\` 可用（博客项目用）\r
- CTF CLI 工具（经 \`~/.bashrc\`）：nmap、7z、tshark、exiftool、upx、radare2、sqlmap\r
\r
## 二、WSL（Linux 工具链，2026-09-01 修好）\r
\r
\`\`\`bash\r
# 从 Git Bash 调用（注意 MSYS_NO_PATHCONV）\r
MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -- <cmd>\r
\`\`\`\r
\r
- Ubuntu 26.04，默认用户 \`ctf\`（口令不落库，见本机设置），apt 走阿里云镜像，systemd 开启\r
- 已装：pwntools、gdb 17.1 + gdb-multiarch + GEF、qemu-user、one_gadget、ROPgadget、seccomp-tools、socat、nmap、**binwalk**、steghide/zsteg/foremost、pari/gp（**无 SageMath**，26.04 源里没有）、Docker（docker.io，registry 镜像已配好，能拉）\r
- **Windows 上没有 binwalk**（GitHub 被墙、PyPI 包损坏）——需要 binwalk 时走 WSL\r
\r
## 三、图形/反编译三件套\r
\r
| 工具 | 位置 | 备注 |\r
|---|---|---|\r
| Ghidra 12.1.3（headless 可用） | \`~/tools/ghidra/ghidra_12.1.3_PUBLIC/support/analyzeHeadless.bat\` | Java 21 OK |\r
| x64dbg | \`~/tools/x64dbg/release/x96dbg.exe\` | Windows 动态调试 |\r
| IDA Freeware 8.4 | 本机安装 | **无脚本/无 headless**，只能手点 |\r
| 010 Editor / Wireshark / Yakit | 本机安装 | 二进制编辑 / 流量 / 渗透 |\r
\r
## 四、多智能体分工（说"多 agent 打比赛"时用）\r
\r
- 已配置：**Claude Code v2.1.177、Codex v0.139、OpenCode v1.17.6**\r
- 经验分工（0xGame2025 计划书）：一个 agent 管容器+提交+分发（留言板协调），其余并行攻题；单题 40 分钟纪律\r
- 留言板文件：\`~/CTF/0xGame2025/留言板.md\`（格式：\`[时间] [Agent名] [题目ID] 内容\`）\r
- 技能：\`ctf-multi-agent\`（多智能体并行解题流程）\r
\r
## 五、目录与文件约定\r
\r
\`\`\`text\r
~/CTF/\r
├── scripts/<类别>/      # 解题脚本（cyclens、ctf_util、sqli、jwt、godox、firmware、license……）\r
├── 0xGame2025/          # 0xGame 战役（计划书、留言板、WP、附件）\r
├── writeups/            # 整理过的 writeup（md）\r
├── ctf_downloads/       # 题目附件缓存（按 id/类别）\r
├── temp/                # 临时输出、探测脚本、日志\r
└── projects/            # 项目级（ctf_iscc 等）\r
\`\`\`\r
\r
- 技能分布：\`~/.claude/skills/\`（46 个，主力）、\`~/skills/\`（33 个）、\`~/.agents/skills/\`（3 个）、Hermes 自己的 skills（ctf-* 系列、qingcen-ctf、race-condition-points-mall 等；其中 **10 个 CTF 技能已于 2026-10-05 归档进 \`01-原料/收藏/技能文档/\`**）\r
- 脚本习惯：**新建文件而不是改旧的**（解题脚本是一次性的）\r
\r
## 六、网络限制与绕法\r
\r
- **GitHub 常被重置**：release/archive 下载用镜像前缀 \`https://ghfast.top/\` + 原 GitHub URL（UPX、radare2 都是这么装的）\r
- \`api.github.com\` 时好时坏；pip 直连 PyPI 正常\r
- 需要代理时本机有 \`127.0.0.1:7890\`（git 走它测过通）\r
- WSL 内 apt 走阿里云镜像；Docker registry 已配镜像源\r
\r
## 关键点\r
\r
- **双 Python**：Git Bash 的 3.11 带 CTF 全家桶，PowerShell 的 3.14 只有标准库——装包前先确认在哪个里\r
- 重活（binwalk/zsteg/volatility）走 WSL；GitHub 直连被墙用镜像\r
- 路径一律正斜杠绝对路径（Git Bash 会吃反斜杠）\r
- 平台凭据文件不主动读取；C 盘紧张，装大依赖前先掂量\r
\r
## 关联\r
\r
- [[CTF-常用工具清单]] —— 按方向列的工具怎么用\r
- [[青岑平台]] / [[CTFShow平台]] —— 平台侧的操作方式\r
- [[0xGame2025-征战记录]] —— 多智能体打法的实战记录\r
- [[密码学-格与椭圆曲线]] —— WSL 里没有 SageMath，这页第 2 节说明了现状\r
- 〖内部笔记〗 —— 除 CTF 家底之外，天天在用的还有笔记软件本身：2026-10-13 装的第一批插件与不装的理由（补于当日，既有内容未动）\r
\r
## 存疑 / 矛盾\r
\r
- "Git Bash python = 3.11"与"PowerShell python = 3.14"容易记混：**判断标准是终端**，不是用户名。新建脚本先 \`which python\` 确认。\r
- Ghidra 版本号 12.1.3 是安装时的；升级后路径可能变，以 \`~/tools/ghidra/\` 下实际目录为准。\r
- ⚠️ 〖内部笔记〗 另记"Bash PATH 有残缺、需先 export"。本会话实测命令直接可用——可能为特定会话环境差异；遇到 \`command not found\` 先补 PATH 再排查。\r
\r
## 来源\r
\r
- 环境搭建会话与 2026-09/10 的验证记录 · 2026-10-03\r
- 配置要点同时写在项目根 \`AGENTS.md\`\r
`,s="entity",o="entity",a={internal:["0xGame2025-征战记录","CTF-常用工具清单","CTFShow平台","密码学-格与椭圆曲线","青岑平台"],unresolvedCount:2},i={name:n,title:r,summary:t,content:e,section:s,group:o,links:a};export{e as content,i as default,o as group,a as links,n as name,s as section,t as summary,r as title};
