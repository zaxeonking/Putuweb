import { NextRequest, NextResponse } from 'next/server';
import { verifikasiSessionToken } from '@/lib/session';

/**
 * middleware.ts
 * ------------------------------------------------------------------
 * Berjalan di Edge Runtime, di depan (hampir) semua request.
 * Aturan:
 * - Belum login & bukan di /login  -> redirect ke /login
 * - Sudah login & masih di /login  -> redirect ke dashboard ("/")
 * - Selain itu                     -> lanjutkan request seperti biasa
 *
 * CATATAN: middleware ini SENGAJA hanya mengimpor verifikasiSessionToken
 * dari lib/session.ts (edge-safe, cuma pakai Web Crypto API), BUKAN
 * apa pun dari lib/auth.ts. lib/auth.ts memakai next/headers cookies()
 * (API-nya beda dari request.cookies di middleware) dan bcryptjs untuk
 * cek password — keduanya tidak dibutuhkan di sini dan sebaiknya tidak
 * ikut ter-bundle ke Edge Runtime.
 */

/** Nama cookie session — HARUS SAMA PERSIS dengan NAMA_COOKIE_SESSION di lib/auth.ts */
const NAMA_COOKIE_SESSION = 'session';

const HALAMAN_LOGIN = '/login';
const HALAMAN_DASHBOARD = '/'; // dashboard berada di halaman root

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(NAMA_COOKIE_SESSION)?.value;
  const session = await verifikasiSessionToken(token);
  const sudahLogin = session !== null;

  const sedangDiHalamanLogin = pathname === HALAMAN_LOGIN;

  // Belum login & mencoba akses halaman selain /login -> tendang ke /login
  if (!sudahLogin && !sedangDiHalamanLogin) {
    const urlTujuan = request.nextUrl.clone();
    urlTujuan.pathname = HALAMAN_LOGIN;
    // Simpan halaman asal supaya nanti (opsional) bisa di-redirect balik setelah login
    urlTujuan.searchParams.set('from', pathname);
    return NextResponse.redirect(urlTujuan);
  }

  // Sudah login tapi masih coba buka /login -> lempar ke dashboard
  if (sudahLogin && sedangDiHalamanLogin) {
    const urlTujuan = request.nextUrl.clone();
    urlTujuan.pathname = HALAMAN_DASHBOARD;
    urlTujuan.search = '';
    return NextResponse.redirect(urlTujuan);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Proteksi semua path KECUALI:
     * - _next/static, _next/image  -> aset build Next.js
     * - favicon.ico                -> favicon
     * - icons, manifest.json       -> aset PWA di folder /public
     * - sw.js, workbox-*.js        -> service worker (di-generate next-pwa)
     * - offline                    -> halaman fallback offline PWA, harus
     *                                 tetap bisa diakses walau session
     *                                 sudah tidak valid (misal token
     *                                 kedaluwarsa saat offline)
     * - robots.txt, sitemap.xml    -> metadata SEO, harus publik
     *
     * Route /api/* SENGAJA TETAP diproteksi (tidak dikecualikan) karena
     * berisi data kelas/siswa/nilai yang sensitif.
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|workbox-|offline|robots.txt|sitemap.xml).*)',
  ],
};
