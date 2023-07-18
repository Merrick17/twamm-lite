import type { FC } from 'react';
import { useMemo, useState, useRef, useEffect } from 'react';

import useWalletPassThrough from 'src/contexts/wallet-passthrough-context';
import WalletBadge from 'src/atoms/wallet-badge';

const WalletButton: FC<{ setIsWalletModalOpen(toggle: boolean): void }> = ({
  setIsWalletModalOpen,
}) => {
  const { publicKey, wallet, connected, connecting, disconnect } =
    useWalletPassThrough();

  const [active, setActive] = useState(false);
  const ref = useRef<HTMLUListElement>(null);
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const { passThroughWallet } = window.Twamm;

  const handleDisconnect = () => {
    setActive(false);
    disconnect();
  };

  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      setActive(false);
    };
    document.addEventListener('mouseup', listener);
    return () => {
      document.removeEventListener('mouseup', listener);
    };
  }, [ref]);

  if ((!connected && !connecting) || !base58) {
    return (
      <button
        type="button"
        className="py-2 px-3 h-7 flex items-center rounded-2xl text-xs bg-[#191B1F] text-white"
        onClick={() => setIsWalletModalOpen(true)}
      >
        {connecting ? (
          <span>
            <span>Connecting...</span>
          </span>
        ) : (
          <span>
            <span>Connect Wallet</span>
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="cursor-pointer relative">
      <div onClick={() => setActive(!active)}>
        <WalletBadge wallet={wallet} publicKey={publicKey} />
      </div>

      {Boolean(passThroughWallet) === false ? (
        <ul
          aria-label="dropdown-list"
          className={
            active
              ? 'absolute block top-8 right-0 text-sm bg-black rounded-lg p-2 text-white'
              : 'hidden'
          }
          ref={ref}
          role="menu"
        >
          <li onClick={handleDisconnect} role="menuitem">
            <span>Disconnect</span>
          </li>
        </ul>
      ) : null}
    </div>
  );
};

export default WalletButton;
