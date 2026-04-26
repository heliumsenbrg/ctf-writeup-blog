import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Flag, CheckCircle, Clock, Zap } from 'lucide-react'

const challenges = [
  // 信息泄露
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
  // PHP弱类型
  { id: 201, name: 'ezphp', category: 'php', points: 158, solved: true, method: '弱类型绕过' },
  { id: 202, name: 'ezphp_1', category: 'php', points: 162, solved: true, method: 'array_search' },
  { id: 203, name: 'ezphp_2', category: 'php', points: 171, solved: true, method: '嵌套弱类型' },
  { id: 204, name: 'ezmd5', category: 'php', points: 165, solved: true, method: '0e MD5' },
  { id: 205, name: 'ezmd5_1', category: 'php', points: 184, solved: true, method: '双0e MD5' },
  { id: 206, name: 'ezmd5_2', category: 'php', points: 175, solved: true, method: 'md5数组' },
  { id: 207, name: 'ezmd5_3', category: 'php', points: 172, solved: true, method: 'md5数组' },
  { id: 208, name: 'ezmd5_4', category: 'php', points: 186, solved: true, method: 'MD5爆破' },
  // 命令注入
  { id: 225, name: 'ezcmd', category: 'cmd', points: 204, solved: true, method: '直接执行' },
  { id: 226, name: 'ezcmd_1', category: 'cmd', points: 200, solved: true, method: '分号注入' },
  { id: 227, name: 'ezcmd_2', category: 'cmd', points: 208, solved: true, method: '注释截断' },
  { id: 228, name: 'ezcmd_3', category: 'cmd', points: 222, solved: true, method: 'IFS绕过' },
  { id: 230, name: 'ezcmd_5', category: 'cmd', points: 357, solved: true, method: '无字母RCE ★', firstBlood: true },
  { id: 231, name: 'ezcmd_6', category: 'cmd', points: 263, solved: true, method: 'eval执行' },
  { id: 232, name: 'ezcmd_7', category: 'cmd', points: 256, solved: true, method: '字符串拼接' },
  { id: 233, name: 'ezcmd_8', category: 'cmd', points: 263, solved: true, method: 'passthru' },
  { id: 234, name: 'ezcmd_9', category: 'cmd', points: 270, solved: true, method: 'tab绕过' },
  { id: 235, name: 'ezcmd_10', category: 'cmd', points: 357, solved: true, method: '源码泄露 ★', firstBlood: true },
  { id: 236, name: 'ezcmd_11', category: 'cmd', points: 333, solved: true, method: '源码泄露 ★', firstBlood: true },
  // PWN
  { id: 5, name: 'X0r', category: 'pwn', points: 200, solved: true, method: 'XOR解密' },
  { id: 151, name: "Pwn's Door", category: 'pwn', points: 150, solved: true, method: '逆向密码' },
  { id: 999, name: 'input_function', category: 'pwn', points: 500, solved: true, method: 'Shellcode ★', firstBlood: true },
]

const categoryNames = {
  infoleak: { name: '信息收集与泄露', color: 'cyan' },
  php: { name: 'PHP 弱类型', color: 'purple' },
  cmd: { name: '命令注入', color: 'pink' },
  pwn: { name: 'PWN 与逆向', color: 'blue' }
}

export default function Challenges() {
  const grouped = challenges.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = []
    acc[c.category].push(c)
    return acc
  }, {})
  
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-cyber-purple/70 text-sm font-mono tracking-widest">
            ▶ CHALLENGE_LIST
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 anime-title text-gradient">
            题目列表
          </h1>
          <p className="text-cyber-grid mt-4 font-mono">
            共 <span className="text-cyber-cyan">{challenges.length}</span> 题 | 
            已解 <span className="text-cyber-cyan">{challenges.filter(c => c.solved).length}</span> 题 |
            总分 <span className="text-cyber-cyan">{challenges.reduce((sum, c) => sum + c.points, 0)}</span> pts
          </p>
        </motion.div>
        
        {/* Challenge categories */}
        {Object.entries(grouped).map(([cat, items], catIndex) => (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-8 h-8 rounded-lg bg-cyber-${categoryNames[cat].color}/20 flex items-center justify-center`}>
                <Flag className={`w-4 h-4 text-cyber-${categoryNames[cat].color}`} />
              </div>
              <h2 className="text-2xl font-bold text-cyber-cyan anime-title">
                {categoryNames[cat].name}
              </h2>
              <span className="text-sm text-cyber-grid font-mono">
                {items.length}题 | {items.reduce((sum, c) => sum + c.points, 0)}pts
              </span>
            </div>
            
            <div className="grid gap-3">
              {items.map((challenge, i) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: catIndex * 0.1 + i * 0.05 }}
                >
                  <Link to={`/article/${cat}`}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="cyber-card p-4 flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          challenge.solved 
                            ? 'bg-cyber-cyan/20 text-cyber-cyan' 
                            : 'bg-cyber-grid/20 text-cyber-grid'
                        }`}>
                          {challenge.solved ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-cyber-cyan group-hover:text-white transition-colors">
                              {challenge.name}
                            </span>
                            {challenge.firstBlood && (
                              <span className="px-2 py-0.5 text-xs bg-cyber-pink/20 text-cyber-pink rounded font-mono animate-pulse">
                                一血
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-cyber-grid font-mono">
                            ID: {challenge.id}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <span className="text-sm text-cyber-grid">
                          {challenge.method}
                        </span>
                        <span className="text-lg font-bold text-cyber-cyan">
                          {challenge.points}
                          <span className="text-xs text-cyber-grid ml-1">pts</span>
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
        
        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="cyber-card p-8 mt-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-cyber-cyan" />
            <span className="text-cyber-purple/70 text-sm font-mono">▶ SUMMARY</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-gradient">100%</div>
              <div className="text-xs text-cyber-grid">一血率</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">38</div>
              <div className="text-xs text-cyber-grid">已解题数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">4</div>
              <div className="text-xs text-cyber-grid">分类数量</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">0</div>
              <div className="text-xs text-cyber-grid">未解题数</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
