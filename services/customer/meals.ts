// services/customer/meals.ts
// Meal discovery for the customer side. Mock data now, API later.

import type {
  Meal,
  MealCategory,
  MealType,
  VegPreference,
} from "../../types/customer";
import { clone, request } from "./api";

export const MEAL_CATEGORIES: MealCategory[] = [
  { id: "cat_thali", name: "Thali", icon: "restaurant" },
  { id: "cat_rice", name: "Rice", icon: "bowl-mix" },
  { id: "cat_curry", name: "Curries", icon: "pot-steam" },
  { id: "cat_roti", name: "Roti", icon: "bread-slice" },
  { id: "cat_healthy", name: "Healthy", icon: "leaf" },
  { id: "cat_snack", name: "Snacks", icon: "food-croissant" },
  { id: "cat_sweet", name: "Desserts", icon: "cupcake" },
];

function category(id: string): MealCategory {
  return MEAL_CATEGORIES.find((c) => c.id === id) ?? MEAL_CATEGORIES[0];
}

export const MOCK_MEALS: Meal[] = [
  {
    id: "meal_1",
    providerId: "prov_1",
    name: "Homestyle Veg Thali",
    description:
      "Two rotis, dal tadka, seasonal sabzi, jeera rice, salad and a small sweet — a complete everyday meal.",
    imageUrl:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80",
    price: 120,
    veg: "veg",
    category: category("cat_thali"),
    mealType: "lunch",
    cuisine: "North Indian",
    servings: "1 serving",
    rating: 4.7,
    ratingCount: 184,
    prepTimeMins: 35,
    availability: { isAvailable: true, availableToday: true, stockRemaining: 12 },
    isSubscriptionEligible: true,
    addOns: [
      { id: "add_1", name: "Extra roti (2)", price: 20, veg: "veg" },
      { id: "add_2", name: "Boondi raita", price: 30, veg: "veg" },
      { id: "add_3", name: "Gulab jamun", price: 40, veg: "veg" },
    ],
  },
  {
    id: "meal_2",
    providerId: "prov_1",
    name: "Aloo Paratha Breakfast",
    description:
      "Two stuffed aloo parathas served with homemade white butter and fresh curd.",
    imageUrl:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    price: 90,
    veg: "veg",
    category: category("cat_roti"),
    mealType: "breakfast",
    cuisine: "Punjabi",
    servings: "1 serving",
    rating: 4.6,
    ratingCount: 96,
    prepTimeMins: 25,
    availability: { isAvailable: true, availableToday: true },
    isSubscriptionEligible: true,
    addOns: [{ id: "add_4", name: "Masala chai", price: 20, veg: "veg" }],
  },
  {
    id: "meal_3",
    providerId: "prov_2",
    name: "Unlimited Maharashtrian Thali",
    description:
      "Bhakri, pithla, bhaji, varan bhaat and thecha. Simple mess food, generous portions.",
    imageUrl:
      "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80",
    price: 140,
    veg: "veg",
    category: category("cat_thali"),
    mealType: "lunch",
    cuisine: "Maharashtrian",
    servings: "Unlimited",
    rating: 4.4,
    ratingCount: 321,
    prepTimeMins: 20,
    availability: { isAvailable: true, availableToday: true, stockRemaining: 30 },
    isSubscriptionEligible: true,
    addOns: [{ id: "add_5", name: "Solkadhi", price: 25, veg: "veg" }],
  },
  {
    id: "meal_4",
    providerId: "prov_2",
    name: "Egg Curry Rice Plate",
    description: "Two-egg spicy curry with steamed rice, chapati and salad.",
    imageUrl:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
    price: 130,
    veg: "egg",
    category: category("cat_rice"),
    mealType: "dinner",
    cuisine: "Maharashtrian",
    servings: "1 serving",
    rating: 4.2,
    ratingCount: 147,
    prepTimeMins: 25,
    availability: { isAvailable: true, availableToday: true },
    isSubscriptionEligible: false,
  },
  {
    id: "meal_5",
    providerId: "prov_3",
    name: "Appam with Veg Stew",
    description:
      "Three soft appams with coconut milk vegetable stew, cooked in coconut oil.",
    imageUrl:
      "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&q=80",
    price: 150,
    veg: "veg",
    category: category("cat_curry"),
    mealType: "breakfast",
    cuisine: "Kerala",
    servings: "1 serving",
    rating: 4.8,
    ratingCount: 73,
    prepTimeMins: 40,
    availability: {
      isAvailable: false,
      availableToday: false,
      nextAvailableAt: new Date(Date.now() + 86400000).toISOString(),
    },
    isSubscriptionEligible: false,
  },
  {
    id: "meal_6",
    providerId: "prov_3",
    name: "Grilled Chicken Protein Bowl",
    description:
      "Grilled chicken, brown rice, sautéed veggies and a yoghurt-mint dressing.",
    imageUrl:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    price: 220,
    veg: "non_veg",
    category: category("cat_healthy"),
    mealType: "dinner",
    cuisine: "Continental",
    servings: "1 serving",
    rating: 4.9,
    ratingCount: 58,
    prepTimeMins: 45,
    availability: { isAvailable: true, availableToday: true, stockRemaining: 6 },
    isSubscriptionEligible: true,
    addOns: [
      { id: "add_6", name: "Extra chicken", price: 70, veg: "non_veg" },
      { id: "add_7", name: "Peanut salad", price: 40, veg: "veg" },
    ],
  },
  {
    id: "meal_7",
    providerId: "prov_4",
    name: "Gujarati Light Tiffin",
    description:
      "Theplas, moong dal, rice, chaas and a jaggery sweet — low oil and easy on the stomach.",
    imageUrl:
      "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80",
    price: 110,
    veg: "veg",
    category: category("cat_healthy"),
    mealType: "lunch",
    cuisine: "Gujarati",
    servings: "1 serving",
    rating: 4.5,
    ratingCount: 64,
    prepTimeMins: 30,
    availability: { isAvailable: true, availableToday: true },
    isSubscriptionEligible: true,
  },
  {
    id: "meal_8",
    providerId: "prov_4",
    name: "Masala Khichdi & Kadhi",
    description: "Comforting moong khichdi with Gujarati kadhi and papad.",
    imageUrl:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80",
    price: 100,
    veg: "veg",
    category: category("cat_rice"),
    mealType: "dinner",
    cuisine: "Gujarati",
    servings: "1 serving",
    rating: 4.3,
    ratingCount: 41,
    prepTimeMins: 25,
    availability: { isAvailable: true, availableToday: true },
    isSubscriptionEligible: true,
  },
  {
    id: "meal_9",
    providerId: "prov_1",
    name: "Sabudana Vada (6 pcs)",
    description: "Crisp sabudana vadas with peanut chutney. Great evening snack.",
    imageUrl:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
    price: 70,
    veg: "veg",
    category: category("cat_snack"),
    mealType: "snack",
    cuisine: "Maharashtrian",
    servings: "6 pieces",
    rating: 4.6,
    ratingCount: 88,
    prepTimeMins: 20,
    availability: { isAvailable: true, availableToday: true },
    isSubscriptionEligible: false,
  },
];

