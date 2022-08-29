
# set up file path variables for chrome
$chromeFolder = "./browser-search-regex/chrome/"
$buildChromeFolder = "./build/chrome/"
$customLibFolder = "./browser-search-regex/custom_lib/"
$manifestFile = "manifest.json"

# create the manifest.json file for chrome
New-Item -Path "$($buildChromeFolder)$($manifestFile)" -ItemType File -Force | Out-Null

# convert the contents of manifest.json to a powershell object
$manifestJSON = Get-Content "$($chromeFolder)$($manifestFile)" -raw | ConvertFrom-Json

function ChromeIncludeTSPathsInManifest {
  param($parentDir)
  Get-ChildItem "$($parentDir)*" -Include *.ts, *.css -Exclude *.d.ts, *background.ts | 
    ForEach-Object { 
      $fileName = (Split-Path -Leaf -Resolve $_)
      if ((Get-ChildItem $_ | Select-Object Extension).Extension -eq ".ts") {
        $manifestJSON.content_scripts[0].js.Add("./$($fileName)".replace('.ts', '.js'))
      }
      elseif ((Get-ChildItem $_ | Select-Object Extension).Extension -eq ".css") {
        $manifestJSON.content_scripts[0].css.Add("./$($fileName)")
      }
    } | 
    Out-Null 
}

# create necessary build folder if it does not exist
if (-not (Test-Path -Path $buildChromeFolder)) {
  New-Item -Path "$($buildChromeFolder)" -ItemType Directory -Force | Out-Null
}

# delete all items currently in the build folder
Remove-Item $buildChromeFolder -Recurse 

# copy all files that are not of type .ts or .json
Get-ChildItem "$($chromeFolder)" -Exclude *.ts, *.json | 
  ForEach-Object {
    Copy-Item $_ "$($buildChromeFolder)$(Split-Path -Leaf -Resolve $_)" -Exclude *.ts, *.json -Recurse
  }

# insure that the js and the css attributes are of type ArrayList
$originalJS = $manifestJSON.content_scripts[0].js
$manifestJSON.content_scripts[0].js = New-Object -TypeName 'System.Collections.ArrayList'
$originalCSS = $manifestJSON.content_scripts[0].css
$manifestJSON.content_scripts[0].css = New-Object -TypeName 'System.Collections.ArrayList'

# loop through each .ts and .css file and add their paths to the manifest
ChromeIncludeTSPathsInManifest -parentDir $chromeFolder

$manifestJSON.content_scripts[0].js = $originalJS + $manifestJSON.content_scripts[0].js
$manifestJSON.content_scripts[0].css = $originalCSS + $manifestJSON.content_scripts[0].css

# write the new json to the build manifest file
$manifestJSON | ConvertTo-Json -depth 32 | set-content "$($buildChromeFolder)$($manifestFile)"
