import { useState } from 'react'
import { File, Folder } from 'lucide-react'
import { formatBytes } from '@/lib/utils'
import type { FileEntry } from '@shared/types'

interface Props {
  files: FileEntry[]
}

export function LargeFileTable({ files }: Props): JSX.Element {
  const [sortKey, setSortKey] = useState<'size' | 'name'>('size')
  const [sortAsc, setSortAsc] = useState(false)

  const sorted = [...files].sort((a, b) => {
    const modifier = sortAsc ? 1 : -1
    if (sortKey === 'size') return (a.size - b.size) * modifier
    return a.name.localeCompare(b.name) * modifier
  })

  const toggleSort = (key: 'size' | 'name'): void => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  if (files.length === 0) {
    return <p className="text-sm text-[var(--text-secondary)] text-center py-8">暂无大文件</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-color)]">
            <th
              className="text-left py-2 px-3 font-medium text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)]"
              onClick={() => toggleSort('name')}
            >
              文件名 {sortKey === 'name' && (sortAsc ? '↑' : '↓')}
            </th>
            <th
              className="text-right py-2 px-3 font-medium text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)]"
              onClick={() => toggleSort('size')}
            >
              大小 {sortKey === 'size' && (sortAsc ? '↑' : '↓')}
            </th>
            <th className="text-left py-2 px-3 font-medium text-[var(--text-secondary)]">路径</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((file, i) => (
            <tr key={i} className="border-b border-[var(--border-color)] hover:bg-[var(--content-bg)]">
              <td className="py-2 px-3">
                <div className="flex items-center gap-2">
                  {file.isDirectory ? (
                    <Folder className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  ) : (
                    <File className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                  <span className="text-[var(--text-primary)] truncate max-w-[200px]">{file.name}</span>
                </div>
              </td>
              <td className="py-2 px-3 text-right font-medium text-[var(--text-primary)]">
                {formatBytes(file.size)}
              </td>
              <td className="py-2 px-3 text-[var(--text-secondary)] text-xs truncate max-w-[300px]">
                {file.path}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
