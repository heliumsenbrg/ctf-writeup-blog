const n="CTF-常用工具清单",e="CTF 常用工具清单",t='按方向分组的工具速查表。原则：**优先用你顺手的那一个**，不要为了"专业感"换来换去。糯米知道主人习惯用 **HackBar / 浏览器表单** 而不是 curl，工具表里已按这个习惯排。',o=`# CTF 常用工具清单

> 按方向分组的工具速查表。原则：**优先用你顺手的那一个**，不要为了"专业感"换来换去。糯米知道主人习惯用 **HackBar / 浏览器表单** 而不是 curl，工具表里已按这个习惯排。

## 通用 / 侦察

| 工具 | 用途 | 备注 |
|---|---|---|
| \`nmap -sV -sC -p-\` | 端口、服务、版本 | 拿题第一步 |
| \`dirsearch\` / \`feroxbuster\` / \`ffuf\` | 目录与文件爆破 | 配字典才有效 |
| \`whatweb\` / Wappalyzer 插件 | 指纹识别 | 判断框架才能选打法 |
| CyberChef | 编码转换、识别、加解密一条龙 | 万能瑞士军刀，Misc 神器 |
| Burp Suite | 抓包改包、重放、爆破 | Web 主力 |
| HackBar | 浏览器内快速构造 GET/POST | 主人常用，改参数比 curl 直观 |
| \`curl\` / \`python -c requests\` | 脚本化请求 | **交互式调试主人不用它**，写脚本时才动 |
| Docker / \`docker\` CLI | 本地复现靶机环境 | 见 [[Docker-Registry与远程API利用]] |

## Web

| 工具 | 用途 |
|---|---|
| sqlmap | SQL 注入自动化（先手工确认注入点再用） |
| Burp Intruder | 参数爆破、SSTI payload 批量试 |
| \`tplmap\` / SSTI 手测 | 模板注入检测 |
| ysoserial / ysoserial.net / PHPGGC | 反序列化 payload 生成 |
| jwt_tool / jwt.io | JWT 解码、爆破密钥、改 alg |
| \`php://filter\` + filter chain 生成器 | PHP 文件包含读源码 |
| nmap \`--script http-*\` | 特定 Web 漏洞探测 |
| Redis / MySQL / SSH 客户端 | 从 web 漏洞回到内部服务时用 |

## 逆向

| 工具 | 用途 |
|---|---|
| IDA Pro / Ghidra | 反编译主力，Ghidra 免费 |
| x64dbg / GDB + pwndbg | 动态调试 |
| \`strings\` / \`rabin2\` | 快速找明文线索 |
| \`upx -d\` / \`DIE\`(Detect It Easy) | 查壳脱壳 |
| \`uncompyle6\` / \`decompyle3\` / \`pycdc\` | pyc 反编译 |
| jadx / JEB | Android APK |
| dnSpy | .NET |
| wasm2wat / wasm-decompile | WebAssembly |
| angr | 符号执行硬爆破 |
| Z3 | 约束求解（配合 angr 或手写） |

## 密码学

| 工具 | 用途 |
|---|---|
| \`RsaCtfTool\` | RSA 常见攻击一键试（小 e、共模、Wiener……） |
| SageMath | 数论、格（LLL）、Coppersmith 的必备环境 |
| \`gmpy2\` / \`sympy\` | 大整数运算、模逆、连分数 |
| \`pycryptodome\` | AES/RSA 等加解密脚本 |
| \`hashcat\` / \`john\` | 弱口令、哈希碰撞爆破 |
| CyberChef | 古典密码（凯撒、维吉尼亚、栅栏） |
| \`z3\` | 密码学/逆向里的约束求解 |
| quipqiup 在线 | 单表替换（词频） |
| dCode / 在线工具集 | 编码与古典密码识别 |

## Pwn

| 工具 | 用途 |
|---|---|
| \`checksec\` | 看保护（NX / Canary / PIE / RELRO） |
| pwntools | 交互与利用脚本主力 |
| pwndbg / GEF | GDB 增强，看栈、看堆 |
| ROPgadget / ropper | 找 gadget |
| one_gadget | 找 libc 一发入魂 |
| libc-database | 由泄漏地址反查 libc 版本 |
| patchelf | 改 ELF 的 interpreter / rpath 对齐环境 |
| glibc-all-in-one | 本地准备各版本 libc |
| seccomp-tools | 读沙箱规则（ORW 题必用） |

## 杂项

| 工具 | 用途 |
|---|---|
| \`binwalk\` | 文件嵌套/固件拆包 |
| \`foremost\` / \`scalpel\` | 文件雕刻恢复 |
| \`zsteg\` / \`stegsolve\` / \`StegSolve.jar\` | 图片隐写 |
| \`steghide\` / \`outguess\` | 图片藏数据（需口令） |
| Audacity / \`sox\` | 音频频谱看摩斯、SSTV |
| Wireshark / \`tshark\` | 流量分析 |
| Volatility 2/3 | 内存取证（\`vol.py -f xx.raw imageinfo\`） |
| Autopsy / \`sleuthkit\` | 磁盘镜像取证 |
| \`exiftool\` | 元数据（坐标、软件、备注） |
| \`zip2john\` + \`john\` | 压缩包爆破 |
| \`bkcrack\` | zip 已知明文攻击 |
| Photopea / GIMP / PIL | 图片像素级处理、通道分离 |

## 关联

- [[CTF-竞赛总览与解题流程]] —— 什么阶段用哪个工具
- [[逆向-Reverse方法论]] —— 工具怎么配合思路用
- [[Pwn-栈溢出与ROP]] —— checksec / pwntools 的实际用法

## 存疑 / 矛盾

- 工具的替代品很多（Ghidra ↔ IDA、ffuf ↔ dirsearch），**选一个用熟**比全都装一遍更有用。
- 部分工具在 Windows 上体验差（pwntools、Volatility 建议在 Linux/WSL 里用）；主人本机是 Windows，必要时走 WSL 或 Docker。

## 来源

- 糯米内建知识整理 · 2026-10-03（无外部文件）
`,a="entity",s="entity",r={internal:["CTF-竞赛总览与解题流程","Docker-Registry与远程API利用","Pwn-栈溢出与ROP","逆向-Reverse方法论"],unresolvedCount:0},i={name:n,title:e,summary:t,content:o,section:a,group:s,links:r};export{o as content,i as default,s as group,r as links,n as name,a as section,t as summary,e as title};
