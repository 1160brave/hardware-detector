import { useEffect } from 'react'
import { HardDrive } from 'lucide-react'
import { useSystemStore } from '@/stores/useSystemStore'
import { CardSkeleton } from '@/components/shared/LoadingState'
import { DiskUsageBar } from '@/components/disk/DiskUsageBar'
import { PartitionTable } from '@/components/disk/PartitionTable'

export function DiskOverviewPage(): JSX.Element {
  const {
    diskLayout,
    diskUsage,
    blockDevices,
    loadingDisk,
    errorDisk,
    fetchAllDiskInfo
  } = useSystemStore()

  useEffect(() => {
    if (diskLayout.length === 0 && diskUsage.length === 0) {
      fetchAllDiskInfo()
    }
  }, [])

  if (loadingDisk && diskUsage.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">磁盘信息</h2>
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (errorDisk) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-red-500 mb-4">{errorDisk}</p>
        <button
          onClick={fetchAllDiskInfo}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
        >
          重试
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">磁盘信息</h2>

      {/* Disk Usage Bars */}
      <section className="mb-8">
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
          <HardDrive className="w-4 h-4" />
          挂载点使用情况
        </h3>
        <div className="space-y-3">
          {diskUsage.map((usage) => (
            <DiskUsageBar key={usage.mount} usage={usage} />
          ))}
        </div>
      </section>

      {/* Partition Table */}
      <section className="mb-8">
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">分区列表</h3>
        <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-4">
          <PartitionTable devices={blockDevices} />
        </div>
      </section>

      {/* Physical Disks */}
      {diskLayout.length > 0 && (
        <section>
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">物理磁盘</h3>
          <div className="space-y-3">
            {diskLayout.map((disk) => (
              <div
                key={disk.device}
                className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-[var(--text-secondary)]">名称:</span>{' '}
                    <span className="font-medium text-[var(--text-primary)]">{disk.name}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">类型:</span>{' '}
                    <span className="font-medium text-[var(--text-primary)]">{disk.type} ({disk.interfaceType})</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">序列号:</span>{' '}
                    <span className="font-medium text-[var(--text-primary)]">{disk.serialNum || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">S.M.A.R.T:</span>{' '}
                    <span className={`font-medium ${disk.smartStatus === 'Ok' ? 'text-emerald-500' : disk.smartStatus === 'Pred Fail' ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>
                      {disk.smartStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
