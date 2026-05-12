export interface AttestationProfile {
  username?: string;
  userId?: string;
  user_id?: string;
  [key: string]: unknown;
}

export interface RawAttestation {
  attestor_address: string;
  profile: AttestationProfile;
}

export interface ParsedAttestations {
  telegram: AttestationProfile | null;
  discord: AttestationProfile | null;
  realName: AttestationProfile | null;
  displayName: string | null;
}
