import { useCallback, useEffect, useMemo, useState } from 'react'
import type { User } from '../types/User'
import { fetchUsers, searchUsers } from '../services/users.api'

export type SortKey = 'name' | 'age'
export type SortDir = 'asc' | 'desc'

type State = {
  users: User[]
  total: number
  loading: boolean
  error: string | null
  search: string
  sortKey: SortKey
  sortDir: SortDir
  page: number
  pageSize: number
  pageCache: Record<number, User[]>
}

type Api = {
  setSearch: (v: string) => void
  setSort: (k: SortKey, d: SortDir) => void
  setPage: (p: number) => void
  refetch: () => Promise<void>
  fetchWithError: () => Promise<void>
  fetchWith400Error: () => Promise<void>
}

export function useUsers(initial?: Partial<Pick<State, 'pageSize'>>) {
  const [state, setState] = useState<State>({
    users: [],
    total: 0,
    loading: false,
    error: null,
    search: '',
    sortKey: 'name',
    sortDir: 'asc',
    page: 1,
    pageSize: initial?.pageSize ?? 10,
    pageCache: {},
  })

  const PREFETCH_PAGES = 5

  const fetchList = useCallback(async () => {
    // Prime UI from cache if available; only show loader if current page missing
    setState((s) => ({
      ...s,
      users: s.pageCache[s.page] ?? s.users,
      loading: !s.pageCache[s.page],
      error: null,
    }))

    try {
      // Determine pages to fetch (current and next few), skip already cached
      const pagesToFetch = Array.from({ length: PREFETCH_PAGES }, (_, i) => state.page + i).filter(
        (p) => !(p in state.pageCache) && p > 0,
      )

      if (pagesToFetch.length === 0) {
        // Nothing to fetch; ensure current users are synced from cache
        setState((s) => ({ ...s, users: s.pageCache[s.page] ?? s.users, loading: false }))
        return
      }

      const requests = pagesToFetch.map(async (p) => {
        const skip = (p - 1) * state.pageSize
        return state.search
          ? searchUsers({ q: state.search, limit: state.pageSize, skip }).then((res) => ({ p, res }))
          : fetchUsers({ limit: state.pageSize, skip }).then((res) => ({ p, res }))
      })

      const results = await Promise.all(requests)

      setState((s) => {
        const newCache = { ...s.pageCache }
        let total = s.total
        for (const { p, res } of results) {
          newCache[p] = res.users
          total = res.total
        }
        return {
          ...s,
          pageCache: newCache,
          users: newCache[s.page] ?? s.users,
          total,
          loading: false,
        }
      })
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: e instanceof Error ? e.message : 'Erreur inconnue' }))
    }
  }, [state.page, state.pageSize, state.search, state.pageCache])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const setSearch = useCallback((v: string) => {
    setState((s) => ({ ...s, search: v, page: 1, pageCache: {}, users: [] }))
  }, [])

  const setSort = useCallback((k: SortKey, d: SortDir) => {
    setState((s) => ({ ...s, sortKey: k, sortDir: d }))
  }, [])

  const setPage = useCallback((p: number) => {
    setState((s) => {
      const nextPage = Math.max(1, p)
      return {
        ...s,
        page: nextPage,
        // Immediately switch to cached users if present for smoother animation
        users: s.pageCache[nextPage] ?? s.users,
      }
    })
  }, [])

  const fetchWithError = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    
    try {
      // This endpoint will always fail (404 - non-existent endpoint)
      const response = await fetch('https://dummyjson.com/users/this-endpoint-does-not-exist-404')
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setState((s) => ({ ...s, loading: false, users: data.users || [] }))
    } catch (e) {
      setState((s) => ({ 
        ...s, 
        loading: false, 
        error: e instanceof Error ? e.message : 'Erreur réseau inconnue',
        users: []
      }))
    }
  }, [])

  const fetchWith400Error = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    
    try {
      // Using a valid endpoint but with invalid query parameters to trigger 400
      const response = await fetch('https://dummyjson.com/users?limit=invalid&skip=bad')
      
      if (!response.ok) {
        // Try to get error details from response
        let errorDetails = response.statusText
        try {
          const errorData = await response.json()
          errorDetails = errorData.message || errorData.error || response.statusText
        } catch {
          // If response isn't JSON, use statusText
        }
        throw new Error(`Erreur ${response.status} (Bad Request): ${errorDetails} - Paramètres de requête invalides`)
      }
      
      const data = await response.json()
      setState((s) => ({ ...s, loading: false, users: data.users || [] }))
    } catch (e) {
      setState((s) => ({ 
        ...s, 
        loading: false, 
        error: e instanceof Error ? e.message : 'Erreur 400: Requête invalide',
        users: []
      }))
    }
  }, [])

  const sortedUsers = useMemo(() => {
    const arr = [...state.users]
    arr.sort((a, b) => {
      let va: string | number = ''
      let vb: string | number = ''
      if (state.sortKey === 'name') {
        va = `${a.firstName} ${a.lastName}`.toLowerCase()
        vb = `${b.firstName} ${b.lastName}`.toLowerCase()
      } else {
        va = a.age ?? 0
        vb = b.age ?? 0
      }
      if (va < vb) return state.sortDir === 'asc' ? -1 : 1
      if (va > vb) return state.sortDir === 'asc' ? 1 : -1
      return 0
    })
    return arr
  }, [state.users, state.sortKey, state.sortDir])

  return {
    users: sortedUsers,
    total: state.total,
    loading: state.loading,
    error: state.error,
    search: state.search,
    sortKey: state.sortKey,
    sortDir: state.sortDir,
    page: state.page,
    pageSize: state.pageSize,
    pageCache: state.pageCache,
    setSearch,
    setSort,
    setPage,
    refetch: fetchList,
    fetchWithError,
    fetchWith400Error,
  } satisfies State & Api
}

export function useUser(id?: number | string) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`https://dummyjson.com/users/${id}`)
      if (!res.ok) throw new Error('Utilisateur introuvable')
      const data = (await res.json()) as User
      setUser(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { user, loading, error, refetch }
}


