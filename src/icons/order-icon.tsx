const OrdersIcon = ({ height, width }: { height: number; width: number }) => (
  <div className="flex items-center text-white/30 rounded-full fill-current">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        d="M2 7h18m-4-5l5 5l-5 5m6 5H4m4-5l-5 5l5 5"
      />
    </svg>
  </div>
);

export default OrdersIcon;
