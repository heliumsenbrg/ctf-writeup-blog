import { Link, useLocation } from 'react-router-dom'
import { LockKeyhole, Loader2 } from 'lucide-react'
import { useAuthUser } from '../hooks/useAuthUser.js'

export default function LoginGate({ action = '发言', children }) {
  const location = useLocation()
  const { user, loading } = useAuthUser()

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-cyber-grid/20 bg-cyber-darker/50 px-4 py-3 font-mono text-xs text-cyber-grid">
        <Loader2 className="h-4 w-4 animate-spin text-cyber-cyan" />
        检查登录状态…
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-cyber-cyan/20 bg-cyber-cyan/5 px-4 py-3">
        <span className="flex items-center gap-2 text-xs text-cyber-grid">
          <LockKeyhole className="h-4 w-4 text-cyber-cyan" />
          登录后才能{action}
        </span>
        <Link
          to="/login"
          state={{ from: location.pathname }}
          className="rounded-lg border border-cyber-cyan/40 bg-cyber-cyan/10 px-3 py-1.5 font-mono text-xs text-cyber-cyan transition-colors hover:bg-cyber-cyan/20"
        >
          去登录
        </Link>
      </div>
    )
  }

  return children
}
