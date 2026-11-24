const n="OSINT-开源情报",e="OSINT 开源情报",t="只用公开信息把人 / 地点 / 事件查清楚。CTF 里常是 Misc 的一类题（如航空 OSINT 取证、图片定位）。",o=`# OSINT 开源情报

> 只用公开信息把人 / 地点 / 事件查清楚。CTF 里常是 Misc 的一类题（如航空 OSINT 取证、图片定位）。

## 一、CTF 里的 OSINT 题

- **图片定位**：给一张照片，找出拍摄地点 / 时间 / 航班
- **人物画像**：给用户名 / 昵称，找出真实身份或关联账号
- **事件调查**：给一段信息，还原事件真相
- **航空 / 航班类**：根据航迹、机场、机型推断
- **元数据类**：EXIF、文档属性里的隐藏信息

## 二、目标信息收集

- **域名**：whois、DNS（A/AAAA/MX/TXT/CNAME）、证书透明度 \`crt.sh\` 找子域、NS、子域爆破
- **IP**：Shodan / FOFA / Censys 找暴露服务；反向 whois
- **GitHub**：搜索泄露的密钥、内部域名、注释里的凭据（**git 历史也要翻**）
- **网页历史**：Wayback Machine、archive.today 看被删页面
- **搜索引擎**：Google dork（\`site:\` / \`filetype:\` / \`inurl:\` / \`intitle:\`）

## 三、图片与地理

- **EXIF**：\`exiftool\` 看 GPS、时间、设备型号
- **反向图搜**：Google Lens、Yandex、Bing、TinEye
- **地理推理**：地标、路牌、语言、车牌、天气、**影子方向**（判断南北半球与时间）、电线杆/植被特征
- **卫星图**：Google Earth、Sentinel Hub 比对
- **航班 / 船舶**：FlightRadar24、ADS-B Exchange、MarineTraffic

## 四、人物与社交

- **用户名枚举**：Sherlock、WhatsMyName 跨平台查同名账号
- **社交**：微博 / 推特 / Instagram 的时间线、关注关系、互动
- **邮箱 / 手机**：HIBP 查泄露、由邮箱格式推断公司
- **时间线**：把各平台发帖时间对齐，还原作息与位置

## 五、工具速查

| 工具 | 用途 |
|---|---|
| \`exiftool\` | 图片 / 文档元数据 |
| Sherlock / WhatsMyName | 用户名跨平台枚举 |
| theHarvester | 域名、邮箱、子域收集 |
| Shodan / FOFA / Censys | 网络空间搜索 |
| crt.sh | 证书透明度查子域 |
| Wayback Machine | 网页历史快照 |
| Google Lens / Yandex | 反向图搜 |
| Google Earth / Sentinel | 卫星地理 |

## 关键点

- OSINT 是"**拼图**"：单一线索往往不够，要把元数据 + 图搜 + 地标 + 时间线**交叉验证**
- 图片题先 \`exiftool\` 再看图；有 GPS 直接定位，没有就找地标 / 语言 / 车牌
- 用户名题先用枚举工具全平台扫，再挑最有信息量的账号深挖
- **只对公开信息操作**，遵守平台规则与法律

## 关联

- [[杂项-隐写与编码]] —— 图片元数据与隐藏信息
- [[杂项-取证与流量分析]] —— 取证思路相通
- [[Web-源码泄露与信息收集]] —— 信息收集的 Web 侧
- [[CTF-竞赛总览与解题流程]] —— 方向总览

## 存疑 / 矛盾

- 涉及真实人物时要注意隐私与合规；CTF 内的 OSINT 目标通常是虚构或已授权，不要越界到真实人肉。

## 来源

- 糯米内建知识整理 · 2026-10-03（无外部文件）
`,a="concept",s="other",i={internal:["CTF-竞赛总览与解题流程","Web-源码泄露与信息收集","杂项-取证与流量分析","杂项-隐写与编码"],unresolvedCount:0},c={name:n,title:e,summary:t,content:o,section:a,group:s,links:i};export{o as content,c as default,s as group,i as links,n as name,a as section,t as summary,e as title};
