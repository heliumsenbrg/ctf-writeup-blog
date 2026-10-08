/**
 * 一次性脚本：把 flags.js 里明文的 flag 换成「用该题口令加密后的密文」。
 *
 * 为什么：原来的 flag 是明文常量，任何人 F12 / grep 打包产物就能直接看到答案，
 * 谜题形同虚设。改成密文后，包里不再有可读的答案。
 *
 * ⚠️ 诚实说明（写进注释，避免以后误解）：这**不是**绝对安全 ——
 *    客户端谜题天生如此：浏览器必须能算出期望答案，所以有耐心的人依然能从运行时推导出来。
 *    真正的隐藏需要服务端校验（把谜题改成"服务端出题+判题"的有状态流程）。
 *    这一步只是把门槛从「grep 一下」提高到「真的理解机制」。
 *
 * 用法：node scripts/encrypt-flags.mjs   （幂等：已经是密文的会跳过）
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const FLAGS_PATH = path.join(HERE, '..', 'src', 'config', 'flags.js')

const { default: FLAGS, computeCipher } = await import(pathToFileURL(FLAGS_PATH).href)

let src = fs.readFileSync(FLAGS_PATH, 'utf8')
let changed = 0

for (const f of FLAGS) {
  if (!f.flag) {
    console.log(`  · ${f.name}：已是密文，跳过`)
    continue
  }
  const enc = computeCipher(f.flag, f.key)
  // 只替换该题目自己那一条里的 flag 字段
  const from = `flag: '${f.flag}'`
  if (!src.includes(from)) {
    console.log(`  ⚠️ ${f.name}：源码里找不到 ${from}，跳过`)
    continue
  }
  src = src.replace(from, `flagEnc: '${enc}'`)
  changed++
  console.log(`  ✅ ${f.name}：明文 → 密文（${f.flag} → ${enc.slice(0, 24)}…）`)
}

if (changed) {
  fs.writeFileSync(FLAGS_PATH, src)
  console.log(`\n  已写回 flags.js（${changed} 条加密）`)
} else {
  console.log('\n  无需修改')
}
