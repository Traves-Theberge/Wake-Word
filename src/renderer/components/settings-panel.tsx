import { useState } from 'react'
import { useWakeWordConfig } from '@/hooks/use-wake-word-config'

// Mock IPC for development
const mockIPC = {
  invoke: async (channel: string): Promise<any> => {
    console.log(`IPC Invoke: ${channel}`)
    return { success: true }
  }
}

const ipc = (window as any).electronAPI || mockIPC

export function SettingsPanel() {
  const { 
    config, 
    isLoading, 
    testConnection, 
    saveConfig, 
    isTestingConnection, 
    isSaving 
  } = useWakeWordConfig()
  const [isListening, setIsListening] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [buttonStates, setButtonStates] = useState<{
    test: 'normal' | 'success' | 'error'
    save: 'normal' | 'success' | 'error'
  }>({ test: 'normal', save: 'normal' })


  const handleSaveConfig = async () => {
    setButtonStates(prev => ({ ...prev, save: 'normal' }))
    try {
      const result = await saveConfig({ 
        apiKey: config.apiKey,
        enableCursor: config.enableCursor,
        enableClaude: config.enableClaude,
        enableVSCode: config.enableVSCode,
        enableBlackbox: config.enableBlackbox 
      })
      setButtonStates(prev => ({ ...prev, save: result.success ? 'success' : 'error' }))
      setTimeout(() => setButtonStates(prev => ({ ...prev, save: 'normal' })), 2000)
    } catch (error) {
      setButtonStates(prev => ({ ...prev, save: 'error' }))
      setTimeout(() => setButtonStates(prev => ({ ...prev, save: 'normal' })), 2000)
    }
  }

  const handleTestKey = async () => {
    if (!config.apiKey.trim()) {
      return
    }

    setButtonStates(prev => ({ ...prev, test: 'normal' }))
    try {
      const result = await testConnection({ apiKey: config.apiKey })
      setButtonStates(prev => ({ ...prev, test: result.success ? 'success' : 'error' }))
      setTimeout(() => setButtonStates(prev => ({ ...prev, test: 'normal' })), 2000)
    } catch (error) {
      setButtonStates(prev => ({ ...prev, test: 'error' }))
      setTimeout(() => setButtonStates(prev => ({ ...prev, test: 'normal' })), 2000)
    }
  }

  const handleToggleListening = async () => {
    if (!config.apiKey.trim()) {
      return
    }

    setIsToggling(true)

    try {
      const ipc = (window as any).electronAPI
      const result = await ipc.invoke('toggle-listening')
      
      if (result.success) {
        setIsListening(result.isListening)
      }
    } catch (error) {
      // Silent error handling
    } finally {
      setIsToggling(false)
    }
  }

  // Load initial listening state
  useState(() => {
    const loadListeningState = async () => {
      try {
        const ipc = (window as any).electronAPI
        if (ipc) {
          const result = await ipc.invoke('get-listening-state')
          setIsListening(result.isListening)
          
          // Listen for state changes
          ipc.on('listening-state-changed', (newState: boolean) => {
            setIsListening(newState)
          })
        }
      } catch (error) {
        console.error('Failed to load listening state:', error)
      }
    }
    
    loadListeningState()
  })

  if (isLoading) {
    return (
      <div className="te-card">
        <div className="flex items-center justify-center py-12">
          <div className="te-spinner" />
          <span className="ml-3 text-te-muted">Loading configuration...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="te-card">
      {/* Close button */}
      <button 
        className="te-close-btn"
        onClick={() => ipc.invoke('window-close')}
        title="Close"
      >
        <svg width="12" height="12" viewBox="0 0 14 14">
          <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Start/Stop Button */}
      <div className="text-center" style={{ marginTop: '0.25rem' }}>
        <button
          onClick={handleToggleListening}
          disabled={isToggling || !config.apiKey.trim()}
          className={`te-button ${isListening ? 'te-button-stop' : 'te-button-start'}`}
        >
          {isToggling ? 'Processing...' : isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
      </div>
      
      {/* Access Key */}
      <div className="te-form-group">
        <label className="te-label" htmlFor="apiKey">Access Key</label>
        <div style={{ position: 'relative' }}>
          <input
            id="apiKey"
            type={showApiKey ? "text" : "password"}
            value={config.apiKey}
            onChange={(e) => config.setApiKey(e.target.value)}
            placeholder="Enter your Picovoice access key"
            className="te-input te-no-drag"
            style={{ paddingRight: '2rem' }}
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
          >
            {showApiKey ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        <p className="te-help-text">
          Get your free API key from{' '}
          <a href="https://console.picovoice.ai/" target="_blank" rel="noopener noreferrer" className="text-te-orange te-no-drag" style={{ textDecoration: 'underline' }}>
            Picovoice Console
          </a>
        </p>
      </div>

      {/* Command Options */}
      <div className="te-form-group">
        <div className="te-label">Command Options</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <label className="te-checkbox-container te-no-drag">
            <div className={`te-checkbox ${config.enableCursor ? 'checked' : ''}`}>
              {config.enableCursor && <svg className="te-checkbox-icon" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
            </div>
            <input type="checkbox" checked={config.enableCursor} onChange={(e) => config.setEnableCursor(e.target.checked)} style={{ display: 'none' }} />
            <span className="te-checkbox-label">Cursor</span>
          </label>
          <label className="te-checkbox-container te-no-drag">
            <div className={`te-checkbox ${config.enableVSCode ? 'checked' : ''}`}>
              {config.enableVSCode && <svg className="te-checkbox-icon" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
            </div>
            <input type="checkbox" checked={config.enableVSCode} onChange={(e) => config.setEnableVSCode(e.target.checked)} style={{ display: 'none' }} />
            <span className="te-checkbox-label">VS Code</span>
          </label>
          <label className="te-checkbox-container te-no-drag">
            <div className={`te-checkbox ${config.enableClaude ? 'checked' : ''}`}>
              {config.enableClaude && <svg className="te-checkbox-icon" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
            </div>
            <input type="checkbox" checked={config.enableClaude} onChange={(e) => config.setEnableClaude(e.target.checked)} style={{ display: 'none' }} />
            <span className="te-checkbox-label">Claude</span>
          </label>
          <label className="te-checkbox-container te-no-drag">
            <div className={`te-checkbox ${config.enableBlackbox ? 'checked' : ''}`}>
              {config.enableBlackbox && <svg className="te-checkbox-icon" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
            </div>
            <input type="checkbox" checked={config.enableBlackbox} onChange={(e) => config.setEnableBlackbox(e.target.checked)} style={{ display: 'none' }} />
            <span className="te-checkbox-label">Blackbox</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button
          onClick={handleTestKey}
          disabled={isTestingConnection || !config.apiKey.trim()}
          className={`te-button te-button-secondary te-no-drag ${buttonStates.test === 'success' ? 'te-button-success' : buttonStates.test === 'error' ? 'te-button-error' : ''}`}
        >
          {isTestingConnection ? 'Testing...' : buttonStates.test === 'success' ? '✅ Valid' : buttonStates.test === 'error' ? '❌ Invalid' : 'Test Key'}
        </button>
        <button
          onClick={handleSaveConfig}
          disabled={!config.apiKey.trim() || isSaving}
          className={`te-button te-button-primary te-no-drag ${buttonStates.save === 'success' ? 'te-button-success' : buttonStates.save === 'error' ? 'te-button-error' : ''}`}
        >
          {isSaving ? 'Saving...' : buttonStates.save === 'success' ? '✅ Saved' : buttonStates.save === 'error' ? '❌ Failed' : 'Save'}
        </button>
      </div>

      {/* Version */}
      <p className="te-help-text" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
        Version {__APP_VERSION__}
      </p>
    </div>
  )
} 