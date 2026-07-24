import { DATABASE_KOSONG, type DatabaseKelas } from './types';

/**
 * Modul ini menjadikan sebuah file JSON di GitHub Repository sebagai
 * "database" aplikasi. Cara kerja:
 * 1. GET  -> ambil isi file via GitHub Contents API, decode base64 -> JSON.
 * 2. PUT  -> encode JSON -> base64, kirim balik ke GitHub Contents API
 *    beserta `sha` file lama (wajib, supaya GitHub tahu ini update, bukan
 *    file baru, dan untuk mencegah konflik/timpa data orang lain).
 *
 * PENTING: modul ini hanya boleh dijalankan di server (Route Handler / API),
 * karena butuh GITHUB_TOKEN yang bersifat rahasia. JANGAN pernah
 * mengimpor file ini dari komponen client.
 */

const GITHUB_API = 'https://api.github.com';

// Ambil konfigurasi dari environment variable (diisi di .env.local / Vercel)
const OWNER = process.env.GITHUB_OWNER!; // contoh: "username-github-anda"
const REPO = process.env.GITHUB_REPO!; // contoh: "kelas-manager-data"
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const FILE_PATH = process.env.GITHUB_DATA_PATH || 'data/database.json';
const TOKEN = process.env.GITHUB_TOKEN!; // Personal Access Token (scope: repo)

function headerAutentikasi() {
  if (!TOKEN) {
    throw new Error(
      'GITHUB_TOKEN belum diset. Tambahkan di file .env.local atau Environment Variables di Vercel.'
    );
  }
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

/** Encode string UTF-8 ke base64 (aman untuk karakter non-ASCII seperti "é", emoji, dsb) */
function keBase64(teks: string): string {
  return Buffer.from(teks, 'utf-8').toString('base64');
}

/** Decode base64 (dari GitHub, biasanya mengandung newline setiap 60 karakter) ke string UTF-8 */
function dariBase64(base64: string): string {
  return Buffer.from(base64.replace(/\n/g, ''), 'base64').toString('utf-8');
}

interface ResponKontenGitHub {
  content: string;
  sha: string;
  encoding: string;
}

/**
 * Ambil seluruh database dari file JSON di GitHub.
 * Jika file belum ada (404), kembalikan struktur database kosong
 * beserta sha null (nanti dipakai untuk membuat file baru saat pertama simpan).
 */
export async function ambilDatabase(): Promise<{
  data: DatabaseKelas;
  sha: string | null;
}> {
  const url = `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;

  const res = await fetch(url, {
    headers: headerAutentikasi(),
    // Jangan cache di Next.js supaya data selalu real-time dari GitHub
    cache: 'no-store',
  });

  if (res.status === 404) {
    // File database belum pernah dibuat di repo -> anggap kosong
    return { data: DATABASE_KOSONG, sha: null };
  }

  if (!res.ok) {
    const teksError = await res.text();
    throw new Error(`Gagal mengambil data dari GitHub (${res.status}): ${teksError}`);
  }

  const json = (await res.json()) as ResponKontenGitHub;
  const isiFile = dariBase64(json.content);

  let data: DatabaseKelas;
  try {
    data = JSON.parse(isiFile);
  } catch {
    // Kalau file rusak/kosong, fallback ke database kosong supaya app tidak crash
    data = DATABASE_KOSONG;
  }

  return { data, sha: json.sha };
}

/**
 * Simpan (commit) seluruh database ke file JSON di GitHub.
 * Setiap perubahan data akan tercatat sebagai satu commit di repo,
 * sehingga histori perubahan data kelas otomatis punya "riwayat versi".
 */
export async function simpanDatabase(
  data: DatabaseKelas,
  pesanCommit: string,
  shaLama: string | null
): Promise<void> {
  const url = `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

  const body: Record<string, unknown> = {
    message: pesanCommit,
    content: keBase64(JSON.stringify(data, null, 2)),
    branch: BRANCH,
  };

  // sha wajib disertakan kalau kita meng-update file yang sudah ada
  if (shaLama) {
    body.sha = shaLama;
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      ...headerAutentikasi(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const teksError = await res.text();
    throw new Error(`Gagal menyimpan data ke GitHub (${res.status}): ${teksError}`);
  }
}

/**
 * Helper transaksi sederhana: ambil data terbaru, ubah lewat callback,
 * lalu simpan kembali dengan sha yang benar. Ini mengurangi risiko
 * "lost update" ketika ada dua request menyimpan data bersamaan
 * (walau tetap tidak 100% atomic karena keterbatasan REST API GitHub).
 */
export async function updateDatabase(
  pesanCommit: string,
  pengubah: (data: DatabaseKelas) => DatabaseKelas
): Promise<DatabaseKelas> {
  const { data, sha } = await ambilDatabase();
  const dataBaru = pengubah(data);
  await simpanDatabase(dataBaru, pesanCommit, sha);
  return dataBaru;
}
