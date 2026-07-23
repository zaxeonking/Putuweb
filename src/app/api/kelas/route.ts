import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { ambilDatabase, updateDatabase } from '@/lib/github';
import type { Kelas } from '@/lib/types';

// Route ini selalu dijalankan secara dinamis (tidak di-cache Next.js),
// karena datanya bisa berubah kapan saja lewat GitHub.
export const dynamic = 'force-dynamic';

/** GET /api/kelas -> ambil semua daftar kelas */
export async function GET() {
  try {
    const { data } = await ambilDatabase();
    return NextResponse.json({ sukses: true, data: data.kelas });
  } catch (error) {
    return NextResponse.json(
      { sukses: false, pesan: (error as Error).message },
      { status: 500 }
    );
  }
}

/** POST /api/kelas -> tambah kelas baru */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validasi input dasar sebelum disimpan
    if (!body.nama || !body.tingkat || !body.waliKelas) {
      return NextResponse.json(
        { sukses: false, pesan: 'Nama kelas, tingkat, dan wali kelas wajib diisi.' },
        { status: 400 }
      );
    }

    const kelasBaru: Kelas = {
      id: randomUUID(),
      nama: body.nama,
      tingkat: body.tingkat,
      waliKelas: body.waliKelas,
      tahunAjaran: body.tahunAjaran || '2026/2027',
      deskripsi: body.deskripsi || '',
      dibuatPada: new Date().toISOString(),
    };

    const dataBaru = await updateDatabase(
      `feat: tambah kelas ${kelasBaru.nama}`,
      (db) => ({ ...db, kelas: [...db.kelas, kelasBaru] })
    );

    return NextResponse.json({ sukses: true, data: kelasBaru, semua: dataBaru.kelas });
  } catch (error) {
    return NextResponse.json(
      { sukses: false, pesan: (error as Error).message },
      { status: 500 }
    );
  }
}
