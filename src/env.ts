import type { Idl } from "@project-serum/anchor";

import { tokenPairRegistry } from "src/token-pair-registry";
import idlJson from "../idl.json";

export const idl = idlJson as Idl;

export const ankrClusterApiUrl = "https://rpc.ankr.com/solana";

export const ClusterApiUrl = process.env.NEXT_PUBLIC_CLUSTER_API_URL || "";

export const programId: string = "TWAPzC9xaeBpgDNF26z5VAcmxBowVz5uqmTx47LkWUy";

export const FeeAccount: string =
  "9pvCGNF2aw43Smb4J1pdyobq6PnjwkhXkuFov8P42S5w";

export const FeeBps: string = "0";

export const platformFeeAccount: string = "";

export const JUPITER_CONFIG_URI = "https://quote-api.jup.ag";

export const JUPITER_PRICE_ENDPOINT_V4 = "https://price.jup.ag/v4/price";

export const NEXT_PUBLIC_ENABLE_TX_SIMUL: string = "0";

export const NEXT_PUBLIC_SUPPORTED_TOKEN = tokenPairRegistry;
