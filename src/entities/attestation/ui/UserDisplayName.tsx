import type { FC } from "react";
import { Link } from "@tanstack/react-router";

import { useAttestations } from "../model/useAttestations";

interface UserDisplayNameProps {
  address: string;
}

export const UserDisplayName: FC<UserDisplayNameProps> = ({ address }) => {
  const { data: attestations } = useAttestations(address);
  const displayName = attestations?.displayName;

  return (
    <Link to="/user/$address" params={{ address }} className="font-medium link">
      {displayName ?? (
        <span className="font-mono">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      )}
    </Link>
  );
};
