import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '../../providers/ThemeProvider'
import { Toggle } from '../molecules/Toggle'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  return (
    <header className="sticky top-2 z-10 border-b shadow-md text-neutral-700 dark:text-neutral-400 border-neutral-300 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 backdrop-blur w-[95%] mx-auto rounded-lg">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">UsersApp</Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/" className={({ isActive }) => `text-sm ${isActive ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
            Users List
          </NavLink>
          <NavLink to="/error-test" className={({ isActive }) => `text-sm ${isActive ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
            Test Fetch Error Page
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <Toggle checked={theme === 'dark'} onChange={() => {setTheme(theme === 'dark' ? 'light' : 'dark'); console.log(theme)}} label="Dark" />
        </div>
      </div>
    </header>
  )
}


