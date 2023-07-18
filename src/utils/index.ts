import { useEffect } from "react";

type Options = Partial<{ max: number }>;

export const isFloat = (n: any) => !Number.isNaN(n) && n % 1 !== 0;

export function useDebouncedEffect(fn: Function, deps: any[], time: number) {
  useEffect(() => {
    const timeout = setTimeout(fn, time);
    return () => {
      clearTimeout(timeout);
    };
  }, [deps, fn, time]);
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export const expirationTimeToInterval = (
  expirationTime: number | undefined,
  tif: number
) => {
  if (!expirationTime) return tif;

  let delta = expirationTime * 1e3 - Date.now();
  delta = delta <= 0 ? 0 : Number((delta / 1e3).toFixed(0));

  return delta;
};

const userLocale =
  // eslint-disable-next-line no-nested-ternary
  typeof window !== "undefined"
    ? navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language
    : "en-US";

export const numberFormatter = new Intl.NumberFormat(userLocale, {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 9,
});

export const formatNumber = {
  format: (val?: number, precision?: number) => {
    if (!val && val !== 0) {
      return "--";
    }

    if (precision !== undefined) {
      return val.toFixed(precision);
    }
    return numberFormatter.format(val);
  },
};

export const detectedSeparator = formatNumber.format(1.1).substring(1, 2);

export const MAX_INPUT_LIMIT = 100_000_000_000_000;

const prepareIntervals = (value: number) => {
  const getIntervalValues = (
    interval: number,
    length: number
  ): [number, number] => {
    const amount = parseInt(String(interval / length), 10);
    const leftover = interval - amount * length;

    return [amount, leftover];
  };

  if (value === -1) return "no delay";

  const [w, leftD] = getIntervalValues(value, 604800);
  const [d, leftH] = getIntervalValues(leftD, 86400);
  const [h, leftM] = getIntervalValues(leftH, 3600);
  const [m, s] = getIntervalValues(leftM, 60);

  return [w, d, h, m, s];
};

const populateIntervals = (intervals: number[], options?: Options) => {
  const { max = 2 } = options ?? {};
  const formatted: string[] = [];
  const literals = ["w", "d", "h", "m", "s"];

  intervals.forEach((part, i) => {
    if (part && formatted.length <= max - 1)
      formatted.push(`${part}${literals[i]}`);
  });

  return formatted.join(" ");
};

export const formatIntervalTillM = (value: number) => {
  const parts = prepareIntervals(value);

  if (!Array.isArray(parts)) return parts;

  const [w, d, h, m, s] = parts;

  return populateIntervals([w, d, h, s > 30 ? m + 1 : m, 0]);
};

export const formatInterval = formatIntervalTillM;
