# Trắc Nghiệm An Toàn Thực Phẩm

Một game mobile web trắc nghiệm về an toàn thực phẩm được thiết kế với phong cách Flat 2.0 và Anime Chibi hiện đại, lấy cảm hứng từ thế giới ăn vặt đường phố đầy màu sắc của Việt Nam.

## 🎮 Tính Năng

- **3 Mức Độ Khó**: Dễ (4 câu), Trung bình (6 câu), Khó (8 câu)
- **2 Loại Câu Hỏi**: Good/Bad (Tốt/Xấu) và Real/Fake (Thật/Giả)
- **Giao Diện Thân Thiện**: Thiết kế mobile-first với màu sắc tươi sáng
- **Hệ Thống Điểm**: Tính điểm và hiển thị kết quả chi tiết
- **Âm Thanh & Rung**: Phản hồi đa giác quan
- **Responsive**: Tối ưu cho mọi thiết bị di động
- **PWA Ready**: Có thể cài đặt như ứng dụng

## 🎨 Style Guide

### Bảng Màu
- **Xanh Lá Mạ (#88D8B0)**: Màu chủ đạo cho yếu tố an toàn
- **Vàng Nghệ (#FFC145)**: Màu thương hiệu chính
- **Cam Cà Rốt (#FF6B6B)**: Màu nhấn mạnh, cảnh báo
- **Hồng Dâu (#F7CAD9)**: Màu phụ trợ, trang trí
- **Xanh Chàm (#3A506B)**: Màu chữ chính
- **Xám Khói (#9B9B9B)**: Màu nguy hiểm
- **Trắng Kem (#F8F9FA)**: Màu nền

### Typography
- Font chính: Poppins (Google Fonts)
- Style: Sans-serif, bo tròn, thân thiện

## 🚀 Cài Đặt & Chạy

### Yêu Cầu
- Web server (Apache, Nginx, hoặc Live Server)
- Trình duyệt hiện đại hỗ trợ ES6+

### Chạy Local
```bash
# Sử dụng Python
python -m http.server 8000

# Hoặc sử dụng Node.js
npx serve .

# Hoặc sử dụng Live Server (VS Code extension)
```

Truy cập: `http://localhost:8000`

### Deploy lên Vercel
```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Deploy
vercel

# Hoặc kết nối GitHub repository với Vercel
```

## 📁 Cấu Trúc Dự Án

```
/
├── index.html          # File HTML chính
├── styles.css          # File CSS với style guide
├── main.js            # Logic game JavaScript
├── vercel.json        # Cấu hình deploy Vercel
├── README.md          # Tài liệu dự án
└── assets/            # Thư mục tài nguyên
    ├── mascot.jpeg    # Hình ảnh linh vật
    ├── question_gb.json # Câu hỏi Good/Bad
    ├── question_rf.json # Câu hỏi Real/Fake
    ├── GB/            # Hình ảnh Good/Bad
    │   ├── GB_0_0.png # Xiên que tốt
    │   ├── GB_0_1.png # Xiên que xấu
    │   └── ...
    └── RF/            # Hình ảnh Real/Fake
        ├── RF_0_0.png # Bim bim thật
        ├── RF_0_1.png # Bim bim giả
        └── ...
```

## 🎯 Cách Chơi

1. **Chọn Độ Khó**: Dễ, Trung bình, hoặc Khó
2. **Trả Lời Câu Hỏi**: Nhìn hình ảnh và chọn "An Toàn" hoặc "Nguy Hiểm"
3. **Học Từ Kết Quả**: Xem giải thích để hiểu thêm
4. **Xem Điểm Số**: Kiểm tra kết quả và chơi lại

## 🔧 Tùy Chỉnh

### Thêm Câu Hỏi Mới
1. Thêm hình ảnh vào `assets/questions/question-X/`
2. Cập nhật `questionDatabase` trong `main.js`
3. Thêm câu hỏi mới với cấu trúc:
```javascript
{
    id: X,
    image: 'assets/questions/question-X/true.png',
    correctAnswer: true/false,
    explanation: 'Giải thích về câu trả lời'
}
```

### Thay Đổi Màu Sắc
Chỉnh sửa các biến CSS trong `styles.css`:
```css
:root {
    --primary-green: #88D8B0;
    --primary-yellow: #FFC145;
    /* ... */
}
```

### Thêm Âm Thanh
Cập nhật hàm `playSound()` trong `main.js` để sử dụng file âm thanh thực tế.

## 📱 PWA Features

- **Service Worker**: Cache tài nguyên offline
- **Manifest**: Cài đặt như ứng dụng
- **Responsive**: Tối ưu cho mobile
- **Touch Friendly**: Hỗ trợ touch gestures

## 🌟 Tính Năng Nâng Cao

- **Local Storage**: Lưu cài đặt người dùng
- **Vibration API**: Rung khi trả lời
- **Web Audio API**: Âm thanh phản hồi
- **CSS Animations**: Hiệu ứng mượt mà
- **Accessibility**: Hỗ trợ người khuyết tật

## 📄 License

MIT License - Sử dụng tự do cho mục đích giáo dục và thương mại.

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Hãy tạo issue hoặc pull request.

## 📞 Liên Hệ

- Email: [your-email@example.com]
- GitHub: [your-github-username]
- Website: [your-website.com]

---

**Lưu ý**: Hiện tại các hình ảnh chỉ là placeholder. Hãy thay thế bằng hình ảnh thực tế để có trải nghiệm tốt nhất.
