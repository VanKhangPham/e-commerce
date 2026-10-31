# Quy Trình Sao Lưu & Phục Hồi Dữ Liệu PostgreSQL (NOVA Commerce)

Tài liệu này hướng dẫn chiến lược sao lưu (backup), lưu trữ và khôi phục (disaster recovery) cho hệ thống cơ sở dữ liệu PostgreSQL của NOVA Commerce.

---

## 1. Cấu Hình Cơ Sở Dữ Liệu

- **Container:** `nova_postgres_db` (PostgreSQL 16 Alpine)
- **Database:** `nova_commerce_db`
- **Username:** `nova_admin`
- **Cổng kết nối:** `5432`

---

## 2. Chiến Lược Sao Lưu (Backup Strategy)

### 2.1. Tần suất & Lưu trữ
- **Tần suất sao lưu:** Thực hiện tự động hàng ngày vào lúc `02:00 AM` (thời điểm lượng truy cập thấp nhất).
- **Định dạng file:** SQL dump kèm câu lệnh `--clean --if-exists` để phục hồi sạch dữ liệu.
- **Vị trí lưu trữ:** `backend/backups/nova_backup_YYYYMMDD_HHMMSS.sql`.
- **Chính sách lưu giữ (Retention Policy):** Mặc định giữ lại các bản sao lưu trong vòng **7 ngày gần nhất**. Các bản sao lưu cũ hơn 7 ngày sẽ tự động được xóa để tối ưu dung lượng ổ đĩa.

### 2.2. Lệnh sao lưu thủ công

#### Trên Windows (PowerShell):
```powershell
powershell -ExecutionPolicy Bypass -File backend/scripts/backup.ps1
```

#### Trên Linux / macOS / Docker:
```bash
chmod +x backend/scripts/backup.sh
./backend/scripts/backup.sh
```

---

## 3. Cấu Hình Lịch Sao Lưu Tự Động (Cron / Scheduled Task)

### 3.1. Trên Linux (Crontab)
Mở bảng cron: `crontab -e` và thêm dòng sau để chạy lúc 2:00 sáng mỗi ngày:
```cron
0 2 * * * /bin/bash /duong/dan/toi/d/e-commerce1/backend/scripts/backup.sh >> /var/log/nova_db_backup.log 2>&1
```

### 3.2. Trên Windows (Task Scheduler)
Chạy lệnh PowerShell dưới quyền Administrator:
```powershell
$Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File D:\e-commerce1\backend\scripts\backup.ps1"
$Trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -TaskName "NOVA_Postgres_Daily_Backup" -Action $Action -Trigger $Trigger -Description "Daily PostgreSQL backup for NOVA Commerce"
```

---

## 4. Quy Trình Phục Hồi Dữ Liệu (Disaster Recovery)

Khi xảy ra sự cố cần khôi phục lại dữ liệu từ một bản sao lưu:

### 4.1. Khôi phục trên Windows (PowerShell)
```powershell
powershell -ExecutionPolicy Bypass -File backend/scripts/restore.ps1 -BackupFile backend/backups/nova_backup_20261031_210000.sql
```

### 4.2. Khôi phục trên Linux / macOS
```bash
chmod +x backend/scripts/restore.sh
./backend/scripts/restore.sh backend/backups/nova_backup_20261031_210000.sql
```

---

## 5. Giám Sát Dung Lượng Ổ Đĩa & Hiệu Năng
- Theo dõi thư mục `backend/backups/` định kỳ hàng tuần.
- Với hệ thống production quy mô lớn, nên kết hợp đồng bộ các file backup lên dịch vụ Cloud Storage (Amazon S3, Google Cloud Storage) để đảm bảo an toàn tuyệt đối ngay cả khi máy chủ gặp sự cố phần cứng.
