import { useState } from "react";
import { useContract } from "../../context/ContractContext.jsx";
import FormInput from "../FormInput.jsx";
import StepNav from "../StepNav.jsx";
import { downloadDocx } from "../../utils/generateDocx.js";
import { downloadPdf } from "../../utils/generatePdf.js";
import { isStepComplete } from "../../utils/validation.js";

function slugFilename(judul) {
  let base = (judul || "").trim().toUpperCase();
  // Hapus prefiks 'PERJANJIAN JUAL BELI' atau sejenisnya jika sudah ada di input user agar tidak duplikat
  base = base.replace(/^PERJANJIAN\s*(?:JUAL\s*-\s*BELI|JUAL\s*BELI)?\s*/gi, "").trim();
  const filename = base ? `PERJANJIAN - JUAL BELI ${base}` : "PERJANJIAN - JUAL BELI";
  return filename.replace(/[\\/:*?"<>|]+/g, "-").trim();
}

export default function Step5() {
  const { state, update, goTo, reset } = useContract();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const complete = isStepComplete(5, state);

  const simpan = async () => {
    setSaving(true);
    setError("");
    try {
      const filename = slugFilename(state.judul);
      await downloadDocx(state, filename);
      await downloadPdf(filename);
      // Website ini statis & tidak menyimpan data — begitu file diunduh,
      // seluruh isian langsung dihapus dari memori dan user kembali ke awal.
      reset();
    } catch (err) {
      console.error(err);
      setError("Gagal membuat file. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl mb-1">Masukkan Keperluan Tambahan</h2>
      <p className="text-gray-400 mb-6">
        Keperluan tambahan akan digunakan sebagai alamat pengantaran dan alamat peresmian kontrak serta saksi.
      </p>

      <FormInput
        label="Alamat Pengantaran"
        value={state.alamatPengantaran}
        onChange={(v) => update({ alamatPengantaran: v })}
        placeholder="Masukkan Alamat Pengantaran…."
      />
      <FormInput
        label="Alamat Peresmian"
        value={state.alamatPeresmian}
        onChange={(v) => update({ alamatPeresmian: v })}
        placeholder="Masukkan Alamat Peresmian…."
      />
      <FormInput
        label="Saksi 1"
        value={state.saksi1}
        onChange={(v) => update({ saksi1: v })}
        placeholder="Masukkan Nama Saksi 1…."
      />
      <FormInput
        label="Saksi 2"
        value={state.saksi2}
        onChange={(v) => update({ saksi2: v })}
        placeholder="Masukkan Nama Saksi 2…."
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <StepNav
        onPrev={() => goTo(4)}
        onNext={simpan}
        nextLabel="Simpan"
        loading={saving}
        nextDisabled={!complete}
      />
    </div>
  );
}
