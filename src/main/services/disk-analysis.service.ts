import { Worker } from 'worker_threads'
import workerPath from '../workers/disk-scanner.worker?modulePath'
import type {
  DiskScanProgress,
  DiskScanResult
} from '../../shared/types'

declare module '*?modulePath' {
  const content: string
  export default content
}

let currentWorker: Worker | null = null

export function startDiskScan(
  targetPath: string,
  onProgress: (progress: DiskScanProgress) => void,
  onComplete: (result: DiskScanResult) => void,
  onError: (error: Error) => void
): void {
  // Cancel any existing scan
  if (currentWorker) {
    currentWorker.terminate()
    currentWorker = null
  }

  currentWorker = new Worker(workerPath, {
    workerData: { targetPath }
  })

  currentWorker.on('message', (message: DiskScanProgress | DiskScanResult) => {
    if ('type' in message && message.type === 'progress') {
      onProgress(message as DiskScanProgress)
    } else {
      // Complete result
      onComplete(message as DiskScanResult)
    }
  })

  currentWorker.on('error', (err: Error) => {
    onError(err)
    currentWorker = null
  })

  currentWorker.on('exit', () => {
    currentWorker = null
  })
}

export function cancelDiskScan(): void {
  if (currentWorker) {
    currentWorker.terminate()
    currentWorker = null
  }
}

export function getScanStatus(): boolean {
  return currentWorker !== null
}
