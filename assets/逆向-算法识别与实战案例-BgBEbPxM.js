const n="逆向-算法识别与实战案例",r="逆向-算法识别与实战案例",e='[[逆向-Reverse方法论]] 讲"怎么走到比较点"，这页讲**认出它是什么算法**（常量表 + 结构）和**我们实战里踩过的具体坑**。0xGame 的逆向/算法题几乎全能在这页找到对应。',a=`# 逆向-算法识别与实战案例\r
\r
> [[逆向-Reverse方法论]] 讲"怎么走到比较点"，这页讲**认出它是什么算法**（常量表 + 结构）和**我们实战里踩过的具体坑**。0xGame 的逆向/算法题几乎全能在这页找到对应。\r
\r
## 一、魔法常量速查表（认算法的指纹）\r
\r
| 常量 | 算法 | 备注 |\r
|---|---|---|\r
| \`0x9E3779B9\` | TEA / XTEA / XXTEA | delta = ⌊(√5−1)/2 · 2³²⌋（黄金比例） |\r
| \`0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476\` | MD5；前三个也是 SHA-1 的初始值 | SHA-1 第五个 \`0xC3D2E1F0\` |\r
| \`0x6A09E667, 0xBB67AE85, …\` | SHA-256 | 前 8 个质数平方根小数部分 |\r
| \`0xEDB88320\` | CRC32（反射多项式） | 校验类题目 |\r
| \`0x63, 0x7C, 0x77, 0x7B, …\`（S 盒） | AES（Rijndael S-box） | 魔改题会换表，但表结构还在 |\r
| \`0x243F6A88, 0x85A308D3, …\` | Blowfish | π 的十六进制位 |\r
| \`"expand 32-byte k"\` | Salsa20 / ChaCha20 | 常量字符串 |\r
| \`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef…+/\` | Base64 表 | 换表题改的就是它 |\r
| DES 的大 IP/E/P/S 盒数组 | DES | 见下面"2 轮 DES"案例 |\r
\r
**使用方式**：IDA/Ghidra 里搜常量 → 定位到函数 → 按对应算法结构读逻辑。魔改（换 S 盒、换表、换 delta）不影响识别，只是要找差异点。\r
\r
## 二、结构识别\r
\r
- **循环结构**：16 轮（DES）、10/12/14 轮（AES-128/192/256）、32 轮（TEA 系）\r
- **Feistel（左右两半互换）**：DES、TEA、SM4 结构；**SPN（代换-置换交替）**：AES\r
- **查表操作**：大数组 + 索引运算 = 表驱动密码；反过来也能从表重建算法\r
- **异或密钥内联**：直接在代码里看到 byte 数组当 key → 抄出来就能解\r
\r
## 三、实战案例（全部来自打过的题）\r
\r
### 案例 1：2 轮 DES 已知明文攻击（0xGame 309）\r
\r
- 程序把"随机文本 → 加密 ↔ flag 加密"都只跑了 **2 轮 DES**（完整版 16 轮才安全）。\r
- 攻击思路（已知一对 P/C）：\r
  1. 拆出 \`L0,R0\`（明文过 IP）与 \`L2,R2\`（密文反推）\r
  2. 由轮函数关系直接得到两个 f 值：\`f(R0,K1)=L0⊕L2\`，\`f(R1,K2)=R0⊕R2\`\r
  3. \`f = P(S(E(R)⊕K))\` 逆着走：\`P⁻¹(f)\` → 对每个 S 盒**反查所有可能输入**（每个 4-bit 输出对应约 4 个 6-bit 输入）\r
  4. 每个 S 盒得到若干 K 位候选 → 枚举组合，去 PC-1/PC-2 逆推主密钥（还要补 8 个校验位）\r
  5. 验证（重加密对齐）→ 用同一密钥解 flag 密文（**解密 = 交换子密钥顺序再跑**）\r
- 教训：轮数少到一定程度，"安全算法"就是纸糊的——**先数轮数**。\r
\r
### 案例 2：Z3 从汇编提约束（0xGame 706 ZZZ）\r
\r
- 从汇编提取出 4 个方程（3 个线性组合 + 1 个位移/异或混合），丢给 Z3 求解。\r
- 坑 1：**sscanf 的参数顺序**（Windows x64 调用约定，寄存器对应）会让变量对应关系错位——别凭直觉排。\r
- 坑 2：解出的值过了本地 SHA-256 校验、平台仍拒收（疑似平台问题）——**本地验证全对时保留证据，考虑换题**。\r
\r
### 案例 3：PE 常量提取（flag-checker 类）\r
\r
- 要捞硬编码常量时：**objdump 找 \`movabs\` 立即数**，比全文件裸搜靠谱（常量常被拆进多条指令）。\r
- 地址换算：\`file_offset = PointerToRawData + (VA − VirtualAddress)\`（PE 节表 VMA→文件偏移）。\r
- 工具：\`objdump -d -M intel\` + 手算偏移；或用 Ghidra 直接看。\r
\r
### 案例 4：壳与编码组合（0xGame 314 / 704 / 705）\r
\r
- 314 \`upx\`：\`upx -d\` 脱壳 → 发现 \`encoded[i] = input[i] XOR 0x21 XOR input[i+1]\` → 反推。\r
- 704 \`BaseUpx\`：UPX + Base64 双拼。\r
- 705 \`EasyXor\`：\`flag[i] = (str[i] − i) XOR key[i % len]\`，key = \`raputa0xGame2025\`——**逐位置异或 + 位置减法**是常见的"轻度混淆"配方。\r
\r
### 案例 5：其它速杀与坑\r
\r
- \`strings\` 直给：610 逆向工程入门指北、612 base（Base64 明文在二进制里）。\r
- C++ 异常：613 catch ——flag 藏在 \`catch\` 块的 ROT13 数据里。\r
- **pyc 版本陷阱**：3.12 编译的 pyc 不能拿 3.11 反编译/加载（magic number 不匹配）——要么换解释器版本，要么用 pycdc 一类工具碰运气。\r
- APK（545 easyApp）：jadx 出 MainActivity → 前段 Base64、后段藏在 assets 里的 dex → BigInteger 方程组求解。\r
\r
## 关键点\r
\r
- 魔法常量表是第一武器：\`0x9E3779B9\`=TEA 系、\`0x67452301\`=MD5、\`0x6A09E667\`=SHA-256\r
- **表被换 ≠ 算法被换**：把常量抄出来替换标准实现即可，不用重推算法\r
- 识别顺序：先块长（8/16），再常量，最后轮数\r
- 结构识别看轮函数形态（移位/异或/查表），比逐指令读快十倍\r
\r
## 关联\r
\r
- [[逆向-Reverse方法论]] —— 起手式与通用流程\r
- [[密码学-对称加密与哈希]] —— 认出算法后反推的数学\r
- [[密码学-格与椭圆曲线]] —— 数学重题的下一页\r
- [[0xGame2025-征战记录]] —— 以上案例的原题与 flag\r
- [[本机环境与CTF工具链]] —— Ghidra / x64dbg / IDA Free 的使用边界\r
\r
## 存疑 / 矛盾\r
\r
- "UPX 一眼秒"看情况：改过头的 UPX（魔改节名/多壳叠加）脱出来还要修；遇到别硬扛，先换工具试。\r
- \`strings\` 直给类题是"运气题"：做完要理解**为什么能直给**（没加密 vs 懒得混淆），下次先判断数据类型再投入。\r
\r
## 来源\r
\r
- 0xGame2025 实战（309 / 314 / 610 / 612 / 613 / 704 / 705 / 706 / 545）· 2026-10-03\r
- 技能：\`pe-ctf-reversing\`、\`cipher-checker-reversing\`\r
`,s="concept",t="reverse",i={internal:["0xGame2025-征战记录","密码学-对称加密与哈希","密码学-格与椭圆曲线","本机环境与CTF工具链","逆向-Reverse方法论"],unresolvedCount:0},x={name:n,title:r,summary:e,content:a,section:s,group:t,links:i};export{a as content,x as default,t as group,i as links,n as name,s as section,e as summary,r as title};
