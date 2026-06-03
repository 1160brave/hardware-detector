import { useEffect } from 'react'
import { Cpu, MemoryStick, Activity } from 'lucide-react'
import { useRealtimeStore } from '@/stores/useRealtimeStore'
import { CPUChart } from '@/components/realtime/CPUChart'
import { MemoryChart } from '@/components/realtime/MemoryChart'
import { DiskIOChart } from '@/components/realtime/DiskIOChart'
import { NetworkChart } from '@/components/realtime/NetworkChart'
import { TemperatureGauge } from '@/components/realtime/TemperatureGauge'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { formatBytes, formatBytesPerSec, formatBitsPerSec } from '@/lib/utils'

export function RealtimePage(): JSX.Element {
  const {
    latest,
    cpuHistory,
    memoryHistory,
    diskReadHistory,
    diskWriteHistory,
    netDownloadHistory,
    netUploadHistory,
    temperatureHistory,
    start,
    stop
  } = useRealtimeStore()

  useEffect(() => {
    start()
    return () => { stop() }
  }, [])

  const currentTemp = latest?.temperature?.main ?? null
  const netTotalDown = latest?.network
    ?.filter((n) => !n.iface.startsWith('lo'))
    .reduce((sum, n) => sum + (n.rx_sec ?? 0), 0) ?? 0
  const netTotalUp = latest?.network
    ?.filter((n) => !n.iface.startsWith('lo'))
    .reduce((sum, n) => sum + (n.tx_sec ?? 0), 0) ?? 0

  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">实时监控</h2>

      {/* Summary Stats */}
      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-3 flex items-center gap-3">
            <Cpu className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">CPU</div>
              <div className="text-lg font-bold text-[var(--text-primary)]">{latest.cpu.total.toFixed(1)}%</div>
            </div>
          </div>
          <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-3 flex items-center gap-3">
            <MemoryStick className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">内存</div>
              <div className="text-lg font-bold text-[var(--text-primary)]">{latest.memory.usedPercent.toFixed(1)}%</div>
            </div>
          </div>
          <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-3 flex items-center gap-3">
            <Activity className="w-8 h-8 text-orange-500" />
            <div>
              <div className="text-xs text-[var(--text-secondary)]">当前温度</div>
              <div className="text-lg font-bold text-[var(--text-primary)]">
                {currentTemp !== null ? `${currentTemp.toFixed(1)}°C` : '—'}
              </div>
            </div>
          </div>
          <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-3">
            <div className="text-xs text-[var(--text-secondary)] mb-1">Swap 使用</div>
            <ProgressBar
              value={latest.memory.swapTotal > 0 ? (latest.memory.swapUsed / latest.memory.swapTotal) * 100 : 0}
              size="sm"
              color="memory"
              showPercent={false}
            />
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              {formatBytes(latest.memory.swapUsed)} / {formatBytes(latest.memory.swapTotal)}
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CPUChart data={cpuHistory} />
        <MemoryChart data={memoryHistory} />
        <DiskIOChart readData={diskReadHistory} writeData={diskWriteHistory} />
        <NetworkChart downloadData={netDownloadHistory} uploadData={netUploadHistory} />
        <TemperatureGauge
          data={temperatureHistory}
          current={currentTemp}
        />
        {/* Network Current Stats */}
        {latest && (
          <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">当前网络速度</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">下载</span>
                <span className="text-2xl font-bold text-cyan-500">{formatBitsPerSec(netTotalDown)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">上传</span>
                <span className="text-2xl font-bold text-amber-500">{formatBitsPerSec(netTotalUp)}</span>
              </div>
              {latest.diskIO && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">磁盘读取</span>
                    <span className="text-lg font-semibold text-emerald-500">{formatBytesPerSec(latest.diskIO.rIO_sec ?? 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-secondary)]">磁盘写入</span>
                    <span className="text-lg font-semibold text-red-500">{formatBytesPerSec(latest.diskIO.wIO_sec ?? 0)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
