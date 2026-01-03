# 🌙 Vespera - Evening Journal

**Vespera** (lấy cảm hứng từ *Vesper* - buổi chiều tà) là một ứng dụng viết nhật ký web hiện đại, được thiết kế để tối ưu hóa trải nghiệm suy ngẫm và viết lách vào cuối ngày.

Ứng dụng sử dụng giao diện **Bento Grid** (dạng lưới) gọn gàng, kết hợp với phong cách **Glassmorphism**, mang lại cảm giác thư giãn và tập trung.

![Vespera Banner](https://via.placeholder.com/1200x600?text=Vespera+Journal+App)

## ✨ Tính Năng Nổi Bật

### 1. 📝 Focus Editor (Trình soạn thảo tập trung)
*   **Giao diện tối giản:** Loại bỏ mọi xao nhãng để bạn tập trung viết.
*   **Smart Prompts:** Gợi ý câu hỏi dựa trên cảm xúc bạn chọn (Vui, Buồn, Bình thường...).
*   **Metadata phong phú:** Ghi lại Cảm xúc (Mood), Năng lượng (Energy), Thời tiết, Địa điểm, và Bài hát đang nghe.
*   **Markdown Support:** Hỗ trợ định dạng văn bản cơ bản (đậm, nghiêng, trích dẫn).

### 2. 📊 Mood & Energy Tracking (Theo dõi cảm xúc)
*   **Biểu đồ trực quan:** Theo dõi biểu đồ cảm xúc trong 7 ngày gần nhất.
*   **Phân tích xu hướng:** Tự động tính toán xu hướng tâm trạng (tăng/giảm bao nhiêu %) so với chu kỳ trước.

### 3. 📅 Lịch sử & Lịch (History & Calendar)
*   **Chế độ xem linh hoạt:** Chuyển đổi giữa dạng Danh sách (List) và Lịch tháng (Calendar).
*   **Bộ lọc mạnh mẽ:** Tìm kiếm bài viết theo từ khóa, lọc theo Cảm xúc hoặc Hashtags (#tags).
*   **Calendar View:** Các ngày được tô màu dựa trên cảm xúc chủ đạo của ngày hôm đó.

### 4. 🌗 Giao diện thông minh (Smart UI)
*   **Auto Night Shift:** Tự động chuyển sang chế độ tối (Dark Mode) từ **18:00 đến 06:00** sáng hôm sau để bảo vệ mắt.
*   **Responsive:** Tương thích hoàn hảo trên cả Desktop, Tablet và Mobile.

### 5. 🔒 Quản lý dữ liệu (Local & Privacy)
*   **Riêng tư tuyệt đối:** Dữ liệu hoạt động hoàn toàn trên trình duyệt của bạn (Client-side).
*   **Backup & Restore:** Tính năng Xuất (Export) và Nhập (Import) dữ liệu ra file JSON để lưu trữ hoặc chuyển thiết bị.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

*   **Core:** [React 19](https://react.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Custom Config)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Charts:** [Recharts](https://recharts.org/)
*   **Font:** Quicksand (Google Fonts)

---

## 📂 Cấu Trúc Dự Án

```
Vespera/
├── index.html              # Entry point & Tailwind Config
├── index.tsx               # Root render
├── App.tsx                 # Main Layout & State Management
├── types.ts                # TypeScript Interfaces (JournalEntry, MoodLevel...)
├── constants.ts            # Mock Data, Prompts, Configs
├── components/
│   ├── FocusEditor.tsx     # Modal soạn thảo chính
│   ├── HistoryBlock.tsx    # Widget lịch sử & lịch
│   ├── MoodTracker.tsx     # Widget biểu đồ cảm xúc
│   ├── InsightsBlock.tsx   # Widget thống kê (Streak, Word count)
│   ├── EditorWidget.tsx    # Widget mở trình soạn thảo
│   ├── SettingsModal.tsx   # Modal cài đặt (Import/Export)
│   ├── GalleryBlock.tsx    # (Placeholder) Thư viện ảnh
│   └── TimeCapsule.tsx     # (Placeholder) Ký ức ngày xưa
└── README.md               # Tài liệu dự án
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy

Dự án hiện tại được cấu hình để chạy trực tiếp trên trình duyệt thông qua **ES Modules** (esm.sh) trong file `index.html`, hoặc bạn có thể thiết lập môi trường phát triển chuẩn như sau:

### Cách 1: Chạy môi trường Dev (Khuyên dùng)

1.  **Clone dự án:**
    ```bash
    git clone https://github.com/your-username/vespera.git
    cd vespera
    ```

2.  **Cài đặt dependencies:**
    ```bash
    npm install
    ```

3.  **Khởi chạy:**
    ```bash
    npm run dev
    ```

### Cách 2: Chạy trực tiếp (No Build)
Bạn có thể mở trực tiếp file `index.html` bằng Live Server (VS Code Extension) hoặc bất kỳ static server nào. Dự án sử dụng `importmap` để tải các thư viện React trực tiếp từ CDN.

---

## 📖 Hướng Dẫn Sử Dụng

1.  **Viết nhật ký:**
    *   Nhấn vào ô **"Daily Reflection"** hoặc nút **Edit** (hình cây bút) trên Mobile.
    *   Chọn cảm xúc hiện tại của bạn để nhận câu hỏi gợi ý.
    *   Viết tiêu đề, nội dung và thêm các thẻ (tags).
    *   Nhấn **Lưu**.

2.  **Xem lại:**
    *   Tại mục **Gần đây/Lịch**, nhấn vào một bài viết để xem chi tiết.
    *   Sử dụng thanh tìm kiếm hoặc bộ lọc để tìm lại ký ức cũ.

3.  **Sao lưu dữ liệu:**
    *   Nhấn vào biểu tượng **Cài đặt** (Bánh răng).
    *   Chọn **Tải về** để lưu file `.json` về máy.
    *   Khi sang máy khác, chọn **Khôi phục** và tải file đó lên.

---

## 🎨 Bảng Màu (Vespera Palette)

| Tên màu | Mã màu | Mô tả |
| :--- | :--- | :--- |
| **Light Bg** | `#F3E5F5` | Lavender Mist (Sương mù tím) |
| **Dark Bg** | `#1A1A2E` | Deep Night Purple (Tím than) |
| **Accent** | `#9C27B0` | Deep Purple (Màu nhấn chủ đạo) |
| **Card Dark**| `#252540` | Màu nền thẻ (Chế độ tối) |

---

## 🤝 Đóng Góp

Mọi đóng góp đều được hoan nghênh! Vui lòng mở Pull Request hoặc Issue nếu bạn tìm thấy lỗi hoặc muốn thêm tính năng mới.

---

**Vespera** - *Lắng nghe lòng mình khi hoàng hôn buông xuống.* 🌆
