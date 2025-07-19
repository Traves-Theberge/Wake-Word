# Changelog

All notable changes to the Wake Word Detector project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-19

### Added
- **Initial Release** 🎉
- Wake word detection with "Hey Claude" using Picovoice Porcupine
- Professional Windows installer (NSIS-based)
- System tray integration with visual status indicators
  - Green icon: Listening for wake word
  - Red icon: Detection stopped
- React-based settings interface with modern UI
- Configurable command launching:
  - Cursor IDE launch support
  - Claude CLI in WSL terminal
  - Enable/disable individual commands
- Windows integration features:
  - Desktop shortcut creation
  - Start Menu program folder
  - Optional startup with Windows
  - Proper Programs & Features entry
- Background operation support
- Robust path resolution for packaged applications
- Real-time listening state management
- Professional application branding and icons
- Complete documentation and setup guides

### Technical Implementation
- **Framework**: Electron 27.3.11 with TypeScript
- **Frontend**: React 18 + Tailwind CSS 4.1
- **Voice Engine**: Picovoice Porcupine SDK
- **Build System**: Vite 7.0 + electron-packager
- **Installer**: NSIS (Nullsoft Scriptable Install System)
- **Audio Processing**: PvRecorder for microphone access
- **IPC**: Secure context bridge between main and renderer processes

### Features
- Privacy-first on-device voice processing
- Configurable wake word sensitivity
- System tray context menu with controls
- Automatic cleanup on application exit
- Error handling and recovery
- Development and production build support
- Comprehensive asset and icon management

## [Unreleased]

### Planned
- Code signing for Windows SmartScreen compatibility
- Auto-updater functionality for seamless updates
- Multiple wake word support ("Hey Gemini", etc.)
- Voice feedback confirmation system
- Usage analytics and statistics
- Improved error reporting and debugging
- Linux and macOS compatibility
- Custom wake word training integration
- Plugin system for additional commands
- Voice command chaining support

### Under Consideration
- Integration with additional AI assistants
- Hotkey alternatives to voice commands
- Advanced audio processing options
- Custom command scripting
- Remote configuration management
- Team/enterprise features
- Cloud synchronization for settings

---

## Release Notes Format

### [Version] - YYYY-MM-DD
### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Now removed features

### Fixed
- Any bug fixes

### Security
- Vulnerability fixes

---

**Note**: This project follows semantic versioning. Version numbers are structured as MAJOR.MINOR.PATCH where:
- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible functionality additions
- **PATCH**: Backwards-compatible bug fixes
