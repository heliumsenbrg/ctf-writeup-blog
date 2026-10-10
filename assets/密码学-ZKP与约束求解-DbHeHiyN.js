const n="密码学-ZKP与约束求解",e="密码学-ZKP与约束求解",i='一类题的本质不是"破密码"，而是"**把检查逻辑抄成约束，让求解器把答案吐出来**"。这一页给三样东西：z3 / GF(2) / 集合交集的**选择判据**、建模范式与可跑骨架，以及零知识证明与 SPN 里"从协议缺陷而非算法强度下手"的打法。',t=`# 密码学-ZKP与约束求解

> 一类题的本质不是"破密码"，而是"**把检查逻辑抄成约束，让求解器把答案吐出来**"。这一页给三样东西：z3 / GF(2) / 集合交集的**选择判据**、建模范式与可跑骨架，以及零知识证明与 SPN 里"从协议缺陷而非算法强度下手"的打法。

## 一、选哪种求解器：判据表

| 未知量的形态 | 推荐工具 | 为什么 |
|---|---|---|
| 位/字节，约束是 \`^\`、\`<<\`、\`>>\`、加减、比较 | **z3 \`BitVec\`** | 位运算原生支持，\`QF_BV\` 理论专治 |
| 小范围整数，约束线性或"小范围枚举" | **z3 \`Int\`**（加边界约束） | 建模最快；别让它处理大整数非线性 |
| 纯线性网络（LFSR、线性 PRNG、CRC、GF(2) 聚合、XOR 链） | **GF(2) 高斯消元**（numpy/sage/手写） | 可扩展到几千位；z3 会在维度上去就慢死 |
| 非线性 S-box / 有限域乘法混位运算 | **z3 局部建模 + 手算差分/交集** | 全符号 SAT 常超时，要降维 |
| 多个"候选集合"要收敛到唯一 | **集合交集 / 差分** | SPN、S-box 攻击的骨架 |
| 有限域上多项式方程组 | **sage Groebner / 结式(resultant)** | 多元代数系统 |

**固定动作**：①先判断约束是"线性(位)"还是"非线性代数"；②线性位 → 直接 GF(2)，别上 z3；③非线性 → 先想办法降成一堆独立小问题（差分、交集、按位分治），再逐个交给 z3；④拿到解一定回代验证。

## 二、z3 建模范式

### 2.1 三种变量的选择

\`\`\`python
from z3 import *
bits = [Bool(f'b{i}') for i in range(64)]         # 纯布尔
x = BitVec('x', 32)                               # 32 位向量：^ << >> + 比较
y = Int('y')                                      # 任意精度整数：/% 都可以
\`\`\`

- 位运算/移位/字节拼装 → \`BitVec\`；乘除、取模、需要"任意精度" → \`Int\`。
- **别用 \`Int\` 做位运算**（没有 \`^\`/\`<<\` 的整数语义），也**别用 \`BitVec\` 做大整数取模**（会溢出回绕，除非你就是要回绕）。
- 性能：位向量题用 \`SolverFor("QF_BV")\`；给非线性的 \`Int\` 题设 \`s.set("timeout", 5000)\`，超时就换降维思路。

### 2.2 加法混合的流密码（Tokyo Westerns 2017 范式）

\`enc[i] = (msg[i] + key[i%13] + enc[i-1]) % 128\`，已知 flag 前缀锚点：

\`\`\`python
from z3 import *
key  = [Int(f'k{i}') for i in range(13)]
flag = [Int(f'f{i}') for i in range(len(enc))]
s = Solver()
for i in range(len(enc)):
    prev = enc[i-1] if i > 0 else 0
    s.add(enc[i] == (flag[i] + key[i % 13] + prev) % 128)
for v in key:
    s.add(v >= 0, v < 128)                        # key 的取值域（照抄题目）
for f in flag:
    s.add(f >= 0x20, f < 0x7f)                     # 可打印 ASCII
for i, c in enumerate(b"TWCTF{"):                  # 已知前缀做锚点
    s.add(flag[i] == c)
if s.check() == sat:
    m = s.model()
    print(bytes(m[f].as_long() for f in flag))
\`\`\`

### 2.3 位向量 + 提取（自定义哈希/字节级混淆）

\`\`\`python
flag = [BitVec(f'f{i}', 32) for i in range(14)]   # 每 4 字节一个 BitVec
s = Solver()
for fv in flag:
    for b in range(4):
        byte = (fv >> (b*8)) & 0xff
        s.add(byte >= 0x20, byte < 0x7f)
# 把目标校验逻辑逐句抄成约束（例：内存异或链）
mem = [BitVec(f'm{i}', 32) for i in range(16)]
s.add(mem[0] == flag[0])
s.add(mem[1] == mem[0] ^ flag[1])
s.add(mem[8] == 4127179254)                         # 从反汇编/BPF dump 抠出的常量
if s.check() == sat:
    m = s.model()
    out = b"".join(m[f].as_long().to_bytes(4, 'little') for f in flag)
    print(out)
\`\`\`

这套范式同时通吃：**BPF/seccomp 过滤器**（\`seccomp-tools dump\` 出来就是位运算链）、自定义哈希全反、类型系统约束、"猜 flag"类。

### 2.4 求解耗时当预言机

无法直接判断猜测对错、但服务端内部跑 z3（或任何 SAT）时：**错猜的实例明显可满足 → 秒回；对猜的实例 UNSAT 难证 → 明显变慢**。设紧超时，谁"慢"谁就对：

\`\`\`python
import time
for c in string.printable:
    s = Solver(); s.set("timeout", 500)
    s.add(prng_constraints(flag + c, ct))
    t = time.time(); r = s.check(); dt = time.time() - t
    if r == sat and dt > 0.4:                      # 相对基线，不是绝对时间
        flag += c; break
\`\`\`

## 三、CRC 的 GF(2) 反推

CRC 是 GF(2) 上的**仿射映射**：\`CRC(x) = A·x ⊕ c\`。给定消息长度 n，A 的每一列 = "把某一位翻起来后 CRC 相对全零的变化"，用单位向量**探测**出整张矩阵，再解线性方程组。

\`\`\`python
import numpy as np, binascii
crc32 = lambda b: binascii.crc32(b) & 0xffffffff

def build_crc_matrix(msglen):
    base = crc32(b"\\x00" * msglen)
    A = np.zeros((32, msglen * 8), dtype=np.uint8)
    for j in range(msglen * 8):                       # 逐位探测
        b = bytearray(msglen); b[j//8] ^= 1 << (j % 8)
        diff = crc32(bytes(b)) ^ base
        for i in range(32): A[i, j] = (diff >> i) & 1
    return A, base
\`\`\`

- **preimage / 自指**（\`CRC(x) = x\`）：把约束写成 \`(A ⊕ Shift)x = c\`，一起高斯消元。自指 CRC 把输出的 32 位也当未知量（x 的每个字节既是输入又是输出的一部分）。
- **固定前缀**：像 [[密码学-哈希攻击与签名伪造]] 那样，base 里必须含固定前缀的贡献，或把前缀位也放进列，否则解出的东西 CRC 对不上。
- **大规模**：几千位以上用 numpy/sage 的 \`Matrix(GF(2)).solve_right()\`；几百位以内 z3 \`BitVec\` 也能直接建（写成 \`crc_bit_i(x) == target_i\`），但**别指望 z3 处理几千位**。
- 判据：只要 CRC 出现在"校验/认证/完整性"里且你能改一部分字节，就建矩阵解方程。

## 四、SPN 与 S-box 攻击

判据：轮数少（3~4 轮）、S-box 小（6/8 bit）、可按位置分治。核心是**把密钥恢复降成"每个 S-box 位置独立的小枚举 + 多对明密文求交"**。

### 4.1 3 轮 SPN 的 S-box 交集攻击

对每个 S-box 位置，枚举 (round2 子钥 k2, round3 子钥 k3)，用**部分解密**倒推中间值，与从明文正推的期望值比对；在约 200 对明密文上**求交集**，唯一候选即答案。36-bit 块、6-bit S-box 时，把 2^108 全搜降成 6 个独立 2^12 搜索：

\`\`\`python
def recover_subkeys(pairs, sbox, perm, inv_sbox, inv_perm):
    for pos in range(6):                              # 6 个 S-box 位置
        candidates = None
        for pt, ct in pairs:                          # ~200 对
            valid = set()
            for k2 in range(64):
                for k3 in range(64):
                    mid = inv_sbox[ct_bits(ct, pos) ^ k3]
                    mid = inv_perm(mid)
                    if inv_sbox[mid ^ k2] == expected_from_pt(pt, pos):
                        valid.add((k2, k3))
            candidates = valid if candidates is None else (candidates & valid)
        assert len(candidates) == 1                   # 交集收敛到唯一
        yield pos, candidates.pop()
\`\`\`

**关键**：交集只在"每条约束都正确"时收敛；凑一对错的 (pt,ct) 会让交集变空，先清洗数据。

### 4.2 非置换 S-box 的碰撞攻击（Nullcon 2026 范式）

**攻击前先查 S-box 是不是置换**——非置换会直接泄漏密钥：

\`\`\`python
from collections import Counter
if len(set(sbox)) < 256:
    cnt = Counter(sbox)
    for val, c in cnt.items():
        if c > 1:
            collide = [i for i in range(256) if sbox[i] == val]
            delta = collide[0] ^ collide[1]           # 输入差分
            print(f"S[{hex(collide[0])}]=S[{hex(collide[1])}]={hex(val)} delta={hex(delta)}")
\`\`\`

拿到碰撞差分 \`delta\` 后：对每个密钥字节位置 k，取两个只在该位置差 \`delta\` 的明文集，加密看是否相同密文；相同说明该位置 S-box 输入落在碰撞集里，推出 2 个候选（\`v^rc\` 或 \`v^rc^delta\`）。每字节 2 选 1 → 2^16 全局候选本地暴破，总查询 ~16×256。**判据：积分/平方攻击因非置换破坏"平衡性"而失效，符号 SAT 在 15+ 轮也超时——非置换是这种题唯一的路。**

## 五、零知识证明类题

判据表：

| 观察到的缺陷 | 攻击 |
|---|---|
| Fiat-Shamir 的 challenge \`c\` 不绑定全部 transcript（可预测/可重放） | 伪造证明 |
| 承诺/证明里同一个 nonce \`r\` 复用 | \`x = (s1-s2)/(c1-c2)\` 直接解秘密 |
| 承诺是 \`H(salt, value)\` 且 salt 可知、domain 小 | 暴破 value |
| 要求证明**不可能**的命题（如 K4 的 3-着色） | 必须"作弊"：找哈希碰撞 / 复用 |
| Groth16 \`vk_delta_2 == vk_gamma_2\` | 断言可无条件伪造 |
| circuit 未约束某输入、合约不记 nullifier | 重放同一份有效证明 |
| Shamir 系数由秘密确定性导出 | 单份额 → 单变量方程 → 求根 |

### 5.1 Fiat-Shamir / Schnorr：nonce 复用与弱 challenge

Schnorr 证明：\`R = g^r\`，\`c = H(R)\`，\`s = r + c·x\`。**同一个 \`r\` 出两次不同 \`c\`**：

\`\`\`python
# 两式相减消掉 r
x = ((s1 - s2) * pow(c1 - c2, -1, q)) % q
\`\`\`

若 \`c\` 没绑定 commit（例如 \`c\` 固定、\`c = H(R)\` 但 R 可控、或 \`c\` 直接可预测），则可反解出使等式成立的 \`s\` → 无需私钥即可伪造。**和 ECDSA nonce 重用是同一个数学**。

### 5.2 承诺（commitment）

\`commit(i) = H(salt_i, color_i)\` 且 \`salt_i\` 已知 → 对每个候选 \`color\` 暴破比对（domain 小）。\`salt\` 由可预测 PRNG 生成 → 见 [[密码学-PRNG与流密码]]。要"承诺一个值、揭示另一个" → 找哈希碰撞（或利用承诺未二次校验）。

### 5.3 可满足性 / 3-着色

"证明一个 NP 命题"的题，若命题本身**无解**（如 K4 的 3-着色不存在），就只能造假：找承诺碰撞、复用旧 transcript、或利用验证器未校验的输入（对应 4.2 的"未约束输入"）。图着色本体可用：

\`\`\`python
import networkx as nx
coloring = nx.coloring.greedy_color(G, strategy='saturation_largest_first')
\`\`\`

### 5.4 Shamir 系数由秘密确定性导出（LACTF 2026）

正常 Shamir 每个秘密字节用独立随机系数；当系数都是秘密的函数 \`g(s)\` 时，**给一个份额**就得到关于 s 的**单变量方程**：\`y0 = s + g(s)x0 + g²(s)x0² + …\`。在 GF(p) 里用 **Frobenius + gcd** 求根：

\`\`\`python
R.<x> = PolynomialRing(GF(p))
h = y0 - (s_poly + g(s_poly)*x0 + g2(s_poly)*x0^2)     # 关于 s 的多项式
gx = gcd(pow(x, p, h) - x, h)                          # x^p - x 的公约 = 所有线性因子的乘积
roots = gx.roots()                                    # 或 gx 次数为 1 时直接取根
\`\`\`

### 5.5 Groth16 / SNARK 的常见"送分"缺陷（DiceCTF 2026）

- **\`delta == gamma\`**：配对等式塌缩，取 \`A = vk_alpha1, B = vk_beta2, C = -vk_x\` 即对**任意公开输入**通过校验。
- **nullifier 未约束 / 合约不记已用 nullifier**：拿部署交易里的旧证明无限重放。

**固定动作**：先 \`diff\` 验证键常量、查电路是否约束了所有声明输入、查合约是否记录 nullifier，再谈"攻击密码学"。

## 关键点

- **先分线性/非线性**：纯 \`^ << >>\` 的线性网络（CRC、LFSR、线性 PRNG、XOR 聚合）一律走 GF(2) 高斯消元，别用 z3 硬扛维度。
- **z3 建模三件套**：变量选对（\`BitVec\`/\`Int\`/\`Bool\`）、取值域约束（可打印 ASCII/小范围）、已知前缀做锚点。拿到模型必须回代验证。
- **非线性要降维**：SPN/S-box 靠"按位置分治 + 多对明密文求交集"；先查 S-box 是否置换（非置换直接泄漏密钥）。
- **ZKP 的漏洞几乎总在协议层**：Fiat-Shamir 未绑定 transcript、nonce 复用、承诺可暴破/碰撞、电路未约束输入、nullifier 不记——不是密码学强度问题。
- **CRC 反推的 base 陷阱**：矩阵/base 必须包含固定前缀的贡献，否则"解出来了"但结果对不上。
- **求解耗时可以是预言机**：对错难判时，用 z3 的"错猜秒回、对猜难证 UNSAT 而变慢"，相对基线计时。

## 关联

- [[密码学-哈希攻击与签名伪造]] —— CRC 的 GF(2) 反推、自指 CRC、长度扩展都在那边给了完整骨架，本页是其"通用建模"的体系化
- [[密码学-RSA攻击]] —— 同态、广播、Coppersmith 的很多步骤最后都落成"解一组约束/格"
- [[密码学-格与LLL]] —— 当未知数连续而非离散、带噪时，GF(2)/z3 不够用，要上格与 LLL/BKZ
- [[密码学-PRNG与流密码]] —— 约束求解是"部分观测恢复 PRNG"的主力（MT 63-bit、V8 XorShift128+）
- [[逆向-Reverse方法论]] —— 自定义校验逻辑要先反汇编/BPF dump，才能抄成 z3 约束
- [[杂项-沙箱逃逸-PyJail与NodeJail]] —— BPF/seccomp 过滤器的位运算链是本页 z3 建模范式的典型应用
- [[区块链-智能合约安全]] —— Groth16 验证键、nullifier、重放等 SNARK 缺陷的实际落点

## 存疑 / 矛盾

- **z3 vs GF(2) 的边界**：几百位线性系统 z3 能跑，但到几千位就会指数级变慢；判据是"纯线性 + 维度大 ⇒ 坚决 GF(2)"。反过来，**带非线性（S-box、模乘）时 GF(2) 直接失效**，只能 z3 局部 + 手算降维。
- **z3 建模最容易抄错的地方**：把 \`Int\` 当位向量用（\`>>\`/\`&\` 语义不同）、忘记掩码导致 \`BitVec\` 回绕、把"小端读字节"写成大端——提取模型时 \`to_bytes(..., 'little')\` 与目标端序必须一致。
- **SPN 交集攻击的收敛性依赖数据正确性**：一对错误的 (pt,ct) 就会让交集为空；且"每位置独立"只在置换/差分传播干净时成立，轮数一多、S-box 一复杂就不收敛。
- **非置换 S-box 攻击的"2 候选/字节"**：依赖 delta 在轮内不被扩散掉，round key 与 S-box 的复合顺序要照抄；不同轮常数会让候选推错。
- **ZKP 判据是"必要条件"不是"充分条件"**：看到 \`delta == gamma\`/nonce 复用基本可判，但"电路未约束输入"要靠实际读电路（R1CS/约束系统）确认，不能只看协议描述。
- **z3 时间预言机的阈值**：绝对时间受机器负载影响，必须**相对同一台机、同一次会话的基线**；且只在服务端真在内部跑 SAT 时有效，纯数据库查询式的校验不会变慢。

## 来源

- 糯米内建知识整理 · 2026-10-03（依据 \`ctf-crypto/zkp-and-advanced.md\`、\`advanced-math.md\`、\`modern-ciphers-3.md\`、\`stream-ciphers.md\` 提炼）
- 本机实测：CRC32 GF(2) 矩阵探测 + 高斯消元解 preimage 通过（与 [[密码学-哈希攻击与签名伪造]] 共用同一验证）
`,o="concept",r="crypto",a={internal:["区块链-智能合约安全","密码学-PRNG与流密码","密码学-RSA攻击","密码学-哈希攻击与签名伪造","密码学-格与LLL","杂项-沙箱逃逸-PyJail与NodeJail","逆向-Reverse方法论"],unresolvedCount:0},s={name:n,title:e,summary:i,content:t,section:o,group:r,links:a};export{t as content,s as default,r as group,a as links,n as name,o as section,i as summary,e as title};
