import "tailwindcss/tailwind.css";
import { CSSProperties, useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";

import LPLogo from "src/icons/lp-logo";
import { Init } from "./types";
import packageJson from "../package.json";

const containerId = "twamm-terminal";
const bundleName = `main-${packageJson.version}`;

const scriptDomain =
  (() => {
    if (typeof window === "undefined") return;

    const url: string = (document.currentScript as HTMLScriptElement)?.src;

    if (url) {
      // eslint-disable-next-line consistent-return
      return new URL(url).origin;
    }
  })() || "https://twap.so/";

async function loadRemote(
  id: string,
  href: string,
  type: "text/javascript" | "stylesheet"
) {
  return new Promise((res, rej) => {
    const existing = document.getElementById(id) as HTMLLinkElement | null;

    if (existing) {
      res({});
    } else {
      const el: HTMLScriptElement | HTMLLinkElement =
        type === "text/javascript"
          ? document.createElement("script")
          : document.createElement("link");

      el.id = id;
      el.onload = res;
      el.onerror = rej;
      if (el instanceof HTMLScriptElement) {
        el.type = "text/javascript";
        el.src = href;
      } else if (el instanceof HTMLLinkElement) {
        el.rel = "stylesheet";
        el.href = href;
      }

      document.head.append(el);
    }
  });
}

async function loadTwamm() {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  try {
    await Promise.all([
      loadRemote(
        "twamm-load-script-app",
        `${scriptDomain}/${bundleName}-app.js`,
        "text/javascript"
      ),
      loadRemote(
        "twamm-load-styles-tailwind",
        `${scriptDomain}/${bundleName}-Tailwind.css`,
        "stylesheet"
      ),
      loadRemote(
        "twamm-load-styles-preflight",
        `${scriptDomain}/scoped-preflight.css`,
        "stylesheet"
      ),
    ]);
    loadRemote(
      "twamm-load-styles-twamm",
      `${scriptDomain}/${bundleName}-Twamm.css`,
      "stylesheet"
    );
  } catch (error) {
    throw new Error(`Error loading twamm terminal: ${error}`);
  }
}

const defaultStyles: CSSProperties = {
  zIndex: 50,
};

const RenderLoadableTwamm = (props: Init) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    loadTwamm();

    let intervalId: NodeJS.Timer;
    if (!loaded) {
      intervalId = setInterval(() => {
        const instance = (window as any).TwammRenderer?.RenderTwamm;
        if (instance) {
          setLoaded(true);
        }
      }, 50);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [loaded]);

  const EmptyJSX = () => null;

  const RenderTwamm: (props: any) => JSX.Element = useMemo(() => {
    if (loaded) {
      return (window as any).TwammRenderer.RenderTwamm;
    }
    return EmptyJSX;
  }, [loaded]);

  return <RenderTwamm {...props} scriptDomain={scriptDomain} />;
};

