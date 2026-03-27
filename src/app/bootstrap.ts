import client from '#/shared/api/obyte'
import { env } from '#/app/env'
import { setCoopLoading, setCoopVars } from '#/entities/coop'
import { setGovernanceLoading, setGovernanceVars } from '#/entities/governance'
import { hasAssetMetadata, setAssetMetadata } from '#/entities/token'

let heartbeatInterval: ReturnType<typeof setInterval> | undefined

export const bootstrap = async () => {
  try {
    console.info('log: connected to obyte hub')

    // main AA loading
    client.justsaying('light/new_aa_to_watch', {
      aa: env.VITE_AA_ADDRESS,
    })

    setCoopLoading()

    const vars = (await client.api.getAaStateVars({
      address: env.VITE_AA_ADDRESS,
    })) as Record<string, unknown>

    console.info('log: coop vars loaded', Object.keys(vars).length)

    const constants = vars.constants as
      | { governance_aa: string; asset: string; launch_ts: number }
      | undefined

    if (!constants) {
      console.error('bootstrap: constants not found in AA state vars')
      return
    }

    setCoopVars(vars)

    // governance AA loading
    client.justsaying('light/new_aa_to_watch', {
      aa: constants.governance_aa,
    })

    setGovernanceLoading()

    const governanceVars = (await client.api.getAaStateVars({
      address: constants.governance_aa,
    })) as Record<string, unknown>

    console.info(
      'log: governance vars loaded',
      Object.keys(governanceVars).length,
    )

    setGovernanceVars(governanceVars)

    // asset metadata (symbol, decimals) — skip if cached
    if (hasAssetMetadata(constants.asset)) {
      console.info('log: asset metadata from cache')
    } else {
      const registryAddress = client.api.getOfficialTokenRegistryAddress()

      const [symbol, decimals] = await Promise.all([
        client.api.getSymbolByAsset(registryAddress, constants.asset),
        client.api.getDecimalsBySymbolOrAsset(registryAddress, constants.asset),
      ])

      console.info('log: asset metadata fetched', symbol, decimals)

      setAssetMetadata(constants.asset, {
        symbol: symbol ?? null,
        decimals: decimals ?? null,
      })
    }
  } catch (error) {
    console.error('bootstrap failed:', error)
  }

  // heartbeat — always start, even if loading partially failed
  heartbeatInterval = setInterval(() => {
    client.api.heartbeat()
  }, 10 * 1000)

  // @ts-expect-error - client.client.ws is not typed
  client.client.ws.addEventListener('close', () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = undefined
    }
  })
}
