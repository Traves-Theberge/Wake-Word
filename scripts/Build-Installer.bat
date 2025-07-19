@echo off
REM Claude Wake Word Detector - Installer Builder
REM Simple batch file to run the PowerShell installer builder

echo ===============================================
echo   Claude Wake Word Detector - Installer Builder
echo ===============================================
echo.

REM Change to the parent directory (project root)
cd /d "%~dp0.."

REM Run the PowerShell script
powershell -ExecutionPolicy Bypass -File "scripts\build-installer.ps1" -InstallNSIS -BuildInstaller

REM Pause to show results
pause 