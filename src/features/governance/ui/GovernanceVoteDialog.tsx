import { useState, useReducer, useEffect, useRef } from "react";
import { z } from "zod";
import obyte from "obyte";
import { Plus, X } from "lucide-react";
import * as m from "#/paraglide/messages";

import { Button } from "#/shared/ui/button";
import { Input } from "#/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/shared/ui/dialog";
import { QRButton } from "#/shared/ui/qr-button";
import type {
  GovernanceParamDef,
  ParsedGovernanceParam,
} from "#/entities/governance";
import { formatParamName, getParamDescription } from "#/entities/governance";

import { buildVoteLink } from "../lib/buildGovernanceLink";
import { toDisplayValue, toAAValue } from "../lib/formatParamValue";
import { ParamValue } from "./ParamValue";

// --- Zod schemas ---

function getPercentMax(def: GovernanceParamDef) {
  if (def.type !== "number" || def.max === undefined) return 100;
  return Number(toDisplayValue(def.max, def, 0));
}

function buildSchemas(def: GovernanceParamDef) {
  const percentMax = getPercentMax(def);

  const percentSchema = z
    .string()
    .min(1, m.governance_error_required())
    .refine((v) => !isNaN(Number(v)), m.governance_error_number())
    .refine((v) => Number(v) >= 0, m.governance_error_non_negative())
    .refine(
      (v) => Number(v) <= percentMax,
      m.governance_error_percent_max({ max: String(percentMax) }),
    );

  const amountSchema = z
    .string()
    .min(1, m.governance_error_required())
    .refine((v) => !isNaN(Number(v)), m.governance_error_number())
    .refine((v) => Number(v) >= 0, m.governance_error_non_negative());

  const addressSchema = z
    .string()
    .min(1, m.governance_error_required())
    .refine(
      (v) => obyte.utils.isValidAddress(v.trim()),
      m.governance_error_invalid_address(),
    );

  return { percentSchema, amountSchema, addressSchema };
}

// --- Address list reducer ---

type AddressAction =
  | { type: "add" }
  | { type: "remove"; index: number }
  | { type: "update"; index: number; value: string }
  | { type: "reset"; addresses: string[] };

function addressReducer(state: string[], action: AddressAction): string[] {
  switch (action.type) {
    case "add":
      return state.length < 6 ? [...state, ""] : state;
    case "remove":
      return state.filter((_, i) => i !== action.index);
    case "update":
      return state.map((v, i) => (i === action.index ? action.value : v));
    case "reset":
      return action.addresses;
  }
}

// --- Input Components ---

function PercentInput({
  value,
  onChange,
  error,
  readOnly,
}: {
  value: string;
  onChange: (v: string) => void;
  error: string | null;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <Input
          type="text"
          inputMode="decimal"
          placeholder="1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : undefined}
          aria-invalid={!!error || undefined}
          className={readOnly ? "pr-8 pointer-events-none" : "pr-8"}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          %
        </span>
      </div>
      {error && <p className="text-sm text-destructive-foreground">{error}</p>}
    </div>
  );
}

function AmountInput({
  value,
  onChange,
  error,
  coopSymbol,
  readOnly,
}: {
  value: string;
  onChange: (v: string) => void;
  error: string | null;
  coopSymbol: string;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <Input
          type="text"
          inputMode="decimal"
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : undefined}
          aria-invalid={!!error || undefined}
          className={readOnly ? "pr-16 pointer-events-none" : "pr-16"}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {coopSymbol}
        </span>
      </div>
      {error && <p className="text-sm text-destructive-foreground">{error}</p>}
    </div>
  );
}

function AddressListInput({
  addresses,
  dispatch,
  errors,
  readOnly,
}: {
  addresses: string[];
  dispatch: React.Dispatch<AddressAction>;
  errors: (string | null)[];
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      {addresses.map((addr, i) => (
        <div key={i} className="flex gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <Input
              type="text"
              placeholder={m.governance_dialog_address_placeholder()}
              value={addr}
              readOnly={readOnly}
              tabIndex={readOnly ? -1 : undefined}
              onChange={(e) =>
                dispatch({ type: "update", index: i, value: e.target.value })
              }
              aria-invalid={!!errors[i] || undefined}
              className={readOnly ? "pointer-events-none" : undefined}
            />
            {errors[i] && (
              <p className="text-xs text-destructive-foreground">{errors[i]}</p>
            )}
          </div>
          {!readOnly && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => dispatch({ type: "remove", index: i })}
              disabled={addresses.length <= 1}
            >
              <X className="size-3" />
            </Button>
          )}
        </div>
      ))}
      {!readOnly && addresses.length < 6 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch({ type: "add" })}
          className="self-start"
        >
          <Plus className="mr-1 size-3" />
          {m.governance_dialog_add_address()}
        </Button>
      )}
    </div>
  );
}

