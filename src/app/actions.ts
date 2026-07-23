'use server';

/**
 * ============================================================================
 *  SERVER ACTIONS
 * ============================================================================
 * Semua mutasi data dashboard (jadwal, tugas, catatan, nilai) lewat sini.
 * Dipanggil langsung dari Client Component pakai `useTransition` / form
 * action, tanpa perlu bikin route /api terpisah.
 *
 * Setiap action:
 *  1. Validasi input dasar.
 *  2. Panggil fungsi CRUD generik di lib/data.ts (yang urus GitHub API).
 *  3. `revalidatePath('/')` supaya Server Component Dashboard re-fetch data.
 *  4. Balikin bentuk `{ sukses, data? , pesan? }` yang konsisten, supaya
 *     gampang dipakai untuk toast error/success di client.
 * ============================================================================
 */

import { revalidatePath } from 'next/cache';
import { ambilDatabase, updateDatabase } from '@/lib/github';
import { getData, saveData, updateData, deleteData } from '@/lib/data';
import { validasiDatabaseImpor } from '@/lib/validasi-database';
import type {
  JadwalPelajaran,
  Tugas,
  Catatan,
  Nilai,
  NamaKoleksi,
  DatabaseKelas,
} from '@/lib/types';

interface HasilAction<T> {
  sukses: boolean;
  data?: T;
  pesan?: string;
}

function bungkusError(error: unknown): { sukses: false; pesan: string } {
  return { sukses: false, pesan: (error as Error).message || 'Terjadi kesalahan.' };
}

/* ============================== JADWAL ============================== */

export async function tambahJadwalAction(
  input: Omit<JadwalPelajaran, 'id' | 'dibuatPada'>
): Promise<HasilAction<JadwalPelajaran>> {
  try {
    if (!input.mataPelajaran || !input.hari || !input.jamMulai || !input.jamSelesai) {
      return { sukses: false, pesan: 'Mata pelajaran, hari, jam mulai, dan jam selesai wajib diisi.' };
    }
    const data = await saveData('jadwal', input);
    revalidatePath('/');
    return { sukses: true, data };
  } catch (error) {
    return bungkusError(error);
  }
}

export async function perbaruiJadwalAction(
  id: string,
  patch: Partial<Omit<JadwalPelajaran, 'id'>>
): Promise<HasilAction<JadwalPelajaran>> {
  try {
    const data = await updateData('jadwal', id, patch);
    revalidatePath('/');
    return { sukses: true, data };
  } catch (error) {
    return bungkusError(error);
  }
}

export async function hapusJadwalAction(id: string): Promise<HasilAction<null>> {
  try {
    await deleteData('jadwal', id);
    revalidatePath('/');
    return { sukses: true };
  } catch (error) {
    return bungkusError(error);
  }
}

/* ============================== TUGAS ============================== */

export async function tambahTugasAction(
  input: Omit<Tugas, 'id' | 'dibuatPada'>
): Promise<HasilAction<Tugas>> {
  try {
    if (!input.judul || !input.mataPelajaran || !input.deadline) {
      return { sukses: false, pesan: 'Judul, mata pelajaran, dan deadline wajib diisi.' };
    }
    const data = await saveData('tugas', {
      prioritas: 'Sedang',
      status: 'Belum Dikerjakan',
      ...input,
    });
    revalidatePath('/');
    return { sukses: true, data };
  } catch (error) {
    return bungkusError(error);
  }
}

export async function perbaruiTugasAction(
  id: string,
  patch: Partial<Omit<Tugas, 'id'>>
): Promise<HasilAction<Tugas>> {
  try {
    const data = await updateData('tugas', id, patch);
    revalidatePath('/');
    return { sukses: true, data };
  } catch (error) {
    return bungkusError(error);
  }
}

export async function ubahStatusTugasAction(
  id: string,
  status: Tugas['status']
): Promise<HasilAction<Tugas>> {
  return perbaruiTugasAction(id, { status });
}

export async function hapusTugasAction(id: string): Promise<HasilAction<null>> {
  try {
    await deleteData('tugas', id);
    revalidatePath('/');
    return { sukses: true };
  } catch (error) {
    return bungkusError(error);
  }
}

/* ============================== CATATAN ============================== */

export async function tambahCatatanAction(
  input: Omit<Catatan, 'id' | 'dibuatPada' | 'diperbaruiPada'>
): Promise<HasilAction<Catatan>> {
  try {
    if (!input.judul || !input.isi) {
      return { sukses: false, pesan: 'Judul dan isi catatan wajib diisi.' };
    }
    const data = await saveData('catatan', input);
    revalidatePath('/');
    return { sukses: true, data };
  } catch (error) {
    return bungkusError(error);
  }
}

