import { useMemo, useRef, useState } from "react";

import { Card, CardContent, CardTitle } from "#/shared/ui/card";
import { DetailRow } from "#/shared/ui/detail-row";
import { Input } from "#/shared/ui/input";
import { Field, FieldError, FieldLabel } from "#/shared/ui/field";
import { QRButton } from "#/shared/ui/qr-button";

import { tooManyDecimals } from "#/shared/lib/tooManyDecimals";
import { toLocalString } from "#/shared/lib/toLocalString";
import { formatRounded } from "#/shared/lib/formatRounded";

import type { CoopUser } from "#/entities/coop";
import { useCoopState } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import { useWallet } from "#/entities/user";

import { buildReplaceLink } from "../lib/buildReplaceLink";

import * as m from "#/paraglide/messages";

interface ReplaceFormProps {
  user: CoopUser;
}

export function ReplaceForm({ user }: ReplaceFormProps) {
  const qrButtonRef = useRef<HTMLButtonElement>(null);
  const { address } = useWallet();
  const { status, constants, getCeilingPrice } = useCoopState();
  const { coopAsset, coopDecimals, gbyteDecimals, coopSymbol, gbyteSymbol } =
    useAssetInfo(constants?.asset);
  const isLoaded = status === "loaded";

  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);

  const ceilingPrice = getCeilingPrice();

  const maxCoop = useMemo(() => {
    if (!ceilingPrice || ceilingPrice <= 0) return 0;
    const maxAtomic = Math.floor(user.bytes_balance / ceilingPrice);
    return maxAtomic / 10 ** coopDecimals;
  }, [user.bytes_balance, ceilingPrice, coopDecimals]);

  const maxCoopDisplay = Math.floor(maxCoop * 10000) / 10000;

  const num = Number(amount);
  const validNum = !isNaN(num) && num > 0 ? num : 0;
  const hasDecimalsIssue = amount
    ? tooManyDecimals(amount, coopDecimals)
    : false;

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
    if (validNum > maxCoop) return m.replace_error_no_bytes();
    return null;
  })();

  const isValid = !!amount && error === null && isLoaded;

  const href = isValid
    ? buildReplaceLink({
        amount,
        coopAsset,
        coopDecimals,
        fromAddress: address ?? undefined,
      })
    : null;

  const setMax = () => {
    if (maxCoopDisplay <= 0) return;
    setAmount(String(maxCoopDisplay));
    setTouched(true);
  };

  return (
    <Card>
      <CardContent>
        <CardTitle>{m.replace_title()}</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          {m.replace_description({
            coopSymbol,
            price: ceilingPrice ? toLocalString(ceilingPrice) : "—",
            gbyteSymbol,
          })}
        </p>

        <Field
          className="mt-4"
          data-invalid={(touched && !!error) || undefined}
        >
          <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <FieldLabel htmlFor="replace-amount">
              {m.replace_amount_label({ symbol: coopSymbol })}
            </FieldLabel>
            <button
              type="button"
              onClick={setMax}
              disabled={!isLoaded || maxCoopDisplay <= 0}
              className="cursor-pointer text-xs font-medium link disabled:cursor-not-allowed disabled:opacity-50"
            >
              {m.replace_max()}: {formatRounded(maxCoopDisplay, 4)} {coopSymbol}
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
          <DetailRow label={m.replace_preview_will_receive()}>
            <span className="font-medium">
              ≈ {formatRounded(previewBytes, gbyteDecimals)} {gbyteSymbol}
            </span>
          </DetailRow>
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
