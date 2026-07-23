'use client';

import * as React from 'react';
import { ListPlus, Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useKelasStore } from '@/lib/store';
import type { Kelas, PrioritasTugas, StatusTugas, Tugas } from '@/lib/types';

export const PILIHAN_PRIORITAS: PrioritasTugas[] = ['Rendah', 'Sedang', 'Tinggi'];
export const PILIHAN_STATUS: StatusTugas[] = ['Belum Dikerjakan', 'Sedang Dikerjakan', 'Selesai'];

const KELAS_INPUT =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

/** Ubah ISO date string (bisa dengan jam) jadi format "yyyy-MM-dd" untuk <input type="date">. */
function keFormatInputTanggal(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const tahun = d.getFullYear();
  const bulan = String(d.getMonth() + 1).padStart(2, '0');
  const tanggal = String(d.getDate()).padStart(2, '0');
  return `${tahun}-${bulan}-${tanggal}`;
}

interface Props {
  /** Daftar kelas untuk pilihan dropdown "Kelas" (opsional, boleh kosong). */
  daftarKelas: Kelas[];
  /** Kalau diisi, dialog berjalan dalam mode edit untuk tugas ini. */
  tugas?: Tugas;
  /** Status yang di-prefill saat menambah tugas baru dari kolom kanban tertentu. */
  statusDefault?: StatusTugas;
  /** Trigger custom (misalnya tombol ikon pensil). Kalau tidak diisi, pakai tombol default. */
  trigger?: React.ReactNode;
}

export function DialogTugas({ daftarKelas, tugas, statusDefault, trigger }: Props) {
  const modeEdit = Boolean(tugas);
  const tambahTugas = useKelasStore((s) => s.tambahTugas);
  const perbaruiTugas = useKelasStore((s) => s.perbaruiTugas);

  const [terbuka, setTerbuka] = React.useState(false);
  const [memuat, setMemuat] = React.useState(false);

  async function tanganiSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMemuat(true);

    const form = new FormData(e.currentTarget);
    const judul = String(form.get('judul') || '');
    const kelasId = String(form.get('kelasId') || '');

    const payload = {
      judul,
      mataPelajaran: String(form.get('mataPelajaran') || ''),
      deadline: new Date(String(form.get('deadline'))).toISOString(),
      prioritas: (String(form.get('prioritas')) || 'Sedang') as PrioritasTugas,
      status: (String(form.get('status')) || 'Belum Dikerjakan') as StatusTugas,
      deskripsi: String(form.get('deskripsi') || ''),
      kelasId: kelasId || undefined,
    };

    const sukses = modeEdit
      ? await perbaruiTugas(tugas!.id, payload)
      : await tambahTugas(payload);

    setMemuat(false);

    if (!sukses) {
      toast.error(useKelasStore.getState().error || 'Gagal menyimpan tugas.');
      return;
    }

    toast.success(`Tugas "${judul}" berhasil ${modeEdit ? 'diperbarui' : 'ditambahkan'}`);
    setTerbuka(false);
  }

  return (
    <Dialog open={terbuka} onOpenChange={setTerbuka}>
      <DialogTrigger asChild>
        {trigger ?? (modeEdit ? (
          <Button variant="ghost" size="icon" aria-label="Edit tugas">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <ListPlus className="h-4 w-4" /> Tambah Tugas
          </Button>
        ))}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={tanganiSubmit}>
          <DialogHeader>
            <DialogTitle>{modeEdit ? 'Edit Tugas' : 'Tambah Tugas Baru'}</DialogTitle>
            <DialogDescription>
              {modeEdit
                ? 'Perbarui detail tugas ini.'
                : 'Catat tugas atau pekerjaan yang harus diselesaikan.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 max-h-[65vh] overflow-y-auto scrollbar-tipis pr-1">
            <div className="grid gap-1.5">
              <Label htmlFor="judul">Judul Tugas</Label>
              <Input
                id="judul"
                name="judul"
                defaultValue={tugas?.judul}
                placeholder="Contoh: Koreksi Ulangan Harian"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="mataPelajaran">Mata Pelajaran</Label>
                <Input
                  id="mataPelajaran"
                  name="mataPelajaran"
                  defaultValue={tugas?.mataPelajaran}
                  placeholder="Contoh: Matematika"
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  defaultValue={keFormatInputTanggal(tugas?.deadline)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="prioritas">Prioritas</Label>
                <select
                  id="prioritas"
                  name="prioritas"
                  defaultValue={tugas?.prioritas ?? 'Sedang'}
                  className={KELAS_INPUT}
                >
                  {PILIHAN_PRIORITAS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={tugas?.status ?? statusDefault ?? 'Belum Dikerjakan'}
                  className={KELAS_INPUT}
                >
                  {PILIHAN_STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="kelasId">Kelas (opsional)</Label>
              <select id="kelasId" name="kelasId" defaultValue={tugas?.kelasId ?? ''} className={KELAS_INPUT}>
                <option value="">- Tidak terikat kelas tertentu -</option>
                {daftarKelas.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="deskripsi">Deskripsi (opsional)</Label>
              <Textarea
                id="deskripsi"
                name="deskripsi"
                defaultValue={tugas?.deskripsi}
                placeholder="Catatan tambahan tentang tugas ini"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={memuat}>
              {memuat && <Loader2 className="h-4 w-4 animate-spin" />}
              {modeEdit ? 'Simpan Perubahan' : 'Simpan Tugas'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
