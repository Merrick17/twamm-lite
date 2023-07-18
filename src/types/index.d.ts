import { CSSProperties } from "react";
import { Root } from "react-dom/client";

import { Wallet } from "@solana/wallet-adapter-react";

declare global {
  interface Window {
    Twamm: TwammTerminal;
  }
}
export declare type PlatformFeeAndAccounts = {
  feeBps: number;
  feeAccounts: Map<string, PublicKey>;
};

export type WidgetPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

export type WidgetSize = "sm" | "default";

export type DefaultExplorer =
  | "Solana Explorer"
  | "Solscan"
  | "Solana Beach"
  | "SolanaFM";

export type TokenRegistry = {
  [key: string]: string[];
};

export interface FormProps {
  feeAccount: string;
  feeBps: string;
  platformFeeAccount: string;
  supportedToken: TokenRegistry;
  useJupiter: boolean;
}

export interface Init {
  endpoint: string;
  formProps: FormProps;
  displayMode?: "modal" | "integrated" | "widget";
  integratedTargetId?: string;
  widgetStyle?: {
    position?: WidgetPosition;
    size?: WidgetSize;
  };
  containerStyles?: CSSProperties;
  containerClassName?: string;
  passThroughWallet?: Wallet | null;
  scriptDomain?: string;
}

export interface TwammTerminal {
  _instance: React.ReactNode;
  init: (props: Init) => void;
  resume: () => void;
  close: () => void;
  root: Root | null;
  passThroughWallet: Init["passThroughWallet"];
  onSwapError: Init["onSwapError"];
  onSuccess: Init["onSuccess"];
}

export interface FormConfigurator {
  feeAccount: string;
  feeBps: string;
  platformFeeAccount: string;
  supportedToken: TokenRegistry;
  useJupiter: boolean;
  useWalletPassthrough: boolean;
}
