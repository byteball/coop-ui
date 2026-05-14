import { createFileRoute } from "@tanstack/react-router";

import { ogImageMeta } from "#/shared/lib/ogImage";
import { Faq } from "#/widgets/faq";

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
