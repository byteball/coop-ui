import { useCallback } from "react";
import { useStore } from "@tanstack/react-store";

import { defaultParams } from "#/shared/config/appConfig";
import type { AppParamName, AppParams } from "#/shared/config/appConfig";
import { getCeilingPrice as calcCeilingPrice } from "#/shared/lib/getCeilingPrice";

import { coopStore } from "./store";
import type { CoopConstants, CoopUser } from "./types";

export function useCoopState() {
  const { status, vars } = useStore(coopStore, (s) => s);

  const constants = vars.constants as CoopConstants | undefined;
  const variables = vars.variables as Partial<AppParams> | undefined;

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
      return vars[`user_${address}`] as CoopUser | undefined;
    },
    [vars],
  );

  return { status, vars, constants, getParam, getCeilingPrice, getUser };
}
