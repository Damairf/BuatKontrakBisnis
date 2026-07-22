import { canNavigateToStep, isStepComplete } from "../utils/validation.js";

const STEP_LABELS = {
  1: "Informasi Data Diri",
  2: "Ketentuan Pihak",
  3: "Ketentuan Umum",
  4: "Alat Pembayaran",
  5: "Alamat Tambahan",
};

export default function StepIndicator({ current, state, onSelect, onHapus }) {
  return (
    <div className="bg-white rounded-2xl lg:rounded-xl shadow-md lg:shadow-sm p-2.5 lg:p-4 border border-gray-200/80 lg:border-gray-200 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-3 py-5 lg:py-3.5 min-h-[380px] lg:min-h-0 w-[60px] sm:w-[68px] lg:w-full shrink-0">
      <div className="flex flex-col lg:flex-row items-center gap-3.5 lg:gap-3">
        {[1, 2, 3, 4, 5].map((n) => {
          const isCurrent = current === n;
          const isDone = isStepComplete(n, state);
          const canAccess = canNavigateToStep(n, state);
          const color = isCurrent
            ? "bg-[#0088FF]"
            : isDone
              ? "bg-[#32CD32]"
              : "bg-gray-300";
          return (
            <button
              key={n}
              type="button"
              title={STEP_LABELS[n]}
              disabled={!canAccess}
              onClick={() => canAccess && onSelect(n)}
              className={`w-11 h-11 sm:w-12 sm:h-12 lg:w-12 lg:h-12 rounded-full text-white font-bold text-lg flex items-center justify-center transition-all duration-200 ${color} ${
                canAccess
                  ? "hover:opacity-90 hover:scale-105 active:scale-95 cursor-pointer"
                  : "cursor-not-allowed opacity-60"
              } shadow-sm`}
            >
              {n}
            </button>
          );
        })}
      </div>

      {/* Tombol Hapus Desktop */}
      <button
        type="button"
        onClick={onHapus}
        className="hidden lg:block bg-[#FF0000] hover:bg-red-600 active:scale-95 transition-all text-white font-bold px-7 py-2.5 rounded-xl text-sm shadow-sm cursor-pointer"
      >
        Hapus
      </button>

      {/* Tombol Hapus Mobile */}
      <button
        type="button"
        onClick={onHapus}
        title="Hapus Kontrak"
        className="block lg:hidden w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FF0000] hover:bg-red-600 active:scale-95 transition-all text-white flex items-center justify-center shadow-md cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    </div>
  );
}
