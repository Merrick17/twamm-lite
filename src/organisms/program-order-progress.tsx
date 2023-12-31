import M, { Extra } from "easy-maybe/lib";
import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useMemo, useRef } from "react";

import Button from "src/molecules/progress-button";
import i18n from "src/i18n/en.json";
import useCancelOrder from "src/hooks/use-cancel-order";
import useScheduleOrder from "src/hooks/use-schedule-order";
import { prepare4Program } from "src/domain/order";
import UniversalPopover, { Ref } from "src/molecules/universal-popover";
import SimpleCancelOrder from "src/molecules/cancel-order-simple-modal";
import Alert from "src/atoms/alert";

export default (props: {
  disabled: boolean;
  form?: string;
  onSuccess: () => void;
  params: ReturnType<typeof prepare4Program> | undefined;
  progress: boolean;
  scheduled: boolean;
  validate: () => { [key: string]: Error } | undefined;
}) => {
  const cancelRef = useRef<Ref>();
  const { execute } = useScheduleOrder();
  const { execute: executeCancel } = useCancelOrder();

  const onApproveCancel = useCallback(
    async ({ supply }: { supply: BN }) => {
      cancelRef.current?.close();

      const data = M.withDefault(
        undefined,
        M.andMap(
          ([d, s]) => ({
            a: new PublicKey(d.aMint),
            b: new PublicKey(d.bMint),
            amount: s.toNumber(),
            counters: {
              tif: d.tif,
              tifs: d.tifs,
              poolCounters: d.poolCounters,
              nextPool: d.nextPool,
            },
          }),
          Extra.combine2([M.of(props.params), M.of(supply)])
        )
      );

      if (data) await executeCancel(data);
    },
    [cancelRef, executeCancel, props.params]
  );

  const onExecuteError = useCallback(async () => {
    cancelRef.current?.open();
  }, [cancelRef]);

  const onClick = useCallback(async () => {
    if (!props.params) return;

    await execute(props.params, onExecuteError);

    props.onSuccess();
  }, [execute, onExecuteError, props]);

  const errors = useMemo(() => props.validate(), [props]);

  const isErrorsVisible = errors && Boolean(props.params);

  return (
    <>
      <UniversalPopover ref={cancelRef} arrow>
        {props.params && (
          <SimpleCancelOrder data={props.params} onClick={onApproveCancel} />
        )}
      </UniversalPopover>
      <Button
        disabled={props.disabled}
        form={props.form}
        loading={props.progress}
        onClick={onClick}
        text={
          props.scheduled
            ? i18n.OrderControlsScheduleOrder
            : i18n.OrderControlsPlaceOrder
        }
      />
      {isErrorsVisible ? (
        <div className="my-2">
          <Alert severity="error">
            <>
              {[...Object.keys(errors)].map((key) => (
                <div key={key}>{errors[key].message}</div>
              ))}
            </>
          </Alert>
        </div>
      ) : null}
    </>
  );
};
