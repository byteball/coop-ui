import { generateLink } from "#/shared/lib/generateLink";
import { GOVERNANCE_BOUNCE_FEE } from "#/shared/config/appConfig";

export function buildVoteLink({
  governanceAa,
  name,
  value,
  fromAddress,
}: {
  governanceAa: string;
  name: string;
  value: string | number;
  fromAddress?: string;
}): string {
  return generateLink({
    amount: GOVERNANCE_BOUNCE_FEE,
    aa: governanceAa,
    data: { name, value },
    from_address: fromAddress,
  });
}

export function buildRemoveVoteLink({
  governanceAa,
  name,
  fromAddress,
}: {
  governanceAa: string;
  name: string;
  fromAddress?: string;
}): string {
  // Omitting `value` tells the governance AA to retract the user's vote.
  return generateLink({
    amount: GOVERNANCE_BOUNCE_FEE,
    aa: governanceAa,
    data: { name },
    from_address: fromAddress,
  });
}

export function buildCommitLink({
  governanceAa,
  name,
  fromAddress,
}: {
  governanceAa: string;
  name: string;
  fromAddress?: string;
}): string {
  return generateLink({
    amount: GOVERNANCE_BOUNCE_FEE,
    aa: governanceAa,
    data: { name, commit: 1 },
    from_address: fromAddress,
  });
}
