import { cn } from '@/lib/utils'

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ message = '加载中...', className }: LoadingStateProps): JSX.Element {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <div className="w-8 h-8 border-2 border-[var(--border-color)] border-t-blue-500 rounded-full animate-spin" />
      <p className="mt-3 text-sm text-[var(--text-secondary)]">{message}</p>
    </div>
  )
}

export function CardSkeleton(): JSX.Element {
  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-4 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-3 w-16 bg-[var(--border-color)] rounded" />
        <div className="h-8 w-8 bg-[var(--border-color)] rounded-lg" />
      </div>
      <div className="h-6 w-32 bg-[var(--border-color)] rounded mb-2" />
      <div className="h-3 w-24 bg-[var(--border-color)] rounded" />
    </div>
  )
}
