type Props = {
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ message = "Une erreur s'est produite.", onRetry, className = '' }: Props) {
  return (
    <div className={`rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-4 text-red-800 dark:text-red-200 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="inline-flex items-center rounded-md bg-red-600 text-white px-3 py-1.5 text-xs font-medium shadow hover:opacity-90 transition">
            Réessayer
          </button>
        )}
      </div>
    </div>
  )
}


