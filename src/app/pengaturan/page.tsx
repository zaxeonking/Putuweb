import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { DataIO } from './data-io';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pengaturan' };

export default function PengaturanPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pengaturan</h2>
        <p className="text-muted-foreground">Kelola preferensi tampilan dan lihat status penyimpanan data.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tampilan</CardTitle>
          <CardDescription>Pilih tema terang, gelap, atau mengikuti sistem perangkat.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm">Mode Gelap / Terang</span>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Penyimpanan Data</CardTitle>
          <CardDescription>
            Aplikasi ini menyimpan seluruh data kelas, siswa, nilai, dan kehadiran sebagai satu
            file JSON di dalam GitHub Repository. Setiap perubahan tercatat sebagai commit
            tersendiri sehingga histori perubahan data dapat ditelusuri lewat riwayat commit repo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Repository</span>
            <code className="font-mono">{process.env.GITHUB_OWNER}/{process.env.GITHUB_REPO}</code>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Path data</span>
            <code className="font-mono">{process.env.GITHUB_DATA_PATH || 'data/database.json'}</code>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Branch</span>
            <code className="font-mono">{process.env.GITHUB_BRANCH || 'main'}</code>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export &amp; Import Data</CardTitle>
          <CardDescription>
            Backup seluruh data ke file JSON, atau pulihkan data dari file backup sebelumnya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataIO />
        </CardContent>
      </Card>
    </div>
  );
}
