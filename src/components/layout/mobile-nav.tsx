'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ITEM_NAVIGASI } from './nav-items';
import { useKelasStore } from '@/lib/store';
import { hitungJumlahTugasMendesak } from '@/lib/tugas-helpers';

/**
 * Versi mobile dari sidebar: dipicu oleh tombol hamburger di header,
 * muncul sebagai panel yang slide dari kiri (pakai komponen Sheet).
 * Otomatis tertutup begitu salah satu menu diklik.
 */
export function MobileNav() {
  const pathname = usePathname();
  const [terbuka, setTerbuka] = React.useState(false);
  const tugas = useKelasStore((s) => s.database.tugas);
  const jumlahTugasMendesak = hitungJumlahTugasMendesak(tugas);

  return (
    <Sheet open={terbuka} onOpenChange={setTerbuka}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Buka menu navigasi">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex flex-col">
        <div className="flex items-center gap-2 h-16 px-6 border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-base tracking-tight">KelasKu</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {ITEM_NAVIGASI.map((item) => {
            const aktif = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <SheetClose asChild key={item.href}>
                <Link
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
              </SheetClose>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
