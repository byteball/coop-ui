import { generateLink } from "#/shared/lib/generateLink";
import { BOUNCE_FEE } from "#/shared/config/appConfig";

export function buildVoteLink({
  aa,
  forAddress,
  strength,
  fromAddress,
  deleteExpiredVotes,
}: {
  aa: string;
  forAddress: string;
  strength: number;
  fromAddress?: string;
  deleteExpiredVotes?: Record<string, string>;
}): string {
  return generateLink({
    amount: BOUNCE_FEE,
    aa,
    data: {
      vote: 1,
      for: forAddress,
      strength,
      ...(deleteExpiredVotes
        ? { delete_expired_votes: deleteExpiredVotes }
        : {}),
    },
    from_address: fromAddress,
  });
}
