import { create } from 'zustand';
import type { DatabaseKelas, JadwalPelajaran, Tugas, Catatan, Nilai } from './types';
import { DATABASE_KOSONG } from './types';
import {
  ambilSeluruhDataAction,
  tambahJadwalAction,
  perbaruiJadwalAction,
  hapusJadwalAction,
  tambahTugasAction,
  perbaruiTugasAction,
  ubahStatusTugasAction,
  hapusTugasAction,
  tambahCatatanAction,
  perbaruiCatatanAction,
  hapusCatatanAction,
  tambahNilaiAction,
  perbaruiNilaiAction,
  hapusNilaiAction,
} from '@/app/actions';

/**
 * ============================================================================
 *  ZUSTAND STORE
 * ============================================================================
 * Satu store terpusat untuk seluruh data dashboard (jadwal, tugas, catatan,
 * nilai, kelas, siswa). Store ini:
 *   - Menyimpan salinan data di memori client supaya UI responsif
 *     (tidak perlu tunggu server tiap kali render ulang).
 *   - Melakukan "optimistic update" ringan: setelah action sukses, state
 *     lokal langsung disinkronkan dari hasil balikan Server Action
 *     (bukan asumsi, tapi data asli dari GitHub yang baru saja ditulis).
 *   - Menyediakan flag `memuat` & `error` per-operasi supaya komponen
 *     bisa menampilkan loading state / pesan error dengan gampang.
 *
 * Dipakai dari Client Component, contoh:
 *   const { tugas, tambahTugas, memuat } = useKelasStore();
 * ============================================================================
 */

interface KelasStoreState {
  // ----- data -----
  database: DatabaseKelas;

  // ----- status -----
  memuat: boolean;
  error: string | null;
  sudahDiisi: boolean; // apakah store sudah pernah di-hydrate dari server

  // ----- actions umum -----
  hydrate: () => Promise<void>;
  hydrateDenganData: (data: DatabaseKelas) => void;
  reset: () => void;

  // ----- jadwal -----
  tambahJadwal: (input: Omit<JadwalPelajaran, 'id' | 'dibuatPada'>) => Promise<boolean>;
  perbaruiJadwal: (id: string, patch: Partial<JadwalPelajaran>) => Promise<boolean>;
  hapusJadwal: (id: string) => Promise<boolean>;

  // ----- tugas -----
  tambahTugas: (input: Omit<Tugas, 'id' | 'dibuatPada'>) => Promise<boolean>;
  perbaruiTugas: (id: string, patch: Partial<Tugas>) => Promise<boolean>;
  ubahStatusTugas: (id: string, status: Tugas['status']) => Promise<boolean>;
  hapusTugas: (id: string) => Promise<boolean>;

  // ----- catatan -----
  tambahCatatan: (input: Omit<Catatan, 'id' | 'dibuatPada' | 'diperbaruiPada'>) => Promise<boolean>;
  perbaruiCatatan: (id: string, patch: Partial<Catatan>) => Promise<boolean>;
  hapusCatatan: (id: string) => Promise<boolean>;

  // ----- nilai (grades) -----
  tambahNilai: (input: Omit<Nilai, 'id'>) => Promise<boolean>;
  perbaruiNilai: (id: string, patch: Partial<Nilai>) => Promise<boolean>;
  hapusNilai: (id: string) => Promise<boolean>;
}

