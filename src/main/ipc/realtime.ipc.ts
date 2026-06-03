import { ipcMain, BrowserWindow } from 'electron'
import { IPC_CHANNELS } from '../../shared/constants'
import { pollingEngine } from '../services/realtime.service'
import type { RealtimeSnapshot } from '../../shared/types'

// Track callbacks per webContents ID to handle re-subscription on navigation
const callbackMap = new Map<number, (snapshot: RealtimeSnapshot) => void>()

export function registerRealtimeIpc(): void {
  ipcMain.on(IPC_CHANNELS.REALTIME_SUBSCRIBE, (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) return

    const webContentsId = event.sender.id

    // Remove existing callback for this webContents if any
    const existingCallback = callbackMap.get(webContentsId)
    if (existingCallback) {
      pollingEngine.unsubscribe(existingCallback)
    }

    // Create new callback
    const callback = (snapshot: RealtimeSnapshot): void => {
      if (!win.isDestroyed()) {
        win.webContents.send(IPC_CHANNELS.REALTIME_UPDATE, snapshot)
      }
    }

    callbackMap.set(webContentsId, callback)
    pollingEngine.subscribe(callback)

    // Clean up when window closes
    win.on('closed', () => {
      const cb = callbackMap.get(webContentsId)
      if (cb) {
        pollingEngine.unsubscribe(cb)
        callbackMap.delete(webContentsId)
      }
    })
  })

  ipcMain.on(IPC_CHANNELS.REALTIME_UNSUBSCRIBE, (event) => {
    const webContentsId = event.sender.id
    const cb = callbackMap.get(webContentsId)
    if (cb) {
      pollingEngine.unsubscribe(cb)
      callbackMap.delete(webContentsId)
    }
  })
}
