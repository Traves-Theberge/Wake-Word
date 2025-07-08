# Claude Wake Word Detector

A highly configurable voice-activated wake word detection application that listens for "Hey Claude" and executes customizable commands, including opening terminals, launching applications, or running complex workflows.

## ✅ Status: Production Ready

The application is fully functional with reliable wake word detection and command execution. Say "Hey Claude" to instantly open both Cursor IDE and a WSL terminal with Claude CLI ready to use.

## Features

- 🎤 **Voice Activation**: Say "Hey Claude" to trigger configurable actions
- 🖥️ **System Tray**: Runs quietly in the background with tray icon controls
- ⚙️ **Settings Panel**: Easy configuration of API keys and sensitivity
- 🔄 **Start/Stop Control**: Toggle listening on/off from the tray menu
- 🎯 **Test Mode**: Test wake word detection without triggering actions
- 📦 **Easy Installation**: Professional Windows installer with uninstaller
- 🔧 **Multiple Executions**: Execute multiple commands with one wake word
- 🌐 **WSL & Native Support**: Run commands in WSL or native Windows
- ⏱️ **Delayed Execution**: Add delays between multiple commands
- 📂 **Working Directory Control**: Set custom working directories

## Installation

### For End Users

1. Download the latest `Claude-Wake-Word-Detector-Setup.exe` from releases
2. Run the installer and follow the setup wizard
3. Launch the application from Start Menu or Desktop shortcut
4. Configure your Picovoice API key in Settings
5. Click "Start Listening" to begin voice detection

### For Developers

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the application: `npm run build`
4. Run in development: `npm run dev`
5. Build installer: `npm run build-installer-win`

## Configuration

### Picovoice API Key

