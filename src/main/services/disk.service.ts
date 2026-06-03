import si from 'systeminformation'
import type { DiskLayoutInfo, DiskUsageInfo, BlockDeviceInfo } from '../../shared/types'

export async function getDiskLayout(): Promise<DiskLayoutInfo[]> {
  const data = await si.diskLayout()
  return data.map((disk) => ({
    device: disk.device,
    type: disk.type,
    name: disk.name,
    vendor: disk.vendor,
    size: disk.size,
    bytesPerSector: disk.bytesPerSector || 0,
    totalCylinders: disk.totalCylinders || 0,
    totalHeads: disk.totalHeads || 0,
    totalSectors: disk.totalSectors || 0,
    totalTracks: disk.totalTracks || 0,
    tracksPerCylinder: disk.tracksPerCylinder || 0,
    sectorsPerTrack: disk.sectorsPerTrack || 0,
    firmwareRevision: disk.firmwareRevision,
    serialNum: disk.serialNum,
    interfaceType: disk.interfaceType || '',
    smartStatus: disk.smartStatus,
    temperature: disk.temperature ?? null
  }))
}

export async function getDiskUsage(): Promise<DiskUsageInfo[]> {
  const data = await si.fsSize()
  return data.map((fs) => ({
    fs: fs.fs,
    type: fs.type,
    size: fs.size,
    used: fs.used,
    available: fs.available,
    use: fs.use,
    mount: fs.mount,
    rw: fs.rw || false
  }))
}

export async function getBlockDevices(): Promise<BlockDeviceInfo[]> {
  const data = await si.blockDevices()
  return data.map((bd) => ({
    name: bd.name,
    identifier: bd.identifier || '',
    type: bd.type,
    fsType: bd.fsType,
    mount: bd.mount,
    size: bd.size,
    physical: bd.physical,
    uuid: bd.uuid,
    label: bd.label || '',
    model: bd.model,
    serial: bd.serial,
    removable: bd.removable,
    protocol: bd.protocol,
    group: bd.group || '',
    device: bd.device
  }))
}
