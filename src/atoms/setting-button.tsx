import React, { HTMLAttributes, useMemo } from 'react';

interface SettingButtonProps {
  idx: number;
  itemsCount: number;
  className?: HTMLAttributes<HTMLButtonElement>['className'];
  onClick(): void;
  highlighted: boolean;
  roundBorder?: 'left' | 'right' | undefined;
  children: React.ReactNode;
}

const SettingButton = ({
  idx,
  itemsCount,
  className = '',
  onClick,
  highlighted,
  roundBorder,
  children,
}: SettingButtonProps) => {
  const classes = `relative flex-1 py-4 px-1 text-black/50  bg-[#E5E7EB59]  `;
  const roundBorderClass = (() => {
    if (roundBorder === 'left') return 'border-white ';
    if (roundBorder === 'right') return 'border-white ';
    return null;
  })();

  const borderClassName = useMemo(() => {
    if (idx > 0 && idx < itemsCount) {
      return 'border-l border-white';
    }
    return null;
  }, [idx, itemsCount]);

  return (
    <button
      type="button"
      className={`${
        highlighted ? `border-white ${roundBorderClass} !bg-[#E5E7EB]  ` : ''
      } ${borderClassName} ${classes} ${className} relative`}
      onClick={onClick}
    >
      <div className="h-full w-full leading-none flex justify-center items-center text-black">
        {children}
      </div>
    </button>
  );
};

export default SettingButton;
