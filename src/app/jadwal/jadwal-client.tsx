'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  CalendarClock,
  Pencil,
  LayoutGrid,
  List,
  MapPin,
  Plus,
  Trash2,
  User,
  GripVertical,
} from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { useKelasStore } from '@/lib/store';
import type { DatabaseKelas, JadwalPelajaran } from '@/lib/types';
import { DialogJadwal, HARI } from './dialog-jadwal';

interface Props {
  initialDatabase: DatabaseKelas;
}

type TampilanJadwal = 'grid' | 'tabel';
type FilterHari = 'Semua' | JadwalPelajaran['hari'];

export function JadwalClient({ initialDatabase }: Props) {
  const database = useKelasStore((s) => s.database);
  const sudahDiisi = useKelasStore((s) => s.sudahDiisi);
  const hydrateDenganData = useKelasStore((s) => s.hydrateDenganData);
  const perbaruiJadwal = useKelasStore((s) => s.perbaruiJadwal);
  const hapusJadwal = useKelasStore((s) => s.hapusJadwal);

  React.useEffect(() => {
    if (!sudahDiisi) {
      hydrateDenganData(initialDatabase);
    }
  }, [sudahDiisi, initialDatabase, hydrateDenganData]);

  const db = sudahDiisi ? database : initialDatabase;
  const { jadwal, kelas } = db;

  const [tampilan, setTampilan] = React.useState<TampilanJadwal>('grid');
  const [filterHari, setFilterHari] = React.useState<FilterHari>('Semua');
  const [hariDiseret, setHariDiseret] = React.useState<JadwalPelajaran['hari'] | null>(null);
  const [sedangMenyeret, setSedangMenyeret] = React.useState<string | null>(null);

  const namaKelas = React.useCallback(
    (kelasId?: string) => kelas.find((k) => k.id === kelasId)?.nama,
    [kelas]
  );

  const hariDitampilkan = filterHari === 'Semua' ? HARI : HARI.filter((h) => h === filterHari);

  function urutkanJamMulai(a: JadwalPelajaran, b: JadwalPelajaran) {
    return a.jamMulai.localeCompare(b.jamMulai);
  }

  const jadwalPerHari = React.useMemo(() => {
    const peta = new Map<JadwalPelajaran['hari'], JadwalPelajaran[]>();
    for (const h of HARI) {
      peta.set(
        h,
        jadwal.filter((j) => j.hari === h).sort(urutkanJamMulai)
      );
    }
    return peta;
  }, [jadwal]);

  const jadwalTabel = React.useMemo(() => {
    const daftar = filterHari === 'Semua' ? jadwal : jadwal.filter((j) => j.hari === filterHari);
    return [...daftar].sort((a, b) => {
      const bedaHari = HARI.indexOf(a.hari) - HARI.indexOf(b.hari);
      return bedaHari !== 0 ? bedaHari : urutkanJamMulai(a, b);
    });
  }, [jadwal, filterHari]);

  async function tanganiHapus(j: JadwalPelajaran) {
    const yakin = window.confirm(
      `Hapus jadwal "${j.mataPelajaran}" pada hari ${j.hari}? Tindakan ini tidak bisa dibatalkan.`
    );
    if (!yakin) return;

    const sukses = await hapusJadwal(j.id);
    if (sukses) {
      toast.success(`Jadwal "${j.mataPelajaran}" berhasil dihapus`);
    } else {
      toast.error(useKelasStore.getState().error || 'Gagal menghapus jadwal.');
    }
  }

  async function tanganiDrop(hariTujuan: JadwalPelajaran['hari']) {
    setHariDiseret(null);
    const id = sedangMenyeret;
    setSedangMenyeret(null);
    if (!id) return;

    const item = jadwal.find((j) => j.id === id);
    if (!item || item.hari === hariTujuan) return;

    const sukses = await perbaruiJadwal(id, { hari: hariTujuan });
    if (sukses) {
      toast.success(`"${item.mataPelajaran}" dipindah ke hari ${hariTujuan}`);
    } else {
      toast.error(useKelasStore.getState().error || 'Gagal memindahkan jadwal.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Jadwal</h2>
          <p className="text-muted-foreground">
            Kelola jadwal pelajaran mingguan. Seret kartu jadwal antar kolom untuk pindah hari.
          </p>
        </div>
        <DialogJadwal daftarKelas={kelas} />
      </div>

      {/* ===== Toolbar: filter hari + toggle tampilan ===== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="filterHari" className="text-sm text-muted-foreground shrink-0">
            Filter hari:
          </label>
          <select
            id="filterHari"
            value={filterHari}
            onChange={(e) => setFilterHari(e.target.value as FilterHari)}
            className="flex h-9 w-full sm:w-44 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="Semua">Semua Hari</option>
            {HARI.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 rounded-md border p-1 self-start sm:self-auto">
          <Button
            variant={tampilan === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setTampilan('grid')}
          >
            <LayoutGrid className="h-4 w-4" /> Grid
          </Button>
          <Button
            variant={tampilan === 'tabel' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setTampilan('tabel')}
          >
            <List className="h-4 w-4" /> Tabel
          </Button>
        </div>
      </div>

      {jadwal.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Belum ada jadwal pelajaran. Klik &quot;Tambah Jadwal&quot; untuk membuat jadwal pertama Anda.
          </CardContent>
        </Card>
      ) : tampilan === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {hariDitampilkan.map((h) => {
            const daftarHariIni = jadwalPerHari.get(h) ?? [];
            const sedangDiHover = hariDiseret === h;

            return (
              <Card
                key={h}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (hariDiseret !== h) setHariDiseret(h);
                }}
                onDragLeave={() => setHariDiseret((prev) => (prev === h ? null : prev))}
                onDrop={(e) => {
                  e.preventDefault();
                  tanganiDrop(h);
                }}
                className={cn(
                  'flex flex-col transition-colors',
                  sedangDiHover && 'ring-2 ring-brand border-brand/50 bg-brand/5'
                )}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base">{h}</CardTitle>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary">{daftarHariIni.length}</Badge>
                    <DialogJadwal
                      daftarKelas={kelas}
                      hariDefault={h}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-6 w-6" aria-label={`Tambah jadwal hari ${h}`}>
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-2">
                  {daftarHariIni.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-6 text-center border border-dashed rounded-md">
                      Tidak ada jadwal
                    </p>
                  ) : (
                    daftarHariIni.map((j) => (
                      <div
                        key={j.id}
                        draggable
                        onDragStart={(e) => {
                          setSedangMenyeret(j.id);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragEnd={() => {
                          setSedangMenyeret(null);
                          setHariDiseret(null);
                        }}
                        className={cn(
                          'group rounded-md border bg-background p-3 text-sm space-y-1.5 cursor-grab active:cursor-grabbing transition-opacity',
                          sedangMenyeret === j.id && 'opacity-40'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="font-medium truncate">{j.mataPelajaran}</span>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <DialogJadwal
                              daftarKelas={kelas}
                              jadwal={j}
                              trigger={
                                <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Edit jadwal">
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              }
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              aria-label="Hapus jadwal"
                              onClick={() => tanganiHapus(j)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CalendarClock className="h-3 w-3" /> {j.jamMulai} - {j.jamSelesai}
                        </p>
                        {j.guru && (
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <User className="h-3 w-3" /> {j.guru}
                          </p>
                        )}
                        {j.ruangan && (
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {j.ruangan}
                          </p>
                        )}
                        {namaKelas(j.kelasId) && (
                          <Badge variant="outline" className="text-[10px]">
                            {namaKelas(j.kelasId)}
                          </Badge>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hari</TableHead>
                <TableHead>Jam</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Guru</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Ruangan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jadwalTabel.map((j) => (
                <TableRow key={j.id}>
                  <TableCell>
                    <Badge variant="secondary">{j.hari}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {j.jamMulai} - {j.jamSelesai}
                  </TableCell>
                  <TableCell className="font-medium">{j.mataPelajaran}</TableCell>
                  <TableCell className="text-muted-foreground">{j.guru || '-'}</TableCell>
                  <TableCell className="text-muted-foreground">{namaKelas(j.kelasId) || '-'}</TableCell>
                  <TableCell className="text-muted-foreground">{j.ruangan || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <DialogJadwal
                        daftarKelas={kelas}
                        jadwal={j}
                        trigger={
                          <Button variant="ghost" size="icon" aria-label="Edit jadwal">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Hapus jadwal"
                        onClick={() => tanganiHapus(j)}
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
      )}
    </div>
  );
}
