import M from 'easy-maybe/lib';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import usePrice from 'src/hooks/use-price';
import useBalance from 'src/hooks/use-balance';
import { add, keepPrevious, refreshEach } from 'src/swr-options';
import useIndexedTIFs from 'src/contexts/tif-context';
import TokenSelect from 'src/atoms/token-select';
import AmountField from 'src/atoms/amount-field';
import WalletIcon from 'src/icons/wallet-icon';
import { formatPrice } from 'src/domain/index';
import TradeIntervals from 'src/molecules/trade-intervals';
import { formatNumber } from 'src/utils';
import useWalletPassThrough from 'src/contexts/wallet-passthrough-context';
import SwitchPairButton from 'src/icons/switch-pair-icon';
import api from 'src/api';
import type { IntervalVariant } from '../domain/interval.d';

export default ({
  amount,
  primary,
  onABSwap,
  onASelect,
  onBSelect,
  onChangeAmount,
  onIntervalSelect,
  onSubmit,
  secondary,
  submitting,
}: {
  amount?: number;
  primary?: JupToken;
  onABSwap: () => void;
  onASelect: () => void;
  onBSelect: () => void;
  onChangeAmount: (arg0: number) => void;
  onIntervalSelect: (a: IntervalVariant, b: boolean) => void;
  onSubmit: () => void;
  secondary?: JupToken;
  submitting: boolean;
}) => {
  const [a, b] = [primary, secondary];
  const outRef = useRef<number>(0);
  const outValueRef = useRef<number>(0);
  const savedUsdRef = useRef<number>(0);
  const savedPercentageRef = useRef<number>(0);
  const [pairAmount, setPairAmount] = useState<number>(0);
  const [isPending, setPending] = useState<boolean>(false);
  const balanceA = useBalance(a?.address, add([keepPrevious(), refreshEach()]));
  const balanceB = useBalance(b?.address, add([keepPrevious(), refreshEach()]));
  const { publicKey } = useWalletPassThrough();
  const { tifs: intervalTifs, selected } = useIndexedTIFs();
  const pairPrice: any = usePrice(a?.address ? { id: a?.address } : undefined);

  const onChange = useCallback(
    (next: number) => {
      setPairAmount(next);
      onChangeAmount(next);
    },
    [onChangeAmount, setPairAmount]
  );

  const onMaxClick = useCallback(() => {
    M.andMap(onChange, M.of(balanceA.data));
  }, [onChange, balanceA.data]);

  const displayBalanceA = M.withDefault<string | number>(
    '0',
    M.of(balanceA.data)
  );

  const displayBalanceB = M.withDefault<string | number>(
    '0',
    M.of(balanceB.data)
  );

  const sellRate = useMemo(() => {
    try {
      if (amount && amount > 0 && selected.tif) {
        const sRate = amount / (selected.tif / 60);
        const sRateFormatted = sRate
          ?.toFixed(10)
          ?.match(/^-?\d*\.?0*\d{0,3}/)?.[0];
        return Number(sRateFormatted);
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }, [amount, selected]);

  const handleSwap = () => {
    onABSwap();
  };
  const handleInputSelect = () => {
    onASelect();
  };

  const handleOutputSelect = () => {
    onBSelect();
  };

  const handleIntervalSelect = useCallback(
    (indexed: IntervalVariant, schedule: boolean) => {
      onIntervalSelect(indexed, schedule);
    },
    [onIntervalSelect]
  );

  const priceA = usePrice({
    id: a?.address as string,
  });

  const priceB = usePrice({
    id: b?.address as string,
  });

  const totalAmount = M.andThen<number, number>(
    (p) => (Number.isNaN(amount) ? M.of(undefined) : M.of(p * pairAmount)),
    M.of(pairPrice.data)
  );

  const displayAmount = M.withDefault(
    '',
    M.andMap(
      (p) => (p === 0 ? formatPrice(0) : `~${formatPrice(p)}`),
      totalAmount
    )
  );

  useEffect(() => {
    setPending(true);
    function getOutAmount() {
      const tokenA = a?.address;
      const tokenB = b?.address;
      const tokenBDecimals = b?.decimals;
      const tokenAFormattedAmount = Math.floor(
        (amount ?? 0) * 10 ** (a?.decimals ?? 0)
      );
      // Calculate with TIF intervals
      let tifPeriod;
      let epochs: number;
      let tifAccountedTokenAFormattedAmount;
      const crankInterval = 10; // 10 seconds
      if (selected?.tif) {
        tifPeriod = selected?.tif;
        epochs = tifPeriod / crankInterval;
        tifAccountedTokenAFormattedAmount = (
          tokenAFormattedAmount / epochs
        ).toFixed(0);
      } else {
        tifPeriod = 1;
        epochs = 1;
        tifAccountedTokenAFormattedAmount = tokenAFormattedAmount;
      }

      Promise.all([
        fetch(
          `${api.quoteJup}?inputMint=${tokenA}&outputMint=${tokenB}&amount=${tifAccountedTokenAFormattedAmount}&onlyDirectRoutes=true`
        ),
        fetch(
          `${api.quoteJup}?inputMint=${tokenA}&outputMint=${tokenB}&amount=${tokenAFormattedAmount}&onlyDirectRoutes=true`
        ),
      ])
        .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
        .then(([data1, data2]) => {
          const bestRoute = data1.data[0];
          const { outAmount } = bestRoute;
          const tifAccountedAmount = outAmount * epochs;

          const noTwapBestAmount = data2.data[0].outAmount;

          if (tokenBDecimals) {
            const OutAmount = tifAccountedAmount / 10 ** tokenBDecimals;
            let savedUsd =
              ((tifAccountedAmount - noTwapBestAmount) / 10 ** tokenBDecimals) *
              priceB.data;
            let savedPercentage =
              ((tifAccountedAmount - noTwapBestAmount) / noTwapBestAmount) *
              100;

            savedUsd = Number(
              savedUsd?.toFixed(10)?.match(/^-?\d*\.?0*\d{0,3}/)?.[0]
            );
            savedPercentage = Number(
              savedPercentage?.toFixed(10)?.match(/^-?\d*\.?0*\d{0,3}/)?.[0]
            );
            savedUsdRef.current = savedUsd >= 0 ? savedUsd : 0;
            savedPercentageRef.current =
              savedPercentage >= 0 ? savedPercentage : 0;
            outRef.current = OutAmount;
            outValueRef.current = Number(
              (OutAmount * priceB.data)
                ?.toFixed(10)
                ?.match(/^-?\d*\.?0*\d{0,2}/)?.[0]
            );
            setPending(false);
          } else {
            savedUsdRef.current = 0;
            savedPercentageRef.current = 0;
            outRef.current = 0;
            outValueRef.current = 0;
            setPending(false);
          }
        })
        .catch(() => {
          savedUsdRef.current = 0;
          savedPercentageRef.current = 0;
          outRef.current = 0;
          outValueRef.current = 0;
          setPending(false);
        });
    }

    const debounceTime = setTimeout(() => {
      getOutAmount();
    }, 300);

    return () => clearTimeout(debounceTime);
  }, [amount, a, b, selected, priceB.data]);

  return (
    <form onSubmit={onSubmit} id="exchange-form">
      <div className="h-full flex flex-col items-center justify-center">
        <div className="w-full mt-2 rounded-xl flex flex-col px-2">
          <div className="flex-col">
            {/* pay section  */}
            <div className=" bg-white rounded-xl transition-all border border-[#E5E7EB]">
              <div className="px-x border-transparent rounded-xl ">
                <div>
                  <div className="py-5 px-4 flex flex-col">
                    <div className="flex justify-between items-center">
                      <TokenSelect
                        alt={a?.symbol}
                        disabled={!a}
                        image={a?.logoURI}
                        label={a?.symbol}
                        onClick={handleInputSelect}
                      />
                      <div className="text-right flex flex-row items-center gap-2">
                        <AmountField
                          amount={pairAmount}
                          disabled={false}
                          onChange={onChange}
                          decimals={a?.decimals}
                          isPending={false}
                        />
                        <button
                          type="button"
                          onClick={onMaxClick}
                          className="py-0.5 px-1 text-xs rounded-md flex items-center bg-[#E5E7EB] text-black"
                        >
                          Max
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex ml-2 mt-3 space-x-1 text-xs items-center text-black/30 fill-current">
                        <WalletIcon width={10} height={10} />
                        {!publicKey && (
                          <span translate="no">
                            {formatNumber.format(0, 6)}
                          </span>
                        )}
                        {publicKey && (
                          <span translate="no">{displayBalanceA}</span>
                        )}
                        <span>{a?.symbol}</span>
                      </div>
                      <span className="text-xs text-black/30">
                        {displayAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Swap token pairs  */}
            <div className="my-2">
              <SwitchPairButton
                className="transition-all"
                onClick={handleSwap}
              />
            </div>

            {/* recevie section  */}
            <div className=" bg-white rounded-xl transition-all border border-[#E5E7EB]">
              <div className="px-x border-transparent rounded-xl ">
                <div>
                  <div className="py-5 px-4 flex flex-col">
                    <div className="flex justify-between items-center">
                      <TokenSelect
                        alt={b?.symbol}
                        disabled={!a}
                        image={b?.logoURI}
                        label={b?.symbol}
                        onClick={handleOutputSelect}
                      />
                      <div className="text-right flex flex-row items-center gap-2">
                        <AmountField
                          amount={amount ? outRef.current : 0}
                          disabled
                          onChange={onChange}
                          decimals={b?.decimals}
                          isPending={isPending}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex ml-2 mt-3 space-x-1 text-xs items-center text-black/30 fill-current">
                        <WalletIcon width={10} height={10} />
                        {!publicKey && (
                          <span translate="no">
                            {formatNumber.format(0, 6)}
                          </span>
                        )}
                        {publicKey && (
                          <span translate="no">{displayBalanceB}</span>
                        )}
                        <span>{b?.symbol}</span>
                      </div>
                      {isPending ? (
                        <div className="h-2.5 bg-gray-500 rounded-full w-20 animate-pulse" />
                      ) : (
                        <span className="text-xs text-black/30">
                          {!outValueRef.current && amount
                            ? 0
                            : `~ ${formatPrice(outValueRef.current)}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* sellRate  */}
            {amount != null &&
              selected &&
              amount > 0 &&
              selected.tif > 0 &&
              sellRate && (
                <div className="mt-1 pl-1 flex justify-center items-center flex-col">
                  <p className="text-sm font-medium text-[#FF69B4]">
                    Sell Rate: {sellRate} {a?.symbol} (≈$
                    {(sellRate * priceA.data).toFixed(3)}) / minute
                  </p>
                  <p className="text-sm font-medium text-[#00E000]">
                    Saving ${savedUsdRef.current} ({savedPercentageRef.current}
                    %) from price impact!
                  </p>
                </div>
              )}

            <div className="p-2 mt-1">
              <TradeIntervals
                disabled={submitting}
                indexedTifs={intervalTifs}
                onSelect={handleIntervalSelect}
                selected={selected}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
