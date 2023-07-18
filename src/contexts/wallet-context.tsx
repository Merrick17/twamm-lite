import type { FC, ReactNode } from "react";
import { useMemo, useCallback } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import {
  BackpackWalletAdapter,
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  ExodusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { useNetworkConfiguration } from "./network-configuration-context";
import { useAutoConnect } from "./auto-connect-context";
import { useSnackbar } from "./notification-context";

export const WalletContextProvider: FC<{
  endpoint?: string;
  children: ReactNode;
}> = ({ endpoint, children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { autoConnect } = useAutoConnect();
  const { networkConfiguration } = useNetworkConfiguration();
  const network = networkConfiguration as WalletAdapterNetwork;
  const selectedEndpoint: string = useMemo(
    () => endpoint ?? clusterApiUrl(network),
    [endpoint, network]
  );

  const passThroughWallet = (() => {
    if (typeof window === "undefined") return undefined;
    return window.Twamm.passThroughWallet;
  })();

  const wallets = useMemo(() => {
    if (passThroughWallet) {
      return [];
    }

    return [
      new PhantomWalletAdapter(),
      new BackpackWalletAdapter(),
      new GlowWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
      new ExodusWalletAdapter(),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  const onError = useCallback(
    (error: WalletError) => {
      enqueueSnackbar(error.message || error.name, {
        variant: "error",
      });
    },
    [enqueueSnackbar]
  );

  return (
    <ConnectionProvider endpoint={selectedEndpoint}>
      <WalletProvider
        wallets={wallets}
        onError={onError}
        autoConnect={autoConnect}
      >
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};
