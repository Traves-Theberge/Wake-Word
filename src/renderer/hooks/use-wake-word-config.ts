import { useState, useEffect, useCallback } from 'react'

interface WakeWordConfig {
  apiKey: string
  setApiKey: (value: string) => void
  enableCursor: boolean
  setEnableCursor: (value: boolean) => void
  enableClaude: boolean
  setEnableClaude: (value: boolean) => void
  enableVSCode: boolean
  setEnableVSCode: (value: boolean) => void
  enableBlackbox: boolean
  setEnableBlackbox: (value: boolean) => void
}

interface TestConnectionParams {
  apiKey: string
}

interface TestConnectionResult {
  success: boolean
  error?: string
}

interface TestKeywordResult {
  exists: boolean
  path?: string
}

interface SaveConfigParams {
  apiKey: string
  enableCursor?: boolean
  enableClaude?: boolean
  enableVSCode?: boolean
  enableBlackbox?: boolean
}

interface SaveConfigResult {
  success: boolean
  error?: string
}

interface UseWakeWordConfigReturn {
  config: WakeWordConfig
  isLoading: boolean
  testConnection: (params: TestConnectionParams) => Promise<TestConnectionResult>
  testKeyword: () => Promise<TestKeywordResult>
  saveConfig: (params: SaveConfigParams) => Promise<SaveConfigResult>
  isTestingConnection: boolean
  isTestingKeyword: boolean
  isSaving: boolean
}

// Mock IPC for development - will be replaced with actual Electron IPC
const mockIPC = {
  send: (channel: string, ...args: any[]) => {
    console.log(`IPC Send: ${channel}`, args)
  },
  on: (channel: string, _callback: (...args: any[]) => void) => {
    console.log(`IPC Listen: ${channel}`)
  },
  invoke: async (channel: string, ...args: any[]): Promise<any> => {
    console.log(`IPC Invoke: ${channel}`, args)
    
    // Mock responses for development
    switch (channel) {
      case 'get-config':
        return { picovoiceAccessKey: '' }
      case 'test-api-key':
        return { success: true }
      case 'test-keyword':
        return { exists: true, path: '/mock/path' }
      case 'save-config':
        return { success: true }
      default:
        return { success: false, error: 'Unknown channel' }
    }
  }
}

// Use mock IPC if window.electronAPI is not available (development)
const ipc = (window as any).electronAPI || mockIPC

export function useWakeWordConfig(): UseWakeWordConfigReturn {
  const [apiKey, setApiKey] = useState('')
  const [enableCursor, setEnableCursor] = useState(true)
  const [enableClaude, setEnableClaude] = useState(true)
  const [enableVSCode, setEnableVSCode] = useState(false)
  const [enableBlackbox, setEnableBlackbox] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [isTestingKeyword, setIsTestingKeyword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load initial configuration
  useEffect(() => {
    async function loadConfig() {
      try {
        setIsLoading(true)
        const config = await ipc.invoke('get-config')
        setApiKey(config?.picovoiceAccessKey || '')
        setEnableCursor(config?.enableCursor ?? true)
        setEnableClaude(config?.enableClaude ?? true)
        setEnableVSCode(config?.enableVSCode ?? false)
        setEnableBlackbox(config?.enableBlackbox ?? false)
      } catch (error) {
        console.error('Failed to load config:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [])

  const testConnection = useCallback(async ({ apiKey }: TestConnectionParams): Promise<TestConnectionResult> => {
    if (!apiKey.trim()) {
      return { success: false, error: 'API key is required' }
    }

    try {
      setIsTestingConnection(true)
      const result = await ipc.invoke('test-api-key', apiKey.trim())
      return result
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    } finally {
      setIsTestingConnection(false)
    }
  }, [])

  const testKeyword = useCallback(async (): Promise<TestKeywordResult> => {
    try {
      setIsTestingKeyword(true)
      const result = await ipc.invoke('test-keyword')
      return result
    } catch (error) {
      return { exists: false }
    } finally {
      setIsTestingKeyword(false)
    }
  }, [])

  const saveConfig = useCallback(async ({ apiKey, enableCursor, enableClaude, enableVSCode, enableBlackbox }: SaveConfigParams): Promise<SaveConfigResult> => {
    if (!apiKey.trim()) {
      return { success: false, error: 'API key is required' }
    }

    try {
      setIsSaving(true)
      const result = await ipc.invoke('save-config', { 
        picovoiceAccessKey: apiKey.trim(),
        enableCursor: enableCursor,
        enableClaude: enableClaude,
        enableVSCode: enableVSCode,
        enableBlackbox: enableBlackbox
      })
      return result
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to save configuration' 
      }
    } finally {
      setIsSaving(false)
    }
  }, [])

  return {
    config: {
      apiKey,
      setApiKey,
      enableCursor,
      setEnableCursor,
      enableClaude,
      setEnableClaude,
      enableVSCode,
      setEnableVSCode,
      enableBlackbox,
      setEnableBlackbox
    },
    isLoading,
    testConnection,
    testKeyword,
    saveConfig,
    isTestingConnection,
    isTestingKeyword,
    isSaving
  }
} 