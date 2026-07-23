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
    <div className="bg-white rounded-none lg:rounded-xl shadow-sm border-b lg:border border-gray-200 px-6 py-3 sm:px-10 sm:py-4 lg:p-4 flex flex-row items-center justify-between gap-3 w-full">
      <div className="flex flex-row items-center gap-2 sm:gap-3 overflow-x-auto">
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
              className={`w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 shrink-0 rounded-full text-white font-bold text-base sm:text-lg flex items-center justify-center transition-all duration-200 ${color} ${
                canAccess
                  ? "hover:opacity-90 cursor-pointer"
                  : "cursor-not-allowed opacity-60"
              } shadow-sm`}
            >
              {n}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onHapus}
        className="bg-[#FF0000] hover:bg-red-600 active:scale-95 transition-all text-white font-bold px-4 sm:px-7 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-sm cursor-pointer shrink-0"
      >
        Hapus
      </button>
    </div>
  );
}
