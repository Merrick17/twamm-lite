const InfoIcon = ({ height, width }: { height: number; width: number }) => (
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
      fill="#0288D1"
      stroke="none"
    >
      <path
        d="M106 290 c-40 -12 -73 -46 -92 -95 -53 -141 143 -260 239 -145 74 88
            50 191 -55 235 -41 17 -50 17 -92 5z m125 -48 c27 -24 33 -37 37 -84 4 -50 2
            -58 -25 -88 -25 -28 -38 -34 -85 -38 -50 -4 -58 -2 -88 25 -28 25 -34 38 -38
            84 -3 45 0 59 18 82 28 35 52 46 107 46 33 1 50 -5 74 -27z"
      />
      <path
        d="M140 210 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
            -10 -4 -10 -10z"
      />
      <path
        d="M140 120 c0 -22 5 -40 10 -40 6 0 10 18 10 40 0 22 -4 40 -10 40 -5
            0 -10 -18 -10 -40z"
      />
    </g>
  </svg>
);

export default InfoIcon;
