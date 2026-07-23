import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Settings,
  CalendarClock,
  CalendarDays,
  ListTodo,
  NotebookText,
  Award,
} from 'lucide-react';

export interface ItemNavigasi {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Kalau true, item ini akan menampilkan badge jumlah tugas mendesak (deadline < 3 hari). */
  tampilkanBadgeTugas?: boolean;
}

/**
 * Daftar menu utama aplikasi. Disimpan di satu tempat supaya
 * sidebar desktop dan sidebar mobile (Sheet) selalu konsisten.
 */
export const ITEM_NAVIGASI: ItemNavigasi[] = [
  { label: 'Beranda', href: '/', icon: LayoutDashboard },
  { label: 'Kelas', href: '/kelas', icon: GraduationCap },
  { label: 'Siswa', href: '/siswa', icon: Users },
  { label: 'Tugas', href: '/tugas', icon: ListTodo, tampilkanBadgeTugas: true },
  { label: 'Catatan', href: '/catatan', icon: NotebookText },
  { label: 'Nilai', href: '/nilai', icon: Award },
  { label: 'Jadwal', href: '/jadwal', icon: CalendarClock },
  { label: 'Kalender', href: '/kalender', icon: CalendarDays },
  { label: 'Pengaturan', href: '/pengaturan', icon: Settings },
];
