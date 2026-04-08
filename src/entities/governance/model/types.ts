import type { GovernanceParamDef } from "#/shared/config/appConfig";

export type {
  GovernanceParamDef,
  GovernanceParamType,
} from "#/shared/config/appConfig";

export interface GovernanceSupport {
  valueKey: string;
  support: number;
}

export interface ParsedGovernanceParam {
  def: GovernanceParamDef;
  currentValue: string | number;
  leader: string | number | undefined;
  challengingPeriodEndTs: number | undefined;
  supports: GovernanceSupport[];
  userChoice: string | number | undefined;
}
