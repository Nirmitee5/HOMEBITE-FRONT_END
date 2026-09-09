// services/provider/profile.ts
export type Availability = {
  isAvailable: boolean;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  slots: { id: string; label: string; from: string; to: string }[];
};

export type NotificationPrefs = {
  orders: boolean;
  subscriptions: boolean;
  promotions: boolean;
};

export type ProviderProfile = {
  id: string;
  name: string;
  photo: string | null;
  providerType: "housewife" | "mess" | "home_kitchen";
  approvalStatus: "pending" | "under_review" | "approved" | "rejected";
  rating: number;
  reviewCount: number;
  bio: string;
  phone: string;
  email: string;
  location: string;
  specialties: string[];
  cuisines: string[];
  mealTypes: string[];
  dishCount: number;
  activePlans: number;
  activeSubscribers: number;
  memberSince: string;
  availability: Availability;
  notifications: NotificationPrefs;
};

export const SPECIALTY_OPTIONS = [
  "North Indian", "South Indian", "Maharashtrian", "Punjabi", "Gujarati",
  "Bengali", "Snacks", "Desserts", "Healthy meals", "Tiffin",
];

export const CUISINE_OPTIONS = ["Indian", "Chinese", "Continental", "Jain", "Fusion"];
export const MEAL_TYPE_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Snack"];

let PROFILE: ProviderProfile = {
  id: "prov_001",
  name: "Sunita's Kitchen",
  photo: null,
  providerType: "home_kitchen",
  approvalStatus: "approved",
  rating: 4.7,
  reviewCount: 213,
  bio: "Home-style Maharashtrian and North Indian meals, cooked fresh every morning with zero preservatives.",
  phone: "9876543210",
  email: "sunita@homebite.in",
  location: "Kothrud, Pune",
  specialties: ["Maharashtrian", "North Indian", "Tiffin"],
  cuisines: ["Indian", "Jain"],
  mealTypes: ["Lunch", "Dinner"],
  dishCount: 24,
  activePlans: 3,
  activeSubscribers: 41,
  memberSince: "March 2024",
  availability: {
    isAvailable: true,
    breakfast: false,
    lunch: true,
    dinner: true,
    slots: [
      { id: "s1", label: "Lunch delivery", from: "11:30", to: "13:30" },
      { id: "s2", label: "Dinner delivery", from: "19:00", to: "21:30" },
    ],
  },
  notifications: { orders: true, subscriptions: true, promotions: false },
};

const wait = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// TODO: replace with real backend call — GET /provider/profile
export async function getProviderProfile(): Promise<ProviderProfile> {
  await wait();
  return { ...PROFILE };
}

// TODO: replace with real backend call — PATCH /provider/profile
export async function updateProviderProfile(
  patch: Partial<ProviderProfile>
): Promise<ProviderProfile> {
  await wait(900);
  if (Math.random() < 0.06) throw new Error("Could not save. Please try again.");
  PROFILE = { ...PROFILE, ...patch };
  return { ...PROFILE };
}

// TODO: replace with real upload — POST /provider/profile/photo (multipart)
export async function uploadProfilePhoto(uri: string): Promise<string> {
  await wait(1200);
  PROFILE = { ...PROFILE, photo: uri };
  return uri;
}

export type ValidationErrors = Partial<
  Record<"name" | "email" | "phone" | "bio" | "location" | "specialties", string>
>;

export function validateProfile(p: Partial<ProviderProfile>): ValidationErrors {
  const e: ValidationErrors = {};
  if (!p.name?.trim()) e.name = "Kitchen name is required";
  else if (p.name.trim().length < 3) e.name = "At least 3 characters";
  if (!p.email?.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) e.email = "Enter a valid email";
  if (!p.phone?.trim()) e.phone = "Phone is required";
  else if (!/^[6-9]\d{9}$/.test(p.phone.replace(/\D/g, ""))) e.phone = "Enter a valid 10-digit number";
  if (!p.bio?.trim()) e.bio = "Tell customers about your food";
  else if (p.bio.trim().length < 30) e.bio = "At least 30 characters";
  else if (p.bio.trim().length > 300) e.bio = "Keep it under 300 characters";
  if (!p.location?.trim()) e.location = "Location is required";
  if (!p.specialties?.length) e.specialties = "Pick at least one specialty";
  return e;
}
