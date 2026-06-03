import { Battery, BatteryCharging } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { InfoRow } from '@/components/shared/InfoRow'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { EmptyState } from '@/components/shared/EmptyState'
import type { BatteryInfo } from '@shared/types'

interface Props {
  battery: BatteryInfo | null
  mini?: boolean
}

export function BatteryInfoCard({ battery, mini }: Props): JSX.Element {
  if (!battery) {
    if (mini) return <></>
    return (
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Battery className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-[var(--text-primary)]">电池</h3>
        </div>
        <EmptyState message="当前为台式机或无电池设备" />
      </div>
    )
  }

  if (mini) {
    return (
      <StatCard
        title="电池"
        value={`${battery.percent}%`}
        subtitle={battery.isCharging ? '充电中' : '使用中'}
        icon={
          battery.isCharging ? (
            <BatteryCharging className="w-4 h-4" />
          ) : (
            <Battery className="w-4 h-4" />
          )
        }
        accent="network"
      >
        <ProgressBar value={battery.percent} size="sm" color={battery.percent < 20 ? 'danger' : 'network'} className="mt-3" />
      </StatCard>
    )
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
      <div className="flex items-center gap-2 mb-4">
        {battery.isCharging ? (
          <BatteryCharging className="w-5 h-5 text-amber-500" />
        ) : (
          <Battery className="w-5 h-5 text-amber-500" />
        )}
        <h3 className="font-semibold text-[var(--text-primary)]">电池</h3>
      </div>
      <div className="space-y-0.5">
        <InfoRow label="型号" value={battery.model} />
        <InfoRow label="制造商" value={battery.manufacturer} />
        <InfoRow label="类型" value={battery.type} />
        <InfoRow label="当前电量" value={`${battery.percent}%`} />
        <InfoRow label="状态" value={battery.isCharging ? '充电中' : '使用中'} />
        <InfoRow label="循环次数" value={battery.cycleCount} />
        <InfoRow label="设计容量" value={`${battery.designedCapacity} ${battery.capacityUnit}`} />
        <InfoRow label="最大容量" value={`${battery.maxCapacity} ${battery.capacityUnit}`} />
        <InfoRow label="当前容量" value={`${battery.currentCapacity} ${battery.capacityUnit}`} />
        <InfoRow label="电压" value={`${battery.voltage}V`} />
      </div>
      <div className="mt-4">
        <ProgressBar value={battery.percent} size="md" color={battery.percent < 20 ? 'danger' : 'network'} />
      </div>
    </div>
  )
}
