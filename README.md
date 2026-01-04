<div align="center">

# 🌙 Vespera

### Modern Evening Journaling App

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

*Inspired by "Vesper" – the evening twilight*

A beautifully crafted web journaling application designed for mindful evening reflections. Built with a modern **Bento Grid** layout and elegant **Glassmorphism** aesthetics.

[Demo](#) · [Features](#-features) · [Installation](#-installation) · [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

### 📝 Focus Editor
- **Distraction-free writing** – Clean, minimal interface for focused journaling
- **Smart Prompts** – Contextual questions based on your selected mood
- **Rich Metadata** – Track mood, energy levels, weather, location, and currently playing music
- **Markdown Support** – Basic text formatting (bold, italic, blockquotes)

### 📊 Mood & Energy Analytics
- **Visual Charts** – 7-day mood trend visualization using Recharts
- **Trend Analysis** – Automatic calculation of mood patterns with percentage changes

### 📅 History & Calendar
- **Flexible Views** – Toggle between list and calendar layouts
- **Advanced Filtering** – Search by keywords, filter by mood or hashtags
- **Color-coded Calendar** – Days highlighted based on dominant mood

### 🌗 Smart UI
- **Auto Night Shift** – Automatic dark mode from 6 PM to 6 AM
- **Fully Responsive** – Optimized for desktop, tablet, and mobile devices

### 🔒 Privacy-First
- **100% Client-side** – All data stays in your browser
- **Backup & Restore** – Export/Import data as JSON files

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 |
| **Language** | TypeScript 5 |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 3.4 |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Font** | Quicksand (Google Fonts) |

---

## 📁 Project Structure

```
Vespera/
├── src/
│   ├── components/           # React components
│   │   ├── FocusEditor.tsx   # Main editor modal
│   │   ├── HistoryBlock.tsx  # History & calendar widget
│   │   ├── MoodTracker.tsx   # Mood chart widget
│   │   ├── InsightsBlock.tsx # Stats widget (streak, word count)
│   │   ├── EditorWidget.tsx  # Editor trigger widget
│   │   ├── SettingsModal.tsx # Settings (import/export)
│   │   ├── GalleryBlock.tsx  # Photo gallery (WIP)
│   │   └── TimeCapsule.tsx   # Memory flashback (WIP)
│   ├── data/
│   │   └── mockEntries.ts    # Sample journal entries
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   ├── constants/
│   │   └── index.ts          # App constants & config
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Application entry point
├── index.html                # HTML template
├── tailwind.config.js        # Tailwind configuration
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies & scripts
```

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/K13RT/Vespera.git
cd Vespera

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

---

## 📖 Usage Guide

### Writing an Entry
1. Click the **"Daily Reflection"** widget on the homepage
2. Select your current mood to receive contextual prompts
3. Write your title, content, and add tags
4. Click **Save**

### Reviewing Entries
- Navigate to **History/Calendar** section
- Click any entry to view details
- Use search or filters to find past entries

### Data Backup
1. Click the **Settings** icon (gear)
2. Select **Download** to export as `.json`
3. To restore, select **Restore** and upload your backup file

---

## 🎨 Design System

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Light Background | `#F3E5F5` | Lavender mist (light mode) |
| Dark Background | `#1A1A2E` | Deep night purple (dark mode) |
| Accent | `#9C27B0` | Primary accent color |
| Card Dark | `#252540` | Card background (dark mode) |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Vespera** – *Listen to your heart as the twilight descends* 🌆

Made with ❤️ by [K13RT](https://github.com/K13RT)

</div>
