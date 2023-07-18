import M from "easy-maybe/lib";

import type { MaybeTokens } from "src/hooks/use-tokens-by-mint";
import QuestionMark from "src/icons/question-mark";

const TokenImage = ({ data }: { data: MaybeTokens[0] }) => {
  if (data instanceof Error) return <QuestionMark />;

  return <img alt={data?.symbol} src={data?.imageSmall} loading="lazy" />;
};

const TokenSymbol = ({ data }: { data: MaybeTokens[0] }) => (
  <span>{data instanceof Error ? "Unknown" : data.symbol.toUpperCase()}</span>
);

export default ({
  data,
  displayDirection,
  side,
}: {
  data: any;
  displayDirection?: boolean;
  side?: OrderTypeStruct;
}) => {
  const tokens = M.withDefault(undefined, M.of(data));

  if (!tokens) {
    return (
      <div className="h-3.5 bg-gray-500 rounded-full w-20 animate-pulse" />
    );
  }

  const [a, b] = tokens;

  const displayTokens = side?.buy && displayDirection ? [b, a] : [a, b];

  const direction = !displayDirection ? "-" : "→";
  return (
    <div className="flex flex-row items-center gap-x-2">
      <div className="relative flex flex-row">
        <div className="z-10 h-7 w-7">
          <TokenImage data={displayTokens[0]} />
        </div>

        <div className="absolute right-[-20px] z-5 h-7 w-7">
          <TokenImage data={displayTokens[1]} />
        </div>
      </div>
      <div className="pl-5">
        <TokenSymbol data={displayTokens[0]} />
        {direction}
        <TokenSymbol data={displayTokens[1]} />
      </div>
    </div>
  );
};
