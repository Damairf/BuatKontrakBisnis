import { useState, useEffect, useRef, forwardRef } from "react";
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

const Header = forwardRef(function Header(_, ref) {
  return (
    <header
      ref={ref}
      className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs"
    >
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
});

function Wizard({ headerHeight }) {
  const { state, goTo, reset } = useContract();
  const [showDelete, setShowDelete] = useState(false);
  const desktopLeftPanelRef = useRef(null);

  useEffect(() => {
    if (desktopLeftPanelRef.current) {
      desktopLeftPanelRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [state.page]);

  const StepComponent = {
    1: Step1,
    2: Step2,
    3: Step3,
    4: Step4,
    5: Step5,
  }[state.page];

  return (
    <>
      {/* Step bar mobile: full-bleed, mentok kiri-kanan, nempel persis di bawah header */}
      <div
        className="lg:hidden sticky z-20 w-full"
        style={{ top: headerHeight }}
      >
        <StepIndicator
          current={state.page}
          state={state}
          onSelect={(n) => goTo(n)}
          onHapus={() => setShowDelete(true)}
        />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pb-4 pt-4 lg:pt-4">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Desktop Left Panel */}
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

          <div className="lg:col-span-7 space-y-6 lg:space-y-0">
            <div className="block lg:hidden bg-white rounded-xl shadow-sm p-5 border border-gray-200 mt-4">
              {StepComponent && <StepComponent />}
            </div>

            <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-100px)]">
              <DocumentPreview state={state} />
            </div>
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
    </>
  );
}

function Shell() {
  const { state } = useContract();
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(72);

  useEffect(() => {
    function measure() {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="min-h-screen">
      <Header ref={headerRef} />
      {state.page === "dashboard" ? (
        <Dashboard />
      ) : (
        <Wizard headerHeight={headerHeight} />
      )}
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
