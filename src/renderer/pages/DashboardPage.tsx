import { useEffect } from 'react'
import { useSystemStore } from '@/stores/useSystemStore'
import { useRealtimeStore } from '@/stores/useRealtimeStore'
import { CardSkeleton } from '@/components/shared/LoadingState'
import { OSInfoCard } from '@/components/hardware/OSInfoCard'
import { CPUInfoCard } from '@/components/hardware/CPUInfoCard'
import { MemoryInfoCard } from '@/components/hardware/MemoryInfoCard'
import { DiskInfoCard } from '@/components/hardware/DiskInfoCard'
import { NetworkInfoCard } from '@/components/hardware/NetworkInfoCard'
import { BatteryInfoCard } from '@/components/hardware/BatteryInfoCard'

export function DashboardPage(): JSX.Element {
  const {
    systemInfo,
    diskLayout,
    diskUsage,
    loadingSystem,
    errorSystem,
    fetchAllSystemInfo,
    fetchAllDiskInfo
  } = useSystemStore()

  const { latest, start, stop } = useRealtimeStore()

  useEffect(() => {
    fetchAllSystemInfo()
    fetchAllDiskInfo()
    start()

    return () => {
      stop()
    }
  }, [])

  if (loadingSystem) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">仪表盘</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">仪表盘</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <OSInfoCard os={systemInfo?.os ?? null} mini />
        <CPUInfoCard
          cpu={systemInfo?.cpu ?? null}
          usage={latest?.cpu.total}
          mini
        />
        <MemoryInfoCard
          memory={systemInfo?.memory ?? null}
          usagePercent={latest?.memory.usedPercent}
          mini
        />
        <DiskInfoCard diskLayout={diskLayout} diskUsage={diskUsage} mini />
        <NetworkInfoCard network={systemInfo?.network ?? []} mini />
        <BatteryInfoCard battery={systemInfo?.battery ?? null} mini />
      </div>
    </div>
  )
}