export interface MealFilters {
  providerId?: string;
  categoryId?: string;
  mealType?: MealType;
  veg?: VegPreference;
  onlyAvailable?: boolean;
  maxPrice?: number;
  subscriptionEligible?: boolean;
}

export async function getMeals(): Promise<Meal[]> {
  return request(MOCK_MEALS);
}

export async function getMealById(id: string): Promise<Meal | null> {
  return request(MOCK_MEALS.find((meal) => meal.id === id) ?? null);
}

export async function getMealsByProvider(providerId: string): Promise<Meal[]> {
  return request(
    MOCK_MEALS.filter((meal) => meal.providerId === providerId),
    { delayMs: 250 }
  );
}

export async function searchMeals(query: string): Promise<Meal[]> {
  const q = query.trim().toLowerCase();
  if (!q) return request(MOCK_MEALS);

  const results = MOCK_MEALS.filter((meal) => {
    const haystack = [
      meal.name,
      meal.description,
      meal.cuisine ?? "",
      meal.category.name,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  return request(results, { delayMs: 250 });
}

export async function filterMeals(filters: MealFilters): Promise<Meal[]> {
  const results = MOCK_MEALS.filter((meal) => {
    if (filters.providerId && meal.providerId !== filters.providerId) return false;
    if (filters.categoryId && meal.category.id !== filters.categoryId) return false;
    if (filters.mealType && meal.mealType !== filters.mealType) return false;
    if (filters.veg && meal.veg !== filters.veg) return false;
    if (filters.onlyAvailable && !meal.availability.isAvailable) return false;
    if (filters.maxPrice && meal.price > filters.maxPrice) return false;
    if (filters.subscriptionEligible && !meal.isSubscriptionEligible) return false;
    return true;
  });

  return request(results, { delayMs: 250 });
}

export async function getMealCategories(): Promise<MealCategory[]> {
  return request(MEAL_CATEGORIES, { delayMs: 120 });
}

/** Meals that can be delivered right now — used by the Instant tab. */
export async function getInstantMeals(): Promise<Meal[]> {
  return request(
    MOCK_MEALS.filter(
      (meal) => meal.availability.isAvailable && meal.availability.availableToday
    ),
    { delayMs: 250 }
  );
}

export function findMealSync(id: string): Meal | undefined {
  const found = MOCK_MEALS.find((meal) => meal.id === id);
  return found ? clone(found) : undefined;
}
