const HARI = [
  "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
];

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/**
 * @param {string} isoDate format "YYYY-MM-DD" (dari <input type="date">)
 */
export function parseTanggal(isoDate) {
  if (!isoDate) return null;
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return null;
  // buat di local time, hindari pergeseran zona waktu
  const date = new Date(y, m - 1, d);
  return {
    date,
    hari: HARI[date.getDay()],
    tanggal: d,
    bulan: BULAN[m - 1],
    tahun: y,
  };
}

export function formatTanggalIndonesia(isoDate) {
  const info = parseTanggal(isoDate);
  if (!info) return null;
  return `${info.hari}, ${info.tanggal} ${info.bulan} ${info.tahun}`;
}
