import { formatBytes } from '@/lib/utils'
import type { BlockDeviceInfo } from '@shared/types'

interface Props {
  devices: BlockDeviceInfo[]
}

export function PartitionTable({ devices }: Props): JSX.Element {
  if (devices.length === 0) return <p className="text-sm text-[var(--text-secondary)]">暂无分区信息</p>

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-color)]">
            <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">名称</th>
            <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">挂载点</th>
            <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">类型</th>
            <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">文件系统</th>
            <th className="text-right py-2 px-3 font-medium text-[var(--text-secondary)]">容量</th>
            <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">可移动</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((dev) => (
            <tr key={dev.identifier || dev.name} className="border-b border-[var(--border-color)] hover:bg-[var(--content-bg)]">
              <td className="py-2 px-3 font-medium text-[var(--text-primary)]">{dev.name}</td>
              <td className="py-2 px-3 text-[var(--text-secondary)]">{dev.mount || '—'}</td>
              <td className="py-2 px-3 text-[var(--text-secondary)]">{dev.type}</td>
              <td className="py-2 px-3 text-[var(--text-secondary)]">{dev.fsType || '—'}</td>
              <td className="py-2 px-3 text-right text-[var(--text-primary)]">{formatBytes(dev.size)}</td>
              <td className="py-2 px-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    dev.removable
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                  }`}
                >
                  {dev.removable ? '是' : '否'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
