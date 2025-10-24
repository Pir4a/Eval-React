import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-6 text-center shadow-md">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Page introuvable</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">404 - La ressource demandée n'existe pas.</p>
        <Link to="/" className="inline-flex items-center gap-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 text-sm font-medium hover:opacity-90 transition">
          Revenir à l'accueil
        </Link>
      </div>
    </div>
  )
}


