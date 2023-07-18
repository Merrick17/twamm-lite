import { PublicKey } from "@solana/web3.js";
import { Wallet } from "@solana/wallet-adapter-react";

import { shortenAddress } from "src/utils";

export default function WalletBadge({
  wallet,
  publicKey,
}: {
  wallet: Wallet | null;
  publicKey: PublicKey | null;
}) {
  if (!wallet || !publicKey) {
    return null;
  }

  return (
    <div className="flex items-center bg-[#191B1F] py-2 px-3 rounded-2xl h-7">
      <div className="relative w-4 h-4 rounded-full bg-[#191B1F] flex justify-center items-center">
        <img
          src={wallet?.adapter?.icon}
          alt="Wallet logo"
          width={18}
          height={18}
        />
      </div>

      <div className="ml-2">
        <div className="text-xs text-white">
          {shortenAddress(`${publicKey}`)}
        </div>
      </div>
    </div>
  );
}
