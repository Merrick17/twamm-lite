import type { FC, ReactNode } from "react";
import { createContext, useState, useContext, useMemo } from "react";
import { WalletName, WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import type { PublicKey } from "@solana/web3.js";

export type IWalletPassThrough = {
  readonly publicKey: PublicKey | null;
  readonly wallets: Wallet[];
  readonly wallet: Wallet | null;
  readonly connect: () => Promise<void>;
  readonly select: (walletName: WalletName<string>) => void;
  readonly connecting: boolean;
  readonly connected: boolean;
  readonly disconnect: () => Promise<void | null>;
  readonly isWalletModalOpen: boolean;
  readonly setIsWalletModalOpen: (toggle: boolean) => void;
};

export const WalletPassthroughContext = createContext<
  IWalletPassThrough | undefined
>(undefined);

export const WalletPassthroughProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const {
    publicKey,
    wallets,
    wallet,
    connect,
    select,
    connecting,
    connected,
    disconnect,
  } = useWallet();

  const value = useMemo(() => {
    const { passThroughWallet } = window.Twamm;

    if (Boolean(passThroughWallet) && passThroughWallet?.adapter.publicKey) {
      return {
        publicKey: passThroughWallet?.adapter.publicKey,
        wallets: [],
        select: () => {},
        connect: async () => {},
        wallet: {
          adapter: passThroughWallet.adapter,
          readyState: WalletReadyState.Loadable,
        },
        connecting: false,
        connected: true,
        disconnect: async () => {
          if (passThroughWallet?.adapter.disconnect) {
            return passThroughWallet?.adapter.disconnect();
          }
          return null;
        },
        isWalletModalOpen,
        setIsWalletModalOpen,
      };
    }

    return {
      publicKey,
      wallets,
      wallet,
      connect,
      select,
      connecting,
      connected,
      disconnect,
      isWalletModalOpen,
      setIsWalletModalOpen,
    };
  }, [
    publicKey,
    wallets,
    wallet,
    connect,
    select,
    connecting,
    connected,
    disconnect,
    isWalletModalOpen,
    setIsWalletModalOpen,
  ]);

  return (
    <WalletPassthroughContext.Provider value={value}>
      {children}
    </WalletPassthroughContext.Provider>
  );
};

export default function useWalletPassThrough() {
  const context = useContext(WalletPassthroughContext);
  if (context === undefined) {
    throw new Error("Wallet pass through context is required");
  }
  return context;
}
