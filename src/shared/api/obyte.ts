import obyte from "obyte";

import { env } from "#/shared/config/env";

const testnet = env.VITE_TESTNET;

const client = new obyte.Client(`wss://obyte.org/bb${testnet ? "-test" : ""}`, {
  testnet,
  reconnect: true,
});

setInterval(() => {
  client.api.heartbeat();
}, 10 * 1000);

client.onError((err) => {
  console.error("log: obyte client error", err);
});

export default client;
