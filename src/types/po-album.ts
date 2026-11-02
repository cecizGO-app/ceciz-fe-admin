export type PaymentMethodType = "BCA" | "QRIS" | "SeaBank" | "ShopeePay";
export type CoWebStatus =
  | "Not Started"
  | "CO Open"
  | "Order Submitted"
  | "Completed";
export type OrderType = "PO Album" | "CO Web";

export interface PoAlbumOrder {
  id: string;
  batch: string;
  buyer: string;
  buyerName?: string;
  album: string;
  member: string;
  qty: number;
  dp: number;
  dpDone: boolean;
  dpMethod: PaymentMethodType;
  fp: number;
  fpDone: boolean;
  fpMethod: PaymentMethodType;
  co: CoWebStatus;
  note: string;
  type: OrderType;
  createdAt?: string;
}

export interface PoAlbumDraft {
  key: number;
  member: string;
  price: string;
  buyer: string;
  dp: string;
  dpDone: boolean;
  fp: string;
  fpDone: boolean;
  note: string;
}

export interface PoAlbumStats {
  totalOrders: number;
  waitingFp: number;
  coWebOpen: number;
  totalCollected: number;
}

