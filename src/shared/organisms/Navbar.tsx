import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '../../providers/ThemeProvider'
import { Toggle } from '../molecules/Toggle'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight">UsersApp</Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/" className={({ isActive }) => `text-sm ${isActive ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-600 dark:text-neutral-400'}`}>
            Liste
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <Toggle checked={theme === 'dark'} onChange={toggleTheme} label="Dark" />
        </div>
      </div>
    </header>
  )
}


