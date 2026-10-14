# CV Template - Mẫu CV Chuyên Nghiệp

Một mẫu CV hiện đại, responsive được xây dựng bằng HTML, CSS và JavaScript thuần túy. Không cần framework, dễ dàng tùy chỉnh và triển khai.

## ✨ Tính năng

- **Thiết kế hiện đại**: Giao diện sạch, chuyên nghiệp với sidebar và main content
- **Responsive**: Tự động điều chỉnh cho mobile, tablet, desktop
- **Chỉnh sửa trực tiếp**: Click vào bất kỳ văn bản nào để sửa (contenteditable)
- **Tự động lưu**: Dữ liệu được lưu vào localStorage, không lo mất khi reload
- **Upload ảnh đại diện**: Kéo thả hoặc click để upload avatar
- **Xuất PDF**: Tải CV dưới dạng file PDF (cần thư viện html2canvas + jsPDF)
- **In ấn**: Tối ưu cho in ấn / lưu PDF từ trình duyệt
- **Dark mode**: Tự động hỗ trợ chế độ tối theo hệ điều hành
- **Phím tắt**: Ctrl+S (PDF), Ctrl+P (In), Ctrl+Shift+R (Reset)

## 📁 Cấu trúc file

```
cv-template/
├── cv.html      # File HTML chính
├── cv.css       # File CSS (styling)
├── cv.js        # File JavaScript (functionality)
└── README.md    # Hướng dẫn này
```

## 🚀 Cách sử dụng

### 1. Mở trực tiếp
Double-click vào `cv.html` để mở trong trình duyệt.

### 2. Chỉnh sửa thông tin
- Click vào bất kỳ văn bản nào (tên, địa chỉ, kinh nghiệm, kỹ năng...) để chỉnh sửa
- Dữ liệu tự động lưu vào trình duyệt (localStorage)
- Upload ảnh đại diện bằng cách click vào icon camera trên avatar

### 3. Xuất file
- **PDF**: Nhấn nút "Tải PDF" hoặc `Ctrl+S`
- **In**: Nhấn nút "In CV" hoặc `Ctrl+P` → Chọn "Lưu dưới dạng PDF"
- **Reset**: Nhấn nút "Khôi phục mẫu" hoặc `Ctrl+Shift+R`

## 🎨 Tùy chỉnh

### Thay đổi màu sắc chính
Sửa biến CSS trong `cv.css`:
```css
:root {
    --primary: #2563eb;      /* Màu xanh chính */
    --primary-dark: #1d4ed8; /* Màu xanh đậm */
    --accent: #0ea5e9;       /* Màu nhấn */
    /* ... các biến khác */
}
```

### Thêm section mới
1. Thêm HTML trong `cv.html`
2. Thêm CSS tương ứng trong `cv.css`
3. Các phần `contenteditable="true"` sẽ tự động lưu

## 🖨️ Xuất PDF chất lượng cao

Để tính năng "Tải PDF" hoạt động tốt nhất, thêm 2 thư viện này vào `<head>` của `cv.html` (trước `cv.js`):

```html
<!-- Thêm vào <head> trước </head> -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script>
    window.jsPDF = window.jspdf.jsPDF;
</script>
```

Nếu không có thư viện, nút "Tải PDF" sẽ hướng dẫn bạn dùng `Ctrl+P` → Chọn "Microsoft Print to PDF" hoặc "Save as PDF".

## ⌨️ Phím tắt

| Phím tắt | Chức năng |
|----------|-----------|
| `Ctrl+S` / `Cmd+S` | Tải PDF |
| `Ctrl+P` / `Cmd+P` | In CV |
| `Ctrl+Shift+R` / `Cmd+Shift+R` | Khôi phục mẫu |

## 🌐 Triển khai lên GitHub Pages / Netlify / Vercel

1. Push toàn bộ thư mục lên GitHub
2. Bật GitHub Pages (Settings → Pages → Deploy from branch)
3. Hoặc deploy lên Netlify/Vercel bằng cách kéo thả thư mục

## 📱 Responsive Breakpoints

- **Desktop**: ≥ 768px (Sidebar + Main content side-by-side)
- **Mobile**: < 768px (Stack vertical, sidebar thành header)

## 🔧 Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Opera 67+

## 📝 Mẹo viết CV hiệu quả

1. **Tóm tắt (Summary)**: 2-3 câu, nhấn mạnh giá trị cốt lõi
2. **Kinh nghiệm**: Dùng số liệu cụ thể (tăng 30%, quản lý team 5 người...)
3. **Kỹ năng**: Chỉ liệt kê kỹ năng thực sự thành thạo
4. **Dự án**: Mô tả vấn đề → Giải pháp → Kết quả
5. **Định dạng**: Giữ CV trong 1-2 trang A4

## 🐛 Troubleshooting

**Ảnh không hiển thị sau khi reload?**
- Kiểm tra localStorage cho phép (Settings → Privacy → Site data)
- Ảnh được lưu dưới dạng base64 trong localStorage

**Font không load?**
- Kiểm tra kết nối internet (Google Fonts)
- Hoặc tải font Inter về local

**PDF bị méo/mất chữ?**
- Dùng tính năng In (Ctrl+P) → Save as PDF thay vì nút Tải PDF

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.

---

**Tạo bởi**: Claude Code  
**Phiên bản**: 1.0.0  
**Cập nhật**: 2024