import { create } from "zustand";

interface NotificationStore {
  /**
   * Badges mapped by menu id (e.g. { verifikasi: 0, tracking: 0 })
   * Only values > 0 will render a notification badge.
   */
  badges: Record<string, number>;
  /**
   * Set or update notification badge count for a menu item
   */
  setBadge: (menuId: string, count: number) => void;
  /**
   * Clear notification badge for a menu item (e.g. after user checks/views the page)
   */
  clearBadge: (menuId: string) => void;
  /**
   * Increment badge count when a new item/action arrives
   */
  incrementBadge: (menuId: string, delta?: number) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  // Default: Kosong / 0 (tidak ada notifikasi jika belum ada aksi baru yang belum dicek)
  badges: {},

  setBadge: (menuId, count) =>
    set((state) => ({
      badges: {
        ...state.badges,
        [menuId]: count > 0 ? count : 0,
      },
    })),

  clearBadge: (menuId) =>
    set((state) => ({
      badges: {
        ...state.badges,
        [menuId]: 0,
      },
    })),

  incrementBadge: (menuId, delta = 1) =>
    set((state) => {
      const current = state.badges[menuId] || 0;
      const next = current + delta;
      return {
        badges: {
          ...state.badges,
          [menuId]: next > 0 ? next : 0,
        },
      };
    }),
}));

