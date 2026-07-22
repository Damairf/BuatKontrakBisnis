import { useContract } from "../../context/ContractContext.jsx";
import FormInput from "../FormInput.jsx";
import StepNav from "../StepNav.jsx";
import { isStepComplete } from "../../utils/validation.js";

export default function Step4() {
  const { state, update, goTo } = useContract();
  const isTransfer = state.metodePembayaran === "transfer";
  const complete = isStepComplete(4, state);

  return (
    <div>
      <h2 className="font-bold text-2xl mb-1">Masukkan Alat Pembayaran</h2>
      <p className="text-gray-400 mb-6">
        Alat pembayaran akan digunakan sebagai metode pembayaran yang disepakati oleh kedua belah pihak.
      </p>

      <p className="font-semibold text-gray-800 text-sm mb-2">Pilih Metode Pembayaran</p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          type="button"
          onClick={() => update({ metodePembayaran: "transfer" })}
          className={`py-2.5 rounded-lg font-bold text-sm transition cursor-pointer ${
            isTransfer ? "bg-blue-500 text-white shadow-xs" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Transfer
        </button>
        <button
          type="button"
          onClick={() => update({ metodePembayaran: "tunai" })}
          className={`py-2.5 rounded-lg font-bold text-sm transition cursor-pointer ${
            !isTransfer ? "bg-blue-500 text-white shadow-xs" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Tunai
        </button>
      </div>

      {isTransfer ? (
        <>
          <FormInput
            label="Nama Bank"
            value={state.namaBank}
            onChange={(v) => update({ namaBank: v })}
            placeholder="Masukkan Nama Bank…."
          />
          <FormInput
            label="Nomor Rekening"
            value={state.nomorRekening}
            onChange={(v) => update({ nomorRekening: v.replace(/\D/g, "") })}
            placeholder="Masukkan Nomor Rekening…."
          />
          <FormInput
            label="Atas Nama"
            value={state.atasNamaRekening}
            onChange={(v) => update({ atasNamaRekening: v })}
            placeholder="Masukkan Nama Pemilik…."
          />
        </>
      ) : (
        <p className="text-gray-600 mb-4">
          Pembayaran wajib menggunakan uang tunai secara langsung, tidak melalui
          transfer atau menggunakan cek maupun bilyet.
        </p>
      )}

      <StepNav onPrev={() => goTo(3)} onNext={() => goTo(5)} nextDisabled={!complete} />
    </div>
  );
}
