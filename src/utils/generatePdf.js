import html2pdf from "html2pdf.js";

/**
 * Ambil elemen preview dokumen yang sedang tampil di layar dan cetak ke PDF.
 * Karena diambil langsung dari DOM yang sedang dirender, hasil PDF selalu
 * sama persis dengan apa yang dilihat user di panel kanan.
 */
export async function downloadPdf(filename) {
  const source = document.getElementById("document-content");
  if (!source) throw new Error("Elemen dokumen tidak ditemukan");

  // clone supaya styling layar (scroll area) tidak ikut mempengaruhi hasil cetak
  const clone = source.cloneNode(true);
  clone.style.padding = "0px";
  clone.style.width = "451pt"; // 595.28 pt (A4 width) - 144 pt (72 pt margins left/right) = 451.28 pt
  clone.style.margin = "0px";
  clone.style.background = "white";
  clone.style.color = "black";

  const opt = {
    margin: 72, // 1 inch margin all sides to match docx standard
    filename: `${filename}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"] },
  };

  await html2pdf().set(opt).from(clone).save();
}
