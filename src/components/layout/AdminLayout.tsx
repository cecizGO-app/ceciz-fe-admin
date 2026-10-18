import React, { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeMenu?: string;
  onNavigate?: (menu: string) => void;
  userRole?: "owner" | "staff";
  onChangeRole?: (role: "owner" | "staff") => void;
  onLogout?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeMenu = "batch",
  onNavigate,
  userRole = "owner",
  onChangeRole,
  onLogout,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleMenuClick = (menu: string) => {
    onNavigate?.(menu);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF2F8] text-[#18181B] font-sans antialiased selection:bg-[#FCE7F3] selection:text-[#EC4899]">
      {/* Top Navbar Header (Full Width) */}
      <Navbar
        userRole={userRole}
        onChangeRole={onChangeRole}
        onLogout={onLogout}
        onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
      />

      {/* Main Body: Responsive Sidebar + Content */}
      <div className="flex relative">
        {/* Desktop Sidebar (Persistent) */}
        <div className="hidden md:block">
          <Sidebar
            activeMenu={activeMenu}
            onNavigate={onNavigate}
            userRole={userRole}
          />
        </div>

        {/* Mobile Sidebar Drawer (Overlay) */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            {/* Drawer */}
            <div className="relative z-50 w-64 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
              <Sidebar
                activeMenu={activeMenu}
                onNavigate={handleMenuClick}
                userRole={userRole}
              />
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
