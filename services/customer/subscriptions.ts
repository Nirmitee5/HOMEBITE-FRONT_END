// services/customer/subscriptions.ts
// Recurring meal plans. A subscription is NOT a daily order and NOT a daily
// payment — the customer pays per billing period and meals arrive automatically.

import type {
  CustomerAddress,
  MealType,
  PaymentMethod,
  Subscription,
  SubscriptionBillingPeriod,
  SubscriptionPlan,
  SubscriptionStatus,
} from "../../types/customer";
import { clone, createId, isoDaysFromNow, request } from "./api";
import { MOCK_ADDRESSES, MOCK_CUSTOMER } from "./profile";

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: "plan_1",
    providerId: "prov_1",
    providerName: "Meera's Kitchen",
    providerType: "housewife",
    name: "Daily Lunch Thali",
    description:
      "A fresh homestyle thali delivered every afternoon. Menu rotates daily so you never eat the same meal twice in a week.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
    veg: "veg",
    billingPeriod: "daily",
    mealTypes: ["lunch"],
    price: 100,
    durationLabel: "Billed per day",
    startDate: isoDaysFromNow(1),
    capacity: 25,
    activeSubscribers: 18,
    status: "active",
    menu: [
      { mealId: "meal_1", mealName: "Homestyle Veg Thali", price: 120, veg: "veg" },
    ],
    schedule: WEEK_DAYS.slice(0, 6).map((day, index) => ({
      day,
      mealType: "lunch" as MealType,
      servings: 1,
      meals: [
        {
          mealId: "meal_1",
          mealName:
            index % 3 === 0
              ? "Dal Tadka + Jeera Rice + Roti"
              : index % 3 === 1
                ? "Rajma + Rice + Salad"
                : "Paneer Masala + Roti",
          price: 120,
          veg: "veg",
        },
      ],
    })),
  },
  {
    id: "plan_2",
    providerId: "prov_2",
    providerName: "Annapurna Mess",
    providerType: "mess",
    name: "Weekly Lunch Plan",
    description:
      "Six unlimited Maharashtrian thalis a week, Monday to Saturday. Pay once a week, eat every day.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80",
    veg: "veg",
    billingPeriod: "weekly",
    mealTypes: ["lunch"],
    price: 650,
    durationLabel: "6 meals per week",
    startDate: isoDaysFromNow(2),
    capacity: 40,
    activeSubscribers: 31,
    status: "active",
    menu: [
      {
        mealId: "meal_3",
        mealName: "Unlimited Maharashtrian Thali",
        price: 140,
        veg: "veg",
      },
    ],
    schedule: WEEK_DAYS.map((day) => ({
      day,
      mealType: "lunch" as MealType,
      servings: 1,
      meals: [
        {
          mealId: "meal_3",
          mealName: "Bhakri + Pithla + Varan Bhaat",
          price: 140,
          veg: "veg",
        },
      ],
    })),
  },
  {
    id: "plan_3",
    providerId: "prov_4",
    providerName: "Sunita's Tiffin",
    providerType: "housewife",
    name: "Monthly Lunch + Dinner",
    description:
      "Light Gujarati tiffin twice a day for a full month. Best value for working professionals.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80",
    veg: "veg",
    billingPeriod: "monthly",
    mealTypes: ["lunch", "dinner"],
    price: 2400,
    durationLabel: "4 weeks · 2 meals a day",
    startDate: isoDaysFromNow(3),
    endDate: isoDaysFromNow(33),
    capacity: 20,
    activeSubscribers: 20,
    status: "active",
    menu: [
      { mealId: "meal_7", mealName: "Gujarati Light Tiffin", price: 110, veg: "veg" },
      { mealId: "meal_8", mealName: "Masala Khichdi & Kadhi", price: 100, veg: "veg" },
    ],
    schedule: [
      ...WEEK_DAYS.slice(0, 5).map((day) => ({
        day,
        mealType: "lunch" as MealType,
        servings: 1,
        meals: [
          { mealId: "meal_7", mealName: "Theplas + Moong Dal + Rice", price: 110, veg: "veg" as const },
        ],
      })),
      ...WEEK_DAYS.slice(0, 5).map((day) => ({
        day,
        mealType: "dinner" as MealType,
        servings: 1,
        meals: [
          { mealId: "meal_8", mealName: "Khichdi + Kadhi + Papad", price: 100, veg: "veg" as const },
        ],
      })),
    ],
  },
  {
    id: "plan_4",
    providerId: "prov_1",
    providerName: "Meera's Kitchen",
    providerType: "housewife",
    name: "Breakfast Plan",
    description:
      "Paratha, poha or upma with chai every morning, delivered between 7:30 and 9:30 AM.",
    coverImageUrl:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    veg: "veg",
    billingPeriod: "weekly",
    mealTypes: ["breakfast"],
    price: 480,
    durationLabel: "6 breakfasts per week",
    startDate: isoDaysFromNow(1),
    capacity: 15,
    activeSubscribers: 9,
    status: "active",
    menu: [
      { mealId: "meal_2", mealName: "Aloo Paratha Breakfast", price: 90, veg: "veg" },
    ],
    schedule: WEEK_DAYS.map((day, index) => ({
      day,
      mealType: "breakfast" as MealType,
      servings: 1,
      meals: [
        {
          mealId: "meal_2",
          mealName: index % 2 === 0 ? "Aloo Paratha + Curd" : "Poha + Chai",
          price: 90,
          veg: "veg",
        },
      ],
    })),
  },
];

