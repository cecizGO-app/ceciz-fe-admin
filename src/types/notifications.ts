export interface AdminNotification {
  id: string;
  title: string;
  subtitle: string;
  isRead: boolean;
  createdAt: string;
  category: "buyer" | "payment" | "tracking" | "tax";
  targetPath: string;
}
