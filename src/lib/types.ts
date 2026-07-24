/**
 * Definisi tipe data utama aplikasi manajemen kelas.
 * Data ini yang akan disimpan sebagai file JSON di dalam
 * repository GitHub (lihat src/lib/github.ts).
 */

export interface Siswa {
  id: string; // uuid
  nama: string;
  nis: string; // Nomor Induk Siswa
  jenisKelamin: 'L' | 'P';
  kelasId: string; // relasi ke Kelas.id
  email?: string;
  nomorHp?: string;
  alamat?: string;
  fotoUrl?: string;
  dibuatPada: string; // ISO date string
}

export interface Kelas {
  id: string; // uuid
  nama: string; // contoh: "XII IPA 1"
  tingkat: string; // contoh: "XII"
  waliKelas: string;
  tahunAjaran: string; // contoh: "2026/2027"
  deskripsi?: string;
  dibuatPada: string;
}

export interface Nilai {
  id: string;
  mataPelajaran: string;
  namaTugas: string; // nama tugas / ujian, contoh: "Ulangan Harian Bab 3"
  nilai: number; // nilai yang didapat
  nilaiMaksimal: number; // nilai maksimal / skala penuh, contoh: 100
  tanggal: string; // ISO date string
  jenis?: 'Tugas' | 'UTS' | 'UAS' | 'Kuis';
  catatan?: string;
  // Opsional: relasi ke siswa/kelas, disediakan untuk kompatibilitas ke depan
  // kalau suatu saat dipakai untuk mode guru (nilai per siswa).
  siswaId?: string;
  kelasId?: string;
}

export interface Kehadiran {
  id: string;
  siswaId: string;
  kelasId: string;
  tanggal: string; // ISO date
  status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
  keterangan?: string;
}

/**
 * ===== Tipe data untuk Dashboard (jadwal, tugas, catatan) =====
 * Tiga koleksi ini + "nilai" (di atas) adalah 4 koleksi utama
 * yang dipakai oleh Dashboard: schedules, tasks, notes, grades.
 */

export interface JadwalPelajaran {
  id: string; // uuid
  mataPelajaran: string;
  guru?: string; // nama guru pengampu
  kelasId?: string; // relasi opsional ke Kelas.id
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | "Jum'at" | 'Sabtu' | 'Minggu';
  jamMulai: string; // format "HH:mm"
  jamSelesai: string; // format "HH:mm"
  ruangan?: string;
  catatan?: string;
  dibuatPada: string;
}

export type PrioritasTugas = 'Rendah' | 'Sedang' | 'Tinggi';
export type StatusTugas = 'Belum Dikerjakan' | 'Sedang Dikerjakan' | 'Selesai';

export interface Tugas {
  id: string; // uuid
  judul: string;
  mataPelajaran: string;
  kelasId?: string; // relasi opsional ke Kelas.id
  deadline: string; // ISO date string
  prioritas: PrioritasTugas;
  status: StatusTugas;
  deskripsi?: string;
  dibuatPada: string;
}

export interface Catatan {
  id: string; // uuid
  judul: string;
  isi: string; // isi catatan dalam format Markdown
  mataPelajaran?: string;
  tags?: string[];
  dibuatPada: string;
  diperbaruiPada: string;
}

/** Struktur lengkap database JSON yang tersimpan di GitHub */
export interface DatabaseKelas {
  kelas: Kelas[];
  siswa: Siswa[];
  nilai: Nilai[]; // koleksi "grades"
  kehadiran: Kehadiran[];
  jadwal: JadwalPelajaran[]; // koleksi "schedules"
  tugas: Tugas[]; // koleksi "tasks"
  catatan: Catatan[]; // koleksi "notes"
}

/** Nama koleksi yang dikelola lewat mekanisme CRUD generik di lib/data.ts */
export type NamaKoleksi = 'jadwal' | 'tugas' | 'catatan' | 'nilai';

export const DATABASE_KOSONG: DatabaseKelas = {
  kelas: [],
  siswa: [],
  nilai: [],
  kehadiran: [],
  jadwal: [],
  tugas: [],
  catatan: [],
};
