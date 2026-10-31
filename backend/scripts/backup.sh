#!/bin/bash
set -e

CONTAINER_NAME="${1:-nova_postgres_db}"
DB_USER="${2:-nova_admin}"
DB_NAME="${3:-nova_commerce_db}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${SCRIPT_DIR}/../backups"
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/nova_backup_${TIMESTAMP}.sql"

echo "--- Bắt đầu sao lưu cơ sở dữ liệu ${DB_NAME} ---"
docker exec -t "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists > "$BACKUP_FILE"

if [ -f "$BACKUP_FILE" ]; then
    echo "✓ Sao lưu thành công: $BACKUP_FILE"
else
    echo "❌ Sao lưu thất bại!" >&2
    exit 1
fi

echo "--- Dọn dẹp bản sao lưu cũ hơn ${RETENTION_DAYS} ngày ---"
find "$BACKUP_DIR" -name "nova_backup_*.sql" -type f -mtime +"$RETENTION_DAYS" -delete
echo "✓ Hoàn tất quy trình sao lưu."
