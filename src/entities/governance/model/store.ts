import { Store } from '@tanstack/store'

interface GovernanceState {
  status: 'idle' | 'loading' | 'loaded'
  vars: Record<string, unknown>
}

export const governanceStore = new Store<GovernanceState>({
  status: 'idle',
  vars: {},
})

export const setGovernanceLoading = () => {
  governanceStore.setState((prev) => ({ ...prev, status: 'loading' }))
}

export const setGovernanceVars = (vars: Record<string, unknown>) => {
  governanceStore.setState(() => ({ status: 'loaded', vars }))
}
