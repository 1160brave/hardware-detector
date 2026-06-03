import { Wifi, Globe } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { InfoRow } from '@/components/shared/InfoRow'
import { EmptyState } from '@/components/shared/EmptyState'
import type { NetworkInterfaceInfo } from '@shared/types'

interface Props {
  network: NetworkInterfaceInfo[]
  mini?: boolean
}

export function NetworkInfoCard({ network, mini }: Props): JSX.Element {
  const activeInterface = network.find(
    (n) => n.ip4 && !n.internal && n.operstate === 'up'
  ) || network.find((n) => n.operstate === 'up')

  if (mini) {
    return (
      <StatCard
        title="网络"
        value={activeInterface?.ip4 || '—'}
        subtitle={activeInterface ? `${activeInterface.ifaceName || activeInterface.iface} · ${activeInterface.mac}` : ''}
        icon={<Wifi className="w-4 h-4" />}
        accent="network"
      />
    )
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold text-[var(--text-primary)]">网络接口</h3>
      </div>
      {network.length === 0 ? (
        <EmptyState message="未检测到网络接口" />
      ) : (
        <div className="space-y-3">
          {network.map((net, i) => (
            <div key={i} className="p-3 rounded-lg bg-[var(--content-bg)] space-y-0.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {net.ifaceName || net.iface}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    net.operstate === 'up'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {net.operstate === 'up' ? '已连接' : '未连接'}
                </span>
              </div>
              <InfoRow label="IP 地址" value={net.ip4 || '—'} />
              <InfoRow label="MAC 地址" value={net.mac} />
              <InfoRow label="类型" value={net.type} />
              <InfoRow label="速度" value={net.speed ? `${net.speed} Mbps` : '—'} />
              <InfoRow label="IPv6" value={net.ip6 || '—'} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
