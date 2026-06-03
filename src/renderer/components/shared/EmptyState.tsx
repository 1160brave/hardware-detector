import { cn } from '@/lib/utils'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  message?: string
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({
  message = '暂无数据',
  icon = <Inbox className="w-10 h-10" />,
  className
}: EmptyStateProps): JSX.Element {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-[var(--text-secondary)]', className)}>
      {icon}
      <p className="mt-3 text-sm">{message}</p>
    </div>
  )
}