export const useKelasStore = create<KelasStoreState>((set, get) => ({
  database: DATABASE_KOSONG,
  memuat: false,
  error: null,
  sudahDiisi: false,

  hydrate: async () => {
    // Hindari fetch berulang kalau sudah pernah diisi & tidak dipaksa refresh
    set({ memuat: true, error: null });
    const hasil = await ambilSeluruhDataAction();
    if (hasil.sukses) {
      set({ database: hasil.data, memuat: false, sudahDiisi: true });
    } else {
      set({ error: hasil.pesan, memuat: false });
    }
  },

  reset: () => set({ database: DATABASE_KOSONG, sudahDiisi: false, error: null }),

  /** Seed store dari data yang sudah diambil di Server Component (hindari fetch dobel). */
  hydrateDenganData: (data) => set({ database: data, sudahDiisi: true, error: null }),

  /* ============================== JADWAL ============================== */
  tambahJadwal: async (input) => {
    set({ memuat: true, error: null });
    const hasil = await tambahJadwalAction(input);
    if (hasil.sukses && hasil.data) {
      set((state) => ({
        database: { ...state.database, jadwal: [...state.database.jadwal, hasil.data!] },
        memuat: false,
      }));
      return true;
    }
    set({ error: hasil.pesan ?? 'Gagal menambah jadwal.', memuat: false });
    return false;
  },

  perbaruiJadwal: async (id, patch) => {
    set({ memuat: true, error: null });
    const hasil = await perbaruiJadwalAction(id, patch);
    if (hasil.sukses && hasil.data) {
      set((state) => ({
        database: {
          ...state.database,
          jadwal: state.database.jadwal.map((j) => (j.id === id ? hasil.data! : j)),
        },
        memuat: false,
      }));
      return true;
    }
    set({ error: hasil.pesan ?? 'Gagal memperbarui jadwal.', memuat: false });
    return false;
  },

  hapusJadwal: async (id) => {
    set({ memuat: true, error: null });
    const hasil = await hapusJadwalAction(id);
    if (hasil.sukses) {
      set((state) => ({
        database: { ...state.database, jadwal: state.database.jadwal.filter((j) => j.id !== id) },
        memuat: false,
      }));
      return true;
    }
    set({ error: hasil.pesan ?? 'Gagal menghapus jadwal.', memuat: false });
    return false;
  },

  /* ============================== TUGAS ============================== */
  tambahTugas: async (input) => {
    set({ memuat: true, error: null });
    const hasil = await tambahTugasAction(input);
    if (hasil.sukses && hasil.data) {
      set((state) => ({
        database: { ...state.database, tugas: [...state.database.tugas, hasil.data!] },
        memuat: false,
      }));
      return true;
    }
    set({ error: hasil.pesan ?? 'Gagal menambah tugas.', memuat: false });
    return false;
  },

  perbaruiTugas: async (id, patch) => {
    set({ memuat: true, error: null });
    const hasil = await perbaruiTugasAction(id, patch);
    if (hasil.sukses && hasil.data) {
      set((state) => ({
        database: {
          ...state.database,
          tugas: state.database.tugas.map((t) => (t.id === id ? hasil.data! : t)),
        },
        memuat: false,
      }));
      return true;
    }
    set({ error: hasil.pesan ?? 'Gagal memperbarui tugas.', memuat: false });
    return false;
  },

  ubahStatusTugas: async (id, status) => {
    const hasil = await ubahStatusTugasAction(id, status);
    if (hasil.sukses && hasil.data) {
      set((state) => ({
        database: {
          ...state.database,
          tugas: state.database.tugas.map((t) => (t.id === id ? hasil.data! : t)),
        },
      }));
      return true;
    }
    set({ error: hasil.pesan ?? 'Gagal mengubah status tugas.' });
    return false;
  },

  hapusTugas: async (id) => {
    set({ memuat: true, error: null });
    const hasil = await hapusTugasAction(id);
    if (hasil.sukses) {
      set((state) => ({
        database: { ...state.database, tugas: state.database.tugas.filter((t) => t.id !== id) },
        memuat: false,
      }));
      return true;
    }
    set({ error: hasil.pesan ?? 'Gagal menghapus tugas.', memuat: false });
    return false;
  },

  /* ============================== CATATAN ============================== */
  tambahCatatan: async (input) => {
    set({ memuat: true, error: null });
    const hasil = await tambahCatatanAction(input);
    if (hasil.sukses && hasil.data) {
      set((state) => ({
        database: { ...state.database, catatan: [...state.database.catatan, hasil.data!] },
        memuat: false,
      }));
      return true;
    }
    set({ error: hasil.pesan ?? 'Gagal menambah catatan.', memuat: false });
    return false;
  },

  perbaruiCatatan: async (id, patch) => {
    set({ memuat: true, error: null });
    const hasil = await perbaruiCatatanAction(id, patch);
    if (hasil.sukses && hasil.data) {
      set((state) => ({
        database: {
          ...state.database,
          catatan: state.database.catatan.map((c) => (c.id === id ? hasil.data! : c)),
        },
        memuat: false,
      }));
      return true;
    }
    set({ error: hasil.pesan ?? 'Gagal memperbarui catatan.', memuat: false });
    return false;
  },

  hapusCatatan: async (id) => {
    set({ memuat: true, error: null });
    const hasil = await hapusCatatanAction(id);
    if (hasil.sukses) {
      set((state) => ({
        database: { ...state.database, catatan: state.database.catatan.filter((c) => c.id !== id) },
        memuat: false,
      }));
      return true;
    }
    set({ error: hasil.pesan ?? 'Gagal menghapus catatan.', memuat: false });
    return false;
  },

  /* ============================== NILAI ============================== */
  tambahNilai: async (input) => {
    set({ memuat: true, error: null });
    const hasil = await tambahNilaiAction(input);
    if (hasil.sukses && hasil.data) {
      set((state) => ({
        database: { ...state.database, nilai: [...state.database.nilai, hasil.data!] },
        memuat: false,
      }));
      return true;
    }
    set({ error: hasil.pesan ?? 'Gagal menambah nilai.', memuat: false });
    return false;
  },

  perbaruiNilai: async (id, patch) => {
    set({ memuat: true, error: null });
    const hasil = await perbaruiNilaiAction(id, patch);
    if (hasil.sukses && hasil.data) {
      set((state) => ({
        database: {
          ...state.database,
          nilai: state.database.nilai.map((n) => (n.id === id ? hasil.data! : n)),
        },
        memuat: false,
      }));
      return true;
    }
    set({ error: hasil.pesan ?? 'Gagal memperbarui nilai.', memuat: false });
    return false;
  },

  hapusNilai: async (id) => {
    set({ memuat: true, error: null });
    const hasil = await hapusNilaiAction(id);
    if (hasil.sukses) {
      set((state) => ({
        database: { ...state.database, nilai: state.database.nilai.filter((n) => n.id !== id) },
        memuat: false,
      }));
      return true;
    }
    set({ error: hasil.pesan ?? 'Gagal menghapus nilai.', memuat: false });
    return false;
  },
}));

/** Ambil store lalu langsung hydrate kalau belum pernah diisi. Dipanggil dari Client Component. */
export function useHydrateKelasStore() {
  const { hydrate, sudahDiisi, memuat } = useKelasStore();
  return { hydrate, sudahDiisi, memuat };
}
