'use client';

import * as React from 'react';
import Link from 'next/link';
import { ListChecks, CalendarClock, AlarmClock, Award, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useKelasStore } from '@/lib/store';
import type { DatabaseKelas } from '@/lib/types';
import { ChartTugasMapel } from './chart-tugas-mapel';
import { DaftarTugasTerbaru } from './daftar-tugas-terbaru';
import { DialogTambahTugas } from './dialog-tambah-tugas';
import { DialogTambahJadwal } from './dialog-tambah-jadwal';

interface Props {
  initialDatabase: DatabaseKelas;
}

function apakahHariIni(tanggalISO: string): boolean {
  const sekarang = new Date();
  const tanggal = new Date(tanggalISO);
  return (
    sekarang.getFullYear() === tanggal.getFullYear() &&
    sekarang.getMonth() === tanggal.getMonth() &&
    sekarang.getDate() === tanggal.getDate()
  );
}

function selisihHari(tanggalISO: string): number {
  const sekarang = new Date();
  sekarang.setHours(0, 0, 0, 0);
  const tanggal = new Date(tanggalISO);
  tanggal.setHours(0, 0, 0, 0);
  return Math.round((tanggal.getTime() - sekarang.getTime()) / 86_400_000);
}

export function DashboardClient({ initialDatabase }: Props) {
  const database = useKelasStore((s) => s.database);
  const sudahDiisi = useKelasStore((s) => s.sudahDiisi);
  const hydrateDenganData = useKelasStore((s) => s.hydrateDenganData);

  // Seed store dari data yang sudah diambil Server Component (page.tsx),
  // jadi tidak perlu request GitHub kedua kali saat dashboard pertama dibuka.
  React.useEffect(() => {
    if (!sudahDiisi) {
      hydrateDenganData(initialDatabase);
    }
  }, [sudahDiisi, initialDatabase, hydrateDenganData]);

  // Selama belum di-seed pada render pertama, pakai initialDatabase langsung
  // supaya tidak ada "flash" tampilan kosong.
  const db = sudahDiisi ? database : initialDatabase;

  const tugasBelumSelesai = React.useMemo(
    () => db.tugas.filter((t) => t.status !== 'Selesai'),
    [db.tugas]
  );

  const totalTugas = db.tugas.length;

  const tugasHariIni = React.useMemo(
    () => tugasBelumSelesai.filter((t) => apakahHariIni(t.deadline)).length,
    [tugasBelumSelesai]
  );

  const deadlineMendekat = React.useMemo(
    () => tugasBelumSelesai.filter((t) => {
      const sisa = selisihHari(t.deadline);
      return sisa >= 0 && sisa <= 3;
    }).length,
    [tugasBelumSelesai]
  );

  const rataRataNilai = React.useMemo(() => {
    if (db.nilai.length === 0) return null;
    const total = db.nilai.reduce((jumlah, n) => jumlah + n.nilai, 0);
    return Math.round((total / db.nilai.length) * 10) / 10;
  }, [db.nilai]);

  const limaTugasTerdekat = React.useMemo(
    () =>
      [...tugasBelumSelesai]
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 5),
    [tugasBelumSelesai]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard 👋</h2>
          <p className="text-muted-foreground">Ringkasan tugas, jadwal, dan nilai Anda saat ini.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" asChild>
            <Link href="/jadwal">
              <CalendarClock className="h-4 w-4" /> Kelola Jadwal
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/kalender">
              <CalendarDays className="h-4 w-4" /> Kalender
            </Link>
          </Button>
          <DialogTambahJadwal />
          <DialogTambahTugas />
        </div>
      </div>

      {/* ===== Kartu statistik ===== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tugas</CardTitle>
            <ListChecks className="h-4 w-4 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTugas}</div>
            <p className="text-xs text-muted-foreground mt-1">{tugasBelumSelesai.length} belum selesai</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tugas Hari Ini</CardTitle>
            <CalendarClock className="h-4 w-4 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tugasHariIni}</div>
            <p className="text-xs text-muted-foreground mt-1">Deadline jatuh hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deadline Mendekat</CardTitle>
            <AlarmClock className="h-4 w-4 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{deadlineMendekat}</div>
            <p className="text-xs text-muted-foreground mt-1">Dalam 3 hari ke depan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rata-rata Nilai</CardTitle>
            <Award className="h-4 w-4 text-brand" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{rataRataNilai ?? '-'}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {db.nilai.length > 0 ? `Dari ${db.nilai.length} data nilai` : 'Belum ada data nilai'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* ===== Grafik tugas per mata pelajaran ===== */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Tugas per Mata Pelajaran</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartTugasMapel tugas={db.tugas} />
          </CardContent>
        </Card>

        {/* ===== 5 tugas terdekat ===== */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tugas Terdekat</CardTitle>
          </CardHeader>
          <CardContent>
            <DaftarTugasTerbaru tugas={limaTugasTerdekat} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
