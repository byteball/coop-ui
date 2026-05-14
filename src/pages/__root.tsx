import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import TanStackQueryProvider from "#/app/providers/query-provider";
import { AppLayout } from "#/widgets/layout";

import TanStackQueryDevtools from "#/app/providers/query-devtools";

import { getLocale } from "#/paraglide/runtime";
import { ogImageMeta } from "#/shared/lib/ogImage";
import { useTrackReferrer } from "#/features/referrals";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

const BASE_DESCRIPTION =
  "COOP is a cooperative token on the Obyte DAG that rewards community contributions through staking, voting, and daily emissions.";

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { title: "Obyte COOP" },
      { name: "description", content: BASE_DESCRIPTION },
      { property: "og:site_name", content: "Obyte COOP" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Obyte COOP" },
      { property: "og:description", content: BASE_DESCRIPTION },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Obyte COOP" },
      { name: "twitter:description", content: BASE_DESCRIPTION },
      ...ogImageMeta("/og/home.png"),
    ],
  }),
  beforeLoad: async () => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", getLocale());
    }
  },
  component: RootLayout,
});

function RootLayout() {
  useTrackReferrer();

  return (
    <TanStackQueryProvider>
      <HeadContent />
      <AppLayout>
        <Outlet />
      </AppLayout>
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </TanStackQueryProvider>
  );
}
