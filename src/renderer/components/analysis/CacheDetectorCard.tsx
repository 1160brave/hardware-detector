import { Trash2, AlertTriangle, Check } from 'lucide-react'
import { formatBytes } from '@/lib/utils'
import type { CacheDir } from '@shared/types'

interface Props {
  caches: CacheDir[]
}

export function CacheDetectorCard({ caches }: Props): JSX.Element {
  if (caches.length === 0) {
    return <p className="text-sm text-[var(--text-secondary)] text-center py-8">未检测到已知缓存目录</p>
  }

  return (
    <div className="space-y-3">
      {caches.map((cache, i) => (
        <div
          key={i}
          className="p-3 rounded-lg bg-[var(--content-bg)] border border-[var(--border-color)]"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-[var(--text-primary)]">{cache.name}</span>
                {cache.safeToClean ? (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                    可安全清理
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    清理前请确认
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)] mb-1">{cache.description}</p>
              <p className="text-xs text-[var(--text-secondary)] truncate">{cache.path}</p>
            </div>
            <div className="text-right ml-4">
              <div className="text-sm font-bold text-[var(--text-primary)]">
                {formatBytes(cache.size)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
