

# chrome manifest transfer to build directory

# get chrome directory and
$chromeFolder = ".\browser-search-regex\chrome\"
# convert the contents of manifest.json to a powershell object
$manifestJSON = Get-Content "$($chromeFolder)manifest.json" -raw | ConvertFrom-Json

# insure that the js and the css attributes are of type ArrayList
$manifestJSON.content_scripts[0].js = New-Object -TypeName 'System.Collections.ArrayList'
$manifestJSON.content_scripts[0].css = New-Object -TypeName 'System.Collections.ArrayList'

# loop through each .ts and .css file and add their paths to the manifest
Get-ChildItem "$($chromeFolder)*" -Include *.ts -Recurse | 
  ForEach-Object { 
    $curRoot = (Split-Path -Path $_)
    $rightSide = (Split-Path -Leaf -Resolve $_)
    while ($curRoot -ne $PSScriptRoot) {
      $rightSide = "$(Split-Path -Leaf -Resolve $curRoot)\$($rightSide)"
      $curRoot = (Split-Path -Path $curRoot)
    }
    $manifestJSON.content_scripts[0].js.Add(".\$($rightSide)")
  } | 
  Out-Null 
Get-ChildItem "$($chromeFolder)*" -Include *.css -Recurse | 
  ForEach-Object {
    $curRoot = (Split-Path -Path $_)
    $rightSide = (Split-Path -Leaf -Resolve $_)
    while ($curRoot -ne $PSScriptRoot) {
      $rightSide = "$(Split-Path -Leaf -Resolve $curRoot)\$($rightSide)"
      $curRoot = (Split-Path -Path $curRoot)
    }
    $manifestJSON.content_scripts[0].css.Add(".\$($rightSide)")
  } | 
  Out-Null 

# write the new json to the build manifest file
$manifestJSON | ConvertTo-Json -depth 3 > ".\build\chrome\manifest.json" -WarningAction:SilentlyContinue