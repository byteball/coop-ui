import { env } from "#/app/env";
import { encodeData } from "./encodeData";

const suffixes = {
  livenet: "",
  testnet: "-tn",
};

const suffix = suffixes[env.VITE_TESTNET ? "testnet" : "livenet"];

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface IGenerateLink {
  amount: number;
  aa: string;
  asset?: string;
  data: Record<string, JsonValue | undefined>;
  from_address?: string;
  is_single?: boolean;
}

export const generateLink = ({
  amount,
  data,
  from_address,
  aa,
  asset = "base",
  is_single,
}: IGenerateLink): string => {
  let link = `obyte${suffix}:${aa}?amount=${Math.round(amount)}&asset=${encodeURIComponent(asset)}`;
  const encodedData = encodeData(data);

  link += "&base64data=" + encodeURIComponent(encodedData);
  if (from_address) link += "&from_address=" + encodeURIComponent(from_address);
  if (is_single) link += "&single_address=1";
  return link;
};
