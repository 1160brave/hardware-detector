import { HardDrive } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { InfoRow } from '@/components/shared/InfoRow'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatBytes } from '@/lib/utils'
import type { DiskLayoutInfo, DiskUsageInfo } from '@shared/types'

interface Props {
  diskLayout: DiskLayoutInfo[]
  diskUsage: DiskUsageInfo[]
  mini?: boolean
}

export function DiskInfoCard({ diskLayout, diskUsage, mini }: Props): JSX.Element {
  const totalSize = diskUsage.reduce((sum, d) => sum + d.size, 0)
  const totalUsed = diskUsage.reduce((sum, d) => sum + d.used, 0)
  const usagePercent = totalSize > 0 ? (totalUsed / totalSize) * 100 : 0
  const mainDisk = diskLayout[0]
  const mainUsage = diskUsage.find((d) => d.mount === '/')

  if (mini) {
    return (
      <StatCard
        title="磁盘"
        value={mainUsage ? formatBytes(mainUsage.used) + ' / ' + formatBytes(mainUsage.size) : '—'}
        subtitle={mainDisk ? `${mainDisk.name} · ${mainDisk.type}` : ''}
        icon={<HardDrive className="w-4 h-4" />}
        accent="disk"
      >
        <ProgressBar value={usagePercent} color="disk" size="sm" className="mt-3" />
      </StatCard>
    )
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <HardDrive className="w-5 h-5 text-emerald-500" />
        <h3 className="font-semibold text-[var(--text-primary)]">磁盘</h3>
      </div>
      {diskLayout.length === 0 ? (
        <EmptyState message="未检测到磁盘信息" />
      ) : (
        <div className="space-y-4">
          {diskLayout.map((disk, i) => (
            <div key={i} className="p-3 rounded-lg bg-[var(--content-bg)] space-y-0.5">
              <InfoRow label="名称" value={disk.name} />
              <InfoRow label="型号" value={disk.vendor} />
              <InfoRow label="类型" value={disk.type === 'SSD' ? '固态硬盘 (SSD)' : '机械硬盘 (HDD)'} />
              <InfoRow label="容量" value={formatBytes(disk.size)} />
              <InfoRow label="接口" value={disk.interfaceType} />
              <InfoRow label="序列号" value={disk.serialNum} />
              <InfoRow label="S.M.A.R.T" value={disk.smartStatus} />
              {disk.temperature !== null && disk.temperature !== undefined && (
                <InfoRow label="温度" value={`${disk.temperature}°C`} />
              )}
            </div>
          ))}
        </div>
      )}
      {diskUsage.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-medium text-[var(--text-secondary)]">挂载点</h4>
          {diskUsage.map((fs, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">{fs.mount}</span>
                <span className="text-[var(--text-secondary)]">
                  {formatBytes(fs.used)} / {formatBytes(fs.size)}
                </span>
              </div>
              <ProgressBar value={fs.use} size="sm" color="disk" showPercent={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
