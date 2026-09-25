# HỆ THỐNG QUẢN LÝ TUYỂN DỤNG NHÂN VIÊN (MONGODB + MINGO + VITE REACT TAILWIND)

Đồ án môn học Cơ sở dữ liệu NoSQL: **Tìm hiểu công cụ Mingo để quản trị và khai thác CSDL tài liệu "Quản lý tuyển dụng nhân viên" và xây dựng ứng dụng minh họa**.

---

## 1. Cấu Trúc Tổng Quan Dự Án

* **`backend/`**: Node.js + Express + Mongoose (6 Collections, RESTful API, Aggregation Pipelines, Seeder).
* **`frontend/`**: Vite + React 19 + Tailwind CSS + Lucide Icons + Recharts (Enterprise ATS Interface).
* **`docs/`**: Báo cáo học thuật toàn văn (`BAO_CAO_DO_AN_NOSQL.md`), cẩm nang Mingo (`Mingo_Guide.md`), và kịch bản Aggregation (`aggregation_queries.js`).

### Danh mục 6 Collections trong CSDL `recruitment_db`:
1. `departments`: Quản lý cơ cấu các phòng ban.
2. `positions`: Danh mục vị trí tuyển dụng, mức lương và yêu cầu kỹ năng.
3. `candidates`: Hồ sơ ứng viên, mảng kỹ năng (`skills`) và tài liệu nhúng lịch sử làm việc (`experience`).
4. `applications`: Hồ sơ ứng tuyển, giai đoạn tuyển dụng (Kanban), nguồn tuyển và điểm số.
5. `interviews`: Lịch phỏng vấn, đánh giá các vòng thi tuyển và chấm điểm.
6. `employees`: Hồ sơ nhân sự chính thức chuyển đổi từ ứng viên trúng tuyển (`hired`).

---

## 2. Hướng Dẫn Cài Đặt & Vận Hành Nhanh

### Bước 1: Khởi động CSDL MongoDB
Đảm bảo MongoDB Server đang chạy cục bộ tại cổng mặc định `mongodb://localhost:27017`.

### Bước 2: Nạp dữ liệu mẫu (Seed Data)
Tại thư mục gốc dự án:
```bash
npm run seed
```

### Bước 3: Khởi chạy ứng dụng
Mở 2 cửa sổ dòng lệnh riêng biệt:
```bash
# Terminal 1: Khởi chạy Backend API (Port 5000)
npm run backend

# Terminal 2: Khởi chạy Frontend UI (Port 5173)
npm run frontend
```

### Bước 4: Kiểm định tự động toàn diện hệ thống (Automated Verification)
```bash
npm test
```
*Bộ kiểm định tự động kiểm tra cú pháp, 6 collections, tính toàn vẹn khóa ngoại (Referential Integrity), cấu trúc Mongoose Models và gói build của Frontend.*

---

## 3. Khai Thác CSDL Bằng Công Cụ Mingo
1. Tải và cài đặt Mingo từ [mingo.io](https://mingo.io).
2. Tạo kết nối (Connection URI): `mongodb://localhost:27017/recruitment_db`.
3. Khai thác các tính năng cốt lõi:
   - **Smart Relations**: Bấm trực tiếp vào các khóa ngoại `candidateId`, `positionId` trong `applications` để mở document liên quan.
   - **Schema Analyzer**: Đánh giá cấu trúc mảng `skills` và `experience` trong `candidates`.
   - **Inline Spreadsheet Editing**: Sửa trực tiếp dữ liệu trên Mingo và quan sát tính đồng bộ hai chiều tức thời trên giao diện Web.
   - **Aggregation Builder**: Dựng 4 pipeline thống kê chuyên sâu ($group, $lookup, $unwind, $bucket).
4. Xem hướng dẫn chi tiết tại [docs/Mingo_Guide.md](./docs/Mingo_Guide.md) hoặc truy cập trực tiếp tab **"Hướng Dẫn Mingo"** trên ứng dụng Web.

