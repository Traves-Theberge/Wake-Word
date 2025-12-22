#!/bin/bash

# Wake Word Detector - Linux Uninstall Script

APP_NAME="wake-word-detector"
INSTALL_DIR="$HOME/.local/share/$APP_NAME"
BIN_DIR="$HOME/.local/bin"
DESKTOP_DIR="$HOME/.local/share/applications"
AUTOSTART_DIR="$HOME/.config/autostart"
ICON_DIR="$HOME/.local/share/icons/hicolor/256x256/apps"

echo "🎤 Wake Word Detector - Linux Uninstaller"
echo "=========================================="
echo ""

# Remove installation directory
if [ -d "$INSTALL_DIR" ]; then
    echo "🗑️  Removing installation directory..."
    rm -rf "$INSTALL_DIR"
fi

# Remove symlink
if [ -L "$BIN_DIR/$APP_NAME" ]; then
    echo "🔗 Removing symlink..."
    rm -f "$BIN_DIR/$APP_NAME"
fi

# Remove desktop entry
if [ -f "$DESKTOP_DIR/$APP_NAME.desktop" ]; then
    echo "🖥️  Removing desktop entry..."
    rm -f "$DESKTOP_DIR/$APP_NAME.desktop"
fi

# Remove autostart entry
if [ -f "$AUTOSTART_DIR/$APP_NAME.desktop" ]; then
    echo "🚀 Removing autostart entry..."
    rm -f "$AUTOSTART_DIR/$APP_NAME.desktop"
fi

# Remove icon
if [ -f "$ICON_DIR/$APP_NAME.png" ]; then
    echo "🎨 Removing icon..."
    rm -f "$ICON_DIR/$APP_NAME.png"
fi

# Update desktop database
if command -v update-desktop-database &> /dev/null; then
    update-desktop-database "$DESKTOP_DIR" 2>/dev/null || true
fi

echo ""
echo "✅ Uninstallation complete!"
echo ""
echo "💡 Configuration file remains at: ~/.wake-word-detector.json"
echo "   Delete it manually if you want to remove all settings."
