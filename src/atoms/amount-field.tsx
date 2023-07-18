import type { ChangeEvent } from 'react';
import { useCallback } from 'react';
import { NumericFormat, NumberFormatValues } from 'react-number-format';
import classNames from 'classnames';

import { detectedSeparator, MAX_INPUT_LIMIT } from 'src/utils';

export default ({
  amount,
  disabled,
  onChange: handleChange = () => {},
  decimals,
  isPending,
}: {
  amount: number;
  disabled: boolean;
  onChange?: (arg0: number) => void;
  decimals?: number;
  isPending: boolean;
}) => {
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = Number(e.target.value);

      handleChange(next);
    },
    [handleChange]
  );

  const withValueLimit = useCallback(
    ({ floatValue }: NumberFormatValues) =>
      !floatValue || floatValue <= MAX_INPUT_LIMIT,
    []
  );

  return (
    <>
      {isPending && (
        <div className="h-2.5 bg-gray-500 rounded-full w-20 animate-pulse" />
      )}
      {!isPending && (
        <NumericFormat
          allowNegative={false}
          disabled={disabled}
          value={amount || ''}
          decimalScale={decimals}
          onChange={onChange}
          valueIsNumericString
          placeholder="0.00"
          isAllowed={withValueLimit}
          className={classNames(
            'h-full w-full bg-transparent text-black text-right  text-lg',
            { 'cursor-not-allowed': disabled }
          )}
          decimalSeparator={detectedSeparator}
        />
      )}
    </>
  );
};
