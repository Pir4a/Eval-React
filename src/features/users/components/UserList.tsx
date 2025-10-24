import { useEffect, useMemo, useState } from 'react'
import { UserCard } from './UserCard'
import { SearchBar } from './SearchBar'
import { SortMenu, type SortDir, type SortKey } from './SortMenu'
import { Spinner } from '../../../components/ui/Spinner'
import { ErrorMessage } from '../../../components/ui/ErrorMessage'
import type { User } from '../types/User'

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('https://dummyjson.com/users')
      if (!res.ok) throw new Error('Réponse invalide')
      const data = (await res.json()) as { users: User[] }
      setUsers(data.users)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return users
    return users.filter((u) =>
      [u.firstName, u.lastName, u.email].some((v) => (v || '').toLowerCase().includes(term))
    )
  }, [users, search])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      let va: string | number = ''
      let vb: string | number = ''
      if (sortKey === 'name') {
        va = `${a.firstName} ${a.lastName}`.toLowerCase()
        vb = `${b.firstName} ${b.lastName}`.toLowerCase()
      } else {
        va = a.age ?? 0
        vb = b.age ?? 0
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return arr
  }, [filtered, sortKey, sortDir])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={setSearch} />
        <SortMenu sortKey={sortKey} sortDir={sortDir} onChange={(k, d) => { setSortKey(k); setSortDir(d) }} />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <Spinner /> Chargement...
        </div>
      )}
      {error && <ErrorMessage message={error} onRetry={fetchUsers} className="mb-4" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paged.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>

      {/* Simple pagination display */}
      <div className="mt-6 flex items-center justify-between text-sm">
        <button
          className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Précédent
        </button>
        <span className="text-neutral-600 dark:text-neutral-400">Page {page}</span>
        <button
          className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={sorted.length <= page * pageSize}
        >
          Suivant
        </button>
      </div>
    </div>
  )
}


