import { UserCard } from './UserCard'
import { SearchBar } from './SearchBar'
import { SortMenu } from './SortMenu'
import { Spinner } from '../../../components/ui/Spinner'
import { ErrorMessage } from '../../../components/ui/ErrorMessage'
import { useUsers } from '../hooks/useUsers'

export default function UserList() {
  const { users, total, loading, error, search, sortKey, sortDir, page, pageSize, setSearch, setSort, setPage, refetch } = useUsers()

 console.log(users)
 console.log(total)
 console.log(loading)
 console.log(error)
 console.log(search)
 console.log(sortKey)
 console.log(sortDir)
 console.log(page)
 console.log(pageSize)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={setSearch} />
        <SortMenu sortKey={sortKey} sortDir={sortDir} onChange={setSort} />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <Spinner /> Chargement...
        </div>
      )}
      {error && <ErrorMessage message={error} onRetry={refetch} className="mb-4" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>

      {/* Simple pagination display */}
      <div className="mt-6 flex items-center justify-between text-sm">
        <button
          className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Précédent
        </button>
        <span className="text-neutral-600 dark:text-neutral-400">Page {page}</span>
        <button
          className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={users.length < pageSize && (page - 1) * pageSize + users.length >= total}
        >
          Suivant
        </button>
      </div>
    </div>
  )
}


