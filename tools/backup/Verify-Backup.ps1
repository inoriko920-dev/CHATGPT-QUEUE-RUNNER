[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$BackupDir
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git tidak ditemukan di PATH."
}

$dir = (Resolve-Path -LiteralPath $BackupDir).Path
$bundlePath = Join-Path $dir "repo.bundle"
$zipPath = Join-Path $dir "source.zip"
$sumPath = Join-Path $dir "SHA256SUMS.txt"
$manifestPath = Join-Path $dir "BACKUP_MANIFEST.json"

foreach ($path in @($bundlePath, $zipPath, $sumPath, $manifestPath)) {
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        throw "Artifact wajib tidak ditemukan: $path"
    }
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
$expectedBundle = [string]$manifest.artifacts.git_bundle.sha256
$expectedZip = [string]$manifest.artifacts.source_zip.sha256

if ($expectedBundle -notmatch '^[0-9a-fA-F]{64}$' -or $expectedZip -notmatch '^[0-9a-fA-F]{64}$') {
    throw "Manifest belum memiliki SHA-256 valid."
}

$actualBundle = (Get-FileHash -Algorithm SHA256 -LiteralPath $bundlePath).Hash.ToLowerInvariant()
$actualZip = (Get-FileHash -Algorithm SHA256 -LiteralPath $zipPath).Hash.ToLowerInvariant()

if ($actualBundle -ne $expectedBundle.ToLowerInvariant()) {
    throw "SHA-256 repo.bundle TIDAK COCOK. Expected=$expectedBundle Actual=$actualBundle"
}
if ($actualZip -ne $expectedZip.ToLowerInvariant()) {
    throw "SHA-256 source.zip TIDAK COCOK. Expected=$expectedZip Actual=$actualZip"
}

$sumText = Get-Content -LiteralPath $sumPath -Raw
if ($sumText -notmatch [regex]::Escape("$expectedBundle  repo.bundle")) {
    throw "SHA256SUMS.txt tidak memuat checksum repo.bundle yang sesuai manifest."
}
if ($sumText -notmatch [regex]::Escape("$expectedZip  source.zip")) {
    throw "SHA256SUMS.txt tidak memuat checksum source.zip yang sesuai manifest."
}

$tempRepo = Join-Path ([System.IO.Path]::GetTempPath()) ("cqr_bundle_verify_" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tempRepo -Force | Out-Null
try {
    & git init -q $tempRepo 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "Gagal membuat temporary Git repo untuk bundle verify." }

    $verifyOutput = & git -C $tempRepo bundle verify $bundlePath 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "git bundle verify gagal:`n$($verifyOutput -join [Environment]::NewLine)"
    }
}
finally {
    Remove-Item -LiteralPath $tempRepo -Recurse -Force -ErrorAction SilentlyContinue
}

$manifest.backup_status = "VERIFIED_ARTIFACTS_NOT_RESTORED"
$manifest.verification.sha256 = "PASS"
$manifest.verification.bundle_verify = "PASS"
$manifest | Add-Member -NotePropertyName verified_utc -NotePropertyValue ((Get-Date).ToUniversalTime().ToString("o")) -Force
$manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

Write-Host "SHA-256: PASS"
Write-Host "git bundle verify: PASS"
Write-Host "Status: VERIFIED_ARTIFACTS_NOT_RESTORED"
Write-Host "Restore drill masih wajib sebelum backup dinyatakan VERIFIED penuh."
