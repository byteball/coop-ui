import { createFileRoute } from "@tanstack/react-router";
import { ParaglideMessage } from "@inlang/paraglide-js-react";
import * as m from "#/paraglide/messages";

import { Card } from "#/shared/ui/card";
import { ogImageUrl } from "#/shared/lib/ogImage";
import { buildRouteMeta, seoRoutes } from "#/shared/config/seoRoutes";
import {
  KitIllustration,
  VisualizationIllustration,
  ScheduleIllustation,
} from "#/widgets/hero-illustrations";
import { DepositForm } from "#/features/deposit";

const indexRoute = seoRoutes.find((r) => r.path === "/")!;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: buildRouteMeta(indexRoute, ogImageUrl(indexRoute.ogImagePath)),
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
            <h1 className="mt-6 bg-linear-to-b from-foreground to-foreground bg-clip-text pb-1 text-4xl font-semibold leading-tighter tracking-tighter text-transparent md:text-5xl">
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
          <div className="ring-foreground/10 rounded-2xl border border-border/50 bg-card/50 p-6 ring-1 backdrop-blur">
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
            <h2 className="bg-linear-to-b from-foreground to-foreground bg-clip-text mt-4 pb-1 text-3xl font-semibold leading-tighter tracking-tighter text-transparent md:text-4xl">
              {m.how_it_works_title()}
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2">
            <Card className="relative overflow-hidden rounded-3xl border-0 bg-card p-7 md:col-span-2">
              <div
                aria-hidden
                className="absolute -top-20 -right-10 size-64 rounded-full bg-emerald-500/10 blur-3xl"
              />
              <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
                <div className="text-balance">
                  <h3 className="text-foreground text-2xl font-semibold tracking-tight">
                    {m.how_it_works_lock_title()}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {m.how_it_works_lock_desc()}
                  </p>
                </div>
                <KitIllustration />
              </div>
            </Card>

            <Card className="relative overflow-hidden rounded-3xl border-0 bg-card p-7 md:col-span-2">
              <div
                aria-hidden
                className="absolute -bottom-24 -right-16 size-72 rounded-full bg-sky-500/15 blur-3xl"
              />
              <div
                aria-hidden
                className="absolute -bottom-20 right-32 size-48 rounded-full bg-sky-400/10 blur-3xl"
              />
              <div className="relative grid items-center gap-6 md:grid-cols-[1fr_1.2fr]">
                <div className="text-balance">
                  <h3 className="text-foreground text-2xl font-semibold tracking-tight">
                    {m.how_it_works_emission_title()}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {m.how_it_works_emission_desc()}
                  </p>
                </div>
                <ScheduleIllustation />
              </div>
            </Card>

            <Card className="relative overflow-hidden rounded-3xl border-0 bg-card p-7 md:col-start-3 md:row-span-2 md:row-start-1">
              <div
                aria-hidden
                className="absolute -top-20 -left-10 size-64 rounded-full bg-indigo-500/10 blur-3xl"
              />
              <div className="relative flex h-full flex-col gap-6">
                <div className="text-balance">
                  <h3 className="text-foreground text-2xl font-semibold tracking-tight">
                    {m.how_it_works_vote_title()}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {m.how_it_works_vote_desc()}
                  </p>
                </div>
                <div className="flex-1">
                  <VisualizationIllustration />
                </div>
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
