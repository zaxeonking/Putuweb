'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { OPSI_MAPEL_BARU } from '@/lib/mapel-helpers';

const SELECT_CLASS =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

interface Props {
  id?: string;
  name: string;
  daftarMapel: string[];
  defaultValue?: string;
  required?: boolean;
  className?: string;
}

/**
 * Dropdown "Mata Pelajaran" yang diisi dari data yang sudah ada di aplikasi,
 * plus opsi "+ Mapel baru..." yang memunculkan input teks kalau mata
 * pelajaran yang diinginkan belum ada di daftar.
 *
 * Value akhir tetap dikirim lewat field bernama `name` di FormData (baik
 * dari <select> maupun <input> pengganti), jadi pemanggil form tidak perlu
 * tahu apakah nilainya dipilih dari daftar atau ditulis baru.
 */
export function PilihMapel({ id, name, daftarMapel, defaultValue, required, className }: Props) {
  const mapelSudahAda = Boolean(defaultValue && daftarMapel.includes(defaultValue));
  const [modeBaru, setModeBaru] = React.useState(Boolean(defaultValue) && !mapelSudahAda);
  const [nilaiSelect, setNilaiSelect] = React.useState(mapelSudahAda ? defaultValue! : '');

  if (modeBaru || daftarMapel.length === 0) {
    return (
      <div className="flex gap-2">
        <Input
          id={id}
          name={name}
          defaultValue={defaultValue}
          placeholder="Contoh: Matematika"
          required={required}
          className={className}
          autoFocus={daftarMapel.length > 0}
        />
        {daftarMapel.length > 0 && (
          <button
            type="button"
            onClick={() => setModeBaru(false)}
            className="shrink-0 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Pilih dari daftar
          </button>
        )}
      </div>
    );
  }

  return (
    <select
      id={id}
      name={name}
      value={nilaiSelect}
      onChange={(e) => {
        if (e.target.value === OPSI_MAPEL_BARU) {
          setModeBaru(true);
          setNilaiSelect('');
        } else {
          setNilaiSelect(e.target.value);
        }
      }}
      className={cn(SELECT_CLASS, className)}
      required={required}
    >
      <option value="" disabled>
        Pilih mata pelajaran...
      </option>
      {daftarMapel.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
      <option value={OPSI_MAPEL_BARU}>+ Mapel baru...</option>
    </select>
  );
}
