'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * src/app/error.tsx
 * ------------------------------------------------------------------
 * Error Boundary Next.js untuk seluruh route di dalam segmen ini (semua
 * halaman kecuali kegagalan pada RootLayout sendiri, yang ditangani oleh
 * global-error.tsx). WAJIB Client Component.
 *
 * Dipicu otomatis kalau ada error yang tidak tertangkap saat render
 * (Server Component gagal fetch tanpa try/catch, error di Client
 * Component, dsb), lalu menampilkan UI ini menggantikan konten halaman,
 * tanpa mematikan Sidebar/Header (karena error.tsx hanya mengganti
 * `children`, bukan seluruh RootLayout).
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log ke console supaya masih bisa ditelusuri lewat devtools/log Vercel,
    // meski di production tidak ada Sentry/error tracking terpasang.
    console.error('[KelasKu] Unhandled error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <Card className="w-full max-w-md border-destructive/30 bg-destructive/5">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Terjadi kesalahan</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Halaman ini gagal dimuat. Coba muat ulang, atau kembali ke beranda kalau masalah
              berlanjut.
            </p>
            {error.message && (
              <p className="mt-2 rounded-md bg-muted px-2 py-1.5 font-mono text-xs text-muted-foreground break-words">
                {error.message}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={reset} variant="default" size="sm">
              <RotateCcw className="h-4 w-4" />
              Coba Lagi
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="/">
                <Home className="h-4 w-4" />
                Ke Beranda
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
