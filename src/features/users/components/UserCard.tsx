import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { User } from '../types/User'

type Props = { user: User }

function UserCardBase({ user }: Props) {
  return (
    <Link
      to={`/user/${user.id}`}
      className="group flex items-center gap-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 hover:shadow-sm transition"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={user.image || `https://api.dicebear.com/9.x/initials/svg?seed=${user.firstName}+${user.lastName}`}
        alt={`${user.firstName} ${user.lastName}`}
        className="h-12 w-12 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
      />
      <div className="flex-1">
        <p className="font-medium leading-tight">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{user.email}</p>
      </div>
      <span className="text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition">→</span>
    </Link>
  )
}

export const UserCard = memo(UserCardBase)


