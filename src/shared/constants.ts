// IPC Channel Names
export const IPC_CHANNELS = {
  // System / Hardware
  GET_SYSTEM_INFO: 'system:get-all',
  GET_OS_INFO: 'system:get-os',
  GET_CPU_INFO: 'system:get-cpu',
  GET_MEMORY_INFO: 'system:get-memory',
  GET_GPU_INFO: 'system:get-gpu',
  GET_MOTHERBOARD: 'system:get-motherboard',
  GET_BATTERY_INFO: 'system:get-battery',
  GET_NETWORK_INFO: 'system:get-network',

  // Disk
  GET_DISK_LAYOUT: 'disk:get-layout',
  GET_DISK_USAGE: 'disk:get-usage',
  GET_BLOCK_DEVICES: 'disk:get-block-devices',

  // Realtime
  REALTIME_START: 'realtime:start',
  REALTIME_STOP: 'realtime:stop',
  REALTIME_UPDATE: 'realtime:update',
  REALTIME_SUBSCRIBE: 'realtime:subscribe',
  REALTIME_UNSUBSCRIBE: 'realtime:unsubscribe',

  // Disk Analysis
  DISK_SCAN_START: 'disk-scan:start',
  DISK_SCAN_CANCEL: 'disk-scan:cancel',
  DISK_SCAN_PROGRESS: 'disk-scan:progress',
  DISK_SCAN_COMPLETE: 'disk-scan:complete',

  // Permissions
  CHECK_PERMISSIONS: 'system:check-permissions'
} as const
