import type { FC, MouseEvent } from "react";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Adapter, WalletReadyState } from "@solana/wallet-adapter-base";

import LeftArrowIcon from "src/icons/left-arrow-icon";
import { useSnackbar } from "src/contexts/notification-context";
import useWalletPassThrough from "src/contexts/wallet-passthrough-context";
import WalletListItem from "./wallet-list-item";

const PRIORITISE: {
  [value in WalletReadyState]: number;
} = {
  [WalletReadyState.Installed]: 1,
  [WalletReadyState.Loadable]: 2,
  [WalletReadyState.NotDetected]: 3,
  [WalletReadyState.Unsupported]: 3,
};

interface WalletModalProps {
  setIsWalletModalOpen(toggle: boolean): void;
}

export const WalletModal: FC<WalletModalProps> = ({ setIsWalletModalOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { wallets, select } = useWalletPassThrough();

  const handleWalletClick = (event: MouseEvent, wallet: Adapter) => {
    event.preventDefault();
    try {
      select(wallet.name);

      if (wallet.readyState === WalletReadyState.NotDetected) {
        enqueueSnackbar(WalletReadyState.NotDetected, {
          variant: "error",
        });
      }
      setIsWalletModalOpen(false);
    } catch (error) {
      const err = new Error();
      throw err;
    }
  };

  const renderWalletList = (walletList: WalletContextState["wallets"]) => (
    <div
      className="h-full overflow-y-auto space-y-2 webkit-scrollbar"
      translate="no"
    >
      {walletList.map((wallet, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <ul key={index}>
          <WalletListItem
            handleClick={(event: MouseEvent) =>
              handleWalletClick(event, wallet.adapter)
            }
            wallet={wallet.adapter}
          />
        </ul>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full py-4 px-2 bg-twamm-bg">
      <div className="flex w-full justify-between">
        <div
          className="text-white fill-current w-6 h-6 cursor-pointer"
          onClick={() => setIsWalletModalOpen(false)}
        >
          <LeftArrowIcon width={24} height={24} />
        </div>

        <div className="text-white">Connect Wallet</div>

        <div className="w-6 h-6" />
      </div>

      <div className="mt-7 overflow-auto">
        {renderWalletList(
          wallets.sort(
            (a, b) => PRIORITISE[a.readyState] - PRIORITISE[b.readyState]
          )
        )}
      </div>
    </div>
  );
};
