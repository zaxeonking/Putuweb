'use client';

import * as React from 'react';
import { Circle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useKelasStore } from '@/lib/store';
import type { Tugas } from '@/lib/types';

interface Props {
  tugas: Tugas[];
}

function warnaPrioritas(prioritas: Tugas['prioritas']): 'destructive' | 'peringatan' | 'secondary' {
  if (prioritas === 'Tinggi') return 'destructive';
  if (prioritas === 'Sedang') return 'peringatan';
  return 'secondary';
}

function labelSisaHari(deadline: string): { teks: string; mendesak: boolean } {
  const sekarang = new Date();
  sekarang.setHours(0, 0, 0, 0);
  const tenggat = new Date(deadline);
  tenggat.setHours(0, 0, 0, 0);
  const selisihHari = Math.round((tenggat.getTime() - sekarang.getTime()) / 86_400_000);

  if (selisihHari < 0) return { teks: `Terlambat ${Math.abs(selisihHari)} hari`, mendesak: true };
  if (selisihHari === 0) return { teks: 'Hari ini', mendesak: true };
  if (selisihHari === 1) return { teks: 'Besok', mendesak: true };
  return { teks: `${selisihHari} hari lagi`, mendesak: selisihHari <= 3 };
}

export function DaftarTugasTerbaru({ tugas }: Props) {
  const ubahStatusTugas = useKelasStore((s) => s.ubahStatusTugas);
  const [idDiproses, setIdDiproses] = React.useState<string | null>(null);

  async function tandaiSelesai(id: string, judul: string) {
    setIdDiproses(id);
    const sukses = await ubahStatusTugas(id, 'Selesai');
    setIdDiproses(null);
    if (sukses) {
      toast.success(`"${judul}" ditandai selesai`);
    } else {
      toast.error('Gagal memperbarui status tugas.');
    }
  }

  if (tugas.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-6 text-center">
        Tidak ada tugas yang harus dikerjakan. Kerja bagus! 🎉
      </p>
    );
  }

  return (
    <div className="divide-y">
      {tugas.map((t) => {
        const { teks, mendesak } = labelSisaHari(t.deadline);
        return (
          <div key={t.id} className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-start gap-3 min-w-0">
              <button
                onClick={() => tandaiSelesai(t.id, t.judul)}
                disabled={idDiproses === t.id}
                className="mt-0.5 shrink-0 text-muted-foreground hover:text-brand transition-colors"
                aria-label="Tandai selesai"
              >
                {idDiproses === t.id ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <div className="min-w-0">
                <p className="font-medium truncate">{t.judul}</p>
                <p className="text-sm text-muted-foreground truncate">{t.mataPelajaran}</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant={warnaPrioritas(t.prioritas)}>{t.prioritas}</Badge>
              <span className={mendesak ? 'text-xs font-medium text-destructive' : 'text-xs text-muted-foreground'}>
                {teks}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
