import formidable from "formidable";
import fs from "fs";
import { withRateLimit } from "../../lib/rate-limit";

// Endpoint ini didaftarkan sebagai "share_target" di public/manifest.json.
// Kalau app sudah di-"Add to Home Screen" di Android, dia bakal muncul di daftar
// "Share to..." tiap kali user share file/teks/link dari app lain (Galeri, Files, dll).
//
// Android bakal POST (multipart/form-data) ke sini. Endpoint ini TIDAK menyimpan apapun
// ke GitHub secara langsung — dia cuma nangkep file yang di-share, simpan sementara ke
// IndexedDB (lewat halaman kecil di bawah), lalu balikin ke "/" supaya user tetap lewat
// alur upload normal (pilih repo, isi path, konfirmasi ukuran, dst) sebelum benar-benar push.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Konsisten dengan batas di /api/upload: Vercel Functions punya limit body request 4.5MB
// di level platform, jadi kita set sedikit di bawahnya biar errornya jelas ("kegedean"),
// bukan 413 samar dari platform.
const MAX_BYTES = 4 * 1024 * 1024;

function firstValue(v) {
  return Array.isArray(v) ? v[0] : v;
}

function slugifyTitle(s) {
  const cleaned = String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "shared-note";
}

// Escape "</" biar aman ditempel di dalam tag <script> (mencegah data yang dibagikan
// bisa menutup tag script lebih awal).
function safeJson(value) {
  return JSON.stringify(value).replace(/<\//g, "<\\/");
}

function sendHandoffPage(res, { record, error } = {}) {
  const payload = safeJson({ record: record || null, error: error || null });
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(`<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Menerima file...</title>
<style>
  html, body { height: 100%; margin: 0; }
  body {
    background: #0d1418; color: #e7eef0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    display: flex; align-items: center; justify-content: center; text-align: center; padding: 24px; box-sizing: border-box;
  }
  .box { max-width: 320px; }
  p { opacity: 0.75; font-size: 14px; line-height: 1.5; }
  a { color: #e2b04a; }
</style>
</head>
<body>
  <div class="box">
    <p id="msg">Menyimpan file yang dibagikan&hellip;</p>
  </div>
  <script>
  (function () {
    var payload = ${payload};
    var DB_NAME = "gh-uploader-share";
    var DB_VERSION = 1;
    var STORE_NAME = "pending";
    var RECORD_KEY = "latest";

    function goHome(ok) {
      var url = ok ? "/?shared=1" : "/?shared=0";
      location.replace(url);
    }

    if (payload.error) {
      document.getElementById("msg").textContent = payload.error + " Kembali ke app...";
      setTimeout(function () { goHome(false); }, 1200);
      return;
    }
    if (!payload.record) {
      goHome(false);
      return;
    }
    if (!("indexedDB" in window)) {
      document.getElementById("msg").textContent = "Browser ini tidak mendukung penyimpanan lokal. Kembali ke app...";
      setTimeout(function () { goHome(false); }, 1200);
      return;
    }

    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = function () {
      var db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    req.onsuccess = function () {
      var db = req.result;
      var tx = db.transaction(STORE_NAME, "readwrite");
      var store = tx.objectStore(STORE_NAME);
      var record = payload.record;
      record.id = RECORD_KEY;
      record.ts = Date.now();
      var putReq = store.put(record);
      putReq.onsuccess = function () { goHome(true); };
      putReq.onerror = function () { goHome(false); };
    };
    req.onerror = function () { goHome(false); };
  })();
  </script>
</body>
</html>`);
}

async function handler(req, res) {
  if (req.method === "GET") {
    res.writeHead(303, { Location: "/" });
    return res.end();
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method tidak diizinkan" });
    return;
  }

  const form = formidable({
    multiples: false,
    maxFileSize: MAX_BYTES,
    maxTotalFileSize: MAX_BYTES,
  });

  let fields;
  let files;
  try {
    [fields, files] = await form.parse(req);
  } catch (err) {
    sendHandoffPage(res, {
      error: "File yang dibagikan kegedean (maksimal ~4MB lewat share) atau gagal dibaca.",
    });
    return;
  }

  const title = firstValue(fields.title);
  const text = firstValue(fields.text);
  const url = firstValue(fields.url);

  const fileField = files.files;
  const uploaded = Array.isArray(fileField) ? fileField[0] : fileField;

  if (!uploaded) {
    // Tidak ada file — cuma teks/link yang di-share. Jangan dibuang, ubah jadi file .txt kecil
    // supaya tetap bisa masuk ke alur upload normal (user bisa ganti nama/isi sebelum push).
    const noteBody = [text, url].filter(Boolean).join("\n");
    if (!noteBody) {
      sendHandoffPage(res, { error: "Tidak ada file atau teks yang diterima dari share ini." });
      return;
    }
    const base64 = Buffer.from(noteBody, "utf-8").toString("base64");
    sendHandoffPage(res, {
      record: {
        name: slugifyTitle(title) + ".txt",
        type: "text/plain",
        size: Buffer.byteLength(noteBody, "utf-8"),
        dataBase64: base64,
        sharedText: text || "",
        sharedUrl: url || "",
      },
    });
    return;
  }

  try {
    const buf = await fs.promises.readFile(uploaded.filepath);
    const base64 = buf.toString("base64");
    sendHandoffPage(res, {
      record: {
        name: uploaded.originalFilename || "shared-file",
        type: uploaded.mimetype || "application/octet-stream",
        size: uploaded.size || buf.length,
        dataBase64: base64,
        sharedText: text || "",
        sharedUrl: url || "",
      },
    });
  } catch (err) {
    sendHandoffPage(res, { error: "Gagal baca file yang dibagikan: " + err.message });
  } finally {
    fs.unlink(uploaded.filepath, () => {});
  }
}

export default withRateLimit(handler, { windowMs: 60000, max: 15 }); // tier: WRITE
