import { useMemo } from "react";
import type { GridCellParams } from "@mui/x-data-grid-pro";
import type { PublicKey } from "@solana/web3.js";
import type { TokenPair } from "@twamm/types";
import useSWR from "swr";
import M from "easy-maybe/lib";

import useTokenPairByPool from "src/hooks/use-token-pair-by-pool";
import { keepPrevious } from "src/swr-options";
import api from "src/api";
import PairCardSymbols from "./pair-card-symbols";

export interface Props
  extends GridCellParams<
    void,
    {
      side: OrderTypeStruct;
      pool: PublicKey;
    }
  > {}

const fetcher = async (url: string) => fetch(url).then((res) => res.json());

export default ({ row }: Pick<Props, "row">) => {
  const tokenPair = useTokenPairByPool(row.pool, keepPrevious());

  const { data: token, isLoading } = useSWR(api.tokenList, fetcher);

  const mints = M.withDefault(
    undefined,
    M.andMap<TokenPair, [PublicKey, PublicKey]>(
      (tp) => [tp.configA.mint, tp.configB.mint],
      M.of(tokenPair.data)
    )
  );

  const tokens = useMemo(() => {
    if (!isLoading && mints) {
      const mintA = mints[0].toString();
      const mintB = mints[1].toString();
      const infoA = token[mintA];
      const infoB = token[mintB];

      return [
        {
          contract_address: mintA,
          imageSmall: infoA.logo,
          name: infoA.name,
          symbol: infoA.symbol,
        },
        {
          contract_address: mintB,
          imageSmall: infoB.logo,
          name: infoB.name,
          symbol: infoB.symbol,
        },
      ];
    }
    return null;
  }, [mints, isLoading, token]);

  return <PairCardSymbols displayDirection data={tokens} side={row.side} />;
};
