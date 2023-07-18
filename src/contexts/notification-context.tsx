import type { ReactElement } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";

export interface Props {
  maxSnack?: number;
  children: ReactElement;
}

export { useSnackbar };

export const NotificationProvider = ({ maxSnack = 3, children }: Props) => (
  <SnackbarProvider autoHideDuration={5000} maxSnack={maxSnack}>
    {children}
  </SnackbarProvider>
);
