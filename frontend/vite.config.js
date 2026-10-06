import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { join } from 'path'
import { articles } from './src/data/articles.js'
import kb from './src/data/kb/index.js'
import { allChallenges } from './src/data/challenges.js'

/** 站点正式地址（canonical 用 Pages 那条，Vercel 镜像不作 canonical） */
const SITE = 'https://heliumsenbrg.github.io/ctf-writeup-blog'

const xmlEsc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const kbNames = () => {
  const out = []
  for (const s of kb.sections) for (const g of s.groups) for (const n of g.notes) out.push(n.name)
  return out
}

/**
 * 知识库关系图数据：节点 = 笔记（带 section/group 用于配色），边 = links.internal。
 * 边会去重（A→B 与 B→A 合并），自环丢弃。
 */
function buildKbGraph() {
  const NOTES_DIR = path.join(fileURLToPath(new URL('.', import.meta.url)), 'src', 'data', 'kb', 'notes')
  const nodes = []
  const links = []

  for (const s of kb.sections) {
    for (const g of s.groups) {
      for (const n of g.notes) {
        let body = ''
        try {
          body = JSON.parse(readFileSync(path.join(NOTES_DIR, `${n.name}.json`), 'utf8')).links?.internal || []
        } catch {
          body = []
        }
        nodes.push({
          id: n.name,
          title: n.title || n.name,
          section: s.id,
          sectionTitle: s.title,
          group: g.title,
          links: body.length,
        })
        for (const t of body) {
          if (t === n.name) continue
          const a = n.name
          const b = t
          const key = a < b ? `${a}||${b}` : `${b}||${a}`
          links.push({ key, source: a, target: b })
        }
      }
    }
  }

  // 去重 + 丢弃指向未发布笔记的边
  const ids = new Set(nodes.map((n) => n.id))
  const seen = new Set()
  const edges = []
  for (const l of links) {
    if (seen.has(l.key) || !ids.has(l.target)) continue
    seen.add(l.key)
    edges.push([l.source, l.target])
  }

  // 度（决定节点大小）
  const deg = Object.fromEntries(nodes.map((n) => [n.id, 0]))
  for (const [a, b] of edges) {
    deg[a] += 1
    deg[b] += 1
  }
  for (const n of nodes) n.degree = deg[n.id]

  return { generatedAt: new Date().toISOString(), nodes, edges }
}

/**
 * 全站搜索索引（构建时生成，避免把几十万字的正文塞进主包）：
 *   题解 24 + 知识库笔记 69 + 挑战 53 —— 只收标题/摘要/标签这类轻量字段。
 * 产物：dist/search-index.json，前端按需 fetch（⌘K 打开时）。
 */
function buildSearchIndex() {
  const items = []

  for (const [id, a] of Object.entries(articles)) {
    items.push({
      type: 'writeup',
      path: `/article/${id}`,
      title: a.title || id,
      sub: a.subtitle || '',
      // 正文也进索引：写解题思路里常搜的是 payload/函数名，光看标题搜不到
      text: `${a.title || ''} ${a.subtitle || ''} ${a.content || ''}`,
      tags: [],
    })
  }

  const NOTES_DIR = path.join(fileURLToPath(new URL('.', import.meta.url)), 'src', 'data', 'kb', 'notes')
  const readNoteBody = (name) => {
    try {
      return JSON.parse(readFileSync(path.join(NOTES_DIR, `${name}.json`), 'utf8')).content || ''
    } catch {
      return ''
    }
  }

  for (const s of kb.sections) {
    for (const g of s.groups) {
      for (const n of g.notes) {
        items.push({
          type: 'note',
          path: `/kb/${n.name}`,
          title: n.title || n.name,
          sub: n.summary || '',
          text: `${n.title || ''} ${n.name} ${n.summary || ''} ${readNoteBody(n.name)}`,
          tags: [s.title, g.title].filter(Boolean),
        })
      }
    }
  }

  for (const c of allChallenges) {
    items.push({
      type: 'challenge',
      path: '/challenges',
      title: c.title || c.slug,
      sub: c.description || '',
      text: `${c.title || ''} ${c.slug} ${c.description || ''} ${(c.tags || []).join(' ')}`,
      tags: [c.platform, c.category].filter(Boolean),
    })
  }

  return { generatedAt: new Date().toISOString(), items }
}

/**
 * 构建后静态生成：
 *  ① 每条路由一个真 index.html —— GitHub Pages 对不存在的路径会走 404.html，
 *     内容能渲染但**状态码是 404，搜索引擎不收录**。预生成目录后深链直接 200。
 *  ② sitemap.xml —— 主路由 + 全部文章 + 全部知识库笔记（**不含隐藏彩蛋 /secret-quest**）。
 *  ③ rss.xml —— index.html 里 <link rel="alternate"> 指向它，此前一直是 404。
 *  ④ 404.html 兜底 + .nojekyll（原 spa-fallback 插件的职责，保留）。
 *  ⑤ search-index.json —— 全站搜索用（轻量：标题/摘要/标签）。
 * 用 configResolved 取真实 outDir，别再硬编码 'dist'。
 */
