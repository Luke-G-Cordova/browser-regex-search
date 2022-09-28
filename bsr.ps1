
$chromeSrc = "$PSScriptRoot\browser-search-regex\chrome"

./chrome.ps1 $chromeSrc "Rebuild"

# file watching logic
$fileWatcher = New-Object System.IO.FileSystemWatcher
$fileWatcher.Path = $chromeSrc 
$fileWatcher.Filter = "*.*"

$fileWatcher.IncludeSubdirectories = $true
$fileWatcher.EnableRaisingEvents = $true

Register-ObjectEvent $fileWatcher "Created" -Action { ./chrome.ps1 $Event.SourceEventArgs.FullPath "Created" }
Register-ObjectEvent $fileWatcher "Changed" -Action { ./chrome.ps1 $Event.SourceEventArgs.FullPath "Changed" }
Register-ObjectEvent $fileWatcher "Deleted" -Action { ./chrome.ps1 "Deleted" "Deleted" }
Register-ObjectEvent $fileWatcher "Renamed" -Action { ./chrome.ps1 $Event.SourceEventArgs.FullPath "Renamed" }

cp "$PSScriptRoot\node_modules\@webcomponents\webcomponentsjs\webcomponents-bundle.js" "$PSScriptRoot\build\chrome\webcomponents-bundle.js"

while ($true) { sleep 1 }