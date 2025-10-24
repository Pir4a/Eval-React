type Item = { label: string; value?: string | number | null }

export function InfoList({ items }: { items: Item[] }) {
  return (
    <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
      {items.map((it, idx) => (
        <li key={idx}>
          <span className="text-neutral-500 dark:text-neutral-400">{it.label}: </span>
          <span>{it.value ?? '—'}</span>
        </li>
      ))}
    </ul>
  )
}


