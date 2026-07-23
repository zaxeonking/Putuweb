'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { eksporDatabaseAction, imporDatabaseAction } from '@/app/actions';

/**
 * DataIO — kartu "Export & Import Data" di halaman Pengaturan.
 *
 * Export: ambil seluruh database (via Server Action) lalu unduh sebagai
 * satu file .json di browser (tanpa perlu endpoint API terpisah).
 *
 * Import: pengguna pilih file .json hasil export sebelumnya, lalu file
 * itu dikirim ke Server Action `imporDatabaseAction` yang memvalidasi
 * strukturnya (zod) sebelum MENIMPA SELURUH data di GitHub. Karena ini
 * operasi destruktif, selalu minta konfirmasi eksplisit dulu.
 */
export function DataIO() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [sedangEkspor, setSedangEkspor] = useState(false);
  const [sedangImpor, setSedangImpor] = useState(false);

  async function tanganiExport() {
    setSedangEkspor(true);
    try {
      const hasil = await eksporDatabaseAction();
      if (!hasil.sukses || !hasil.data) {
        throw new Error(hasil.pesan || 'Gagal mengambil data untuk diekspor.');
      }

      const isiFile = JSON.stringify(hasil.data, null, 2);
      const blob = new Blob([isiFile], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const tanggal = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

      const a = document.createElement('a');
      a.href = url;
      a.download = `kelasku-backup-${tanggal}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success('Data berhasil diekspor ke file JSON.');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSedangEkspor(false);
    }
  }

  function tanganiPilihFile() {
    inputRef.current?.click();
  }

  async function tanganiFileDipilih(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset value supaya file yang sama bisa dipilih ulang lain kali
    // (misal user mau re-import file yang sama setelah dibatalkan).
    event.target.value = '';
    if (!file) return;

    const yakin = window.confirm(
      `Impor "${file.name}"? Tindakan ini akan MENIMPA SELURUH data KelasKu saat ini (kelas, siswa, nilai, jadwal, tugas, catatan) dengan isi file ini. Data lama tetap tersimpan di riwayat commit GitHub, tapi tidak akan langsung terlihat di aplikasi. Lanjutkan?`
    );
    if (!yakin) return;

    setSedangImpor(true);
    try {
      const teks = await file.text();
      let json: unknown;
      try {
        json = JSON.parse(teks);
      } catch {
        throw new Error('File bukan JSON yang valid.');
      }

      const hasil = await imporDatabaseAction(json);
      if (!hasil.sukses) {
        throw new Error(hasil.pesan || 'Gagal mengimpor data.');
      }

      toast.success('Data berhasil diimpor. Memuat ulang halaman...');
      // Reload penuh (bukan router.refresh()) supaya Zustand store yang
      // sudah ter-hydrate dengan data lama ikut ter-reset dengan data baru.
      setTimeout(() => window.location.reload(), 800);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSedangImpor(false);
    }
  }

  return (
    <div className="space-y-3 text-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">Export Data</p>
          <p className="text-muted-foreground">
            Unduh seluruh data (kelas, siswa, nilai, kehadiran, jadwal, tugas, catatan) sebagai
            satu file JSON, untuk backup atau dipindah ke instance lain.
          </p>
        </div>
        <Button onClick={tanganiExport} disabled={sedangEkspor} variant="outline" size="sm">
          {sedangEkspor ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Export JSON
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t pt-3">
        <div>
          <p className="font-medium">Import Data</p>
          <p className="text-muted-foreground">
            Pulihkan data dari file JSON hasil Export sebelumnya. <strong>Akan menimpa semua data
            yang ada saat ini.</strong>
          </p>
        </div>
        <Button onClick={tanganiPilihFile} disabled={sedangImpor} variant="outline" size="sm">
          {sedangImpor ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Import JSON
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={tanganiFileDipilih}
        />
      </div>
    </div>
  );
}
