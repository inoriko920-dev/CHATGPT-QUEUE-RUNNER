[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$RepoPath = ".",

    [Parameter(Mandatory = $false)]
    [string]$OutputRoot = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Invoke-GitChecked {
    param(
        [Parameter(Mandatory = $true)][string]$WorkingDirectory,
        [Parameter(Mandatory = $true)][string[]]$Arguments
    )

    $output = & git -C $WorkingDirectory @Arguments 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "git $($Arguments -join ' ') failed:`n$($output -join [Environment]::NewLine)"
    }
    return $output
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git tidak ditemukan di PATH. Install Git for Windows terlebih dahulu."
}

$repo = (Resolve-Path -LiteralPath $RepoPath).Path
$inside = (Invoke-GitChecked -WorkingDirectory $repo -Arguments @("rev-parse", "--is-inside-work-tree") | Select-Object -Last 1).Trim()
if ($inside -ne "true") {
    throw "RepoPath bukan working tree Git."
}

$status = Invoke-GitChecked -WorkingDirectory $repo -Arguments @("status", "--porcelain")
if (($status | Measure-Object).Count -gt 0) {
    throw "Working tree tidak bersih. Commit/stash perubahan terlebih dahulu agar backup canonical tidak kehilangan perubahan lokal."
}

$head = (Invoke-GitChecked -WorkingDirectory $repo -Arguments @("rev-parse", "HEAD") | Select-Object -Last 1).Trim()
$short = (Invoke-GitChecked -WorkingDirectory $repo -Arguments @("rev-parse", "--short=7", "HEAD") | Select-Object -Last 1).Trim()

$branchOutput = & git -C $repo symbolic-ref --short -q HEAD 2>$null
if ($LASTEXITCODE -eq 0 -and $branchOutput) {
    $branch = ($branchOutput | Select-Object -Last 1).Trim()
} else {
    $branch = "DETACHED_HEAD"
}

if ([string]::IsNullOrWhiteSpace($OutputRoot)) {
    $parent = Split-Path -Parent $repo
    $OutputRoot = Join-Path $parent "_CHATGPT_QUEUE_RUNNER_BACKUPS"
}

