import { useMemo } from "react";
import { useStore } from "@tanstack/react-store";

import {
  defaultParams,
  governanceParams,
  CHALLENGING_PERIOD,
} from "#/shared/config/appConfig";

import { governanceStore } from "./store";
import type { ParsedGovernanceParam } from "./types";

export function useGovernanceState(address?: string | null) {
  const { status, vars } = useStore(governanceStore, (s) => s);

  const params = useMemo((): ParsedGovernanceParam[] => {
    if (status !== "loaded") return [];

    return governanceParams.map((def): ParsedGovernanceParam => {
      const name = def.name;

      const currentValue =
        vars[name] !== undefined
          ? (vars[name] as string | number)
          : defaultParams[name];

      const leader = vars[`leader_${name}`] as string | number | undefined;

      const startTs = vars[`challenging_period_start_ts_${name}`] as
        | number
        | undefined;
      const challengingPeriodEndTs = startTs
        ? startTs + CHALLENGING_PERIOD
        : undefined;

      const supports: ParsedGovernanceParam["supports"] = [];
      const prefix = `support_${name}_`;
      for (const key in vars) {
        if (key.startsWith(prefix)) {
          const valueKey = key.slice(prefix.length);
          supports.push({
            valueKey,
            support: vars[key] as number,
          });
        }
      }
      supports.sort((a, b) => b.support - a.support);

      const userChoice = address
        ? (vars[`choice_${address}_${name}`] as string | number | undefined)
        : undefined;

      return {
        def,
        currentValue,
        leader,
        challengingPeriodEndTs,
        supports,
        userChoice,
      };
    });
  }, [status, vars, address]);

  return { status, params };
}
