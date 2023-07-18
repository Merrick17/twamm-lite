import M, { Extra } from "easy-maybe/lib";
import { BN } from "@project-serum/anchor";
import { useCallback } from "react";

import i18n from "src/i18n/en.json";
import Loading from "src/atoms/loading";
import Alert from "src/atoms/alert";

export default ({
  data,
  onClick,
}: {
  data: {};
  onClick: (arg0: { supply: BN }) => void;
}) => {
  const orderData = M.of(data);

  const onCancel = useCallback(() => {
    onClick({
      supply: new BN(Number.MAX_SAFE_INTEGER),
    });
  }, [onClick]);

  return (
    <>
      <h4 className="pt-3 pb-3 text-center">{i18n.OrderFlowCancelTitle}</h4>
      {Extra.isNothing(orderData) && (
        <Loading height={20} width={20} top={10} />
      )}
      {Extra.isJust(orderData) && (
        <>
          <div className="p-2">
            <Alert severity="warning">
              <p>{i18n.Warning}</p>
              {i18n.OrderCollisionWarning}
            </Alert>
          </div>
          <div className="p-2">
            <button type="button" onClick={onCancel}>
              {i18n.OrderControlCancelConcurrentOrder}
            </button>
          </div>
        </>
      )}
    </>
  );
};
