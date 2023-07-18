import classNames from "classnames";

import { ConnectWalletGuard } from "src/organisms/wallet-guard";
import Loading from "src/atoms/loading";
import ChameleonText from "src/atoms/chameleon-text";

export interface Props {
  disabled: boolean;
  form?: string;
  loading?: boolean;
  onClick?: () => void;
  text?: string;
}

export default ({ disabled, form, loading = false, onClick, text }: Props) => (
  <ConnectWalletGuard append={false}>
    <button
      form={form}
      disabled={disabled}
      onClick={onClick}
      type="submit"
      className={classNames(
        `w-full flex justify-center items-center mb-2
        disabled:opacity-50 text-white bg-[#191B1F]  
        rounded-xl leading-none p-5 text-md font-semibold`,
        disabled ? "opacity-50 cursor-not-allowed" : ""
      )}
    >
      <div className="w-40 flex flex-row justify-center items-center">
        <ChameleonText className="pb-0.5 flex-shrink-0">{text}</ChameleonText>
        {loading ? <Loading top={0} height={6} width={6} /> : undefined}
      </div>
    </button>
  </ConnectWalletGuard>
);
