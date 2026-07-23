'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Download, Trash2, Pencil, TrendingUp, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { cn, formatTanggal } from '@/lib/utils';
import { useKelasStore } from '@/lib/store';
import { daftarMapelDariDatabase } from '@/lib/mapel-helpers';
import type { DatabaseKelas, Nilai } from '@/lib/types';
import { DialogNilai } from './dialog-nilai';
import { ChartNilai } from './chart-nilai';

interface Props {
  initialDatabase: DatabaseKelas;
}

const SELECT_CLASS =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

function persentase(n: Nilai): number {
  return Math.round((n.nilai / n.nilaiMaksimal) * 1000) / 10;
}

function rataRata(daftar: Nilai[]): number | null {
  if (daftar.length === 0) return null;
  const total = daftar.reduce((jumlah, n) => jumlah + persentase(n), 0);
  return Math.round((total / daftar.length) * 10) / 10;
}

function warnaNilai(p: number): string {
  if (p >= 85) return 'text-emerald-600 dark:text-emerald-400';
  if (p >= 70) return 'text-brand';
  return 'text-destructive';
}

/** Escape sederhana untuk field CSV yang mengandung koma / kutip / newline. */
function escapeCsv(nilai: string | number): string {
  const teks = String(nilai);
  if (/[",\n]/.test(teks)) {
    return `"${teks.replace(/"/g, '""')}"`;
  }
  return teks;
}

function unduhCsv(daftar: Nilai[]) {
  const header = ['Mata Pelajaran', 'Nama Tugas', 'Nilai', 'Nilai Maksimal', 'Persentase', 'Tanggal'];
  const baris = daftar.map((n) =>
    [n.mataPelajaran, n.namaTugas, n.nilai, n.nilaiMaksimal, `${persentase(n)}%`, n.tanggal]
      .map(escapeCsv)
      .join(',')
  );
  const csv = [header.join(','), ...baris].join('\n');

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nilai-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function NilaiClient({ initialDatabase }: Props) {
  const database = useKelasStore((s) => s.database);
  const sudahDiisi = useKelasStore((s) => s.sudahDiisi);
  const hydrateDenganData = useKelasStore((s) => s.hydrateDenganData);
  const hapusNilai = useKelasStore((s) => s.hapusNilai);

  React.useEffect(() => {
    if (!sudahDiisi) {
      hydrateDenganData(initialDatabase);
    }
  }, [sudahDiisi, initialDatabase, hydrateDenganData]);

  const db = sudahDiisi ? database : initialDatabase;
  const { nilai } = db;

  const daftarMapel = React.useMemo(() => daftarMapelDariDatabase(db), [db]);
  const [filterMapel, setFilterMapel] = React.useState('Semua');

  const nilaiTersaring = React.useMemo(
    () => (filterMapel === 'Semua' ? nilai : nilai.filter((n) => n.mataPelajaran === filterMapel)),
    [nilai, filterMapel]
  );

  const rataKeseluruhan = React.useMemo(() => rataRata(nilaiTersaring), [nilaiTersaring]);

  // Kelompokkan per mata pelajaran, masing-masing diurutkan dari tanggal terbaru.
  const kelompok = React.useMemo(() => {
    const peta = new Map<string, Nilai[]>();
    for (const n of nilaiTersaring) {
      if (!peta.has(n.mataPelajaran)) peta.set(n.mataPelajaran, []);
      peta.get(n.mataPelajaran)!.push(n);
    }
    for (const daftar of peta.values()) {
      daftar.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    }
    return Array.from(peta.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [nilaiTersaring]);

  async function tanganiHapus(n: Nilai) {
    const yakin = window.confirm(`Hapus nilai "${n.namaTugas}"? Tindakan ini tidak bisa dibatalkan.`);
    if (!yakin) return;

    const sukses = await hapusNilai(n.id);
    if (sukses) {
      toast.success(`Nilai "${n.namaTugas}" berhasil dihapus`);
    } else {
      toast.error(useKelasStore.getState().error || 'Gagal menghapus nilai.');
    }
  }

  function tanganiExport() {
    if (nilaiTersaring.length === 0) {
      toast.error('Tidak ada data nilai untuk diekspor.');
      return;
    }
    unduhCsv(nilaiTersaring);
    toast.success('Nilai berhasil diekspor ke CSV');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Nilai</h2>
          <p className="text-muted-foreground">
            Catat nilai tugas &amp; ujian, pantau rata-rata, dan lihat perkembangannya dari waktu ke waktu.
          </p>
        </div>
        <DialogNilai daftarMapel={daftarMapel} />
      </div>

      {/* ===== Ringkasan & Grafik ===== */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rata-rata {filterMapel === 'Semua' ? 'Keseluruhan' : filterMapel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn('text-3xl font-bold', rataKeseluruhan !== null && warnaNilai(rataKeseluruhan))}>
              {rataKeseluruhan !== null ? `${rataKeseluruhan}%` : '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Dari {nilaiTersaring.length} data nilai
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand" /> Perkembangan Nilai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartNilai nilai={nilaiTersaring} labelFilter={filterMapel} />
          </CardContent>
        </Card>
      </div>

      {/* ===== Toolbar: filter mapel & export ===== */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <label htmlFor="filterMapelNilai" className="text-sm text-muted-foreground shrink-0">
                Filter Mapel
              </label>
              <select
                id="filterMapelNilai"
                value={filterMapel}
                onChange={(e) => setFilterMapel(e.target.value)}
                className={cn(SELECT_CLASS, 'sm:w-56')}
              >
                <option value="Semua">Semua Mapel</option>
                {daftarMapel.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <Button variant="outline" size="sm" onClick={tanganiExport}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ===== Tabel per mata pelajaran ===== */}
      {nilai.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Belum ada data nilai. Klik &quot;Tambah Nilai&quot; untuk mencatat nilai pertama Anda.
          </CardContent>
        </Card>
      ) : kelompok.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Tidak ada data nilai untuk mata pelajaran ini.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {kelompok.map(([mapel, daftar]) => {
            const rata = rataRata(daftar);
            return (
              <div key={mapel} className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-brand" />
                  <h3 className="font-semibold">{mapel}</h3>
                  <Badge variant="secondary">{daftar.length} data</Badge>
                  {rata !== null && (
                    <Badge variant="outline" className={cn('ml-auto sm:ml-0', warnaNilai(rata))}>
                      Rata-rata: {rata}%
                    </Badge>
                  )}
                </div>

                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Tugas</TableHead>
                        <TableHead>Nilai</TableHead>
                        <TableHead>Persentase</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {daftar.map((n) => (
                        <TableRow key={n.id}>
                          <TableCell className="font-medium max-w-[220px] truncate">{n.namaTugas}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">
                            {n.nilai} / {n.nilaiMaksimal}
                          </TableCell>
                          <TableCell className={cn('font-medium', warnaNilai(persentase(n)))}>
                            {persentase(n)}%
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {formatTanggal(n.tanggal)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <DialogNilai
                                daftarMapel={daftarMapel}
                                nilai={n}
                                trigger={
                                  <Button variant="ghost" size="icon" aria-label="Edit nilai">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                }
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Hapus nilai"
                                onClick={() => tanganiHapus(n)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
