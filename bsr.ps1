

# chrome manifest transfer to build directory

# set up file path variables
$chromeFolder = "./browser-search-regex/chrome/"
$buildChromeFolder = "./build/chrome/"
$manifestFile = "manifest.json"

# delete all items currently in the build folder
Remove-Item $buildChromeFolder -Recurse 

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
    $fileName = (Split-Path -Leaf -Resolve $_)
    if ((Get-ChildItem $_ | Select-Object Extension).Extension -eq ".ts") {
      $manifestJSON.content_scripts[0].js.Add("./$($fileName)".replace('.ts', '.js'))
    }
    elseif ((Get-ChildItem $_ | Select-Object Extension).Extension -eq ".css") {
      $manifestJSON.content_scripts[0].css.Add("./$($fileName)")
    }
  } | 
  Out-Null 

# write the new json to the build manifest file
$manifestJSON | ConvertTo-Json -depth 3 > "$($buildChromeFolder)$($manifestFile)" -WarningAction:SilentlyContinue
