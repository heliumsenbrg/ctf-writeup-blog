const n="密码学-哈希攻击与签名伪造",e="密码学-哈希攻击与签名伪造",r='哈希与签名的题，胜负往往不在"能不能破"，而在**认出这个构造属于哪一类**：是 Merkle-Damgård 的长度扩展、是 CRC 的线性、是 RSA 的同态、还是 padding 预言机。这一页给的是"看到什么条件 → 选哪种攻击"的判据表，外加可跑骨架。',a=`# 密码学-哈希攻击与签名伪造

> 哈希与签名的题，胜负往往不在"能不能破"，而在**认出这个构造属于哪一类**：是 Merkle-Damgård 的长度扩展、是 CRC 的线性、是 RSA 的同态、还是 padding 预言机。这一页给的是"看到什么条件 → 选哪种攻击"的判据表，外加可跑骨架。

## 一、总判据表

| 观察到的条件 | 攻击 | 需要什么 | 要 sage？ |
|---|---|---|---|
| MAC = \`H(secret ‖ data)\`，H ∈ {MD5, SHA-1, SHA-256} | **长度扩展** | 一个已知 (data, mac)，secret 长度 1~32 暴破 | 否 |
| MAC = \`HMAC(K, ...)\` | 长度扩展**免疫** | — | — |
| 要两份不同文件同哈希（上传/票据） | **MD5/SHA-1 碰撞** | 可控前缀 | 否（\`fastcoll\`） |
| 完整性 = \`XOR(sha256(file_i)) == expected\` | **GF(2) 基攻击** | ~256 个合法文件 | 是（或 numpy） |
| CRC 参与 MAC / 完整性 | **线性反推**（GF(2) 解） | 4 字节可调后缀 | 否 |
| ZIP 密码题、文件很小 | **CRC 暴破** | ZIP 头里的 CRC32（明文存储） | 否 |
| 迭代哈希当"时间函数" \`state_t = H(state_{t-1})\` | **环路反推** | 有限周期 | 否 |
| RSA 签名 e=3、PKCS#1 v1.5、校验宽松 | **Bleichenbacher '06 伪造** | 宽松解析 | 否 |
| RSA 加密 PKCS#1 v1.5 + "padding 错误"可区分 | **Bleichenbacher '98 / ROBOT** | 百万级查询 | 否 |
| RSA 加密 OAEP + 阈值为界 | **Manger 预言机** | ~log N 查询 | 否 |
| 教科书写法 \`sig = m^d mod n\`、无 padding | **乘法同态伪造** | 一次合法签名 | 否 |
| \`sig = m^e mod n\`（指数写反） | **小 e 开根** | e 小且 m^e < n | 否 |
| 明文先压缩后加密、密文长度可观测 | **压缩预言机 CRIME/BREACH** | 可注入且与 secret 同块 | 否 |
| CBC + PKCS#7 + "padding 错误"可区分 | **CBC padding oracle** | 可控密文 | 否 |

**固定动作**：①先问"哈希/签名在这个协议里干什么"；②\`H(secret‖x)\` 且是 MD5/SHA1/SHA2 → 先想长度扩展；③见到 CRC → 立刻当线性函数；④见到 RSA → 看 padding 与 e，再看有没有签名 oracle。

## 二、哈希长度扩展（Merkle-Damgård）

原理：MD5/SHA-1/SHA-256 分块压缩，**输出就是内部状态**。已知 \`H(secret‖data)\`，把状态初始化成该 digest，再从"secret‖data‖padding"之后继续喂数据，即可算出 \`H(secret‖data‖padding‖append)\` 的合法摘要——**全程不需要 secret**。HMAC 免疫（它有 opad 外层）。

\`padding\` 是原消息的 MD padding（\`0x80\` + 若干 \`0x00\` + 64/128 位长度字段）；secret 长度未知时暴破 1~32。

\`\`\`python
# 现成库（最省事）
import hashpumpy
new_mac, new_data = hashpumpy.hashpump(old_mac, b"original", b";admin=true", secret_len)
# 或 hlextend（支持 sha1/sha256）
import hlextend
h = hlextend.new('sha256')
forged = h.extend(b';admin=true', b'original', secret_len, old_mac)
\`\`\`

**手工构造 SHA-256 长度扩展**（没有库、或被限制环境时）：

\`\`\`python
import struct
# SHA-256 压缩函数；把初始向量换成已知 digest，把总比特数设成
# (secret_len + len(orig) + len(md_padding)) * 8 + 已处理的扩展字节数
def md_pad(msg_len):                       # 返回 orig 的 MD padding 字节
    pad = b'\\x80'
    k = (56 - (msg_len + 1) % 64) % 64
    return pad + b'\\x00' * k + struct.pack('>Q', msg_len * 8)

def sha256_extend(digest_words, append_bytes, total_bitlen_before):
    # h[0..7] = digest_words（大端读 digest）
    # 对 (append_bytes) 分块喂压缩，长度计数起点 = total_bitlen_before
    # 返回新的 digest（大端）
    ...
# 用法：secret_len 暴破
for sl in range(1, 33):
    glue = md_pad(sl + len(b"original"))
    total = (sl + len(b"original") + len(glue)) * 8
    new_digest = sha256_extend(old_digest_words, b";admin=true", total)
    new_data = b"original" + glue + b";admin=true"
\`\`\`

**踩坑**：①glue（MD padding）里含 \`0x80\`/大量非 ASCII 字节，若服务端有"只允许 ASCII"过滤，用 UTF-8 高字节替换（\`0x80 → \\xc2\\x80\`，见来源 OTW 2018）；②\`hashpumpy\` 默认按小端处理，SHA-256 摘要的字序要与实现一致；③secret 长度错一位全盘皆错，1~32 全试。

## 三、MD5 / SHA-1 碰撞

- **MD5**：\`fastcoll\`（相同前缀的两个碰撞文件，秒级）→ 现代 CPU 分钟级；\`hashclash\` 做 chosen-prefix（不同前缀也可碰撞）。
- **多碰撞（2^k 个文件同哈希）**：MD5 是 MD 构造，碰撞可**串联**——\`H(A‖X)==H(A‖Y)\` ⇒ \`H(A‖X‖Z)==H(A‖Y‖Z)\`。用 \`fastcol\` 跑 3 轮得到 2^3=8 个同 MD5 文件。
- **SHA-1**：SHAttered（相同前缀，2017）、chosen-prefix（shambles，2020）。CTF 里更常见 MD5。
- **CRC32 碰撞**：ZIP 的 CRC 存在头里且**不加密**，小文件（≤6 字节可打印）直接暴破内容；或对 PNG/文件在结束块后追加 4 字节调整 CRC（解析器忽略尾部）。

\`\`\`bash
pip install hashclash  # 或 git clone cr-marcstevens/hashclash
fastcoll -o a.bin b.bin < prefix.bin     # 相同前缀的两个碰撞文件
\`\`\`

## 四、CRC 与 GF(2) 线性代数

**CRC 是 GF(2) 上的仿射函数**：\`CRC(a ⊕ b) = CRC(a) ⊕ CRC(b) ⊕ CRC(0)\`。于是"找一段后缀让整体 CRC 等于目标"就是一个 32 元线性方程组，高斯消元即可解。本机实测通过：

\`\`\`python
import binascii
crc32 = lambda b: binascii.crc32(b) & 0xffffffff

prefix = b"HEADER"; suflen = 4
target = crc32(b"HEADERABCD")                 # 想让 prefix+? 的 CRC 等于它
msglen = len(prefix) + suflen
base = crc32(prefix + b"\\x00"*suflen)         # 关键：base 必须含固定前缀的贡献

def crc_of_bit(j):                            # 翻转第 j 个自由位（后缀内，LSB 记法）
    b = bytearray(prefix + b"\\x00"*suflen)
    b[len(prefix) + j//8] ^= 1 << (j % 8)
    return crc32(bytes(b))

cols = [crc_of_bit(j) ^ base for j in range(suflen*8)]
rhs = target ^ base
# GF(2) 高斯消元
rows = [[(cols[j] >> i) & 1 for j in range(len(cols))] + [(rhs >> i) & 1] for i in range(32)]
r, where = 0, [-1]*len(cols)
for c in range(len(cols)):
    piv = next((i for i in range(r, 32) if rows[i][c]), None)
    if piv is None: continue
    rows[r], rows[piv] = rows[piv], rows[r]
    for i in range(32):
        if i != r and rows[i][c]:
            rows[i] = [rows[i][k] ^ rows[r][k] for k in range(len(cols)+1)]
    where[c] = r; r += 1
sol = [0]*len(cols)
for c in range(len(cols)):
    if where[c] != -1: sol[c] = rows[where[c]][len(cols)]
suf = bytearray(suflen)
for j in range(len(cols)):
    if sol[j]: suf[j//8] ^= 1 << (j % 8)
assert crc32(prefix + bytes(suf)) == target
\`\`\`

**HMAC-CRC 完全失效**：CRC 线性 ⇒ \`HMAC-CRC\` 的密钥可由一对 (msg, MAC) 通过 GF(2^64) 上的多项式运算直接解出。

**自指 CRC**（Google CTF 2017）：求 ASCII 串 x 使 \`CRC(x) = x\`（x 当 hex 串）。同样是 GF(2) 线性系统 \`CRC(x) ⊕ x = 0\`，解完再挑自由变量让每字节落可打印区。详见 [[密码学-ZKP与约束求解]]。

**踩坑**：base **必须包含固定前缀的贡献**（先算 \`crc(prefix + 全零后缀)\`），否则解出的后缀看着对、实际 CRC 差一大截——这是本机实测踩过的坑（第一版把 base 当成全零消息的 CRC，模型"解出来了"但结果错）。

## 五、Bleichenbacher 家族与 padding 预言机

三个常被混叫 "Bleichenbacher" 的东西，别搞混：

### 5.1 Bleichenbacher '06 签名伪造（e=3，PKCS#1 v1.5）

当验签**只检查开头** \`00 01 FF…FF 00 ‖ DigestInfo\`、不检查 FF 个数或尾部垃圾时：伪造一个 \`EM\`，让 \`s = EM^(1/3)\` 是整数即可。构造：把 DigestInfo 放高位、其余填 0，取立方根附近搜索。

\`\`\`python
def forge_e3(hash_hex, n, e=3):
    from gmpy2 import iroot
    prefix = bytes.fromhex("0001" + "ff"*8 + "00" + hash_hex)   # 尽量多 FF 但 ff 数不校验
    for pad_len in range(1, 200):
        EM = (prefix + b"\\x00"*pad_len).ljust((n.bit_length()+7)//8, b"\\x00")
        s, exact = iroot(int.from_bytes(EM, 'big'), e)
        if pow(s, e, n) >> (8*(len(EM)-len(prefix))) == int.from_bytes(prefix,'big') >> 0:
            return s
    return None
# 更通用：Bleichenbacher'06 把 EM 的 cube 拆成“高 1/3 决定 cube、低 2/3 可随意”
\`\`\`

### 5.2 Bleichenbacher '98 / ROBOT（RSA 加密 padding 预言机）

服务端用 PKCS#1 v1.5 **加密**，且能区分"padding 不合法"和"解密后格式错"。经典攻击要 ~百万次查询（2^20 量级）；ROBOT 是它在真实 TLS 实现里的复活。变体 Manger 针对 OAEP，只需 ~log N 次：以阈值（前导零个数）作二分。

判据：拿到"对任意密文判断其解密是否合法"的接口，且 RSA padding 是 v1.5/OAEP。

### 5.3 CBC padding oracle（Vaudenay）

AES-CBC + PKCS#7，若"padding 错误"与其它错误可区分，逐块解密：对目标块的每个字节，改上一块对应字节使 PKCS#7 padding 合法，反推中间值。

\`\`\`python
def padding_oracle_decrypt(ct, oracle, bs=16):
    pt = b""
    prev = ct[:bs]
    for bi in range(bs, len(ct), bs):
        target = ct[bi:bi+bs]; inter = bytearray(bs)
        for pad in range(1, bs+1):
            for g in range(256):
                forged = bytearray(prev)
                forged[-pad] = g
                for k in range(1, pad):
                    forged[-k] = inter[-k] ^ pad
                if oracle(bytes(forged) + target):
                    if pad == 1:                      # 消歧：pad=1 时再改一个字节确认
                        f2 = bytearray(forged); f2[-2] ^= 1
                        if not oracle(bytes(f2) + target): continue
                    inter[-pad] = g ^ pad
                    break
        pt += bytes(a ^ b for a, b in zip(inter, prev))
        prev = target
    return pt
\`\`\`

**踩坑**：\`pad == 1\` 有歧义（末字节 0x01 也可能让倒数第二字节碰巧成 0x02），要多探一次消歧；任何"内容合法性"错误（UTF-8、base64、JSON）都能当预言机（Kaspersky 2017）。

## 六、RSA 乘法同态签名伪造

教科书写法 \`sig = m^d mod n\` 满足 \`sig(m1)*sig(m2) = sig(m1*m2)\`。**只要拿到任意一次合法签名，就能伪造别的**：

\`\`\`python
# 目标：伪造 flag 的签名。服务端允许对任意 m != flag 签名。
r = 2
m_blind = (flag_int * pow(r, e, n)) % n
sig_blind = sign(m_blind)                       # 服务端签
forged = (sig_blind * pow(r, -1, n)) % n        # = flag^d mod n
assert pow(forged, e, n) == flag_int % n
\`\`\`

变体：\`sig = m^e mod n\`（指数写反）→ 整数开根即可伪造小 m；\`e=3\` 且 \`m^3 < n\` 直接 \`iroot\`。

## 七、生日攻击与 meet-in-the-middle

- **生日**：2^n 空间找碰撞期望 \`~1.18 * 2^(n/2)\` 个样本。32-bit 输出约 2^16 次采样即有碰撞；用于"找两个输入同哈希/同 tag"。
- **MitM（双加密/海绵结构）**：\`E2(E1(m))\` 或 rate < state 的海绵哈希，正反各建一张表，\`2^a + 2^(n-a)\` 取代 \`2^n\`。

\`\`\`python
# 通用 MitM：2^24 空间的前向表 + 反向查找
forward = {}
for _ in range(2**24):
    x = os.urandom(k); forward[H(x)] = x
while True:
    y = os.urandom(k)
    if H2(y) in forward: print(forward[H2(y)], y); break
\`\`\`

- **SHA-256 XOR 聚合基攻击**：\`XOR(sha256(file_i)) == expected\` 时，256 个哈希张成 GF(2)^256，任意目标都能由某个子集 XOR 出来（不是找碰撞，是利用 XOR 聚合的线性）。

## 八、压缩预言机（CRIME / BREACH / HEIST）

\`compress(secret ‖ user_input)\` 后再加密、**密文长度可观测**时：注入与 secret 前缀/子串相同的字节会让压缩变短 → 长度即预言机，逐字符恢复。

\`\`\`python
def oracle_len(payload):
    return len(send_and_get_ciphertext(payload))   # 已解 base64/去填充后的长度
base = oracle_len(b"")
known = b""
for pos in range(secret_len):
    for c in range(32, 127):
        cand = known + bytes([c])
        if oracle_len(cand) <= base + len(known):   # 压缩命中 → 长度不涨
            known = cand; break
\`\`\`

判据：明文里同时含"秘密"和"攻击者输入"、被压缩、且加密后长度可见。TLS 压缩=CRIME，HTTP body 压缩=BREACH，HTTP/2+BREACH 构造=HEIST。

## 关键点

- **\`H(secret‖x)\` + MD5/SHA1/SHA2 ⇒ 先试长度扩展**；HMAC 才免疫。secret 长度靠暴破。
- **CRC 一律当线性函数**：\`CRC(a⊕b)=CRC(a)⊕CRC(b)⊕CRC(0)\`，preimage / 自指 / HMAC-CRC 都是 GF(2) 解方程；base 要把固定前缀算进去。
- **"Bleichenbacher"有三个**：'06 签名伪造（e=3、宽松校验、无需 oracle）、'98/ROBOT 加密 padding oracle（百万查询）、Manger（OAEP、log N）。
- **RSA 无 padding + 有签名 oracle = 同态伪造**：\`sign(flag * r^e) * r^{-1}\` 就得到 flag 的签名。
- **任何"内容合法性"判据都能当 padding oracle**：padding、UTF-8、base64、JSON 解析错误皆可。
- **碰撞 vs 线性**：MD5/SHA-1 碰撞要数小时工具；而 XOR 聚合、CRC、长度扩展是"秒级线性"——先排除线性类，再上碰撞。

## 关联

- [[密码学-对称加密与哈希]] —— CBC/ECB、块密码模式与 IV 操纵是本页 CBC padding oracle、IV bit-flip 的前置
- [[密码学-RSA攻击]] —— 同态签名伪造、小 e 开根、Bleichenbacher 全是 RSA 家族的延伸
- [[密码学-ZKP与约束求解]] —— CRC 的 GF(2) 反推、自指 CRC、以及用 z3 处理这些约束，体系在那边
- [[密码学-PRNG与流密码]] —— 会话 token / 签名 nonce 由弱 PRNG 生成时，与哈希攻击在同一条链上
- [[Web-认证与会话漏洞]] —— 长度扩展、CBC bit-flip、压缩预言机最典型的落点就是 cookie/token 越权
- [[密码学-古典密码]] —— 频率分析与 crib 拖拽是椭圆里很多"先降维再攻"思路的起点

## 存疑 / 矛盾

- **长度扩展的"secret 长度"必须正确**：暴破 1~32 时，长度错会让 glue 与实际不符、摘要全错；\`hashpumpy\`/\`hlextend\` 的接口参数顺序（\`secret_len\` 位置）各版本略有差异，上机先跑一个自测。
- **Bleichenbacher '06 的可行性依校验实现而定**：现代严格实现会校 FF 个数、做完整 EM 解析，伪造即失效。仅当验签**宽松**（只查前缀 + DigestInfo）时成立——判据是"能不能构造出看起来合法的 EM"，不是 e=3 就一定能伪。
- **ROBOT 的"百万查询"量级**：真实题里常做了优化（并行、批量、缩短到几万），但要能区分两种错误响应；若服务端把错误统一成一种，攻击不成立。
- **CRC 的版本差异**：CRC32（zlib，反射，poly 0xEDB88320）、CRC32C、CRC-16 等多项式与初值/末异或不同，建模前必须确认目标用的是哪一种；上面的骨架只对 zlib CRC32 实测。
- **MD5 碰撞工具依赖**：\`fastcoll\`/\`hashclash\` 是 C++ 项目，Windows 原生编译麻烦，本库建议 WSL 里跑；\`shambles\`（SHA-1 chosen-prefix）算力要求高，CTF 少见。
- **压缩预言机的"长度"口径**：必须按**去填充后**的密文长度测（TLS 场景还有压缩比与记录层分块），否则长度噪声淹没信号。

## 来源

- 糯米内建知识整理 · 2026-10-03（依据 \`ctf-crypto/modern-ciphers-2.md\`、\`modern-ciphers-3.md\`、\`advanced-math.md\`、\`exotic-crypto-2.md\` 提炼）
- 本机实测：CRC32 GF(2) 线性解 preimage（4 字节后缀）通过——并记录"base 未含固定前缀导致模型假解"的踩坑
`,i="concept",t="crypto",s={internal:["Web-认证与会话漏洞","密码学-PRNG与流密码","密码学-RSA攻击","密码学-ZKP与约束求解","密码学-古典密码","密码学-对称加密与哈希"],unresolvedCount:0},o={name:n,title:e,summary:r,content:a,section:i,group:t,links:s};export{a as content,o as default,t as group,s as links,n as name,i as section,r as summary,e as title};
