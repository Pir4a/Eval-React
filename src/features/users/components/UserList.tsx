import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { UserCard } from './UserCard'
import { SearchBar } from './SearchBar'
import { SortMenu } from './SortMenu'
// import { Spinner } from '../../../shared/atoms/Spinner'
import { ErrorMessage } from '../../../shared/molecules/ErrorMessage'
import { useUsers } from '../hooks/useUsers'
import { loadFavoriteIds } from '../../../utils/favorites'
import AnimatedContent from '../../../shared/animate.tsx'
import { gsap } from 'gsap'
import toast from 'react-hot-toast'
import type { User } from '../types/User'

export default function UserList() {
  const { users, total, loading, error, search, sortKey, sortDir, page, pageSize, pageCache, setSearch, setSort, setPage, refetch, prefetchPages } = useUsers()
  const [showFav, setShowFav] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [navigating, setNavigating] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animPages, setAnimPages] = useState<{ prev: User[]; current: User[]; next: User[] } | null>(null)
  const [carouselKey, setCarouselKey] = useState(0)

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

  // Toast on error and success
  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des utilisateurs")
    }
  }, [error])

  useEffect(() => {
    if (!loading && !error && users.length > 0) {
      toast.dismiss('reload')
    }
  }, [loading, error, users])

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  // Get users for a specific page from cache or current
  const getUsersForPage = useCallback((pageNum: number): User[] => {
    return pageCache[pageNum] || []
  }, [pageCache])

  // Apply favorite filter to users
  const filterUsers = useCallback((userList: User[]) => {
    return showFav ? userList.filter((u) => favoriteIds.includes(u.id)) : userList
  }, [showFav, favoriteIds])

  // Offline mode: favorites from cache fallback
  const cachedFavUsers = useMemo(() => {
    const lists = Object.values(pageCache) as User[][]
    const merged: User[] = []
    const seen = new Set<number>()
    for (const arr of lists) {
      for (const u of arr) {
        if (!seen.has(u.id)) {
          seen.add(u.id)
          if (favoriteIds.includes(u.id)) merged.push(u)
        }
      }
    }
    return merged
  }, [pageCache, favoriteIds])

  useEffect(() => {
    if (error && cachedFavUsers.length > 0) {
      toast('Mode hors ligne: favoris affichés', { icon: '📴' })
    }
  }, [error, cachedFavUsers.length])

  const basePrev = isAnimating && animPages ? animPages.prev : getUsersForPage(page - 1)
  const baseCurrent = isAnimating && animPages ? animPages.current : getUsersForPage(page)
  const baseNext = isAnimating && animPages ? animPages.next : getUsersForPage(page + 1)

  const visibleUsers = useMemo(() => filterUsers(baseCurrent), [filterUsers, baseCurrent])
  const prevPageUsers = useMemo(() => filterUsers(basePrev), [filterUsers, basePrev])
  const nextPageUsers = useMemo(() => filterUsers(baseNext), [filterUsers, baseNext])

  const slideToPage = (direction: 'next' | 'prev') => {
    if (!carouselRef.current || isAnimating) return
    
    // Snapshot current cached pages to keep DOM stable during animation
    setAnimPages({
      prev: getUsersForPage(page - 1),
      current: getUsersForPage(page),
      next: getUsersForPage(page + 1),
    })

    setIsAnimating(true)
    // From center (-33.33%) go to right panel (-66.66%) or left panel (0%)
    const targetPercent = direction === 'next' ? -66.66 : 0
    
    gsap.to(carouselRef.current, {
      xPercent: targetPercent,
      duration: 0.6,
      ease: 'power3.inOut',
      onComplete: () => {
        // Reset to center position after page change
        gsap.set(carouselRef.current, { xPercent: -33.33 })
        setPage(direction === 'next' ? page + 1 : page - 1)
        // Clear snapshot on next frame to avoid paint-jank
        requestAnimationFrame(() => {
          setAnimPages(null)
          setCarouselKey(k => k + 1)
          setIsAnimating(false)
        })
      }
    })
  }

  // Initialize carousel to show center panel (current page)
  useEffect(() => {
    if (carouselRef.current) {
      gsap.set(carouselRef.current, { xPercent: -33.33 })
    }
  }, [])

  const handleNext = () => {
    if (loading || isAnimating || page >= pageCount) return
    // Prefetch the next page if it's not in cache yet
    const next = page + 1
    if (!pageCache[next]) {
      prefetchPages([next])
    }
    slideToPage('next')
  }

  const handlePrev = () => {
    if (loading || isAnimating || page === 1) return
    const prev = page - 1
    if (!pageCache[prev]) {
      prefetchPages([prev])
    }
    slideToPage('prev')
  }

  const handleToggleFav = () => {
    if (isAnimating) return
    setShowFav((v) => !v)
    setPage(1)
  }

  const handleGotoPage = (target: number) => {
    if (loading || isAnimating || target === page || target < 1 || target > pageCount) return
    
    // Calculate how many pages we're jumping
    const distance = Math.abs(target - page)
    const direction = target > page ? 'next' : 'prev'
    
    if (!carouselRef.current) return
    
    // If jumping to a page not yet cached, prefetch before animating
    if (!pageCache[target]) {
      prefetchPages([target])
    }
    setIsAnimating(true)
    
    // For multi-page jumps, use a faster animation
    const duration = distance > 1 ? 0.4 : 0.6
    const targetPercent = direction === 'next' ? -66.66 : 0
    
    gsap.to(carouselRef.current, {
      xPercent: targetPercent,
      duration,
      ease: 'power3.inOut',
      onComplete: () => {
        // Reset to center position after page change
        gsap.set(carouselRef.current, { xPercent: -33.33 })
        setPage(target)
        setIsAnimating(false)
      }
    })
  }

  return (
    
    <div className="mx-auto w-[86%] max-w-6xl px-6 py-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center text-neutral-700 dark:text-neutral-400 sm:justify-between">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex items-center gap-3">
          <button
            className={`rounded-md text-neutral-700 dark:text-neutral-400 cursor-pointer hover:scale-105 border px-3 py-2 text-sm transition-all ${showFav ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-sm' : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-sm'}`}
            onClick={handleToggleFav}
            disabled={isAnimating}
          >
            {showFav ? 'Afficher tous' : 'Afficher favoris'}
          </button>
          <SortMenu sortKey={sortKey} sortDir={sortDir} onChange={setSort} />
        </div>
      </div>

      {initialLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <div key={i} className="group flex items-center gap-4 rounded-xl border border-pink-400/40 bg-[#060010] p-4">
              <div className="h-12 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-1/2 bg-pink-400/30 animate-pulse rounded" />
                <div className="h-3 w-2/3 bg-pink-400/20 animate-pulse rounded" />
              </div>
              <div className="h-6 w-6 bg-pink-400/30 animate-pulse rounded" />
            </div>
          ))}
        </div>
      ) : null}
      {error && cachedFavUsers.length === 0 && <ErrorMessage message={error} onRetry={refetch} className="mb-4" />}

      {error && cachedFavUsers.length > 0 && (
        <div className="mb-6 space-y-3">
          <div className="rounded-lg border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 p-4 text-blue-900 dark:text-blue-200">
            <p className="text-sm">Mode hors ligne détecté. Affichage des favoris en cache.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cachedFavUsers.map((u) => (
              <UserCard key={`offline-${u.id}`} user={u} onNavigate={() => setNavigating(true)} />
            ))}
          </div>
        </div>
      )}

      {/* Carousel Container */}
      {(!error || cachedFavUsers.length === 0) && (
      <div className="relative overflow-hidden ">
        <AnimatedContent 
          distance={50}
          direction="vertical"
          reverse={false}
          duration={1.2}
          ease="easeInOut"
          initialOpacity={0.2}
          animateOpacity={true}
          scale={1.1}
          threshold={0.1}
          delay={0.1}
        >
          <div 
            key={carouselKey}
            ref={carouselRef}
            className="flex will-change-transform"
            style={{ width: '300%' }}
          >
            {/* Previous Page */}
            <div className="w-1/3 shrink-0 px-1 max-h-96">
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${initialLoading || navigating ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {page > 1 && prevPageUsers.length > 0 ? (
                  prevPageUsers.map((u) => (
                    <UserCard key={`prev-${u.id}`} user={u} onNavigate={() => setNavigating(true)} />
                  ))
                ) : (
                  <div className="col-span-full h-20" />
                )}
              </div>
            </div>

            {/* Current Page */}
            <div className="w-1/3 shrink-0 px-1 max-h-96">
              <div className={`grid grid-cols-1 sm:grid-cols-2  gap-4 ${initialLoading || navigating ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {visibleUsers.map((u) => (
                  <UserCard key={`current-${u.id}`} user={u} onNavigate={() => setNavigating(true)} />
                ))}
              </div>
            </div>

            {/* Next Page */}
            <div className="w-1/3 shrink-0 px-1 max-h-96">
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${initialLoading || navigating ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {page < pageCount && nextPageUsers.length > 0 ? (
                  nextPageUsers.map((u) => (
                    <UserCard key={`next-${u.id}`} user={u} onNavigate={() => setNavigating(true)} />
                  ))
                ) : (
                  <div className="col-span-full h-20" />
                )}
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
      )}
      {/* Pagination */}
      {(!error || cachedFavUsers.length === 0) && (
      <div className="mt-6 flex items-center justify-between text-sm">
        <button
          className="rounded-md border text-neutral-700 hover:scale-105 cursor-pointer dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-1.5 disabled:opacity-50 hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-sm transition-all disabled:hover:border-neutral-300 disabled:hover:shadow-none"
          onClick={handlePrev}
          disabled={page === 1 || isAnimating}
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
                disabled={isAnimating}
                className={`min-w-8 px-2 py-1 rounded-md border text-sm transition-all cursor-pointer ${
                  p === page
                    ? 'border-neutral-400 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800'
                    : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50'
                }`}
              >
                {p}
              </button>
            )
          })}
        </div>

        <button
          className="rounded-md border text-neutral-700 hover:scale-105 cursor-pointer dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-1.5 disabled:opacity-50 hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-sm transition-all disabled:hover:border-neutral-300 disabled:hover:shadow-none"
          onClick={handleNext}
          disabled={page >= pageCount || isAnimating}
        >
          Suivant
        </button>
      </div>
      )}
    </div>
    

  )
}


