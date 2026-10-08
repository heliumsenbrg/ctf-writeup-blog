import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { join } from 'path'
import { articles } from './src/data/articles.js'
import kb from './src/data/kb/index.js'
import { allChallenges } from './src/data/challenges.js'
import { articleDates, dateOf } from './src/data/articleDates.js'

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
 * 知识库 ↔ 题解 的关联索引（构建时生成）。
 * 匹配方式：中文没有词边界，所以对笔记的「标题 + 摘要」切 2~5 字 n-gram，
 *          再看哪些 n-gram 出现在文章正文里 —— 命中数够多就算相关。
 *          （最初只拿整段笔记名去比，命中率极低，才 3 对；n-gram 才能抓到
 *             「反序列化」「弱类型」这类跨笔记的公共术语。）
 */
function buildRelated() {
  const CJK = /[\u4e00-\u9fa5]/
  const STOP = new Set(['的', '了', '与', '和', '在', '是', '为', '及', '等', '中', '对', '从'])

  /** 标题+摘要 → 去重后的 n-gram 集合 */
  const gramsOf = (text) => {
    const t = String(text || '').replace(/[\s`*_#>\[\]()（）:：,，.。;；!！?？"'“”]/g, ' ')
    const set = new Set()
    // 中文 n-gram
    for (const run of t.match(/[\u4e00-\u9fa5]{2,}/g) || []) {
      for (let n = 5; n >= 3; n--) {
        for (let i = 0; i + n <= run.length; i++) {
          const g = run.slice(i, i + n)
          if (!STOP.has(g)) set.add(g)
        }
      }
    }
    // 拉丁词（长度 ≥3）
    for (const w of t.match(/[A-Za-z][A-Za-z0-9+#.]{2,}/g) || []) set.add(w.toLowerCase())
    return [...set]
  }

  const notes = []
  for (const sec of kb.sections) {
    for (const g of sec.groups) {
      for (const n of g.notes) {
        notes.push({
          name: n.name,
          title: n.title || n.name,
          summary: n.summary || '',
          grams: gramsOf((n.title || n.name) + ' ' + (n.summary || '')),
        })
      }
    }
  }

  const arts = Object.entries(articles).map(([id, a]) => {
    const hay = ((a.title || '') + ' ' + (a.subtitle || '') + ' ' + (a.content || '')).toLowerCase()
    return { id, title: a.title || id, subtitle: a.subtitle || '', hay }
  })

  const byArticle = {}
  const byNote = {}
  for (const a of arts) byArticle[a.id] = []
  for (const n of notes) byNote[n.name] = []

  for (const a of arts) {
    const scored = notes
      .map((n) => {
        let hits = 0
        let weight = 0
        for (const g of n.grams) {
          // 3 字以上才计分，避免「测试」这类短词乱命中
          if (g.length < 3) continue
          if (a.hay.includes(g)) { hits++; weight += g.length }
        }
        return { n, hits, weight }
      })
      .filter((x) => x.hits >= 4)
      .sort((x, y) => y.weight - x.weight)
      .slice(0, 3)

    for (const { n } of scored) {
      byArticle[a.id].push({ name: n.name, title: n.title, summary: n.summary })
      if (byNote[n.name] && byNote[n.name].length < 3) {
        byNote[n.name].push({ id: a.id, title: a.title, subtitle: a.subtitle })
      }
    }
  }

  void CJK
  return { articles: byArticle, notes: byNote }
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
        if (url.includes('related.json')) return send(buildRelated())
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
      const indexHtml = readFileSync(abs('index.html'), 'utf8')

      // ④ 兜底
      writeFileSync(abs('404.html'), indexHtml)
      writeFileSync(abs('.nojekyll'), '')

      const routes = [
        '/',
        '/challenges',
        '/about',
        '/guestbook',
        '/stats',
        '/secret-quest',
        '/kb',
        ...Object.keys(articles).map((id) => `/article/${id}`),
        ...kbNames().map((n) => `/kb/${n}`),
      ]

      // ⓿ 逐页 meta：给每条路由算自己的 title / description（og、twitter 同步改）
      const SITE_TITLE = "heliumsenbrg's CTF Writeups"
      const kbMeta = new Map()
      for (const sec of kb.sections) for (const g of sec.groups) for (const n of g.notes) kbMeta.set(n.name, n)
      const escHtml = (v) =>
        String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

      const metaOf = (route) => {
        const mArt = route.match(/^\/article\/(.+)$/)
        if (mArt) {
          const a = articles[decodeURIComponent(mArt[1])]
          if (a) return { title: a.title + ' | ' + SITE_TITLE, desc: a.subtitle || a.title }
        }
        const mKb = route.match(/^\/kb\/(.+)$/)
        if (mKb) {
          const n = kbMeta.get(decodeURIComponent(mKb[1]))
          if (n) return { title: n.title + ' | 知识库 | ' + SITE_TITLE, desc: String(n.summary || n.title).slice(0, 160) }
        }
        const STATIC_META = {
          '/challenges': ['全部挑战', '按平台与分类浏览全部 CTF 挑战记录。'],
          '/kb': ['知识库', '第二大脑：CTF 概念、项目与解题记录，支持双链与关系图。'],
          '/guestbook': ['留言板', '无需注册，直接留言。'],
          '/about': ['关于', '关于本站、技能方向与友情链接。'],
        }
        const hit = STATIC_META[route]
        return hit ? { title: hit[0] + ' | ' + SITE_TITLE, desc: hit[1] } : null
      }

      const withMeta = (html, route, meta) => {
        const url = SITE + route
        const T = meta.title
        const D = meta.desc
        return html
          .replace(/<title>[\s\S]*?<\/title>/, '<title>' + escHtml(T) + '</title>')
          .replace(/(<meta name="description" content=")[^"]*(")/, '$1' + escHtml(D) + '$2')
          .replace(/(<meta property="og:title" content=")[^"]*(")/, '$1' + escHtml(T) + '$2')
          .replace(/(<meta property="og:description" content=")[^"]*(")/, '$1' + escHtml(D) + '$2')
          .replace(/(<meta property="og:url" content=")[^"]*(")/, '$1' + escHtml(url) + '$2')
          .replace(/(<meta name="twitter:title" content=")[^"]*(")/, '$1' + escHtml(T) + '$2')
          .replace(/(<meta name="twitter:description" content=")[^"]*(")/, '$1' + escHtml(D) + '$2')
          .replace(/(<meta name="twitter:url" content=")[^"]*(")/, '$1' + escHtml(url) + '$2')
      }

      // ① 每条路由预生成 index.html（深链返回 200）
      let made = 0
      for (const r of routes) {
        if (r === '/') continue
        try {
          const dir = abs(r.slice(1))
          mkdirSync(dir, { recursive: true })
          const pageMeta = metaOf(r)
          writeFileSync(join(dir, 'index.html'), pageMeta ? withMeta(indexHtml, r, pageMeta) : indexHtml)
          made++
        } catch (e) {
          console.warn(`[seo-static] 跳过 ${r}：${e.message}`)
        }
      }

      // ② sitemap
      // 末尾统一带斜杠：GitHub Pages 对无尾斜杠的深链会 301 跳一次，sitemap 里直接写规范形态
      const urlOf = (r) => {
        const path = r.split('/').map((seg, i) => (i === 0 ? '' : encodeURIComponent(seg))).join('/')
        return SITE + (path.endsWith('/') ? path : path + '/')
      }
      writeFileSync(
        abs('sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          routes
            .map((r) => {
              const d = r.startsWith('/article/')
                ? dateOf(decodeURIComponent(r.slice('/article/'.length)))
                : null
              return `  <url><loc>${urlOf(r)}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`
            })
            .join('\n') +
          `\n</urlset>\n`
      )

      // ③ rss（pubDate 用 src/data/articleDates.js 里的真实发布日期）
      const now = new Date().toUTCString()
      const items = Object.entries(articles)
        .map(([id, a]) => {
          const link = `${SITE}/article/${id}`
          return (
            `    <item>\n` +
            `      <title>${xmlEsc(a.title)}</title>\n` +
            `      <link>${link}</link>\n` +
            `      <guid isPermaLink="true">${link}</guid>\n` +
            // 有真实发布日期的写 pubDate（RSS 里 pubDate 是可选的）；
            // 没日期的**省略**，不再用构建时间冒充 —— 否则每篇都显示成刚发布
            (dateOf(id) ? `      <pubDate>${new Date(dateOf(id) + 'T09:00:00Z').toUTCString()}</pubDate>\n` : '') +
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

      // ⑦ 知识库 ↔ 题解 关联索引
      const related = buildRelated()
      writeFileSync(abs('related.json'), JSON.stringify(related))

      console.log(
        `[seo-static] 预生成 ${made} 条路由 · sitemap ${routes.length} 条 · rss ${Object.keys(articles).length} 篇 · 搜索索引 ${searchIndex.items.length} 条 · 图谱 ${graph.nodes.length} 节点/${graph.edges.length} 边 · 关联 ${Object.values(related.articles).reduce((n, v) => n + v.length, 0)} 对`
      )
    },
  }
}

export default defineConfig({
  // 环境感知：GitHub Pages 需要子路径，Vercel 根路径
  // VITE_BASE 优先（发布到 WorkBuddy 沙箱时挂在域名根路径 → VITE_BASE=/）；
  // 默认 /ctf-writeup-blog/ 供 GitHub Pages 使用。
  // 用环境变量而不是命令行 --base=/ 有个额外好处：MSYS/Git-Bash 会把以 / 开头的
  // 命令行参数当路径转换，环境变量不受影响。
  base: process.env.VITE_BASE || (process.env.VERCEL ? '/' : '/ctf-writeup-blog/'),
  plugins: [react(), seoStaticPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    // 发布到 WorkBuddy 沙箱后是经反向代理访问的，不放行主机会被 Vite 拦成
    // "Blocked request. This host is not allowed."
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  build: {
    // 默认 target 偏新，老设备（尤其旧 iOS Safari）可能直接语法报错 → 整个 SPA 黑屏。
    // 压到 iOS 13 / Chrome 79 一代，代价是包略大，换取老手机也能打开。
    target: ['es2020', 'safari14', 'chrome87', 'firefox78', 'edge88'],
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
          // tsparticles 不在这里声明：声明后 Vite 会把它当成入口图的一部分**预加载**，
          // 而它其实只在首页懒加载用 → 不声明它就自然成为懒加载 chunk（省 183KB 首屏）。
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
