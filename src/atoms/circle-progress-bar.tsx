export default ({
  percentage,
  circleWidth,
  radius,
  strokeWidth,
}: {
  percentage: number;
  circleWidth: string;
  radius: number;
  strokeWidth: string;
}) => {
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * percentage) / 100;

  return (
    <svg
      width={circleWidth}
      height={circleWidth}
      viewBox={`0 0 ${circleWidth} ${circleWidth}`}
    >
      <circle
        cx={Number(circleWidth) / 2}
        cy={Number(circleWidth) / 2}
        strokeWidth={strokeWidth}
        r={radius}
        className="fill-none stroke-slate-400"
      />
      <circle
        cx={Number(circleWidth) / 2}
        cy={Number(circleWidth) / 2}
        strokeWidth={strokeWidth}
        r={radius}
        className="fill-none stroke-sky-400"
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
        transform={`rotate(-90) ${Number(circleWidth) / 2} ${
          Number(circleWidth) / 2
        }`}
      />
    </svg>
  );
};
