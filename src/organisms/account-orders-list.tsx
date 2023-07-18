import M from "easy-maybe/lib";
import { useCallback, useMemo, useRef, useState } from "react";

import UniversalPopover, { Ref } from "src/molecules/universal-popover";
import Loading from "src/atoms/loading";
import CancelOrderModal from "src/molecules/cancel-order-modal";
import OrderDetailsModal from "./account-order-details-modal";
import type {
  CancelOrderData,
  OrderData,
  OrderDetails,
  OrderRecord,
} from "../types/decl.d";
import RowColumnList, {
  ColDef,
  RowParams,
  SelectionModel,
  SortModel,
} from "./row-column-list";
import {
  columns,
  populateDetails,
  populateRow,
} from "./account-orders-list.helpers";
import useCancelOrder from "../hooks/use-cancel-order";

const initialSortModel: SortModel = [{ field: "orderTime", sort: "asc" }];

export default (props: {
  data?: OrderData[];
  error?: Error;
  loading: boolean;
  updating: boolean;
  updatingInterval: number;
  tokenList: object;
  isLoading: boolean;
}) => {
  const data = M.withDefault([], M.of(props.data));

  const detailsRef = useRef<Ref>();
  const [accounts, setAccounts] = useState<CancelOrderData | undefined>();
  const [details, setDetails] = useState<OrderDetails>();
  const [selectionModel, setSelectionModel] = useState<SelectionModel>([]);
  const [orderState, setOrderState] = useState<
    "details" | "cancel" | undefined
  >();

  const { execute } = useCancelOrder();

  const cols = useMemo<ColDef[]>(() => columns(), []);
  const rows = useMemo<OrderRecord[]>(() => data.map(populateRow), [data]);

  const [sortModel, setSortModel] = useState<SortModel>(initialSortModel);

  const onCancelOrder = useCallback(
    async (cd: CancelOrderData) => {
      const { a, b, inactive, expired, orderAddress, poolAddress, supply } = cd;

      if (inactive || expired) {
        const amount = supply.toNumber();

        setOrderState(undefined);
        detailsRef.current?.close();
        await execute({ a, b, orderAddress, poolAddress, amount });
      } else {
        setAccounts(cd);
        setOrderState("cancel");
      }
    },
    [execute, setAccounts]
  );

  const onRowClick = useCallback(
    (params: RowParams<OrderRecord>) => {
      setDetails(populateDetails(params));
      setOrderState("details");
      detailsRef.current?.open();
    },
    [setDetails, setOrderState]
  );

  const onDetailsClose = useCallback(() => {
    setDetails(undefined);
  }, []);

  const onApproveCancel = useCallback(
    async (cd: CancelOrderData) => {
      const { a, b, orderAddress, poolAddress, supply } = cd;
      const amount = supply.toNumber();

      detailsRef.current?.close();
      setOrderState(undefined);
      await execute({ a, b, orderAddress, poolAddress, amount });
    },
    [execute]
  );

  const onSelectionModelChange = useCallback(
    (nextSelectionModel: SelectionModel) => {
      setSelectionModel(nextSelectionModel);
    },
    [setSelectionModel]
  );

  return (
    <>
      <UniversalPopover onClose={onDetailsClose} ref={detailsRef} arrow={false}>
        {!orderState && <Loading height={8} width={8} />}
        {orderState === "cancel" && details && (
          <CancelOrderModal
            data={accounts}
            detailsData={details}
            onApprove={onApproveCancel}
          />
        )}
        {orderState === "details" && details && (
          <OrderDetailsModal
            filledQuantity={details.filledQuantity}
            onCancel={onCancelOrder}
            order={details.order}
            poolAddress={details.poolAddress}
            quantity={details.quantity}
            side={details.side}
            supply={details.supply}
            timeInForce={details.timeInForce}
            data={props.tokenList}
            isLoading={props.isLoading}
          />
        )}
      </UniversalPopover>
      <div className="w-full h-full flex justify-center">
        <RowColumnList
          checkboxSelection={false}
          columns={cols}
          error={props.error}
          loading={props.loading}
          onRowClick={onRowClick}
          onSelectionModelChange={onSelectionModelChange}
          onSortModelChange={(newSortModel: SortModel) =>
            setSortModel(() => {
              if (!newSortModel.length) return initialSortModel;

              const [defaultField] = initialSortModel;
              const map = new Map([]);
              newSortModel.forEach((model) => {
                map.set(model.field, model);
              });
              if (!map.get(defaultField.field))
                map.set(defaultField.field, defaultField);

              return [...map.values()] as SortModel;
            })
          }
          rows={rows}
          selectionModel={selectionModel}
          sortModel={sortModel}
          updating={props.updating}
          updatingInterval={props.updatingInterval}
        />
      </div>
    </>
  );
};
