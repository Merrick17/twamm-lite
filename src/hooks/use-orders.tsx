import type { Provider, Program } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import useSWR from "swr";
import { Order } from "@twamm/client.js";

import useWalletPassThrough from "src/contexts/wallet-passthrough-context";
import useProgram from "./use-program";

const swrKey = (params: { account: PublicKey | null }) => ({
  key: "orders",
  params,
});

const fetcher = (provider: Provider, program: Program) => {
  const order = new Order(program, provider);

  return async ({ params }: SWRParams<typeof swrKey>) => {
    const orders = await order.getOrdersByAccount(params.account);

    const walletOrders = orders.filter(
      (o) => String(o.owner) === String(params.account)
    );

    return walletOrders;
  };
};

export default (_: void, options = {}) => {
  const { publicKey: account } = useWalletPassThrough();
  const { program, provider } = useProgram();

  return useSWR(swrKey({ account }), fetcher(provider, program), options);
};
