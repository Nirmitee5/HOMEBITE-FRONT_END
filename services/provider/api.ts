// TODO: replace with your real backend base URL (or read from expo-constants / .env)
export const API_BASE_URL = "https://api.homebite.example.com";

export const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      // TODO: attach auth token
      // Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}
