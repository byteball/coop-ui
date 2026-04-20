import type { FC } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card";
import { toLocalString } from "#/shared/lib/toLocalString";

import { useVotesReceived } from "#/entities/coop";
import { useAttestations } from "#/entities/attestation";

import { UserDisplayName } from "./UserDisplayName";

import * as m from "#/paraglide/messages";

interface VotesListProps {
  address: string;
}

export const VotesList: FC<VotesListProps> = ({ address }) => {
  const voteRecords = useVotesReceived(address);
  const { data: attestations } = useAttestations(address);
  const rawName =
    attestations?.displayName ??
    `${address.slice(0, 6)}...${address.slice(-4)}`;
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.profile_votes_list_title({ name })}</CardTitle>
      </CardHeader>
      <CardContent>
        {voteRecords.length > 0 ? (
          <div className="grid gap-2">
            {voteRecords.map((record) => (
              <div
                key={record.fromAddress}
                className="flex items-center justify-between text-sm"
              >
                <UserDisplayName address={record.fromAddress} />
                <span className="text-muted-foreground">
                  {toLocalString(record.votes)}
                </span>
              </div>
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
