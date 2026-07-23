// @ts-check

/**
 * Konfigurasi Next.js utama.
 * PWA di-handle oleh @ducanh2912/next-pwa (fork next-pwa yang masih aktif
 * di-maintain & resmi support App Router Next.js 13/14 — package next-pwa
 * yang lama sudah di-archive dan menyebabkan build error di Next.js 14).
 * Otomatis generate service worker di public/sw.js saat build, dan
 * di-nonaktifkan saat mode development supaya tidak mengganggu hot reload.
 */
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public', // lokasi output service worker
  disable: process.env.NODE_ENV === 'development', // matikan PWA saat dev
  register: true, // otomatis register service worker di client
  reloadOnOnline: true, // reload app saat koneksi kembali online
  cacheOnFrontEndNav: true, // cache tambahan saat navigasi via next/link
  aggressiveFrontEndNavCaching: true,
  // Halaman yang ditampilkan saat navigasi ke halaman BARU (belum pernah
  // di-cache) gagal karena tidak ada koneksi internet sama sekali.
  fallbacks: {
    document: '/offline',
  },
  workboxOptions: {
    // Hindari precache file manifest build Next.js (mencegah error caching
    // pada app-build-manifest.json).
    exclude: [/app-build-manifest\.json$/],
    // Strategi caching kustom: aset statis (JS/CSS/font/gambar) dan
    // response API (/api/kelas, /api/siswa) di-cache secara berbeda sesuai
    // seberapa sering datanya berubah.
    runtimeCaching: [
      {
        // Halaman HTML hasil navigasi antar route Next.js (App Router RSC payload).
        // NetworkFirst: selalu coba ambil versi terbaru dulu (data kelas bisa
        // berubah kapan saja), baru fallback ke cache kalau offline/timeout.
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'kelasku-pages',
          networkTimeoutSeconds: 10,
          expiration: { maxEntries: 48, maxAgeSeconds: 24 * 60 * 60 }, // 1 hari
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        // Endpoint API internal (/api/kelas, /api/siswa, dst). NetworkFirst
        // dengan timeout pendek: data ini mengubah UI (CRUD), jadi jangan
        // sampai basi lama-lama, tapi tetap ada fallback cache saat offline
        // supaya halaman tidak blank total.
        urlPattern: /^https?:\/\/.*\/api\/.*$/,
        handler: 'NetworkFirst',
        method: 'GET',
        options: {
          cacheName: 'kelasku-api',
          networkTimeoutSeconds: 8,
          expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 }, // 1 jam
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        // Font Google (Inter) yang di-serve dari domain Next.js sendiri (self-hosted
        // via next/font) maupun CDN font eksternal.
        urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'kelasku-fonts',
          expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 * 24 * 365 }, // 1 tahun
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        // Ikon PWA, avatar siswa dari GitHub (raw.githubusercontent.com), dan
        // gambar lain. StaleWhileRevalidate: tampilkan cache dulu (instan),
        // sambil diam-diam refresh di background untuk kunjungan berikutnya.
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'kelasku-images',
          expiration: { maxEntries: 96, maxAgeSeconds: 30 * 24 * 60 * 60 }, // 30 hari
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        // File JS/CSS hasil build Next.js (_next/static/**). Immutable & sudah
        // di-hash oleh Next.js, jadi aman di-CacheFirst tanpa expiry pendek.
        urlPattern: /\/_next\/static\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'kelasku-static-assets',
          expiration: { maxEntries: 128, maxAgeSeconds: 30 * 24 * 60 * 60 }, // 30 hari
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Izinkan avatar/foto siswa yang di-hosting di GitHub (raw.githubusercontent.com)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
