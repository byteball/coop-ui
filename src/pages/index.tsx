import { createFileRoute } from "@tanstack/react-router";
import { ParaglideMessage } from "@inlang/paraglide-js-react";
import * as m from "#/paraglide/messages";

import { Card } from "#/shared/ui/card";
import { ogImageMeta } from "#/shared/lib/ogImage";
import {
  KitIllustration,
  VisualizationIllustration,
  ScheduleIllustation,
} from "#/widgets/hero-illustrations";
import { DepositForm } from "#/features/deposit";

const INDEX_TITLE = "Obyte COOP — Cooperative Token on Obyte";
const INDEX_DESCRIPTION =
  "Lock COOP or GBYTE to earn daily emissions, vote for contributors, and participate in governance of the Obyte cooperative.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: INDEX_TITLE },
      { name: "description", content: INDEX_DESCRIPTION },
      { property: "og:title", content: INDEX_TITLE },
      { property: "og:description", content: INDEX_DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: INDEX_TITLE },
      { name: "twitter:description", content: INDEX_DESCRIPTION },
      ...ogImageMeta("/og/home.png"),
    ],
  }),
  component: App,
});

function HeroSection() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div>
            <span className="text-primary font-mono text-sm uppercase">
              {m.hero_label()}
            </span>
            <h1 className="mt-6 bg-linear-to-b from-foreground to-foreground bg-clip-text text-4xl font-semibold tracking-tighter text-transparent md:text-5xl">
              {m.hero_title({ contributing: m.hero_contributing() })}
            </h1>
            <p className="text-muted-foreground mt-6 text-balance text-lg">
              <ParaglideMessage
                message={m.hero_subtitle}
                inputs={{}}
                markup={{
                  link: ({ children }) => (
                    <a
                      href="https://obyte.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link font-medium"
                    >
                      {children}
                    </a>
                  ),
                }}
              />
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
              {m.how_it_works_label()}
            </span>
            <h2 className="text-foreground mt-4 text-3xl font-semibold md:text-4xl">
              {m.how_it_works_title()}
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Card className="grid grid-rows-[auto_1fr] gap-6 rounded-2xl border border-border/50 p-6 shadow-lg shadow-black/10">
              <div className="text-balance">
                <h3 className="text-foreground font-semibold">
                  {m.how_it_works_lock_title()}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  {m.how_it_works_lock_desc()}
                </p>
              </div>
              <KitIllustration />
            </Card>

            <Card className="grid grid-rows-[auto_1fr] gap-6 rounded-2xl border border-border/50 p-6 shadow-lg shadow-black/10">
              <div className="text-balance">
                <h3 className="text-foreground font-semibold">
                  {m.how_it_works_emission_title()}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  {m.how_it_works_emission_desc()}
                </p>
              </div>
              <ScheduleIllustation />
            </Card>

            <Card className="md:col-span-2 grid gap-6 overflow-hidden rounded-2xl border border-border/50 p-6 shadow-lg shadow-black/10 md:grid-cols-2">
              <div className="text-balance self-center">
                <h3 className="text-foreground font-semibold">
                  {m.how_it_works_vote_title()}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  {m.how_it_works_vote_desc()}
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
