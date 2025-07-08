@echo off
title Claude Wake Word Detector - Launcher
echo ===============================================
echo    Claude Wake Word Detector - Launcher
echo ===============================================
echo.
echo Starting Claude Wake Word Detector...
echo.

cd /d "%~dp0"
if exist "release\Claude Wake Word Detector-win32-x64\Claude-Wake-Word-Detector.exe" (
    start "" "release\Claude Wake Word Detector-win32-x64\Claude-Wake-Word-Detector.exe"
    echo Application started successfully!
    echo.
    echo The application is now running in the background.
    echo Check your system tray for the Claude Wake Word Detector icon.
    echo.
    echo You can now say "Hey Claude" to activate the wake word detection.
    echo.
    pause
) else (
    echo ERROR: Application not found!
    echo.
    echo Please run 'npm run dist' to build the application first.
    echo.
    pause
) 