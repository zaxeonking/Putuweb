'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
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

/** Dialog form untuk menambahkan kelas baru. Mengirim POST ke /api/kelas */
export function DialogTambahKelas() {
  const router = useRouter();
  const [terbuka, setTerbuka] = React.useState(false);
  const [memuat, setMemuat] = React.useState(false);

  async function tanganiSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMemuat(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      nama: form.get('nama'),
      tingkat: form.get('tingkat'),
      waliKelas: form.get('waliKelas'),
      tahunAjaran: form.get('tahunAjaran'),
      deskripsi: form.get('deskripsi'),
    };

    try {
      const res = await fetch('/api/kelas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!json.sukses) {
        throw new Error(json.pesan || 'Gagal menambahkan kelas.');
      }

      toast.success(`Kelas "${payload.nama}" berhasil ditambahkan`);
      setTerbuka(false);
      router.refresh(); // refresh Server Component supaya daftar kelas ter-update
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setMemuat(false);
    }
  }

  return (
    <Dialog open={terbuka} onOpenChange={setTerbuka}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" /> Tambah Kelas
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={tanganiSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Kelas Baru</DialogTitle>
            <DialogDescription>Isi data kelas di bawah ini, lalu simpan.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="nama">Nama Kelas</Label>
              <Input id="nama" name="nama" placeholder="Contoh: XII IPA 1" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="tingkat">Tingkat</Label>
                <Input id="tingkat" name="tingkat" placeholder="Contoh: XII" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="tahunAjaran">Tahun Ajaran</Label>
                <Input id="tahunAjaran" name="tahunAjaran" placeholder="2026/2027" defaultValue="2026/2027" />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="waliKelas">Wali Kelas</Label>
              <Input id="waliKelas" name="waliKelas" placeholder="Nama guru wali kelas" required />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="deskripsi">Deskripsi (opsional)</Label>
              <Input id="deskripsi" name="deskripsi" placeholder="Catatan tambahan tentang kelas" />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={memuat}>
              {memuat && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan Kelas
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
