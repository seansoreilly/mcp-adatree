# Set up the watcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "C:\projects\mcp-adatree"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Track the last time we wrote dir.txt
$global:lastUpdate = Get-Date '2000-01-01T00:00:00'  # Some old time

# Define the action, but throttle it
$action = {
    $now = Get-Date
    if (($now - $global:lastUpdate).TotalSeconds -ge 60) {
        Write-Host "Change detected at $now, updating dir.txt..."
        Get-ChildItem -Recurse | Out-File -Encoding utf8 -FilePath "C:\projects\mcp-adatree\dir.txt"
        $global:lastUpdate = $now
    } else {
        Write-Host "Change detected at $now, but skipped (updated less than a minute ago)."
    }
}

# Register for all types of events
Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $action
Register-ObjectEvent -InputObject $watcher -EventName Created -Action $action
Register-ObjectEvent -InputObject $watcher -EventName Deleted -Action $action
Register-ObjectEvent -InputObject $watcher -EventName Renamed -Action $action

Write-Host "Watching for changes... Press Ctrl+C to stop."
while ($true) {
    Start-Sleep -Seconds 1
}
