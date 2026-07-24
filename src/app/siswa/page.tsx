import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ambilDatabase } from '@/lib/github';
import { TabelSiswa } from './tabel-siswa';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Siswa' };

export const dynamic = 'force-dynamic';

export default async function SiswaPage() {
  const { data } = await ambilDatabase();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Semua Siswa</h2>
        <p className="text-muted-foreground">
          Total {data.siswa.length} siswa terdaftar di {data.kelas.length} kelas. Untuk menambah
          siswa baru, buka halaman detail kelas yang dituju.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <TabelSiswa siswa={data.siswa} kelas={data.kelas} />
        </CardContent>
      </Card>
    </div>
  );
}
