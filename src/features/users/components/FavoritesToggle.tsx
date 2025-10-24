import { useEffect, useState } from 'react'
import { isFavorite, toggleFavorite } from '../../../utils/favorites'

export function FavoritesToggle({ userId }: { userId: number }) {
  const [fav, setFav] = useState<boolean>(false)

  useEffect(() => {
    setFav(isFavorite(userId))
  }, [userId])

  const onToggle = () => {
    const nowFav = toggleFavorite(userId)
    setFav(nowFav)
    try {
      // include id and state for potential listeners
      window.dispatchEvent(new CustomEvent('favorites:changed', { detail: { userId, fav: nowFav } }))
    } catch {
      // ignore
    }
  }

  return (
    <button
      onClick={onToggle}
      aria-pressed={fav}
      title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
    >
      {fav ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 text-yellow-500">
          <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.6a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.727-2.885a.563.563 0 0 0-.586 0L6.98 20.537a.562.562 0 0 1-.84-.61l1.285-5.385a.563.563 0 0 0-.182-.557l-4.204-3.6a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345l2.125-5.111Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5 text-neutral-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.48 3.499 2.125 5.111a1.125 1.125 0 0 0 .95.69l5.518.442c.998.08 1.404 1.327.642 1.976l-4.204 3.6a1.125 1.125 0 0 0-.364 1.114l1.285 5.385c.233.976-.852 1.72-1.71 1.21l-4.727-2.885a1.125 1.125 0 0 0-1.173 0L6.98 20.537c-.858.51-1.943-.234-1.71-1.21l1.285-5.385a1.125 1.125 0 0 0-.364-1.114l-4.204-3.6c-.762-.649-.356-1.896.642-1.976l5.518-.442a1.125 1.125 0 0 0 .95-.69l2.125-5.111Z" />
        </svg>
      )}
    </button>
  )
}


