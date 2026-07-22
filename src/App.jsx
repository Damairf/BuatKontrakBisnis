import { useMemo, useState, useEffect, useRef } from "react";
import { ContractProvider, useContract } from "./context/ContractContext.jsx";
import Dashboard from "./components/Dashboard.jsx";
import StepIndicator from "./components/StepIndicator.jsx";
import DeleteModal from "./components/DeleteModal.jsx";
import DocumentPreview from "./components/DocumentPreview.jsx";
import Step1 from "./components/steps/Step1.jsx";
import Step2 from "./components/steps/Step2.jsx";
import Step3 from "./components/steps/Step3.jsx";
import Step4 from "./components/steps/Step4.jsx";
import Step5 from "./components/steps/Step5.jsx";

import logoKkn from "./assets/Logo_KKN_Kelurahan_Kaliancar.png";

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1600px] mx-auto px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4 select-none">
          <img
            src={logoKkn}
            alt="Logo KKN Kelurahan Kaliancar"
            className="h-11 w-auto object-contain"
          />
          <div className="w-px h-9 bg-gray-300" />
          <div>
            <h1 className="font-bold text-xl leading-tight text-gray-900">
              Pembuatan Kontrak Jual Beli
            </h1>
            <p className="text-gray-500 text-xs font-medium tracking-wide">
              Oleh Tim II KKN Kaliancar UNDIP 2026
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function Wizard() {
  const { state, goTo, reset } = useContract();
  const [showDelete, setShowDelete] = useState(false);

  const rightScrollContainerRef = useRef(null);
  const desktopLeftPanelRef = useRef(null);

  useEffect(() => {
    // Reset scroll ke atas saat langkah/halaman berubah
    if (rightScrollContainerRef.current) {
      rightScrollContainerRef.current.scrollTop = 0;
    }
    if (desktopLeftPanelRef.current) {
      desktopLeftPanelRef.current.scrollTop = 0;
    }
  }, [state.page]);

  const StepComponent = {
    1: Step1,
    2: Step2,
    3: Step3,
    4: Step4,
    5: Step5,
  }[state.page];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4">
      {/* On desktop (lg:grid): standard grid layout. On mobile (flex): sidebar left, content right */}
      <div className="flex lg:grid lg:grid-cols-12 gap-4 lg:gap-6 h-[calc(100vh-76px)] lg:h-auto overflow-hidden lg:overflow-visible">
        {/* Left Sidebar (Mobile only) */}
        <div className="flex-none self-start sticky top-0 z-20 lg:hidden">
          <StepIndicator
            current={state.page}
            state={state}
            onSelect={(n) => goTo(n)}
            onHapus={() => setShowDelete(true)}
          />
        </div>

        {/* Desktop Left Panel (lg only) - keeps original structure */}
        <div
          ref={desktopLeftPanelRef}
          className="hidden lg:flex lg:col-span-5 flex-col gap-4 max-h-[calc(100vh-100px)] overflow-y-auto pr-1"
        >
          <StepIndicator
            current={state.page}
            state={state}
            onSelect={(n) => goTo(n)}
            onHapus={() => setShowDelete(true)}
          />
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            {StepComponent && <StepComponent />}
          </div>
        </div>

        {/* Mobile Right Content Area / Desktop Right Panel */}
        {/* On Mobile: scrolls, form on top, document below */}
        {/* On Desktop: document sticky on the right */}
        <div
          ref={rightScrollContainerRef}
          className="flex-1 lg:flex-none lg:col-span-7 overflow-y-auto overflow-x-hidden lg:overflow-visible h-full lg:h-auto space-y-6 lg:space-y-0 pb-10 lg:pb-0 doc-scroll"
        >
          {/* On Mobile: Show Form here (on top) */}
          <div className="block lg:hidden bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            {StepComponent && <StepComponent />}
          </div>

          {/* Document Preview */}
          {/* On Desktop, make it sticky top-4 with fixed height */}
          <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-100px)]">
            <DocumentPreview state={state} />
          </div>
        </div>
      </div>

      {showDelete && (
        <DeleteModal
          onCancel={() => setShowDelete(false)}
          onConfirm={() => {
            reset();
            setShowDelete(false);
          }}
        />
      )}
    </div>
  );
}

function Shell() {
  const { state } = useContract();
  return (
    <div className="min-h-screen">
      <Header />
      {state.page === "dashboard" ? <Dashboard /> : <Wizard />}
    </div>
  );
}

export default function App() {
  return (
    <ContractProvider>
      <Shell />
    </ContractProvider>
  );
}
