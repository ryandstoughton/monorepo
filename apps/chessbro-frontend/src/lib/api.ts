const API_URL = import.meta.env.VITE_API_URL as string;

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `API error: ${res.status} ${res.statusText}`);
  }
  if (!text) {
    throw new Error(
      `Empty response from ${init?.method ?? "GET"} ${path} (status ${res.status})`,
    );
  }
  return JSON.parse(text) as T;
}
