import client from './obyte'

let heartbeatInterval: ReturnType<typeof setInterval> | undefined

export const bootstrap = async () => {
  console.log('connected to obyte hub')

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
