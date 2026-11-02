import type { PoAlbumOrder } from "@/types/po-album";

const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "https://ceciz-backend.vercel.app";

export const initialPoAlbumOrders: PoAlbumOrder[] = [
  {
    id: "po-1",
    batch: "KR-021",
    buyer: "@nadyasalsa",
    buyerName: "Nadya Salsabila",
    album: "RIIZE 2nd Album",
    member: "Shotaro",
    qty: 1,
    dp: 150000,
    dpDone: true,
    dpMethod: "BCA",
    fp: 155000,
    fpDone: true,
    fpMethod: "QRIS",
    co: "Completed",
    note: "",
    type: "PO Album",
  },
  {
    id: "po-2",
    batch: "KR-ALB-07",
    buyer: "@adelineptr",
    buyerName: "Adeline Putri",
    album: "CATBBI Album Ver.",
    member: "CATBBI",
    qty: 1,
    dp: 205000,
    dpDone: true,
    dpMethod: "BCA",
    fp: 100000,
    fpDone: true,
    fpMethod: "BCA",
    co: "Order Submitted",
    note: "",
    type: "PO Album",
  },
  {
    id: "po-3",
    batch: "KR-ALB-07",
    buyer: "@circenbl",
    buyerName: "Clarissa Nabilla",
    album: "CATBBI Album Ver.",
    member: "CATBBI",
    qty: 1,
    dp: 207000,
    dpDone: true,
    dpMethod: "BCA",
    fp: 100000,
    fpDone: false,
    fpMethod: "BCA",
    co: "CO Open",
    note: "Denda 2k DP",
    type: "PO Album",
  },
  {
    id: "po-4",
    batch: "JP-015",
    buyer: "@raniays",
    buyerName: "Rania Yusuf",
    album: "SKZ Japan Album",
    member: "Hyunjin",
    qty: 1,
    dp: 180000,
    dpDone: true,
    dpMethod: "SeaBank",
    fp: 120000,
    fpDone: true,
    fpMethod: "SeaBank",
    co: "Order Submitted",
    note: "Unsealed",
    type: "PO Album",
  },
  {
    id: "po-5",
    batch: "KR-020",
    buyer: "@mayaputri",
    buyerName: "Maya Putri",
    album: "IVE EP Album",
    member: "Wonyoung",
    qty: 1,
    dp: 140000,
    dpDone: false,
    dpMethod: "BCA",
    fp: 140000,
    fpDone: false,
    fpMethod: "BCA",
    co: "Not Started",
    note: "",
    type: "PO Album",
  },
  {
    id: "po-6",
    batch: "TH-012",
    buyer: "@ditaang",
    buyerName: "Dita Anggraini",
    album: "BUS Photobook",
    member: "Heart",
    qty: 1,
    dp: 120000,
    dpDone: true,
    dpMethod: "ShopeePay",
    fp: 105000,
    fpDone: true,
    fpMethod: "ShopeePay",
    co: "Completed",
    note: "",
    type: "PO Album",
  },
  {
    id: "po-7",
    batch: "KR-ALB-07",
    buyer: "@keishaaml",
    buyerName: "Keisha Amalia",
    album: "CATBBI Album Ver.",
    member: "CATBBI",
    qty: 1,
    dp: 205000,
    dpDone: true,
    dpMethod: "QRIS",
    fp: 100000,
    fpDone: false,
    fpMethod: "QRIS",
    co: "CO Open",
    note: "Titip sealed",
    type: "PO Album",
  },
  {
    id: "po-8",
    batch: "KR-021",
    buyer: "@bellakrn",
    buyerName: "Bella Karina",
    album: "RIIZE 2nd Album",
    member: "Anton",
    qty: 1,
    dp: 150000,
    dpDone: true,
    dpMethod: "BCA",
    fp: 155000,
    fpDone: false,
    fpMethod: "BCA",
    co: "CO Open",
    note: "",
    type: "PO Album",
  },
  {
    id: "po-9",
    batch: "KR-021",
    buyer: "@auliarhm",
    buyerName: "Aulia Rahma",
    album: "RIIZE 2nd Album",
    member: "Wonbin",
    qty: 1,
    dp: 150000,
    dpDone: true,
    dpMethod: "SeaBank",
    fp: 155000,
    fpDone: false,
    fpMethod: "SeaBank",
    co: "Order Submitted",
    note: "",
    type: "PO Album",
  },
  {
    id: "po-10",
    batch: "JP-015",
    buyer: "@laraswl",
    buyerName: "Laras Wulandari",
    album: "SKZ Japan Album",
    member: "Felix",
    qty: 1,
    dp: 180000,
    dpDone: true,
    dpMethod: "BCA",
    fp: 120000,
    fpDone: false,
    fpMethod: "BCA",
    co: "Order Submitted",
    note: "",
    type: "PO Album",
  },
  {
    id: "po-11",
    batch: "KR-020",
    buyer: "@talianov",
    buyerName: "Talia Novita",
    album: "IVE EP Album",
    member: "Yujin",
    qty: 1,
    dp: 140000,
    dpDone: true,
    dpMethod: "QRIS",
    fp: 140000,
    fpDone: false,
    fpMethod: "QRIS",
    co: "Not Started",
    note: "",
    type: "PO Album",
  },
  {
    id: "po-12",
    batch: "TH-012",
    buyer: "@gitamhr",
    buyerName: "Gita Maharani",
    album: "BUS Photobook",
    member: "Phinyo",
    qty: 1,
    dp: 120000,
    dpDone: false,
    dpMethod: "ShopeePay",
    fp: 105000,
    fpDone: false,
    fpMethod: "ShopeePay",
    co: "Not Started",
    note: "",
    type: "PO Album",
  },
  {
    id: "po-13",
    batch: "KR-020",
    buyer: "@shafirazh",
    buyerName: "Shafira Zahra",
    album: "IVE EP Album",
    member: "All Member",
    qty: 1,
    dp: 140000,
    dpDone: true,
    dpMethod: "BCA",
    fp: 140000,
    fpDone: true,
    fpMethod: "BCA",
    co: "Order Submitted",
    note: "Titip unsealed",
    type: "PO Album",
  },
  {
    id: "po-14",
    batch: "JP-015",
    buyer: "@citranbl",
    buyerName: "Citra Nabila",
    album: "SKZ Japan Album",
    member: "Bang Chan",
    qty: 1,
    dp: 180000,
    dpDone: true,
    dpMethod: "QRIS",
    fp: 120000,
    fpDone: true,
    fpMethod: "QRIS",
    co: "Completed",
    note: "",
    type: "PO Album",
  },
];

