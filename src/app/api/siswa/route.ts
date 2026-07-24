import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { ambilDatabase, updateDatabase } from '@/lib/github';
import type { Siswa } from '@/lib/types';

export const dynamic = 'force-dynamic';

/** GET /api/siswa?kelasId=xxx -> daftar siswa, bisa difilter berdasarkan kelas */
export async function GET(request: NextRequest) {
  try {
    const kelasId = request.nextUrl.searchParams.get('kelasId');
    const { data } = await ambilDatabase();

    const hasil = kelasId ? data.siswa.filter((s) => s.kelasId === kelasId) : data.siswa;

    return NextResponse.json({ sukses: true, data: hasil });
  } catch (error) {
    return NextResponse.json({ sukses: false, pesan: (error as Error).message }, { status: 500 });
  }
}

/** POST /api/siswa -> tambah siswa baru ke sebuah kelas */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.nama || !body.nis || !body.kelasId) {
      return NextResponse.json(
        { sukses: false, pesan: 'Nama, NIS, dan kelas wajib diisi.' },
        { status: 400 }
      );
    }

    const siswaBaru: Siswa = {
      id: randomUUID(),
      nama: body.nama,
      nis: body.nis,
      jenisKelamin: body.jenisKelamin || 'L',
      kelasId: body.kelasId,
      email: body.email || '',
      nomorHp: body.nomorHp || '',
      alamat: body.alamat || '',
      fotoUrl: body.fotoUrl || '',
      dibuatPada: new Date().toISOString(),
    };

    const dataBaru = await updateDatabase(
      `feat: tambah siswa ${siswaBaru.nama}`,
      (db) => ({ ...db, siswa: [...db.siswa, siswaBaru] })
    );

    return NextResponse.json({ sukses: true, data: siswaBaru, semua: dataBaru.siswa });
  } catch (error) {
    return NextResponse.json({ sukses: false, pesan: (error as Error).message }, { status: 500 });
  }
}