$outputFull = [System.IO.Path]::GetFullPath($OutputRoot)
$repoFullWithSep = $repo.TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar
if ($outputFull.StartsWith($repoFullWithSep, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "OutputRoot tidak boleh berada di dalam repository. Pilih folder backup di luar repo."
}

# Fail closed for obvious tracked secret files.
$tracked = Invoke-GitChecked -WorkingDirectory $repo -Arguments @("ls-files")
$highRiskNamePatterns = @(
    '(^|/|\\)\.env($|\.)',
    '(^|/|\\)id_rsa$',
    '(^|/|\\)id_ed25519$',
    '\.(pem|p12|pfx|key)$',
    '(^|/|\\)(cookies?|credentials?|secrets?)(\.|$)'
)

$badNames = New-Object System.Collections.Generic.List[string]
foreach ($file in $tracked) {
    if ($file -match '(^|/|\\)\.env\.example$') { continue }
    foreach ($pattern in $highRiskNamePatterns) {
        if ($file -match $pattern) {
            $badNames.Add($file)
            break
        }
    }
}
if ($badNames.Count -gt 0) {
    throw "Backup diblokir: file tracked berisiko secret ditemukan:`n$($badNames -join [Environment]::NewLine)"
}

# Lightweight common-format scan. Pattern fragments are assembled at runtime so
# this script does not self-match merely because it documents the formats.
$secretPatterns = @(
    ('gh' + '[pousr]_[A-Za-z0-9_]{20,}'),
    ('AIza' + '[0-9A-Za-z_-]{30,}'),
    ('sk-' + '[A-Za-z0-9_-]{20,}'),
    ('-----BEGIN ' + '([A-Z ]+ )?PRIVATE KEY-----')
)
$secretRegex = $secretPatterns -join '|'
$grepOutput = & git -C $repo grep -I -n -E -e $secretRegex HEAD -- . 2>$null
$grepExit = $LASTEXITCODE
if ($grepExit -eq 0) {
    throw "Backup diblokir: pola secret umum terdeteksi pada tracked HEAD. Tinjau dan rotasi/revoke secret sebelum backup.`n$($grepOutput -join [Environment]::NewLine)"
}
if ($grepExit -gt 1) {
    throw "Secret preflight git grep gagal dengan exit code $grepExit."
}

$timestamp = (Get-Date).ToUniversalTime().ToString("yyyyMMdd_HHmmss'Z'")
$backupName = "CHATGPT-QUEUE-RUNNER_backup_${timestamp}_${short}"
$backupDir = Join-Path $outputFull $backupName
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

$bundlePath = Join-Path $backupDir "repo.bundle"
$zipPath = Join-Path $backupDir "source.zip"
$sumPath = Join-Path $backupDir "SHA256SUMS.txt"
$manifestPath = Join-Path $backupDir "BACKUP_MANIFEST.json"

try {
    Invoke-GitChecked -WorkingDirectory $repo -Arguments @("bundle", "create", $bundlePath, "--all") | Out-Null
    $bundleVerify = Invoke-GitChecked -WorkingDirectory $repo -Arguments @("bundle", "verify", $bundlePath)
    Invoke-GitChecked -WorkingDirectory $repo -Arguments @("archive", "--format=zip", "--output=$zipPath", "HEAD") | Out-Null

    $bundleHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $bundlePath).Hash.ToLowerInvariant()
    $zipHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $zipPath).Hash.ToLowerInvariant()

    @(
        "$bundleHash  repo.bundle",
        "$zipHash  source.zip"
    ) | Set-Content -LiteralPath $sumPath -Encoding UTF8

    $manifest = [ordered]@{
        schema_version = "1.0"
        project = "CHATGPT-QUEUE-RUNNER"
        backup_status = "CREATED_NOT_RESTORED"
        created_utc = (Get-Date).ToUniversalTime().ToString("o")
        provenance = "RECONSTRUCTED_FROM_DOCS"
        source = [ordered]@{
            repository = "inoriko920-dev/CHATGPT-QUEUE-RUNNER"
            local_clone_path = "LOCAL_PATH_NOT_EMBEDDED"
            branch = $branch
            head_commit = $head
            working_tree_clean = $true
        }
        artifacts = [ordered]@{
            git_bundle = [ordered]@{
                file = "repo.bundle"
                sha256 = $bundleHash
                created_with = "git bundle create --all"
                verify_status = "PASS"
            }
            source_zip = [ordered]@{
                file = "source.zip"
                sha256 = $zipHash
                created_with = "git archive HEAD"
                scope = "tracked committed files at HEAD"
            }
            checksums = [ordered]@{
                file = "SHA256SUMS.txt"
                algorithm = "SHA-256"
            }
        }
        secret_control = [ordered]@{
            high_risk_filename_scan = "PASS"
            common_secret_pattern_scan = "PASS"
            dedicated_history_scanner = "NOT_RUN"
            notes = "Run a dedicated history scanner such as gitleaks before declaring the full history secret-clean."
        }
        verification = [ordered]@{
            sha256 = "GENERATED"
            bundle_verify = "PASS"
            restore_drill = "NOT_RUN"
            git_fsck = "NOT_RUN"
            restored_head_matches_manifest = "NOT_RUN"
        }
        copies = [ordered]@{
            working_clone = "LOCAL_PRIMARY"
            secondary_media = "PENDING"
            offsite = "PENDING"
        }
        retention_class = "RECOVERY_CHECKPOINT"
        notes = @(
            "Do not mark VERIFIED until Verify-Backup.ps1 and Restore-Backup.ps1 pass.",
            "Second GitHub account is an additional mirror, not independent 3-2-1 backup."
        )
    }

    $manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

    Write-Host "Backup dibuat: $backupDir"
    Write-Host "HEAD: $head"
    Write-Host "Bundle verify: PASS"
    Write-Host "Status: CREATED_NOT_RESTORED"
    Write-Host "Lanjutkan dengan Verify-Backup.ps1 lalu Restore-Backup.ps1."
}
catch {
    Write-Error $_
    throw
}
