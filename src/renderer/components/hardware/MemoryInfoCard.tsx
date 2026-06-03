import { MemoryStick } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { InfoRow } from '@/components/shared/InfoRow'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { formatBytes } from '@/lib/utils'
import type { MemoryInfo } from '@shared/types'

interface Props {
  memory: MemoryInfo | null
  usagePercent?: number
  mini?: boolean
}

export function MemoryInfoCard({ memory, usagePercent, mini }: Props): JSX.Element {
  if (mini) {
    const percent = usagePercent ?? (memory ? (memory.used / memory.total) * 100 : 0)
    return (
      <StatCard
        title="内存"
        value={memory ? formatBytes(memory.used) + ' / ' + formatBytes(memory.total) : '—'}
        subtitle={memory ? `${formatBytes(memory.available)} 可用` : ''}
        icon={<MemoryStick className="w-4 h-4" />}
        accent="memory"
      >
        <ProgressBar value={percent} color="memory" size="sm" className="mt-3" />
      </StatCard>
    )
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <MemoryStick className="w-5 h-5 text-purple-500" />
        <h3 className="font-semibold text-[var(--text-primary)]">内存</h3>
      </div>
      <div className="space-y-0.5">
        <InfoRow label="总容量" value={memory ? formatBytes(memory.total) : '—'} />
        <InfoRow label="已用" value={memory ? formatBytes(memory.used) : '—'} />
        <InfoRow label="可用" value={memory ? formatBytes(memory.available) : '—'} />
        <InfoRow label="空闲" value={memory ? formatBytes(memory.free) : '—'} />
        <InfoRow label="活跃" value={memory ? formatBytes(memory.active) : '—'} />
        <InfoRow label="Swap 总量" value={memory ? formatBytes(memory.swapTotal) : '—'} />
        <InfoRow label="Swap 已用" value={memory ? formatBytes(memory.swapUsed) : '—'} />
      </div>
      {memory && (
        <div className="mt-4">
          <ProgressBar
            value={(memory.used / memory.total) * 100}
            color="memory"
            label="使用率"
            size="md"
          />
        </div>
      )}
    </div>
  )
}
