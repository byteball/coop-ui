import { createFileRoute } from "@tanstack/react-router";
import * as m from "#/paraglide/messages";

import { ogImageMeta } from "#/shared/lib/ogImage";

const FAQ_TITLE = "F.A.Q. — Obyte COOP";
const FAQ_DESCRIPTION =
  "Frequently asked questions about the COOP token: deposits, voting, emissions, governance, and referrals.";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: FAQ_TITLE },
      { name: "description", content: FAQ_DESCRIPTION },
      { property: "og:title", content: FAQ_TITLE },
      { property: "og:description", content: FAQ_DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: FAQ_TITLE },
      { name: "twitter:description", content: FAQ_DESCRIPTION },
      ...ogImageMeta("/og/faq.png"),
    ],
  }),
  component: Faq,
});

const faqKeys = [
  ["faq_q_what", "faq_a_what"],
  ["faq_q_goal", "faq_a_goal"],
  ["faq_q_start", "faq_a_start"],
  ["faq_q_emission", "faq_a_emission"],
  ["faq_q_contributions", "faq_a_contributions"],
  ["faq_q_voting", "faq_a_voting"],
  ["faq_q_eligibility", "faq_a_eligibility"],
  ["faq_q_gbyte", "faq_a_gbyte"],
  ["faq_q_referrals", "faq_a_referrals"],
  ["faq_q_tit_for_tat", "faq_a_tit_for_tat"],
  ["faq_q_governance", "faq_a_governance"],
  ["faq_q_growth", "faq_a_growth"],
  ["faq_q_why", "faq_a_why"],
] as const;

function Faq() {
  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">{m.nav_faq()}</h2>
      <div className="flex max-w-3xl flex-col gap-6">
        {faqKeys.map(([qKey, aKey]) => (
          <div key={qKey}>
            <h3 className="mb-1 text-xl font-semibold">{m[qKey]()}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {m[aKey]()}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
