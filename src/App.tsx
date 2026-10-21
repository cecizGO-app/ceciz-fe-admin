import { useState } from "react";
import { LoginPage } from "./pages/auth/LoginPage";
import { BatchDashboardPage } from "./pages/batches/BatchDashboardPage";
import { BatchInputPage } from "./pages/batches/BatchInputPage";
import { TrackingPage } from "./pages/tracking/TrackingPage";
import { PaymentVerificationPage } from "./pages/verification/PaymentVerificationPage";
import { TagihanTaxPage } from "./pages/tax/TagihanTaxPage";
import { AdminLayout } from "./components/layout/AdminLayout";
import {
  useSession,
  signOut,
  mapBackendRoleToFrontend,
  type AuthUser,
} from "./lib/auth-client";
import { Loader2 } from "lucide-react";

export function App() {
  const { data: sessionData, isPending } = useSession();

  const sessionUser = sessionData?.user as unknown as AuthUser | undefined;

  const [pageOverride, setPageOverride] = useState<
    | "batch-list"
    | "batch-new"
    | "tracking"
    | "verifikasi"
    | "tax"
    | "login"
    | null
  >(null);
  const [roleOverride, setRoleOverride] = useState<"owner" | "staff" | null>(
    null,
  );
  const [demoUser, setDemoUser] = useState<AuthUser | null>(null);

  // Derived user and role from active session or demo login
  const currentUser = demoUser || sessionUser || null;
  const backendRole = mapBackendRoleToFrontend(currentUser?.role);
  const userRole: "owner" | "staff" = roleOverride || backendRole || "owner";

  // Current page derived from session or user interaction
  const currentPage = pageOverride ?? (sessionUser ? "batch-list" : "login");

  // Handle logout: clear backend Better Auth session & state
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.warn("Sign out error:", err);
    }
    setDemoUser(null);
    setRoleOverride(null);
    setPageOverride("login");
  };

  // Initial session check loading screen
  if (isPending) {
    return (
      <div className="min-h-screen w-full bg-[#FDF2F8] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 animate-in fade-in duration-300">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[#FBCFE8] flex items-center justify-center shadow-xs">
            <Loader2 className="w-6 h-6 text-[#EC4899] animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#18181B]">
              Ceciz GO Admin
            </p>
            <p className="text-xs text-[#71717A] mt-0.5">
              Memeriksa sesi autentikasi...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Login Page View
  if (currentPage === "login") {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setPageOverride("batch-list")}
          className="fixed bottom-4 right-4 z-50 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#FBCFE8] shadow-md text-xs font-semibold text-[#EC4899] hover:bg-[#FFF5FA] transition-all cursor-pointer"
        >
          Bypass ke Dashboard Admin &rarr;
        </button>
        <LoginPage
          onLoginSuccess={(role, user) => {
            setRoleOverride(role);
            if (user) setDemoUser(user);
            setPageOverride("batch-list");
          }}
        />
      </div>
    );
  }

  const activeMenu =
    currentPage === "verifikasi"
      ? "verifikasi"
      : currentPage === "tracking"
        ? "tracking"
        : currentPage === "tax"
          ? "tax"
          : currentPage === "batch-list" || currentPage === "batch-new"
            ? "batch"
            : "dashboard";

  const handleNavigate = (menu: string) => {
    if (menu === "dashboard" || menu === "batch") setPageOverride("batch-list");
    if (menu === "tracking") setPageOverride("tracking");
    if (menu === "verifikasi") setPageOverride("verifikasi");
    if (menu === "tax") setPageOverride("tax");
  };

  const displayName =
    currentUser?.name ||
    (userRole === "owner" ? "Aurel (Owner)" : "Staff Operasional");
  const displayInitial =
    currentUser?.name?.[0]?.toUpperCase() || (userRole === "owner" ? "A" : "S");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setPageOverride("login")}
        className="fixed bottom-4 right-4 z-50 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#FBCFE8] shadow-md text-xs font-semibold text-[#71717A] hover:text-[#EC4899] hover:bg-[#FFF5FA] transition-all cursor-pointer"
      >
        &larr; Lihat Login Page
      </button>

      <AdminLayout
        activeMenu={activeMenu}
        onNavigate={handleNavigate}
        userRole={userRole}
        userName={displayName}
        userInitial={displayInitial}
        onChangeRole={setRoleOverride}
        onLogout={handleLogout}
      >
        {currentPage === "verifikasi" && <PaymentVerificationPage />}

        {currentPage === "tax" && <TagihanTaxPage />}

        {currentPage === "batch-list" && (
          <BatchDashboardPage
            onCreateNewBatch={() => setPageOverride("batch-new")}
            onEditBatch={() => setPageOverride("batch-new")}
          />
        )}

        {currentPage === "batch-new" && (
          <BatchInputPage onBackToList={() => setPageOverride("batch-list")} />
        )}

        {currentPage === "tracking" && (
          <TrackingPage
            onNavigateToBatch={() => setPageOverride("batch-list")}
          />
        )}
      </AdminLayout>
    </div>
  );
}

export default App;
