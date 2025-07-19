import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, shell } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { Porcupine } from '@picovoice/porcupine-node'
import { PvRecorder } from '@picovoice/pvrecorder-node'
import { spawn } from 'child_process'

// Suppress security warnings in development
if (process.env.NODE_ENV === 'development') {
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
}

// Disable hardware acceleration to prevent GPU process crashes
app.disableHardwareAcceleration()

// Additional GPU stability flags
app.commandLine.appendSwitch('disable-gpu-sandbox')
app.commandLine.appendSwitch('disable-software-rasterizer')
app.commandLine.appendSwitch('disable-background-timer-throttling')
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows')
app.commandLine.appendSwitch('disable-renderer-backgrounding')

// Keep a global reference of the window object
let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

const isDev = process.env.NODE_ENV === 'development'
const isPackaged = app.isPackaged

interface Config {
  picovoiceAccessKey?: string
  enableCursor?: boolean
  enableClaude?: boolean
}

interface WakeWordDetector {
  start: () => Promise<void>
  stop: () => Promise<void>
  isListening: boolean
}

// Enhanced wake word detector with state management
class EnhancedWakeWordDetector implements WakeWordDetector {
  private _isListening = false // Default to not listening state
  private config: Config = {}
  private porcupine: Porcupine | null = null
  private recorder: PvRecorder | null = null
  private detectionLoop: NodeJS.Timeout | null = null

  get isListening(): boolean {
    return this._isListening
  }

  async start(): Promise<void> {
    if (this._isListening) {
      console.log('🎤 Already listening for "Hey Claude"')
      return
    }

    this.config = loadConfig()
    if (!this.config.picovoiceAccessKey) {
      throw new Error('Picovoice access key not configured')
    }

    console.log('📋 Config loaded:', { 
      hasApiKey: !!this.config.picovoiceAccessKey, 
      enableCursor: this.config.enableCursor ?? true,
      enableClaude: this.config.enableClaude ?? true
    })

    try {
      // Initialize Porcupine with the Hey Claude keyword
      const keywordPath = isPackaged 
        ? join(process.resourcesPath, 'keywords/hey-claude.ppn')
        : join(__dirname, '../../keywords/hey-claude.ppn')
      if (!existsSync(keywordPath)) {
        throw new Error('Hey Claude keyword file not found')
      }

      this.porcupine = new Porcupine(
        this.config.picovoiceAccessKey,
        [keywordPath],
        [0.5] // Sensitivity (0.0 to 1.0)
      )

      // Initialize recorder
      this.recorder = new PvRecorder(this.porcupine.frameLength, -1) // -1 for default device
      this.recorder.start()

      console.log('🎤 Starting to listen for "Hey Claude"')
      this._isListening = true
      
      // Start detection loop
      this.startDetectionLoop()
      
      // Update tray icon and menu
      updateTrayIcon()
      
      // Notify renderer if window exists
      if (mainWindow) {
        mainWindow.webContents.send('listening-state-changed', this._isListening)
      }
    } catch (error) {
      console.error('Failed to start wake word detection:', error)
      this.cleanup()
      throw error
    }
  }

  async stop(): Promise<void> {
    if (!this._isListening) {
      console.log('🔇 Already stopped listening')
      return
    }

    console.log('🔇 Stopped listening for wake words')
    this._isListening = false
    
    this.cleanup()
    
    // Update tray icon and menu
    updateTrayIcon()
    
    // Notify renderer if window exists
    if (mainWindow) {
      mainWindow.webContents.send('listening-state-changed', this._isListening)
    }
  }

  private startDetectionLoop(): void {
    if (!this.porcupine || !this.recorder) return

    const processAudio = async () => {
      if (!this._isListening || !this.porcupine || !this.recorder) return

      try {
        const audioFrame = await this.recorder.read()
        const keywordIndex = this.porcupine.process(audioFrame)
        
        if (keywordIndex !== -1) {
          console.log('🎤 Wake word detected! Opening WSL terminal...')
          this.onWakeWordDetected()
        }
      } catch (error) {
        console.error('Error processing audio:', error)
      }

      // Continue processing if still listening
      if (this._isListening) {
        this.detectionLoop = setTimeout(processAudio, 10) // 10ms interval
      }
    }

    processAudio()
  }

