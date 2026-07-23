import { Card, CardContent } from '@/components/ui/card';
import { ambilDatabase } from '@/lib/github';
import { DATABASE_KOSONG } from '@/lib/types';
import { NilaiClient } from './nilai-client';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Nilai' };

// Server Component: ambil seluruh database dari GitHub sekali di server,
// lalu diteruskan ke NilaiClient untuk di-seed ke Zustand store.
export const dynamic = 'force-dynamic';

export default async function NilaiPage() {
  try {
    const { data } = await ambilDatabase();
    return <NilaiClient initialDatabase={data} />;
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

        <NilaiClient initialDatabase={DATABASE_KOSONG} />
      </div>
    );
  }
}
