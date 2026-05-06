import { Fragment, type FC } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card";
import { Separator } from "#/shared/ui/separator";
import { toLocalString } from "#/shared/lib/toLocalString";
import { formatDateShort } from "#/shared/lib/formatDateShort";
import { getVotesDivisor } from "#/shared/lib/votesScale";

import { useVotesGiven } from "#/entities/coop";
import { useDisplayName, UserDisplayName } from "#/entities/attestation";

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
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-2 gap-y-2 text-sm">
            {voteRecords.map((record, i) => (
              <Fragment key={record.toAddress}>
                {i > 0 && <Separator className="col-span-full" />}
                <div className="flex flex-col">
                  <UserDisplayName address={record.toAddress} />
                  <span className="text-xs text-muted-foreground">
                    {formatDateShort(new Date(record.ts * 1000))}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  {record.toAddress === address && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {m.vote_list_self()}
                    </span>
                  )}
                  {typeof record.strength === "number" && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {m.vote_list_strength({
                        n: String(record.strength),
                      })}
                    </span>
                  )}
                </div>
                <span className="text-right tabular-nums text-muted-foreground">
                  {toLocalString(record.votes / votesDivisor)}
                </span>
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
