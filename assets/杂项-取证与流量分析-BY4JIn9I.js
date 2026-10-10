const n="杂项-取证与流量分析",e="杂项-取证与流量分析",o='Misc 的第二大类：**给你一份"现场"（流量包、内存镜像、磁盘、日志），还原发生了什么、把 flag 找出来。**',i=`# 杂项-取证与流量分析

> Misc 的第二大类：**给你一份"现场"（流量包、内存镜像、磁盘、日志），还原发生了什么、把 flag 找出来。**

## 一、流量分析（pcap / pcapng）

### 1. 起手
\`\`\`bash
file xx.pcap
tshark -r xx.pcap -q -z io,phs          # 协议分层统计 → 一眼看出"这题在考什么协议"
tshark -r xx.pcap -q -z conv,tcp        # 会话列表 → 谁和谁在聊、聊了多少
tshark -r xx.pcap -q -z follow,tcp,ascii,0   # 追踪某条流的明文
\`\`\`
Wireshark 里对应：\`Statistics → Protocol Hierarchy\` / \`Conversations\`，右键 \`Follow → TCP/HTTP Stream\`。

### 2. 按协议分头看

| 现象 | 做法 |
|---|---|
| HTTP | 导出对象（\`File → Export Objects → HTTP\`），传输的文件直接捞出来 |
| 明文口令 | 过滤 \`http.request.method == POST\`、\`ftp\`、\`telnet\`，看登录字段 |
| 传文件（大流量） | 导出对象，或按 "data" 分片重组 |
| TLS/加密流量 | **有 key log（SSLKEYLOGFILE）就能解密**；或题目给了私钥 → Wireshark 里配 \`SSLKEYLOGFILE\` / RSA keys |
| USB 流量（HID） | 提取 \`usb.capdata\`，按键码转 ASCII（**键盘流量题**）；鼠标流量转轨迹画图（可能画出二维码） |
| DNS 隐蔽信道 | 看查询的子域名，把子域名拼起来就是数据 |
| ICMP 隐蔽信道 | 看 payload 里的数据（ping 的 data 字段被利用传文件） |
| WebSocket / MQTT / 自定义协议 | 看 payload 规律或导出后自己写解析 |
| 只有一串密文 | 先把 payload 全导出，回到 [[杂项-隐写与编码]] 剥离 |

### 3. 常见套路
- **抓包文件里"其中一个人的操作是答案"**：把明文流全部导出，重放 HTTP 请求（Burp 或 \`curl\`）到靶机
- **流量题常是 Web 题的伴随**：里面能看到攻击者的 payload，照着重放即可
- **格式化导出**：\`tshark -T fields -e ...\` 批量抽字段，比自己点快

## 二、内存取证（Volatility）

### 1. 基础流程
\`\`\`bash
vol.py -f mem.raw imageinfo        # 让工具自己猜 profile（Vol2）
vol.py -f mem.raw --profile=Win7SP1x64 pslist     # 进程
vol.py -f mem.raw --profile=... pstree            # 进程树（看父子，找可疑）
vol.py -f mem.raw --profile=... netscan           # 网络连接
vol.py -f mem.raw --profile=... cmdline           # 命令行（攻击者输入过什么）
vol.py -f mem.raw --profile=... consoles          # 控制台输出（常直接有 flag）
vol.py -f mem.raw --profile=... filescan | grep -i flag
vol.py -f mem.raw --profile=... dumpfiles -Q <phys> -D out/   # 按偏移导出文件
vol.py -f mem.raw --profile=... procdump -p <pid> -D out/     # 按进程 dump
vol.py -f mem.raw --profile=... hashdump          # 抓哈希
\`\`\`

### 2. 重点盯这些
- \`consoles\` / \`cmdline\` / \`cmdscan\`：**"用户干了什么"的记录，命中率最高**
- 可疑进程（名字拼写怪异、路径在 temp、无父进程）
- \`clipboard\`：剪贴板常留 flag
- 浏览器历史 / 书签（\`chromehistory\` 插件）
- \`malfind\`：注入的内存段
- 导出的进程内存再 \`strings | grep flag\`

**Volatility 3 命令风格变了**（\`vol -f mem.raw windows.pslist\`），**先确认版本**。

## 三、磁盘 / 文件镜像取证

- \`fdisk -l\` / \`mmls\` 看分区表，\`fls\` / \`Autopsy\` 列文件 → **重点是被删除的文件**（foremost / \`ntfsundelete\` / \`extundelete\` 恢复）
- 分区被隐藏/嵌套：\`binwalk -e\` 或按偏移 \`dd\` 切出来
- Windows 镜像：看 \`$MFT\`、回收站、\`Prefetch\`（执行痕迹）、\`AmCache\`、注册表（\`regripper\`）
- Linux 镜像：\`/var/log/*\`、\`.bash_history\`、crontab、\`/etc/passwd\`
- LUKS/VeraCrypt 加密卷：题里通常会顺带给口令

## 四、日志 / 代码审计式 Misc

- 大日志文件：**先 \`grep -i flag\`**，再按时间窗、按 IP 聚合
- "某人的操作序列"类题：按时间排序还原攻击链
- Git 仓库历史：\`git log -p\`、\`git stash\`、被删的分支（→ [[Web-源码泄露与信息收集]]）
- 二进制里的日志：\`strings\` + 按关键词过滤

## 五、通用心法

1. **先统计再细看**：\`-z io,phs\` / \`imageinfo\` 这种"概览命令"能省掉 80% 的盲目翻找
2. **flag 常常已经在明文里**：\`strings xxx | grep -i flag\` 是第一反应
3. **别急着上工具**：先想"这道题的现场是什么场景"（被入侵的机器？被抓的包？被删的盘？），场景决定工具
4. **文件导出后一律再 \`file\`** 一次：导出的"图片"可能是加密压缩包

## 关联

- [[杂项-隐写与编码]] —— 提取出来的东西要剥
- [[杂项-磁盘与内存取证]] —— 本页 §二/§三 的**深入版**：分区表、文件系统与删除恢复、Volatility 3 细节
- [[杂项-Windows与Linux主机取证]] —— 本页 §四 的**深入版**：evtx、注册表、浏览器、哈希提取与破解
- [[杂项-信号与硬件取证]] —— 非文本信道（音频 / RF / USB 流量）的深入版
- [[Web-源码泄露与信息收集]] —— Git / 日志思路互通
- [[Pwn-栈溢出与ROP]] —— 有的题给 core dump
- [[CTF-常用工具清单]] —— Wireshark / Volatility / binwalk

> 本页是**概览**（先跑哪几条命令、按什么场景选工具）；上面三个「深入版」是同一批主题的专项页。**先读本页定场景，再翻专项页查细节。**

## 存疑 / 矛盾

- Volatility 2 与 3 的**命令与插件体系不兼容**，网上的 writeup 要看清是哪一版。
- \`imageinfo\` 猜 profile 会猜错（尤其是 Windows 10/11 镜像），**猜错时很多插件会静默给空结果**——症状是"什么也没捞到"，而不是报错。

## 来源

- 糯米内建知识整理 · 2026-10-03（无外部文件）
`,t="concept",a="misc",l={internal:["CTF-常用工具清单","Pwn-栈溢出与ROP","Web-源码泄露与信息收集","杂项-Windows与Linux主机取证","杂项-信号与硬件取证","杂项-磁盘与内存取证","杂项-隐写与编码"],unresolvedCount:0},s={name:n,title:e,summary:o,content:i,section:t,group:a,links:l};export{i as content,s as default,a as group,l as links,n as name,t as section,o as summary,e as title};
