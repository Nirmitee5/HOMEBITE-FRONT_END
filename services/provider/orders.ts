import type { Order, OrderStatus, DashboardStats } from "../../types/provider";
import { delay } from "./api";

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    code: "HB-2381",
    customerName: "Rohit Sharma",
    customerPhone: "+91 98200 11223",
    address: "402, Sai Residency, Kothrud, Pune",
    items: [
      { id: "i1", name: "Veg Thali (Full)", quantity: 2, price: 120 },
      { id: "i2", name: "Extra Chapati", quantity: 3, price: 15 },
    ],
    total: 285,
    status: "pending",
    type: "single",
    placedAt: new Date().toISOString(),
    deliverySlot: "1:00 PM - 2:00 PM",
    note: "Less spicy please",
  },
  {
    id: "2",
    code: "HB-2380",
    customerName: "Ananya Iyer",
    customerPhone: "+91 99870 55412",
    address: "12, Green Park, Baner, Pune",
    items: [{ id: "i3", name: "Lunch Tiffin", quantity: 1, price: 90 }],
    total: 90,
    status: "preparing",
    type: "subscription",
    placedAt: new Date().toISOString(),
    deliverySlot: "12:30 PM - 1:30 PM",
  },
  {
    id: "3",
    code: "HB-2377",
    customerName: "Imran Qureshi",
    customerPhone: "+91 90045 78123",
    address: "8B, Lake View, Viman Nagar, Pune",
    items: [{ id: "i4", name: "Chicken Curry Meal", quantity: 1, price: 180 }],
    total: 180,
    status: "delivered",
    type: "single",
    placedAt: new Date(Date.now() - 864e5).toISOString(),
    deliverySlot: "8:00 PM - 9:00 PM",
  },
];

// TODO: replace with real backend call -> GET /provider/orders
export async function fetchOrders(status?: OrderStatus | "all"): Promise<Order[]> {
  await delay();
  if (!status || status === "all") return MOCK_ORDERS;
  return MOCK_ORDERS.filter((o) => o.status === status);
}

// TODO: replace with real backend call -> GET /provider/orders/:id
export async function fetchOrderById(id: string): Promise<Order | null> {
  await delay(300);
  return MOCK_ORDERS.find((o) => o.id === id) ?? null;
}

// TODO: replace with real backend call -> POST /provider/orders/:id/accept
export async function acceptOrder(id: string): Promise<void> {
  await delay(400);
  const o = MOCK_ORDERS.find((x) => x.id === id);
  if (o) o.status = "accepted";
}

// TODO: replace with real backend call -> POST /provider/orders/:id/reject
export async function rejectOrder(id: string, reason: string): Promise<void> {
  await delay(400);
  const o = MOCK_ORDERS.find((x) => x.id === id);
  if (o) {
    o.status = "rejected";
    o.rejectionReason = reason;
  }
}

// TODO: replace with real backend call -> PATCH /provider/orders/:id/status
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await delay(300);
  const o = MOCK_ORDERS.find((x) => x.id === id);
  if (o) o.status = status;
}

// TODO: replace with real backend call -> GET /provider/dashboard
export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay();
  return {
    todayOrders: 14,
    todayEarnings: 2480,
    pendingOrders: 3,
    activeSubscriptions: 22,
    rating: 4.7,
    totalReviews: 168,
  };
}
