'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  LayoutGrid,
  List,
  Search,
  Pencil,
  Trash2,
  GripVertical,
  ArrowDownAZ,
  ArrowUpAZ,
  CheckCheck,
  X,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { labelSisaHari } from '@/lib/tugas-helpers';
import type { DatabaseKelas, PrioritasTugas, StatusTugas, Tugas } from '@/lib/types';
import { DialogTugas, PILIHAN_PRIORITAS, PILIHAN_STATUS } from './dialog-tugas';

interface Props {
  initialDatabase: DatabaseKelas;
}

type TampilanTugas = 'kanban' | 'tabel';
type FilterStatus = 'Semua' | StatusTugas;
type FilterPrioritas = 'Semua' | PrioritasTugas;
type UrutanDeadline = 'terdekat' | 'terjauh';

const KOLOM_STATUS: StatusTugas[] = ['Belum Dikerjakan', 'Sedang Dikerjakan', 'Selesai'];

const SELECT_CLASS =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

function warnaPrioritas(prioritas: Tugas['prioritas']): 'destructive' | 'peringatan' | 'secondary' {
  if (prioritas === 'Tinggi') return 'destructive';
  if (prioritas === 'Sedang') return 'peringatan';
  return 'secondary';
}

function warnaStatus(status: Tugas['status']): 'sukses' | 'peringatan' | 'outline' {
  if (status === 'Selesai') return 'sukses';
  if (status === 'Sedang Dikerjakan') return 'peringatan';
  return 'outline';
}

