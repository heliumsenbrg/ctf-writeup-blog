import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Terminal, Flag, BookOpen, ExternalLink } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-cyber-darker/80 backdrop-blur-xl border-b border-cyber-cyan/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-purple p-0.5"
            >
              <div className="w-full h-full rounded-lg bg-cyber-darker flex items-center justify-center">
                <Terminal className="w-5 h-5 text-cyber-cyan" />
              </div>
            </motion.div>
            <div>
              <span className="text-xl font-bold text-gradient anime-title">CTF WriteUp</span>
              <div className="text-xs text-cyber-cyan/90 font-mono">Web Security Battle Notes</div>
            </div>
          </Link>
          
          {/* Nav links */}
          <div className="flex items-center gap-6">
            <NavLink to="/" active={location.pathname === '/'}>
              <BookOpen className="w-4 h-4 mr-2" />
              Home
            </NavLink>
            <NavLink to="/challenges" active={location.pathname === '/challenges'}>
              <Flag className="w-4 h-4 mr-2" />
              Challenges
            </NavLink>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Platform
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} className={`nav-link flex items-center ${active ? 'text-cyber-cyan' : ''}`}>
      {children}
      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute bottom-0 left-0 w-full h-px bg-cyber-cyan"
        />
      )}
    </Link>
  )
}