1. Get a free API key from [Picovoice Console](https://console.picovoice.ai/)
2. Open the application settings (right-click tray icon → Settings)
3. Enter your API key and save

### Environment Variables Configuration

Create a `.env` file in the project root or set environment variables:

#### Basic Configuration
```bash
# Required: Your Picovoice API key
PICOVOICE_ACCESS_KEY=your_key_here

# Basic settings
USE_WSL=true                    # Use WSL for commands (default: true)
TERMINAL_TITLE=Claude Assistant # Terminal window title
DEFAULT_COMMAND=claude          # Default command to execute
WORKING_DIRECTORY=/path/to/dir  # Set working directory
ENABLE_FALLBACK=true           # Enable fallback mode (default: true)
```

#### Multiple Executions
Execute multiple commands when "hey claude" is detected:

```bash
# Execution 1: Open Claude in WSL
EXECUTION_1_COMMAND=claude
EXECUTION_1_USE_WSL=true
EXECUTION_1_TITLE=Claude Assistant
EXECUTION_1_DELAY=0

# Execution 2: Open VS Code
EXECUTION_2_COMMAND=code .
EXECUTION_2_USE_WSL=false
EXECUTION_2_TITLE=VS Code
EXECUTION_2_DELAY=1000

# Execution 3: Start development server
EXECUTION_3_COMMAND=npm start
EXECUTION_3_USE_WSL=true
EXECUTION_3_WORKING_DIRECTORY=/home/user/project
EXECUTION_3_DELAY=2000
```

#### Advanced Options
```bash
# Custom script content (use \n for line breaks)
CUSTOM_SCRIPT_CONTENT=#!/bin/bash\nclear\necho "Custom!"\nclaude

# Audio device selection
AUDIO_DEVICE_INDEX=0
```

### Configuration Help

Run `npm run dev-console --help` to see all available configuration options and examples.

### Wake Word Sensitivity

Adjust the sensitivity slider in Settings:
- **Lower values** = fewer false positives, may miss some detections
- **Higher values** = more sensitive, may trigger accidentally

## How It Works

1. **Wake Word Detection**: Uses Picovoice Porcupine engine with trained "hey-claude.ppn" model
2. **Voice Processing**: Continuously monitors microphone input for the phrase "Hey Claude"
3. **Terminal Integration**: When detected, creates a bash script in WSL `/tmp/` directory
4. **Claude Activation**: Opens Windows Terminal with new WSL tab running Claude CLI
5. **Ready to Use**: Claude is immediately available for conversation

## System Requirements

- Windows 10/11 with WSL installed
- Node.js 16+ (for development)
- Microphone access
- Windows Terminal (recommended) or Command Prompt
- Claude CLI installed in WSL environment

## Usage

### Tray Menu Options

- **Start/Stop Listening**: Toggle wake word detection
- **Settings**: Configure API key and sensitivity
- **Test Wake Word**: Simulate detection for testing
- **Quit**: Exit the application

### Voice Commands

Simply say **"Hey Claude"** clearly when the application is listening. The configured actions will execute based on your environment settings.

## Configuration Examples

### Example 1: Default Behavior (Claude + Editor)
```bash
PICOVOICE_ACCESS_KEY=your_key_here
# No EXECUTION_X variables needed - automatically runs:
# 1. Claude in WSL (immediate)
# 2. Editor after 1 second (cursor by default)

# To use a different editor:
EDITOR_COMMAND=code        # VS Code
# or
EDITOR_COMMAND=notepad     # Windows Notepad (always available)
```

### Example 2: Custom Development Workflow
```bash
PICOVOICE_ACCESS_KEY=your_key_here

# Open Claude
EXECUTION_1_COMMAND=claude
EXECUTION_1_USE_WSL=true
EXECUTION_1_TITLE=Claude Assistant

# Open Cursor IDE after 1 second
EXECUTION_2_COMMAND=cursor
EXECUTION_2_USE_WSL=false
EXECUTION_2_DELAY=1000

# Start development server after 3 seconds
EXECUTION_3_COMMAND=npm run dev
EXECUTION_3_USE_WSL=true
EXECUTION_3_WORKING_DIRECTORY=/home/user/my-project
EXECUTION_3_DELAY=3000
```

### Example 3: Full Stack Development
```bash
PICOVOICE_ACCESS_KEY=your_key_here

# Start database
EXECUTION_1_COMMAND=docker-compose up -d postgres
EXECUTION_1_USE_WSL=true
EXECUTION_1_WORKING_DIRECTORY=/home/user/my-app

# Start backend server
EXECUTION_2_COMMAND=npm run server
EXECUTION_2_USE_WSL=true
EXECUTION_2_WORKING_DIRECTORY=/home/user/my-app/backend
EXECUTION_2_DELAY=2000

# Start frontend
EXECUTION_3_COMMAND=npm run dev
EXECUTION_3_USE_WSL=true
EXECUTION_3_WORKING_DIRECTORY=/home/user/my-app/frontend
EXECUTION_3_DELAY=4000

# Open VS Code
EXECUTION_4_COMMAND=code .
EXECUTION_4_USE_WSL=false
EXECUTION_4_WORKING_DIRECTORY=/home/user/my-app
EXECUTION_4_DELAY=1000

# Open browser
EXECUTION_5_COMMAND=start http://localhost:3000
EXECUTION_5_USE_WSL=false
EXECUTION_5_DELAY=8000
```

## Troubleshooting

### Common Issues

1. **"Configuration Required" Error**
   - Open Settings and enter your Picovoice API key

2. **"Keyword File Missing" Error**
   - Ensure `hey-claude.ppn` exists in the keywords folder
   - Reinstall the application if missing

3. **Wake Word Not Detected**
   - Check microphone permissions
   - Increase sensitivity in Settings
   - Speak clearly and at normal volume
   - Ensure background noise is minimal

4. **Terminal Doesn't Open**
   - Verify WSL is installed and working
   - Check that Claude CLI is installed in WSL
   - Try using Command Prompt as fallback

5. **"Command Not Found" Error (ENOENT)**
   - The default editor (cursor) is not installed
   - Set `EDITOR_COMMAND=code` for VS Code
   - Set `EDITOR_COMMAND=notepad` for Windows Notepad (always available)
   - Or install Cursor IDE from https://cursor.sh

### Logs and Debugging

- Use "View Logs" in Settings for detailed information
- Test connection to verify API key validity
- Use "Test Wake Word" to simulate detection

## Development

### Project Structure

```
src/
├── tray-app.ts          # Main Electron tray application
├── configurable-wake-detector.ts  # Wake word detection logic
├── config.ts            # Configuration management
└── index.ts             # Base detector class

ui/
└── settings.html        # Settings panel interface

keywords/
└── hey-claude.ppn       # Trained wake word model
```

### Building

```bash
# Development
npm run dev                 # Run in development mode
npm run dev-console        # Run console version

# Production
npm run build              # Build TypeScript
npm run start              # Run built Electron app
npm run build-installer    # Create installer
```

## License

MIT License - see LICENSE file for details.

## Author

Traves Theberge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review existing GitHub issues
3. Create a new issue with details about your problem 