import type { Tugas } from './types';

/** Ambang batas "mendesak": tugas dengan sisa hari <= angka ini dianggap perlu perhatian segera. */
export const AMBANG_HARI_MENDESAK = 3;

/**
 * Hitung selisih hari kalender antara hari ini dan deadline (dibulatkan,
 * mengabaikan jam). Nilai negatif berarti sudah lewat deadline.
 */
export function hitungSisaHari(deadline: string): number {
  const sekarang = new Date();
  sekarang.setHours(0, 0, 0, 0);
  const tenggat = new Date(deadline);
  tenggat.setHours(0, 0, 0, 0);
  return Math.round((tenggat.getTime() - sekarang.getTime()) / 86_400_000);
}

/** Label ramah-baca untuk sisa hari deadline, plus flag apakah tergolong mendesak. */
export function labelSisaHari(deadline: string): { teks: string; mendesak: boolean } {
  const selisihHari = hitungSisaHari(deadline);

  if (selisihHari < 0) return { teks: `Terlambat ${Math.abs(selisihHari)} hari`, mendesak: true };
  if (selisihHari === 0) return { teks: 'Hari ini', mendesak: true };
  if (selisihHari === 1) return { teks: 'Besok', mendesak: true };
  return { teks: `${selisihHari} hari lagi`, mendesak: selisihHari <= AMBANG_HARI_MENDESAK };
}

/** Apakah sebuah tugas belum selesai dan deadline-nya kurang dari (atau termasuk) ambang hari mendesak. */
export function apakahTugasMendesak(tugas: Pick<Tugas, 'status' | 'deadline'>): boolean {
  if (tugas.status === 'Selesai') return false;
  return hitungSisaHari(tugas.deadline) <= AMBANG_HARI_MENDESAK;
}

/** Hitung jumlah tugas yang mendesak (belum selesai & deadline < 3 hari, termasuk yang sudah lewat). */
export function hitungJumlahTugasMendesak(daftarTugas: Tugas[]): number {
  return daftarTugas.filter(apakahTugasMendesak).length;
}
