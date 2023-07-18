import Link from "next/link";
import M, { Extra } from "easy-maybe/lib";
import type { FC } from "react";
import { useEffect, useRef, useCallback, useState } from "react";

import LPLogo from "src/icons/lp-logo";
import SettingIcon from "src/icons/setting-icon";
import TransactionRunnerModal from "src/molecules/transaction-runner-modal";
import useTxRunner from "src/contexts/transaction-runner-context";
import UniversalPopover, { Ref } from "src/molecules/universal-popover";
import WalletButton from "./wallet-button";
import TransactionProgress from "./transaction-progress";
import AccountOrders from "./account-orders";

const Header: FC<{
  setIsWalletModalOpen(toggle: boolean): void;
  setIsOpenSetting(toggle: boolean): void;
}> = ({ setIsWalletModalOpen, setIsOpenSetting }) => {
  const runnerRef = useRef<Ref>();
  const { active } = useTxRunner();

  const [isOpenOrders, setIsOpenOrders] = useState<boolean>(false);

  useEffect(() => {
    M.andMap(([runner]) => {
      if (!runner.isOpened) runner.open();
    }, Extra.combine2([M.of(runnerRef.current), M.of(!active && undefined)]));

    return () => {};
  }, [active, runnerRef]);

  const onTxStatusToggle = useCallback((flag: boolean) => {
    if (flag) runnerRef.current?.open();
    else runnerRef.current?.close();
  }, []);

  return (
    <>
      <UniversalPopover ref={runnerRef} arrow={false} universal>
        <TransactionRunnerModal />
      </UniversalPopover>

      {isOpenOrders ? (
        <div className="fixed h-screen w-screen top-0 left-0 flex justify-center items-center overflow-hidden bg-black/50 z-50 px-2 md:px-0">
          <AccountOrders closeModal={() => setIsOpenOrders(false)} />
        </div>
      ) : null}

      <div className="mt-2 h-7 pl-3 pr-2">
        <div className="w-full flex items-center justify-between">
          <Link
            href="https://www.twap.so/"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center space-x-2"
          >
            <LPLogo width={24} height={24} />
          </Link>

          <div className="flex space-x-1 items-center">
            <TransactionProgress setOpen={() => onTxStatusToggle(true)} />
            <button
              type="button"
              className="p-2 h-7 w-7 flex items-center justify-center border rounded-full border-white/10 bg-black/10 text-white/30 fill-current"
              onClick={() => setIsOpenSetting(true)}
            >
              <SettingIcon height={16} width={16} />
            </button>
            <button
              type="button"
              className="py-2 px-3 h-7 flex items-center rounded-2xl text-xs bg-[#191B1F] text-white"
              onClick={() => setIsOpenOrders(true)}
            >
              Orders
            </button>

            <WalletButton setIsWalletModalOpen={setIsWalletModalOpen} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
