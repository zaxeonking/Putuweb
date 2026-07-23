'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { CalendarPlus, Loader2 } from 'lucide-react';
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
import { tambahJadwalAction } from './actions';
import type { JadwalPelajaran } from '@/lib/types';

const HARI: JadwalPelajaran['hari'][] = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu', 'Minggu'];

export function DialogTambahJadwal() {
  const router = useRouter();
  const [terbuka, setTerbuka] = React.useState(false);
  const [memuat, setMemuat] = React.useState(false);

  async function tanganiSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMemuat(true);

    const form = new FormData(e.currentTarget);

    const hasil = await tambahJadwalAction({
      mataPelajaran: String(form.get('mataPelajaran') || ''),
      guru: String(form.get('guru') || ''),
      hari: String(form.get('hari')) as JadwalPelajaran['hari'],
      jamMulai: String(form.get('jamMulai') || ''),
      jamSelesai: String(form.get('jamSelesai') || ''),
      ruangan: String(form.get('ruangan') || ''),
    });

    setMemuat(false);

    if (!hasil.sukses) {
      toast.error(hasil.pesan || 'Gagal menambahkan jadwal.');
      return;
    }

    toast.success(`Jadwal "${hasil.data?.mataPelajaran}" berhasil ditambahkan`);
    setTerbuka(false);
    router.refresh();
  }

  return (
    <Dialog open={terbuka} onOpenChange={setTerbuka}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarPlus className="h-4 w-4" /> Tambah Jadwal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={tanganiSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Jadwal Pelajaran</DialogTitle>
            <DialogDescription>Atur jadwal mengajar mingguan Anda.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="mataPelajaran">Mata Pelajaran</Label>
              <Input id="mataPelajaran" name="mataPelajaran" placeholder="Contoh: Fisika" required />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="guru">Guru Pengampu (opsional)</Label>
              <Input id="guru" name="guru" placeholder="Contoh: Ibu Sri Wahyuni, S.Pd." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="hari">Hari</Label>
                <select
                  id="hari"
                  name="hari"
                  defaultValue="Senin"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {HARI.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="ruangan">Ruangan (opsional)</Label>
                <Input id="ruangan" name="ruangan" placeholder="Contoh: Lab IPA" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="jamMulai">Jam Mulai</Label>
                <Input id="jamMulai" name="jamMulai" type="time" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="jamSelesai">Jam Selesai</Label>
                <Input id="jamSelesai" name="jamSelesai" type="time" required />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={memuat}>
              {memuat && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan Jadwal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
