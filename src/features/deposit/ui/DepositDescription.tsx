import { toLocalString } from "#/shared/lib/toLocalString";
import { attestationLinks } from "#/shared/config/appConfig";

import * as m from "#/paraglide/messages";

function Skeleton({ className = "w-16" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-4 animate-pulse rounded bg-muted align-middle ${className}`}
    />
  );
}

interface DepositDescriptionProps {
  isLoaded: boolean;
  minBalance: number;
  coopSymbol: string;
}

const linkClass =
  "font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground";

export function DepositDescription({
  isLoaded,
  minBalance,
  coopSymbol,
}: DepositDescriptionProps) {
  return (
    <div className="text-sm text-muted-foreground">
      <p>
        {m.deposit_desc_attest({
          telegram: `[TG]`,
          discord: `[DC]`,
        })
          .split("[TG]")
          .map((part, i) => (
            <span key={`tg-${i}`}>
              {i > 0 && (
                <a
                  href={attestationLinks.telegram}
                  target="_blank"
                  rel="noopener"
                  className={linkClass}
                >
                  {m.deposit_desc_telegram()}
                </a>
              )}
              {part.split("[DC]").map((subPart, j) => (
                <span key={`dc-${i}-${j}`}>
                  {j > 0 && (
                    <a
                      href={attestationLinks.discord}
                      target="_blank"
                      rel="noopener"
                      className={linkClass}
                    >
                      {m.deposit_desc_discord()}
                    </a>
                  )}
                  {subPart}
                </span>
              ))}
            </span>
          ))}
      </p>
      <p className="mt-2">
        {m.deposit_desc_real_name({
          minBalance: `[MB]`,
          realName: `[RN]`,
        })
          .split("[MB]")
          .map((part, i) => (
            <span key={`mb-${i}`}>
              {i > 0 && (
                <span className="font-medium text-foreground">
                  {isLoaded ? (
                    <>
                      {toLocalString(minBalance)} {coopSymbol}
                    </>
                  ) : (
                    <Skeleton className="w-20" />
                  )}
                </span>
              )}
              {part.split("[RN]").map((subPart, j) => (
                <span key={`rn-${i}-${j}`}>
                  {j > 0 && (
                    <a
                      href={attestationLinks.realName}
                      target="_blank"
                      rel="noopener"
                      className={linkClass}
                    >
                      {m.deposit_desc_real_name_link()}
                    </a>
                  )}
                  {subPart}
                </span>
              ))}
            </span>
          ))}
      </p>
    </div>
  );
}
