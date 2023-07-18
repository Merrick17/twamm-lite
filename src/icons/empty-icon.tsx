import type { FC } from 'react';

const EmptyIcon: FC<React.SVGAttributes<SVGElement>> = ({
  width = 20,
  height = 20,
}) => (
  <div className="flex items-center text-black rounded-full fill-current">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M18 2H6v6h.01L6 8.01L10 12l-4
       4l.01.01H6V22h12v-5.99h-.01L18 16l-4-4l4-3.99l-.01-.01H18V2zm-2
        14.5V20H8v-3.5l4-4l4 4zm0-9l-4 4l-4-4V4h8v3.5z"
      />
    </svg>
  </div>
);

export default EmptyIcon;
