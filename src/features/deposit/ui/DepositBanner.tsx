import type { FC } from "react";
import { TriangleAlert } from "lucide-react";

import { Alert, AlertTitle, AlertDescription } from "#/shared/ui/alert";
import { Button } from "#/shared/ui/button";
import { useWallet } from "#/entities/user";
import { getEligibility } from "#/entities/coop";
import type { CoopUser } from "#/entities/coop";

import { DepositDialog } from "./DepositDialog";

import * as m from "#/paraglide/messages";

interface DepositBannerProps {
  user: CoopUser;
  address: string;
}

function getBannerDescription(
  hasBalance: boolean,
  hasLockPeriod: boolean,
): string {
  if (!hasBalance && !hasLockPeriod) return m.deposit_banner_both();
  if (!hasBalance) return m.deposit_banner_no_balance();
  return m.deposit_banner_short_lock();
}

export const DepositBanner: FC<DepositBannerProps> = ({ user, address }) => {
  const { address: connectedAddress } = useWallet();

  if (!connectedAddress || connectedAddress !== address) return null;

  const { isEligible, hasBalance, hasLockPeriod } = getEligibility(user);

  if (isEligible) return null;

  return (
    <Alert variant="warning">
      <TriangleAlert className="size-4" />
      <AlertTitle>{m.deposit_banner_title()}</AlertTitle>
      <AlertDescription>
        <p>{getBannerDescription(hasBalance, hasLockPeriod)}</p>
        <DepositDialog>
          <Button size="sm" className="mt-2">
            {m.deposit_banner_cta()}
          </Button>
        </DepositDialog>
      </AlertDescription>
    </Alert>
  );
};
