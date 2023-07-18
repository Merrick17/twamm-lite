import type { BN } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import type { TokenPair } from "@twamm/types";
import M from "easy-maybe/lib";
import { useCallback, useMemo } from "react";

import UpdateIcon from "src/icons/update-icon";
import DoneIcon from "src/icons/done-icon";
import Loading from "src/atoms/loading";
import type {
  CancelOrderData,
  OrderRecord,
  PoolDetails,
} from "src/types/decl.d";
import Control from "src/atoms/account-orders-details-control";
import PairCardSymbols from "src/atoms/pair-card-symbols";
import Stats from "src/atoms/account-orders-details-stats";
import usePoolDetails from "src/hooks/use-pool-details";
import useTokenPairByPool from "src/hooks/use-token-pair-by-pool";

const Content = ({
  details,
  filledQuantity,
  onCancelOrder,
  quantity,
  timeInForce,
  tokens,
}: {
  details: PoolDetails;
  filledQuantity: number;
  onCancelOrder: () => void;
  quantity: number;
  timeInForce: number;
  tokens?: any;
}) => (
  <div className="flex flex-col space-x-3">
    <h5 className="flex items-center flex-row text-white gap-x-2">
      <PairCardSymbols data={tokens} displayDirection side={details.side} />
      {!details.expired ? (
        <UpdateIcon height={25} width={25} />
      ) : (
        <DoneIcon height={25} width={25} />
      )}
    </h5>
    <Stats
      details={details}
      filledQuantity={filledQuantity}
      quantity={quantity}
      timeInForce={timeInForce}
    />
    <Control
      expired={details.expired}
      inactive={details.inactive}
      onClick={onCancelOrder}
    />
  </div>
);

export default ({
  filledQuantity,
  onCancel,
  order,
  poolAddress,
  quantity,
  side,
  supply,
  timeInForce,
  data,
  isLoading,
}: {
  filledQuantity: number;
  onCancel: (arg0: CancelOrderData) => void;
  order: OrderRecord["order"];
  poolAddress: PublicKey;
  quantity: number;
  side: OrderTypeStruct;
  supply: BN;
  timeInForce: number;
  data?: any;
  isLoading: boolean;
}) => {
  const details = usePoolDetails(poolAddress, order);
  const tokenPair = useTokenPairByPool(poolAddress);

  const pairMints = M.withDefault(
    undefined,
    M.andMap<TokenPair, [PublicKey, PublicKey]>(
      (pair) => [pair.configA.mint, pair.configB.mint],
      M.of(tokenPair.data)
    )
  );

  const tokens = useMemo(() => {
    if (pairMints && !isLoading) {
      const mintA = pairMints[0].toString();
      const mintB = pairMints[1].toString();
      const infoA = data[mintA];
      const infoB = data[mintB];

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
  }, [pairMints, isLoading, data]);

  const onCancelOrder = useCallback(() => {
    M.tap((d) => {
      const { aAddress, bAddress, expired, inactive, poolAddress: a } = d;

      onCancel({
        a: aAddress,
        b: bAddress,
        expired,
        inactive,
        orderAddress: order.address,
        poolAddress: a,
        side,
        supply,
      });
    }, M.of(details.data));
  }, [details, onCancel, order, side, supply]);

  if (details.isLoading || !details.data)
    return (
      <div className="w-full h-full flex justify-center items-center min-h-[300px]">
        <Loading width={8} height={8} />
      </div>
    );

  const orderDetails = details.data as NonNullable<typeof details.data>;

  return (
    <div className="px-10">
      <Content
        details={orderDetails}
        filledQuantity={filledQuantity}
        onCancelOrder={onCancelOrder}
        quantity={quantity}
        timeInForce={timeInForce}
        tokens={tokens}
      />
    </div>
  );
};
