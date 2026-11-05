# LOCI EDU - GÓI TRIỂN KHAI PRODUCTION HOÀN CHỈNH

Thư mục này chứa đầy đủ 100% mã nguồn, tài nguyên 3D, âm thanh, hình ảnh và tệp cấu hình để triển khai dự án lên bất kỳ nền tảng lưu trữ web nào.

## 🚀 HƯỚNG DẪN TRIỂN KHAI

### 1. Triển khai qua Netlify (Khuyên dùng)
- Đăng nhập vào [Netlify Drop](https://app.netlify.com/drop).
- Kéo và thả toàn bộ thư mục `LOCI_EDU_DEPLOY_PACKAGE` vào ô tải lên.
- Netlify sẽ tự động nhận diện tệp `_redirects`, `_headers` và `netlify.toml` để xuất bản trang web với URL trực tiếp có HTTPS miễn phí trong vòng 30 giây!

### 2. Triển khai qua Vercel
- Đăng nhập vào [Vercel](https://vercel.com).
- Chọn **Import Project** và chọn thư mục `LOCI_EDU_DEPLOY_PACKAGE`.
- Hệ thống đã tích hợp sẵn `vercel.json`. Bấm **Deploy**.

### 3. Triển khai qua GitHub Pages
- Tạo kho lưu trữ (Repository) trên GitHub.
- Đẩy toàn bộ nội dung trong thư mục này lên nhánh `main` (hoặc `gh-pages`).
- Vào **Settings -> Pages** và chọn xuất bản từ thư mục gốc `/`.

### 4. Chạy cục bộ bằng máy chủ Web (Local Test)
```bash
# Bằng Python:
python -m http.server 8000

# Hoặc bằng Node.js / npx:
npx serve .
```
Sau đó truy cập: `http://localhost:8000/portal_v2.html` hoặc `http://localhost:8000/mobile_test_preview.html`.

---

## 📁 CÁC TRANG CHÍNH TRONG GÓI
- `portal_v2.html`: Cổng Tổng quan Dashboard, Bộ đếm ngược THPT 2027, Kế hoạch ôn tập.
- `mobile_test_preview.html`: Trình giả lập đa thiết bị điện thoại di động (iPhone 15 Pro, iPhone SE, Galaxy S24, Pixel 8, iPad).
- `chat.html`: Gia sư AI Loci có kiểm duyệt lịch sử và bám sát kiến thức Bài 6, 7, 8.
- `de_thi.html`: Phòng làm Đề ôn tập Lịch sử 12 Chủ đề 3 (chấm điểm tự động, 28 câu).
- `ket_noi.html`: Mạng xã hội học tập Loci, Bảng Vàng vinh danh 15 học sinh.
- `khong_gian_360.html`: Cung điện ký ức 360 độ, đặt mốc Loci, phóng to/thu nhỏ, thuyết minh âm thanh.
- `review.html`: Trung tâm Thẻ ôn tập ghi nhớ đa dạng theo thuật toán lặp lại ngắt quãng SM-2.
- `index.html`: Bản đồ 3D Loft Living Room Loci.
