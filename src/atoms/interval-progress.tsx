import React, { useEffect, useState } from "react";

import CircleProgressBar from "src/atoms/circle-progress-bar";

const INTERVAL = 1500;

const calcValue = (a: number, b: number) =>
  b ? Math.round((a / b) * 100) : -1;

export default ({
  interval,
  refresh = false,
}: {
  interval: number;
  refresh?: boolean;
}) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const updateInterval = () => {
      if (counter < interval) {
        setCounter(counter + INTERVAL);
      } else {
        setCounter(0);
      }
    };
    const i = setTimeout(updateInterval, INTERVAL);

    if (refresh) setCounter(0);

    return () => {
      if (i) clearTimeout(i);
    };
  }, [counter, interval, refresh]);

  return (
    <CircleProgressBar
      percentage={calcValue(counter, interval)}
      circleWidth="40"
      radius={10}
      strokeWidth="2px"
    />
  );
};
