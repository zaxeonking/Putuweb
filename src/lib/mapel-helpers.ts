import type { DatabaseKelas } from './types';

/**
 * Kumpulkan daftar mata pelajaran unik dari seluruh koleksi yang ada
 * (jadwal, tugas, catatan, nilai), diurutkan alfabetis. Dipakai untuk
 * mengisi pilihan dropdown "Mata Pelajaran" di form Catatan & Nilai,
 * supaya konsisten dengan data yang sudah ada di aplikasi.
 */
export function daftarMapelDariDatabase(db: DatabaseKelas): string[] {
  const set = new Set<string>();

  for (const j of db.jadwal) if (j.mataPelajaran) set.add(j.mataPelajaran);
  for (const t of db.tugas) if (t.mataPelajaran) set.add(t.mataPelajaran);
  for (const c of db.catatan) if (c.mataPelajaran) set.add(c.mataPelajaran);
  for (const n of db.nilai) if (n.mataPelajaran) set.add(n.mataPelajaran);

  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Nilai penanda khusus di dropdown mapel untuk memicu input teks mapel baru. */
export const OPSI_MAPEL_BARU = '__mapel_baru__';
