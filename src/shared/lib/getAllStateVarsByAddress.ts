import client from "../api/obyte";

const MAX_ITERATIONS = 25; // Safety limit
type AaStateVars = Record<string, unknown>;

export const getAllStateVarsByAddress = async (
  address: string,
): Promise<AaStateVars> => {
  const aaState: AaStateVars = {};
  let lastKey = "";

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const chunkData = (await client.api.getAaStateVars({
      address,
      // @ts-expect-error — var_prefix_from is not in the obyte client types
      ...(lastKey && { var_prefix_from: lastKey }),
    })) as AaStateVars;

    const keys = Object.keys(chunkData);

    Object.assign(aaState, chunkData);

    // <= 1 key means no new data beyond the overlap key from the previous page
    if (keys.length <= 1) break;

    lastKey = keys[keys.length - 1];
  }

  return aaState;
};
