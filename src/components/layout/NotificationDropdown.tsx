import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Bell, Check, X } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MOCK_NOTIFICATIONS } from "@/mocks/mockNotificationsData";
import type { AdminNotification } from "@/types/notifications";

export const NotificationDropdown: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AdminNotification[]>(
    () => [...MOCK_NOTIFICATIONS],
  );
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (item: AdminNotification) => {
    // 1. Tandai sudah dibaca
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
    );
    // 2. Tutup popover dropdown
    setOpen(false);
    // 3. Langsung arahkan ke halaman action tujuan
    if (item.targetPath) {
      navigate(item.targetPath);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="relative size-9 rounded-[10px] text-[#71717A] hover:text-[#18181B] hover:bg-[#FFF5FA] transition-colors cursor-pointer"
          aria-label="Buka Notifikasi"
        >
          <Bell className="w-4.5 h-4.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-[#EF4444] text-white text-[10px] font-bold shadow-xs border border-white leading-none">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[330px] sm:w-[360px] p-4 rounded-[18px] border-[#FBCFE8]/60 bg-white shadow-xl"
      >
        {/* Header (Matching Reference Image 2) */}
        <div className="flex items-start justify-between pb-3">
          <div>
            <h3 className="text-[17px] font-bold text-[#18181B] tracking-tight">
              Notifikasi
            </h3>
            <p className="text-xs text-[#71717A] mt-0.5">
              {unreadCount > 0
                ? `${unreadCount} belum dibaca`
                : "Semua sudah dibaca"}
            </p>
          </div>

          <PopoverClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="size-7 rounded-full text-[#71717A] hover:text-[#18181B] hover:bg-zinc-100 cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </Button>
          </PopoverClose>
        </div>

        {/* Action: Tandai semua dibaca */}
        <div className="pb-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="w-full h-8.5 rounded-[10px] border-[#E4E4E7] bg-white text-xs font-semibold text-[#18181B] hover:bg-[#FFF5FA] hover:text-[#EC4899] hover:border-[#FBCFE8] transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-3.5 h-3.5" />
            Tandai semua dibaca
          </Button>
        </div>

        {/* Notifications List (Klik untuk langsung ke Action Page) */}
        <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-0.5">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#71717A]">
              Tidak ada notifikasi saat ini
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3 rounded-[12px] transition-all cursor-pointer select-none ${
                  !item.isRead
                    ? "bg-[#F0F7FF] border border-[#E0F0FE] hover:bg-[#E5F2FF]"
                    : "bg-white hover:bg-[#FFF5FA]/40 border border-transparent"
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleNotificationClick(item);
                  }
                }}
              >
                <p
                  className={`text-xs leading-snug tracking-tight ${
                    !item.isRead
                      ? "font-semibold text-[#18181B]"
                      : "font-normal text-[#52525B]"
                  }`}
                >
                  {item.title}
                </p>
                <div className="flex items-center justify-between mt-1 text-[11px] text-[#71717A]">
                  <span>{item.subtitle}</span>
                  <span className="text-[10px] text-[#A1A1AA]">
                    {item.createdAt}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
