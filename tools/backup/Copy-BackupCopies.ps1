[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$BackupDir,

    [Parameter(Mandatory = $true)]
    [string]$SecondaryDestination,

    [Parameter(Mandatory = $true)]
    [string]$OffsiteDestination
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$source = (Resolve-Path -LiteralPath $BackupDir).Path
$manifestPath = Join-Path $source "BACKUP_MANIFEST.json"
if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
    throw "BACKUP_MANIFEST.json tidak ditemukan."
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
if ([string]$manifest.backup_status -ne "VERIFIED") {
    throw "Offsite copy canonical diblokir karena backup_status belum VERIFIED. Jalankan verify + restore drill dahulu."
}

$secondaryRoot = [System.IO.Path]::GetFullPath($SecondaryDestination)
$offsiteRoot = [System.IO.Path]::GetFullPath($OffsiteDestination)
if ($secondaryRoot -eq $offsiteRoot) {
    throw "SecondaryDestination dan OffsiteDestination harus berbeda."
}

$trimChars = [char[]]@('\', '/')
$sourceNormalized = $source.TrimEnd($trimChars)
$sourcePrefix = $sourceNormalized + [System.IO.Path]::DirectorySeparatorChar
foreach ($root in @($secondaryRoot, $offsiteRoot)) {
    $rootNormalized = $root.TrimEnd($trimChars)
    if (
        $rootNormalized.Equals($sourceNormalized, [System.StringComparison]::OrdinalIgnoreCase) -or
        $rootNormalized.StartsWith($sourcePrefix, [System.StringComparison]::OrdinalIgnoreCase)
    ) {
        throw "Destination tidak boleh sama dengan atau berada di dalam BackupDir: $root"
    }
}

$folderName = Split-Path -Leaf $source
$secondaryTarget = Join-Path $secondaryRoot $folderName
$offsiteTarget = Join-Path $offsiteRoot $folderName

foreach ($target in @($secondaryTarget, $offsiteTarget)) {
    if (Test-Path -LiteralPath $target) {
        throw "Destination sudah memiliki folder backup: $target"
    }
}

foreach ($root in @($secondaryRoot, $offsiteRoot)) {
    if (-not (Test-Path -LiteralPath $root)) {
        New-Item -ItemType Directory -Path $root -Force | Out-Null
    }
}

Copy-Item -LiteralPath $source -Destination $secondaryTarget -Recurse -Force
Copy-Item -LiteralPath $source -Destination $offsiteTarget -Recurse -Force

function Assert-ArtifactHash {
    param(
        [Parameter(Mandatory = $true)][string]$Root,
        [Parameter(Mandatory = $true)][string]$FileName,
        [Parameter(Mandatory = $true)][string]$ExpectedHash
    )

    $path = Join-Path $Root $FileName
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        throw "Artifact copy hilang: $path"
    }
    $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash.ToLowerInvariant()
    if ($actual -ne $ExpectedHash.ToLowerInvariant()) {
        throw "Hash mismatch setelah copy: $path"
    }
}

$bundleHash = [string]$manifest.artifacts.git_bundle.sha256
$zipHash = [string]$manifest.artifacts.source_zip.sha256
foreach ($target in @($secondaryTarget, $offsiteTarget)) {
    Assert-ArtifactHash -Root $target -FileName "repo.bundle" -ExpectedHash $bundleHash
    Assert-ArtifactHash -Root $target -FileName "source.zip" -ExpectedHash $zipHash
}

$manifest.copies.secondary_media = "COPIED_AND_HASH_VERIFIED"
$manifest.copies.offsite = "COPIED_AND_HASH_VERIFIED"
$manifest | Add-Member -NotePropertyName copies_verified_utc -NotePropertyValue ((Get-Date).ToUniversalTime().ToString("o")) -Force
$manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

# Refresh manifest in the two copies so all three sets report the final copy status.
Copy-Item -LiteralPath $manifestPath -Destination (Join-Path $secondaryTarget "BACKUP_MANIFEST.json") -Force
Copy-Item -LiteralPath $manifestPath -Destination (Join-Path $offsiteTarget "BACKUP_MANIFEST.json") -Force

Write-Host "Secondary copy: PASS ($secondaryTarget)"
Write-Host "Offsite copy: PASS ($offsiteTarget)"
Write-Host "repo.bundle + source.zip hashes match source backup."
Write-Warning "Pastikan kedua destination benar-benar berada pada media/provider berbeda; script tidak dapat membuktikan independensi fisik/provider hanya dari path."
