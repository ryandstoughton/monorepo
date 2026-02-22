import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL as string;

export function useApiFetch() {
  const { getAccessTokenSilently } = useAuth0();

  const apiFetch = useCallback(
    async <T>(path: string, init?: RequestInit): Promise<T> => {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${token}`,
        },
      });
      const text = await res.text();
      if (!res.ok) {
        throw new Error(text || `API error: ${res.status} ${res.statusText}`);
      }
      if (!text) return undefined as T;
      return JSON.parse(text) as T;
    },
    [getAccessTokenSilently],
  );

  return apiFetch;
}
