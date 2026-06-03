import { Cpu } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { InfoRow } from '@/components/shared/InfoRow'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { formatSpeed } from '@/lib/utils'
import type { CPUInfo } from '@shared/types'

interface Props {
  cpu: CPUInfo | null
  usage?: number
  mini?: boolean
}

export function CPUInfoCard({ cpu, usage, mini }: Props): JSX.Element {
  if (mini) {
    return (
      <StatCard
        title="处理器"
        value={cpu?.brand || '—'}
        subtitle={cpu ? `${cpu.cores}核 / ${cpu.processors}线程 · ${formatSpeed(cpu.speed)}` : ''}
        icon={<Cpu className="w-4 h-4" />}
        accent="cpu"
      >
        {usage !== undefined && (
          <ProgressBar value={usage} color="cpu" size="sm" className="mt-3" />
        )}
      </StatCard>
    )
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-[var(--text-primary)]">处理器</h3>
      </div>
      <div className="space-y-0.5">
        <InfoRow label="型号" value={cpu?.brand} />
        <InfoRow label="制造商" value={cpu?.manufacturer} />
        <InfoRow label="频率" value={cpu ? formatSpeed(cpu.speed) : '—'} />
        <InfoRow label="最低/最高频率" value={cpu ? `${formatSpeed(cpu.speedMin)} / ${formatSpeed(cpu.speedMax)}` : '—'} />
        <InfoRow label="物理核心" value={cpu?.physicalCores} />
        {cpu && cpu.performanceCores > 0 && (
          <InfoRow label="性能/能效核心" value={`${cpu.performanceCores} / ${cpu.efficiencyCores}`} />
        )}
        <InfoRow label="逻辑核心" value={cpu?.cores} />
        <InfoRow label="线程" value={cpu?.processors} />
        <InfoRow label="插槽" value={cpu?.socket} />
        <InfoRow label="虚拟化" value={cpu?.virtualization ? '支持' : '不支持'} />
        <InfoRow
          label="L1/L2/L3 缓存"
          value={cpu ? `${cpu.cache.l1d}B / ${(cpu.cache.l2 / 1024 / 1024).toFixed(1)}MB / ${(cpu.cache.l3 / 1024 / 1024).toFixed(1)}MB` : '—'}
        />
      </div>
      {usage !== undefined && (
        <div className="mt-4">
          <ProgressBar value={usage} color="cpu" label="当前使用率" size="md" />
        </div>
      )}
    </div>
  )
}
