import { useCallback } from 'react';

import SettingButton from 'src/atoms/setting-button';

interface Props {
  slippage: number;
  slippages: number[];
  setSlippage: (slip: number) => void;
}

export default ({ slippage, setSlippage, slippages }: Props) => {
  const handleSlippage = useCallback(
    (slip: number) => {
      setSlippage(slip);
    },
    [setSlippage]
  );

  return (
    <div className="flex items-center mt-2.5 rounded-xl ring-1 ring-white/5 overflow-hidden text-sm h-[52px]">
      {slippages.map((item, idx) => (
        <SettingButton
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          idx={idx}
          itemsCount={slippages.length}
          highlighted={item === slippage}
          onClick={() => handleSlippage(item)}
        >
          <div>
            <p className="text-sm text-black/70">{item}%</p>
          </div>
        </SettingButton>
      ))}
    </div>
  );
};
