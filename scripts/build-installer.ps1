# Claude Wake Word Detector - Installer Builder
# PowerShell script to automate NSIS installer creation

param(
    [switch]$InstallNSIS,
    [switch]$BuildInstaller,
    [switch]$Help
)

# Configuration
$NSIS_VERSION = "3.09"
$NSIS_DOWNLOAD_URL = "https://sourceforge.net/projects/nsis/files/NSIS%203/$NSIS_VERSION/nsis-$NSIS_VERSION-setup.exe/download"
$NSIS_INSTALL_PATH = "C:\Program Files (x86)\NSIS"
$MAKENSIS_PATH = "$NSIS_INSTALL_PATH\makensis.exe"
$INSTALLER_SCRIPT = "installer\installer.nsi"
$TEST_INSTALLER_SCRIPT = "installer\test-installer.nsi"

# Colors for output
$Colors = @{
    Success = "Green"
    Error = "Red"
    Warning = "Yellow"
    Info = "Cyan"
    Header = "Magenta"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Colors[$Color]
}

function Show-Header {
    Write-ColorOutput "===============================================" "Header"
    Write-ColorOutput "   Claude Wake Word Detector - Installer Builder" "Header"
    Write-ColorOutput "===============================================" "Header"
    Write-Host ""
}

function Show-Help {
    Show-Header
    Write-ColorOutput "Usage:" "Info"
    Write-Host "  .\build-installer.ps1 [Options]" -ForegroundColor White
    Write-Host ""
    Write-ColorOutput "Options:" "Info"
    Write-Host "  -InstallNSIS     Download and install NSIS" -ForegroundColor White
    Write-Host "  -BuildInstaller  Build the installer (requires NSIS)" -ForegroundColor White
    Write-Host "  -Help           Show this help message" -ForegroundColor White
    Write-Host ""
    Write-ColorOutput "Examples:" "Info"
    Write-Host "  .\build-installer.ps1 -InstallNSIS" -ForegroundColor White
    Write-Host "  .\build-installer.ps1 -BuildInstaller" -ForegroundColor White
    Write-Host "  .\build-installer.ps1 -InstallNSIS -BuildInstaller" -ForegroundColor White
    Write-Host ""
}

function Test-NSISInstalled {
    if (Test-Path $MAKENSIS_PATH) {
        Write-ColorOutput "✅ NSIS is already installed at: $NSIS_INSTALL_PATH" "Success"
        return $true
    }
    return $false
}

function Install-NSIS {
    Write-ColorOutput "📥 Installing NSIS..." "Info"
    
    # Create temp directory
    $tempDir = "$env:TEMP\nsis-install"
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force
    }
    New-Item -ItemType Directory -Path $tempDir | Out-Null
    
    try {
        # Download NSIS installer
        Write-ColorOutput "Downloading NSIS $NSIS_VERSION..." "Info"
        $installerPath = "$tempDir\nsis-setup.exe"
        Invoke-WebRequest -Uri $NSIS_DOWNLOAD_URL -OutFile $installerPath -UseBasicParsing
        
        # Run installer silently
        Write-ColorOutput "Installing NSIS..." "Info"
        Start-Process -FilePath $installerPath -ArgumentList "/S" -Wait
        
        # Verify installation
        if (Test-NSISInstalled) {
            Write-ColorOutput "✅ NSIS installed successfully!" "Success"
            return $true
        } else {
            Write-ColorOutput "❌ NSIS installation failed!" "Error"
            return $false
        }
    }
    catch {
        Write-ColorOutput "❌ Failed to install NSIS: $($_.Exception.Message)" "Error"
        return $false
    }
    finally {
        # Clean up temp directory
        if (Test-Path $tempDir) {
            Remove-Item $tempDir -Recurse -Force
        }
    }
}

function Build-Installer {
    Write-ColorOutput "🔨 Building installer..." "Info"
    
    # Check if NSIS is installed
    if (-not (Test-NSISInstalled)) {
        Write-ColorOutput "❌ NSIS is not installed. Run with -InstallNSIS first." "Error"
        return $false
    }
    
    # Check if installer script exists
    if (-not (Test-Path $INSTALLER_SCRIPT)) {
        Write-ColorOutput "❌ Installer script not found: $INSTALLER_SCRIPT" "Error"
        return $false
    }
    
    try {
        # Build main installer
        Write-ColorOutput "Building main installer..." "Info"
        & $MAKENSIS_PATH $INSTALLER_SCRIPT
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✅ Main installer built successfully!" "Success"
        } else {
            Write-ColorOutput "❌ Failed to build main installer!" "Error"
            return $false
        }
        
        # Build test installer if script exists
        if (Test-Path $TEST_INSTALLER_SCRIPT) {
            Write-ColorOutput "Building test installer..." "Info"
            & $MAKENSIS_PATH $TEST_INSTALLER_SCRIPT
            
            if ($LASTEXITCODE -eq 0) {
                Write-ColorOutput "✅ Test installer built successfully!" "Success"
            } else {
                Write-ColorOutput "⚠️  Failed to build test installer (non-critical)" "Warning"
            }
        }
        
        Write-ColorOutput "🎉 Installer build completed!" "Success"
        Write-ColorOutput "📁 Installers are in the installer/ directory" "Info"
        return $true
    }
    catch {
        Write-ColorOutput "❌ Build failed: $($_.Exception.Message)" "Error"
        return $false
    }
}

function Show-Success {
    Write-Host ""
    Write-ColorOutput "🎉 Setup Complete!" "Success"
    Write-Host ""
    Write-ColorOutput "Next steps:" "Info"
    Write-Host "  1. Test the installer: installer\Claude-Wake-Word-Detector-Setup.exe" -ForegroundColor White
    Write-Host "  2. Distribute the installer to users" -ForegroundColor White
    Write-Host "  3. Create a GitHub release with the installer" -ForegroundColor White
    Write-Host ""
    Write-ColorOutput "For more information, see: docs\INSTALLER-README.md" "Info"
}

# Main execution
if ($Help) {
    Show-Help
    exit 0
}

Show-Header

# Check if any parameters were provided
if (-not $InstallNSIS -and -not $BuildInstaller) {
    Write-ColorOutput "❌ No action specified. Use -Help for usage information." "Error"
    exit 1
}

$success = $true

# Install NSIS if requested
if ($InstallNSIS) {
    if (-not (Test-NSISInstalled)) {
        $success = Install-NSIS
    } else {
        Write-ColorOutput "ℹ️  NSIS is already installed, skipping installation." "Info"
    }
}

# Build installer if requested
if ($BuildInstaller -and $success) {
    $success = Build-Installer
}

# Show success message
if ($success) {
    Show-Success
    exit 0
} else {
    Write-ColorOutput "❌ Setup failed. Check the errors above." "Error"
    exit 1
} 
} 