import { create } from 'zustand'
import type { DiskScanProgress, DiskScanResult } from '@shared/types'

interface DiskAnalysisState {
  isScanning: boolean
  progress: DiskScanProgress | null
  result: DiskScanResult | null
  error: string | null
  selectedPath: string

  // Actions
  startScan: (path: string) => void
  cancelScan: () => void
  setProgress: (progress: DiskScanProgress) => void
  setResult: (result: DiskScanResult) => void
  setError: (error: string | null) => void
  setSelectedPath: (path: string) => void
  reset: () => void
}

export const useDiskAnalysisStore = create<DiskAnalysisState>((set, get) => ({
  isScanning: false,
  progress: null,
  result: null,
  error: null,
  selectedPath: '/',

  startScan: (path) => {
    // Clean up previous listeners
    const state = get()
    // Reset state
    set({
      isScanning: true,
      progress: null,
      result: null,
      error: null,
      selectedPath: path
    })

    window.api.startDiskScan(path)

    // Set up progress listener
    const unsubProgress = window.api.onDiskScanProgress((progress) => {
      set({ progress })
    })

    // Set up complete listener
    const unsubComplete = window.api.onDiskScanComplete((result) => {
      if (result.error) {
        set({
          isScanning: false,
          error: result.error,
          progress: null,
          result: null
        })
      } else {
        set({
          isScanning: false,
          result,
          error: null,
          progress: null
        })
      }
      unsubProgress()
      unsubComplete()
    })

    // Store cleanup functions
    ;(window as unknown as Record<string, unknown>).__diskScanCleanup = {
      unsubProgress,
      unsubComplete
    }
  },

  cancelScan: () => {
    window.api.cancelDiskScan()
    const cleanup = (window as unknown as Record<string, unknown>).__diskScanCleanup as {
      unsubProgress: () => void
      unsubComplete: () => void
    } | undefined
    if (cleanup) {
      cleanup.unsubProgress()
      cleanup.unsubComplete()
    }
    set({ isScanning: false, progress: null })
  },

  setProgress: (progress) => set({ progress }),
  setResult: (result) => set({ result, isScanning: false }),
  setError: (error) => set({ error, isScanning: false }),
  setSelectedPath: (path) => set({ selectedPath: path }),
  reset: () =>
    set({
      isScanning: false,
      progress: null,
      result: null,
      error: null
    })
}))
