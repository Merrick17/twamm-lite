import "src/styles/globals.css";
import "tailwindcss/tailwind.css";

import { useState, useEffect } from "react";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { Wallet } from "@solana/wallet-adapter-react";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import Head from "next/head";
import Link from "next/link";

import { Init, FormConfigurator } from "src/types";
import i18n from "src/i18n/en.json";
import { ClusterApiUrl, NEXT_PUBLIC_SUPPORTED_TOKEN } from "src/env";
import ChameleonText from "src/atoms/chameleon-text";
import WidgetTerminal from "src/organisms/widget-terminal";
import ModalTerminal from "src/organisms/modal-terminal";
import IntegratedTerminal from "src/organisms/integrated-terminal";
import Configurator from "src/organisms/configurator";
import CodeSnippet from "src/organisms/code-snippet";
import Footer from "src/organisms/footer";

const isDeveloping =
  process.env.NODE_ENV === "development" && typeof window !== "undefined";

const isPreview = Boolean(true);

if ((isDeveloping || isPreview) && typeof window !== "undefined") {
  (window as any).Twamm = {};

  Promise.all([import("../library"), import("../index")]).then((res) => {
    const [libraryProps, rendererProps] = res;

    (window as any).Twamm = libraryProps;
    (window as any).TwammRenderer = rendererProps;
  });
}

export default function App() {
  const [tab, setTab] = useState<Init["displayMode"]>("integrated");

  useEffect(() => {
    if (window.Twamm._instance) {
      window.Twamm._instance = null;
    }
  }, [tab]);

  const { watch, setValue } = useForm<FormConfigurator>({
    defaultValues: {
      feeAccount: "",
      feeBps: "",
      platformFeeAccount: "",
      supportedToken: NEXT_PUBLIC_SUPPORTED_TOKEN,
      useJupiter: true,
      useWalletPassthrough: false,
    },
  });

  const watchAllFields = watch();

  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    if (!watchAllFields.useWalletPassthrough) {
      setWallet(null);
      return;
    }

    const fakeWallet: Wallet = {
      adapter: new UnsafeBurnerWalletAdapter(),
      readyState: WalletReadyState.Installed,
    };

    fakeWallet.adapter.connect().then(() => {
      setWallet(fakeWallet);
    });
  }, [watchAllFields.useWalletPassthrough]);

  return (
    <>
      <Head>
        <title>LP Finance | TWAMM Lite</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="bg-twamm-dark-bg h-screen w-screen max-w-screen overflow-x-hidden flex flex-col justify-between">
        <div>
          <div>
            <div className="flex flex-col items-center  h-full w-full mt-4 md:mt-10">
              <div className="flex flex-col justify-center items-center gap-y-5 text-center">
                <ChameleonText className="text-4xl md:text-[40px] font-semibold">
                  {i18n.Heading}
                </ChameleonText>
                <p className="text-[#9D9DA6] w-[80%] md:max-w-[60%] text-md heading-[24px]">
                  {i18n.Subtitle}
                </p>

                <Link
                  href="https://docs.lp.finance/twamm/integrate-twamm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    type="button"
                    className="shadow-2xl px-5 py-4 border border-gray-900 w-52 text-center rounded-xl bg-[#191B1F] text-white"
                  >
                    Document
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="max-w-6xl bg-black/25 mt-6 rounded-xl flex flex-col md:flex-row w-full md:p-4">
                <Configurator {...watchAllFields} setValue={setValue} />
                <div className="mt-8 md:mt-0 md:ml-4 h-full w-full bg-black/40 rounded-xl flex flex-col">
                  <div className="mt-4 flex justify-center ">
                    <button
                      onClick={() => {
                        setTab("modal");
                      }}
                      type="button"
                      className={classNames(
                        "!bg-none relative px-4 justify-center ",
                        tab === "modal" ? "" : "opacity-20 hover:opacity-70"
                      )}
                    >
                      <div className="flex items-center text-md text-white font-medium">
                        {i18n.Tabs[0]}
                      </div>

                      {tab === "modal" ? (
                        <div
                          className="absolute left-0 bottom-[-8px] w-full h-0.5 bg-gradient-to-r
                       from-[rgba(252,192,10,1)] to-[rgba(78,186,233,1)]"
                        />
                      ) : (
                        <div className="absolute left-0 bottom-[-8px] w-full h-[1px] bg-white/50" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setTab("integrated");
                      }}
                      type="button"
                      className={classNames(
                        "!bg-none relative px-4 justify-center",
                        tab === "integrated"
                          ? ""
                          : "opacity-20 hover:opacity-70"
                      )}
                    >
                      <div className="flex items-center text-md text-white font-medium">
                        {i18n.Tabs[1]}
                      </div>
                      {tab === "integrated" ? (
                        <div
                          className="absolute left-0 bottom-[-8px] w-full h-0.5 bg-gradient-to-r
                       from-[rgba(252,192,10,1)] to-[rgba(78,186,233,1)]"
                        />
                      ) : (
                        <div className="absolute left-0 bottom-[-8px] w-full h-[1px] bg-white/50" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setTab("widget");
                      }}
                      type="button"
                      className={classNames(
                        "!bg-none relative px-4 justify-center",
                        tab === "widget" ? "" : "opacity-20 hover:opacity-70"
                      )}
                    >
                      <div className="flex items-center text-md text-white font-medium">
                        {i18n.Tabs[2]}
                      </div>
                      {tab === "widget" ? (
                        <div
                          className="absolute left-0 bottom-[-8px] w-full h-0.5 bg-gradient-to-r
                       from-[rgba(252,192,10,1)] to-[rgba(78,186,233,1)]"
                        />
                      ) : (
                        <div className="absolute left-0 bottom-[-8px] w-full h-[1px] bg-white/50" />
                      )}
                    </button>
                  </div>

                  <span className="flex justify-center text-center text-xs text-[#9D9DA6] mt-4">
                    {tab === "modal"
                      ? "TWAMM renders as a modal and takes up the whole screen."
                      : null}
                    {tab === "integrated"
                      ? "TWAMM renders as a part of your dApp."
                      : null}
                    {tab === "widget"
                      ? "TWAMM renders as part of a widget that can be placed at different positions on your dApp."
                      : null}
                  </span>

                  <div className="flex flex-grow items-center justify-center text-white/75">
                    {tab === "modal" ? (
                      <ModalTerminal
                        rpcUrl={ClusterApiUrl}
                        fakeWallet={wallet}
                        formProps={watchAllFields}
                      />
                    ) : null}
                    {tab === "integrated" ? (
                      <IntegratedTerminal
                        rpcUrl={ClusterApiUrl}
                        fakeWallet={wallet}
                        formProps={watchAllFields}
                      />
                    ) : null}
                    {tab === "widget" ? (
                      <WidgetTerminal
                        rpcUrl={ClusterApiUrl}
                        fakeWallet={wallet}
                        formProps={watchAllFields}
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CodeSnippet formConfigurator={watchAllFields} displayMode={tab} />
        <div className="w-full bg-twamm-bg mt-12">
          <Footer />
        </div>
      </div>
    </>
  );
}
