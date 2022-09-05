# get arguments
$changedFile = $args[0]
$changeType = $args[1]

# build a directory given a source directory and a build directory
function buildDir {
  param($srcDir, $buildDir)

  # create build directory if it doesn't exist 
  if (-not (Test-Path -Path $buildDir)) {
    New-Item -Path $buildDir -ItemType Directory -Force | Out-Null
  }

  # delete all items currently in the build folder
  Remove-Item $buildDir -Recurse 

  # copy all files that are not of type .ts or .json from the src directory to the build directory
  Get-ChildItem $srcDir -Exclude *.ts, *.json | 
    ForEach-Object {
      Copy-Item $_ "$buildDir$(Split-Path -Leaf -Resolve $_)" -Exclude *.ts, *.json -Recurse
    }
}

# build the manifest file parameters required
function buildManifest {

  # create the manifest.json file for chrome
  New-Item -Path "$PSScriptRoot/build/chrome/manifest.json" -ItemType File -Force | Out-Null

  # convert the contents of manifest.json to a powershell object
  $manifestJSON = Get-Content "$PSScriptRoot/browser-search-regex/chrome/manifest.json" -raw | ConvertFrom-Json

  # insure that the js and the css attributes are of type ArrayList and save the original data
  $originalJS = $manifestJSON.content_scripts[0].js
  $manifestJSON.content_scripts[0].js = New-Object -TypeName 'System.Collections.ArrayList'
  $originalCSS = $manifestJSON.content_scripts[0].css
  $manifestJSON.content_scripts[0].css = New-Object -TypeName 'System.Collections.ArrayList'
  
  # cd into chromes src directory
  Set-Location "$PSScriptRoot/browser-search-regex/chrome/" 

  # for every file that is a .ts or .css, add it to the manifest as a relative path
  Get-ChildItem "./*" -Include *.ts, *.css -Exclude *.d.ts, *background.ts -Recurse | 
    ForEach-Object { 
      if ($_.Extension -eq ".ts") {
        # make sure to replace .ts extensions with .js
        $manifestJSON.content_scripts[0].js.Add((Resolve-Path $_ -Relative).replace('.ts', '.js').replace("\", "/"))
      }
      elseif ($_.Extension -eq ".css") {
        $manifestJSON.content_scripts[0].css.Add((Resolve-Path $_ -Relative).replace("\", "/"))
      }
    } | 
    Out-Null 
  
  # cd back to original location
  Set-Location $PSScriptRoot
  
  # add original data back to the arrays
  $manifestJSON.content_scripts[0].js = $originalJS + $manifestJSON.content_scripts[0].js
  $manifestJSON.content_scripts[0].css = $originalCSS + $manifestJSON.content_scripts[0].css

  # write the new json to the build manifest file
  $manifestJSON | ConvertTo-Json -depth 32 | set-content "$PSScriptRoot/build/chrome/manifest.json"
}

# checks if a $fileInSrc exists in the build directory
function existsInBuild {
  param($fileInSrc)
  
  # loop through each file in the src folder 
  Get-ChildItem "$PSScriptRoot/browser-search-regex/chrome/"-Exclude *.js, *.js.map -Recurse | 
    ForEach-Object {

      # change the path of the current file to be in the build directory and compare to the $fileInSrc
      if ((getRelativePathToChrome $_.FullName ) -eq $fileInSrc) {
        return $true
      }
    }

  return $false
}

# build a file or directory given a $srcFile, $buildFile, and a $cType which is the change that was made
function buildFile {
  param($srcFile, $buildFile, $cType)

  # get the extension of the $srcFile
  $srcExtension = [System.IO.Path]::GetExtension($srcFile)

  # if the highest parent build/chrome directory does not exist,
  # just build the whole directory
  if (-not (Test-Path -Path "$PSScriptRoot/build/chrome/")) {
    buildDir "$PSScriptRoot/browser-search-regex/chrome/" "$PSScriptRoot/build/chrome/"
  }
  # if the $cType is not Deleted and the $srcFile is a dirctory, build the directory
  elseif (($changeType -ne "Deleted") -and ((Get-Item $srcFile) -is [System.IO.DirectoryInfo])) {
    buildDir $srcFile $buildFile
  }
  # if the src file is a file, just build the file based on what changed or $cType
  else {
    switch ($cType) {
      # a created srcFile should be coppied to the buildFile if it
      # is not a .ts file, .ts files should be handled by typescript
      # if it is a .ts or .css file, build the manifest, if it is
      # a .css file, copy it to the buildFile
      "Created" {
        if ($srcExtension -eq ".ts") {
          buildManifest
        }
        elseif ( $srcExtension -eq ".css") {
          buildManifest
          Copy-Item $srcFile $buildFile
        }
        else {
          Copy-Item $srcFile $buildFile
        }
      }
      # a changed srcFile should be coppied to the buildFile if it 
      # is not a .ts file, .ts files should be handled by typescript
      "Changed" { 
        if ($srcFile -eq "$PSScriptRoot/browser-search-regex/chrome/manifest.json") {
          Write-Host"here"
          buildManifest
        }
        elseif ($srcExtension -ne ".ts") {
          Copy-Item $srcFile $buildFile
        }
      }
      # a deleted srcFile should be deleted from the build if it 
      # is not a .ts file, .ts files should be handled by typescript
      "Deleted" { 
        # search through the src folder for an extra file
        deleteFilesNotInSrc
        buildManifest
      }
      # a renamed srcFile should be coppied to the buildFile if it 
      # is not a .ts file, .ts files should be handled by typescript
      # if the srcFile is of type .css, build the manifest
      "Renamed" { 
        if ( $srcExtension -eq ".ts") {
          buildManifest
        }
        elseif ( $srcExtension -eq ".css") {
          deleteFilesNotInSrc
          Copy-Item $srcFile $buildFile
          buildManifest
        }
        else {
          deleteFilesNotInSrc
          Copy-Item $srcFile $buildFile
        }
      }
    }
  }
}

# delete all files in the build directory that are not in the source directory
function deleteFilesNotInSrc {
  Get-ChildItem "$PSScriptRoot/build/chrome/" -Exclude *.js, *.map -Recurse | 
    ForEach-Object {
      if (-not (existsInBuild $_.FullName)) {
        Remove-Item $_.FullName
      }
    }
}

# returns a files path as if it were a child of the build directory 
# given that it has a parent whos name is chrome
function getRelativePathToChrome {
  param(
    [Parameter(Mandatory, 
      ValueFromPipeline)]
    [string[]]$filePath
  )
  $filePath = $filePath.Replace("/", "\")
  $isChrome = Split-Path -Leaf -Resolve $filePath
  if ($isChrome -eq "chrome") {
    return $filePath
  }
  $retPath = ""
  $parDir = Split-Path $filePath

  while ($isChrome -ne "chrome") {
    if ($retPath -eq "") {
      $retPath = $isChrome
    }
    else {
      $retPath = "$isChrome\$retPath"
    }
    $isChrome = Split-Path -Leaf -Resolve $parDir
    $parDir = Split-Path $parDir

  }
  return "$PSScriptRoot/build/chrome/$retPath".Replace("/", "\")
}

# create the changedFiles path as if it were a child of the build directory
$changedBuildFile = ""
if ($changedFile -ne "Deleted") {
  $changedBuildFile = getRelativePathToChrome $changedFile
}

# build the file
buildFile $changedFile $changedBuildFile $changeType
buildManifest