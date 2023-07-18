import { ReactNode } from "react";

export default function ChameleonText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const baseClass = `text-transparent bg-clip-text bg-gradient-to-r from-[#fff] to-[#B4B3B3] 
  animate-hue`;
  const classes = [baseClass, className].join(" ");
  return <span className={classes}>{children}</span>;
}
