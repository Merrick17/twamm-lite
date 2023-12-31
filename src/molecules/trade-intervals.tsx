import M from "easy-maybe/lib";
import { useCallback, useMemo, useState } from "react";

import i18n from "src/i18n/en.json";
import TimeInterval from "src/atoms/time-interval";
import type { IntervalVariant, PoolTIF } from "src/domain/interval.d";
import useIndexedTIFs from "src/contexts/tif-context";
import { SpecialIntervals } from "src/domain/interval";
import useTwammLiteParams from "src/contexts/twamm-lite-params-context";

export default ({
  disabled,
  indexedTifs,
  onSelect,
  selected,
}: {
  disabled: boolean;
  indexedTifs: Voidable<PoolTIF[]>;
  onSelect: (arg0: IntervalVariant, arg1: boolean) => void;
  selected?: IntervalVariant;
}) => {
  const { periodTifs, scheduleTifs, scheduleSelected, periodSelected } =
    useIndexedTIFs();

  const { useJupiter } = useTwammLiteParams();

  const [instant, setInstant] = useState<number>();

  const onScheduleSelect = useCallback(
    (value: number) => {
      if (instant) setInstant(undefined);

      M.tap((itifs) => {
        const indexedTIF = itifs.find((itif) => itif.left === value);

        if (value === SpecialIntervals.NO_DELAY) {
          onSelect(value, false);
        } else if (indexedTIF) {
          onSelect(indexedTIF, true);
        }
      }, M.of(indexedTifs));
    },
    [indexedTifs, instant, onSelect]
  );
  const onPeriodSelect = useCallback(
    (value: number) => {
      M.tap((itifs) => {
        const indexedTIF = itifs.find((itif) => itif.left === value);

        if (value === SpecialIntervals.INSTANT) {
          onSelect(value, false);
        } else if (indexedTIF) {
          onSelect(indexedTIF, false);
        }
      }, M.of(indexedTifs));
    },
    [indexedTifs, onSelect]
  );

  const values = useMemo(() => {
    let period;
    let periodIndex;
    let schedule;
    let scheduleIndex;

    if (selected === SpecialIntervals.NO_DELAY) {
      schedule = -1;
      scheduleIndex = -1;
    } else if (selected === SpecialIntervals.INSTANT) {
      schedule = -1;
      period = -2;
      scheduleIndex = -1;
      periodIndex = -2;
    } else if (selected?.tif) {
      schedule = scheduleSelected;
      period = periodSelected;
      if (scheduleSelected && typeof scheduleSelected !== "number") {
        scheduleIndex = indexedTifs?.findIndex(
          (t) => t.tif === scheduleSelected.tif
        );
      }
      if (periodSelected && typeof periodSelected !== "number") {
        periodIndex = indexedTifs?.findIndex(
          (t) => t.tif === periodSelected.tif
        );
      }
    }

    return { schedule, period, periodIndex, scheduleIndex };
  }, [indexedTifs, periodSelected, selected, scheduleSelected]);

  return (
    <>
      <TimeInterval
        disabled={disabled}
        info={i18n.OrderControlsIntervalsScheduleOrderInfo}
        label={i18n.OrderControlsIntervalsScheduleOrder}
        onSelect={onScheduleSelect}
        value={values.schedule}
        valueIndex={values.scheduleIndex}
        values={scheduleTifs}
      />
      <TimeInterval
        disabled={disabled}
        info={i18n.OrderControlsIntervalsExecutionPeriodInfo}
        label={i18n.OrderControlsIntervalsExecutionPeriod}
        onSelect={onPeriodSelect}
        value={values.period}
        valueIndex={values.periodIndex}
        values={periodTifs}
        useJupiter={useJupiter}
      />
    </>
  );
};
