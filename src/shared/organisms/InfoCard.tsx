import { Card, CardTitle } from '../atoms/Card'
import { InfoList } from '../molecules/InfoList'

type Item = { label: string; value?: string | number | null }

export function InfoCard({ title, items }: { title: string; items: Item[] }) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <InfoList items={items} />
    </Card>
  )
}


