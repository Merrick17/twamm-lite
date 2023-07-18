import type { ReactNode } from "react";
import { useMemo } from "react";
import classNames from "classnames";

import ErrorIcon from "src/icons/error-icon";
import InfoIcon from "src/icons/info-icon";
import WarningIcon from "src/icons/warning-icon";
import SuccessIcon from "src/icons/success-icon";

export default ({
  severity,
  children,
}: {
  severity: string;
  children: ReactNode;
}) => {
  const icon = useMemo(() => {
    switch (severity) {
      case "error":
        return <ErrorIcon height={22} width={22} />;
      case "info":
        return <InfoIcon height={22} width={22} />;
      case "warning":
        return <WarningIcon height={22} width={22} />;
      case "success":
        return <SuccessIcon height={22} width={22} />;
      default:
        return null;
    }
  }, [severity]);

  return (
    <div
      className={classNames(
        "w-full rounded-md px-4 py-2",
        severity === "error" ? "bg-[#fdeded]" : null,
        severity === "info" ? "bg-[#e5f6fd]" : null,
        severity === "warning" ? "bg-[#FFF4E5]" : null,
        severity === "success" ? "bg-[#cdf3cd]" : null
      )}
      role="alert"
    >
      <div className="flex justify-center items-center gap-3">
        <div className="py-1">{icon}</div>
        <div>
          <p className="text-sm text-gray-600 font-medium">{children}</p>
        </div>
      </div>
    </div>
  );
};
