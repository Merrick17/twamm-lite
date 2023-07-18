import { useCallback } from 'react';

import SettingButton from 'src/atoms/setting-button';

interface Props {
  explorer: string;
  explorers: any;
  setExplorer: (url: string) => void;
}

const EXPLORER_PRESET: { idx: number; value: any }[] = [
  { idx: 0, value: 'explorer' },
  { idx: 1, value: 'solanafm' },
  { idx: 2, value: 'xray' },
];

export default ({ explorer, explorers, setExplorer }: Props) => {
  const handleSlippage = useCallback(
    (url: string) => {
      setExplorer(url);
    },
    [setExplorer]
  );

  return (
    <div className="flex items-center mt-2.5 rounded-xl ring-1 ring-white/5 overflow-hidden text-sm h-[52px]">
      {EXPLORER_PRESET.map((item) => (
        <SettingButton
          key={item.idx}
          idx={item.idx}
          itemsCount={Object.keys(explorers).length}
          highlighted={explorers[item.value].uri === explorer}
          onClick={() => handleSlippage(explorers[item.value].uri)}
        >
          <div>
            <p className="text-sm text-black/70">
              {explorers[item.value].label}
            </p>
          </div>
        </SettingButton>
      ))}
    </div>
  );
};
