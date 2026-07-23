import { z } from 'zod';

/**
 * src/lib/validasi-database.ts
 * ------------------------------------------------------------------
 * Schema zod yang merefleksikan struktur `DatabaseKelas` (lihat lib/types.ts).
 * Dipakai SATU tempat: memvalidasi file JSON yang diunggah pengguna lewat
 * fitur Import Data di halaman Pengaturan, sebelum ditimpakan ke file
 * database di GitHub. Ini mencegah file JSON yang salah format / rusak /
 * asal-asalan sampai menimpa data asli dengan struktur yang tidak valid.
 */

const siswaSchema = z.object({
  id: z.string(),
  nama: z.string(),
  nis: z.string(),
  jenisKelamin: z.enum(['L', 'P']),
  kelasId: z.string(),
  email: z.string().optional(),
  nomorHp: z.string().optional(),
  alamat: z.string().optional(),
  fotoUrl: z.string().optional(),
  dibuatPada: z.string(),
});

const kelasSchema = z.object({
  id: z.string(),
  nama: z.string(),
  tingkat: z.string(),
  waliKelas: z.string(),
  tahunAjaran: z.string(),
  deskripsi: z.string().optional(),
  dibuatPada: z.string(),
});

const nilaiSchema = z.object({
  id: z.string(),
  mataPelajaran: z.string(),
  namaTugas: z.string(),
  nilai: z.number(),
  nilaiMaksimal: z.number(),
  tanggal: z.string(),
  jenis: z.enum(['Tugas', 'UTS', 'UAS', 'Kuis']).optional(),
  catatan: z.string().optional(),
  siswaId: z.string().optional(),
  kelasId: z.string().optional(),
});

const kehadiranSchema = z.object({
  id: z.string(),
  siswaId: z.string(),
  kelasId: z.string(),
  tanggal: z.string(),
  status: z.enum(['Hadir', 'Sakit', 'Izin', 'Alpa']),
  keterangan: z.string().optional(),
});

const jadwalSchema = z.object({
  id: z.string(),
  mataPelajaran: z.string(),
  guru: z.string().optional(),
  kelasId: z.string().optional(),
  hari: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu', 'Minggu']),
  jamMulai: z.string(),
  jamSelesai: z.string(),
  ruangan: z.string().optional(),
  catatan: z.string().optional(),
  dibuatPada: z.string(),
});

const tugasSchema = z.object({
  id: z.string(),
  judul: z.string(),
  mataPelajaran: z.string(),
  kelasId: z.string().optional(),
  deadline: z.string(),
  prioritas: z.enum(['Rendah', 'Sedang', 'Tinggi']),
  status: z.enum(['Belum Dikerjakan', 'Sedang Dikerjakan', 'Selesai']),
  deskripsi: z.string().optional(),
  dibuatPada: z.string(),
});

const catatanSchema = z.object({
  id: z.string(),
  judul: z.string(),
  isi: z.string(),
  mataPelajaran: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dibuatPada: z.string(),
  diperbaruiPada: z.string(),
});

/** Schema lengkap satu file backup/export KelasKu. */
export const databaseKelasSchema = z.object({
  kelas: z.array(kelasSchema),
  siswa: z.array(siswaSchema),
  nilai: z.array(nilaiSchema),
  kehadiran: z.array(kehadiranSchema),
  jadwal: z.array(jadwalSchema),
  tugas: z.array(tugasSchema),
  catatan: z.array(catatanSchema),
});

export type HasilValidasiImpor =
  | { valid: true; data: z.infer<typeof databaseKelasSchema> }
  | { valid: false; pesan: string };

/**
 * Validasi konten JSON yang diunggah pengguna. Mengembalikan pesan error
 * yang mudah dibaca (bukan stack trace zod mentah) kalau tidak valid.
 */
export function validasiDatabaseImpor(json: unknown): HasilValidasiImpor {
  const hasil = databaseKelasSchema.safeParse(json);
  if (!hasil.success) {
    const masalahPertama = hasil.error.issues[0];
    const lokasi = masalahPertama?.path.join('.') || 'root';
    return {
      valid: false,
      pesan: `Format file tidak sesuai (di bagian "${lokasi}": ${masalahPertama?.message}). Pastikan file yang diunggah adalah hasil Export Data dari KelasKu.`,
    };
  }
  return { valid: true, data: hasil.data };
}
