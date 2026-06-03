import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  label?: string
  showPercent?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'success' | 'warning' | 'danger' | 'cpu' | 'memory' | 'disk' | 'network'
  className?: string
}

const colorMap = {
  default: 'bg-slate-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  cpu: 'bg-blue-500',
  memory: 'bg-purple-500',
  disk: 'bg-emerald-500',
  network: 'bg-amber-500'
}

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4'
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  size = 'md',
  color = 'default',
  className
}: ProgressBarProps): JSX.Element {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100)
  const dynamicColor =
    percent >= 90 ? 'bg-red-500' : percent >= 70 ? 'bg-amber-500' : colorMap[color]

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-[var(--text-secondary)]">{label}</span>}
          {showPercent && (
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              {percent.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-[var(--border-color)] rounded-full overflow-hidden', sizeMap[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', dynamicColor)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
