'use client';

import * as React from 'react';
import { PlusCircle, Pencil, Loader2 } from 'lucide-react';
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
import { PilihMapel } from '@/components/pilih-mapel';
import { useKelasStore } from '@/lib/store';
import type { Nilai } from '@/lib/types';

interface Props {
  daftarMapel: string[];
  nilai?: Nilai;
  mapelDefault?: string;
  trigger?: React.ReactNode;
}

function tanggalHariIni(): string {
  return new Date().toISOString().slice(0, 10);
}

export function DialogNilai({ daftarMapel, nilai, mapelDefault, trigger }: Props) {
  const modeEdit = Boolean(nilai);
  const tambahNilai = useKelasStore((s) => s.tambahNilai);
  const perbaruiNilai = useKelasStore((s) => s.perbaruiNilai);

  const [terbuka, setTerbuka] = React.useState(false);
  const [memuat, setMemuat] = React.useState(false);

  async function tanganiSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const mataPelajaran = String(form.get('mataPelajaran') || '').trim();
    const namaTugas = String(form.get('namaTugas') || '').trim();
    const nilaiDidapat = Number(form.get('nilai'));
    const nilaiMaksimal = Number(form.get('nilaiMaksimal'));
    const tanggal = String(form.get('tanggal') || '');

    if (!mataPelajaran || !namaTugas) {
      toast.error('Mata pelajaran dan nama tugas wajib diisi.');
      return;
    }
    if (Number.isNaN(nilaiDidapat) || Number.isNaN(nilaiMaksimal) || nilaiMaksimal <= 0) {
      toast.error('Nilai dan nilai maksimal harus berupa angka yang valid.');
      return;
    }
    if (nilaiDidapat > nilaiMaksimal) {
      toast.error('Nilai yang didapat tidak boleh lebih besar dari nilai maksimal.');
      return;
    }

    setMemuat(true);

    const payload = {
      mataPelajaran,
      namaTugas,
      nilai: nilaiDidapat,
      nilaiMaksimal,
      tanggal: tanggal || tanggalHariIni(),
    };

    const sukses = modeEdit
      ? await perbaruiNilai(nilai!.id, payload)
      : await tambahNilai(payload);

    setMemuat(false);

    if (!sukses) {
      toast.error(useKelasStore.getState().error || 'Gagal menyimpan nilai.');
      return;
    }

    toast.success(`Nilai "${namaTugas}" berhasil ${modeEdit ? 'diperbarui' : 'ditambahkan'}`);
    setTerbuka(false);
  }

  return (
    <Dialog open={terbuka} onOpenChange={setTerbuka}>
      <DialogTrigger asChild>
        {trigger ?? (modeEdit ? (
          <Button variant="ghost" size="icon" aria-label="Edit nilai">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <PlusCircle className="h-4 w-4" /> Tambah Nilai
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={tanganiSubmit}>
          <DialogHeader>
            <DialogTitle>{modeEdit ? 'Edit Nilai' : 'Tambah Nilai'}</DialogTitle>
            <DialogDescription>
              {modeEdit ? 'Perbarui data nilai ini.' : 'Catat nilai tugas, kuis, atau ujian Anda.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="mataPelajaran">Mata Pelajaran</Label>
              <PilihMapel
                id="mataPelajaran"
                name="mataPelajaran"
                daftarMapel={daftarMapel}
                defaultValue={nilai?.mataPelajaran ?? mapelDefault}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="namaTugas">Nama Tugas / Ujian</Label>
              <Input
                id="namaTugas"
                name="namaTugas"
                defaultValue={nilai?.namaTugas}
                placeholder="Contoh: Ulangan Harian Bab 3"
                required
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="nilai">Nilai Didapat</Label>
                <Input
                  id="nilai"
                  name="nilai"
                  type="number"
                  step="0.1"
                  min={0}
                  defaultValue={nilai?.nilai}
                  placeholder="Contoh: 85"
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="nilaiMaksimal">Nilai Maksimal</Label>
                <Input
                  id="nilaiMaksimal"
                  name="nilaiMaksimal"
                  type="number"
                  step="0.1"
                  min={1}
                  defaultValue={nilai?.nilaiMaksimal ?? 100}
                  placeholder="Contoh: 100"
                  required
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="tanggal">Tanggal</Label>
              <Input
                id="tanggal"
                name="tanggal"
                type="date"
                defaultValue={nilai?.tanggal?.slice(0, 10) ?? tanggalHariIni()}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={memuat}>
              {memuat && <Loader2 className="h-4 w-4 animate-spin" />}
              {modeEdit ? 'Simpan Perubahan' : 'Simpan Nilai'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