export async function fetchPoAlbumOrders(): Promise<PoAlbumOrder[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/admin/po-albums`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data as PoAlbumOrder[];
    }
  } catch (err) {
    console.warn("fetchPoAlbumOrders fallback to mock data:", err);
  }

  return initialPoAlbumOrders;
}

export async function savePoAlbumBatch(
  newOrders: Omit<PoAlbumOrder, "id">[]
): Promise<PoAlbumOrder[]> {
  try {
    const payload = {
      items: newOrders.map((o) => ({
        batchNumber: o.batch,
        buyerHandle: o.buyer,
        itemName: o.album,
        member: o.member,
        qty: o.qty,
        harga: o.dp + o.fp,
        dpAmount: o.dp,
        dpMethod: o.dpMethod,
        dpDone: o.dpDone,
        fpAmount: o.fp,
        fpMethod: o.fpMethod,
        fpDone: o.fpDone,
        coStatus: o.co,
        type: o.type,
        notes: o.note,
      })),
    };

    const res = await fetch(`${BASE_URL}/api/v1/admin/po-albums`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("savePoAlbumBatch fallback to local storage:", err);
  }

  // Fallback to generating IDs locally
  const baseTime = Date.now();
  return newOrders.map((o, idx) => ({
    ...o,
    id: `local-po-${baseTime}-${idx}`,
  }));
}

export async function updatePoAlbumOrder(
  id: string,
  updated: Partial<PoAlbumOrder>
): Promise<boolean> {
  try {
    const payload: Record<string, any> = {};
    if (updated.batch) payload.batchNumber = updated.batch;
    if (updated.album) payload.itemName = updated.album;
    if (updated.member !== undefined) payload.member = updated.member;
    if (updated.qty !== undefined) payload.qty = updated.qty;
    if (updated.dp !== undefined) payload.dpAmount = updated.dp;
    if (updated.dpMethod) payload.dpMethod = updated.dpMethod;
    if (updated.dpDone !== undefined) payload.dpDone = updated.dpDone;
    if (updated.fp !== undefined) payload.fpAmount = updated.fp;
    if (updated.fpMethod) payload.fpMethod = updated.fpMethod;
    if (updated.fpDone !== undefined) payload.fpDone = updated.fpDone;
    if (updated.co) payload.coStatus = updated.co;
    if (updated.type) payload.type = updated.type;
    if (updated.note !== undefined) payload.notes = updated.note;

    const res = await fetch(`${BASE_URL}/api/v1/admin/po-albums/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    console.warn("updatePoAlbumOrder error:", err);
    return false;
  }
}