  private onWakeWordDetected(): void {
    try {
      // Reload config to get latest settings
      this.config = loadConfig()
      const enableCursor = this.config.enableCursor ?? true
      const enableClaude = this.config.enableClaude ?? true
      
      console.log('🎤 Wake word detected!')
      console.log('📊 Current settings:', { enableCursor, enableClaude })
      
      // If neither command is enabled, do nothing
      if (!enableCursor && !enableClaude) {
        console.log('⚠️ Both cursor and claude are disabled - no action taken')
        return
      }

      // Execute commands in Windows shell so they run side-by-side
      const spawnCursorCommand = () => {
        // Execute cursor command silently in background using PowerShell
        try {
          console.log('🔧 Starting Cursor...')
          
          // Use PowerShell to start cursor in background (but visible so it actually opens)
          const cursorChild = spawn('powershell', [
            '-Command',
            `
            Write-Host "Starting cursor execution...";
            try {
              # Try simple cursor command (no arguments - just like C:\Users\trave>cursor)
              Start-Process -FilePath "cursor" -WindowStyle Normal;
              Write-Host "Cursor started successfully";
            } catch {
              # Fallback to VS Code if cursor not found
              try {
                Start-Process -FilePath "code" -WindowStyle Normal;
                Write-Host "VS Code started as fallback";
              } catch {
                Write-Host "Neither cursor nor code found in PATH";
              }
            }
            `
          ], {
            detached: false,
            stdio: 'inherit'
          })
          
          cursorChild.on('exit', (code) => {
            console.log(`✅ Cursor command completed with exit code: ${code}`)
          })
          
          console.log('✅ Cursor opened')
          
        } catch (error) {
          console.error('❌ Failed to execute cursor command:', error)
        }
      }

      const spawnClaudeCommand = () => {
        // Open WSL terminal and directly execute claude command
        try {
          // Use Windows Terminal to open WSL and directly execute the claude command
          const terminalChild = spawn('cmd', ['/c', 'start', 'wt', 'wsl', '-e', 'bash', '-c', 'claude'], {
            detached: true,
            stdio: 'ignore'
          })
          terminalChild.unref()
          
          console.log('✅ Claude terminal opened')
          
        } catch (error) {
          console.error('❌ Failed to open WSL terminal:', error)
          
          // Fallback: Try simpler WSL command
          try {
            console.log('🔧 Trying fallback WSL approach...')
            const fallbackChild = spawn('cmd', ['/c', 'start', 'wt', 'wsl', 'claude'], {
              detached: true,
              stdio: 'ignore'
            })
            fallbackChild.unref()
            console.log('✅ WSL terminal opened with fallback claude command')
          } catch (fallbackError) {
            console.error('❌ Fallback also failed:', fallbackError)
          }
        }
      }

            if (enableClaude) {
        // Execute Claude command first
        console.log('🎯 Opening Claude terminal...')
        spawnClaudeCommand()
      }

      if (enableCursor) {
        // Launch Cursor command with slight delay to avoid interference
        console.log('🎯 Opening Cursor (500ms delay)...')
        setTimeout(() => {
          spawnCursorCommand()
        }, 500)
      }
    } catch (error) {
      console.error('Failed to execute wake word actions:', error)
      
      // Only show fallback if at least one option is enabled
      const enableCursor = this.config.enableCursor ?? true
      const enableClaude = this.config.enableClaude ?? true
      
      if (enableCursor || enableClaude) {
        // Fallback: Try using cmd to start Windows Terminal
        try {
          const fallbackCommand = 'cmd'
          const fallbackArgs = [
            '/c', 
            'start', 
            'wt', 
            'wsl', 
            '--', 
            'bash', 
            '-c', 
            'cd ~ && exec bash'
          ]
          
          const fallbackChild = spawn(fallbackCommand, fallbackArgs, {
            detached: true,
            stdio: 'ignore'
          })
          
          fallbackChild.unref()
          console.log('✅ WSL terminal opened (fallback)')
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
        }
      } else {
        console.log('⚠️ Both cursor and claude are disabled - no fallback action taken')
      }
    }
  }

  private cleanup(): void {
    if (this.detectionLoop) {
      clearTimeout(this.detectionLoop)
      this.detectionLoop = null
    }

    if (this.recorder) {
      try {
        this.recorder.stop()
        this.recorder.release()
      } catch (error) {
        console.error('Error stopping recorder:', error)
      }
      this.recorder = null
    }

    if (this.porcupine) {
      try {
        this.porcupine.release()
      } catch (error) {
        console.error('Error releasing Porcupine:', error)
      }
      this.porcupine = null
    }
  }
}

let detector = new EnhancedWakeWordDetector()

// Configuration file path
const configPath = join(homedir(), '.wake-word-detector.json')