// --- Main Dialog ---

interface GovernanceVoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: string | number;
  param: ParsedGovernanceParam;
  governanceAa: string;
  address: string | null;
  coopDecimals: number;
  coopSymbol: string;
}

export function GovernanceVoteDialog({
  open,
  onOpenChange,
  initialValue,
  param,
  governanceAa,
  address,
  coopDecimals,
  coopSymbol,
}: GovernanceVoteDialogProps) {
  const qrButtonRef = useRef<HTMLButtonElement>(null);
  const readOnly = initialValue !== undefined;
  const [value, setValue] = useState("");
  const [addresses, dispatch] = useReducer(addressReducer, [""]);

  useEffect(() => {
    if (open) {
      if (initialValue !== undefined) {
        if (param.def.type === "string") {
          dispatch({
            type: "reset",
            addresses: String(initialValue).split(":"),
          });
        } else {
          setValue(toDisplayValue(initialValue, param.def, coopDecimals));
        }
      } else {
        setValue("");
        if (param.def.type === "string") {
          dispatch({ type: "reset", addresses: [""] });
        }
      }
    }
  }, [open, initialValue, param.def, coopDecimals]);

  const { percentSchema, amountSchema, addressSchema } = buildSchemas(
    param.def,
  );

  // Validation — show errors only when field is non-empty
  let error: string | null = null;
  let addressErrors: (string | null)[] = [];
  let isValid = false;
  let voteValue: string | number = value;

  if (param.def.type === "number") {
    const result = percentSchema.safeParse(value);
    isValid = result.success;
    error = !value
      ? null
      : result.success
        ? null
        : result.error.issues[0].message;
    if (result.success) voteValue = toAAValue(value, param.def, coopDecimals);
  } else if (param.def.type === "integer") {
    const result = amountSchema.safeParse(value);
    isValid = result.success;
    error = !value
      ? null
      : result.success
        ? null
        : result.error.issues[0].message;
    if (result.success) voteValue = toAAValue(value, param.def, coopDecimals);
  } else {
    const hasInput = addresses.some((a) => a.trim() !== "");
    addressErrors = addresses.map((addr) => {
      if (!addr.trim()) return hasInput ? m.governance_error_required() : null;
      const result = addressSchema.safeParse(addr);
      return result.success ? null : result.error.issues[0].message;
    });
    isValid =
      hasInput &&
      addressErrors.every((e) => e === null) &&
      addresses.every((a) => a.trim() !== "");
    voteValue = addresses.map((a) => a.trim()).join(":");
  }

  const href =
    isValid && address
      ? buildVoteLink({
          governanceAa,
          name: param.def.name,
          value: voteValue,
          fromAddress: address,
        })
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {m.governance_dialog_title({
              name: formatParamName(param.def.name),
            })}
          </DialogTitle>
          <DialogDescription>
            {getParamDescription(param.def.name)}
          </DialogDescription>
          <p className="text-sm">
            <span className="text-muted-foreground">
              {m.governance_param_current_value()}{" "}
            </span>
            <span className="font-medium">
              <ParamValue
                value={param.currentValue}
                def={param.def}
                coopDecimals={coopDecimals}
                coopSymbol={coopSymbol}
              />
            </span>
          </p>
        </DialogHeader>
        <div
          className="flex flex-col gap-3"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              qrButtonRef.current?.click();
            }
          }}
        >
          {param.def.type === "number" && (
            <PercentInput
              value={value}
              onChange={setValue}
              error={error}
              readOnly={readOnly}
            />
          )}
          {param.def.type === "integer" && (
            <AmountInput
              value={value}
              onChange={setValue}
              error={error}
              coopSymbol={coopSymbol}
              readOnly={readOnly}
            />
          )}
          {param.def.type === "string" && (
            <AddressListInput
              addresses={addresses}
              dispatch={dispatch}
              readOnly={readOnly}
              errors={addressErrors}
            />
          )}
        </div>
        <DialogFooter>
          <QRButton
            ref={qrButtonRef}
            href={href ?? ""}
            disabled={!href}
            size="sm"
          >
            {m.governance_dialog_change()}
          </QRButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
