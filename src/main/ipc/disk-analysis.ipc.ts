import { ipcMain, BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '../../shared/constants'
import { startDiskScan, cancelDiskScan } from '../services/disk-analysis.service'
import type { DiskScanProgress, DiskScanResult } from '../../shared/types'

export function registerDiskAnalysisIpc(): void {
  ipcMain.on(IPC_CHANNELS.DISK_SCAN_START, (event, targetPath: string) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) return

    startDiskScan(
      targetPath,
      (progress: DiskScanProgress) => {
        if (!win.isDestroyed()) {
          win.webContents.send(IPC_CHANNELS.DISK_SCAN_PROGRESS, progress)
        }
      },
      (result: DiskScanResult) => {
        if (!win.isDestroyed()) {
          win.webContents.send(IPC_CHANNELS.DISK_SCAN_COMPLETE, result)
        }
      },
      (error: Error) => {
        if (!win.isDestroyed()) {
          win.webContents.send(IPC_CHANNELS.DISK_SCAN_COMPLETE, {
            largeFiles: [],
            fileTypes: [],
            directoryRanking: [],
            cacheDirs: [],
            totalScanned: 0,
            totalSize: 0,
            error: error.message
          })
        }
      }
    )
  })

  ipcMain.on(IPC_CHANNELS.DISK_SCAN_CANCEL, () => {
    cancelDiskScan()
  })
}
