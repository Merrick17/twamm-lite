const UpIcon = ({
  height,
  width,
  color,
}: {
  height: number;
  width: number;
  color: string;
}) => (
  <div className="flex items-center  rounded-full fill-current">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 48 48"
    >
      <path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
        d="M13 30L25 18L37 30"
      />
    </svg>
  </div>
);

export default UpIcon;
