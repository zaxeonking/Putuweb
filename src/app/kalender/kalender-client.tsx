'use client';

import * as React from 'react';
import { toast } from 'sonner';
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  MapPin,
  User,
  ListTodo,
  Trash2,
  CheckCircle2,
  Plus,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useKelasStore } from '@/lib/store';
import type { DatabaseKelas, JadwalPelajaran, PrioritasTugas, Tugas } from '@/lib/types';

interface Props {
  initialDatabase: DatabaseKelas;
}

const HARI_BY_JSDAY: JadwalPelajaran['hari'][] = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  "Jum'at",
  'Sabtu',
];

const WARNA_PRIORITAS: Record<PrioritasTugas, string> = {
  Tinggi: 'bg-red-500',
  Sedang: 'bg-amber-500',
  Rendah: 'bg-slate-400',
};

const BADGE_PRIORITAS: Record<PrioritasTugas, 'destructive' | 'peringatan' | 'secondary'> = {
  Tinggi: 'destructive',
  Sedang: 'peringatan',
  Rendah: 'secondary',
};

const SELECT_CLASS =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

function tanggalKeInputValue(d: Date): string {
  const tahun = d.getFullYear();
  const bulan = String(d.getMonth() + 1).padStart(2, '0');
  const tanggal = String(d.getDate()).padStart(2, '0');
  return `${tahun}-${bulan}-${tanggal}`;
}

