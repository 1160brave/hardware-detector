import si from 'systeminformation'
import type {
  OSInfo,
  CPUInfo,
  MemoryInfo,
  GPUInfo,
  MotherboardInfo,
  BatteryInfo,
  NetworkInterfaceInfo,
  SystemInfo,
  TemperatureInfo,
  CurrentLoadInfo,
  MemData,
  DiskIOData,
  NetworkStats
} from '../../shared/types'

export async function getOSInfo(): Promise<OSInfo> {
  const data = await si.osInfo()
  return {
    platform: data.platform,
    distro: data.distro,
    release: data.release,
    codename: data.codename,
    kernel: data.kernel,
    arch: data.arch,
    hostname: data.hostname,
    codepage: data.codepage,
    logofile: data.logofile,
    serial: data.serial,
    build: data.build,
    servicepack: data.servicepack,
    uefi: data.uefi || false
  }
}

export async function getCPUInfo(): Promise<CPUInfo> {
  const data = await si.cpu()
  return {
    manufacturer: data.manufacturer,
    brand: data.brand,
    vendor: data.vendor,
    family: data.family,
    model: data.model,
    stepping: data.stepping,
    revision: data.revision,
    voltage: data.voltage,
    speed: data.speed,
    speedMin: data.speedMin,
    speedMax: data.speedMax,
    governor: data.governor,
    cores: data.cores,
    physicalCores: data.physicalCores,
    performanceCores: data.performanceCores || 0,
    efficiencyCores: data.efficiencyCores || 0,
    processors: data.processors,
    socket: data.socket,
    flags: data.flags,
    virtualization: data.virtualization,
    cache: {
      l1d: data.cache.l1d,
      l1i: data.cache.l1i,
      l2: data.cache.l2,
      l3: data.cache.l3
    }
  }
}

export async function getMemoryInfo(): Promise<MemoryInfo> {
  const data = await si.mem()
  return {
    total: data.total,
    free: data.free,
    used: data.total - data.available,
    active: data.active,
    available: data.available,
    swapTotal: data.swaptotal,
    swapUsed: data.swapused,
    swapFree: data.swapfree
  }
}

export async function getGPUInfo(): Promise<GPUInfo[]> {
  const data = await si.graphics()
  return data.controllers.map((ctrl) => ({
    vendor: ctrl.vendor || '',
    model: ctrl.model,
    bus: ctrl.bus || '',
    vram: ctrl.vram || null,
    vramDynamic: ctrl.vramDynamic || false
  }))
}

export async function getMotherboard(): Promise<MotherboardInfo> {
  const [system, bios, baseboard] = await Promise.all([
    si.system(),
    si.bios(),
    si.baseboard()
  ])
  return {
    manufacturer: system.manufacturer,
    model: system.model,
    version: system.version,
    serial: system.serial,
    uuid: system.uuid,
    bios: {
      vendor: bios.vendor,
      version: bios.version,
      releaseDate: bios.releaseDate,
      revision: bios.revision
    }
  }
}

export async function getBatteryInfo(): Promise<BatteryInfo | null> {
  try {
    const data = await si.battery()
    if (!data.hasBattery) return null
    return {
      hasBattery: data.hasBattery,
      cycleCount: data.cycleCount,
      isCharging: data.isCharging,
      designedCapacity: data.designedCapacity,
      maxCapacity: data.maxCapacity,
      currentCapacity: data.currentCapacity,
      voltage: data.voltage,
      capacityUnit: data.capacityUnit,
      percent: data.percent,
      timeRemaining: data.timeRemaining,
      type: data.type,
      model: data.model,
      manufacturer: data.manufacturer,
      serial: data.serial
    }
  } catch {
    return null
  }
}

export async function getNetworkInfo(): Promise<NetworkInterfaceInfo[]> {
  const data = await si.networkInterfaces()
  return data.map((iface) => ({
    iface: iface.iface,
    ifaceName: iface.ifaceName,
    ip4: iface.ip4,
    ip4subnet: iface.ip4subnet,
    ip6: iface.ip6,
    ip6subnet: iface.ip6subnet,
    mac: iface.mac,
    internal: iface.internal,
    virtual: iface.virtual,
    operstate: iface.operstate,
    type: iface.type,
    duplex: iface.duplex,
    mtu: iface.mtu ?? null,
    speed: iface.speed ?? null,
    dhcp: iface.dhcp,
    dnsSuffix: iface.dnsSuffix,
    ieee8021xAuth: iface.ieee8021xAuth,
    ieee8021xState: iface.ieee8021xState,
    carrierChanges: iface.carrierChanges
  }))
}

export async function getFullSystemInfo(): Promise<SystemInfo> {
  const [os, cpu, memory, gpu, motherboard, battery, network] = await Promise.all([
    getOSInfo(),
    getCPUInfo(),
    getMemoryInfo(),
    getGPUInfo(),
    getMotherboard(),
    getBatteryInfo(),
    getNetworkInfo()
  ])
  return { os, cpu, memory, gpu, motherboard, battery, network }
}

// Realtime data
export async function getCurrentLoad(): Promise<CurrentLoadInfo> {
  return si.currentLoad() as unknown as CurrentLoadInfo
}

export async function getMemData(): Promise<MemData> {
  const data = await si.mem()
  return {
    total: data.total,
    free: data.free,
    used: data.total - data.available,
    active: data.active,
    available: data.available,
    swapTotal: data.swaptotal,
    swapUsed: data.swapused,
    swapFree: data.swapfree
  }
}

export async function getDiskIO(): Promise<DiskIOData | null> {
  try {
    return (await si.disksIO()) as unknown as DiskIOData
  } catch {
    return null
  }
}

export async function getNetworkStats(): Promise<NetworkStats[]> {
  const data = await si.networkStats()
  return data.map((ns) => ({
    iface: ns.iface,
    operstate: ns.operstate,
    rx_bytes: ns.rx_bytes,
    rx_dropped: ns.rx_dropped,
    rx_errors: ns.rx_errors,
    tx_bytes: ns.tx_bytes,
    tx_dropped: ns.tx_dropped,
    tx_errors: ns.tx_errors,
    rx_sec: ns.rx_sec ?? null,
    tx_sec: ns.tx_sec ?? null,
    ms: ns.ms
  }))
}

export async function getTemperature(): Promise<TemperatureInfo | null> {
  try {
    const data = await si.cpuTemperature()
    if (data.main === -1) return null
    return {
      main: data.main,
      cores: data.cores || [],
      max: data.max,
      socket: data.socket || [],
      chipset: data.chipset ?? null
    }
  } catch {
    return null
  }
}
