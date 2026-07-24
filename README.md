# KelasKu

Aplikasi manajemen kelas berbasis **Next.js 14 (App Router) + TypeScript**,
dengan **GitHub Repository** sebagai database (data disimpan sebagai file
JSON), siap deploy ke **Vercel**, dan mendukung **PWA** (bisa di-install
seperti aplikasi native, lengkap dengan cache offline).

![Screenshot Dashboard KelasKu](docs/screenshot-dashboard.png)
> 📸 *Ganti gambar di atas dengan screenshot dashboard Anda sendiri setelah
> menjalankan aplikasi — simpan sebagai `docs/screenshot-dashboard.png`.
> Placeholder screenshot lain yang disarankan: `docs/screenshot-kelas.png`,
> `docs/screenshot-jadwal.png`, `docs/screenshot-mobile.png`.*

## Daftar Isi

- [Fitur](#fitur)
- [Struktur Folder](#struktur-folder)
- [Cara Kerja "Database" GitHub](#cara-kerja-database-github)
- [Setup Awal & Install Lokal](#setup-awal--install-lokal)
- [PWA & Mode Offline](#pwa--mode-offline)
- [Export & Import Data](#export--import-data)
- [Loading, Error Handling & Toast](#loading-error-handling--toast)
- [SEO](#seo)
- [Deploy ke Vercel (Step-by-Step)](#deploy-ke-vercel-step-by-step)
- [Dashboard, State Management & Server Actions](#dashboard-state-management--server-actions)
- [Kustomisasi Warna](#kustomisasi-warna)
- [Menambahkan Komponen Shadcn/ui Lain](#menambahkan-komponen-shadcnui-lain)
- [Troubleshooting](#troubleshooting)

## Fitur

**Manajemen Data**
- Dashboard utama: kartu statistik tugas & nilai, grafik tugas per mata
  pelajaran, 5 tugas terdekat, quick action tambah tugas/jadwal
- CRUD Kelas (tambah, lihat, hapus)
- CRUD Siswa per kelas (tambah, lihat, hapus) + pencarian siswa lintas kelas
- **Halaman Jadwal** (`/jadwal`): kelola jadwal pelajaran mingguan dalam
  tampilan grid per hari (drag & drop kartu antar kolom untuk pindah hari)
  atau tabel, lengkap dengan tambah/edit/hapus dan filter per hari
- **Halaman Kalender** (`/kalender`): kalender bulanan custom yang
  menampilkan jadwal pelajaran (berdasarkan hari) dan marker deadline
  tugas per tanggal; klik tanggal untuk lihat detail & tambah tugas baru
  langsung dari tanggal tersebut
- **Halaman Tugas & Catatan**: kelola tugas (prioritas, status, deadline)
  dan catatan berformat Markdown per mata pelajaran
- **Halaman Nilai**: catat nilai tugas/ujian per mata pelajaran + grafik

**Autentikasi & Keamanan**
- Login sederhana 1-akun-admin (username/password atau bcrypt hash),
  session cookie yang ditandatangani (HMAC-SHA256), rate limiting
  percobaan login gagal, dan middleware yang melindungi seluruh halaman
  (kecuali `/login`)

**PWA (Progressive Web App)**
- Bisa di-install ke home screen (Android/iOS/Desktop), lengkap dengan
  ikon & splash sendiri
- Service worker (`next-pwa`) meng-cache aset statis, halaman, dan
  response API dengan strategi berbeda-beda (NetworkFirst / CacheFirst /
  StaleWhileRevalidate) — lihat [PWA & Mode Offline](#pwa--mode-offline)
- Halaman fallback khusus (`/offline`) saat membuka halaman baru tanpa
  koneksi internet

**UX: Loading, Error & Notifikasi**
- Skeleton loading di **semua halaman** (pakai Suspense/`loading.tsx`
  bawaan Next.js App Router)
- Error boundary per-halaman (`error.tsx`) dan fallback fatal untuk
  seluruh aplikasi (`global-error.tsx`)
- Toast notification global (`sonner`) untuk setiap aksi sukses/gagal di
  seluruh aplikasi

**Backup Data**
- Export seluruh data (kelas, siswa, nilai, kehadiran, jadwal, tugas,
  catatan) ke satu file JSON dari halaman Pengaturan
- Import data dari file JSON (dengan validasi struktur & konfirmasi,
  lihat [Export & Import Data](#export--import-data))

**Lainnya**
- State management terpusat dengan Zustand + Server Actions untuk CRUD
  jadwal, tugas, catatan, dan nilai
- Dark mode / Light mode (mengikuti sistem atau manual)
- Responsive: mobile, tablet, desktop (sidebar collapse jadi drawer di mobile)
- Metadata SEO lengkap, `robots.txt`, dan `sitemap.xml` (lihat [SEO](#seo))
- Setiap perubahan data otomatis tercatat sebagai commit di GitHub (histori perubahan)

## Struktur Folder

```
kelasku/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout: font, ThemeProvider, Sidebar, Header, metadata SEO
│   │   ├── globals.css          # Variabel warna shadcn + palet navy/blue + dark mode
│   │   ├── page.tsx             # Halaman Beranda (Dashboard): fetch data, Server Component
│   │   ├── dashboard-client.tsx     # Orchestrator dashboard (client): stat cards, seed store
│   │   ├── chart-tugas-mapel.tsx    # Grafik jumlah tugas per mata pelajaran (recharts)
│   │   ├── daftar-tugas-terbaru.tsx # 5 tugas terdekat + tombol tandai selesai
│   │   ├── dialog-tambah-tugas.tsx  # Quick action: tambah tugas
│   │   ├── dialog-tambah-jadwal.tsx # Quick action: tambah jadwal
│   │   ├── actions.ts            # Server Actions: CRUD + export/import data
│   │   ├── loading.tsx           # Skeleton loading Beranda
│   │   ├── error.tsx             # Error boundary semua halaman
│   │   ├── global-error.tsx      # Fallback error fatal (RootLayout)
│   │   ├── not-found.tsx         # Halaman 404 custom
│   │   ├── robots.ts             # Generator /robots.txt
│   │   ├── sitemap.ts            # Generator /sitemap.xml
│   │   ├── offline/
│   │   │   └── page.tsx          # Fallback halaman saat offline (PWA)
│   │   ├── kelas/
│   │   │   ├── page.tsx                 # Daftar kelas
│   │   │   ├── loading.tsx              # Skeleton loading
│   │   │   ├── dialog-tambah-kelas.tsx  # Form tambah kelas (client component)
│   │   │   ├── tombol-hapus-kelas.tsx   # Tombol hapus kelas
│   │   │   └── [id]/
│   │   │       ├── page.tsx                # Detail kelas + daftar siswa
│   │   │       ├── loading.tsx             # Skeleton loading
│   │   │       ├── dialog-tambah-siswa.tsx # Form tambah siswa
│   │   │       └── tombol-hapus-siswa.tsx  # Tombol hapus siswa
│   │   ├── siswa/
│   │   │   ├── page.tsx        # Daftar semua siswa lintas kelas
│   │   │   ├── loading.tsx     # Skeleton loading
│   │   │   └── tabel-siswa.tsx # Tabel + pencarian (client component)
│   │   ├── jadwal/
│   │   │   ├── page.tsx           # Halaman Manajemen Jadwal (Server Component)
│   │   │   ├── loading.tsx        # Skeleton loading
│   │   │   ├── jadwal-client.tsx  # Grid mingguan (drag & drop) + tampilan tabel, filter hari
│   │   │   └── dialog-jadwal.tsx  # Dialog terpadu tambah/edit jadwal
│   │   ├── kalender/
│   │   │   ├── page.tsx             # Halaman Kalender (Server Component)
│   │   │   ├── loading.tsx          # Skeleton loading
│   │   │   └── kalender-client.tsx  # Kalender bulanan custom (date-fns) + dialog detail tanggal
│   │   ├── tugas/
│   │   │   ├── page.tsx          # Halaman Manajemen Tugas
│   │   │   ├── loading.tsx       # Skeleton loading
│   │   │   ├── tugas-client.tsx  # List tugas + filter status/prioritas
│   │   │   └── dialog-tugas.tsx  # Dialog tambah/edit tugas
│   │   ├── catatan/
│   │   │   ├── page.tsx             # Halaman Catatan
│   │   │   ├── loading.tsx          # Skeleton loading
│   │   │   ├── catatan-client.tsx   # Grid catatan Markdown
│   │   │   └── dialog-catatan.tsx   # Dialog tambah/edit catatan
│   │   ├── nilai/
│   │   │   ├── page.tsx          # Halaman Nilai
│   │   │   ├── loading.tsx       # Skeleton loading
│   │   │   ├── nilai-client.tsx  # Tabel nilai + grafik
│   │   │   ├── chart-nilai.tsx   # Grafik nilai (recharts)
│   │   │   └── dialog-nilai.tsx  # Dialog tambah/edit nilai
│   │   ├── login/
│   │   │   ├── page.tsx       # Halaman login (client component)
│   │   │   ├── layout.tsx     # Metadata khusus segmen /login
│   │   │   └── loading.tsx    # Skeleton loading
│   │   ├── pengaturan/
│   │   │   ├── page.tsx        # Halaman pengaturan (tema, info koneksi GitHub, export/import)
│   │   │   ├── loading.tsx     # Skeleton loading
│   │   │   └── data-io.tsx     # Komponen Export & Import Data (JSON)
│   │   └── api/
│   │       ├── kelas/route.ts          # GET, POST kelas
│   │       ├── kelas/[id]/route.ts     # GET, PUT, DELETE satu kelas
│   │       ├── siswa/route.ts          # GET, POST siswa
│   │       └── siswa/[id]/route.ts     # PUT, DELETE satu siswa
│   ├── components/
│   │   ├── ui/                 # Komponen dasar ala Shadcn/ui (button, card, dialog, dll)
│   │   ├── layout/              # Sidebar, Header, MobileNav, daftar menu navigasi, AppShell
│   │   ├── theme-provider.tsx  # Wrapper next-themes
│   │   └── theme-toggle.tsx    # Tombol ganti tema
│   ├── middleware.ts    # Proteksi route (redirect ke /login kalau belum masuk)
│   └── lib/
│       ├── github.ts               # Client baca/tulis JSON ke GitHub Contents API ("database")
│       ├── data.ts                 # CRUD generik: getData/saveData/updateData/deleteData + retry
│       ├── store.ts                # Zustand store (useKelasStore) untuk state seluruh app
│       ├── types.ts                # Tipe data: Kelas, Siswa, Nilai, Kehadiran, Jadwal, Tugas, Catatan
│       ├── validasi-database.ts    # Schema zod untuk validasi file JSON saat Import Data
│       ├── auth.ts / session.ts / auth-actions.ts  # Autentikasi & session
│       └── utils.ts                # Helper cn(), formatTanggal(), ambilInisial()
├── public/
│   ├── manifest.json   # Manifest PWA
│   └── icons/          # Ikon PWA (192x192, 512x512, apple-touch-icon)
├── next.config.js       # Konfigurasi Next.js + next-pwa (runtimeCaching, offline fallback)
├── vercel.json           # Konfigurasi deploy & header cache untuk Vercel
├── tailwind.config.ts   # Konfigurasi Tailwind + dark mode + warna navy/brand
├── components.json      # Konfigurasi Shadcn/ui
└── package.json
```

## Cara Kerja "Database" GitHub

Karena tidak memakai database tradisional, semua data (kelas, siswa, nilai,
kehadiran, jadwal, tugas, catatan) disimpan dalam **satu file JSON** di
sebuah repository GitHub, misalnya `data/database.json`. Alurnya:

1. `src/lib/github.ts` memakai **GitHub Contents API** untuk membaca file
   tersebut (`GET /repos/{owner}/{repo}/contents/{path}`), lalu men-decode
   isinya dari base64 menjadi JSON.
2. Saat ada perubahan (tambah/edit/hapus data), aplikasi mengambil data
   terbaru, mengubahnya di memori, lalu mengirim `PUT` ke Contents API
   dengan isi baru (encoded base64) + `sha` file lama (wajib, supaya GitHub
   tahu ini update, bukan file baru).
3. Setiap `PUT` otomatis menjadi **satu commit** di repo, jadi Anda punya
   riwayat perubahan data secara gratis lewat tab "Commits" di GitHub.

Ini cocok untuk skala kecil-menengah (misal 1 sekolah / beberapa kelas),
bukan untuk trafik tinggi, karena GitHub API punya rate limit
(~5.000 request/jam dengan token autentikasi).

## Setup Awal & Install Lokal

### 1. Siapkan Repository untuk Data

Buat repository GitHub baru (boleh **private**) khusus untuk menyimpan
`database.json`, misalnya `kelasku-data`. Tidak perlu isi apa-apa, file
`data/database.json` akan otomatis dibuat saat pertama kali menambah kelas.

### 2. Buat Personal Access Token

1. Buka **GitHub Settings → Developer settings → Personal access tokens →
   Fine-grained tokens**.
2. Klik **Generate new token**.
3. Pilih repository `kelasku-data` di bagian **Repository access**.
4. Di **Permissions**, set **Contents** = **Read and write**.
5. Generate, lalu salin token-nya (hanya muncul sekali).

### 3. Clone & Install Dependencies

```bash
git clone <url-repo-kelasku-anda>
cd kelasku
npm install
```

### 4. Konfigurasi Environment Variable

Salin `.env.local.example` menjadi `.env.local`:

```bash
cp .env.local.example .env.local
```

Lalu isi semua variable-nya:

```
# Database (GitHub)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=username-github-anda
GITHUB_REPO=kelasku-data
GITHUB_BRANCH=main
GITHUB_DATA_PATH=data/database.json

# Autentikasi
ADMIN_USERNAME=admin
ADMIN_PASSWORD=kelas123
SESSION_SECRET=ganti-dengan-string-acak-hasil-openssl-rand--base64-32

# SEO (opsional untuk lokal, wajib diisi saat production — lihat bagian SEO)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Lihat komentar lengkap di `.env.local.example` untuk opsi
> `ADMIN_PASSWORD_HASH` (disarankan untuk production, generate dengan
> `node -e "console.log(require('bcryptjs').hashSync('password-anda', 10))"`)
> dan cara generate `SESSION_SECRET` (`openssl rand -base64 32`).

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — Anda akan diarahkan ke
`/login` terlebih dahulu. Masuk dengan `ADMIN_USERNAME` & `ADMIN_PASSWORD`
yang sudah diisi di `.env.local`.

> Catatan: PWA (service worker) otomatis **dinonaktifkan** saat development
> supaya tidak mengganggu hot reload. PWA hanya aktif di production build
> (`npm run build && npm run start`, atau setelah deploy ke Vercel).

## PWA & Mode Offline

KelasKu bisa di-install seperti aplikasi native di HP maupun desktop:

- **Android/Chrome**: buka menu browser → "Install app" / "Add to Home screen".
- **iOS/Safari**: tombol Share → "Add to Home Screen".
- **Desktop (Chrome/Edge)**: ikon install di address bar.

Service worker (dikonfigurasi lewat `next-pwa` di `next.config.js`)
menerapkan strategi cache berbeda untuk tiap jenis resource:

| Jenis resource                     | Strategi              | Alasan                                                   |
|-------------------------------------|------------------------|-----------------------------------------------------------|
| Navigasi halaman (routes)          | NetworkFirst (10s)    | Data kelas bisa berubah kapan saja, tapi tetap ada cache  |
| `/api/*` (GET)                      | NetworkFirst (8s)     | Data mutable, timeout pendek supaya cepat fallback offline|
| Font Google                         | CacheFirst (1 tahun)  | Statis, jarang berubah                                    |
| Gambar & ikon (avatar siswa, dll.)  | StaleWhileRevalidate  | Tampil instan dari cache, refresh diam-diam di background |
| Aset build `_next/static/**`       | CacheFirst (30 hari)  | Sudah di-hash Next.js, aman disimpan lama                  |

Kalau pengguna membuka halaman **baru** (belum pernah dikunjungi/di-cache)
saat benar-benar tidak ada koneksi internet, service worker menampilkan
halaman fallback di `src/app/offline/page.tsx` alih-alih error browser
bawaan.

## Export & Import Data

Tersedia di halaman **Pengaturan** (`/pengaturan`):

- **Export Data**: mengunduh seluruh isi database (kelas, siswa, nilai,
  kehadiran, jadwal, tugas, catatan) sebagai satu file
  `kelasku-backup-YYYY-MM-DD.json`. Berguna untuk backup manual atau
  memindahkan data ke instance/repo GitHub lain.
- **Import Data**: mengunggah file JSON hasil Export sebelumnya. File
  divalidasi strukturnya (`src/lib/validasi-database.ts`, pakai `zod`)
  sebelum ditimpakan ke database — kalau formatnya tidak sesuai, proses
  ditolak dengan pesan error yang jelas, dan **data lama tetap utuh**.

⚠️ **Import bersifat destruktif**: seluruh data saat ini akan digantikan
oleh isi file yang diimpor (bukan digabung/merge). Aplikasi akan meminta
konfirmasi eksplisit sebelum melanjutkan. Karena setiap perubahan tetap
tercatat sebagai commit di GitHub, data lama tidak benar-benar hilang —
bisa ditelusuri lewat riwayat commit repo data Anda.

## Loading, Error Handling & Toast

- **Skeleton loading**: setiap route punya file `loading.tsx` sendiri
  (dibangun dari komponen `Skeleton`, `src/components/ui/skeleton.tsx`)
  yang otomatis ditampilkan Next.js lewat React Suspense selagi Server
  Component halaman tersebut masih mengambil data dari GitHub.
- **Error boundary**: `src/app/error.tsx` menangkap error tak terduga di
  halaman manapun (Client Component maupun kegagalan Server Component
  tanpa `try/catch`) dan menampilkan UI retry, tanpa mematikan
  Sidebar/Header. `src/app/global-error.tsx` adalah fallback terakhir
  kalau RootLayout itu sendiri yang gagal.
- **Toast notification**: komponen `<Toaster />` (dari `sonner`) dipasang
  sekali secara global di `src/app/layout.tsx`, dan dipanggil di seluruh
  Client Component (`toast.success(...)`, `toast.error(...)`) setiap kali
  ada aksi tambah/edit/hapus data yang berhasil atau gagal.

## SEO

- **Metadata lengkap** di `src/app/layout.tsx`: title & description dengan
  template per halaman, Open Graph, Twitter Card, keywords, ikon PWA,
  `appleWebApp`, dan `metadataBase` (dari `NEXT_PUBLIC_APP_URL`). Beberapa
  halaman (Kelas, Siswa, Jadwal, dst., termasuk judul dinamis per kelas di
  `/kelas/[id]`) punya title masing-masing.
- **`robots.txt`** (`src/app/robots.ts`) & **`sitemap.xml`**
  (`src/app/sitemap.ts`) di-generate otomatis oleh Next.js.
  > Catatan desain: karena KelasKu menyimpan **data pribadi siswa** dan
  > seluruh halaman ada di balik login, `robots.txt` **sengaja melarang
  > semua crawler** (`Disallow: /`) dan metadata di-set `robots: { index:
  > false }` — supaya tidak ada data siswa yang ter-index tanpa sengaja
  > di mesin pencari. Sitemap hanya mencantumkan halaman `/login`.
- Untuk production, isi `NEXT_PUBLIC_APP_URL` di Environment Variables
  Vercel dengan domain asli Anda, misal `https://kelasku.vercel.app`.

## Deploy ke Vercel (Step-by-Step)

1. **Push kode ke GitHub** — buat repository baru untuk *kode aplikasi*
   ini (beda dengan repo `kelasku-data` yang menyimpan `database.json`),
   lalu push:
   ```bash
   git init
   git add .
   git commit -m "Initial commit KelasKu"
   git branch -M main
   git remote add origin https://github.com/username-anda/kelasku.git
   git push -u origin main
   ```
2. **Buka [vercel.com](https://vercel.com)** → login/daftar (bisa pakai
   akun GitHub) → **Add New... → Project**.
3. **Import** repository kode KelasKu yang baru saja di-push. Vercel akan
   otomatis mendeteksi framework Next.js (dibantu `vercel.json` yang sudah
   disediakan).
4. Di step **Configure Project → Environment Variables**, tambahkan
   seluruh variable berikut (nilai sama seperti di `.env.local`):

   | Key                  | Contoh nilai                              |
   |----------------------|--------------------------------------------|
   | `GITHUB_TOKEN`       | `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`  |
   | `GITHUB_OWNER`       | `username-github-anda`                      |
   | `GITHUB_REPO`        | `kelasku-data`                              |
   | `GITHUB_BRANCH`      | `main`                                       |
   | `GITHUB_DATA_PATH`   | `data/database.json`                        |
   | `ADMIN_USERNAME`     | `admin`                                     |
   | `ADMIN_PASSWORD_HASH`| hasil `bcryptjs.hashSync(...)` (disarankan) |
   | `SESSION_SECRET`     | hasil `openssl rand -base64 32`             |
   | `NEXT_PUBLIC_APP_URL`| `https://nama-project-anda.vercel.app`      |

   > Untuk `ADMIN_PASSWORD_HASH`, jalankan dulu di komputer lokal:
   > `node -e "console.log(require('bcryptjs').hashSync('password-kuat-anda', 10))"`
   > lalu salin hasilnya. Kalau pakai ini, variable `ADMIN_PASSWORD` tidak perlu diisi.
5. Klik **Deploy**, tunggu proses build selesai (biasanya 1–2 menit).
6. Setelah deploy sukses, buka domain yang diberikan Vercel (misal
   `https://kelasku.vercel.app`), lalu **update** `NEXT_PUBLIC_APP_URL` di
   Environment Variables dengan domain final tersebut, dan **redeploy**
   (Vercel → Deployments → tombol "..." → Redeploy) supaya metadata SEO
   (Open Graph, sitemap) memakai URL yang benar.
7. **Install sebagai PWA**: buka domain tersebut dari HP, lalu "Add to Home
   Screen" — ikon dan splash screen sudah otomatis terpasang dari
   `public/manifest.json`.

Setiap kali Anda `git push` ke branch `main`, Vercel otomatis membangun &
mendeploy ulang (CI/CD bawaan).

## Dashboard, State Management & Server Actions

- **Dashboard** (`src/app/page.tsx` + `dashboard-client.tsx`): kartu
  statistik (total tugas, tugas hari ini, deadline mendekat dalam 3 hari,
  rata-rata nilai), grafik jumlah tugas per mata pelajaran (`recharts`,
  lihat `chart-tugas-mapel.tsx`), 5 tugas terdekat yang bisa langsung
  ditandai selesai (`daftar-tugas-terbaru.tsx`), dan tombol quick action
  untuk tambah tugas/jadwal (`dialog-tambah-tugas.tsx`,
  `dialog-tambah-jadwal.tsx`).
- **7 koleksi data** di `src/lib/types.ts`: `kelas`, `siswa`, `nilai`,
  `kehadiran`, `jadwal` (schedules), `tugas` (tasks), `catatan` (notes).
  Semuanya bagian dari `DatabaseKelas` yang sama, jadi tetap tersimpan
  dalam satu file JSON di GitHub — tidak perlu repo/file terpisah.
- **Lapisan CRUD generik** di `src/lib/data.ts`: `getData(koleksi)`,
  `saveData(koleksi, item)`, `updateData(koleksi, id, patch)`,
  `deleteData(koleksi, id)`. Dipakai untuk koleksi apa pun (`jadwal`,
  `tugas`, `catatan`, `nilai`) tanpa duplikasi kode, dan sudah menangani
  retry otomatis untuk error konflik `sha` (409) maupun rate limit GitHub
  API (403) dengan exponential backoff (1s, 2s, 4s).
- **Server Actions** di `src/app/actions.ts` (`'use server'`): satu fungsi
  per operasi (`tambahTugasAction`, `perbaruiJadwalAction`,
  `hapusCatatanAction`, `eksporDatabaseAction`, `imporDatabaseAction`,
  dll.), sebagian besar memanggil `revalidatePath('/')` supaya Dashboard
  otomatis ter-update setelah mutasi — tidak perlu route `/api` terpisah
  untuk fitur ini.
- **State management Zustand** di `src/lib/store.ts` (`useKelasStore`):
  menyimpan seluruh `DatabaseKelas` di memori client, di-seed sekali dari
  data yang sudah diambil Server Component (`hydrateDenganData`) supaya
  tidak fetch dobel ke GitHub saat dashboard pertama dibuka, lalu setiap
  mutasi (`tambahTugas`, `ubahStatusTugas`, dst.) langsung memperbarui
  state lokal dari hasil balikan Server Action.

Untuk menambah koleksi baru (misal `absensiHarian`), cukup:
1. Tambahkan interface & array-nya ke `DatabaseKelas` di `src/lib/types.ts`.
2. Tambahkan nama koleksinya ke union type `NamaKoleksi`.
3. Tambahkan schema-nya ke `src/lib/validasi-database.ts` supaya ikut
   tervalidasi saat Import Data.
4. Panggil `getData` / `saveData` / `updateData` / `deleteData` dengan nama
   koleksi itu dari sebuah Server Action baru di `src/app/actions.ts` —
   tidak perlu menyentuh `src/lib/github.ts` atau `src/lib/data.ts` sama
   sekali karena keduanya generik.

## Kustomisasi Warna

Warna utama diatur lewat CSS variable di `src/app/globals.css`
(`--primary`, `--sidebar-background`, dst.) dan lewat token custom
`navy` & `brand` di `tailwind.config.ts`. Ubah nilai HSL di sana untuk
mengganti skema warna tanpa menyentuh komponen. Warna tema (`theme_color`,
`background_color`) untuk PWA diatur terpisah di `public/manifest.json`
dan `viewport.themeColor` di `src/app/layout.tsx` — samakan kalau Anda
mengubah palet.

## Menambahkan Komponen Shadcn/ui Lain

Komponen di `src/components/ui/` ditulis manual mengikuti konvensi resmi
Shadcn/ui (karena environment pembuatan project ini tidak punya akses
internet untuk menjalankan `npx shadcn@latest add ...`). Setelah project
di-clone ke komputer Anda yang terhubung internet, Anda bisa memakai CLI
resmi untuk menambah komponen lain, contoh:

```bash
npx shadcn@latest add tabs calendar select alert-dialog
```

CLI akan otomatis mendeteksi `components.json` yang sudah ada dan
menempatkan file baru di `src/components/ui/` mengikuti struktur yang sama.

## Troubleshooting

| Masalah                                                     | Penyebab umum & solusi |
|--------------------------------------------------------------|---------------------------|
| `GITHUB_TOKEN belum diset`                                   | Pastikan `.env.local` terisi (lokal) atau Environment Variables Vercel sudah diisi & sudah **redeploy** setelah menambah variable. |
| Data tidak tersimpan / error `(409)`                          | Konflik `sha` karena ada perubahan bersamaan — sistem retry otomatis 3x; kalau tetap gagal, muat ulang halaman. |
| Error `(403)` / rate limit                                    | Kuota GitHub API (~5.000/jam) habis — tunggu beberapa saat, atau gunakan token dengan akun berbeda. |
| Halaman offline muncul padahal online                         | Service worker lama masih ter-cache — hard refresh (Ctrl/Cmd+Shift+R) atau uninstall & install ulang PWA-nya. |
| Import Data gagal "Format file tidak sesuai"                  | File yang diunggah bukan hasil Export KelasKu, atau strukturnya sudah diubah manual — gunakan file asli hasil Export. |
| PWA tidak muncul opsi install                                 | PWA hanya aktif di production build (`npm run build && npm run start`) atau di domain HTTPS (seperti Vercel) — tidak aktif di `npm run dev`. |
