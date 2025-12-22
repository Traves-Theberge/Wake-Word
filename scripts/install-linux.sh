#!/bin/bash

# Wake Word Detector - Linux Installation Script
# This script installs the app to ~/.local and sets up autostart

set -e

APP_NAME="wake-word-detector"
DISPLAY_NAME="Wake Word Detector"
INSTALL_DIR="$HOME/.local/share/$APP_NAME"
BIN_DIR="$HOME/.local/bin"
DESKTOP_DIR="$HOME/.local/share/applications"
AUTOSTART_DIR="$HOME/.config/autostart"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
RELEASE_DIR="$PROJECT_DIR/release/Wake Word Detector-linux-x64"

echo "🎤 Wake Word Detector - Linux Installer"
echo "========================================"
echo ""

# Check if release exists
if [ ! -d "$RELEASE_DIR" ]; then
    echo "❌ Release not found at: $RELEASE_DIR"
    echo "   Please run 'npm run dist:linux' first."
    exit 1
fi

# Create directories
echo "📁 Creating directories..."
mkdir -p "$INSTALL_DIR"
mkdir -p "$BIN_DIR"
mkdir -p "$DESKTOP_DIR"
mkdir -p "$AUTOSTART_DIR"

# Copy application files
echo "📦 Installing application..."
rm -rf "$INSTALL_DIR"/*
cp -r "$RELEASE_DIR"/* "$INSTALL_DIR/"

# Make executable
chmod +x "$INSTALL_DIR/$APP_NAME"

# Create symlink in bin
echo "🔗 Creating symlink..."
ln -sf "$INSTALL_DIR/$APP_NAME" "$BIN_DIR/$APP_NAME"

# Copy icon
ICON_SRC="$PROJECT_DIR/assets/wakeword.png"
ICON_DEST="$HOME/.local/share/icons/hicolor/256x256/apps/$APP_NAME.png"
mkdir -p "$(dirname "$ICON_DEST")"
if [ -f "$ICON_SRC" ]; then
    cp "$ICON_SRC" "$ICON_DEST"
    echo "🎨 Icon installed"
fi

# Create desktop entry
echo "🖥️  Creating desktop entry..."
cat > "$DESKTOP_DIR/$APP_NAME.desktop" << EOF
[Desktop Entry]
Name=$DISPLAY_NAME
Comment=Voice-activated wake word detection for Hey Claude
Exec=$INSTALL_DIR/$APP_NAME
Icon=$APP_NAME
Terminal=false
Type=Application
Categories=Utility;AudioVideo;
Keywords=voice;wake;word;claude;ai;assistant;
StartupNotify=false
StartupWMClass=$APP_NAME
EOF

# Create autostart entry
echo "🚀 Setting up autostart..."
cat > "$AUTOSTART_DIR/$APP_NAME.desktop" << EOF
[Desktop Entry]
Name=$DISPLAY_NAME
Comment=Voice-activated wake word detection for Hey Claude
Exec=$INSTALL_DIR/$APP_NAME --startup
Icon=$APP_NAME
Terminal=false
Type=Application
Categories=Utility;AudioVideo;
X-GNOME-Autostart-enabled=true
X-GNOME-Autostart-Delay=5
StartupNotify=false
Hidden=false
EOF

# Update desktop database
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "📍 Installed to: $INSTALL_DIR"
echo "🔗 Symlink: $BIN_DIR/$APP_NAME"
echo "🖥️  Desktop entry: $DESKTOP_DIR/$APP_NAME.desktop"
echo "🚀 Autostart: $AUTOSTART_DIR/$APP_NAME.desktop"
echo ""
echo "🎯 You can now:"
echo "   • Run '$APP_NAME' from terminal"
echo "   • Find 'Wake Word Detector' in your application menu"
echo "   • It will start automatically on login"
echo ""
echo "💡 To uninstall, run: scripts/uninstall-linux.sh"
