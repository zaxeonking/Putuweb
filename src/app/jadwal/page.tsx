import { Card, CardContent } from '@/components/ui/card';
import { ambilDatabase } from '@/lib/github';
import { DATABASE_KOSONG } from '@/lib/types';
import { JadwalClient } from './jadwal-client';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Jadwal Pelajaran' };

// Server Component: ambil seluruh database dari GitHub sekali di server,
// lalu diteruskan ke JadwalClient untuk di-seed ke Zustand store
// (store yang sama dipakai juga oleh Dashboard & Kalender).
export const dynamic = 'force-dynamic';

export default async function JadwalPage() {
  try {
    const { data } = await ambilDatabase();
    return <JadwalClient initialDatabase={data} />;
  } catch (error) {
    const pesan = (error as Error).message;
    return (
      <div className="space-y-6">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6 text-sm text-destructive">
            Gagal memuat data dari GitHub: {pesan}. Pastikan environment variable{' '}
            <code className="font-mono">GITHUB_TOKEN</code>, <code className="font-mono">GITHUB_OWNER</code>, dan{' '}
            <code className="font-mono">GITHUB_REPO</code> sudah benar (lihat README / instruksi setup).
          </CardContent>
        </Card>

        {/* Tetap render halaman dengan data kosong supaya UI tidak blank total */}
        <JadwalClient initialDatabase={DATABASE_KOSONG} />
      </div>
    );
  }
}
