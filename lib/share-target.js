// Helper client-side buat fitur "Share to..." (Web Share Target, Android).
//
// Alurnya:
// 1. User share file dari app lain (Galeri, Files, dsb) -> pilih "GitHub Uploader" di share sheet.
// 2. Android POST konten yang di-share ke /api/share-target (didaftarkan lewat manifest.json).
// 3. API route itu parse multipart-nya, lalu balikin halaman HTML kecil yang nyimpen filenya
//    ke IndexedDB (skema yang sama persis kayak di file ini), terus redirect ke "/?shared=1".
// 4. Halaman utama (pages/index.js) baca IndexedDB pakai helper di sini, ubah jadi objek File,
//    lalu masukkan ke form upload biasa seolah-olah user pilih file sendiri.
//
// IndexedDB dipakai (bukan localStorage/postMessage) karena datanya bisa lumayan besar (isi file
// dalam base64) dan prosesnya lintas navigasi (dari POST /api/share-target ke halaman "/").

const DB_NAME = "gh-uploader-share";
const DB_VERSION = 1;
const STORE_NAME = "pending";
const RECORD_KEY = "latest";

function openShareDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB tidak tersedia di browser ini"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("Gagal buka IndexedDB"));
  });
}

// Dipanggil dari halaman utama setelah redirect balik dari /api/share-target.
// Balikin record { id, name, type, size, dataBase64, sharedText, sharedUrl, ts } atau null kalau kosong.
export async function getPendingShare() {
  const db = await openShareDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(RECORD_KEY);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error || new Error("Gagal baca file yang dibagikan"));
  });
}

// Dipanggil habis file yang di-share sudah dipakai (atau gagal dipakai), biar tidak
// ke-proses ulang tiap kali halaman ini dibuka lagi.
export async function clearPendingShare() {
  const db = await openShareDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(RECORD_KEY);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error || new Error("Gagal hapus file yang dibagikan"));
  });
}

// Ubah record dari IndexedDB (base64) jadi objek File asli, biar bisa langsung dipakai
// ulang lewat fungsi applySelectedFile() yang sama dengan upload manual/drag&drop.
export async function pendingShareToFile(record) {
  if (!record || !record.dataBase64) {
    throw new Error("Data file yang dibagikan tidak lengkap");
  }
  const res = await fetch(`data:${record.type || "application/octet-stream"};base64,${record.dataBase64}`);
  const blob = await res.blob();
  return new File([blob], record.name || "shared-file", {
    type: record.type || blob.type || "application/octet-stream",
  });
}
