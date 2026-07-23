import { useContract } from "../../context/ContractContext.jsx";
import StepNav from "../StepNav.jsx";
import { isStepComplete } from "../../utils/validation.js";

export default function Step3() {
  const { state, addKetentuan, removeKetentuan, updateKetentuan, goTo } =
    useContract();
  const complete = isStepComplete(3, state);

  return (
    <div>
      <h2 className="font-bold text-2xl mb-1">Masukkan Ketentuan Umum</h2>
      <p className="text-gray-400 mb-6">
        Ketentuan umum akan digunakan sebagai definisi umum dari istilah yang
        disebutkan dalam kontrak.
      </p>

      <label className="block text-gray-700 font-medium text-xs mb-1">
        Ketentuan Umum
      </label>
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
        className="w-full bg-gray-100 hover:bg-gray-200 transition text-gray-700 font-semibold py-2 rounded-lg text-sm border border-gray-200 shadow-xs mb-4 cursor-pointer"
      >
        Tambah Ketentuan Umum +
      </button>

      <StepNav
        onPrev={() => goTo(2)}
        onNext={() => goTo(4)}
        nextDisabled={!complete}
      />
    </div>
  );
}
