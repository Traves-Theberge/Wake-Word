# GitHub Release Helper Script

param(
    [Parameter(Mandatory=$true)]
    [string]$Version,
    [switch]$DryRun
)

function Show-Help {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "Wake Word Detector - GitHub Release Helper" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  scripts\create-release.ps1 -Version 1.0.0" -ForegroundColor White
    Write-Host "  scripts\create-release.ps1 -Version 1.0.1 -DryRun" -ForegroundColor White
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  -Version    Version number (e.g., 1.0.0)" -ForegroundColor White
    Write-Host "  -DryRun     Show what would be done without executing" -ForegroundColor White
    Write-Host ""
}

function Test-GitRepository {
    try {
        $gitStatus = git status --porcelain 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Not in a git repository" -ForegroundColor Red
            return $false
        }
        
        if ($gitStatus) {
            Write-Host "⚠️ You have uncommitted changes:" -ForegroundColor Yellow
            git status --short
            Write-Host ""
            $continue = Read-Host "Continue anyway? (y/n)"
            if ($continue -ne "y" -and $continue -ne "Y") {
                return $false
            }
        }
        
        return $true
    } catch {
        Write-Host "❌ Git not available" -ForegroundColor Red
        return $false
    }
}

function Build-Application {
    Write-Host "🔨 Building application..." -ForegroundColor Yellow
    
    if ($DryRun) {
        Write-Host "[DRY RUN] Would run: npm run dist" -ForegroundColor Cyan
        return $true
    }
    
    npm run dist
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Build failed" -ForegroundColor Red
        return $false
    }
    
    Write-Host "✅ Application built successfully" -ForegroundColor Green
    return $true
}

function Build-Installer {
    Write-Host "📦 Building installer..." -ForegroundColor Yellow
    
    if ($DryRun) {
        Write-Host "[DRY RUN] Would run: npm run installer:build" -ForegroundColor Cyan
        return $true
    }
    
    # Check if NSIS is available
    try {
        makensis /VERSION | Out-Null
    } catch {
        Write-Host "❌ NSIS not found. Installing..." -ForegroundColor Red
        npm run installer:nsis
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to install NSIS" -ForegroundColor Red
            return $false
        }
    }
    
    npm run installer:build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Installer build failed" -ForegroundColor Red
        return $false
    }
    
    if (Test-Path "Wake-Word-Detector-Setup.exe") {
        $fileSize = (Get-Item "Wake-Word-Detector-Setup.exe").Length / 1MB
        Write-Host "✅ Installer created: Wake-Word-Detector-Setup.exe ($([math]::Round($fileSize, 1)) MB)" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ Installer file not found" -ForegroundColor Red
        return $false
    }
}

function Create-GitTag {
    param([string]$TagName)
    
    Write-Host "🏷️ Creating git tag: $TagName" -ForegroundColor Yellow
    
    if ($DryRun) {
        Write-Host "[DRY RUN] Would run: git tag -a $TagName -m 'Release $TagName'" -ForegroundColor Cyan
        Write-Host "[DRY RUN] Would run: git push origin $TagName" -ForegroundColor Cyan
        return $true
    }
    
    # Check if tag already exists
    $existingTag = git tag -l $TagName 2>$null
    if ($existingTag) {
        Write-Host "⚠️ Tag $TagName already exists" -ForegroundColor Yellow
        $overwrite = Read-Host "Delete and recreate? (y/n)"
        if ($overwrite -eq "y" -or $overwrite -eq "Y") {
            git tag -d $TagName
            git push origin :refs/tags/$TagName 2>$null
        } else {
            return $false
        }
    }
    
    git tag -a $TagName -m "Release $TagName"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create tag" -ForegroundColor Red
        return $false
    }
    
    git push origin $TagName
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to push tag" -ForegroundColor Red
        return $false
    }
    
    Write-Host "✅ Tag created and pushed successfully" -ForegroundColor Green
    return $true
}

function Show-ReleaseInstructions {
    param([string]$Version)
    
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "🎉 Ready for GitHub Release!" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/Traves-Theberge/Wakeword/releases" -ForegroundColor White
    Write-Host "2. Click 'Create a new release'" -ForegroundColor White
    Write-Host "3. Use tag: v$Version" -ForegroundColor White
    Write-Host "4. Upload: Wake-Word-Detector-Setup.exe" -ForegroundColor White
    Write-Host "5. Use the release template from GITHUB-RELEASE-GUIDE.md" -ForegroundColor White
    Write-Host ""
    Write-Host "Or if you set up the GitHub Action, the release will be created automatically!" -ForegroundColor Green
    Write-Host ""
}

# Main script execution
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Wake Word Detector - Release Preparation" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if (-not $Version) {
    Show-Help
    exit 1
}

# Validate version format
if ($Version -notmatch '^\d+\.\d+\.\d+$') {
    Write-Host "❌ Invalid version format. Use semantic versioning (e.g., 1.0.0)" -ForegroundColor Red
    exit 1
}

$tagName = "v$Version"

Write-Host "Preparing release for version: $Version" -ForegroundColor White
Write-Host "Git tag will be: $tagName" -ForegroundColor White
if ($DryRun) {
    Write-Host "🔍 DRY RUN MODE - No changes will be made" -ForegroundColor Cyan
}
Write-Host ""

# Check git repository
if (-not (Test-GitRepository)) {
    exit 1
}

# Build application
if (-not (Build-Application)) {
    exit 1
}

# Build installer
if (-not (Build-Installer)) {
    exit 1
}

# Create and push git tag
if (-not (Create-GitTag $tagName)) {
    exit 1
}

# Show next steps
Show-ReleaseInstructions $Version

Write-Host "✅ Release preparation complete!" -ForegroundColor Green
