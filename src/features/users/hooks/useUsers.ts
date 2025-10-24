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
}

type Api = {
  setSearch: (v: string) => void
  setSort: (k: SortKey, d: SortDir) => void
  setPage: (p: number) => void
  refetch: () => Promise<void>
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
  })

  const fetchList = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const skip = (state.page - 1) * state.pageSize
      const data = state.search
        ? await searchUsers({ q: state.search, limit: state.pageSize, skip })
        : await fetchUsers({ limit: state.pageSize, skip })
      setState((s) => ({ ...s, users: data.users, total: data.total, loading: false }))
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: e instanceof Error ? e.message : 'Erreur inconnue' }))
    }
  }, [state.page, state.pageSize, state.search])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const setSearch = useCallback((v: string) => {
    setState((s) => ({ ...s, search: v, page: 1 }))
  }, [])

  const setSort = useCallback((k: SortKey, d: SortDir) => {
    setState((s) => ({ ...s, sortKey: k, sortDir: d }))
  }, [])

  const setPage = useCallback((p: number) => {
    setState((s) => ({ ...s, page: Math.max(1, p) }))
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
    setSearch,
    setSort,
    setPage,
    refetch: fetchList,
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


