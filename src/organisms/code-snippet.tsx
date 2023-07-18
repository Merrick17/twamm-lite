import { useEffect, useState, useMemo } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import classNames from "classnames";

import { Init, FormConfigurator } from "src/types";

const USE_WALLET_SNIPPET = `import { useWallet } from '@solana/wallet-adapter-react';
const { wallet } = useWallet();
`;

function addInlinesToCode(code: string, insertLines: string) {
  let lines = code.split("\n");
  lines = [
    ...lines.slice(0, lines.length - 1),
    insertLines,
    ...lines.slice(lines.length - 1, lines.length),
  ];

  return lines.join("\n");
}

export default function CodeSnippet({
  formConfigurator,
  displayMode,
}: {
  formConfigurator: FormConfigurator;
  displayMode: Init["displayMode"];
}) {
  const DISPLAY_MODE_VALUES = useMemo(() => {
    if (displayMode === "modal") return {};
    if (displayMode === "integrated")
      return {
        displayMode: "integrated",
        integratedTargetId: "integrated-terminal",
      };
    if (displayMode === "widget") return { displayMode: "widget" };
    return null;
  }, [displayMode]);

  const formPropsToFormat = {
    ...(formConfigurator.feeAccount
      ? { feeAccount: formConfigurator.feeAccount }
      : undefined),
    ...(formConfigurator.feeBps
      ? { feeBps: formConfigurator.feeBps }
      : undefined),
    ...(formConfigurator.platformFeeAccount
      ? { platformFeeAccount: formConfigurator.platformFeeAccount }
      : undefined),
    ...(formConfigurator.useJupiter
      ? { useJupiter: formConfigurator.useJupiter }
      : undefined),
  };

  const valuesToFormat = {
    ...DISPLAY_MODE_VALUES,
    endpoint: "https://api.mainnet-beta.solana.com",
    ...(Object.keys(formPropsToFormat).length > 0
      ? { formProps: formPropsToFormat }
      : undefined),
  };

  const formPropsSnippet =
    Object.keys(valuesToFormat).length > 0
      ? JSON.stringify(valuesToFormat, null, 4)
      : "";

  const INIT_SNIPPET = `window.Twamm.init(${formPropsSnippet});`;

  let snippet = formConfigurator.useWalletPassthrough
    ? `${USE_WALLET_SNIPPET}${INIT_SNIPPET}`
    : INIT_SNIPPET;

  if (formConfigurator.useWalletPassthrough) {
    snippet = addInlinesToCode(snippet, `\t"passThroughWallet": wallet,`);
  }

  const [isCopied, setIsCopied] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [isCopied]);

  function copyToClipboard() {
    if (isCopied) return;
    navigator.clipboard.writeText(snippet);
    setIsCopied(true);
  }

  return (
    <div className="flex flex-col items-center justify-center mt-12">
      <div className="relative w-full max-w-3xl overflow-hidden px-4 md:px-0">
        <p className="text-white self-start pb-2 font-semibold">Code snippet</p>
        <button
          type="submit"
          className={classNames(
            `absolute top-0 right-4 md:top-10 md:right-2 
            text-xs text-white border rounded-xl px-2 py-1 opacity-50 hover:opacity-100`,
            isCopied ? "opacity-100 cursor-wait" : ""
          )}
          onClick={copyToClipboard}
        >
          {isCopied ? "Copied!" : "Copy to clipboard"}
        </button>

        <SyntaxHighlighter
          language="typescript"
          showLineNumbers
          style={vs2015}
          className="text-sm"
        >
          {snippet}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
