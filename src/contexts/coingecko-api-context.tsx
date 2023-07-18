import type { FC, ReactNode } from "react";
import { createContext, useState, useContext } from "react";

import { ContractApi } from "src/api/coingecko";

export type CoingeckoApiContextType = {
  contractApi: ContractApi;
};

export const ApiContext = createContext<CoingeckoApiContextType | undefined>(
  undefined
);

export const CoingeckoApiProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [context] = useState<CoingeckoApiContextType>({
    contractApi: new ContractApi(),
  });

  return <ApiContext.Provider value={context}>{children}</ApiContext.Provider>;
};

export default function useCoingeckoApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("Coingecko context is required");
  }
  return context.contractApi;
}
