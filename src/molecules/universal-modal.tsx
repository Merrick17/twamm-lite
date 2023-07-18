import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';

import CloseIcon from 'src/icons/close-icon';
import LeftArrowIcon from '../icons/left-arrow-icon';

export interface Ref {
  close: () => void;
  isOpened: boolean;
  open: () => void;
}

export interface Props {
  children: ReactNode;
  onClose?: () => void;
  setOpen: (arg0: boolean) => void;
  title?: string;
  arrow: boolean;
  universal?: boolean;
}

export default ({
  children,
  onClose,
  setOpen,
  title,
  arrow,
  universal,
}: Props) => {
  const handleClose = useCallback(() => {
    setOpen(false);
    if (onClose) onClose();
  }, [onClose, setOpen]);

  const ContainerStyle = useMemo(() => {
    let style: string = '';
    if (arrow) {
      style = `absolute z-50 w-full h-full bg-twamm-bg rounded-lg overflow-hidden`;
    }
    if (!arrow) {
      style = `absolute z-50 w-full h-full top-0 left-0  overflow-hidden bg-black/50 flex items-center px-4`;
    }

    if (universal) {
      style = `fixed h-screen w-screen top-0 left-0 flex justify-center items-center overflow-hidden bg-black/50 z-[1000] px-2 md:px-0`;
    }

    return style;
  }, [arrow, universal]);

  return (
    <div className={ContainerStyle}>
      {arrow ? (
        <div className="flex flex-col h-full w-full py-4 px-2">
          <div className="flex w-full justify-between">
            <div
              className="text-black fill-current w-6 h-6 cursor-pointer"
              onClick={handleClose}
            >
              <LeftArrowIcon width={24} height={24} />
            </div>

            {title && <div className="text-black">{title}</div>}

            <div className=" w-6 h-6" />
          </div>
          {children}
        </div>
      ) : (
        <div
          className={
            universal
              ? 'max-w-md w-full rounded-xl flex flex-col bg-twamm-bg shadow-xl pb-5 max-h-[100%] overflow-y-scroll webkit-scrollbar'
              : 'w-full rounded-xl flex flex-col bg-twamm-bg shadow-xl pb-5 max-h-[100%] overflow-y-scroll webkit-scrollbar'
          }
        >
          <div className="flex justify-end items-center p-4">
            <div
              className="text-black fill-current cursor-pointer"
              onClick={handleClose}
            >
              <CloseIcon width={14} height={14} />
            </div>
          </div>
          {children}
        </div>
      )}
    </div>
  );
};