export function TugasClient({ initialDatabase }: Props) {
  const database = useKelasStore((s) => s.database);
  const sudahDiisi = useKelasStore((s) => s.sudahDiisi);
  const hydrateDenganData = useKelasStore((s) => s.hydrateDenganData);
  const ubahStatusTugas = useKelasStore((s) => s.ubahStatusTugas);
  const hapusTugas = useKelasStore((s) => s.hapusTugas);

  React.useEffect(() => {
    if (!sudahDiisi) {
      hydrateDenganData(initialDatabase);
    }
  }, [sudahDiisi, initialDatabase, hydrateDenganData]);

  const db = sudahDiisi ? database : initialDatabase;
  const { tugas, kelas } = db;

  // ===== State tampilan & filter =====
  const [tampilan, setTampilan] = React.useState<TampilanTugas>('kanban');
  const [pencarian, setPencarian] = React.useState('');
  const [filterMapel, setFilterMapel] = React.useState('Semua');
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>('Semua');
  const [filterPrioritas, setFilterPrioritas] = React.useState<FilterPrioritas>('Semua');
  const [urutan, setUrutan] = React.useState<UrutanDeadline>('terdekat');

  // ===== State drag & drop (kanban) =====
  const [statusDiseret, setStatusDiseret] = React.useState<StatusTugas | null>(null);
  const [sedangMenyeret, setSedangMenyeret] = React.useState<string | null>(null);

  // ===== State seleksi batch (tabel) =====
  const [terpilih, setTerpilih] = React.useState<Set<string>>(new Set());
  const [sedangMemproses, setSedangMemproses] = React.useState(false);

  const namaKelas = React.useCallback(
    (kelasId?: string) => kelas.find((k) => k.id === kelasId)?.nama,
    [kelas]
  );

  const daftarMapel = React.useMemo(
    () => Array.from(new Set(tugas.map((t) => t.mataPelajaran))).sort((a, b) => a.localeCompare(b)),
    [tugas]
  );

  // Filter yang berlaku untuk kedua tampilan: pencarian, mapel, prioritas.
  // Filter status hanya dipakai di tampilan tabel (di kanban, status sudah dipisah per kolom).
  const tugasTersaring = React.useMemo(() => {
    const kataKunci = pencarian.trim().toLowerCase();
    return tugas.filter((t) => {
      if (kataKunci && !t.judul.toLowerCase().includes(kataKunci)) return false;
      if (filterMapel !== 'Semua' && t.mataPelajaran !== filterMapel) return false;
      if (filterPrioritas !== 'Semua' && t.prioritas !== filterPrioritas) return false;
      if (tampilan === 'tabel' && filterStatus !== 'Semua' && t.status !== filterStatus) return false;
      return true;
    });
  }, [tugas, pencarian, filterMapel, filterPrioritas, filterStatus, tampilan]);

  const urutkanDeadline = React.useCallback(
    (a: Tugas, b: Tugas) => {
      const beda = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      return urutan === 'terdekat' ? beda : -beda;
    },
    [urutan]
  );

  const tugasTabel = React.useMemo(
    () => [...tugasTersaring].sort(urutkanDeadline),
    [tugasTersaring, urutkanDeadline]
  );

  const tugasPerStatus = React.useMemo(() => {
    const peta = new Map<StatusTugas, Tugas[]>();
    for (const s of KOLOM_STATUS) {
      peta.set(
        s,
        tugasTersaring.filter((t) => t.status === s).sort(urutkanDeadline)
      );
    }
    return peta;
  }, [tugasTersaring, urutkanDeadline]);

  // ===== Handler CRUD & aksi =====

  async function tanganiHapus(t: Tugas) {
    const yakin = window.confirm(
      `Hapus tugas "${t.judul}"? Tindakan ini tidak bisa dibatalkan.`
    );
    if (!yakin) return;

    const sukses = await hapusTugas(t.id);
    if (sukses) {
      toast.success(`Tugas "${t.judul}" berhasil dihapus`);
      setTerpilih((prev) => {
        const salinan = new Set(prev);
        salinan.delete(t.id);
        return salinan;
      });
    } else {
      toast.error(useKelasStore.getState().error || 'Gagal menghapus tugas.');
    }
  }

  async function tanganiDrop(statusTujuan: StatusTugas) {
    setStatusDiseret(null);
    const id = sedangMenyeret;
    setSedangMenyeret(null);
    if (!id) return;

    const item = tugas.find((t) => t.id === id);
    if (!item || item.status === statusTujuan) return;

    const sukses = await ubahStatusTugas(id, statusTujuan);
    if (sukses) {
      toast.success(`"${item.judul}" dipindah ke ${statusTujuan}`);
    } else {
      toast.error(useKelasStore.getState().error || 'Gagal memindahkan status tugas.');
    }
  }

  function toggleSemuaTerpilih() {
    setTerpilih((prev) => {
      if (prev.size === tugasTabel.length) return new Set();
      return new Set(tugasTabel.map((t) => t.id));
    });
  }

  function toggleSatuTerpilih(id: string) {
    setTerpilih((prev) => {
      const salinan = new Set(prev);
      if (salinan.has(id)) salinan.delete(id);
      else salinan.add(id);
      return salinan;
    });
  }

  async function tanganiBatchSelesai() {
    if (terpilih.size === 0) return;
    setSedangMemproses(true);

    const idTerpilih = Array.from(terpilih);
    const hasil = await Promise.all(idTerpilih.map((id) => ubahStatusTugas(id, 'Selesai')));
    const jumlahBerhasil = hasil.filter(Boolean).length;

    setSedangMemproses(false);
    setTerpilih(new Set());

    if (jumlahBerhasil > 0) {
      toast.success(`${jumlahBerhasil} tugas ditandai selesai`);
    }
    if (jumlahBerhasil < idTerpilih.length) {
      toast.error(`${idTerpilih.length - jumlahBerhasil} tugas gagal diperbarui.`);
    }
  }

  async function tanganiBatchHapus() {
    if (terpilih.size === 0) return;
    const yakin = window.confirm(`Hapus ${terpilih.size} tugas terpilih? Tindakan ini tidak bisa dibatalkan.`);
    if (!yakin) return;

    setSedangMemproses(true);
    const idTerpilih = Array.from(terpilih);
    const hasil = await Promise.all(idTerpilih.map((id) => hapusTugas(id)));
    const jumlahBerhasil = hasil.filter(Boolean).length;

    setSedangMemproses(false);
    setTerpilih(new Set());

    if (jumlahBerhasil > 0) {
      toast.success(`${jumlahBerhasil} tugas berhasil dihapus`);
    }
    if (jumlahBerhasil < idTerpilih.length) {
      toast.error(`${idTerpilih.length - jumlahBerhasil} tugas gagal dihapus.`);
    }
  }

  const adaFilterAktif =
    pencarian.trim() !== '' || filterMapel !== 'Semua' || filterStatus !== 'Semua' || filterPrioritas !== 'Semua';

  function resetFilter() {
    setPencarian('');
    setFilterMapel('Semua');
    setFilterStatus('Semua');
    setFilterPrioritas('Semua');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Tugas</h2>
          <p className="text-muted-foreground">
            Kelola seluruh tugas: tambah, edit, hapus, dan pantau progresnya dalam satu tempat.
          </p>
        </div>
        <DialogTugas daftarKelas={kelas} />
      </div>

      {/* ===== Toolbar: search, filter, sort, toggle tampilan ===== */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari judul tugas..."
                value={pencarian}
                onChange={(e) => setPencarian(e.target.value)}
                className="pl-8"
              />
            </div>

            <select
              value={filterMapel}
              onChange={(e) => setFilterMapel(e.target.value)}
              className={cn(SELECT_CLASS, 'lg:w-48')}
              aria-label="Filter mata pelajaran"
            >
              <option value="Semua">Semua Mapel</option>
              {daftarMapel.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {tampilan === 'tabel' && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className={cn(SELECT_CLASS, 'lg:w-44')}
                aria-label="Filter status"
              >
                <option value="Semua">Semua Status</option>
                {PILIHAN_STATUS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}

            <select
              value={filterPrioritas}
              onChange={(e) => setFilterPrioritas(e.target.value as FilterPrioritas)}
              className={cn(SELECT_CLASS, 'lg:w-40')}
              aria-label="Filter prioritas"
            >
              <option value="Semua">Semua Prioritas</option>
              {PILIHAN_PRIORITAS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setUrutan((u) => (u === 'terdekat' ? 'terjauh' : 'terdekat'))}
              className="shrink-0"
            >
              {urutan === 'terdekat' ? (
                <ArrowDownAZ className="h-4 w-4" />
              ) : (
                <ArrowUpAZ className="h-4 w-4" />
              )}
              Deadline {urutan === 'terdekat' ? 'Terdekat' : 'Terjauh'}
            </Button>

            {adaFilterAktif && (
              <Button variant="ghost" size="sm" onClick={resetFilter} className="shrink-0">
                <X className="h-4 w-4" /> Reset
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Menampilkan {tampilan === 'tabel' ? tugasTabel.length : tugasTersaring.length} dari {tugas.length} tugas
            </p>
            <div className="flex items-center gap-1 rounded-md border p-1">
              <Button
                variant={tampilan === 'kanban' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setTampilan('kanban')}
              >
                <LayoutGrid className="h-4 w-4" /> Kanban
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
        </CardContent>
      </Card>

      {tugas.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Belum ada tugas. Klik &quot;Tambah Tugas&quot; untuk membuat tugas pertama Anda.
          </CardContent>
        </Card>
      ) : tampilan === 'kanban' ? (
        <div className="grid gap-4 md:grid-cols-3">
          {KOLOM_STATUS.map((status) => {
            const daftarStatusIni = tugasPerStatus.get(status) ?? [];
            const sedangDihover = statusDiseret === status;

            return (
              <Card
                key={status}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (statusDiseret !== status) setStatusDiseret(status);
                }}
                onDragLeave={() => setStatusDiseret((prev) => (prev === status ? null : prev))}
                onDrop={(e) => {
                  e.preventDefault();
                  tanganiDrop(status);
                }}
                className={cn(
                  'flex flex-col transition-colors',
                  sedangDihover && 'ring-2 ring-brand border-brand/50 bg-brand/5'
                )}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    {status}
                    <Badge variant="secondary">{daftarStatusIni.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-2 min-h-[120px]">
                  {daftarStatusIni.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-6 text-center border border-dashed rounded-md">
                      Tidak ada tugas
                    </p>
                  ) : (
                    daftarStatusIni.map((t) => {
                      const { teks, mendesak } = labelSisaHari(t.deadline);
                      return (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={(e) => {
                            setSedangMenyeret(t.id);
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragEnd={() => {
                            setSedangMenyeret(null);
                            setStatusDiseret(null);
                          }}
                          className={cn(
                            'group rounded-md border bg-background p-3 text-sm space-y-1.5 cursor-grab active:cursor-grabbing transition-opacity',
                            sedangMenyeret === t.id && 'opacity-40'
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="font-medium truncate">{t.judul}</span>
                            </div>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <DialogTugas
                                daftarKelas={kelas}
                                tugas={t}
                                trigger={
                                  <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Edit tugas">
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>
                                }
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                aria-label="Hapus tugas"
                                onClick={() => tanganiHapus(t)}
                              >
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </div>
                          </div>

                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <BookOpen className="h-3 w-3" /> {t.mataPelajaran}
                          </p>

                          <div className="flex items-center justify-between gap-2">
                            <Badge variant={warnaPrioritas(t.prioritas)} className="text-[10px]">
                              {t.prioritas}
                            </Badge>
                            <span
                              className={cn(
                                'text-xs',
                                mendesak && status !== 'Selesai'
                                  ? 'font-medium text-destructive'
                                  : 'text-muted-foreground'
                              )}
                            >
                              {teks}
                            </span>
                          </div>

                          {namaKelas(t.kelasId) && (
                            <Badge variant="outline" className="text-[10px]">
                              {namaKelas(t.kelasId)}
                            </Badge>
                          )}
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {terpilih.size > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/40 px-3 py-2">
              <span className="text-sm font-medium">{terpilih.size} tugas dipilih</span>
              <div className="flex-1" />
              <Button size="sm" onClick={tanganiBatchSelesai} disabled={sedangMemproses}>
                <CheckCheck className="h-4 w-4" /> Tandai Selesai
              </Button>
              <Button size="sm" variant="outline" onClick={tanganiBatchHapus} disabled={sedangMemproses}>
                <Trash2 className="h-4 w-4" /> Hapus
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setTerpilih(new Set())} disabled={sedangMemproses}>
                <X className="h-4 w-4" /> Batalkan
              </Button>
            </div>
          )}

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={tugasTabel.length > 0 && terpilih.size === tugasTabel.length}
                      onCheckedChange={toggleSemuaTerpilih}
                      aria-label="Pilih semua tugas"
                    />
                  </TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Prioritas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tugasTabel.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                      Tidak ada tugas yang cocok dengan filter saat ini.
                    </TableCell>
                  </TableRow>
                ) : (
                  tugasTabel.map((t) => {
                    const { teks, mendesak } = labelSisaHari(t.deadline);
                    return (
                      <TableRow key={t.id} className={cn(terpilih.has(t.id) && 'bg-muted/40')}>
                        <TableCell>
                          <Checkbox
                            checked={terpilih.has(t.id)}
                            onCheckedChange={() => toggleSatuTerpilih(t.id)}
                            aria-label={`Pilih tugas ${t.judul}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium max-w-[220px] truncate">{t.judul}</TableCell>
                        <TableCell className="text-muted-foreground">{t.mataPelajaran}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className={mendesak && t.status !== 'Selesai' ? 'font-medium text-destructive' : ''}>
                            {teks}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={warnaPrioritas(t.prioritas)}>{t.prioritas}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={warnaStatus(t.status)}>{t.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <DialogTugas
                              daftarKelas={kelas}
                              tugas={t}
                              trigger={
                                <Button variant="ghost" size="icon" aria-label="Edit tugas">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Hapus tugas"
                              onClick={() => tanganiHapus(t)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}
