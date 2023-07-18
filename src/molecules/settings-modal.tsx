import classNames from 'classnames';

import CloseIcon from 'src/icons/close-icon';
import TooltipInfoIcon from 'src/icons/tooltip-info-icon';
import i18n from 'src/i18n/en.json';
import Tooltip from 'src/atoms/tooltip';
import useBlockchain from 'src/contexts/solana-connection-context';
import ExplorerSelector from './explorer-selector';
import PerformanceFeeSelector from './performance-fee-selector';
import SlippageSelector from './slippage-selector';
import ClusterSelector from './cluster-selector';
import useTxRunner from '../contexts/transaction-runner-context';

const Separator = () => <div className="my-4 border-b border-white/10" />;

export default ({ closeModal }: { closeModal: () => void }) => {
  const {
    setSlippage,
    slippage,
    slippages,
    performanceFee,
    setPerformanceFee,
    performanceFees,
    explorer,
    explorers,
    setExplorer,
  } = useTxRunner();

  const { cluster, clusters, presets, setCluster } = useBlockchain();
  return (
    <div
      className={classNames(
        'w-full h-full rounded-xl flex flex-col bg-twamm-bg text-black shadow-xl'
      )}
    >
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <div className="text-md font-semibold">
          <span>{i18n.Settings}</span>
        </div>
        <div
          className="text-black fill-current cursor-pointer"
          onClick={() => closeModal()}
        >
          <CloseIcon width={14} height={14} />
        </div>
      </div>

      {/* ********* Setting section ********* */}
      <div>
        <div className={classNames('mt-2 px-5')}>
          {/* ************  Priority Fee ************ */}
          <div className="flex items-center text-sm text-black/75 font-[500]">
            <span> {i18n.SettingsSettingPerformaceFee}</span>
            <Tooltip
              variant="light"
              className="!left-24 !top-16 w-[50%]"
              content={
                <span className="flex rounded-lg text-xs text-black/75">
                  The priority fee is paid to the Solana network.
                </span>
              }
            >
              <div className="flex ml-2.5 items-center text-black-35 fill-current">
                <TooltipInfoIcon width={12} height={12} />
              </div>
            </Tooltip>
          </div>

          <PerformanceFeeSelector
            performanceFee={performanceFee}
            performanceFees={performanceFees}
            setPerformanceFee={setPerformanceFee}
          />

          <Separator />
          {/* *************************** SLIPPAGE **************************** */}
          <div className="flex items-center text-sm text-black/75 font-[500]">
            <span> {i18n.SettingsSettingSlippage}</span>
          </div>
          <SlippageSelector
            setSlippage={setSlippage}
            slippage={slippage}
            slippages={slippages}
          />

          <Separator />
          {/* *************************** Setting Explorer **************************** */}
          <div className="flex items-center text-sm text-black/75 font-[500]">
            <span>{i18n.SettingsSettingExplorer}</span>
          </div>
          <ExplorerSelector
            setExplorer={setExplorer}
            explorer={explorer}
            explorers={explorers}
          />

          <Separator />
          {/* *************************** Setting Explorer **************************** */}
          <div className="flex items-center text-sm text-black/75 font-[500]">
            <span>{i18n.SettingsSettingClusterSelector}</span>
          </div>
          <ClusterSelector
            cluster={cluster}
            clusters={clusters}
            presets={presets}
            setCluster={setCluster}
            closeModal={closeModal}
          />
        </div>
      </div>
    </div>
  );
};
