import type { FC } from "react";

import { Card, CardContent, CardTitle } from "#/shared/ui/card";
import { toLocalString } from "#/shared/lib/toLocalString";

import * as m from "#/paraglide/messages";

interface VotesCardProps {
  totalVotes: number;
}

export const VotesCard: FC<VotesCardProps> = ({ totalVotes }) => {
  return (
    <Card>
      <CardContent>
        <CardTitle>{m.profile_votes_title()}</CardTitle>
        <div className="mt-2 text-lg lg:text-xl">
          {toLocalString(totalVotes)}
        </div>
      </CardContent>
    </Card>
  );
};
