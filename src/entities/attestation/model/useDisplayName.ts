import { useAttestations } from "./useAttestations";

export function useDisplayName(address: string): string {
  const { data: attestations } = useAttestations(address);
  return (
    attestations?.displayName ??
    `${address.slice(0, 6)}...${address.slice(-4)}`
  );
}
