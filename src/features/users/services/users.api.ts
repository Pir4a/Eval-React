import { apiFetch } from './api'
import type { User } from '../types/User'

export type UsersResponse = { users: User[]; total: number; skip: number; limit: number }

export function fetchUsers(params?: { limit?: number; skip?: number }) {
  const q = new URLSearchParams()
  if (params?.limit != null) q.set('limit', String(params.limit))
  if (params?.skip != null) q.set('skip', String(params.skip))
  const query = q.toString()
  return apiFetch<UsersResponse>(`/users${query ? `?${query}` : ''}`)
}

export function searchUsers(params: { q: string; limit?: number; skip?: number }) {
  const q = new URLSearchParams({ q: params.q })
  if (params.limit != null) q.set('limit', String(params.limit))
  if (params.skip != null) q.set('skip', String(params.skip))
  return apiFetch<UsersResponse>(`/users/search?${q.toString()}`)
}

export function fetchUser(id: number | string) {
  return apiFetch<User>(`/users/${id}`)
}


