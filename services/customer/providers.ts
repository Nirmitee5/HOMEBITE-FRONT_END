// services/customer/providers.ts
// Customer-facing provider discovery. Mock data now, API later.

import type { MealType, ProviderSummary, ProviderType } from "../../types/customer";
import { clone, request } from "./api";

export interface ProviderStory {
  providerId: string;
  about: string;
  preparationStyle: string;
  deliveryInfo: string;
  distanceKm: number;
  mealTimings: { mealType: MealType; window: string }[];
  offersSubscriptions: boolean;
}

export const MOCK_PROVIDERS: ProviderSummary[] = [
  {
    id: "prov_1",
    name: "Meera's Kitchen",
    type: "housewife",
    photoUrl:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
    rating: 4.7,
    ratingCount: 268,
    cuisineTypes: ["North Indian", "Punjabi"],
    foodSpecialties: ["Thali", "Dal", "Homestyle sabzi"],
    mealTypes: ["breakfast", "lunch", "dinner"],
    deliveryRadiusKm: 5,
    isAvailable: true,
    prepTimeMins: 35,
    approvalStatus: "approved",
    address: { line1: "12, Shanti Nagar", city: "Pune", pincode: "411001" },
  },
  {
    id: "prov_2",
    name: "Annapurna Mess",
    type: "mess",
    photoUrl:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    rating: 4.4,
    ratingCount: 512,
    cuisineTypes: ["Maharashtrian", "South Indian"],
    foodSpecialties: ["Unlimited thali", "Poha", "Rice plate"],
    mealTypes: ["lunch", "dinner"],
    deliveryRadiusKm: 7,
    isAvailable: true,
    prepTimeMins: 25,
    approvalStatus: "approved",
    address: { line1: "Near FC Road", city: "Pune", pincode: "411004" },
  },
  {
    id: "prov_3",
    name: "Thomas Home Kitchen",
    type: "home_kitchen",
    photoUrl:
      "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&q=80",
    rating: 4.8,
    ratingCount: 143,
    cuisineTypes: ["Kerala", "Continental"],
    foodSpecialties: ["Appam stew", "Grilled chicken", "Healthy bowls"],
    mealTypes: ["breakfast", "lunch", "dinner", "snack"],
    deliveryRadiusKm: 4,
    isAvailable: false,
    prepTimeMins: 45,
    approvalStatus: "approved",
    address: { line1: "Lane 5, Koregaon Park", city: "Pune", pincode: "411036" },
  },
  {
    id: "prov_4",
    name: "Sunita's Tiffin",
    type: "housewife",
    photoUrl:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    rating: 4.5,
    ratingCount: 91,
    cuisineTypes: ["Gujarati", "Healthy"],
    foodSpecialties: ["Low oil meals", "Khichdi", "Theplas"],
    mealTypes: ["lunch", "dinner"],
    deliveryRadiusKm: 3,
    isAvailable: true,
    prepTimeMins: 30,
    approvalStatus: "approved",
    address: { line1: "Sai Residency, Wakad", city: "Pune", pincode: "411057" },
  },
];

