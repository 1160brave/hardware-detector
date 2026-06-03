import { useEffect } from 'react'
import { useSystemStore } from '@/stores/useSystemStore'
import { CardSkeleton } from '@/components/shared/LoadingState'
import { OSInfoCard } from '@/components/hardware/OSInfoCard'
import { CPUInfoCard } from '@/components/hardware/CPUInfoCard'
import { MemoryInfoCard } from '@/components/hardware/MemoryInfoCard'
import { GPUInfoCard } from '@/components/hardware/GPUInfoCard'
import { MotherboardCard } from '@/components/hardware/MotherboardCard'
import { DiskInfoCard } from '@/components/hardware/DiskInfoCard'
import { NetworkInfoCard } from '@/components/hardware/NetworkInfoCard'
import { BatteryInfoCard } from '@/components/hardware/BatteryInfoCard'

export function HardwarePage(): JSX.Element {
  const {
    systemInfo,
    diskLayout,
    diskUsage,
    loadingSystem,
    errorSystem,
    fetchAllSystemInfo,
    fetchAllDiskInfo
  } = useSystemStore()

  useEffect(() => {
    if (!systemInfo) fetchAllSystemInfo()
    if (diskLayout.length === 0) fetchAllDiskInfo()
  }, [])

  if (loadingSystem && !systemInfo) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">硬件详情</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (errorSystem && !systemInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-red-500 mb-4">{errorSystem}</p>
        <button
          onClick={() => { fetchAllSystemInfo(); fetchAllDiskInfo() }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">硬件详情</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <OSInfoCard os={systemInfo?.os ?? null} />
        <CPUInfoCard cpu={systemInfo?.cpu ?? null} />
        <MemoryInfoCard memory={systemInfo?.memory ?? null} />
        <GPUInfoCard gpu={systemInfo?.gpu ?? []} />
        <MotherboardCard motherboard={systemInfo?.motherboard ?? null} />
        <DiskInfoCard diskLayout={diskLayout} diskUsage={diskUsage} />
        <NetworkInfoCard network={systemInfo?.network ?? []} />
        <BatteryInfoCard battery={systemInfo?.battery ?? null} />
      </div>
    </div>
  )
}
