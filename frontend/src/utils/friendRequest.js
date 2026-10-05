// 友链申请：把访客填写的名称/链接组装成 GitHub「新建 Issue」链接。
// 纯静态站没有后端，用预填 Issue 作为半自动收录入口（站长审核后合入 friendLinks.js 上线）。
export const FRIEND_ISSUE_REPO = 'https://github.com/heliumsenbrg/ctf-writeup-blog'

export function buildFriendIssueUrl(name = '', url = '') {
  const n = String(name).trim()
  const u = String(url).trim()
  if (!n || !u) return null
  if (!/^https?:\/\/\S+/i.test(u)) return null
  const title = `友链申请：${n}`
  const body = [
    '### 友链申请',
    '',
    `- 名称：${n}`,
    `- 链接：${u}`,
    '',
    '（由博客友链区表单自动生成）',
  ].join('\n')
  return `${FRIEND_ISSUE_REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
}
