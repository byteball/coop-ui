import { env } from "#/app/env";

type ExplorerUnitType = "address" | "tx" | "asset";

export const getExplorerUrl = (
  value: string,
  type: ExplorerUnitType = "tx",
): string => {
  const baseUrl = `https://${env.VITE_TESTNET ? "testnet" : ""}explorer.obyte.org/`;

  switch (type) {
    case "address":
      return baseUrl + "address/" + value;
    case "asset":
      return baseUrl + "asset/" + encodeURIComponent(value);
    case "tx":
      return baseUrl + encodeURIComponent(value);
  }
};
