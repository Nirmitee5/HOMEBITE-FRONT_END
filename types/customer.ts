// types/customer.ts
// Shared TypeScript types for the Customer side of HomeBite.
// Designed to stay compatible with the existing Provider types
// (housewife | mess | home_kitchen, shared order status lifecycle).

/* ============================================================
 * 1. Provider model (mirrors provider side, customer-facing view)
 * ============================================================ */

export type ProviderType = "housewife" | "mess" | "home_kitchen";

export const providerTypeLabel: Record<ProviderType, string> = {
  housewife: "Housewife Kitchen",
  mess: "Mess",
  home_kitchen: "Home Kitchen",
};

export type VegPreference = "veg" | "non_veg" | "egg";

export type ProviderApprovalStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected";

/* ============================================================
 * 2. Customer
 * ============================================================ */

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  defaultAddressId?: string;
  // Notification preferences
  notifications: {
    orderUpdates: boolean;
    subscriptionUpdates: boolean;
    promotions: boolean;
  };
  createdAt: string; // ISO date
}

/* ============================================================
 * 3. Customer address
 * ============================================================ */

export type AddressType = "home" | "work" | "other";

export interface CustomerAddress {
  id: string;
  label: string; // e.g. "Home", "Mom's place"
  type: AddressType;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  deliveryInstructions?: string;
  isDefault: boolean;
}

/* ============================================================
 * 4. Provider summary (lightweight, used in lists/cards)
 * ============================================================ */

export interface ProviderSummary {
  id: string;
  name: string;
  type: ProviderType;
  photoUrl?: string;
  rating: number; // 0 - 5
  ratingCount: number;
  cuisineTypes: string[];
  foodSpecialties: string[];
  mealTypes: MealType[];
  deliveryRadiusKm: number;
  isAvailable: boolean;
  prepTimeMins: number; // estimated
  approvalStatus: ProviderApprovalStatus;
  address: {
    line1: string;
    city: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
  };
  logoUrl?: string;
}

/* ============================================================
 * 5. Meals & menu
 * ============================================================ */

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealCategory {
  id: string;
  name: string; // e.g. "North Indian", "Desserts"
  icon?: string;
}

export interface MealAvailability {
  isAvailable: boolean;
  stockRemaining?: number; // nullish / undefined = unlimited
  availableToday: boolean;
  nextAvailableAt?: string; // ISO datetime
}

export interface Meal {
  id: string;
  providerId: string;
  name: string;
  description: string;
  imageUrl?: string;
  price: number; // in ₹
  veg: VegPreference;
  category: MealCategory;
  mealType: MealType;
  cuisine?: string;
  servings?: string; // e.g. "1 serving", "Family portion"
  rating: number;
  ratingCount: number;
  prepTimeMins: number;
  availability: MealAvailability;
  isSubscriptionEligible: boolean;
  addOns?: MealAddOn[];
}

export interface MealAddOn {
  id: string;
  name: string;
  price: number;
  veg: VegPreference;
}

/* ============================================================
 * 6. Cart
 * ============================================================ */

export type CartItemType = "instant" | "subscription";

export interface CartItem {
  id: string; // unique cart line id
  mealId: string;
  mealName: string;
  mealImageUrl?: string;
  providerId: string;
  providerName: string;
  providerType: ProviderType;
  unitPrice: number;
  quantity: number;
  veg: VegPreference;
  type: CartItemType;
  // Present only when the line is a subscription line
  subscription?: {
    planId: string;
    planName: string;
    billingPeriod: SubscriptionBillingPeriod;
    mealType: MealType;
    startDate: string; // ISO date
    servings: number;
  };
  // Selected add-ons for this line
  addOns?: MealAddOn[];
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discount: number;
  total: number;
  // All items in a single cart must come from the same provider for instant orders.
  providerId?: string;
  providerName?: string;
}

/* ============================================================
 * 7. Orders (instant one-time orders)
 * ============================================================ */

export type OrderStatus =
  | "pending" // placed, awaiting provider accept
  | "accepted"
  | "preparing"
  | "ready" // ready for pickup / delivery
  | "out_for_delivery"
  | "delivered"
  | "rejected"
  | "cancelled";

export const orderStatusMeta: Record<
  OrderStatus,
  { label: string; step: number }
