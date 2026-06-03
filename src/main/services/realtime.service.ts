import type {
  RealtimeSnapshot,
  NetworkStats
} from '../../shared/types'
import {
  getCurrentLoad,
  getMemData,
  getDiskIO,
  getNetworkStats,
  getTemperature
} from './system.service'

type SubscriberCallback = (snapshot: RealtimeSnapshot) => void

class PollingEngine {
  private interval: NodeJS.Timeout | null = null
  private subscribers: Set<SubscriberCallback> = new Set()
  private pollIntervalMs = 2000
  private previousNetworkStats: NetworkStats[] = []

  subscribe(callback: SubscriberCallback): void {
    this.subscribers.add(callback)
    if (this.subscribers.size === 1) {
      this.start()
    }
  }

  unsubscribe(callback: SubscriberCallback): void {
    this.subscribers.delete(callback)
    if (this.subscribers.size === 0) {
      this.stop()
    }
  }

  private start(): void {
    if (this.interval) return
    // Fetch initial data immediately
    this.poll()
    this.interval = setInterval(() => this.poll(), this.pollIntervalMs)
  }

  private stop(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.previousNetworkStats = []
  }

  private async poll(): Promise<void> {
    try {
      const [cpu, memory, diskIO, network, temperature] = await Promise.all([
        getCurrentLoad(),
        getMemData(),
        getDiskIO(),
        getNetworkStats(),
        getTemperature()
      ])

      const snapshot: RealtimeSnapshot = {
        timestamp: Date.now(),
        cpu: {
          total: cpu.currentLoad,
          user: cpu.currentLoadUser,
          system: cpu.currentLoadSystem,
          idle: cpu.currentLoadIdle,
          cores: cpu.cpus.map((c) => c.load)
        },
        memory: {
          used: memory.used,
          free: memory.free,
          total: memory.total,
          usedPercent: memory.total > 0 ? (memory.used / memory.total) * 100 : 0,
          swapUsed: memory.swapUsed,
          swapTotal: memory.swapTotal
        },
        diskIO,
        network,
        temperature
      }

      // Notify all subscribers
      for (const callback of this.subscribers) {
        try {
          callback(snapshot)
        } catch {
          // Ignore individual subscriber errors
        }
      }
    } catch {
      // Silently ignore poll errors — next poll will try again
    }
  }

  get subscriberCount(): number {
    return this.subscribers.size
  }
}

export const pollingEngine = new PollingEngine()
