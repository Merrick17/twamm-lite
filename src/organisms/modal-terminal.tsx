import { Wallet } from "@solana/wallet-adapter-react";

import { FormProps } from "src/types";
import WalletDisconnectedGraphic from "src/icons/wallet-connected-graphic";

export default function ModalTerminal({
  rpcUrl,
  fakeWallet,
  formProps,
}: {
  rpcUrl: string;
  fakeWallet: Wallet | null;
  formProps: FormProps;
}) {
  const launchTerminal = () => {
    window.Twamm.init({
      endpoint: rpcUrl,
      formProps,
      passThroughWallet: fakeWallet,
    });
  };

  return (
    <div
      className="p-4 hover:bg-white/10 rounded-xl cursor-pointer flex h-full w-full flex-col items-center justify-center text-white"
      onClick={launchTerminal}
    >
      <WalletDisconnectedGraphic />
      <span className="text-xs mt-4">Launch Terminal Modal</span>
    </div>
  );
}
