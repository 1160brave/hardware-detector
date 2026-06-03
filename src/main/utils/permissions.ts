import { access, constants } from 'fs/promises'
import { join } from 'path'
import { homedir } from 'os'
import si from 'systeminformation'

/**
 * Check if the app has Full Disk Access permission
 * Try to read the TCC database path which requires FDA
 */
export async function checkFullDiskAccess(): Promise<boolean> {
  try {
    await access('/Library/Application Support/com.apple.TCC/TCC.db', constants.R_OK)
    return true
  } catch {
    // Also try user-level TCC
    try {
      // Try to access protected directory
      await access(join(homedir(), 'Library/Application Support/com.apple.TCC'), constants.R_OK)
      return true
    } catch {
      return false
    }
  }
}

/**
 * Check if temperature sensor is available on this system
 */
export async function checkTemperatureSensor(): Promise<boolean> {
  try {
    const temp = await si.cpuTemperature()
    return temp.main !== -1
  } catch {
    return false
  }
}
