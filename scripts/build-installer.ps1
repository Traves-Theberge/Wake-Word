# Wake Word Detector - NSIS Installation and Installer Build Script

param(
    [switch]$InstallNSIS,
    [switch]$BuildInstaller,
    [switch]$Help
)

function Show-Help {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "Wake Word Detector - Installer Build Script" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  scripts\build-installer.ps1 [OPTIONS]" -ForegroundColor White
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  -InstallNSIS    Install NSIS using winget" -ForegroundColor White
    Write-Host "  -BuildInstaller Build the installer (requires NSIS)" -ForegroundColor White
    Write-Host "  -Help           Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  scripts\build-installer.ps1 -InstallNSIS" -ForegroundColor White
    Write-Host "  scripts\build-installer.ps1 -BuildInstaller" -ForegroundColor White
    Write-Host "  scripts\build-installer.ps1 -InstallNSIS -BuildInstaller" -ForegroundColor White
    Write-Host ""
}

function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

function Install-NSIS {
    Write-Host "Checking for NSIS installation..." -ForegroundColor Yellow
    
    if (Test-Command "makensis") {
        Write-Host "✅ NSIS is already installed and available in PATH" -ForegroundColor Green
        return $true
    }
    
    Write-Host "NSIS not found. Installing via winget..." -ForegroundColor Yellow
    
    # Check if winget is available
    if (-not (Test-Command "winget")) {
        Write-Host "❌ winget is not available. Please install NSIS manually from:" -ForegroundColor Red
        Write-Host "   https://nsis.sourceforge.io/Download" -ForegroundColor White
        return $false
    }
    
    try {
        Write-Host "Installing NSIS..." -ForegroundColor Yellow
        winget install NSIS.NSIS
        
        # Add NSIS to PATH if not already there
        $nsisPath = "${env:ProgramFiles(x86)}\NSIS"
        if (Test-Path $nsisPath) {
            $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
            if ($currentPath -notlike "*$nsisPath*") {
                Write-Host "Adding NSIS to PATH..." -ForegroundColor Yellow
                [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$nsisPath", "User")
                $env:PATH += ";$nsisPath"
            }
        }
        
        # Verify installation
        if (Test-Command "makensis") {
            Write-Host "✅ NSIS installed successfully!" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ NSIS installation may have failed. Please restart PowerShell and try again." -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Failed to install NSIS: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Please install manually from: https://nsis.sourceforge.io/Download" -ForegroundColor White
        return $false
    }
}

function Build-Installer {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "Building Wake Word Detector Installer" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Check if NSIS is available
    if (-not (Test-Command "makensis")) {
        Write-Host "❌ NSIS is not installed or not in PATH" -ForegroundColor Red
        Write-Host "   Run with -InstallNSIS to install NSIS first" -ForegroundColor Yellow
        return $false
    }
    
    # Check if application is built
    $distPath = "release\Wake Word Detector-win32-x64"
    if (-not (Test-Path $distPath)) {
        Write-Host "❌ Application not built. Building now..." -ForegroundColor Yellow
        Write-Host ""
        npm run dist
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to build application" -ForegroundColor Red
            return $false
        }
    }
    
    Write-Host "✅ Application build found" -ForegroundColor Green
    Write-Host "Building installer with NSIS..." -ForegroundColor Yellow
    
    # Build installer
    try {
        & makensis installer.nsi
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "================================================" -ForegroundColor Green
            Write-Host "✅ SUCCESS: Installer created successfully!" -ForegroundColor Green
            Write-Host "================================================" -ForegroundColor Green
            Write-Host ""
            
            if (Test-Path "Wake-Word-Detector-Setup.exe") {
                $fileSize = (Get-Item "Wake-Word-Detector-Setup.exe").Length
                $fileSizeMB = [math]::Round($fileSize / 1MB, 2)
                Write-Host "📦 Installer file: Wake-Word-Detector-Setup.exe" -ForegroundColor White
                Write-Host "📏 File size: $fileSizeMB MB" -ForegroundColor White
                Write-Host ""
                
                $choice = Read-Host "Would you like to run the installer now? (y/n)"
                if ($choice -eq "y" -or $choice -eq "Y") {
                    Write-Host "🚀 Running installer..." -ForegroundColor Yellow
                    Start-Process "Wake-Word-Detector-Setup.exe"
                }
            }
            return $true
        } else {
            Write-Host ""
            Write-Host "================================================" -ForegroundColor Red
            Write-Host "❌ ERROR: Failed to create installer" -ForegroundColor Red
            Write-Host "================================================" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Error building installer: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Main script logic
if ($Help) {
    Show-Help
    exit 0
}

if (-not $InstallNSIS -and -not $BuildInstaller) {
    Show-Help
    exit 1
}

$success = $true

if ($InstallNSIS) {
    $success = Install-NSIS
}

if ($BuildInstaller -and $success) {
    $success = Build-Installer
}

if (-not $success) {
    exit 1
}
