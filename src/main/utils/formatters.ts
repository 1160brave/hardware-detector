/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

/**
 * Format bits per second to human-readable string
 */
export function formatBitsPerSec(bits: number): string {
  if (bits === 0) return '0 bps'
  const k = 1000
  const sizes = ['bps', 'Kbps', 'Mbps', 'Gbps']
  const i = Math.floor(Math.log(bits) / Math.log(k))
  return parseFloat((bits / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Format bytes per second for disk I/O
 */
export function formatBytesPerSec(bytes: number): string {
  if (bytes < 0) return '0 B/s'
  if (bytes === 0) return '0 B/s'
  const k = 1024
  const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * Format MHz/GHz
 */
export function formatSpeed(speedGHz: number): string {
  if (speedGHz >= 1) {
    return speedGHz.toFixed(2) + ' GHz'
  }
  return (speedGHz * 1000).toFixed(0) + ' MHz'
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
  return value.toFixed(1) + '%'
}

/**
 * Format duration in seconds
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return Math.round(seconds) + '秒'
  if (seconds < 3600) return Math.round(seconds / 60) + '分'
  return (seconds / 3600).toFixed(1) + '小时'
}
