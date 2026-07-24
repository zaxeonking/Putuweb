'use client';

import * as React from 'react';
import { CalendarPlus, Pencil, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import type { JadwalPelajaran, Kelas } from '@/lib/types';

export const HARI: JadwalPelajaran['hari'][] = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  "Jum'at",
  'Sabtu',
  'Minggu',
];

const KELAS_INPUT = 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

interface Props {
  /** Daftar kelas untuk pilihan dropdown "Kelas" (opsional, boleh kosong). */
  daftarKelas: Kelas[];
  /** Kalau diisi, dialog akan berjalan dalam mode edit untuk jadwal ini. */
  jadwal?: JadwalPelajaran;
  /** Hari yang di-prefill saat menambah jadwal baru dari kolom hari tertentu. */
  hariDefault?: JadwalPelajaran['hari'];
  /** Trigger custom (misalnya tombol ikon pensil). Kalau tidak diisi, pakai tombol default. */
  trigger?: React.ReactNode;
}

export function DialogJadwal({ daftarKelas, jadwal, hariDefault, trigger }: Props) {
  const modeEdit = Boolean(jadwal);
  const tambahJadwal = useKelasStore((s) => s.tambahJadwal);
  const perbaruiJadwal = useKelasStore((s) => s.perbaruiJadwal);

  const [terbuka, setTerbuka] = React.useState(false);
  const [memuat, setMemuat] = React.useState(false);

  async function tanganiSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const mataPelajaran = String(form.get('mataPelajaran') || '');
    const jamMulai = String(form.get('jamMulai') || '');
    const jamSelesai = String(form.get('jamSelesai') || '');

    if (jamSelesai <= jamMulai) {
      toast.error('Jam selesai harus setelah jam mulai.');
      return;
    }

    setMemuat(true);

    const kelasId = String(form.get('kelasId') || '');
    const payload = {
      mataPelajaran,
      guru: String(form.get('guru') || ''),
      hari: String(form.get('hari')) as JadwalPelajaran['hari'],
      jamMulai,
      jamSelesai,
      ruangan: String(form.get('ruangan') || ''),
      kelasId: kelasId || undefined,
      catatan: String(form.get('catatan') || ''),
    };

    const sukses = modeEdit
      ? await perbaruiJadwal(jadwal!.id, payload)
      : await tambahJadwal(payload);

    setMemuat(false);

    if (!sukses) {
      toast.error(useKelasStore.getState().error || 'Gagal menyimpan jadwal.');
      return;
    }

    toast.success(`Jadwal "${mataPelajaran}" berhasil ${modeEdit ? 'diperbarui' : 'ditambahkan'}`);
    setTerbuka(false);
  }

  return (
    <Dialog open={terbuka} onOpenChange={setTerbuka}>
      <DialogTrigger asChild>
        {trigger ?? (modeEdit ? (
          <Button variant="ghost" size="icon" aria-label="Edit jadwal">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline">
            <CalendarPlus className="h-4 w-4" /> Tambah Jadwal
          </Button>
        ))}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={tanganiSubmit}>
          <DialogHeader>
            <DialogTitle>{modeEdit ? 'Edit Jadwal Pelajaran' : 'Tambah Jadwal Pelajaran'}</DialogTitle>
            <DialogDescription>
              {modeEdit ? 'Perbarui detail jadwal mengajar ini.' : 'Atur jadwal mengajar mingguan Anda.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 max-h-[65vh] overflow-y-auto scrollbar-tipis pr-1">
            <div className="grid gap-1.5">
              <Label htmlFor="mataPelajaran">Mata Pelajaran</Label>
              <Input
                id="mataPelajaran"
                name="mataPelajaran"
                defaultValue={jadwal?.mataPelajaran}
                placeholder="Contoh: Fisika"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="guru">Guru Pengampu</Label>
              <Input
                id="guru"
                name="guru"
                defaultValue={jadwal?.guru}
                placeholder="Contoh: Ibu Sri Wahyuni, S.Pd."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="hari">Hari</Label>
                <select
                  id="hari"
                  name="hari"
                  defaultValue={jadwal?.hari ?? hariDefault ?? 'Senin'}
                  className={KELAS_INPUT}
                >
                  {HARI.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="ruangan">Ruangan</Label>
                <Input id="ruangan" name="ruangan" defaultValue={jadwal?.ruangan} placeholder="Contoh: Lab IPA" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="jamMulai">Jam Mulai</Label>
                <Input id="jamMulai" name="jamMulai" type="time" defaultValue={jadwal?.jamMulai} required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="jamSelesai">Jam Selesai</Label>
                <Input id="jamSelesai" name="jamSelesai" type="time" defaultValue={jadwal?.jamSelesai} required />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="kelasId">Kelas (opsional)</Label>
              <select id="kelasId" name="kelasId" defaultValue={jadwal?.kelasId ?? ''} className={KELAS_INPUT}>
                <option value="">- Tidak terikat kelas tertentu -</option>
                {daftarKelas.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="catatan">Catatan (opsional)</Label>
              <Input id="catatan" name="catatan" defaultValue={jadwal?.catatan} placeholder="Catatan tambahan" />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={memuat}>
              {memuat && <Loader2 className="h-4 w-4 animate-spin" />}
              {modeEdit ? 'Simpan Perubahan' : 'Simpan Jadwal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
