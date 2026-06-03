import { AreaChartWidget } from '@/components/charts/AreaChartWidget'
import { formatBytesPerSec } from '@/lib/utils'
import type { TimeSeriesPoint } from '@shared/types'

interface Props {
  readData: TimeSeriesPoint[]
  writeData: TimeSeriesPoint[]
}

export function DiskIOChart({ readData, writeData }: Props): JSX.Element {
  const hasData = readData.length > 0 || writeData.length > 0

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">磁盘 I/O</h3>
      {hasData ? (
        <AreaChartWidget
          series={[
            {
              key: 'read',
              name: '读取',
              color: '#10b981',
              data: readData
            },
            {
              key: 'write',
              name: '写入',
              color: '#ef4444',
              data: writeData
            }
          ]}
          height={200}
          yUnit=""
          yFormatter={formatBytesPerSec}
        />
      ) : (
        <p className="text-sm text-[var(--text-secondary)] text-center py-12">等待数据...</p>
      )}
    </div>
  )
}
