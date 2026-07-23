import { buildContractModel } from "../utils/documentModel.js";

function PartyBlock({ label, pihak, isLast }) {
  const rows = [
    ["Nama", pihak.nama],
    ["Umur", pihak.umur],
    ["Pekerjaan/Jabatan", pihak.pekerjaan],
    ["Perusahaan", pihak.perusahaan],
    ["Alamat", pihak.alamat],
  ];
  return (
    <div className="pl-6 sm:pl-12 mb-3">
      {rows.map(([k, v]) => (
        <div key={k} className="flex text-[12pt] leading-relaxed">
          <span className="w-28 sm:w-48 shrink-0">{k}</span>
          <span className="mr-2">:</span>
          <span>{v || "…."}</span>
        </div>
      ))}
      <p className="text-[12pt] text-justify mt-2 leading-relaxed">
        Dalam hal ini bertindak sebagai {pihak.pekerjaan || "…."} dari{" "}
        {pihak.perusahaan || "…."}, beralamat di {pihak.alamat || "…."}{" "}
        (selanjutnya disebut sebagai <strong>“{label}”</strong>)
        {isLast ? ";" : ";"}
      </p>
    </div>
  );
}

function Block({ block }) {
  switch (block.type) {
    case "title":
      return (
        <h1 className="text-center font-bold text-[14pt] my-6 leading-normal uppercase">
          {block.text}
        </h1>
      );

    case "para":
      return (
        <p className="text-[12pt] text-justify my-4 leading-relaxed">
          {block.text}
        </p>
      );

    case "partyblock":
      return (
        <PartyBlock
          label={block.label}
          pihak={block.pihak}
          isLast={block.isLast}
        />
      );

    case "numbered":
      return (
        <ol className="list-decimal list-outside pl-6 sm:pl-12 space-y-2 my-4 text-[12pt] text-justify">
          {block.items.map((it, i) => (
            <li key={i} className="leading-relaxed pl-1">
              {it}
            </li>
          ))}
        </ol>
      );

    case "lettered":
      return (
        <ol className="list-[lower-alpha] list-outside pl-6 sm:pl-12 space-y-2 my-4 text-[12pt] text-justify">
          {block.items.map((it, i) => (
            <li key={i} className="leading-relaxed pl-1">
              {it}
            </li>
          ))}
        </ol>
      );

    case "pasal":
      return (
        <div className="text-center mt-8 mb-4">
          <p className="font-bold text-[12pt] leading-normal">
            Pasal {block.nomor}
          </p>
          <p className="font-bold text-[12pt] leading-normal">{block.judul}</p>
        </div>
      );

    case "keyvalue":
      return (
        <div className="pl-6 sm:pl-12 my-4">
          {block.rows.map(([k, v]) => (
            <div key={k} className="flex text-[12pt] leading-relaxed">
              <span className="w-28 sm:w-48 shrink-0">{k}</span>
              <span className="mr-2">:</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      );

    case "sublist":
      return (
        <ol className="list-decimal list-outside pl-6 sm:pl-12 space-y-4 my-4 text-[12pt] text-justify">
          {block.groups.map((g, i) => (
            <li key={i} className="leading-relaxed pl-1">
              <strong>{g.label}</strong>
              <ol className="list-[lower-alpha] list-outside pl-5 mt-1.5 space-y-1.5">
                {g.items.map((it, j) => (
                  <li key={j} className="leading-relaxed pl-1">
                    {it}
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      );

    case "signature":
      return (
        <div className="grid grid-cols-2 gap-4 mt-12 text-center text-[12pt]">
          <div>
            <p>{block.kiri.label}</p>
            {/* <p>&nbsp;</p> */}
            <p className="mb-20">&nbsp;</p>
            <p className="font-semibold underline underline-offset-4">
              {block.kiri.nama}
            </p>
          </div>
          <div>
            <p>{block.kanan.label}</p>
            {/* <p>&nbsp;</p> */}
            <p className="mb-20">&nbsp;</p>
            <p className="font-semibold underline underline-offset-4">
              {block.kanan.nama}
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default function DocumentPreview({ state }) {
  const model = buildContractModel(state);

  return (
    <div className="doc-page bg-white rounded-xl shadow-sm p-6 sm:p-10 border border-gray-200 w-full lg:h-full lg:overflow-y-auto lg:doc-scroll">
      <div id="document-content">
        {model.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </div>
  );
}
