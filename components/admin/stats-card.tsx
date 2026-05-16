import { Card, CardContent } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'

type StatsCardProps = {
  title: string
  value: number | string
  icon: LucideIcon
  description?: string
  variant?: 'default' | 'primary' | 'secondary' | 'accent'
}

const variantStyles = {
  default:   'text-foreground',
  primary:   'text-primary',
  secondary: 'text-secondary',
  accent:    'text-accent',
}

export function StatsCard({ title, value, icon: Icon, description, variant = 'default' }: StatsCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`mt-1 text-3xl font-bold ${variantStyles[variant]}`}>{value}</p>
            {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
          </div>
          <div className={`rounded-full p-2 bg-muted ${variantStyles[variant]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
