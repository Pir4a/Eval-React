import { memo, useMemo } from 'react'

export type SortKey = 'name' | 'age'
export type SortDir = 'asc' | 'desc'

type Props = {
  sortKey: SortKey
  sortDir: SortDir
  onChange: (key: SortKey, dir: SortDir) => void
}

function SortMenuBase({ sortKey, sortDir, onChange }: Props) {
  const baseClass = useMemo(
    () => 'rounded-md cursor-pointer hover:scale-105 border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-2 py-2 text-sm text-neutral-900 dark:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all',
    []
  )
  return (
    <div className="flex items-center gap-2">
      <select
        value={sortKey}
        onChange={(e) => onChange(e.target.value as SortKey, sortDir)}
        className={baseClass}
      >
        <option value="name">Nom</option>
        <option value="age">Âge</option>
      </select>
      <select
        value={sortDir}
        onChange={(e) => onChange(sortKey, e.target.value as SortDir)}
        className={baseClass}
      >
        <option value="asc">Asc</option>
        <option value="desc">Desc</option>
      </select>
    </div>
  )
}

export const SortMenu = memo(SortMenuBase)


