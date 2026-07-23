/**
 * lib/auth.ts
 * ------------------------------------------------------------------
 * Modul autentikasi utama. Berbeda dari lib/session.ts, file ini BOLEH
 * memakai 'next/headers' karena hanya akan dipakai di Server Component,
 * Server Action, atau Route Handler (Node.js runtime) — JANGAN import
 * file ini dari Client Component ('use client'), karena akan error saat
 * build. Kalau butuh login/logout dari Client Component, panggil lewat
 * Server Action di src/lib/auth-actions.ts.
 */

import { cookies, headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import { buatSessionToken, verifikasiSessionToken, type SessionPayload } from './session';

/** Nama cookie tempat menyimpan token session. */
export const NAMA_COOKIE_SESSION = 'session';

/** Durasi session: 7 hari (dalam detik). */
const DURASI_SESSION_DETIK = 60 * 60 * 24 * 7;

// ------------------------------------------------------------------
// RATE LIMITING SEDERHANA (opsional, sesuai requirement)
// ------------------------------------------------------------------
// Membatasi percobaan login yang gagal per-alamat-IP, supaya tidak
// gampang di-brute-force. Disimpan di memori (Map), jadi:
// - Reset setiap kali server di-restart / re-deploy.
// - Kalau di-deploy multi-instance (misal serverless dengan banyak
//   region/instance berjalan paralel), penghitungnya TIDAK dibagi antar
//   instance. Untuk production yang lebih serius, ganti dengan storage
//   terpusat seperti Redis/Upstash.
const MAX_PERCOBAAN_GAGAL = 5;
const DURASI_BLOKIR_MS = 15 * 60 * 1000; // 15 menit

interface RekamPercobaan {
  jumlahGagal: number;
  blokirSampai: number | null;
}

const percobaanLogin = new Map<string, RekamPercobaan>();

/** Ambil alamat IP client dari header (didukung Vercel & kebanyakan proxy/CDN). */
function ambilIdentitasClient(): string {
  const daftarHeader = headers();
  const forwardedFor = daftarHeader.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return daftarHeader.get('x-real-ip') ?? 'unknown';
}

function cekRateLimit(identitas: string): { diizinkan: boolean; sisaDetik?: number } {
  const rekam = percobaanLogin.get(identitas);
  if (!rekam || !rekam.blokirSampai) return { diizinkan: true };

  if (rekam.blokirSampai > Date.now()) {
    return { diizinkan: false, sisaDetik: Math.ceil((rekam.blokirSampai - Date.now()) / 1000) };
  }

  // Waktu blokir sudah lewat -> reset
  percobaanLogin.delete(identitas);
  return { diizinkan: true };
}

function catatPercobaanGagal(identitas: string): void {
  const rekam = percobaanLogin.get(identitas) ?? { jumlahGagal: 0, blokirSampai: null };
  rekam.jumlahGagal += 1;

  if (rekam.jumlahGagal >= MAX_PERCOBAAN_GAGAL) {
    rekam.blokirSampai = Date.now() + DURASI_BLOKIR_MS;
  }

  percobaanLogin.set(identitas, rekam);
}

function resetPercobaan(identitas: string): void {
  percobaanLogin.delete(identitas);
}

// ------------------------------------------------------------------
// TIPE HASIL LOGIN
// ------------------------------------------------------------------
export interface HasilLogin {
  sukses: boolean;
  /** Pesan error untuk ditampilkan ke user kalau sukses === false */
  pesan?: string;
}

/**
 * Verifikasi username & password, lalu buat cookie session kalau berhasil.
 *
 * Password dicek dengan salah satu dari dua mode (pilih salah satu di .env.local):
 *  1. ADMIN_PASSWORD_HASH (disarankan untuk production) — hash bcrypt dari
 *     password, dibandingkan pakai bcrypt.compare(). Password asli tidak
 *     pernah tersimpan dalam bentuk plaintext.
 *  2. ADMIN_PASSWORD (mode simpel untuk development/belajar) — password
 *     plaintext langsung di .env.local, dibandingkan langsung sebagai string.
 *
 * Cara generate ADMIN_PASSWORD_HASH ada di komentar file .env.local.example.
 */
export async function login(username: string, password: string): Promise<HasilLogin> {
  const identitas = ambilIdentitasClient();

  const rate = cekRateLimit(identitas);
  if (!rate.diizinkan) {
    return {
      sukses: false,
      pesan: `Terlalu banyak percobaan gagal. Coba lagi dalam ${rate.sisaDetik} detik.`,
    };
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminPasswordPlain = process.env.ADMIN_PASSWORD;

  if (!adminUsername || (!adminPasswordHash && !adminPasswordPlain)) {
    return {
      sukses: false,
      pesan:
        'Konfigurasi login belum lengkap. Set ADMIN_USERNAME dan ADMIN_PASSWORD ' +
        '(atau ADMIN_PASSWORD_HASH) di file .env.local.',
    };
  }

  const usernameCocok = username === adminUsername;

  let passwordCocok = false;
  if (adminPasswordHash) {
    passwordCocok = await bcrypt.compare(password, adminPasswordHash);
  } else if (adminPasswordPlain) {
    passwordCocok = password === adminPasswordPlain;
  }

  if (!usernameCocok || !passwordCocok) {
    catatPercobaanGagal(identitas);
    return { sukses: false, pesan: 'Username atau password salah.' };
  }

  resetPercobaan(identitas);

  const token = await buatSessionToken(username, DURASI_SESSION_DETIK);

  cookies().set(NAMA_COOKIE_SESSION, token, {
    httpOnly: true, // tidak bisa diakses lewat document.cookie di browser (mencegah XSS mencuri session)
    secure: process.env.NODE_ENV === 'production', // hanya dikirim lewat HTTPS di production
    sameSite: 'lax', // proteksi dasar terhadap CSRF
    path: '/',
    maxAge: DURASI_SESSION_DETIK,
  });

  return { sukses: true };
}

/** Hapus cookie session (logout). */
export async function logout(): Promise<void> {
  cookies().delete(NAMA_COOKIE_SESSION);
}

/**
 * Ambil & verifikasi session dari cookie request saat ini.
 * Dipakai di Server Component/Server Action untuk cek "siapa yang login".
 * Return null kalau belum login / session tidak valid / sudah kedaluwarsa.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(NAMA_COOKIE_SESSION)?.value;
  return verifikasiSessionToken(token);
}
