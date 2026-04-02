# VSM Real Estate — Bất Động Sản Cao Cấp Hồ Chí Minh

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://vsm-realestate.com)
[![Built with React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## 🏙️ Giới thiệu

**VSM Real Estate** là nền tảng bất động sản cao cấp tại Hồ Chí Minh, cung cấp trải nghiệm tìm kiếm, khám phá và đầu tư bất động sản hiện đại với giao diện đẹp mắt và hiệu suất cao.

## ✨ Tính năng nổi bật

- 🎨 **Giao diện hiện đại** — Thiết kế luxury với animation mượt mà (Framer Motion)
- 🏗️ **Page Builder** — Kéo thả sắp xếp, ẩn/hiện section như WordPress
- 📝 **Rich Text Editor** — Bộ soạn thảo nội dung mạnh mẽ như Google Docs (Tiptap)
- 🖼️ **Media Manager** — Upload ảnh, video, embed YouTube
- 🗺️ **Bản đồ tương tác** — Leaflet Maps hiển thị vị trí dự án
- 📱 **Responsive** — Tương thích mọi thiết bị
- 🔍 **Tìm kiếm thông minh** — Lọc theo quận, loại BĐS
- ⭐ **Đánh giá** — Hệ thống review từ khách hàng
- 🛠️ **Admin CMS** — Quản trị toàn bộ nội dung website

## 🛠️ Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| **Frontend** | React 18, TypeScript 5, Vite 5 |
| **Styling** | Tailwind CSS 3, shadcn/ui, Framer Motion |
| **Backend** | Supabase (Database, Auth, Storage, Edge Functions) |
| **Maps** | Leaflet / React-Leaflet |
| **Editor** | Tiptap (Rich Text) |
| **Drag & Drop** | @dnd-kit |
| **State** | TanStack Query |

## 📁 Cấu trúc dự án

```
src/
├── assets/            # Ảnh, font, media
├── components/
│   ├── admin/         # Admin CMS (PageBuilder, RichTextEditor, ...)
│   ├── ui/            # shadcn/ui components
│   ├── Header.tsx     # Header động
│   ├── Hero.tsx       # Hero section
│   ├── About.tsx      # Giới thiệu
│   ├── Properties.tsx # Danh sách dự án
│   ├── MapSection.tsx # Bản đồ
│   ├── Reviews.tsx    # Đánh giá
│   ├── Contact.tsx    # Liên hệ
│   ├── Footer.tsx     # Footer động
│   └── ScrollReveal.tsx # Animation cuộn
├── hooks/             # Custom hooks
├── pages/             # Routing pages
├── data/              # Static data
└── integrations/      # Supabase client & types
```

## 🚀 Cài đặt & Chạy

```bash
# Clone repo
git clone <repo-url>
cd vsm-real-estate

# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

Mở [http://localhost:5173](http://localhost:5173) để xem kết quả.

## 📸 Screenshots

| Trang chủ | Admin CMS |
|-----------|-----------|
| Hero + Search | Page Builder kéo thả |
| Dự án nổi bật | Rich Text Editor |
| Bản đồ tương tác | Media Upload |

## 👨‍💻 Tác giả

**Quach Thanh Long**
- 🌐 Website: [quachthanhlong.com](https://quachthanhlong.com)
- 💼 Developed & Designed with ❤️

## 📄 License

© 2024 VSM Real Estate. All rights reserved.
Developed by [quachthanhlong.com](https://quachthanhlong.com)
