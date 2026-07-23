'use server';

/**
 * lib/auth-actions.ts
 * ------------------------------------------------------------------
 * Server Actions (bisa dipanggil langsung dari Client Component, misal
 * dari onSubmit form atau onClick tombol) yang membungkus lib/auth.ts.
 * Dipisah dari lib/auth.ts supaya lib/auth.ts tetap jadi modul biasa
 * (bisa dipanggil dari Server Component lain tanpa "biaya" RPC action).
 */

import { redirect } from 'next/navigation';
import { login, logout, type HasilLogin } from './auth';

/** Halaman yang dituju setelah login berhasil (dashboard = halaman root "/"). */
const HALAMAN_DASHBOARD = '/';
const HALAMAN_LOGIN = '/login';

/**
 * Dipanggil dari form login (src/app/login/page.tsx).
 * Kalau sukses -> redirect ke dashboard.
 * Kalau gagal -> return pesan error untuk ditampilkan di form.
 */
export async function loginAction(formData: FormData): Promise<HasilLogin> {
  const username = String(formData.get('username') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!username || !password) {
    return { sukses: false, pesan: 'Username dan password wajib diisi.' };
  }

  const hasil = await login(username, password);

  if (!hasil.sukses) {
    return hasil;
  }

  redirect(HALAMAN_DASHBOARD);
}

/** Dipanggil dari tombol "Keluar" di header. */
export async function logoutAction(): Promise<void> {
  await logout();
  redirect(HALAMAN_LOGIN);
}
