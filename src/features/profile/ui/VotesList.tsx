import { Fragment } from "react";
import type { FC } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card";
import { Separator } from "#/shared/ui/separator";
import { getVotesDivisor, useVotesReceived } from "#/entities/coop";
import { useDisplayName } from "#/entities/attestation";

import { VoteRow } from "./VoteRow";

import * as m from "#/paraglide/messages";

interface VotesListProps {
  address: string;
  coopDecimals: number;
}

export const VotesList: FC<VotesListProps> = ({ address, coopDecimals }) => {
  const voteRecords = useVotesReceived(address);
  const rawName = useDisplayName(address);
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const votesDivisor = getVotesDivisor(coopDecimals);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.profile_votes_list_title({ name })}</CardTitle>
      </CardHeader>
      <CardContent>
        {voteRecords.length > 0 ? (
          <div className="space-y-2 text-sm">
            {voteRecords.map((record, i) => (
              <Fragment key={record.fromAddress}>
                {i > 0 && <Separator />}
                <VoteRow
                  counterpartyAddress={record.fromAddress}
                  ts={record.ts}
                  votes={record.votes}
                  votesDivisor={votesDivisor}
                  strength={record.strength}
                  isSelfVote={record.fromAddress === address}
                />
              </Fragment>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-muted-foreground">
            {m.profile_votes_empty()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
