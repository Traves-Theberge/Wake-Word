# Claude Wake Word Detector - Native Build

A voice-activated application that listens for "Hey Claude" and executes commands to open development tools.

## Quick Start

### 1. Build the Native Application
```bash
npm run dist
```

This will create a native Windows executable in `release/Claude Wake Word Detector-win32-x64/`

### 2. Run the Application

**Option A: Use the Launcher Script**
```bash
Start-Claude-Wake-Word-Detector.bat
```

**Option B: Run Directly**
```bash
cd "release/Claude Wake Word Detector-win32-x64"
./Claude-Wake-Word-Detector.exe
```

## Development

### Development Mode
```bash
npm run dev
```

### Build Only (without packaging)
```bash
npm run build
```

### Clean Build Files
```bash
npm run clean
```

## Features

- ✅ Voice activation with "Hey Claude" wake word
- ✅ System tray integration with visual indicators
- ✅ Opens Cursor IDE and Claude CLI in WSL
- ✅ Professional dark theme UI
- ✅ Configurable settings panel
- ✅ Native Windows executable

## File Structure

```
release/
└── Claude Wake Word Detector-win32-x64/
    ├── Claude-Wake-Word-Detector.exe    # Main executable
    ├── resources/                       # App resources
    └── [other electron runtime files]
```

## Requirements

- Node.js 18+
- Windows 10/11
- Microphone access
- Picovoice API key (for wake word detection)

## Usage

1. Run the application
2. Configure your Picovoice API key in settings
3. Enable desired commands (Cursor/Claude CLI)
4. Say "Hey Claude" to activate
5. Check system tray for status indicators (green=listening, red=stopped) 