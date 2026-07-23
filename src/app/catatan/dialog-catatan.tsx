'use client';

import * as React from 'react';
import { NotebookPen, Pencil, Loader2 } from 'lucide-react';
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
import { MarkdownEditor } from '@/components/markdown-editor';
import { useKelasStore } from '@/lib/store';
import type { Catatan } from '@/lib/types';

interface Props {
  /** Daftar mata pelajaran yang sudah ada di aplikasi (untuk dropdown). */
  daftarMapel: string[];
  /** Kalau diisi, dialog berjalan dalam mode edit untuk catatan ini. */
  catatan?: Catatan;
  /** Mata pelajaran yang di-prefill saat menambah catatan baru dari grup tertentu. */
  mapelDefault?: string;
  trigger?: React.ReactNode;
}

/** Ubah string tags "a, b, c" jadi array ['a','b','c'] tanpa entri kosong. */
function uraikanTags(teks: string): string[] {
  return teks
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export function DialogCatatan({ daftarMapel, catatan, mapelDefault, trigger }: Props) {
  const modeEdit = Boolean(catatan);
  const tambahCatatan = useKelasStore((s) => s.tambahCatatan);
  const perbaruiCatatan = useKelasStore((s) => s.perbaruiCatatan);

  const [terbuka, setTerbuka] = React.useState(false);
  const [memuat, setMemuat] = React.useState(false);

  async function tanganiSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const judul = String(form.get('judul') || '').trim();
    const isi = String(form.get('isi') || '').trim();
    const mataPelajaran = String(form.get('mataPelajaran') || '').trim();
    const tags = uraikanTags(String(form.get('tags') || ''));

    if (!judul || !isi) {
      toast.error('Judul dan isi catatan wajib diisi.');
      return;
    }

    setMemuat(true);

    const payload = {
      judul,
      isi,
      mataPelajaran: mataPelajaran || undefined,
      tags: tags.length > 0 ? tags : undefined,
    };

    const sukses = modeEdit
      ? await perbaruiCatatan(catatan!.id, payload)
      : await tambahCatatan(payload);

    setMemuat(false);

    if (!sukses) {
      toast.error(useKelasStore.getState().error || 'Gagal menyimpan catatan.');
      return;
    }

    toast.success(`Catatan "${judul}" berhasil ${modeEdit ? 'diperbarui' : 'ditambahkan'}`);
    setTerbuka(false);
  }

  return (
    <Dialog open={terbuka} onOpenChange={setTerbuka}>
      <DialogTrigger asChild>
        {trigger ?? (modeEdit ? (
          <Button variant="ghost" size="icon" aria-label="Edit catatan">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <NotebookPen className="h-4 w-4" /> Tambah Catatan
          </Button>
        ))}
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <form onSubmit={tanganiSubmit}>
          <DialogHeader>
            <DialogTitle>{modeEdit ? 'Edit Catatan' : 'Tambah Catatan'}</DialogTitle>
            <DialogDescription>
              {modeEdit
                ? 'Perbarui isi catatan belajar ini.'
                : 'Tulis catatan belajar baru. Isi mendukung format Markdown.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto scrollbar-tipis pr-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="mataPelajaran">Mata Pelajaran</Label>
                <PilihMapel
                  id="mataPelajaran"
                  name="mataPelajaran"
                  daftarMapel={daftarMapel}
                  defaultValue={catatan?.mataPelajaran ?? mapelDefault}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="tags">Tags (opsional)</Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={catatan?.tags?.join(', ')}
                  placeholder="Contoh: rumus, ujian, bab-3"
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="judul">Judul Catatan</Label>
              <Input
                id="judul"
                name="judul"
                defaultValue={catatan?.judul}
                placeholder="Contoh: Ringkasan Hukum Newton"
                required
                autoFocus
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="isi">Isi Catatan</Label>
              <MarkdownEditor
                id="isi"
                name="isi"
                defaultValue={catatan?.isi}
                placeholder={'Tulis catatan di sini... mendukung **markdown**, daftar, tabel, dsb.'}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={memuat}>
              {memuat && <Loader2 className="h-4 w-4 animate-spin" />}
              {modeEdit ? 'Simpan Perubahan' : 'Simpan Catatan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
