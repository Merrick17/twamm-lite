import type { SyntheticEvent } from 'react';
import { isNil } from 'ramda';

import type { IntervalVariant } from 'src/domain/interval.d';
import IntervalButton from 'src/atoms/interval-button';
import { formatInterval } from 'src/utils/index';
import { SpecialIntervals } from 'src/domain/interval';

const Instant = (props: {
  disabled: boolean;
  onSelect: (e: SyntheticEvent<HTMLElement>) => void;
  selected: boolean;
  value: Voidable<number>;
  values: Voidable<any>;
  useJupiter?: boolean;
}) => {
  if (!props.values) return null;
  if (!props.useJupiter) return null;
  return (
    <IntervalButton
      disabled={props.disabled}
      onClick={props.onSelect}
      selected={props.selected}
      text="Instant"
      value={props.value}
    />
  );
};

export default ({
  disabled,
  onClick,
  value,
  valueIndex,
  valuesOpt,
  values,
  useJupiter,
}: {
  disabled: boolean;
  onClick: (e: SyntheticEvent<HTMLElement>) => void;
  value?: IntervalVariant;
  valueIndex?: number;
  valuesOpt: number;
  values?: number[];
  useJupiter?: boolean;
}) => {
  if (!values) {
    return <div className="h-8 bg-gray-500 rounded-md w-full animate-pulse" />;
  }

  return (
    <>
      {values
        .map((intervalValue: number, index) => {
          const isWildcardSelected =
            value === SpecialIntervals.NO_DELAY && index === 0;
          const isIntervalSelected =
            !isNil(valueIndex) && index === valueIndex + valuesOpt;

          return {
            value: intervalValue,
            selected: isWildcardSelected || isIntervalSelected,
          };
        })
        .filter((d) => d.value !== 0)
        .map((d) => {
          const text = formatInterval(d.value);
          const isComplementaryInterval = values.length === 1 && values[0] > 0;
          // make the interval selected when using scheduled interval

          const isSelected = d.selected || isComplementaryInterval;

          if (d.value === SpecialIntervals.INSTANT) {
            return (
              <Instant
                disabled={disabled}
                key={`interval-${d.value}`}
                onSelect={onClick}
                selected={value === SpecialIntervals.INSTANT}
                value={d.value}
                values={values}
                useJupiter={useJupiter}
              />
            );
          }

          return (
            <IntervalButton
              disabled={disabled}
              key={`interval-${d.value}`}
              onClick={onClick}
              selected={isSelected}
              text={text}
              value={d.value}
            />
          );
        })}
    </>
  );
};
