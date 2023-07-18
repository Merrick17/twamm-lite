import { useEffect, useMemo } from "react";

import useTxRunner from "src/contexts/transaction-runner-context";
import { useSnackbar } from "src/contexts/notification-context";
import CancelIcon from "src/icons/cancel-icon";
import DoneIcon from "src/icons/done-icon";
import RefreshIcon from "src/icons/refresh-Icon";
import UpdateIcon from "src/icons/update-icon";

export interface Props {
  setOpen: (arg0: boolean) => void;
}

export default ({ setOpen }: Props) => {
  const { active, error, signature } = useTxRunner();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (active) {
      enqueueSnackbar("Transaction is in progress...", {
        variant: "info",
        autoHideDuration: 1e3,
      });
    }
    return () => {};
  }, [active, enqueueSnackbar]);

  const txStateIcon = useMemo(() => {
    if (error) return <CancelIcon height={18} width={18} />;
    if (signature) return <DoneIcon height={16} width={16} />;
    if (active) return <RefreshIcon height={16} width={16} />;
    return <UpdateIcon height={16} width={16} />;
  }, [active, error, signature]);

  return (
    <button
      type="button"
      className="p-2 h-7 w-7 flex items-center justify-center  border rounded-full border-white/10 bg-black/10 text-white/30 fill-current"
      onClick={() => setOpen(true)}
    >
      {txStateIcon}
    </button>
  );
};
