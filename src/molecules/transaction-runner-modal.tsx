import { useMemo } from "react";

import useTxRunner from "src/contexts/transaction-runner-context";
import * as TxState from "src/atoms/transaction-runner";

type AnchorError = Error & { logs?: string[] };

const Content = ({
  hasError,
  info,
  isFinished,
  isLoading,
  isReady,
  signature,
  viewExplorer,
}: {
  info: string | undefined;
  isReady: boolean;
  isLoading: boolean;
  isFinished: boolean;
  hasError: AnchorError | undefined;
  signature: string | undefined;
  viewExplorer: (sig: string) => string;
}) => {
  if (isLoading) return <TxState.Progress info={info} />;

  if (hasError) {
    return <TxState.Error error={hasError} logs={hasError.logs} />;
  }

  if (isFinished)
    return (
      <TxState.Success signature={signature as string} view={viewExplorer} />
    );

  if (isReady) return <TxState.Empty />;

  return <TxState.Empty />;
};

export default () => {
  const { active, error, info, signature, viewExplorer } = useTxRunner();

  const state = useMemo(
    () => ({
      hasError: error,
      info,
      isFinished: Boolean(signature),
      isLoading: !error && active && !signature,
      isReady: !error && !active && !signature,
    }),
    [active, error, info, signature]
  );

  return (
    <Content
      hasError={state.hasError}
      info={state.info}
      isReady={state.isReady}
      isLoading={state.isLoading}
      isFinished={state.isFinished}
      signature={signature}
      viewExplorer={viewExplorer}
    />
  );
};
