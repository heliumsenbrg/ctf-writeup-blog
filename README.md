# CTF Blog Web - 赛博朋克二次元风格

赛博朋克 + 二次元风格的 CTF WriteUp 博客网站

## 技术栈

- **前端**: React 18 + Vite + Tailwind CSS + Framer Motion
- **风格**: 赛博朋克 / 二次元 / 冷色调 (青/蓝/紫)

## 启动方式

### 安装依赖

```bash
cd frontend
npm install
```

### 启动开发服务器

```bash
cd frontend
npm run dev
```

- 前端: http://localhost:3000

## 特性

- ✅ 赛博朋克霓虹效果
- ✅ 扫描线动画
- ✅ 悬浮粒子背景
- ✅ 代码块语法高亮
- ✅ 响应式设计
- ✅ 38 题完整 WriteUp
- ✅ 一血标记动画

## 目录结构

```
blog/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx      # 布局 + 背景效果
│   │   │   ├── Navbar.jsx      # 导航栏
│   │   │   ├── Footer.jsx      # 页脚
│   │   │   ├── Home.jsx        # 首页
│   │   │   ├── Challenges.jsx  # 题目列表
│   │   │   └── Article.jsx     # 文章详情
│   │   ├── data/
│   │   │   └── challenges.js   # 挑战数据
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Tailwind + 自定义样式
│   ├── index.html
│   └── package.json
└── README.md
```
