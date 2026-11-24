const n="无线与射频安全",a="无线与射频安全",e='无线题只有四种"现场"：一段 Wi-Fi 抓包、一段蓝牙报文、一张 RFID 卡、一段 IQ/433M 采样。先用判据表认现场，再套对应那条固定流水线——答案多数在"**离线破解**"或"**重放**"里，而不是真实硬件的实时交互里。',t=`# 无线与射频安全

> 无线题只有四种"现场"：一段 Wi-Fi 抓包、一段蓝牙报文、一张 RFID 卡、一段 IQ/433M 采样。先用判据表认现场，再套对应那条固定流水线——答案多数在"**离线破解**"或"**重放**"里，而不是真实硬件的实时交互里。

## 一、判据表：手里拿到什么 ⇒ 走哪条线

| 拿到的东西 | 判类结论 | 第一步动作 |
|---|---|---|
| \`.pcap\`/\`.cap\`/\`.pcapng\`，协议树里是 802.11 | Wi-Fi 抓包 | \`tshark -r x.pcap -q -z io,phs\` 看有没有 EAPOL |
| 同上，抓包里有 **4 个 EAPOL 帧** | WPA/WPA2 四次握手 | 转 22000 上 hashcat |
| 同上，只有 **1 个 EAPOL-Key 帧（握手 M1）带 RSN PMKID** | PMKID（clientless） | 同样 22000，不需要客户端 |
| \`.pcap\` 协议是 \`btle\`/\`btatt\`/\`bthci\` | 蓝牙低功耗 | 抽 ATT 载荷 / 找 GATT 写入 |
| \`.sub\`/\`.fob\`/一长串脉宽数字 | 无线遥控（433/315MHz） | URH 打开 → 解调 → 重放 |
| \`.cf32\`/\`.cs16\`/\`.cu8\`/无头 \`.wav\` | IQ 采样 | 见 [[杂项-信号与硬件取证]] §三，本文补 433M 遥控 |
| 一坨扇区 dump / 4 字节 UID / 7 字节 UID | RFID / NFC | 恢复 Mifare 密钥 → 克隆 |

**总纲只有两条路**：① **离线**——pcap / IQ / dump 已经在磁盘上，纯软件跑完（CTF 99% 是这种）；② **在线**——真网卡 / Proxmark / 天线实时打，仅限有硬件的场合。**先判是哪条，再挑工具**，别拿着 hashcat 去啃 IQ 文件。

## 二、Wi-Fi：握手包与 PMKID 的离线破解

### 2.1 先判 pcap 里有没有料

\`\`\`bash
tshark -r wifi.pcap -q -z io,phs                              # 协议分层：一眼看有没有 eapol/wlan
tshark -r wifi.pcap -Y "eapol" -T fields \\
  -e wlan.bssid -e wlan.ta -e wlan.ra -e eapol.type | head     # EAPOL 有哪几帧
tshark -r wifi.pcap -Y "wlan.fc.type_subtype==0x08" \\
  -T fields -e wlan.ssid -e wlan.bssid -e wlan_radio.channel   # beacon：拿 SSID/BSSID/信道
\`\`\`

判据：**EAPOL-Key 帧（Wireshark 里 \`eapol.type == 3\`）凑齐 M1–M4 共 4 帧** → 完整四次握手，可离线爆破；**只抓到 M1 一帧且带 PMKID KDE** → PMKID，一样能破（**不需抓到客户端**）。SSID 是隐藏的，会在客户端重连的 probe/assoc 里露出来。

### 2.2 转 hashcat 格式（统一 22000）

hashcat 的 **22000** 是 WPA-PBKDF2 的"大一统"模式（PMKID + EAPOL 合并），已取代旧的 **2500**（hccap/hccapx）和 **16800**（单 PMKID）。网上老 WP 的 \`-m 2500\` 大概率对你手的 hash 无效。

\`\`\`bash
# pcap/pcapng → hc22000（hcxtools）
hcxpcapngtool -o hash.hc22000 -E essidlist.txt wifi.pcap
hcxhashtool --hccapx=old.hccapx -o hash.hc22000          # 旧 hccapx 转 22000

hashcat -m 22000 hash.hc22000 rockyou.txt
hashcat -m 22000 hash.hc22000 rockyou.txt -r rules/best64.rule
hashcat -m 22000 hash.hc22000 -a 3 ?d?d?d?d?d?d?d?d      # 8 位纯数字，手机号段常一眼出
\`\`\`

小字典快速验可用 aircrack-ng（自带握手识别）：
\`\`\`bash
aircrack-ng -w rockyou.txt -e "SSID" wifi.pcap           # 用 -e ESSID 或 -b BSSID 指定目标
\`\`\`

### 2.3 破出来之后：解密整段流量

标准动作——**拿 PSK 离线解密 pcap**，之后当场流量题做（导对象、看明文 HTTP）。

\`\`\`bash
airdecap-ng -e "SSID" -p "CrackedPass" wifi.cap          # 或 -b BSSID -p 口令
\`\`\`
Wireshark：\`Preferences → Protocols → IEEE 802.11 → Decryption Keys → wpa-pwd\`，填 \`口令:SSID\`。

### 2.4 在线抓包（有硬件时）

\`\`\`bash
airmon-ng check kill
airmon-ng start wlan0                                    # 生成 wlan0mon
airodump-ng --bssid AA:BB:CC:DD:EE:FF -c 6 -w cap wlan0mon
aireplay-ng --deauth 10 -a AA:BB:CC:DD:EE:FF wlan0mon    # 另一终端，逼客户端重连
aircrack-ng cap-01.cap                                   # 跑出 "1 handshake" 即成
\`\`\`
PMKID 免抓客户端：\`hcxdumptool -i wlan0mon -o dump.pcapng --enable_status=1\`，对开了 802.11r/漫游的 AP 一次 RSN 关联就吐 PMKID。

## 三、WPS、Evil Twin 与 deauth

### WPS（PIN 只 8 位，实际约 11000 组合）
\`\`\`bash
wash -i wlan0mon                                        # 列支持 WPS 的 AP
reaver -i wlan0mon -b AA:BB:CC:DD:EE:FF -vv -K          # -K = Pixie Dust（离线算，秒级）
bully  -b AA:BB:CC:DD:EE:FF -c 6 wlan0mon -d            # 备选实现
\`\`\`
判据：AP 开 WPS 且**未限尝试** → 在线爆破几分钟到几小时；**有 WPS 锁** → 改 Pixie Dust（只对部分芯片有效，见存疑）。

### Evil Twin（伪造同名 AP + 强制门户）
骨架是三件套：\`hostapd rogue_ap.conf\`（**同名 SSID + 同信道**）+ \`dnsmasq\`（发 IP，DNS 全指自己）+ 一个钓鱼网页。自动化 Fluxion / wifiphisher 走完"deauth 逼下线 → 起假 AP → 弹 captive portal → 收口令/握手"。

\`\`\`ini
# rogue_ap.conf
interface=wlan0mon
driver=nl80211
ssid=FreeWiFi
channel=6
hw_mode=g
\`\`\`
\`\`\`bash
hostapd rogue_ap.conf
dnsmasq -C dnsmasq.conf     # dhcp-range=10.0.0.10,10.0.0.100,12h；dhcp-option=3/6,10.0.0.1
\`\`\`
CTF 里多半只作**原理**考（写 WP、画流程），实操需两块网卡。

### deauth / 拒绝服务

\`\`\`bash
aireplay-ng --deauth 0 -a AA:BB:CC:DD:EE:FF wlan0mon          # 0 = 持续打
aireplay-ng --deauth 5 -a AA:BB:CC:DD:EE:FF -c STA wlan0mon   # 针对单个客户端
mdk3 wlan0mon d -c 6                                          # 更激进；b 子命令可做信标洪水
\`\`\`
目的通常不是 DoS 本身，而是**逼客户端重连好抓握手**，或**暴露隐藏 SSID**（重连时 probe/assoc 带明文 SSID）。

## 四、蓝牙 BLE：枚举、抓包与重放

判据：现代题几乎都是 **BLE**（不是经典蓝牙）；经典蓝牙只出现在老题 / PIN 配对题。BLE 里真正干活的是 **GATT**——"智能锁/手环"题基本就是**往某个 handle 写一个固定值开锁**。

### 枚举
\`\`\`bash
bluetoothctl
# scan on → devices → info <MAC> → menu gatt → list-attributes → select-attribute / read / write
hcitool lescan                        # 老工具，纯列广播
hcitool lescan --duplicates           # 信标类，广播会重复刷
\`\`\`

### 抓包
- **硬件嗅探**：nRF Sniffer（Nordic，Wireshark 插件，最省事）/ Ubertooth / btlejack。
- **软件**：\`btmon\`（本机 HCI 日志）、\`bettercap\` 的 \`ble.*\` 模块。
\`\`\`bash
bettercap -iface hci0
# > ble.recon on      → ble.show / ble.enum <MAC> / ble.write <MAC> <handle> <hex>
\`\`\`

### 重放
低安全等级（Just Works / 无加密 / 无签名）下**直接重放** write 请求即可；一旦启用**加密+绑定**，重放失效，必须先抓到配对过程拿 **LTK**。

经典蓝牙（老题）：\`hcitool scan\`、\`sdptool browse <MAC>\`。旧式 **BLE legacy 配对**的离线破解：\`crackle -i ble.pcap -o decrypted.pcap\`（爆破配对 TK；输入须为**含配对过程的抓包 pcap**，不是实时网卡）。Bluejacking/Bluesnarfing 在现代 Android/iOS 上基本已堵死，CTF 少见。

## 五、RFID / NFC：Mifare 与克隆

主战场是 **Mifare Classic 1K**（门禁卡）。其 Crypto1 流密码有已知弱点，密钥可恢复。

| 卡的迹象 | 手法 | 工具命令 |
|---|---|---|
| 扇区读得到、要 key A/B | 恢复密钥 | \`mfoc -O dump.mfd\` / Proxmark \`hf mf autopwn\` |
| key 是默认 \`FFFFFFFFFFFF\` / \`A0A1A2A3A4A5\` | 直接读 | \`hf mf rdbl\` |
| 全加密、无已知 key | **hardnested**（比 nested/darkside 快得多） | \`hf mf hardnested\` |
| 要克隆到"魔术卡"改 UID | gen1a/gen2 魔术卡 | \`hf mf csetuid\` / 写块 0 |
| 7 字节 UID | Ultralight / NTAG | \`hf mf ultralight\` |

\`\`\`bash
# Proxmark3 一键
hf mf autopwn
hf mf dump                          # 全扇区落盘
hf mf restore                       # 写回空白/魔术卡
\`\`\`
**关键判据**：克隆能不能骗过门禁，取决于门禁**只认 UID 还是也验数据**。只认 UID 的旧门禁 → 必须用 **UID 可改的"魔术卡"**（Chinese magic gen1a/gen2）；普通空白卡 UID 固定，只能复制数据、UID 不变。

## 六、SDR 与 433MHz 重放

**CTF 现场**：给你一段 IQ 采样，或一段录音，让你解出遥控码再重放。

\`\`\`bash
rtl_433 -f 433.92M -A                                   # 直接解常见 433.92/315MHz 传感器与遥控
rtl_sdr -f 433920000 -s 2048000 -n 2048000 capture.cu8  # 录 IQ 存盘，离线再解
\`\`\`

**Universal Radio Hacker (URH)** 是这类题主力：打开 \`.cu8\`/\`.complex16s\`（或 \`file\` 判为 raw 的采样）→ 自动估参数 → 解调 → \`Interpret signal\` 分帧 → 解出比特/字节；改比特后 \`Send signal\` 直接重放（配 HackRF / Yard Stick One）。

| 采样文件后缀 | 格式 | URH / 读法 |
|---|---|---|
| \`.cu8\` | uint8 交错 IQ（RTL-SDR） | URH 直接识别 |
| \`.cs16\`/\`.complex16s\` | int16 交错 IQ | URH / GNU Radio |
| \`.cf32\` | float32 复数（GNU Radio） | GNU Radio File Source |
| \`.wav\`（16bit 立体声 = IQ） | L=I, R=Q | URH 或按左右声道拆 |

**433M 遥控码常见形态**：OOK/ASK 调制 + 脉宽编码（一串长/短脉冲）。分两种，判据是**看码是否每次都一样**：

| 码型 | 特征 | 能不能直接重放 |
|---|---|---|
| 固定码（PT2262 / EV1527） | 每次发送比特完全相同 | ✅ 录制即重放 |
| 滚动码（HCS301 KEE LOQ） | 每次发送递增，带计数器 | ❌ 重放失效，要跑算法拿计数器 |

\`\`\`python
# URH 解出的 OOK 脉宽流，按"最短脉宽 = 1 单位"解码骨架
# durations: [(level, samples), ...]，level ∈ {0,1}
unit = min(l for v, l in durations)
bits = ''.join('0' if l < 2 * unit else '1' for v, l in durations)
\`\`\`

**重放硬件**：Flipper Zero（\`.sub\` 文件，一键 replay）、Yard Stick One（\`rfcat\`）、rpitx。若题目直接给 \`.sub\`，**用文本打开看 \`RAW_Data\` 里的脉宽数组**，往往不用真设备就能还原出比特。

## 关键点

- **先判"离线/在线"再挑工具**：pcap、IQ、dump 在磁盘上就纯软件做，别想着接硬件；CTF 绝大多数是离线。
- **Wi-Fi 的答案在 hashcat -m 22000**，不是 2500；\`hcxpcapngtool\` 转格式，\`hcxdumptool\` 抓 PMKID（免客户端），破出后用 \`airdecap-ng\` 解密整段 pcap。
- **PMKID 与四次握手是两种不同的"料"**，但都进 22000；只有 1 个 EAPOL 别急着判"没抓到"。
- **WPS 优先试 Pixie Dust（-K）**：它是离线算，秒级；在线 PIN 爆破只在无锁且 Pixie 不支持时用。
- **deauth 的用途是"制造重连"**，不是目的本身——为了抓握手或暴露隐藏 SSID。
- **BLE 题盯 GATT write**：智能设备题多是"往某 handle 写固定值"；有加密/绑定则先拿 LTK 再谈重放。
- **Mifare 用 \`hf mf autopwn\` 一把梭**；全加密卡上 hardnested，克隆只在门禁"只认 UID"时才需要魔术卡。
- **433M 先判固定码还是滚动码**：固定码直接重放，滚动码（KEE LOQ）必须拿算法/密钥，重放必败。
- **采样文件先看后缀**（cf32/cs16/cu8/wav）定格式，再丢 URH 或 GNU Radio，别手搓解调。
- **拿不准就 \`file\` + \`tshark -z io,phs\` 各跑一遍**——判类对，后面全顺。

## 关联

- [[杂项-信号与硬件取证]] —— 本页 §六与那页 §三（IQ/SDR）**重叠**：那页讲 IQ 通用解码与星座诊断，本页补 433M 遥控与重放；采样文件先读那页。
- [[杂项-取证与流量分析]] —— Wi-Fi 抓包本质是 pcap 取证，\`tshark -z io,phs\` 起手、导对象那套通用姿势在那边，本页只讲"怎么从 802.11 里榨出密钥再解密"。
- [[杂项-口令破解与哈希爆破]] —— \`hashcat -m 22000\` 是口令破解的无线分支：字典/规则/掩码的通用打法与 GPU 参数都在那页，本页只给无线专属的格式转换。
- [[杂项-隐写与编码]] —— 遥控脉宽码、BLE 广播里的自定义编码，最终都要落到"比特流 → 字节"的解码链上。
- [[移动与IoT安全]] —— BLE 枚举/重放、固件里的门禁算法、智能设备协议，是那页的无线硬件侧延伸。
- [[逆向-固件与嵌入式分析]] —— 滚动码（KEE LOQ）算法、读卡器固件、遥控器 MCU 固件，都要反推逻辑而非只看字符串。
- [[CTF-竞赛总览与解题流程]] —— 无线题在 Misc/硬件赛道里的位置与上场取舍。

## 存疑 / 矛盾

- ⚠️ **hashcat 模式号随版本变**：22000 是当前统一模式，但老 WP 里的 \`-m 2500\`/\`-m 16800\` 仍大量存在；拿到 hash 先看文件头（\`WPA*01\`/\`WPA*02\` 前缀），别照抄老命令。
- ⚠️ **本页绝大多数未上机实测**：素材来自 skill 文档与通用知识。抓真包、打真卡、重真遥控都需要**特定硬件**（监视模式网卡 / Proxmark3 / HackRF / Flipper），本机没有，命令与参数以现场工具版本为准。
- ⚠️ **Pixie Dust 是"看芯片"而非普适**：只对部分 WPS 实现有效；面对会限速的 AP，\`-K\` 失败不代表手法错，可能是芯片不脆。WPS 本身也在被厂商逐步淘汰。
- ⚠️ **Evil Twin / deauth / mdk3 在真实环境涉法规与干扰**：仅限授权测试环境（CTF、自有设备）；对他人网络做 deauth 属干扰通信，CTF 里也基本只作原理解析。
- ⚠️ **BLE 现代栈已加固**：加密+绑定后重放失效，Just Works 才脆；"抓到 write 就能重放"是经验不是定理，先确认链路是否加密。
- ⚠️ **与 [[杂项-信号与硬件取证]] 职责重叠**：IQ 采样、USB 无线外设两边都写；本文只管"无线协议层（Wi-Fi/BLE/RFID/遥控）"，纯 DSP/星座那套归那页，避免同一命令两处各写一半。
- ⚠️ **滚动码判据依赖"多次采样对比"**：只给一次发送，无法判断固定码还是滚动码；需要同一按键的多次记录或已知协议名（HCS301/EV1527）。

## 来源

- 糯米内建知识整理 · 2026-10-05，提炼自 attacking-wireless-networks/SKILL.md 技能文档（正文未逐条上机实测，边界见「存疑 / 矛盾」）
- [SKILL 原文](../../01-原料/收藏/技能文档/attacking-wireless-networks/SKILL.md) —— 2026-10-05 归档进库
`,i="concept",c="other",s={internal:["CTF-竞赛总览与解题流程","杂项-信号与硬件取证","杂项-取证与流量分析","杂项-口令破解与哈希爆破","杂项-隐写与编码","移动与IoT安全","逆向-固件与嵌入式分析"],unresolvedCount:0},o={name:n,title:a,summary:e,content:t,section:i,group:c,links:s};export{t as content,o as default,c as group,s as links,n as name,i as section,e as summary,a as title};
