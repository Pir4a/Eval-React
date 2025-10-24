import { useEffect, useMemo, useRef, useState } from 'react'
import { UserCard } from './UserCard'
import { SearchBar } from './SearchBar'
import { SortMenu } from './SortMenu'
// import { Spinner } from '../../../shared/atoms/Spinner'
import { ErrorMessage } from '../../../shared/molecules/ErrorMessage'
import { useUsers } from '../hooks/useUsers'
import { loadFavoriteIds } from '../../../utils/favorites'
import AnimatedContent from '../../../shared/animate.tsx'
import { gsap } from 'gsap'

export default function UserList() {
  const { users, total, loading, error, search, sortKey, sortDir, page, pageSize, setSearch, setSort, setPage, refetch } = useUsers()
  const [showFav, setShowFav] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const gridRef = useRef<HTMLDivElement>(null)
  const [pendingDir, setPendingDir] = useState<null | 'next' | 'prev' | 'filter'>(null)

  useEffect(() => {
    const update = () => setFavoriteIds(loadFavoriteIds())
    update()
    window.addEventListener('favorites:changed', update as EventListener)
    return () => window.removeEventListener('favorites:changed', update as EventListener)
  }, [])

  // Track first data load to control splash loader
  useEffect(() => {
    if (!loading && initialLoading) {
      // small delay for smoother fade
      const t = setTimeout(() => setInitialLoading(false), 200)
      return () => clearTimeout(t)
    }
  }, [loading, initialLoading])

 console.log(users)
 console.log(total)
 console.log(loading)
 console.log(error)
 console.log(search)
 console.log(sortKey)
 console.log(sortDir)
 console.log(page)
 console.log(pageSize)

  const visibleUsers = useMemo(() => {
    return showFav ? users.filter((u) => favoriteIds.includes(u.id)) : users
  }, [showFav, users, favoriteIds])

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  const animateOut = (dir: 'next' | 'prev' | 'filter') =>
    new Promise<void>((resolve) => {
      if (!gridRef.current) return resolve()
      const opts =
        dir === 'filter'
          ? { x: 0, y: 12, opacity: 0, duration: 0.25, ease: 'power2.in' as const }
          : { x: dir === 'next' ? -50 : 50, y: 0, opacity: 0, duration: 0.35, ease: 'power2.in' as const }
      gsap.to(gridRef.current, { ...opts, onComplete: resolve })
    })

  const animateIn = (dir: 'next' | 'prev' | 'filter') => {
    if (!gridRef.current) return
    if (dir === 'filter') {
      gsap.set(gridRef.current, { x: 0, y: -12, opacity: 0 })
      gsap.to(gridRef.current, { x: 0, y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' })
    } else {
      gsap.set(gridRef.current, { x: dir === 'next' ? 50 : -50, opacity: 0 })
      gsap.to(gridRef.current, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' })
    }
  }

  const handleNext = async () => {
    if (loading) return
    setPendingDir('next')
    await animateOut('next')
    setPage(page + 1)
  }

  const handlePrev = async () => {
    if (loading || page === 1) return
    setPendingDir('prev')
    await animateOut('prev')
    setPage(page - 1)
  }

  const handleToggleFav = async () => {
    if (loading) return
    setPendingDir('filter')
    await animateOut('filter')
    setShowFav((v) => !v)
    setPage(1)
  }

  useEffect(() => {
    if (pendingDir && !loading) {
      animateIn(pendingDir)
      setPendingDir(null)
    }
  }, [users, loading, pendingDir])

  const handleGotoPage = async (target: number) => {
    if (loading || target === page || target < 1 || target > pageCount) return
    const dir = target > page ? 'next' : 'prev'
    setPendingDir(dir)
    await animateOut(dir)
    setPage(target)
  }

  return (
    <AnimatedContent distance={50}

    direction="vertical"
  
    reverse={false}
  
    duration={1.2}
  
    ease="easeInOut"
  
    initialOpacity={0.2}
  
    animateOpacity={true}
  
    scale={1.1}
  
    threshold={0.1}
  
    delay={0.1}>
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex items-center gap-3">
          <button
            className={`rounded-md border px-3 py-2 text-sm transition ${showFav ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'border-neutral-300 dark:border-neutral-700'}`}
            onClick={handleToggleFav}
          >
            {showFav ? 'Afficher tous' : 'Afficher favoris'}
          </button>
          <SortMenu sortKey={sortKey} sortDir={sortDir} onChange={setSort} />
        </div>
      </div>

      {initialLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <div key={i} className="group flex items-center gap-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
              <div className="h-12 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-1/2 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
                <div className="h-3 w-2/3 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
              </div>
              <div className="h-6 w-6 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
            </div>
          ))}
        </div>
      ) : null}
      {error && <ErrorMessage message={error} onRetry={refetch} className="mb-4" />}

      <div
        ref={gridRef}
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-300 ${initialLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        {visibleUsers.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between text-sm">
        <button
          className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 disabled:opacity-50"
          onClick={handlePrev}
          disabled={page === 1}
        >
          Précédent
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: pageCount }).slice(Math.max(0, page - 3), Math.min(pageCount, page + 2)).map((_, idx) => {
            const start = Math.max(0, page - 3)
            const p = start + idx + 1
            return (
              <button
                key={p}
                onClick={() => handleGotoPage(p)}
                className={`min-w-8 px-2 py-1 rounded-md border text-sm transition ${
                  p === page
                    ? 'border-neutral-400 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800'
                    : 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                {p}
              </button>
            )
          })}
        </div>

        <button
          className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 disabled:opacity-50"
          onClick={handleNext}
          disabled={page >= pageCount}
        >
          Suivant
        </button>
      </div>
    </div>
    </AnimatedContent>

  )
}