const MOCK_STORIES: ProviderStory[] = [
  {
    providerId: "prov_1",
    about:
      "Fresh homemade meals prepared with simple ingredients and delivered locally. Cooking for families in Shanti Nagar for the last 9 years.",
    preparationStyle: "Homestyle, low oil, cooked fresh for every meal slot",
    deliveryInfo: "Free delivery within 3 km · ₹20 beyond that",
    distanceKm: 1.2,
    mealTimings: [
      { mealType: "breakfast", window: "7:30 AM – 9:30 AM" },
      { mealType: "lunch", window: "12:00 PM – 2:00 PM" },
      { mealType: "dinner", window: "7:30 PM – 9:30 PM" },
    ],
    offersSubscriptions: true,
  },
  {
    providerId: "prov_2",
    about:
      "A neighbourhood mess serving hearty unlimited thalis to students and working professionals since 2011.",
    preparationStyle: "Batch cooked in small lots, served hot",
    deliveryInfo: "Delivery partner pickup · 25–35 mins",
    distanceKm: 2.6,
    mealTimings: [
      { mealType: "lunch", window: "11:30 AM – 2:30 PM" },
      { mealType: "dinner", window: "7:00 PM – 10:00 PM" },
    ],
    offersSubscriptions: true,
  },
  {
    providerId: "prov_3",
    about:
      "Small home kitchen focused on Kerala classics and protein-rich bowls. Everything is made to order.",
    preparationStyle: "Made-to-order, coconut oil, no preservatives",
    deliveryInfo: "Self delivery within 4 km",
    distanceKm: 3.4,
    mealTimings: [
      { mealType: "breakfast", window: "8:00 AM – 10:00 AM" },
      { mealType: "lunch", window: "12:30 PM – 2:30 PM" },
      { mealType: "dinner", window: "8:00 PM – 10:00 PM" },
    ],
    offersSubscriptions: false,
  },
  {
    providerId: "prov_4",
    about:
      "Light Gujarati tiffins with a healthy twist — perfect for everyday lunch at the office.",
    preparationStyle: "Low oil, no onion-garlic options available",
    deliveryInfo: "Free delivery on subscriptions",
    distanceKm: 4.8,
    mealTimings: [
      { mealType: "lunch", window: "12:00 PM – 1:30 PM" },
      { mealType: "dinner", window: "7:30 PM – 9:00 PM" },
    ],
    offersSubscriptions: true,
  },
];

export interface ProviderFilters {
  type?: ProviderType;
  mealType?: MealType;
  onlyAvailable?: boolean;
  maxDistanceKm?: number;
  minRating?: number;
}

export async function getProviders(): Promise<ProviderSummary[]> {
  return request(MOCK_PROVIDERS);
}

export async function getProviderById(
  id: string
): Promise<ProviderSummary | null> {
  const found = MOCK_PROVIDERS.find((provider) => provider.id === id) ?? null;
  return request(found);
}

export async function getProviderStory(
  providerId: string
): Promise<ProviderStory | null> {
  const found = MOCK_STORIES.find((s) => s.providerId === providerId) ?? null;
  return request(found, { delayMs: 200 });
}

export async function searchProviders(
  query: string
): Promise<ProviderSummary[]> {
  const q = query.trim().toLowerCase();
  if (!q) return request(MOCK_PROVIDERS);

  const results = MOCK_PROVIDERS.filter((provider) => {
    const haystack = [
      provider.name,
      ...provider.cuisineTypes,
      ...provider.foodSpecialties,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  return request(results, { delayMs: 250 });
}

export async function filterProviders(
  filters: ProviderFilters
): Promise<ProviderSummary[]> {
  const results = MOCK_PROVIDERS.filter((provider) => {
    if (filters.type && provider.type !== filters.type) return false;
    if (filters.mealType && !provider.mealTypes.includes(filters.mealType))
      return false;
    if (filters.onlyAvailable && !provider.isAvailable) return false;
    if (filters.minRating && provider.rating < filters.minRating) return false;
    if (filters.maxDistanceKm) {
      const story = MOCK_STORIES.find((s) => s.providerId === provider.id);
      if (story && story.distanceKm > filters.maxDistanceKm) return false;
    }
    return true;
  });

  return request(results, { delayMs: 250 });
}

/** Synchronous lookup for mock wiring inside other services. */
export function findProviderSync(id: string): ProviderSummary | undefined {
  const found = MOCK_PROVIDERS.find((provider) => provider.id === id);
  return found ? clone(found) : undefined;
}

export function getProviderDistanceKm(providerId: string): number {
  return MOCK_STORIES.find((s) => s.providerId === providerId)?.distanceKm ?? 2;
}
