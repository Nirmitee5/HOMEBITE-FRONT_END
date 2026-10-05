// services/customer/orders.ts
// Instant / one-time customer orders ONLY.
// Recurring meals live in services/customer/subscriptions.ts.

import type {
  CartItem,
  CustomerAddress,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
} from "../../types/customer";
import { clone, createCode, createId, request } from "./api";
import { MOCK_ADDRESSES, MOCK_CUSTOMER } from "./profile";
import { findProviderSync } from "./providers";

/** In-memory store. Swap for API calls later. */
let orders: Order[] = [
  {
    id: "HB4821",
    customerId: MOCK_CUSTOMER.id,
    providerId: "prov_1",
    providerName: "Meera's Kitchen",
    providerType: "housewife",
    items: [
      {
        mealId: "meal_1",
        mealName: "Homestyle Veg Thali",
        mealImageUrl:
          "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
        quantity: 2,
        unitPrice: 120,
        veg: "veg",
        addOns: [{ id: "add_2", name: "Boondi raita", price: 30, veg: "veg" }],
      },
    ],
    status: "out_for_delivery",
    deliveryMode: "delivery_partner",
    addressId: MOCK_ADDRESSES[0].id,
    addressSnapshot: MOCK_ADDRESSES[0],
    subtotal: 270,
    deliveryFee: 20,
    platformFee: 5,
    taxes: 0,
    discount: 0,
    total: 295,
    paymentMethod: "upi",
    paymentStatus: "paid",
    isInstant: true,
    placedAt: new Date(Date.now() - 40 * 60000).toISOString(),
    acceptedAt: new Date(Date.now() - 35 * 60000).toISOString(),
    readyAt: new Date(Date.now() - 10 * 60000).toISOString(),
    tracking: { driverName: "Rahul P.", driverPhone: "+91 98200 11223", etaMins: 12 },
  },
  {
    id: "HB4790",
    customerId: MOCK_CUSTOMER.id,
    providerId: "prov_2",
    providerName: "Annapurna Mess",
    providerType: "mess",
    items: [
      {
        mealId: "meal_3",
        mealName: "Unlimited Maharashtrian Thali",
        mealImageUrl:
          "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80",
        quantity: 1,
        unitPrice: 140,
        veg: "veg",
      },
    ],
    status: "delivered",
    deliveryMode: "delivery_partner",
    addressId: MOCK_ADDRESSES[0].id,
    addressSnapshot: MOCK_ADDRESSES[0],
    subtotal: 140,
    deliveryFee: 0,
    platformFee: 5,
    taxes: 0,
    discount: 20,
    total: 125,
    paymentMethod: "cod",
    paymentStatus: "paid",
    isInstant: true,
    placedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    deliveredAt: new Date(Date.now() - 2 * 86400000 + 45 * 60000).toISOString(),
  },
  {
    id: "HB4712",
    customerId: MOCK_CUSTOMER.id,
    providerId: "prov_4",
    providerName: "Sunita's Tiffin",
    providerType: "housewife",
    items: [
      {
        mealId: "meal_8",
        mealName: "Masala Khichdi & Kadhi",
        mealImageUrl:
          "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80",
        quantity: 1,
        unitPrice: 100,
        veg: "veg",
      },
    ],
    status: "cancelled",
    deliveryMode: "self_delivery",
    addressId: MOCK_ADDRESSES[1].id,
    addressSnapshot: MOCK_ADDRESSES[1],
    subtotal: 100,
    deliveryFee: 20,
    platformFee: 5,
    taxes: 0,
    discount: 0,
    total: 125,
    paymentMethod: "upi",
    paymentStatus: "refunded",
    isInstant: true,
    placedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    rejectionReason: "Cancelled by customer",
  },
];

export interface CreateInstantOrderInput {
  items: CartItem[];
  address: CustomerAddress;
  paymentMethod: PaymentMethod;
  deliveryInstructions?: string;
  couponDiscount?: number;
  deliveryFee?: number;
  platformFee?: number;
  contactName?: string;
  contactPhone?: string;
}

