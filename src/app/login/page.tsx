'use client';

import { useState, useTransition } from 'react';
import { GraduationCap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction } from '@/lib/auth-actions';

/**
 * Halaman Login.
 * Didesain minimalis & center di tengah layar (cocok untuk aplikasi
 * internal kecil seperti KelasKu). Form dikendalikan sepenuhnya
 * lewat React state (bukan <form action={...}>) supaya lebih mudah
 * mengatur loading state & pesan error secara manual.
 */
export default function HalamanLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPesanError(null);

    const formData = new FormData();
    formData.set('username', username);
    formData.set('password', password);

    // startTransition dipakai supaya isPending otomatis true selama
    // Server Action loginAction() masih diproses di server.
    startTransition(async () => {
      const hasil = await loginAction(formData);

      // Kalau sukses, loginAction() sendiri yang memanggil redirect()
      // ke dashboard, jadi baris di bawah ini hanya jalan kalau GAGAL.
      if (hasil && !hasil.sukses) {
        setPesanError(hasil.pesan ?? 'Login gagal, silakan coba lagi.');
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo & judul aplikasi */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">KelasKu</h1>
          <p className="text-sm text-muted-foreground">Masuk untuk mengelola kelas Anda</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border bg-card p-6 shadow-sm"
          noValidate
        >
          {/* Pesan error kalau username/password salah, atau rate limit kena */}
          {pesanError && (
            <div
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {pesanError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isPending}
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              'Masuk'
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          KelasKu &middot; Akses terbatas untuk guru/wali kelas
        </p>
      </div>
    </div>
  );
}
