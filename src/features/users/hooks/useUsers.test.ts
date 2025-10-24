import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useUsers, useUser } from './useUsers'
import type { User } from '../types/User'

// Mock the API services
vi.mock('../services/users.api', () => ({
  fetchUsers: vi.fn(),
  searchUsers: vi.fn(),
}))

import { fetchUsers, searchUsers } from '../services/users.api'

const mockUsers: User[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    age: 30,
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    age: 25,
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob@example.com',
    age: 35,
  },
]

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default state', async () => {
    vi.mocked(fetchUsers).mockResolvedValue({
      users: [],
      total: 0,
      skip: 0,
      limit: 10,
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.users).toEqual([])
    expect(result.current.total).toBe(0)
    expect(result.current.error).toBeNull()
    expect(result.current.search).toBe('')
    expect(result.current.sortKey).toBe('name')
    expect(result.current.sortDir).toBe('asc')
    expect(result.current.page).toBe(1)
    expect(result.current.pageSize).toBe(10)
  })

  it('should accept initial pageSize', () => {
    const { result } = renderHook(() => useUsers({ pageSize: 20 }))

    expect(result.current.pageSize).toBe(20)
  })

  it('should fetch users on mount', async () => {
    vi.mocked(fetchUsers).mockResolvedValue({
      users: mockUsers,
      total: 3,
      skip: 0,
      limit: 10,
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(fetchUsers).toHaveBeenCalled()
    expect(result.current.users).toHaveLength(3)
    expect(result.current.total).toBe(3)
  })

  it('should handle fetch errors', async () => {
    vi.mocked(fetchUsers).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.error).toBe('Network error')
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.users).toEqual([])
  })

  it('should sort users by name ascending', async () => {
    vi.mocked(fetchUsers).mockResolvedValue({
      users: mockUsers,
      total: 3,
      skip: 0,
      limit: 10,
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.users).toHaveLength(3)
    })

    // Default sort is by name asc
    expect(result.current.users[0].firstName).toBe('Bob')
    expect(result.current.users[1].firstName).toBe('Jane')
    expect(result.current.users[2].firstName).toBe('John')
  })

  it('should sort users by name descending', async () => {
    vi.mocked(fetchUsers).mockResolvedValue({
      users: mockUsers,
      total: 3,
      skip: 0,
      limit: 10,
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.users).toHaveLength(3)
    })

    result.current.setSort('name', 'desc')

    await waitFor(() => {
      expect(result.current.users[0].firstName).toBe('John')
      expect(result.current.users[1].firstName).toBe('Jane')
      expect(result.current.users[2].firstName).toBe('Bob')
    })
  })

  it('should sort users by age ascending', async () => {
    vi.mocked(fetchUsers).mockResolvedValue({
      users: mockUsers,
      total: 3,
      skip: 0,
      limit: 10,
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.users).toHaveLength(3)
    })

    result.current.setSort('age', 'asc')

    await waitFor(() => {
      expect(result.current.users[0].age).toBe(25)
      expect(result.current.users[1].age).toBe(30)
      expect(result.current.users[2].age).toBe(35)
    })
  })

  it('should sort users by age descending', async () => {
    vi.mocked(fetchUsers).mockResolvedValue({
      users: mockUsers,
      total: 3,
      skip: 0,
      limit: 10,
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.users).toHaveLength(3)
    })

    result.current.setSort('age', 'desc')

    await waitFor(() => {
      expect(result.current.users[0].age).toBe(35)
      expect(result.current.users[1].age).toBe(30)
      expect(result.current.users[2].age).toBe(25)
    })
  })

  it('should handle search', async () => {
    vi.mocked(searchUsers).mockResolvedValue({
      users: [mockUsers[0]],
      total: 1,
      skip: 0,
      limit: 10,
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    result.current.setSearch('John')

    await waitFor(() => {
      expect(searchUsers).toHaveBeenCalledWith({
        q: 'John',
        limit: 10,
        skip: 0,
      })
    })

    await waitFor(() => {
      expect(result.current.search).toBe('John')
    })
  })

  it('should reset page and cache when searching', async () => {
    vi.mocked(fetchUsers).mockResolvedValue({
      users: mockUsers,
      total: 3,
      skip: 0,
      limit: 10,
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.users).toHaveLength(3)
    })

    result.current.setPage(2)

    await waitFor(() => {
      expect(result.current.page).toBe(2)
    })

    vi.mocked(searchUsers).mockResolvedValue({
      users: [mockUsers[0]],
      total: 1,
      skip: 0,
      limit: 10,
    })

    result.current.setSearch('John')

    await waitFor(() => {
      expect(result.current.page).toBe(1)
    })
  })

  it('should change page', async () => {
    vi.mocked(fetchUsers).mockResolvedValue({
      users: mockUsers,
      total: 30,
      skip: 0,
      limit: 10,
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.users).toHaveLength(3)
    })

    result.current.setPage(2)

    await waitFor(() => {
      expect(result.current.page).toBe(2)
    })
  })

  it('should cache pages', async () => {
    vi.mocked(fetchUsers).mockResolvedValue({
      users: mockUsers,
      total: 30,
      skip: 0,
      limit: 10,
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.pageCache[1]).toBeDefined()
    })

    expect(Object.keys(result.current.pageCache).length).toBeGreaterThan(0)
  })

  it('should prefetch pages in background', async () => {
    vi.mocked(fetchUsers).mockResolvedValue({
      users: mockUsers,
      total: 30,
      skip: 0,
      limit: 10,
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    vi.mocked(fetchUsers).mockResolvedValue({
      users: [mockUsers[0]],
      total: 30,
      skip: 20,
      limit: 10,
    })

    await result.current.prefetchPages([3, 4])

    await waitFor(() => {
      expect(fetchUsers).toHaveBeenCalledWith({
        limit: 10,
        skip: 20,
      })
    })
  })

  it('should not prefetch already cached pages', async () => {
    vi.mocked(fetchUsers).mockResolvedValue({
      users: mockUsers,
      total: 30,
      skip: 0,
      limit: 10,
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.pageCache[1]).toBeDefined()
    })

    const callCount = vi.mocked(fetchUsers).mock.calls.length

    await result.current.prefetchPages([1])

    // Should not make additional calls since page 1 is already cached
    expect(vi.mocked(fetchUsers).mock.calls.length).toBe(callCount)
  })

  it('should refetch data', async () => {
    vi.mocked(fetchUsers).mockResolvedValue({
      users: mockUsers,
      total: 3,
      skip: 0,
      limit: 10,
    })

    const { result } = renderHook(() => useUsers())

    await waitFor(() => {
      expect(result.current.users).toHaveLength(3)
    })

    // Verify refetch is callable and doesn't throw
    await expect(result.current.refetch()).resolves.not.toThrow()
  })
})

describe('useUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // @ts-expect-error - mocking global fetch
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useUser())

    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should fetch user by id', async () => {
    const mockUser = mockUsers[0]
    // @ts-expect-error - mocking global fetch
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    } as Response)

    const { result } = renderHook(() => useUser(1))

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle user not found', async () => {
    // @ts-expect-error - mocking global fetch
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response)

    const { result } = renderHook(() => useUser(999))

    await waitFor(() => {
      expect(result.current.error).toBe('Utilisateur introuvable')
    })

    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('should not fetch if id is undefined', () => {
    const { result } = renderHook(() => useUser())

    // @ts-expect-error - mocking global fetch
    expect(global.fetch).not.toHaveBeenCalled()
    expect(result.current.user).toBeNull()
  })

  it('should refetch user', async () => {
    const mockUser = mockUsers[0]
    // @ts-expect-error - mocking global fetch
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    } as Response)

    const { result } = renderHook(() => useUser(1))

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser)
    })

    // @ts-expect-error - mocking global fetch
    const callCount = vi.mocked(global.fetch).mock.calls.length

    await result.current.refetch()

    // @ts-expect-error - mocking global fetch
    expect(vi.mocked(global.fetch).mock.calls.length).toBeGreaterThan(callCount)
  })
})

