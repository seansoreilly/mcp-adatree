# Script to reorganize the project structure - Final pass
Write-Host "Starting final project reorganization..." -ForegroundColor Green

# Identify application files that should stay in src/
$appFiles = @(
    "App.css", "App.test.tsx", "App.tsx", "index.css", 
    "index.tsx", "logo.svg", "reportWebVitals.ts", "react-app-env.d.ts"
)

# Move application files from root to src/ if they exist in both places
Write-Host "Moving application files to src/..." -ForegroundColor Yellow
foreach ($file in $appFiles) {
    if (Test-Path "./$file") {
        # Check if there's a newer version in the root
        if (Test-Path "src/$file") {
            $rootFile = Get-Item "./$file"
            $srcFile = Get-Item "src/$file"
            
            # If root file is newer or same, use it
            if ($rootFile.LastWriteTime -ge $srcFile.LastWriteTime) {
                Remove-Item "src/$file" -Force
                Move-Item "./$file" "src/" -Force
                Write-Host "  Updated src/$file with newer version from root" -ForegroundColor Cyan
            }
            else {
                # Source file is newer, remove root file
                Remove-Item "./$file" -Force
                Write-Host "  Kept src/$file (newer than root version)" -ForegroundColor Cyan
            }
        }
        else {
            # File exists in root but not in src/, move it
            Move-Item "./$file" "src/" -Force
            Write-Host "  Moved $file to src/" -ForegroundColor Cyan
        }
    }
}

# Make sure we don't have duplicated files between src/public and public/
if (Test-Path "src/public") {
    Write-Host "Cleaning up duplicate public files..." -ForegroundColor Yellow
    # Check if we need to remove the src/public directory after verifying files are in public/
    $allFilesMoved = $true
    
    Get-ChildItem -Path "src/public" -File | ForEach-Object {
        $srcFile = $_
        $destFile = "public/$($srcFile.Name)"
        
        if (-not (Test-Path $destFile)) {
            # File in src/public not in public/, copy it
            Copy-Item -Path $srcFile.FullName -Destination "public/" -Force
            Write-Host "  Moved $($srcFile.Name) to public/" -ForegroundColor Cyan
        }
    }
    
    # Remove src/public directory since we've moved all files
    if ($allFilesMoved) {
        Remove-Item -Path "src/public" -Recurse -Force
        Write-Host "  Removed src/public directory (files moved to root public/)" -ForegroundColor Cyan
    }
}

# Clean up any duplicate utils directory if it exists at root 
if ((Test-Path "./utils") -and (Test-Path "src/utils")) {
    Write-Host "Moving utils directory contents to src/utils..." -ForegroundColor Yellow
    Get-ChildItem -Path "./utils" -File | ForEach-Object {
        $srcFile = $_
        $destFile = "src/utils/$($srcFile.Name)"
        
        if (-not (Test-Path $destFile)) {
            # File in utils not in src/utils, copy it
            Copy-Item -Path $srcFile.FullName -Destination "src/utils/" -Force
            Write-Host "  Moved $($srcFile.Name) to src/utils/" -ForegroundColor Cyan
        }
    }
    
    # Remove root utils directory
    Remove-Item -Path "./utils" -Recurse -Force
    Write-Host "  Removed root utils directory (files moved to src/utils)" -ForegroundColor Cyan
}

Write-Host "Final project reorganization complete!" -ForegroundColor Green
Write-Host "Running npm test to verify the project..." -ForegroundColor Yellow
npm test 