import { useMemo, useRef, useState } from "react";

import { Card, CardContent, CardTitle } from "#/shared/ui/card";
import { Input } from "#/shared/ui/input";
import { Field, FieldError, FieldLabel } from "#/shared/ui/field";
import { QRButton } from "#/shared/ui/qr-button";

import { tooManyDecimals } from "#/shared/lib/tooManyDecimals";
import { toLocalString } from "#/shared/lib/toLocalString";
import { formatRounded } from "#/shared/lib/formatRounded";

import type { CoopUser } from "#/entities/coop";
import { useCoopState } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";

import { buildReplaceLink } from "../lib/buildReplaceLink";

import * as m from "#/paraglide/messages";

interface ReplaceFormProps {
  user: CoopUser;
}

export function ReplaceForm({ user }: ReplaceFormProps) {
  const qrButtonRef = useRef<HTMLButtonElement>(null);
  const { status, constants, getCeilingPrice } = useCoopState();
  const { coopAsset, coopDecimals, gbyteDecimals, coopSymbol, gbyteSymbol } =
    useAssetInfo(constants?.asset);
  const isLoaded = status === "loaded";

  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);

  const ceilingPrice = getCeilingPrice();

  const lockedCoop = user.balance / 10 ** coopDecimals;

  const maxCoopByBytes = useMemo(() => {
    if (!ceilingPrice || ceilingPrice <= 0) return 0;
    // user.bytes_balance is atomic; max coop atomic = floor(bytes / price)
    const maxAtomic = Math.floor(user.bytes_balance / ceilingPrice);
    return maxAtomic / 10 ** coopDecimals;
  }, [user.bytes_balance, ceilingPrice, coopDecimals]);

  const maxCoop = useMemo(
    () => Math.min(lockedCoop, maxCoopByBytes),
    [lockedCoop, maxCoopByBytes],
  );

  const num = Number(amount);
  const validNum = !isNaN(num) && num > 0 ? num : 0;
  const hasDecimalsIssue = amount ? tooManyDecimals(amount, coopDecimals) : false;

  const previewBytes = useMemo(() => {
    if (!ceilingPrice || validNum <= 0) return 0;
    const atomic = Math.floor(validNum * 10 ** coopDecimals * ceilingPrice);
    return atomic / 10 ** gbyteDecimals;
  }, [validNum, ceilingPrice, coopDecimals, gbyteDecimals]);

  const error: string | null = (() => {
    if (!amount) return null;
    if (hasDecimalsIssue)
      return m.deposit_error_decimals({ decimals: String(coopDecimals) });
    if (validNum <= 0) return m.deposit_error_positive();
    if (validNum > lockedCoop) return m.replace_error_amount_too_high();
    if (validNum > maxCoopByBytes) return m.replace_error_no_bytes();
    return null;
  })();

  const isValid = !!amount && error === null && isLoaded;

  const href = isValid
    ? buildReplaceLink({ amount, coopAsset, coopDecimals })
    : null;

  const setMax = () => {
    if (maxCoop <= 0) return;
    // Truncate to coop decimals to avoid tooManyDecimals.
    const factor = 10 ** coopDecimals;
    const truncated = Math.floor(maxCoop * factor) / factor;
    setAmount(String(truncated));
    setTouched(true);
  };

  return (
    <Card>
      <CardContent>
        <CardTitle>{m.replace_title()}</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          {m.replace_description()}
        </p>

        <Field className="mt-4" data-invalid={(touched && !!error) || undefined}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="replace-amount">
              {m.replace_amount_label({ symbol: coopSymbol })}
            </FieldLabel>
            <button
              type="button"
              onClick={setMax}
              disabled={!isLoaded || maxCoop <= 0}
              className="cursor-pointer text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline"
            >
              {m.replace_max()}: {formatRounded(maxCoop, coopDecimals)}{" "}
              {coopSymbol}
            </button>
          </div>
          <Input
            id="replace-amount"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*\.?[0-9]*"
            placeholder="0.00"
            value={amount}
            onBlur={() => setTouched(true)}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                qrButtonRef.current?.click();
              }
            }}
            disabled={!isLoaded}
            aria-invalid={(touched && !!error) || undefined}
          />
          {touched && error && <FieldError errors={[{ message: error }]} />}
        </Field>

        <div className="mt-3 grid gap-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>{m.replace_preview_will_receive()}</span>
            <span className="font-medium text-foreground">
              ≈ {formatRounded(previewBytes, gbyteDecimals)} {gbyteSymbol}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{m.replace_ceiling_price()}</span>
            <span className="font-medium text-foreground">
              {ceilingPrice
                ? `${toLocalString(ceilingPrice)} ${gbyteSymbol}`
                : "—"}
            </span>
          </div>
        </div>

        <QRButton
          ref={qrButtonRef}
          href={href ?? ""}
          size="lg"
          className="mt-4 w-full"
          disabled={!href}
        >
          {m.replace_submit()}
        </QRButton>
      </CardContent>
    </Card>
  );
}
