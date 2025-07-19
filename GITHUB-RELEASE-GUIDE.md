# GitHub Release Setup Guide

## 🏷️ Release Configuration

### **Tag Version**
- **Tag name**: `v1.0.0` (follows semantic versioning)
- **Target**: `main` branch

### **Release Title**
```
Wake Word Detector v1.0.0 - Initial Release
```

### **Release Description**
```markdown
# 🎤 Wake Word Detector v1.0.0

The first official release of Wake Word Detector - a professional voice-activated application for launching Cursor IDE and Claude CLI with "Hey Claude" commands.

## ✨ Features

- **Voice Control**: "Hey Claude" wake word detection powered by Picovoice
- **Dual Launch**: Configurable Cursor IDE and Claude CLI launching  
- **Windows Integration**: Professional installer with system tray
- **Modern UI**: React-based settings with beautiful animations

## 📦 Installation

### **Recommended: Use the Installer**
1. Download `Wake-Word-Detector-Setup.exe` below
2. Run the installer as Administrator
3. Follow the setup wizard
4. Configure your Picovoice API key in settings
5. Start saying "Hey Claude"!

### **System Requirements**
- Windows 10/11 (64-bit)
- ~150 MB free disk space
- Microphone for voice detection
- [Picovoice API key](https://console.picovoice.ai/) (free tier available)

## 🔧 What's Included

- **Complete Application**: All dependencies bundled
- **Desktop Integration**: Shortcuts and Start Menu entries
- **System Tray**: Background operation with status indicators
- **Startup Option**: Auto-start with Windows (optional)
- **Clean Uninstall**: Proper Programs & Features integration

## 🎯 Quick Start

1. **Install**: Run the downloaded installer
2. **Configure**: Add your Picovoice API key in settings
3. **Test**: Say "Hey Claude" to trigger actions
4. **Customize**: Enable/disable Cursor or Claude launching

## 🙏 Powered By

- **[Picovoice](https://picovoice.ai/)**: Industry-leading on-device voice AI
- **Electron**: Cross-platform desktop framework
- **React**: Modern UI development

## 📋 Changelog

### Added
- Initial wake word detection with "Hey Claude"
- Professional Windows installer (NSIS)
- System tray integration with visual status
- React-based settings interface
- Configurable command launching
- Background operation support
- Desktop and Start Menu shortcuts
- Optional Windows startup integration

### Technical Details
- Electron 27.3.11 + TypeScript
- Picovoice Porcupine SDK for wake word detection
- React 18 + Tailwind CSS for UI
- NSIS installer for professional distribution

## 🐛 Known Issues

None at this time. Please report issues on GitHub.

## 🔄 Next Release Plans

- Code signing for Windows SmartScreen
- Auto-updater functionality
- Additional wake word options
- Voice feedback confirmations

---

**Full Changelog**: https://github.com/Traves-Theberge/Wakeword/commits/v1.0.0
```

### **Assets to Upload**
- `Wake-Word-Detector-Setup.exe` (your installer)
- `CHANGELOG.md` (if you have one)
- Source code (automatically included by GitHub)

## 🔄 **Release Process**

1. **Tag the release**: Check "Set as the latest release"
2. **Upload installer**: Drag `Wake-Word-Detector-Setup.exe` to assets
3. **Publish**: Click "Publish release"

## 📈 **Release Analytics**

GitHub will track:
- Download counts
- Release views
- Popular assets
- User engagement
```
