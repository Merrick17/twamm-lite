import type { ChangeEvent, SyntheticEvent } from 'react';
import { useCallback, useMemo } from 'react';

import Intervals from 'src/molecules/interval-button-group';
import type { IndexedTIF } from 'src/domain/interval.d';
import TechInfoIcon from 'src/icons/tech-info-icon';
import Tooltip from 'src/atoms/tooltip';

export default ({
  disabled,
  info,
  label,
  onSelect,
  value,
  valueIndex,
  values,
  useJupiter,
}: {
  disabled: boolean;
  info?: string;
  label: string;
  onSelect: (arg0: number) => void;
  value?: number | IndexedTIF;
  valueIndex?: number;
  values?: number[];
  useJupiter?: boolean;
}) => {
  const intervalValues = useMemo(() => values, [values]);

  const onIntervalSelect = useCallback(
    (e: SyntheticEvent<HTMLElement>) => {
      const event: unknown = e;
      const { target } = event as ChangeEvent<HTMLElement>;

      onSelect(Number(target.getAttribute('data-interval')));
    },
    [onSelect]
  );

  return (
    <div className="w-full pb-2">
      <div className="pb-2">
        <label
          htmlFor="title"
          className="flex items-center gap-x-2 text-sm text-black/70 fill-current"
        >
          {label}
          <div className="cursor-pointer">
            <Tooltip
              variant="light"
              content={<div className="text-black text-xs">{info}</div>}
            >
              <div className="flex items-center text-black-35 fill-current">
                <TechInfoIcon />
              </div>
            </Tooltip>
          </div>
        </label>
      </div>
      <div className="my-2">
        <Intervals
          disabled={disabled}
          onClick={onIntervalSelect}
          value={value}
          valueIndex={valueIndex}
          valuesOpt={1}
          values={intervalValues}
          useJupiter={useJupiter}
        />
      </div>
    </div>
  );
};
