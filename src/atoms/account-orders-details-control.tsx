import i18n from "src/i18n/en.json";

export interface Props {
  expired: boolean;
  inactive: boolean;
  onClick: () => void;
}

export default ({ expired, inactive, onClick }: Props) => {
  const actionName =
    expired || inactive
      ? i18n.OrderControlsWithdrawOrder
      : i18n.OrderControlsCancelOrder;

  return (
    <div
      className="capitalize flex justify-center border border-blue-200 py-2 rounded-md text-white/70 text-sm cursor-pointer"
      onClick={onClick}
    >
      {actionName}
    </div>
  );
};
