'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Search, Pencil, Trash2, Tag, Clock, BookOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useKelasStore } from '@/lib/store';
import { daftarMapelDariDatabase } from '@/lib/mapel-helpers';
import type { Catatan, DatabaseKelas } from '@/lib/types';
import { DialogCatatan } from './dialog-catatan';

interface Props {
  initialDatabase: DatabaseKelas;
}

const TANPA_MAPEL = 'Tanpa Mata Pelajaran';

/** Potong isi Markdown jadi cuplikan teks polos (buang simbol markdown umum). */
function cuplikan(isi: string, panjang = 140): string {
  const teksPolos = isi
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_~`|-]/g, ' ')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  return teksPolos.length > panjang ? `${teksPolos.slice(0, panjang)}…` : teksPolos;
}

function waktuRelatif(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: localeId });
  } catch {
    return iso;
  }
}

export function CatatanClient({ initialDatabase }: Props) {
  const database = useKelasStore((s) => s.database);
  const sudahDiisi = useKelasStore((s) => s.sudahDiisi);
  const hydrateDenganData = useKelasStore((s) => s.hydrateDenganData);
  const hapusCatatan = useKelasStore((s) => s.hapusCatatan);

  React.useEffect(() => {
    if (!sudahDiisi) {
      hydrateDenganData(initialDatabase);
    }
  }, [sudahDiisi, initialDatabase, hydrateDenganData]);

  const db = sudahDiisi ? database : initialDatabase;
  const { catatan } = db;

  const daftarMapel = React.useMemo(() => daftarMapelDariDatabase(db), [db]);

  const [pencarian, setPencarian] = React.useState('');

  const catatanTersaring = React.useMemo(() => {
    const kataKunci = pencarian.trim().toLowerCase();
    if (!kataKunci) return catatan;
    return catatan.filter(
      (c) =>
        c.judul.toLowerCase().includes(kataKunci) ||
        (c.mataPelajaran ?? '').toLowerCase().includes(kataKunci) ||
        (c.tags ?? []).some((t) => t.toLowerCase().includes(kataKunci))
    );
  }, [catatan, pencarian]);

  // Kelompokkan catatan per mata pelajaran, diurutkan dari yang terbaru diedit.
  const kelompok = React.useMemo(() => {
    const peta = new Map<string, Catatan[]>();
    for (const c of catatanTersaring) {
      const kunci = c.mataPelajaran?.trim() || TANPA_MAPEL;
      if (!peta.has(kunci)) peta.set(kunci, []);
      peta.get(kunci)!.push(c);
    }
    for (const daftar of peta.values()) {
      daftar.sort((a, b) => new Date(b.diperbaruiPada).getTime() - new Date(a.diperbaruiPada).getTime());
    }
    return Array.from(peta.entries()).sort(([a], [b]) => {
      if (a === TANPA_MAPEL) return 1;
      if (b === TANPA_MAPEL) return -1;
      return a.localeCompare(b);
    });
  }, [catatanTersaring]);

  async function tanganiHapus(c: Catatan) {
    const yakin = window.confirm(`Hapus catatan "${c.judul}"? Tindakan ini tidak bisa dibatalkan.`);
    if (!yakin) return;

    const sukses = await hapusCatatan(c.id);
    if (sukses) {
      toast.success(`Catatan "${c.judul}" berhasil dihapus`);
    } else {
      toast.error(useKelasStore.getState().error || 'Gagal menghapus catatan.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Catatan Belajar</h2>
          <p className="text-muted-foreground">
            Kelola catatan belajar Anda, dikelompokkan per mata pelajaran.
          </p>
        </div>
        <DialogCatatan daftarMapel={daftarMapel} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari judul, mapel, atau tag..."
                value={pencarian}
                onChange={(e) => setPencarian(e.target.value)}
                className="pl-8"
              />
            </div>
            {pencarian && (
              <Button variant="ghost" size="sm" onClick={() => setPencarian('')}>
                <X className="h-4 w-4" /> Reset
              </Button>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Menampilkan {catatanTersaring.length} dari {catatan.length} catatan
          </p>
        </CardContent>
      </Card>

      {catatan.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Belum ada catatan. Klik &quot;Tambah Catatan&quot; untuk membuat catatan pertama Anda.
          </CardContent>
        </Card>
      ) : catatanTersaring.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Tidak ada catatan yang cocok dengan pencarian &quot;{pencarian}&quot;.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {kelompok.map(([mapel, daftar]) => (
            <div key={mapel} className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brand" />
                <h3 className="font-semibold">{mapel}</h3>
                <Badge variant="secondary">{daftar.length}</Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {daftar.map((c) => (
                  <Card key={c.id} className="flex flex-col">
                    <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
                      <CardTitle className="text-base leading-snug">{c.judul}</CardTitle>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <DialogCatatan
                          daftarMapel={daftarMapel}
                          catatan={c}
                          trigger={
                            <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Edit catatan">
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          aria-label="Hapus catatan"
                          onClick={() => tanganiHapus(c)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-3">
                      <p className="text-sm text-muted-foreground flex-1">{cuplikan(c.isi)}</p>

                      {c.tags && c.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {c.tags.map((t) => (
                            <Badge key={t} variant="outline" className="text-[10px] gap-1">
                              <Tag className="h-2.5 w-2.5" /> {t}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" /> Diperbarui {waktuRelatif(c.diperbaruiPada)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
