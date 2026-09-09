// services/provider/mealPlans.ts
export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";
export type PlanStatus = "draft" | "active" | "paused" | "ended";
export type PlanDuration = "weekly" | "monthly" | "custom";

export type MenuItem = {
  id: string; name: string; price: number; category: string;
  veg: boolean; image: string;
};

export type ScheduledMeal = {
  id: string;
  mealType: MealType;
  itemIds: string[];
  servings: 1 | 2 | 4;      // 4 = family portion
};

export type DaySchedule = { day: string; meals: ScheduledMeal[] };
export type WeekSchedule = { week: number; days: DaySchedule[] };

export type Subscriber = {
  id: string; name: string; startDate: string;
  status: "active" | "paused" | "cancelled" | "completed";
  nextMeal: string;
};

export type MealPlan = {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  category: string;
  cuisine: string;
  veg: boolean;
  price: number;
  billingPeriod: "week" | "month";
  duration: PlanDuration;
  capacity: number;
  startDate: string;
  endDate: string | null;
  status: PlanStatus;
  itemIds: string[];
  weeks: WeekSchedule[];
  subscribers: Subscriber[];
  revenue: number;
  newSubscribers: number;
  cancelledSubscribers: number;
};

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const MENU: MenuItem[] = [
  { id: "m1", name: "Dal Tadka", price: 90, category: "Main", veg: true, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300" },
  { id: "m2", name: "Jeera Rice", price: 70, category: "Rice", veg: true, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300" },
  { id: "m3", name: "Paneer Masala", price: 150, category: "Main", veg: true, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300" },
  { id: "m4", name: "Veg Biryani", price: 160, category: "Rice", veg: true, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300" },
  { id: "m5", name: "Aloo Sabzi", price: 80, category: "Sabzi", veg: true, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300" },
  { id: "m6", name: "Rajma", price: 110, category: "Main", veg: true, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=300" },
  { id: "m7", name: "Khichdi", price: 85, category: "Main", veg: true, image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=300" },
  { id: "m8", name: "Kadhi", price: 75, category: "Main", veg: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300" },
  { id: "m9", name: "Poha", price: 50, category: "Breakfast", veg: true, image: "https://images.unsplash.com/photo-1630409351241-e90e7f5e434d?w=300" },
  { id: "m10", name: "Chicken Curry", price: 190, category: "Main", veg: false, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300" },
];

export const itemById = (id: string) => MENU.find((m) => m.id === id);

const wait = (ms = 600) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 9);

function emptyWeek(week: number): WeekSchedule {
  return { week, days: DAYS.map((day) => ({ day, meals: [] })) };
}

export function makeDraftPlan(): MealPlan {
  return {
    id: `plan_${uid()}`,
    name: "", description: "",
    coverImage: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
    category: "Tiffin", cuisine: "Indian", veg: true,
    price: 0, billingPeriod: "week", duration: "weekly",
    capacity: 20,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: null,
    status: "draft",
    itemIds: [], weeks: [emptyWeek(1)],
    subscribers: [], revenue: 0, newSubscribers: 0, cancelledSubscribers: 0,
  };
}

function subs(n: number): Subscriber[] {
  const names = ["Rohit S.", "Meera J.", "Aakash P.", "Neha K.", "Vikram D.", "Sara M.", "Amit R.", "Divya T."];
  return Array.from({ length: n }).map((_, i) => ({
    id: `sub_${i}`,
    name: names[i % names.length] + (i >= names.length ? ` ${i}` : ""),
    startDate: new Date(Date.now() - i * 3 * 86400000).toISOString().slice(0, 10),
    status: i % 11 === 0 ? "paused" : i % 17 === 0 ? "cancelled" : "active",
    nextMeal: i % 2 ? "Tomorrow · Lunch" : "Today · Dinner",
  }));
}

let PLANS: MealPlan[] = [
  {
    ...makeDraftPlan(),
    id: "plan_lunch",
    name: "Weekly Lunch Plan",
    description: "Fresh homemade lunch delivered Monday to Saturday. Dal, rice, sabzi and roti.",
    coverImage: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    price: 700, billingPeriod: "week", duration: "weekly",
    capacity: 20, status: "active",
    itemIds: ["m1", "m2", "m5", "m6"],
    weeks: [{
      week: 1,
      days: DAYS.map((day, i) => ({
        day,
        meals: i < 6 ? [{ id: uid(), mealType: "Lunch" as MealType, itemIds: [["m1", "m2", "m5"], ["m6", "m2"], ["m3", "m5"], ["m7", "m8"], ["m4"], ["m1", "m2"]][i], servings: 1 as const }] : [],
      })),
    }],
    subscribers: subs(18), revenue: 12600, newSubscribers: 4, cancelledSubscribers: 1,
  },
  {
    ...makeDraftPlan(),
    id: "plan_month",
    name: "Monthly Tiffin Plan",
    description: "Two meals a day, all month. Rotating menu so it never gets boring.",
    coverImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800",
    price: 4200, billingPeriod: "month", duration: "monthly",
    capacity: 25, status: "active",
    itemIds: ["m1", "m2", "m3", "m9"],
    weeks: [1, 2, 3, 4].map((w) => ({
      week: w,
      days: DAYS.map((day, i) => ({
        day,
        meals: i < 6 ? [
          { id: uid(), mealType: "Breakfast" as MealType, itemIds: ["m9"], servings: 1 as const },
          { id: uid(), mealType: "Dinner" as MealType, itemIds: ["m3", "m2"], servings: 1 as const },
        ] : [],
      })),
    })),
    subscribers: subs(23), revenue: 96600, newSubscribers: 6, cancelledSubscribers: 2,
  },
  {
    ...makeDraftPlan(),
    id: "plan_paused",
    name: "Evening Snack Box",
    description: "Light evening snacks — poha, upma, chaat.",
    price: 350, duration: "weekly", capacity: 15, status: "paused",
    itemIds: ["m9"], subscribers: subs(6), revenue: 2100,
  },
  { ...makeDraftPlan(), id: "plan_draft", name: "Non-Veg Weekend Plan", description: "Draft — still deciding the menu.", veg: false, price: 0, status: "draft" },
];

export const activeSubs = (p: MealPlan) => p.subscribers.filter((s) => s.status === "active").length;
export const isFull = (p: MealPlan) => activeSubs(p) >= p.capacity;

export function mealCount(p: MealPlan) {
  return p.weeks.reduce((s, w) => s + w.days.reduce((d, day) => d + day.meals.length, 0), 0);
}

// TODO: replace with real backend call — GET /provider/meal-plans
export async function getMealPlans(): Promise<MealPlan[]> {
  await wait();
  return PLANS.map((p) => ({ ...p }));
}

// TODO: POST/PATCH /provider/meal-plans
export async function saveMealPlan(plan: MealPlan): Promise<MealPlan> {
  await wait(800);
  const i = PLANS.findIndex((p) => p.id === plan.id);
  if (i >= 0) PLANS[i] = plan;
  else PLANS = [plan, ...PLANS];
  return { ...plan };
}

// TODO: PATCH /provider/meal-plans/:id/status
export async function setPlanStatus(id: string, status: PlanStatus) {
  await wait(400);
  PLANS = PLANS.map((p) => (p.id === id ? { ...p, status } : p));
}

// TODO: POST /provider/meal-plans/:id/duplicate
export async function duplicatePlan(id: string): Promise<MealPlan> {
  await wait(500);
  const src = PLANS.find((p) => p.id === id)!;
  const copy: MealPlan = {
    ...src,
    id: `plan_${uid()}`,
    name: `${src.name} (Copy)`,
    status: "draft",
    subscribers: [], revenue: 0, newSubscribers: 0, cancelledSubscribers: 0,
  };
  PLANS = [copy, ...PLANS];
  return copy;
}

// TODO: DELETE /provider/meal-plans/:id
export async function deletePlan(id: string) {
  await wait(400);
  PLANS = PLANS.filter((p) => p.id !== id);
}

export type PrepLine = { itemId: string; name: string; servings: number };
export type UpcomingBlock = { when: string; mealType: MealType; totalMeals: number; lines: PrepLine[] };

// TODO: GET /provider/meal-plans/upcoming
export async function getUpcomingMeals(): Promise<UpcomingBlock[]> {
  await wait(500);
  const build = (when: string, mealType: MealType, ids: string[], subsCount: number): UpcomingBlock => ({
    when, mealType, totalMeals: subsCount,
    lines: ids.map((id) => ({ itemId: id, name: itemById(id)!.name, servings: subsCount })),
  });
  return [
    build("Today", "Dinner", ["m3", "m2"], 21),
    build("Tomorrow", "Lunch", ["m1", "m2", "m5"], 18),
    build("Tomorrow", "Dinner", ["m6", "m2"], 17),
  ];
}

export function planAnalytics(plans: MealPlan[]) {
  const active = plans.filter((p) => p.status === "active");
  const totalSubs = plans.reduce((s, p) => s + activeSubs(p), 0);
  const revenue = plans.reduce((s, p) => s + p.revenue, 0);
  const popular = [...plans].sort((a, b) => activeSubs(b) - activeSubs(a))[0];
  return {
    activePlans: active.length,
    draftPlans: plans.filter((p) => p.status === "draft").length,
    pausedPlans: plans.filter((p) => p.status === "paused").length,
    totalSubs,
    revenue,
    cancelled: plans.reduce((s, p) => s + p.cancelledSubscribers, 0),
    growth: plans.reduce((s, p) => s + p.newSubscribers, 0),
    popular,
  };
}
