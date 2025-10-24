import { ErrorMessage } from '../shared/molecules/ErrorMessage'
import { Spinner } from '../shared/atoms/Spinner'
import { useUsers } from '../features/users/hooks/useUsers'
import { UserCard } from '../features/users/components/UserCard'
import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

export default function ErrorTest() {
  const { users, loading, error, refetch, fetchWith400Error, total } = useUsers({ pageSize: 5 })
  const hasNotifiedSuccessRef = useRef(false)

  // Notify on error
  useEffect(() => {
    if (error) {
      toast.error(error.includes('400') ? 'Requête invalide (400)' : error.includes('404') ? 'Ressource introuvable (404)' : "Erreur lors du chargement des utilisateurs")
    }
  }, [error])

  // Notify on first successful load
  useEffect(() => {
    if (!loading && !error && users.length > 0 && !hasNotifiedSuccessRef.current) {
      hasNotifiedSuccessRef.current = true
      toast.success('Utilisateurs chargés avec succès')
    }
  }, [loading, error, users])


  const handleForceError400 = () => {
    fetchWith400Error()
  }

  const handleRetry = () => {
    refetch()
    toast.loading('Rechargement...', { id: 'reload' })
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-4">
        <div className="rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-6 text-center">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Test de Gestion d'Erreur
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            Cette page teste la gestion d'erreur avec le hook <code className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-xs">useUsers</code>.
          </p>
          
          <div className="flex gap-2 justify-center flex-wrap">
            <button
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Link to="/pageinexistante">
              Erreur 404</Link>
            </button>
            <button
              onClick={handleForceError400}
              disabled={loading}
              className="inline-flex  cursor-pointer items-center gap-2 rounded-md bg-orange-600 text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Erreur 400
            </button>
            <button
              onClick={refetch}
              disabled={loading}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner />
                  Chargement...
                </>
              ) : (
                'Recharger'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="space-y-3">
            <ErrorMessage
              message={error}
              onRetry={handleRetry}
            />
            <div className="rounded-lg border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 p-4">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                📋 Détails de l'erreur
              </h3>
              <div className="space-y-1 text-xs text-blue-800 dark:text-blue-300">
                <p><strong>Type:</strong> {error.includes('404') ? 'Ressource introuvable (404)' : error.includes('400') ? 'Requête invalide (400)' : 'Erreur réseau'}</p>
                <p><strong>Message:</strong> {error}</p>
                <p className="text-blue-600 dark:text-blue-400 mt-2">
                  {error.includes('404') && '⚠️ L\'endpoint demandé n\'existe pas sur le serveur.'}
                  {error.includes('400') && '⚠️ Les paramètres de la requête sont invalides ou mal formatés.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {!error && !loading && users.length > 0 && (
          <div className="rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Données chargées avec succès
              </h2>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {users.length} / {total} utilisateurs
              </span>
            </div>
            <div className="space-y-2">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {loading && !error && (
          <div className="rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-6 text-center">
            <Spinner />
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              Chargement des utilisateurs...
            </p>
          </div>
        )}

        <div className="rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-4">
          <h2 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            À propos de ce test
          </h2>
          <ul className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1 list-disc list-inside">
            <li>Utilise le hook <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">useUsers</code> pour charger les données réelles</li>
            <li><strong>Erreur 404:</strong> Redirige vers la page inexistante <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">pageinexistante</code></li>
            <li><strong>Erreur 400:</strong> Appelle <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">fetchWith400Error()</code> - paramètres invalides</li>
            <li>Le composant <code className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">ErrorMessage</code> s'affiche avec les détails de l'erreur</li>
            <li>Les états de chargement et de succès sont gérés automatiquement par le hook</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

