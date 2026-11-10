import type { AdminNotification } from "@/types/notifications";

export const MOCK_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "notif-1",
    title: "Pengajuan akun buyer menunggu ACC",
    subtitle: "Naya Azzahra · GO 1",
    isRead: false,
    createdAt: "5m ago",
    category: "buyer",
  },
  {
    id: "notif-2",
    title: "Pembayaran CH-025 menunggu verifikasi",
    subtitle: "Maya Putri · Rp 685.000",
    isRead: false,
    createdAt: "20m ago",
    category: "payment",
  },
  {
    id: "notif-3",
    title: "Tracking KR-127 · OTW Indonesia",
    subtitle: "THRUTHANAMOON KR",
    isRead: false,
    createdAt: "1h ago",
    category: "tracking",
  },
  {
    id: "notif-4",
    title: "Tagihan tax September",
    subtitle: "Talia N. · Pending",
    isRead: false,
    createdAt: "2h ago",
    category: "tax",
  },
];

