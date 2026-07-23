'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ListTodo, Loader2 } from 'lucide-react';
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
import { tambahTugasAction } from './actions';
import type { PrioritasTugas } from '@/lib/types';

const PILIHAN_PRIORITAS: PrioritasTugas[] = ['Rendah', 'Sedang', 'Tinggi'];

export function DialogTambahTugas() {
  const router = useRouter();
  const [terbuka, setTerbuka] = React.useState(false);
  const [memuat, setMemuat] = React.useState(false);

  async function tanganiSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMemuat(true);

    const form = new FormData(e.currentTarget);

    const hasil = await tambahTugasAction({
      judul: String(form.get('judul') || ''),
      mataPelajaran: String(form.get('mataPelajaran') || ''),
      deadline: new Date(String(form.get('deadline'))).toISOString(),
      prioritas: (String(form.get('prioritas')) || 'Sedang') as PrioritasTugas,
      status: 'Belum Dikerjakan',
      deskripsi: String(form.get('deskripsi') || ''),
    });

    setMemuat(false);

    if (!hasil.sukses) {
      toast.error(hasil.pesan || 'Gagal menambahkan tugas.');
      return;
    }

    toast.success(`Tugas "${hasil.data?.judul}" berhasil ditambahkan`);
    setTerbuka(false);
    router.refresh();
  }

  return (
    <Dialog open={terbuka} onOpenChange={setTerbuka}>
      <DialogTrigger asChild>
        <Button>
          <ListTodo className="h-4 w-4" /> Tambah Tugas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={tanganiSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Tugas Baru</DialogTitle>
            <DialogDescription>Catat tugas atau pekerjaan yang harus diselesaikan.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="judul">Judul Tugas</Label>
              <Input id="judul" name="judul" placeholder="Contoh: Koreksi Ulangan Harian" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="mataPelajaran">Mata Pelajaran</Label>
                <Input id="mataPelajaran" name="mataPelajaran" placeholder="Contoh: Matematika" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" name="deadline" type="date" required />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="prioritas">Prioritas</Label>
              <select
                id="prioritas"
                name="prioritas"
                defaultValue="Sedang"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {PILIHAN_PRIORITAS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="deskripsi">Deskripsi (opsional)</Label>
              <Input id="deskripsi" name="deskripsi" placeholder="Catatan tambahan tentang tugas ini" />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={memuat}>
              {memuat && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan Tugas
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
