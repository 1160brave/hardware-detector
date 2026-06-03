import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  accent?: 'cpu' | 'memory' | 'disk' | 'network' | 'default'
  className?: string
  children?: ReactNode
}

const accentColors = {
  cpu: 'border-l-[#3b82f6] dark:border-l-[#60a5fa]',
  memory: 'border-l-[#8b5cf6] dark:border-l-[#a78bfa]',
  disk: 'border-l-[#10b981] dark:border-l-[#34d399]',
  network: 'border-l-[#f59e0b] dark:border-l-[#fbbf24]',
  default: 'border-l-[#94a3b8] dark:border-l-[#64748b]'
}

const iconBgColors = {
  cpu: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  memory: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  disk: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  network: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  default: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
}

export function StatCard({ title, value, subtitle, icon, accent = 'default', className, children }: StatCardProps): JSX.Element {
  return (
    <div
      className={cn(
        'bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-4 border-l-4',
        accentColors[accent],
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className={cn('p-1.5 rounded-lg', iconBgColors[accent])}>
            {icon}
          </div>
        )}
      </div>
      <div className="text-xl font-bold text-[var(--text-primary)]">{value}</div>
      {subtitle && (
        <div className="text-xs text-[var(--text-secondary)] mt-1">{subtitle}</div>
      )}
      {children}
    </div>
  )
}
