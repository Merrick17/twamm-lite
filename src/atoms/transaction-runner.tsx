import i18n from 'src/i18n/en.json';
import EmptyIcon from 'src/icons/empty-icon';
import Loading from 'src/atoms/loading';
import DoneIcon from 'src/icons/done-icon';
import ErrorIcon from 'src/icons/error-icon';
import ChameleonText from 'src/atoms/chameleon-text';
import Link from 'next/link';
import LogViewer from 'src/organisms/log-viewer';

const extractErrorMessage = (message: string) => {
  const msgAnchor = 'Error Message:';
  const simulAnchor = 'simulation failed:';

  let msgArr;
  if (message.includes(msgAnchor)) {
    msgArr = message.split(msgAnchor);
  } else if (message.includes(simulAnchor)) {
    msgArr = message.split(simulAnchor);
  }

  if (msgArr && msgArr.length > 1) return msgArr[1].trim();

  return message;
};

export const Empty = () => (
  <div className="flex items-center justify-center flex-col gap-y-3">
    <div className="h-14 w-14 flex items-center justify-center border rounded-full border-black/10 bg-black/10 text-black/30 fill-current">
      <EmptyIcon height={28} width={28} />
    </div>
    <p className="text-lg px-4 pb-2 md:px-0">{i18n.TxRunnerIdle}</p>

    <p className="font-medium text-sm text-black/70">
      {i18n.TxRunnerIdleDescription}
    </p>
  </div>
);

export const Progress = ({ info }: { info: string | undefined }) => (
  <div className="flex items-center justify-center flex-col gap-y-3">
    <Loading height={8} width={8} />
    <ChameleonText className="text-lg px-4 pb-2 md:px-0">
      {i18n.TxRunnerProgress}
    </ChameleonText>

    <p className="font-medium text-sm text-black/70">
      {info || i18n.TxRunnerProgressDescription}
    </p>
  </div>
);

export const Success = ({
  signature,
  view,
}: {
  signature: string;
  view: (sig: string) => string;
}) => (
  <div className="flex items-center justify-center flex-col gap-y-3">
    <DoneIcon height={45} width={45} />

    <ChameleonText className="text-lg font-semibold px-4 pb-2 md:px-0">
      {i18n.TxRunnerSuccess}
    </ChameleonText>

    <p className="font-medium text-sm text-black/70">
      {i18n.TxRunnerSuccessDescription}
    </p>

    <span className="font-medium text-sm text-black/70">
      <Link
        rel="noopener"
        target="_blank"
        href={view(signature)}
        className="underline"
      >
        {i18n.TxRunnerTransactionDetails}
      </Link>
    </span>
  </div>
);

export const Error = ({ error, logs }: { error: Error; logs?: string[] }) => (
  <div className="flex items-center justify-center flex-col gap-y-3">
    <ErrorIcon height={28} width={28} />

    {error && (
      <ChameleonText className="text-lg font-semibold text-center">
        {extractErrorMessage(error.message)}
      </ChameleonText>
    )}
    <LogViewer logs={logs} />
  </div>
);
