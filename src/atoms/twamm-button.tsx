import classNames from "classnames";
import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ITwammButton {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  highlighted?: boolean;
  size?: "sm" | "md" | "lg";
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  bgClass?: string;
  rounded?: string;
}

const TwammButton = React.forwardRef(
  (
    {
      onClick,
      disabled,
      children,
      highlighted,
      className = "",
      size = "md",
      type,
      bgClass,
      rounded,
    }: ITwammButton,
    ref: React.ForwardedRef<any>
  ) => {
    const contentClass = (() => {
      if (size === "sm") {
        return "px-4 py-2.5 text-xs";
      }
      if (size === "md") {
        return "px-4 py-3 text-sm font-semibold";
      }
      if (size === "lg") {
        return "p-5 text-md font-semibold";
      }
      return null;
    })();
    const background = bgClass || "text-white bg-[#191B1F]";
    return (
      <button
        // eslint-disable-next-line react/button-has-type
        type={type}
        ref={ref}
        className={classNames({
          relative: true,
          "twamm-gradient": highlighted,
          "opacity-50 cursor-not-allowed": disabled,
          [background]: true,
          [className]: true,
          [rounded || "rounded-xl"]: true,
        })}
        disabled={disabled}
        onClick={onClick}
      >
        <div className={`${contentClass} h-full w-full leading-none`}>
          {children}
        </div>
      </button>
    );
  }
);

TwammButton.displayName = "TwammButton";

export default TwammButton;
