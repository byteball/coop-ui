import { useRef, useMemo } from "react";
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
import { QRButton } from "#/shared/ui/qr-button";
import { diffDays } from "#/shared/lib/diffDays";
import { formatDateShort } from "#/shared/lib/formatDateShort";
import { tooManyDecimals } from "#/shared/lib/tooManyDecimals";
import { getReferrerFromUrl } from "#/shared/lib/getReferrerFromUrl";
import { getExplorerUrl } from "#/shared/lib/getExplorerUrl";
import { toLocalString } from "#/shared/lib/toLocalString";
import { getLocale } from "#/shared/i18n";
import { useCoopState } from "#/entities/coop";
import { useAssetInfo } from "#/entities/token";
import { attestationLinks } from "#/app/appConfig";

import { buildDepositLink } from "../lib/buildDepositLink";
import {
  MIN_TERM_DAYS,
  MAX_TERM_DAYS,
  today,
  minDate,
  maxDate,
} from "../lib/constants";

type AssetType = "coop" | "gbyte";

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
  const { coopAsset, coopDecimals, gbyteDecimals, coopSymbol } = useAssetInfo();
  const { status, getCeilingPrice, getParam, getUser } = useCoopState();
  const referrer = useMemo(() => {
    const ref = getReferrerFromUrl();
    if (!ref) return undefined;
    return getUser(ref) ? ref : undefined;
  }, [getUser]);

  const form = useForm({
    defaultValues: {
      amount: "",
      asset: "coop",
      unlockDate: minDate,
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
            const days = diffDays(today, d);
            return days >= MIN_TERM_DAYS && days <= MAX_TERM_DAYS;
          },
          { message: "Unlock date must be between 1 and 5 years from now" },
        ),
      }),
    },
    onSubmit: () => {},
  });

  return (
    <div className="flex flex-col gap-5">
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
          . This is important to notify you about follow-up rewards in the
          future.
        </p>
        <p className="mt-2">
          If you deposit less than{" "}
          <span className="font-medium text-foreground">
            {toLocalString(
              getParam("min_balance_instead_of_real_name") / 10 ** coopDecimals,
            )}{" "}
            {coopSymbol}
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
                return `Maximum ${decimals} decimal places`;
              }
              const n = Number(value);
              if (isNaN(n) || n <= 0) {
                return "Enter a positive amount";
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
                <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
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
                          <SelectItem value="coop">{coopSymbol}</SelectItem>
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
              from: today,
              to: field.state.value,
            };

            return (
              <Field>
                <FieldLabel>Lock period</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                      <span>
                        {formatDateShort(today)} –{" "}
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
                      disabled={[{ before: minDate }, { after: maxDate }]}
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
                ? `Deposit ${values.amount} ${symbol}`
                : "Deposit";

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

            return (
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Locked until</span>
                  <span className="font-medium text-foreground">
                    {values.unlockDate.toLocaleDateString(getLocale(), {
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
          }}
        </form.Subscribe>
      </div>
    </div>
  );
}
