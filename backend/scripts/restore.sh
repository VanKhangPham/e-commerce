#!/bin/bash
set -e

BACKUP_FILE="$1"
CONTAINER_NAME="${2:-nova_postgres_db}"
DB_USER="${3:-nova_admin}"
DB_NAME="${4:-nova_commerce_db}"

if [ -z "$BACKUP_FILE" ] || [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Lỗi: File sao lưu không tồn tại hoặc chưa được chỉ định: $BACKUP_FILE" >&2
    echo "Cách dùng: ./restore.sh <duong-dan-file-backup.sql>"
    exit 1
fi

echo "--- Bắt đầu phục hồi cơ sở dữ liệu ${DB_NAME} từ ${BACKUP_FILE} ---"
cat "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME"
echo "✓ Phục hồi cơ sở dữ liệu hoàn tất thành công!"
