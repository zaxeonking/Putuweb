import { NextRequest, NextResponse } from 'next/server';
import { ambilDatabase, updateDatabase } from '@/lib/github';

export const dynamic = 'force-dynamic';

interface Konteks {
  params: { id: string };
}

/** GET /api/kelas/[id] -> detail satu kelas + daftar siswanya */
export async function GET(_request: NextRequest, { params }: Konteks) {
  try {
    const { data } = await ambilDatabase();
    const kelas = data.kelas.find((k) => k.id === params.id);

    if (!kelas) {
      return NextResponse.json({ sukses: false, pesan: 'Kelas tidak ditemukan.' }, { status: 404 });
    }

    const siswaDiKelas = data.siswa.filter((s) => s.kelasId === params.id);

    return NextResponse.json({ sukses: true, data: { ...kelas, siswa: siswaDiKelas } });
  } catch (error) {
    return NextResponse.json({ sukses: false, pesan: (error as Error).message }, { status: 500 });
  }
}

/** PUT /api/kelas/[id] -> update data kelas */
export async function PUT(request: NextRequest, { params }: Konteks) {
  try {
    const body = await request.json();

    const dataBaru = await updateDatabase(`fix: update kelas ${params.id}`, (db) => {
      const idx = db.kelas.findIndex((k) => k.id === params.id);
      if (idx === -1) throw new Error('Kelas tidak ditemukan.');

      db.kelas[idx] = { ...db.kelas[idx], ...body, id: params.id };
      return db;
    });

    const kelasTerupdate = dataBaru.kelas.find((k) => k.id === params.id);
    return NextResponse.json({ sukses: true, data: kelasTerupdate });
  } catch (error) {
    return NextResponse.json({ sukses: false, pesan: (error as Error).message }, { status: 500 });
  }
}

/** DELETE /api/kelas/[id] -> hapus kelas beserta siswa yang terdaftar di dalamnya */
export async function DELETE(_request: NextRequest, { params }: Konteks) {
  try {
    await updateDatabase(`chore: hapus kelas ${params.id}`, (db) => ({
      ...db,
      kelas: db.kelas.filter((k) => k.id !== params.id),
      siswa: db.siswa.filter((s) => s.kelasId !== params.id),
    }));

    return NextResponse.json({ sukses: true });
  } catch (error) {
    return NextResponse.json({ sukses: false, pesan: (error as Error).message }, { status: 500 });
  }
}
