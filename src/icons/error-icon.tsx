const ErrorIcon = ({ height, width }: { height: number; width: number }) => (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 30.000000 30.000000"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      transform="translate(0.000000,30.000000) scale(0.100000,-0.100000)"
      fill="#D32F2F"
      stroke="none"
    >
      <path
        d="M95 286 c-102 -44 -122 -172 -40 -245 64 -56 147 -50 204 14 53 61
        50 143 -7 198 -48 46 -102 57 -157 33z m115 -31 c79 -41 79 -169 0 -210 -84
        -43 -180 13 -180 105 0 92 96 148 180 105z"
      />
      <path
        d="M140 180 c0 -22 5 -40 10 -40 6 0 10 18 10 40 0 22 -4 40 -10 40 -5
            0 -10 -18 -10 -40z"
      />
      <path
        d="M140 90 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
            -10 -4 -10 -10z"
      />
    </g>
  </svg>
);

export default ErrorIcon;
