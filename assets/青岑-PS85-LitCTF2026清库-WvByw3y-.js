const n="青岑-PS85-LitCTF2026清库",t="青岑-PS85-LitCTF2026清库",e="PS85 收录 LitCTF 2026（题集 85）已解 16 题：**Web 靠信息泄露、Misc 靠载体识别、Re/Crypto 靠标准算法变形**。全部已提交详细版 WP。这是主人第一次打 LitCTF 系赛题。",s=`# 青岑-PS85-LitCTF2026清库

> PS85 收录 LitCTF 2026（题集 85）已解 16 题：**Web 靠信息泄露、Misc 靠载体识别、Re/Crypto 靠标准算法变形**。全部已提交详细版 WP。这是主人第一次打 LitCTF 系赛题。

## 一、Web（3 题）

| 题 | 手法 |
|---|---|
| 795 Northbridge Document Hub | /assets/js/portal.js 泄露 base64 凭据 researcher/Research#2026 → 登录后 kkfileview \`getCorsFile?urlPath=\` base64 编码读文件（CVE-2021-43734 同型） |
| 796 华辰企业服务运营平台 | Spring Boot Actuator 全端点暴露：/actuator/env 直接读 FLAG（附赠 LAB_FLAG_PART2 烟雾弹） |
| 803 reverseMyWeb | Go 站 JWT：jwtsecret.go 里 XOR 混淆密钥（encKey ^ 0x5a），本地重签 role=admin |

## 二、Misc（5 题）

| 题 | 手法 |
|---|---|
| 797 lit_welcome | 欢迎图近白像素 RGB(254,255,255) 藏文字：按 R<255 提取放大二值化读出 flag |
| 798 lit_lsb_base64 | R 通道 LSB 按行拼接，PNG 长度字段 + base64 |
| 799 lit_rush_qr | GIF 逐帧拆解；真 QR 只剩左上定位角 → 手工补画三个定位图案后解码 |
| 800 lit_sstv | 115 秒"调制解调器噪声"wav 是 SSTV：pip 装 sstv 解码器还原图片 |
| 808 xor_two_story | OTP 密钥重用：xored = p1⊕p2 可观察，crib-drag 恢复明文 |

## 三、Crypto（4 题）

| 题 | 手法 |
|---|---|
| 805 lit_elgamal_handshake | output.txt 尾部 DEBUG 注释直接泄露 ElGamal 私钥 x：s=c1^x，m=c2/s |
| 806 rsa_neighbor | next_prime 连续生成 p、q → Fermat 分解第一步命中 |
| 807 tiny_key_aes | AES-128-ECB 密钥前 13 字节固定 LitCTF2026!!!，只剩 3 字节：C 爆破 1677 万候选 |
| 817 lit_tea_standard | r2 读标准 TEA：32 轮 delta 0x9E3779B9，key 四字 A11CEFAC/B00B1E00/CAFEBABE/DEADBEEF |

## 四、Reverse（4 题）

| 题 | 手法 |
|---|---|
| 815 lit_b64_alphabet | strings 挖 64 字符置换字母表 + 期望密文，换表 base64 解码 |
| 816 lit_rc4_variant | 64 状态 RC4 变体：KSA/PRGA 全 mod 64，输出字节 = S[i]+S[t]（相加非查表）；纯流密码重算密钥流 |
| 818 lit_xor_chain | 字节级 (b^0x52)+5 与目标比较，逆运算 (t-5)^0x52 |
| 819 lit_xtea_tweak | XTEA 结构但 delta 换 0xDEADBEEF：标准 XTEA 解密框架改 delta |

## 关键点

- **LitCTF 2026 的风格**：Misc 全考"载体识别"（像素/LSB/GIF/SSTV/音频），Re 全考"标准算法小变形"（换表/换 delta/换模数），没有深水区
- **信息泄露是 Web 主力**：js 里硬编码凭据、Actuator 裸奔、密钥 XOR 混淆——前端资源审计先行
- 805 的"DEBUG 注释泄露私钥"是出题失误型题目，flag 直接可算

## 关联

- [[其他赛事题解履历]] —— LitCTF/Cyclens 等主平台外实战（本页是 PS85 的完整版）
- [[密码学-对称加密与哈希]] —— TEA/RC4/XOR 变体识别
- [[逆向-算法识别与实战案例]] —— 换表/换 delta 的算法识别
- 〖内部笔记〗 —— 所属总战役

## 存疑 / 矛盾

- 本页为 16 题已写 WP 的题；PS85 未解/未写的题未收录。
- 各题 flag 值不在本页（原始 WP 脚本在库外 \`~/CTF/scripts/qingcen/qc_wp_ps85_*.py\`）。

## 来源

- 库外 WP 脚本 \`C:\\Users\\hwh\\CTF\\scripts\\qingcen\\qc_wp_ps85_*.py\`（795-819 共 16 题）· 2026-10-31 整理
`,a="project",i="project",r={internal:["其他赛事题解履历","密码学-对称加密与哈希","逆向-算法识别与实战案例"],unresolvedCount:1},o={name:n,title:t,summary:e,content:s,section:a,group:i,links:r};export{s as content,o as default,i as group,r as links,n as name,a as section,e as summary,t as title};
