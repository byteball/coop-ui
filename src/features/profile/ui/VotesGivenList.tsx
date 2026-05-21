import { Fragment } from "react";
import type { FC } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card";
import { Separator } from "#/shared/ui/separator";
import { getVotesDivisor, useVotesGiven } from "#/entities/coop";
import { useDisplayName } from "#/entities/attestation";

import { VoteRow } from "./VoteRow";

import * as m from "#/paraglide/messages";

interface VotesGivenListProps {
  address: string;
  coopDecimals: number;
}

export const VotesGivenList: FC<VotesGivenListProps> = ({
  address,
  coopDecimals,
}) => {
  const voteRecords = useVotesGiven(address);
  const rawName = useDisplayName(address);
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const votesDivisor = getVotesDivisor(coopDecimals);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.profile_votes_given_title({ name })}</CardTitle>
      </CardHeader>
      <CardContent>
        {voteRecords.length > 0 ? (
          <div className="space-y-2 text-sm">
            {voteRecords.map((record, i) => (
              <Fragment key={record.toAddress}>
                {i > 0 && <Separator />}
                <VoteRow
                  counterpartyAddress={record.toAddress}
                  ts={record.ts}
                  votes={record.votes}
                  votesDivisor={votesDivisor}
                  strength={record.strength}
                  isSelfVote={record.toAddress === address}
                />
              </Fragment>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-muted-foreground">
            {m.profile_votes_given_empty()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
