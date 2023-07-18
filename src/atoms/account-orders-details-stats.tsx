import { useMemo } from "react";

import type { PoolDetails } from "src/types/decl.d";
import i18n from "src/i18n/en.json";
import { formatInterval } from "src/utils/index";
import StatsCards from "./account-orders-details-stats-cards";
import { format } from "./account-orders-details-stats.helpers";

export default ({
  details,
  quantity,
  filledQuantity,
  timeInForce,
}: {
  details: PoolDetails;
  quantity: number;
  filledQuantity: number;
  timeInForce: number;
}) => {
  const fields = useMemo(
    () => [
      {
        name: i18n.OrderDetailsTimeFrame,
        data: formatInterval(timeInForce),
      },
      {
        name: i18n.OrderDetailsCompletionRate,
        data: (() => {
          const progress = (filledQuantity / quantity) * 100;

          return `${progress >= 99 ? 100 : Math.ceil(progress)}%`;
        })(),
      },
      {
        name: i18n.OrderDetailsFilledQuantity,
        data: String(filledQuantity),
      },
      {
        name: i18n.OrderDetailsQuantity,
        data: String(quantity),
      },
      {
        name: i18n.OrderDetailsPoolExpiration,
        data: format.expirationTime(details),
      },
      {
        name: i18n.OrderDetailsTotalAssets,
        data: format.totalAssets(details),
      },
      {
        name: i18n.OrderDetailsPrices,
        data: format.prices(details),
      },
      {
        name: i18n.OrderDetailsUserAveragePrice,
        data: format.userAveragePrice(details),
      },
      {
        name: i18n.OrderDetailsPoolInception,
        data: format.inceptionTime(details),
      },
      {
        name: i18n.OrderDetailsLastUpdated,
        data: format.lastBalanceChangeTime(details),
      },
    ],
    [details, filledQuantity, quantity, timeInForce]
  );

  return (
    <div className="p-2">
      <StatsCards fields={fields} />
    </div>
  );
};
