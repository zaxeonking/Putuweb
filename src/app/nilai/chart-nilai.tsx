'use client';

import * as React from 'react';
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatTanggal } from '@/lib/utils';
import type { Nilai } from '@/lib/types';

interface Props {
  nilai: Nilai[];
  /** Nama mapel yang sedang difilter, dipakai untuk judul tooltip/legend. */
  labelFilter?: string;
}

interface TitikGrafik {
  id: string;
  tanggal: string;
  tanggalLabel: string;
  persentase: number;
  namaTugas: string;
  mataPelajaran: string;
}

function ubahKeTitikGrafik(nilai: Nilai[]): TitikGrafik[] {
  return [...nilai]
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
    .map((n) => ({
      id: n.id,
      tanggal: n.tanggal,
      tanggalLabel: formatTanggal(n.tanggal),
      persentase: Math.round((n.nilai / n.nilaiMaksimal) * 1000) / 10,
      namaTugas: n.namaTugas,
      mataPelajaran: n.mataPelajaran,
    }));
}

function TooltipKustom({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: TitikGrafik }>;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-popover-foreground">{d.namaTugas}</p>
      <p className="text-xs text-muted-foreground">{d.mataPelajaran}</p>
      <p className="text-muted-foreground">
        {d.persentase}% · {d.tanggalLabel}
      </p>
    </div>
  );
}

export function ChartNilai({ nilai }: Props) {
  const data = React.useMemo(() => ubahKeTitikGrafik(nilai), [nilai]);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Belum ada data nilai untuk ditampilkan grafiknya.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
          <XAxis
            dataKey="tanggalLabel"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={36}
            unit="%"
          />
          <Tooltip content={<TooltipKustom />} />
          <Line
            type="monotone"
            dataKey="persentase"
            stroke="#3B82F6"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#3B82F6' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
