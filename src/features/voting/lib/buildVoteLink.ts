import { generateLink } from "#/shared/lib/generateLink";

const BOUNCE_FEE = 10000;

export function buildVoteLink({
  aa,
  forAddress,
  strength,
  fromAddress,
}: {
  aa: string;
  forAddress: string;
  strength: number;
  fromAddress?: string;
}): string {
  return generateLink({
    amount: BOUNCE_FEE,
    aa,
    data: { vote: 1, for: forAddress, strength },
    from_address: fromAddress,
  });
}
