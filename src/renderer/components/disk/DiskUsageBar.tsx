import { ProgressBar } from '@/components/shared/ProgressBar'
import { formatBytes } from '@/lib/utils'
import type { DiskUsageInfo } from '@shared/types'

interface Props {
  usage: DiskUsageInfo
}

export function DiskUsageBar({ usage }: Props): JSX.Element {
  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="font-medium text-[var(--text-primary)]">{usage.mount}</span>
          <span className="text-xs text-[var(--text-secondary)] ml-2">({usage.type})</span>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            usage.rw ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}
        >
          {usage.rw ? '读写' : '只读'}
        </span>
      </div>
      <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-2">
        <span>已用: {formatBytes(usage.used)}</span>
        <span>可用: {formatBytes(usage.available)}</span>
      </div>
      <ProgressBar value={usage.use} size="lg" color="disk" showPercent={false} />
      <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
        <span>0</span>
        <span>总容量: {formatBytes(usage.size)}</span>
        <span>100%</span>
      </div>
    </div>
  )
}
