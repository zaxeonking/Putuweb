'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { ambilInisial } from '@/lib/utils';
import type { Kelas, Siswa } from '@/lib/types';

interface Props {
  siswa: Siswa[];
  kelas: Kelas[];
}

/**
 * Tabel siswa dengan pencarian real-time di sisi client (nama atau NIS).
 * Data awal tetap diambil di server (page.tsx) supaya cepat saat load pertama;
 * komponen ini hanya menangani interaksi filter.
 */
export function TabelSiswa({ siswa, kelas }: Props) {
  const [kataKunci, setKataKunci] = React.useState('');

  const petaKelas = React.useMemo(() => {
    const peta = new Map<string, Kelas>();
    kelas.forEach((k) => peta.set(k.id, k));
    return peta;
  }, [kelas]);

  const hasilFilter = React.useMemo(() => {
    const kunci = kataKunci.trim().toLowerCase();
    if (!kunci) return siswa;
    return siswa.filter(
      (s) => s.nama.toLowerCase().includes(kunci) || s.nis.toLowerCase().includes(kunci)
    );
  }, [siswa, kataKunci]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama atau NIS siswa..."
          className="pl-8"
          value={kataKunci}
          onChange={(e) => setKataKunci(e.target.value)}
        />
      </div>

      {hasilFilter.length === 0 ? (
        <p className="text-sm text-muted-foreground py-10 text-center">
          Tidak ada siswa yang cocok dengan pencarian &quot;{kataKunci}&quot;.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Siswa</TableHead>
              <TableHead>NIS</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Kontak</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hasilFilter.map((s) => {
              const kelasSiswa = petaKelas.get(s.kelasId);
              return (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{ambilInisial(s.nama)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{s.nama}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.nis}</TableCell>
                  <TableCell>
                    {kelasSiswa ? (
                      <Link href={`/kelas/${kelasSiswa.id}`}>
                        <Badge variant="secondary" className="hover:bg-secondary/80">
                          {kelasSiswa.nama}
                        </Badge>
                      </Link>
                    ) : (
                      <span className="text-muted-foreground text-sm">Tanpa kelas</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.email || s.nomorHp || '-'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
