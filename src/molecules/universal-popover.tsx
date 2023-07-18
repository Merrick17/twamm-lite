import type { ReactNode } from "react";
import { forwardRef, memo, useState, useImperativeHandle } from "react";

import UniversalModal from "./universal-modal";

export interface Ref {
  close: () => void;
  isOpened: boolean;
  open: () => void;
}

export interface Props {
  children: ReactNode;
  onClose?: () => void;
  title?: string;
  arrow: boolean;
  universal?: boolean;
}

interface ModalProps extends Props {
  setOpen: (arg0: boolean) => void;
  title?: string;
  arrow: boolean;
  universal?: boolean;
}

const Modal = memo(
  ({ children, onClose, setOpen, title, arrow, universal }: ModalProps) => (
    <UniversalModal
      onClose={onClose}
      setOpen={setOpen}
      title={title}
      arrow={arrow}
      universal={universal}
    >
      {children}
    </UniversalModal>
  )
);

export default forwardRef(
  ({ children, onClose, title, arrow, universal }: Props, ref) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      close() {
        setOpen(false);
      },
      isOpened: open,
      open() {
        setOpen(true);
      },
    }));
    return (
      <>
        {!open && null}
        {open && (
          <Modal
            onClose={onClose}
            setOpen={setOpen}
            title={title}
            arrow={arrow}
            universal={universal}
          >
            {children}
          </Modal>
        )}
      </>
    );
  }
);
