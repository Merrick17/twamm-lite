import QuestionMark from "src/icons/question-mark";
import CancelIcon from "src/icons/cancel-icon";

export interface TokenIconProps {
  alt?: string;
  src?: string;
  width?: number;
  height?: number;
  disabled?: boolean;
}

const TokenIcon = ({ alt, src, width, height, disabled }: TokenIconProps) => (
  <div
    className="text-xs flex items-center justify-center  rounded-full overflow-hidden"
    style={{ width, height }}
  >
    {src && alt ? (
      <img src={src} alt={alt} height={28} width={28} loading="lazy" />
    ) : (
      <>
        {disabled && <CancelIcon height={28} width={28} />}
        {!disabled && <QuestionMark />}
      </>
    )}
  </div>
);

export default TokenIcon;
