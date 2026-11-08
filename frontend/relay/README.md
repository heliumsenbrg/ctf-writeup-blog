# 云数据中转（cloud-relay）

把博客前端对云服务的请求转发出去，解决 GitHub Pages 上的 **Origin 白名单 / CORS** 问题。
它同时承担三件守门的事：登录才能写、发验证码要过 Turnstile、发码双重限流。

## ⚠️ 这个应用**没有、也不该有**自己的云环境

| | 是谁 |
|---|---|
| 数据真正所在的云环境 | `wbapp_amJCk3tyxjtHbVB4JE3NNS`（博客应用，`.env.production` 里的 publishableKey 就是它） |
| 本中转的发布应用 | `wbapp_TSVvtr5DvECIo7kta7LjNf`（`cloud-relay.app.workbuddy.host`） |
| 本中转的云服务 | **未开启** —— 2026-11-08 主人明确选择「保持现有接法」 |

中转是**无状态代理**：不存数据、不需要库。给它单独开一套云服务会得到一个**全新的空数据库**，
留言 / 评论 / 通关记录都不在里面，随后要么数据分家、要么得停机迁移。

> 真要做那次迁移，顺序是：新环境建表 → 导数据 → 改前端 publishableKey → 改这里的 `BACKENDS`
> → 重新发布两边 → 验收。不要只改其中一步。

## 守门规则（别随手放宽）

| 路径 | 规则 |
|---|---|
| `/.cloud/database/rest/{guestbook,comments,quest_board}` 读 | 匿名放行 |
| 同上 写 | 必须带**有效**用户 Bearer（先打 `/.cloud/auth/v1/user/me` 验证），否则 401 `login_required` |
| `/.cloud/auth/**` | 放行；只有 `/v1/verification`（发码）要求 Turnstile |
| 其它 `/.cloud/**` | 404 |

数据库层还有第二道：三张表的 INSERT 策略是 `auth.role()='authenticated' AND user_id=auth.uid()`，
绕开中转直连也写不进去（实测 401 `42501`）。见 `db/auth-owner-rls.sql`。

## 环境变量

| 变量 | 默认 | 说明 |
|---|---|---|
| `PORT` | 3000 | 托管沙箱要求绑 `0.0.0.0` |
| `BACKENDS` | 博客发布域 + 本域 | 备用上游，按顺序退化 |
| `ALLOWED_ORIGINS` | github.io / vercel 镜像 | CORS 精确匹配，不带尾斜杠 |
| `TURNSTILE_SECRET` | 无 | **没配就 fail-closed**：发码直接 403，不会静默放行 |
| `OTP_LIMIT_PER_10MIN` | 5 | 按手机号/邮箱（哈希后）限流 |
| `OTP_GLOBAL_LIMIT_PER_10MIN` | 30 | 全局配额，防换号+换 IP 刷短信费 |
| `WRITE_LIMIT_PER_MIN` | 20 | 按 IP 的写请求限流 |
| `ENABLE_DIAG` | 关 | 开 `/__diag` 诊断路由，排查完记得关 |

`TURNSTILE_SECRET` 只放在本目录的 `.env`（已被 git 忽略），**不要**写进仓库或日志。

## 本地验证

```bash
# 不触发真实短信：上游指到死端口 + 用 Cloudflare 测试密钥（siteverify 恒通过）
BACKENDS=http://127.0.0.1:9 TURNSTILE_SECRET=1x0000000000000000000000000000000AA \
OTP_GLOBAL_LIMIT_PER_10MIN=4 OTP_LIMIT_PER_10MIN=2 PORT=3311 node server.js
```

预期：同号第 3 次 `429 scope=recipient`；换号超过全局 4 次 `429 scope=global`。
