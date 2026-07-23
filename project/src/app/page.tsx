import { Card, CardContent } from '@/components/ui/card';
import { ambilDatabase } from '@/lib/github';
import { DATABASE_KOSONG } from '@/lib/types';
import { DashboardClient } from './dashboard-client';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Beranda' };

// Server Component: ambil seluruh database dari GitHub sekali di server,
// lalu diteruskan ke DashboardClient untuk di-seed ke Zustand store
// (menghindari fetch dobel ke GitHub API dari client).
export const dynamic = 'force-dynamic';

export default async function BerandaPage() {
  try {
    const { data } = await ambilDatabase();
    return <DashboardClient initialDatabase={data} />;
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

        {/* Tetap render dashboard dengan data kosong supaya UI tidak blank total */}
        <DashboardClient initialDatabase={DATABASE_KOSONG} />
      </div>
    );
  }
}
