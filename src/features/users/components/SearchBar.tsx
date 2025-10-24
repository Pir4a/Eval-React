import { memo, useMemo } from 'react'

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

function SearchBarBase({ value, onChange, placeholder = 'Rechercher un utilisateur...' }: Props) {
  const inputClass = useMemo(
    () =>
      'w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm outline-none focus:ring-2 ring-neutral-300 dark:ring-neutral-700',
    []
  )

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">⌘K</span>
    </div>
  )
}

export const SearchBar = memo(SearchBarBase)


