import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/leaderboard")({
  component: Leaderboard,
});

function Leaderboard() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-8 pt-8">
      <h2 className="mb-4 text-lg font-semibold">Leaderboard</h2>
      <p className="text-muted-foreground">Coming soon.</p>
    </main>
  );
}
