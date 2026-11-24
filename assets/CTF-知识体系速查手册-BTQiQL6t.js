const n="CTF-知识体系速查手册",r="CTF 知识体系速查手册",e="一页纸的总览：各方向 + 核心 checklist，考前 / 开局快速过一遍。",t=`# CTF 知识体系速查手册\r
\r
> 一页纸的总览：各方向 + 核心 checklist，考前 / 开局快速过一遍。\r
\r
## 一、拿到题的 6 步\r
\r
读题面 → 收信息 → 判题型 → 假设验证（看回显）→ 拿 flag → 写 writeup。\r
详见 [[CTF-竞赛总览与解题流程]]。\r
\r
## 二、五大方向核心 checklist\r
\r
### Web\r
\r
- [ ] 看源码 / 响应头 / robots.txt / \`.git\` / 备份文件\r
- [ ] 目录扫描 + 指纹识别\r
- [ ] 参数：SQLi / SSTI / 命令注入 / 文件包含 / XXE\r
- [ ] 登录：弱口令 / JWT / 越权 / 逻辑绕过\r
- [ ] 上传：白黑名单 / \`.htaccess\` / 软链接\r
- [ ] 反序列化：PHP POP / Java gadget / pickle\r
\r
详见 [[Web-SQL注入]] [[Web-文件包含与上传]] [[Web-命令执行与SSTI]] [[Web-反序列化漏洞]] [[Web-SSRF与XXE]] [[Web-认证与会话漏洞]] [[Web-源码泄露与信息收集]] [[Web-逻辑漏洞与支付安全]] [[Web-竞态条件攻击]] [[Web-请求走私与协议层攻击]] [[Docker-Registry与远程API利用]]\r
\r
### Reverse\r
\r
- [ ] \`file\` / \`strings\` / 查壳\r
- [ ] 静态：IDA / Ghidra 找主逻辑与校验\r
- [ ] 动态：x64dbg / GDB 断点跟\r
- [ ] 按语言分：C/C++、Python(pyc)、Java、.NET、WASM、Android\r
- [ ] 恶意样本：**先隔离**（断网/快照）再分析；静态（strings / 导入表 / 熵）→ 动态（沙箱 / API 监控）→ IOC 与 YARA\r
- [ ] 固件：\`binwalk\` 拆包 → 找文件系统 → 挖凭据 / 后门 / Web 面 → QEMU 模拟\r
\r
详见 [[逆向-Reverse方法论]] [[逆向-算法识别与实战案例]] [[逆向-反调试与混淆对抗]] [[逆向-多语言与多平台]] [[逆向-动态调试与模拟执行]] [[逆向-恶意软件分析]] [[逆向-固件与嵌入式分析]]\r
\r
### Crypto\r
\r
- [ ] 先判断：编码 vs 加密\r
- [ ] RSA 八问：小 e / 共模 / 因数分解 / Wiener / Coppersmith\r
- [ ] 对称：模式误用、密钥重用、IV 问题\r
- [ ] 随机数：LCG / MT19937 / OTP 重用\r
- [ ] 格与 LLL：小根 / 部分泄露 / 背包 / HNP\r
\r
详见 [[密码学-RSA攻击]] [[密码学-对称加密与哈希]] [[密码学-古典密码]] [[密码学-格与LLL]] [[密码学-格与椭圆曲线]]\r
\r
### Pwn\r
\r
- [ ] \`checksec\` 看保护\r
- [ ] 找溢出点、算偏移\r
- [ ] 栈：ret2text / shellcode / syscall / libc、canary、格式化字符串\r
- [ ] 堆：UAF / 溢出 / double free / tcache\r
- [ ] 浏览器 / V8：类型混淆或 OOB → \`addrof\` + \`fakeobj\` → 任意读写 → WASM RWX\r
\r
详见 [[Pwn-栈溢出与ROP]] [[Pwn-堆利用]] [[Pwn-格式化字符串与沙箱绕过]] [[Pwn-高级利用原语]] [[Pwn-内核利用]] [[Pwn-浏览器与V8利用]]\r
\r
### Misc\r
\r
- [ ] 文件类型与嵌套（\`binwalk\`）\r
- [ ] 图片 / 音频隐写\r
- [ ] 流量（pcap）/ 内存（Volatility）/ 磁盘\r
- [ ] 编码识别\r
- [ ] OSINT\r
- [ ] 沙箱逃逸（PyJail / NodeJail / BashJail）\r
- [ ] 拿到哈希或 shadow：**先认类型**（hashid）→ 再选字典 / 规则 / 掩码 → hashcat 或 john\r
\r
详见 [[杂项-隐写与编码]] [[杂项-取证与流量分析]] [[杂项-磁盘与内存取证]] [[杂项-Windows与Linux主机取证]] [[杂项-信号与硬件取证]] [[OSINT-开源情报]] [[杂项-沙箱逃逸-PyJail与NodeJail]] [[杂项-BashJail与受限Shell]] [[杂项-口令破解与哈希爆破]]\r
\r
### AI / ML（新兴）\r
\r
- [ ] 提示词注入 / 越狱\r
- [ ] 模型文件逆向\r
- [ ] 对抗样本 / 成员推断\r
\r
详见 [[AI-ML安全]]\r
\r
### 区块链 / 智能合约\r
\r
- [ ] 读 \`.sol\` 找 \`isSolved()\` 的判定条件与权限检查\r
- [ ] 重入 / 整数溢出 / 价格操纵 / \`tx.origin\` / 短地址\r
- [ ] 私钥可预测、\`block.timestamp\` / \`blockhash\` 可操纵\r
- [ ] 攻击通常要**自己部署一个攻击合约**再调它\r
\r
详见 [[区块链-智能合约安全]]\r
\r
### 云与容器\r
\r
- [ ] SSRF → 元数据 \`169.254.169.254\` → IAM 临时凭据\r
- [ ] 对象存储桶列举 / 策略错配\r
- [ ] K8s API 未授权、Secret、Docker socket、特权容器逃逸\r
- [ ] 拿到云凭据后：\`get-caller-identity\` → IAM 枚举 → 提权路径表 → S3 / Secrets Manager 取数\r
\r
详见 [[云安全-常见攻击面]] [[云安全-AWS渗透实战]] [[Docker-Registry与远程API利用]] [[容器逃逸技术]]\r
\r
### 移动与 IoT\r
\r
- [ ] APK：\`jadx\` 看源码 → \`apktool\` 改包 → Frida 动态 hook\r
- [ ] 固件：\`binwalk\` 拆包 → 找 \`/etc/shadow\`、硬编码口令、调试接口\r
- [ ] 通信抓包（http/蓝牙/Zigbee）+ 本地模拟执行\r
\r
详见 [[移动与IoT安全]] [[逆向-固件与嵌入式分析]]\r
\r
### 无线 / 硬件\r
\r
- [ ] Wi-Fi：抓四次握手或 PMKID → 转 \`hc22000\` → \`hashcat -m 22000\` 离线破\r
- [ ] 蓝牙 BLE / RFID：枚举 → 抓包 → 重放或克隆（\`crackle\`、Proxmark3）\r
- [ ] SDR / 433MHz：IQ 采样 → 解调 OOK/FSK → 重放\r
\r
详见 [[无线与射频安全]] [[杂项-信号与硬件取证]] [[杂项-口令破解与哈希爆破]]\r
\r
## 关键点\r
\r
- 回显是唯一的老师\r
- 先拿最小能力，再放大\r
- 链条思维（信息泄露 → 凭据 → 新入口 → 提权）\r
- 卡超 1 小时就换题\r
\r
## 四、工具入口\r
\r
见 [[CTF-常用工具清单]]。\r
\r
## 关联\r
\r
- [[CTF-全品类题型解题手册]] —— 本页的展开版：题型识别信号 → 解题路径 → payload/工具表\r
- [[CTF-竞赛总览与解题流程]] —— 详细方法论\r
- [[CTF-常用工具清单]] —— 工具速查\r
- 〖内部笔记〗 —— 实战记录\r
\r
## 存疑 / 矛盾\r
\r
- 本页是"目录的目录"，只做导航与 checklist，细节一律以各方向专页为准。\r
\r
## 来源\r
\r
- 糯米内建知识整理 · 2026-10-03（无外部文件）\r
`,a="output",o="output",s={internal:["AI-ML安全","CTF-全品类题型解题手册","CTF-常用工具清单","CTF-竞赛总览与解题流程","Docker-Registry与远程API利用","OSINT-开源情报","Pwn-内核利用","Pwn-堆利用","Pwn-栈溢出与ROP","Pwn-格式化字符串与沙箱绕过","Pwn-浏览器与V8利用","Pwn-高级利用原语","Web-SQL注入","Web-SSRF与XXE","Web-反序列化漏洞","Web-命令执行与SSTI","Web-文件包含与上传","Web-源码泄露与信息收集","Web-竞态条件攻击","Web-认证与会话漏洞","Web-请求走私与协议层攻击","Web-逻辑漏洞与支付安全","云安全-AWS渗透实战","云安全-常见攻击面","区块链-智能合约安全","容器逃逸技术","密码学-RSA攻击","密码学-古典密码","密码学-对称加密与哈希","密码学-格与LLL","密码学-格与椭圆曲线","无线与射频安全","杂项-BashJail与受限Shell","杂项-Windows与Linux主机取证","杂项-信号与硬件取证","杂项-取证与流量分析","杂项-口令破解与哈希爆破","杂项-沙箱逃逸-PyJail与NodeJail","杂项-磁盘与内存取证","杂项-隐写与编码","移动与IoT安全","逆向-Reverse方法论","逆向-动态调试与模拟执行","逆向-反调试与混淆对抗","逆向-固件与嵌入式分析","逆向-多语言与多平台","逆向-恶意软件分析","逆向-算法识别与实战案例"],unresolvedCount:1},i={name:n,title:r,summary:e,content:t,section:a,group:o,links:s};export{t as content,i as default,o as group,s as links,n as name,a as section,e as summary,r as title};
