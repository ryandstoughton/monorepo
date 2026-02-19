import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAuth0 } from "@auth0/auth0-react";

function RootComponent() {
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading, error } =
    useAuth0();

  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 1.5rem",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <strong>Unboxed</strong>
        <div>
          {error ? (
            <span style={{ color: "red" }}>Auth error: {error.message}</span>
          ) : isLoading ? null : isAuthenticated ? (
            <span
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
              <span>{user?.name ?? user?.email}</span>
              <button
                onClick={() => {
                  void logout({
                    logoutParams: { returnTo: window.location.origin },
                  });
                }}
              >
                Log out
              </button>
            </span>
          ) : (
            <button
              onClick={() => {
                void loginWithRedirect();
              }}
            >
              Log in
            </button>
          )}
        </div>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
