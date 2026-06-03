import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../shared/constants'
import type {
  IpcResponse,
  SystemInfo,
  DiskLayoutInfo,
  DiskUsageInfo,
  BlockDeviceInfo,
  RealtimeSnapshot,
  DiskScanProgress,
  DiskScanResult,
  PermissionStatus
} from '../shared/types'

const api = {
  // System / Hardware
  getSystemInfo: (): Promise<IpcResponse<SystemInfo>> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_SYSTEM_INFO),

  // Disk
  getDiskLayout: (): Promise<IpcResponse<DiskLayoutInfo[]>> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_DISK_LAYOUT),
  getDiskUsage: (): Promise<IpcResponse<DiskUsageInfo[]>> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_DISK_USAGE),
  getBlockDevices: (): Promise<IpcResponse<BlockDeviceInfo[]>> =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_BLOCK_DEVICES),

  // Realtime
  subscribeRealtime: (callback: (data: RealtimeSnapshot) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: RealtimeSnapshot): void => {
      callback(data)
    }
    ipcRenderer.on(IPC_CHANNELS.REALTIME_UPDATE, handler)
    ipcRenderer.send(IPC_CHANNELS.REALTIME_SUBSCRIBE)

    // Return unsubscribe function
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.REALTIME_UPDATE, handler)
      ipcRenderer.send(IPC_CHANNELS.REALTIME_UNSUBSCRIBE)
    }
  },

  // Disk Analysis
  startDiskScan: (targetPath: string): void => {
    ipcRenderer.send(IPC_CHANNELS.DISK_SCAN_START, targetPath)
  },
  cancelDiskScan: (): void => {
    ipcRenderer.send(IPC_CHANNELS.DISK_SCAN_CANCEL)
  },
  onDiskScanProgress: (callback: (progress: DiskScanProgress) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: DiskScanProgress): void => {
      callback(data)
    }
    ipcRenderer.on(IPC_CHANNELS.DISK_SCAN_PROGRESS, handler)
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.DISK_SCAN_PROGRESS, handler)
    }
  },
  onDiskScanComplete: (callback: (result: DiskScanResult) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, data: DiskScanResult): void => {
      callback(data)
    }
    ipcRenderer.on(IPC_CHANNELS.DISK_SCAN_COMPLETE, handler)
    return () => {
      ipcRenderer.removeListener(IPC_CHANNELS.DISK_SCAN_COMPLETE, handler)
    }
  },

  // Permissions
  checkPermissions: (): Promise<IpcResponse<PermissionStatus>> =>
    ipcRenderer.invoke(IPC_CHANNELS.CHECK_PERMISSIONS),

  // Get User Home
  getUserHome: (): string => {
    return process.env.HOME || process.env.USERPROFILE || '/Users'
  }
}

contextBridge.exposeInMainWorld('api', api)

export type ElectronAPI = typeof api
