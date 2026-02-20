import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useApiFetch } from "../lib/useApiFetch";

function RootComponent() {
  const { isAuthenticated, loginWithRedirect, logout, isLoading, error } =
    useAuth0();
  const apiFetch = useApiFetch();

  useEffect(() => {
    if (!isAuthenticated) return;
    void apiFetch("/auth/me");
  }, [isAuthenticated, apiFetch]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 font-sans text-gray-100">
      <nav className="flex h-14 shrink-0 items-center justify-between border-b border-gray-800 px-4 sm:px-6 lg:px-8">
        <span className="text-base font-semibold tracking-tight">Chessbro</span>
        <div className="flex items-center gap-3">
          {error ? (
            <span className="text-sm text-red-400">
              Auth error: {error.message}
            </span>
          ) : isLoading ? null : isAuthenticated ? (
            <button
              className="rounded-md border border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800"
              onClick={() =>
                void logout({
                  logoutParams: { returnTo: window.location.origin },
                })
              }
            >
              Log out
            </button>
          ) : (
            <button
              className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200"
              onClick={() => void loginWithRedirect()}
            >
              Log in
            </button>
          )}
        </div>
      </nav>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
