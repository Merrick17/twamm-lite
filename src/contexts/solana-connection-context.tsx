import type { FC, ReactNode } from "react";
import {
  createContext,
  useState,
  useMemo,
  useCallback,
  useRef,
  useContext,
} from "react";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import type { Commitment } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ENV as ChainIdEnv } from "@solana/spl-token-registry";

import { useNetworkConfiguration } from "src/contexts/network-configuration-context";
import type * as T from "src/domain/cluster.d";
import { ankrClusterApiUrl } from "src/env";
import storage, { sanidateURL } from "src/utils/config-storage";
import ClusterUtils from "src/domain/cluster";

type CommitmentLevel = Extract<Commitment, "confirmed">;

const STORAGE_KEY = "twammClusterEndpoint";
const ENABLE_STORAGE_KEY = "twammEnableClusterEndpoint";
const COMMITMENT = "confirmed";

const clusterStorage = storage({
  key: STORAGE_KEY,
  enabled: ENABLE_STORAGE_KEY,
  sanidate: sanidateURL,
});

export const chainId = ChainIdEnv.MainnetBeta;

export type SolanaConnectionContext = {
  readonly presets: object;
  readonly cluster: T.ClusterInfo;
  readonly clusters: T.ClusterInfo[];
  readonly commitment: CommitmentLevel;
  readonly connection: Connection;
  readonly createConnection: (commitment?: CommitmentLevel) => Connection;
  readonly setCluster: (cluster: T.ClusterInfo | T.Moniker) => boolean;
};

export const Context = createContext<SolanaConnectionContext | undefined>(
  undefined
);

export const Provider: FC<{ endpoint: string; children: ReactNode }> = ({
  endpoint,
  children,
}) => {
  const { networkConfiguration } = useNetworkConfiguration();

  const network = networkConfiguration as WalletAdapterNetwork;
  const Endpoint: string = useMemo(
    () => endpoint ?? clusterApiUrl(network),
    [endpoint, network]
  );

  const endpoints: Record<string, T.ClusterInfo> = {
    solana: {
      name: "Solana",
      endpoint: Endpoint,
      moniker: "mainnet-beta",
    },
    ankr: {
      name: "Ankr",
      endpoint: ankrClusterApiUrl,
      moniker: "ankr-solana",
    },
    custom: {
      name: "Custom",
      endpoint: Endpoint,
      moniker: "custom",
    },
  };

  const fallbackCluster = endpoints.solana as T.ClusterInfo;

  const cluster = ClusterUtils(fallbackCluster);

  const hasStoredEndpoint = Boolean(
    clusterStorage.enabled() && clusterStorage.get()
  );
  const initialClusters = [
    endpoints.solana,
    endpoints.ankr,
    {
      name: endpoints.custom.name,
      endpoint: hasStoredEndpoint
        ? (clusterStorage.get<string>() as string)
        : endpoints.custom.endpoint,
      moniker: endpoints.custom.moniker,
    },
  ];

  const initialCluster = hasStoredEndpoint
    ? cluster.findBy(clusterStorage.get<string>(), initialClusters)
    : fallbackCluster;

  const [commitment] = useState<CommitmentLevel>(COMMITMENT);
  const [clusters] = useState<T.ClusterInfo[]>(initialClusters);
  const [currentCluster, setCurrentCluster] = useState(initialCluster);
  const [presets] = useState(endpoints);

  const connectionRef = useRef<Connection>(
    new Connection(currentCluster.endpoint, commitment)
  );

  const changeCluster = useCallback(
    (value: T.ClusterInfo | T.Moniker) => {
      const target =
        typeof value !== "string"
          ? value
          : cluster.findByMoniker(value, clusters);

      const isError = clusterStorage.set(target.endpoint);
      const hasError = isError instanceof Error;

      if (!hasError) {
        setCurrentCluster(target);
      }

      return hasError;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clusters, setCurrentCluster]
  );

  const createConnection = useCallback(
    (commit: CommitmentLevel = commitment) => {
      const prevEndpoint =
        connectionRef.current && connectionRef.current.rpcEndpoint;

      if (!prevEndpoint || prevEndpoint !== currentCluster.endpoint) {
        const conn = new Connection(currentCluster.endpoint, commit);
        connectionRef.current = conn;

        return connectionRef.current;
      }

      return connectionRef.current;
    },
    [currentCluster, commitment]
  );

  const contextValue = useMemo(
    () => ({
      cluster: currentCluster,
      clusters,
      commitment,
      connection: connectionRef.current,
      createConnection,
      presets,
      setCluster: changeCluster,
    }),
    [
      currentCluster,
      clusters,
      changeCluster,
      commitment,
      createConnection,
      presets,
    ]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default function useBlockchain() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("Solana connection context required");
  }

  return context;
}
