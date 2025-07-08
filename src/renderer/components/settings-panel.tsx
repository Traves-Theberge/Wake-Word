import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWakeWordConfig } from '@/hooks/use-wake-word-config'

interface SettingsPanelProps {}

export function SettingsPanel({}: SettingsPanelProps) {
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
  const [testButtonState, setTestButtonState] = useState<'normal' | 'success' | 'error'>('normal')
  const [saveButtonState, setSaveButtonState] = useState<'normal' | 'success' | 'error'>('normal')


  const handleSaveConfig = async () => {
    setSaveButtonState('normal')
    try {
      const result = await saveConfig({ 
        apiKey: config.apiKey,
        enableCursor: config.enableCursor,
        enableClaude: config.enableClaude 
      })
      setSaveButtonState(result.success ? 'success' : 'error')
      setTimeout(() => setSaveButtonState('normal'), 2000)
    } catch (error) {
      setSaveButtonState('error')
      setTimeout(() => setSaveButtonState('normal'), 2000)
    }
  }

  const handleTestKey = async () => {
    if (!config.apiKey.trim()) {
      return
    }

    setTestButtonState('normal')
    try {
      const result = await testConnection({ apiKey: config.apiKey })
      setTestButtonState(result.success ? 'success' : 'error')
      setTimeout(() => setTestButtonState('normal'), 2000)
    } catch (error) {
      setTestButtonState('error')
      setTimeout(() => setTestButtonState('normal'), 2000)
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Main Settings Card */}
      <div className="te-card">
        {/* Listening Status */}
        <div className="text-center mb-8">
          <motion.button
            onClick={handleToggleListening}
            disabled={isToggling || !config.apiKey.trim()}
            className="te-button-primary mb-6 te-no-drag"
            animate={{
              backgroundColor: isListening ? '#dc2626' : '#ff6b35',
            }}
            whileHover={{
              backgroundColor: isListening ? '#b91c1c' : '#e55a2b',
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isToggling ? (
              <>
                <div className="te-spinner w-4 h-4 mr-2" />
                {isListening ? 'Stopping...' : 'Starting...'}
              </>
            ) : (
              <>
                {isListening ? 'Stop Listening' : 'Start Listening'}
              </>
            )}
          </motion.button>
        </div>
        
        <div className="te-form-group">
          <label className="te-label" htmlFor="apiKey">
            Access Key
          </label>
          <div className="relative">
            <input
              id="apiKey"
              type={showApiKey ? "text" : "password"}
              value={config.apiKey}
              onChange={(e) => config.setApiKey(e.target.value)}
              placeholder="Enter your Picovoice access key"
              className="te-input pr-16 te-no-drag"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-te-muted hover:text-te-text transition-colors duration-200 te-no-drag"
              aria-label={showApiKey ? "Hide API key" : "Show API key"}
            >
              {showApiKey ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <p className="te-help-text">
            Get your free API key from{' '}
            <a 
              href="https://console.picovoice.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-te-orange hover:text-te-orange-dark font-medium underline te-no-drag"
            >
              Picovoice Console
            </a>
          </p>
        </div>

        <div className="te-form-group">
          <div className="text-center mb-4">
            <span className="text-te-text font-medium text-xl">Command Options</span>
          </div>
          
          <div className="flex items-center justify-center gap-8">
            {/* Cursor Toggle */}
            <label className="flex items-center gap-3 cursor-pointer te-no-drag">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={config.enableCursor}
                  onChange={(e) => config.setEnableCursor(e.target.checked)}
                  className="sr-only te-no-drag"
                />
                <div className={`w-6 h-6 rounded border-2 transition-all duration-300 ${
                  config.enableCursor 
                    ? 'bg-te-orange border-te-orange' 
                    : 'bg-te-surface border-te-border hover:border-te-orange'
                }`}>
                  {config.enableCursor && (
                    <svg 
                      className="w-4 h-4 text-white absolute top-0.5 left-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-te-text font-medium text-lg">
                Cursor
              </span>
            </label>

            {/* Claude Toggle */}
            <label className="flex items-center gap-3 cursor-pointer te-no-drag">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={config.enableClaude}
                  onChange={(e) => config.setEnableClaude(e.target.checked)}
                  className="sr-only te-no-drag"
                />
                <div className={`w-6 h-6 rounded border-2 transition-all duration-300 ${
                  config.enableClaude 
                    ? 'bg-te-orange border-te-orange' 
                    : 'bg-te-surface border-te-border hover:border-te-orange'
                }`}>
                  {config.enableClaude && (
                    <svg 
                      className="w-4 h-4 text-white absolute top-0.5 left-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-te-text font-medium text-lg">
                Claude
              </span>
            </label>
          </div>
          

        </div>

        <div className="flex gap-4 justify-center">
          <motion.button
            onClick={handleTestKey}
            disabled={isTestingConnection || !config.apiKey.trim()}
            className={`te-button-secondary flex-1 max-w-xs te-no-drag ${
              testButtonState === 'success' ? 'bg-green-600 text-white' : 
              testButtonState === 'error' ? 'bg-red-600 text-white' : ''
            }`}
            animate={{
              backgroundColor: testButtonState === 'success' ? '#16a34a' : 
                             testButtonState === 'error' ? '#dc2626' : undefined,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isTestingConnection ? (
              <>
                <div className="te-spinner w-4 h-4 mr-2" />
                Testing...
              </>
            ) : testButtonState === 'success' ? (
              <>
                <span className="mr-2">✅</span>
                Valid
              </>
            ) : testButtonState === 'error' ? (
              <>
                <span className="mr-2">❌</span>
                Invalid
              </>
            ) : (
              'Test Key'
            )}
          </motion.button>
          
          <motion.button
            onClick={handleSaveConfig}
            disabled={!config.apiKey.trim() || isSaving}
            className={`te-button-primary flex-1 max-w-xs te-no-drag ${
              saveButtonState === 'success' ? 'bg-green-600' : 
              saveButtonState === 'error' ? 'bg-red-600' : ''
            }`}
            animate={{
              backgroundColor: saveButtonState === 'success' ? '#16a34a' : 
                             saveButtonState === 'error' ? '#dc2626' : undefined,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {isSaving ? (
              <>
                <div className="te-spinner w-4 h-4 mr-2" />
                Saving...
              </>
            ) : saveButtonState === 'success' ? (
              <>
                <span className="mr-2">✅</span>
                Saved
              </>
            ) : saveButtonState === 'error' ? (
              <>
                <span className="mr-2">❌</span>
                Failed
              </>
            ) : (
              'Save Configuration'
            )}
          </motion.button>
        </div>

        {/* Removed popup messages */}
      </div>



      {/* Removed error popup messages */}
    </motion.div>
  )
} 