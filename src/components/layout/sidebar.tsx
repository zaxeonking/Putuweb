'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ITEM_NAVIGASI } from './nav-items';
import { useKelasStore } from '@/lib/store';
import { hitungJumlahTugasMendesak } from '@/lib/tugas-helpers';

/**
 * Sidebar navigasi utama, hanya tampil di layar medium ke atas (tablet & desktop).
 * Untuk mobile, navigasi yang sama ditampilkan lewat komponen MobileNav (Sheet).
 * Warna sidebar selalu navy gelap (--sidebar-background) baik di light maupun
 * dark mode, supaya identitas visual aplikasi tetap konsisten.
 */
export function Sidebar() {
  const pathname = usePathname();
  const tugas = useKelasStore((s) => s.database.tugas);
  const jumlahTugasMendesak = hitungJumlahTugasMendesak(tugas);

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo / nama aplikasi */}
      <div className="flex items-center gap-2 h-16 px-6 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="font-semibold text-base tracking-tight">KelasKu</span>
      </div>

      {/* Daftar menu */}
      <nav className="flex-1 overflow-y-auto scrollbar-tipis py-4 px-3 space-y-1">
        {ITEM_NAVIGASI.map((item) => {
          const aktif = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                aktif
                  ? 'bg-brand text-white'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.tampilkanBadgeTugas && jumlahTugasMendesak > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-semibold text-destructive-foreground">
                  {jumlahTugasMendesak}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer sidebar */}
      <div className="px-6 py-4 border-t border-sidebar-border text-xs text-sidebar-foreground/60">
        Data tersimpan di GitHub
      </div>
    </aside>
  );
}
