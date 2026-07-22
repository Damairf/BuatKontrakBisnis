export default function StepNav({ onPrev, onNext, nextLabel = "Selanjutnya", prevDisabled = false, nextDisabled = false, loading = false }) {
  return (
    <div className="flex gap-3 mt-5">
      <button
        type="button"
        onClick={onPrev}
        disabled={prevDisabled}
        className="flex-1 bg-blue-500 disabled:bg-gray-300 hover:bg-blue-600 transition text-white font-bold py-2.5 rounded-lg text-sm shadow-xs cursor-pointer disabled:cursor-not-allowed"
      >
        Sebelumnya
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || loading}
        className={`flex-1 ${nextLabel === "Simpan" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"} disabled:bg-gray-300 transition text-white font-bold py-2.5 rounded-lg text-sm shadow-xs cursor-pointer disabled:cursor-not-allowed`}
      >
        {loading ? "Memproses…" : nextLabel}
      </button>
    </div>
  );
}
