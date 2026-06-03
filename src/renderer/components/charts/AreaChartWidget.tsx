import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import type { TimeSeriesPoint } from '@shared/types'

interface SeriesConfig {
  key: string
  name: string
  color: string
  data: TimeSeriesPoint[]
}

interface Props {
  series: SeriesConfig[]
  height?: number
  yUnit?: string
  yFormatter?: (value: number) => string
  className?: string
}

export function AreaChartWidget({
  series,
  height = 200,
  yUnit = '%',
  yFormatter,
  className
}: Props): JSX.Element {
  // Merge series data by timestamp
  const dataMap = new Map<number, Record<string, number>>()
  const allTimestamps = new Set<number>()

  series.forEach((s) => {
    s.data.forEach((point) => {
      allTimestamps.add(point.timestamp)
      if (!dataMap.has(point.timestamp)) {
        dataMap.set(point.timestamp, {})
      }
      dataMap.get(point.timestamp)![s.key] = point.value
    })
  })

  const chartData = Array.from(allTimestamps)
    .sort((a, b) => a - b)
    .map((ts) => {
      const values = dataMap.get(ts) || {}
      return {
        time: new Date(ts).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        timestamp: ts,
        ...values
      }
    })

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11 }}
            unit={yUnit}
            tickFormatter={yFormatter}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            labelStyle={{ color: 'var(--text-primary)' }}
            itemStyle={{ color: 'var(--text-primary)' }}
            formatter={(value: any, name: any) => [yFormatter ? yFormatter(Number(value)) : `${value}${yUnit}`, name]}
          />
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              fill={s.color}
              fillOpacity={0.15}
              strokeWidth={2}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
