import type { MouseEvent } from 'react';

import TokenIcon from 'src/icons/token-icon';
import ChevronDownIcon from 'src/icons/chevron-down-icon';

export default ({
  alt,
  disabled = false,
  image,
  label,
  onClick,
}: {
  alt?: string;
  disabled?: boolean;
  image?: string;
  label?: string;
  onClick: (e: MouseEvent) => void;
}) => {
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    onClick(e);
  };

  return (
    <button
      type="button"
      className="py-2.5 px-3 rounded-xl flex items-center  bg-[#E5E7EB]  text-black"
      onClick={disabled ? () => null : handleClick}
      disabled={disabled}
    >
      <TokenIcon
        alt={alt}
        src={image}
        width={24}
        height={24}
        disabled={disabled}
      />

      <div className="ml-2 mr-2 " translate="no">
        {label ?? ''}
      </div>
      <span className="text-black/25 fill-current">
        <ChevronDownIcon />
      </span>
    </button>
  );
};
