const e="青岑-PS11-web系列清库",n="青岑-PS11-web系列清库",a="PS11 ez 系列（basic / ezphp / ezmd5 / ezinfoleak / ezfl / ezfu / ezsql）2026-10-23 打到 **99/100**（仅剩 ezsql_15），当日新解 11 题全部提交 WP。这批题**每关换一个防御点**，解法模板化但细节互斥——本页按关记套路，避免下次重复踩坑。",s=`# 青岑-PS11-web系列清库

> PS11 ez 系列（basic / ezphp / ezmd5 / ezinfoleak / ezfl / ezfu / ezsql）2026-10-23 打到 **99/100**（仅剩 ezsql_15），当日新解 11 题全部提交 WP。这批题**每关换一个防御点**，解法模板化但细节互斥——本页按关记套路，避免下次重复踩坑。

## 一、ezfl（文件包含）

**ezfl_6**（日志污染 RCE）：
- curl 必须用 \`-G --data-urlencode\`，否则 URL 规范化会吞掉 \`../\`
- php/data wrapper 与 \`.php\` 后缀都在黑名单 → 走日志包含
- **PHP8 + nginx 下日志污染必须用单引号**：双引号会被转义成 \`\\x22\`，导致解析错误**永久污染日志**、裸常量 fatal——这个坑一旦踩了只能重建容器
- flag 在 \`/qingcenctf.txt\`

## 二、ezfu（文件上传）

| 关 | 黑名单缺口 | 关键动作 |
|---|---|---|
| ezfu_8 | 漏 \`.user.ini\`/\`.htaccess\`；内容过滤只拦 \`<?php\` 字面量 | \`<?=\` 短标签直通；**flag 在 phpinfo 的环境变量里**（shell 的 \`env\` 看不到，必须 phpinfo） |
| ezfu_9 | LFI \`?doc=\` | 读 \`/etc/passwd-\` 备份，**GECOS 字段藏随机口令**（start.sh 每实例生成）；dashboard 的 .bz2 恢复按上传文件名落盘 → \`shell.php.bz2\` 直接解压出 webshell |
| ezfu_10 | 弱口令 admin/123456 | \`include()\` 解压恢复 = \`compress.bzip2://\` 流；文件名禁含 php → 用 \`.phtml\`；命令挂在 POST 的 URL 参数 \`?1=\` 上 |

## 三、ezsql（注入，11 关全套路）

| 关 | 防御 | 解法 |
|---|---|---|
| ezsql_4 | 单引号被转义 | 双引号上下文；admin/admin123 |
| ezsql_5 | 值被 \`("…")\` 包裹 + PHP 复核密码 | UNION 行第 3 列填输入的密码、第 2 列放 flag 子查询 |
| ezsql_6 | \`#\` 与 \`--\` 被滤 | \`/**/\` 可用；UNION 无 FROM 引用列必炸 → \`from flag where 1='1'\` 借真实行（passwd=admin123）过复核 |
| ezsql_9 / 16 | 数字型 / 函数名黑名单（version/user/database/information_schema 全拦） | 直注；16 盲猜列名 \`group_concat(secret)\` |
| ezsql_11 | select 全拒 | **堆叠 + \`concat('sel','ect')\` + PREPARE**，把查询结果 UPDATE 进 employees.name 借应用回显 |
| ezsql_14 | 无回显 | 纯时间盲注，**3 取 2 投票 + 等值复核抗抖动**（网络毛刺会造成假字符） |
| ezsql_15 | **未解（唯一遗留）** | PHP 疑似连 username 一起复核（16 同 payload 可过 15 不行），错误/延时全抑制；已提平台反馈。若重启：试 SQL quine（自引用行满足双字段复核） |

## 四、basic 入门（177-192，源码藏 flag 的梯度）

| 题 | 考点 |
|---|---|
| 177 basic | F12 看源码，flag 在 HTML 注释里 |
| 178 basic_1 | 禁用右键/F12 是客户端把戏；注释里 base64 编码的 flag |
| 180 basic_3 | eval(password)，密码在外部 js/key.js 且 JSFuck 编码 → Node 求值 |
| 181 basic_4 | String.fromCharCode 解出邀请码 QCCTF_VIP_2026 与 /flag 接口 |
| 183 basic_6 | flag 在响应头 X-Flag（浏览器只看 body，用 curl/Burp 看头） |
| 184 ezrequest | GET ?a=QCCTF → 再对同 URL POST b=yyds，两步都带才发 flag |
| 185 ezrequest_1 | 连环链：GET a=a → POST b=b → XFF 127.0.0.1 → Via 代理域名 → Cookie user=admin |
| 186 basic_8 | index.phps 源码泄露 → 隐藏参数 a=QCyYdS |
| 187 basic_9 | robots.txt Disallow 泄露 /qcq.php → hex 解码 |
| 189 basic_11 | robots.txt 的 /flag.php 是诱饵；leetspeak 变换扫出 /fl4g.php |
| 191 basic_13 | admin 登录口 10k 弱口令字典并发爆破，admin123 命中 |
| 192 basic_14 | readfile 任意读但 filename 长度<17；/admin_secret.txt 恰好 17 字符 → 用 /proc/self/fd/5 读 |
| 643 basic_7 | 拼图游戏服务端只看 POST complete.php 的 solved=1（带会话直投） |

## 五、ezphp / ezmd5 / ezinfoleak（201-213 + 787/789）

| 题 | 考点 |
|---|---|
| 201 ezphp | PHP 松散比较：a 真值且 ==0（abc），b 非数字但 >2026（2027abc） |
| 205 ezmd5_1 | md5($a)==md5($b) 且 $a!=$b：传数组——md5(数组) 报错返 NULL，NULL==NULL |
| 206 ezmd5_2 | 0e 哈希被禁（substr 检查）但数组绕过不受影响 |
| 207 ezmd5_3 | === 严格比较：数组绕过依然有效（NULL === NULL） |
| 208 ezmd5_4 | md5 后 6 位需为 d54e23：纯数字并发爆破，26120 命中 |
| 209 ezmd5_5 | sha1 松散比较：数组绕过 |
| 210 ezmd5_6 | sha1 === 严格：数组绕过依然有效 |
| 212 ezinfoleak | 日志中心 ?file= 读 system-error.log 泄 secret_file_b64 → 三层 ../ 读 fl4g.txt |
| 213 ezinfoleak_1 | ../ 被过滤：双写 ....//....//....//fl4g.txt 绕过 |
| 787 ezphp_3 | 五重绕过：换行绕 ^$ 正则、2024 自增、数组转 Array 串过 sha1 ===、未闭合 [ 注册带点键名 |
| 789 ezmd5_7 | PHP 8 下数组绕过失效（TypeError）→ fastcoll 128 字节真碰撞对 |

## 关键点

- **flag 藏匿点清单**（这批题的惯用位置）：phpinfo 环境变量、\`/etc/passwd-\` 的 GECOS、\`/qingcenctf.txt\`、数据库 \`flag\` 表/\`secret\` 列
- **复核型注入的通用思路**：先弄清"应用会复核哪个字段"，让 UNION 行的那个字段 = 你提交的值（ezsql_5/6 模式）
- **日志污染的一次性**：引号转义错误会永久污染日志文件，之后任何 payload 都进不去——第一次就要用单引号

## 关联

- [[Web-文件包含与上传]] —— wrapper 黑名单 / .user.ini / .htaccess 的理论底座
- [[Web-SQL注入]] —— UNION、堆叠、时间盲注的判据
- 〖内部笔记〗 —— 本系列所属的总战役
- 〖内部笔记〗 —— 同平台另一道 SQLi
- 〖内部笔记〗 —— 同期的套路库

## 存疑 / 矛盾

- ezsql_15 的"username 一起复核"是推断（同 payload 15 不通 16 通），未从源码证实。
- 各关弱口令（admin/123456、admin/admin123）是当时实例的值，重建后可能变。

## 来源

- ZCode 项目记忆 \`qingcen-ps11-web-series-2026-10.md\`（2026-10-23）· 归档于 \`01-原料/收藏/ZCode会话导出/项目记忆-青岑战役/\`
`,l="project",t="project",i={internal:["Web-SQL注入","Web-文件包含与上传"],unresolvedCount:3},c={name:e,title:n,summary:a,content:s,section:l,group:t,links:i};export{s as content,c as default,t as group,i as links,e as name,l as section,a as summary,n as title};
