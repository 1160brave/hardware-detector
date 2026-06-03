import { Thermometer } from 'lucide-react'
import type { TimeSeriesPoint } from '@shared/types'

interface Props {
  data: TimeSeriesPoint[]
  current: number | null
}

export function TemperatureGauge({ data, current }: Props): JSX.Element {
  if (current === null || current === undefined) {
    return (
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Thermometer className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">温度</h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)] text-center py-8">温度传感器不可用</p>
      </div>
    )
  }

  const getTempColor = (temp: number): string => {
    if (temp >= 80) return '#ef4444'
    if (temp >= 60) return '#f59e0b'
    return '#10b981'
  }

  const tempColor = getTempColor(current)

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
      <div className="flex items-center gap-2 mb-3">
        <Thermometer className="w-4 h-4 text-orange-500" />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">温度</h3>
      </div>
      <div className="flex items-center justify-center py-4">
        <div className="text-center">
          <div className="text-4xl font-bold" style={{ color: tempColor }}>
            {current.toFixed(1)}°C
          </div>
          <div className="text-xs text-[var(--text-secondary)] mt-2">CPU 温度</div>
        </div>
      </div>
      <div className="flex justify-center gap-1 items-end h-16">
        {data.length > 0 ? (
          data.slice(-30).map((point, i) => {
            const h = Math.max(8, (point.value / 100) * 64)
            return (
              <div
                key={i}
                className="w-1.5 rounded-t"
                style={{
                  height: `${h}px`,
                  backgroundColor: getTempColor(point.value),
                  opacity: 0.7
                }}
              />
            )
          })
        ) : (
          <p className="text-xs text-[var(--text-secondary)]">等待数据...</p>
        )}
      </div>
    </div>
  )
}
