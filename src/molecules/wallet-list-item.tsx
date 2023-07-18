import type {
  MouseEvent,
  ForwardedRef,
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
} from "react";
import { forwardRef, useState } from "react";
import { Adapter } from "@solana/wallet-adapter-base";

import UnknownImage from "src/icons/unknown-image";

export interface WalletListItemProps {
  handleClick: (event: MouseEvent) => void;
  wallet: Adapter;
}

export interface WalletIconProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  wallet: Adapter | null;
  width?: number;
  height?: number;
}

const CUSTOM_WALLET_ICONS: Record<string, { light: string; dark: string }> = {};

export const WalletIcon: FC<WalletIconProps> = ({ wallet, ...props }) => {
  const [hasError, setHasError] = useState(false);
  const haveCustomIcon = wallet?.name
    ? CUSTOM_WALLET_ICONS[wallet.name]
    : undefined;

  let src: string = "";
  if (haveCustomIcon) {
    src = haveCustomIcon.light;
  } else if (wallet && wallet.icon) {
    src = wallet.icon;
  }

  if (wallet && src && !hasError) {
    return (
      <img
        width={props.width || 26}
        height={props.height || 26}
        src={src}
        alt={`${wallet.name} icon`}
        onError={() => {
          setHasError(true);
        }}
      />
    );
  }
  if (hasError) {
    return (
      <UnknownImage width={props.width || 24} height={props.height || 24} />
    );
  }
  return null;
};

const WalletListItem = forwardRef(
  (
    { handleClick, wallet }: WalletListItemProps,
    ref: ForwardedRef<HTMLLIElement>
  ) => (
    <li
      ref={ref}
      className="relative list-none h-full flex justify-between 
      p-4 cursor-pointer text-white bg-[#2C2D33] rounded-xl hover:bg-white/10"
    >
      <div onClick={handleClick}>
        <div className="absolute top-0 left-0  w-full h-full">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{ zIndex: -1 }}
          />
        </div>

        <div className="flex items-center overflow-hidden">
          <WalletIcon wallet={wallet} width={30} height={30} />
          <div className="font-medium ml-3 truncate text-sm">{wallet.name}</div>
        </div>
      </div>
    </li>
  )
);

export default WalletListItem;
