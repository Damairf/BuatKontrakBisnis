import { useContract } from "../../context/ContractContext.jsx";
import StepNav from "../StepNav.jsx";
import { isStepComplete } from "../../utils/validation.js";

const SATUAN_OPTIONS = ["Unit", "Kg", "Ton", "Liter"];

function BarangRow({ item, onChange, onRemove, showRemove }) {
  return (
    <div className="grid grid-cols-4 gap-2.5 mb-2.5 items-end">
      <div>
        <input
          value={item.barang}
          onChange={(e) => onChange({ barang: e.target.value })}
          placeholder="Barang…."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-500 transition-all"
        />
      </div>
      <div>
        <input
          value={item.harga}
          onChange={(e) =>
            onChange({ harga: e.target.value.replace(/\D/g, "") })
          }
          placeholder="Harga…."
          inputMode="numeric"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-500 transition-all"
        />
      </div>
      <div>
        <input
          value={item.jumlah}
          onChange={(e) =>
            onChange({ jumlah: e.target.value.replace(/\D/g, "") })
          }
          placeholder="Jumlah…."
          inputMode="numeric"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-500 transition-all"
        />
      </div>
      <div className="flex gap-1.5 items-center">
        <select
          value={item.satuan}
          onChange={(e) => onChange({ satuan: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-2.5 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-500 transition-all bg-white"
        >
          {SATUAN_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            title="Hapus baris"
            className="text-red-500 hover:text-red-700 px-1 font-bold text-base cursor-pointer"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

function BarangSection({
  title,
  field,
  list,
  addBarang,
  removeBarang,
  updateBarang,
  addLabel,
}) {
  return (
    <div className="mb-5">
      <p className="mb-1.5 text-sm text-gray-800 font-medium">
        <span className="text-red-500 mr-1">*</span>
        {title}
      </p>
      <div className="grid grid-cols-4 gap-2.5 mb-1 text-xs font-semibold text-gray-600">
        <span>Barang</span>
        <span>Harga</span>
        <span>Jumlah</span>
        <span>Satuan</span>
      </div>
      {list.map((item, i) => (
        <BarangRow
          key={i}
          item={item}
          onChange={(patch) => updateBarang(field, i, patch)}
          onRemove={() => removeBarang(field, i)}
          showRemove={list.length > 1}
        />
      ))}
      <button
        type="button"
        onClick={() => addBarang(field)}
        className="w-full bg-gray-100 hover:bg-gray-200 transition text-gray-700 font-semibold py-2 rounded-lg text-sm border border-gray-200 shadow-xs cursor-pointer"
      >
        {addLabel} +
      </button>
    </div>
  );
}

function PengirimanRow({ item, onChange, onRemove, showRemove }) {
  return (
    <div className="grid grid-cols-3 gap-2.5 mb-2.5 items-end">
      <div>
        <input
          value={item.barang}
          onChange={(e) => onChange({ barang: e.target.value })}
          placeholder="Barang…."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-500 transition-all"
        />
      </div>
      <div>
        <input
          value={item.jumlah}
          onChange={(e) =>
            onChange({ jumlah: e.target.value.replace(/\D/g, "") })
          }
          placeholder="Jumlah…."
          inputMode="numeric"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-500 transition-all"
        />
      </div>
      <div className="flex gap-1.5 items-center">
        <select
          value={item.satuan}
          onChange={(e) => onChange({ satuan: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-2.5 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-500 transition-all bg-white"
        >
          {SATUAN_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            title="Hapus baris"
            className="text-red-500 hover:text-red-700 px-1 font-bold text-base cursor-pointer"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

function PengirimanSection({
  title,
  field,
  list,
  addBarang,
  removeBarang,
  updateBarang,
  addLabel,
}) {
  return (
    <div className="mb-5">
      <p className="mb-1.5 text-sm text-gray-800 font-medium">
        <span className="text-red-500 mr-1">*</span>
        {title}
      </p>
      <div className="grid grid-cols-3 gap-2.5 mb-1 text-xs font-semibold text-gray-600">
        <span>Barang</span>
        <span>Jumlah</span>
        <span>Satuan</span>
      </div>
      {list.map((item, i) => (
        <PengirimanRow
          key={i}
          item={item}
          onChange={(patch) => updateBarang(field, i, patch)}
          onRemove={() => removeBarang(field, i)}
          showRemove={list.length > 1}
        />
      ))}
      <button
        type="button"
        onClick={() => addBarang(field)}
        className="w-full bg-gray-100 hover:bg-gray-200 transition text-gray-700 font-semibold py-2 rounded-lg text-sm border border-gray-200 shadow-xs cursor-pointer"
      >
        {addLabel} +
      </button>
    </div>
  );
}

export default function Step2() {
  const { state, addBarang, removeBarang, updateBarang, goTo } = useContract();
  const complete = isStepComplete(2, state);

  return (
    <div>
      <h2 className="font-bold text-2xl mb-1">Masukkan Ketentuan Pihak</h2>
      <p className="text-gray-400 text-sm mb-5">
        Ketentuan pihak akan digunakan sebagai perjanjian kesepakatan antara
        kedua belah pihak.
      </p>

      <BarangSection
        title="Jumlah keseluruhan barang yang dijual dan dibeli"
        field="barangKeseluruhan"
        list={state.barangKeseluruhan}
        addBarang={addBarang}
        removeBarang={removeBarang}
        updateBarang={updateBarang}
        addLabel="Tambah Barang Keseluruhan"
      />

      <BarangSection
        title="Harga barang yang dijual per satuan"
        field="hargaPerSatuan"
        list={state.hargaPerSatuan}
        addBarang={addBarang}
        removeBarang={removeBarang}
        updateBarang={updateBarang}
        addLabel="Tambah Harga Barang"
      />

      {/* Pemisah visual */}
      <div className="border-t border-gray-200 my-4" />
      <p className="text-gray-400 text-sm mb-5">Pengiriman Barang (Pasal 5)</p>

      <PengirimanSection
        title="Jumlah Pengiriman Barang Tahap 1"
        field="barangPengirimanTahap1"
        list={state.barangPengirimanTahap1}
        addBarang={addBarang}
        removeBarang={removeBarang}
        updateBarang={updateBarang}
        addLabel="Tambah Barang Tahap 1"
      />

      <PengirimanSection
        title="Jumlah Pengiriman Barang Tahap 2"
        field="barangPengirimanTahap2"
        list={state.barangPengirimanTahap2}
        addBarang={addBarang}
        removeBarang={removeBarang}
        updateBarang={updateBarang}
        addLabel="Tambah Barang Tahap 2"
      />

      <StepNav
        onPrev={() => goTo(1)}
        onNext={() => goTo(3)}
        nextDisabled={!complete}
      />
    </div>
  );
}
