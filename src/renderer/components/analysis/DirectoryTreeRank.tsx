import { Folder, ChevronRight } from 'lucide-react'
import { formatBytes } from '@/lib/utils'
import type { DirectorySummary } from '@shared/types'

interface Props {
  directories: DirectorySummary[]
}

export function DirectoryTreeRank({ directories }: Props): JSX.Element {
  if (directories.length === 0) {
    return <p className="text-sm text-[var(--text-secondary)] text-center py-8">暂无目录数据</p>
  }

  return (
    <div className="space-y-1">
      {directories.map((dir, i) => {
        const totalSize = directories.reduce((sum, d) => sum + d.size, 0)
        const percent = totalSize > 0 ? (dir.size / totalSize) * 100 : 0
        const barWidth = Math.max(percent, 2)

        return (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--content-bg)] transition-colors"
          >
            <span className="text-xs text-[var(--text-secondary)] w-5 text-right">{i + 1}</span>
            <Folder className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[var(--text-primary)] truncate">{dir.name}</span>
                <span className="text-xs text-[var(--text-secondary)] ml-2 flex-shrink-0">
                  {formatBytes(dir.size)}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[10px] text-[var(--text-secondary)]">
                  {dir.fileCount.toLocaleString()} 个文件
                </span>
                <span className="text-[10px] text-[var(--text-secondary)]">
                  {percent.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
