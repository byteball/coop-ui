import type { ParsedGovernanceParam } from "#/entities/governance";

import { GovernanceParamCard } from "./GovernanceParamCard";

interface GovernanceParamListProps {
  params: ParsedGovernanceParam[];
  governanceAa: string;
  address: string | null;
  coopDecimals: number;
  coopSymbol: string;
}

export function GovernanceParamList({
  params,
  governanceAa,
  address,
  coopDecimals,
  coopSymbol,
}: GovernanceParamListProps) {
  return (
    <div className="flex flex-col gap-6">
      {params.map((param) => (
        <GovernanceParamCard
          key={param.def.name}
          param={param}
          governanceAa={governanceAa}
          address={address}
          coopDecimals={coopDecimals}
          coopSymbol={coopSymbol}
        />
      ))}
    </div>
  );
}