const RenderShell = (props: Init) => {
  const { displayMode, containerStyles, containerClassName } = props;

  const displayClassName: any = useMemo(() => {
    if (!displayMode || displayMode === "modal") {
      return "fixed top-0 w-screen h-screen flex items-center justify-center bg-black/50";
    }
    if (displayMode === "integrated" || displayMode === "widget") {
      return "flex items-center justify-center w-full h-full";
    }
    return null;
  }, [displayMode]);

  const contentClassName: any = useMemo(() => {
    if (!displayMode || displayMode === "modal") {
      return `flex flex-col h-screen w-screen max-h-[100vh] md:max-h-[620px]
       max-w-[400px] overflow-auto text-black relative bg-twamm-bg rounded-lg webkit-scrollbar ${
         containerClassName || ""
       }`;
    }
    if (displayMode === "integrated" || displayMode === "widget") {
      return "flex flex-col h-full w-full overflow-auto text-black relative webkit-scrollbar";
    }
    return null;
  }, [containerClassName, displayMode]);

  const onClose = () => {
    if (window.Twamm) {
      window.Twamm.close();
    }
  };

  return (
    <div className={displayClassName}>
      {/* eslint-disable @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Poppins&display=swap"
        rel="stylesheet"
      />
      <div
        style={{ ...defaultStyles, ...containerStyles }}
        className={contentClassName}
      >
        <RenderLoadableTwamm {...props} />
      </div>
      {!displayMode || displayMode === "modal" ? (
        <div
          onClick={onClose}
          className="absolute w-screen h-screen top-0 left-0"
        />
      ) : null}
    </div>
  );
};

export interface Classes {
  widgetContainerClassName: string;
  widgetLogoSize: number;
  containerClassName?: string | undefined;
  contentClassName?: string | undefined;
}

const RenderWidgetShell = (props: Init) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const classes: Classes = useMemo(() => {
    const size = props.widgetStyle?.size || "default";

    let result;

    if (
      !props.widgetStyle?.position ||
      props.widgetStyle?.position === "bottom-right"
    ) {
      result = {
        containerClassName: "bottom-6 right-6",
        contentClassName:
          size === "default"
            ? "bottom-[60px] -right-3"
            : "bottom-[44px] -right-4",
      };
    }
    if (props.widgetStyle?.position === "bottom-left") {
      result = {
        containerClassName: "bottom-6 left-6",
        contentClassName:
          size === "default"
            ? "bottom-[60px] -left-3"
            : "bottom-[44px] -left-4",
      };
    }
    if (props.widgetStyle?.position === "top-left") {
      result = {
        containerClassName: "top-6 left-6",
        contentClassName:
          size === "default" ? "top-[60px] -left-3" : "top-[44px] -left-4",
      };
    }
    if (props.widgetStyle?.position === "top-right") {
      result = {
        containerClassName: "top-6 right-6",
        contentClassName:
          size === "default" ? "top-[60px] -right-3" : "top-[44px] -right-4",
      };
    }

    const widgetContainerClassName: string =
      size === "default" ? "h-14 w-14" : "h-11 w-11";

    return {
      ...result,
      widgetContainerClassName,
      widgetLogoSize: size === "default" ? 30 : 25,
    };
  }, [props.widgetStyle?.position, props.widgetStyle?.size]);

  return (
    <div className={`fixed ${classes.containerClassName}`}>
      <div
        className={`${classes.widgetContainerClassName} rounded-full bg-black flex items-center justify-center cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <LPLogo
          width={classes.widgetLogoSize}
          height={classes.widgetLogoSize}
        />
      </div>

      <div
        id="integrated-terminal"
        className={`absolute overflow-auto pb-2 ${
          classes.contentClassName
        } flex flex-col w-[90vw] h-[600px] max-w-[390px] max-h-[82vh] webkit-scrollbar 
        rounded-2xl bg-twamm-bg transition-opacity duration-300 shadow-2xl ${
          !isOpen ? "h-0 opacity-0" : "opacity-100"
        }`}
      >
        <RenderLoadableTwamm {...props} />
      </div>
    </div>
  );
};

async function init(props: Init) {
  const { passThroughWallet, integratedTargetId, ...restProps } = props;

  const targetDiv = document.createElement("div");
  const instanceExist = document.getElementById(containerId);

  if (instanceExist) {
    window.Twamm._instance = null;
    instanceExist?.remove();
  }

  targetDiv.id = containerId;
  targetDiv.classList.add("w-full");
  targetDiv.classList.add("h-full");

  if (restProps.displayMode === "integrated") {
    const target = document.getElementById(integratedTargetId!);
    if (!target) {
      throw new Error(
        `Twamm Terminal: document.getElementById cannot find ${integratedTargetId}`
      );
    }

    target?.appendChild(targetDiv);
  } else {
    document.body.appendChild(targetDiv);
  }

  let element;
  if (restProps.displayMode === "widget") {
    element = <RenderWidgetShell {...props} />;
  } else {
    element = <RenderShell {...props} />;
  }
  const root = createRoot(targetDiv);
  root.render(element);
  window.Twamm.root = root;
  window.Twamm._instance = element;
  window.Twamm.passThroughWallet = passThroughWallet;
}

const attributes = (document.currentScript as HTMLScriptElement)?.attributes;

if (typeof window !== "undefined") {
  document.onreadystatechange = () => {
    const loadComplete = document.readyState === "complete";
    const shouldPreload = Boolean(attributes.getNamedItem("data-preload"));

    if (loadComplete && shouldPreload) {
      setTimeout(() => {
        loadTwamm().catch((error) => {
          throw new Error(`Error pre-loading twamm terminal: ${error}`);
        });
      }, 2000);
    }
  };
}

const resume = () => {
  const instanceExist = document.getElementById(containerId);
  if (instanceExist) {
    instanceExist.style.display = "block";
  }
};

const close = () => {
  const targetDiv = document.getElementById(containerId);
  if (targetDiv) {
    targetDiv.style.display = "none";
  }
};

export { init, resume, close };
