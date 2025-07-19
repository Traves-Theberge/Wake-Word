# Claude Wake Word Detector 🎤

A professional Windows desktop application that listens for the "Hey Claude" wake word and executes customizable commands. Built with Electron, React, and TypeScript.

## ✨ Features

- **Voice Wake Word Detection** - Listen for "Hey Claude" wake word
- **System Tray Integration** - Background operation with tray controls
- **Settings Panel** - Configure API keys and sensitivity
- **Professional UI** - Modern dark theme with glassmorphism design
- **Start/Stop Control** - Toggle listening on/off
- **Test Mode** - Test wake word detection without triggering actions
- **Multiple Command Execution** - Execute multiple commands with one wake word
- **WSL Integration** - Run commands in WSL or native Windows
- **Delayed Execution** - Add delays between multiple commands
- **Working Directory Control** - Set custom working directories

## 🚀 Quick Start

### For End Users

1. **Download the installer** from the [Releases](https://github.com/yourusername/wake-word-detector/releases) page
2. **Run the installer** and follow the wizard
3. **Launch the application** from desktop or start menu
4. **Configure your Picovoice API key** in Settings
5. **Start listening** for "Hey Claude"

### For Developers

```bash
# Clone the repository
git clone https://github.com/yourusername/wake-word-detector.git
cd wake-word-detector

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run dist

# Create installer
npm run installer:full
```

## 📁 Project Structure

```
Wakeword/
├── 📄 README.md                    # This file
├── 📄 package.json                 # Dependencies and scripts
├── 📁 src/                         # Source code
│   ├── 📁 main/                    # Electron main process
│   └── 📁 renderer/                # React frontend
├── 📁 scripts/                     # Build and installation scripts
│   ├── 📄 build-installer.ps1      # PowerShell installer builder
│   ├── 📄 Build-Installer.bat      # Batch installer builder
│   └── 📄 Install-Shortcuts.bat    # Desktop shortcut installer
├── 📁 installer/                   # Installer files
│   ├── 📄 installer.nsi            # NSIS installer script
│   ├── 📄 Claude-Wake-Word-Detector-Setup.exe  # Built installer
│   └── 📄 README.txt               # Post-installation help
├── 📁 docs/                        # Documentation
│   ├── 📄 CONTRIBUTING.md          # Contributing guidelines
│   ├── 📄 CHANGELOG.md             # Version history
│   └── 📄 PROJECT-STRUCTURE.md     # Detailed project structure
├── 📁 assets/                      # Application assets
└── 📁 keywords/                    # Wake word models
```

## 🔧 Development

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Windows 10/11** - For development and testing
- **PowerShell 5.0+** - For build scripts
- **NSIS 3.09+** - For installer building (optional)

### Available Scripts

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build application
npm run dist                   # Create production package

# Installer
npm run installer              # Build installer (requires NSIS)
npm run installer:full         # Install NSIS and build installer
npm run installer:nsis         # Install NSIS only

# Shortcuts
npm run shortcuts:install      # Create desktop shortcuts
npm run shortcuts:uninstall    # Remove desktop shortcuts
```

### Manual Build Steps

```bash
# 1. Install dependencies
npm install

# 2. Build application
npm run dist

# 3. Create installer (optional)
scripts\build-installer.ps1 -BuildInstaller

# 4. Install shortcuts (optional)
scripts\Install-Shortcuts.bat
```

## 📦 Installation

### Windows Installer

1. Download `Claude-Wake-Word-Detector-Setup.exe` from the [Releases](https://github.com/yourusername/wake-word-detector/releases) page
2. Run the installer and follow the wizard
3. Choose installation options:
   - **Main Application** (required)
   - **Desktop Shortcut** (recommended)
   - **Start Menu Shortcut** (recommended)
   - **Auto-start with Windows** (optional)
4. Launch from desktop or start menu

### Manual Installation

```bash
# 1. Build the application
npm run dist

# 2. Create shortcuts (optional)
scripts\Install-Shortcuts.bat

# 3. Launch from release folder
release\Claude Wake Word Detector-win32-x64\Claude-Wake-Word-Detector.exe
```

## ⚙️ Configuration

### Picovoice API Key

1. Sign up at [Picovoice Console](https://console.picovoice.ai/)
2. Get your free API key
3. Open the application settings
4. Enter your API key in the settings panel

### Custom Commands

Configure commands to execute when "Hey Claude" is detected:

1. Open Settings in the application
2. Add commands in the format: `command.exe [arguments]`
3. Set working directory if needed
4. Add delays between multiple commands
5. Test with the Test Mode

### WSL Integration

To run commands in WSL:

1. Use the command format: `wsl [your-command]`
2. Example: `wsl echo "Hello from WSL"`
3. Set working directory to WSL path if needed

## 🎯 Usage

### Basic Operation

1. **Launch the application** - It will start in the system tray
2. **Configure settings** - Enter your Picovoice API key
3. **Start listening** - Click the Start button
4. **Say "Hey Claude"** - The application will detect the wake word
5. **Commands execute** - Your configured commands will run

### System Tray Controls

- **Green icon** - Listening for wake word
- **Red icon** - Not listening
- **Right-click menu** - Quick access to settings and controls

### Test Mode

Use Test Mode to verify wake word detection without executing commands:

1. Enable Test Mode in settings
2. Say "Hey Claude" to test detection
3. Check the logs for detection events
4. Disable Test Mode when ready

## 🛠️ Troubleshooting

### Common Issues

**Microphone not working:**
- Check Windows privacy settings
- Ensure microphone permissions are granted
- Try running as administrator

**Wake word not detected:**
- Verify Picovoice API key is correct
- Check microphone is working
- Adjust sensitivity settings
- Test with different wake word models

**Commands not executing:**
- Check command syntax
- Verify working directory exists
- Test commands manually first
- Check Windows security settings

### Getting Help

- **Documentation** - Check `docs/` folder for detailed guides
- **Issues** - Report bugs on [GitHub Issues](https://github.com/yourusername/wake-word-detector/issues)
- **Discussions** - Ask questions in [GitHub Discussions](https://github.com/yourusername/wake-word-detector/discussions)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Quick Contribution

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see [LICENSE.txt](installer/LICENSE.txt) for details.

## 🙏 Acknowledgments

- **Picovoice** - For the Porcupine wake word detection engine
- **Electron** - For the cross-platform desktop framework
- **React** - For the modern UI framework
- **Tailwind CSS** - For the utility-first styling

## 📈 Version History

See [CHANGELOG.md](docs/CHANGELOG.md) for detailed version history and changes.

---

**Made with ❤️ by Traves Theberge**

For support, questions, or contributions, please visit our [GitHub repository](https://github.com/yourusername/wake-word-detector). 