import { create } from 'zustand'
import type {
  SystemInfo,
  DiskLayoutInfo,
  DiskUsageInfo,
  BlockDeviceInfo,
  PermissionStatus
} from '@shared/types'

interface SystemState {
  // Data
  systemInfo: SystemInfo | null
  diskLayout: DiskLayoutInfo[]
  diskUsage: DiskUsageInfo[]
  blockDevices: BlockDeviceInfo[]
  permissions: PermissionStatus | null

  // Loading states
  loadingSystem: boolean
  loadingDisk: boolean

  // Error states
  errorSystem: string | null
  errorDisk: string | null

  // Actions
  setSystemInfo: (info: SystemInfo | null) => void
  setDiskLayout: (layout: DiskLayoutInfo[]) => void
  setDiskUsage: (usage: DiskUsageInfo[]) => void
  setBlockDevices: (devices: BlockDeviceInfo[]) => void
  setPermissions: (status: PermissionStatus | null) => void
  setLoadingSystem: (loading: boolean) => void
  setLoadingDisk: (loading: boolean) => void
  setErrorSystem: (error: string | null) => void
  setErrorDisk: (error: string | null) => void

  // Fetch helpers
  fetchAllSystemInfo: () => Promise<void>
  fetchAllDiskInfo: () => Promise<void>
  fetchPermissions: () => Promise<void>
}

export const useSystemStore = create<SystemState>((set) => ({
  systemInfo: null,
  diskLayout: [],
  diskUsage: [],
  blockDevices: [],
  permissions: null,
  loadingSystem: false,
  loadingDisk: false,
  errorSystem: null,
  errorDisk: null,

  setSystemInfo: (info) => set({ systemInfo: info }),
  setDiskLayout: (layout) => set({ diskLayout: layout }),
  setDiskUsage: (usage) => set({ diskUsage: usage }),
  setBlockDevices: (devices) => set({ blockDevices: devices }),
  setPermissions: (status) => set({ permissions: status }),
  setLoadingSystem: (loading) => set({ loadingSystem: loading }),
  setLoadingDisk: (loading) => set({ loadingDisk: loading }),
  setErrorSystem: (error) => set({ errorSystem: error }),
  setErrorDisk: (error) => set({ errorDisk: error }),

  fetchAllSystemInfo: async () => {
    set({ loadingSystem: true, errorSystem: null })
    try {
      const res = await window.api.getSystemInfo()
      if (res.success && res.data) {
        set({ systemInfo: res.data, loadingSystem: false })
      } else {
        set({ errorSystem: res.error || '获取系统信息失败', loadingSystem: false })
      }
    } catch (err) {
      set({ errorSystem: '获取系统信息失败', loadingSystem: false })
    }
  },

  fetchAllDiskInfo: async () => {
    set({ loadingDisk: true, errorDisk: null })
    try {
      const [layout, usage, devices] = await Promise.all([
        window.api.getDiskLayout(),
        window.api.getDiskUsage(),
        window.api.getBlockDevices()
      ])
      if (layout.success && layout.data) set({ diskLayout: layout.data })
      if (usage.success && usage.data) set({ diskUsage: usage.data })
      if (devices.success && devices.data) set({ blockDevices: devices.data })
      set({ loadingDisk: false })
    } catch {
      set({ errorDisk: '获取磁盘信息失败', loadingDisk: false })
    }
  },

  fetchPermissions: async () => {
    try {
      const res = await window.api.checkPermissions()
      if (res.success && res.data) {
        set({ permissions: res.data })
      }
    } catch {
      // Silently ignore
    }
  }
}))
