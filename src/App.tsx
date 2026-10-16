import { useState } from "react";
import { LoginPage } from "./pages/auth/LoginPage";
import { BatchInputPage } from "./pages/batches/BatchInputPage";
import { TrackingPage } from "./pages/tracking/TrackingPage";
import { AdminLayout } from "./components/layout/AdminLayout";

export function App() {
  const [currentPage, setCurrentPage] = useState<"batch-new" | "tracking" | "login">(
    "tracking",
  );

  if (currentPage === "login") {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setCurrentPage("tracking")}
          className="fixed bottom-4 right-4 z-50 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#FBCFE8] shadow-md text-xs font-semibold text-[#EC4899] hover:bg-[#FFF5FA] transition-all cursor-pointer"
        >
          Lihat Dashboard Admin &rarr;
        </button>
        <LoginPage />
      </div>
    );
  }

  const activeMenu = currentPage === "tracking" ? "tracking" : "batch";

  const handleNavigate = (menu: string) => {
    if (menu === "batch") setCurrentPage("batch-new");
    if (menu === "tracking") setCurrentPage("tracking");
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
        {currentPage === "tracking" ? (
          <TrackingPage onNavigateToBatch={() => setCurrentPage("batch-new")} />
        ) : (
          <BatchInputPage />
        )}
      </AdminLayout>
    </div>
  );
}

export default App;
