import React from 'react';

const LPLogo: React.FC<{ width?: number; height?: number }> = ({
  width = 24,
  height = 24,
}) => (
  <img
    src="https://twamm-lite-merrick17.vercel.app/logo.png"
    width={width}
    height={height}
    alt="LP Finance"
    loading="lazy"
  />
);

export default LPLogo;
