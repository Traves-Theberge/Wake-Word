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

## [1.1.0] - 2025-07-20

### Added
- **Linux Support** 🐧
  - Full compatibility with Arch Linux and other Linux distributions
  - Platform-specific keyword file detection (`hey-claude_en_linux_v4_0_0.ppn`)
  - Native window frame support for tiling window managers (Wayland/X11)
  - PNG icon support for Linux system tray
  - Linux-optimized window sizing and layout

- **New Command Options**
  - VS Code launch support alongside Cursor IDE
  - Blackbox terminal command option
  - Ghostty terminal support for Claude CLI on Linux
  - Fallback terminal chain: Ghostty → Kitty → x-terminal-emulator

- **Platform-Specific Keyword Files**
  - Automatic detection of correct `.ppn` file based on OS
  - Support for Windows, Linux, and macOS keyword files
  - Clear naming convention: `hey-claude_en_<platform>_v4_0_0.ppn`

### Changed
- Upgraded Picovoice Porcupine SDK from v3.0.x to v4.0.1 for latest keyword file support
- Simplified UI layout for better cross-platform compatibility
- Improved window configuration for tiling window managers
- Updated clean scripts to use cross-platform `rm -rf` commands
- Added `dist:linux` npm script for Linux packaging

### Fixed
- Ghostty terminal spawn syntax (use `-e` flag instead of `--`)
- Window transparency issues on Linux/Wayland
- Icon loading for non-Windows platforms

### Technical
- React and React-DOM now explicit dependencies (v19.2.3)
- esbuild upgraded to v0.27.2
- Vite upgraded to v7.3.0
- Added Linux-specific spawn commands for Cursor, VS Code, Claude, and Blackbox

## [Unreleased]

### Planned
- Code signing for Windows SmartScreen compatibility
- Auto-updater functionality for seamless updates
- Multiple wake word support ("Hey Gemini", etc.)
- Voice feedback confirmation system
- Usage analytics and statistics
- Improved error reporting and debugging
- macOS compatibility improvements
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
