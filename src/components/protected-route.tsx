import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import type { SessionPayload } from '@/lib/session';

/**
 * requireSession() & <ProtectedRoute> — OPSIONAL.
 * ------------------------------------------------------------------
 * middleware.ts sudah memproteksi semua halaman, jadi komponen ini
 * TIDAK WAJIB dipakai. Tapi kadang berguna sebagai "defense in depth"
 * atau kalau ada page.tsx tertentu yang butuh akses ke data session
 * (misal untuk menampilkan nama user) sekaligus mau memastikan sendiri
 * bahwa user memang sudah login, tanpa bergantung 100% ke middleware.
 *
 * Contoh 1 — panggil langsung di awal Server Component:
 *
 *   export default async function HalamanRahasia() {
 *     const session = await requireSession();
 *     return <div>Halo, {session.username}</div>;
 *   }
 *
 * Contoh 2 — bungkus dengan komponen <ProtectedRoute>:
 *
 *   export default async function HalamanRahasia() {
 *     return (
 *       <ProtectedRoute>
 *         <KontenRahasia />
 *       </ProtectedRoute>
 *     );
 *   }
 */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return session;
}

export async function ProtectedRoute({ children }: { children: React.ReactNode }) {
  await requireSession();
  return <>{children}</>;
}
