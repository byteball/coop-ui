import obyte from "obyte";

import { env } from "#/shared/config/env";

const testnet = env.VITE_TESTNET;

const client = new obyte.Client(`wss://obyte.org/bb${testnet ? "-test" : ""}`, {
  testnet,
  reconnect: true,
});

export default client;
