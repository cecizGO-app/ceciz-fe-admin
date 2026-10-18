import { useState } from "react";
import { LoginPage } from "./pages/auth/LoginPage";
import { BatchDashboardPage } from "./pages/batches/BatchDashboardPage";
import { BatchInputPage } from "./pages/batches/BatchInputPage";
import { TrackingPage } from "./pages/tracking/TrackingPage";
import { PaymentVerificationPage } from "./pages/verification/PaymentVerificationPage";
import { AdminLayout } from "./components/layout/AdminLayout";

export function App() {
  const [currentPage, setCurrentPage] = useState<
    "batch-list" | "batch-new" | "tracking" | "verifikasi" | "login"
  >("verifikasi");

  if (currentPage === "login") {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setCurrentPage("verifikasi")}
          className="fixed bottom-4 right-4 z-50 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#FBCFE8] shadow-md text-xs font-semibold text-[#EC4899] hover:bg-[#FFF5FA] transition-all cursor-pointer"
        >
          Lihat Dashboard Admin &rarr;
        </button>
        <LoginPage />
      </div>
    );
  }

  const activeMenu =
    currentPage === "verifikasi"
      ? "verifikasi"
      : currentPage === "tracking"
        ? "tracking"
        : currentPage === "batch-list" || currentPage === "batch-new"
          ? "batch"
          : "dashboard";

  const handleNavigate = (menu: string) => {
    if (menu === "batch") setCurrentPage("batch-list");
    if (menu === "tracking") setCurrentPage("tracking");
    if (menu === "verifikasi") setCurrentPage("verifikasi");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setCurrentPage("login")}
        className="fixed bottom-4 right-4 z-50 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#FBCFE8] shadow-md text-xs font-semibold text-[#71717A] hover:text-[#EC4899] hover:bg-[#FFF5FA] transition-all cursor-pointer"
      >
        &larr; Lihat Login Page
      </button>

      <AdminLayout activeMenu={activeMenu} onNavigate={handleNavigate}>
        {currentPage === "verifikasi" && <PaymentVerificationPage />}

        {currentPage === "batch-list" && (
          <BatchDashboardPage
            onCreateNewBatch={() => setCurrentPage("batch-new")}
            onEditBatch={() => setCurrentPage("batch-new")}
          />
        )}

        {currentPage === "batch-new" && (
          <BatchInputPage onBackToList={() => setCurrentPage("batch-list")} />
        )}

        {currentPage === "tracking" && (
          <TrackingPage
            onNavigateToBatch={() => setCurrentPage("batch-list")}
          />
        )}
      </AdminLayout>
    </div>
  );
}

export default App;
