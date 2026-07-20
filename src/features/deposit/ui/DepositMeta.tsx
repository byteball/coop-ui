import type { RefObject } from "react";

import { DetailRow } from "#/shared/ui/detail-row";
import { QRButton } from "#/shared/ui/qr-button";
import { toLocalString } from "#/shared/lib/toLocalString";
import { getExplorerUrl } from "#/shared/lib/getExplorerUrl";

import * as m from "#/paraglide/messages";

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
      {coopEquivalent !== null && (
        <DetailRow
          className="text-sm"
          label={m.deposit_meta_equivalent({ symbol: coopSymbol })}
        >
          <span className="font-medium text-foreground">
            ≈ {toLocalString(coopEquivalent)} {coopSymbol}
          </span>
        </DetailRow>
      )}
      {address && (
        <>
          <DetailRow
            className="text-sm"
            label={m.deposit_meta_total_coop({
              symbol: isLoaded ? coopSymbol : "COOP",
            })}
          >
            <span className="font-medium text-foreground">
              {!isLoaded ? (
                <Skeleton className="w-20" />
              ) : !isValid ? (
                m.deposit_error_invalid_value()
              ) : (
                <>
                  {toLocalString(newCoopBalance)} {coopSymbol}
                </>
              )}
            </span>
          </DetailRow>
          <DetailRow
            className="text-sm"
            label={m.deposit_meta_total_gbyte({ symbol: "GBYTE" })}
          >
            <span className="font-medium text-foreground">
              {!isLoaded ? (
                <Skeleton className="w-20" />
              ) : !isValid ? (
                m.deposit_error_invalid_value()
              ) : (
                <>{toLocalString(newBytesBalance)} GBYTE</>
              )}
            </span>
          </DetailRow>
        </>
      )}
      {referrer && (
        <DetailRow className="text-sm" label={m.deposit_meta_referrer()}>
          <a
            href={getExplorerUrl(referrer, "address")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium link"
          >
            {referrer.slice(0, 6)}...{referrer.slice(-6)}
          </a>
        </DetailRow>
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
