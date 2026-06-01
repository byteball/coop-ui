import { useRef } from "react";

import { Separator } from "#/shared/ui/separator";
import { QRButton } from "#/shared/ui/qr-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#/shared/ui/tooltip";

import { toLocalString } from "#/shared/lib/toLocalString";
import { formatRounded } from "#/shared/lib/formatRounded";

import type { CoopUser } from "#/entities/coop";
import { useCoopState } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import { useWallet } from "#/entities/user";

import { buildWithdrawLink } from "../lib/buildWithdrawLink";

import * as m from "#/paraglide/messages";

interface WithdrawFormProps {
  user: CoopUser;
}

export function WithdrawForm({ user }: WithdrawFormProps) {
  const qrButtonRef = useRef<HTMLButtonElement>(null);
  const { address } = useWallet();
  const { constants } = useCoopState();
  const { coopDecimals, gbyteDecimals, coopSymbol, gbyteSymbol } = useAssetInfo(
    constants?.asset,
  );

  // The AA withdraw handler pays the stored balance verbatim — it does not
  // checkpoint emissions accrued since the user's last action — so we display
  // exactly what the wallet will receive: floor(balance + liquid_balance) COOP
  // and floor(bytes_balance) GBYTE.
  const coopAtomic = Math.floor(user.balance + (user.liquid_balance ?? 0));
  const gbyteAtomic = Math.floor(user.bytes_balance);

  if (coopAtomic <= 0 && gbyteAtomic <= 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        {m.withdraw_nothing()}
      </p>
    );
  }

  const coop = coopAtomic / 10 ** coopDecimals;
  const gbyte = gbyteAtomic / 10 ** gbyteDecimals;

  const href = buildWithdrawLink({ fromAddress: address ?? undefined });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {m.withdraw_description()}
      </p>

      <Separator />

      <div className="grid gap-2 text-sm">
        <span className="text-muted-foreground">{m.withdraw_will_receive()}</span>
        {coopAtomic > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{coopSymbol}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-medium text-foreground">
                    {formatRounded(coop, coopDecimals)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {toLocalString(coop)} {coopSymbol}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        {gbyteAtomic > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{gbyteSymbol}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-medium text-foreground">
                    {formatRounded(gbyte, gbyteDecimals)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {toLocalString(gbyte)} {gbyteSymbol}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      <QRButton
        ref={qrButtonRef}
        href={href}
        size="lg"
        className="w-full"
        disabled={!href}
      >
        {m.withdraw_submit()}
      </QRButton>
    </div>
  );
}
