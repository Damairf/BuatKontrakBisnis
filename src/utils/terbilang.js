const SATUAN = [
  "",
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
];

function bacaTiga(n) {
  let hasil = "";
  const ratusan = Math.floor(n / 100);
  const sisaRatusan = n % 100;
  const puluhan = Math.floor(sisaRatusan / 10);
  const satuan = sisaRatusan % 10;

  if (ratusan > 0) {
    hasil += ratusan === 1 ? "seratus " : `${SATUAN[ratusan]} ratus `;
  }

  if (sisaRatusan >= 11 && sisaRatusan <= 19) {
    hasil +=
      sisaRatusan === 11 ? "sebelas " : `${SATUAN[sisaRatusan - 10]} belas `;
  } else if (sisaRatusan === 10) {
    hasil += "sepuluh ";
  } else {
    if (puluhan > 0) hasil += `${SATUAN[puluhan]} puluh `;
    if (satuan > 0) hasil += `${SATUAN[satuan]} `;
  }

  return hasil.trim();
}

/**
 * Ubah angka menjadi bilangan terbilang bahasa Indonesia.
 * @param {number|string} angka
 * @returns {string}
 */
export function terbilang(angka) {
  if (angka === "" || angka === null || angka === undefined) return "";
  let num =
    typeof angka === "string"
      ? Number(angka.toString().replace(/[^0-9.-]/g, ""))
      : angka;
  if (Number.isNaN(num)) return "";

  if (num === 0) return "nol";

  const negatif = num < 0;
  num = Math.abs(num);

  const bagianBulat = Math.floor(num);
  const bagianDesimal = Math.round((num - bagianBulat) * 100);

  const kelompok = ["", " ribu", " juta", " miliar", " triliun"];
  let sisa = bagianBulat;
  const bagian = [];

  if (sisa === 0) {
    bagian.push("nol");
  } else {
    let idx = 0;
    while (sisa > 0) {
      const tiga = sisa % 1000;
      if (tiga > 0) {
        let teks = bacaTiga(tiga);
        if (idx === 1 && tiga === 1) {
          teks = "seribu";
        } else {
          teks += kelompok[idx];
        }
        bagian.unshift(teks);
      }
      sisa = Math.floor(sisa / 1000);
      idx += 1;
    }
  }

  let hasil = bagian.join(" ").replace(/\s+/g, " ").trim();

  if (bagianDesimal > 0) {
    hasil += ` koma ${bacaTiga(bagianDesimal)}`;
  }

  if (negatif) hasil = `minus ${hasil}`;

  return hasil;
}

/**
 * Format angka sebagai rupiah, mis. 1500000 -> "1.500.000"
 */
export function formatAngka(angka) {
  if (angka === "" || angka === null || angka === undefined) return "";
  const num =
    typeof angka === "string"
      ? Number(angka.toString().replace(/[^0-9.-]/g, ""))
      : angka;
  if (Number.isNaN(num)) return "";
  return num.toLocaleString("id-ID");
}

/**
 * Gabungan: kembalikan "1.500.000 (satu juta lima ratus ribu)"
 */
export function angkaDanTerbilang(angka, satuan = "") {
  if (angka === "" || angka === null || angka === undefined || angka === 0)
    return "....";
  const teksAngka = formatAngka(angka);
  const teksHuruf = terbilang(angka);
  return `${teksAngka}${satuan ? " " + satuan : ""} (${teksHuruf}${satuan ? " " + satuan : ""})`;
}
