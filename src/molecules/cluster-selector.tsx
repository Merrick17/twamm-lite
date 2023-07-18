import type { ChangeEvent } from 'react';
import { useCallback, useState } from 'react';

import ClusterUtils from 'src/domain/cluster';
import type * as TCluster from 'src/domain/cluster.d';
import { useSnackbar } from 'src/contexts/notification-context';
import SettingButton from 'src/atoms/setting-button';
import ChameleonText from 'src/atoms/chameleon-text';

const clusterChangeAlert = (isError: boolean | undefined, moniker: string) => {
  const msg = !isError
    ? `Cluster changed to "${moniker}"`
    : 'Address should be a proper URL';
  const variant: any = !isError
    ? { variant: 'success', autoHideDuration: 1e3 }
    : { variant: 'error', autoHideDuration: 2e3 };

  return { msg, variant };
};

interface ClusterProps {
  endpoint: string;
  moniker: string;
  name: string;
}

export default ({
  closeModal,
  cluster,
  clusters,
  presets,
  setCluster,
}: {
  clusters: TCluster.ClusterInfo[];
  cluster: ClusterProps;
  presets: any;
  setCluster: (cluster: TCluster.ClusterInfo | TCluster.Moniker) => boolean;
  closeModal: () => void;
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [clusterMoniker, setClusterMoniker] = useState(cluster.moniker);

  const [customEndpoint, setCustomEndpoint] = useState<string>(
    localStorage.getItem('twammClusterEndpoint') || ''
  );

  const clusterUtils = ClusterUtils(presets.solana);

  const isCustomSelected = clusterMoniker === presets.custom.moniker;

  const onSaveCustomEndpoint = useCallback(async () => {
    const customCluster = {
      endpoint: customEndpoint,
      name: presets.custom.name,
      moniker: presets.custom.moniker,
    };

    const isError = setCluster(customCluster);

    const { msg, variant } = clusterChangeAlert(isError, customCluster.moniker);
    enqueueSnackbar(msg, variant);

    if (!isError && closeModal) closeModal();
  }, [
    customEndpoint,
    presets.custom.name,
    presets.custom.moniker,
    setCluster,
    enqueueSnackbar,
    closeModal,
  ]);

  const handleCustomeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event?.target as { value: string };
    setCustomEndpoint(value);
  };

  const onSavePresetEndpoint = useCallback(
    ({ endpoint }: { endpoint: TCluster.Moniker }) => {
      const isError = setCluster(endpoint);

      const { msg, variant } = clusterChangeAlert(isError, endpoint);
      enqueueSnackbar(msg, variant);

      if (!isError && closeModal) closeModal();
    },
    [enqueueSnackbar, closeModal, setCluster]
  );

  const onClusterChange = useCallback(
    (moniker: TCluster.Moniker) => {
      setClusterMoniker(moniker);

      if (!clusterUtils.isCustomMoniker(moniker)) {
        onSavePresetEndpoint({ endpoint: moniker });
      }
    },
    [clusterUtils, onSavePresetEndpoint]
  );

  return (
    <>
      <div className="flex items-center mt-2.5 rounded-xl ring-1 ring-white/5 overflow-hidden">
        {clusters.map((item, idx) => (
          <SettingButton
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            idx={idx}
            itemsCount={clusters.length}
            highlighted={clusterMoniker === item.moniker}
            onClick={() => onClusterChange(item.moniker)}
          >
            <div>
              <p className="text-sm text-black/70">{item.name}</p>
            </div>
          </SettingButton>
        ))}
      </div>

      {isCustomSelected && (
        <form onSubmit={onSaveCustomEndpoint}>
          <div className="flex items-center gap-x-2 my-2">
            <input
              type="text"
              name="endpoint"
              // value={customEndpoint}
              onChange={handleCustomeInput}
              className="w-full rounded-md px-2 py-2 truncate bg-[#212128] text-black/50 placeholder:text-black/40 text-sm"
              placeholder="RPC endpoint"
            />
            <button
              type="submit"
              className="flex justify-center items-center 
                    disabled:opacity-50 text-black bg-[#191B1F]  
                    rounded-md leading-none p-2.5 text-sm  font-semibold"
            >
              <ChameleonText className="pb-0.5">Switch</ChameleonText>
            </button>
          </div>
        </form>
      )}
    </>
  );
};
