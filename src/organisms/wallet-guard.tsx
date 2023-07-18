import type { ReactNode } from "react";
import classNames from "classnames";

import { useMemo } from "react";
import useWalletPassThrough from "src/contexts/wallet-passthrough-context";
import ChameleonText from "src/atoms/chameleon-text";

const ConnectButton = ({
  setIsWalletModalOpen,
}: {
  setIsWalletModalOpen: (toggle: boolean) => void;
}) => (
  <button
    type="button"
    className={classNames(
      `w-full flex justify-center items-center mb-2
        disabled:opacity-50 text-white bg-[#191B1F]  
        rounded-xl leading-none p-5 text-md  font-semibold`
    )}
    onClick={() => setIsWalletModalOpen(true)}
  >
    <ChameleonText className="pb-0.5">Connect wallet</ChameleonText>
  </button>
);

export const ConnectWalletGuard = ({
  append = true,
  children,
}: {
  append?: boolean;
  children?: ReactNode;
}) => {
  const { connected, publicKey, setIsWalletModalOpen } = useWalletPassThrough();

  const isConnected = useMemo(
    () => Boolean(connected) && publicKey !== null,
    [connected, publicKey]
  );
  const address = useMemo(
    () => (isConnected ? publicKey?.toBase58() : undefined),
    [publicKey, isConnected]
  );

  if (!isConnected || !address) {
    return !append ? (
      <ConnectButton setIsWalletModalOpen={setIsWalletModalOpen} />
    ) : (
      <>
        {children}
        <ConnectButton setIsWalletModalOpen={setIsWalletModalOpen} />
      </>
    );
  }

  return <div>{children}</div>;
};
