import { create } from 'zustand'
import type { RealtimeSnapshot, TimeSeriesPoint } from '@shared/types'

const MAX_HISTORY = 120 // 4 minutes at 2s interval

interface RealtimeState {
  latest: RealtimeSnapshot | null
  history: RealtimeSnapshot[]

  // Derived time series
  cpuHistory: TimeSeriesPoint[]
  memoryHistory: TimeSeriesPoint[]
  diskReadHistory: TimeSeriesPoint[]
  diskWriteHistory: TimeSeriesPoint[]
  netDownloadHistory: TimeSeriesPoint[]
  netUploadHistory: TimeSeriesPoint[]
  temperatureHistory: TimeSeriesPoint[]

  isRunning: boolean
  unsubscribe: (() => void) | null

  // Actions
  pushSnapshot: (snapshot: RealtimeSnapshot) => void
  start: () => void
  stop: () => void
  clear: () => void
}

export const useRealtimeStore = create<RealtimeState>((set, get) => ({
  latest: null,
  history: [],
  cpuHistory: [],
  memoryHistory: [],
  diskReadHistory: [],
  diskWriteHistory: [],
  netDownloadHistory: [],
  netUploadHistory: [],
  temperatureHistory: [],
  isRunning: false,
  unsubscribe: null,

  pushSnapshot: (snapshot) => {
    const state = get()
    const history = [...state.history, snapshot].slice(-MAX_HISTORY)

    // Build time series
    const toTimeSeries = (value: number): TimeSeriesPoint => ({
      timestamp: snapshot.timestamp,
      value
    })

    set({
      latest: snapshot,
      history,
      cpuHistory: [...state.cpuHistory, toTimeSeries(snapshot.cpu.total)].slice(-MAX_HISTORY),
      memoryHistory: [...state.memoryHistory, toTimeSeries(snapshot.memory.usedPercent)].slice(-MAX_HISTORY),
      diskReadHistory: snapshot.diskIO
        ? [...state.diskReadHistory, toTimeSeries(snapshot.diskIO.rIO_sec ?? 0)].slice(-MAX_HISTORY)
        : state.diskReadHistory,
      diskWriteHistory: snapshot.diskIO
        ? [...state.diskWriteHistory, toTimeSeries(snapshot.diskIO.wIO_sec ?? 0)].slice(-MAX_HISTORY)
        : state.diskWriteHistory,
      netDownloadHistory: [
        ...state.netDownloadHistory,
        toTimeSeries(
          snapshot.network
            .filter((n) => !n.iface.startsWith('lo'))
            .reduce((sum, n) => sum + (n.rx_sec ?? 0), 0)
        )
      ].slice(-MAX_HISTORY),
      netUploadHistory: [
        ...state.netUploadHistory,
        toTimeSeries(
          snapshot.network
            .filter((n) => !n.iface.startsWith('lo'))
            .reduce((sum, n) => sum + (n.tx_sec ?? 0), 0)
        )
      ].slice(-MAX_HISTORY),
      temperatureHistory: snapshot.temperature
        ? [...state.temperatureHistory, toTimeSeries(snapshot.temperature.main)].slice(-MAX_HISTORY)
        : state.temperatureHistory
    })
  },

  start: () => {
    if (get().isRunning) return
    const unsub = window.api.subscribeRealtime((snapshot) => {
      get().pushSnapshot(snapshot)
    })
    set({ isRunning: true, unsubscribe: unsub })
  },

  stop: () => {
    const { unsubscribe } = get()
    if (unsubscribe) {
      unsubscribe()
    }
    set({ isRunning: false, unsubscribe: null })
  },

  clear: () => {
    set({
      latest: null,
      history: [],
      cpuHistory: [],
      memoryHistory: [],
      diskReadHistory: [],
      diskWriteHistory: [],
      netDownloadHistory: [],
      netUploadHistory: [],
      temperatureHistory: []
    })
  }
}))
