const n="Web-认证与会话漏洞",e="Web-认证与会话漏洞",o='围绕"你是谁、你怎么证明"的部分：登录、Cookie/Session、Token（JWT）、越权。**CTF 里这页的知识经常是拿到第一跳凭据的钥匙。**',t=`# Web-认证与会话漏洞

> 围绕"你是谁、你怎么证明"的部分：登录、Cookie/Session、Token（JWT）、越权。**CTF 里这页的知识经常是拿到第一跳凭据的钥匙。**

## 一、登录环节

| 手法 | 说明 |
|---|---|
| SQL 注入绕过 | 用户名/密码框里塞 \`' or 1=1-- -\`（→ [[Web-SQL注入]]） |
| 弱口令 | admin/admin、admin/123456、test/test——先手工试几个再用字典 |
| 敏感信息泄露 | 前端 JS 里硬编码的账号、注释里的测试账号、\`/api/user\` 直接返回列表 |
| 注册逻辑 | 注册时能否指定 \`role=admin\`、\`id=1\`（越权注册） |
| 邮箱/手机验证码 | 万能验证码、验证码可爆破、验证码与手机号不绑定、返回包里直接给验证码 |
| 密码重置 | 重置链接可预测（时间戳/md5(用户名)）、\`host\` 头污染、token 可爆破、只校验用户名不校验 token |
| 逻辑缺陷 | 密码比对用 \`==\` 弱类型（\`0e...\` 同类哈希碰撞）、数组绕过（\`password[]=x\` 让 \`strcmp\` 返回 null） |
| 用户名枚举 | 报错文案不同（"用户不存在" vs "密码错误"） |

## 二、会话与 Token

### 1. Cookie / Session
- Cookie 里能直接看到 \`role\`、\`is_admin\` 时 → 试着改（存在客户端信任问题）
- Session ID 可预测 / 未 httponly → 结合 XSS 偷
- JWT 见下

### 2. JWT（最常考）
结构：\`base64url(header).base64url(payload).base64url(signature)\`

| 攻击 | 做法 | 前提 |
|---|---|---|
| 无签名 | \`alg\` 改 \`none\`（各种大小写变体 \`None\`/\`NONE\`），删掉签名段（末尾保留 \`.\`） | 服务端没校验 alg |
| 弱密钥 | 用字典爆破 HMAC 密钥（\`jwt_tool\` / hashcat 模式 16500） | HS256 |
| 算法混淆 | 把 \`RS256\` 改成 \`HS256\`，用**公钥当 HMAC 密钥**签 | 服务端代码误用 |
| 头部注入 | \`kid\` 参数打路径穿越/SQL 注入（\`kid: ../../dev/null\` 让密钥为空） | 服务端拿 kid 查密钥 |
| 声明篡改 | 直接改 \`role\`/\`user\`/\`exp\` 后重签（前提是已拿到密钥） | 已破密钥 |

**排查顺序**：先 base64 解头部看 alg → 试 none → 试弱密钥字典 → 再考虑混淆/注入。

### 3. OAuth / SSO（题里较少但出现就是重点）
关注 \`redirect_uri\` 校验不严（拿 code 到自己的地址）、\`state\` 缺失（CSRF）、第三方账号绑定逻辑。

## 三、越权（IDOR / BOLA）

最朴素但最容易忽略的一类：**改 ID / 改请求体的某个字段，就访问到了别人的数据。**

- 水平越权：\`/user?id=1\` → \`id=2\`，看能不能读别人的
- 垂直越权：普通用户 token 去打管理员接口，看后端有没有真的校验角色
- 隐藏参数：前端没显示的 \`isAdmin=false\` 手动加上去试试（**参数名靠猜，但常能从 JS/文档里找到**）

## 四、跨站类（XSS / CSRF / CORS）

- **XSS**：能执行 JS 的场景。CTF 里通常不是"弹窗就算过"，而是配合打管理员（如无头浏览器 admin bot）：\`<script>fetch('/flag').then(...)<\/script>\` 把内容外带；注意 CSP、HttpOnly
- **CSRF**：让管理员带着 Cookie 去访问我们构造的页面；要绕过 token / SameSite
- **CORS**：\`Access-Control-Allow-Origin\` 反射 + \`Access-Control-Allow-Credentials: true\` = 可跨域读数据；注意 \`null\` 域、子域信任

## 五、这页的实战用法

认证类漏洞的产出往往是**凭据或身份**，不是直接的 flag。拿到后要问：
- 这个身份能进哪个新入口？（后台、API、内部系统）
- 有没有可读的配置/日志暴露更多凭据？
- 内网还有别的服务吗？（→ [[Web-SSRF与XXE]]）

## 关联

- [[Web-SQL注入]] —— 登录绕过的兄弟
- [[Web-反序列化漏洞]] —— Shiro 的 rememberMe 既属会话也属反序列化
- [[Web-源码泄露与信息收集]] —— 找硬编码凭据的主要来源
- [[Docker-Registry与远程API利用]] —— 拿到身份后横向
- [[CTF-常用工具清单]] —— jwt_tool 等

## 存疑 / 矛盾

- "JWT 一定能改 alg=none" 不成立：现代库默认拒绝 none。**先看库/版本，再决定走爆破还是混淆**。
- 弱口令字典的选择很吃平台：CTF 靶机通常用极简口令（admin/123456），别直接上 10G 的 rockyou。

## 来源

- 糯米内建知识整理 · 2026-10-03（无外部文件）
`,s="concept",i="web",r={internal:["CTF-常用工具清单","Docker-Registry与远程API利用","Web-SQL注入","Web-SSRF与XXE","Web-反序列化漏洞","Web-源码泄露与信息收集"],unresolvedCount:0},l={name:n,title:e,summary:o,content:t,section:s,group:i,links:r};export{t as content,l as default,i as group,r as links,n as name,s as section,o as summary,e as title};
