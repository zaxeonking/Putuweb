import type { MetadataRoute } from 'next';

/**
 * src/app/robots.ts
 * ------------------------------------------------------------------
 * Next.js otomatis meng-generate /robots.txt dari file ini.
 *
 * CATATAN PENTING: KelasKu menyimpan data pribadi siswa (nama, NIS, nilai,
 * dsb) dan seluruh halaman ada di balik login. Karena itu, robots.txt ini
 * SENGAJA melarang seluruh mesin pencari meng-crawl aplikasi ini, supaya
 * tidak ada halaman berisi data siswa yang ter-index secara tidak sengaja
 * di Google/Bing. Ini konsisten dengan `robots: { index: false }` di
 * src/app/layout.tsx.
 *
 * Kalau suatu saat KelasKu dipakai untuk landing page publik yang memang
 * ingin diindeks (misal halaman marketing terpisah), ubah aturan di bawah.
 */
export default function robots(): MetadataRoute.Robots {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
