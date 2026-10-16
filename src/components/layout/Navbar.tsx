import React from 'react'
import { Search, Menu } from 'lucide-react'

interface NavbarProps {
  userName?: string
  userInitial?: string
  onToggleSidebar?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  userName = 'Aurel',
  userInitial = 'A',
  onToggleSidebar,
}) => {
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
      <div className="relative w-48 sm:w-80 md:w-96 max-w-full">
        <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari batch, buyer..."
          className="w-full h-10 pl-9 pr-11 rounded-[12px] border border-[#FBCFE8]/80 bg-[#FFF5FA] text-xs text-[#18181B] placeholder-[#71717A] focus-ceciz-ring transition-colors"
        />
      </div>

      {/* Right: User Profile */}
      <div className="flex items-center gap-2 cursor-pointer group shrink-0">
        <div className="w-8 h-8 rounded-full bg-[#FCE7F3] text-[#EC4899] font-bold text-xs flex items-center justify-center border border-[#FBCFE8]">
          {userInitial}
        </div>
        <span className="text-xs font-semibold text-[#18181B] group-hover:text-[#EC4899] transition-colors hidden sm:inline">
          {userName}
        </span>
      </div>
    </header>
  )
}

export default Navbar
