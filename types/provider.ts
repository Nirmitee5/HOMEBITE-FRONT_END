
// made some changes here 
export type ProviderType = "housewife" | "mess" | "home_kitchen";
export type ApprovalStatus = "pending" | "under_review" | "approved" | "rejected";

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "rejected"
  | "cancelled";

export type OrderType = "single" | "subscription";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  code: string;                 // e.g. "HB-2381"
  customerName: string;
  customerPhone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  type: OrderType;
  placedAt: string;             // ISO
  deliverySlot: string;         // e.g. "1:00 PM - 2:00 PM"
  note?: string;
  rejectionReason?: string;
}

export interface DashboardStats {
  todayOrders: number;
  todayEarnings: number;
  pendingOrders: number;
  activeSubscriptions: number;
  rating: number;
  totalReviews: number;
}

export interface ProviderProfile {
  id: string;
  kitchenName: string;
  ownerName: string;
  providerType: ProviderType;
  approvalStatus: ApprovalStatus;
  phone: string;
  email: string;
  city: string;
  address: string;
  isOpen: boolean;
  rejectionReason?: string;
}

export interface Subscription {
  id: string;
  customerName: string;
  planName: string;             // "Lunch Tiffin - Monthly"
  mealsPerDay: number;
  startDate: string;
  endDate: string;
  amount: number;
  isActive: boolean;
}

export interface EarningsSummary {
  today: number;
  week: number;
  month: number;
  pendingPayout: number;
  walletBalance: number;
}
