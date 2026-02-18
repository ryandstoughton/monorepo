import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { apiFetch } from "../lib/api";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  useEffect(() => {
    void apiFetch("/users").then((data) => console.log("users:", data));
  }, []);

  return (
    <div>
      <h1>Unboxed</h1>
    </div>
  );
}