let subscriptions: Subscription[] = [
  {
    id: "sub_1",
    customerId: MOCK_CUSTOMER.id,
    planId: "plan_2",
    planName: "Weekly Lunch Plan",
    providerId: "prov_2",
    providerName: "Annapurna Mess",
    providerType: "mess",
    billingPeriod: "weekly",
    mealTypes: ["lunch"],
    servings: 1,
    price: 650,
    status: "active",
    startDate: isoDaysFromNow(-9),
    nextDeliveryDate: isoDaysFromNow(1),
    paymentMethod: "upi",
    paymentStatus: "paid",
    createdAt: isoDaysFromNow(-10),
  },
  {
    id: "sub_2",
    customerId: MOCK_CUSTOMER.id,
    planId: "plan_4",
    planName: "Breakfast Plan",
    providerId: "prov_1",
    providerName: "Meera's Kitchen",
    providerType: "housewife",
    billingPeriod: "weekly",
    mealTypes: ["breakfast"],
    servings: 2,
    price: 480,
    status: "paused",
    startDate: isoDaysFromNow(-20),
    pausedUntil: isoDaysFromNow(4),
    paymentMethod: "card",
    paymentStatus: "paid",
    createdAt: isoDaysFromNow(-21),
  },
];

export interface PlanFilters {
  mealType?: MealType;
  billingPeriod?: SubscriptionBillingPeriod;
  providerId?: string;
}

export interface CreateSubscriptionInput {
  planId: string;
  mealTypes: MealType[];
  servings: number;
  address: CustomerAddress;
  startDate: string;
  paymentMethod: PaymentMethod;
}

export async function getSubscriptionPlans(
  filters: PlanFilters = {}
): Promise<SubscriptionPlan[]> {
  const results = MOCK_PLANS.filter((plan) => {
    if (plan.status !== "active") return false;
    if (filters.providerId && plan.providerId !== filters.providerId) return false;
    if (filters.billingPeriod && plan.billingPeriod !== filters.billingPeriod)
      return false;
    if (filters.mealType && !plan.mealTypes.includes(filters.mealType)) return false;
    return true;
  });
  return request(results);
}

export async function getSubscriptionPlanById(
  id: string
): Promise<SubscriptionPlan | null> {
  return request(MOCK_PLANS.find((plan) => plan.id === id) ?? null, {
    delayMs: 250,
  });
}

export async function getSubscriptions(): Promise<Subscription[]> {
  return request(() => subscriptions);
}

export async function getSubscriptionById(
  id: string
): Promise<Subscription | null> {
  return request(() => subscriptions.find((s) => s.id === id) ?? null, {
    delayMs: 250,
  });
}

export function planIsFull(plan: SubscriptionPlan): boolean {
  return plan.activeSubscribers >= plan.capacity;
}

/** Creates a recurring subscription — no per-day order, no per-day payment. */
export async function createSubscription(
  input: CreateSubscriptionInput
): Promise<Subscription> {
  const plan = MOCK_PLANS.find((p) => p.id === input.planId);
  if (!plan) throw new Error("This plan is no longer available.");
  if (planIsFull(plan)) throw new Error("This plan is full right now.");
  if (input.servings < 1) throw new Error("Choose at least one serving.");

  const subscription: Subscription = {
    id: createId("sub"),
    customerId: MOCK_CUSTOMER.id,
    planId: plan.id,
    planName: plan.name,
    providerId: plan.providerId,
    providerName: plan.providerName,
    providerType: plan.providerType,
    billingPeriod: plan.billingPeriod,
    mealTypes: input.mealTypes.length ? input.mealTypes : plan.mealTypes,
    servings: input.servings,
    price: plan.price * input.servings,
    status: "active",
    startDate: input.startDate,
    endDate: plan.endDate,
    nextDeliveryDate: input.startDate,
    paymentMethod: input.paymentMethod,
    paymentStatus: "paid",
    createdAt: new Date().toISOString(),
  };

  const created = await request(subscription, { delayMs: 700 });
  subscriptions = [clone(created), ...subscriptions];
  plan.activeSubscribers += 1;
  return created;
}

function updateStatus(id: string, status: SubscriptionStatus): Subscription {
  const subscription = subscriptions.find((s) => s.id === id);
  if (!subscription) throw new Error("Subscription not found.");
  subscription.status = status;
  return subscription;
}

export async function pauseSubscription(
  id: string,
  resumeOnISO?: string
): Promise<Subscription> {
  const subscription = updateStatus(id, "paused");
  subscription.pausedUntil = resumeOnISO ?? isoDaysFromNow(7);
  subscription.nextDeliveryDate = subscription.pausedUntil;
  return request(subscription, { delayMs: 350 });
}

export async function resumeSubscription(id: string): Promise<Subscription> {
  const subscription = updateStatus(id, "active");
  subscription.pausedUntil = undefined;
  subscription.nextDeliveryDate = isoDaysFromNow(1);
  return request(subscription, { delayMs: 350 });
}

export async function cancelSubscription(id: string): Promise<Subscription> {
  const subscription = updateStatus(id, "cancelled");
  subscription.nextDeliveryDate = undefined;
  const plan = MOCK_PLANS.find((p) => p.id === subscription.planId);
  if (plan && plan.activeSubscribers > 0) plan.activeSubscribers -= 1;
  return request(subscription, { delayMs: 350 });
}

/** Next billing date derived from the billing period. */
export function nextBillingDate(subscription: Subscription): string {
  const start = new Date(subscription.startDate);
  const days =
    subscription.billingPeriod === "daily"
      ? 1
      : subscription.billingPeriod === "weekly"
        ? 7
        : 30;
  start.setDate(start.getDate() + days);
  return start.toISOString();
}

export function defaultSubscriptionAddress(): CustomerAddress {
  return MOCK_ADDRESSES.find((a) => a.isDefault) ?? MOCK_ADDRESSES[0];
}
