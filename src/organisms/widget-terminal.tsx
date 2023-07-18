import { useState, useEffect } from "react";
import { Wallet } from "@solana/wallet-adapter-react";
import classNames from "classnames";

import { FormProps, WidgetSize, WidgetPosition } from "src/types";
import { useDebouncedEffect } from "src/utils";
import LeftArrowIcon from "src/icons/left-arrow-icon";
import TwammButton from "src/atoms/twamm-button";

export default function WidgetTerminal(props: {
  rpcUrl: string;
  fakeWallet: Wallet | null;
  formProps: FormProps;
}) {
  const { rpcUrl, fakeWallet, formProps } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  const [position, setPosition] = useState<WidgetPosition>("bottom-right");
  const [size, setSize] = useState<WidgetSize>("default");

  const launchTerminal = () => {
    window.Twamm.init({
      displayMode: "widget",
      widgetStyle: {
        position,
        size,
      },
      formProps,
      passThroughWallet: fakeWallet,
      endpoint: rpcUrl,
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
    [isLoaded, props, position, size],
    1000
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex mt-9 px-2 md:px-0">
        <div>
          <div className="relative mt-8 md:mt-0">
            <div className="bg-white/10 rounded-xl flex items-center justify-center w-full md:w-[384px] h-[216px]">
              <span className="text-xs text-white/50 text-center w-[70%]">
                Click on the arrows to see how the twamm widget will appear on
                your web browser.
                <br />
                Click on the logo to view the twamm swap modal.
              </span>
              <div
                className={classNames(
                  "absolute left-1 top-1 cursor-pointer hover:bg-black/20 rounded-full p-1",
                  {
                    "jup-gradient": position === "top-left",
                  }
                )}
                onClick={() => setPosition("top-left")}
              >
                <div className="rotate-45">
                  <LeftArrowIcon width={24} height={24} />
                </div>
              </div>
              <div
                className={classNames(
                  "absolute right-1 top-1 cursor-pointer hover:bg-black/20 rounded-full p-1",
                  {
                    "jup-gradient": position === "top-right",
                  }
                )}
                onClick={() => setPosition("top-right")}
              >
                <div className="rotate-[135deg]">
                  <LeftArrowIcon width={24} height={24} />
                </div>
              </div>
              <div
                className={classNames(
                  "absolute left-1 bottom-1 cursor-pointer hover:bg-black/20 rounded-full p-1",
                  {
                    "jup-gradient": position === "bottom-left",
                  }
                )}
                onClick={() => setPosition("bottom-left")}
              >
                <div className="-rotate-45">
                  <LeftArrowIcon width={24} height={24} />
                </div>
              </div>
              <div
                className={classNames(
                  "absolute right-1 bottom-1 cursor-pointer hover:bg-black/20 rounded-full p-1",
                  {
                    "jup-gradient": position === "bottom-right",
                  }
                )}
                onClick={() => setPosition("bottom-right")}
              >
                <div className="rotate-[225deg]">
                  <LeftArrowIcon width={24} height={24} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Set Size</span>

            <div className="space-x-2 p-1.5 mt-2 bg-black/30 rounded-xl">
              <TwammButton
                size="sm"
                onClick={() => {
                  setSize("sm");
                }}
                type="button"
                className={
                  size === "sm" ? "bg-white/10" : "opacity-20 hover:opacity-70"
                }
              >
                <div className="flex items-center space-x-2 text-xs">
                  <div>Small</div>
                </div>
              </TwammButton>
              <TwammButton
                size="sm"
                onClick={() => {
                  setSize("default");
                }}
                type="button"
                className={
                  size === "default"
                    ? "bg-white/10"
                    : "opacity-20 hover:opacity-70"
                }
              >
                <div className="flex items-center space-x-2 text-xs">
                  <div>Default</div>
                </div>
              </TwammButton>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 py-4">
        <div className="border-b border-white/10" />
      </div>
    </div>
  );
}
