import M, { Extra } from "easy-maybe/lib";
import { protocol } from "@twamm/client.js";

import usePrice from "src/hooks/use-price";
import type { PoolDetails } from "src/types/decl.d";
import ChevronDownIcon from "src/icons/chevron-down-icon";
import Loading from "src/atoms/loading";
import CancelOrderLiquidity from "./cancel-order-liquidity";
import { refreshEach } from "../swr-options";

export default ({
  data,
  details,
  onToggle,
  percentage,
}: {
  data?: JupToken[];
  details?: PoolDetails;
  onToggle: () => void;
  percentage: number;
}) => {
  const d = M.of(data);

  const tokens = M.withDefault(undefined, d);
  const priceParams = M.withDefault(
    undefined,
    M.andMap((t) => {
      const [{ symbol: id }, { symbol: vsToken }] = t;
      return { id, vsToken };
    }, d)
  );

  const withdrawAmount = M.andMap(([td, det]) => {
    const [a, b] = td;
    const { order, tradeSide, tokenPair } = det;

    const [wda, wdb] = protocol.withdrawAmount(
      (order.lpBalance * percentage) / 100,
      tradeSide,
      order,
      tokenPair
    );

    const withdrawPair = [
      wda * 10 ** (a.decimals * -1),
      wdb * 10 ** (b.decimals * -1),
    ];

    return withdrawPair;
  }, Extra.combine2([d, M.of(details)]));

  const amount = M.withDefault<Array<number | string>>(
    ["-", "-"],
    withdrawAmount
  );

  const price = usePrice(priceParams, refreshEach(10000));

  if (!tokens) return <Loading width={8} height={8} />;

  return (
    <>
      <div className="flex justify-center">
        <button
          type="button"
          className="p-2 h-8 w-8 rounded-full border border-gray-400 flex items-center justify-center"
          onClick={onToggle}
        >
          <ChevronDownIcon />
        </button>
      </div>
      <div>
        <CancelOrderLiquidity
          ab={tokens}
          amount={amount}
          errorData={price.error}
          priceData={price.data}
        />
      </div>
    </>
  );
};
