export interface SeoRoute {
  /** URL path (no locale prefix), e.g. "/" or "/faq". */
  path: string;
  title: string;
  description: string;
  /** Path on the OG service, e.g. "/og/home.png". */
  ogImagePath: string;
}

export const SITE_NAME = "Obyte COOP";

export const BASE_DESCRIPTION =
  "COOP is a cooperative token on the Obyte DAG that rewards community contributions through staking, voting, and daily emissions.";

export const seoRoutes: SeoRoute[] = [
  {
    path: "/",
    title: "Obyte COOP — Cooperative Token on Obyte",
    description:
      "Lock COOP or GBYTE to earn daily emissions, vote for contributors, and participate in governance of the Obyte cooperative.",
    ogImagePath: "/og/home.png",
  },
  {
    path: "/faq",
    title: "F.A.Q. — Obyte COOP",
    description:
      "Frequently asked questions about the COOP token: deposits, voting, emissions, governance, and referrals.",
    ogImagePath: "/og/faq.png",
  },
  {
    path: "/leaderboard",
    title: "Leaderboard — Obyte COOP",
    description:
      "Top COOP cooperative members ranked by locked balance and votes received.",
    ogImagePath: "/og/leaderboard.png",
  },
  {
    path: "/governance",
    title: "Governance — Obyte COOP",
    description:
      "Vote on COOP protocol parameters: emission rates, referral rewards, attestors, and more. Quadratic voting with a 3-day challenging period.",
    ogImagePath: "/og/governance.png",
  },
  // Fallback stub for any /user/$address URL — hosting must rewrite
  // `/user/*` to `/user/index.html` (status 200, not redirect) for crawlers
  // to pick this up. Per-address OG images aren't possible from static HTML;
  // social previews on user pages fall back to the home image.
  {
    path: "/user",
    title: "Contributor profile — Obyte COOP",
    description:
      "View a contributor profile on Obyte COOP: locked balance and votes received.",
    ogImagePath: "/og/home.png",
  },
];

/**
 * Builds the runtime meta array consumed by TanStack Router's `head` callback.
 * The build-time prerender plugin emits the equivalent static `<meta>` tags.
 */
export const buildRouteMeta = (
  route: SeoRoute,
  ogImageUrl: string | undefined,
) => {
  const meta: Array<Record<string, string>> = [
    { title: route.title },
    { name: "description", content: route.description },
    { property: "og:title", content: route.title },
    { property: "og:description", content: route.description },
    { property: "og:type", content: "website" },
    { name: "twitter:title", content: route.title },
    { name: "twitter:description", content: route.description },
  ];
  if (ogImageUrl) {
    meta.push(
      { property: "og:image", content: ogImageUrl },
      { name: "twitter:image", content: ogImageUrl },
    );
  }
  return meta;
};
