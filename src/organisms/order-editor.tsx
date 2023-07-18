import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { OrderSide } from "@twamm/types/lib";
import M, { Extra } from "easy-maybe/lib";
import { translateAddress } from "@project-serum/anchor";

import useWalletPassThrough from "src/contexts/wallet-passthrough-context";
import useIndexedTIFs from "src/contexts/tif-context";
import usePrice from "src/hooks/use-price";
import useTokenPairByTokens from "src/hooks/use-token-pair-by-tokens";
import useTIFIntervals from "src/hooks/use-tif-intervals";
import { add, dedupeEach, keepPrevious, refreshEach } from "src/swr-options";
import Loading from "src/atoms/loading";
import UniversalPopover, { Ref } from "../molecules/universal-popover";
import OrderForm from "./order-form";
import CoinSelect from "./coin-select";

export default ({
  a,
  all,
  available,
  b,
  onSelectA,
  onSelectB,
  onSwap,
  onTradeChange,
  tokenPairs,
  tokenPair,
  tradeSide,
}: {
  a: Voidable<TokenInfo>;
  all: Voidable<TokenInfo["address"][]>;
  available: Voidable<TokenInfo["address"][]>;
  b: Voidable<TokenInfo>;
  onSelectA: (token: TokenInfo) => void;
  onSelectB: (token: TokenInfo) => void;
  onSwap: (price?: number) => void;
  onTradeChange: (arg0: {
    amount: number;
    pair: AddressPair;
    type: OrderSide;
  }) => void;
  tokenPairs: Voidable<AddressPair[]>;
  tokenPair: Voidable<JupToken[]>;
  tradeSide: Voidable<OrderSide>;
}) => {
  const { publicKey } = useWalletPassThrough();

  const pairs = M.of(tokenPairs);
  const pair = M.of(tokenPair);

  const { setIntervals, setOptions, setTif } = useIndexedTIFs();
  const [curToken, setCurToken] = useState<number>();
  const selectCoinRef = useRef<Ref>();

  const tokenPairPrice = usePrice(
    M.withDefault(
      undefined,
      M.andMap(
        ([primary, secondary]) => ({
          id: primary.address,
          vsToken: secondary.address,
        }),
        Extra.combine2([M.of(a), M.of(b)])
      )
    )
  );

  const selectedPair = useTokenPairByTokens(
    a && b && { aToken: a, bToken: b },
    refreshEach()
  );

  const intervalTifs = useTIFIntervals(
    selectedPair.data?.exchangePair[0],
    selectedPair.data?.tifs,
    selectedPair.data?.currentPoolPresent,
    selectedPair.data?.poolCounters,
    add([keepPrevious(), dedupeEach(10e3), refreshEach(10e3)])
  );

  useEffect(() => {
    setIntervals(intervalTifs.data);
  }, [intervalTifs.data, setIntervals]);

  useEffect(() => {
    M.andMap(({ minTimeTillExpiration }) => {
      setOptions({ minTimeTillExpiration });
    }, M.of(selectedPair.data));
  }, [selectedPair.data, setOptions]);

  useEffect(() => {
    const onUnmount = () => {
      if (selectedPair.data) {
        const { exchangePair } = selectedPair.data;

        const [p, t] = exchangePair;

        onTradeChange({
          amount: 0,
          pair: [p[0].address, p[1].address],
          type: t,
        });
      }
    };

    return onUnmount;
  }, [onTradeChange, pair, pairs, selectedPair.data, tradeSide]);

  const onTokenChoose = useCallback(
    (index: number) => {
      setCurToken(index);
      if (selectCoinRef.current && !selectCoinRef.current?.isOpened)
        selectCoinRef.current.open();
    },
    [setCurToken]
  );

  const onTokenAChoose = useCallback(() => {
    onTokenChoose(1);
  }, [onTokenChoose]);

  const onTokenBChoose = useCallback(() => {
    onTokenChoose(2);
  }, [onTokenChoose]);

  const onTokenSwap = useCallback(() => {
    onSwap(tokenPairPrice.data);
  }, [tokenPairPrice.data, onSwap]);

  const onCoinSelect = useCallback(
    (token: TokenInfo) => {
      if (selectCoinRef.current?.isOpened) selectCoinRef.current.close();
      if (curToken === 1) onSelectA(token);
      if (curToken === 2) onSelectB(token);

      if (a && b && ![a.symbol, b.symbol].includes(token.symbol)) {
        setTif(0, false);
      }
    },
    [a, b, curToken, onSelectA, onSelectB, setTif]
  );

  const tokens = useMemo(() => {
    const allKeys = M.withDefault(
      undefined,
      M.andMap((ak) => ak.map(translateAddress), M.of(all))
    );
    const availableKeys = M.withDefault(
      undefined,
      M.andMap((ak) => ak.map(translateAddress), M.of(available))
    );
    return curToken === 2 ? availableKeys : allKeys;
  }, [curToken, available, all]);

  if (
    Extra.isNothing(pair) ||
    Extra.isNothing(pairs) ||
    Extra.isNothing(M.of(available))
  ) {
    return <Loading top={100} height={8} width={8} />;
  }

  return (
    <>
      <UniversalPopover ref={selectCoinRef} title="Select token" arrow>
        <CoinSelect
          onSelect={onCoinSelect}
          tokens={tokens}
          publicKey={publicKey}
        />
      </UniversalPopover>
      <OrderForm
        primary={a}
        secondary={b}
        intervalTifs={intervalTifs.data}
        onABSwap={onTokenSwap}
        onASelect={onTokenAChoose}
        onBSelect={onTokenBChoose}
        poolCounters={selectedPair.data?.poolCounters}
        poolTifs={selectedPair.data?.tifs}
        side={tradeSide}
        tokenA={a?.symbol}
        tokenADecimals={a?.decimals}
        tokenB={b?.symbol}
        tokenPair={selectedPair.data?.exchangePair[0]}
      />
    </>
  );
};
