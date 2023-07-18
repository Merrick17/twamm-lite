import { useEffect, useState } from 'react';
import { Wallet } from '@solana/wallet-adapter-react';

import { FormProps } from 'src/types';
import { useDebouncedEffect } from 'src/utils';

export default function IntegratedTerminal({
  rpcUrl,
  fakeWallet,
  formProps,
}: {
  rpcUrl: string;
  fakeWallet: Wallet | null;
  formProps: FormProps;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  const launchTerminal = async () => {
    window.Twamm.init({
      endpoint: rpcUrl,
      displayMode: 'integrated',
      integratedTargetId: 'integrated-terminal',
      formProps,
      passThroughWallet: fakeWallet,
    });
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (!isLoaded || !window.Twamm.init) {
      intervalId = setInterval(() => {
        setIsLoaded(Boolean(window.Twamm.init));
      }, 500);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDebouncedEffect(
    () => {
      if (isLoaded && Boolean(window.Twamm.init)) {
        launchTerminal();
      }
    },
    [isLoaded, formProps, fakeWallet],
    200
  );

  return (
    <div className="h-[650px] w-full rounded-2xl text-white flex flex-col items-center p-2 lg:p-4 mb-4 overflow-hidden mt-9">
      <div className="flex flex-col lg:flex-row h-full w-full overflow-auto">
        <div className="w-full h-full rounded-xl overflow-hidden flex justify-center">
          {!isLoaded ? (
            <div className="h-full w-full animate-pulse bg-white/10 mt-4 lg:mt-0 lg:ml-4 flex items-center justify-center rounded-xl">
              <p className="">Loading...</p>
            </div>
          ) : null}

          <div
            id="integrated-terminal"
            className={`flex h-full w-full max-w-[400px] overflow-auto justify-center bg-white rounded-xl ${
              !isLoaded ? 'hidden' : ''
            }`}
          />
        </div>
      </div>
    </div>
  );
}
