import type { ChangeEvent } from "react";
import { memo, useCallback } from "react";
import classNames from "classnames";

import i18n from "src/i18n/en.json";

const values = [25, 50, 75, 100];

export default memo(
  ({
    percentage,
    onChange,
    onToggleDetails,
  }: {
    percentage: number;
    onChange: (amount: number) => void;
    onToggleDetails: () => void;
  }) => {
    const onPercentageChange = useCallback(
      (event: ChangeEvent) => {
        const { value } = event.target as unknown as {
          value: string | string[];
        };
        onChange(Number(value));
      },
      [onChange]
    );

    return (
      <div className="w-full px-2">
        <div className="flex flex-row justify-between items-baseline">
          <h6 className="text-center text-gray-200 ">
            {i18n.OrderFlowControlAmount}
          </h6>
          <button
            type="button"
            className="text-gray-200 cursor-pointer bg-white/5 text-sm rounded-lg p-2"
            onClick={onToggleDetails}
          >
            {i18n.OrderFlowCancelDetails}
          </button>
        </div>
        <div className="py-2">
          <p className="text-white/70 text-lg">{percentage}%</p>
          <div className="py-2">
            <input
              type="range"
              min="1"
              max="100"
              value={percentage}
              id="myRange"
              onChange={onPercentageChange}
              className="w-full"
            />
          </div>
          <div className="flex justify-between gap-5 flex-row py-2 w-full">
            {values.map((value) => (
              <div
                className={classNames(
                  "border  text-sm p-2 rounded-lg cursor-pointer w-full text-center",
                  percentage === value
                    ? "text-gray-200  bg-white/5 border-gray-500"
                    : "text-gray-400 border-gray-500"
                )}
                key={`percentage-${value}`}
                onClick={() => onChange(value)}
              >
                {value}%
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
