import { angkaDanTerbilang, formatAngka, terbilang } from "./terbilang.js";
import { parseTanggal } from "./dayName.js";

const PLACEHOLDER = "….";

function orDash(val) {
  return val === "" || val === null || val === undefined ? PLACEHOLDER : val;
}

function rupiah(angka) {
  const teks = angkaDanTerbilang(angka);
  return teks === PLACEHOLDER ? teks : `Rp${teks}`;
}

function joinBarangList(list, { withHarga = false } = {}) {
  const valid = list.filter((b) => b.barang || b.jumlah || b.satuan);
  if (!valid.length) return PLACEHOLDER;
  const parts = valid.map((b) => {
    const jumlah = orDash(b.jumlah);
    const satuan = orDash(b.satuan);
    const barang = orDash(b.barang);
    let text = `${jumlah} ${satuan} ${barang}`;
    if (withHarga && b.harga !== "" && b.harga !== undefined) {
      text += ` seharga ${rupiah(b.harga)}`;
    }
    return text;
  });
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(", ")} dan ${parts[parts.length - 1]}`;
}

function totalHarga(list) {
  return list.reduce((sum, b) => {
    const n = Number(b.harga);
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);
}

function totalJumlah(list) {
  return list.reduce((sum, b) => {
    const n = Number(b.jumlah);
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);
}

function satuanUtama(list) {
  const found = list.find((b) => b.satuan);
  return found ? found.satuan : PLACEHOLDER;
}

function barangUtama(list) {
  const found = list.find((b) => b.barang);
  return found ? found.barang : PLACEHOLDER;
}

export function buildContractModel(state) {
  const {
    judul,
    pihak1,
    pihak2,
    tanggalPembuatan,
    barangKeseluruhan,
    hargaPerSatuan,
    barangPengirimanTahap1 = [],
    barangPengirimanTahap2 = [],
    ketentuanUmum,
    metodePembayaran,
    namaBank,
    nomorRekening,
    atasNamaRekening,
    alamatPengantaran,
    alamatPeresmian,
    saksi1,
    saksi2,
  } = state;

  const tgl = parseTanggal(tanggalPembuatan);
  const hari = tgl ? tgl.hari : PLACEHOLDER;
  const tanggalAngka = tgl ? tgl.tanggal : PLACEHOLDER;
  const tanggalHuruf = tgl ? terbilang(tgl.tanggal) : PLACEHOLDER;
  const bulanNama = tgl ? tgl.bulan : PLACEHOLDER;
  const tahunAngka = tgl ? tgl.tahun : PLACEHOLDER;
  const tahunHuruf = tgl ? terbilang(tgl.tahun) : PLACEHOLDER;
  const formatShortDate = tgl
    ? `${String(tgl.tanggal).padStart(2, "0")}/${String(tgl.date.getMonth() + 1).padStart(2, "0")}/${tgl.tahun}`
    : PLACEHOLDER;

  const grandTotal = totalHarga(barangKeseluruhan);
  const setengahTotal = grandTotal / 2;

  const judulTampil =
    judul && judul.trim() ? judul.trim().toUpperCase() : PLACEHOLDER;
  const alamatPeresmianTampil = orDash(alamatPeresmian);

  const blocks = [];

  blocks.push({ type: "title", text: `PERJANJIAN JUAL – BELI ${judulTampil}` });

  blocks.push({
    type: "para",
    text: `Perjanjian ini dibuat di ${alamatPeresmianTampil} pada hari ${hari}, tanggal ${tanggalAngka} (${tanggalHuruf}) bulan ${bulanNama} tahun ${tahunAngka} (${tahunHuruf}) (${formatShortDate}), telah disepakati Perjanjian Jual – Beli ${judulTampil} oleh dan antara:`,
  });

  blocks.push({ type: "partyblock", label: "Penjual", pihak: pihak1 });
  blocks.push({
    type: "partyblock",
    label: "Pembeli",
    pihak: pihak2,
    isLast: true,
  });

  blocks.push({
    type: "para",
    text: "Para pihak terlebih dahulu dengan ini menerangkan hal-hal sebagai berikut:",
  });

  blocks.push({
    type: "numbered",
    items: [
      "Penjual dan Pembeli telah cakap melakukan perbuatan hukum dan terikat dalam perjanjian jual-beli ini.",
      `Penjual bermaksud menjual ${joinBarangList(barangKeseluruhan)}.`,
      `Pembeli bermaksud membeli ${joinBarangList(barangKeseluruhan)}.`,
      `Harga yang disepakati untuk setiap ${joinBarangList(hargaPerSatuan, { withHarga: true })}.`,
      `Harga keseluruhan ${joinBarangList(barangKeseluruhan)} adalah ${rupiah(grandTotal)}.`,
      "Penjual dan Pembeli sepakat melakukan jual-beli dengan kedudukan Penjual sebagai Penjual dan Pembeli sebagai Pembeli.",
    ],
  });

  blocks.push({
    type: "para",
    text: "Berdasarkan hal-hal tersebut, para pihak sepakat mengadakan perjanjian jual-beli dengan ketentuan sebagai berikut:",
  });

  // Pasal 1
  blocks.push({ type: "pasal", nomor: 1, judul: "Ketentuan Umum" });
  blocks.push({
    type: "para",
    text: "Dalam perjanjian ini yang dimaksud dengan:",
  });
  const ketentuan = ketentuanUmum.filter((k) => k.trim() !== "");
  blocks.push({
    type: "numbered",
    items: ketentuan.length ? ketentuan : [PLACEHOLDER],
  });

  // Pasal 2
  blocks.push({ type: "pasal", nomor: 2, judul: "Harga Barang" });
  blocks.push({
    type: "para",
    text: "Harga barang yang telah disepakati oleh kedua belah pihak adalah sebagai berikut:",
  });
  const pasal2Items = hargaPerSatuan
    .filter((b) => b.barang || b.jumlah || b.harga)
    .map((b) => {
      const jumlah = orDash(b.jumlah);
      const satuan = orDash(b.satuan);
      const barang = orDash(b.barang);
      return `${jumlah} (${b.jumlah ? terbilang(b.jumlah) : PLACEHOLDER}) ${satuan} ${barang} adalah ${rupiah(b.harga)}.`;
    });
  pasal2Items.push(
    `Total harga ${formatAngka(totalJumlah(barangKeseluruhan)) || PLACEHOLDER} (${totalJumlah(barangKeseluruhan) ? terbilang(totalJumlah(barangKeseluruhan)) : PLACEHOLDER}) ${satuanUtama(barangKeseluruhan)} ${barangUtama(barangKeseluruhan)} adalah ${rupiah(grandTotal)}.`,
  );
  blocks.push({
    type: "numbered",
    items: pasal2Items.length ? pasal2Items : [PLACEHOLDER],
  });

  // Pasal 3
  blocks.push({ type: "pasal", nomor: 3, judul: "Tata Cara Pembayaran" });
  blocks.push({
    type: "para",
    text: "Kedua belah pihak sepakat bahwa pembayaran dilakukan dalam dua tahap:",
  });
  blocks.push({
    type: "lettered",
    items: [
      `Tahap pertama dilakukan pada saat penandatanganan perjanjian sebesar 50% dari total harga keseluruhan, yaitu ${rupiah(setengahTotal)}.`,
      `Tahap kedua dilakukan pada saat penyerahan barang sebesar ${rupiah(setengahTotal)}.`,
    ],
  });

  // Pasal 4
  blocks.push({ type: "pasal", nomor: 4, judul: "Alat Pembayaran" });
  if (metodePembayaran === "tunai") {
    blocks.push({
      type: "para",
      text: "Pembayaran wajib menggunakan uang tunai secara langsung, tidak melalui transfer atau menggunakan cek maupun bilyet.",
    });
  } else {
    blocks.push({
      type: "para",
      text: "Pembayaran dilakukan melalui transfer ke:",
    });
    blocks.push({
      type: "keyvalue",
      rows: [
        ["Nama Bank", orDash(namaBank)],
        ["Nomor Rekening", orDash(nomorRekening)],
        ["Atas Nama", orDash(atasNamaRekening)],
      ],
    });
  }

  // Pasal 5
  blocks.push({
    type: "pasal",
    nomor: 5,
    judul: "Pengiriman dan Penyerahan Barang",
  });
  blocks.push({
    type: "para",
    text: "Pengiriman dan penyerahan barang oleh Penjual kepada Pembeli dilakukan dalam dua tahap, yaitu:",
  });
  blocks.push({
    type: "numbered",
    items: [
      `Tahap pertama pengiriman dan penyerahan barang dilakukan pada tanggal ditandatanganinya perjanjian ini sebanyak: ${barangPengirimanTahap1.length ? joinBarangList(barangPengirimanTahap1) : joinBarangList(barangKeseluruhan)}.`,
      `Tahap kedua pengiriman dan penyerahan barang dilakukan pada tanggal pelunasan pembayaran tahap kedua sebanyak: ${barangPengirimanTahap2.length ? joinBarangList(barangPengirimanTahap2) : joinBarangList(barangKeseluruhan)}.`,
      "Biaya pengiriman dari tempat Penjual ke tempat Pembeli ditanggung oleh Pembeli.",
      `Penyerahan barang dilakukan di alamat Pembeli, yaitu ${orDash(alamatPengantaran || pihak2.alamat)}.`,
    ],
  });

  // Pasal 6
  blocks.push({
    type: "pasal",
    nomor: 6,
    judul: "Hak dan Kewajiban Para Pihak",
  });
  blocks.push({
    type: "sublist",
    groups: [
      {
        label: "Hak Penjual",
        items: [
          "Menerima pembayaran sesuai harga yang telah disepakati.",
          "Menerima pembayaran pada waktu dan tempat yang telah diperjanjikan.",
        ],
      },
      {
        label: "Kewajiban Penjual",
        items: [
          "Melakukan pengiriman dan penyerahan barang sesuai perjanjian.",
          "Menyerahkan barang pada waktu dan tempat yang telah diperjanjikan.",
        ],
      },
      {
        label: "Hak Pembeli",
        items: [
          "Menerima barang sesuai perjanjian.",
          "Menerima barang pada waktu dan tempat yang telah diperjanjikan.",
        ],
      },
      {
        label: "Kewajiban Pembeli",
        items: [
          "Melakukan pembayaran sesuai harga yang telah disepakati.",
          "Melakukan pembayaran pada waktu dan tempat yang telah diperjanjikan.",
        ],
      },
    ],
  });

  // Pasal 7
  blocks.push({ type: "pasal", nomor: 7, judul: "Resiko" });
  blocks.push({
    type: "para",
    text: "Selama barang belum diserahkan oleh Penjual kepada Pembeli, seluruh risiko atas kerusakan, kehilangan, maupun musnahnya barang menjadi tanggung jawab penuh Penjual.",
  });

  // Pasal 8
  blocks.push({ type: "pasal", nomor: 8, judul: "Wanprestasi" });
  blocks.push({
    type: "numbered",
    items: [
      "Apabila Penjual tidak atau kurang menyerahkan barang yang diperjanjikan, atau menyerahkan barang yang tidak sesuai perjanjian, maka Pembeli berhak membatalkan perjanjian dan menuntut ganti rugi atas seluruh biaya yang telah dikeluarkan.",
      "Apabila Pembeli tidak melakukan pembayaran atau kurang melakukan pembayaran atas barang yang telah diserahkan, atau terlambat melakukan pembayaran, maka Penjual berhak membatalkan perjanjian dan menuntut ganti rugi atas seluruh biaya yang telah dikeluarkan.",
    ],
  });

  // Pasal 9
  blocks.push({ type: "pasal", nomor: 9, judul: "Ketentuan Lain" });
  blocks.push({
    type: "numbered",
    items: [
      "Perbedaan pendapat atau perselisihan yang timbul antara para pihak sehubungan dengan pelaksanaan perjanjian ini atau masalah-masalah yang berhubungan dengannya akan diselesaikan dengan cara musyawarah oleh para pihak.",
      "Apabila para pihak tidak dapat menyelesaikan perbedaan pendapat atau perselisihan secara musyawarah, para pihak sepakat untuk menyelesaikannya dengan proses hukum di Pengadilan dengan tunduk pada hukum tempat ditandatanganinya kontrak.",
      "Perjanjian ini dapat dihentikan oleh para pihak dengan terlebih dahulu memberitahukan kepada pihak lainnya.",
      "Setiap perubahan atau pengaturan lebih lanjut terhadap hal-hal lain yang belum diatur di dalam perjanjian ini harus disetujui terlebih dahulu oleh para pihak secara tertulis dan dituangkan dalam bentuk adendum.",
    ],
  });

  // Pasal 10
  blocks.push({ type: "pasal", nomor: 10, judul: "Penutup" });
  blocks.push({
    type: "para",
    text: `Demikian perjanjian jual-beli ${judulTampil} ini disetujui dan ditandatangani di ${alamatPeresmianTampil} dengan dihadiri dan ditandatangani oleh saksi-saksi yang dikenal oleh kedua belah pihak, dibuat dengan rangkap 2 (dua) bermeterai cukup, surat asli dipegang Penjual dan surat salinan dipegang Pembeli yang masing-masing mempunyai kekuatan hukum yang sama untuk masing-masing pihak.`,
  });

  blocks.push({
    type: "signature",
    kiri: { label: "Penjual", nama: orDash(pihak1.nama) },
    kanan: { label: "Pembeli", nama: orDash(pihak2.nama) },
  });

  blocks.push({
    type: "signature",
    kiri: { label: "Saksi", nama: orDash(saksi1) },
    kanan: { label: "Saksi", nama: orDash(saksi2) },
  });

  return { judul: judulTampil, blocks };
}
