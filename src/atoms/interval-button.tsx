import type { SyntheticEvent } from 'react';

interface Props {
  disabled?: boolean;
  onClick: (e: SyntheticEvent<HTMLElement>) => void;
  selected?: boolean;
  text: string;
  value?: number;
}

const SelectableButton = (props: Omit<Props, 'selected'>) => (
  <button
    type="button"
    data-interval={props.value}
    key={props.value}
    onClick={props.onClick}
    disabled={props.disabled}
    className="px-1 py-0.5 h-full border rounded-sm border-white/10 bg-black/10 text-black/70 text-[0.85rem] fill-current cursor-pointer"
  >
    {props.text}
  </button>
);

const Button = (props: Omit<Props, 'selected'>) => (
  <button
    type="button"
    data-interval={props.value}
    key={props.value}
    onClick={props.onClick}
    disabled={props.disabled}
    className="px-1 py-0.5 h-full border rounded-sm border-white/5 bg-white text-black/40 text-[0.85rem] fill-current cursor-pointer"
  >
    {props.text}
  </button>
);

export default (props: Props) => {
  if (props.selected)
    return (
      <SelectableButton
        value={props.value}
        disabled
        onClick={props.onClick}
        text={props.text}
      />
    );

  return (
    <Button
      disabled={props.disabled}
      onClick={props.onClick}
      text={props.text}
      value={props.value}
    />
  );
};
