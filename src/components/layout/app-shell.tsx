'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';

/**
 * AppShell membungkus seluruh halaman dengan Sidebar + Header, KECUALI
 * di halaman /login yang butuh tampilan polos (center di layar, tanpa
 * navigasi) karena user belum login.
 *
 * Dipisah jadi Client Component sendiri (bukan langsung di RootLayout)
 * karena butuh usePathname(), sementara RootLayout harus tetap Server
 * Component supaya bisa export `metadata`.
 */
export function AppShell({
  children,
  username,
}: {
  children: React.ReactNode;
  username?: string;
}) {
  const pathname = usePathname();
  const isHalamanTanpaChrome = pathname === '/login' || pathname === '/offline';

  if (isHalamanTanpaChrome) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {/* Konten utama digeser ke kanan sejauh lebar sidebar (md:pl-64) */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Header username={username} />
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
