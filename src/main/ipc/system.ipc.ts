import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../../shared/constants'
import type { IpcResponse } from '../../shared/types'
import {
  getFullSystemInfo,
  getOSInfo,
  getCPUInfo,
  getMemoryInfo,
  getGPUInfo,
  getMotherboard,
  getBatteryInfo,
  getNetworkInfo
} from '../services/system.service'
import { checkFullDiskAccess, checkTemperatureSensor } from '../utils/permissions'

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

export function registerSystemIpc(): void {
  handle(IPC_CHANNELS.GET_SYSTEM_INFO, getFullSystemInfo)
  handle(IPC_CHANNELS.GET_OS_INFO, getOSInfo)
  handle(IPC_CHANNELS.GET_CPU_INFO, getCPUInfo)
  handle(IPC_CHANNELS.GET_MEMORY_INFO, getMemoryInfo)
  handle(IPC_CHANNELS.GET_GPU_INFO, getGPUInfo)
  handle(IPC_CHANNELS.GET_MOTHERBOARD, getMotherboard)
  handle(IPC_CHANNELS.GET_BATTERY_INFO, getBatteryInfo)
  handle(IPC_CHANNELS.GET_NETWORK_INFO, getNetworkInfo)

  // Permissions
  ipcMain.handle(IPC_CHANNELS.CHECK_PERMISSIONS, async (): Promise<IpcResponse<{ fullDiskAccess: boolean; temperatureSensor: boolean }>> => {
    try {
      const [fullDiskAccess, temperatureSensor] = await Promise.all([
        checkFullDiskAccess(),
        checkTemperatureSensor()
      ])
      return { success: true, data: { fullDiskAccess, temperatureSensor } }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return { success: false, data: null, error: message }
    }
  })
}
