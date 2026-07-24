import { NextRequest, NextResponse } from 'next/server';
import { updateDatabase } from '@/lib/github';

export const dynamic = 'force-dynamic';

interface Konteks {
  params: { id: string };
}

/** PUT /api/siswa/[id] -> update data siswa (misal pindah kelas, ubah kontak, dll) */
export async function PUT(request: NextRequest, { params }: Konteks) {
  try {
    const body = await request.json();

    const dataBaru = await updateDatabase(`fix: update siswa ${params.id}`, (db) => {
      const idx = db.siswa.findIndex((s) => s.id === params.id);
      if (idx === -1) throw new Error('Siswa tidak ditemukan.');

      db.siswa[idx] = { ...db.siswa[idx], ...body, id: params.id };
      return db;
    });

    const siswaTerupdate = dataBaru.siswa.find((s) => s.id === params.id);
    return NextResponse.json({ sukses: true, data: siswaTerupdate });
  } catch (error) {
    return NextResponse.json({ sukses: false, pesan: (error as Error).message }, { status: 500 });
  }
}

/** DELETE /api/siswa/[id] -> hapus siswa (beserta data nilai & kehadirannya) */
export async function DELETE(_request: NextRequest, { params }: Konteks) {
  try {
    await updateDatabase(`chore: hapus siswa ${params.id}`, (db) => ({
      ...db,
      siswa: db.siswa.filter((s) => s.id !== params.id),
      nilai: db.nilai.filter((n) => n.siswaId !== params.id),
      kehadiran: db.kehadiran.filter((k) => k.siswaId !== params.id),
    }));

    return NextResponse.json({ sukses: true });
  } catch (error) {
    return NextResponse.json({ sukses: false, pesan: (error as Error).message }, { status: 500 });
  }
}
