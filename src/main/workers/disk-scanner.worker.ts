import { parentPort, workerData } from 'worker_threads'
import { readdir, stat } from 'fs/promises'
import { join, extname, basename, sep } from 'path'
import { homedir } from 'os'
import type { FileEntry, DirectorySummary, FileTypeStat, CacheDir, DiskScanResult } from '../../shared/types'

const { targetPath } = workerData as { targetPath: string }

// Known cache directories to check
const CACHE_PATTERNS: { name: string; paths: string[]; description: string; safeToClean: boolean }[] = [
  {
    name: 'macOS 用户缓存',
    paths: ['Library/Caches'],
    description: '系统和应用缓存文件',
    safeToClean: true
  },
  {
    name: 'npm 缓存',
    paths: ['.npm/_cacache'],
    description: 'npm 包管理器缓存',
    safeToClean: true
  },
  {
    name: 'Xcode 派生数据',
    paths: ['Library/Developer/Xcode/DerivedData'],
    description: 'Xcode 构建缓存',
    safeToClean: true
  },
  {
    name: 'Docker 数据',
    paths: ['Library/Containers/com.docker.docker/Data'],
    description: 'Docker 镜像和容器数据',
    safeToClean: false
  },
  {
    name: 'Adobe 缓存',
    paths: ['Library/Application Support/Adobe/Common/Media Cache'],
    description: 'Adobe 系列软件缓存',
    safeToClean: true
  }
]

interface ScanState {
  scanned: number
  found: number
  largeFiles: FileEntry[]
  dirSizes: Map<string, { size: number; fileCount: number }>
  fileExtensions: Map<string, { size: number; count: number }>
  startTime: number
}

const LARGE_FILE_THRESHOLD = 100 * 1024 * 1024 // 100 MB

async function sendProgress(state: ScanState, currentPath: string): Promise<void> {
  parentPort?.postMessage({
    type: 'progress',
    scanned: state.scanned,
    found: state.found,
    currentPath,
    elapsed: Date.now() - state.startTime
  })
}

async function scanDirectory(dirPath: string, state: ScanState): Promise<void> {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      // Skip system-protected paths
      const fullPath = join(dirPath, entry.name)
      if (shouldSkip(fullPath)) continue

      try {
        const fileStat = await stat(fullPath)
        state.scanned++

        if (fileStat.isDirectory()) {
          // Track directory size
          state.found++
          await sendProgress(state, fullPath)

          // Recurse, but not too deep (max depth ~10 levels implicitly via OS limits)
          await scanDirectory(fullPath, state)
        } else if (fileStat.isFile()) {
          state.found++

          // Track large files
          if (fileStat.size >= LARGE_FILE_THRESHOLD) {
            state.largeFiles.push({
              path: fullPath,
              name: entry.name,
              size: fileStat.size,
              extension: extname(entry.name).toLowerCase(),
              isDirectory: false,
              lastModified: fileStat.mtimeMs
            })
          }

          // Track file extension stats
          const ext = extname(entry.name).toLowerCase() || '(无扩展名)'
          const existing = state.fileExtensions.get(ext)
          if (existing) {
            existing.size += fileStat.size
            existing.count++
          } else {
            state.fileExtensions.set(ext, { size: fileStat.size, count: 1 })
          }

          // Calculate directory sizes (aggregate up)
          let parent = fullPath.substring(0, fullPath.lastIndexOf(sep))
          while (parent && parent.startsWith(targetPath)) {
            const dirStat = state.dirSizes.get(parent) || { size: 0, fileCount: 0 }
            dirStat.size += fileStat.size
            dirStat.fileCount++
            state.dirSizes.set(parent, dirStat)
            parent = parent.substring(0, parent.lastIndexOf(sep))
          }
        }

        // Send progress every 100 entries
        if (state.scanned % 100 === 0) {
          await sendProgress(state, fullPath)
        }
      } catch {
        // Skip entries we can't read
      }
    }
  } catch {
    // Skip directories we can't read
  }
}

function shouldSkip(path: string): boolean {
  // Skip system directories that require special permissions
  const skipPaths = [
    '/System',
    '/private/var/db',
    '/private/var/run',
    '/dev',
    '/proc',
    '/.DocumentRevisions-V100',
    '/.fseventsd',
    '/.Spotlight-V100',
    '/.TemporaryItems',
    '/.Trashes'
  ]
  return skipPaths.some((skip) => path === skip || path.startsWith(skip + '/'))
}

async function checkCaches(homeDir: string): Promise<CacheDir[]> {
  const results: CacheDir[] = []

  for (const pattern of CACHE_PATTERNS) {
    for (const p of pattern.paths) {
      const fullPath = join(homeDir, p)
      try {
        const dirStat = await stat(fullPath)
        if (dirStat.isDirectory()) {
          // Calculate total size for this cache dir
          let size = 0
          // Just use stat size of the first level for speed
          try {
            const entries = await readdir(fullPath, { withFileTypes: true })
            for (const entry of entries) {
              try {
                const s = await stat(join(fullPath, entry.name))
                size += s.size
              } catch {
                // skip
              }
            }
          } catch {
            // skip
          }

          results.push({
            path: fullPath,
            name: pattern.name,
            size,
            description: pattern.description,
            safeToClean: pattern.safeToClean
          })
        }
      } catch {
        // Directory not found, skip
      }
    }
  }

  return results
}

async function main(): Promise<void> {
  const state: ScanState = {
    scanned: 0,
    found: 0,
    largeFiles: [],
    dirSizes: new Map(),
    fileExtensions: new Map(),
    startTime: Date.now()
  }

  // Scan the target path
  await scanDirectory(targetPath, state)

  // Sort large files by size descending
  state.largeFiles.sort((a, b) => b.size - a.size)

  // Build file type stats
  const totalFileSize = Array.from(state.fileExtensions.values())
    .reduce((sum, v) => sum + v.size, 0)

  const fileTypes: FileTypeStat[] = Array.from(state.fileExtensions.entries())
    .map(([type, data]) => ({
      type,
      size: data.size,
      count: data.count,
      percent: totalFileSize > 0 ? (data.size / totalFileSize) * 100 : 0
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 20) // Top 20 types

  // Build directory ranking
  const directoryRanking: DirectorySummary[] = Array.from(state.dirSizes.entries())
    .filter(([path]) => {
      // Only top-level directories under the scan root
      const relative = path.substring(targetPath.length)
      return relative.split(sep).filter(Boolean).length === 1
    })
    .map(([path, data]) => ({
      path,
      name: basename(path),
      size: data.size,
      fileCount: data.fileCount,
      children: []
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 30)

  // Check cache directories
  const homeDir = homedir()
  const cacheDirs = await checkCaches(homeDir)

  const result: DiskScanResult = {
    largeFiles: state.largeFiles.slice(0, 100),
    fileTypes,
    directoryRanking,
    cacheDirs,
    totalScanned: state.scanned,
    totalSize: totalFileSize
  }

  parentPort?.postMessage(result)
}

main().catch((err) => {
  parentPort?.postMessage({
    largeFiles: [],
    fileTypes: [],
    directoryRanking: [],
    cacheDirs: [],
    totalScanned: 0,
    totalSize: 0,
    error: err.message
  })
})
