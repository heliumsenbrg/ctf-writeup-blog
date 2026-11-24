const n="密码学-古典密码",e="密码学-古典密码",r='拿到一串"像乱码但不是编码"的东西：先判定它是**单表替换 / 多表替换 / 置换 / 现代加密**中的哪一类，再按顺序试对应的破解路径。',i=`# 密码学-古典密码

> 拿到一串"像乱码但不是编码"的东西：先判定它是**单表替换 / 多表替换 / 置换 / 现代加密**中的哪一类，再按顺序试对应的破解路径。

## 一、边界：编码不归本篇

| 疑问 | 归谁 |
|---|---|
| Base64 / hex / URL / Unicode / base32/58/62/85、自定义换表 base、零宽字符 | [[杂项-隐写与编码]] |
| **需要密钥或需要还原算法**的替换类、置换类密码（凯撒、维吉尼亚、栅栏……） | 本篇 |
| 分组密码模式、XOR 流密码、哈希长度扩展 | [[密码学-对称加密与哈希]] |
| 大数分解、Coppersmith、格 | [[密码学-RSA攻击]] |

**能无脑逆运算、不需要任何"秘密"的是编码；缺密钥或缺算法表的是密码**（摩斯/敲击码只有符号表，介于两者之间，本篇收录）。

## 二、识别第一步：三把尺子

| 指标 | 含义 | 读数 → 结论 |
|---|---|---|
| 重合指数 IC | 随机取两个字符相同的概率 | ≈0.066（英文）→ 单表或置换；≈0.038（1/26）→ 多表或随机；**介于两者** → 多表且密钥短 |
| 字母频率分布 | 是否保持自然语言的"起伏" | 起伏明显 → 单表（换名不换形）；被抹平 → 多表 |
| 卡西斯基 Kasiski | 重复片段间距的最大公约数 | 有稳定公约数（6-12 最常见）→ 维吉尼亚类；间距全随机 → 置换或单表 |
| 字符集是否变化 | 与排序前的字符集比对 | 一致 → 置换（只换位置）；不一致 → 替换 |
| 长度与分组 | 是否被 5/8/16 整除 | 5 → 培根/ADFGX；8/16 倍数 → 现代分组密码 |

**按成本递增的试错顺序**：凯撒(25) → Atbash/ROT13/ROT47 → 摩斯/培根（看字符集）→ 仿射(312) → 栅栏（枚举栏数）→ 单表词频 → 维吉尼亚(Kasiski) → Playfair/希尔（通常需 hint 或密钥）。

## 三、通用工具函数
\`\`\`python
import string, math, re, itertools, collections, random
A = string.ascii_uppercase
tr = lambda s, frm, to: s.translate(str.maketrans(frm, to))   # 等长有序表映射
az = lambda s: ''.join(c for c in s.upper() if c in A)         # 只留 A-Z
EN = {'A':.0817,'B':.0149,'C':.0278,'D':.0425,'E':.1270,'F':.0223,'G':.0202,'H':.0609,'I':.0697,
      'J':.0015,'K':.0077,'L':.0403,'M':.0241,'N':.0675,'O':.0751,'P':.0193,'Q':.0009,'R':.0599,
      'S':.0633,'T':.0906,'U':.0276,'V':.0098,'W':.0236,'X':.0015,'Y':.0197,'Z':.0007}
def fitness(s):        # 越小越像英文（单字母 chi-square 距离）；单表替换就靠它排序
    t = az(s)
    return 1e9 if not t else sum((t.count(c)/len(t) - EN[c])**2 / EN[c] for c in A)
def ic(s):             # 重合指数：英文≈0.066，随机≈0.038，多表且密钥短居中
    t = az(s); n = len(t)
    return 0 if n < 2 else sum(v*(v-1) for v in collections.Counter(t).values()) / (n*(n-1))
# 置换类必须用 n-gram 打分：栅栏/列置换只换位置、字母频率分毫不变，上面的 fitness 对它们
# 恒为同一常数，排不出先后。CORPUS 只需一段 ~1KB 的日常英文。
CORPUS = az("the of and to in a is that it for as with was his he be at by have this from or had "
            "not are but what all were when we there can an your which their said if do will each "
            "about how up out them then she many some so these would other into has more her two "
            "like him see time could no than been its who now people my made over did down only") * 4
QG = collections.Counter(CORPUS[i:i+4] for i in range(len(CORPUS)-3))
def qscore(s):         # 四元组对数得分：越大越像英文（置换类用它排序候选）
    s = az(s)
    return sum(math.log10(QG[s[i:i+4]] or 1) for i in range(len(s)-3))
\`\`\`
**枚举候选 → 打分排序 / 算 \`ic\` 判类型**，下面每个脚本都只有这两件事。

## 四、单表替换（Monoalphabetic Substitution）

| 密码 | 识别特征 | 解密要点 |
|---|---|---|
| 凯撒 Caesar | 纯字母，IC≈0.066，频率曲线整体平移 | 暴力 25 个位移取 \`fitness\` 最小；无脑先跑 |
| ROT13 | 同上，但解出来恰好可读 | 凯撒的特例；工具的"Rotate"就是它 |
| ROT47 | 覆盖 ASCII 33-126，密文含数字标点 \`!-~\` | 94 取模位移 47，再 ROT47 一次即还原 |
| Atbash | 字母表完全镜像 | \`A↔Z\`，**不需要暴力**，一次映射到底 |
| 仿射 Affine | 单表，但频率曲线被拉伸/压缩 | 枚举 \`a∈{1,3,5,7,9,11,15,17,19,21,23,25}\`（与 26 互素）、\`b∈0..25\`，共 312 种 |
| 关键词替换 | 单表，字母表前半段像可读单词 | 找"字母表里突然出现单词"的位置推出密钥词，再补完剩余字母表 |
| 培根 Bacon | **只有两种字符**，长度是 5 的倍数 | 每 5 个一组做 A/B 映射；24 字母版把 I/J、U/V 合并 |
| 猪圈 Pigpen | 图形由线段 / 带点格子构成 | 对照"9 格方阵 + X 形网格"表；带点的是后 13 个字母 |
| 跳舞小人 | 火柴人姿态 | 同猪圈的"图形→字母"表；配合词长猜常见词 |
| 与佛论禅 / 新佛曰 | 密文本身是**中文**，像佛经/禅语 | 在线解码器；本质是 Unicode 偏移 + 字典替换 |

\`\`\`python
caesar = lambda ct, s: tr(ct, A+A.lower(), (A[s:]+A[:s]) + (A[s:]+A[:s]).lower())
print(sorted(((s, caesar("WKH TXLFN EURZQ IRA MXPSV RYHU WKH ODCB GRJ", s)) for s in range(26)),
             key=lambda kv: fitness(kv[1]))[0])   # → (23, 'THE QUICK BROWN FOX ...')
r13 = lambda s: caesar(s, 13)                      # 23 与"左移 3"等价，明文一样
R47 = string.ascii_lowercase + ''.join(chr(c) for c in range(33, 127) if not chr(c).isalnum())
r47 = lambda s: tr(s, R47, R47[47:] + R47[:47])
atbash = lambda s: tr(s, A+A.lower(), A[::-1] + A[::-1].lower())
def affine_brute(ct):                              # 仿射：312 种全枚举（a 与 26 互素）
    for a in (1,3,5,7,9,11,15,17,19,21,23,25):
        ai = pow(a, -1, 26)
        for b in range(26):
            yield a, b, tr(ct, A, ''.join(A[(ai*(i-b)) % 26] for i in range(26)))
print(min(affine_brute(tr("ATTACK", A, ''.join(A[(5*i+8) % 26] for i in range(26)))),
          key=lambda t: fitness(t[2])))            # → (5, 8, 'ATTACK')
B24 = A.replace('I', '').replace('U', '')          # 培根 24 字母版：I/J、U/V 合并
def bacon(ct, alphabet=A):
    tab = {''.join(b): alphabet[i] for i, b in enumerate(itertools.product('AB', repeat=5))
           if i < len(alphabet)}                   # 32 种组合多于字母数时截断
    bits = [c.upper() for c in ct if c.upper() in 'AB']
    return ''.join(tab.get(''.join(bits[i:i+5]), '?') for i in range(0, len(bits)//5*5, 5))
print(bacon("AABBB ABBAA ABBBA ABAAA BAABA BABAA AAABB BAABB AABAA"),          # → CDEFGHIJK
      bacon("AABAA AAAAA AAABA AABAB AABBA AABAA AABAA AABBA AAAAB", B24))     # → BACONBACON
\`\`\`
两套培根字母表都要试：24 字母表的串用 26 字母表解会得到乱码。
**单表词频破解**：先用 \`quipqiup\`（在线，最快）；要自己写就用**爬山法**——随机初始字母映射，反复交换两个字母并保留 \`qscore\` 更高的解，几十行即可（和 \`qscore\` 配合，逻辑与上面 \`affine_brute\` 的"枚举 + 打分"一样，只是改成随机搜索）。

## 五、多表替换（Polyalphabetic）

| 密码 | 识别特征 | 解密要点 |
|---|---|---|
| 维吉尼亚 Vigenère | IC 明显低于 0.066，频率被抹平 | **已知密钥**直接减；未知走 Kasiski 求密钥长 → 按列做 26 位移频率分析 |
| 博福特 Beaufort | 与维吉尼亚外形完全相同 | 公式反向 \`P = K - C mod 26\`；两种公式都试成本极低 |
| 变体博福特 | 同上 | \`P = C - K mod 26\`；三者只差符号 |
| 自动密钥 Autokey | 密钥 = 密钥词 + 明文前缀 | 先解前几列恢复密钥词，再滚动推进；错一位后面全错 |
| Gronsfeld | 密钥是**数字**串 | 数字即位移量，等价维吉尼亚；密钥长 = 数字个数 |
| Playfair | 密文长度**必为偶数**；明文同一对里无重复字母 | 5x5 方阵，**I/J 合并**；同行右移、同列下移、矩形换列；遇 \`EE\` 要插 \`X\` |
| 希尔 Hill | 长度是 n 的倍数（n 常为 2/3），频率被线性混合 | 已知矩阵求逆 \`mod 26\`；未知矩阵用已知明文对反解 |
| Porta | 与维吉尼亚类似 | 13 行替换表，密钥字母成对等价（A/B 同表） |

\`\`\`python
def vig(ct, k, dec=True):                          # 维吉尼亚（已知密钥）
    k = az(k); o = []
    for i, c in enumerate(ct):
        if c.upper() in A:
            s = A.index(k[i % len(k)]) * (-1 if dec else 1)
            o.append(A[(A.index(c.upper()) + s) % 26])
        else: o.append(c)
    return ''.join(o)
def kasiski(ct, L=3):                              # 重复片段的间距 → 候选密钥长
    t = az(ct); d = collections.Counter(); pos = collections.defaultdict(list)
    for i in range(len(t)-L): pos[t[i:i+L]].append(i)
    for p in pos.values():
        for a, b in itertools.combinations(p, 2): d[b-a] += 1
    return d.most_common(12)
def vig_crack(ct, keylen, score=fitness):          # 分列后每列当成凯撒逐个候选字母试
    t = az(ct)
    return ''.join(A[min(range(26), key=lambda s: score(vig(c, A[s])))]
                   for c in (t[i::keylen] for i in range(keylen)))
SAMPLE = ("the of and to in a is that it for as with was his he be at by have this from or had "
          "not are but what all were when we there can an your which their said if do will each") * 3
CT = vig(az(SAMPLE), "LEMON", dec=False)
# 间距 55/40/360/270… 全是 5 的倍数 → 密钥长 5；逐个密钥长试，只有 5 给出 LEMON
print(kasiski(CT)[:5]); print([(kl, round(ic(CT), 4), vig_crack(CT, kl)) for kl in range(1, 9)])
# 博福特把公式反过来：P = (K - C) mod 26，即 A[(A.index(k) - A.index(c)) % 26]
def playfair(key, ct, dec=True, pad='X'):          # 5x5 方阵，I/J 合并
    key = az(key).replace('J', 'I'); sq = []; step = -1 if dec else 1
    for c in key + A.replace('J', ''):             # 去重后补完字母表 → 25 格
        if c not in sq: sq.append(c)
    rc = lambda c: divmod(sq.index(c), 5)
    ct, out = az(ct), ''
    if not dec and len(ct) % 2: ct += pad          # 加密前：同对重复插 X + 奇数补 X
    for i in range(0, len(ct), 2):
        (r1, c1), (r2, c2) = rc(ct[i]), rc(ct[i+1])
        if r1 == r2:   out += sq[r1*5+(c1+step) % 5] + sq[r2*5+(c2+step) % 5]      # 同行右移
        elif c1 == c2: out += sq[((r1+step) % 5)*5+c1] + sq[((r2+step) % 5)*5+c2]  # 同列下移
        else:          out += sq[r1*5+c2] + sq[r2*5+c1]                            # 矩形换列
    return out
std = "HIDETHEGOLDINTHETREXESTUMP"   # 标准预处理（EE → EXE）后的明文，26 字符
print(playfair("PLAYFAIR EXAMPLE", std, dec=False))    # → BMODZBXDNABEKUDMUIXMMOUVIF
import numpy as np                                 # 希尔：已知 n×n 矩阵求逆 mod 26
def hill_dec(ct, K):
    K = np.array(K); n = K.shape[0]; det = int(round(np.linalg.det(K))) % 26
    Ki = (pow(det, -1, 26) * np.round(np.linalg.inv(K) * np.linalg.det(K)).astype(int)) % 26
    v = [A.index(c) for c in az(ct)]
    return ''.join(A[x % 26] for i in range(0, len(v), n)
                   for x in (Ki @ np.array(v[i:i+n]) % 26))
\`\`\`

## 六、置换类（Transposition）

**判定关键：字符集完全不变，只是顺序被打乱**，频率分布仍是自然语言。

| 密码 | 识别特征 | 解密要点 |
|---|---|---|
| 栅栏 Rail fence | 长度可被栏数整除时呈规律跳读 | **枚举 2..len/2 的所有栏数**，用 \`qscore\` 排序（不能用 \`fitness\`） |
| 列置换 Columnar | 长度被列数整除，末尾可能有填充 | 枚举列数 × 列顺序（或按密钥词字母序排） |
| 曲路 / 螺旋 / 蛇形 | 密文是方阵按某路径展平的 | 先按平方数/因子还原成方阵，再试 8 种读取路径 × 4 种旋转 |
| 倒序 / 反转 | 整体或逐词反转 | 依次试整体反转、逐词反转、块内反转 |
| 栅格 Cardan grille | 题面给一张带孔卡片图 | 按孔位取字符，**旋转 90° 重复 4 次** |

\`\`\`python
def rail_dec(ct, rails):                           # 栅栏：枚举 2..len/2 的所有栏数
    n = len(ct); pat = list(range(rails)) + list(range(rails-2, 0, -1))
    rail_of = [pat[i % len(pat)] for i in range(n)]            # 每个位置属于哪一栏
    rows, k = [], 0
    for r in range(rails):                                     # 按栏切分密文
        cnt = rail_of.count(r); rows.append(ct[k:k+cnt]); k += cnt
    pos, out = [0]*rails, []
    for r in rail_of:                                          # 按 zigzag 顺序回读
        out.append(rows[r][pos[r]]); pos[r] += 1
    return ''.join(out)
print(max(((r, rail_dec("WECRLTEERDSOEEFEAOCAIVDEN", r)) for r in range(2, 12)),
          key=lambda t: qscore(t[1])))             # → (3, 'WEAREDISCOVEREDFLEEATONCE')
def col_enc(pt, cols, order=None):                 # 明文按行写 → 按列序读出
    order = order or list(range(cols)); rows = -(-len(pt) // cols)
    grid = [[''] * cols for _ in range(rows)]
    for k, ch in enumerate(pt): grid[k // cols][k % cols] = ch
    return ''.join(''.join(grid[r][c] for r in range(rows) if r*cols + c < len(pt)) for c in order)
def col_dec(ct, cols, order=None):                 # 密文按列序灌入 → 按行读出（每列长度末行可能不满）
    order = order or list(range(cols)); rows = -(-len(ct) // cols)
    grid, k = [[''] * cols for _ in range(rows)], 0
    for c in order:
        cnt = sum(1 for r in range(rows) if r*cols + c < len(ct))
        for r in range(cnt): grid[r][c] = ct[k]; k += 1
    return ''.join(''.join(row) for row in grid)
\`\`\`

## 七、其他经典

| 密码 | 识别特征 | 解密要点 |
|---|---|---|
| 摩斯 Morse | 只有 \`.-\` 或 \`-_\`，另有分隔符 | 空格分词、\`/\` 分字；**分隔符变体多**：\`/\` \`\\\` 换行、大小写切换、0/1 |
| 敲击码 Tap code | 两个 1-5 的数字成对出现 | 5x5 方阵（同 Playfair 表，C/K 合并） |
| ADFGX / ADFGVX | 字符只取自 \`ADFGX\`（或加 V） | 先查 5x5(6x6) Polybius 坐标还原中间文本，再做列置换 |
| 恩格斯 / 培根变体 | 两种形态的字符流 | 按 5 位分组映射；"点划"与"AB"可互换 |
| 书密码 Book cipher | 一串 \`(行, 词, 字)\` 三元组 | 需要**同一本书**当密钥，先找题面提示的"书" |
| null cipher | 一段看着正常的句子 | 取每词首字母 / 每句首词 / 第 n 个字母；**先怀疑"正常文本本身"** |

\`\`\`python
MORSE = dict(zip(".- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --..".split(), A)) | dict(zip("----- .---- ..--- ...-- ....- ..... -.... --... ---.. ----.".split(), "0123456789")) | {'..--..': '?', '-.-.--': '!'}
def morse(code):                                   # _ 当 -，* / 0 当点，兼容常见变体
    code = code.replace('_', '-').replace('*', '.').replace('0', '.').replace('1', '-')
    return ' '.join(''.join(MORSE.get(g, '?') for g in w.split())
                    for w in re.split(r'\\s*[/\\\\|]\\s*|\\s{2,}', code.strip()) if w)
\`\`\`
\`morse(".... . .-.. .-.. --- / .-- --- .-. .-.. -..")\` → \`HELLO WORLD\`（空格分字母、\`/\` 分词）。

## 八、中文 / emoji / 十六进制串怎么办

| 密文形态 | 处理思路 |
|---|---|
| 中文密文，像佛经/禅语 | 与佛论禅 / 新佛曰在线解码；解完再判一层编码 |
| 中文密文，像正常句子但读不通 | 中文单表替换（同音/形近映射）或 **Unicode 码位偏移**（每个字的 \`ord\` 加减常数） |
| emoji 串 | 按"字符集有几种"归类：N=2 → 培根/二进制；N=26 → 表情符号字母表替换；与明文等长 → 单表替换 |
| 纯 hex 长串 | 先 \`bytes.fromhex\`；可打印 ASCII 再判 base64（归 [[杂项-隐写与编码]]）；0-25 序列 → 映射字母表 |
| 数字成对且都在 1-5 / 0-25 | 敲击码 / Polybius；或 \`chr(x + 65)\` 直接还原 |

## 九、工具与自定义脚本

| 工具 | 用途 |
|---|---|
| **CyberChef** | 常用组合 \`From Base64\`→\`ROT13\`→\`XOR\`；\`Magic\` 自动猜；\`Frequency distribution\` 图看单表/多表；\`Vigenère Decode\` 直接填密钥 |
| **dCode** | 覆盖面最广的在线识别站，维吉尼亚/希尔/ADFGX 都有现成页面，适合交叉验证 |
| **quipqiup** | 单表替换词频破解，**比手写爬山法快得多**，先喂它 |
| **自写脚本** | 上面 \`fitness\` / \`ic\` / \`qscore\` / \`kasiski\` 就是核心；CTF 脚本放 \`CTF/scripts/misc/\`。需要 numpy 等第三方库的脚本要在 Git Bash 的 \`python\`（3.11 + 完整 CTF 栈）下跑 |

## 十、决策流程（背下来）

\`\`\`
密文
├─ 有 = 填充 / 纯 %xx / 只有 A-Z2-7        → 编码，去 [[杂项-隐写与编码]]
├─ 只有 .- 或两种符号且有分隔符             → 摩斯 / 敲击码 / 培根
├─ 只有 A-Za-z，字符集无变化                → 凯撒(25) → ROT13 → Atbash
│   ├─ IC≈0.066 且频率起伏                  → 单表：仿射(312) → quipqiup → 爬山法
│   ├─ IC 明显偏低                          → 多表：Kasiski 求长 → 分组频率 → 维吉尼亚/博福特/Gronsfeld
│   └─ 长度偶数、且题面有 hint               → Playfair；长度是 2/3 的倍数 → 希尔
├─ 字符集不变但顺序乱、IC≈0.066             → 置换：栅栏(枚举栏数) → 列置换 → 曲路/倒序
├─ 中文 / emoji / 图形 / 只含 ADFGX(V)      → 与佛论禅、猪圈、跳舞小人、表情符号表、Polybius 坐标
└─ 解出结果后又像 base64/hex                → 回 [[杂项-隐写与编码]] 再剥一层（最常见的第二层）
\`\`\`

**两个反向检查**：\`ic\` 一直是 0.066 左右说明字母频率没被动过 → 直接按置换类处理；解出来又像 base64/hex → 回编码流程再剥一层。

## 关联

- [[杂项-隐写与编码]] —— 本篇的边界对照表就在这页开头；"是编码还是密码"是两条路的岔口
- [[密码学-对称加密与哈希]] —— 同一套识别方法从古典延伸到 AES/XOR；那页的古典密码表是本篇的速查版
- [[CTF-常用工具清单]] —— CyberChef / dCode / quipqiup 的安装与常用 recipe 都在这里
- [[CTF-竞赛总览与解题流程]] —— 本篇的"决策流程"是总流程在 Crypto 方向上的细化
- [[逆向-Reverse方法论]] —— 密码算法被编译进二进制时的处理路径（找不到密钥就先逆算法）

## 存疑 / 矛盾

- **IC 不是判据而是倾向**：密文很短（<100 字符）时 IC 抖得厉害，单表也可能测出 0.05；必须结合长度与频率图的"形状"一起看。
- **"解不出来 = 密码选错了"常常不成立**：更常见的是**方向错**（把置换当替换）、**少试了变体**（博福特三种公式、培根 24/26 版、I/J 是否合并），或**明文语言不是英文**（中文拼音、拉丁文会让 \`fitness\` 全失效）。
- **维吉尼亚自动求密钥会翻车**：\`vig_crack\` 依赖每列有足够的自然语言统计，短密文（<200 字符）或"AAAA…"这类重复明文都会给出错的密钥——先 Kasiski 定长度，再人工核对候选列。
- **工具版本差异**：CyberChef 的 Magic 对自定义字母表会猜错；不同在线"与佛论禅"实现的 Unicode 偏移不一致，同一串在两个站点输出可能不同——先换站再怀疑自己。
- **栅栏/列置换的填充字符**会干扰打分：先手工剔掉 \`X\`、空格之类填充再评估。

## 来源

- 糯米内建知识整理 · 2026-10-03（无外部文件）
`,o="concept",t="crypto",a={internal:["CTF-常用工具清单","CTF-竞赛总览与解题流程","密码学-RSA攻击","密码学-对称加密与哈希","杂项-隐写与编码","逆向-Reverse方法论"],unresolvedCount:0},s={name:n,title:e,summary:r,content:i,section:o,group:t,links:a};export{i as content,s as default,t as group,a as links,n as name,o as section,r as summary,e as title};
