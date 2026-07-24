'use client';

import { useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { User, LogOut, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import { MobileNav } from './mobile-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ITEM_NAVIGASI } from './nav-items';
import { logoutAction } from '@/lib/auth-actions';

/** Ambil judul halaman aktif berdasarkan path, untuk ditampilkan di header */
function judulHalaman(pathname: string): string {
  const item = ITEM_NAVIGASI.find(
    (i) => pathname === i.href || (i.href !== '/' && pathname.startsWith(i.href))
  );
  return item?.label ?? 'KelasKu';
}

export function Header({ username }: { username?: string }) {
  const pathname = usePathname();
  const [isLoggingOut, startLogoutTransition] = useTransition();

  function handleLogout() {
    // startTransition membuat isLoggingOut otomatis true selama
    // logoutAction() (Server Action) diproses, lalu redirect ke /login.
    startLogoutTransition(() => {
      logoutAction();
    });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 md:px-6">
      <MobileNav />

      <h1 className="text-lg font-semibold tracking-tight flex-1 md:flex-none">
        {judulHalaman(pathname)}
      </h1>

      <div className="flex-1" />

      <ThemeToggle />

      {/* Menu profil pengguna: menampilkan username yang login & tombol Keluar */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="outline-none" aria-label="Menu akun">
            <Avatar>
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{username ? `Masuk sebagai ${username}` : 'Akun Saya'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SettingsIcon className="h-4 w-4" /> Pengaturan
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
