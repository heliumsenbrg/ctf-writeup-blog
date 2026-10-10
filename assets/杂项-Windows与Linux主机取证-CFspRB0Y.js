const n="杂项-Windows与Linux主机取证",e="杂项-Windows与Linux主机取证",t="从一台「拷出来的主机」（镜像、KAPE 三取证包、日志目录）还原「谁、什么时候、做了什么」。核心是**多来源交叉验证**：攻击者能清事件日志，但清不掉 USN 日志、MFT、Prefetch、Defender 日志和注册表时间戳。",o=`# 杂项-Windows与Linux主机取证

> 从一台「拷出来的主机」（镜像、KAPE 三取证包、日志目录）还原「谁、什么时候、做了什么」。核心是**多来源交叉验证**：攻击者能清事件日志，但清不掉 USN 日志、MFT、Prefetch、Defender 日志和注册表时间戳。

## 一、总判据表：拿到「主机数据」先看什么

| 拿到的东西 | 首选证据源 | 一句话理由 |
|---|---|---|
| Windows 目录树 / KAPE、完整镜像 | PowerShell 历史 → Amcache → MFT → 注册表 hive | 最省事到最费事，先捡现成 |
| 只有 \`.evtx\` | \`python-evtx\` / \`EvtxECmd\` 解析，锁 EventID | 事件日志是标准时间线 |
| 只有注册表 hive | \`regipy\` / \`Registry\` / RegRipper | 系统与用户配置、持久化、时间戳 |
| 浏览器 profile 目录 | History / Login Data / places.sqlite（SQLite） | 上网行为、下载、凭据 |
| Linux 主机 / 日志目录 | auth.log + \`.bash_history\` + 进程/内存 | 攻击链时间线 |
| 日志被清空 | USN / MFT / Prefetch / MPLog / 注册表时间戳 | 清日志清不掉这些 |

**Windows 手工复查的第一步**：\`C:\\Users\\<user>\\AppData\\Local\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt\`——攻击者的命令行几乎全在这，命中率最高。

## 二、Windows 事件日志（.evtx）

**关键 EventID（先记住这几组）**：

| EventID | 含义 |
|---|---|
| 1102 | **审计日志被清空**（清除动作本身也会被记录） |
| 4720 / 4722 / 4726 / 4738 / 4781 | 账户创建 / 启用 / 删除 / 更改 / 改名 |
| 4624 / 4625 | 登录成功 / 失败 |
| 1001 / 41 | Bugcheck 重启 / 非正常关机 |

**RDP 会话（三条通道各记一套）**：

| 通道 | EventID | 含义 |
|---|---|---|
| TerminalServices-LocalSessionManager/Operational | 21/22/23/24/25/40/41/42 | 登录/启动/登出/断开/重连… |
| TerminalServices-RemoteConnectionManager/Operational | 261 / 1149 | 监听收到连接 / **RDP 认证成功（含源 IP）** |
| RemoteDesktopServices-RdpCoreTS/Operational | 131 / 102 / 103 | 连接接受（含 ClientIP:port）/ 断开 |

\`\`\`python
# 依赖：python-evtx（pip install python-evtx）
import Evtx.Evtx as evtx
import xml.etree.ElementTree as ET
NS = {'ns': 'http://schemas.microsoft.com/win/2004/08/events/event'}

with evtx.Evtx("Security.evtx") as log:
    for rec in log.records():
        root = ET.fromstring(rec.xml())
        eid = root.find('.//ns:EventID', NS).text
        if eid == '4720':                       # 新建账户
            data = {d.get('Name'): d.text for d in root.findall('.//ns:Data', NS)}
            print("created:", data.get('TargetUserName'))
\`\`\`

**踩坑**：① evtx 是**二进制 XML**，直接 \`strings\` 只能捞到零星片段，要 \`EvtxECmd\`/\`python-evtx\` 正经解析；② 同一件事在不同通道各记一份，别只看 Security.evtx；③ **EventID 1102 出现 = 有人清了日志**，这是「反取证」的强信号，立刻转第六节。

## 三、Windows 注册表

| Hive 文件 | 存什么 | 位置 |
|---|---|---|
| \`SAM\` | 本地账户与哈希（需 \`SYSTEM\` 提供 boot key） | \`System32/config/SAM\` |
| \`SYSTEM\` | 系统配置 + boot key | \`System32/config/SYSTEM\` |
| \`SOFTWARE\` | 安装软件、持久化点 | \`System32/config/SOFTWARE\` |
| \`NTUSER.DAT\` | 当前用户设置（Run、RecentDocs 等） | \`Users/<user>/NTUSER.DAT\` |
| \`Amcache.hve\` | **执行过的程序**（带 SHA1、时间戳） | \`appcompat/Programs/Amcache.hve\` |

\`\`\`bash
rip.pl -r NTUSER.DAT -p all            # RegRipper 一把梭
\`\`\`

**持久化重点位置**：

- \`...\\CurrentVersion\\Run\` / \`RunOnce\`（NTUSER 与 SOFTWARE 下都有）
- \`...\\Windows\\CurrentVersion\\OEMInformation\` 的 **\`SupportURL\` 被改成 C2 地址 = 后门指标**（伪装成厂商信息）
- \`Services\` 下的异常服务、\`Winlogon\\Shell\`、\`IFEO\` Debugger 劫持

\`\`\`python
from Registry import Registry
reg = Registry.Registry("SOFTWARE")
k = reg.open("Microsoft\\\\Windows\\\\CurrentVersion\\\\OEMInformation")
for v in k.values():
    print(v.name(), v.value())         # 看 SupportURL 指向哪
\`\`\`

**时间戳用法**：注册表键的 \`last_modified\` 是可靠的「活动时间」。事件日志被清时，\`SAM\\Domains\\Account\\Users\\Names\\<user>\` 键的 last_modified ≈ **账户创建时间**。

## 四、Windows 浏览器取证

主流浏览器数据都是 SQLite，但**时间戳格式各异**，这是最容易抄错的地方：

| 浏览器 | 文件 | 关键表 | 时间戳 |
|---|---|---|---|
| Chrome/Edge | \`History\` | \`urls\`, \`downloads\` | **WebKit epoch**：微秒，从 1601-01-01 起 |
| Chrome/Edge | \`Login Data\` | \`logins\` | 同上（密码值加密） |
| Firefox | \`places.sqlite\` | \`moz_places\`, \`moz_bookmarks\` | **Unix epoch**：微秒，从 1970 起 |

\`\`\`bash
# Chrome/Edge 历史（注意 11644473600 是 1601→1970 的秒差）
sqlite3 "History" "SELECT url,title,datetime(last_visit_time/1000000-11644473600,'unixepoch') FROM urls ORDER BY last_visit_time DESC LIMIT 50;"
sqlite3 "History" "SELECT target_path,tab_url,datetime(start_time/1000000-11644473600,'unixepoch') FROM downloads;"

# Firefox 历史
sqlite3 places.sqlite "SELECT url,datetime(last_visit_date/1000000,'unixepoch') FROM moz_places WHERE last_visit_date IS NOT NULL ORDER BY last_visit_date DESC LIMIT 50;"
\`\`\`

**凭据解密（Chrome/Edge，v10/v11 = AES-GCM）**：需要 \`Local State\` 里的 \`os_crypt.encrypted_key\`（去 5 字节 \`DPAPI\` 前缀后，Windows 上用 \`CryptUnprotectData\` 解出 master key）。

\`\`\`python
from Crypto.Cipher import AES
import sqlite3
nonce, ct, tag = enc[3:15], enc[15:-16], enc[-16:]
pw = AES.new(master_key, AES.MODE_GCM, nonce=nonce).decrypt_and_verify(ct, tag)
\`\`\`

**Firefox 密码**需要 \`key4.db\` + \`logins.json\`，用 \`firefox_decrypt.py\`。**其它常被忽略**：\`Bookmarks\`(JSON)、\`Local Storage/leveldb/*.ldb\`（\`strings\` 搜 flag）、Firefox 的 \`sessionstore-backups/recovery.jsonlz4\`（历史标签页，需先跳 8 字节 magic 再 lz4 解压）。

**踩坑**：Chrome 记录的是**微秒**不是秒，除以 1e6 别忘；直接从 \`Local State\` 拿不到 master key 时，CTF 常把 master_key 单独给出。

## 五、WMI 持久化与远程执行痕迹

**WMI 事件订阅持久化**（无文件、重启仍活）：

\`\`\`bash
# 存储库：C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA
# 用 PyWMIPersistenceFinder / wmi-parser 找 __EventFilter / CommandLineEventConsumer
grep -a "__EventFilter\\|CommandLineEventConsumer" OBJECTS.DATA
\`\`\`

**wmiexec.py（远程执行常用）的痕迹**：

- 在 \`C:\\Windows\\\`（ADMIN$）创建 \`__<unix时间戳>.<random>\` 输出文件，写命令输出、读回、**删除**——文件名里的时间戳 ≈ 执行时间。
- \`WMIPRVSE.EXE\` 的 **Prefetch** 文件确认用过 WMI。
- USN 日志保留该文件的**创建/删除循环**，数循环次数 ≈ 执行了多少条命令。

\`\`\`bash
strings -el '$MFT' | grep -E '^__[0-9]{10}'      # 从 MFT 捞 wmiexec 残留
\`\`\`

**关键区分**：用户 profile 目录 \`C:\\Users\\<user>\\\` **只在首次交互式登录（RDP/控制台）时创建**，WMI/wmiexec 远程执行不会创建它——所以 profile 创建时间 = 首次真人登录时间。

## 六、日志被清空时的补救线索

攻击者用 \`wevtutil cl\` 或 \`Clear-EventLog\` 清 Security.evtx 后，**下面这些还活着**：

| 证据源 | 能给出什么 |
|---|---|
| **USN 日志**（\`C:\\$Extend\\$J\`） | 所有文件操作的**时间线**，清日志也清不掉 |
| **MFT** | 文件名、SI/FN 双时间戳（还能识别 timestomp） |
| **Prefetch**（\`C:\\Windows\\Prefetch\\\`） | 执行过的程序 |
| **Defender MPLog**（\`ProgramData\\...\\Support\\MPLog-*.log\`） | 威胁检测/隔离时间线，独立于事件日志 |
| **注册表 hive 时间戳** | 活动时间（如 SAM Names 键 = 建号时间） |
| **PowerShell \`ConsoleHost_history.txt\`** | 命令历史 |
| **浏览器 SQLite** | 上网行为 |
| **RDP 专用日志** | TerminalServices 通道独立于 Security.evtx |

**USN 记录解析（关键字段）**：

\`\`\`python
import struct, datetime
def parse_usn(data, off):
    fn_len = struct.unpack_from('<H', data, off+56)[0]
    fn_off = struct.unpack_from('<H', data, off+58)[0]      # 通常 60
    ts     = struct.unpack_from('<Q', data, off+32)[0]
    reason = struct.unpack_from('<I', data, off+40)[0]
    name   = data[off+fn_off:off+fn_off+fn_len].decode('utf-16-le')
    dt = datetime.datetime(1601,1,1) + datetime.timedelta(microseconds=ts//10)
    return dt, name, reason
# Reason: 0x1 DATA_OVERWRITE, 0x100 FILE_CREATE, 0x200 FILE_DELETE, 0x80000000 CLOSE
\`\`\`

**实用招**：PowerShell 历史文件是**增量追加**的，USN 上每次 \`DATA_EXTEND\` 对应一条命令的执行时间——即使 PowerShell 日志被清，也能重建「每条命令何时敲的」时间线。用户 profile 目录的 \`FILE_CREATE\`（父引用指向 \`C:\\Users\`）给出首次登录时刻。

**净化工具的指纹**（见到就别做无用雕取）：

| 工具 | 痕迹 |
|---|---|
| \`cipher.exe /w\` | 生成 \`EFSTMPWP\` 目录 |
| \`sdelete\` | 被擦目标名 + \`.ZZZ\` 类后缀 |
| BleachBit | \`~BleachBit*.tmp\` |

## 七、Linux 日志与 bash_history

\`\`\`bash
grep -A2 "session opened" /var/log/auth.log        # SSH 会话
grep -iE "(flag|part|fragment)" /var/log/*.log     # 碎片，注意按顺序拼
grep "FLAGPART" server.log | sed 's/.*FLAGPART: //' | uniq | tr -d '\\n'   # 重组
cat /home/*/.bash_history                          # 用户命令（清日志常留下它）
find /usr/bin -newer /var/log/auth.log             # 比日志还新的可疑文件
\`\`\`

**常见攻链**：SSH 登录（auth.log）→ 传马（\`/usr/bin\` 里时间戳新的文件）→ 外传（PCAP 的 TFTP/HTTP）→ 勒索（AES-ECB + 同密钥 XOR 存 \`.enc\`）。把「日志时间戳」与「文件 mtime」对齐即可拼出时间线。

**Linux 关键日志**：\`/var/log/auth.log\`（或 \`secure\`）、\`syslog\`、\`wtmp/btmp/lastlog\`（登录记录，\`last\`/\`lastb\` 读）、\`journalctl\`（若用 systemd）。

## 八、密码哈希提取与破解（impacket + hashcat）

\`\`\`python
# SAM + SYSTEM 提取本地 NTLM（不破解也能读格式）
from impacket.examples.secretsdump import LocalOperations, SAMHashes
bootKey = LocalOperations('SYSTEM').getBootKey()
SAMHashes('SAM', bootKey).dump()          # 输出 user:RID:LM:NTLM:::
\`\`\`

\`\`\`bash
# 破解
hashcat -m 1000 hashes.txt rockyou.txt              # NTLM
hashcat -m 1000 hashes.txt rockyou.txt -a 6 '?d?d?d?d'   # 词 + 4 位数字混合

# 其它常见格式
zip2john enc.zip > z.txt && hashcat -m 13600 z.txt rockyou.txt   # WinZip AES
keepass2john db.kdbx > k.txt && hashcat -m 13400 k.txt wl.txt    # KeePass（Argon2）
\`\`\`

**RID 常识**：500 = Administrator、501 = Guest、1000+ = 普通用户。

**踩坑**：① \`keepass2john\` 官方版**不认 KeePass v4（KDBX 4.x + Argon2）**，要用 \`ivanmrsulja/keepass2john\` fork 或 \`keepass4brute\`，hashcat 模式是 **13400** 不是 KeePass v3 的模式；② NTLM 是 MD4(UTF-16LE 密码)，空密码哈希是固定值，别当有效凭据；③ 有 \`SYSTEM\` 才能解 \`SAM\`（boot key 在里面），只给 SAM 解不出。

**云存储也常在这类题里出场**：S3 桶开了版本控制时，\`list-object-versions\` 能拿到被「删」的旧对象（见 [[云安全-常见攻击面]]）。

## 关键点

- **清日志 ≠ 没证据**：USN、MFT、Prefetch、Amcache、Defender MPLog、注册表时间戳都独立存活；EventID 1102 出现即反取证强信号。
- **时间戳格式是头号抄错点**：Chrome/Edge 用 WebKit epoch（微秒，1601 起），Firefox 用 Unix 微秒（1970 起），换算差 11644473600 秒。
- **PSReadLine 的 \`ConsoleHost_history.txt\` 是最高性价比证据**，加上 USN 的 \`DATA_EXTEND\` 能重建每条命令的执行时刻。
- **账户/登录时间有多个冗余来源**：4720/1149/131 事件、SAM Names 键时间戳、\`C:\\Users\` profile 创建时间互相印证。
- **wmiexec 留 \`__<时间戳>.<随机>\` 文件 + WMIPRVSE Prefetch**；profile 目录只在交互式登录时创建，可区分「远程执行」与「真人登录」。
- **hashcat 别记错模式**：NTLM=1000、WinZip AES=13600、KeePass v3=13400（v4 需专用 fork）。

## 关联

- [[杂项-磁盘与内存取证]] —— 姊妹页；本页的证据源（SAM/evtx/NTUSER.DAT/MFT）大多要从磁盘镜像或内存转储里先抠出来。
- [[杂项-取证与流量分析]] —— Linux 攻链的「外传」环节、RDP 的源 IP 都要与 PCAP 时间线对齐。
- [[杂项-信号与硬件取证]] —— 姊妹页；键盘/鼠标行为旁证与主机日志常一起用。
- [[密码学-RSA攻击]] —— TLS 用弱 RSA（\`TLS_RSA_WITH_AES_256_CBC_SHA\`，无 PFS）分解模数后可解流量，与本页的凭据提取衔接。
- [[密码学-对称加密与哈希]] —— NTLM/WinZip AES/KeePass 的哈希与 KDF（PBKDF2/Argon2），hashcat 模式对应这。 
- [[Web-源码泄露与信息收集]] —— \`.git\`、reflog/fsck 恢复被 squash 的历史，与浏览器/历史类证据同属「历史残留」。
- [[CTF-常用工具清单]] —— EvtxECmd、regipy、RegRipper、impacket、hashcat、Sleuth Kit 入口。

## 存疑 / 矛盾

- **USN Reason 标志位含义按版本略有差异**，0x100/0x200 是 \`FILE_CREATE\`/\`FILE_DELETE\` 是通用共识，但组合标志要按位或判断，别做等值比较。
- **Chrome master key 不一定取得出**：题目常见的做法是**直接提供 master key**，或提供已解密的 profile；\`Local State\` 的 DPAPI 解密在离线环境需要用户登录凭据，别默认能解。
- **\`python-evtx\` 与 \`EvtxECmd\` 对损坏 evtx 的容错不同**：解析报错时换工具，不要断定「日志被删了」——可能是文件被 chunk 级截断。
- **Amcache 的时间戳语义有争议**：既有研究指出其「首次执行时间」在某些 Windows 版本不可靠，仅作旁证，别当唯一时间锚点。
- **KAPE 三取证包路径随采集配置变**：本页的目录结构来自 UTCTF 2026 的实际包，换题先 \`find . -name '*.DAT' -o -name '*.evtx'\` 重新定位。
- **本页 impacket / hashcat 命令未在本机逐条实测**：素材来自 skill 笔记，模式号与参数请用 \`hashcat --example-hashes\` / \`secretsdump.py\` 复核。

## 来源

- ctf-forensics skill：\`windows.md\`（evtx、注册表、SAM、回收站、浏览器、USN、wmiexec 痕迹、反取证清单、Volatility 凭据套件、cipher.exe 擦除指纹）、\`linux-forensics.md\`（日志、攻链、浏览器凭据解密、Keepass、git 恢复、TLS 弱 RSA）
- 综合通用主机取证知识 · 2026-10-03
`,s="concept",r="misc",i={internal:["CTF-常用工具清单","Web-源码泄露与信息收集","云安全-常见攻击面","密码学-RSA攻击","密码学-对称加密与哈希","杂项-信号与硬件取证","杂项-取证与流量分析","杂项-磁盘与内存取证"],unresolvedCount:0},a={name:n,title:e,summary:t,content:o,section:s,group:r,links:i};export{o as content,a as default,r as group,i as links,n as name,s as section,t as summary,e as title};