function seoStaticPlugin() {
  let outDir = 'dist'
  return {
    name: 'seo-static',
    apply: 'build',
    configResolved(cfg) {
      outDir = cfg.build.outDir
    },
    // dev 下也让搜索/图谱能用（不写盘，现算现给）
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || ''
        const send = (obj) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(obj))
        }
        if (url.includes('search-index.json')) return send(buildSearchIndex())
        if (url.includes('kb-graph.json')) return send(buildKbGraph())
        next()
      })
    },
    closeBundle() {
      const abs = (p) => join(outDir, p)
      // 构建失败时不会产出 index.html —— 这里必须优雅退出，
      // 否则本插件抛的 ENOENT 会**盖住真正的构建错误**
      if (!existsSync(abs('index.html'))) {
        console.warn('[seo-static] 未产出 index.html（构建可能已失败），跳过静态生成')
        return
      }
      const indexHtml = readFileSync(abs('index.html'))

      // ④ 兜底
      writeFileSync(abs('404.html'), indexHtml)
      writeFileSync(abs('.nojekyll'), '')

      const routes = [
        '/',
        '/challenges',
        '/about',
        '/guestbook',
        '/kb',
        ...Object.keys(articles).map((id) => `/article/${id}`),
        ...kbNames().map((n) => `/kb/${n}`),
      ]

      // ① 每条路由预生成 index.html（深链返回 200）
      let made = 0
      for (const r of routes) {
        if (r === '/') continue
        try {
          const dir = abs(r.slice(1))
          mkdirSync(dir, { recursive: true })
          writeFileSync(join(dir, 'index.html'), indexHtml)
          made++
        } catch (e) {
          console.warn(`[seo-static] 跳过 ${r}：${e.message}`)
        }
      }

      // ② sitemap
      const urlOf = (r) =>
        SITE + r.split('/').map((seg, i) => (i === 0 ? '' : encodeURIComponent(seg))).join('/')
      writeFileSync(
        abs('sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          routes.map((r) => `  <url><loc>${urlOf(r)}</loc></url>`).join('\n') +
          `\n</urlset>\n`
      )

      // ③ rss（文章数据里没有日期字段，统用构建时间）
      const now = new Date().toUTCString()
      const items = Object.entries(articles)
        .map(([id, a]) => {
          const link = `${SITE}/article/${id}`
          return (
            `    <item>\n` +
            `      <title>${xmlEsc(a.title)}</title>\n` +
            `      <link>${link}</link>\n` +
            `      <guid isPermaLink="true">${link}</guid>\n` +
            `      <pubDate>${now}</pubDate>\n` +
            `      <description>${xmlEsc(a.subtitle || a.title)}</description>\n` +
            `    </item>`
          )
        })
        .join('\n')
      writeFileSync(
        abs('rss.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n` +
          `    <title>heliumsenbrg's CTF Writeups</title>\n` +
          `    <link>${SITE}/</link>\n` +
          `    <description>CTF WriteUp 博客 - Web 安全 / 密码学 / 二进制利用</description>\n` +
          `    <language>zh-CN</language>\n` +
          `    <lastBuildDate>${now}</lastBuildDate>\n` +
          `${items}\n  </channel>\n</rss>\n`
      )

      // ⑤ 全站搜索索引
      const searchIndex = buildSearchIndex()
      writeFileSync(abs('search-index.json'), JSON.stringify(searchIndex))

      // ⑥ 知识库关系图数据（节点 = 笔记，边 = 站内双链）
      const graph = buildKbGraph()
      writeFileSync(abs('kb-graph.json'), JSON.stringify(graph))

      console.log(
        `[seo-static] 预生成 ${made} 条路由 · sitemap ${routes.length} 条 · rss ${Object.keys(articles).length} 篇 · 搜索索引 ${searchIndex.items.length} 条 · 图谱 ${graph.nodes.length} 节点/${graph.edges.length} 边`
      )
    },
  }
}

export default defineConfig({
  // 环境感知：GitHub Pages 需要子路径，Vercel 根路径
  base: process.env.VERCEL ? '/' : '/ctf-writeup-blog/',
  plugins: [react(), seoStaticPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
          tsparticles: ['@tsparticles/react', '@tsparticles/slim', 'tsparticles'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  // 排除 public/gargantua 中的 import map 文件，避免 Vite 误扫描
  optimizeDeps: {
    entries: ['index.html', 'src/**/*.{js,jsx}'],
  },
  // 测试（vitest 直接读取 vite 配置）
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{js,jsx}'],
    setupFiles: ['./tests/setup.js'],
  },
})
