import { useRef, useMemo, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Input } from "#/shared/ui/input";
import { Button } from "#/shared/ui/button";
import { Field, FieldError, FieldLabel } from "#/shared/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/shared/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "#/shared/ui/popover";
import { Calendar } from "#/shared/ui/calendar";
import { diffDays } from "#/shared/lib/diffDays";
import { formatDateShort } from "#/shared/lib/formatDateShort";
import { tooManyDecimals } from "#/shared/lib/tooManyDecimals";
import { getReferrerFromUrl } from "#/shared/lib/getReferrerFromUrl";
import { useCoopState } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import { useWallet } from "#/entities/user";

import { buildDepositLink } from "../lib/buildDepositLink";
import {
  MIN_TERM_DAYS,
  MAX_TERM_DAYS,
  getToday,
  getMinDate,
  getMaxDate,
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
  const referrer = useMemo(() => {
    const ref = getReferrerFromUrl();
    if (!ref) return undefined;
    return getUser(ref) ? ref : undefined;
  }, [getUser]);

  const user = address ? getUser(address) : undefined;
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
        amount: z.string().refine(
          (v) => {
            const n = Number(v);
            return v !== "" && !isNaN(n) && n > 0;
          },
          { message: "Enter a positive amount" },
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
    if (!form.getFieldValue("amount")) {
      form.setFieldValue(
        "amount",
        String(
          getParam("min_balance_instead_of_real_name") / 10 ** coopDecimals,
        ),
      );
    }
    form.setFieldValue("unlockDate", effectiveMinDate);
  }, [isLoaded, effectiveMinDate]);

  return (
    <div className="flex flex-col gap-5">
      <DepositDescription
        isLoaded={isLoaded}
        minBalance={
          getParam("min_balance_instead_of_real_name") / 10 ** coopDecimals
        }
        coopSymbol={coopSymbol}
      />

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
              return undefined;
            },
          }}
        >
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid || undefined}>
                <FieldLabel htmlFor={field.name}>{m.deposit_amount_label()}</FieldLabel>
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
            const range: DateRange = {
              from: getToday(),
              to: field.state.value,
            };

            return (
              <Field>
                <FieldLabel>{m.deposit_lock_period_label()}</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                      <span>
                        {formatDateShort(getToday())} –{" "}
                        {formatDateShort(field.state.value)}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={range}
                      onSelect={(newRange) => {
                        if (newRange?.to) {
                          field.handleChange(newRange.to);
                        }
                      }}
                      disabled={[
                        { before: effectiveMinDate },
                        { after: getMaxDate() },
                      ]}
                      defaultMonth={field.state.value}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
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
              values.amount && !isNaN(num) && num > 0
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
                unlockDate={values.unlockDate}
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
