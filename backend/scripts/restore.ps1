# PostgreSQL Restore Script for Windows PowerShell
param (
    [Parameter(Mandatory=$true)]
    [string]$BackupFile,
    [string]$ContainerName = "nova_postgres_db",
    [string]$DbUser = "nova_admin",
    [string]$DbName = "nova_commerce_db"
)

$ErrorActionPreference = "Stop"

if (!(Test-Path $BackupFile)) {
    Write-Error "File sao luu khong ton tai: $BackupFile"
}

Write-Host "--- Bat dau phuc hoi co so du lieu $DbName tu file $BackupFile ---" -ForegroundColor Yellow

Get-Content $BackupFile | docker exec -i $ContainerName psql -U $DbUser -d $DbName

Write-Host "Phuc hoi co so du lieu hoan tat thanh cong!" -ForegroundColor Green
