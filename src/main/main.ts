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

// Set application name for Task Manager and system
app.setName('Wake Word Detector')

// Set process title for Task Manager
process.title = 'Wake Word Detector'

// Set app user model ID for Windows taskbar grouping and identification
if (process.platform === 'win32') {
  app.setAppUserModelId('com.travestheberge.wakeworddetector')
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
let isQuitting = false

const isDev = process.env.NODE_ENV === 'development'
const isPackaged = app.isPackaged
const isStartupLaunch = process.argv.includes('--startup')

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
      return
    }

    this.config = loadConfig()
    if (!this.config.picovoiceAccessKey) {
      throw new Error('Picovoice access key not configured')
    }

    try {
      // Initialize Porcupine with the Hey Claude keyword
      let keywordPath: string
      
      if (isPackaged) {
        // Try multiple possible locations for packaged app
        const possiblePaths = [
          join(process.resourcesPath, 'keywords/hey-claude.ppn'), // electron-packager
          join(__dirname, '../../keywords/hey-claude.ppn'), // relative from main process
          join(process.cwd(), 'keywords/hey-claude.ppn'), // current working directory
          join(process.execPath, '../keywords/hey-claude.ppn'), // relative to executable
          join(process.execPath, '../../keywords/hey-claude.ppn'), // one level up from executable
        ]
        
        keywordPath = possiblePaths.find(path => existsSync(path)) || possiblePaths[0]
      } else {
        keywordPath = join(__dirname, '../../keywords/hey-claude.ppn')
      }
      
      if (!existsSync(keywordPath)) {
        throw new Error(`Hey Claude keyword file not found. Tried: ${keywordPath}`)
      }

      this.porcupine = new Porcupine(
        this.config.picovoiceAccessKey,
        [keywordPath],
        [0.5] // Sensitivity (0.0 to 1.0)
      )

      // Initialize recorder
      this.recorder = new PvRecorder(this.porcupine.frameLength, -1) // -1 for default device
      this.recorder.start()

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
      return
    }

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
      
      // If neither command is enabled, do nothing
      if (!enableCursor && !enableClaude) {
        return
      }

      // Execute commands in Windows shell so they run side-by-side
      const spawnCursorCommand = () => {
        // Execute cursor command silently for production
        try {
          // Try direct spawn first (most reliable)
          const cursorPath = `${process.env.LOCALAPPDATA}\\Programs\\cursor\\Cursor.exe`
          
          const directChild = spawn(cursorPath, [], {
            detached: true,
            stdio: 'ignore'
          })
          
          directChild.on('error', () => {
            // Fallback to PowerShell method if direct spawn fails
            const psChild = spawn('powershell', [
              '-WindowStyle', 'Hidden',
              '-ExecutionPolicy', 'Bypass',
              '-Command',
              'Start-Process -FilePath "$env:LOCALAPPDATA\\Programs\\cursor\\Cursor.exe" -WindowStyle Normal'
            ], {
              detached: true,
              stdio: 'ignore'
            })
            
            psChild.on('error', () => {
              // Final fallback: Try VS Code
              try {
                const codeChild = spawn('code', [], {
                  detached: true,
                  stdio: 'ignore'
                })
                codeChild.unref()
              } catch {
                // Silent failure - no editors available
              }
            })
            
            psChild.unref()
          })
          
          directChild.unref()
          
        } catch {
          // Silent failure for production
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
          
        } catch (error) {
          // Fallback: Try simpler WSL command
          try {
            const fallbackChild = spawn('cmd', ['/c', 'start', 'wt', 'wsl', 'claude'], {
              detached: true,
              stdio: 'ignore'
            })
            fallbackChild.unref()
          } catch {
            // Silent failure
          }
        }
      }

            if (enableClaude) {
        // Execute Claude command first
        spawnClaudeCommand()
      }

      if (enableCursor) {
        // Launch Cursor command with slight delay to avoid interference
        setTimeout(() => {
          spawnCursorCommand()
        }, 500)
      }
    } catch (error) {
      // Only show fallback if at least one option is enabled
      const enableCursor = this.config.enableCursor ?? true
      const enableClaude = this.config.enableClaude ?? true
      
      if (enableCursor || enableClaude) {
        // Fallback: Try using cmd to start Windows Terminal
        try {
          const fallbackChild = spawn('cmd', ['/c', 'start', 'wt', 'wsl'], {
            detached: true,
            stdio: 'ignore'
          })
          fallbackChild.unref()
        } catch {
          // Silent failure
        }
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
    title: 'Wake Word Detector - Settings',
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
      let iconPath: string
      
      if (isPackaged) {
        // Try multiple possible locations for packaged app
        const possiblePaths = [
          join(process.resourcesPath, 'assets/app_small.ico'), // electron-packager
          join(__dirname, '../../assets/app_small.ico'), // relative from main process
          join(process.cwd(), 'assets/app_small.ico'), // current working directory
          join(process.execPath, '../assets/app_small.ico'), // relative to executable
          join(process.execPath, '../../assets/app_small.ico'), // one level up from executable
        ]
        
        iconPath = possiblePaths.find(path => existsSync(path)) || possiblePaths[0]
      } else {
        iconPath = join(__dirname, '../../assets/app_small.ico')
      }
      
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
    // Dev tools can be opened manually if needed
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
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
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
  let basePath: string
  
  if (isPackaged) {
    // Try multiple possible locations for packaged app
    const possibleBasePaths = [
      join(process.resourcesPath, 'assets'), // electron-packager
      join(__dirname, '../../assets'), // relative from main process
      join(process.cwd(), 'assets'), // current working directory
      join(process.execPath, '../assets'), // relative to executable
      join(process.execPath, '../../assets'), // one level up from executable
    ]
    
    basePath = possibleBasePaths.find(path => {
      const testFile = join(path, 'Green.ico')
      return existsSync(testFile)
    }) || possibleBasePaths[0]
  } else {
    basePath = join(__dirname, '../../assets')
  }
  
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
  let windowIconPath: string
  
  if (isPackaged) {
    const possiblePaths = [
      join(process.resourcesPath, 'assets/app_small.ico'),
      join(__dirname, '../../assets/app_small.ico'),
      join(process.cwd(), 'assets/app_small.ico'),
      join(process.execPath, '../assets/app_small.ico'),
      join(process.execPath, '../../assets/app_small.ico'),
    ]
    windowIconPath = possiblePaths.find(path => existsSync(path)) || possiblePaths[0]
  } else {
    windowIconPath = join(__dirname, '../../assets/app_small.ico')
  }
  
  const requiredIcons = [
    {
      name: 'Window Icon',
      path: windowIconPath
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
    if (!existsSync(path)) {
      console.error(`❌ ${name} MISSING: ${path}`)
      allIconsValid = false
    } else {
      console.log(`✅ ${name} found: ${path}`)
    }
  })
  
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
      click: async () => {
        isQuitting = true
        
        // Stop wake word detection first
        try {
          if (detector.isListening) {
            await detector.stop()
          }
        } catch (error) {
          console.error('Error stopping detector during quit:', error)
        }
        
        // Close all windows
        if (mainWindow) {
          mainWindow.destroy()
          mainWindow = null
        }
        
        // Destroy tray
        if (tray) {
          tray.destroy()
          tray = null
        }
        
        // Force quit the application
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
  // Debug: Log environment information
  console.log('🔍 Environment Debug Info:')
  console.log('  isDev:', isDev)
  console.log('  isPackaged:', isPackaged)
  console.log('  __dirname:', __dirname)
  console.log('  process.cwd():', process.cwd())
  console.log('  process.execPath:', process.execPath)
  console.log('  process.resourcesPath:', process.resourcesPath)
  console.log('  app.getAppPath():', app.getAppPath())
  
  // Verify icon assets before creating tray
  const iconsValid = verifyIconAssets()
  console.log('🎨 Icons validation result:', iconsValid)
  
  createTray()
  
  // Auto-start listening on app launch
  try {
    await detector.start()
  } catch (error) {
    console.error('Could not auto-start listening:', error)
  }
  
  // Don't show window on startup launch (launched from Windows startup)
  if (!isStartupLaunch) {
    // Only create window if not launched from startup
    // User can access via tray icon
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
  // Allow quitting on all platforms when tray quit is used
  if (process.platform !== 'darwin' || isQuitting) {
    app.quit()
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
    let keywordPath: string
    
    if (isPackaged) {
      const possiblePaths = [
        join(process.resourcesPath, 'keywords/hey-claude.ppn'),
        join(__dirname, '../../keywords/hey-claude.ppn'),
        join(process.cwd(), 'keywords/hey-claude.ppn'),
        join(process.execPath, '../keywords/hey-claude.ppn'),
        join(process.execPath, '../../keywords/hey-claude.ppn'),
      ]
      keywordPath = possiblePaths.find(path => existsSync(path)) || possiblePaths[0]
    } else {
      keywordPath = join(__dirname, '../../keywords/hey-claude.ppn')
    }
    
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
app.on('before-quit', async (event) => {
  if (!isQuitting) {
    // Only prevent quit if not intentionally quitting
    event.preventDefault()
    return
  }
  
  // Clean shutdown when intentionally quitting
  try {
    if (detector.isListening) {
      await detector.stop()
    }
  } catch (error) {
    console.error('Error during shutdown cleanup:', error)
  }
})

// Handle app quit - final cleanup
app.on('will-quit', (event) => {
  if (!isQuitting) {
    // Prevent accidental quit, hide to tray instead
    event.preventDefault()
    if (mainWindow) {
      mainWindow.hide()
    }
  }
  // If isQuitting is true, allow normal quit process
}) 