import type { MetadataRoute } from 'next';

/**
 * src/app/sitemap.ts
 * ------------------------------------------------------------------
 * Next.js otomatis meng-generate /sitemap.xml dari file ini.
 *
 * Karena hampir seluruh halaman KelasKu ada di balik login (dan memang
 * tidak boleh diindeks, lihat src/app/robots.ts), sitemap ini sengaja
 * hanya mencantumkan halaman publik yang benar-benar ada: halaman login.
 * Ini tetap berguna untuk beberapa search console / tooling yang
 * memvalidasi keberadaan sitemap.xml, tanpa membocorkan struktur data
 * internal aplikasi.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return [
    {
      url: `${APP_URL}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
