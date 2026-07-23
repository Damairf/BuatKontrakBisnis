import html2pdf from "html2pdf.js";

export async function downloadPdf(filename) {
  const source = document.getElementById("document-content");
  if (!source) throw new Error("Elemen dokumen tidak ditemukan");

  const clone = source.cloneNode(true);
  clone.style.padding = "0px";
  clone.style.width = "451pt";
  clone.style.margin = "0px";
  clone.style.background = "white";
  clone.style.color = "black";
  clone.style.lineHeight = "1.15";
  clone.querySelectorAll("*").forEach((el) => {
    el.style.lineHeight = "1.15";
  });

  const opt = {
    margin: 72,
    filename: `${filename}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"] },
  };

  await html2pdf().set(opt).from(clone).save();
}
