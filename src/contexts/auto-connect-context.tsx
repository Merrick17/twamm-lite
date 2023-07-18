import type { FC, ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "@solana/wallet-adapter-react";

export interface AutoConnectContextState {
  autoConnect: boolean;
  setAutoConnect(autoConnect: boolean): void;
}

export const AutoConnectContext = createContext<AutoConnectContextState>(
  {} as AutoConnectContextState
);

export function useAutoConnect(): AutoConnectContextState {
  return useContext(AutoConnectContext);
}

export const AutoConnectProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [autoConnect, setAutoConnect] = useLocalStorage("autoConnect", true);

  const contextValue = useMemo(
    () => ({
      autoConnect,
      setAutoConnect,
    }),
    [autoConnect, setAutoConnect]
  );

  return (
    <AutoConnectContext.Provider value={contextValue}>
      {children}
    </AutoConnectContext.Provider>
  );
};
