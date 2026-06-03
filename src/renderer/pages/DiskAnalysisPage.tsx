import { useState } from 'react'
import { Search, X, FolderOpen } from 'lucide-react'
import { useDiskAnalysisStore } from '@/stores/useDiskAnalysisStore'
import { LargeFileTable } from '@/components/analysis/LargeFileTable'
import { FileTypePieChart } from '@/components/analysis/FileTypePieChart'
import { DirectoryTreeRank } from '@/components/analysis/DirectoryTreeRank'
import { CacheDetectorCard } from '@/components/analysis/CacheDetectorCard'
import { ProgressBar } from '@/components/shared/ProgressBar'

export function DiskAnalysisPage(): JSX.Element {
  const {
    isScanning,
    progress,
    result,
    error,
    selectedPath,
    startScan,
    cancelScan,
    setSelectedPath
  } = useDiskAnalysisStore()

  const [customPath, setCustomPath] = useState('/')

  const isWin = typeof window !== 'undefined' && window.navigator.userAgent.includes('Windows')
  const homeDir = window.api.getUserHome()

  const quickPaths = [
    { label: '根目录', path: isWin ? 'C:\\' : '/' },
    { label: '个人目录', path: isWin ? 'C:\\Users' : '/Users' },
    { label: '应用', path: isWin ? 'C:\\Program Files' : '/Applications' },
    { label: '下载', path: isWin ? `${homeDir}\\Downloads` : `${homeDir}/Downloads` }
  ]

  const handleScan = (path?: string): void => {
    const target = path || customPath
    startScan(target)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">磁盘空间分析</h2>

      {/* Scan Controls */}
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-[var(--text-primary)]">扫描目录</h3>
        </div>

        <div className="flex gap-2 mb-3 flex-wrap">
          {quickPaths.map((p) => (
            <button
              key={p.path}
              onClick={() => {
                setSelectedPath(p.path)
                handleScan(p.path)
              }}
              disabled={isScanning}
              className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--content-bg)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customPath}
            onChange={(e) => setCustomPath(e.target.value)}
            placeholder="输入目录路径..."
            disabled={isScanning}
            className="flex-1 px-3 py-2 text-sm bg-[var(--content-bg)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
          />
          {isScanning ? (
            <button
              onClick={cancelScan}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
              取消
            </button>
          ) : (
            <button
              onClick={() => handleScan()}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Search className="w-4 h-4" />
              开始扫描
            </button>
          )}
        </div>

        {/* Progress */}
        {isScanning && progress && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-2">
              <span>已扫描: {progress.scanned.toLocaleString()} 项</span>
              <span>已发现: {progress.found.toLocaleString()} 文件</span>
            </div>
            <ProgressBar
              value={100}
              size="sm"
              color="cpu"
              showPercent={false}
              className="animate-pulse"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1 truncate">{progress.currentPath}</p>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {result && !isScanning && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-3 text-center">
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {result.totalScanned.toLocaleString()}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">扫描项数</div>
            </div>
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-3 text-center">
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {result.largeFiles.length}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">大文件 (≥100MB)</div>
            </div>
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-3 text-center">
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {result.fileTypes.length}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">文件类型</div>
            </div>
            <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-3 text-center">
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                {result.cacheDirs.length}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">缓存目录</div>
            </div>
          </div>

          {/* Large Files */}
          <section className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              大文件列表 ({result.largeFiles.length})
            </h3>
            <LargeFileTable files={result.largeFiles} />
          </section>

          {/* File Types + Directory Ranking Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">文件类型占比</h3>
              <FileTypePieChart data={result.fileTypes} />
            </section>

            <section className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">目录占用排行</h3>
              <DirectoryTreeRank directories={result.directoryRanking} />
            </section>
          </div>

          {/* Cache Dirs */}
          <section className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">可疑缓存目录</h3>
            <CacheDetectorCard caches={result.cacheDirs} />
          </section>
        </div>
      )}
    </div>
  )
}
