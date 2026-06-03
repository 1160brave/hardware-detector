import { Monitor } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { InfoRow } from '@/components/shared/InfoRow'
import type { OSInfo } from '@shared/types'

interface Props {
  os: OSInfo | null
  mini?: boolean
}

export function OSInfoCard({ os, mini }: Props): JSX.Element {
  const value = os ? `${os.distro} ${os.release}` : '—'

  if (mini) {
    return (
      <StatCard
        title="操作系统"
        value={os?.distro || '—'}
        subtitle={os ? `${os.release} (${os.arch})` : ''}
        icon={<Monitor className="w-4 h-4" />}
        accent="default"
      />
    )
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Monitor className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-[var(--text-primary)]">操作系统</h3>
      </div>
      <div className="space-y-0.5">
        <InfoRow label="系统" value={os?.distro} />
        <InfoRow label="版本" value={os?.release} />
        <InfoRow label="内核" value={os?.kernel} />
        <InfoRow label="架构" value={os?.arch} />
        <InfoRow label="主机名" value={os?.hostname} />
        <InfoRow label="UEFI" value={os?.uefi ? '是' : '否'} />
      </div>
    </div>
  )
}
