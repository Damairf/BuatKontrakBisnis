import { createContext, useContext, useState, useCallback } from "react";
import { canNavigateToStep } from "../utils/validation.js";

const emptyPihak = () => ({
  nama: "",
  umur: "",
  pekerjaan: "",
  perusahaan: "",
  alamat: "",
});

const emptyBarang = () => ({
  barang: "",
  harga: "",
  jumlah: "",
  satuan: "Unit",
});

export const initialState = {
  judul: "",

  page: "dashboard",

  pihak1: emptyPihak(),
  pihak2: emptyPihak(),
  tanggalPembuatan: "",

  barangKeseluruhan: [emptyBarang()],
  hargaPerSatuan: [emptyBarang()],
  barangPengirimanTahap1: [emptyBarang()],
  barangPengirimanTahap2: [emptyBarang()],

  ketentuanUmum: [""],

  metodePembayaran: "transfer",
  namaBank: "",
  nomorRekening: "",
  atasNamaRekening: "",

  alamatPengantaran: "",
  alamatPeresmian: "",
  saksi1: "",
  saksi2: "",

  geminiApiKey: "",
};

const ContractContext = createContext(null);

export function ContractProvider({ children }) {
  const [state, setState] = useState(initialState);

  const update = useCallback((patch) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const updatePihak = useCallback((which, patch) => {
    setState((prev) => ({
      ...prev,
      [which]: { ...prev[which], ...patch },
    }));
  }, []);

  const goTo = useCallback((page) => {
    setState((prev) => {
      if (!canNavigateToStep(page, prev)) {
        return prev;
      }
      return { ...prev, page };
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const reset = useCallback(() => {
    setState({ ...initialState });
  }, []);

  const addBarang = useCallback((field) => {
    setState((prev) => ({
      ...prev,
      [field]: [...prev[field], emptyBarang()],
    }));
  }, []);

  const removeBarang = useCallback((field, index) => {
    setState((prev) => {
      const list = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: list.length ? list : [emptyBarang()] };
    });
  }, []);

  const updateBarang = useCallback((field, index, patch) => {
    setState((prev) => {
      const list = prev[field].map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      );
      return { ...prev, [field]: list };
    });
  }, []);

  const addKetentuan = useCallback(() => {
    setState((prev) => ({
      ...prev,
      ketentuanUmum: [...prev.ketentuanUmum, ""],
    }));
  }, []);

  const removeKetentuan = useCallback((index) => {
    setState((prev) => {
      const list = prev.ketentuanUmum.filter((_, i) => i !== index);
      return { ...prev, ketentuanUmum: list.length ? list : [""] };
    });
  }, []);

  const updateKetentuan = useCallback((index, value) => {
    setState((prev) => {
      const list = prev.ketentuanUmum.map((item, i) =>
        i === index ? value : item,
      );
      return { ...prev, ketentuanUmum: list };
    });
  }, []);

  const value = {
    state,
    update,
    updatePihak,
    goTo,
    reset,
    addBarang,
    removeBarang,
    updateBarang,
    addKetentuan,
    removeKetentuan,
    updateKetentuan,
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const ctx = useContext(ContractContext);
  if (!ctx)
    throw new Error("useContract harus dipakai di dalam ContractProvider");
  return ctx;
}
