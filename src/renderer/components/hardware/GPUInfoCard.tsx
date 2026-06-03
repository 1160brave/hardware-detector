import { MonitorPlay } from 'lucide-react'
import { InfoRow } from '@/components/shared/InfoRow'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatBytes } from '@/lib/utils'
import type { GPUInfo } from '@shared/types'

interface Props {
  gpu: GPUInfo[]
}

export function GPUInfoCard({ gpu }: Props): JSX.Element {
  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <MonitorPlay className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-[var(--text-primary)]">显卡</h3>
      </div>
      {gpu.length === 0 ? (
        <EmptyState message="未检测到显卡信息" />
      ) : (
        <div className="space-y-4">
          {gpu.map((g, i) => (
            <div key={i} className="p-3 rounded-lg bg-[var(--content-bg)] space-y-0.5">
              <InfoRow label="型号" value={g.model} />
              <InfoRow label="厂商" value={g.vendor} />
              <InfoRow label="总线" value={g.bus} />
              <InfoRow label="显存" value={g.vram ? formatBytes(g.vram * 1024 * 1024) : '共享内存'} />
              <InfoRow label="动态显存" value={g.vramDynamic ? '是' : '否'} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
