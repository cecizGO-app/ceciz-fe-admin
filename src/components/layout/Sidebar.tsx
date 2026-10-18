import React from "react";
import {
  LayoutGrid,
  Boxes,
  FileText,
  Truck,
  CheckCircle2,
  Receipt,
  BarChart3,
  Settings,
} from "lucide-react";

interface SidebarProps {
  activeMenu?: string;
  onNavigate?: (menu: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu = "batch",
  onNavigate,
}) => {
  return (
    <aside className="w-60 bg-white border-r border-[#FBCFE8]/40 flex flex-col shrink-0 min-h-screen sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto select-none">
      <nav className="flex-1 px-3 py-5 space-y-6 text-sm">
        {/* Section: UTAMA */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-[#71717A] tracking-wider uppercase">
            Utama
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-medium text-xs transition-colors cursor-pointer ${
              activeMenu === "dashboard"
                ? "bg-[#FFF5FA] text-[#18181B] font-semibold"
                : "text-[#71717A] hover:bg-[#FFF5FA]/70 hover:text-[#18181B]"
            }`}
          >
            <LayoutGrid className="w-4 h-4 shrink-0 text-[#71717A]" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Section: OPERASIONAL */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-[#71717A] tracking-wider uppercase">
            Operasional
          </div>
          <div className="space-y-1">
            {/* Batch Menu (Active with Left Accent Indicator) */}
            <button
              type="button"
              onClick={() => onNavigate?.("batch")}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-semibold text-xs transition-colors cursor-pointer ${
                activeMenu === "batch"
                  ? "bg-[#FFF5FA] text-[#18181B]"
                  : "text-[#71717A] hover:bg-[#FFF5FA]/70 hover:text-[#18181B]"
              }`}
            >
              {/* Vertical Pink Accent Bar on the Left Edge */}
              {activeMenu === "batch" && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#EC4899] rounded-r-full"
                  aria-hidden="true"
                />
              )}
              <Boxes
                className={`w-4 h-4 shrink-0 ${activeMenu === "batch" ? "text-[#EC4899]" : "text-[#71717A]"}`}
              />
              <span>Batch</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.("rekapan")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-medium text-xs transition-colors cursor-pointer ${
                activeMenu === "rekapan"
                  ? "bg-[#FFF5FA] text-[#18181B] font-semibold"
                  : "text-[#71717A] hover:bg-[#FFF5FA]/70 hover:text-[#18181B]"
              }`}
            >
              <FileText className="w-4 h-4 shrink-0 text-[#71717A]" />
              <span>Rekapan Barang</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.("tracking")}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-semibold text-xs transition-colors cursor-pointer ${
                activeMenu === "tracking"
                  ? "bg-[#FFF5FA] text-[#18181B]"
                  : "text-[#71717A] hover:bg-[#FFF5FA]/70 hover:text-[#18181B]"
              }`}
            >
              {activeMenu === "tracking" && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#EC4899] rounded-r-full"
                  aria-hidden="true"
                />
              )}
              <Truck
                className={`w-4 h-4 shrink-0 ${activeMenu === "tracking" ? "text-[#EC4899]" : "text-[#71717A]"}`}
              />
              <span>Tracking Logistik</span>
            </button>
          </div>
        </div>

        {/* Section: KEUANGAN */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-[#71717A] tracking-wider uppercase">
            Keuangan
          </div>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onNavigate?.("verifikasi")}
              className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] font-semibold text-xs transition-colors cursor-pointer ${
                activeMenu === "verifikasi"
                  ? "bg-[#FFF5FA] text-[#18181B]"
                  : "text-[#71717A] hover:bg-[#FFF5FA]/70 hover:text-[#18181B]"
              }`}
            >
              {activeMenu === "verifikasi" && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#EC4899] rounded-r-full"
                  aria-hidden="true"
                />
              )}
              <div className="flex items-center gap-3 min-w-0">
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${activeMenu === "verifikasi" ? "text-[#EC4899]" : "text-[#71717A]"}`}
                />
                <span className="truncate">Verifikasi Pembayaran</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FCE7F3] text-[#DC2626]">
                12
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.("tax")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-medium text-xs transition-colors cursor-pointer ${
                activeMenu === "tax"
                  ? "bg-[#FFF5FA] text-[#18181B] font-semibold"
                  : "text-[#71717A] hover:bg-[#FFF5FA]/70 hover:text-[#18181B]"
              }`}
            >
              <Receipt className="w-4 h-4 shrink-0 text-[#71717A]" />
              <span>Tagihan Tax</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.("laporan")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-medium text-xs transition-colors cursor-pointer ${
                activeMenu === "laporan"
                  ? "bg-[#FFF5FA] text-[#18181B] font-semibold"
                  : "text-[#71717A] hover:bg-[#FFF5FA]/70 hover:text-[#18181B]"
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0 text-[#71717A]" />
              <span>Laporan & Cashflow</span>
            </button>
          </div>
        </div>

        {/* Section: SISTEM */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-[#71717A] tracking-wider uppercase">
            Sistem
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.("settings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] font-medium text-xs transition-colors cursor-pointer ${
              activeMenu === "settings"
                ? "bg-[#FFF5FA] text-[#18181B] font-semibold"
                : "text-[#71717A] hover:bg-[#FFF5FA]/70 hover:text-[#18181B]"
            }`}
          >
            <Settings className="w-4 h-4 shrink-0 text-[#71717A]" />
            <span>Pengaturan</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
