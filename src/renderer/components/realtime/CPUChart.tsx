import { AreaChartWidget } from '@/components/charts/AreaChartWidget'
import type { TimeSeriesPoint } from '@shared/types'

interface Props {
  data: TimeSeriesPoint[]
}

export function CPUChart({ data }: Props): JSX.Element {
  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">CPU 使用率</h3>
      {data.length > 0 ? (
        <AreaChartWidget
          series={[
            {
              key: 'cpu',
              name: 'CPU 使用率',
              color: '#3b82f6',
              data
            }
          ]}
          height={200}
        />
      ) : (
        <p className="text-sm text-[var(--text-secondary)] text-center py-12">等待数据...</p>
      )}
    </div>
  )
}
