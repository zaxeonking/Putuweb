'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function TombolHapusSiswa({ id, nama }: { id: string; nama: string }) {
  const router = useRouter();

  async function tanganiHapus() {
    const yakin = window.confirm(`Hapus siswa "${nama}" dari kelas ini?`);
    if (!yakin) return;

    try {
      const res = await fetch(`/api/siswa/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.sukses) throw new Error(json.pesan || 'Gagal menghapus siswa.');

      toast.success(`Siswa "${nama}" berhasil dihapus`);
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={tanganiHapus} aria-label={`Hapus siswa ${nama}`}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
