import { createFileRoute } from "@tanstack/react-router";
import * as m from "#/paraglide/messages";

import { Card } from "#/shared/ui/card";
import { KitIllustration } from "#/shared/ui/illustrations/kit-illustration";
import { VisualizationIllustration } from "#/shared/ui/illustrations/visualization-illustration";
import { ScheduleIllustation } from "#/shared/ui/illustrations/schedule-illustration";
import { DepositForm } from "#/features/deposit";

export const Route = createFileRoute("/")({ component: App });

function HeroSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div>
            <span className="text-primary font-mono text-sm uppercase">
              Cooperative Community
            </span>
            <h1 className="mt-6 text-4xl font-semibold md:text-5xl">
              Earn rewards for{" "}
              <span className="bg-linear-to-b from-foreground/50 to-foreground/95 bg-clip-text text-transparent [-webkit-text-stroke:0.5px_var(--color-foreground)]">
                contributing
              </span>{" "}
              to the community
            </h1>
            <p className="text-muted-foreground mt-6 text-balance text-lg">
              Lock tokens, vote for contributors, and receive daily emission
              rewards. All governed by the community.
            </p>
          </div>
          <div className="ring-foreground/10 rounded-2xl border border-border/50 bg-card/50 p-6 shadow-xl shadow-black/10 ring-1 backdrop-blur">
            <h2 className="mb-4 text-lg font-semibold">{m.deposit_title()}</h2>
            <DepositForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section>
      <div className="@container pb-16 md:pb-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="text-center">
            <span className="text-primary font-mono text-sm uppercase">
              How it works
            </span>
            <h2 className="text-foreground mt-4 text-3xl font-semibold md:text-4xl">
              Deposit, vote, earn
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Card className="grid grid-rows-[auto_1fr] gap-6 rounded-2xl border border-border/50 p-6 shadow-lg shadow-black/10">
              <div className="text-balance">
                <h3 className="text-foreground font-semibold">
                  Deposit & Lock
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Lock COOP or GBYTE for 1+ year to earn voting power and
                  emission share.
                </p>
              </div>
              <KitIllustration />
            </Card>

            <Card className="grid grid-rows-[auto_1fr] gap-6 rounded-2xl border border-border/50 p-6 shadow-lg shadow-black/10">
              <div className="text-balance">
                <h3 className="text-foreground font-semibold">
                  Daily Emission
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  New COOP is minted daily — locked rewards grow your balance,
                  liquid rewards are claimable.
                </p>
              </div>
              <ScheduleIllustation />
            </Card>

            <Card className="md:col-span-2 grid gap-6 overflow-hidden rounded-2xl border border-border/50 p-6 shadow-lg shadow-black/10 md:grid-cols-2">
              <div className="text-balance self-center">
                <h3 className="text-foreground font-semibold">Vote & Earn</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Vote for useful contributors. Bigger lock — stronger vote.
                  Votes expire in 3 months.
                </p>
              </div>
              <div className="-mb-6 -mr-6 md:translate-y-4">
                <VisualizationIllustration />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  );
}
