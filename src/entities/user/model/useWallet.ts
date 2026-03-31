import { useStore } from "@tanstack/react-store";

import { walletStore } from "./store";

export function useWallet() {
  const { address } = useStore(walletStore, (s) => s);
  return { address, isConnected: address !== null };
}