export async function perbaruiCatatanAction(
  id: string,
  patch: Partial<Omit<Catatan, 'id'>>
): Promise<HasilAction<Catatan>> {
  try {
    const data = await updateData('catatan', id, patch);
    revalidatePath('/');
    return { sukses: true, data };
  } catch (error) {
    return bungkusError(error);
  }
}

export async function hapusCatatanAction(id: string): Promise<HasilAction<null>> {
  try {
    await deleteData('catatan', id);
    revalidatePath('/');
    return { sukses: true };
  } catch (error) {
    return bungkusError(error);
  }
}

/* ============================== NILAI (grades) ============================== */

export async function tambahNilaiAction(
  input: Omit<Nilai, 'id'>
): Promise<HasilAction<Nilai>> {
  try {
    if (
      !input.mataPelajaran ||
      !input.namaTugas ||
      input.nilai === undefined ||
      input.nilaiMaksimal === undefined
    ) {
      return {
        sukses: false,
        pesan: 'Mata pelajaran, nama tugas, nilai, dan nilai maksimal wajib diisi.',
      };
    }
    if (input.nilaiMaksimal <= 0) {
      return { sukses: false, pesan: 'Nilai maksimal harus lebih besar dari 0.' };
    }
    const data = await saveData('nilai', input);
    revalidatePath('/');
    return { sukses: true, data };
  } catch (error) {
    return bungkusError(error);
  }
}

export async function perbaruiNilaiAction(
  id: string,
  patch: Partial<Omit<Nilai, 'id'>>
): Promise<HasilAction<Nilai>> {
  try {
    const data = await updateData('nilai', id, patch);
    revalidatePath('/');
    return { sukses: true, data };
  } catch (error) {
    return bungkusError(error);
  }
}

export async function hapusNilaiAction(id: string): Promise<HasilAction<null>> {
  try {
    await deleteData('nilai', id);
    revalidatePath('/');
    return { sukses: true };
  } catch (error) {
    return bungkusError(error);
  }
}

/* ============================== GENERIK ============================== */

/** Ambil satu koleksi apapun (dipakai untuk refresh manual dari client / Zustand store). */
export async function ambilKoleksiAction<K extends NamaKoleksi>(
  koleksi: K
): Promise<HasilAction<Awaited<ReturnType<typeof getData<K>>>>> {
  try {
    const data = await getData(koleksi);
    return { sukses: true, data };
  } catch (error) {
    return bungkusError(error);
  }
}

/** Ambil seluruh database sekaligus, dipakai untuk hydrate awal store Zustand di client. */
export async function ambilSeluruhDataAction() {
  try {
    const { data } = await ambilDatabase();
    return { sukses: true as const, data };
  } catch (error) {
    return { sukses: false as const, pesan: (error as Error).message };
  }
}

/* ============================== EXPORT / IMPORT DATA ============================== */

/**
 * Ambil seluruh database untuk keperluan Export (halaman Pengaturan).
 * Sengaja dipisah dari `ambilSeluruhDataAction` (meski isinya sama) supaya
 * kedua pemakaian — hydrate store vs export file — tetap independen kalau
 * suatu saat salah satunya perlu diubah (misal export butuh field tambahan).
 */
export async function eksporDatabaseAction(): Promise<HasilAction<DatabaseKelas>> {
  try {
    const { data } = await ambilDatabase();
    return { sukses: true, data };
  } catch (error) {
    return bungkusError(error);
  }
}

/**
 * Timpa SELURUH database dengan isi file JSON yang diunggah pengguna.
 * Alur:
 *  1. Validasi bentuk data dengan zod (validasiDatabaseImpor) — kalau tidak
 *     sesuai struktur DatabaseKelas, tolak sebelum menyentuh GitHub sama sekali.
 *  2. Kalau valid, commit langsung sebagai isi baru file database.json di GitHub
 *     (menggantikan seluruhnya, BUKAN digabung/merge dengan data lama).
 *
 * PERINGATAN (ditampilkan juga di UI): operasi ini menimpa semua data yang
 * ada sekarang. Riwayat versi sebelumnya tetap bisa ditelusuri lewat riwayat
 * commit repo GitHub (lihat halaman Pengaturan), jadi tidak benar-benar hilang.
 */
export async function imporDatabaseAction(json: unknown): Promise<HasilAction<DatabaseKelas>> {
  const hasilValidasi = validasiDatabaseImpor(json);
  if (!hasilValidasi.valid) {
    return { sukses: false, pesan: hasilValidasi.pesan };
  }

  try {
    const dataBaru = await updateDatabase(
      'chore(data): impor data dari file JSON backup',
      () => hasilValidasi.data
    );
    revalidatePath('/');
    return { sukses: true, data: dataBaru };
  } catch (error) {
    return bungkusError(error);
  }
}
