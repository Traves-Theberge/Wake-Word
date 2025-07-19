# Wake Word Detector - Windows Installer

This directory contains the necessary files to create a professional Windows installer for the Wake Word Detector application.

## Quick Start

### Option 1: Automated Installation (Recommended)
```bash
npm run installer:full
```
This will:
1. Install NSIS if not already installed
2. Build the application if needed
3. Create the installer

### Option 2: Manual Steps

1. **Install NSIS** (if not already installed):
   ```bash
   npm run installer:nsis
   ```
   Or download from: https://nsis.sourceforge.io/Download

2. **Build the application**:
   ```bash
   npm run dist
   ```

3. **Create the installer**:
   ```bash
   npm run installer:build
   ```

## Installer Features

### Core Features
- ✅ **Professional Installation**: Modern UI with progress indicators
- ✅ **Automatic Updates**: Detects and removes previous versions
- ✅ **Registry Integration**: Proper Windows registry entries
- ✅ **Programs & Features**: Appears correctly in Windows control panel
- ✅ **Clean Uninstallation**: Complete removal with registry cleanup

### Installation Options
- ✅ **Desktop Shortcut**: Quick access from desktop
- ✅ **Start Menu Integration**: Organized Start Menu folder
- ✅ **Startup Integration**: Option to start with Windows
- ✅ **Taskbar Pinning**: Instructions for taskbar integration

### Advanced Features
- ✅ **Process Management**: Safely closes running instances during install/uninstall
- ✅ **Size Calculation**: Accurate disk space reporting
- ✅ **Icon Integration**: Proper application icons throughout
- ✅ **Version Management**: Handles version upgrades gracefully

## Files Overview

| File | Purpose |
|------|---------|
| `installer.nsi` | Main NSIS installer script |
| `build-installer.bat` | Simple batch script for building |
| `scripts/build-installer.ps1` | Advanced PowerShell script with NSIS auto-install |

## Installation Flow

1. **Welcome Screen**: Professional welcome with application info
2. **License Agreement**: MIT license acceptance
3. **Component Selection**: Choose installation options
4. **Directory Selection**: Choose installation location
5. **Installation**: Progress indicator with file copying
6. **Completion**: Option to launch application

## Registry Entries

The installer creates proper Windows registry entries:

### Application Registration
- `HKLM\Software\Wake Word Detector`
- Installation path and version information

### Uninstaller Registration
- `HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall\Wake Word Detector`
- Proper Programs & Features integration

### Startup Registration (Optional)
- `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`
- Automatic startup with `--startup` parameter

## Building Requirements

- **NSIS 3.0+**: Nullsoft Scriptable Install System
- **Built Application**: Run `npm run dist` first
- **Windows**: Installer is Windows-specific

## Troubleshooting

### Common Issues

**"NSIS not found"**
- Install NSIS: `npm run installer:nsis`
- Or download from: https://nsis.sourceforge.io/Download

**"Application not built"**
- Run: `npm run dist`
- Check for build errors

**"Permission denied"**
- Run PowerShell as Administrator
- Ensure NSIS is in PATH

### Manual NSIS Installation

1. Download NSIS from: https://nsis.sourceforge.io/Download
2. Install with default options
3. Add to PATH: `C:\Program Files (x86)\NSIS`
4. Restart PowerShell/Command Prompt

## Output

Successful build creates:
- `Wake-Word-Detector-Setup.exe` (Installer)
- ~15-25 MB file size (includes Electron runtime)
- Professional installer with all features

## Testing

After building the installer:

1. **Test Installation**: Run the installer
2. **Test Application**: Launch from shortcuts
3. **Test Startup**: Check Windows startup behavior
4. **Test Uninstallation**: Remove via Programs & Features

## Distribution

The generated `Wake-Word-Detector-Setup.exe` is ready for distribution:
- Single file installer
- No dependencies required
- Works on Windows 10/11
- Includes all necessary runtime files