function cartItemToOrderItem(item: CartItem): OrderItem {
  return {
    mealId: item.mealId,
    mealName: item.mealName,
    mealImageUrl: item.mealImageUrl,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    veg: item.veg,
    addOns: item.addOns,
  };
}

export function lineTotal(item: CartItem): number {
  const addOns = (item.addOns ?? []).reduce((sum, a) => sum + a.price, 0);
  return (item.unitPrice + addOns) * item.quantity;
}

export async function getOrders(): Promise<Order[]> {
  return request(() => orders);
}

export async function getOrderById(id: string): Promise<Order | null> {
  return request(() => orders.find((order) => order.id === id) ?? null, {
    delayMs: 250,
  });
}

export async function getActiveOrders(): Promise<Order[]> {
  const activeStatuses: OrderStatus[] = [
    "pending",
    "accepted",
    "preparing",
    "ready",
    "out_for_delivery",
  ];
  return request(() => orders.filter((o) => activeStatuses.includes(o.status)), {
    delayMs: 250,
  });
}

/** One-time / instant order creation. Never used for subscriptions. */
export async function createInstantOrder(
  input: CreateInstantOrderInput
): Promise<Order> {
  if (input.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const instantItems = input.items.filter((item) => item.type === "instant");
  if (instantItems.length === 0) {
    throw new Error("No instant order items found in the cart.");
  }

  const first = instantItems[0];
  const provider = findProviderSync(first.providerId);
  const subtotal = instantItems.reduce((sum, item) => sum + lineTotal(item), 0);
  const deliveryFee = input.deliveryFee ?? (subtotal >= 300 ? 0 : 20);
  const platformFee = input.platformFee ?? 5;
  const discount = input.couponDiscount ?? 0;

  const order: Order = {
    id: createCode("HB"),
    customerId: MOCK_CUSTOMER.id,
    providerId: first.providerId,
    providerName: first.providerName,
    providerType: first.providerType,
    items: instantItems.map(cartItemToOrderItem),
    status: "pending",
    deliveryMode: provider?.type === "home_kitchen" ? "self_delivery" : "delivery_partner",
    addressId: input.address.id,
    addressSnapshot: input.address,
    subtotal,
    deliveryFee,
    platformFee,
    taxes: 0,
    discount,
    total: Math.max(0, subtotal + deliveryFee + platformFee - discount),
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentMethod === "cod" ? "pending" : "paid",
    isInstant: true,
    notes: input.deliveryInstructions,
    placedAt: new Date().toISOString(),
  };

  const created = await request(order, { delayMs: 700 });
  orders = [clone(created), ...orders];
  return created;
}

export async function cancelOrder(id: string): Promise<Order> {
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found.");
  if (["out_for_delivery", "delivered"].includes(order.status)) {
    throw new Error("This order can no longer be cancelled.");
  }

  order.status = "cancelled";
  order.rejectionReason = "Cancelled by customer";
  order.paymentStatus = order.paymentStatus === "paid" ? "refunded" : "failed";
  return request(order, { delayMs: 400 });
}

/** Rebuild cart lines from a past order so the customer can order again. */
export async function reorder(id: string): Promise<CartItem[]> {
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found.");

  const items: CartItem[] = order.items.map((item) => ({
    id: createId("line"),
    mealId: item.mealId,
    mealName: item.mealName,
    mealImageUrl: item.mealImageUrl,
    providerId: order.providerId,
    providerName: order.providerName,
    providerType: order.providerType,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    veg: item.veg,
    type: "instant",
    addOns: item.addOns,
  }));

  return request(items, { delayMs: 350 });
}

/** Mock lifecycle progression — lets order tracking feel alive in dev. */
export async function advanceOrderStatus(id: string): Promise<Order> {
  const flow: OrderStatus[] = [
    "pending",
    "accepted",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
  ];
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found.");

  const index = flow.indexOf(order.status);
  if (index >= 0 && index < flow.length - 1) {
    order.status = flow[index + 1];
    if (order.status === "delivered") order.deliveredAt = new Date().toISOString();
  }
  return request(order, { delayMs: 200 });
}
