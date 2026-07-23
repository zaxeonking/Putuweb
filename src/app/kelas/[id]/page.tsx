import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { ambilDatabase } from '@/lib/github';
import { ambilInisial } from '@/lib/utils';
import { DialogTambahSiswa } from './dialog-tambah-siswa';
import { TombolHapusSiswa } from './tombol-hapus-siswa';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

/** Judul tab browser mengikuti nama kelas yang sedang dibuka, contoh: "XII IPA 1 | KelasKu" */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await ambilDatabase();
  const kelas = data.kelas.find((k) => k.id === params.id);
  return { title: kelas ? kelas.nama : 'Detail Kelas' };
}

export default async function DetailKelasPage({ params }: Props) {
  const { data } = await ambilDatabase();
  const kelas = data.kelas.find((k) => k.id === params.id);

  // Jika kelas tidak ditemukan (misal id salah atau sudah dihapus), tampilkan 404
  if (!kelas) notFound();

  const daftarSiswa = data.siswa.filter((s) => s.kelasId === params.id);

  return (
    <div className="space-y-6">
      <Link href="/kelas" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Kembali ke Daftar Kelas
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{kelas.nama}</h2>
          <p className="text-muted-foreground">
            Wali kelas: {kelas.waliKelas} &middot; Tahun ajaran {kelas.tahunAjaran}
          </p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">{kelas.tingkat}</Badge>
            <Badge variant="outline">{daftarSiswa.length} siswa</Badge>
          </div>
        </div>
        <DialogTambahSiswa kelasId={kelas.id} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          {daftarSiswa.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10 text-center">
              Belum ada siswa di kelas ini. Klik &quot;Tambah Siswa&quot; untuk mulai mendaftarkan.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead>NIS</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {daftarSiswa.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{ambilInisial(s.nama)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{s.nama}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.nis}</TableCell>
                    <TableCell>{s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {s.email || s.nomorHp || '-'}
                    </TableCell>
                    <TableCell>
                      <TombolHapusSiswa id={s.id} nama={s.nama} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
