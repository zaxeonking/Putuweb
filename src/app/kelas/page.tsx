import Link from 'next/link';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ambilDatabase } from '@/lib/github';
import { DialogTambahKelas } from './dialog-tambah-kelas';
import { TombolHapusKelas } from './tombol-hapus-kelas';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Kelas' };

export const dynamic = 'force-dynamic';

export default async function KelasPage() {
  const { data } = await ambilDatabase();
  const { kelas, siswa } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Daftar Kelas</h2>
          <p className="text-muted-foreground">Kelola semua kelas yang Anda ampu.</p>
        </div>
        <DialogTambahKelas />
      </div>

      {kelas.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Belum ada kelas. Klik &quot;Tambah Kelas&quot; untuk membuat kelas pertama Anda.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kelas.map((k) => {
            const jumlahSiswa = siswa.filter((s) => s.kelasId === k.id).length;
            return (
              <Card key={k.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div>
                    <CardTitle className="text-base">{k.nama}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Wali: {k.waliKelas}</p>
                  </div>
                  <TombolHapusKelas id={k.id} nama={k.nama} />
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{k.tingkat}</Badge>
                    <Badge variant="outline">{k.tahunAjaran}</Badge>
                  </div>
                  {k.deskripsi && <p className="text-sm text-muted-foreground">{k.deskripsi}</p>}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" /> {jumlahSiswa} siswa
                    </span>
                    <Link href={`/kelas/${k.id}`} className="text-sm font-medium text-brand hover:underline">
                      Lihat detail
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
