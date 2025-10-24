type Props = {
  page: number
  pageSize: number
  total: number
  onChange: (page: number) => void
}

export function Pagination({ page, pageSize, total, onChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <button
        disabled={!canPrev}
        onClick={() => onChange(page - 1)}
        className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-1.5 disabled:opacity-50 text-neutral-900 dark:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-sm transition-all disabled:hover:border-neutral-300 disabled:hover:shadow-none"
      >
        Précédent
      </button>
      <span className="text-neutral-500 dark:text-neutral-400">
        Page {page} / {totalPages}
      </span>
      <button
        disabled={!canNext}
        onClick={() => onChange(page + 1)}
        className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-1.5 disabled:opacity-50 text-neutral-900 dark:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-sm transition-all disabled:hover:border-neutral-300 disabled:hover:shadow-none"
      >
        Suivant
      </button>
    </div>
  )
}


