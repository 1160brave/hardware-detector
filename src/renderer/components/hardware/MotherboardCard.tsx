import { CircuitBoard } from 'lucide-react'
import { InfoRow } from '@/components/shared/InfoRow'
import type { MotherboardInfo } from '@shared/types'

interface Props {
  motherboard: MotherboardInfo | null
}

export function MotherboardCard({ motherboard }: Props): JSX.Element {
  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <CircuitBoard className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-[var(--text-primary)]">主板</h3>
      </div>
      <div className="space-y-0.5">
        <InfoRow label="制造商" value={motherboard?.manufacturer} />
        <InfoRow label="型号" value={motherboard?.model} />
        <InfoRow label="版本" value={motherboard?.version} />
        <InfoRow label="序列号" value={motherboard?.serial} />
        <InfoRow label="UUID" value={motherboard?.uuid} />
      </div>
      {motherboard && (
        <>
          <h4 className="mt-4 mb-2 text-sm font-medium text-[var(--text-secondary)]">BIOS</h4>
          <div className="space-y-0.5">
            <InfoRow label="厂商" value={motherboard.bios.vendor} />
            <InfoRow label="版本" value={motherboard.bios.version} />
            <InfoRow label="发布日期" value={motherboard.bios.releaseDate} />
          </div>
        </>
      )}
    </div>
  )
}
