import { Fragment, type FC } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card";
import { Separator } from "#/shared/ui/separator";
import { toLocalString } from "#/shared/lib/toLocalString";
import { formatDateShort } from "#/shared/lib/formatDateShort";

import { useVotesReceived } from "#/entities/coop";
import { useDisplayName } from "#/entities/attestation";

import { UserDisplayName } from "./UserDisplayName";

import * as m from "#/paraglide/messages";

interface VotesListProps {
  address: string;
}

export const VotesList: FC<VotesListProps> = ({ address }) => {
  const voteRecords = useVotesReceived(address);
  const rawName = useDisplayName(address);
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.profile_votes_list_title({ name })}</CardTitle>
      </CardHeader>
      <CardContent>
        {voteRecords.length > 0 ? (
          <div className="grid gap-2">
            {voteRecords.map((record, i) => (
              <Fragment key={record.fromAddress}>
                {i > 0 && <Separator />}
                <div className="flex items-center justify-between gap-2 text-sm">
                  <div className="flex flex-col">
                    <UserDisplayName address={record.fromAddress} />
                    <span className="text-xs text-muted-foreground">
                      {formatDateShort(new Date(record.ts * 1000))}
                    </span>
                  </div>
                  <span className="text-muted-foreground">
                    {toLocalString(record.votes)}
                  </span>
                </div>
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
