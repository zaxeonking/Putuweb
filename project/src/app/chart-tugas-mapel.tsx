'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Tugas } from '@/lib/types';

interface Props {
  tugas: Tugas[];
}

/** Ubah daftar tugas jadi rekap { mataPelajaran, jumlah } untuk BarChart. */
function rekapPerMapel(tugas: Tugas[]) {
  const peta = new Map<string, number>();
  for (const t of tugas) {
    peta.set(t.mataPelajaran, (peta.get(t.mataPelajaran) ?? 0) + 1);
  }
  return Array.from(peta.entries())
    .map(([mataPelajaran, jumlah]) => ({ mataPelajaran, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah);
}

function TooltipKustom({ active, payload }: { active?: boolean; payload?: Array<{ payload: { mataPelajaran: string; jumlah: number } }> }) {
  if (!active || !payload?.length) return null;
  const { mataPelajaran, jumlah } = payload[0].payload;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-popover-foreground">{mataPelajaran}</p>
      <p className="text-muted-foreground">{jumlah} tugas</p>
    </div>
  );
}

export function ChartTugasMapel({ tugas }: Props) {
  const data = React.useMemo(() => rekapPerMapel(tugas), [tugas]);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Belum ada tugas untuk ditampilkan grafiknya.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          <XAxis
            dataKey="mataPelajaran"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-15}
            textAnchor="end"
            height={50}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={28} />
          <Tooltip content={<TooltipKustom />} cursor={{ fill: 'hsl(var(--muted))' }} />
          <Bar dataKey="jumlah" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
