import { cn } from '@/lib/utils'

interface InfoRowProps {
  label: string
  value: string | number | null | undefined
  className?: string
}

export function InfoRow({ label, value, className }: InfoRowProps): JSX.Element {
  return (
    <div className={cn('flex justify-between items-center py-1.5', className)}>
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <span className="text-sm font-medium text-[var(--text-primary)] text-right">
        {value ?? '—'}
      </span>
    </div>
  )
}
