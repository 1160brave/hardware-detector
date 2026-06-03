import { AreaChartWidget } from '@/components/charts/AreaChartWidget'
import { formatBitsPerSec } from '@/lib/utils'
import type { TimeSeriesPoint } from '@shared/types'

interface Props {
  downloadData: TimeSeriesPoint[]
  uploadData: TimeSeriesPoint[]
}

export function NetworkChart({ downloadData, uploadData }: Props): JSX.Element {
  const hasData = downloadData.length > 0 || uploadData.length > 0

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">网络速度</h3>
      {hasData ? (
        <AreaChartWidget
          series={[
            {
              key: 'download',
              name: '下载',
              color: '#06b6d4',
              data: downloadData
            },
            {
              key: 'upload',
              name: '上传',
              color: '#f59e0b',
              data: uploadData
            }
          ]}
          height={200}
          yUnit=""
          yFormatter={formatBitsPerSec}
        />
      ) : (
        <p className="text-sm text-[var(--text-secondary)] text-center py-12">等待数据...</p>
      )}
    </div>
  )
}
