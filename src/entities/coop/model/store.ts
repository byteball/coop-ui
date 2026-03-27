import { Store } from '@tanstack/store'

interface CoopState {
  status: 'idle' | 'loading' | 'loaded'
  vars: Record<string, unknown>
}

export const coopStore = new Store<CoopState>({
  status: 'idle',
  vars: {},
})

export const setCoopLoading = () => {
  coopStore.setState((prev) => ({ ...prev, status: 'loading' }))
}

export const setCoopVars = (vars: Record<string, unknown>) => {
  coopStore.setState(() => ({ status: 'loaded', vars }))
}
