import { Store } from '@tanstack/store'

const STORAGE_KEY = 'asset_metadata'

export interface AssetMetadata {
  symbol: string | null
  decimals: number | null
}

type AssetMetadataMap = Record<string, AssetMetadata>

function loadFromStorage(): AssetMetadataMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

function saveToStorage(state: AssetMetadataMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

export const assetMetadataStore = new Store<AssetMetadataMap>(loadFromStorage())

assetMetadataStore.subscribe(() => {
  saveToStorage(assetMetadataStore.state)
})
