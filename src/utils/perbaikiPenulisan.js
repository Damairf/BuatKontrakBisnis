// Perbaikan penulisan untuk kolom "Ketentuan Umum".
//
// Default (tanpa API key): perbaikan berbasis aturan sederhana — selalu
// gratis & tidak akan pernah kedaluwarsa karena tidak bergantung pihak
// ketiga. Cocok untuk typo kecil, spasi ganda, kapitalisasi, dsb.
//
// Opsional: jika user mengisi API key Gemini (gratis, dapat dibuat di
// https://aistudio.google.com/apikey) di kolom pengaturan, teks akan
// dikirim ke Gemini untuk diperbaiki tata bahasanya secara lebih pintar.
// Kunci API TIDAK pernah disimpan/di-upload; ia hanya ada di memori
// browser selama sesi berlangsung, sesuai sifat aplikasi ini yang statis.

function rapikanLokal(teks) {
  let t = teks.trim();
  if (!t) return t;
  t = t.replace(/\s+/g, " ");
  t = t.replace(/\s+([,.;:])/g, "$1");
  // kapitalisasi huruf pertama setiap kalimat
  t = t.replace(/(^\s*\w|[.!?]\s+\w)/g, (m) => m.toUpperCase());
  // tambahkan titik di akhir jika belum ada tanda baca penutup
  if (!/[.!?]$/.test(t)) t += ".";
  return t;
}

async function perbaikiDenganGemini(teks, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const prompt = `Perbaiki ejaan, tata bahasa, dan kejelasan kalimat berikut ini yang merupakan satu poin "ketentuan umum" dalam sebuah kontrak jual-beli berbahasa Indonesia. Jangan mengubah makna atau menambah informasi baru. Balas HANYA dengan kalimat hasil perbaikannya saja, tanpa tanda kutip, tanpa penjelasan tambahan.\n\nKalimat:\n"""${teks}"""`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Respons Gemini kosong");
  return text.trim().replace(/^"|"$/g, "");
}

/**
 * @param {string[]} daftarKetentuan
 * @param {string} apiKey opsional - Gemini API key
 * @returns {Promise<string[]>}
 */
export async function perbaikiPenulisan(daftarKetentuan, apiKey) {
  const hasil = [];
  for (const teks of daftarKetentuan) {
    if (!teks || !teks.trim()) {
      hasil.push(teks);
      continue;
    }
    if (apiKey) {
      try {
        // eslint-disable-next-line no-await-in-loop
        hasil.push(await perbaikiDenganGemini(teks, apiKey));
        continue;
      } catch (err) {
        console.warn("Gagal memanggil Gemini, memakai perbaikan lokal:", err);
      }
    }
    hasil.push(rapikanLokal(teks));
  }
  return hasil;
}
