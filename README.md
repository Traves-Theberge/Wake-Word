# Wake Word Detector

A  Electron-based wake word detection application that listens for "Hey Claude" voice commands to automatically launch Cursor IDE and Claude CLI in Windows. Features an intuitive React interface with system tray integration for seamless background operation.

## 🚀 Features

- **Voice-Activated Commands**: Responds to "Hey Claude" wake word using Picovoice technology
- **Dual Command Support**: Automatically opens both Cursor IDE and Claude CLI in WSL
- **System Tray Integration**: Operates quietly in background with visual status indicators
- **Configurable Settings**: Easy-to-use settings panel for customization
- **Modern UI**: Beautiful React interface with Tailwind CSS and Framer Motion animations
- **Windows Native**: Optimized for Windows 10/11 with proper executable packaging
- **Background Operation**: Runs silently without blocking user workflow

## 🎯 Use Cases

- **Developers**: Quick access to Claude AI assistance while coding
- **Voice Commands**: Hands-free activation of development tools
- **Workflow Optimization**: Seamless integration into development workflow
- **Accessibility**: Voice-controlled IDE and AI assistant access

## 🏗️ Architecture

**Technology Stack:**
- **Framework**: Electron 27.3.11 with TypeScript
- **Frontend**: React 18 with Tailwind CSS 4.1.11
- **Wake Word**: Picovoice Porcupine SDK
- **Build System**: Vite 7.0.3 for renderer, TypeScript for main process
- **Animations**: Framer Motion for smooth UI transitions

**Project Structure:**
```
src/
├── main/                    # Electron main process
│   ├── main.ts             # Core application logic
│   └── preload.ts          # Secure context bridge
├── renderer/               # React frontend
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # React entry point
│   ├── components/         # UI components
│   │   ├── settings-panel.tsx
│   │   ├── custom-header.tsx
│   │   ├── loading-spinner.tsx
│   │   └── error-boundary.tsx
│   └── hooks/              # React hooks
│       └── use-wake-word-config.ts
keywords/                   # Wake word models
├── hey-claude.ppn         # Picovoice keyword file
└── LICENSE.txt
assets/                     # Application icons
├── app.ico                # Main application icon
├── Green.ico              # Listening status
└── Red.ico                # Stopped status
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

- **Picovoice** for wake word detection technology
- **Electron** for cross-platform desktop framework
- **React** for modern UI development
- **Tailwind CSS** for styling system

## 📞 Support

For issues and questions:
1. Check existing [issues](../../issues)
2. Create new issue with detailed description
3. Include system information and error logs

---

**Built with ❤️ by Traves Theberge**
