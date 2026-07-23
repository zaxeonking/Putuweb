import { WifiOff } from 'lucide-react';

/**
 * src/app/offline/page.tsx
 * ------------------------------------------------------------------
 * Halaman ini di-precache oleh service worker (lihat konfigurasi
 * `fallbacks.document` di next.config.js) dan otomatis ditampilkan oleh
 * browser ketika pengguna mencoba membuka halaman baru saat benar-benar
 * tidak ada koneksi internet dan halaman tersebut belum pernah di-cache.
 *
 * Sengaja dibuat sesederhana mungkin (tanpa fetch data apapun) supaya
 * selalu bisa dirender walau offline total.
 */
export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <WifiOff className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Anda sedang offline</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          KelasKu butuh koneksi internet untuk mengambil atau menyimpan data (tersimpan di
          GitHub). Halaman yang sudah pernah dibuka sebelumnya mungkin masih bisa diakses dari
          cache — coba kembali, atau sambungkan kembali internet Anda dan muat ulang.
        </p>
      </div>
      <a
        href="/"
        className="inline-flex h-9 items-center justify-center rounded-md bg-brand px-4 text-sm font-medium text-white hover:opacity-90"
      >
        Coba Muat Ulang Beranda
      </a>
    </div>
  );
}