function loadConfig(): Config {
  try {
    if (existsSync(configPath)) {
      const data = readFileSync(configPath, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Failed to load config:', error)
  }
  return {}
}

function saveConfig(config: Config): void {
  try {
    writeFileSync(configPath, JSON.stringify(config, null, 2))
  } catch (error) {
    console.error('Failed to save config:', error)
    throw error
  }
}

function createWindow(): void {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 650,
    height: 750,
    minWidth: 550,
    minHeight: 650,
    maxWidth: 850,
    maxHeight: 950,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
      backgroundThrottling: false, // Prevent background throttling
      offscreen: false,
    },
    icon: (() => {
      const iconPath = isPackaged 
        ? join(process.resourcesPath, 'assets/app_small.ico')
        : join(__dirname, '../../assets/app_small.ico')
      
      if (!existsSync(iconPath)) {
        console.warn(`⚠️ Warning: Window icon not found at: ${iconPath}`)
      }
      
      return iconPath
    })(),
    frame: false, // Remove default title bar
    titleBarStyle: 'hidden',
    show: false, // Don't show immediately
    autoHideMenuBar: true,
    resizable: false, // Fixed size for container-only view
    alwaysOnTop: false,
    skipTaskbar: false,
    transparent: true, // Make window transparent
    backgroundColor: '#00000000', // Transparent background
    roundedCorners: true,
    // Fix for background flickering issues
    paintWhenInitiallyHidden: false,
  })

  // Set Content Security Policy - only in production
  if (!isDev) {
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      const csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; object-src 'none'; base-uri 'self';"
      
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [csp]
        }
      })
    })
  } else {
    // In development, completely disable CSP warnings
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders
        }
      })
    })
  }

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    // Open dev tools to debug UI issues
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })

  // Handle window closed - don't quit app, just hide to tray
  mainWindow.on('close', (event) => {
    event.preventDefault()
    mainWindow?.hide()
  })
  
  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Prevent black background flickering when minimizing/restoring
  mainWindow.on('minimize', () => {
    // Prevent background issues during minimize
    if (mainWindow) {
      mainWindow.setSkipTaskbar(false)
    }
  })

  mainWindow.on('restore', () => {
    // Ensure proper restoration
    if (mainWindow) {
      mainWindow.setSkipTaskbar(false)
      mainWindow.focus()
    }
  })

  mainWindow.on('show', () => {
    // Ensure background is properly rendered when showing
    if (mainWindow) {
      mainWindow.focus()
    }
  })

  mainWindow.on('hide', () => {
    // Clean up when hiding
    if (mainWindow) {
      mainWindow.setSkipTaskbar(true)
    }
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

// Create tray icons for different states
function createTrayIcons() {
  const basePath = isPackaged 
    ? join(process.resourcesPath, 'assets')
    : join(__dirname, '../../assets')
  
  const iconPaths = {
    listening: join(basePath, 'Green.ico'),
    stopped: join(basePath, 'Red.ico')
  }
  
  // Validate that icon files exist
  Object.entries(iconPaths).forEach(([state, iconPath]) => {
    if (!existsSync(iconPath)) {
      console.warn(`⚠️ Warning: Tray icon for ${state} state not found at: ${iconPath}`)
    }
  })
  
  return iconPaths
}

const trayIcons = createTrayIcons()

// Icon verification function
function verifyIconAssets(): boolean {
  console.log('🔍 Verifying icon assets...')
  
  const requiredIcons = [
    {
      name: 'Window Icon',
      path: isPackaged 
        ? join(process.resourcesPath, 'assets/app_small.ico')
        : join(__dirname, '../../assets/app_small.ico')
    },
    {
      name: 'Tray Listening Icon',
      path: trayIcons.listening
    },
    {
      name: 'Tray Stopped Icon', 
      path: trayIcons.stopped
    }
  ]
  
  let allIconsValid = true
  
  requiredIcons.forEach(({ name, path }) => {
    if (existsSync(path)) {
      console.log(`✅ ${name}: ${path}`)
    } else {
      console.error(`❌ ${name} MISSING: ${path}`)
      allIconsValid = false
    }
  })
  
  if (allIconsValid) {
    console.log('✅ All icon assets verified successfully')
  } else {
    console.error('❌ Some icon assets are missing - application may not display correctly')
  }
  
  return allIconsValid
}

function updateTrayIcon(): void {
  if (!tray) return
  
  const iconPath = detector.isListening ? trayIcons.listening : trayIcons.stopped
  
  // Verify icon file exists before setting
  if (existsSync(iconPath)) {
    tray.setImage(iconPath)
  } else {
    console.error(`❌ Tray icon not found: ${iconPath}`)
    // Use a fallback or create a simple icon programmatically
  }
  
  tray.setToolTip(`Wake Word Detector - ${detector.isListening ? 'Listening' : 'Stopped'}`)
  
  // Update menu
  updateTrayMenu()
}

function updateTrayMenu(): void {
  if (!tray) return
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Wake Word Detector',
      type: 'normal',
      enabled: false,
    },
    { type: 'separator' },
    {
      label: detector.isListening ? '🔴 Stop Listening' : '🟢 Start Listening',
      type: 'normal',
      click: async () => {
        try {
          if (detector.isListening) {
            await detector.stop()
          } else {
            await detector.start()
          }
        } catch (error) {
          console.error('Failed to toggle listening state:', error)
          // Show error in tray tooltip temporarily
          tray?.setToolTip(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
          setTimeout(() => updateTrayIcon(), 3000)
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Open Settings',
      type: 'normal',
      click: () => {
        if (mainWindow) {
          mainWindow.show()
          mainWindow.focus()
        } else {
          createWindow()
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      type: 'normal',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)
}

function createTray(): void {
  // Create initial tray with listening state (green)
  tray = new Tray(trayIcons.listening)

  // Left click opens settings
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show()
      mainWindow.focus()
    } else {
      createWindow()
    }
  })

  // Initialize tray state
  updateTrayIcon()
}

// App event handlers
app.whenReady().then(async () => {
  // Verify icon assets before creating tray
  verifyIconAssets()
  
  createTray()
  
  // Auto-start listening on app launch
  try {
    await detector.start()
    console.log('🎤 Auto-started listening for "Hey Claude"')
  } catch (error) {
    console.log('⚠️ Could not auto-start listening:', error)
  }
  
  // Create window if no other windows are open (macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Don't quit, just hide to tray
  }
})

// Security: Prevent new window creation
app.on('web-contents-created', (_, contents) => {
  contents.setWindowOpenHandler(() => {
    return { action: 'deny' }
  })
})

// IPC Handlers
ipcMain.handle('get-config', async (): Promise<Config> => {
  return loadConfig()
})

ipcMain.handle('save-config', async (_, config: Config): Promise<{ success: boolean; error?: string }> => {
  try {
    saveConfig(config)
    
    // Auto-start listening after saving config
    if (config.picovoiceAccessKey && !detector.isListening) {
      await detector.start()
    }
    
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save config' 
    }
  }
})

ipcMain.handle('test-api-key', async (_, apiKey: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // In development, always return success
    if (isDev) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      return { success: true }
    }

    // TODO: Implement actual Picovoice API key validation
    // For now, just check if it's a reasonable length
    if (!apiKey || apiKey.length < 20) {
      return { success: false, error: 'API key appears to be invalid' }
    }

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to test API key' 
    }
  }
})

