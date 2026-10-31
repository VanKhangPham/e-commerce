# PostgreSQL Backup Script for Windows PowerShell
param (
    [string]$ContainerName = "nova_postgres_db",
    [string]$DbUser = "nova_admin",
    [string]$DbName = "nova_commerce_db",
    [string]$BackupDir = "$PSScriptRoot/../backups",
    [int]$RetentionDays = 7
)

$ErrorActionPreference = "Stop"

if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
}

$Timestamp = (Get-Date).ToString("yyyyMMdd_HHmmss")
$BackupFile = Join-Path $BackupDir "nova_backup_$Timestamp.sql"

Write-Host "--- Bat dau sao luu co so du lieu $DbName tu container $ContainerName ---" -ForegroundColor Cyan

docker exec -t $ContainerName pg_dump -U $DbUser -d $DbName --clean --if-exists > $BackupFile

if (Test-Path $BackupFile) {
    $FileSize = (Get-Item $BackupFile).Length
    $SizeKB = [math]::Round($FileSize / 1024, 2)
    Write-Host "Sao luu thanh cong: $BackupFile ($SizeKB KB)" -ForegroundColor Green
} else {
    Write-Error "Sao luu that bai, khong tim thay file output."
}

# Cleanup backups older than RetentionDays
Write-Host "--- Don dep ban sao luu cu hon $RetentionDays ngay ---" -ForegroundColor Cyan
$CutoffDate = (Get-Date).AddDays(-$RetentionDays)
Get-ChildItem -Path $BackupDir -Filter "nova_backup_*.sql" | Where-Object { $_.LastWriteTime -lt $CutoffDate } | ForEach-Object {
    Write-Host "Dang xoa ban sao luu cu: $($_.Name)" -ForegroundColor Yellow
    Remove-Item $_.FullName -Force
}

Write-Host "Hoan tat quy trinh sao luu." -ForegroundColor Green
