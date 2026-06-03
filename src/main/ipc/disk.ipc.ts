import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../../shared/constants'
import type { IpcResponse, DiskLayoutInfo, DiskUsageInfo, BlockDeviceInfo } from '../../shared/types'
import { getDiskLayout, getDiskUsage, getBlockDevices } from '../services/disk.service'

function handle<T>(channel: string, fn: () => Promise<T>): void {
  ipcMain.handle(channel, async (): Promise<IpcResponse<T>> => {
    try {
      const data = await fn()
      return { success: true, data }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { success: false, data: null, error: message }
    }
  })
}

export function registerDiskIpc(): void {
  handle<DiskLayoutInfo[]>(IPC_CHANNELS.GET_DISK_LAYOUT, getDiskLayout)
  handle<DiskUsageInfo[]>(IPC_CHANNELS.GET_DISK_USAGE, getDiskUsage)
  handle<BlockDeviceInfo[]>(IPC_CHANNELS.GET_BLOCK_DEVICES, getBlockDevices)
}
