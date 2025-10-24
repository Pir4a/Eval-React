import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { User } from '../types/User'
import { FavoritesToggle } from './FavoritesToggle'

type Props = { user: User; onNavigate?: () => void }

function UserCardBase({ user, onNavigate }: Props) {
  return (

    <div className="group hover:scale-101 flex items-center gap-4 rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4 hover:shadow-md hover:border-neutral-400 dark:hover:border-neutral-700 transition-all">
      <Link to={`/user/${user.id}`} className="flex items-center gap-4 flex-1 min-w-0" onClick={onNavigate}>
        <img
          src={user.image || `https://api.dicebear.com/9.x/initials/svg?seed=${user.firstName}+${user.lastName}`}
          alt={`${user.firstName} ${user.lastName}`}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-neutral-300 dark:ring-neutral-800"
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-neutral-900 dark:text-neutral-100 leading-tight truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
        </div>
      </Link>
      <FavoritesToggle userId={user.id} />
     <Link to={`/user/${user.id}`} className="shrink-0" onClick={onNavigate}>
        <span className="text-neutral-500 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-200 transition">→</span></Link>
      </div>

  )
}

export const UserCard = memo(UserCardBase)


