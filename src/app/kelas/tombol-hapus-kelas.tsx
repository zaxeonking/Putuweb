'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function TombolHapusKelas({ id, nama }: { id: string; nama: string }) {
  const router = useRouter();

  async function tanganiHapus() {
    const yakin = window.confirm(
      `Hapus kelas "${nama}"? Semua data siswa di kelas ini juga akan terhapus. Tindakan ini tidak bisa dibatalkan.`
    );
    if (!yakin) return;

    try {
      const res = await fetch(`/api/kelas/${id}`, { method: 'DELETE' });
      const json = await res.json();

      if (!json.sukses) throw new Error(json.pesan || 'Gagal menghapus kelas.');

      toast.success(`Kelas "${nama}" berhasil dihapus`);
      router.refresh();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={tanganiHapus} aria-label={`Hapus kelas ${nama}`}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
