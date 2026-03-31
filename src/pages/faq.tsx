import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({ component: Faq });

function Faq() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-8 pt-8">
      <h2 className="mb-4 text-lg font-semibold">F.A.Q.</h2>
      <p className="text-muted-foreground">Coming soon.</p>
    </main>
  );
}
