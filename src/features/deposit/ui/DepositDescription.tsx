import { toLocalString } from "#/shared/lib/toLocalString";
import { attestationLinks } from "#/shared/config/appConfig";

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

export function DepositDescription({
  isLoaded,
  minBalance,
  coopSymbol,
}: DepositDescriptionProps) {
  return (
    <div className="text-sm text-muted-foreground">
      <p>
        Before depositing, you must be attested on{" "}
        <a
          href={attestationLinks.telegram}
          target="_blank"
          rel="noopener"
          className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
        >
          Telegram
        </a>{" "}
        and/or{" "}
        <a
          href={attestationLinks.discord}
          target="_blank"
          rel="noopener"
          className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
        >
          Discord
        </a>
        . This is important to notify you about follow-up rewards in the future.
      </p>
      <p className="mt-2">
        If you deposit less than{" "}
        <span className="font-medium text-foreground">
          {isLoaded ? (
            <>
              {toLocalString(minBalance)} {coopSymbol}
            </>
          ) : (
            <Skeleton className="w-20" />
          )}
        </span>{" "}
        (or equivalent), you must be{" "}
        <a
          href={attestationLinks.realName}
          target="_blank"
          rel="noopener"
          className="font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
        >
          real-name attested
        </a>
        . This measure helps prevent multiple accounts by the same user.
      </p>
    </div>
  );
}
