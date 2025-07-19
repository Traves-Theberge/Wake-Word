# Wake Word Detector

🎤 A professional Electron-based wake word detection application that listens for "Hey Claude" voice commands to automatically launch Cursor IDE and Claude CLI. Features a modern React interface, Windows installer, and seamless system tray integration.

**Powered by [Picovoice](https://picovoice.ai/) - Industry-leading on-device voice AI** 🔊

## ✨ Features

### 🎯 **Voice Control**
- **"Hey Claude" Detection**: Advanced wake word recognition using Picovoice Porcupine
- **Dual Launch Support**: Configurable launching of Cursor IDE and/or Claude CLI
- **High Accuracy**: On-device processing for reliable, private voice detection
- **Customizable Sensitivity**: Adjustable detection thresholds

### 🖥️ **Windows Integration**
- **Professional Installer**: Complete NSIS-based installer with shortcuts
- **System Tray**: Visual status indicators (Green=Listening, Red=Stopped)
- **Startup Integration**: Optional auto-start with Windows
- **Task Manager Branding**: Proper application identification and icons

### 🎨 **Modern Interface**
- **React UI**: Beautiful settings panel with Tailwind CSS styling
- **Framer Motion**: Smooth animations and transitions
- **Custom Window**: Frameless design with rounded corners
- **Real-time Status**: Live listening state updates

### ⚡ **Performance**
- **Background Operation**: Minimal resource usage while listening
- **Instant Response**: Fast command execution and application launching
- **Stable Detection**: Robust audio processing with error handling

## 🚀 Quick Start

### **Option 1: Use the Installer (Recommended)**
1. Download `Wake-Word-Detector-Setup.exe`
2. Run the installer and follow the setup wizard
3. Configure your Picovoice API key in settings
4. Start saying "Hey Claude"!

### **Option 2: Build from Source**
```bash
# Clone and install
git clone https://github.com/Traves-Theberge/Wakeword.git
cd Wakeword
npm install

# Build and package
npm run dist

# Create installer
npm run installer:quick
```

## 🔧 Requirements

- **OS**: Windows 10/11 (64-bit)
- **Picovoice API Key**: [Get free key](https://console.picovoice.ai/)
- **Microphone**: Any Windows-compatible microphone
- **Storage**: ~150 MB for installation

## 📦 Installation Options

### **Desktop Integration**
- ✅ Desktop shortcut
- ✅ Start Menu folder  
- ✅ System tray integration
- ✅ Startup with Windows (optional)

### **Command Launch Options**
- ✅ **Cursor IDE**: Launches your code editor
- ✅ **Claude CLI**: Opens WSL terminal with Claude
- ✅ **Configurable**: Enable/disable either command

## 🏗️ Architecture

### **Technology Stack**
- **Core**: Electron 27.3.11 + TypeScript
- **Frontend**: React 18 + Tailwind CSS 4.1
- **Voice Engine**: [Picovoice Porcupine](https://picovoice.ai/platform/porcupine/) SDK
- **Build System**: Vite 7.0 + electron-packager
- **Installer**: NSIS (Nullsoft Scriptable Install System)

### **Project Structure**
```
src/
├── main/                    # Electron main process
│   ├── main.ts             # Core app logic + wake word detection
│   └── preload.ts          # Secure IPC bridge
├── renderer/               # React frontend
│   ├── App.tsx             # Main application
│   ├── components/         # UI components
│   │   ├── settings-panel.tsx      # Configuration interface
│   │   ├── custom-header.tsx       # Window controls
│   │   ├── animated-background.tsx # Visual effects
│   │   └── loading-spinner.tsx     # Loading states
│   └── hooks/              # React hooks
│       └── use-wake-word-config.ts # Settings management
keywords/
├── hey-claude.ppn         # Picovoice wake word model
└── LICENSE.txt            # Picovoice license
assets/                     # Application icons
├── app.ico                # Main application icon
├── Green.ico              # Tray listening state
└── Red.ico                # Tray stopped state
installer.nsi              # NSIS installer script
```

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **Windows**: 10 or 11 (64-bit)
- **Microphone**: System microphone access required
- **Picovoice Account**: Free API key from [Picovoice Console](https://console.picovoice.ai/)
- **Cursor IDE**: Installed and accessible via system PATH
- **WSL**: For Claude CLI functionality (optional)

## 🔧 Installation

### Development Setup

1. **Clone and Install**
   ```powershell
   git clone [repository-url]
   cd Wakeword
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PICOVOICE_ACCESS_KEY=your_picovoice_api_key_here
   ```

3. **Get Picovoice API Key**
   - Visit [Picovoice Console](https://console.picovoice.ai/)
   - Create a free account
   - Generate an access key
   - Add to your `.env` file

4. **Development Mode**
   ```powershell
   npm run dev
   ```

### Production Build

1. **Build Application**
   ```powershell
   npm run build
   ```

2. **Package for Windows**
   ```powershell
   npm run package
   ```

3. **Create Installer**
   ```powershell
   npm run make
   ```

**Build Output:**
```
release/
└── Wake Word Detector-win32-x64/
    ├── Wake-Word-Detector.exe    # Main executable
    ├── resources/                       # App resources
    └── [electron runtime files]
```

## ⚙️ Configuration

### Initial Setup

1. **Launch Application**
   - Run the executable or use `npm run dev`
   - Application appears in system tray

2. **Configure Settings**
   - Right-click tray icon → "Show Settings"
   - Enter your Picovoice API key
   - Enable desired commands (Cursor/Claude)
   - Click "Save Configuration"

3. **Test Connection**
   - Use "Test API Key" button to verify setup
   - Ensure microphone permissions are granted

### Available Settings

- **Picovoice API Key**: Required for wake word detection
- **Enable Cursor**: Toggle Cursor IDE launching
- **Enable Claude**: Toggle Claude CLI launching
- **Wake Word Sensitivity**: Adjustable detection threshold

## 🎮 Usage

### Basic Operation

1. **Start Listening**
   - Right-click tray icon → "Start Listening"
   - Tray icon turns green when active

2. **Voice Activation**
   - Say "Hey Claude" clearly
   - Application automatically launches configured tools

3. **System Tray Controls**
   - **Green Icon**: Listening for wake word
   - **Red Icon**: Detection stopped
   - **Right-click Menu**: Access settings and controls

### Commands Executed

When "Hey Claude" is detected:
- **Cursor IDE**: Opens silently in background
- **Claude CLI**: Launches in WSL terminal
- **Status Update**: Tray icon briefly indicates activation

### Troubleshooting

**Common Issues:**
- **No detection**: Check microphone permissions and API key
- **Cursor won't open**: Verify Cursor.exe is in system PATH
- **Claude CLI fails**: Ensure WSL is installed and configured

**Debug Mode:**
```powershell
npm run dev  # See console output for detailed logging
```

## 🚀 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development mode with hot reload |
| `npm run build` | Build application for production |
| `npm run package` | Package as executable |
| `npm run make` | Create installer |
| `npm run preview` | Preview built renderer |

## 🔧 Development

### Adding New Commands

1. **Extend Config Interface** (`main.ts`)
   ```typescript
   interface Config {
     picovoiceAccessKey?: string
     enableCursor?: boolean
     enableClaude?: boolean
     enableNewCommand?: boolean  // Add new option
   }
   ```

2. **Update Command Execution**
   ```typescript
   if (config.enableNewCommand) {
     // Add your command logic
   }
   ```

3. **Add UI Control** (`settings-panel.tsx`)
   ```tsx
   // Add toggle switch for new command
   ```

### Customizing Wake Word

1. **Create Custom Keyword**
   - Use [Picovoice Console](https://console.picovoice.ai/) to train new wake words
   - Download `.ppn` file to `keywords/` directory

2. **Update Detection**
   ```typescript
   const keywordPath = join(__dirname, '../../keywords/your-keyword.ppn')
   ```

## 🤝 Contributing

1. **Fork the Repository**
2. **Create Feature Branch**
   ```powershell
   git checkout -b feature/amazing-feature
   ```
3. **Commit Changes**
   ```powershell
   git commit -m 'Add amazing feature'
   ```
4. **Push to Branch**
   ```powershell
   git push origin feature/amazing-feature
   ```
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.

## 🙏 Acknowledgments

### **Special Thanks to Picovoice** 🎤
This project is powered by **[Picovoice](https://picovoice.ai/)** - the leading platform for on-device voice AI. Their incredible technology makes private, reliable wake word detection possible.

- **[Porcupine Wake Word Engine](https://picovoice.ai/platform/porcupine/)**: Industry-leading wake word detection
- **On-Device Processing**: Privacy-first approach with no cloud dependency  
- **High Accuracy**: Advanced audio processing for reliable voice recognition
- **Developer-Friendly**: Excellent SDKs and documentation

> *"Picovoice democratizes voice AI by making it accessible, private, and efficient."*

### **Additional Credits**
- **[Electron](https://electronjs.org/)**: Cross-platform desktop framework
- **[React](https://react.dev/)**: Modern UI library for component-based development
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)**: Smooth animations and transitions
- **[NSIS](https://nsis.sourceforge.io/)**: Professional Windows installer creation

## 🔗 Useful Links

- **[Get Picovoice API Key](https://console.picovoice.ai/)**: Free tier available
- **[Picovoice Documentation](https://picovoice.ai/docs/)**: Comprehensive guides
- **[Wake Word Training](https://console.picovoice.ai/ppn)**: Create custom keywords
- **[Electron Documentation](https://electronjs.org/docs)**: Desktop app development

## 📞 Support

For issues and questions:
1. Check existing [issues](../../issues)
2. Create new issue with detailed description
3. Include system information and error logs

---

**Built with ❤️ by Traves Theberge**
