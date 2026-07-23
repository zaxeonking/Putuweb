import { randomUUID } from 'crypto';
import { ambilDatabase, simpanDatabase } from './github';
import type { DatabaseKelas, NamaKoleksi } from './types';

/**
 * ============================================================================
 *  LAPISAN DATA GENERIK (Data Access Layer)
 * ============================================================================
 * Modul ini membungkus src/lib/github.ts menjadi 4 fungsi CRUD generik yang
 * bisa dipakai untuk koleksi apapun di dalam DatabaseKelas:
 *
 *    - getData(koleksi)              -> baca semua item
 *    - saveData(koleksi, item)       -> tambah item baru (otomatis kasih id & timestamp)
 *    - updateData(koleksi, id, patch)-> ubah sebagian field item yang sudah ada
 *    - deleteData(koleksi, id)       -> hapus item berdasarkan id
 *
 * Semua fungsi ini SERVER-ONLY (dipanggil dari Server Actions di
 * src/app/actions.ts), karena di baliknya memanggil GitHub REST API
 * yang butuh token rahasia.
 *
 * PENANGANAN RATE LIMIT & KONFLIK (409):
 * GitHub Contents API membalas 409 kalau `sha` yang kita kirim sudah usang
 * (ada perubahan lain yang lebih baru di file yang sama), dan membalas 403
 * dengan header `X-RateLimit-Remaining: 0` kalau kuota API habis.
 * `tulisDenganRetry` menangani dua kasus itu dengan:
 *   1. Retry otomatis (ambil ulang data + sha terbaru) untuk error 409.
 *   2. Backoff (tunggu sebentar lalu ulangi) untuk error 403 rate limit.
 *   3. Menyerah dan melempar error yang jelas kalau retry tetap gagal.
 * ============================================================================
 */

const MAKS_PERCOBAAN = 3;

function tunda(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function apakahErrorRateLimit(pesan: string): boolean {
  return /rate limit/i.test(pesan) || /\(403\)/.test(pesan);
}

function apakahErrorKonflikSha(pesan: string): boolean {
  return /\(409\)/.test(pesan) || /does not match/i.test(pesan);
}

/**
 * Jalankan `pengubah` di atas data paling baru dari GitHub, lalu simpan.
 * Kalau gagal karena konflik sha (409) atau rate limit (403), otomatis
 * dicoba ulang sampai MAKS_PERCOBAAN kali dengan jeda singkat.
 */
async function tulisDenganRetry(
  pesanCommit: string,
  pengubah: (data: DatabaseKelas) => DatabaseKelas
): Promise<DatabaseKelas> {
  let percobaanTerakhir: Error | null = null;

  for (let percobaan = 1; percobaan <= MAKS_PERCOBAAN; percobaan++) {
    try {
      const { data, sha } = await ambilDatabase();
      const dataBaru = pengubah(data);
      await simpanDatabase(dataBaru, pesanCommit, sha);
      return dataBaru;
    } catch (error) {
      const pesan = (error as Error).message;
      percobaanTerakhir = error as Error;

      if (apakahErrorKonflikSha(pesan)) {
        // File berubah di antara ambil & simpan -> langsung coba lagi
        // dengan data + sha terbaru (tanpa jeda, karena ini bukan rate limit).
        continue;
      }

      if (apakahErrorRateLimit(pesan) && percobaan < MAKS_PERCOBAAN) {
        // Kena rate limit GitHub API -> tunggu dengan exponential backoff
        // (1s, 2s, 4s, ...) sebelum mencoba lagi.
        await tunda(1000 * 2 ** (percobaan - 1));
        continue;
      }

      // Error lain (network, auth, dll) -> tidak perlu retry, langsung lempar.
      throw error;
    }
  }

  throw new Error(
    `Gagal menyimpan data setelah ${MAKS_PERCOBAAN}x percobaan: ${percobaanTerakhir?.message}`
  );
}

/** Ambil semua item dari satu koleksi (jadwal | tugas | catatan | nilai). */
export async function getData<K extends NamaKoleksi>(
  koleksi: K
): Promise<DatabaseKelas[K]> {
  const { data } = await ambilDatabase();
  return data[koleksi];
}

/**
 * Tambah item baru ke sebuah koleksi.
 * `id` dan field timestamp (dibuatPada / diperbaruiPada) diisi otomatis
 * kalau belum ada di `item`, supaya pemanggil tidak perlu mengurusnya.
 */
export async function saveData<K extends NamaKoleksi>(
  koleksi: K,
  item: Partial<DatabaseKelas[K][number]> & Record<string, unknown>
): Promise<DatabaseKelas[K][number]> {
  const sekarang = new Date().toISOString();
  const itemBaru = {
    id: randomUUID(),
    dibuatPada: sekarang,
    ...('diperbaruiPada' in item || koleksi === 'catatan'
      ? { diperbaruiPada: sekarang }
      : {}),
    ...item,
  } as DatabaseKelas[K][number];

  await tulisDenganRetry(
    `feat(${koleksi}): tambah data baru`,
    (db) =>
      ({
        ...db,
        [koleksi]: [...(db[koleksi] as unknown[]), itemBaru],
      }) as DatabaseKelas
  );

  return itemBaru;
}

/** Ubah sebagian field pada item yang sudah ada (dicari berdasarkan id). */
export async function updateData<K extends NamaKoleksi>(
  koleksi: K,
  id: string,
  patch: Partial<DatabaseKelas[K][number]>
): Promise<DatabaseKelas[K][number]> {
  let hasil: DatabaseKelas[K][number] | undefined;

  await tulisDenganRetry(`fix(${koleksi}): perbarui data ${id}`, (db) => {
    const daftar = db[koleksi] as Array<{ id: string }>;
    const indeks = daftar.findIndex((it) => it.id === id);

    if (indeks === -1) {
      throw new Error(`Data dengan id "${id}" tidak ditemukan di koleksi "${koleksi}".`);
    }

    const itemBaru = {
      ...daftar[indeks],
      ...patch,
      ...(koleksi === 'catatan' ? { diperbaruiPada: new Date().toISOString() } : {}),
    };
    hasil = itemBaru as DatabaseKelas[K][number];

    const daftarBaru = [...daftar];
    daftarBaru[indeks] = itemBaru;

    return { ...db, [koleksi]: daftarBaru } as DatabaseKelas;
  });

  return hasil as DatabaseKelas[K][number];
}

/** Hapus satu item dari koleksi berdasarkan id. */
export async function deleteData(koleksi: NamaKoleksi, id: string): Promise<void> {
  await tulisDenganRetry(`fix(${koleksi}): hapus data ${id}`, (db) => {
    const daftar = db[koleksi] as Array<{ id: string }>;
    return {
      ...db,
      [koleksi]: daftar.filter((it) => it.id !== id),
    } as DatabaseKelas;
  });
}
