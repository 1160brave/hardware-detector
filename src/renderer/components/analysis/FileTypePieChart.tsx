import { PieChartWidget } from '@/components/charts/PieChartWidget'
import { formatBytes } from '@/lib/utils'
import type { FileTypeStat } from '@shared/types'

interface Props {
  data: FileTypeStat[]
}

export function FileTypePieChart({ data }: Props): JSX.Element {
  const topTypes = data.slice(0, 10)
  const otherSize = data.slice(10).reduce((sum, t) => sum + t.size, 0)

  const pieData = topTypes.map((t) => ({
    name: t.type,
    value: t.size
  }))

  if (otherSize > 0) {
    pieData.push({ name: '其他', value: otherSize })
  }

  if (data.length === 0) {
    return <p className="text-sm text-[var(--text-secondary)] text-center py-8">暂无文件类型数据</p>
  }

  return (
    <div>
      <PieChartWidget data={pieData} height={280} />
      <div className="mt-2 space-y-1">
        {topTypes.map((t, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-secondary)] flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: DEFAULT_COLORS[i % DEFAULT_COLORS.length] }}
              />
              {t.type}
            </span>
            <span className="text-[var(--text-primary)]">
              {formatBytes(t.size)} ({t.percent.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const DEFAULT_COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
]
