import { useStore } from "@tanstack/react-store";

import { assetMetadataStore } from "./store";

export function useAssetInfo(coopAsset: string | undefined) {
  const assetMetadata = useStore(assetMetadataStore, (s) => s);

  const coopDecimals = coopAsset
    ? (assetMetadata[coopAsset]?.decimals ?? 0)
    : 0;
  const gbyteDecimals = assetMetadata["base"].decimals ?? 9;
  const coopSymbol = coopAsset
    ? (assetMetadata[coopAsset]?.symbol ?? "COOP")
    : "COOP";
  const gbyteSymbol = assetMetadata["base"].symbol ?? "GBYTE";

  return { coopAsset, coopDecimals, gbyteDecimals, coopSymbol, gbyteSymbol };
}
