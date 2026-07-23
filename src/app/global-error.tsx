'use client';

import { useEffect } from 'react';

/**
 * src/app/global-error.tsx
 * ------------------------------------------------------------------
 * Fallback paling terakhir: hanya aktif kalau RootLayout (src/app/layout.tsx)
 * sendiri yang error (misal getSession() melempar error tak terduga).
 * Karena menggantikan RootLayout sepenuhnya, file ini WAJIB me-render
 * tag <html> dan <body> sendiri — tidak bisa memakai komponen dari
 * layout.tsx (ThemeProvider, AppShell, dll), dan sengaja memakai CSS
 * inline saja (tanpa Tailwind) supaya tetap tampil walau ada error build
 * pada stylesheet sekalipun.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[KelasKu] Fatal error di RootLayout:', error);
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#0B1120',
          color: '#E2E8F0',
          padding: '1rem',
        }}
      >
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            KelasKu mengalami kesalahan fatal
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginBottom: '1.5rem' }}>
            Aplikasi gagal dimuat sepenuhnya. Silakan coba muat ulang halaman.
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: '#1E293B',
              color: '#fff',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}
