const r="Web-SSRF与XXE",n="Web-SSRF与XXE",e='两个"借服务器的身份去请求"的漏洞：SSRF 让服务器替我们发 HTTP 请求，XXE 让解析器替我们读本地文件/发请求。共同点是——**把自己伪装成"内网可信来源"。**',t=`# Web-SSRF与XXE\r
\r
> 两个"借服务器的身份去请求"的漏洞：SSRF 让服务器替我们发 HTTP 请求，XXE 让解析器替我们读本地文件/发请求。共同点是——**把自己伪装成"内网可信来源"。**\r
\r
## 一、SSRF（服务端请求伪造）\r
\r
### 1. 判断标志\r
参数里出现 URL / 域名 / 图片地址：\`?url=\`、\`?image=\`、\`?src=\`、\`?share=\`、\`?callback=\`、\`?webhook=\`、\`?domain=\`；或功能本身是"加载远程资源/抓取网页/下载文件/转换格式"。\r
\r
验证方法：把参数换成你自己的地址（或用 DNSlog / 内网不可达地址），看是否产生请求。\r
\r
### 2. 能干什么\r
- **探测内网**：\`http://127.0.0.1:PORT/\`、\`http://内网IP:6379\`，靠响应差异（长度/耗时/报错）判断端口开放\r
- **打内网服务**：Redis（写 crontab / 写 webshell / 主从复制）、MySQL、FastCGI(9000)、Memcached、Docker API(2375)\r
- **读本地文件**：\`file:///etc/passwd\`、\`dict://\`、\`gopher://\`（**gopher 是打 Redis 的关键**，因为可以发原始 TCP 字节）\r
- **云元数据**：\`http://169.254.169.254/latest/meta-data/\`（云环境题常考），可拿临时凭据\r
\r
### 3. Bypass 清单（当有黑名单时）\r
| 拦截 | 绕过 |\r
|---|---|\r
| \`127.0.0.1\` 被禁 | \`0177.0.0.1\`、\`2130706433\`（十进制）、\`0x7f.0.0.1\`、\`[::1]\`、\`127.1\` |\r
| \`localhost\` 被禁 | 大小写、\`localtest.me\` 这类解析到 127.0.0.1 的域名 |\r
| 域名白名单 | \`http://allowed.com@evil.com\`（@ 前是迷惑）、\`http://evil.com#allowed.com\`、子域名混淆 |\r
| 只允许 http | \`gopher://\`、\`dict://\`、\`file://\`、\`ftp://\` |\r
| 重定向被跟 | 自己的服务器 302 到目标（用自己的域名过白名单） |\r
| 出网被封 | 盲打：靠时间差（\`http://127.0.0.1:22\` 与 \`:80\` 耗时不同） |\r
\r
### 4. 收尾\r
SSRF 在 CTF 里的价值通常不是"读个文件"，而是**借内网可信身份去打一个没有认证的内网服务**——这正是容器题的标准套路，见 [[Docker-Registry与远程API利用]]。\r
\r
## 二、XXE（XML 外部实体注入）\r
\r
### 1. 判断标志\r
请求体是 XML（\`Content-Type: text/xml\`）、或功能涉及"导入 XML/Excel(docx/xlsx 本质是 zip+XML)/SVG/订阅源"。\r
\r
验证：在 XML 里引入外部实体，看是否解析。\r
\r
### 2. 基本结构\r
DTD 里声明实体，让解析器去取外部资源：\r
\r
\`\`\`xml\r
<!DOCTYPE x [<!ENTITY f SYSTEM "file:///etc/passwd">]>\r
<root>&f;</root>\r
\`\`\`\r
\r
能读文件、能发请求（\`SYSTEM "http://..."\`）、能打内网（SSRF 效果）。\r
\r
### 3. 常考变形\r
\r
| 场景 | 手法 |\r
|---|---|\r
| 不回显 | 外部 DTD 引到自己的服务器（参数实体 \`%\`），把文件内容当路径拼过去偷出来（OOB/带外） |\r
| 回声困难 | 报错里带文件内容（error-based XXE） |\r
| 无正常回显且不出网 | 需 OOB + 自己的 vps，或用 ftp 协议把多行内容当目录名 |\r
| 过滤 \`ENTITY\` 关键字 | 用参数实体、UTF-16 编码请求体、\`<!DOCTYPE\` 改写 |\r
| PHP 环境 | 配 \`php://filter\` 读源码（能套在 SYSTEM 里） |\r
| 上传 xlsx/docx/svg | 解压改其中的 XML，再上传触发 |\r
\r
### 4. 和其它题型的交界\r
XXE 常常只是**入口**：用它读配置拿凭据、或用它做 SSRF 打内网，真正拿 flag 在下一跳。\r
\r
## 关键点\r
\r
- SSRF 在现代 CTF 的主战场是**内网横向**（gopher 打 Redis / Docker API），不是读个文件\r
- XXE 无回显走 OOB（参数实体 + 自家服务器的外部 DTD）；先确认解析器真的解析 DTD\r
- 两者产出常是"凭据 / 内网入口"，flag 多半在下一跳\r
- 云元数据地址 \`169.254.169.254\` 在靶机反而更可能通，别用真实云的结论推靶机\r
\r
## 关联\r
\r
- [[Docker-Registry与远程API利用]] —— SSRF 打内网服务的典型落点\r
- [[Web-文件包含与上传]] —— 读取文件/上传载体\r
- [[Web-认证与会话漏洞]] —— 内网服务常无认证，SSRF 即"绕过认证"\r
- [[Web-源码泄露与信息收集]] —— 先知道内网有什么才能打\r
- [[CTF-常用工具清单]]\r
\r
## 存疑 / 矛盾\r
\r
- "SSRF 只能读文件"是常见误解：在现代 CTF 里它的主战场是**内网服务横向**（gopher + Redis / Docker API）。\r
- 云元数据地址 \`169.254.169.254\` 在真实云上已普遍加了访问限制，本地/靶机环境反而更可能通——**别用云上的结论直接推靶机**。\r
- XXE 在现代语言默认解析器里大多已关闭外部实体，遇到不通先确认是否真的解析了 DTD。\r
\r
## 来源\r
\r
- 糯米内建知识整理 · 2026-10-03（无外部文件）\r
`,o="concept",s="web",c={internal:["CTF-常用工具清单","Docker-Registry与远程API利用","Web-文件包含与上传","Web-源码泄露与信息收集","Web-认证与会话漏洞"],unresolvedCount:0},S={name:r,title:n,summary:e,content:t,section:o,group:s,links:c};export{t as content,S as default,s as group,c as links,r as name,o as section,e as summary,n as title};
