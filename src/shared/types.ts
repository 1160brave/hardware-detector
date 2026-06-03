// ===================== Hardware Types =====================

export interface OSInfo {
  platform: string
  distro: string
  release: string
  codename: string
  kernel: string
  arch: string
  hostname: string
  codepage: string
  logofile: string
  serial: string
  build: string
  servicepack: string
  uefi: boolean
}

export interface CPUInfo {
  manufacturer: string
  brand: string
  vendor: string
  family: string
  model: string
  stepping: string
  revision: string
  voltage: string
  speed: number
  speedMin: number
  speedMax: number
  governor: string
  cores: number
  physicalCores: number
  performanceCores: number
  efficiencyCores: number
  processors: number
  socket: string
  flags: string
  virtualization: boolean
  cache: {
    l1d: number
    l1i: number
    l2: number
    l3: number
  }
}

export interface MemoryInfo {
  total: number
  free: number
  used: number
  active: number
  available: number
  swapTotal: number
  swapUsed: number
  swapFree: number
}

export interface GPUInfo {
  vendor: string
  model: string
  bus: string
  vram: number | null
  vramDynamic: boolean
}

export interface MotherboardInfo {
  manufacturer: string
  model: string
  version: string
  serial: string
  uuid: string
  bios: {
    vendor: string
    version: string
    releaseDate: string
    revision: string
  }
}

export interface BatteryInfo {
  hasBattery: boolean
  cycleCount: number
  isCharging: boolean
  designedCapacity: number
  maxCapacity: number
  currentCapacity: number
  voltage: number
  capacityUnit: string
  percent: number
  timeRemaining: number
  type: string
  model: string
  manufacturer: string
  serial: string
}

export interface NetworkInterfaceInfo {
  iface: string
  ifaceName: string
  ip4: string
  ip4subnet: string
  ip6: string
  ip6subnet: string
  mac: string
  internal: boolean
  virtual: boolean
  operstate: string
  type: string
  duplex: string
  mtu: number | null
  speed: number | null
  dhcp: boolean
  dnsSuffix: string
  ieee8021xAuth: string
  ieee8021xState: string
  carrierChanges: number
}

export interface SystemInfo {
  os: OSInfo
  cpu: CPUInfo
  memory: MemoryInfo
  gpu: GPUInfo[]
  motherboard: MotherboardInfo
  battery: BatteryInfo | null
  network: NetworkInterfaceInfo[]
}

// ===================== Disk Types =====================

export interface DiskLayoutInfo {
  device: string
  type: string
  name: string
  vendor: string
  size: number
  bytesPerSector: number
  totalCylinders: number
  totalHeads: number
  totalSectors: number
  totalTracks: number
  tracksPerCylinder: number
  sectorsPerTrack: number
  firmwareRevision: string
  serialNum: string
  interfaceType: string
  smartStatus: string
  temperature: number | null
}

export interface DiskUsageInfo {
  fs: string
  type: string
  size: number
  used: number
  available: number
  use: number
  mount: string
  rw: boolean
}

export interface BlockDeviceInfo {
  name: string
  identifier: string
  type: string
  fsType: string
  mount: string
  size: number
  physical: string
  uuid: string
  label: string
  model: string
  serial: string
  removable: boolean
  protocol: string
  group: string
  device: string
}

// ===================== Realtime Types =====================

export interface CurrentLoadInfo {
  avgLoad: number
  currentLoad: number
  currentLoadUser: number
  currentLoadSystem: number
  currentLoadNice: number
  currentLoadIdle: number
  currentLoadIrq: number
  rawCurrentLoad: number
  cpus: {
    load: number
    loadUser: number
    loadSystem: number
    loadNice: number
    loadIdle: number
    loadIrq: number
    rawLoad: number
  }[]
}

export interface MemData {
  total: number
  free: number
  used: number
  active: number
  available: number
  swapTotal: number
  swapUsed: number
  swapFree: number
}

export interface DiskIOData {
  rIO: number
  wIO: number
  tIO: number
  rIO_sec: number | null
  wIO_sec: number | null
  tIO_sec: number | null
  rWaitTime: number | null
  wWaitTime: number | null
  tWaitTime: number | null
  rWaitPercent: number | null
  wWaitPercent: number | null
  tWaitPercent: number | null
  ms: number
}

export interface NetworkStats {
  iface: string
  operstate: string
  rx_bytes: number
  rx_dropped: number
  rx_errors: number
  tx_bytes: number
  tx_dropped: number
  tx_errors: number
  rx_sec: number | null
  tx_sec: number | null
  ms: number
}

export interface TemperatureInfo {
  main: number
  cores: number[]
  max: number
  socket: number[]
  chipset: number | null
}

export interface TimeSeriesPoint {
  timestamp: number
  value: number
}

export interface RealtimeSnapshot {
  timestamp: number
  cpu: {
    total: number
    user: number
    system: number
    idle: number
    cores: number[]
  }
  memory: {
    used: number
    free: number
    total: number
    usedPercent: number
    swapUsed: number
    swapTotal: number
  }
  diskIO: DiskIOData | null
  network: NetworkStats[]
  temperature: TemperatureInfo | null
}

// ===================== Disk Analysis Types =====================

export interface DiskScanProgress {
  type: 'progress'
  scanned: number
  found: number
  currentPath: string
  elapsed: number
}

export interface FileEntry {
  path: string
  name: string
  size: number
  extension: string
  isDirectory: boolean
  lastModified: number
}

export interface DirectorySummary {
  path: string
  name: string
  size: number
  fileCount: number
  children: DirectorySummary[]
}

export interface FileTypeStat {
  type: string
  size: number
  count: number
  percent: number
}

export interface CacheDir {
  path: string
  name: string
  size: number
  description: string
  safeToClean: boolean
}

export interface DiskScanResult {
  largeFiles: FileEntry[]
  fileTypes: FileTypeStat[]
  directoryRanking: DirectorySummary[]
  cacheDirs: CacheDir[]
  totalScanned: number
  totalSize: number
}

// ===================== Permission Types =====================

export interface PermissionStatus {
  fullDiskAccess: boolean
  temperatureSensor: boolean
}

// ===================== IPC Response Types =====================

export interface IpcResponse<T> {
  success: boolean
  data: T | null
  error?: string
}
