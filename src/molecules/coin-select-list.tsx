import M from 'easy-maybe/lib';
import Link from 'next/link';
import { useMemo, createRef } from 'react';
import type { MouseEvent } from 'react';
import type { ListChildComponentProps } from 'react-window';
import { PublicKey } from '@solana/web3.js';
import { FixedSizeList } from 'react-window';
import classNames from 'classnames';
import AutoSizer from 'react-virtualized-auto-sizer';

import TokenIcon from 'src/icons/token-icon';
import ExternalIcon from 'src/icons/external-icon';
import { shortenAddress, formatNumber } from 'src/utils';
import { add, keepPrevious, refreshEach } from 'src/swr-options';
import useBalance from 'src/hooks/use-balance';

export interface CoinSelectProps {
  data: Record<
    string,
    { symbol: string; image: string; name: string; address: string }
  >;
  filterValue?: string;
  publicKey: PublicKey | null;
  onClick: (arg0: MouseEvent, arg1: string) => void;
}

export interface CoinBalanceProps {
  address: string;
  publicKey: PublicKey | null;
}

export const CoinBalance = ({ address, publicKey }: CoinBalanceProps) => {
  const balance = useBalance(address, add([keepPrevious(), refreshEach()]));

  const displayBalance = M.withDefault<number>(0, M.of(balance.data));

  if (!publicKey) {
    return <span translate="no">{formatNumber.format(0, 6)}</span>;
  }

  return <span translate="no">{formatNumber.format(displayBalance, 6)}</span>;
};

export default ({
  data,
  filterValue,
  publicKey,
  onClick = () => {},
}: CoinSelectProps) => {
  const coins = useMemo(() => data, [data]);
  const listRef = createRef<FixedSizeList>();
  const coinRecords = useMemo(() => {
    const values = Object.values(coins);

    if (!filterValue) return values;

    return values.filter((coin) => {
      const name = coin.name.toLowerCase();
      const symbol = coin.symbol.toLowerCase();
      return (
        name.startsWith(filterValue) ||
        name.includes(filterValue) ||
        symbol.startsWith(filterValue)
      );
    });
  }, [coins, filterValue]);

  return (
    <div className="mt-2" style={{ flexGrow: 1 }}>
      {coinRecords.length > 0 && (
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              ref={listRef}
              height={height}
              itemCount={coinRecords.length}
              itemSize={72}
              width={width - 2}
              overscanCount={5}
              className={classNames(
                'overflow-y-scroll mr-1 min-h-[12rem] px-5 webkit-scrollbar'
              )}
            >
              {({ index, style }: ListChildComponentProps) => (
                <li
                  className="cursor-pointer list-none"
                  key={index}
                  style={{
                    maxHeight: 72,
                    height: 72,
                    ...style,
                  }}
                  translate="no"
                >
                  <div
                    className="flex items-center rounded-xl space-x-4 my-2 p-3 justify-between bg-[#E5E7EB] hover:bg-black/10"
                    onClick={(e: MouseEvent) =>
                      onClick(e, coinRecords[index].symbol)
                    }
                  >
                    <div className="flex-shrink-0">
                      <div className="h-6 w-6 rounded-full">
                        <TokenIcon
                          alt={coinRecords[index].symbol}
                          src={coinRecords[index].image}
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-row space-x-2">
                        <p className="text-sm text-black truncate">
                          {coinRecords[index].symbol}
                        </p>
                        <Link
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center bg-black/25 text-black/75 px-2 py-0.5 space-x-1 rounded cursor-pointer"
                          href={`https://explorer.solana.com/address/${coinRecords[index].address}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="text-xxs">
                            {shortenAddress(coinRecords[index].address)}
                          </div>
                          <ExternalIcon />
                        </Link>
                      </div>
                      <div className="mt-1 text-xs text-gray-500 truncate flex space-x-1">
                        <CoinBalance
                          address={coinRecords[index].address}
                          publicKey={publicKey}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      )}

      {coinRecords.length === 0 && (
        <div className="mt-4 mb-4 text-center text-white/50">
          <span>No tokens found</span>
        </div>
      )}
    </div>
  );
};
