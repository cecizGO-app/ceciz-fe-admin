import React from "react";
import {
  LayoutGrid,
  Calculator,
  ClipboardCheck,
  Truck,
  Receipt,
  Package,
  ArrowLeftRight,
  BarChart3,
  CircleDollarSign,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

interface SidebarProps {
  activeMenu?: string;
  onNavigate?: (menu: string) => void;
  userRole?: "owner" | "staff";
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
  roles: ("owner" | "staff")[];
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: "OVERVIEW",
    roles: ["owner", "staff"],
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutGrid,
      },
    ],
  },
  {
    title: "OPERATIONS",
    roles: ["owner", "staff"],
    items: [
      {
        id: "batch",
        label: "Batch & Harga",
        icon: Calculator,
      },
      {
        id: "verifikasi",
        label: "Verifikasi Pembayaran",
        icon: ClipboardCheck,
        badge: 12,
      },
      {
        id: "tracking",
        label: "Tracking",
        icon: Truck,
      },
      {
        id: "tax",
        label: "Tagihan Tax",
        icon: Receipt,
      },
      {
        id: "po-album",
        label: "PO Album / CO Web",
        icon: Package,
      },
      {
        id: "cashflow",
        label: "Cashflow",
        icon: ArrowLeftRight,
      },
    ],
  },
  {
    title: "REPORTS",
    roles: ["owner"], // Khusus Owner — PRD RBAC §1.9 (Staff dilarang keras akses data laba & gaji)
    items: [
      {
        id: "laba-go",
        label: "Laba GO",
        icon: BarChart3,
      },
      {
        id: "gaji-admin",
        label: "Gaji Admin",
        icon: CircleDollarSign,
      },
      {
        id: "rekap-pembayaran",
        label: "Rekap Pembayaran",
        icon: FileSpreadsheet,
      },
    ],
  },
  {
    title: "SYSTEM",
    roles: ["owner"], // Khusus Owner
    items: [
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
      },
      {
        id: "roles-permissions",
        label: "Roles & Permissions",
        icon: ShieldCheck,
      },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu = "batch",
  onNavigate,
  userRole = "owner",
}) => {
  // Filter bagian menu yang boleh diakses berdasarkan role
  const visibleSections = MENU_SECTIONS.filter((section) =>
    section.roles.includes(userRole),
  ).map((section) => {
    // Khusus Staff: Sembunyikan Cashflow dari OPERATIONS sesuai screenshot referensi Staff
    if (userRole === "staff" && section.title === "OPERATIONS") {
      return {
        ...section,
        items: section.items.filter((item) => item.id !== "cashflow"),
      };
    }
    return section;
  });

  return (
    <aside className="w-64 bg-white border-r border-[#FBCFE8]/50 flex flex-col shrink-0 min-h-screen sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto select-none transition-all">
      <nav className="flex-1 px-3.5 py-5 space-y-6 text-sm">
        {visibleSections.map((section) => (
          <div key={section.title}>
            {/* Section Header Title */}
            <div className="px-3 mb-2 text-[10px] font-bold text-[#71717A] tracking-wider uppercase">
              {section.title}
            </div>

            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeMenu === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate?.(item.id)}
                    className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs transition-all cursor-pointer group ${
                      isActive
                        ? "bg-[#FFF5FA] text-[#18181B] font-semibold shadow-2xs"
                        : "text-[#71717A] hover:bg-[#FFF5FA]/70 hover:text-[#18181B] font-medium"
                    }`}
                  >
                    {/* Left Pink Vertical Accent Bar for Active Item */}
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#EC4899] rounded-r-full"
                        aria-hidden="true"
                      />
                    )}

                    <div className="flex items-center gap-3 min-w-0">
                      <IconComponent
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? "text-[#EC4899]"
                            : "text-[#71717A] group-hover:text-[#EC4899]"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {/* Optional Badge (e.g. Verifikasi Pembayaran count) */}
                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FCE7F3] text-[#DC2626] shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Staff Role Restricted Info Box (Hanya muncul ketika login sebagai staff) */}
        {userRole === "staff" && (
          <div className="mx-2 mt-6 p-3 rounded-[12px] bg-[#FFF5FA] border border-[#FBCFE8]/80 text-[11px] text-[#71717A] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#EC4899]">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Akses Terbatas Staff</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Menu Laporan Keuangan, Cashflow, dan Pengaturan dibatasi oleh
              Owner.
            </p>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
