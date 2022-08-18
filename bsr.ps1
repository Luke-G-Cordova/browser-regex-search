

# chrome manifest transfer to build directory

# set up file path variables
$chromeFolder = ".\browser-search-regex\chrome\"
$buildChromeFolder = ".\build\chrome\"
$manifestFile = "manifest.json"

# delete all items currently in the build folder
Remove-Item $buildChromeFolder -Recurse -Exclude *.js, *.js.map

# copy all files that are not of type .ts or .json
Get-ChildItem "$($chromeFolder)" -Exclude *.ts, *.json | 
  ForEach-Object {
    Copy-Item $_ "$($buildChromeFolder)$(Split-Path -Leaf -Resolve $_)" -Recurse
  }
# create the manifest.json file
New-Item -Path "$($buildChromeFolder)$($manifestFile)" -ItemType File -Force | Out-Null

# convert the contents of manifest.json to a powershell object
$manifestJSON = Get-Content "$($chromeFolder)$($manifestFile)" -raw | ConvertFrom-Json

# insure that the js and the css attributes are of type ArrayList
$manifestJSON.content_scripts[0].js = New-Object -TypeName 'System.Collections.ArrayList'
$manifestJSON.content_scripts[0].css = New-Object -TypeName 'System.Collections.ArrayList'

# loop through each .ts and .css file and add their paths to the manifest
Get-ChildItem "$($chromeFolder)*" -Include *.ts, *.css -Exclude *background.ts -Recurse | 
  ForEach-Object { 
    $curRoot = (Split-Path -Path $_)
    $rightSide = (Split-Path -Leaf -Resolve $_)
    while ($curRoot -ne $PSScriptRoot) {
      $rightSide = "$(Split-Path -Leaf -Resolve $curRoot)\$($rightSide)"
      $curRoot = (Split-Path -Path $curRoot)
    }
    if ((Get-ChildItem $_ | Select-Object Extension).Extension -eq ".ts") {
      $manifestJSON.content_scripts[0].js.Add(
        ".\$($rightSide)".replace('browser-search-regex', 'build').replace('.ts', '.js')
      )
    }
    elseif ((Get-ChildItem $_ | Select-Object Extension).Extension -eq ".css") {
      $manifestJSON.content_scripts[0].css.Add(
        ".\$($rightSide)".replace('browser-search-regex', 'build')
      )
    }
  } | 
  Out-Null 

# write the new json to the build manifest file
$manifestJSON | ConvertTo-Json -depth 3 > "$($buildChromeFolder)$($manifestFile)" -WarningAction:SilentlyContinue
