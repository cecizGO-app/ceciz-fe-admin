import React from "react";
import { Search, Menu, LogOut, ShieldCheck, User } from "lucide-react";

interface NavbarProps {
  userName?: string;
  userInitial?: string;
  userRole?: "owner" | "staff";
  onChangeRole?: (role: "owner" | "staff") => void;
  onLogout?: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userName,
  userInitial,
  userRole = "owner",
  onChangeRole,
  onLogout,
  onToggleSidebar,
}) => {
  const isOwner = userRole === "owner";
  const displayName = userName || (isOwner ? "Aurel" : "Staff Operasional");
  const displayInitial = userInitial || (isOwner ? "A" : "S");

  return (
    <header className="h-16 bg-white border-b border-[#FBCFE8]/40 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Brand & Mobile Hamburger Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-2 -ml-1 text-[#71717A] hover:text-[#18181B] hover:bg-[#FFF5FA] rounded-[10px] cursor-pointer transition-colors"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-bold text-[15px] sm:text-[16px] text-[#18181B] tracking-tight">
            Ceciz GO
          </span>
          <span className="text-[#FBCFE8] font-light hidden sm:inline">|</span>
          <span className="text-xs font-normal text-[#71717A] hidden sm:inline">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Center: Search input (Hidden on small mobile, visible sm and above) */}
      <div className="relative w-44 sm:w-72 md:w-84 max-w-full hidden sm:block">
        <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari batch, buyer, tracking..."
          className="w-full h-10 pl-9 pr-4 rounded-[12px] border border-[#FBCFE8]/80 bg-[#FFF5FA] text-xs text-[#18181B] placeholder-[#71717A] focus:border-[#EC4899] focus:ring-4 focus:ring-[#EC4899]/20 transition-all outline-none"
        />
      </div>

      {/* Right Controls: Role Switcher & User Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Role Switcher Pill (Memudahkan review perbedaan tampilan Owner & Staff) */}
        {onChangeRole && (
          <div className="flex items-center p-0.5 bg-[#FFF5FA] border border-[#FBCFE8] rounded-full text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => onChangeRole("owner")}
              className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer text-[11px] flex items-center gap-1 ${
                isOwner
                  ? "bg-[#EC4899] text-white shadow-2xs"
                  : "text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Owner</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeRole("staff")}
              className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer text-[11px] flex items-center gap-1 ${
                !isOwner
                  ? "bg-[#EC4899] text-white shadow-2xs"
                  : "text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              <User className="w-3 h-3" />
              <span>Staff</span>
            </button>
          </div>
        )}

        {/* User Profile */}
        <div className="flex items-center gap-2.5 shrink-0 pl-1">
          <div
            className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center border shadow-2xs ${
              isOwner
                ? "bg-[#FCE7F3] text-[#EC4899] border-[#FBCFE8]"
                : "bg-zinc-100 text-zinc-700 border-zinc-200"
            }`}
          >
            {displayInitial}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#18181B] leading-tight">
              {displayName}
            </span>
            <span
              className={`text-[10px] leading-tight font-medium ${
                isOwner ? "text-[#EC4899]" : "text-[#71717A]"
              }`}
            >
              {isOwner ? "Owner (Full)" : "Staff Operasional"}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            title="Keluar"
            className="p-2 text-[#71717A] hover:text-rose-600 hover:bg-rose-50 rounded-[10px] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