ipcMain.handle('test-keyword', async (): Promise<{ exists: boolean; path?: string }> => {
  try {
    const keywordPath = isPackaged 
      ? join(process.resourcesPath, 'keywords/hey-claude.ppn')
      : join(__dirname, '../../keywords/hey-claude.ppn')
    const exists = existsSync(keywordPath)
    
    return { exists, path: exists ? keywordPath : undefined }
  } catch (error) {
    return { exists: false }
  }
})

ipcMain.handle('get-listening-state', async (): Promise<{ isListening: boolean }> => {
  return { isListening: detector.isListening }
})

ipcMain.handle('start-listening', async (): Promise<{ success: boolean; error?: string }> => {
  try {
    await detector.start()
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to start listening' 
    }
  }
})

ipcMain.handle('stop-listening', async (): Promise<{ success: boolean; error?: string }> => {
  try {
    await detector.stop()
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to stop listening' 
    }
  }
})

ipcMain.handle('toggle-listening', async (): Promise<{ success: boolean; isListening: boolean; error?: string }> => {
  try {
    if (detector.isListening) {
      await detector.stop()
    } else {
      await detector.start()
    }
    return { success: true, isListening: detector.isListening }
  } catch (error) {
    return { 
      success: false, 
      isListening: detector.isListening,
      error: error instanceof Error ? error.message : 'Failed to toggle listening state' 
    }
  }
})

// Window control handlers
ipcMain.handle('window-close', async () => {
  if (mainWindow) {
    mainWindow.hide() // Hide to tray instead of closing
  }
})

ipcMain.handle('window-minimize', async () => {
  if (mainWindow) {
    mainWindow.minimize()
  }
})

ipcMain.handle('window-maximize', async () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  }
})

// Handle app closing
app.on('before-quit', async () => {
  if (detector.isListening) {
    await detector.stop()
  }
})

// Handle app quit
app.on('will-quit', async (event) => {
  if (detector.isListening) {
    event.preventDefault()
    await detector.stop()
    app.quit()
  }
}) 