import React from "react";
import { Search, Menu, LogOut, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationDropdown } from "./NotificationDropdown";

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
  const displayName = userName || (isOwner ? "Nadia A." : "Salsa R.");
  const displayInitial = userInitial || (isOwner ? "NA" : "SR");

  return (
    <header className="h-16 bg-white border-b border-[#FBCFE8]/40 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Brand & Mobile Hamburger Toggle */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          className="md:hidden text-[#71717A] hover:text-[#18181B] hover:bg-[#FFF5FA] rounded-[10px]"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

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

      {/* Center: Search input */}
      <div className="relative w-44 sm:w-72 md:w-84 max-w-full hidden sm:block">
        <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          type="text"
          placeholder="Cari batch, buyer, tracking..."
          className="w-full h-10 pl-9 pr-4 rounded-[12px] border border-[#FBCFE8]/80 bg-[#FFF5FA] text-xs text-[#18181B] placeholder-[#71717A] focus-visible:border-[#EC4899] focus-visible:ring-[#EC4899]/20"
        />
      </div>

      {/* Right Controls: Role Switcher & Notification & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switcher Pill */}
        {onChangeRole && (
          <div className="flex items-center p-0.5 bg-[#FFF5FA] border border-[#FBCFE8] rounded-full text-xs shadow-2xs">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => onChangeRole("owner")}
              className={`px-2.5 py-1 rounded-full font-semibold transition-all text-[11px] flex items-center gap-1 ${
                isOwner
                  ? "bg-[#EC4899] text-white shadow-2xs hover:bg-[#EC4899] hover:text-white"
                  : "text-[#71717A] hover:text-[#18181B] hover:bg-transparent"
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Owner</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => onChangeRole("staff")}
              className={`px-2.5 py-1 rounded-full font-semibold transition-all text-[11px] flex items-center gap-1 ${
                !isOwner
                  ? "bg-[#EC4899] text-white shadow-2xs hover:bg-[#EC4899] hover:text-white"
                  : "text-[#71717A] hover:text-[#18181B] hover:bg-transparent"
              }`}
            >
              <User className="w-3 h-3" />
              <span>Staff</span>
            </Button>
          </div>
        )}

        {/* Notifikasi Dropdown (Sesuai Referensi Gambar) */}
        <NotificationDropdown />

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-zinc-200" />

        {/* User Profile (Sesuai Referensi Gambar) */}
        <div className="flex items-center gap-2.5 shrink-0 pl-1">
          <div
            className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center border shadow-2xs ${
              isOwner
                ? "bg-[#F5EBE1] text-[#443E38] border-[#E8DCCF]"
                : "bg-zinc-100 text-zinc-700 border-zinc-200"
            }`}
          >
            {displayInitial}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#18181B] leading-tight">
              {displayName}
            </span>
            <span className="text-[10px] leading-tight font-medium text-[#71717A]">
              {isOwner ? "Owner" : "Staff"}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onLogout}
            title="Keluar"
            className="text-[#71717A] hover:text-rose-600 hover:bg-rose-50 rounded-[10px]"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
