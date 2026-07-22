export function isStepComplete(stepNumber, state) {
  if (!state) return false;

  switch (stepNumber) {
    case 1: {
      const p1 = state.pihak1 || {};
      const p2 = state.pihak2 || {};
      const p1Valid =
        Boolean(p1.nama?.trim()) &&
        Boolean(p1.umur?.trim()) &&
        Boolean(p1.pekerjaan?.trim()) &&
        Boolean(p1.perusahaan?.trim()) &&
        Boolean(p1.alamat?.trim());
      const p2Valid =
        Boolean(p2.nama?.trim()) &&
        Boolean(p2.umur?.trim()) &&
        Boolean(p2.pekerjaan?.trim()) &&
        Boolean(p2.perusahaan?.trim()) &&
        Boolean(p2.alamat?.trim());
      const tanggalValid = Boolean(state.tanggalPembuatan?.trim());
      return p1Valid && p2Valid && tanggalValid;
    }

    case 2: {
      const barangKeseluruhan = state.barangKeseluruhan || [];
      const hargaPerSatuan = state.hargaPerSatuan || [];
      const barangPengirimanTahap1 = state.barangPengirimanTahap1 || [];
      const barangPengirimanTahap2 = state.barangPengirimanTahap2 || [];

      if (
        !barangKeseluruhan.length ||
        !hargaPerSatuan.length ||
        !barangPengirimanTahap1.length ||
        !barangPengirimanTahap2.length
      )
        return false;

      const bkValid = barangKeseluruhan.every(
        (item) =>
          Boolean(item.barang?.trim()) &&
          Boolean(String(item.harga)?.trim()) &&
          Boolean(String(item.jumlah)?.trim()) &&
          Boolean(item.satuan?.trim()),
      );

      const hpsValid = hargaPerSatuan.every(
        (item) =>
          Boolean(item.barang?.trim()) &&
          Boolean(String(item.harga)?.trim()) &&
          Boolean(String(item.jumlah)?.trim()) &&
          Boolean(item.satuan?.trim()),
      );

      const pt1Valid = barangPengirimanTahap1.every(
        (item) =>
          Boolean(item.barang?.trim()) &&
          Boolean(String(item.jumlah)?.trim()) &&
          Boolean(item.satuan?.trim()),
      );
      const pt2Valid = barangPengirimanTahap2.every(
        (item) =>
          Boolean(item.barang?.trim()) &&
          Boolean(String(item.jumlah)?.trim()) &&
          Boolean(item.satuan?.trim()),
      );
      return bkValid && hpsValid && pt1Valid && pt2Valid;
    }

    case 3: {
      const ketentuanUmum = state.ketentuanUmum || [];
      if (!ketentuanUmum.length) return false;
      return ketentuanUmum.every((item) => Boolean(item?.trim()));
    }

    case 4: {
      if (state.metodePembayaran === "tunai") return true;
      return (
        Boolean(state.namaBank?.trim()) &&
        Boolean(state.nomorRekening?.trim()) &&
        Boolean(state.atasNamaRekening?.trim())
      );
    }

    case 5: {
      return (
        Boolean(state.alamatPengantaran?.trim()) &&
        Boolean(state.alamatPeresmian?.trim()) &&
        Boolean(state.saksi1?.trim()) &&
        Boolean(state.saksi2?.trim())
      );
    }

    default:
      return true;
  }
}

export function canNavigateToStep(targetStep, state) {
  if (targetStep === "dashboard") return true;
  if (typeof targetStep !== "number") return false;

  for (let i = 1; i < targetStep; i++) {
    if (!isStepComplete(i, state)) {
      return false;
    }
  }
  return true;
}
