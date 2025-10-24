import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spinner } from '../../../components/ui/Spinner'
import { ErrorMessage } from '../../../components/ui/ErrorMessage'
import type { User } from '../types/User'

export default function UserDetail() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    const run = async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`https://dummyjson.com/users/${id}`)
        if (!res.ok) throw new Error('Utilisateur introuvable')
        const data = (await res.json()) as User
        if (!ignore) setUser(data)
      } catch (e) {
        if (!ignore) setError(e instanceof Error ? e.message : 'Erreur inconnue')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    run()
    return () => {
      ignore = true
    }
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
        <Spinner /> Chargement...
      </div>
    )
  }
  if (error) return <div className="mx-auto max-w-3xl px-4 py-6"><ErrorMessage message={error} /></div>
  if (!user) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-start gap-4">
        <img
          src={user.image || `https://api.dicebear.com/9.x/initials/svg?seed=${user.firstName}+${user.lastName}`}
          alt={`${user.firstName} ${user.lastName}`}
          className="h-16 w-16 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
        />
        <div>
          <h1 className="text-2xl font-semibold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <h2 className="font-medium mb-2">Informations</h2>
          <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
            <li>Âge: {user.age ?? '—'}</li>
            <li>Société: {user.company?.name ?? '—'}</li>
            <li>Ville: {user.address?.city ?? '—'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}


