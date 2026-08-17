import { Fragment } from "react";

import { getExplorerUrl } from "#/shared/lib/getExplorerUrl";
import type { GovernanceParamDef } from "#/shared/config/appConfig";

import { formatParamAmount, formatParamValue } from "../lib/formatParamValue";

interface ParamValueProps {
  value: string | number;
  def: GovernanceParamDef;
  coopDecimals: number;
  coopSymbol: string;
}

export function ParamValue({
  value,
  def,
  coopDecimals,
  coopSymbol,
}: ParamValueProps) {
  if (def.type === "integer") {
    return (
      <>
        {formatParamAmount(value, coopDecimals)}{" "}
        <span className="text-muted-foreground">{coopSymbol}</span>
      </>
    );
  }

  if (def.type !== "string") {
    return <>{formatParamValue(value, def, coopDecimals, coopSymbol)}</>;
  }

  const addresses = String(value).split(":");

  return (
    <>
      {addresses.map((addr, i) => (
        <Fragment key={i}>
          {i > 0 && ", "}
          <a
            href={getExplorerUrl(addr, "address")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium link"
          >
            {addr.slice(0, 4)}...{addr.slice(-4)}
          </a>
        </Fragment>
      ))}
    </>
  );
}
