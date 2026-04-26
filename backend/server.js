import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

// CTF Challenges Data
const challenges = [
  { id: 177, name: 'basic', category: 'infoleak', points: 50, solved: true, method: 'HTML注释Base64' },
  { id: 178, name: 'basic_1', category: 'infoleak', points: 60, solved: true, method: 'HTML注释Base64' },
  { id: 179, name: 'basic_2', category: 'infoleak', points: 72, solved: true, method: '参数篡改' },
  { id: 180, name: 'basic_3', category: 'infoleak', points: 78, solved: true, method: 'JSFuck解码' },
  { id: 181, name: 'basic_4', category: 'infoleak', points: 81, solved: true, method: 'ASCII数组' },
  { id: 182, name: 'basic_5', category: 'infoleak', points: 90, solved: true, method: '客户端伪造' },
  { id: 183, name: 'basic_6', category: 'infoleak', points: 90, solved: true, method: '响应头泄露' },
  { id: 186, name: 'basic_8', category: 'infoleak', points: 144, solved: true, method: '.phps源码泄露' },
  { id: 187, name: 'basic_9', category: 'infoleak', points: 111, solved: true, method: 'robots.txt' },
  { id: 188, name: 'basic_10', category: 'infoleak', points: 300, solved: true, method: 'Cookie IDOR' },
  { id: 192, name: 'basic_14', category: 'infoleak', points: 181, solved: true, method: '/proc/self/fd' },
  { id: 643, name: 'basic_7', category: 'infoleak', points: 238, solved: true, method: '302响应体' },
  { id: 201, name: 'ezphp', category: 'php', points: 158, solved: true, method: '弱类型绕过' },
  { id: 202, name: 'ezphp_1', category: 'php', points: 162, solved: true, method: 'array_search' },
  { id: 203, name: 'ezphp_2', category: 'php', points: 171, solved: true, method: '嵌套弱类型' },
  { id: 204, name: 'ezmd5', category: 'php', points: 165, solved: true, method: '0e MD5' },
  { id: 205, name: 'ezmd5_1', category: 'php', points: 184, solved: true, method: '双0e MD5' },
  { id: 206, name: 'ezmd5_2', category: 'php', points: 175, solved: true, method: 'md5数组' },
  { id: 207, name: 'ezmd5_3', category: 'php', points: 172, solved: true, method: 'md5数组' },
  { id: 208, name: 'ezmd5_4', category: 'php', points: 186, solved: true, method: 'MD5爆破' },
  { id: 225, name: 'ezcmd', category: 'cmd', points: 204, solved: true, method: '直接执行' },
  { id: 226, name: 'ezcmd_1', category: 'cmd', points: 200, solved: true, method: '分号注入' },
  { id: 227, name: 'ezcmd_2', category: 'cmd', points: 208, solved: true, method: '注释截断' },
  { id: 228, name: 'ezcmd_3', category: 'cmd', points: 222, solved: true, method: 'IFS绕过' },
  { id: 230, name: 'ezcmd_5', category: 'cmd', points: 357, solved: true, method: '无字母RCE', firstBlood: true },
  { id: 231, name: 'ezcmd_6', category: 'cmd', points: 263, solved: true, method: 'eval执行' },
  { id: 232, name: 'ezcmd_7', category: 'cmd', points: 256, solved: true, method: '字符串拼接' },
  { id: 233, name: 'ezcmd_8', category: 'cmd', points: 263, solved: true, method: 'passthru' },
  { id: 234, name: 'ezcmd_9', category: 'cmd', points: 270, solved: true, method: 'tab绕过' },
  { id: 235, name: 'ezcmd_10', category: 'cmd', points: 357, solved: true, method: '源码泄露', firstBlood: true },
  { id: 236, name: 'ezcmd_11', category: 'cmd', points: 333, solved: true, method: '源码泄露', firstBlood: true },
  { id: 5, name: 'X0r', category: 'pwn', points: 200, solved: true, method: 'XOR解密' },
  { id: 151, name: "Pwn's Door", category: 'pwn', points: 150, solved: true, method: '逆向密码' },
  { id: 999, name: 'input_function', category: 'pwn', points: 500, solved: true, method: 'Shellcode', firstBlood: true },
]

// API Routes
app.get('/api/challenges', (req, res) => {
  res.json(challenges)
})

app.get('/api/stats', (req, res) => {
  res.json({
    total: challenges.length,
    solved: challenges.filter(c => c.solved).length,
    totalPoints: challenges.reduce((sum, c) => sum + c.points, 0),
    firstBlood: challenges.filter(c => c.firstBlood).length
  })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`[CTF Blog API] Server running on http://localhost:${PORT}`)
  console.log(`[CTF Blog API] ${challenges.length} challenges loaded`)
})
