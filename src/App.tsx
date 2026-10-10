import { useState } from "react";
import { LoginPage } from "./pages/auth/LoginPage";
import { BatchInputPage } from "./pages/batches/BatchInputPage";
import { AdminLayout } from "./components/layout/AdminLayout";

export function App() {
  // Navigation State for Developer 2 testing
  const [currentPage, setCurrentPage] = useState<"batch-new" | "login">(
    "batch-new",
  );

  if (currentPage === "login") {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setCurrentPage("batch-new")}
          className="fixed bottom-4 right-4 z-50 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#FBCFE8] shadow-md text-xs font-semibold text-[#EC4899] hover:bg-[#FFF5FA] transition-all cursor-pointer"
        >
          Lihat Form Tambah Batch &rarr;
        </button>
        <LoginPage />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setCurrentPage("login")}
        className="fixed bottom-4 right-4 z-50 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#FBCFE8] shadow-md text-xs font-semibold text-[#71717A] hover:text-[#EC4899] hover:bg-[#FFF5FA] transition-all cursor-pointer"
      >
        &larr; Lihat Login Page
      </button>

      <AdminLayout activeMenu="batch">
        <BatchInputPage />
      </AdminLayout>
    </div>
  );
}

export default App;
