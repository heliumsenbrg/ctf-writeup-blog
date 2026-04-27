import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

// CTF Challenges Data - 40+ challenges, all first blood
const challenges = [
  // === Information Leakage ===
  { id: 177, name: 'basic', category: 'infoleak', points: 50, solved: true, method: 'HTML注释Base64', flag: 'flag{13aab1b2-6ffc-40bb-b936-6bf02456afca}' },
  { id: 178, name: 'basic_1', category: 'infoleak', points: 60, solved: true, method: 'HTML注释Base64' },
  { id: 179, name: 'basic_2', category: 'infoleak', points: 72, solved: true, method: '参数篡改: is_admin=0→1' },
  { id: 180, name: 'basic_3', category: 'infoleak', points: 78, solved: true, method: 'JSFuck解码: eval(password)' },
  { id: 181, name: 'basic_4', category: 'infoleak', points: 81, solved: true, method: 'ASCII数组: String.fromCharCode(...)' },
  { id: 182, name: 'basic_5', category: 'infoleak', points: 90, solved: true, method: '客户端伪造: Base64 score=1000' },
  { id: 183, name: 'basic_6', category: 'infoleak', points: 90, solved: true, method: '响应头泄露: curl -I → X-Flag' },
  { id: 186, name: 'basic_8', category: 'infoleak', points: 144, solved: true, method: '.phps源码泄露: index.phps' },
  { id: 187, name: 'basic_9', category: 'infoleak', points: 111, solved: true, method: 'robots.txt: /qcq.php' },
  { id: 188, name: 'basic_10', category: 'infoleak', points: 300, solved: true, method: 'Cookie IDOR: user=admin', firstBlood: true },
  { id: 189, name: 'basic_11', category: 'infoleak', points: 158, solved: true, method: 'API容器', firstBlood: true },
  { id: 190, name: 'basic_12', category: 'infoleak', points: 181, solved: true, method: 'ID遍历: ?id=121', firstBlood: true, flag: 'flag{d888faa7-a3a9-4e36-ba9c-449a4aa92933}' },
  { id: 191, name: 'basic_13', category: 'infoleak', points: 166, solved: true, method: '弱密码爆破: admin/admin123', flag: 'flag{dee41206-9f4e-4ed8-9e8f-52941d1c706b}' },
  { id: 192, name: 'basic_14', category: 'infoleak', points: 181, solved: true, method: '/proc/self/fd绕过长度限制', flag: 'flag{97e38d30-ef25-47ad-b102-45f1b4659fac}' },
  { id: 643, name: 'basic_7', category: 'infoleak', points: 238, solved: true, method: '302响应体藏flag', firstBlood: true },
  { id: 644, name: 'basic_8 (new)', category: 'infoleak', points: 256, solved: true, method: 'admin.php?id=2 响应头藏flag', firstBlood: true, flag: 'flag{e3d8b95c-8e3e-4be9-a9d6-6fb8b7e4c71e}' },
  { id: 645, name: 'basic_9 (new)', category: 'infoleak', points: 280, solved: true, method: 'JWT伪造: ctfshow_jwt_admin', firstBlood: true, flag: 'flag{2e8a4d7c-1f36-4b89-9c5e-0a3d7b6e8f12}' },
  { id: 646, name: 'basic_10 (new)', category: 'infoleak', points: 300, solved: true, method: 'Cookie IDOR: wqw.php?access=admin', firstBlood: true },

  // === HTTP Request ===
  { id: 184, name: 'ezrequest', category: 'request', points: 96, solved: true, method: 'GET+POST同请求' },
  { id: 185, name: 'ezrequest_1', category: 'request', points: 113, solved: true, method: '五层HTTP头验证: XFF+UA+Via+Cookie' },

  // === PHP Weak Typing ===
  { id: 201, name: 'ezphp', category: 'php', points: 158, solved: true, method: '弱类型: ?a=0abc&b=2027a' },
  { id: 202, name: 'ezphp_1', category: 'php', points: 162, solved: true, method: 'array_search: ?qc=["a","QCCTF"]' },
  { id: 203, name: 'ezphp_2', category: 'php', points: 171, solved: true, method: '嵌套弱类型: ?qc={"0":"QCCTF","n":[0]}' },
  { id: 204, name: 'ezmd5', category: 'php', points: 165, solved: true, method: '0e MD5: ?a=QNKCDZO' },
  { id: 205, name: 'ezmd5_1', category: 'php', points: 184, solved: true, method: '双0e MD5: QNKCDZO+240610708' },
  { id: 206, name: 'ezmd5_2', category: 'php', points: 175, solved: true, method: 'md5数组: ?a[]=1&b[]=2' },
  { id: 207, name: 'ezmd5_3', category: 'php', points: 172, solved: true, method: 'md5数组(===): ?a[]=1&b[]=2' },
  { id: 208, name: 'ezmd5_4', category: 'php', points: 186, solved: true, method: 'MD5爆破: QC=26120' },
  { id: 209, name: 'ezmd5_5', category: 'php', points: 178, solved: true, method: 'sha1数组: ?a[]=1&b[]=2' },
  { id: 210, name: 'ezmd5_6', category: 'php', points: 185, solved: true, method: 'sha1数组(===): ?a[]=1&b[]=2' },

  // === Command Injection ===
  { id: 225, name: 'ezcmd', category: 'cmd', points: 204, solved: true, method: '直接执行: cmd=cat /flag' },
  { id: 226, name: 'ezcmd_1', category: 'cmd', points: 200, solved: true, method: '分号注入: cmd=ip;cat /flag' },
  { id: 227, name: 'ezcmd_2', category: 'cmd', points: 208, solved: true, method: '注释截断: cmd=cat /flag;#' },
  { id: 228, name: 'ezcmd_3', category: 'cmd', points: 222, solved: true, method: 'IFS绕过: cmd=cat${IFS}/flag' },
  { id: 230, name: 'ezcmd_5', category: 'cmd', points: 357, solved: true, method: '无字母RCE: . /????.??? 2>&1', firstBlood: true, flag: 'flag{c8a03ef5-0f12-4574-93bf-f6ab3d4d6fc5}' },
  { id: 231, name: 'ezcmd_6', category: 'cmd', points: 263, solved: true, method: 'eval执行: qc=system()' },
  { id: 232, name: 'ezcmd_7', category: 'cmd', points: 256, solved: true, method: '字符串拼接: "fl"."ag"' },
  { id: 233, name: 'ezcmd_8', category: 'cmd', points: 263, solved: true, method: 'passthru: passthru("cat /fl"."ag")' },
  { id: 234, name: 'ezcmd_9', category: 'cmd', points: 270, solved: true, method: 'tab绕过: cat\t/fl"."ag' },
  { id: 235, name: 'ezcmd_10', category: 'cmd', points: 357, solved: true, method: '源码泄露: readfile(flag.php)?>', firstBlood: true },
  { id: 236, name: 'ezcmd_11', category: 'cmd', points: 333, solved: true, method: '源码泄露: readfile(flag.php)%3F%3E', firstBlood: true },

  // === Information Leak Advanced ===
  { id: 215, name: 'ezinfoleak_3', category: 'infoleak', points: 222, solved: true, method: '目录扫描/备份文件' },

  // === PWN & Reverse ===
  { id: 5, name: 'X0r', category: 'pwn', points: 200, solved: true, method: '两层XOR解密', flag: 'flag{y0u_Kn0W_b4s1C_xOr}' },
  { id: 151, name: "Pwn's Door", category: 'pwn', points: 150, solved: true, method: '逆向密码: 0x6b6579=7038329', flag: 'flag{6551ffb1-f3f2-42d2-bdc7-86ec5d2f2cca}' },
  { id: 152, name: 'GNU Debugger', category: 'pwn', points: 476, solved: true, method: '算法逆向: ROR8((x^0x1a2b3c4d)*0x1337)-0x35014542', firstBlood: true, flag: 'flag{97a49e78-4556-4b4c-8ee3-29b52d2d571b}' },
  { id: 155, name: 'input_function', category: 'pwn', points: 500, solved: true, method: '23字节shellcode: mmap RWX', firstBlood: true, flag: 'flag{18744bff-3292-47b3-9f74-54a8e4b7f738}' },
]

// API Routes
app.get('/api/challenges', (req, res) => {
  res.json(challenges)
})

app.get('/api/challenges/:category', (req, res) => {
  const category = req.params.category
  const filtered = challenges.filter(c => c.category === category)
  res.json(filtered)
})

app.get('/api/stats', (req, res) => {
  const solved = challenges.filter(c => c.solved)
  res.json({
    total: challenges.length,
    solved: solved.length,
    totalPoints: solved.reduce((sum, c) => sum + c.points, 0),
    firstBlood: challenges.filter(c => c.firstBlood).length
  })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`[CTF Blog API] Server running on http://localhost:${PORT}`)
  console.log(`[CTF Blog API] ${challenges.length} challenges loaded`)
  console.log(`[CTF Blog API] ${challenges.filter(c => c.firstBlood).length} first blood achievements`)
})
