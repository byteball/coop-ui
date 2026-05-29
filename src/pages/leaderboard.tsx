import { createFileRoute } from "@tanstack/react-router";
import * as m from "#/paraglide/messages";

import { useWallet } from "#/entities/user";
import { useCoopState, useAllUsers } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import { ogImageUrl } from "#/shared/lib/ogImage";
import { buildRouteMeta, seoRoutes } from "#/shared/config/seoRoutes";
import { LeaderboardTable, LeaderboardSkeleton } from "#/features/leaderboard";

const leaderboardRoute = seoRoutes.find((r) => r.path === "/leaderboard")!;

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: buildRouteMeta(
      leaderboardRoute,
      ogImageUrl(leaderboardRoute.ogImagePath),
    ),
  }),
  component: Leaderboard,
});

function Leaderboard() {
  const { address } = useWallet();
  const { status, constants } = useCoopState();
  const { coopDecimals, gbyteDecimals, coopSymbol } = useAssetInfo(
    constants?.asset,
  );
  const users = useAllUsers();

  const isLoaded = status === "loaded";

  return (
    <>
      <h2 className="bg-linear-to-b from-foreground to-foreground bg-clip-text mb-6 pb-1 text-2xl font-semibold leading-tighter tracking-tighter text-transparent">
        {m.leaderboard_title()}
      </h2>
      {isLoaded ? (
        <LeaderboardTable
          users={users}
          coopDecimals={coopDecimals}
          gbyteDecimals={gbyteDecimals}
          coopSymbol={coopSymbol}
          connectedAddress={address ?? undefined}
        />
      ) : (
        <LeaderboardSkeleton />
      )}
    </>
  );
}
