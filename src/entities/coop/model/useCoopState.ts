import { useCallback } from "react";
import { useStore } from "@tanstack/react-store";

import { defaultParams, variablesSchema } from "#/shared/config/appConfig";
import type { AppParamName, AppParams } from "#/shared/config/appConfig";
import { getCeilingPrice as calcCeilingPrice } from "../lib/getCeilingPrice";
import {
  coopConstantsSchema,
  parseCoopUser,
  parseCoopState,
} from "./schemas";
import type { CoopUser } from "./schemas";

import { coopStore } from "./store";

export function useCoopState() {
  const { status, vars } = useStore(coopStore, (s) => s);

  const constantsResult = coopConstantsSchema.safeParse(vars.constants);
  const constants = constantsResult.success ? constantsResult.data : undefined;

  const variablesResult = variablesSchema.safeParse(vars.variables ?? {});
  const variables = variablesResult.success
    ? (variablesResult.data as Partial<AppParams>)
    : undefined;

  const getParam = useCallback(
    <TKey extends AppParamName>(name: TKey): AppParams[TKey] => {
      if (variables && variables[name] !== undefined) return variables[name];
      return defaultParams[name];
    },
    [variables],
  );

  const getCeilingPrice = useCallback((): number | undefined => {
    if (!constants?.launch_ts) return undefined;
    return calcCeilingPrice(constants.launch_ts);
  }, [constants?.launch_ts]);

  const getUser = useCallback(
    (address: string): CoopUser | undefined => {
      return parseCoopUser(vars[`user_${address}`]);
    },
    [vars],
  );

  const getAaState = useCallback(() => parseCoopState(vars.state), [vars]);

  return {
    status,
    vars,
    constants,
    getParam,
    getCeilingPrice,
    getUser,
    getAaState,
  };
}
