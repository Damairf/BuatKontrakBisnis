import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Tab,
  AlignmentType,
  LevelFormat,
} from "docx";
import { saveAs } from "file-saver";
import { buildContractModel } from "./documentModel.js";

const FONT = "Times New Roman";
const SIZE = 24;
const LINE_SPACING = 276;

function run(text, opts = {}) {
  return new TextRun({ text, font: FONT, size: SIZE, ...opts });
}

// tab sebagai elemen terpisah, bukan karakter "\t" di dalam teks —
// supaya konsisten dirender oleh Word maupun viewer sederhana lain
function tab() {
  return new TextRun({ children: [new Tab()], font: FONT, size: SIZE });
}

function para(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 160, line: LINE_SPACING, lineRule: "auto" },
    children: [run(text)],
    ...opts,
  });
}

function keyValueParagraph(label, value) {
  return new Paragraph({
    tabStops: [{ type: "left", position: 2400 }],
    spacing: { after: 40, line: LINE_SPACING, lineRule: "auto" },
    children: [run(label), tab(), run(`: ${value}`)],
  });
}

const numbering = {
  config: [
    {
      reference: "numbered-list",
      levels: [
        {
          level: 0,
          format: LevelFormat.DECIMAL,
          text: "%1.",
          alignment: AlignmentType.START,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        },
      ],
    },
    {
      reference: "lettered-list",
      levels: [
        {
          level: 0,
          format: LevelFormat.LOWER_LETTER,
          text: "%1.",
          alignment: AlignmentType.START,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        },
      ],
    },
    {
      reference: "sublist-outer",
      levels: [
        {
          level: 0,
          format: LevelFormat.DECIMAL,
          text: "%1.",
          alignment: AlignmentType.START,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        },
        {
          level: 1,
          format: LevelFormat.LOWER_LETTER,
          text: "%2.",
          alignment: AlignmentType.START,
          style: { paragraph: { indent: { left: 1440, hanging: 360 } } },
        },
      ],
    },
  ],
};

function numberedItem(text, reference, level = 0, instance) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    numbering: { reference, level, instance },
    spacing: { after: 120, line: LINE_SPACING, lineRule: "auto" },
    children: [run(text)],
  });
}

function blocksToParagraphs(blocks) {
  const out = [];
  let numberedInstance = 1;
  let letteredInstance = 1;
  let sublistInstance = 1;

  blocks.forEach((block) => {
    switch (block.type) {
      case "title":
        out.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240, line: LINE_SPACING, lineRule: "auto" },
            children: [run(block.text, { bold: true, size: 28 })],
          }),
        );
        break;

      case "para":
        out.push(para(block.text));
        break;

      case "partyblock": {
        const rows = [
          ["Nama", block.pihak.nama || "…."],
          ["Umur", block.pihak.umur || "…."],
          ["Pekerjaan/Jabatan", block.pihak.pekerjaan || "…."],
          ["Perusahaan", block.pihak.perusahaan || "…."],
          ["Alamat", block.pihak.alamat || "…."],
        ];
        rows.forEach(([k, v]) => out.push(keyValueParagraph(k, v)));
        out.push(
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: {
              after: 200,
              before: 80,
              line: LINE_SPACING,
              lineRule: "auto",
            },
            children: [
              run(
                `Dalam hal ini bertindak sebagai ${block.pihak.pekerjaan || "…."} dari ${block.pihak.perusahaan || "…."}, beralamat di ${block.pihak.alamat || "…."} (selanjutnya disebut sebagai `,
              ),
              run(`“${block.label}”`, { bold: true }),
              run(");"),
            ],
          }),
        );
        break;
      }

      case "numbered":
        block.items.forEach((it) =>
          out.push(numberedItem(it, "numbered-list", 0, numberedInstance)),
        );
        numberedInstance += 1;
        break;

      case "lettered":
        block.items.forEach((it) =>
          out.push(numberedItem(it, "lettered-list", 0, letteredInstance)),
        );
        letteredInstance += 1;
        break;

      case "pasal":
        out.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 240,
              after: 0,
              line: LINE_SPACING,
              lineRule: "auto",
            },
            children: [run(`Pasal ${block.nomor}`, { bold: true })],
          }),
        );
        out.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 160, line: LINE_SPACING, lineRule: "auto" },
            children: [run(block.judul, { bold: true })],
          }),
        );
        break;

      case "keyvalue":
        block.rows.forEach(([k, v]) => out.push(keyValueParagraph(k, v)));
        break;

      case "sublist":
        block.groups.forEach((g) => {
          out.push(
            new Paragraph({
              numbering: {
                reference: "sublist-outer",
                level: 0,
                instance: sublistInstance,
              },
              spacing: { after: 60, line: LINE_SPACING, lineRule: "auto" },
              children: [run(g.label, { bold: true })],
            }),
          );
          g.items.forEach((it) => {
            out.push(
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                numbering: {
                  reference: "sublist-outer",
                  level: 1,
                  instance: sublistInstance,
                },
                spacing: { after: 80, line: LINE_SPACING, lineRule: "auto" },
                children: [run(it)],
              }),
            );
          });
        });
        sublistInstance += 1;
        break;

      case "signature": {
        out.push(
          new Paragraph({
            spacing: { before: 400, line: LINE_SPACING, lineRule: "auto" },
            tabStops: [
              { type: "center", position: 2300 },
              { type: "center", position: 7000 },
            ],
            children: [
              tab(),
              run(block.kiri.label),
              tab(),
              run(block.kanan.label),
            ],
          }),
        );
        for (let i = 0; i < 3; i += 1)
          out.push(new Paragraph({ children: [run("")] }));
        out.push(
          new Paragraph({
            spacing: { line: LINE_SPACING, lineRule: "auto" },
            tabStops: [
              { type: "center", position: 2300 },
              { type: "center", position: 7000 },
            ],
            children: [
              tab(),
              run(block.kiri.nama, { bold: true }),
              tab(),
              run(block.kanan.nama, { bold: true }),
            ],
          }),
        );
        break;
      }

      default:
        break;
    }
  });

  return out;
}

export async function generateDocxBlob(state) {
  const model = buildContractModel(state);
  const children = blocksToParagraphs(model.blocks);

  const doc = new Document({
    numbering,
    styles: {
      default: {
        document: {
          run: { font: FONT, size: SIZE },
          paragraph: { spacing: { line: LINE_SPACING, lineRule: "auto" } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children,
      },
    ],
  });

  return Packer.toBlob(doc);
}

export async function downloadDocx(state, filename) {
  const blob = await generateDocxBlob(state);
  saveAs(blob, `${filename}.docx`);
}
