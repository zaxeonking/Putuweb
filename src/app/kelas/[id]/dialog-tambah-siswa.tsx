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

export function DialogTambahSiswa({ kelasId }: { kelasId: string }) {
  const router = useRouter();
  const [terbuka, setTerbuka] = React.useState(false);
  const [memuat, setMemuat] = React.useState(false);

  async function tanganiSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMemuat(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      nama: form.get('nama'),
      nis: form.get('nis'),
      jenisKelamin: form.get('jenisKelamin'),
      email: form.get('email'),
      nomorHp: form.get('nomorHp'),
      kelasId,
    };

    try {
      const res = await fetch('/api/siswa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!json.sukses) throw new Error(json.pesan || 'Gagal menambahkan siswa.');

      toast.success(`Siswa "${payload.nama}" berhasil ditambahkan`);
      setTerbuka(false);
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setMemuat(false);
    }
  }

  return (
    <Dialog open={terbuka} onOpenChange={setTerbuka}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Tambah Siswa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={tanganiSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Siswa Baru</DialogTitle>
            <DialogDescription>Data siswa akan ditambahkan ke kelas ini.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input id="nama" name="nama" placeholder="Contoh: Budi Santoso" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="nis">NIS</Label>
                <Input id="nis" name="nis" placeholder="Nomor Induk Siswa" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
                <select
                  id="jenisKelamin"
                  name="jenisKelamin"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  defaultValue="L"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="email">Email (opsional)</Label>
              <Input id="email" name="email" type="email" placeholder="nama@email.com" />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="nomorHp">Nomor HP (opsional)</Label>
              <Input id="nomorHp" name="nomorHp" placeholder="08xxxxxxxxxx" />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={memuat}>
              {memuat && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan Siswa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
