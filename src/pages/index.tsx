import { createFileRoute } from "@tanstack/react-router";

import { DepositForm } from "#/features/deposit";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-8 pt-8">
      <div className="max-w-lg">
        <h2 className="mb-4 text-lg font-semibold">Deposit</h2>
        <DepositForm />
      </div>
    </main>
  );
}
