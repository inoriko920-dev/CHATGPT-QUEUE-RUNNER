[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$BackupDir,

    [Parameter(Mandatory = $true)]
    [string]$RestorePath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git tidak ditemukan di PATH."
}

$dir = (Resolve-Path -LiteralPath $BackupDir).Path
$verifyScript = Join-Path $PSScriptRoot "Verify-Backup.ps1"
if (-not (Test-Path -LiteralPath $verifyScript -PathType Leaf)) {
    throw "Verify-Backup.ps1 tidak ditemukan di $PSScriptRoot"
}

# Always verify hashes and bundle immediately before a restore drill.
& $verifyScript -BackupDir $dir
if (-not $?) {
    throw "Verify-Backup.ps1 gagal. Restore dihentikan."
}

$manifestPath = Join-Path $dir "BACKUP_MANIFEST.json"
$bundlePath = Join-Path $dir "repo.bundle"
$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
$expectedHead = [string]$manifest.source.head_commit

if ($expectedHead -notmatch '^[0-9a-fA-F]{40,64}$') {
    throw "HEAD commit pada manifest tidak valid: $expectedHead"
}

$restoreFull = [System.IO.Path]::GetFullPath($RestorePath)
if (Test-Path -LiteralPath $restoreFull) {
    throw "RestorePath sudah ada. Gunakan folder baru agar tidak menimpa data: $restoreFull"
}

$parent = Split-Path -Parent $restoreFull
if (-not (Test-Path -LiteralPath $parent)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
}

try {
    $cloneOutput = & git clone $bundlePath $restoreFull 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "git clone dari bundle gagal:`n$($cloneOutput -join [Environment]::NewLine)"
    }

    $fsckOutput = & git -C $restoreFull fsck --full 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "git fsck --full gagal:`n$($fsckOutput -join [Environment]::NewLine)"
    }

    $restoredHead = (& git -C $restoreFull rev-parse HEAD 2>&1 | Select-Object -Last 1).Trim()
    if ($LASTEXITCODE -ne 0) {
        throw "Tidak dapat membaca HEAD hasil restore."
    }

    if ($restoredHead.ToLowerInvariant() -ne $expectedHead.ToLowerInvariant()) {
        throw "Restored HEAD berbeda dari manifest. Expected=$expectedHead Actual=$restoredHead"
    }

    $manifest.backup_status = "VERIFIED"
    $manifest.verification.sha256 = "PASS"
    $manifest.verification.bundle_verify = "PASS"
    $manifest.verification.restore_drill = "PASS"
    $manifest.verification.git_fsck = "PASS"
    $manifest.verification.restored_head_matches_manifest = "PASS"
    $manifest | Add-Member -NotePropertyName restore_drill_utc -NotePropertyValue ((Get-Date).ToUniversalTime().ToString("o")) -Force
    $manifest | Add-Member -NotePropertyName restore_drill_path -NotePropertyValue "LOCAL_PATH_NOT_EMBEDDED" -Force
    $manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

    Write-Host "Restore drill: PASS"
    Write-Host "git fsck --full: PASS"
    Write-Host "Restored HEAD: $restoredHead"
    Write-Host "Status backup: VERIFIED"
    Write-Host "Restore tersedia di: $restoreFull"
}
catch {
    Write-Error $_
    throw
}
