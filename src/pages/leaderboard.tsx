import { createFileRoute } from "@tanstack/react-router";
import * as m from "#/paraglide/messages";

import { useWallet } from "#/entities/user";
import { useCoopState, useAllUsers } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import { ogImageMeta } from "#/shared/lib/ogImage";
import { LeaderboardTable, LeaderboardSkeleton } from "#/features/leaderboard";

const LEADERBOARD_TITLE = "Leaderboard — Obyte COOP";
const LEADERBOARD_DESCRIPTION =
  "Top COOP cooperative members ranked by locked balance and votes received.";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: LEADERBOARD_TITLE },
      { name: "description", content: LEADERBOARD_DESCRIPTION },
      { property: "og:title", content: LEADERBOARD_TITLE },
      { property: "og:description", content: LEADERBOARD_DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: LEADERBOARD_TITLE },
      { name: "twitter:description", content: LEADERBOARD_DESCRIPTION },
      ...ogImageMeta("/og/leaderboard.png"),
    ],
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
      <h2 className="mb-6 text-2xl font-bold">{m.leaderboard_title()}</h2>
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
