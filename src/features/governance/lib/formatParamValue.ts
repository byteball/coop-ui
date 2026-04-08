import { toLocalString } from "#/shared/lib/toLocalString";
import type { GovernanceParamDef } from "#/shared/config/appConfig";

/** AA value → display string (no suffix). Used for inputs and supports table. */
export function toDisplayValue(
  value: string | number,
  def: GovernanceParamDef,
  coopDecimals: number,
): string {
  switch (def.type) {
    case "number":
      return String(parseFloat((Number(value) * 100).toPrecision(15)));
    case "integer":
      return String(
        parseFloat((Number(value) / 10 ** coopDecimals).toPrecision(15)),
      );
    case "string":
      return String(value);
  }
}

/** Display value → AA value. Reverses toDisplayValue. */
export function toAAValue(
  displayValue: string,
  def: GovernanceParamDef,
  coopDecimals: number,
): string | number {
  switch (def.type) {
    case "number":
      return parseFloat((Number(displayValue) / 100).toPrecision(15));
    case "integer":
      return Math.round(Number(displayValue) * 10 ** coopDecimals);
    case "string":
      return displayValue;
  }
}

/** AA value → formatted read-only string with suffix (%, COOP, truncated addresses). */
export function formatParamValue(
  value: string | number,
  def: GovernanceParamDef,
  coopDecimals: number,
  coopSymbol: string,
): string {
  switch (def.type) {
    case "number":
      return `${toLocalString(Number(value) * 100)}%`;
    case "integer":
      return `${toLocalString(Number(value) / 10 ** coopDecimals)} ${coopSymbol}`;
    case "string":
      return String(value)
        .split(":")
        .map((addr) => `${addr.slice(0, 4)}...${addr.slice(-4)}`)
        .join(", ");
  }
}
