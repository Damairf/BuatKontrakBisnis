import { useContract } from "../../context/ContractContext.jsx";
import FormInput from "../FormInput.jsx";
import StepNav from "../StepNav.jsx";
import { formatTanggalIndonesia } from "../../utils/dayName.js";
import { isStepComplete } from "../../utils/validation.js";

function PihakForm({ title, pihak, onChange }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <FormInput
        label="Nama"
        value={pihak.nama}
        onChange={(v) => onChange({ nama: v })}
        placeholder="Masukkan Nama…."
      />
      <FormInput
        label="Umur"
        value={pihak.umur}
        onChange={(v) => onChange({ umur: v.replace(/\D/g, "") })}
        placeholder="Masukkan Umur…."
      />
      <FormInput
        label="Pekerjaan/Jabatan"
        value={pihak.pekerjaan}
        onChange={(v) => onChange({ pekerjaan: v })}
        placeholder="Masukkan Pekerjaan/Jabatan…."
      />
      <FormInput
        label="Perusahaan"
        value={pihak.perusahaan}
        onChange={(v) => onChange({ perusahaan: v })}
        placeholder="Masukkan Perusahaan…."
      />
      <FormInput
        label="Alamat"
        value={pihak.alamat}
        onChange={(v) => onChange({ alamat: v })}
        placeholder="Masukkan Alamat…."
      />
    </div>
  );
}

export default function Step1() {
  const { state, updatePihak, update, goTo } = useContract();
  const hariOtomatis = formatTanggalIndonesia(state.tanggalPembuatan);
  const complete = isStepComplete(1, state);

  return (
    <div>
      <h2 className="font-bold text-2xl mb-1">Masukkan Informasi Data Diri</h2>
      <p className="text-gray-400 mb-6">
        Data diri akan digunakan untuk keterangan perjanjian antara kedua belah
        pihak.
      </p>

      <PihakForm
        title="Pihak Pertama (Penjual)"
        pihak={state.pihak1}
        onChange={(p) => updatePihak("pihak1", p)}
      />
      <PihakForm
        title="Pihak Kedua (Pembeli)"
        pihak={state.pihak2}
        onChange={(p) => updatePihak("pihak2", p)}
      />

      <div className="mb-2">
        <h3 className="font-semibold text-gray-800 text-sm mb-1.5">Tanggal Pembuatan</h3>
        <label className="block text-gray-700 font-medium text-xs mb-1">Tanggal/Bulan/Tahun</label>
        <input
          type="date"
          value={state.tanggalPembuatan}
          onChange={(e) => update({ tanggalPembuatan: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-500 transition-all"
        />
      </div>

      <StepNav
        prevDisabled
        onPrev={() => {}}
        onNext={() => goTo(2)}
        nextDisabled={!complete}
      />
    </div>
  );
}
