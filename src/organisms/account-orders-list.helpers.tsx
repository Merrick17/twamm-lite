import type { PublicKey } from "@solana/web3.js";
import { filledQuantity, quantity } from "@twamm/client.js/lib/protocol";

import i18n from "src/i18n/en.json";
import { formatPrice } from "src/domain/index";
import PoolOrderTimeCell from "src/atoms/account-order-pool-order-time-cell";
import PoolTIFCell from "src/atoms/account-order-pool-tif-cell";
import PoolTIFLeftCell from "src/atoms/account-order-pool-tif-left-cell";
import TokenPairCell from "src/atoms/account-order-token-pair-cell";
import type { OrderData } from "../types/decl.d";
import type {
  ComparatorFn,
  RowParams,
  ValueGetterParams,
} from "./row-column-list";

const sortByTokenPair: ComparatorFn<PublicKey> = (a, b) => {
  const aKey = String(a);
  const bKey = String(b);

  if (aKey === bKey) return 0;
  return aKey < bKey ? -1 : 1;
};

export const populateRow = (data: OrderData) => {
  const order = {
    address: data.order,
    lpBalance: data.lpBalance,
    side: data.side,
    tokenDebt: data.tokenDebt,
  };

  const amount = quantity(data.tokenPairData, data);

  const filledAmount = filledQuantity(data.tokenPairData, data.poolData, data);

  return {
    id: data.id,
    filledQuantity: filledAmount,
    order,
    orderData: order,
    orderTime: data.time,
    pool: data.pool,
    poolData: data.poolData,
    quantity: amount,
    side: data.side,
    supply: data.lpBalance,
    tif: data.poolData.timeInForce,
    tokenPair: data.poolData.tokenPair,
  };
};

export const populateDetails = (
  data: RowParams<ReturnType<typeof populateRow>>
) => ({
  filledQuantity: data.row.filledQuantity,
  order: data.row.order, // Data,
  poolAddress: data.row.pool,
  quantity: data.row.quantity,
  side: data.row.side,
  supply: data.row.supply,
  timeInForce: data.row.tif,
});

export const columns = () => [
  {
    field: "pre",
    hideable: false,
    sortable: false,
  },
  {
    field: "tokenPair",
    headerName: i18n.OrdersColumnsPair,
    hideable: false,
    renderCell: TokenPairCell,
    sortable: false,
    sortComparator: sortByTokenPair,
  },
  {
    field: "tif",
    headerName: i18n.OrdersColumnsTimeFrame,
    hideable: true,
    renderCell: PoolTIFCell,
    resizable: false,
    sortable: true,
  },
  {
    field: "quantity",
    headerName: i18n.OrdersColumnsQunatity,
    hideable: false,
    sortable: true,
    valueGetter: ({ row }: ValueGetterParams) =>
      formatPrice(row.quantity, false),
  },
  {
    field: "filledQuantity",
    headerName: i18n.OrdersColumnsFilledQuantity,
    hideable: false,
    sortable: true,
    valueGetter: ({ row }: ValueGetterParams) =>
      formatPrice(row.filledQuantity, false),
  },
  {
    field: "orderTime",
    headerName: i18n.OrdersColumnsOrderTime,
    hideable: true,
    renderCell: PoolOrderTimeCell,
    resizable: false,
    sortable: true,
  },
  {
    field: "timeLeft",
    headerName: i18n.OrdersColumnsExpiration,
    hideable: true,
    renderCell: PoolTIFLeftCell,
    resizable: false,
    sortable: false,
  },
];
