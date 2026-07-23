/**
 * lib/session.ts
 * ------------------------------------------------------------------
 * Modul level-rendah untuk membuat & memverifikasi token session yang
 * di-*sign* pakai HMAC-SHA256. Isi cookie session TIDAK dienkripsi,
 * hanya ditandatangani — artinya orang bisa membaca isinya kalau mau,
 * tapi TIDAK BISA mengubahnya (misal ganti "isLoggedIn" jadi true
 * secara manual) tanpa ketahuan, karena signature-nya akan invalid.
 *
 * PENTING - kenapa file ini terpisah dari lib/auth.ts:
 * File ini SENGAJA tidak mengimpor apa pun dari 'next/headers' supaya
 * bisa dipakai di dua tempat yang runtime-nya berbeda:
 *   1. middleware.ts       -> berjalan di Edge Runtime
 *   2. lib/auth.ts         -> berjalan di Node.js runtime (Server Actions)
 * Keduanya sama-sama menyediakan Web Crypto API global (`crypto.subtle`,
 * `btoa`, `atob`), jadi kita pakai itu sebagai "lowest common denominator"
 * alih-alih modul 'crypto' bawaan Node.js yang tidak tersedia di Edge.
 */

export interface SessionPayload {
  username: string;
  isLoggedIn: true;
  /** Timestamp (ms, epoch) kapan session ini kedaluwarsa */
  expiresAt: number;
}

const encoder = new TextEncoder();

/** Ambil SESSION_SECRET dari environment variable. Wajib di-set di .env.local. */
function ambilSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      'SESSION_SECRET belum di-set. Tambahkan SESSION_SECRET di file .env.local ' +
        '(lihat .env.local.example untuk contoh & cara generate-nya).'
    );
  }
  return secret;
}

/** Import SESSION_SECRET sebagai CryptoKey untuk keperluan HMAC-SHA256. */
async function ambilKunciHmac(): Promise<CryptoKey> {
  const secret = ambilSecret();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/** Encode string biasa (bukan biner) ke base64url (aman dipakai di cookie/URL). */
function base64UrlEncode(data: string): string {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Kebalikan dari base64UrlEncode. */
function base64UrlDecode(data: string): string {
  const dipulihkan = data.replace(/-/g, '+').replace(/_/g, '/');
  const sisaPadding = dipulihkan.length % 4;
  const padded = sisaPadding === 0 ? dipulihkan : dipulihkan + '='.repeat(4 - sisaPadding);
  return atob(padded);
}

/** Ubah ArrayBuffer hasil signing jadi string base64url. */
function bufferKeBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let biner = '';
  bytes.forEach((byte) => (biner += String.fromCharCode(byte)));
  return base64UrlEncode(biner);
}

/**
 * Buat token session baru dengan format: "payloadBase64.signatureBase64"
 * Dipanggil saat login berhasil (lihat lib/auth.ts -> login()).
 */
export async function buatSessionToken(username: string, durasiDetik: number): Promise<string> {
  const payload: SessionPayload = {
    username,
    isLoggedIn: true,
    expiresAt: Date.now() + durasiDetik * 1000,
  };

  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const kunci = await ambilKunciHmac();
  const signatureBuffer = await crypto.subtle.sign('HMAC', kunci, encoder.encode(payloadB64));
  const signatureB64 = bufferKeBase64Url(signatureBuffer);

  return `${payloadB64}.${signatureB64}`;
}

/**
 * Verifikasi token session dari cookie.
 * Dipakai di middleware.ts (proteksi route) & lib/auth.ts (getSession()).
 *
 * Return: payload session kalau valid & belum kedaluwarsa, null kalau tidak
 * (baik karena signature tidak cocok, format rusak, maupun sudah expired).
 */
export async function verifikasiSessionToken(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;

  const bagian = token.split('.');
  if (bagian.length !== 2) return null;
  const [payloadB64, signatureB64] = bagian;

  try {
    const kunci = await ambilKunciHmac();
    const signatureBytes = Uint8Array.from(base64UrlDecode(signatureB64), (c) => c.charCodeAt(0));
    const signatureValid = await crypto.subtle.verify(
      'HMAC',
      kunci,
      signatureBytes,
      encoder.encode(payloadB64)
    );

    if (!signatureValid) return null; // cookie dipalsukan/diubah

    const payload = JSON.parse(base64UrlDecode(payloadB64)) as SessionPayload;

    if (typeof payload.expiresAt !== 'number' || payload.expiresAt < Date.now()) {
      return null; // session sudah kedaluwarsa
    }

    return payload;
  } catch {
    // Token rusak / tidak bisa di-parse -> anggap tidak valid, jangan throw
    return null;
  }
}
