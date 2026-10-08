# HongLac Desktop

Bản desktop dùng Electron để chạy giao diện HongLac hiện có trong cửa sổ ứng dụng riêng. Dữ liệu dự án được lưu bởi trình duyệt Chromium cục bộ trên máy; ứng dụng không tự gửi dữ liệu lên máy chủ.

## Chạy thử

Cần cài Node.js LTS, sau đó mở terminal tại thư mục này:

```bash
npm install
npm start
```

## Đóng gói

```bash
npm run dist:win
```

Lệnh trên tạo bộ cài Windows và bản portable trong thư mục `release/`. Có thể dùng `npm run dist:mac` hoặc `npm run dist:linux` trên môi trường build tương ứng.

Các link web được mở bằng trình duyệt mặc định. Khi giao diện tạo tệp tải xuống (ví dụ xuất video), ứng dụng hỏi vị trí lưu tệp.
