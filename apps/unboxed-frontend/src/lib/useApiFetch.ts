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
      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }
      return res.json() as Promise<T>;
    },
    [getAccessTokenSilently],
  );

  return apiFetch;
}
