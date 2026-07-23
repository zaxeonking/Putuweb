import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Gabungkan className Tailwind dengan aman.
 * clsx() menggabungkan kondisi className, twMerge() menghapus
 * duplikasi/konflik utility class (misal "p-2 p-4" -> "p-4").
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format tanggal ISO ke format Indonesia yang mudah dibaca.
 * Contoh: "2026-07-23" -> "23 Juli 2026"
 */
export function formatTanggal(tanggalISO: string): string {
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const d = new Date(tanggalISO);
  if (isNaN(d.getTime())) return tanggalISO;
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Ambil inisial dari nama untuk ditampilkan di Avatar (fallback).
 * Contoh: "Budi Santoso" -> "BS"
 */
export function ambilInisial(nama: string): string {
  return nama
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((kata) => kata[0]?.toUpperCase() ?? '')
    .join('');
}
