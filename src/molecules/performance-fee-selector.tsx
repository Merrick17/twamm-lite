import { useCallback } from 'react';

import SettingButton from 'src/atoms/setting-button';

const PRIORITY_PRESET: { idx: number; value: string }[] = [
  { idx: 0, value: 'None' },
  { idx: 1, value: 'High' },
  { idx: 2, value: 'Turbo' },
];

interface Props {
  performanceFee: number;
  performanceFees: number[];
  setPerformanceFee: (fee: number) => void;
}

export default ({
  performanceFee,
  setPerformanceFee,
  performanceFees,
}: Props) => {
  const handlePriorityFee = useCallback(
    (fee: number) => {
      setPerformanceFee(fee);
    },
    [setPerformanceFee]
  );

  return (
    <div className="flex items-center mt-2.5 rounded-xl ring-1 ring-white/5 overflow-hidden">
      {PRIORITY_PRESET.map((item) => (
        <SettingButton
          key={item.idx}
          idx={item.idx}
          itemsCount={PRIORITY_PRESET.length}
          highlighted={item.idx === performanceFee}
          onClick={() => handlePriorityFee(item.idx)}
        >
          <div>
            <p className="text-sm text-black/70">{item.value}</p>
            <span className="mt-1 text-xs">
              {performanceFees[item.idx]} SOL
            </span>
          </div>
        </SettingButton>
      ))}
    </div>
  );
};
