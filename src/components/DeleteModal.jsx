export default function DeleteModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-100 transform transition-all">
        {/* SVG tempat sampah merah */}
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-9 h-9 text-[#FF0000]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        <h2 className="font-bold text-xl text-gray-900 mb-2">
          Apakah anda yakin ingin menghapusnya?
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Data yang sudah dihapus tidak dapat dipulihkan kembali
        </p>

        <div className="flex justify-center gap-4">
          {/* Button Batal: warna dasar #FF0000 dan hover red-600 persis seperti button Hapus */}
          <button
            onClick={onCancel}
            className="bg-[#FF0000] hover:bg-red-600 transition text-white font-bold px-8 py-3 rounded-xl text-sm shadow-sm cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="bg-black hover:bg-gray-800 transition text-white font-bold px-10 py-3 rounded-xl text-sm shadow-sm cursor-pointer"
          >
            Iya
          </button>
        </div>
      </div>
    </div>
  );
}
