import { useRef, useMemo, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { Input } from "#/shared/ui/input";
import { Field, FieldError, FieldLabel } from "#/shared/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/shared/ui/select";
import { Slider } from "#/shared/ui/slider";
import { diffDays } from "#/shared/lib/diffDays";
import { formatDateShort } from "#/shared/lib/formatDateShort";
import { tooManyDecimals } from "#/shared/lib/tooManyDecimals";
import { useCoopState, getEligibility } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import { useWallet } from "#/entities/user";
import { useEffectiveReferrer } from "#/entities/referrer";

import { buildDepositLink } from "../lib/buildDepositLink";
import {
  MIN_TERM_DAYS,
  MAX_TERM_DAYS,
  MAX_AMOUNT,
  getToday,
  getMinDate,
} from "../lib/constants";
import { DepositDescription } from "./DepositDescription";
import { DepositMeta } from "./DepositMeta";

import * as m from "#/paraglide/messages";

type AssetType = "coop" | "gbyte";

function Skeleton({ className = "w-16" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-4 animate-pulse rounded bg-muted align-middle ${className}`}
    />
  );
}

function mapErrors(errors: unknown[]): Array<{ message: string } | undefined> {
  return errors.map((e) => ({
    message:
      typeof e === "string"
        ? e
        : ((e as { message?: string }).message ?? String(e)),
  }));
}

export function DepositForm() {
  const qrButtonRef = useRef<HTMLButtonElement>(null);
  const { address } = useWallet();
  const { status, constants, getCeilingPrice, getParam, getUser } =
    useCoopState();
  const isLoaded = status === "loaded";
  const { coopAsset, coopDecimals, gbyteDecimals, coopSymbol } = useAssetInfo(
    constants?.asset,
  );
  const referrer = useEffectiveReferrer();

  const user = address ? getUser(address) : undefined;
  const hasLockedTokens = getEligibility(user).hasBalance;
  const effectiveMinDate = useMemo(() => {
    const min = getMinDate();
    if (!user?.unlock_date) return min;
    const userUnlock = new Date(user.unlock_date);
    userUnlock.setHours(0, 0, 0, 0);
    return userUnlock > min ? userUnlock : min;
  }, [user?.unlock_date]);

  const form = useForm({
    defaultValues: {
      amount: "",
      asset: "coop",
      unlockDate: effectiveMinDate,
    },
    validators: {
      onSubmit: z.object({
        amount: z
          .string()
          .refine(
            (v) => {
              const n = Number(v);
              return v !== "" && !isNaN(n) && n > 0;
            },
            { message: "Enter a positive amount" },
          )
          .refine(
            (v) => {
              const n = Number(v);
              return isNaN(n) || n <= MAX_AMOUNT;
            },
            {
              message: m.deposit_error_max_amount({
                max: String(MAX_AMOUNT),
              }),
            },
          ),
        asset: z.enum(["coop", "gbyte"]),
        unlockDate: z.date().refine(
          (d) => {
            const days = diffDays(getToday(), d);
            return days >= MIN_TERM_DAYS && days <= MAX_TERM_DAYS;
          },
          { message: m.deposit_error_unlock_date() },
        ),
      }),
    },
    onSubmit: () => {},
  });

  useEffect(() => {
    if (!isLoaded) return;
    if (coopDecimals && !form.getFieldValue("amount")) {
      form.setFieldValue(
        "amount",
        String(
          getParam("min_balance_instead_of_real_name") / 10 ** coopDecimals,
        ),
      );
    }
    form.setFieldValue("unlockDate", effectiveMinDate);
  }, [isLoaded, coopDecimals, effectiveMinDate]);

  return (
    <div className="flex flex-col gap-5">
      {!hasLockedTokens && (
        <DepositDescription
          isLoaded={isLoaded}
          minBalance={
            getParam("min_balance_instead_of_real_name") / 10 ** coopDecimals
          }
          coopSymbol={coopSymbol}
        />
      )}

      <div
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            qrButtonRef.current?.click();
          }
        }}
        className="flex flex-col gap-5"
      >
        {/* Amount + Asset */}
        <form.Field
          name="amount"
          validators={{
            onChange: ({ value, fieldApi }) => {
              if (!value) return undefined;
              const asset = fieldApi.form.getFieldValue("asset");
              const decimals = asset === "coop" ? coopDecimals : gbyteDecimals;
              if (tooManyDecimals(value, decimals)) {
                return m.deposit_error_decimals({ decimals: String(decimals) });
              }
              const n = Number(value);
              if (isNaN(n) || n <= 0) {
                return m.deposit_error_positive();
              }
              if (n > MAX_AMOUNT) {
                return m.deposit_error_max_amount({
                  max: String(MAX_AMOUNT),
                });
              }
              return undefined;
            },
          }}
        >
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid || undefined}>
                <FieldLabel htmlFor={field.name}>
                  {m.deposit_amount_label()}
                </FieldLabel>
                <div className="flex gap-2">
                  <Input
                    id={field.name}
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    placeholder="0.00"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    disabled={!isLoaded}
                    aria-invalid={isInvalid || undefined}
                    className="flex-1"
                  />
                  <form.Field name="asset">
                    {(assetField) => (
                      <Select
                        value={assetField.state.value}
                        onValueChange={(v) => {
                          assetField.handleChange(v as AssetType);
                          field.validate("change");
                        }}
                      >
                        <SelectTrigger className="w-[120px] text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="coop">
                            {isLoaded ? (
                              coopSymbol
                            ) : (
                              <Skeleton className="w-12" />
                            )}
                          </SelectItem>
                          <SelectItem value="gbyte">GBYTE</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </form.Field>
                </div>
                {isInvalid && (
                  <FieldError errors={mapErrors(field.state.meta.errors)} />
                )}
              </Field>
            );
          }}
        </form.Field>

        {/* Lock period */}
        <form.Field name="unlockDate">
          {(field) => {
            const today = getToday();
            const minDays = diffDays(today, effectiveMinDate);
            const maxDays = MAX_TERM_DAYS;
            const currentDays = Math.max(
              minDays,
              Math.min(maxDays, diffDays(today, field.state.value)),
            );

            const handleSliderChange = (values: number[]) => {
              const days = values[0];
              const newDate = new Date(today);
              newDate.setDate(today.getDate() + days);
              field.handleChange(newDate);
            };

            return (
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel>{m.deposit_lock_period_label()}</FieldLabel>
                  <span className="text-sm text-muted-foreground">
                    {m.deposit_lock_days({ days: String(currentDays) })} —{" "}
                    {formatDateShort(field.state.value)}
                  </span>
                </div>
                <Slider
                  value={[currentDays]}
                  min={minDays}
                  max={maxDays}
                  step={1}
                  onValueChange={handleSliderChange}
                  disabled={!isLoaded}
                />
              </Field>
            );
          }}
        </form.Field>

        {/* Meta + Submit */}
        <form.Subscribe
          selector={(s) => ({
            isValid: s.isValid,
            values: s.values,
          })}
        >
          {({ isValid, values }) => {
            const num = Number(values.amount);
            const symbol = values.asset === "coop" ? coopSymbol : "GBYTE";
            const label =
              isValid && values.amount && !isNaN(num) && num > 0
                ? m.deposit_button_with_amount({
                    amount: values.amount,
                    symbol,
                  })
                : m.deposit_button();

            const href =
              isValid && status === "loaded"
                ? buildDepositLink({
                    amount: values.amount,
                    asset: values.asset,
                    unlockDate: values.unlockDate,
                    coopAsset,
                    coopDecimals,
                    gbyteDecimals,
                    referrer,
                    fromAddress: address ?? undefined,
                  })
                : null;

            const isGbyte = values.asset === "gbyte";
            const price = isGbyte ? getCeilingPrice() : undefined;
            const coopEquivalent =
              isGbyte && price && num > 0
                ? (num * 10 ** gbyteDecimals) / price / 10 ** coopDecimals
                : null;

            const user = address ? getUser(address) : undefined;
            const currentCoopBalance =
              (user?.balance ?? 0) / 10 ** coopDecimals;
            const currentBytesBalance =
              (user?.bytes_balance ?? 0) / 10 ** gbyteDecimals;
            const validNum = !isNaN(num) && num > 0 ? num : 0;
            const newCoopBalance =
              currentCoopBalance + (!isGbyte ? validNum : 0);
            const newBytesBalance =
              currentBytesBalance + (isGbyte ? validNum : 0);

            return (
              <DepositMeta
                isLoaded={isLoaded}
                isValid={isValid}
                href={href}
                label={label}
                coopSymbol={coopSymbol}
                coopEquivalent={coopEquivalent}
                newCoopBalance={newCoopBalance}
                newBytesBalance={newBytesBalance}
                address={address}
                referrer={referrer}
                qrButtonRef={qrButtonRef}
              />
            );
          }}
        </form.Subscribe>
      </div>
    </div>
  );
}
