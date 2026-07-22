import { useState } from "react";
import { useContract } from "../../context/ContractContext.jsx";
import StepNav from "../StepNav.jsx";
import { perbaikiPenulisan } from "../../utils/perbaikiPenulisan.js";
import { isStepComplete } from "../../utils/validation.js";

export default function Step3() {
  const { state, update, addKetentuan, removeKetentuan, updateKetentuan, goTo } = useContract();
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const complete = isStepComplete(3, state);

  const perbaiki = async () => {
    setLoading(true);
    try {
      const hasil = await perbaikiPenulisan(state.ketentuanUmum, state.geminiApiKey);
      update({ ketentuanUmum: hasil });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl mb-1">Masukkan Ketentuan Umum</h2>
      <p className="text-gray-400 mb-6">
        Ketentuan umum akan digunakan sebagai definisi umum dari istilah yang disebutkan dalam kontrak.
      </p>

      <p className="mb-1.5 text-sm text-gray-800 font-medium">
        <span className="text-red-500 mr-1">*</span>Jumlah keseluruhan barang yang dijual dan dibeli
      </p>
      <label className="block text-gray-700 font-medium text-xs mb-1">Ketentuan Umum</label>
      {state.ketentuanUmum.map((teks, i) => (
        <div key={i} className="flex gap-2 mb-2.5">
          <input
            value={teks}
            onChange={(e) => updateKetentuan(i, e.target.value)}
            placeholder="Masukkan Ketentuan Umum…."
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-500 transition-all"
          />
          {state.ketentuanUmum.length > 1 && (
            <button
              type="button"
              onClick={() => removeKetentuan(i)}
              className="text-red-500 hover:text-red-700 px-1 font-bold text-base cursor-pointer"
              title="Hapus"
            >
              ×
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addKetentuan}
        className="w-full bg-gray-100 hover:bg-gray-200 transition text-gray-700 font-semibold py-2 rounded-lg text-sm border border-gray-200 shadow-xs mb-3 cursor-pointer"
      >
        Tambah Ketentuan Umum +
      </button>

      <button
        type="button"
        onClick={perbaiki}
        disabled={loading}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 transition text-white font-bold py-2.5 rounded-lg text-sm shadow-xs mb-2 cursor-pointer"
      >
        {loading ? "Memperbaiki…" : "Perbaiki Penulisan ✧"}
      </button>

      <button
        type="button"
        onClick={() => setShowSettings((s) => !s)}
        className="text-sm text-blue-500 hover:underline mb-4"
      >
        {showSettings ? "Tutup pengaturan AI" : "Pengaturan AI (opsional)"}
      </button>

      {showSettings && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 text-sm text-gray-600">
          <p className="mb-2">
            Secara default, tombol di atas hanya merapikan spasi, tanda baca, dan
            kapitalisasi (gratis selamanya, tanpa API). Untuk hasil perbaikan tata
            bahasa yang lebih pintar, isi API key Gemini gratis dari{" "}
            <a
              className="text-blue-500 underline"
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
            >
              Google AI Studio
            </a>{" "}
            di bawah ini. Kunci ini hanya tersimpan di memori browser dan hilang saat
            halaman ditutup.
          </p>
          <input
            type="password"
            value={state.geminiApiKey}
            onChange={(e) => update({ geminiApiKey: e.target.value })}
            placeholder="Gemini API Key (opsional)…."
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}

      <StepNav onPrev={() => goTo(2)} onNext={() => goTo(4)} nextDisabled={!complete} />
    </div>
  );
}
