import M, { Extra } from "easy-maybe/lib";
import { BN } from "@project-serum/anchor";
import { useCallback, useState } from "react";

import type { CancelOrderData, OrderDetails } from "src/types/decl.d";
import i18n from "src/i18n/en.json";
import Loading from "src/atoms/loading";
import useJupTokensByMint from "src/hooks/use-jup-tokens-by-mint";
import usePoolDetails from "src/hooks/use-pool-details";
import CancelOrderDetails from "./cancel-order-details";
import CancelOrderAmount from "./cancel-order-amount";

export default ({
  data,
  detailsData,
  onApprove,
}: {
  data?: CancelOrderData;
  detailsData: OrderDetails;
  onApprove: (arg0: CancelOrderData) => void;
}) => {
  const [percentage, setPercentage] = useState<number>(100);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);

  const order = M.of(data);

  const tokens = useJupTokensByMint(
    M.withDefault(
      undefined,
      M.andMap(({ a, b }) => [a, b], order)
    )
  );

  const details = usePoolDetails(detailsData.poolAddress, detailsData.order);

  const onAmountChange = useCallback((value: number) => {
    setPercentage(value);
  }, []);

  const onCancel = useCallback(() => {
    M.tap((cd) => {
      const { supply } = cd;
      const cancellableAmount = (supply.toNumber() * percentage) / 100;

      onApprove({
        ...cd,
        supply: new BN(cancellableAmount),
      });
    }, order);
  }, [onApprove, order, percentage]);

  const onToggleDetails = useCallback(() => {
    setDetailsOpen((prev) => !prev);
  }, [setDetailsOpen]);

  return (
    <div className="w-full">
      <div className="flex justify-center text-center">
        <h4 className="text-white/80 font-semibold text-lg pt-3 pb-2">
          {i18n.OrderFlowCancelTitle}
        </h4>
        {Extra.isNothing(order) && <Loading height={8} width={8} />}
      </div>
      <div className="w-full">
        {Extra.isJust(order) && (
          <>
            <div className="p-2">
              <CancelOrderAmount
                percentage={percentage}
                onChange={onAmountChange}
                onToggleDetails={onToggleDetails}
              />
            </div>
            {detailsOpen && (
              <CancelOrderDetails
                data={tokens.data}
                details={details.data}
                onToggle={onToggleDetails}
                percentage={percentage}
              />
            )}
            <div className="w-full p-2">
              <button
                type="button"
                disabled={!percentage}
                className="w-full capitalize flex justify-center border border-blue-200 py-2 rounded-md text-white/70 text-sm cursor-pointer"
                onClick={onCancel}
              >
                {i18n.OrderFlowCancelControl}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
