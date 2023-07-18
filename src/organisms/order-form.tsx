import M from "easy-maybe/lib";
import type { Counter } from "@twamm/types";
import { Form } from "react-final-form";
import { OrderSide } from "@twamm/types/lib";
import { useCallback, useMemo, useState, useDeferredValue } from "react";

import * as formHelpers from "src/domain/order";
import useIndexedTIFs, { selectors } from "src/contexts/tif-context";
import type { ValidationErrors } from "src/domain/order";
import ExchangePairForm from "./exchange-pair-form";
import ExecuteProgramOrder from "./program-order-progress";
import type { IntervalVariant, PoolTIF } from "../domain/interval.d";
import ExecuteJupiterOrder from "./jupiter-order-progress";

export default ({
  primary,
  secondary,
  intervalTifs,
  onABSwap,
  onASelect,
  onBSelect,
  poolCounters: counters,
  poolTifs,
  side: s,
  tokenA,
  tokenADecimals,
  tokenB,
  tokenPair: pair,
}: {
  primary?: TokenInfo;
  secondary?: TokenInfo;
  intervalTifs?: PoolTIF[];
  onABSwap: () => void;
  onASelect: () => void;
  onBSelect: () => void;
  poolCounters?: Counter[];
  poolTifs?: number[];
  side?: OrderSide;
  tokenA?: string;
  tokenADecimals?: number;
  tokenB?: string;
  tokenPair?: TokenTuple<JupToken>;
}) => {
  const { selected: selectedTif, scheduled, setTif } = useIndexedTIFs();
  const [amount, setAmount] = useState<number>(0);
  const deferredAmount = useDeferredValue(amount);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [prepareError, setPrepareError] = useState<Error>();

  const tifs = M.withDefault(undefined, M.of(poolTifs));
  const poolCounters = M.withDefault(undefined, M.of(counters));
  const side = M.withDefault(undefined, M.of(s));
  const tokenPair = M.withDefault(undefined, M.of(pair));

  const onChangeAmount = useCallback(
    (value: number) => {
      setAmount(value);
    },
    [setAmount]
  );
  const onIntervalSelect = useCallback(
    (indexedTIF: IntervalVariant, schedule: boolean) => {
      setTif(indexedTIF, schedule);
    },
    [setTif]
  );
  const errors = useMemo<Voidable<ValidationErrors>>(
    () =>
      formHelpers.validate(
        deferredAmount,
        selectedTif,
        tokenA,
        tokenB,
        scheduled
      ) || (prepareError ? { tif: prepareError } : undefined),
    [deferredAmount, prepareError, selectedTif, scheduled, tokenA, tokenB]
  );

  const jupiterParams = useMemo(() => {
    if (!side) return undefined;
    if (!selectedTif) return undefined;
    if (!tokenADecimals) return undefined;
    if (!tokenPair) return undefined;

    const [a, b] = tokenPair;
    const params = formHelpers.prepare4Jupiter(
      side,
      deferredAmount,
      tokenADecimals,
      a.address,
      b.address
    );

    return params;
  }, [deferredAmount, side, selectedTif, tokenPair, tokenADecimals]);

  const programParams = useMemo(() => {
    if (!poolCounters) return undefined;
    if (!selectedTif) return undefined;
    if (!tifs) return undefined;
    if (!tokenADecimals) return undefined;
    if (!side) return undefined;
    if (!tokenPair) return undefined;

    if (typeof selectedTif === "number") return undefined;

    const [a, b] = tokenPair;
    const timeInForce = selectedTif.tif;
    const nextPool = scheduled;

    try {
      const params = formHelpers.prepare4Program(
        timeInForce,
        nextPool,
        intervalTifs,
        side,
        deferredAmount,
        tokenADecimals,
        a.address,
        b.address,
        tifs,
        poolCounters
      );
      setPrepareError(undefined);
      return params;
    } catch (e: unknown) {
      setPrepareError(e as Error);
      return undefined;
    }
  }, [
    deferredAmount,
    intervalTifs,
    poolCounters,
    selectedTif,
    scheduled,
    side,
    tifs,
    tokenPair,
    tokenADecimals,
  ]);

  const selected = selectors(
    selectedTif ? { selected: selectedTif } : undefined
  );

  const onSubmit = () => {
    setSubmitting(true);
  };

  const onSuccess = () => {
    setSubmitting(false);
  };

  return (
    <Form onSubmit={onSubmit} validate={() => errors}>
      {({ handleSubmit, valid }) => (
        <>
          <ExchangePairForm
            amount={deferredAmount}
            primary={primary}
            onABSwap={onABSwap}
            onASelect={onASelect}
            onBSelect={onBSelect}
            onChangeAmount={onChangeAmount}
            onIntervalSelect={onIntervalSelect}
            onSubmit={handleSubmit}
            secondary={secondary}
            submitting={submitting}
          />
          <div className="px-2">
            {selected.isInstantOrder ? (
              <ExecuteJupiterOrder
                disabled={!jupiterParams || !valid || submitting}
                form="exchange-form"
                onSuccess={onSuccess}
                params={jupiterParams}
                progress={submitting}
                validate={() => errors}
              />
            ) : (
              <ExecuteProgramOrder
                disabled={!programParams || !valid || submitting}
                form="exchange-form"
                onSuccess={onSuccess}
                params={programParams}
                progress={submitting}
                scheduled={scheduled}
                validate={() => errors}
              />
            )}
          </div>
        </>
      )}
    </Form>
  );
};