> = {
  pending: { label: "Order Placed", step: 0 },
  accepted: { label: "Accepted", step: 1 },
  preparing: { label: "Preparing", step: 2 },
  ready: { label: "Ready", step: 3 },
  out_for_delivery: { label: "On the Way", step: 4 },
  delivered: { label: "Delivered", step: 5 },
  rejected: { label: "Rejected", step: -1 },
  cancelled: { label: "Cancelled", step: -1 },
};

export type DeliveryMode = "delivery_partner" | "self_delivery";

export interface OrderItem {
  mealId: string;
  mealName: string;
  mealImageUrl?: string;
  quantity: number;
  unitPrice: number;
  veg: VegPreference;
  addOns?: MealAddOn[];
}

export type PaymentMethod = "cod" | "upi" | "card" | "wallet";

export interface Order {
  id: string;
  customerId: string;
  providerId: string;
  providerName: string;
  providerType: ProviderType;
  items: OrderItem[];
  status: OrderStatus;
  deliveryMode: DeliveryMode;
  addressId: string;
  addressSnapshot: CustomerAddress;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "refunded" | "failed";
  isInstant: true; // one-time order marker
  notes?: string;
  scheduledFor?: string; // ISO datetime for scheduled instant order
  placedAt: string; // ISO datetime
  acceptedAt?: string;
  readyAt?: string;
  deliveredAt?: string;
  rejectionReason?: string;
  // Tracking
  tracking?: {
    driverName?: string;
    driverPhone?: string;
    currentLocation?: { latitude: number; longitude: number };
    etaMins?: number;
  };
}

/* ============================================================
 * 8. Subscription plans & subscriptions (recurring meals)
 * ============================================================ */

export type SubscriptionBillingPeriod = "daily" | "weekly" | "monthly";

export type SubscriptionPlanStatus =
  | "draft"
  | "active"
  | "paused"
  | "ended";

export interface SubscriptionPlanMeal {
  mealId: string;
  mealName: string;
  mealImageUrl?: string;
  price: number;
  veg: VegPreference;
}

// A day inside a weekly / monthly schedule
export interface SubscriptionDayMeal {
  day: string; // "Monday" | "Week 1" etc.
  mealType: MealType;
  meals: SubscriptionPlanMeal[];
  servings: number;
}

export interface SubscriptionPlan {
  id: string;
  providerId: string;
  providerName: string;
  providerType: ProviderType;
  name: string;
  description: string;
  coverImageUrl?: string;
  veg: VegPreference;
  billingPeriod: SubscriptionBillingPeriod;
  mealTypes: MealType[];
  price: number; // per billing period
  durationLabel?: string; // e.g. "4 weeks", "1 month"
  startDate: string; // ISO date
  endDate?: string; // ISO date
  capacity: number;
  activeSubscribers: number;
  status: SubscriptionPlanStatus;
  menu: SubscriptionPlanMeal[];
  schedule: SubscriptionDayMeal[]; // weekly/monthly day-by-day
}

export type SubscriptionStatus =
  | "active"
  | "paused"
  | "cancelled"
  | "completed";

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  planName: string;
  providerId: string;
  providerName: string;
  providerType: ProviderType;
  billingPeriod: SubscriptionBillingPeriod;
  mealTypes: MealType[];
  servings: number;
  price: number; // per period
  status: SubscriptionStatus;
  startDate: string; // ISO date
  endDate?: string; // ISO date
  nextDeliveryDate?: string; // ISO date
  pausedUntil?: string; // ISO date
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string; // ISO datetime
}

/* ============================================================
 * 9. Notifications
 * ============================================================ */

export type NotificationType =
  | "order"
  | "subscription"
  | "message"
  | "system"
  | "promotion"
  | "payment";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string; // ISO datetime
  // Optional deep-link target
  data?: {
    orderId?: string;
    subscriptionId?: string;
    providerId?: string;
    planId?: string;
  };
}

/* ============================================================
 * 10. Convenience unions / helpers
 * ============================================================ */

// Anything that can appear in the customer's "active" list
export type ActiveOrderOrSubscription =
  | { kind: "order"; order: Order }
  | { kind: "subscription"; subscription: Subscription };

export function isOrder(
  value: ActiveOrderOrSubscription
): value is { kind: "order"; order: Order } {
  return value.kind === "order";
}

export function isSubscription(
  value: ActiveOrderOrSubscription
): value is { kind: "subscription"; subscription: Subscription } {
  return value.kind === "subscription";
}
