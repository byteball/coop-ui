import { Store } from "@tanstack/store";
import { storageKey } from "#/shared/lib/storageKey";

const STORAGE_KEY = storageKey("wallet_address");

interface WalletState {
  address: string | null;
}

function loadFromStorage(): WalletState {
  try {
    const address = localStorage.getItem(STORAGE_KEY);
    return { address };
  } catch {
    return { address: null };
  }
}

function saveToStorage(state: WalletState) {
  try {
    if (state.address) {
      localStorage.setItem(STORAGE_KEY, state.address);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

export const walletStore = new Store<WalletState>(loadFromStorage());

walletStore.subscribe(() => {
  saveToStorage(walletStore.state);
});

export const setWalletAddress = (address: string) => {
  walletStore.setState(() => ({ address }));
};

export const clearWalletAddress = () => {
  walletStore.setState(() => ({ address: null }));
};
