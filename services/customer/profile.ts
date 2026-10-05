// services/customer/profile.ts
// Customer profile + delivery addresses. Mock store for now.

import type { Customer, CustomerAddress } from "../../types/customer";
import { clone, createId, request } from "./api";

export const MOCK_ADDRESSES: CustomerAddress[] = [
  {
    id: "addr_1",
    label: "Home",
    type: "home",
    line1: "B-402, Sai Residency",
    line2: "Near Shanti Nagar Garden",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    deliveryInstructions: "Ring the bell twice",
    isDefault: true,
  },
  {
    id: "addr_2",
    label: "Office",
    type: "work",
    line1: "5th Floor, Tech Park One",
    line2: "Yerwada",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411006",
    deliveryInstructions: "Leave at the reception",
    isDefault: false,
  },
];

let customer: Customer = {
  id: "cust_1",
  name: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  phone: "+91 98765 43210",
  photoUrl:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  defaultAddressId: "addr_1",
  notifications: {
    orderUpdates: true,
    subscriptionUpdates: true,
    promotions: false,
  },
  createdAt: "2025-02-14T10:00:00.000Z",
};

export const MOCK_CUSTOMER = customer;

let addresses: CustomerAddress[] = clone(MOCK_ADDRESSES);

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  notifications?: Partial<Customer["notifications"]>;
}

export type AddressInput = Omit<CustomerAddress, "id">;

/* ---------------- validation ---------------- */

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateProfile(input: UpdateProfileInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (input.name !== undefined && input.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters.";
  }
  if (input.email !== undefined && !/^\S+@\S+\.\S+$/.test(input.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (
    input.phone !== undefined &&
    input.phone.replace(/\D/g, "").length < 10
  ) {
    errors.phone = "Enter a valid 10-digit phone number.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateAddress(input: Partial<AddressInput>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.label || input.label.trim().length < 2) {
    errors.label = "Add a label like Home or Office.";
  }
  if (!input.line1 || input.line1.trim().length < 5) {
    errors.line1 = "Enter the flat / building details.";
  }
  if (!input.city || input.city.trim().length < 2) {
    errors.city = "City is required.";
  }
  if (!input.pincode || !/^\d{6}$/.test(input.pincode.trim())) {
    errors.pincode = "Enter a valid 6-digit pincode.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/* ---------------- profile ---------------- */

export async function getCustomerProfile(): Promise<Customer> {
  return request(() => customer);
}

export async function updateCustomerProfile(
  input: UpdateProfileInput
): Promise<Customer> {
  const result = validateProfile(input);
  if (!result.valid) {
    throw new Error(Object.values(result.errors)[0]);
  }

  customer = {
    ...customer,
    ...input,
    notifications: { ...customer.notifications, ...(input.notifications ?? {}) },
  };

  return request(() => customer, { delayMs: 550 });
}

/* ---------------- addresses ---------------- */

export async function getAddresses(): Promise<CustomerAddress[]> {
  return request(() => addresses);
}

export async function getSelectedAddress(): Promise<CustomerAddress | null> {
  return request(
    () => addresses.find((a) => a.isDefault) ?? addresses[0] ?? null,
    { delayMs: 150 }
  );
}

export async function addAddress(input: AddressInput): Promise<CustomerAddress> {
  const result = validateAddress(input);
  if (!result.valid) throw new Error(Object.values(result.errors)[0]);

  const address: CustomerAddress = { ...input, id: createId("addr") };
  if (address.isDefault) {
    addresses = addresses.map((a) => ({ ...a, isDefault: false }));
  }
  addresses = [...addresses, address];
  if (address.isDefault) customer = { ...customer, defaultAddressId: address.id };

  return request(address, { delayMs: 500 });
}

export async function updateAddress(
  id: string,
  input: Partial<AddressInput>
): Promise<CustomerAddress> {
  const existing = addresses.find((a) => a.id === id);
  if (!existing) throw new Error("Address not found.");

  const merged = { ...existing, ...input };
  const result = validateAddress(merged);
  if (!result.valid) throw new Error(Object.values(result.errors)[0]);

  addresses = addresses.map((a) =>
    a.id === id ? merged : merged.isDefault ? { ...a, isDefault: false } : a
  );
  if (merged.isDefault) customer = { ...customer, defaultAddressId: id };

  return request(merged, { delayMs: 450 });
}

export async function deleteAddress(id: string): Promise<{ id: string }> {
  const existing = addresses.find((a) => a.id === id);
  if (!existing) throw new Error("Address not found.");
  if (addresses.length === 1) {
    throw new Error("Keep at least one delivery address.");
  }

  addresses = addresses.filter((a) => a.id !== id);
  if (existing.isDefault && addresses.length) {
    addresses[0] = { ...addresses[0], isDefault: true };
    customer = { ...customer, defaultAddressId: addresses[0].id };
  }

  return request({ id }, { delayMs: 350 });
}

export async function selectAddress(id: string): Promise<CustomerAddress> {
  const target = addresses.find((a) => a.id === id);
  if (!target) throw new Error("Address not found.");

  addresses = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
  customer = { ...customer, defaultAddressId: id };

  return request({ ...target, isDefault: true }, { delayMs: 250 });
}

export function formatAddress(address: CustomerAddress): string {
  return [address.line1, address.line2, `${address.city} ${address.pincode}`]
    .filter(Boolean)
    .join(", ");
}
