import { useState } from "react";
import { useContract } from "../context/ContractContext.jsx";

export default function Dashboard() {
  const { state, update, goTo } = useContract();
  const [judul, setJudul] = useState(state.judul);

  const lanjut = () => {
    if (judul.trim()) {
      update({ judul: judul.trim() });
      goTo(1);
    }
  };

  const umkmBg =
    "https://images.unsplash.com/photo-1598063414123-d8fd7fb018b2?q=50&w=800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div
      className="min-h-[calc(100vh-68px)] flex items-center justify-center bg-cover bg-center px-4 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${umkmBg})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/15 pointer-events-none" />

      <div className="relative bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl p-8 sm:p-12 w-full max-w-lg text-center border border-white/60">
        <h1 className="font-bold text-2xl sm:text-3xl text-gray-900 mb-3 tracking-tight">
          Kriteria Jual Beli
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mb-8">
          Tentukan kriteria dari dokumen perjanjian jual - beli
        </p>

        <div className="space-y-4">
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="PERJANJIAN JUAL - BELI..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-center text-sm text-gray-800 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-xs"
            onKeyDown={(e) => e.key === "Enter" && judul.trim() && lanjut()}
          />
          <div className="flex justify-center">
            <button
              onClick={lanjut}
              className="w-full sm:w-44 bg-[#0088FF] hover:bg-blue-600 active:scale-[0.98] transition-all text-white font-bold py-2.5 rounded-lg text-sm shadow-sm cursor-pointer"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
