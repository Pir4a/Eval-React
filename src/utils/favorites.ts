const STORAGE_KEY = 'favorites:users'

export function loadFavoriteIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as number[]) : []
  } catch {
    return []
  }
}

export function saveFavoriteIds(ids: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // ignore quota or privacy errors
  }
}

export function isFavorite(id: number): boolean {
  const ids = loadFavoriteIds()
  return ids.includes(id)
}

export function toggleFavorite(id: number): boolean {
  const ids = new Set(loadFavoriteIds())
  if (ids.has(id)) {
    ids.delete(id)
  } else {
    ids.add(id)
  }
  const arr = Array.from(ids)
  saveFavoriteIds(arr)
  return arr.includes(id)
}


