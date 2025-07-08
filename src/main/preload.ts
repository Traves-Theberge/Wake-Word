import { contextBridge, ipcRenderer } from 'electron'

// Define the API interface
interface ElectronAPI {
  invoke: (channel: string, ...args: any[]) => Promise<any>
  send: (channel: string, ...args: any[]) => void
  on: (channel: string, callback: (...args: any[]) => void) => void
  removeAllListeners: (channel: string) => void
}

// Whitelist of allowed IPC channels
const allowedChannels = [
  'get-config',
  'save-config',
  'test-api-key',
  'test-keyword',
  'start-listening',
  'stop-listening',
  'get-listening-state',
  'toggle-listening',
  'listening-state-changed',
  'window-close',
  'window-minimize',
  'window-maximize'
]

// Create the secure API
const electronAPI: ElectronAPI = {
  invoke: (channel: string, ...args: any[]) => {
    if (allowedChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args)
    }
    throw new Error(`Channel '${channel}' is not allowed`)
  },
  
  send: (channel: string, ...args: any[]) => {
    if (allowedChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args)
    } else {
      throw new Error(`Channel '${channel}' is not allowed`)
    }
  },
  
  on: (channel: string, callback: (...args: any[]) => void) => {
    if (allowedChannels.includes(channel)) {
      ipcRenderer.on(channel, (_, ...args) => callback(...args))
    } else {
      throw new Error(`Channel '${channel}' is not allowed`)
    }
  },
  
  removeAllListeners: (channel: string) => {
    if (allowedChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel)
    } else {
      throw new Error(`Channel '${channel}' is not allowed`)
    }
  }
}

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// Type declaration for TypeScript
declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
} 