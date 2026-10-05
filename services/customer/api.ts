// services/customer/api.ts
// Shared mock-request helpers for the Customer side.
// Replace the internals of `request` with real fetch() calls when the
// HomeBite backend is ready — every customer service goes through it.

export const CUSTOMER_API_BASE_URL = "https://api.homebite.app"; // TODO: real base URL

/** Simulated network latency (ms). Keep it small so the UI feels alive. */
const DEFAULT_DELAY = 450;

export class CustomerApiError extends Error {
  code: string;
  constructor(message: string, code = "customer_api_error") {
    super(message);
    this.name = "CustomerApiError";
    this.code = code;
  }
}

export function delay(ms: number = DEFAULT_DELAY): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface RequestOptions {
  /** Override the simulated latency. */
  delayMs?: number;
  /** Force a failure — useful for testing error states in the UI. */
  fail?: boolean;
  failMessage?: string;
}

/**
 * Resolve a mock value as if it came from the network.
 * Structured-clones the payload so screens can mutate their copy safely.
 */
export async function request<T>(
  data: T | (() => T),
  options: RequestOptions = {}
): Promise<T> {
  await delay(options.delayMs);

  if (options.fail) {
    throw new CustomerApiError(
      options.failMessage ?? "Something went wrong. Please try again.",
      "mock_failure"
    );
  }

  const value = typeof data === "function" ? (data as () => T)() : data;
  return clone(value);
}

/** Safe deep copy for plain JSON-ish mock data. */
export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Simple id generator for mock records. */
export function createId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${random}`;
}

/** Human-readable order/subscription code, e.g. HB4821. */
export function createCode(prefix = "HB"): string {
  return `${prefix}${Math.floor(1000 + Math.random() * 8999)}`;
}

/** Normalise any thrown value into a message the UI can render. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof CustomerApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Unexpected error. Please try again.";
}

/** ₹ formatting used across the customer UI. */
export function formatCurrency(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function isoDaysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}
