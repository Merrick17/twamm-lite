import useSWR from 'swr';

import CloseIcon from 'src/icons/close-icon';
import api from 'src/api';

import { add, keepPrevious, refreshEach } from 'src/swr-options';
import useOrderRecords from 'src/hooks/use-order-records';
import ChameleonText from 'src/atoms/chameleon-text';
import AccountOrdersList from './account-orders-list';

const REFRESH_INTERVAL = 10000;

const fetcher = async (url: string) => fetch(url).then((res) => res.json());

export default ({ closeModal }: { closeModal: () => void }) => {
  const { data, isLoading } = useSWR(api.tokenList, fetcher);

  const orders = useOrderRecords(
    undefined,
    add([keepPrevious(), refreshEach(REFRESH_INTERVAL)])
  );

  return (
    <div className="relative max-w-5xl w-full rounded-xl flex flex-col bg-twamm-bg py-2 max-h-[98%] min-h-[650px]">
      <div className="flex justify-between items-center p-4">
        <p className="text-xl ">Orders</p>
        <div
          className="text-black fill-current cursor-pointer"
          onClick={closeModal}
        >
          <CloseIcon width={16} height={16} />
        </div>
      </div>

      <div className="px-4 py-2 overflow-auto  max-h-fit">
        <AccountOrdersList
          tokenList={data}
          isLoading={isLoading}
          data={orders.data}
          error={orders.error}
          loading={orders.isLoading}
          updating={orders.isValidating}
          updatingInterval={REFRESH_INTERVAL}
        />
      </div>
    </div>
  );
};
