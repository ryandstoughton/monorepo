import { createFileRoute } from "@tanstack/react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useApiFetch } from "../lib/useApiFetch";

interface User {
  id: number;
  email: string;
  auth0Id: string;
  name: string | null;
}

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { isAuthenticated, isLoading } = useAuth0();
  const apiFetch = useApiFetch();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    void apiFetch<User>("/auth/me").then(setUser);
  }, [isAuthenticated, apiFetch]);

  return (
    <div style={{ padding: "1.5rem" }}>
      <h1>Unboxed</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : isAuthenticated && user ? (
        <p>Welcome, {user.name ?? user.email}!</p>
      ) : (
        <p>Sign in to get started.</p>
      )}
    </div>
  );
}
