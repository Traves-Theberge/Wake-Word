@echo off
title Wake Word Detector - Build Installer
echo.
echo ================================================
echo Wake Word Detector - Installer Build Script
echo ================================================
echo.

REM Check if NSIS is installed
where makensis >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: NSIS is not installed or not in PATH
    echo.
    echo Please install NSIS from: https://nsis.sourceforge.io/Download
    echo After installation, add NSIS to your PATH or run this script from the NSIS directory
    echo.
    pause
    exit /b 1
)

echo Checking for application build...
if not exist "release\Wake Word Detector-win32-x64" (
    echo ERROR: Application not built. Please run 'npm run dist' first.
    echo.
    pause
    exit /b 1
)

echo Building installer...
makensis installer.nsi

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo SUCCESS: Installer created successfully!
    echo ================================================
    echo.
    echo Installer file: Wake-Word-Detector-Setup.exe
    echo.
    if exist "Wake-Word-Detector-Setup.exe" (
        echo File size:
        for %%I in (Wake-Word-Detector-Setup.exe) do echo %%~zI bytes
        echo.
        set /p choice="Would you like to run the installer now? (y/n): "
        if /i "!choice!"=="y" (
            echo Running installer...
            start Wake-Word-Detector-Setup.exe
        )
    )
) else (
    echo.
    echo ================================================
    echo ERROR: Failed to create installer
    echo ================================================
    echo.
)

echo.
pause
