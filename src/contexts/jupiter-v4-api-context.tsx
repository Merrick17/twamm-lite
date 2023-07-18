import type { FC, ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import { Configuration, DefaultApi } from "src/api/jupiter-v4";
import { JUPITER_CONFIG_URI } from "src/env";

export type JupiterApiContext = {
  defaultApi: DefaultApi;
};

export const Context = createContext<JupiterApiContext | undefined>(undefined);

export const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const [context] = useState<JupiterApiContext>({
    defaultApi: new DefaultApi(
      new Configuration({ basePath: JUPITER_CONFIG_URI })
    ),
  });

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export default function useJupiterApi() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("JupiterApi context is required");
  }
  return context.defaultApi;
}
