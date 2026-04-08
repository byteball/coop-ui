import type { RefObject } from "react";

import { QRButton } from "#/shared/ui/qr-button";
import { toLocalString } from "#/shared/lib/toLocalString";
import { getExplorerUrl } from "#/shared/lib/getExplorerUrl";
import { getLocale } from "#/shared/i18n";

function Skeleton({ className = "w-16" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-4 animate-pulse rounded bg-muted align-middle ${className}`}
    />
  );
}

interface DepositMetaProps {
  isLoaded: boolean;
  isValid: boolean;
  href: string | null;
  label: string;
  unlockDate: Date;
  coopSymbol: string;
  coopEquivalent: number | null;
  newCoopBalance: number;
  newBytesBalance: number;
  address: string | null;
  referrer: string | undefined;
  qrButtonRef: RefObject<HTMLButtonElement | null>;
}

export function DepositMeta({
  isLoaded,
  isValid,
  href,
  label,
  unlockDate,
  coopSymbol,
  coopEquivalent,
  newCoopBalance,
  newBytesBalance,
  address,
  referrer,
  qrButtonRef,
}: DepositMetaProps) {
  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Locked until</span>
        <span className="font-medium text-foreground">
          {unlockDate.toLocaleDateString(getLocale(), {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
      {coopEquivalent !== null && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{coopSymbol} equivalent</span>
          <span className="font-medium text-foreground">
            ≈ {toLocalString(coopEquivalent)} {coopSymbol}
          </span>
        </div>
      )}
      {address && (
        <>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total {isLoaded ? coopSymbol : "COOP"} balance</span>
            <span className="font-medium text-foreground">
              {isLoaded ? (
                <>
                  {toLocalString(newCoopBalance)} {coopSymbol}
                </>
              ) : (
                <Skeleton className="w-20" />
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total GBYTE balance</span>
            <span className="font-medium text-foreground">
              {isLoaded ? (
                <>{toLocalString(newBytesBalance)} GBYTE</>
              ) : (
                <Skeleton className="w-20" />
              )}
            </span>
          </div>
        </>
      )}
      {referrer && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Referrer</span>
          <a
            href={getExplorerUrl(referrer, "address")}
            target="_blank"
            rel="noopener"
            className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
          >
            {referrer.slice(0, 6)}...{referrer.slice(-6)}
          </a>
        </div>
      )}
      <QRButton
        ref={qrButtonRef}
        href={href ?? ""}
        size="lg"
        className="mt-2 w-full"
        disabled={!href}
      >
        {label}
      </QRButton>
    </div>
  );
}
