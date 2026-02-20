import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <div className="flex flex-1 flex-col p-4 sm:p-6 lg:p-8"></div>;
}
