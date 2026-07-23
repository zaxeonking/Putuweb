import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/sonner';
import { getSession } from '@/lib/auth';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Dipakai untuk resolve URL absolut pada metadata (og:image, canonical, dll).
// Set NEXT_PUBLIC_APP_URL di .env.local / Vercel Environment Variables ke
// domain production, misal: https://kelasku.vercel.app
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const NAMA_APLIKASI = 'KelasKu';
const DESKRIPSI_APLIKASI =
  'KelasKu adalah aplikasi manajemen kelas untuk guru dan wali kelas: kelola kelas, siswa, jadwal pelajaran, tugas, nilai, dan catatan dalam satu tempat, dengan data yang tersimpan aman di GitHub dan bisa diakses offline sebagai PWA.';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${NAMA_APLIKASI} - Aplikasi Manajemen Kelas`,
    template: `%s | ${NAMA_APLIKASI}`,
  },
  description: DESKRIPSI_APLIKASI,
  applicationName: NAMA_APLIKASI,
  keywords: [
    'aplikasi manajemen kelas',
    'aplikasi guru',
    'wali kelas',
    'manajemen siswa',
    'nilai siswa',
    'jadwal pelajaran',
    'KelasKu',
  ],
  authors: [{ name: NAMA_APLIKASI }],
  manifest: '/manifest.json',
  // Aplikasi ini berisi data pribadi siswa dan berada di balik login,
  // jadi SENGAJA tidak diindeks mesin pencari (lihat juga src/app/robots.ts).
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: NAMA_APLIKASI,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: APP_URL,
    siteName: NAMA_APLIKASI,
    title: `${NAMA_APLIKASI} - Aplikasi Manajemen Kelas`,
    description: DESKRIPSI_APLIKASI,
    images: [{ url: '/icons/icon-512x512.png', width: 512, height: 512, alt: NAMA_APLIKASI }],
  },
  twitter: {
    card: 'summary',
    title: `${NAMA_APLIKASI} - Aplikasi Manajemen Kelas`,
    description: DESKRIPSI_APLIKASI,
    images: ['/icons/icon-512x512.png'],
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  formatDetection: {
    telephone: false,
  },
};

// viewport & themeColor dipisah dari metadata sesuai konvensi Next.js 14
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1E293B' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1120' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Ambil session di server (kalau ada) supaya Header bisa menampilkan
  // nama user yang sedang login. getSession() aman dipanggil di sini
  // meski user belum login (akan return null, misal saat di /login).
  const session = await getSession();

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AppShell username={session?.username}>{children}</AppShell>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
