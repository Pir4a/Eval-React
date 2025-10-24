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
    () => 'rounded-md cursor-pointer hover:scale-105 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-2 text-sm',
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


