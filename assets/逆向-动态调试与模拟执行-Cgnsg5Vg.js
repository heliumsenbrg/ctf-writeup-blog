const r="逆向-动态调试与模拟执行",n="逆向-动态调试与模拟执行",e='静态看不清（反调试 / SMC / 自校验 / 运行时解密 / 跨架构）时，就"让它跑起来看"。这页按**"要解决什么问题 → 用哪个工具"**组织：gdb/pwndbg、ltrace/strace、Frida、LD_PRELOAD、Unicorn、QEMU user-mode、angr，最后是**内存 dump 直接捞 flag** 这种收尾最快的打法。',a=`# 逆向-动态调试与模拟执行\r
\r
> 静态看不清（反调试 / SMC / 自校验 / 运行时解密 / 跨架构）时，就"让它跑起来看"。这页按**"要解决什么问题 → 用哪个工具"**组织：gdb/pwndbg、ltrace/strace、Frida、LD_PRELOAD、Unicorn、QEMU user-mode、angr，最后是**内存 dump 直接捞 flag** 这种收尾最快的打法。\r
\r
## 一、判据表：什么问题用什么工具\r
\r
| 你的问题 | 首选工具 | 一句话理由 |\r
|---|---|---|\r
| 要看程序怎么跑、断在哪、改寄存器 | **gdb / pwndbg（GEF）** | 通用；pwndbg 的 \`context\` 一次看全寄存器/栈/反汇编 |\r
| 想知道它调了哪些库函数、传了什么参数 | **ltrace** | 直接打印 \`strcmp("in","exp")\` 这类，秒定位比较点 |\r
| 想知道它调了哪些系统调用 | **strace** | 看 \`open/read/write/mmap/ptrace\`，反调试与文件行为全暴露 |\r
| 想 hook/改运行时行为、注入代码、移动端 | **Frida** | 不改文件、脚本化、能 hook 能 replace 能改寄存器 |\r
| 想冻结非确定性（时间/随机）、换掉一个函数 | **LD_PRELOAD** | 编译一个 \`.so\` 覆盖同名符号，最轻量 |\r
| 只想跑**某个函数**、跨架构、脱壳/SMC | **Unicorn** | CPU 级模拟，无 OS 无调试器痕迹 |\r
| 要跑**整个二进制**（含 syscall/文件），跨架构 | **QEMU user-mode** | 带系统调用翻译；配 gdb-multiarch 可调 |\r
| 带分支的校验、想要"自动求解输入" | **angr** | 符号执行自动找满足条件的输入 |\r
| 单一执行路径、线性代码、要快 | **Triton** | 具体执行驱动，比 angr 快、不易路径爆炸 |\r
| 就要 flag、程序会把它拼出来 | **内存 dump / 断在输出点** | 最省事，绕开全部逻辑 |\r
\r
**总原则**：能用"断在输出/比较点 dump"解决的，别上符号执行；能用"单个函数模拟"解决的，别模拟整个进程。\r
\r
## 二、gdb / pwndbg 实战\r
\r
**装（WSL/Linux）**：\r
\`\`\`bash\r
git clone https://github.com/pwndbg/pwndbg && cd pwndbg && ./setup.sh\r
# GitHub 直连可能重置，可加镜像前缀 https://ghfast.top/ + 原 URL\r
# 注意：GEF 与 pwndbg 都改 ~/.gdbinit，只能留一个\r
\`\`\`\r
\r
**必背命令**：\r
\`\`\`gdb\r
context              # 寄存器+栈+反汇编+回溯，一屏看全\r
vmmap / info proc mappings   # 内存布局（找基址、找可写段）\r
search -s "flag" #    # 内存里搜字符串\r
telescope $rsp 20    # 智能看栈（自动解引用链）\r
x/4xg $rdi           # 按 8 字节看\r
b *0x401234 if $rax==0x41    # 条件断点\r
ignore 1 99          # 断点第 100 次才停\r
watch *(int*)0x601050        # 硬件观察点：该地址被写就停\r
rwatch/awatch        # 被读 / 读或写\r
catch syscall ptrace # 断系统调用\r
hbreak *0x...        # 硬件断点：不写 0xCC，不污染代码/EFLAGS\r
\`\`\`\r
\r
**万能套路——断在比较/输出点，直接读参数**（不改一行逻辑）：\r
\`\`\`gdb\r
# 把断点变成"自动打印 + 继续"的 oracle\r
break strcmp\r
commands\r
  silent\r
  printf "RDI= "; x/s $rdi\r
  printf "RSI= "; x/s $rsi\r
  continue\r
end\r
\`\`\`\r
- x86-64 前两个参数在 \`rdi/rsi\`；输出的字符常在 \`rdi\`（\`putchar\`）或 \`rsi\`（\`write(buf,n)\` 的 buf）。\r
- **程序用 \`usleep\` 拖延输出时**：断在 \`putchar\`/\`write(fd=1)\`，打印首参寄存器即可，**不用等它睡完**。\r
- 想要"记录所有比较"用 GDB Python：\r
\`\`\`python\r
import gdb\r
class TraceCmp(gdb.Breakpoint):\r
    def __init__(self, addr): super().__init__(f"*{addr}", gdb.BP_BREAKPOINT)\r
    def stop(self):\r
        f = gdb.selected_frame(); inf = gdb.selected_inferior()\r
        rdi, rsi, rdx = (int(f.read_register(r)) for r in ("rdi","rsi","rdx"))\r
        print("memcmp", inf.read_memory(rdi,rdx).tobytes(), inf.read_memory(rsi,rdx).tobytes())\r
        return False          # 不停，只记录\r
\`\`\`\r
\r
**走出"过头"了用 rr 反向执行**：\r
\`\`\`bash\r
rr record ./binary ; rr replay\r
# (gdb) reverse-continue / reverse-stepi   —— 退回到关键点，不用重启\r
\`\`\`\r
反调试题里程序会破坏现场，\`rr\` 的"倒带"能力往往比逐个下断点省事。\r
\r
**寄存器侧信道**：把 \`putchar\`/\`strcmp\` 的断点设成自动打印，跑一遍就拿到 flag 或 XOR keystream——**先喂已知明文**（如 \`AAAA...\`）拿 keystream，再推真实输入。\r
\r
## 三、ltrace / strace：先跑一遍再说\r
\r
\`\`\`bash\r
ltrace ./binary          # 库函数调用（看 strcmp/memcmp 的参数！）\r
ltrace -e 'strcmp+memcmp' ./binary\r
strace ./binary          # 系统调用\r
strace -f ./binary       # 跟随 fork 的子进程\r
strace -e trace=open,read,write,mmap ./binary\r
strace -e signal=SIGFPE,SIGSEGV ./binary 2>&1 | head   # 信号驱动的控制流\r
strace -f -e trace=process_vm_writev -e write=all -o t.log ./binary   # 抓父进程改写子进程的字节\r
\`\`\`\r
\r
**为什么先跑这两条**：一句话就能定位"比较发生在哪个函数、参数是什么"，比读一天反汇编快。**信号类反调试**（SIGFPE/SIGILL 处理器里跑真逻辑）用 \`strace -e signal\` 一看就知道有没有。\r
\r
**父进程 patch 子进程的题**（子进程全是 \`int3\`，父进程用 \`process_vm_writev\`/\`PTRACE_POKEDATA\` 逐条写入真指令）：\`strace\` 记录里**同时含目标地址和字节**，一趟就能把真代码 dump 出来 → 生成 IDA \`patch_byte\` 脚本还原。\r
\r
## 四、Frida：改了就跑，不改文件\r
\r
\`\`\`bash\r
pip install frida-tools frida\r
frida -f ./binary -l hook.js --no-pause        # 从头注入\r
frida -p $(pidof binary) -l hook.js            # 附加\r
\`\`\`\r
\`\`\`javascript\r
// 1) 观察：hook 比较函数，直接看期望值\r
Interceptor.attach(Module.findExportByName(null, "strcmp"), {\r
  onEnter(a){ this.a=Memory.readUtf8String(a[0]); this.b=Memory.readUtf8String(a[1]); },\r
  onLeave(r){ console.log(\`strcmp("\${this.a}","\${this.b}") -> \${r}\`); }\r
});\r
// 2) 修改：让校验恒真\r
Interceptor.replace(Module.findExportByName(null,"check_flag"),\r
  new NativeCallback(p => 1, 'int', ['pointer']));\r
// 3) 绕反调试：ptrace/时间/IsDebuggerPresent 改返回值\r
Interceptor.attach(Module.findExportByName(null,"ptrace"), { onLeave(r){ r.replace(ptr(0)); } });\r
// 4) 内存里直接找 flag\r
Process.enumerateRanges('r--').forEach(rg =>\r
  Memory.scan(rg.base, rg.size, "66 6c 61 67 7b", {   // "flag" + "{"\r
    onMatch:(addr)=>{ console.log(Memory.readUtf8String(addr,64)); }\r
  }));\r
// 5) patch 指令：NOP 掉一个检查\r
var a = Module.findBaseAddress("binary").add(0x1234);\r
Memory.patchCode(a, 2, code => { var w=new X86Writer(code,{pc:a}); w.putNop(); w.putNop(); w.flush(); });\r
\`\`\`\r
\r
**性能花招——记忆化递归**：指数级递归（斐波那契/Ackermann）用 Frida 缓存结果，命中时直接 \`context.rax=缓存值; context.rip=ret 地址\` 跳过重算，指数变线性。\r
\r
**移动端**：\`adb push frida-server\` 起服务 → \`frida -U -f 包名 -l hook.js\`；\`Java.perform\` 里 \`Java.use("类")\`，改 \`方法.implementation\`。Android 特有 hook（证书绑定绕过、直接调 native 方法）见 [[移动与IoT安全]]。\r
\r
## 五、LD_PRELOAD：冻结非确定性 + 造侧信道\r
\r
\`\`\`c\r
// freeze_time.c：冻结时间种子，让 VM/密码变成确定性的\r
#include <time.h>\r
time_t time(time_t *t){ if(t)*t=1234567890; return 1234567890; }\r
int rand(void){ return 42; }\r
// gcc -shared -fPIC -o freeze.so freeze_time.c ; LD_PRELOAD=./freeze.so ./binary\r
\`\`\`\r
\`\`\`c\r
// memcmp 侧信道：返回"匹配字节数"而不是 -1/0/1 → 变成逐字节 oracle\r
int memcmp(const char *s1, const char *s2, int n){\r
    int c=0; for(int i=0;i<n;i++){ if(s1[i]==s2[i]) c++; else break; } return c;\r
}\r
\`\`\`\r
**另一用法——dump"只能执行不能读"的二进制**（\`--x\` 权限，读不了文件）：LD_PRELOAD 一个带 \`__attribute__((constructor))\` 的 \`.so\`，进程内读 \`/proc/self/maps\` 找到自身映射范围，再从 \`/proc/self/mem\` 把内存拷出来写文件——**执行权限拦得住读文件，拦不住进程读自己的内存**。\r
\r
## 六、Unicorn：只模拟你要的那段\r
\r
不跑整个程序，只把关键函数搬进 Unicorn 模拟，接受输入、吐输出。\r
\r
\`\`\`python\r
# 依赖: pip install unicorn capstone keystone-engine\r
from unicorn import Uc, UC_ARCH_X86, UC_MODE_64\r
from unicorn.x86_const import UC_X86_REG_RAX, UC_X86_REG_RDI\r
uc = Uc(UC_ARCH_X86, UC_MODE_64)\r
BASE = 0x400000\r
uc.mem_map(BASE, 0x10000)\r
uc.mem_write(BASE, open('code.bin','rb').read())   # 抠出来的函数机器码\r
uc.reg_write(UC_X86_REG_RDI, 0x41)                 # 传参\r
uc.emu_start(BASE, BASE + len(code))               # 跑到函数末尾\r
print(hex(uc.reg_read(UC_X86_REG_RAX)))            # 取返回值\r
\`\`\`\r
**典型用法**：\r
- 反推"纯算术混淆"：IDAPython 收集非跳转指令（sub/add/xor/rol/ror），**倒序 + 对偶取反**（\`add↔sub\`、\`rol↔ror\`、\`xor\` 自逆），用 Keystone 汇编回来给 Unicorn 跑，输入已知输出 → 反推 flag。有 PEB/反调试改目标值的，先 patch 再 trace。\r
- 脱壳/SMC：把 dump 出的解密后代码丢进 Unicorn 跑。\r
- 拼接 API：**Unicorn 本身没有 OS**，遇到 syscall/libc 调用要自己 hook（见下），复杂就换 Qiling。\r
\r
**Qiling = Unicorn + OS 层**：带 syscall/文件系统/注册表，跨平台（Linux/Windows/ARM/MIPS/UEFI）。最大优点是**绕反调试**——\`ptrace(TRACEME)\` 天然返回成功，没有调试器痕迹。\r
\`\`\`python\r
from qiling import Qiling\r
ql = Qiling(["./binary"], "rootfs/x8664_linux")\r
ql.os.set_syscall("ptrace", lambda ql,r,pid,a,d: 0)   # 让 ptrace 恒成功\r
ql.hook_address(lambda ql: setattr(ql.arch.regs,"rax",0), 0x401234)  # 跳过某检查\r
ql.run()\r
\`\`\`\r
\r
## 七、QEMU user-mode：跨架构跑整个二进制\r
\r
\`\`\`bash\r
qemu-aarch64-static -L /usr/aarch64-linux-gnu/ ./arm64_bin\r
qemu-arm  -g 1234 -L /usr/arm-linux-gnueabihf/ ./arm_bin    # -g 起 gdb stub\r
gdb-multiarch -ex 'target remote :1234' ./arm_bin\r
qemu-mipsel -L /usr/mipsel-linux-gnu/ ./mips_bin            # 注意大小端\r
qemu-aarch64-static -E LD_PRELOAD=./libc.so.6 -L ./lib ./bin  # 带题目自带 libc\r
\`\`\`\r
**用途**：ARM/MIPS/RISC-V 二进制在本机（x86）跑起来 + 可调 + 可 hook 库函数。**坑**：\`/proc/self/status\`、\`ptrace\`、部分 syscall 在 qemu-user 下行为与真机不同，反 VM/反调试题可能**走另一条分支**——以真机/远程为准。\r
\r
## 八、angr：何时用、何时别用\r
\r
\`\`\`python\r
import angr, claripy\r
proj = angr.Project('./binary', auto_load_libs=False)\r
# 最简：给 find / avoid 地址\r
simgr = proj.factory.simgr()\r
simgr.explore(find=0x401234, avoid=0x401256)     # 成功/失败分支地址\r
print(simgr.found[0].posix.dumps(0))             # 到达成功路径所需的 stdin\r
\`\`\`\r
\`\`\`python\r
# 带约束：符号化输入 + 可打印约束 + 已知前缀\r
flag = claripy.Concat(*[claripy.BVS(f'c{i}',8) for i in range(32)], claripy.BVV(b'\\n'))\r
st = proj.factory.entry_state(stdin=flag)\r
for c in flag.chop(8)[:-1]:\r
    st.solver.add(c>=0x20); st.solver.add(c<=0x7e)\r
st.solver.add(flag.chop(8)[0]==ord('f'))         # ...\r
simgr = proj.factory.simgr(st)\r
simgr.explore(find=0x401234, avoid=0x401256)\r
\`\`\`\r
\`\`\`python\r
# 按输出判定，不依赖地址；hook 掉慢/贵函数\r
def ok(s): return b"Correct" in s.posix.dumps(1)\r
def bad(s): return b"Wrong" in s.posix.dumps(1)\r
simgr.explore(find=ok, avoid=bad)\r
class AlwaysOK(angr.SimProcedure):\r
    def run(self): return 1\r
proj.hook_symbol('check_license', AlwaysOK())\r
\`\`\`\r
\r
| 用 angr 合适 | 别用 angr |\r
|---|---|\r
| 清晰的"对/错"两条分支的 flag 校验 | 带复杂循环/大表/AES/SHA 的校验 |\r
| 迷宫/路径搜索类 | 浮点密集、堆操作复杂 |\r
| 拿地址或输出串就能 find/avoid | "校验函数能用 <200 行 Python 重写"——那直接手写 z3/求解更快 |\r
\r
- **路径爆炸对策**：\`DFS()\` 替代默认 BFS；\`ZERO_FILL_UNCONSTRAINED_MEMORY/REGISTERS\`；**hook 掉 crypto/hash**（把输入具体化后用 hashlib 算再写回内存）。\r
- **环境坑**：angr 与 Python 版本强绑定，**Git Bash 的 3.11 可装，PowerShell 的 3.14 大概率装不上**；能绕开符号执行时优先绕开。\r
- **Triton**（单路径 DSE）：跑具体执行、symbolize 输入，在比较点解约束。比 angr 快、不易爆炸，适合**线性/单路径**的混淆代码。\r
\r
## 九、内存 dump 直接捞 flag（收尾最快的打法）\r
\r
很多题的 flag 在程序里被拼出来后**就躺在内存里**，根本不用还原算法。\r
\r
| 时机 | 做法 |\r
|---|---|\r
| 断在输出/比较点 | gdb \`x/s $rdi\`、Frida 扫内存 |\r
| 让它跑一会再 dump | gdb \`dump binary memory out.bin <start> <end>\`；或 \`gcore <pid>\` 出 core |\r
| 全内存找 | pwndbg \`search -s "flag"\`（原式带花括号，为免误判改写）；Frida \`Memory.scan\` 找 \`66 6c 61 67 7b\` |\r
| 只有 crash 没有 gdb | \`LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libSegFault.so ./target\` —— 段错误时自动打印寄存器+回溯+内存映射 |\r
| 拿 core 事后分析 | \`gdb ./bin core\`；或用 [[杂项-取证与流量分析]] 的思路做字符串/结构分析 |\r
\r
**XOR 校验类的最快解**（不必逆算法）：喂 \`AAAA...\`，在 \`strcmp(expected, enc(input))\` 断点记录 \`enc('A')\`，由 \`enc(x) = x ^ key\` 得 \`key = enc('A') ^ 'A'\`，再 \`target ^ key\` 还原输入。\r
\r
## 关键点\r
\r
1. **先跑（ltrace/strace）再断（gdb），最后才考虑模拟**：一句话能定位的比较点，不要用一天反汇编去找。\r
2. **断在比较/输出点是最高性价比的操作**：gdb 的 \`commands\` 把断点变成自动 oracle；\`usleep\` 拖延用"断输出函数看寄存器"直接跳过。\r
3. **Frida 不改文件**：\`attach\` 观察、\`replace\` 改行为、\`patchCode\` 改指令、扫内存找 flag——一套脚本同时干"绕反调试 + 拿答案"。\r
4. **LD_PRELOAD 是最轻的 hook**：冻 \`time/rand\` 让非确定性变确定，改 \`memcmp\` 造逐字节 oracle；对 \`syscall(N,...)\` 直发的不生效。\r
5. **Unicorn 只模拟关键函数、Qiling 才模拟整机**；跨架构首选 QEMU user-mode（但反 VM 分支不可信）。\r
6. **angr 有明确的适用边界**：清晰的 find/avoid + 能 hook 掉 crypto 才好用；复杂校验/浮点/堆一律别指望它——手写 z3 往往更快。\r
\r
## 关联\r
\r
- [[逆向-Reverse方法论]] —— 动态调试是它流程中的一环；本页是"工具怎么用"的展开\r
- [[逆向-反调试与混淆对抗]] —— 断点/单步会触发反调试；绕不过就先来过这关（模拟执行是无痕迹的终极手段）\r
- [[逆向-多语言与多平台]] —— 先判出语言/架构，才知道该用 gdb、dnSpy 还是 wasm2c\r
- [[Pwn-栈溢出与ROP]] —— gdb/pwndbg、GEF 是两边共用的基本功；调试器里读寄存器/栈的姿势相通\r
- [[CTF-常用工具清单]] —— pwndbg/GEF/Frida/Qiling/angr 的安装与替代品索引\r
- [[杂项-取证与流量分析]] —— 内存 dump / core / 崩溃现场的事后分析在此延伸\r
\r
## 存疑 / 矛盾\r
\r
- **软件断点会污染"自校验 / 扫 0xCC / 读 TF"类检测**：这类必须用硬件断点 \`hbreak\`，或直接换模拟执行；用 \`stepi\` 单步也可能改变 EFLAGS 与流水线，导致检测结果翻转。\r
- **QEMU/Unicorn 的"无调试器痕迹"不绝对**：\`cpuid\`、\`rdtsc\` 单调性等 CPU 特性模拟得不真，反 VM 题仍可能走假分支；以真机/远程为准。\r
- **angr 的期望值被普遍高估**：现实里带循环/加密/字符串编码的校验就出不来；判据是"校验能否<200 行 Python 重写"。且**版本强绑定**——PowerShell 的 3.14 大概率装不上，用 Git Bash 的 3.11。\r
- **\`strace\` 跟踪会显著改变时序**：时间敏感的反调试题在 strace 下可能走另一条分支；\`strace\` 本身也会被 ptrace 类检测发现。\r
- **MEMORY dump 的边界要确认**：\`dump binary memory\` 要给定 start/end，dump 少了会漏 flag，dump 多了文件很大；先 \`vmmap\` 确认范围。\r
- **Qiling/QEMU 的 libc 必须与题目匹配**：用错版本会在启动阶段崩，别怀疑自己的脚本（同 [[逆向-反调试与混淆对抗]] 里"ld 与 libc 必须同版本"）。\r
- **Frida 在高版本/加固 App 上会被检测**：脚本跑不起来先怀疑反 Frida（扫 maps、端口、内联钩子），而不是脚本写错了。\r
\r
## 来源\r
\r
- 糯米内建知识整理 · 2026-10-03（技能文件 \`tools-dynamic.md\` / \`tools-emulation.md\` / \`tools-advanced.md\` / \`tools-advanced-2.md\` 提炼，未附原题 flag）\r
`,t="concept",i="reverse",o={internal:["CTF-常用工具清单","Pwn-栈溢出与ROP","杂项-取证与流量分析","移动与IoT安全","逆向-Reverse方法论","逆向-反调试与混淆对抗","逆向-多语言与多平台"],unresolvedCount:0},s={name:r,title:n,summary:e,content:a,section:t,group:i,links:o};export{a as content,s as default,i as group,o as links,r as name,t as section,e as summary,n as title};
