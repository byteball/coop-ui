import { createFileRoute } from "@tanstack/react-router";

import { ogImageUrl } from "#/shared/lib/ogImage";
import { buildRouteMeta, seoRoutes } from "#/shared/config/seoRoutes";
import { Faq } from "#/widgets/faq";

const faqRoute = seoRoutes.find((r) => r.path === "/faq")!;

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: buildRouteMeta(faqRoute, ogImageUrl(faqRoute.ogImagePath)),
  }),
  component: Faq,
});