export function KalenderClient({ initialDatabase }: Props) {
  const database = useKelasStore((s) => s.database);
  const sudahDiisi = useKelasStore((s) => s.sudahDiisi);
  const hydrateDenganData = useKelasStore((s) => s.hydrateDenganData);
  const tambahTugas = useKelasStore((s) => s.tambahTugas);
  const ubahStatusTugas = useKelasStore((s) => s.ubahStatusTugas);
  const hapusTugas = useKelasStore((s) => s.hapusTugas);

  React.useEffect(() => {
    if (!sudahDiisi) {
      hydrateDenganData(initialDatabase);
    }
  }, [sudahDiisi, initialDatabase, hydrateDenganData]);

  const db = sudahDiisi ? database : initialDatabase;
  const { jadwal, tugas, kelas } = db;

  const [bulanAktif, setBulanAktif] = React.useState(() => startOfMonth(new Date()));
  const [tanggalDipilih, setTanggalDipilih] = React.useState<Date | null>(null);
  const [formTambahTerbuka, setFormTambahTerbuka] = React.useState(false);
  const [memuatTambah, setMemuatTambah] = React.useState(false);

  const namaKelas = React.useCallback(
    (kelasId?: string) => kelas.find((k) => k.id === kelasId)?.nama,
    [kelas]
  );

  const jadwalUntukTanggal = React.useCallback(
    (tgl: Date) => {
      const hari = HARI_BY_JSDAY[tgl.getDay()];
      return jadwal.filter((j) => j.hari === hari).sort((a, b) => a.jamMulai.localeCompare(b.jamMulai));
    },
    [jadwal]
  );

  const tugasUntukTanggal = React.useCallback(
    (tgl: Date) => tugas.filter((t) => isSameDay(parseISO(t.deadline), tgl)),
    [tugas]
  );

  const hariDalamGrid = React.useMemo(() => {
    const awal = startOfWeek(startOfMonth(bulanAktif), { weekStartsOn: 1 });
    const akhir = endOfWeek(endOfMonth(bulanAktif), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: awal, end: akhir });
  }, [bulanAktif]);

  const jadwalDipilih = tanggalDipilih ? jadwalUntukTanggal(tanggalDipilih) : [];
  const tugasDipilih = tanggalDipilih ? tugasUntukTanggal(tanggalDipilih) : [];

  async function tanganiSubmitTugasBaru(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!tanggalDipilih) return;
    setMemuatTambah(true);

    const form = new FormData(e.currentTarget);
    const judul = String(form.get('judul') || '');

    const sukses = await tambahTugas({
      judul,
      mataPelajaran: String(form.get('mataPelajaran') || ''),
      deadline: tanggalDipilih.toISOString(),
      prioritas: (String(form.get('prioritas')) || 'Sedang') as PrioritasTugas,
      status: 'Belum Dikerjakan',
      deskripsi: String(form.get('deskripsi') || ''),
    });

    setMemuatTambah(false);

    if (!sukses) {
      toast.error(useKelasStore.getState().error || 'Gagal menambahkan tugas.');
      return;
    }

    toast.success(`Tugas "${judul}" berhasil ditambahkan`);
    setFormTambahTerbuka(false);
    (e.target as HTMLFormElement).reset();
  }

  async function tanganiHapusTugas(t: Tugas) {
    const yakin = window.confirm(`Hapus tugas "${t.judul}"? Tindakan ini tidak bisa dibatalkan.`);
    if (!yakin) return;

    const sukses = await hapusTugas(t.id);
    if (sukses) {
      toast.success(`Tugas "${t.judul}" berhasil dihapus`);
    } else {
      toast.error(useKelasStore.getState().error || 'Gagal menghapus tugas.');
    }
  }

  async function tanganiToggleSelesai(t: Tugas) {
    const statusBaru = t.status === 'Selesai' ? 'Belum Dikerjakan' : 'Selesai';
    const sukses = await ubahStatusTugas(t.id, statusBaru);
    if (!sukses) {
      toast.error(useKelasStore.getState().error || 'Gagal mengubah status tugas.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kalender Akademik</h2>
          <p className="text-muted-foreground">
            Lihat jadwal pelajaran & deadline tugas dalam satu tampilan. Klik tanggal untuk detail.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={() => setBulanAktif((b) => subMonths(b, 1))} aria-label="Bulan sebelumnya">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setBulanAktif(startOfMonth(new Date()))}>
            Hari Ini
          </Button>
          <Button variant="outline" size="icon" onClick={() => setBulanAktif((b) => addMonths(b, 1))} aria-label="Bulan berikutnya">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold capitalize">{format(bulanAktif, 'MMMM yyyy', { locale: localeId })}</h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand" /> Jadwal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" /> Deadline tugas
          </span>
        </div>
      </div>

      {/* ===== Grid kalender ===== */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-medium text-muted-foreground">
          {['Sen', 'Sel', 'Rab', 'Kam', "Jum'at", 'Sab', 'Min'].map((h) => (
            <div key={h} className="py-2">
              {h}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {hariDalamGrid.map((tgl) => {
            const jumlahJadwal = jadwalUntukTanggal(tgl).length;
            const daftarTugasTgl = tugasUntukTanggal(tgl);
            const diBulanIni = isSameMonth(tgl, bulanAktif);
            const hariIni = isToday(tgl);

            return (
              <button
                key={tgl.toISOString()}
                type="button"
                onClick={() => setTanggalDipilih(tgl)}
                className={cn(
                  'min-h-[4.5rem] sm:min-h-24 border-b border-r p-1.5 sm:p-2 text-left align-top transition-colors hover:bg-accent focus:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                  !diBulanIni && 'bg-muted/20 text-muted-foreground/50'
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                      hariIni && 'bg-brand text-white'
                    )}
                  >
                    {format(tgl, 'd')}
                  </span>
                </div>

                <div className="mt-1.5 space-y-1">
                  {jumlahJadwal > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-brand">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
                      <span className="hidden sm:inline truncate">{jumlahJadwal} jadwal</span>
                    </div>
                  )}
                  {daftarTugasTgl.slice(0, 2).map((t) => (
                    <div key={t.id} className="flex items-center gap-1 text-[10px] truncate">
                      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', WARNA_PRIORITAS[t.prioritas])} />
                      <span className={cn('truncate', t.status === 'Selesai' && 'line-through opacity-60')}>
                        {t.judul}
                      </span>
                    </div>
                  ))}
                  {daftarTugasTgl.length > 2 && (
                    <div className="text-[10px] text-muted-foreground">+{daftarTugasTgl.length - 2} lagi</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* ===== Dialog detail tanggal ===== */}
      <Dialog
        open={Boolean(tanggalDipilih)}
        onOpenChange={(open) => {
          if (!open) {
            setTanggalDipilih(null);
            setFormTambahTerbuka(false);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          {tanggalDipilih && (
            <>
              <DialogHeader>
                <DialogTitle className="capitalize">
                  {format(tanggalDipilih, 'EEEE, d MMMM yyyy', { locale: localeId })}
                </DialogTitle>
                <DialogDescription>Jadwal pelajaran & deadline tugas pada tanggal ini.</DialogDescription>
              </DialogHeader>

              <div className="max-h-[60vh] overflow-y-auto scrollbar-tipis pr-1 space-y-5">
                {/* --- Jadwal pelajaran --- */}
                <div className="space-y-2">
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold">
                    <CalendarClock className="h-4 w-4 text-brand" /> Jadwal Pelajaran
                  </h4>
                  {jadwalDipilih.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Tidak ada jadwal pelajaran hari ini.</p>
                  ) : (
                    <div className="space-y-2">
                      {jadwalDipilih.map((j) => (
                        <div key={j.id} className="rounded-md border p-3 text-sm space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium">{j.mataPelajaran}</span>
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              {j.jamMulai} - {j.jamSelesai}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                            {j.guru && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" /> {j.guru}
                              </span>
                            )}
                            {j.ruangan && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {j.ruangan}
                              </span>
                            )}
                            {namaKelas(j.kelasId) && <span>Kelas: {namaKelas(j.kelasId)}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* --- Tugas & deadline --- */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="flex items-center gap-1.5 text-sm font-semibold">
                      <ListTodo className="h-4 w-4 text-red-500" /> Tugas & Deadline
                    </h4>
                    <Button variant="ghost" size="sm" onClick={() => setFormTambahTerbuka((v) => !v)}>
                      <Plus className="h-3.5 w-3.5" /> Tugas Baru
                    </Button>
                  </div>

                  {formTambahTerbuka && (
                    <form onSubmit={tanganiSubmitTugasBaru} className="rounded-md border p-3 space-y-3 bg-muted/30">
                      <div className="grid gap-1.5">
                        <Label htmlFor="judul">Judul Tugas</Label>
                        <Input id="judul" name="judul" placeholder="Contoh: Kumpulkan laporan praktikum" required />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                          <Label htmlFor="mataPelajaran">Mata Pelajaran</Label>
                          <Input id="mataPelajaran" name="mataPelajaran" placeholder="Contoh: Biologi" required />
                        </div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="prioritas">Prioritas</Label>
                          <select id="prioritas" name="prioritas" defaultValue="Sedang" className={SELECT_CLASS}>
                            <option value="Rendah">Rendah</option>
                            <option value="Sedang">Sedang</option>
                            <option value="Tinggi">Tinggi</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid gap-1.5">
                        <Label htmlFor="deskripsi">Deskripsi (opsional)</Label>
                        <Input id="deskripsi" name="deskripsi" placeholder="Catatan tambahan" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Deadline otomatis diisi tanggal {format(tanggalDipilih, 'd MMMM yyyy', { locale: localeId })} (
                        {tanggalKeInputValue(tanggalDipilih)}).
                      </p>
                      <Button type="submit" size="sm" disabled={memuatTambah}>
                        {memuatTambah && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Simpan Tugas
                      </Button>
                    </form>
                  )}

                  {tugasDipilih.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Tidak ada deadline tugas pada tanggal ini.</p>
                  ) : (
                    <div className="space-y-2">
                      {tugasDipilih.map((t) => (
                        <div key={t.id} className="rounded-md border p-3 text-sm space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <span className={cn('font-medium', t.status === 'Selesai' && 'line-through opacity-60')}>
                              {t.judul}
                            </span>
                            <Badge variant={BADGE_PRIORITAS[t.prioritas]} className="text-[10px] shrink-0">
                              {t.prioritas}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {t.mataPelajaran}
                            {namaKelas(t.kelasId) ? ` · ${namaKelas(t.kelasId)}` : ''} · {t.status}
                          </p>
                          {t.deskripsi && <p className="text-xs text-muted-foreground">{t.deskripsi}</p>}
                          <div className="flex gap-2 pt-1">
                            <Button variant="outline" size="sm" onClick={() => tanganiToggleSelesai(t)}>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {t.status === 'Selesai' ? 'Batal Selesai' : 'Tandai Selesai'}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => tanganiHapusTugas(t)}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" /> Hapus
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
