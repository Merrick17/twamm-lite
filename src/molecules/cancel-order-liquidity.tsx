import M, { Extra } from "easy-maybe/lib";
import { useMemo } from "react";

import { isFloat } from "src/utils/index";
import Alert from "src/atoms/alert";

const formatRate = (a: number) => (!isFloat(a) ? a : Number(a).toFixed(2));

export default ({
  ab,
  amount,
  errorData,
  priceData,
}: {
  ab: JupToken[];
  amount: Array<number | string>;
  errorData: Voidable<Error>;
  priceData: Voidable<number>;
}) => {
  const data = M.of(priceData);
  const error = M.of(errorData);

  const pair = useMemo(
    () =>
      ab.map((token, i) => ({
        symbol: token.symbol,
        amount: amount[i],
        image: token.logoURI,
      })),
    [ab, amount]
  );

  const [a, b] = pair;

  const price = M.andThen(
    (d) => M.of(Extra.isJust(error) ? undefined : d),
    data
  );

  const p = M.withDefault(undefined, price);

  return (
    <>
      <div className="p-2">
        <div>
          {pair.map(({ amount: amnt, image, symbol }) => (
            <div key={symbol} className="flex items-center justify-between p-1">
              <p className="text-base text-white/60">{amnt}</p>
              <div className="p-1 flex flex-row items-center">
                <img src={image} alt="liquidity" height={30} width={30} />

                <span className="text-sm font-semibold text-white/60 pl-1">
                  {symbol.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {Extra.isJust(error) && (
        <div className="py-2">
          <Alert severity="error">{M.unwrap(error)?.message}</Alert>
        </div>
      )}
      {Extra.isJust(price) && (
        <div className="py-2 px-2 text-white/60">
          <p className="text-right">
            1 {a.symbol} = {!p ? "-" : formatRate(p)} {b.symbol}
          </p>
          <p className="text-right">
            1 {b.symbol} = {!p ? "-" : formatRate(1 / p)} {a.symbol}
          </p>
        </div>
      )}
    </>
  );
};
