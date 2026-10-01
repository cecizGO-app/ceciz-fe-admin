# 🚀 Ceciz Frontend Admin (`ceciz-fe-admin`)

Aplikasi Frontend Admin Dashboard untuk ekosistem **Ceciz**, dibangun menggunakan **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, dan **shadcn/ui**.

---

## 🛠️ Tech Stack

- **Framework & Bundler:** [React 19](https://react.dev/) & [Vite](https://vite.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) & [tw-animate-css](https://github.com/marceloprado/tw-animate-css)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (`radix-nova` style) & [Radix UI](https://www.radix-ui.com/)
- **Icons & Typography:** [Lucide React](https://lucide.dev/) & [Geist Font](https://fontsource.org/fonts/geist)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching & Caching:** [TanStack React Query v5](https://tanstack.com/query/latest)
- **Form & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Routing:** [React Router v8](https://reactrouter.com/)
- **Authentication:** [Better Auth](https://www.better-auth.com/)
- **Linter:** [Oxlint](https://oxc.rs/docs/guide/usage/linter)
- **Package Manager:** [pnpm](https://pnpm.io/) (Wajib / Strict)

---

## 📋 Prasyarat Sistem (Prerequisites)

Sebelum memulai instalasi, pastikan perangkat lokal Anda telah terinstall:

1. **Node.js** (versi **20.x** ke atas atau LTS terbaru). Periksa dengan:
   ```bash
   node -v
   ```
2. **pnpm** (versi **9.x** atau **10.x**).
   > ⚠️ **PENTING:** Seluruh tim **WAJIB** menggunakan `pnpm`. Dilarang menggunakan `npm`, `yarn`, atau `bun` agar `pnpm-lock.yaml` tidak rusak atau menimbulkan konflik versi dependensi.

### Cara Install `pnpm` (Jika belum terinstall di laptop/PC):

Silakan pilih salah satu metode instalasi berikut:

- **Metode 1: Menggunakan Corepack (Bawaan Node.js - Sangat Disarankan)**
  ```bash
  corepack enable
  corepack prepare pnpm@latest --activate
  ```

- **Metode 2: Menggunakan npm global**
  ```bash
  npm install -g pnpm
  ```

- **Metode 3: Menggunakan PowerShell (Windows Standalone)**
  ```powershell
  iwr https://get.pnpm.io/install.ps1 -useb | iex
  ```

Setelah instalasi selesai, verifikasi instalasi:
```bash
pnpm -v
```

---

## ⚙️ Panduan Setup & Instalasi (Step-by-Step)

Ikuti langkah-langkah di bawah ini secara berurutan:

### 1. Clone Repository & Masuk ke Direktori

```bash
git clone https://github.com/cecizGO-app/ceciz-fe-admin.git
cd ceciz-fe-admin
```

### 2. Setup Environment Variables

Salin file template `.env.example` menjadi `.env`:

- **Di Linux / macOS / Git Bash:**
  ```bash
  cp .env.example .env
  ```
- **Di Windows PowerShell:**
  ```powershell
  Copy-Item .env.example .env
  ```

> 📌 **Catatan:** Variabel environment di Vite **wajib** menggunakan awalan `VITE_` agar dapat diakses di sisi client melalui `import.meta.env.VITE_<NAMA_VARIABEL>`.

### 3. Install Dependensi Menggunakan `pnpm`

Jalankan perintah berikut:

```bash
pnpm install
```
*(atau singkatan: `pnpm i`)*

> ⛔ **JANGAN jalankan `npm install`!** Jika tidak sengaja menjalankan `npm install` dan muncul `package-lock.json`, segera hapus file `package-lock.json` tersebut dan jalankan kembali `pnpm install`.

### 4. Jalankan Development Server

```bash
pnpm dev
```

Setelah server aktif, buka URL berikut di browser:
```text
http://localhost:5173
```
Perubahan kode akan otomatis ter-update via Hot Module Replacement (HMR).

---

## 📜 Daftar Script yang Tersedia

Jalankan script dengan sintaks `pnpm <script>`:

| Command | Deskripsi |
| :--- | :--- |
| `pnpm dev` | Menjalankan Vite development server lokal (`http://localhost:5173`) |
| `pnpm build` | Type-check TypeScript (`tsc -b`) & build bundle production ke folder `dist/` |
| `pnpm preview` | Menjalankan server lokal untuk memvalidasi hasil build `dist/` |
| `pnpm lint` | Menjalankan [Oxlint](https://oxc.rs/) untuk pengecekan kualitas kode & linter super cepat |

---

## 🎨 Menambahkan Komponen UI (shadcn/ui)

Project ini telah terintegrasi dengan **shadcn/ui** (menggunakan Tailwind CSS v4 & Lucide icons). Untuk menambahkan komponen baru, jalankan:

```bash
pnpm dlx shadcn@latest add <nama-komponen>
```

**Contoh penggunaan:**
```bash
# Menambahkan komponen Input, Dialog, dan Dropdown Menu
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add dialog
pnpm dlx shadcn@latest add dropdown-menu
```

File komponen baru akan otomatis ditempatkan di dalam folder `src/components/ui/`.

---

## 📁 Struktur Direktori Project

```text
ceciz-fe-admin/
├── public/                 # Aset statis publik (favicon, svg publik)
├── src/
│   ├── assets/             # Gambar & aset internal aplikasi
│   ├── components/         # Komponen React yang dapat digunakan ulang
│   │   └── ui/             # Komponen dasar shadcn/ui (Button, Dialog, Input, dll.)
│   ├── lib/                # Utility & helper functions (misal: cn() di utils.ts)
│   ├── App.css             # Styling khusus App
│   ├── App.tsx             # Entry point tampilan aplikasi / routing
│   ├── index.css           # Konfigurasi Tailwind CSS v4 & CSS Variables tema
│   └── main.tsx            # Entry point React DOM
├── .env.example            # Template konfigurasi environment variables
├── components.json         # Konfigurasi instalasi shadcn/ui
├── package.json            # Manifest dependensi & script project
├── pnpm-lock.yaml          # Lockfile pnpm (WAJIB di-commit ke Git)
├── tsconfig.json           # Referensi root TypeScript
├── tsconfig.app.json       # Konfigurasi TypeScript untuk source code aplikasi
└── vite.config.ts          # Konfigurasi Vite, plugin Tailwind, dan alias path
```

### 💡 Import Alias (`@/`)
Vite dan TypeScript sudah dikonfigurasi dengan path alias `@/*` yang merujuk langsung ke folder `src/*`:
```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

---

## ❓ FAQ & Solusi Kendala Umum (Troubleshooting)

### 1. Mengapa WAJIB memakai `pnpm` dan tidak boleh memakai `npm` / `yarn`?
- Proyek ini menggunakan `pnpm-lock.yaml`. Menggunakan package manager lain akan menyebabkan versi paket tidak identik antar developer, berpotensi memunculkan bug "works on my machine", dan membuat git conflict pada file lockfile.
- `pnpm` jauh lebih cepat dalam proses instalasi dan menghemat ruang hard drive.

### 2. Error: `'pnpm' is not recognized as an internal or external command`
Artinya `pnpm` belum terdaftar di sistem PATH Anda:
1. Pastikan Node.js sudah terpasang.
2. Buka terminal (Run as Administrator di Windows jika perlu) lalu jalankan:
   ```bash
   npm install -g pnpm
   ```
3. Restart terminal atau VS Code Anda.

### 3. Mengatasi Cache / Error Instalasi Modul (Clean Reset)
Jika Anda mengalami masalah dependensi rusak atau error aneh setelah `git pull`:
```bash
# 1. Hapus folder node_modules
# Di Linux / macOS / Git Bash:
rm -rf node_modules
# Di Windows PowerShell:
Remove-Item -Recurse -Force node_modules

# 2. (Opsional) Bersihkan cache store pnpm
pnpm store prune

# 3. Install ulang dependensi
pnpm install
```

### 4. Port 5173 Bentrok / Sudah Terpakai
Secara default, Vite akan otomatis mencoba port berikutnya (misal `5174`). Anda juga dapat menentukan port secara manual:
```bash
pnpm dev --port 3000
```

### 5. Backend Terputus / API Error
Pastikan service backend **`ceciz-backend`** sudah running di port lokal (default: `http://localhost:3005`) dan nilai `VITE_API_BASE_URL` di file `.env` sudah sesuai.
